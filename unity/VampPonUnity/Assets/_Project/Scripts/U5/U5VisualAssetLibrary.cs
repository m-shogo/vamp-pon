using UnityEngine;

namespace VampPon.UnitySpike.U5
{
    public sealed class BattleVisualAssetSet
    {
        public Sprite EnemySprite { get; set; }
        public Sprite ProjectileSprite { get; set; }
        public Sprite ExpSprite { get; set; }
        public Sprite HitSprite { get; set; }
        public Sprite InkSprite { get; set; }
        public Sprite TrailSprite { get; set; }
    }

    // U5 proof-only loader. Resources/U5Candidates is intentionally small and must not
    // become the production asset loading layer.
    public static class U5VisualAssetLibrary
    {
        private const string Root = "U5Candidates/";

        public static BattleVisualAssetSet LoadBattleVisualSet()
        {
            var spark = LoadVfxSprite("u5-lantern-spark");
            return new BattleVisualAssetSet
            {
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
