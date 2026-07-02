using VampPon.UnitySpike.U24.ClimaxPolish;

namespace VampPon.UnitySpike.U25.Stage1Loop
{
    public sealed class U25Stage1FeedbackHooks
    {
        public string LastEvent { get; private set; } = "none";
        public bool HapticExecutedOnDevice { get; private set; }

        public void LevelUpOpen() => LastEvent = "levelup_open";
        public void CardSelect() => LastEvent = "card_select";
        public void RareSeal() => LastEvent = U24ClimaxFeedbackHook.RareSealPulse;
        public void EvolutionConvergence() => LastEvent = U24ClimaxFeedbackHook.EvolutionMaterialConverge;
        public void EvolutionComplete() => LastEvent = U24ClimaxFeedbackHook.EvolutionComplete;
        public void KokuyouReady() => LastEvent = U24ClimaxFeedbackHook.KokuyouReadyPulse;
        public void KokuyouActivation() => LastEvent = U24ClimaxFeedbackHook.KokuyouActivateCutin;
        public void KokuyouEnding() => LastEvent = U24ClimaxFeedbackHook.KokuyouEndingRelease;
        public void ResultStamp() => LastEvent = "result_stamp";
        public void StageSelectLantern() => LastEvent = "stage_select_lantern";
    }
}
