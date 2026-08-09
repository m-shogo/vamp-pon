using UnityEngine;
using VampPon.UnitySpike.U28.FeelIntegration;
using VampPon.UnitySpike.U39.AudioReadiness;
using VampPon.UnitySpike.U49.AudioHaptic;

namespace VampPon.UnitySpike.Runtime
{
    [RequireComponent(typeof(U49AudioHapticRuntimeOwner))]
    public sealed class U43RuntimeFeedbackBridge : MonoBehaviour
    {
        private U49AudioHapticRuntimeOwner owner;

        public static U43RuntimeFeedbackBridge Instance { get; private set; }

        public int AudioPlayCount => owner?.Diagnostics.audioPlayCount ?? 0;
        public int HapticRequestCount => owner?.Diagnostics.hapticRequestCount ?? 0;
        public bool AudioRuntimeHookReady => owner?.AudioRuntimeReady == true;
        public bool HapticRuntimeHookReady => owner != null;
        public bool UsesRuntimeHookToneOnly => false;
        public bool AudioMixerAssetConnected => owner?.AudioRuntimeReady == true;
        public bool AudioMixerReady => false;
        public bool AudioLatencyMeasured => false;
        public bool HapticMeasured => false;
        public string FinalCandidateReferenceRoot => U39FinalCandidateClipLibrary.FinalCandidateRoot;
        public U49AudioHapticRuntimeOwner Owner => owner;

        private void Awake()
        {
            Instance = this;
            owner = GetComponent<U49AudioHapticRuntimeOwner>();
        }

        private void OnDestroy()
        {
            if (Instance == this) Instance = null;
        }

        public static void PlayButtonTapIfAvailable()
        {
            Instance?.Play(U28AudioEventId.CardConfirm, true);
        }

        public void ApplySettings(AppPreferenceSnapshot settings) => owner?.ApplySettings(settings);
        public void PlayBattleStart() => Play(U28AudioEventId.BattleStart, true);
        public void PlayWeaponFire() => Play(U28AudioEventId.WeaponFireSoft, false);
        public void PlayEnemyHit() => Play(U28AudioEventId.EnemyHitSoft, false);
        public void PlayEnemyDefeat() => Play(U28AudioEventId.EnemyDefeatInk, true);
        public void PlayPickup() => Play(U28AudioEventId.PickupXp, false);
        public void PlayHealPickup() => Play(U28AudioEventId.PickupHeal, true);
        public void PlayPlayerDamage() => Play(U28AudioEventId.PlayerDamage, true);
        public void PlayLevelUp() => Play(U28AudioEventId.LevelupOpen, true);
        public void PlayCardSelect() => Play(U28AudioEventId.CardSelect, true);
        public void PlayRare() => Play(U28AudioEventId.PickupRare, true);
        public void PlayEvolutionConvergence() => Play(U28AudioEventId.EvolutionConvergence, true);
        public void PlayEvolution() => Play(U28AudioEventId.EvolutionComplete, true);
        public void PlayKokuyouReady() => Play(U28AudioEventId.KokuyouGaugeReady, true);
        public void PlayKokuyou() => Play(U28AudioEventId.KokuyouActivation, true);
        public void PlayKokuyouEnding() => Play(U28AudioEventId.KokuyouEnding, true);
        public void PlayResult() => Play(U28AudioEventId.ResultStamp, true);
        public void PlayRewardCard() => Play(U28AudioEventId.RewardCard, false);
        public void PlayUnlockReveal() => Play(U28AudioEventId.UnlockReveal, true);
        public void PlayRetry() => Play(U28AudioEventId.RetryConfirm, true);
        public void PlayStageSelect() => Play(U28AudioEventId.StageSelectLantern, true);
        public void PlayStageRouteUnlock() => Play(U28AudioEventId.StageRouteUnlock, true);

        public bool Play(U28AudioEventId id, bool haptic)
        {
            var requestedAt = Time.realtimeSinceStartupAsDouble;
            return owner != null && owner.Play(id, haptic, requestedAt);
        }

        public void RequestHaptic()
        {
            owner?.PlayHaptic(U28HapticEventId.LightTap);
        }
    }
}
