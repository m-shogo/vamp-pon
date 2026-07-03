using System.Linq;
using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.U39.AudioReadiness
{
    public sealed class U39AudioReadinessFactory
    {
        public U39AudioReadinessReport Create(string projectRoot)
        {
            var registry = new U28AudioEventRegistry();
            var library = new U39FinalCandidateClipLibrary(projectRoot);
            var guard = new U39AudioClippingGuard();
            var report = new U39AudioReadinessReport
            {
                AudioReadyForRc = false,
                FinalSeReady = true,
                AudioMixerReady = false,
                AudioLatencyMeasured = false,
                HapticMeasured = false,
                RcReady = false,
                ProductionApproved = false,
                AudioClippingRisk = "low-to-medium-editor-static",
            };

            foreach (var definition in registry.All.Where(IsStage1U39Target))
            {
                report.Inventory.Add(new U39SeInventoryItem
                {
                    EventId = definition.Id,
                    Path = library.GetClipPath(definition),
                    CurrentUsage = $"{definition.Category} Stage1 feedback",
                    DurationSeconds = DurationFor(definition.Id),
                    PeakEstimate = PeakFor(definition.Id),
                    Category = definition.Category,
                    Priority = definition.Priority,
                    Loop = false,
                    Status = library.Exists(definition) ? U39SeReadinessStatus.FinalCandidate : U39SeReadinessStatus.NeedsReplacement,
                    Risk = guard.PeakRiskFor(PeakFor(definition.Id), definition.Priority),
                    NextAction = "device speaker review and human mix review before final approval",
                });
            }

            if (report.Inventory.Any(item => item.Status != U39SeReadinessStatus.FinalCandidate)) report.FinalSeReady = false;
            report.Blockers.Add("audio latency NOT_MEASURED on device");
            report.Blockers.Add("haptic device behavior NOT_MEASURED");
            report.Blockers.Add("device speaker clipping not measured");
            report.Cautions.Add("finalCandidate SE is not final approved");
            report.Cautions.Add("AudioMixer routing remains draft until device mix review");
            return report;
        }

        private static bool IsStage1U39Target(U28AudioEventDefinition definition)
        {
            return definition.Id != U28AudioEventId.PlayerHit
                && definition.Id != U28AudioEventId.LevelupReady
                && definition.Id != U28AudioEventId.CardHover
                && definition.Id != U28AudioEventId.RareSealPulse
                && definition.Id != U28AudioEventId.KokuyouActiveLoop
                && definition.Id != U28AudioEventId.ResultOpen;
        }

        private static float DurationFor(U28AudioEventId id)
        {
            return id switch
            {
                U28AudioEventId.PickupXp => 0.11f,
                U28AudioEventId.EnemyHitSoft => 0.08f,
                U28AudioEventId.KokuyouActivation => 0.54f,
                U28AudioEventId.EvolutionComplete => 0.46f,
                _ => 0.22f,
            };
        }

        private static float PeakFor(U28AudioEventId id)
        {
            return id switch
            {
                U28AudioEventId.KokuyouActivation => 0.20f,
                U28AudioEventId.EvolutionComplete => 0.19f,
                U28AudioEventId.PickupXp => 0.12f,
                U28AudioEventId.EnemyHitSoft => 0.11f,
                _ => 0.16f,
            };
        }
    }
}
