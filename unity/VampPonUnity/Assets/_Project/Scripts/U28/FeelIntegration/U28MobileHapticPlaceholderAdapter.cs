namespace VampPon.UnitySpike.U28.FeelIntegration
{
    public sealed class U28MobileHapticPlaceholderAdapter : IU28HapticPlatformAdapter
    {
        public bool IsDeviceExecutionSupported => false;
        public void Execute(U28HapticDefinition definition) { }
    }
}
