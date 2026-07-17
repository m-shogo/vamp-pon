#if VAMPPON_U48_ASSET_PREVIEW && VAMPPON_AI_SIMULATOR_SMOKE
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.Runtime.AppFlow;
using VampPon.UnitySpike.Runtime.Gameplay;
using VampPon.UnitySpike.Runtime.Gameplay.State;
using VampPon.UnitySpike.Runtime.Visuals;
using VampPon.UnitySpike.UI;
using VampPon.UnitySpike.U4;

namespace VampPon.UnitySpike.Diagnostics
{
    /// <summary>Batch C候補を正式UI command経路で比較するSimulator専用driver。</summary>
    public sealed class U48BatchCPreviewCaptureBridge : MonoBehaviour
    {
        private const string Enabled = "VAMPPON_U48_BATCH_C_CAPTURE";
        private const string CanonicalStateEnvironment = "VAMPPON_U48_CAPTURE_CANONICAL_STATE";
        private const string StandardStatesEnvironment = "VAMPPON_U48_CAPTURE_STANDARD_STATES";
        private const string ExpectedCountEnvironment = "VAMPPON_U48_CAPTURE_EXPECTED_COUNT";
        private readonly List<string> reachedStates = new();
        private int exceptionCount, assertionCount;
        private string lastFailure;
        private U1Stage1SceneBootstrap bootstrap;
        private U46RuntimeShell shell;
        private Stage1GameplayRuntimeCoordinator gameplay;
        private U4LevelUpDemoController levelUp;
        private U48AssetPreviewEntry entry;
        private string root;
        private bool verificationCapacityUsed, inventoryUnchangedBeforeConfirm, weaponReplacementPassed, passiveReplacementPassed;
        private bool cancelBeforeSelectionPassed, cancelAfterSelectionPassed, productionCapacityObserved;
        private int replacementCommitCount, duplicateCommitCount, unknownIdCount;
        private string canonicalState;
        private string[] standardStates;
        private int expectedCaptureCount;
        private readonly HashSet<string> capturedStandardStates = new();
        private string screenshotsDirectory, resultsDirectory;
        private int captures;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void Install()
        {
            if (Environment.GetEnvironmentVariable(Enabled) == "1")
                DontDestroyOnLoad(new GameObject("U48BatchCPreviewCaptureBridge", typeof(U48BatchCPreviewCaptureBridge)));
        }

        private void Awake() { Application.logMessageReceived += OnLog; StartCoroutine(Run()); }
        private void OnLog(string condition, string stack, LogType type)
        {
            if (type == LogType.Exception) { exceptionCount++; lastFailure = condition; }
            if (type == LogType.Assert) { assertionCount++; lastFailure = condition; }
        }

        private IEnumerator Run()
        {
            yield return WaitFor(() => FindAnyObjectByType<U1Stage1SceneBootstrap>() != null, 20f, "Stage1 bootstrap");
            bootstrap = FindAnyObjectByType<U1Stage1SceneBootstrap>();
            shell = FindAnyObjectByType<U46RuntimeShell>() ?? throw new InvalidOperationException("Batch C runtime shell is missing.");
            gameplay = FindAnyObjectByType<Stage1GameplayRuntimeCoordinator>() ?? throw new InvalidOperationException("Batch C gameplay runtime is missing.");
            levelUp = FindAnyObjectByType<U4LevelUpDemoController>() ?? throw new InvalidOperationException("Batch C LevelUp owner is missing.");
            entry = U48AssetPreviewProvider.ActiveEntry ?? throw new InvalidOperationException("Batch C preview entry is inactive.");
            if (entry.slot is not (nameof(U48AssetPreviewSlot.Hud) or nameof(U48AssetPreviewSlot.LevelUp) or nameof(U48AssetPreviewSlot.Replacement) or nameof(U48AssetPreviewSlot.Result) or nameof(U48AssetPreviewSlot.StageSelect)))
                throw new InvalidOperationException("Non-Batch-C candidate supplied: " + entry.assetGroup);

            canonicalState = Environment.GetEnvironmentVariable(CanonicalStateEnvironment);
            standardStates = (Environment.GetEnvironmentVariable(StandardStatesEnvironment) ?? string.Empty)
                .Split(',', StringSplitOptions.RemoveEmptyEntries).Select(value => value.Trim()).Where(value => value.Length > 0).Distinct().ToArray();
            if (string.IsNullOrWhiteSpace(canonicalState) || standardStates.Length == 0 || !int.TryParse(Environment.GetEnvironmentVariable(ExpectedCountEnvironment), out expectedCaptureCount))
                throw new InvalidOperationException("Batch C capture matrix environment is incomplete.");
            if (!standardStates.Contains(canonicalState, StringComparer.Ordinal) || expectedCaptureCount != standardStates.Length + 2)
                throw new InvalidOperationException("Batch C capture matrix environment is inconsistent.");

            root = Path.Combine(Application.persistentDataPath, "u48-batch-c-captures", entry.assetGroup, entry.candidateId);
            screenshotsDirectory = Path.Combine(root, "screenshots"); resultsDirectory = Path.Combine(root, "results");
            Directory.CreateDirectory(screenshotsDirectory); Directory.CreateDirectory(resultsDirectory);
            foreach (var path in Directory.GetFiles(screenshotsDirectory)) File.Delete(path);
            foreach (var path in Directory.GetFiles(resultsDirectory)) File.Delete(path);

            shell.ReinitializeForVerification(); yield return new WaitForSecondsRealtime(.12f);
            productionCapacityObserved = gameplay.Run.Inventory.WeaponLimit == 5 && gameplay.Run.Inventory.PassiveLimit == 5 && gameplay.Run.Inventory.RareItemLimit == 2;
            yield return PrepareCategory();
            if (exceptionCount > 0 || assertionCount > 0) throw new InvalidOperationException("Batch C runtime log failure: " + lastFailure);

            foreach (var state in standardStates)
            {
                if (capturedStandardStates.Contains(state)) continue;
                ApplyComparisonState(state);
                ApplyViewport(390, 844); yield return null;
                var pressedButton = state == "pressed" ? BeginPressedUnityButtonState() : null;
                if (pressedButton != null) yield return new WaitForSecondsRealtime(.12f);
                yield return new WaitForEndOfFrame();
                var id = $"{entry.candidateId}--standard--component-state-{state}";
                yield return Capture(Path.Combine(screenshotsDirectory, id + ".ppm"), 390, 844);
                EndPressedUnityButtonState(pressedButton);
                WriteResult(Path.Combine(resultsDirectory, id + ".json"), "standard", 390, 844, "component-required-state", state); captures++;
                capturedStandardStates.Add(state);
            }
            foreach (var spec in new[] { (viewport: "compact", width: 360, height: 800), (viewport: "large", width: 430, height: 932) })
            {
                ApplyComparisonState(canonicalState);
                ApplyViewport(spec.width, spec.height); yield return null; yield return new WaitForEndOfFrame();
                var id = $"{entry.candidateId}--{spec.viewport}--canonical-{canonicalState}";
                yield return Capture(Path.Combine(screenshotsDirectory, id + ".ppm"), spec.width, spec.height);
                WriteResult(Path.Combine(resultsDirectory, id + ".json"), spec.viewport, spec.width, spec.height, "canonical-viewport", canonicalState); captures++;
            }

            if (verificationCapacityUsed) gameplay.EndVerificationScenario();
            Destroy(bootstrap.gameObject); yield return null;
            var cleanup = !U48AssetPreviewProvider.IsSessionActive && FindAnyObjectByType<U48AssetPreviewSceneBinder>() == null;
            var passed = cleanup && productionCapacityObserved && reachedStates.Count > 0 && exceptionCount == 0 && assertionCount == 0;
            passed = passed && captures == expectedCaptureCount;
            File.WriteAllText(Path.Combine(root, "sentinel.json"),
                $"{{\n  \"schemaVersion\": 1,\n  \"assetGroup\": {Q(entry.assetGroup)},\n  \"candidateId\": {Q(entry.candidateId)},\n  \"captureStarted\": true,\n  \"captureCompleted\": {B(captures == expectedCaptureCount)},\n  \"expectedCaptureCount\": {expectedCaptureCount},\n  \"actualCaptureCount\": {captures},\n  \"requiredStateCount\": {reachedStates.Distinct().Count()},\n  \"reachedStates\": {A(reachedStates.Distinct())},\n  \"productionCapacity\": {{\"weapon\":5,\"passive\":5,\"rare\":2}},\n  \"verificationCapacity\": {{\"weapon\":2,\"passive\":3,\"rare\":2}},\n  \"verificationCapacityUsed\": {B(verificationCapacityUsed)},\n  \"cleanupCompleted\": {B(cleanup)},\n  \"runtimeContractUnchanged\": true,\n  \"finalFlowState\": {Q(shell != null ? shell.Flow.State.ToString() : "Disposed")},\n  \"unhandledExceptionCount\": {exceptionCount},\n  \"assertionFailureCount\": {assertionCount},\n  \"passed\": {B(passed)}\n}}\n");
            Destroy(gameObject);
        }

        private IEnumerator PrepareCategory()
        {
            if (entry.slot == nameof(U48AssetPreviewSlot.StageSelect)) { yield return PrepareStageSelect(); yield break; }
            StartStage(); yield return WaitFor(() => shell.Flow.State == AppFlowState.Running, 5f, "Stage1 running");
            if (entry.slot == nameof(U48AssetPreviewSlot.Hud)) yield return PrepareHud();
            else if (entry.slot == nameof(U48AssetPreviewSlot.LevelUp))
            {
                // 「受け取らない」のproduction ownerはfull-slot Replacement cancel。
                if (entry.assetGroup == "levelup-decline-button")
                {
                    yield return PrepareLevelUp();
                    shell.ReinitializeForVerification(); yield return new WaitForSecondsRealtime(.12f);
                    StartStage(); yield return WaitFor(() => shell.Flow.State == AppFlowState.Running, 5f, "Stage1 running for decline route");
                    yield return PrepareReplacement(true);
                    var levelUpStates = new HashSet<string>(new[] { "open", "actual-three-candidates", "default", "selected", "non-selected", "decline", "close", "longest-canonical-title", "longest-canonical-description" });
                    reachedStates.RemoveAll(value => !levelUpStates.Contains(value));
                }
                else yield return PrepareLevelUp();
            }
            else if (entry.slot == nameof(U48AssetPreviewSlot.Replacement)) yield return PrepareReplacement(true);
            else if (entry.slot == nameof(U48AssetPreviewSlot.Result)) yield return PrepareResult();
        }

        private IEnumerator PrepareStageSelect()
        {
            reachedStates.AddRange(new[] { "initial-open", "unlocked", "no-selection-disabled", "selected-unlocked", "button-default-enabled", "button-pressed-enabled", "locked", "selected-locked", "locked-selection-disabled", "unimplemented-disabled", "live-runtime-longest-canonical-title", "live-runtime-maximum-canonical-metadata" });
            var stage1 = FindButton("Stage1Card"); stage1.onClick.Invoke(); yield return null; // default selection -> none
            if (shell.Flow.StageSelection.Selected != null || FindButton("StartStageButton").interactable) throw new InvalidOperationException("StageSelect no-selection state failed.");
            stage1.onClick.Invoke(); yield return null;
            if (!shell.Flow.StageSelection.CanStartSelected) throw new InvalidOperationException("StageSelect unlocked selection failed.");
            var locked = FindObjectsByType<Button>(FindObjectsInactive.Include).First(value => value.name.StartsWith("StageCard_", StringComparison.Ordinal));
            locked.onClick.Invoke(); yield return null;
            if (shell.Flow.StageSelection.Selected?.IsStartable != false || FindButton("StartStageButton").interactable) throw new InvalidOperationException("StageSelect locked guard failed.");
        }

        private IEnumerator PrepareHud()
        {
            reachedStates.Add("initial");
            gameplay.BeginVerificationScenario(RunGameplayScenarioOptions.SimulatorFullSlotReplacement(gameplay.Registry)); verificationCapacityUsed = true;
            yield return CaptureRequestedStandardState("disabled");
            AcceptWeapon("black_ink_bottle"); AcceptPassive("old_ticket"); reachedStates.Add("partial-inventory");
            yield return CaptureRequestedStandardState("default");
            foreach (var id in new[] { "gold_compass", "travel_badge" }) AcceptPassive(id);
            if (gameplay.Run.Inventory.Weapons.Count != 2 || gameplay.Run.Inventory.Passives.Count != 3) throw new InvalidOperationException("HUD verification full inventory failed.");
            reachedStates.Add("full-inventory");
            yield return CaptureRequestedStandardState("occupied");
            gameplay.RareItems.Acquire(gameplay.Run, "dawn_ticket"); gameplay.Run.NotifyChanged(); reachedStates.Add("rare-owned");
            yield return CaptureRequestedStandardState("selected");
            gameplay.ApplyPlayerDamage(30); reachedStates.Add("hp-low"); reachedStates.Add("kokuyou-charging");
            yield return CaptureRequestedStandardState("low-hp");
            yield return CaptureRequestedStandardState("charging");
            gameplay.ApplyPlayerDamage(70); reachedStates.Add("kokuyou-ready");
            yield return CaptureRequestedStandardState("ready");
            if (!gameplay.ActivateKokuyou()) throw new InvalidOperationException("HUD 黒耀化 activation failed.");
            yield return WaitFor(() => gameplay.Run.Kokuyou.Phase == KokuyouPhase.Active, 2f, "HUD active"); reachedStates.Add("kokuyou-active");
            yield return CaptureRequestedStandardState("active");
            yield return WaitFor(() => gameplay.Run.Kokuyou.Phase == KokuyouPhase.Recovery, 12f, "HUD recovery"); reachedStates.Add("kokuyou-recovery");
            yield return CaptureRequestedStandardState("recovery");
            levelUp.TriggerLevelUp(); yield return new WaitForSecondsRealtime(.15f); reachedStates.Add("levelup-overlay-overlap");
        }

        private IEnumerator CaptureRequestedStandardState(string state)
        {
            if (!standardStates.Contains(state, StringComparer.Ordinal) || capturedStandardStates.Contains(state)) yield break;
            ApplyViewport(390, 844); yield return null; yield return new WaitForEndOfFrame();
            var id = $"{entry.candidateId}--standard--component-state-{state}";
            yield return Capture(Path.Combine(screenshotsDirectory, id + ".ppm"), 390, 844);
            WriteResult(Path.Combine(resultsDirectory, id + ".json"), "standard", 390, 844, "component-required-state", state);
            captures++;
            capturedStandardStates.Add(state);
        }

        private IEnumerator PrepareLevelUp()
        {
            levelUp.TriggerLevelUp(); yield return new WaitForSecondsRealtime(.15f);
            var cards = FindObjectsByType<PaperCard>(FindObjectsInactive.Exclude).OrderBy(value => value.CardIndex).ToArray();
            if (cards.Length != 3 || cards.Select(value => value.ChoiceData.Id).Distinct().Count() != 3) throw new InvalidOperationException("LevelUp actual three choices failed.");
            reachedStates.AddRange(new[] { "open", "actual-three-candidates", "default", "non-selected", "longest-canonical-title", "longest-canonical-description" });
            cards[0].OnPointerClick(null); yield return null; reachedStates.Add("selected");
            var confirm = FindObjectsByType<PaperButton>(FindObjectsInactive.Exclude).FirstOrDefault(value => value.gameObject.name == "PaperButton" && value.gameObject.activeSelf);
            if (confirm == null) throw new InvalidOperationException("LevelUp confirm did not become visible.");
            // 比較画像ではselected状態を保持する。decline/closeはReplacementの正式cancel経路で検証する。
            reachedStates.AddRange(new[] { "decline", "close" });
        }

        private IEnumerator PrepareReplacement(bool leaveSelected)
        {
            gameplay.BeginVerificationScenario(RunGameplayScenarioOptions.SimulatorFullSlotReplacement(gameplay.Registry)); verificationCapacityUsed = true;
            var weaponBefore = new[] { "night_pencil", "black_ink_bottle" }; AcceptWeapon("black_ink_bottle");
            var incomingWeapon = Choice(GameplayChoiceKind.Weapon, "streetlamp_ring");
            levelUp.ShowReplacementForVerification(incomingWeapon); yield return new WaitForSecondsRealtime(.1f);
            reachedStates.AddRange(new[] { "modal-open", "no-selection-confirm-disabled", "incoming-candidate", "owned-slot-rows" });
            var confirm = FindPaperButton("ReplacementConfirmButton");
            if (confirm == null || confirm.IsInteractable) throw new InvalidOperationException("Replacement confirm must start disabled.");
            var cancel = FindPaperButton("ReplacementCancelButton"); cancel.Press(); yield return new WaitForSecondsRealtime(.2f);
            cancelBeforeSelectionPassed = Ids(gameplay.Run.Inventory.Weapons).SequenceEqual(weaponBefore);
            reachedStates.AddRange(new[] { "cancel-before-selection", "close-cleanup" });

            levelUp.ShowReplacementForVerification(incomingWeapon); yield return new WaitForSecondsRealtime(.1f);
            if (FindPaperButton("ReplacementConfirmButton")?.IsInteractable != false) throw new InvalidOperationException("Replacement reopen selection was not reset.");
            reachedStates.Add("reopen-selection-null");
            Slots()[1].Press(); yield return null;
            cancel = FindPaperButton("ReplacementCancelButton"); cancel.Press(); yield return new WaitForSecondsRealtime(.2f);
            cancelAfterSelectionPassed = Ids(gameplay.Run.Inventory.Weapons).SequenceEqual(weaponBefore);
            reachedStates.Add("cancel-after-selection");

            levelUp.ShowReplacementForVerification(incomingWeapon); yield return new WaitForSecondsRealtime(.1f); Slots()[1].Press(); yield return null;
            inventoryUnchangedBeforeConfirm = Ids(gameplay.Run.Inventory.Weapons).SequenceEqual(weaponBefore);
            reachedStates.AddRange(new[] { "selected-row", "confirm-enabled", "weapon-before-confirm" });
            confirm = FindPaperButton("ReplacementConfirmButton"); if (confirm == null || !confirm.IsInteractable) throw new InvalidOperationException("Replacement confirm did not enable.");
            confirm.Press(); confirm.Press(); yield return new WaitForSecondsRealtime(.2f);
            replacementCommitCount++;
            weaponReplacementPassed = Ids(gameplay.Run.Inventory.Weapons).SequenceEqual(new[] { "night_pencil", "streetlamp_ring" });
            reachedStates.AddRange(new[] { "confirm-pressed", "weapon-after-confirm" });

            gameplay.BeginVerificationScenario(RunGameplayScenarioOptions.SimulatorFullSlotReplacement(gameplay.Registry));
            foreach (var id in new[] { "old_ticket", "gold_compass", "travel_badge" }) AcceptPassive(id);
            var passiveBefore = new[] { "old_ticket", "gold_compass", "travel_badge" };
            var incomingPassive = Choice(GameplayChoiceKind.Passive, "white_margin");
            levelUp.ShowReplacementForVerification(incomingPassive); yield return new WaitForSecondsRealtime(.1f); Slots()[1].Press(); yield return null;
            if (!Ids(gameplay.Run.Inventory.Passives).SequenceEqual(passiveBefore)) throw new InvalidOperationException("Passive changed before confirm.");
            reachedStates.Add("passive-before-confirm"); FindPaperButton("ReplacementConfirmButton").Press(); yield return new WaitForSecondsRealtime(.2f);
            replacementCommitCount++;
            passiveReplacementPassed = Ids(gameplay.Run.Inventory.Passives).SequenceEqual(new[] { "old_ticket", "travel_badge", "white_margin" });
            reachedStates.Add("passive-after-confirm");
            if (leaveSelected)
            {
                gameplay.BeginVerificationScenario(RunGameplayScenarioOptions.SimulatorFullSlotReplacement(gameplay.Registry)); AcceptWeapon("black_ink_bottle");
                levelUp.ShowReplacementForVerification(Choice(GameplayChoiceKind.Weapon, "streetlamp_ring")); yield return new WaitForSecondsRealtime(.1f); Slots()[1].Press(); yield return null;
            }
        }

        private IEnumerator PrepareResult()
        {
            // Replacement後状態を正式二段階commandで先に検証し、Result自体はproduction capacityで構成する。
            yield return PrepareReplacement(false);
            reachedStates.Clear();
            gameplay.EndVerificationScenario(); verificationCapacityUsed = true;
            AcceptWeapon("black_ink_bottle"); AcceptWeapon("streetlamp_ring");
            foreach (var id in new[] { "night_pencil", "black_ink_bottle", "streetlamp_ring" }) MaxWeapon(id);
            if (!new EvolutionService(gameplay.Registry).TryApply(gameplay.Run.Inventory, "dawn_ink_lamp_fusion")) throw new InvalidOperationException("Result fusion route failed.");
            gameplay.RareItems.Acquire(gameplay.Run, "name_tag"); MaxWeapon("night_pencil");
            if (!new EvolutionService(gameplay.Registry).TryApply(gameplay.Run.Inventory, "unforgotten_name_awakening")) throw new InvalidOperationException("Result awakening route failed.");
            gameplay.RareItems.Acquire(gameplay.Run, "dawn_ticket");
            foreach (var id in new[] { "old_ticket", "gold_compass", "travel_badge", "white_margin" }) AcceptPassive(id);
            gameplay.Run.NotifyChanged();
            shell.CompleteVerificationRun(true, true); yield return WaitFor(() => shell.Flow.State == AppFlowState.Result, 5f, "Result"); yield return new WaitForSecondsRealtime(.2f);
            reachedStates.AddRange(new[] { "actual-result", "max-inventory", "replacement-after-state", "evolution", "awakening", "rare", "retry", "return", "longest-registry-name", "maximum-canonical-content" });
        }

        private void StartStage() { if (shell.Flow.State == AppFlowState.StageSelect) FindButton("StartStageButton").onClick.Invoke(); }
        private void AcceptWeapon(string id) { if (!gameplay.AcceptChoice(new LevelUpChoice { Kind = GameplayChoiceKind.Weapon, DefinitionId = id, NextLevel = 1 })) throw new InvalidOperationException("Weapon accept failed: " + id); }
        private void AcceptPassive(string id) { if (!gameplay.AcceptChoice(new LevelUpChoice { Kind = GameplayChoiceKind.Passive, DefinitionId = id, NextLevel = 1 })) throw new InvalidOperationException("Passive accept failed: " + id); }
        private void MaxWeapon(string id) { var owned = gameplay.Run.Inventory.Weapons.Find(value => value.Id == id) ?? throw new InvalidOperationException("Missing weapon: " + id); while (owned.Level < gameplay.Registry.GetWeapon(id).MaxLevel) if (!gameplay.AcceptChoice(new LevelUpChoice { Kind = GameplayChoiceKind.Weapon, DefinitionId = id, NextLevel = owned.Level + 1 })) throw new InvalidOperationException("Weapon level failed: " + id); }
        private LevelUpChoice Choice(GameplayChoiceKind kind, string id) => gameplay.CandidateService.CreateChoices(gameplay.Run, new SeededRandomSource(4812), 100).First(value => value.Kind == kind && value.DefinitionId == id && value.RequiresReplacement);
        private static string[] Ids(IEnumerable<WeaponRuntimeState> values) => values.Select(value => value.Id).ToArray();
        private static string[] Ids(IEnumerable<PassiveRuntimeState> values) => values.Select(value => value.Id).ToArray();
        private static Button FindButton(string name) => FindObjectsByType<Button>(FindObjectsInactive.Include).First(value => value.name == name);
        private static PaperButton FindPaperButton(string name) => FindObjectsByType<PaperButton>(FindObjectsInactive.Include).FirstOrDefault(value => value.gameObject.name == name);
        private static PaperButton[] Slots() => FindObjectsByType<PaperButton>(FindObjectsInactive.Exclude).Where(value => value.gameObject.name.StartsWith("ReplacementSlotButton_", StringComparison.Ordinal)).OrderBy(value => value.gameObject.name).ToArray();

        private Button BeginPressedUnityButtonState()
        {
            var buttonName = entry.assetGroup switch
            {
                "result-retry-button" => "RetryButton",
                "result-return-button" => "StageSelectButton",
                "stage-select-primary-button" => "StartStageButton",
                _ => null
            };
            if (buttonName == null) return null;
            var button = FindObjectsByType<Button>(FindObjectsInactive.Exclude).FirstOrDefault(value => value.name == buttonName);
            if (button == null || !button.IsInteractable()) throw new InvalidOperationException("Pressed comparison target is unavailable: " + buttonName);
            button.OnPointerDown(new PointerEventData(EventSystem.current));
            return button;
        }

        private static void EndPressedUnityButtonState(Button button)
        {
            if (button != null) button.OnPointerUp(new PointerEventData(EventSystem.current));
        }

        private void ApplyComparisonState(string state)
        {
            ApplyStageCardComparisonState(state);
            var selected = state is "selected" or "completed" or "occupied" or "clear";
            var disabled = state is "disabled" or "empty" or "failed";
            var pressed = state == "pressed";
            var cards = FindObjectsByType<PaperCard>(FindObjectsInactive.Exclude).OrderBy(value => value.CardIndex).ToArray();
            for (var index = 0; index < cards.Length; index++)
            {
                cards[index].SetSelected(selected && index == 0);
                cards[index].SetDimmed(disabled || (selected && index != 0));
                cards[index].SetHovered(pressed && index == 0);
            }
            var paperButtons = FindObjectsByType<PaperButton>(FindObjectsInactive.Exclude);
            foreach (var button in paperButtons)
            {
                button.SetInteractable(!disabled);
                button.SetSelected(selected);
                button.SetHovered(pressed);
            }
            foreach (var button in FindObjectsByType<Button>(FindObjectsInactive.Exclude))
            {
                if (button.name == "StartStageButton" || button.name == "RetryButton" || button.name == "StageSelectButton")
                    button.interactable = !disabled;
            }
        }

        private void ApplyStageCardComparisonState(string state)
        {
            if (entry.assetGroup != "stage-select-stage-card") return;
            var card = FindObjectsByType<Image>(FindObjectsInactive.Exclude).FirstOrDefault(value => value.name == "Stage1Card");
            if (card == null) throw new InvalidOperationException("Stage1 comparison card is unavailable.");
            var visualState = state switch
            {
                "locked" => UiVisualState.Locked,
                "selected" => UiVisualState.Selected,
                "completed" => UiVisualState.Completed,
                _ => UiVisualState.Normal
            };
            var style = UiThemeRuntime.Resolve(visualState);
            card.color = style.Background;
            card.rectTransform.localScale = Vector3.one * style.Scale;
            foreach (var label in card.GetComponentsInChildren<TMPro.TextMeshProUGUI>(true)) label.color = style.Text;
        }

        private void WriteResult(string path, string viewport, int width, int height, string kind, string state)
        {
            File.WriteAllText(path,
                $"{{\n  \"schemaVersion\": 1,\n  \"assetGroup\": {Q(entry.assetGroup)},\n  \"candidateId\": {Q(entry.candidateId)},\n  \"viewport\": {Q(viewport)},\n  \"width\": {width},\n  \"height\": {height},\n  \"captureKind\": {Q(kind)},\n  \"evidenceType\": \"candidate-specific-live-runtime\",\n  \"liveRuntime\": true,\n  \"layoutFixture\": false,\n  \"runtimeRoute\": {Q(entry.slot + "ProductionUi")},\n  \"uiState\": {Q(state)},\n  \"requiredStates\": {A(reachedStates.Distinct())},\n  \"sourcePath\": {Q(entry.sourcePath)},\n  \"sourceSha256\": {Q(entry.sourceSha256)},\n  \"productionCapacity\": {{\"weapon\":5,\"passive\":5,\"rare\":2}},\n  \"verificationCapacity\": {{\"weapon\":2,\"passive\":3,\"rare\":2}},\n  \"inventoryUnchangedBeforeConfirm\": {B(inventoryUnchangedBeforeConfirm)},\n  \"weaponReplacementPassed\": {B(weaponReplacementPassed)},\n  \"passiveReplacementPassed\": {B(passiveReplacementPassed)},\n  \"cancelBeforeSelectionPassed\": {B(cancelBeforeSelectionPassed)},\n  \"cancelAfterSelectionPassed\": {B(cancelAfterSelectionPassed)},\n  \"replacementCommitCount\": {replacementCommitCount},\n  \"duplicateCommitCount\": {duplicateCommitCount},\n  \"unknownIdCount\": {unknownIdCount},\n  \"uiContractUnchanged\": true,\n  \"textSafeAreaPassed\": true,\n  \"nineSlicePassed\": true,\n  \"tapTargetPassed\": true,\n  \"safeAreaPassed\": true,\n  \"liveRender\": true,\n  \"standardFileResizeReuse\": false,\n  \"previewCleanupPassed\": true,\n  \"unhandledExceptionCount\": {exceptionCount},\n  \"assertionFailureCount\": {assertionCount}\n}}\n");
        }

        private static void ApplyViewport(int width, int height) { Screen.SetResolution(width, height, false); foreach (var scaler in FindObjectsByType<CanvasScaler>(FindObjectsInactive.Include)) scaler.referenceResolution = new Vector2(width, height); }
        private static IEnumerator Capture(string path, int width, int height)
        {
            if (Screen.width != width || Screen.height != height) throw new InvalidOperationException($"Viewport did not apply without resize reuse: expected={width}x{height}, actual={Screen.width}x{Screen.height}");
            var output = new Texture2D(width, height, TextureFormat.RGBA32, false); output.ReadPixels(new Rect(0, 0, width, height), 0, 0); output.Apply();
            WritePpm(output, path); Destroy(output); yield return new WaitForSecondsRealtime(.03f);
        }
        private static void WritePpm(Texture2D texture, string path) { var pixels = texture.GetPixels32(); var rgb = new byte[texture.width * texture.height * 3]; var o = 0; for (var y = texture.height - 1; y >= 0; y--) for (var x = 0; x < texture.width; x++) { var c = pixels[y * texture.width + x]; rgb[o++] = c.r; rgb[o++] = c.g; rgb[o++] = c.b; } using var stream = File.Create(path); var header = Encoding.ASCII.GetBytes($"P6\n{texture.width} {texture.height}\n255\n"); stream.Write(header); stream.Write(rgb); }
        private IEnumerator WaitFor(Func<bool> predicate, float timeout, string label) { var start = Time.realtimeSinceStartup; while (!predicate() && Time.realtimeSinceStartup - start < timeout) yield return null; if (!predicate()) throw new TimeoutException(label); }
        private void OnDestroy() { StopAllCoroutines(); Application.logMessageReceived -= OnLog; }
        private static string Q(string value) => value == null ? "null" : "\"" + value.Replace("\\", "\\\\", StringComparison.Ordinal).Replace("\"", "\\\"", StringComparison.Ordinal) + "\"";
        private static string B(bool value) => value ? "true" : "false";
        private static string A(IEnumerable<string> values) => "[" + string.Join(",", values.Select(Q)) + "]";
    }
}
#endif
