#if VAMPPON_AI_SIMULATOR_SMOKE
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.SceneManagement;
using VampPon.UnitySpike.Player;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U4;
using VampPon.UnitySpike.UI;
using VampPon.UnitySpike.Runtime.Visuals;

namespace VampPon.UnitySpike.Diagnostics
{
    public sealed class U45AiSimulatorSmokeBridge : MonoBehaviour
    {
        private const string LaunchArgument = "--u45-ai-simulator-smoke";
        private const string LaunchEnvironmentVariable = "VAMPPON_U45_AI_SIMULATOR_SMOKE";
        private const string DeviceNameEnvironmentVariable = "VAMPPON_U45_SIMULATOR_DEVICE";
        private const string RuntimeEnvironmentVariable = "VAMPPON_U45_SIMULATOR_RUNTIME";
        private const string UdidEnvironmentVariable = "VAMPPON_U45_SIMULATOR_UDID";
        private readonly List<string> log = new();
        private string outputRoot;
        private string screenshotRoot;
        private int unhandledExceptionCount;
        private bool crashDetected;

        private bool bootReady;
        private bool stageSelectVisible;
        private bool stageSelectPauseReady;
        private bool stageStartRouteReady;
        private bool battleResumeReady;
        private bool movementRouteReady;
        private bool movementStopsOnRelease;
        private bool nonStickAreaIgnored;
        private bool uiMovementCollisionGuardReady;
        private bool enemyHitReady;
        private bool pickupReady;
        private bool levelUpCommonReady;
        private bool levelUpRareReady;
        private bool levelUpEvolutionReady;
        private bool levelUpTapReady;
        private bool resultPauseReady;
        private bool retryReady;
        private bool stageSelectReturnReady;
        private bool audioHookRequestReady;
        private bool hapticHookRequestReady;
        private bool duplicateEventSystemDetected;
        private bool duplicateAudioListenerDetected;
        private bool screenshotsReady;
        private bool productionVisualProviderReady;
        private bool proofProviderUnused;
        private bool runtimeVisualSourcesReady;
        private bool yuiIdleReady;
        private bool yuiWalkRightReady;
        private bool yuiWalkLeftReady;
        private bool yuiReleaseIdleReady;
        private bool yuiFacingHeldOnRelease;
        private bool yuiHurtReady;
        private bool yuiAttackReady;
        private bool yuiPauseReady;
        private bool yuiRetryResetReady;
        private bool onbuMoveReady;
        private bool onbuHurtReady;
        private bool onbuDeathReady;
        private bool onbuPoolReturnReady;
        private bool onbuRespawnResetReady;
        private bool proceduralFallbackUnused;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
        private static void Install()
        {
            if (Application.platform != RuntimePlatform.IPhonePlayer)
            {
                return;
            }

            var probeRoot = Path.Combine(Application.persistentDataPath, "u45-ai-simulator-smoke");
            Directory.CreateDirectory(probeRoot);
            File.WriteAllText(
                Path.Combine(probeRoot, "bootstrap.txt"),
                "platform=" + Application.platform + Environment.NewLine +
                "args=" + string.Join("|", Environment.GetCommandLineArgs()) + Environment.NewLine +
                "environmentGate=" + Environment.GetEnvironmentVariable(LaunchEnvironmentVariable) + Environment.NewLine);

            var argumentEnabled = Environment.GetCommandLineArgs().Contains(LaunchArgument, StringComparer.Ordinal);
            var environmentEnabled = string.Equals(
                Environment.GetEnvironmentVariable(LaunchEnvironmentVariable),
                "1",
                StringComparison.Ordinal);
            if (!argumentEnabled && !environmentEnabled) return;

            var root = new GameObject("U45AiSimulatorSmokeBridge", typeof(U45AiSimulatorSmokeBridge));
            DontDestroyOnLoad(root);
        }

        private void Awake()
        {
            outputRoot = Path.Combine(Application.persistentDataPath, "u45-ai-simulator-smoke");
            screenshotRoot = Path.Combine(outputRoot, "screenshots");
            Directory.CreateDirectory(screenshotRoot);
            Application.logMessageReceived += OnLog;
            StartCoroutine(Run());
        }

        private void OnDestroy()
        {
            Application.logMessageReceived -= OnLog;
        }

        private void OnLog(string condition, string stackTrace, LogType type)
        {
            log.Add($"[{DateTime.UtcNow:O}] {type}: {condition}");
            if (type == LogType.Exception || type == LogType.Assert)
            {
                unhandledExceptionCount++;
            }
        }

        private IEnumerator Run()
        {
            yield return WaitUntil(() => SceneManager.GetActiveScene().name == "Stage1" && FindController() != null, 18f, "Stage1 runtime");
            bootReady = SceneManager.GetActiveScene().name == "Stage1";

            var controller = FindController();
            var player = FindPlayer();
            var bootstrap = UnityEngine.Object.FindAnyObjectByType<U1Stage1SceneBootstrap>();
            var yuiAnimator = UnityEngine.Object.FindAnyObjectByType<YuiSpriteAnimator>();
            productionVisualProviderReady = bootstrap != null && bootstrap.AssetProviderName == "RuntimeVisualAssetProvider";
            proofProviderUnused = bootstrap != null && !bootstrap.AssetProviderIsProofOnly;
            runtimeVisualSourcesReady = bootstrap?.BattleVisualAssets?.PlayerSourcePath?.Contains("RuntimeVisuals", StringComparison.Ordinal) == true &&
                                        bootstrap.BattleVisualAssets.EnemySourcePath?.Contains("RuntimeVisuals", StringComparison.Ordinal) == true;
            proceduralFallbackUnused = bootstrap != null && !bootstrap.DevelopmentVisualFallbackUsed;
            yuiIdleReady = yuiAnimator != null && yuiAnimator.State == RuntimeCharacterAnimationState.Idle;
            var stageSelect = GameObject.Find("U43StageSelectRuntimeOverlay");
            stageSelectVisible = stageSelect != null && stageSelect.activeInHierarchy;
            var stageSnapshot = new Snapshot(controller);
            yield return new WaitForSecondsRealtime(0.7f);
            stageSelectPauseReady = IsPausedAndFrozen(stageSnapshot, requireStageSelect: true, requireResult: false);
            stageStartRouteReady = FindButton("Stage1へ") != null;
            yield return Capture("01-stage-select.png");

            PressButton("Stage1へ");
            yield return new WaitForSecondsRealtime(0.6f);
            controller = FindController();
            player = FindPlayer();
            battleResumeReady = controller != null && !controller.IsRuntimePaused && player != null && !player.RuntimeInputBlocked;
            yield return Capture("02-yui-idle.png");

            if (player != null)
            {
                var before = player.transform.position;
                player.SetVerificationMoveInput(new Vector2(0.85f, 0.35f));
                yield return new WaitForSecondsRealtime(0.55f);
                movementRouteReady = Vector2.Distance(before, player.transform.position) > 0.05f && player.CurrentVelocity.sqrMagnitude > 0.01f;
                yuiWalkRightReady = yuiAnimator != null && yuiAnimator.State == RuntimeCharacterAnimationState.Walk && yuiAnimator.Facing == RuntimeFacing.Right;
                yield return Capture("03-yui-walk-right.png");

                player.SetVerificationMoveInput(new Vector2(-0.85f, 0.2f));
                yield return new WaitForSecondsRealtime(0.45f);
                yield return WaitUntil(
                    () => yuiAnimator != null && yuiAnimator.State == RuntimeCharacterAnimationState.Walk && yuiAnimator.Facing == RuntimeFacing.Left,
                    2f,
                    "Yui walk left");
                yuiWalkLeftReady = yuiAnimator != null && yuiAnimator.State == RuntimeCharacterAnimationState.Walk && yuiAnimator.Facing == RuntimeFacing.Left;
                yield return Capture("04-yui-walk-left.png");
                player.SetVerificationMoveInput(Vector2.zero);
                yield return new WaitForSecondsRealtime(0.5f);
                movementStopsOnRelease = player.CurrentVelocity.sqrMagnitude < 0.01f;
                yield return WaitUntil(() => yuiAnimator != null && yuiAnimator.State == RuntimeCharacterAnimationState.Idle, 2f, "Yui release idle");
                yuiReleaseIdleReady = yuiAnimator != null && yuiAnimator.State == RuntimeCharacterAnimationState.Idle;
                yuiFacingHeldOnRelease = yuiAnimator != null && yuiAnimator.Facing == RuntimeFacing.Left;
                player.ClearVerificationMoveInput();
            }

            nonStickAreaIgnored = VerifyMovementAreaGeometry();

            controller?.NotifyPlayerDamageVisual();
            yield return WaitUntil(() => yuiAnimator != null && yuiAnimator.State == RuntimeCharacterAnimationState.Hurt, 2f, "Yui hurt");
            yuiHurtReady = yuiAnimator != null && yuiAnimator.State == RuntimeCharacterAnimationState.Hurt;
            yield return Capture("05-yui-hurt.png");
            yield return new WaitForSecondsRealtime(0.35f);

            if (controller != null && player != null)
            {
                controller.SpawnEnemyForVerification(player.transform.position + new Vector3(1.35f, 0f, 0f));
                yield return WaitUntil(() => yuiAnimator != null && yuiAnimator.State == RuntimeCharacterAnimationState.Attack, 5f, "Yui attack event");
                yuiAttackReady = yuiAnimator != null && yuiAnimator.State == RuntimeCharacterAnimationState.Attack;
                yield return Capture("06-yui-attack.png");

                var animatedEnemy = controller.FindActiveEnemyForVerification();
                if (animatedEnemy != null)
                {
                    yield return new WaitForSecondsRealtime(0.2f);
                    yield return WaitUntil(() => animatedEnemy.AnimationState == RuntimeEnemyAnimationState.Move, 2f, "Onbu move");
                    controller.IsolateEnemyForVerification(animatedEnemy, player.transform.position + new Vector3(1.55f, 0.15f, 0f));
                    controller.SetRuntimePaused(true);
                    onbuMoveReady = animatedEnemy.AnimationState == RuntimeEnemyAnimationState.Move;
                    yield return Capture("07-onbu-move.png");
                    animatedEnemy.TakeDamage(0.01f, 0.45f);
                    yield return null;
                    onbuHurtReady = animatedEnemy.AnimationState == RuntimeEnemyAnimationState.Hurt;
                    yield return Capture("08-onbu-hurt.png");
                    animatedEnemy.TakeDamage(float.MaxValue, 0.45f);
                    for (var frame = 0; frame < 4; frame++)
                        animatedEnemy.Tick(player.transform.position, 0f, 0.1f);
                    yield return null;
                    onbuDeathReady = animatedEnemy.IsDying && animatedEnemy.AnimationState == RuntimeEnemyAnimationState.Death;
                    yield return Capture("09-onbu-death.png");
                    controller.SetRuntimePaused(false);
                    yield return WaitUntil(() => !animatedEnemy.IsActive, 3f, "Onbu death pool return");
                    onbuPoolReturnReady = !animatedEnemy.IsActive;
                    controller.SpawnEnemyForVerification(player.transform.position + new Vector3(1.8f, 0.1f, 0f));
                    yield return null;
                    onbuRespawnResetReady = animatedEnemy.IsActive && !animatedEnemy.IsDying && animatedEnemy.AnimationFrameIndex == 0;
                }
            }

            var bridge = U43RuntimeFeedbackBridge.Instance;
            var audioBefore = bridge != null ? bridge.AudioPlayCount : 0;
            var hapticBefore = bridge != null ? bridge.HapticRequestCount : 0;
            bridge?.PlayPickup();
            bridge?.PlayLevelUp();
            yield return null;
            audioHookRequestReady = bridge != null && bridge.AudioRuntimeHookReady && bridge.AudioPlayCount > audioBefore;
            hapticHookRequestReady = bridge != null && bridge.HapticRuntimeHookReady && bridge.HapticRequestCount > hapticBefore;

            if (controller != null && player != null)
            {
                var defeatedBefore = controller.DefeatedEnemyCount;
                var collectedBefore = controller.CollectedExpCount;
                controller.SpawnEnemyForVerification(player.transform.position + new Vector3(0.55f, 0.15f, 0f));
                yield return WaitUntil(
                    () => controller.DefeatedEnemyCount > defeatedBefore && controller.CollectedExpCount > collectedBefore,
                    10f,
                    "enemy hit and pickup");
                enemyHitReady = controller.DefeatedEnemyCount > defeatedBefore;
                pickupReady = controller.CollectedExpCount > collectedBefore;
            }

            var overlay = UnityEngine.Object.FindAnyObjectByType<U4LevelUpOverlay>(FindObjectsInactive.Include);
            if (overlay != null)
            {
                overlay.Show(CommonChoices(), _ => { });
                yield return new WaitForSecondsRealtime(0.35f);
                levelUpCommonReady = overlay.IsActive && Time.timeScale == 0f;
                if (player != null)
                {
                    var overlayPosition = player.transform.position;
                    player.SetVerificationMoveInput(Vector2.right);
                    yield return new WaitForSecondsRealtime(0.3f);
                    uiMovementCollisionGuardReady = Vector2.Distance(overlayPosition, player.transform.position) < 0.001f &&
                                                    player.CurrentVelocity.sqrMagnitude < 0.01f &&
                                                    Time.timeScale == 0f;
                    player.ClearVerificationMoveInput();
                }
                levelUpTapReady = CardsMeetTapTarget();
                var pausedState = yuiAnimator?.State;
                var pausedFrame = yuiAnimator?.FrameIndex;
                yield return new WaitForSecondsRealtime(0.45f);
                yuiPauseReady = yuiAnimator != null && yuiAnimator.State == pausedState && yuiAnimator.FrameIndex == pausedFrame;
                yield return Capture("10-levelup-paused-animation.png");
                CloseFirstCard();
                yield return new WaitForSecondsRealtime(0.35f);

                overlay.Show(RareChoices(), _ => { });
                yield return new WaitForSecondsRealtime(0.3f);
                levelUpRareReady = overlay.IsActive;
                CloseFirstCard();
                yield return new WaitForSecondsRealtime(0.35f);

                overlay.Show(EvolutionChoices(), _ => { });
                yield return new WaitForSecondsRealtime(0.3f);
                levelUpEvolutionReady = overlay.IsActive;
                CloseFirstCard();
                yield return new WaitForSecondsRealtime(0.4f);
            }

            PressButton("結果");
            yield return new WaitForSecondsRealtime(0.35f);
            var resultSnapshot = new Snapshot(FindController());
            yield return new WaitForSecondsRealtime(0.7f);
            resultPauseReady = IsPausedAndFrozen(resultSnapshot, requireStageSelect: false, requireResult: true);
            var resultAnimationState = yuiAnimator?.State;
            var resultAnimationFrame = yuiAnimator?.FrameIndex;
            yield return new WaitForSecondsRealtime(0.4f);
            yuiPauseReady &= yuiAnimator != null && yuiAnimator.State == resultAnimationState && yuiAnimator.FrameIndex == resultAnimationFrame;
            yield return Capture("11-result-paused-animation.png");

            retryReady = FindButton("Retry") != null;
            PressButton("Retry");
            yield return WaitUntil(() => SceneManager.GetActiveScene().name == "Stage1" && GameObject.Find("U43StageSelectRuntimeOverlay") != null, 15f, "Retry Stage1");
            yield return new WaitForSecondsRealtime(0.5f);
            duplicateEventSystemDetected = UnityEngine.Object.FindObjectsByType<EventSystem>(FindObjectsInactive.Include).Length != 1;
            duplicateAudioListenerDetected = UnityEngine.Object.FindObjectsByType<AudioListener>(FindObjectsInactive.Include).Length != 1;
            retryReady &= !duplicateEventSystemDetected && !duplicateAudioListenerDetected && FindPlayer() != null;
            yuiAnimator = UnityEngine.Object.FindAnyObjectByType<YuiSpriteAnimator>();
            yuiRetryResetReady = yuiAnimator != null && yuiAnimator.State == RuntimeCharacterAnimationState.Idle &&
                                 yuiAnimator.FrameIndex == 0 && yuiAnimator.RuntimePaused;
            yield return Capture("12-retry-reset.png");

            PressButton("Stage1へ");
            yield return new WaitForSecondsRealtime(0.4f);
            PressButton("結果");
            yield return new WaitForSecondsRealtime(0.35f);
            PressButton("StageSelect");
            yield return new WaitForSecondsRealtime(0.55f);
            var returnSnapshot = new Snapshot(FindController());
            yield return new WaitForSecondsRealtime(0.65f);
            stageSelectReturnReady = IsPausedAndFrozen(returnSnapshot, requireStageSelect: true, requireResult: false) && FindButton("Stage1へ") != null;
            yield return Capture("13-stage-select-return.png");

            screenshotsReady = RequiredScreenshots().All(File.Exists);
            WriteEvidence();
            File.WriteAllText(Path.Combine(outputRoot, "u45-ai-simulator-smoke.log"), string.Join(Environment.NewLine, log));
            Debug.Log("U45 AI Simulator smoke completed: " + SimulatorPlayableCandidateReady);
        }

        private IEnumerator Capture(string name)
        {
            FindController()?.ClearTransientVisualsForVerification();
            Canvas.ForceUpdateCanvases();
            yield return new WaitForEndOfFrame();
            var texture = new Texture2D(Screen.width, Screen.height, TextureFormat.RGBA32, false);
            texture.ReadPixels(new Rect(0f, 0f, Screen.width, Screen.height), 0, 0);
            texture.Apply();
            WritePpm(texture, Path.Combine(screenshotRoot, Path.ChangeExtension(name, ".ppm")));
            Destroy(texture);
            yield return new WaitForSecondsRealtime(0.35f);
        }

        private IEnumerator WaitUntil(Func<bool> condition, float timeout, string label)
        {
            var started = Time.realtimeSinceStartup;
            while (!condition() && Time.realtimeSinceStartup - started < timeout)
            {
                yield return null;
            }
            log.Add($"{label}={condition()}");
        }

        private static bool VerifyMovementAreaGeometry()
        {
            var method = typeof(DevicePointerMoveInputSource).GetMethod("IsMovementArea", BindingFlags.Static | BindingFlags.NonPublic);
            if (method == null) return false;
            var lowerLeft = (bool)method.Invoke(null, new object[] { new Vector2(Screen.width * 0.2f, Screen.height * 0.2f) });
            var center = (bool)method.Invoke(null, new object[] { new Vector2(Screen.width * 0.6f, Screen.height * 0.55f) });
            return lowerLeft && !center;
        }

        private static bool CardsMeetTapTarget()
        {
            var cards = UnityEngine.Object.FindObjectsByType<PaperCard>(FindObjectsInactive.Exclude);
            return cards.Length > 0 && cards.All(card => {
                var rect = card.GetComponent<RectTransform>();
                return rect.rect.width >= 44f && rect.rect.height >= 44f;
            });
        }

        private static void CloseFirstCard()
        {
            var card = UnityEngine.Object.FindAnyObjectByType<PaperCard>(FindObjectsInactive.Exclude);
            card?.OnPointerClick(null);
            card?.OnPointerClick(null);
        }

        private static void PressButton(string label)
        {
            FindButton(label)?.Press();
        }

        private static PaperButton FindButton(string label) => UnityEngine.Object
            .FindObjectsByType<PaperButton>(FindObjectsInactive.Include)
            .FirstOrDefault(button => button.GetComponentInChildren<TextMeshProUGUI>(true)?.text == label);

        private static U2BattleController FindController() => UnityEngine.Object.FindAnyObjectByType<U2BattleController>();

        private static PlayerController FindPlayer() => UnityEngine.Object.FindAnyObjectByType<PlayerController>();

        private static U4LevelUpChoice Choice(string id, string name, U4ItemRarity rarity, bool awakening = false) => new()
        {
            Id = id,
            NameJa = name,
            DescriptionJa = awakening ? "条件を満たすと開く未知の力。" : "Simulator smoke用のruntime card表示確認。",
            TypeLabelJa = awakening ? "覚醒" : rarity == U4ItemRarity.Rare ? "レア" : "武器",
            Rarity = rarity,
            ItemType = awakening || rarity == U4ItemRarity.Rare ? U4ItemType.Special : U4ItemType.Weapon,
            Level = awakening ? 0 : 1,
            IsAwakeningGate = awakening,
        };

        private static U4LevelUpChoice[] CommonChoices() => new[]
        {
            Choice("sim_common_1", "ランタンの灯", U4ItemRarity.Normal),
            Choice("sim_common_2", "墨のまもり", U4ItemRarity.Normal),
            Choice("sim_common_3", "紙扇の風", U4ItemRarity.Good),
        };

        private static U4LevelUpChoice[] RareChoices() => new[]
        {
            Choice("sim_rare_1", "夜明けの栞", U4ItemRarity.Rare),
            Choice("sim_rare_2", "忘れられた鈴", U4ItemRarity.Rare),
            Choice("sim_rare_3", "記憶の灯", U4ItemRarity.Rare),
        };

        private static U4LevelUpChoice[] EvolutionChoices() => new[]
        {
            Choice("sim_evo_1", "ランタンの灯", U4ItemRarity.Normal),
            Choice("sim_evo_2", "夜明けの栞", U4ItemRarity.Rare),
            Choice("sim_evo_3", "覚醒の扉", U4ItemRarity.Rare, true),
        };

        private bool IsPausedAndFrozen(Snapshot before, bool requireStageSelect, bool requireResult)
        {
            var controller = FindController();
            var player = FindPlayer();
            var after = new Snapshot(controller);
            var stage = GameObject.Find("U43StageSelectRuntimeOverlay");
            var result = GameObject.Find("U43ResultRuntimeOverlay");
            var overlays = (!requireStageSelect || stage != null && stage.activeInHierarchy) &&
                           (!requireResult || result != null && result.activeInHierarchy);
            return controller != null && controller.IsRuntimePaused && player != null && player.RuntimeInputBlocked && overlays && before.Equals(after);
        }

        private IEnumerable<string> RequiredScreenshots() => new[]
        {
            "01-stage-select.png", "02-yui-idle.png", "03-yui-walk-right.png", "04-yui-walk-left.png",
            "05-yui-hurt.png", "06-yui-attack.png", "07-onbu-move.png", "08-onbu-hurt.png",
            "09-onbu-death.png", "10-levelup-paused-animation.png", "11-result-paused-animation.png",
            "12-retry-reset.png", "13-stage-select-return.png",
        }.Select(name => Path.Combine(screenshotRoot, Path.ChangeExtension(name, ".ppm")));

        private static void WritePpm(Texture2D texture, string path)
        {
            var width = texture.width;
            var height = texture.height;
            var pixels = texture.GetPixels32();
            var rgb = new byte[width * height * 3];
            var destination = 0;
            for (var y = height - 1; y >= 0; y--)
            {
                for (var x = 0; x < width; x++)
                {
                    var color = pixels[y * width + x];
                    rgb[destination++] = color.r;
                    rgb[destination++] = color.g;
                    rgb[destination++] = color.b;
                }
            }

            using var stream = File.Create(path);
            var header = Encoding.ASCII.GetBytes($"P6\n{width} {height}\n255\n");
            stream.Write(header, 0, header.Length);
            stream.Write(rgb, 0, rgb.Length);
        }

        private bool SimulatorPlayableCandidateReady =>
            bootReady && stageSelectVisible && stageSelectPauseReady && stageStartRouteReady && battleResumeReady &&
            movementRouteReady && movementStopsOnRelease && nonStickAreaIgnored && uiMovementCollisionGuardReady &&
            enemyHitReady && pickupReady && levelUpCommonReady && levelUpRareReady && levelUpEvolutionReady &&
            levelUpTapReady && resultPauseReady && retryReady && stageSelectReturnReady &&
            audioHookRequestReady && hapticHookRequestReady && unhandledExceptionCount == 0 && !crashDetected &&
            !duplicateEventSystemDetected && !duplicateAudioListenerDetected && screenshotsReady &&
            productionVisualProviderReady && proofProviderUnused && runtimeVisualSourcesReady && proceduralFallbackUnused &&
            yuiIdleReady && yuiWalkRightReady && yuiWalkLeftReady && yuiReleaseIdleReady && yuiFacingHeldOnRelease && yuiHurtReady &&
            yuiAttackReady && yuiPauseReady && yuiRetryResetReady && onbuMoveReady && onbuHurtReady &&
            onbuDeathReady && onbuPoolReturnReady && onbuRespawnResetReady;

        private void WriteEvidence()
        {
            var text =
                "{\n" +
                $"  \"generatedAt\": \"{DateTime.UtcNow:O}\",\n" +
                "  \"phase\": \"U45\",\n" +
                "  \"evidenceKind\": \"AI-only iOS Simulator smoke\",\n" +
                $"  \"simulatorDeviceName\": \"{Escape(LaunchMetadata("--u45-simulator-device=", DeviceNameEnvironmentVariable))}\",\n" +
                $"  \"simulatorRuntime\": \"{Escape(LaunchMetadata("--u45-simulator-runtime=", RuntimeEnvironmentVariable))}\",\n" +
                $"  \"simulatorUdid\": \"{Escape(LaunchMetadata("--u45-simulator-udid=", UdidEnvironmentVariable))}\",\n" +
                "  \"bundleIdentifier\": \"com.mshogo.vamppon.u1\",\n" +
                Fields() +
                "}\n";
            File.WriteAllText(Path.Combine(outputRoot, "u45-ai-simulator-smoke-result.json"), text);
        }

        private string Fields() =>
            Bool("bootReady", bootReady) + Bool("stageSelectVisible", stageSelectVisible) +
            Bool("stageSelectPauseReady", stageSelectPauseReady) + Bool("stageStartRouteReady", stageStartRouteReady) +
            Bool("battleResumeReady", battleResumeReady) + Bool("movementRouteReady", movementRouteReady) +
            Bool("movementStopsOnRelease", movementStopsOnRelease) + Bool("nonStickAreaIgnored", nonStickAreaIgnored) +
            Bool("uiMovementCollisionGuardReady", uiMovementCollisionGuardReady) + Bool("enemyHitReady", enemyHitReady) +
            Bool("pickupReady", pickupReady) + Bool("levelUpCommonReady", levelUpCommonReady) +
            Bool("levelUpRareReady", levelUpRareReady) + Bool("levelUpEvolutionReady", levelUpEvolutionReady) +
            Bool("levelUpTapReady", levelUpTapReady) + Bool("resultPauseReady", resultPauseReady) +
            Bool("retryReady", retryReady) + Bool("stageSelectReturnReady", stageSelectReturnReady) +
            Bool("audioHookRequestReady", audioHookRequestReady) + Bool("hapticHookRequestReady", hapticHookRequestReady) +
            $"  \"unhandledExceptionCount\": {unhandledExceptionCount},\n" + Bool("crashDetected", crashDetected) +
            Bool("duplicateEventSystemDetected", duplicateEventSystemDetected) +
            Bool("duplicateAudioListenerDetected", duplicateAudioListenerDetected) +
            Bool("productionVisualProviderReady", productionVisualProviderReady) + Bool("proofProviderUnused", proofProviderUnused) +
            Bool("runtimeVisualSourcesReady", runtimeVisualSourcesReady) + Bool("proceduralFallbackUnused", proceduralFallbackUnused) +
            Bool("yuiIdleReady", yuiIdleReady) + Bool("yuiWalkRightReady", yuiWalkRightReady) +
            Bool("yuiWalkLeftReady", yuiWalkLeftReady) + Bool("yuiReleaseIdleReady", yuiReleaseIdleReady) +
            Bool("yuiFacingHeldOnRelease", yuiFacingHeldOnRelease) +
            Bool("yuiHurtReady", yuiHurtReady) + Bool("yuiAttackReady", yuiAttackReady) +
            Bool("yuiPauseReady", yuiPauseReady) + Bool("yuiRetryResetReady", yuiRetryResetReady) +
            Bool("onbuMoveReady", onbuMoveReady) + Bool("onbuHurtReady", onbuHurtReady) +
            Bool("onbuDeathReady", onbuDeathReady) + Bool("onbuPoolReturnReady", onbuPoolReturnReady) +
            Bool("onbuRespawnResetReady", onbuRespawnResetReady) +
            Bool("screenshotsReady", screenshotsReady) +
            $"  \"simulatorPlayableCandidateReady\": {(SimulatorPlayableCandidateReady ? "true" : "false")}\n";

        private static string Bool(string key, bool value) => $"  \"{key}\": {(value ? "true" : "false")},\n";

        private static string ArgumentValue(string prefix) => Environment.GetCommandLineArgs()
            .FirstOrDefault(argument => argument.StartsWith(prefix, StringComparison.Ordinal))?[prefix.Length..] ?? string.Empty;

        private static string LaunchMetadata(string argumentPrefix, string environmentVariable)
        {
            var argumentValue = ArgumentValue(argumentPrefix);
            return string.IsNullOrEmpty(argumentValue)
                ? Environment.GetEnvironmentVariable(environmentVariable) ?? string.Empty
                : argumentValue;
        }

        private static string Escape(string value) => value.Replace("\\", "\\\\", StringComparison.Ordinal).Replace("\"", "\\\"", StringComparison.Ordinal);

        private readonly struct Snapshot
        {
            private static readonly FieldInfo ElapsedField = typeof(U2BattleController).GetField("elapsedSeconds", BindingFlags.Instance | BindingFlags.NonPublic);
            private readonly float elapsed;
            private readonly int spawned;
            private readonly int fired;
            private readonly int dropped;
            private readonly int collected;

            public Snapshot(U2BattleController controller)
            {
                elapsed = controller != null && ElapsedField != null ? (float)ElapsedField.GetValue(controller) : -1f;
                spawned = controller?.SpawnedEnemyCount ?? -1;
                fired = controller?.FiredProjectileCount ?? -1;
                dropped = controller?.DroppedExpCount ?? -1;
                collected = controller?.CollectedExpCount ?? -1;
            }

            public bool Equals(Snapshot other) => Mathf.Approximately(elapsed, other.elapsed) && spawned == other.spawned && fired == other.fired && dropped == other.dropped && collected == other.collected;
        }
    }
}
#endif
