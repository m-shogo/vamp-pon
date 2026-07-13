namespace VampPon.UnitySpike.U4
{
    public enum U4ItemRarity
    {
        Normal,
        Good,
        Rare,
    }

    public enum U4ItemType
    {
        Weapon,
        Passive,
        Special,
    }

    public sealed class U4LevelUpChoice
    {
        public string Id;
        public string NameJa;
        public string DescriptionJa;
        public string TypeLabelJa;
        public U4ItemRarity Rarity;
        public U4ItemType ItemType;
        public int Level;
        public bool IsAwakeningGate;
        public bool RequiresReplacement;
        public object RuntimeChoice;
    }

    public static class U4LevelUpCandidatePool
    {
        private static readonly U4LevelUpChoice[] Candidates =
        {
            new()
            {
                Id = "lantern_shot",
                NameJa = "ランタンの灯",
                DescriptionJa = "光の弾で近くの影を照らす。基本の遠距離攻撃。",
                TypeLabelJa = "武器",
                Rarity = U4ItemRarity.Normal,
                ItemType = U4ItemType.Weapon,
                Level = 1,
            },
            new()
            {
                Id = "ink_shield",
                NameJa = "墨のまもり",
                DescriptionJa = "周囲にインクの結界を張り、近づく影を弾く。",
                TypeLabelJa = "武器",
                Rarity = U4ItemRarity.Normal,
                ItemType = U4ItemType.Weapon,
                Level = 1,
            },
            new()
            {
                Id = "paper_fan",
                NameJa = "紙扇の風",
                DescriptionJa = "前方に風を送り、影を押し返す。",
                TypeLabelJa = "武器",
                Rarity = U4ItemRarity.Good,
                ItemType = U4ItemType.Weapon,
                Level = 1,
            },
            new()
            {
                Id = "memory_magnet",
                NameJa = "記憶の引力",
                DescriptionJa = "記憶のかけらを遠くから引き寄せる。",
                TypeLabelJa = "パッシブ",
                Rarity = U4ItemRarity.Normal,
                ItemType = U4ItemType.Passive,
                Level = 1,
            },
            new()
            {
                Id = "night_walker",
                NameJa = "夜歩きの足",
                DescriptionJa = "暗闇の中でも足取りが軽くなる。移動速度が上がる。",
                TypeLabelJa = "パッシブ",
                Rarity = U4ItemRarity.Normal,
                ItemType = U4ItemType.Passive,
                Level = 1,
            },
            new()
            {
                Id = "warm_cloak",
                NameJa = "あたたかい外套",
                DescriptionJa = "被ダメージを少しだけ和らげる。",
                TypeLabelJa = "パッシブ",
                Rarity = U4ItemRarity.Good,
                ItemType = U4ItemType.Passive,
                Level = 1,
            },
            new()
            {
                Id = "dawn_page",
                NameJa = "夜明けの栞",
                DescriptionJa = "ランタンの光が強まり、攻撃範囲がわずかに広がる。",
                TypeLabelJa = "レア",
                Rarity = U4ItemRarity.Rare,
                ItemType = U4ItemType.Special,
                Level = 1,
            },
            new()
            {
                Id = "forgotten_bell",
                NameJa = "忘れられた鈴",
                DescriptionJa = "鈴の音で影が一瞬怯む。攻撃速度が上がる。",
                TypeLabelJa = "レア",
                Rarity = U4ItemRarity.Rare,
                ItemType = U4ItemType.Special,
                Level = 1,
            },
        };

        private static readonly U4LevelUpChoice AwakeningPlaceholder = new()
        {
            Id = "awakening_gate",
            NameJa = "覚醒の扉",
            DescriptionJa = "条件を満たすと開く、未知の力。（将来実装）",
            TypeLabelJa = "覚醒",
            Rarity = U4ItemRarity.Rare,
            ItemType = U4ItemType.Special,
            Level = 0,
            IsAwakeningGate = true,
        };

        public static U4LevelUpChoice[] PickThree()
        {
            var result = new U4LevelUpChoice[3];
            var used = new bool[Candidates.Length];

            for (var i = 0; i < 3; i++)
            {
                int index;
                var safety = 0;
                do
                {
                    index = UnityEngine.Random.Range(0, Candidates.Length);
                    safety++;
                } while (used[index] && safety < 100);

                used[index] = true;
                result[i] = Candidates[index];
            }

            return result;
        }

        public static U4LevelUpChoice GetAwakeningPlaceholder() => AwakeningPlaceholder;
    }
}
