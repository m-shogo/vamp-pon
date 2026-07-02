using System;
using System.IO;
using UnityEditor;
using VampPon.UnitySpike.U25.Stage1Loop;
using VampPon.UnitySpike.U27.SaveRewardUnlock;

namespace VampPon.UnitySpike.Editor
{
    public static class U27SaveRewardUnlockIntegrationVerification
    {
        private const string ReportPath = "Logs/u27_save_reward_unlock_integration_verification.txt";

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                var repository = new U27InMemorySaveRepositoryForEditor();
                var integrator = new U27SaveRewardUnlockIntegrator(repository);
                var clear = integrator.CompleteRun(new U25RunResultModel
                {
                    ClearState = "clear",
                    ElapsedSeconds = 480,
                    KillCount = 128,
                    LevelReached = 5,
                    CollectedFragments = 12,
                    CollectedMemories = 3,
                    KokuyouUsed = true,
                    EvolutionAchieved = true,
                    RareAcquired = true,
                });
                var stageSelect = integrator.BuildStageSelect();
                Require(clear.IsClear, "clear result connected");
                Require(clear.RewardDraft.FragmentAmount > 0, "reward draft calculated");
                Require(clear.Unlocks.Count >= 4, "unlock draft calculated");
                Require(clear.BestUpdated, "best updated stamp connected");
                Require(stageSelect.Stage1Cleared, "StageSelect clear state connected");
                Require(stageSelect.Stage2PlaceholderUnlocked, "Stage2 placeholder unlock connected");
                Require(stageSelect.ActiveLantern && stageSelect.RouteLineVisible, "StageSelect route and lantern connected");
                var retry = integrator.BuildRetryFlow(true);
                Require(retry.RetryStartsStage1 && retry.SavePreserved, "Retry preserves save and starts Stage1");
                var defeat = integrator.CompleteRun(new U25RunResultModel
                {
                    ClearState = "fail",
                    ElapsedSeconds = 180,
                    KillCount = 18,
                    LevelReached = 2,
                    CollectedFragments = 4,
                    CollectedMemories = 0,
                    KokuyouUsed = false,
                    EvolutionAchieved = false,
                    RareAcquired = false,
                });
                Require(!defeat.IsClear, "defeat result connected");
                Require(defeat.RewardDraft.DefeatParticipationReward > 0, "defeat participation reward connected");
                repository.InjectCorruptedDataForVerification();
                Require(repository.Load().Version == U27SaveVersion.Current, "corrupted data fallback");
                integrator.ResetProofDebug();
                Require(repository.GetStageProgress("stage_01").TotalAttempts == 0, "reset proof debug");
                Require(!Directory.Exists("Assets/AddressableAssetsData"), "Addressables not introduced");
                File.WriteAllText(ReportPath, "U27 save reward unlock integration verification passed");
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
    }
}
