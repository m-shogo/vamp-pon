namespace VampPon.UnitySpike.U23.VisualPolish
{
    public sealed class U23LevelUpCardPolishState
    {
        public int CardCount { get; set; } = 3;
        public float CardSpacing { get; set; } = 104f;
        public bool HasInkBorder { get; set; } = true;
        public bool HasIconSlot { get; set; } = true;
        public bool HasSelectedGlow { get; set; } = true;
        public string[] CardTitles { get; set; } = { "夜の鉛筆", "紙飛行機", "街灯の輪" };
    }
}
