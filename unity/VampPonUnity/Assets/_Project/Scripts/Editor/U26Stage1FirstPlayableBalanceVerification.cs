using System;
using System.IO;
using UnityEditor;
using VampPon.UnitySpike.U25.Stage1Loop;
using VampPon.UnitySpike.U26.FirstPlayableBalance;

namespace VampPon.UnitySpike.Editor
{
    public static class U26Stage1FirstPlayableBalanceVerification
    {
        private const string ReportPath = "Logs/u26_stage1_first_playable_balance_verification.txt";

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                var state = new U26Stage1FirstPlayableBalanceState();
                var simulator = new U26Stage1BalanceSimulator();
                Require(state.U25Loop is U25Stage1LoopState, "U25 loop premise exists");
                Require(!state.ProductionApproved, "productionApproved remains 0");
                Require(U26Stage1BalanceConstants.StageClearSeconds == 480, "Stage1 clear target is 08:00");
                Require(U26Stage1BalanceConstants.FirstLevelUpTargetSeconds == 30, "first LevelUp target is 00:30");
                Require(state.FirstThirtySecondsReadable, "first 30 seconds are readable");
                Require(state.WaveDraft.At(0).Bucket == "opening", "opening wave bucket");
                Require(state.WaveDraft.At(240).Bucket == "wave_intensity", "wave intensity bucket");
                Require(state.WaveDraft.At(450).Bucket == "clear_push", "clear push bucket");
                Require(state.DropDraft.XpDropChance > 0.8f, "XP pickup drop is primary");
                Require(state.DropDraft.EvolutionMaterialHookReachable, "evolution material hook reachable");
                Require(state.WeaponPassiveDraft.CanDraftEvolution(240, 5, true, true), "evolution draft can be reached");
                Require(simulator.Simulate(30).Level >= 2, "first LevelUp cadence reached");
                Require(simulator.Simulate(360).KokuyouReady, "Kokuyou ready by 06:00");
                Require(simulator.Simulate(480).ClearReady, "clear state reached");
                Require(!Directory.Exists("Assets/AddressableAssetsData"), "Addressables not introduced");
                File.WriteAllText(ReportPath, "U26 Stage1 first playable balance verification passed");
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
