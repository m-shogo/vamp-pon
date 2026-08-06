using System;
using System.IO;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.UI.Screens;

namespace VampPon.UnitySpike.Editor
{
    public static class LoadingTopRuntimeCapture
    {
        private const string CaptureRelativePath =
            "docs/design-targets/generated/loading-seasonal-v1/runtime-captures";

        [MenuItem("Vamp Pon/Loading Seasonal/Capture/Force Spring + Hold")]
        private static void ForceSpring() => Force(0);

        [MenuItem("Vamp Pon/Loading Seasonal/Capture/Force Summer + Hold")]
        private static void ForceSummer() => Force(1);

        [MenuItem("Vamp Pon/Loading Seasonal/Capture/Force Autumn + Hold")]
        private static void ForceAutumn() => Force(2);

        [MenuItem("Vamp Pon/Loading Seasonal/Capture/Force Winter + Hold")]
        private static void ForceWinter() => Force(3);

        [MenuItem("Vamp Pon/Loading Seasonal/Capture/Release Loading To TOP")]
        private static void ReleaseToTop()
        {
            LoadingSeasonalView.ReleaseCaptureHold();
            Debug.Log("Loading Seasonal capture hold released; runtime will fade into TOP.");
        }

        [MenuItem("Vamp Pon/Loading Seasonal/Capture/Clear Override")]
        private static void ClearOverride()
        {
            LoadingSeasonalView.ClearCaptureOverride();
            Debug.Log("Loading Seasonal capture override cleared.");
        }

        [MenuItem("Vamp Pon/Loading Seasonal/Capture/Capture Current Game View")]
        private static void CaptureCurrentGameView()
        {
            if (!EditorApplication.isPlaying)
                throw new InvalidOperationException(
                    "Enter Play Mode before capturing Loading or TOP.");

            var loading = UnityEngine.Object.FindFirstObjectByType<LoadingSeasonalView>();
            var top = UnityEngine.Object.FindFirstObjectByType<TopLivingNightView>();
            var frameId = loading != null && loading.gameObject.activeInHierarchy
                ? $"loading-{loading.SelectedArtId}"
                : top != null && top.gameObject.activeInHierarchy
                    ? "top"
                    : "unknown";

            var repositoryRoot = Path.GetFullPath(
                Path.Combine(Application.dataPath, "..", "..", ".."));
            var outputDirectory = Path.Combine(
                repositoryRoot,
                CaptureRelativePath.Replace('/', Path.DirectorySeparatorChar));
            Directory.CreateDirectory(outputDirectory);

            var fileName =
                $"{frameId}-{Screen.width}x{Screen.height}-{DateTime.UtcNow:yyyyMMdd-HHmmss}.png";
            var outputPath = Path.Combine(outputDirectory, fileName);
            ScreenCapture.CaptureScreenshot(outputPath, 1);
            Debug.Log($"Loading/TOP capture requested: {outputPath}");
        }

        private static void Force(int artIndex)
        {
            LoadingSeasonalView.SetCaptureOverride(artIndex, hold: true);
            Debug.Log(
                $"Loading Seasonal art index {artIndex} will be forced and held on the next Play Mode startup.");
        }
    }
}
