using UnityEngine;

namespace VampPon.UnitySpike.U4
{
    public static class U4TimeScaleGuard
    {
        private static bool overlayPaused;

        public static bool IsOverlayPaused => overlayPaused;

        public static void PauseForOverlay()
        {
            overlayPaused = true;
            Time.timeScale = 0f;
        }

        public static void ResumeFromOverlay()
        {
            overlayPaused = false;
            Time.timeScale = 1f;
        }

        public static void ForceRestore()
        {
            overlayPaused = false;
            Time.timeScale = 1f;
        }
    }
}
