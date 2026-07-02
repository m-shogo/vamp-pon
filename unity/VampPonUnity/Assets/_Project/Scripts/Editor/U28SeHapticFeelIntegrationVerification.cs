using System;
using System.IO;
using UnityEditor;
using VampPon.UnitySpike.U25.Stage1Loop;
using VampPon.UnitySpike.U27.SaveRewardUnlock;
using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.Editor
{
    public static class U28SeHapticFeelIntegrationVerification
    {
        private const string ReportPath = "Logs/u28_se_haptic_feel_integration_verification.txt";

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                var root = RepoRoot();
                var audioRegistry = new U28AudioEventRegistry();
                var hapticRegistry = new U28HapticRegistry();
                var settings = new U28InMemoryFeelSettingsRepository().Load();
                var audioRouter = new U28AudioRouter(audioRegistry, new U28AudioClipLibrary(root));
                var hapticRouter = new U28HapticRouter(hapticRegistry, new U28EditorNoopHapticAdapter());
                audioRouter.ApplySettings(settings);
                hapticRouter.ApplySettings(settings);
                var feelRouter = new U28FeelRouter(audioRegistry, audioRouter, hapticRouter);
                var connector = new U28Stage1FeelRuntimeConnector(feelRouter);

                foreach (var definition in audioRegistry.All)
                {
                    Require(File.Exists(Path.Combine(root, $"unity/VampPonUnity/{U28AudioEventRegistry.DraftSeRoot}/{definition.ClipFileName}")), $"clip exists: {definition.ClipFileName}");
                }

                connector.OnBattleStart();
                connector.OnEnemyHit();
                connector.OnEnemyDefeat();
                connector.OnPlayerDamage();
                connector.OnXpPickup();
                connector.OnHealPickup();
                connector.OnRarePickup();
                connector.OnU25FeedbackEvent("levelup_open");
                connector.OnU25FeedbackEvent("card_select");
                connector.OnU25FeedbackEvent("rare_seal_pulse");
                connector.OnU25FeedbackEvent("evolution_material_converge");
                connector.OnU25FeedbackEvent("evolution_complete");
                connector.OnU25FeedbackEvent("kokuyou_ready_pulse");
                connector.OnU25FeedbackEvent("kokuyou_activate_cutin");
                connector.OnU25FeedbackEvent("kokuyou_ending_release");
                var repository = new U27InMemorySaveRepositoryForEditor();
                var result = new U27SaveRewardUnlockIntegrator(repository).CompleteRun(new U25RunResultModel());
                connector.OnResultOpen(result);
                connector.OnStageSelectOpen(new U27SaveRewardUnlockIntegrator(repository).BuildStageSelect());
                connector.OnRetryConfirm();

                Require(connector.ProofState.BattleStartConnected, "battle start connected");
                Require(connector.ProofState.PickupConnected, "pickup connected");
                Require(connector.ProofState.HitConnected, "hit connected");
                Require(connector.ProofState.DamageConnected, "damage connected");
                Require(connector.ProofState.LevelUpConnected, "levelup connected");
                Require(connector.ProofState.CardSelectConnected, "card select connected");
                Require(connector.ProofState.RareConnected, "rare connected");
                Require(connector.ProofState.EvolutionConnected, "evolution connected");
                Require(connector.ProofState.KokuyouConnected, "kokuyou connected");
                Require(connector.ProofState.ResultConnected, "result connected");
                Require(connector.ProofState.StageSelectConnected, "stage select connected");
                Require(connector.ProofState.RetryConnected, "retry connected");
                Require(!hapticRouter.HapticExecutedOnDevice, "Editor haptic remains safe no-op");
                Require(audioRouter.MissingClipFallbacks.Count == 0, "no missing draft clips");
                Require(!Directory.Exists("Assets/AddressableAssetsData"), "Addressables not introduced");
                File.WriteAllText(ReportPath, $"U28 se haptic feel integration verification passed; played={audioRouter.PlayedEvents.Count}, haptics={hapticRouter.RoutedEvents.Count}");
                EditorApplication.Exit(0);
            }
            catch (Exception ex)
            {
                File.WriteAllText(ReportPath, ex.ToString());
                UnityEngine.Debug.LogError(ex);
                EditorApplication.Exit(1);
            }
        }

        private static void Require(bool condition, string label)
        {
            if (!condition) throw new InvalidOperationException(label);
        }

        private static string RepoRoot() => Path.GetFullPath(Path.Combine(Directory.GetParent(UnityEngine.Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory(), "../.."));
    }
}
