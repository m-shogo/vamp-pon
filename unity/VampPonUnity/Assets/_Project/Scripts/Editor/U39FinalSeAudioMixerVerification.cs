using System;
using System.IO;
using System.Linq;
using UnityEditor;
using VampPon.UnitySpike.U28.FeelIntegration;
using VampPon.UnitySpike.U39.AudioReadiness;

namespace VampPon.UnitySpike.Editor
{
    public static class U39FinalSeAudioMixerVerification
    {
        private const string ReportPath = "Logs/u39_final_se_audiomixer_verification.txt";

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                var root = RepoRoot();
                var report = new U39AudioReadinessFactory().Create(root);
                var connector = new U39Stage1AudioReadinessConnector(root);

                Require(!report.AudioReadyForRc, "audioReadyForRc remains false");
                Require(report.FinalSeReady, "final candidate SE exists for U39 targets");
                Require(!report.AudioMixerReady, "AudioMixer asset remains not ready");
                Require(!report.AudioLatencyMeasured, "audio latency remains not measured");
                Require(!report.HapticMeasured, "haptic remains not measured");
                Require(!report.RcReady, "rcReady remains false");
                Require(!report.ProductionApproved, "productionApproved remains false");
                Require(report.Inventory.Count >= 20, "U39 inventory covers Stage1 events");
                Require(report.Inventory.All(item => item.Status == U39SeReadinessStatus.FinalCandidate), "all U39 target clips are finalCandidate");

                foreach (var id in new[]
                {
                    U28AudioEventId.BattleStart,
                    U28AudioEventId.PickupXp,
                    U28AudioEventId.PickupHeal,
                    U28AudioEventId.PickupRare,
                    U28AudioEventId.LevelupOpen,
                    U28AudioEventId.CardSelect,
                    U28AudioEventId.CardConfirm,
                    U28AudioEventId.EnemyHitSoft,
                    U28AudioEventId.EnemyDefeatInk,
                    U28AudioEventId.PlayerDamage,
                    U28AudioEventId.EvolutionConvergence,
                    U28AudioEventId.EvolutionComplete,
                    U28AudioEventId.KokuyouGaugeReady,
                    U28AudioEventId.KokuyouActivation,
                    U28AudioEventId.KokuyouEnding,
                    U28AudioEventId.ResultStamp,
                    U28AudioEventId.RewardCard,
                    U28AudioEventId.UnlockReveal,
                    U28AudioEventId.StageSelectLantern,
                    U28AudioEventId.RetryConfirm,
                })
                {
                    connector.Connect(id);
                }

                Require(connector.MissingFinalCandidateClips.Count == 0, "no missing finalCandidate clips");
                Require(connector.Connect(U28AudioEventId.EnemyHitSoft, 8, 4) == false, "low priority spam is guarded");
                Require(connector.GuardedEvents.Count > 0, "spam guard recorded");
                Require(!Directory.Exists("Assets/AddressableAssetsData"), "Addressables not introduced");
                File.WriteAllText(ReportPath, $"U39 final SE AudioMixer verification passed; clips={report.Inventory.Count}; audioReadyForRc=false; productionApproved=false");
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

        private static string RepoRoot() => Path.GetFullPath(Path.Combine(Directory.GetParent(UnityEngine.Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory(), "../.."));
    }
}
