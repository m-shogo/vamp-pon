namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public interface IU28FeelSettingsRepository
    {
        U28FeelSettingsDraft Load();
        void Save(U28FeelSettingsDraft settings);
    }
}
