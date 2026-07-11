using System;
using System.Collections.Generic;
using System.Linq;

namespace VampPon.UnitySpike.Runtime.Save
{
    public sealed class SaveValidationResult
    {
        public bool Succeeded { get; set; }
        public string Error { get; set; }
        public GameSaveSnapshot Snapshot { get; set; }
    }

    public sealed class SaveValidator
    {
        public SaveValidationResult ValidateAndNormalize(GameSaveSnapshot source, string now)
        {
            if (source == null) return Failure("Save JSON did not contain a snapshot.");
            if (source.schemaVersion > GameSaveSnapshot.CurrentSchemaVersion)
                return Failure($"Future save schema {source.schemaVersion} is not supported.");

            source.createdAt = string.IsNullOrWhiteSpace(source.createdAt) ? now : source.createdAt;
            source.updatedAt = string.IsNullOrWhiteSpace(source.updatedAt) ? source.createdAt : source.updatedAt;
            source.unlockedCharacterIds = NormalizeIds(source.unlockedCharacterIds);
            source.unlockedStageIds = NormalizeIds(source.unlockedStageIds);
            source.collectionUnlockedIds = NormalizeIds(source.collectionUnlockedIds);
            source.collectionSeenIds = NormalizeIds(source.collectionSeenIds)
                .Where(source.collectionUnlockedIds.Contains).ToList();
            source.achievementIds = NormalizeIds(source.achievementIds);
            source.permanentUpgrades ??= new List<PermanentUpgradeSave>();
            source.permanentUpgrades = source.permanentUpgrades
                .Where(x => x != null && !string.IsNullOrWhiteSpace(x.id))
                .GroupBy(x => x.id, StringComparer.Ordinal)
                .Select(x => new PermanentUpgradeSave { id = x.Key, level = Math.Max(0, x.Max(v => v.level)) })
                .OrderBy(x => x.id, StringComparer.Ordinal).ToList();
            source.settings ??= new GameSettingsSave();
            source.settings.masterVolume = Math.Clamp(source.settings.masterVolume, 0f, 1f);
            source.settings.locale = string.IsNullOrWhiteSpace(source.settings.locale) ? "ja" : source.settings.locale;
            return new SaveValidationResult { Succeeded = true, Snapshot = source, Error = string.Empty };
        }

        private static List<string> NormalizeIds(IEnumerable<string> ids) => (ids ?? Array.Empty<string>())
            .Where(x => !string.IsNullOrWhiteSpace(x)).Distinct(StringComparer.Ordinal).OrderBy(x => x, StringComparer.Ordinal).ToList();

        private static SaveValidationResult Failure(string error) => new() { Succeeded = false, Error = error };
    }
}
