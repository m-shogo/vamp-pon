namespace VampPon.UnitySpike.U19.GameFeel
{
    public sealed class U19EvolutionRecipeProof
    {
        public string Left { get; } = "黒インク小瓶 Lv5";
        public string Right { get; } = "街灯の輪 Lv5";
        public string Result { get; } = "夜明けのインク灯";

        public bool IsReady(int inkBottleLevel, int lampRingLevel)
        {
            return inkBottleLevel >= 5 && lampRingLevel >= 5;
        }
    }
}
