using System;
using System.IO;
using System.Linq;
using UnityEditor;
using VampPon.UnitySpike.U26.FirstPlayableBalance;
using VampPon.UnitySpike.U31.MobileQa;

namespace VampPon.UnitySpike.Editor
{
    public static class U31Stage1MobileQaVerification
    {
        private const string ReportPath = "Logs/u31_stage1_mobile_qa_verification.txt";

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                var session = new U31Stage1QaSessionFactory().CreateEditorSession();
                Require(!session.ProductionApproved, "production approval remains false");
                Require(session.DeviceProfile.DeviceName == "Unity Editor", "editor device profile");
                Require(session.DeviceProfile.Resolution == "390x844", "390x844 QA profile");
                Require(session.QaScenarioResults.Count == 20, "20 QA scenarios");
                Require(session.QaScenarioResults.Any(scenario => scenario.Verdict == U31QaVerdict.NotMeasured), "not measured scenarios exist");
                Require(session.Findings.Any(finding => finding.Severity == U31QaFindingSeverity.Blocker), "blocker remains");
                Require(session.Findings.Count(finding => finding.Severity == U31QaFindingSeverity.NotMeasured) >= 3, "not measured findings");
                Require(session.TuningActions.Count == 4, "tuning action count");
                Require(U26Stage1BalanceConstants.PickupRadius == 1.75f, "pickup radius tuned");
                Require(U26Stage1BalanceConstants.BasicWeaponCooldownMs == 900, "basic cooldown tuned");
                Require(new U26Stage1WaveDraft().At(0).MaxEnemies == 7, "opening max enemies tuned");
                Require(new U26Stage1WaveDraft().At(30).MaxEnemies == 12, "first pressure max enemies tuned");
                Require(U26Stage1BalanceConstants.StageClearSeconds == 480, "stage clear unchanged");
                Require(U26Stage1BalanceConstants.FirstLevelUpTargetSeconds == 30, "first LevelUp target unchanged");
                Require(!Directory.Exists("Assets/AddressableAssetsData"), "Addressables not introduced");
                File.WriteAllText(ReportPath, "U31 Stage1 mobile QA verification passed; productionApproved=false; mobile metrics NOT_MEASURED");
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
