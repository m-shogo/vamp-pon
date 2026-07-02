using System;
using System.IO;
using UnityEditor;
using VampPon.UnitySpike.U28.FeelIntegration;
using VampPon.UnitySpike.U29.PerformanceMobile;

namespace VampPon.UnitySpike.Editor
{
    public static class U29SpriteAtlasPerformanceMobileFpsVerification
    {
        private const string ReportPath = "Logs/u29_sprite_atlas_performance_mobile_fps_verification.txt";

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                Require(U29Stage1PerformanceConstants.TargetWidth == 390, "target width 390");
                Require(U29Stage1PerformanceConstants.TargetHeight == 844, "target height 844");
                Require(U29Stage1PerformanceConstants.TargetFps == 60, "target fps 60");
                Require(U29Stage1PerformanceConstants.MinimumFps == 30, "minimum fps 30");
                Require(U29Stage1PerformanceConstants.MaxActiveEnemies == 38, "enemy cap aligned with U26");
                var policy = new U29RuntimeCapPolicy();
                var gate = new U29EffectCapGate(policy);
                Require(gate.ShouldThrottleEnemySpawn(38), "enemy spawn throttle");
                Require(!gate.CanSpawnHitEffect(16), "hit effect cap");
                Require(gate.ShouldSkipLowPriorityEffect(14, true), "climax low priority skip");
                var pool = new U29Stage1PoolBudget();
                Require(pool.GcAllocationTargetPerFrameZero, "GC allocation target");
                var feel = new U29FeelPerformanceGuard();
                Require(!feel.CanPlayAudio(U28AudioPriority.Low, 8, 4), "low priority audio cap");
                Require(feel.CanPlayAudio(U28AudioPriority.Critical, 8, 4), "critical audio can pass cap");
                Require(feel.HapticCooldownFor(U28HapticEventId.KokuyouActivation) >= 1f, "Kokuyou haptic cooldown");
                Require(new U29SpriteAtlasPolicyModel().AtlasGroups.Count >= 5, "Sprite Atlas policy groups");
                Require(!Directory.Exists("Assets/AddressableAssetsData"), "Addressables not introduced");
                File.WriteAllText(ReportPath, "U29 sprite atlas performance mobile FPS verification passed; device measurement not executed");
                EditorApplication.Exit(0);
            }
            catch (Exception ex)
            {
                File.WriteAllText(ReportPath, ex.ToString());
                UnityEngine.Debug.LogError(ex);
                EditorApplication.Exit(1);
            }
        }

        private static void Require(bool condition, string label)
        {
            if (!condition) throw new InvalidOperationException(label);
        }
    }
}
