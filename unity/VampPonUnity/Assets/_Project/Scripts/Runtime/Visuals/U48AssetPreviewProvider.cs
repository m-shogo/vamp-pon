#if VAMPPON_U48_ASSET_PREVIEW
using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using VampPon.UnitySpike.U5;

namespace VampPon.UnitySpike.Runtime.Visuals
{
    [Serializable]
    internal sealed class U48AssetPreviewCatalog
    {
        public int schemaVersion;
        public U48AssetPreviewEntry[] entries;

        public U48AssetPreviewEntry Resolve(string assetGroup, string candidateId)
        {
            if (schemaVersion != 1 || entries == null) throw new InvalidOperationException("U48 preview catalog is invalid.");
            var matches = entries.Where(entry => entry.assetGroup == assetGroup && entry.candidateId == candidateId).ToArray();
            if (matches.Length != 1) throw new InvalidOperationException($"U48 preview candidate resolution failed: assetGroup={assetGroup}, candidateId={candidateId}, matches={matches.Length}");
            matches[0].Validate();
            return matches[0];
        }
    }

    [Serializable]
    internal sealed class U48AssetPreviewEntry
    {
        public string assetGroup;
        public string candidateId;
        public string slot;
        public string resourcePath;
        public string sourcePath;
        public string sourceSha256;
        public string runtimeDefinitionId;
        public string kokuyouPhase;
        public string[] targetObjectNames;
        public string[] idleLeft;
        public string[] idleRight;
        public string[] walkLeft;
        public string[] walkRight;
        public string[] hurtLeft;
        public string[] hurtRight;
        public string[] attackLeft;
        public string[] attackRight;
        public string[] enemyIdle;
        public string[] enemyMove;
        public string[] enemyHurt;
        public string[] enemyDeath;

        public void Validate()
        {
            if (string.IsNullOrWhiteSpace(assetGroup) || string.IsNullOrWhiteSpace(candidateId) || string.IsNullOrWhiteSpace(slot) || string.IsNullOrWhiteSpace(resourcePath) || string.IsNullOrWhiteSpace(sourcePath) || string.IsNullOrWhiteSpace(sourceSha256))
                throw new InvalidOperationException("U48 preview entry metadata is incomplete.");
            if (!Enum.TryParse<U48AssetPreviewSlot>(slot, true, out _)) throw new InvalidOperationException("U48 preview slot is unknown: " + slot);
        }
    }

    internal enum U48AssetPreviewSlot
    {
        Player,
        Enemy,
        Background,
        ExpPickup,
        HealingPickup,
        Projectile,
        Hit,
        EnemyDeath,
        Trail,
        GroundArea,
        Kokuyou,
        Hud,
        LevelUp,
        Replacement,
        Result,
        StageSelect,
    }

    public sealed class U48AssetPreviewProvider : IAssetProvider, IDisposable
    {
        public const string EnabledEnvironmentVariable = "VAMPPON_U48_PREVIEW_ENABLED";
        public const string AssetGroupEnvironmentVariable = "VAMPPON_U48_ASSET_GROUP";
        public const string CandidateIdEnvironmentVariable = "VAMPPON_U48_CANDIDATE_ID";
        private const string CatalogResourcePath = "U48Preview/preview-catalog";
        private static U48AssetPreviewProvider active;

        private readonly IAssetProvider inner;
        private readonly U48AssetPreviewEntry entry;
        private bool disposed;

        private U48AssetPreviewProvider(IAssetProvider inner, U48AssetPreviewEntry entry)
        {
            this.inner = inner ?? throw new ArgumentNullException(nameof(inner));
            this.entry = entry ?? throw new ArgumentNullException(nameof(entry));
            if (active != null) throw new InvalidOperationException("A U48 preview session is already active.");
            active = this;
        }

        public string ProviderName => $"U48AssetPreviewProvider({inner.ProviderName})";
        public AssetApprovalLevel ApprovalLevel => AssetApprovalLevel.Candidate;
        public bool IsProofOnly => false;
        public bool IsProductionApproved => false;
        public static bool IsSessionActive => active != null && !active.disposed;
        internal static U48AssetPreviewEntry ActiveEntry => IsSessionActive ? active.entry : null;

        public static IAssetProvider CreateOrDefault(IAssetProvider normalProvider)
        {
            if (Environment.GetEnvironmentVariable(EnabledEnvironmentVariable) != "1") return normalProvider;
            var assetGroup = Environment.GetEnvironmentVariable(AssetGroupEnvironmentVariable);
            var candidateId = Environment.GetEnvironmentVariable(CandidateIdEnvironmentVariable);
            if (string.IsNullOrWhiteSpace(assetGroup) || string.IsNullOrWhiteSpace(candidateId))
                throw new InvalidOperationException("U48 preview requires both asset group and candidate ID.");
            var text = Resources.Load<TextAsset>(CatalogResourcePath) ?? throw new InvalidOperationException("U48 preview catalog is unavailable. Preview build setup was not executed.");
            var catalog = JsonUtility.FromJson<U48AssetPreviewCatalog>(text.text) ?? throw new InvalidOperationException("U48 preview catalog JSON could not be parsed.");
            return new U48AssetPreviewProvider(normalProvider, catalog.Resolve(assetGroup, candidateId));
        }

        public BattleVisualAssetSet LoadBattleVisuals()
        {
            if (disposed) throw new ObjectDisposedException(nameof(U48AssetPreviewProvider));
            var source = inner.LoadBattleVisuals();
            var result = Clone(source);
            var slot = Enum.Parse<U48AssetPreviewSlot>(entry.slot, true);
            var primary = LoadPrimarySprite(entry.resourcePath);
            switch (slot)
            {
                case U48AssetPreviewSlot.Player:
                    result.PlayerAnimation = CreatePlayerAnimation(entry, source.PlayerAnimation);
                    result.PlayerSprite = result.PlayerAnimation.Idle.Right[0];
                    result.PlayerSourcePath = entry.sourcePath;
                    break;
                case U48AssetPreviewSlot.Enemy:
                    result.EnemyAnimation = CreateEnemyAnimation(entry, source.EnemyAnimation);
                    result.EnemySprite = result.EnemyAnimation.Idle[0];
                    result.EnemySourcePath = entry.sourcePath;
                    break;
                case U48AssetPreviewSlot.ExpPickup: result.ExpSprite = primary; break;
                case U48AssetPreviewSlot.Projectile: result.ProjectileSprite = primary; break;
                case U48AssetPreviewSlot.Hit: result.HitSprite = primary; break;
                case U48AssetPreviewSlot.EnemyDeath: result.InkSprite = primary; break;
                case U48AssetPreviewSlot.Trail: result.TrailSprite = primary; break;
                case U48AssetPreviewSlot.GroundArea: result.InkSprite = primary; break;
            }
            return result;
        }

        public void Dispose()
        {
            if (disposed) return;
            disposed = true;
            if (ReferenceEquals(active, this)) active = null;
        }

        internal static Sprite LoadPrimarySprite(string resourcePath)
        {
            var single = Resources.Load<Sprite>(resourcePath);
            if (single != null) return single;
            var all = Resources.LoadAll<Sprite>(resourcePath);
            if (all.Length > 0) return all[0];
            throw new InvalidOperationException("U48 preview sprite missing: " + resourcePath);
        }

        private static RuntimeCharacterAnimationSet CreatePlayerAnimation(U48AssetPreviewEntry value, RuntimeCharacterAnimationSet baseline)
        {
            var sprites = LoadNamed(value.resourcePath);
            return new RuntimeCharacterAnimationSet(
                new RuntimeDirectionalFrames(Resolve(sprites, value.idleLeft, "idleLeft"), Resolve(sprites, value.idleRight, "idleRight")),
                new RuntimeDirectionalFrames(Resolve(sprites, value.walkLeft, "walkLeft"), Resolve(sprites, value.walkRight, "walkRight")),
                new RuntimeDirectionalFrames(Resolve(sprites, value.hurtLeft, "hurtLeft"), Resolve(sprites, value.hurtRight, "hurtRight")),
                new RuntimeDirectionalFrames(Resolve(sprites, value.attackLeft, "attackLeft"), Resolve(sprites, value.attackRight, "attackRight")),
                baseline.FrameDuration);
        }

        private static RuntimeEnemyAnimationSet CreateEnemyAnimation(U48AssetPreviewEntry value, RuntimeEnemyAnimationSet baseline)
        {
            var sprites = LoadNamed(value.resourcePath);
            return new RuntimeEnemyAnimationSet(
                Resolve(sprites, value.enemyIdle, "enemyIdle"), Resolve(sprites, value.enemyMove, "enemyMove"),
                Resolve(sprites, value.enemyHurt, "enemyHurt"), Resolve(sprites, value.enemyDeath, "enemyDeath"), baseline.FrameDuration);
        }

        private static Dictionary<string, Sprite> LoadNamed(string path) => Resources.LoadAll<Sprite>(path).ToDictionary(sprite => sprite.name, StringComparer.Ordinal);

        private static Sprite[] Resolve(IReadOnlyDictionary<string, Sprite> sprites, string[] names, string state)
        {
            if (names == null || names.Length == 0) throw new InvalidOperationException("U48 preview animation state is empty: " + state);
            return names.Select(name => sprites.TryGetValue(name, out var sprite) ? sprite : throw new InvalidOperationException($"U48 preview frame missing: state={state}, name={name}")).ToArray();
        }

        private static BattleVisualAssetSet Clone(BattleVisualAssetSet value) => new()
        {
            PlayerSprite = value.PlayerSprite, EnemySprite = value.EnemySprite, ProjectileSprite = value.ProjectileSprite,
            ExpSprite = value.ExpSprite, HitSprite = value.HitSprite, InkSprite = value.InkSprite, TrailSprite = value.TrailSprite,
            PlayerAnimation = value.PlayerAnimation, EnemyAnimation = value.EnemyAnimation,
            PlayerSourcePath = value.PlayerSourcePath, EnemySourcePath = value.EnemySourcePath,
            PlayerPixelsPerUnit = value.PlayerPixelsPerUnit, EnemyPixelsPerUnit = value.EnemyPixelsPerUnit,
            PlayerPivot = value.PlayerPivot, EnemyPivot = value.EnemyPivot,
            PlayerVisualScale = value.PlayerVisualScale, EnemyVisualScale = value.EnemyVisualScale,
        };
    }
}
#endif
