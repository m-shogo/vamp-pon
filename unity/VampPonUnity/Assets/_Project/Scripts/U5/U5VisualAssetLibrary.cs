using UnityEngine;
using VampPon.UnitySpike.Runtime.Visuals;

namespace VampPon.UnitySpike.U5
{
    public sealed class BattleVisualAssetSet
    {
        // Runtime-facing visual set. Keep loading decisions outside battle logic.
        public Sprite PlayerSprite { get; set; }
        public Sprite EnemySprite { get; set; }
        public Sprite ProjectileSprite { get; set; }
        public Sprite ExpSprite { get; set; }
        public Sprite HealingSprite { get; set; }
        public Sprite HitSprite { get; set; }
        public Sprite InkSprite { get; set; }
        public Sprite TrailSprite { get; set; }
        public RuntimeCharacterAnimationSet PlayerAnimation { get; set; }
        public RuntimeEnemyAnimationSet EnemyAnimation { get; set; }
        public string PlayerSourcePath { get; set; }
        public string EnemySourcePath { get; set; }
        public float PlayerPixelsPerUnit { get; set; }
        public float EnemyPixelsPerUnit { get; set; }
        public Vector2 PlayerPivot { get; set; }
        public Vector2 EnemyPivot { get; set; }
        public float PlayerVisualScale { get; set; } = 1f;
        public float EnemyVisualScale { get; set; } = 1f;
    }

    // U5 proof-only loader. Resources/U5Candidates is intentionally small, candidate-only,
    // and must not become the production asset loading layer or approval authority.
    public static class U5VisualAssetLibrary
    {
        private const string Root = "U5Candidates/";

        public static BattleVisualAssetSet LoadBattleVisualSet()
        {
            var spark = LoadVfxSprite("u5-lantern-spark");
            return new BattleVisualAssetSet
            {
                PlayerSprite = LoadBattleSprite("u5-yui-battle-candidate"),
                EnemySprite = LoadBattleSprite("u5-ombu-battle-candidate"),
                ProjectileSprite = spark,
                ExpSprite = LoadVfxSprite("u5-exp-fragment"),
                HitSprite = spark,
                InkSprite = LoadVfxSprite("u5-ink-burst"),
                TrailSprite = LoadVfxSprite("u5-collect-trail"),
            };
        }

        public static Sprite LoadBattleSprite(string name)
        {
            return LoadSprite("Battle/" + name);
        }

        public static Sprite LoadVfxSprite(string name)
        {
            return LoadSprite("VFX/" + name);
        }

        public static Sprite LoadUiSprite(string name)
        {
            return LoadSprite("UI/" + name);
        }

        private static Sprite LoadSprite(string path)
        {
            return Resources.Load<Sprite>(Root + path);
        }
    }
}
