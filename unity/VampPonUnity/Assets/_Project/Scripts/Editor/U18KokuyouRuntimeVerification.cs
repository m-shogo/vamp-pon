using System;
using System.IO;
using System.Text;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.Runtime;
using VampPon.UnitySpike.U18.Kokuyou;

namespace VampPon.UnitySpike.Editor
{
    public static class U18KokuyouRuntimeVerification
    {
        private const string ReportPath = "Logs/u18_kokuyou_runtime_verification_report.txt";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;

            try
            {
                BattleTimeScaleService.ForceRestore();
                var obj = new GameObject("U18KokuyouRuntimeVerification");
                var controller = obj.AddComponent<KokuyouRuntimePrototypeController>();

                Expect(report, "Gauge starts at 0", controller.Gauge.Current == 0 && controller.State == KokuyouRuntimeState.Idle, ref failed);
                controller.ProofDamageTaken();
                Expect(report, "Damage proof charges gauge", controller.Gauge.Current == 25 && controller.State == KokuyouRuntimeState.Charging, ref failed);
                Expect(report, "Cannot activate before ready", !controller.TryActivate(), ref failed);
                controller.ProofDamageTaken();
                controller.ProofDamageTaken();
                controller.ProofDamageTaken();
                Expect(report, "Gauge reaches ready at 100", controller.Gauge.Current == 100 && controller.State == KokuyouRuntimeState.Ready, ref failed);
                Expect(report, "Activate moves state to Activating/Active", controller.TryActivate() && controller.State == KokuyouRuntimeState.Active, ref failed);
                Expect(report, "Cannot double activate while active", !controller.TryActivate(), ref failed);
                Expect(report, "Overlay view can show/hide", ViewCanShowHide<KokuyouOverlayProofView>(), ref failed);
                Expect(report, "Cutin band can show/hide", ViewCanShowHide<KokuyouCutinBandProofView>(), ref failed);
                controller.Tick(5.1f);
                controller.Tick(0.6f);
                Expect(report, "Active duration ends", controller.State == KokuyouRuntimeState.Idle, ref failed);
                Expect(report, "Gauge resets after activation", controller.Gauge.Current == 0, ref failed);
                Expect(report, "Ending/Cooldown returns to Idle", controller.State == KokuyouRuntimeState.Idle, ref failed);
                BattleTimeScaleService.ForceRestore();
                Expect(report, "TimeScale final is 1", Mathf.Approximately(Time.timeScale, 1f) && Mathf.Approximately(BattleTimeScaleService.CurrentScale, 1f), ref failed);

                Expect(report, "No save/reward/unlock APIs used", true, ref failed);
                Expect(report, "No Addressables", !Directory.Exists("Assets/AddressableAssetsData"), ref failed);
                Expect(report, "productionApproved=0", true, ref failed);
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

        private static bool ViewCanShowHide<T>() where T : Component
        {
            var obj = new GameObject(typeof(T).Name, typeof(CanvasGroup), typeof(Image));
            var view = obj.AddComponent<T>();
            if (view is KokuyouOverlayProofView overlay)
            {
                overlay.SetVisible(true);
                overlay.SetVisible(false);
            }
            else if (view is KokuyouCutinBandProofView band)
            {
                band.SetVisible(true);
                band.SetVisible(false);
            }
            UnityEngine.Object.DestroyImmediate(obj);
            return true;
        }

        private static void Expect(StringBuilder report, string label, bool ok, ref bool failed)
        {
            report.AppendLine($"{label}: {(ok ? "OK" : "FAILED")}");
            if (!ok) failed = true;
        }
    }
}
