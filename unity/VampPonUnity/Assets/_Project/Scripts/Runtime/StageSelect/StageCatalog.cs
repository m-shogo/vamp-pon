using System;
using System.Collections.Generic;
using System.Linq;

namespace VampPon.UnitySpike.Runtime.StageSelect
{
    public sealed class StageMetadataItem
    {
        public StageMetadataItem(string label, string value) { Label = label; Value = value; }
        public string Label { get; }
        public string Value { get; }
    }

    public sealed class StageCatalogEntry
    {
        public StageCatalogEntry(string stageId, string displayName, string subtitle, IReadOnlyList<StageMetadataItem> metadata, bool runtimeImplemented, int displayOrder, params string[] legacyIds)
        {
            StageId = stageId; DisplayName = displayName; Subtitle = subtitle; Metadata = metadata ?? Array.Empty<StageMetadataItem>();
            RuntimeImplemented = runtimeImplemented; DisplayOrder = displayOrder; LegacyIds = legacyIds ?? Array.Empty<string>();
        }

        public string StageId { get; }
        public string DisplayName { get; }
        public string Subtitle { get; }
        public IReadOnlyList<StageMetadataItem> Metadata { get; }
        public bool RuntimeImplemented { get; }
        public int DisplayOrder { get; }
        public IReadOnlyList<string> LegacyIds { get; }
        public bool Matches(string id) => string.Equals(StageId, id, StringComparison.Ordinal) || LegacyIds.Contains(id, StringComparer.Ordinal);
    }

    public static class StageCatalog
    {
        private static readonly IReadOnlyList<StageCatalogEntry> EntriesInternal = new[]
        {
            Entry("forgotten_street", "忘れられた夜道", true, 1, "stage_01"),
            Entry("name_tag_alley", "名札の路地", false, 2),
            Entry("moon_box_library", "月箱の書庫", false, 3),
            Entry("return_map_crossing", "帰り道の交差点", false, 4),
            Entry("repair_lamp_workshop", "継火の修理工房", false, 5),
            Entry("chalk_classroom", "白線の教室", false, 6),
            Entry("half_candy_arcade", "半分の駄菓子横丁", false, 7),
            Entry("paper_cord_playground", "紙縒りの遊び場", false, 8),
            Entry("old_compass_station", "古針の駅前", false, 9),
            Entry("pressed_flower_archive", "押花の保管庫", false, 10),
            Entry("unposted_post_office", "未配達の郵便局", false, 11),
            Entry("paper_plane_window", "窓際の紙翼", false, 12),
            Entry("white_bookmark_library", "白栞の未分類棚", false, 13),
            Entry("ticket_gate_station", "片道ではない改札", false, 14),
            Entry("dream_waterway", "夢頁の水路", false, 15),
            Entry("black_origami_roof", "黒折り紙の屋根", false, 16),
            Entry("erased_name_wall", "消し跡の壁", false, 17),
            Entry("ruler_rooftop", "夜測りの屋上", false, 18),
            Entry("blank_card_room", "余白の部屋", false, 19),
            Entry("dawn_return_square", "夜明け前の広場", false, 20),
        };

        static StageCatalog()
        {
            if (EntriesInternal.Select(value => value.StageId).Distinct(StringComparer.Ordinal).Count() != EntriesInternal.Count)
                throw new InvalidOperationException("Stage catalog contains duplicate stable IDs.");
            if (!EntriesInternal.Select(value => value.DisplayOrder).SequenceEqual(EntriesInternal.Select(value => value.DisplayOrder).OrderBy(value => value)))
                throw new InvalidOperationException("Stage catalog display order must be deterministic.");
        }

        public static IReadOnlyList<StageCatalogEntry> Entries => EntriesInternal;
        public static StageCatalogEntry Find(string id) => EntriesInternal.FirstOrDefault(value => value.Matches(id));
        private static StageCatalogEntry Entry(string id, string name, bool implemented, int order, params string[] legacyIds) =>
            new(id, name, null, Array.Empty<StageMetadataItem>(), implemented, order, legacyIds);
    }
}
