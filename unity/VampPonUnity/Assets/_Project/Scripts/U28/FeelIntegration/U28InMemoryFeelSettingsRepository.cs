namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public sealed class U28InMemoryFeelSettingsRepository : IU28FeelSettingsRepository
    {
        private U28FeelSettingsDraft settings = new();

        public U28FeelSettingsDraft Load() => settings ?? new U28FeelSettingsDraft();

        public void Save(U28FeelSettingsDraft value)
        {
            settings = value ?? new U28FeelSettingsDraft();
        }
    }
}
