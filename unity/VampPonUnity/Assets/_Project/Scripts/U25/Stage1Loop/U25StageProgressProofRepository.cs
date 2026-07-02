namespace VampPon.UnitySpike.U25.Stage1Loop
{
    public sealed class U25StageProgressProofRepository
    {
        private U25StageProgressDraftModel cached = new();

        public U25StageProgressDraftModel LoadDraft() => cached;

        public void SaveDraft(U25StageProgressDraftModel model)
        {
            cached = model ?? new U25StageProgressDraftModel();
            cached.IsSaveFinal = false;
        }
    }
}
