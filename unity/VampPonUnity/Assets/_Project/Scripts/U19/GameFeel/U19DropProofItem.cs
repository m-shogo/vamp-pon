namespace VampPon.UnitySpike.U19.GameFeel
{
    public enum U19DropProofType
    {
        ExpFragment,
        Heart,
        MemoryShard,
        RareSpark,
    }

    public readonly struct U19DropProofItem
    {
        public U19DropProofItem(U19DropProofType type, bool magnetTarget)
        {
            Type = type;
            MagnetTarget = magnetTarget;
        }

        public U19DropProofType Type { get; }
        public bool MagnetTarget { get; }
        public string Label => Type switch
        {
            U19DropProofType.ExpFragment => "EXP fragment",
            U19DropProofType.Heart => "Heart / 回復drop",
            U19DropProofType.MemoryShard => "Memory shard",
            U19DropProofType.RareSpark => "Rare spark",
            _ => "Drop",
        };
    }
}
