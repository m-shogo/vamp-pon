using VampPon.UnitySpike.Runtime;

namespace VampPon.UnitySpike.U4
{
    public static class U4TimeScaleGuard
    {
        private const string OverlayOwner = "U4LevelUpOverlay";
        private static bool overlayPaused;

        public static bool IsOverlayPaused => overlayPaused;

        public static void PauseForOverlay()
        {
            overlayPaused = true;
            BattleTimeScaleService.RegisterPause(OverlayOwner);
        }

        public static void ResumeFromOverlay()
        {
            overlayPaused = false;
            BattleTimeScaleService.ReleasePause(OverlayOwner);
        }

        public static void ForceRestore()
        {
            overlayPaused = false;
            BattleTimeScaleService.ForceRestore();
        }
    }
}
