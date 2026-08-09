using VampPon.UnitySpike.U28.FeelIntegration;

namespace VampPon.UnitySpike.U49.AudioHaptic
{
    public sealed class U49NoopHapticAdapter : IU28HapticPlatformAdapter
    {
        public bool IsDeviceExecutionSupported => false;
        public bool LastExecutionSucceeded => false;
        public U49HapticCapability Capability => U49HapticCapability.Unsupported;
        public string LastError => string.Empty;
        public bool Initialize() => true;
        public void Execute(U28HapticDefinition definition) { }
        public void Suspend() { }
        public void Resume() { }
        public void Shutdown() { }
    }
}
