using System;
using UnityEngine;
using VampPon.UnitySpike.U5;

namespace VampPon.UnitySpike.Runtime.Visuals
{
    public sealed class RuntimeVisualAssetProvider : IAssetProvider
    {
        public const string RegistryResourcePath = "RuntimeVisuals/Stage1/Stage1RuntimeVisualAssetRegistry";
        private const string CommonResourceRoot = "RuntimeVisuals/Stage1/Common/";

        public string ProviderName => "RuntimeVisualAssetProvider";
        public bool IsProofOnly => false;
        public bool DevelopmentFallbackUsed { get; private set; }

        public BattleVisualAssetSet LoadBattleVisuals()
        {
            var registry = Resources.Load<Stage1RuntimeVisualAssetRegistry>(RegistryResourcePath)
                ?? Missing<Stage1RuntimeVisualAssetRegistry>("registry:stage1", RegistryResourcePath, "load");
            registry.Validate();
            var character = registry.CreatePlayerAnimationSet();
            var enemy = registry.CreateEnemyAnimationSet();

            return new BattleVisualAssetSet
            {
                PlayerSprite = character.Idle.Right[0],
                EnemySprite = enemy.Idle[0],
                ProjectileSprite = LoadSingle("runtime-lantern-spark"),
                ExpSprite = LoadSingle("runtime-exp-fragment"),
                HitSprite = LoadSingle("runtime-lantern-spark"),
                InkSprite = LoadSingle("runtime-ink-burst"),
                TrailSprite = LoadSingle("runtime-collect-trail"),
                PlayerAnimation = character,
                EnemyAnimation = enemy,
                PlayerSourcePath = registry.PlayerSourcePath,
                EnemySourcePath = registry.EnemySourcePath,
                PlayerPixelsPerUnit = registry.PlayerPixelsPerUnit,
                EnemyPixelsPerUnit = registry.EnemyPixelsPerUnit,
                PlayerPivot = registry.PlayerPivot,
                EnemyPivot = registry.EnemyPivot,
                PlayerVisualScale = registry.PlayerVisualScale,
                EnemyVisualScale = registry.EnemyVisualScale,
            };
        }

        private Sprite LoadSingle(string name)
        {
            var sprite = Resources.Load<Sprite>(CommonResourceRoot + name);
            if (sprite != null) return sprite;
            return Missing<Sprite>("common:" + name, CommonResourceRoot + name, "single");
        }

        private T Missing<T>(string assetId, string path, string state) where T : class
        {
            var message = $"Runtime visual missing: assetId={assetId}, expectedPath={path}, provider={ProviderName}, scene={UnityEngine.SceneManagement.SceneManager.GetActiveScene().name}, frameState={state}, fallbackType=none";
            Debug.LogError(message);
            throw new InvalidOperationException(message);
        }
    }
}
