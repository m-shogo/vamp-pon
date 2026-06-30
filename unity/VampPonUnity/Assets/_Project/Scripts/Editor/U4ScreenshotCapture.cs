using System.IO;
using UnityEditor;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    public static class U4ScreenshotCapture
    {
        private static readonly string OutputDir = Path.GetFullPath(
            Path.Combine(Application.dataPath, "../../../..", "docs/design-targets/generated/unity-u4"));

        [MenuItem("VampPon/U4/Capture Screenshot (current resolution)")]
        public static void CaptureCurrentResolution()
        {
            if (!Directory.Exists(OutputDir))
            {
                Directory.CreateDirectory(OutputDir);
            }

            var width = Screen.width;
            var height = Screen.height;
            var filename = $"unity-u4-levelup-{width}x{height}.png";
            var path = Path.Combine(OutputDir, filename);
            ScreenCapture.CaptureScreenshot(path);
            Debug.Log($"U4 Screenshot captured: {path}");
        }
    }
}
