namespace VampPon.UnitySpike.U20.MobileQA
{
    public static class U20MobileQABaseline
    {
        public static readonly (int Width, int Height)[] Profiles =
        {
            (360, 800),
            (375, 812),
            (390, 844),
            (393, 852),
            (412, 915),
            (430, 932),
        };

        public const int MinPrimaryTouchTarget = 44;
        public const int MinLevelUpCardWidth = 88;
        public const int MinLevelUpCardHeight = 160;
        public const int MinSafeAreaTop = 24;
        public const int MinSafeAreaBottom = 28;
        public const int MinResultStatsFontSize = 12;
        public const int MaxProofBurstParticles = 32;
        public const int MaxProofObjectCount = 220;
    }
}
