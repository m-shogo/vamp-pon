namespace VampPon.UnitySpike.U31.MobileQa
{
    public sealed class U31QaDeviceProfile
    {
        public string DeviceName { get; set; } = "Unity Editor";
        public string Platform { get; set; } = "Editor";
        public string OsVersion { get; set; } = "NOT_MEASURED";
        public string BuildType { get; set; } = "Editor batchmode";
        public string Resolution { get; set; } = "390x844";
        public int TargetFps { get; set; } = 60;
    }
}
