using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U19.GameFeel;

namespace VampPon.UnitySpike.Editor
{
    public static class U20GameFeelMobileVerification
    {
        private const string ReportPath = "Logs/u20_game_feel_mobile_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;
            BattleTimeScaleService.ForceRestore();
            Expect(report, "EXP visible scale proof", new U19ExpPopProof().PopScale(false) >= 1.08f, ref failed);
            Expect(report, "EXP trail not too noisy", new U19ParticleBudgetProof().KokuyouExpTrailParticles <= 10, ref failed);
            Expect(report, "Healing drop is not magnet target", !new U19DropProofController().IsMagnetTarget(new U19DropProofController().HealingHeart), ref failed);
            Expect(report, "LevelUp card mobile area OK", new U19LevelUpProofController().Cards.Length == 3, ref failed);
            Expect(report, "Rare slow remains short", new U19RareFlareProof().SlowSeconds <= 0.05f, ref failed);
            Expect(report, "Evolution presentation readable", new U19EvolutionRecipeProof().Result == "夜明けのインク灯", ref failed);
            Expect(report, "Kokuyou active feel stronger", U19ExpMagnetProof.MagnetStrength(1.5f, true) > U19ExpMagnetProof.MagnetStrength(1.5f, false), ref failed);
            BattleTimeScaleService.ForceRestore();
            Expect(report, "timeScale final is 1", Mathf.Approximately(Time.timeScale, 1f), ref failed);
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
