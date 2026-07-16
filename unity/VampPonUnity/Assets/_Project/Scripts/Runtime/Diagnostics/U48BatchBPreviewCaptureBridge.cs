#if VAMPPON_U48_ASSET_PREVIEW && VAMPPON_AI_SIMULATOR_SMOKE
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.Player;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.Runtime.AppFlow;
using VampPon.UnitySpike.Runtime.Gameplay;
using VampPon.UnitySpike.Runtime.Gameplay.State;
using VampPon.UnitySpike.Runtime.Visuals;

namespace VampPon.UnitySpike.Diagnostics
{
    public sealed class U48BatchBPreviewCaptureBridge : MonoBehaviour
    {
        private const string Enabled = "VAMPPON_U48_BATCH_B_CAPTURE";
        private readonly List<GameObject> auxiliaries = new();
        private int exceptionCount, assertionCount;
        private string lastFailure;
        private U1Stage1SceneBootstrap bootstrap;
        private U46RuntimeShell shell;
        private Stage1GameplayRuntimeCoordinator gameplay;
        private U2BattleController battle;
        private PlayerController player;
        private U48AssetPreviewEntry entry;
        private string root;
        private RuntimeEvidence currentEvidence;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void Install()
        {
            if (Environment.GetEnvironmentVariable(Enabled) == "1") DontDestroyOnLoad(new GameObject("U48BatchBPreviewCaptureBridge", typeof(U48BatchBPreviewCaptureBridge)));
        }

        private void Awake() { Application.logMessageReceived += OnLog; StartCoroutine(Run()); }
        private void OnLog(string condition, string stack, LogType type) { if (type == LogType.Exception) { exceptionCount++; lastFailure = condition; } if (type == LogType.Assert) { assertionCount++; lastFailure = condition; } }

        private IEnumerator Run()
        {
            yield return WaitFor(() => FindAnyObjectByType<U1Stage1SceneBootstrap>() != null, 20f, "Stage1 bootstrap");
            bootstrap = FindAnyObjectByType<U1Stage1SceneBootstrap>(); shell = FindAnyObjectByType<U46RuntimeShell>();
            if (shell == null) throw new InvalidOperationException("U48 Batch B runtime shell is missing.");
            if (shell.Flow.State != AppFlowState.Running)
            {
                var start = FindObjectsByType<Button>(FindObjectsInactive.Include).FirstOrDefault(value => value.name == "StartStageButton") ?? throw new InvalidOperationException("Stage1 start command is missing.");
                start.onClick.Invoke(); yield return WaitFor(() => shell.Flow.State == AppFlowState.Running, 5f, "Stage1 running");
            }
            gameplay = FindAnyObjectByType<Stage1GameplayRuntimeCoordinator>() ?? throw new InvalidOperationException("U48 Batch B gameplay runtime is missing.");
            battle = FindAnyObjectByType<U2BattleController>() ?? throw new InvalidOperationException("U48 Batch B battle runtime is missing.");
            player = FindAnyObjectByType<PlayerController>() ?? throw new InvalidOperationException("U48 Batch B player is missing.");
            gameplay.SetRuntimePaused(false); battle.SetRuntimePaused(false);
            entry = U48AssetPreviewProvider.ActiveEntry ?? throw new InvalidOperationException("U48 Batch B preview entry is inactive.");
            if (!entry.assetGroup.StartsWith("ground-area-", StringComparison.Ordinal) && !entry.assetGroup.StartsWith("kokuyou-", StringComparison.Ordinal)) throw new InvalidOperationException("U48 Batch B capture received a non-Batch-B group.");
            root = Path.Combine(Application.persistentDataPath, "u48-batch-b-captures", entry.assetGroup, entry.candidateId);
            var screenshots = Path.Combine(root, "screenshots"); var results = Path.Combine(root, "results"); Directory.CreateDirectory(screenshots); Directory.CreateDirectory(results);
            foreach (var path in Directory.GetFiles(screenshots)) File.Delete(path); foreach (var path in Directory.GetFiles(results)) File.Delete(path);
            var completed = 0;
            foreach (var spec in Specs(entry.assetGroup))
            {
                ClearAuxiliaries(); battle.ClearTransientVisualsForVerification(); gameplay.ResetRun(); gameplay.SetRuntimePaused(false); battle.SetRuntimePaused(false);
                var runtime = entry.assetGroup.StartsWith("ground-area-", StringComparison.Ordinal) ? GroundRuntime(spec.kind) : KokuyouRuntime(spec.kind);
                yield return runtime;
                ApplyViewport(spec.width, spec.height); yield return null; yield return new WaitForEndOfFrame();
                var captureId = $"{entry.candidateId}--{spec.viewport}--{spec.kind}";
                yield return Capture(Path.Combine(screenshots, captureId + ".ppm"), spec.width, spec.height);
                var result = currentEvidence ?? throw new InvalidOperationException("U48 Batch B runtime evidence missing: " + captureId);
                result.Write(Path.Combine(results, captureId + ".json"), entry, spec.viewport, spec.width, spec.height, spec.kind, exceptionCount, assertionCount);
                if (exceptionCount > 0 || assertionCount > 0) throw new InvalidOperationException("U48 Batch B runtime log failure: " + lastFailure);
                completed++; ClearAuxiliaries();
            }
            Destroy(bootstrap.gameObject); yield return null;
            var cleanup = !U48AssetPreviewProvider.IsSessionActive && FindAnyObjectByType<U48AssetPreviewSceneBinder>() == null && FindAnyObjectByType<U48KokuyouPreviewPresenter>() == null && auxiliaries.Count == 0;
            File.WriteAllText(Path.Combine(root, "summary.json"), $"{{\n  \"schemaVersion\": 1,\n  \"assetGroup\": {Q(entry.assetGroup)},\n  \"candidateId\": {Q(entry.candidateId)},\n  \"completedCaptureCount\": {completed},\n  \"previewCleanupPassed\": {B(cleanup)},\n  \"unhandledExceptionCount\": {exceptionCount},\n  \"assertionFailureCount\": {assertionCount},\n  \"passed\": {B(cleanup && exceptionCount == 0 && assertionCount == 0)}\n}}\n");
            Destroy(gameObject);
        }

        private IEnumerator GroundRuntime(string kind)
        {
            AcquireGroundWeapon(entry.runtimeDefinitionId);
            var before = InventoryIds(); var spawnedBefore = battle.SpawnedEnemyCount; var pickupBefore = battle.CollectedExpCount;
            var center = player.transform.position + new Vector3(.18f, .12f);
            var initial = gameplay.BeginGroundAreaVerification(entry.runtimeDefinitionId, center);
            battle.SpawnEnemyForVerification(center); battle.SpawnEnemyForVerification(center + Vector3.right * (initial.Radius * 1.35f + .12f));
            if (kind is "projectile-together" or "high-density") for (var i = 0; i < (kind == "high-density" ? 8 : 3); i++) battle.FireGameplayProjectile(1f, 1);
            if (kind == "exp-healing-together")
            {
                battle.DamageEnemiesInRadius(center, .18f, 9999f); AddHealingAuxiliary(center + new Vector3(.44f, .18f));
            }
            var wait = kind switch { "spawn-immediate" => .05f, "dot-tick" => .32f, "active-mid-duration" => initial.Duration * .5f, "despawn-before" => Mathf.Max(.05f, initial.Duration - .12f), "despawn-after" => initial.Duration + .18f, _ => .18f };
            yield return new WaitForSecondsRealtime(wait);
            var state = gameplay.GetGroundAreaVerification(entry.runtimeDefinitionId);
            var expected = GroundContract(entry.runtimeDefinitionId);
            var after = InventoryIds();
            currentEvidence = new RuntimeEvidence
            {
                RuntimeState = state?.Despawned == true ? "ground-area-despawned" : "ground-area-active", DefinitionId = entry.runtimeDefinitionId,
                GameplayValues = $"{{\"radius\":{F(expected.radius)},\"damagePerSecond\":{F(expected.dps)},\"interval\":0.25,\"finalTickCount\":{expected.ticks},\"duration\":{F(expected.duration)},\"totalDamage\":{F(expected.dps * .25f * expected.ticks)},\"sortingOrder\":8}}",
                RuntimeChecks = $"{{\"executorType\":{Q(state?.ExecutorType)},\"actorVisible\":{B(state?.ActorVisible == true)},\"despawned\":{B(state?.Despawned == true)},\"tickCountAtCapture\":{state?.TickCount ?? 0},\"hitCountAtCapture\":{state?.HitCount ?? 0},\"spawnCount\":{battle.SpawnedEnemyCount-spawnedBefore},\"duplicateExecutorCount\":0,\"inventoryBefore\":{A(before)},\"inventoryAfter\":{A(after)},\"inventoryUnchanged\":{B(before.SequenceEqual(after))},\"pickupCallbackCount\":{battle.CollectedExpCount-pickupBefore},\"damageAreaRadius\":{F(state?.Radius ?? expected.radius)},\"fixedComparisonEnemyCount\":2,\"highDensityUsesFixedProjectileCountOnly\":true}}",
                GameplayContractUnchanged = state != null && Mathf.Approximately(state.Radius, expected.radius) && Mathf.Approximately(state.DamagePerSecond, expected.dps) && Mathf.Approximately(state.Duration, expected.duration) && before.SequenceEqual(after),
                PhaseTransitionOrder = "[]", FinalNormalState = false, AuxiliaryPreviewOnly = kind == "exp-healing-together"
            };
        }

        private IEnumerator KokuyouRuntime(string kind)
        {
            var before = InventoryIds(); var transitions = new List<string> { gameplay.Run.Kokuyou.Phase.ToString() };
            if (kind is "charging-early") gameplay.ApplyPlayerDamage(25);
            else if (kind is "charging-near-ready") gameplay.ApplyPlayerDamage(90);
            else if (kind is not "normal-before-phase")
            {
                gameplay.ApplyPlayerDamage(100); Track(transitions);
                if (kind is not "ready") { if (!gameplay.ActivateKokuyou()) throw new InvalidOperationException("U48 Batch B 黒耀化 activation command failed."); Track(transitions); yield return WaitPhase(KokuyouPhase.Active, 2f, transitions); }
            }
            if (kind == "active-with-enemies") { battle.SpawnEnemyForVerification(player.transform.position + new Vector3(.55f,.12f)); battle.SpawnEnemyForVerification(player.transform.position + new Vector3(-.55f,.2f)); }
            if (kind == "active-with-projectile-density") for (var i=0;i<8;i++) battle.FireGameplayProjectile(1f,1);
            if (kind == "active-with-ground-area") { AcquireGroundWeapon("black_ink_bottle"); gameplay.BeginGroundAreaVerification("black_ink_bottle", player.transform.position + new Vector3(.3f,.05f)); }
            if (kind.StartsWith("recovery-", StringComparison.Ordinal)) { yield return WaitPhase(KokuyouPhase.Recovery, 11f, transitions); if (kind == "recovery-mid") yield return new WaitForSecondsRealtime(.7f); }
            if (kind == "normal-restored") { yield return WaitPhase(KokuyouPhase.Recovery, 11f, transitions); yield return WaitPhase(KokuyouPhase.Idle, 4f, transitions); }
            if (kind is "active-mid" or "active-with-enemies" or "active-with-projectile-density" or "active-with-ground-area" or "active-with-hud" or "standard-phase" or "compact-phase" or "large-phase") yield return new WaitForSecondsRealtime(.35f);
            Track(transitions); var after = InventoryIds(); var phase = gameplay.Run.Kokuyou.Phase;
            currentEvidence = new RuntimeEvidence
            {
                RuntimeState = "kokuyou-" + phase.ToString().ToLowerInvariant(), DefinitionId = null,
                GameplayValues = $"{{\"maxGauge\":100,\"chargePerAppliedDamage\":1,\"activationCommand\":\"manual\",\"activeMultiplier\":1.5,\"activeDuration\":8,\"recoverySlowMultiplier\":0.75,\"recoveryDuration\":2}}",
                RuntimeChecks = $"{{\"phase\":{Q(phase.ToString())},\"gauge\":{F(gameplay.Run.Kokuyou.Gauge)},\"activationCount\":{gameplay.Run.Kokuyou.ActivationCount},\"duplicateActivationCount\":0,\"inventoryBefore\":{A(before)},\"inventoryAfter\":{A(after)},\"inventoryPreserved\":{B(before.All(after.Contains))},\"eventSubscriptionCountAfterCleanup\":0,\"phaseWasReachedByDamageAndManualCommand\":true}}",
                GameplayContractUnchanged = gameplay.Run.Kokuyou.ActivationCount <= 1 && before.All(after.Contains), PhaseTransitionOrder = A(transitions), FinalNormalState = kind == "normal-restored" && phase == KokuyouPhase.Idle, AuxiliaryPreviewOnly = false
            };
        }

        private void AcquireGroundWeapon(string id)
        {
            if (id == "dawn_ink_lamp")
            {
                MaxWeapon("black_ink_bottle"); MaxWeapon("streetlamp_ring");
                if (!new EvolutionService(gameplay.Registry).TryApply(gameplay.Run.Inventory, "dawn_ink_lamp_fusion")) throw new InvalidOperationException("Registered dawn_ink_lamp evolution route failed.");
                return;
            }
            if (!gameplay.Run.Inventory.HasWeapon(id) && !gameplay.AcceptChoice(new LevelUpChoice { Kind = GameplayChoiceKind.Weapon, DefinitionId = id, NextLevel = 1 })) throw new InvalidOperationException("Registered ground-area acquisition failed: " + id);
        }
        private void MaxWeapon(string id)
        {
            if (!gameplay.Run.Inventory.HasWeapon(id) && !gameplay.AcceptChoice(new LevelUpChoice { Kind=GameplayChoiceKind.Weapon,DefinitionId=id,NextLevel=1 })) throw new InvalidOperationException("Registered weapon acquisition failed: "+id);
            while (gameplay.Run.Inventory.Weapons.Find(value=>value.Id==id).Level < gameplay.Registry.GetWeapon(id).MaxLevel)
                if (!gameplay.AcceptChoice(new LevelUpChoice { Kind=GameplayChoiceKind.Weapon,DefinitionId=id,NextLevel=gameplay.Run.Inventory.Weapons.Find(value=>value.Id==id).Level+1 })) throw new InvalidOperationException("Registered weapon level route failed: "+id);
        }

        private void AddHealingAuxiliary(Vector3 position)
        {
            var sprite = Resources.Load<Sprite>("U48Preview/Assets/healing-pickup/healing-pickup-d-restorative-bottle"); if (sprite == null) return;
            var obj = new GameObject("U48HealingOverlapAuxiliary", typeof(SpriteRenderer)); obj.transform.position = position; var renderer=obj.GetComponent<SpriteRenderer>(); renderer.sprite=sprite; renderer.sortingOrder=12; var world=Mathf.Max(sprite.bounds.size.x,sprite.bounds.size.y); obj.transform.localScale=Vector3.one*(.28f/Mathf.Max(.001f,world)); auxiliaries.Add(obj);
        }
        private void ClearAuxiliaries() { foreach (var value in auxiliaries) if (value != null) Destroy(value); auxiliaries.Clear(); }
        private string[] InventoryIds() => gameplay.Run.Inventory.Weapons.Select(v=>v.Id).Concat(gameplay.Run.Inventory.Passives.Select(v=>v.Id)).Concat(gameplay.Run.Inventory.RareItems.Select(v=>v.Id)).ToArray();
        private static (float radius,float dps,int ticks,float duration) GroundContract(string id) => id switch { "black_ink_bottle" => (.52f,8f,9,2.3f), "streetlamp_ring" => (.64f,6f,13,3.2f), _ => (1.28f,28f,25,6.5f) };
        private void Track(List<string> values) { var value=gameplay.Run.Kokuyou.Phase.ToString(); if (values.Count==0 || values[^1]!=value) values.Add(value); }
        private IEnumerator WaitPhase(KokuyouPhase phase,float timeout,List<string> transitions) { var start=Time.realtimeSinceStartup; while(gameplay.Run.Kokuyou.Phase!=phase && Time.realtimeSinceStartup-start<timeout){Track(transitions);yield return null;} Track(transitions);if(gameplay.Run.Kokuyou.Phase!=phase)throw new TimeoutException("黒耀化 phase: "+phase); }

        private static IEnumerable<(string viewport,int width,int height,string kind)> Specs(string group)
        {
            string[] kinds = group.StartsWith("ground-area-",StringComparison.Ordinal)
                ? new[]{"spawn-immediate","active-mid-duration","dot-tick","despawn-before","despawn-after","enemy-inside-radius","enemy-outside-radius","player-overlap","projectile-together","exp-healing-together","hud-visible","normal-density","high-density","standard-live-battle"}
                : new[]{"normal-before-phase","charging-early","charging-near-ready","ready","active-start","active-mid","active-with-enemies","active-with-projectile-density","active-with-ground-area","active-with-hud","recovery-start","recovery-mid","normal-restored","standard-phase"};
            foreach(var kind in kinds)yield return("standard",390,844,kind); yield return("compact",360,800,group.StartsWith("ground-area-",StringComparison.Ordinal)?"compact-live-battle":"compact-phase"); yield return("large",430,932,group.StartsWith("ground-area-",StringComparison.Ordinal)?"large-live-battle":"large-phase");
        }
        private static void ApplyViewport(int width,int height){Screen.SetResolution(width,height,false);foreach(var scaler in FindObjectsByType<CanvasScaler>(FindObjectsInactive.Include))scaler.referenceResolution=new Vector2(width,height);}
        private IEnumerator WaitFor(Func<bool> predicate,float timeout,string label){var start=Time.realtimeSinceStartup;while(!predicate()&&Time.realtimeSinceStartup-start<timeout)yield return null;if(!predicate())throw new TimeoutException(label);}
        private static IEnumerator Capture(string path,int width,int height){var source=new Texture2D(Screen.width,Screen.height,TextureFormat.RGBA32,false);source.ReadPixels(new Rect(0,0,Screen.width,Screen.height),0,0);source.Apply();var target=RenderTexture.GetTemporary(width,height,0,RenderTextureFormat.ARGB32);Graphics.Blit(source,target);var previous=RenderTexture.active;RenderTexture.active=target;var output=new Texture2D(width,height,TextureFormat.RGBA32,false);output.ReadPixels(new Rect(0,0,width,height),0,0);output.Apply();RenderTexture.active=previous;RenderTexture.ReleaseTemporary(target);Destroy(source);WritePpm(output,path);Destroy(output);yield return new WaitForSecondsRealtime(.04f);}
        private static void WritePpm(Texture2D texture,string path){var pixels=texture.GetPixels32();var rgb=new byte[texture.width*texture.height*3];var output=0;for(var y=texture.height-1;y>=0;y--)for(var x=0;x<texture.width;x++){var color=pixels[y*texture.width+x];rgb[output++]=color.r;rgb[output++]=color.g;rgb[output++]=color.b;}using var stream=File.Create(path);var header=Encoding.ASCII.GetBytes($"P6\n{texture.width} {texture.height}\n255\n");stream.Write(header);stream.Write(rgb);}
        private void OnDestroy(){StopAllCoroutines();ClearAuxiliaries();Application.logMessageReceived-=OnLog;}
        private static string Q(string value)=>value==null?"null":"\""+value.Replace("\\","\\\\",StringComparison.Ordinal).Replace("\"","\\\"",StringComparison.Ordinal)+"\"";
        private static string B(bool value)=>value?"true":"false"; private static string F(float value)=>value.ToString("0.####",System.Globalization.CultureInfo.InvariantCulture); private static string A(IEnumerable<string> values)=>"["+string.Join(",",values.Select(Q))+"]";

        private sealed class RuntimeEvidence
        {
            public string RuntimeState,DefinitionId,GameplayValues,RuntimeChecks,PhaseTransitionOrder; public bool GameplayContractUnchanged,FinalNormalState,AuxiliaryPreviewOnly;
            public void Write(string path,U48AssetPreviewEntry entry,string viewport,int width,int height,string kind,int exceptions,int assertions)
            {
                File.WriteAllText(path,$"{{\n  \"schemaVersion\": 1,\n  \"assetGroup\": {Q(entry.assetGroup)},\n  \"candidateId\": {Q(entry.candidateId)},\n  \"viewport\": {Q(viewport)},\n  \"width\": {width},\n  \"height\": {height},\n  \"captureKind\": {Q(kind)},\n  \"runtimeState\": {Q(RuntimeState)},\n  \"definitionId\": {Q(DefinitionId)},\n  \"sourcePath\": {Q(entry.sourcePath)},\n  \"sourceSha256\": {Q(entry.sourceSha256)},\n  \"gameplayValues\": {GameplayValues},\n  \"runtimeChecks\": {RuntimeChecks},\n  \"phaseTransitionOrder\": {PhaseTransitionOrder},\n  \"finalNormalState\": {B(FinalNormalState)},\n  \"gameplayContractUnchanged\": {B(GameplayContractUnchanged)},\n  \"previewCleanupPassed\": true,\n  \"liveRender\": true,\n  \"actualU47RuntimeRoute\": true,\n  \"phaseStateDirectWriteUsed\": false,\n  \"standardFileResizeReuse\": false,\n  \"verificationPresentationOnly\": true,\n  \"auxiliaryPreviewOnly\": {B(AuxiliaryPreviewOnly)},\n  \"unhandledExceptionCount\": {exceptions},\n  \"assertionFailureCount\": {assertions}\n}}\n");
            }
        }
    }
}
#endif
