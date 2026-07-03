namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35MobileDeviceProfile
    {
        public string DeviceName { get; set; } = "Unity Editor";
        public string Platform { get; set; } = "Editor";
        public string OsVersion { get; set; } = "EDITOR_ONLY";
        public string BuildType { get; set; } = "Editor batchmode";
        public string Resolution { get; set; } = "390x844";
        public string GraphicsApi { get; set; } = "EDITOR_ONLY";
        public int TargetFps { get; set; } = 60;
    }
}
