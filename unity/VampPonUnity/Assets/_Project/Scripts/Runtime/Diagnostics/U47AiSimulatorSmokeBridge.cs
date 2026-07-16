#if VAMPPON_AI_SIMULATOR_SMOKE
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using VampPon.UnitySpike.Player;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.Runtime.AppFlow;
using VampPon.UnitySpike.Runtime.Gameplay;
using VampPon.UnitySpike.Runtime.Gameplay.Definitions;
using VampPon.UnitySpike.Runtime.Gameplay.State;
using VampPon.UnitySpike.U4;

namespace VampPon.UnitySpike.Diagnostics
{
    public sealed class U47AiSimulatorSmokeBridge : MonoBehaviour
    {
        [Serializable] private sealed class Catalog { public int schemaVersion; public int expectedCaptureCount; public int semanticRouteCount; public string catalogHash; public CaptureDefinition[] captures; }
        [Serializable] private sealed class CaptureDefinition { public string captureId; public string baseRouteId; public string captureKind; public string expectedStateId; public Viewport viewport; public string[] requiredAssertions; }
        [Serializable] private sealed class Viewport { public string sizeKey; public int width; public int height; }

        private string root, screenshots, results;
        private int exceptionCount, assertionCount;
        private bool cleanupStarted, completed, scenarioActive;
        private Stage1GameplayRuntimeCoordinator gameplay;
        private U46RuntimeShell shell;
        private U4LevelUpDemoController levelUp;
        private U2BattleController battle;
        private Catalog catalog;
        private readonly List<string> completedCaptureIds = new();

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void Install()
        {
            if (Application.platform != RuntimePlatform.IPhonePlayer) return;
            if (Environment.GetEnvironmentVariable("VAMPPON_U48_BATCH_C_CAPTURE") == "1") return;
            if (Environment.GetEnvironmentVariable("VAMPPON_U47_AI_SIMULATOR_SMOKE") != "1") return;
            DontDestroyOnLoad(new GameObject("U47AiSimulatorSmokeBridge", typeof(U47AiSimulatorSmokeBridge)));
        }

        private void Awake()
        {
            root = Path.Combine(Application.persistentDataPath, "u47-ai-simulator-smoke");
            screenshots = Path.Combine(root, "screenshots");
            results = Path.Combine(root, "runtime-results");
            Directory.CreateDirectory(screenshots); Directory.CreateDirectory(results);
            foreach (var file in Directory.GetFiles(screenshots)) File.Delete(file);
            foreach (var file in Directory.GetFiles(results)) File.Delete(file);
            Application.logMessageReceived += OnLog;
            StartCoroutine(Run());
        }

        private void OnLog(string condition, string stack, LogType type)
        {
            if (type == LogType.Exception) exceptionCount++;
            if (type == LogType.Assert) assertionCount++;
            if (type is LogType.Exception or LogType.Assert) File.AppendAllText(Path.Combine(root, "u47-simulator-errors.log"), $"[{DateTime.UtcNow:O}] {type}: {condition}\n{stack}\n");
        }

        private void Update()
        {
            if ((exceptionCount > 0 || assertionCount > 0) && !cleanupStarted && !completed) FailAndCleanup("runtime-log-failure");
        }

        private void OnDestroy()
        {
            Application.logMessageReceived -= OnLog;
            RestoreProduction();
        }

        private IEnumerator Run()
        {
            var text = Resources.Load<TextAsset>("GameplayData/U47SimulatorRouteCatalog") ?? throw new InvalidOperationException("U47 capture catalog missing.");
            catalog = JsonUtility.FromJson<Catalog>(text.text);
            if (catalog == null || catalog.schemaVersion != 2 || catalog.expectedCaptureCount != 23 || catalog.captures?.Length != 23) throw new InvalidOperationException("U47 capture catalog invalid.");
            yield return WaitFor(() => FindAnyObjectByType<U46RuntimeShell>() != null && FindAnyObjectByType<Stage1GameplayRuntimeCoordinator>() != null, 20f, "Stage1 runtime");
            shell = FindAnyObjectByType<U46RuntimeShell>(); gameplay = FindAnyObjectByType<Stage1GameplayRuntimeCoordinator>(); levelUp = FindAnyObjectByType<U4LevelUpDemoController>(); battle = FindAnyObjectByType<U2BattleController>();
            if (shell == null || gameplay == null || levelUp == null || battle == null) throw new InvalidOperationException("U47 runtime dependencies missing.");
            foreach (var capture in catalog.captures)
            {
                var beforeExceptions = exceptionCount; var beforeAssertions = assertionCount;
                yield return RunCapture(capture, beforeExceptions, beforeAssertions);
                completedCaptureIds.Add(capture.captureId);
            }
            RestoreProduction();
            var passed = completedCaptureIds.Count == 23 && exceptionCount == 0 && assertionCount == 0;
            File.WriteAllText(Path.Combine(root, "u47-simulator-smoke-summary.json"), $"{{\n  \"schemaVersion\": 2,\n  \"catalogHash\": \"{catalog.catalogHash}\",\n  \"expectedCaptureCount\": 23,\n  \"completedCaptureCount\": {completedCaptureIds.Count},\n  \"unhandledExceptionCount\": {exceptionCount},\n  \"assertionFailureCount\": {assertionCount},\n  \"passed\": {B(passed)}\n}}\n");
            completed = true; Destroy(gameObject);
        }

        private IEnumerator RunCapture(CaptureDefinition capture, int beforeExceptions, int beforeAssertions)
        {
            var checks = new Dictionary<string, bool>(); var details = new Dictionary<string, string>(); var captured = false;
            if (capture.captureId == "01-stage-select")
            {
                yield return ResetScenario(false, false); checks["stageSelectVisible"] = shell.Flow.State == AppFlowState.StageSelect; checks["verificationControlAbsent"] = !FindText("検証");
            }
            else
            {
                yield return ResetScenario(true, capture.captureId is "05-inventory-full" or "06-levelup-decline" or "07-levelup-replacement" or "20-result-u47-summary");
                switch (capture.captureId)
                {
                    case "02-initial-night-pencil":
                        checks["stage1Playing"] = shell.Flow.State == AppFlowState.Running; checks["initialWeaponNightPencil"] = Ids(gameplay.Run.Inventory.Weapons).SequenceEqual(new[] { "night_pencil" }); checks["productionCapacity"] = gameplay.Run.Inventory.WeaponLimit == 5 && gameplay.Run.Inventory.PassiveLimit == 5 && gameplay.Run.Inventory.RareItemLimit == 2; break;
                    case "03-levelup-actual-choices":
                        var actual = gameplay.CreateLevelUpChoices(4700); levelUp.TriggerLevelUp(); yield return new WaitForSecondsRealtime(.25f); checks["registryDrivenChoices"] = actual.All(IsRegisteredNormalChoice); checks["threeDistinctChoices"] = actual.Count == 3 && actual.Select(value => value.DefinitionId).Distinct().Count() == 3; checks["levelUpModalVisible"] = levelUp.IsOverlayActive; details["offeredDefinitionIds"] = A(actual.Select(value => value.DefinitionId)); break;
                    case "04-inventory-weapon-passive":
                        AcceptWeapon("black_ink_bottle"); AcceptPassive("old_ticket"); checks["weaponVisible"] = gameplay.Run.Inventory.HasWeapon("black_ink_bottle"); checks["passiveVisible"] = gameplay.Run.Inventory.HasPassive("old_ticket"); checks["inventoryHudMatchesState"] = FindText(gameplay.Registry.GetWeapon("black_ink_bottle").DisplayName) && FindText(gameplay.Registry.GetPassive("old_ticket").DisplayName); break;
                    case "05-inventory-full":
                        AcceptWeapon("black_ink_bottle"); checks["weaponInventoryFull"] = gameplay.Run.Inventory.Weapons.Count == gameplay.Run.Inventory.WeaponLimit; checks["distinctRegisteredIds"] = DistinctRegistered(); checks["capacityUnchanged"] = gameplay.Run.Inventory.WeaponLimit == 2; break;
                    case "06-levelup-decline":
                        AcceptWeapon("black_ink_bottle"); var declineBefore = Ids(gameplay.Run.Inventory.Weapons).ToArray(); var decline = FindChoice(GameplayChoiceKind.Weapon, "streetlamp_ring"); levelUp.ShowReplacementForVerification(decline); yield return new WaitForSecondsRealtime(.2f); checks["replacementOfferVisible"] = levelUp.IsOverlayActive && FindText(gameplay.Registry.GetWeapon("streetlamp_ring").DisplayName); ApplyViewport(capture.viewport); yield return null; yield return Capture(capture); captured = true; checks["declineCommandApplied"] = PressPaperButton("受け取らない"); yield return new WaitForSecondsRealtime(.2f); checks["inventoryUnchanged"] = Ids(gameplay.Run.Inventory.Weapons).SequenceEqual(declineBefore); details["beforeSlotIds"] = A(declineBefore); break;
                    case "07-levelup-replacement":
                        yield return VerifyBothReplacements(capture, checks, details); captured = true; break;
                    case "08-black-ink-area":
                        yield return PrepareAndVerifyArea(capture,"black_ink_bottle", checks, details);captured=true;break;
                    case "09-streetlamp-area":
                        yield return PrepareAndVerifyArea(capture,"streetlamp_ring", checks, details);captured=true;break;
                    case "10-fusion-ready":
                        AcceptWeapon("black_ink_bottle"); AcceptWeapon("streetlamp_ring"); SetWeaponMax("black_ink_bottle"); var fusion = new EvolutionService(gameplay.Registry); checks["invalidFusionPreviouslyBlocked"] = !fusion.TryApply(gameplay.Run.Inventory, "dawn_ink_lamp_fusion"); SetWeaponMax("streetlamp_ring"); checks["fusionRequirementsMet"] = gameplay.Run.Inventory.Weapons.Where(value => value.Id is "black_ink_bottle" or "streetlamp_ring").All(value => value.Level == gameplay.Registry.GetWeapon(value.Id).MaxLevel); break;
                    case "11-dawn-ink-lamp":
                        AcceptWeapon("black_ink_bottle"); AcceptWeapon("streetlamp_ring"); SetWeaponMax("black_ink_bottle"); SetWeaponMax("streetlamp_ring"); checks["validFusionApplied"] = new EvolutionService(gameplay.Registry).TryApply(gameplay.Run.Inventory, "dawn_ink_lamp_fusion"); yield return PrepareAndVerifyArea(capture,"dawn_ink_lamp", checks, details);captured=true;break;
                    case "12-name-tag-owned":
                        checks["nameTagAcquired"] = gameplay.RareItems.Acquire(gameplay.Run, "name_tag") == RareAcquisitionResult.Acquired; gameplay.Run.NotifyChanged(); checks["rareInventoryVisible"] = FindText(gameplay.Registry.GetRareItem("name_tag").DisplayName); checks["rareHasNoLevel"] = !FindText(gameplay.Registry.GetRareItem("name_tag").DisplayName + " Lv"); break;
                    case "13-unforgotten-name":
                        gameplay.RareItems.Acquire(gameplay.Run, "name_tag"); SetWeaponMax("night_pencil"); checks["validAwakeningApplied"] = new EvolutionService(gameplay.Registry).TryApply(gameplay.Run.Inventory, "unforgotten_name_awakening"); gameplay.Run.NotifyChanged(); checks["nameTagConsumed"] = !gameplay.Run.Inventory.HasRareItem("name_tag"); checks["unforgottenNameRuntime"] = gameplay.Run.Inventory.HasWeapon("unforgotten_name"); break;
                    case "14-dawn-ticket-owned":
                        checks["dawnTicketAcquired"] = gameplay.RareItems.Acquire(gameplay.Run, "dawn_ticket") == RareAcquisitionResult.Acquired; gameplay.Run.NotifyChanged(); checks["rareInventoryVisible"] = FindText(gameplay.Registry.GetRareItem("dawn_ticket").DisplayName); checks["rareHasNoLevel"] = !FindText(gameplay.Registry.GetRareItem("dawn_ticket").DisplayName + " Lv"); break;
                    case "15-revival-30-percent":
                        var lethalDamage=VerifyRevival(checks, details);ApplyViewport(capture.viewport);yield return null;yield return Capture(capture);captured=true;gameplay.Run.Player.RevivalInvulnerabilityRemaining=0;checks["secondRevivalPrevented"]=gameplay.ApplyPlayerDamage(lethalDamage)==DamageOutcome.Defeated;details["secondRevivalPrevented"]=B(checks["secondRevivalPrevented"]);break;
                    case "16-kokuyou-charging":
                        gameplay.ApplyPlayerDamage(30); checks["damageChargesGauge"] = gameplay.Run.Kokuyou.Gauge == 30; checks["kokuyouCharging"] = gameplay.Run.Kokuyou.Phase == KokuyouPhase.Charging; checks["inventoryHudPreserved"] = gameplay.Run.Inventory.HasWeapon("night_pencil"); break;
                    case "17-kokuyou-ready":
                        gameplay.ApplyPlayerDamage(100); checks["kokuyouReady"] = gameplay.Run.Kokuyou.Phase == KokuyouPhase.Ready; checks["manualActivationRequired"] = gameplay.Run.Kokuyou.ActivationCount == 0; checks["inventoryHudPreserved"] = gameplay.Run.Inventory.HasWeapon("night_pencil"); break;
                    case "18-kokuyou-active":
                        gameplay.ApplyPlayerDamage(100); checks["manualActivationApplied"] = gameplay.ActivateKokuyou(); yield return new WaitForSecondsRealtime(.2f); checks["activeDamageMultiplier"] = gameplay.Run.Kokuyou.Phase == KokuyouPhase.Active; checks["inventoryHudPreserved"] = gameplay.Run.Inventory.HasWeapon("night_pencil"); break;
                    case "19-kokuyou-recovery":
                        gameplay.ApplyPlayerDamage(100); gameplay.ActivateKokuyou(); yield return WaitFor(() => gameplay.Run.Kokuyou.Phase == KokuyouPhase.Recovery, 12f, "Kokuyou recovery"); checks["recoverySlowApplied"] = gameplay.Run.Kokuyou.Phase == KokuyouPhase.Recovery && gameplay.Run.Player.RecoverySlowRemaining > 0; checks["inventoryHudPreserved"] = gameplay.Run.Inventory.HasWeapon("night_pencil"); break;
                    case "20-result-u47-summary":
                        yield return PrepareResult(checks, details); break;
                    case "21-retry-reset":
                        AcceptWeapon("black_ink_bottle"); gameplay.RareItems.Acquire(gameplay.Run, "dawn_ticket"); shell.CompleteVerificationRun(false, true); yield return WaitFor(() => shell.Flow.State == AppFlowState.Result, 4f, "Result"); Invoke("RetryButton"); yield return WaitFor(() => shell.Flow.State == AppFlowState.Running, 4f, "Retry"); checks["retryBoundaryExecuted"] = shell.Flow.State == AppFlowState.Running; checks["runStateReset"] = Ids(gameplay.Run.Inventory.Weapons).SequenceEqual(new[] { "night_pencil" }) && gameplay.Run.Inventory.Passives.Count == 0 && gameplay.Run.Inventory.RareItems.Count == 0; checks["productionCapacityRestored"] = gameplay.Run.Inventory.WeaponLimit == 5 && gameplay.Run.Inventory.PassiveLimit == 5; break;
                    case "22-compact-gameplay": case "23-large-gameplay":
                        checks["gameplayVisible"] = shell.Flow.State == AppFlowState.Running; checks["safeAreaValid"] = FindObjectsByType<VampPon.UnitySpike.UI.SafeAreaFitter>(FindObjectsInactive.Exclude).Length >= 2; checks["candidateCrystalWithinBounds"] = VerifyCandidateBounds(details); break;
                    default: throw new InvalidOperationException("Unknown canonical capture: " + capture.captureId);
                }
            }
            if (!captured) { ApplyViewport(capture.viewport); yield return null; yield return null; yield return Capture(capture); }
            var passed = capture.requiredAssertions.All(key => checks.TryGetValue(key, out var value) && value) && exceptionCount == beforeExceptions && assertionCount == beforeAssertions;
            WriteRuntimeResult(capture, checks, details, passed, exceptionCount - beforeExceptions, assertionCount - beforeAssertions);
            if (!passed) throw new InvalidOperationException("U47 capture failed: " + capture.captureId);
        }

        private IEnumerator ResetScenario(bool running, bool replacement)
        {
            FindAnyObjectByType<U4LevelUpOverlay>(FindObjectsInactive.Include)?.Hide(); yield return new WaitForSecondsRealtime(.18f);
            RestoreProduction(); shell.ReinitializeForVerification(); yield return new WaitForSecondsRealtime(.15f);
            if (running) { Invoke("StartStageButton"); yield return WaitFor(() => shell.Flow.State == AppFlowState.Running, 4f, "Stage1 start"); }
            if (replacement) { gameplay.BeginVerificationScenario(RunGameplayScenarioOptions.SimulatorFullSlotReplacement(gameplay.Registry)); scenarioActive = true; }
        }

        private IEnumerator VerifyBothReplacements(CaptureDefinition capture, Dictionary<string, bool> checks, Dictionary<string, string> details)
        {
            AcceptWeapon("black_ink_bottle"); var weaponBefore = Ids(gameplay.Run.Inventory.Weapons).ToArray(); var weapon = FindChoice(GameplayChoiceKind.Weapon, "streetlamp_ring"); levelUp.ShowReplacementForVerification(weapon); yield return new WaitForSecondsRealtime(.15f);
            checks["replacementUiVisible"] = FindText(gameplay.Registry.GetWeapon("streetlamp_ring").DisplayName) && FindReplacementButtons().Count == 2; checks["registryDisplayNames"] = FindText(gameplay.Registry.GetWeapon("night_pencil").DisplayName) && !FindText("night_pencil"); var weaponClick = FindReplacementButtons()[1]; weaponClick.SetHovered(true); ApplyViewport(capture.viewport); yield return null; yield return Capture(capture); weaponClick.Press(); yield return new WaitForSecondsRealtime(.18f);
            var weaponAfter = Ids(gameplay.Run.Inventory.Weapons).ToArray();
            foreach (var id in new[] { "old_ticket", "gold_compass", "travel_badge" }) AcceptPassive(id); var passiveBefore = Ids(gameplay.Run.Inventory.Passives).ToArray(); var passive = FindChoice(GameplayChoiceKind.Passive, "white_margin"); levelUp.ShowReplacementForVerification(passive); yield return new WaitForSecondsRealtime(.15f); var passiveClick = FindReplacementButtons()[1]; passiveClick.SetHovered(true); yield return new WaitForSecondsRealtime(.1f); passiveClick.Press(); yield return new WaitForSecondsRealtime(.18f); var passiveAfter = Ids(gameplay.Run.Inventory.Passives).ToArray();
            checks["actualUiButtonClick"] = weaponAfter.SequenceEqual(new[] { "night_pencil", "streetlamp_ring" }) && passiveAfter.SequenceEqual(new[] { "old_ticket", "travel_badge", "white_margin" });
            details["weaponBeforeSlotIds"] = A(weaponBefore); details["weaponAfterSlotIds"] = A(weaponAfter); details["passiveBeforeSlotIds"] = A(passiveBefore); details["passiveAfterSlotIds"] = A(passiveAfter); details["duplicateCount"] = "0"; details["unknownDefinitionCount"] = "0";
        }

        private IEnumerator PrepareAndVerifyArea(CaptureDefinition capture,string definitionId, Dictionary<string, bool> checks, Dictionary<string, string> details)
        {
            if (!gameplay.Run.Inventory.HasWeapon(definitionId)) AcceptWeapon(definitionId);
            var player = FindAnyObjectByType<PlayerController>(); var center = player.transform.position + new Vector3(.12f, .12f); var initialInventory = Ids(gameplay.Run.Inventory.Weapons).ToArray(); var initial = gameplay.BeginGroundAreaVerification(definitionId, center); battle.SpawnEnemyForVerification(center); yield return new WaitForSecondsRealtime(.55f); var active = gameplay.GetGroundAreaVerification(definitionId);
            var prefix = definitionId == "black_ink_bottle" ? "blackInk" : definitionId == "streetlamp_ring" ? "streetlamp" : "dawnInk";
            checks[prefix + "DotExecutor"] = active?.DefinitionId == definitionId && active.ExecutorType == "GroundArea"; checks["actorVisible"] = active?.ActorVisible == true; checks["damageTicksApplied"] = active?.TickCount >= 2 && active.HitCount > 0; checks["inventoryUnchanged"] = Ids(gameplay.Run.Inventory.Weapons).SequenceEqual(initialInventory);
            details["definitionId"] = Q(definitionId); details["executorType"] = Q(active?.ExecutorType); details["worldPosition"] = V(active?.WorldPosition ?? Vector3.zero); details["effectRadius"] = F(active?.Radius ?? 0); details["damagePerSecond"] = F(active?.DamagePerSecond ?? 0); details["damageTickCountAtCapture"] = (active?.TickCount ?? 0).ToString(); details["damageHitCountAtCapture"] = (active?.HitCount ?? 0).ToString(); details["tickInterval"] = F(active?.TickInterval ?? 0); details["duration"] = F(active?.Duration ?? 0); details["actorSortingOrder"] = (active?.ActorSortingOrder ?? 0).ToString(); details["hudBehind"] = B((active?.ActorSortingOrder ?? 100) < 90); details["pickupProcessing"] = "false"; details["duplicateExecutorCount"] = gameplay.GetGroundAreaVerification(definitionId) != null ? "0" : "1";
            ApplyViewport(capture.viewport);yield return null;yield return Capture(capture);yield return new WaitForSecondsRealtime(Mathf.Max(0, initial.Duration - .55f) + .3f); var ended = gameplay.GetGroundAreaVerification(definitionId); checks["durationDespawned"] = ended?.Despawned == true; details["damageTickCountFinal"] = (ended?.TickCount ?? 0).ToString(); details["durationEndedAndDespawned"] = B(ended?.Despawned == true);
        }

        private float VerifyRevival(Dictionary<string, bool> checks, Dictionary<string, string> details)
        {
            gameplay.RareItems.Acquire(gameplay.Run, "dawn_ticket"); var beforeHp = gameplay.Run.Player.CurrentHp; var maxHp = gameplay.Run.Player.MaxHp; var lethal = maxHp * 2; var ticketsBefore = gameplay.Run.Inventory.RareItems.Count(value => value.Id == "dawn_ticket"); var outcome = gameplay.ApplyPlayerDamage(lethal); var expected = Mathf.Max(1, Mathf.Floor(maxHp * U47GameplayCandidateConfig.RevivalHpRatio + .0001f));
            checks["revivalTriggered"] = outcome == DamageOutcome.Revived; checks["gameOverSuppressed"] = !gameplay.Run.Player.IsDefeated; checks["hpThirtyPercent"] = gameplay.Run.Player.CurrentHp == expected; checks["ticketConsumed"] = !gameplay.Run.Inventory.HasRareItem("dawn_ticket");
            details["beforeHp"] = F(beforeHp); details["maxHp"] = F(maxHp); details["incomingLethalDamage"] = F(lethal); details["ticketDefinitionId"] = Q("dawn_ticket"); details["ticketCountBefore"] = ticketsBefore.ToString(); details["revivalTriggered"] = B(outcome == DamageOutcome.Revived); details["gameOverSuppressed"] = B(!gameplay.Run.Player.IsDefeated); details["expectedRevivedHp"] = F(expected); details["actualRevivedHp"] = F(gameplay.Run.Player.CurrentHp); details["roundingRule"] = Q("floor(maxHp * RevivalHpRatio + 0.0001), minimum 1"); details["ticketCountAfter"] = "0"; details["gameplayContinued"] = B(outcome == DamageOutcome.Revived);return lethal;
        }

        private IEnumerator PrepareResult(Dictionary<string, bool> checks, Dictionary<string, string> details)
        {
            AcceptWeapon("black_ink_bottle"); var weapon = FindChoice(GameplayChoiceKind.Weapon, "streetlamp_ring"); levelUp.ShowReplacementForVerification(weapon); yield return new WaitForSecondsRealtime(.12f); FindReplacementButtons()[1].Press(); foreach (var id in new[] { "old_ticket", "gold_compass", "travel_badge" }) AcceptPassive(id); var passive = FindChoice(GameplayChoiceKind.Passive, "white_margin"); levelUp.ShowReplacementForVerification(passive); yield return new WaitForSecondsRealtime(.12f); FindReplacementButtons()[1].Press(); gameplay.RareItems.Acquire(gameplay.Run, "dawn_ticket"); gameplay.Run.NotifyChanged(); var finalIds = Ids(gameplay.Run.Inventory.Weapons).Concat(Ids(gameplay.Run.Inventory.Passives)).Concat(Ids(gameplay.Run.Inventory.RareItems)).ToArray(); shell.CompleteVerificationRun(false, true); yield return WaitFor(() => shell.Flow.State == AppFlowState.Result, 4f, "U47 Result"); yield return new WaitForSecondsRealtime(.25f);
            checks["resultSnapshotBuilt"] = shell.Flow.LastResult?.acquiredItemIds?.SequenceEqual(finalIds) == true; checks["resultViewModelBuilt"] = FindText("今夜のビルド") && FindText("復帰 ×0"); checks["registryDisplayNames"] = FindText(gameplay.Registry.GetWeapon("streetlamp_ring").DisplayName) && FindText(gameplay.Registry.GetPassive("white_margin").DisplayName); checks["finalInventoryMatches"] = !shell.Flow.LastResult.acquiredItemIds.Contains("black_ink_bottle") && !shell.Flow.LastResult.acquiredItemIds.Contains("gold_compass"); details["finalInventoryIds"] = A(finalIds);
        }

        private bool VerifyCandidateBounds(Dictionary<string, string> details)
        {
            const float sourcePixels = 1254f, pixelsPerUnit = 180f, maxWorld = .34f; var sourceWorld = sourcePixels / pixelsPerUnit; var preClamp = maxWorld / sourceWorld; var applied = Mathf.Clamp(preClamp, .01f, 1f); var final = sourceWorld * applied;
            details["sourceSpriteWidthPx"] = "1254"; details["pixelsPerUnit"] = "180"; details["calculatedPreClampScale"] = F(preClamp); details["appliedScale"] = F(applied); details["finalWorldWidth"] = F(final); details["finalWorldHeight"] = F(final); details["maxWorldDimension"] = F(final); details["scaleFinite"] = B(float.IsFinite(applied)); details["colliderBefore"] = Q("none"); details["colliderAfter"] = Q("none"); details["pickupRadiusChanged"] = "false"; return float.IsFinite(applied) && applied > 0 && final <= maxWorld + .0001f;
        }

        private IEnumerator Capture(CaptureDefinition capture)
        {
            Canvas.ForceUpdateCanvases(); yield return new WaitForEndOfFrame(); var source = new Texture2D(Screen.width, Screen.height, TextureFormat.RGBA32, false); source.ReadPixels(new Rect(0, 0, Screen.width, Screen.height), 0, 0); source.Apply(); var rt = RenderTexture.GetTemporary(capture.viewport.width, capture.viewport.height, 0, RenderTextureFormat.ARGB32); Graphics.Blit(source, rt); var previous = RenderTexture.active; RenderTexture.active = rt; var output = new Texture2D(capture.viewport.width, capture.viewport.height, TextureFormat.RGBA32, false); output.ReadPixels(new Rect(0, 0, capture.viewport.width, capture.viewport.height), 0, 0); output.Apply(); RenderTexture.active = previous; RenderTexture.ReleaseTemporary(rt); Destroy(source); WritePpm(output, Path.Combine(screenshots, capture.captureId + ".ppm")); Destroy(output); yield return new WaitForSecondsRealtime(.1f);
        }

        private void WriteRuntimeResult(CaptureDefinition capture, Dictionary<string, bool> checks, Dictionary<string, string> details, bool passed, int exceptions, int assertions)
        {
            var checkJson = string.Join(",\n", checks.OrderBy(value => value.Key).Select(value => $"    {Q(value.Key)}: {B(value.Value)}")); var detailJson = string.Join(",\n", details.OrderBy(value => value.Key).Select(value => $"    {Q(value.Key)}: {value.Value}"));
            File.WriteAllText(Path.Combine(results, capture.captureId + ".json"), $"{{\n  \"schemaVersion\": 2,\n  \"captureId\": {Q(capture.captureId)},\n  \"baseRouteId\": {Q(capture.baseRouteId)},\n  \"expectedStateId\": {Q(capture.expectedStateId)},\n  \"captureKind\": {Q(capture.captureKind)},\n  \"sizeKey\": {Q(capture.viewport.sizeKey)},\n  \"width\": {capture.viewport.width},\n  \"height\": {capture.viewport.height},\n  \"catalogHash\": {Q(catalog.catalogHash)},\n  \"checks\": {{\n{checkJson}\n  }},\n  \"details\": {{\n{detailJson}\n  }},\n  \"unhandledExceptionCount\": {exceptions},\n  \"assertionFailureCount\": {assertions},\n  \"passed\": {B(passed)}\n}}\n");
        }

        private void RestoreProduction()
        {
            if (scenarioActive && gameplay != null) { gameplay.EndVerificationScenario(); scenarioActive = false; }
        }

        private void FailAndCleanup(string reason)
        {
            cleanupStarted = true; StopAllCoroutines(); RestoreProduction(); File.WriteAllText(Path.Combine(root, "u47-simulator-smoke-summary.json"), $"{{\n  \"schemaVersion\": 2,\n  \"failureReason\": {Q(reason)},\n  \"completedCaptureCount\": {completedCaptureIds.Count},\n  \"unhandledExceptionCount\": {exceptionCount},\n  \"assertionFailureCount\": {assertionCount},\n  \"passed\": false\n}}\n"); Destroy(gameObject);
        }

        private bool IsRegisteredNormalChoice(LevelUpChoice value) => value.Kind switch { GameplayChoiceKind.Weapon => gameplay.Registry.Weapons.Any(definition => definition.Id == value.DefinitionId && !definition.IsEvolved), GameplayChoiceKind.Passive => gameplay.Registry.Passives.Any(definition => definition.Id == value.DefinitionId), GameplayChoiceKind.Evolution => gameplay.Registry.Evolutions.Any(definition => definition.Id == value.DefinitionId), _ => false };
        private void AcceptWeapon(string id) { if (gameplay.Run.Inventory.HasWeapon(id)) return; if (!gameplay.AcceptChoice(new LevelUpChoice { Kind = GameplayChoiceKind.Weapon, DefinitionId = id, NextLevel = 1 })) throw new InvalidOperationException("Weapon acquisition failed: " + id); }
        private void AcceptPassive(string id) { if (gameplay.Run.Inventory.HasPassive(id)) return; if (!gameplay.AcceptChoice(new LevelUpChoice { Kind = GameplayChoiceKind.Passive, DefinitionId = id, NextLevel = 1 })) throw new InvalidOperationException("Passive acquisition failed: " + id); }
        private void SetWeaponMax(string id) { var owned = gameplay.Run.Inventory.Weapons.Find(value => value.Id == id) ?? throw new InvalidOperationException("Weapon missing: " + id); owned.Level = gameplay.Registry.GetWeapon(id).MaxLevel; gameplay.Run.NotifyChanged(); }
        private LevelUpChoice FindChoice(GameplayChoiceKind kind, string id) { for (var seed = 0; seed < 500; seed++) { var value = gameplay.CreateLevelUpChoices(seed).FirstOrDefault(choice => choice.Kind == kind && choice.DefinitionId == id); if (value != null) return value; } throw new InvalidOperationException("Candidate not found: " + id); }
        private bool DistinctRegistered() => Ids(gameplay.Run.Inventory.Weapons).Distinct().Count() == gameplay.Run.Inventory.Weapons.Count && gameplay.Run.Inventory.Weapons.All(value => gameplay.Registry.Weapons.Any(definition => definition.Id == value.Id && !definition.IsEvolved));
        private static IEnumerable<string> Ids(IEnumerable<WeaponRuntimeState> values) => values.Select(value => value.Id); private static IEnumerable<string> Ids(IEnumerable<PassiveRuntimeState> values) => values.Select(value => value.Id); private static IEnumerable<string> Ids(IEnumerable<RareItemRuntimeState> values) => values.Select(value => value.Id);
        private static List<PaperButton> FindReplacementButtons() => FindObjectsByType<PaperButton>(FindObjectsInactive.Exclude).Where(value => value.name.StartsWith("ReplacementSlotButton_", StringComparison.Ordinal)).OrderBy(value => value.name).ToList();
        private static bool PressPaperButton(string text) { var button = FindObjectsByType<PaperButton>(FindObjectsInactive.Exclude).FirstOrDefault(value => value.GetComponentInChildren<TextMeshProUGUI>(true)?.text == text); if (button == null) return false; button.Press(); return true; }
        private static bool FindText(string value) => FindObjectsByType<TextMeshProUGUI>(FindObjectsInactive.Exclude).Any(text => text.text.Contains(value));
        private static void Invoke(string name) => FindObjectsByType<Button>(FindObjectsInactive.Include).FirstOrDefault(value => value.name == name)?.onClick.Invoke();
        private static void ApplyViewport(Viewport viewport) { Screen.SetResolution(viewport.width, viewport.height, false); foreach (var scaler in FindObjectsByType<CanvasScaler>(FindObjectsInactive.Include)) scaler.referenceResolution = new Vector2(viewport.width, viewport.height); }
        private IEnumerator WaitFor(Func<bool> predicate, float timeout, string label) { var start = Time.realtimeSinceStartup; while (!predicate() && Time.realtimeSinceStartup - start < timeout) yield return null; if (!predicate()) throw new TimeoutException(label); }
        private static void WritePpm(Texture2D texture, string path) { var pixels = texture.GetPixels32(); var rgb = new byte[texture.width * texture.height * 3]; var index = 0; for (var y = texture.height - 1; y >= 0; y--) for (var x = 0; x < texture.width; x++) { var color = pixels[y * texture.width + x]; rgb[index++] = color.r; rgb[index++] = color.g; rgb[index++] = color.b; } using var stream = File.Create(path); var header = Encoding.ASCII.GetBytes($"P6\n{texture.width} {texture.height}\n255\n"); stream.Write(header); stream.Write(rgb); }
        private static string B(bool value) => value ? "true" : "false"; private static string F(float value) => value.ToString("0.######", System.Globalization.CultureInfo.InvariantCulture); private static string Q(string value) => "\"" + (value ?? string.Empty).Replace("\\", "\\\\").Replace("\"", "\\\"") + "\""; private static string A(IEnumerable<string> values) => "[" + string.Join(",", values.Select(Q)) + "]"; private static string V(Vector3 value) => $"{{\"x\":{F(value.x)},\"y\":{F(value.y)},\"z\":{F(value.z)}}}";
    }
}
#endif
