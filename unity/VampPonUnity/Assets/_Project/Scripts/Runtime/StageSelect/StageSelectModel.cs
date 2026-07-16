using System;
using System.Collections.Generic;
using System.Linq;
using VampPon.UnitySpike.Runtime.Save;

namespace VampPon.UnitySpike.Runtime.StageSelect
{
    public enum StageSelectVisualState { Locked, Unlocked, SelectedUnlocked, SelectedLocked, Disabled }

    public sealed class StageSelectItemViewModel
    {
        public string StageId { get; set; }
        public string DisplayName { get; set; }
        public string Subtitle { get; set; }
        public IReadOnlyList<StageMetadataItem> Metadata { get; set; }
        public bool IsUnlocked { get; set; }
        public bool IsRuntimeImplemented { get; set; }
        public bool IsStartable { get; set; }
        public bool IsSelected { get; set; }
        public StageSelectVisualState VisualState { get; set; }
    }

    public sealed class StageSelectModel
    {
        private GameSaveSnapshot save;
        private string selectedStageId;
        public event Action Changed;
        public IReadOnlyList<StageSelectItemViewModel> Items => StageCatalog.Entries.Select(Build).ToArray();
        public string SelectedStageId => selectedStageId;
        public StageSelectItemViewModel Selected => selectedStageId == null ? null : Build(StageCatalog.Find(selectedStageId));
        public bool CanStartSelected => Selected?.IsStartable == true;

        public void Refresh(GameSaveSnapshot snapshot, bool selectDefault = true)
        {
            save = snapshot ?? throw new ArgumentNullException(nameof(snapshot));
            selectedStageId = selectDefault ? StageCatalog.Entries.FirstOrDefault(IsStartable)?.StageId : null;
            Changed?.Invoke();
        }

        public bool Select(string stageId)
        {
            var entry = StageCatalog.Find(stageId);
            if (entry == null) return false;
            selectedStageId = string.Equals(selectedStageId, entry.StageId, StringComparison.Ordinal) ? null : entry.StageId;
            Changed?.Invoke();
            return true;
        }

        public bool IsUnlocked(StageCatalogEntry entry) => entry != null && save != null &&
            (save.unlockedStageIds.Contains(entry.StageId) || entry.LegacyIds.Any(save.unlockedStageIds.Contains));

        public bool IsStartable(StageCatalogEntry entry) => entry != null && IsUnlocked(entry) && entry.RuntimeImplemented;

        private StageSelectItemViewModel Build(StageCatalogEntry entry)
        {
            if (entry == null) return null;
            var unlocked = IsUnlocked(entry); var startable = IsStartable(entry); var selected = entry.StageId == selectedStageId;
            var state = selected
                ? startable ? StageSelectVisualState.SelectedUnlocked : StageSelectVisualState.SelectedLocked
                : !unlocked ? StageSelectVisualState.Locked : !entry.RuntimeImplemented ? StageSelectVisualState.Disabled : StageSelectVisualState.Unlocked;
            return new StageSelectItemViewModel
            {
                StageId = entry.StageId, DisplayName = entry.DisplayName, Subtitle = entry.Subtitle, Metadata = entry.Metadata,
                IsUnlocked = unlocked, IsRuntimeImplemented = entry.RuntimeImplemented, IsStartable = startable, IsSelected = selected, VisualState = state,
            };
        }
    }
}
