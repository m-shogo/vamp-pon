using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;

namespace VampPon.UnitySpike.Runtime.Visuals
{
    [CreateAssetMenu(menuName = "YorunoShirube/U48/Production Visual Catalog")]
    public sealed class U48ProductionVisualCatalog : ScriptableObject
    {
        public const string ResourcePath = "Production/U48/U48ProductionVisualCatalog";
        [Serializable] public sealed class Entry { public string assetGroup; public string productionPath; public string productionSha256; public Sprite primary; public Sprite[] sprites; }
        [SerializeField] private Entry[] entries;
        private Dictionary<string, Entry> lookup;
        public IReadOnlyList<Entry> Entries => entries;

        public static U48ProductionVisualCatalog LoadRequired()
        {
            var value = Resources.Load<U48ProductionVisualCatalog>(ResourcePath);
            if (value == null) throw new InvalidOperationException("U48 production visual catalog is missing: " + ResourcePath);
            value.Validate(); return value;
        }

        public Entry Resolve(string group)
        {
            lookup ??= entries.ToDictionary(value => value.assetGroup, StringComparer.Ordinal);
            if (!lookup.TryGetValue(group, out var value) || value.primary == null) throw new InvalidOperationException("U48 production visual is missing: " + group);
            return value;
        }

        public Sprite SpriteFor(string group) => Resolve(group).primary;
        public IReadOnlyDictionary<string, Sprite> NamedSprites(string group) => Resolve(group).sprites.ToDictionary(value => value.name, StringComparer.Ordinal);
        public void Validate()
        {
            if (entries == null || entries.Length != 46 || entries.Select(value => value.assetGroup).Distinct().Count() != 46) throw new InvalidOperationException("U48 production catalog must contain 46 unique groups.");
            foreach (var value in entries) if (string.IsNullOrWhiteSpace(value.assetGroup) || string.IsNullOrWhiteSpace(value.productionPath) || value.productionSha256?.Length != 64 || value.primary == null || value.sprites == null || value.sprites.Length == 0 || value.sprites.Any(sprite => sprite == null)) throw new InvalidOperationException("U48 production catalog entry is incomplete: " + value?.assetGroup);
        }

#if UNITY_EDITOR
        public void ConfigureForEditor(Entry[] values) { entries = values; lookup = null; Validate(); }
#endif
    }
}
