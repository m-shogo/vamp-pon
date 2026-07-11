using System;
using System.Collections.Generic;
using System.Linq;
using VampPon.UnitySpike.Runtime.Save;

namespace VampPon.UnitySpike.Runtime.Collection
{
    public sealed class CollectionReadModelBuilder
    {
        private readonly IReadOnlyList<CollectionDefinition> definitions;

        public CollectionReadModelBuilder(IReadOnlyList<CollectionDefinition> source = null)
        {
            definitions = source ?? DefaultDefinitions();
        }

        public IReadOnlyList<CollectionEntryViewModel> Build(GameSaveSnapshot save, CollectionCategory category)
        {
            if (save == null) throw new ArgumentNullException(nameof(save));
            return definitions.Where(x => x.Category == category).OrderBy(x => x.SortOrder).Select(x => BuildEntry(x, save)).ToArray();
        }

        public CollectionEntryViewModel Find(GameSaveSnapshot save, string id)
        {
            var definition = definitions.FirstOrDefault(x => x.Id == id);
            return definition == null ? null : BuildEntry(definition, save);
        }

        public (int Current, int Max) Progress(GameSaveSnapshot save)
        {
            var known = new HashSet<string>(definitions.Select(x => x.Id), StringComparer.Ordinal);
            return (save.collectionUnlockedIds.Count(known.Contains), definitions.Count);
        }

        private static CollectionEntryViewModel BuildEntry(CollectionDefinition definition, GameSaveSnapshot save)
        {
            var unlocked = save.collectionUnlockedIds.Contains(definition.Id);
            var seen = unlocked && save.collectionSeenIds.Contains(definition.Id);
            return new CollectionEntryViewModel
            {
                Id = definition.Id,
                Category = definition.Category,
                Title = unlocked ? definition.Title : "???",
                Description = unlocked ? definition.Description : "まだ記憶は灯っていない。",
                IconKey = unlocked ? definition.IconKey : "locked-silhouette",
                RelatedLabel = unlocked ? definition.RelatedLabel : string.Empty,
                Unlocked = unlocked,
                Seen = seen,
                NewIndicator = unlocked && !seen,
                ProgressCurrent = unlocked ? definition.ProgressMax : 0,
                ProgressMax = definition.ProgressMax,
                SortOrder = definition.SortOrder,
            };
        }

        public static IReadOnlyList<CollectionDefinition> DefaultDefinitions() => new[]
        {
            Def("character_yui", CollectionCategory.Characters, "ユイ", "小さな灯を手に、忘れられた夜を歩く。", "yui", "墨夜の通り道", 10),
            Def("character_unknown", CollectionCategory.Characters, "記憶の旅人", "夜明けを探す、もうひとりの旅人。", "traveler", "未発見", 20),
            Def("enemy_onbu", CollectionCategory.Enemies, "オンブ", "影を背負い、路地をさまようもの。", "onbu", "墨夜の通り道", 10),
            Def("weapon_night_pencil", CollectionCategory.Weapons, "夜の鉛筆", "描いた線が影を払う。", "night-pencil", "ユイ", 10),
            Def("item_memory_fragment", CollectionCategory.Items, "記憶の欠片", "拾い集めた、淡い銀青の記憶。", "memory-fragment", "全ステージ", 10),
            Def("stage_01", CollectionCategory.Stages, "墨夜の通り道", "灯の届かない路地に、忘れ物が眠る。", "stage-01", "Stage 1", 10),
            Def("memory_first_return", CollectionCategory.Memories, "最初の帰還", "夜から戻った足跡が、最初の頁になった。", "first-return", "Stage 1", 10),
        };

        private static CollectionDefinition Def(string id, CollectionCategory category, string title, string description, string icon, string related, int order) =>
            new() { Id = id, Category = category, Title = title, Description = description, IconKey = icon, RelatedLabel = related, SortOrder = order };
    }
}
