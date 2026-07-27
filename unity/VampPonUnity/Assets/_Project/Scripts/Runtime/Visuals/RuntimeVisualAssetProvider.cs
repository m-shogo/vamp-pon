using System;
using System.Linq;
using UnityEngine;
using VampPon.UnitySpike.U5;

namespace VampPon.UnitySpike.Runtime.Visuals
{
    public sealed class RuntimeVisualAssetProvider : IAssetProvider
    {
        private U48ProductionVisualCatalog catalog;

        public string ProviderName => "RuntimeVisualAssetProvider";
        public AssetApprovalLevel ApprovalLevel => AssetApprovalLevel.Production;
        public bool IsProofOnly => false;
        public bool IsProductionApproved => true;
        public bool DevelopmentFallbackUsed { get; private set; }

        public BattleVisualAssetSet LoadBattleVisuals()
        {
            catalog = U48ProductionVisualCatalog.LoadRequired();
            var baseline = Resources.Load<Stage1RuntimeVisualAssetRegistry>("RuntimeVisuals/Stage1/Stage1RuntimeVisualAssetRegistry") ?? Missing<Stage1RuntimeVisualAssetRegistry>("registry:stage1", "RuntimeVisuals/Stage1/Stage1RuntimeVisualAssetRegistry", "load");
            baseline.Validate(); var character = Player(catalog, baseline); var enemy = Enemy(catalog, baseline);

            return new BattleVisualAssetSet
            {
                PlayerSprite = character.Idle.Right[0],
                EnemySprite = enemy.Idle[0],
                ProjectileSprite = catalog.SpriteFor("common-projectile"), ExpSprite = catalog.SpriteFor("pickup-exp"), HealingSprite = catalog.SpriteFor("pickup-healing"), HitSprite = catalog.SpriteFor("hit-effect"),
                InkSprite = catalog.SpriteFor("enemy-death-effect"), TrailSprite = catalog.SpriteFor("movement-trail"),
                PlayerAnimation = character,
                EnemyAnimation = enemy,
                PlayerSourcePath = catalog.Resolve("player-yui").productionPath, EnemySourcePath = catalog.Resolve("enemy-onbu").productionPath,
                PlayerPixelsPerUnit = baseline.PlayerPixelsPerUnit, EnemyPixelsPerUnit = baseline.EnemyPixelsPerUnit,
                PlayerPivot = baseline.PlayerPivot, EnemyPivot = baseline.EnemyPivot, PlayerVisualScale = baseline.PlayerVisualScale, EnemyVisualScale = baseline.EnemyVisualScale,
            };
        }
        private static RuntimeCharacterAnimationSet Player(U48ProductionVisualCatalog value, Stage1RuntimeVisualAssetRegistry baseline) { var s=value.NamedSprites("player-yui"); Sprite[] R(params string[] names)=>names.Select(name=>s.TryGetValue(name,out var sprite)?sprite:throw new InvalidOperationException("U48 production player frame missing: "+name)).ToArray(); return new RuntimeCharacterAnimationSet(new RuntimeDirectionalFrames(R("yui_idle_l_00","yui_idle_l_01"),R("yui_idle_r_01")),new RuntimeDirectionalFrames(R("yui_walk_l_00","yui_walk_l_01"),R("yui_walk_r_00","yui_walk_r_01")),new RuntimeDirectionalFrames(R("yui_hurt_l_00","yui_recoil_l_00"),R("yui_hurt_r_00","yui_recoil_r_00")),new RuntimeDirectionalFrames(R("yui_attack_r_00","yui_attack_r_01"),R("yui_attack_l_00","yui_attack_l_01")),.12f); }
        private static RuntimeEnemyAnimationSet Enemy(U48ProductionVisualCatalog value, Stage1RuntimeVisualAssetRegistry baseline) { var s=value.NamedSprites("enemy-onbu"); Sprite[] R(string prefix)=>Enumerable.Range(0,8).Select(i=>s.TryGetValue($"{prefix}_{i:00}",out var sprite)?sprite:throw new InvalidOperationException("U48 production enemy frame missing: "+prefix)).ToArray(); return new RuntimeEnemyAnimationSet(R("onbu_idle"),R("onbu_move"),R("onbu_hurt"),R("onbu_death"),.1f); }

        private T Missing<T>(string assetId, string path, string state) where T : class
        {
            var message = $"Runtime visual missing: assetId={assetId}, expectedPath={path}, provider={ProviderName}, scene={UnityEngine.SceneManagement.SceneManager.GetActiveScene().name}, frameState={state}, fallbackType=none";
            Debug.LogError(message);
            throw new InvalidOperationException(message);
        }
    }
}
