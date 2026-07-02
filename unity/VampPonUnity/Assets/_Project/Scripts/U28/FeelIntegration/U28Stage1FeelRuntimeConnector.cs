using VampPon.UnitySpike.U24.ClimaxPolish;
using VampPon.UnitySpike.U27.SaveRewardUnlock;

namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public sealed class U28Stage1FeelRuntimeConnector
    {
        private readonly U28FeelRouter feelRouter;
        private bool resultUnlockSoundPlayed;
        private bool stageRouteUnlockSoundPlayed;

        public U28Stage1FeelRuntimeConnector(U28FeelRouter feelRouter)
        {
            this.feelRouter = feelRouter;
        }

        public U28RuntimeFeelProofState ProofState { get; } = new();

        public void OnBattleStart()
        {
            feelRouter.Play(U28AudioEventId.BattleStart);
            ProofState.BattleStartConnected = true;
        }

        public void OnEnemyHit()
        {
            feelRouter.Play(U28AudioEventId.EnemyHitSoft);
            ProofState.HitConnected = true;
        }

        public void OnEnemyDefeat()
        {
            feelRouter.Play(U28AudioEventId.EnemyDefeatInk);
            ProofState.HitConnected = true;
        }

        public void OnPlayerDamage()
        {
            feelRouter.Play(U28AudioEventId.PlayerDamage);
            ProofState.DamageConnected = true;
        }

        public void OnXpPickup()
        {
            feelRouter.Play(U28AudioEventId.PickupXp);
            ProofState.PickupConnected = true;
        }

        public void OnHealPickup()
        {
            feelRouter.Play(U28AudioEventId.PickupHeal);
            ProofState.PickupConnected = true;
        }

        public void OnRarePickup()
        {
            feelRouter.Play(U28AudioEventId.PickupRare);
            ProofState.PickupConnected = true;
            ProofState.RareConnected = true;
        }

        public void OnU25FeedbackEvent(string eventName)
        {
            switch (eventName)
            {
                case "levelup_open":
                    feelRouter.Play(U28AudioEventId.LevelupOpen);
                    ProofState.LevelUpConnected = true;
                    break;
                case "card_select":
                    feelRouter.Play(U28AudioEventId.CardSelect);
                    ProofState.CardSelectConnected = true;
                    break;
                case "result_stamp":
                    feelRouter.Play(U28AudioEventId.ResultStamp);
                    ProofState.ResultConnected = true;
                    break;
                case "stage_select_lantern":
                    feelRouter.Play(U28AudioEventId.StageSelectLantern);
                    ProofState.StageSelectConnected = true;
                    break;
                case U24ClimaxFeedbackHook.RareSealPulse:
                    feelRouter.Play(U28AudioEventId.RareSealPulse);
                    ProofState.RareConnected = true;
                    break;
                case U24ClimaxFeedbackHook.EvolutionMaterialConverge:
                    feelRouter.Play(U28AudioEventId.EvolutionConvergence);
                    ProofState.EvolutionConnected = true;
                    break;
                case U24ClimaxFeedbackHook.EvolutionComplete:
                    feelRouter.Play(U28AudioEventId.EvolutionComplete);
                    ProofState.EvolutionConnected = true;
                    break;
                case U24ClimaxFeedbackHook.KokuyouReadyPulse:
                    feelRouter.Play(U28AudioEventId.KokuyouGaugeReady);
                    ProofState.KokuyouConnected = true;
                    break;
                case U24ClimaxFeedbackHook.KokuyouActivateCutin:
                    feelRouter.Play(U28AudioEventId.KokuyouActivation);
                    ProofState.KokuyouConnected = true;
                    break;
                case U24ClimaxFeedbackHook.KokuyouEndingRelease:
                    feelRouter.Play(U28AudioEventId.KokuyouEnding);
                    ProofState.KokuyouConnected = true;
                    break;
            }
        }

        public void OnResultOpen(U27ResultIntegrationModel result)
        {
            feelRouter.Play(U28AudioEventId.ResultOpen);
            feelRouter.Play(U28AudioEventId.ResultStamp);
            if (result != null && result.RewardDraft != null) feelRouter.Play(U28AudioEventId.RewardCard);
            if (result != null && result.Unlocks.Count > 0 && !resultUnlockSoundPlayed)
            {
                feelRouter.Play(U28AudioEventId.UnlockReveal);
                resultUnlockSoundPlayed = true;
            }

            ProofState.ResultConnected = true;
        }

        public void OnStageSelectOpen(U27StageSelectIntegrationModel model)
        {
            feelRouter.Play(U28AudioEventId.StageSelectLantern);
            if (model != null && model.Stage2PlaceholderUnlocked && !stageRouteUnlockSoundPlayed)
            {
                feelRouter.Play(U28AudioEventId.StageRouteUnlock);
                stageRouteUnlockSoundPlayed = true;
            }

            ProofState.StageSelectConnected = true;
        }

        public void OnRetryConfirm()
        {
            feelRouter.Play(U28AudioEventId.RetryConfirm);
            ProofState.RetryConnected = true;
        }
    }
}
