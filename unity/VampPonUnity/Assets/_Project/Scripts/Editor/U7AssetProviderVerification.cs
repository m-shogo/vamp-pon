using System;
using System.IO;
using System.Linq;
using System.Text;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.Editor
{
    public static class U7AssetProviderVerification
    {
        private const string ReportPath = "Logs/u7_asset_provider_verification_report.txt";
        private const string BattleControllerPath = "Assets/_Project/Scripts/Runtime/U2BattleController.cs";
        private const string ScriptsRoot = "Assets/_Project/Scripts";

        public static void Run()
        {
            var report = new StringBuilder();
            var failed = false;

            report.AppendLine("=== U7 AssetProvider Verification ===");

            try
            {
                Directory.CreateDirectory("Logs");
                U5VisualCandidateImportSetup.Run();

                var provider = new U5ProofAssetProvider();
                Expect(report, "case provider name", !string.IsNullOrWhiteSpace(provider.ProviderName), ref failed);
                Expect(report, "case approval level proof", provider.ApprovalLevel == AssetApprovalLevel.Proof, ref failed);
                Expect(report, "case proof-only flag", provider.IsProofOnly, ref failed);
                Expect(report, "case proof not production approved", !provider.IsProductionApproved, ref failed);

                var visuals = provider.LoadBattleVisuals();
                Expect(report, "case load battle visuals", visuals != null, ref failed);
                Expect(report, "case player sprite", visuals?.PlayerSprite != null, ref failed);
                Expect(report, "case enemy sprite", visuals?.EnemySprite != null, ref failed);
                Expect(report, "case projectile sprite", visuals?.ProjectileSprite != null, ref failed);
                Expect(report, "case exp sprite", visuals?.ExpSprite != null, ref failed);
                Expect(report, "case hit sprite", visuals?.HitSprite != null, ref failed);
                Expect(report, "case ink sprite", visuals?.InkSprite != null, ref failed);
                Expect(report, "case trail sprite", visuals?.TrailSprite != null, ref failed);

                var battleController = File.Exists(BattleControllerPath) ? File.ReadAllText(BattleControllerPath) : "";
                Expect(report, "case BattleController has no Resources.Load", !battleController.Contains("Resources.Load"), ref failed);
                Expect(report, "case BattleController has no U5Candidates", !battleController.Contains("U5Candidates"), ref failed);
                Expect(report, "case BattleController has no U5 asset id", !ContainsAny(battleController, "u5-yui", "u5-ombu", "u5-exp", "u5-lantern", "u5-ink", "u5-collect"), ref failed);
                Expect(report, "case BattleController has no card UI generation", !ContainsAny(battleController, "PaperCard.Create", "IconFrame.Create", "PaperButton.Create"), ref failed);
                Expect(report, "case addressable loading not referenced", !ScriptsContain("Address" + "ables"), ref failed);
            }
            catch (Exception ex)
            {
                failed = true;
                report.AppendLine("Exception: " + ex);
                Debug.LogError(ex);
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

        private static bool ContainsAny(string content, params string[] needles)
        {
            return needles.Any(content.Contains);
        }

        private static bool ScriptsContain(string needle)
        {
            return Directory.GetFiles(ScriptsRoot, "*.cs", SearchOption.AllDirectories)
                .Where(path => !path.EndsWith(nameof(U7AssetProviderVerification) + ".cs", StringComparison.Ordinal))
                .Where(path => !path.Contains("/Editor/") && !path.Contains("\\Editor\\"))
                .Any(path => File.ReadAllText(path).Contains(needle));
        }
    }
}
