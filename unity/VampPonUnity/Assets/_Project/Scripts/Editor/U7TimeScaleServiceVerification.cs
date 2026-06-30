using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.Editor
{
    public static class U7TimeScaleServiceVerification
    {
        private const string ReportPath = "Logs/u7_timescale_service_verification_report.txt";

        public static void Run()
        {
            var report = new StringBuilder();
            var failed = false;

            report.AppendLine("=== U7 TimeScale Service Verification ===");

            try
            {
                Directory.CreateDirectory("Logs");
                BattleTimeScaleService.ForceRestore();

                Expect(report, "case force restore", Time.timeScale == 1f && BattleTimeScaleService.CurrentScale == 1f && !BattleTimeScaleService.IsPaused, ref failed);

                BattleTimeScaleService.RegisterPause("A");
                Expect(report, "case single pause register", Time.timeScale == 0f && BattleTimeScaleService.CurrentScale == 0f && BattleTimeScaleService.IsPaused, ref failed);
                BattleTimeScaleService.ReleasePause("A");
                Expect(report, "case single pause release", Time.timeScale == 1f && BattleTimeScaleService.CurrentScale == 1f && !BattleTimeScaleService.IsPaused, ref failed);

                BattleTimeScaleService.RegisterPause("A");
                BattleTimeScaleService.RegisterPause("B");
                Expect(report, "case multi pause owner register", Time.timeScale == 0f && BattleTimeScaleService.IsPaused, ref failed);
                BattleTimeScaleService.ReleasePause("A");
                Expect(report, "case multi pause owner partial release", Time.timeScale == 0f && BattleTimeScaleService.IsPaused, ref failed);
                BattleTimeScaleService.ReleasePause("B");
                Expect(report, "case multi pause owner full release", Time.timeScale == 1f && !BattleTimeScaleService.IsPaused, ref failed);

                BattleTimeScaleService.TriggerHitStop("H", 0.2f, 0.18f);
                Expect(report, "case hit stop trigger", Approximately(Time.timeScale, 0.18f) && Approximately(BattleTimeScaleService.CurrentScale, 0.18f), ref failed);
                BattleTimeScaleService.Tick(0.25f);
                Expect(report, "case hit stop expiry", Time.timeScale == 1f && BattleTimeScaleService.CurrentScale == 1f && !BattleTimeScaleService.IsPaused, ref failed);

                BattleTimeScaleService.RegisterPause("A");
                BattleTimeScaleService.TriggerHitStop("H", 0.4f, 0.18f);
                Expect(report, "case pause over hit stop keeps pause", Time.timeScale == 0f && BattleTimeScaleService.CurrentScale == 0f && BattleTimeScaleService.IsPaused, ref failed);
                BattleTimeScaleService.ReleasePause("A");
                Expect(report, "case pause release returns to active hit stop", Approximately(Time.timeScale, 0.18f) && Approximately(BattleTimeScaleService.CurrentScale, 0.18f), ref failed);
                BattleTimeScaleService.Tick(0.5f);
                Expect(report, "case hit stop after pause expiry", Time.timeScale == 1f && BattleTimeScaleService.CurrentScale == 1f, ref failed);

                BattleTimeScaleService.TriggerHitStop("H", 0.4f, 0.18f);
                BattleTimeScaleService.RegisterPause("A");
                Expect(report, "case hit stop then pause", Time.timeScale == 0f && BattleTimeScaleService.IsPaused, ref failed);
                BattleTimeScaleService.ReleasePause("A");
                Expect(report, "case hit stop resumes after pause release", Approximately(Time.timeScale, 0.18f), ref failed);
                BattleTimeScaleService.ReleaseHitStop("H");
                Expect(report, "case hit stop release", Time.timeScale == 1f && BattleTimeScaleService.CurrentScale == 1f, ref failed);

                BattleTimeScaleService.RegisterPause("A");
                BattleTimeScaleService.TriggerHitStop("H", 1f, 0.18f);
                BattleTimeScaleService.ForceRestore();
                Expect(report, "case force restore from mixed state", Time.timeScale == 1f && BattleTimeScaleService.CurrentScale == 1f && !BattleTimeScaleService.IsPaused, ref failed);

                report.AppendLine($"TimeScale final: {Time.timeScale:0.###}");
                report.AppendLine($"Service final scale: {BattleTimeScaleService.CurrentScale:0.###}");
                report.AppendLine($"Service final reason: {BattleTimeScaleService.DebugOwnerReason}");
            }
            catch (Exception ex)
            {
                failed = true;
                report.AppendLine("Exception: " + ex);
                Debug.LogError(ex);
            }
            finally
            {
                BattleTimeScaleService.ForceRestore();
            }

            File.WriteAllText(ReportPath, report.ToString());
            Debug.Log(report.ToString());

            if (failed)
            {
                EditorApplication.Exit(1);
            }
        }

        private static void Expect(StringBuilder report, string label, bool ok, ref bool failed)
        {
            report.AppendLine($"{label}: {(ok ? "OK" : "NG")}");
            failed |= !ok;
        }

        private static bool Approximately(float actual, float expected)
        {
            return Mathf.Abs(actual - expected) < 0.001f;
        }
    }
}
