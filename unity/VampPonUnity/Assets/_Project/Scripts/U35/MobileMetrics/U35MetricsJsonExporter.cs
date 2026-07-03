using System.Globalization;
using System.Text;

namespace VampPon.UnitySpike.U35.MobileMetrics
{
    public sealed class U35MetricsJsonExporter
    {
        public string Export(U35MobileMetricsSession session)
        {
            var sb = new StringBuilder();
            sb.AppendLine("{");
            Line(sb, "version", session.Version, true);
            Line(sb, "sessionStatus", session.SessionStatus.ToString(), true);
            Line(sb, "productionApproved", session.ProductionApproved, true);
            Line(sb, "mobileMetricsReady", session.MobileMetricsReady, true);
            Line(sb, "measuredAt", session.MeasuredAtPlaceholder, true);
            sb.AppendLine("  \"deviceProfile\": {");
            Line(sb, "deviceName", session.DeviceProfile.DeviceName, true, 4);
            Line(sb, "platform", session.DeviceProfile.Platform, true, 4);
            Line(sb, "osVersion", session.DeviceProfile.OsVersion, true, 4);
            Line(sb, "buildType", session.DeviceProfile.BuildType, true, 4);
            Line(sb, "resolution", session.DeviceProfile.Resolution, true, 4);
            Line(sb, "targetFps", session.DeviceProfile.TargetFps, false, 4);
            sb.AppendLine("  },");
            sb.AppendLine("  \"performance\": {");
            Line(sb, "status", session.Performance.Status.ToString(), true, 4);
            NullableLine(sb, "averageFps", session.Performance.AverageFps, true, 4);
            NullableLine(sb, "minFps", session.Performance.MinFps, true, 4);
            NullableLine(sb, "maxFps", session.Performance.MaxFps, true, 4);
            NullableLine(sb, "frameTimeMs", session.Performance.FrameTimeMs, true, 4);
            NullableLine(sb, "memoryMb", session.Performance.MemoryMb, true, 4);
            NullableLine(sb, "peakMemoryMb", session.Performance.PeakMemoryMb, true, 4);
            NullableLine(sb, "gcAllocPerMinute", session.Performance.GcAllocPerMinute, true, 4);
            NullableLine(sb, "drawCalls", session.Performance.DrawCalls, true, 4);
            NullableLine(sb, "batches", session.Performance.Batches, true, 4);
            Line(sb, "thermalState", session.Performance.ThermalState, true, 4);
            Line(sb, "batteryDrainNote", session.Performance.BatteryDrainNote, false, 4);
            sb.AppendLine("  },");
            sb.AppendLine("  \"audio\": {");
            Line(sb, "audioLatencyStatus", session.Audio.AudioLatencyStatus.ToString(), true, 4);
            Line(sb, "audioClippingStatus", session.Audio.AudioClippingStatus.ToString(), true, 4);
            Line(sb, "activeVoicesCount", session.Audio.ActiveVoicesCount, true, 4);
            Line(sb, "note", session.Audio.Note, false, 4);
            sb.AppendLine("  },");
            sb.AppendLine("  \"haptic\": {");
            Line(sb, "hapticBehaviorStatus", session.Haptic.HapticBehaviorStatus.ToString(), true, 4);
            Line(sb, "hapticEventCount", session.Haptic.HapticEventCount, true, 4);
            Line(sb, "note", session.Haptic.Note, false, 4);
            sb.AppendLine("  }");
            sb.AppendLine("}");
            return sb.ToString();
        }

        private static void Line(StringBuilder sb, string key, string value, bool comma, int spaces = 2)
        {
            sb.Append(' ', spaces).Append('"').Append(key).Append("\": \"").Append(Escape(value)).Append('"');
            if (comma) sb.Append(',');
            sb.AppendLine();
        }

        private static void Line(StringBuilder sb, string key, bool value, bool comma, int spaces = 2)
        {
            sb.Append(' ', spaces).Append('"').Append(key).Append("\": ").Append(value ? "true" : "false");
            if (comma) sb.Append(',');
            sb.AppendLine();
        }

        private static void Line(StringBuilder sb, string key, int value, bool comma, int spaces = 2)
        {
            sb.Append(' ', spaces).Append('"').Append(key).Append("\": ").Append(value);
            if (comma) sb.Append(',');
            sb.AppendLine();
        }

        private static void NullableLine(StringBuilder sb, string key, float? value, bool comma, int spaces)
        {
            sb.Append(' ', spaces).Append('"').Append(key).Append("\": ");
            sb.Append(value.HasValue ? value.Value.ToString("0.###", CultureInfo.InvariantCulture) : "null");
            if (comma) sb.Append(',');
            sb.AppendLine();
        }

        private static void NullableLine(StringBuilder sb, string key, int? value, bool comma, int spaces)
        {
            sb.Append(' ', spaces).Append('"').Append(key).Append("\": ");
            sb.Append(value.HasValue ? value.Value.ToString(CultureInfo.InvariantCulture) : "null");
            if (comma) sb.Append(',');
            sb.AppendLine();
        }

        private static string Escape(string value) => (value ?? string.Empty).Replace("\\", "\\\\").Replace("\"", "\\\"");
    }
}
