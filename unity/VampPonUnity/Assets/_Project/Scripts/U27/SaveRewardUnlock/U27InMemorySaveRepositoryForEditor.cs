namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public sealed class U27InMemorySaveRepositoryForEditor : U27StageProgressRepositoryBase
    {
        public override U27SaveDataModel Load()
        {
            CachedData = FallbackIfInvalid(CachedData);
            return CachedData;
        }

        public override void Save(U27SaveDataModel data)
        {
            CachedData = FallbackIfInvalid(data);
        }

        public override void ResetProofDebug()
        {
            CachedData = U27SaveDataModel.CreateDefault();
        }

        public void InjectCorruptedDataForVerification()
        {
            CachedData = new U27SaveDataModel { Version = -1 };
        }
    }
}
