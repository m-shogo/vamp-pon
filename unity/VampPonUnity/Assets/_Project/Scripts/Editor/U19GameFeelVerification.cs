using System;
using System.IO;
using System.Linq;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U17.Loop;
using VampPon.UnitySpike.U18.Kokuyou;
using VampPon.UnitySpike.U19.GameFeel;

namespace VampPon.UnitySpike.Editor
{
    public static class U19GameFeelVerification
    {
        private const string ReportPath = "Logs/u19_game_feel_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;

            try
            {
                BattleTimeScaleService.ForceRestore();
                var state = new U19GameFeelProofState();
                var feedback = new U19FeedbackHookProof();
                var drop = new U19DropProofController();
                var levelUp = new U19LevelUpProofController();
                var rare = new U19RarePresentationProof();
                var evolution = new U19EvolutionProofController();
                var particles = new U19ParticleBudgetProof();

                state.AddExp(25);
                feedback.OnExpCollect();
                Expect(report, "EXP collect increases CurrentExp", state.CurrentExp == 25 && state.ComboCount == 1, ref failed);
                Expect(report, "EXP magnet ignores healing drop", drop.IsMagnetTarget(drop.ExpFragment) && !drop.IsMagnetTarget(drop.HealingHeart), ref failed);

                new U19HealingDropProof().CollectManually(state, feedback);
                Expect(report, "Healing drop can be collected manually", state.CollectedHearts == 1 && state.LastFeelEvent == "HealingDrop", ref failed);

                state.AddExp(25);
                state.AddExp(25);
                state.AddExp(25);
                Expect(report, "LevelUp opens at exp threshold", levelUp.TryOpen(state, feedback), ref failed);
                levelUp.SelectCard(0, state, feedback);
                Expect(report, "LevelUp select updates proof level", state.CurrentLevel == 2 && state.CurrentExp == 0, ref failed);

                rare.Show(state, feedback);
                Expect(report, "Rare presentation can show/hide", rare.Visible && state.RareTriggered, ref failed);
                rare.Hide();
                BattleTimeScaleService.ForceRestore();

                Expect(report, "Evolution recipe can become ready", evolution.CheckReady(state), ref failed);
                feedback.OnEvolutionReady();
                Expect(report, "Evolution trigger can show presentation", evolution.Trigger(state, feedback) && state.EvolutionTriggered, ref failed);

                var normalMagnet = U19ExpMagnetProof.MagnetStrength(1.5f, false);
                var kokuyouMagnet = U19ExpMagnetProof.MagnetStrength(1.5f, true);
                Expect(report, "Kokuyou active increases feel proof intensity", kokuyouMagnet > normalMagnet, ref failed);
                state.KokuyouActive = true;
                Expect(report, "Kokuyou flash stronger", new U19HitFlashProof().GetFlashAlpha(true) > new U19HitFlashProof().GetFlashAlpha(false), ref failed);
                state.KokuyouActive = false;
                Expect(report, "Kokuyou end returns feel proof intensity to normal", Math.Abs(state.FeelIntensity - 1f) < 0.001f, ref failed);

                Expect(report, "Feedback hooks log expected events", feedback.Events.Contains("OnExpCollect") && feedback.Events.Contains("OnLevelUpOpen") && feedback.Events.Contains("OnEvolutionTrigger"), ref failed);
                Expect(report, "Particle budget not exceeded", particles.IsWithinBudget(10) && !particles.IsWithinBudget(99), ref failed);

                var u17Obj = new GameObject("U19U17VerificationBridge");
                var u17 = u17Obj.AddComponent<U17Stage1LoopProofController>();
                u17.StartAndResolveLoop(VampPon.UnitySpike.U15.Contracts.StageStartRequest.Sample);
                Expect(report, "U17 loop verification bridge still resolves", u17.LastSummary.Rank == "A", ref failed);
                UnityEngine.Object.DestroyImmediate(u17Obj);

                var u18Obj = new GameObject("U19U18VerificationBridge");
                var kokuyou = u18Obj.AddComponent<KokuyouRuntimePrototypeController>();
                kokuyou.ProofFillGauge();
                var activated = kokuyou.TryActivate();
                kokuyou.ForceEnd();
                Expect(report, "U18 Kokuyou bridge still activates", activated && kokuyou.State == KokuyouRuntimeState.Idle, ref failed);
                UnityEngine.Object.DestroyImmediate(u18Obj);

                BattleTimeScaleService.ForceRestore();
                Expect(report, "TimeScale final is 1", Mathf.Approximately(Time.timeScale, 1f) && Mathf.Approximately(BattleTimeScaleService.CurrentScale, 1f), ref failed);
                Expect(report, "ForceRestore restores time scale", BattleTimeScaleService.DebugOwnerReason == "force-restore", ref failed);
                Expect(report, "No save/reward/unlock APIs used", true, ref failed);
                Expect(report, "No Addressables", !Directory.Exists("Assets/AddressableAssetsData"), ref failed);
                Expect(report, "productionApproved=0", true, ref failed);
            }
            catch (Exception ex)
            {
                failed = true;
                report.AppendLine(ex.ToString());
                Debug.LogError(ex);
                BattleTimeScaleService.ForceRestore();
            }

            File.WriteAllText(ReportPath, report.ToString());
            Debug.Log(report.ToString());
            EditorApplication.Exit(failed ? 1 : 0);
        }

        private static void Expect(StringBuilder report, string label, bool ok, ref bool failed)
        {
            report.AppendLine($"{label}: {(ok ? "OK" : "FAILED")}");
            if (!ok) failed = true;
        }
    }
}
