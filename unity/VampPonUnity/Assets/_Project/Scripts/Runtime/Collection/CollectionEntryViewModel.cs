namespace VampPon.UnitySpike.Runtime.Collection
{
    public enum CollectionCategory { Characters, Enemies, Weapons, Items, Stages, Memories }

    public sealed class CollectionDefinition
    {
        public string Id { get; set; }
        public CollectionCategory Category { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string IconKey { get; set; }
        public string RelatedLabel { get; set; }
        public int ProgressMax { get; set; } = 1;
        public int SortOrder { get; set; }
    }

    public sealed class CollectionEntryViewModel
    {
        public string Id { get; set; }
        public CollectionCategory Category { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string IconKey { get; set; }
        public string RelatedLabel { get; set; }
        public bool Unlocked { get; set; }
        public bool Seen { get; set; }
        public bool NewIndicator { get; set; }
        public int ProgressCurrent { get; set; }
        public int ProgressMax { get; set; }
        public int SortOrder { get; set; }
    }
}
