using UnityEngine;
using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.U18.Kokuyou
{
    public sealed class KokuyouRuntimePrototypeController : MonoBehaviour
    {
        private const string ActivateOwner = "u18-kokuyou-activate";
        private const string EndingOwner = "u18-kokuyou-ending";
        private float activeRemaining;
        private float cooldownRemaining;

        public KokuyouGaugeProof Gauge { get; } = new();
        public KokuyouRuntimeState State { get; private set; } = KokuyouRuntimeState.Idle;
        public float ActiveDuration { get; set; } = 5f;
        public float CooldownDuration { get; set; } = 0.5f;
        public bool BuffProofActive => State == KokuyouRuntimeState.Active;
        public bool RecoilProofActive => State == KokuyouRuntimeState.Ending || State == KokuyouRuntimeState.Cooldown;
        public int ActivatedCount { get; private set; }

        public void ProofDamageTaken()
        {
            if (State == KokuyouRuntimeState.Active || State == KokuyouRuntimeState.Activating) return;
            KokuyouChargeRuleProof.ProofDamageTaken(Gauge);
            State = Gauge.IsReady ? KokuyouRuntimeState.Ready : KokuyouRuntimeState.Charging;
        }

        public void ProofFillGauge()
        {
            if (State == KokuyouRuntimeState.Active || State == KokuyouRuntimeState.Activating) return;
            KokuyouChargeRuleProof.ProofFillGauge(Gauge);
            State = KokuyouRuntimeState.Ready;
        }

        public bool TryActivate()
        {
            if (!Gauge.IsReady || State != KokuyouRuntimeState.Ready || BattleTimeScaleService.IsPaused)
            {
                return false;
            }

            State = KokuyouRuntimeState.Activating;
            BattleTimeScaleService.TriggerHitStop(ActivateOwner, 0.08f, 0.05f);
            ActivatedCount += 1;
            activeRemaining = ActiveDuration;
            State = KokuyouRuntimeState.Active;
            return true;
        }

        public void Tick(float unscaledDeltaTime)
        {
            BattleTimeScaleService.Tick(unscaledDeltaTime);
            if (unscaledDeltaTime <= 0f) return;

            if (State == KokuyouRuntimeState.Active)
            {
                activeRemaining -= unscaledDeltaTime;
                if (activeRemaining <= 0f)
                {
                    State = KokuyouRuntimeState.Ending;
                    BattleTimeScaleService.TriggerHitStop(EndingOwner, 0.04f, 0.25f);
                    Gauge.Reset();
                    cooldownRemaining = CooldownDuration;
                    State = KokuyouRuntimeState.Cooldown;
                }
                return;
            }

            if (State == KokuyouRuntimeState.Cooldown)
            {
                cooldownRemaining -= unscaledDeltaTime;
                if (cooldownRemaining <= 0f)
                {
                    State = KokuyouRuntimeState.Idle;
                }
            }
        }

        public void ForceEnd()
        {
            Gauge.Reset();
            activeRemaining = 0f;
            cooldownRemaining = 0f;
            State = KokuyouRuntimeState.Idle;
            BattleTimeScaleService.ForceRestore();
        }
    }
}
