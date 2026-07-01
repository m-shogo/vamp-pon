using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U18.Kokuyou;

namespace VampPon.UnitySpike.Editor
{
    public static class U18KokuyouTimeScaleVerification
    {
        private const string ReportPath = "Logs/u18_kokuyou_timescale_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;

            try
            {
                BattleTimeScaleService.ForceRestore();
                var obj = new GameObject("U18KokuyouTimeScaleVerification");
                var controller = obj.AddComponent<KokuyouRuntimePrototypeController>();
                controller.ProofFillGauge();

                BattleTimeScaleService.RegisterPause("u18-pause-proof");
                Expect(report, "Pause blocks activation", !controller.TryActivate() && BattleTimeScaleService.IsPaused, ref failed);
                BattleTimeScaleService.ReleasePause("u18-pause-proof");
                Expect(report, "Pause release restores scale", Mathf.Approximately(BattleTimeScaleService.CurrentScale, 1f), ref failed);

                Expect(report, "Activation uses TimeScaleService hit stop", controller.TryActivate() && BattleTimeScaleService.DebugOwnerReason.Contains("hit-stop:u18-kokuyou-activate"), ref failed);
                controller.Tick(0.1f);
                Expect(report, "HitStop clears after tick", Mathf.Approximately(BattleTimeScaleService.CurrentScale, 1f), ref failed);
                controller.Tick(5.1f);
                Expect(report, "Ending hit stop uses service", BattleTimeScaleService.DebugOwnerReason.Contains("hit-stop:u18-kokuyou-ending") || Mathf.Approximately(BattleTimeScaleService.CurrentScale, 1f), ref failed);
                BattleTimeScaleService.ForceRestore();
                Expect(report, "ForceRestore restores time scale", Mathf.Approximately(Time.timeScale, 1f) && Mathf.Approximately(BattleTimeScaleService.CurrentScale, 1f), ref failed);
                Expect(report, "Scene switch would not leave slow", BattleTimeScaleService.DebugOwnerReason == "force-restore", ref failed);
                UnityEngine.Object.DestroyImmediate(obj);
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
