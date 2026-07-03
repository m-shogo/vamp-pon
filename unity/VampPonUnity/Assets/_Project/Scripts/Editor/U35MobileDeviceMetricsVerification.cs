using System;
using System.IO;
using UnityEditor;
using VampPon.UnitySpike.U29.PerformanceMobile;
using VampPon.UnitySpike.U35.MobileMetrics;

namespace VampPon.UnitySpike.Editor
{
    public static class U35MobileDeviceMetricsVerification
    {
        private const string ReportPath = "Logs/u35_mobile_device_metrics_verification.txt";

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                var capture = new U35MobileMetricsCapture();
                capture.ScenarioMarker.Mark("first_30_seconds");
                capture.SampleFrame(1f / 60f);
                capture.SampleFrame(1f / 55f);
                capture.RecordHapticEvent();
                var session = capture.BuildEditorSession();
                var json = new U35MetricsJsonExporter().Export(session);
                Require(session.SessionStatus == U35MetricStatus.EditorOnly, "session is EditorOnly");
                Require(!session.ProductionApproved, "productionApproved remains false");
                Require(!session.MobileMetricsReady, "mobile metrics not ready from Editor evidence");
                Require(session.Performance.Status == U35MetricStatus.EditorOnly, "performance is EditorOnly");
                Require(session.Audio.AudioLatencyStatus == U35MetricStatus.NotMeasured, "audio latency remains NOT_MEASURED");
                Require(session.Haptic.HapticBehaviorStatus == U35MetricStatus.NotMeasured, "haptic behavior remains NOT_MEASURED");
                Require(session.Touch.TouchResponsivenessStatus == U35MetricStatus.NotMeasured, "touch responsiveness remains NOT_MEASURED");
                Require(session.Persistence.SavePersistenceStatus == U35MetricStatus.NotMeasured, "save persistence remains NOT_MEASURED");
                Require(session.RuntimeCounts.ActiveEnemiesCount == U29Stage1PerformanceConstants.MaxActiveEnemies, "enemy cap sampled");
                Require(json.Contains("\"mobileMetricsReady\": false"), "json exports mobileMetricsReady false");
                Require(!Directory.Exists("Assets/AddressableAssetsData"), "Addressables not introduced");
                File.WriteAllText(ReportPath, "U35 mobile device metrics verification passed; Editor evidence only; mobileMetricsReady=false");
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
