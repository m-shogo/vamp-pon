using System.IO;
using System.Text;
using TMPro;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.U20.MobileQA;

namespace VampPon.UnitySpike.Editor
{
    public static class U20TextReadabilityVerification
    {
        private const string ReportPath = "Logs/u20_text_readability_verification_report.txt";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";

        public static void Run()
        {
            Directory.CreateDirectory("Logs");
            var report = new StringBuilder();
            var failed = false;
            var font = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>(FontPath);
            Expect(report, "ZenMaruGothic SDF exists", font != null, ref failed);
            Expect(report, "Result stats font baseline >= 12", U20MobileQABaseline.MinResultStatsFontSize >= 12, ref failed);
            Expect(report, "LevelUp card title fits proof copy", "夜の鉛筆 Lv+1".Length <= 10, ref failed);
            Expect(report, "Evolution recipe copy is short enough", "夜明けのインク灯".Length <= 12, ref failed);
            report.AppendLine("Warning: glyph visual inspection on real devices is not executed.");
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
