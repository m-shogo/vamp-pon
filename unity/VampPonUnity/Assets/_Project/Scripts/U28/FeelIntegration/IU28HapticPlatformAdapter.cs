namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public interface IU28HapticPlatformAdapter
    {
        bool IsDeviceExecutionSupported { get; }
        void Execute(U28HapticDefinition definition);
    }
}
