using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U18.Kokuyou;
using VampPon.UnitySpike.U19.GameFeel;

namespace VampPon.UnitySpike.Editor
{
    public static class U20KokuyouMobileVerification
    {
        private const string ReportPath = "Logs/u20_kokuyou_mobile_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;
            BattleTimeScaleService.ForceRestore();
            var obj = new GameObject("U20KokuyouMobileVerification");
            var kokuyou = obj.AddComponent<KokuyouRuntimePrototypeController>();
            kokuyou.ProofFillGauge();
            Expect(report, "Gauge ready is visible in proof", kokuyou.Gauge.IsReady, ref failed);
            Expect(report, "Pause blocks activation", BlocksDuringPause(kokuyou), ref failed);
            BattleTimeScaleService.ForceRestore();
            kokuyou.ProofFillGauge();
            Expect(report, "Activation works after pause release", kokuyou.TryActivate(), ref failed);
            Expect(report, "Kokuyou active EXP magnet stronger", U19ExpMagnetProof.MagnetStrength(2f, true) > U19ExpMagnetProof.MagnetStrength(2f, false), ref failed);
            kokuyou.ForceEnd();
            Expect(report, "Active end returns to normal", kokuyou.State == KokuyouRuntimeState.Idle && Mathf.Approximately(Time.timeScale, 1f), ref failed);
            report.AppendLine("Warning: 黒耀化B green/yellow particle human review continues.");
            UnityEngine.Object.DestroyImmediate(obj);
            File.WriteAllText(ReportPath, report.ToString());
            Debug.Log(report.ToString());
            EditorApplication.Exit(failed ? 1 : 0);
        }

        private static bool BlocksDuringPause(KokuyouRuntimePrototypeController kokuyou)
        {
            BattleTimeScaleService.RegisterPause("u20-pause-proof");
            var blocked = !kokuyou.TryActivate() && BattleTimeScaleService.IsPaused;
            BattleTimeScaleService.ReleasePause("u20-pause-proof");
            return blocked;
        }

        private static void Expect(StringBuilder report, string label, bool ok, ref bool failed)
        {
            report.AppendLine($"{label}: {(ok ? "OK" : "FAILED")}");
            if (!ok) failed = true;
        }
    }
}
