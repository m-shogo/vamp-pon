namespace VampPon.UnitySpike.U19.GameFeel
{
    public readonly struct U19LevelUpCardProof
    {
        public U19LevelUpCardProof(string title, string description, bool rare = false)
        {
            Title = title;
            Description = description;
            Rare = rare;
        }

        public string Title { get; }
        public string Description { get; }
        public bool Rare { get; }
    }
}
