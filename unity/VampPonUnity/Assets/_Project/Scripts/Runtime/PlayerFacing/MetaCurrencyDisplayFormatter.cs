namespace VampPon.UnitySpike.Runtime.PlayerFacing
{
    public static class MetaCurrencyDisplayFormatter
    {
        public const string CurrentDisplayName = "黒曜片";

        public static string CarryHome() => CurrentDisplayName + "は持ち帰れる。";
    }

    public static class PlayerFacingCopy
    {
        public const string FirstRunMove = "指を置いて、そのまま動かす";
        public const string FirstRunAutoAttack = "攻撃は自動。";
        public const string FirstRunFragmentLevelUp = "記憶片を拾ってレベルアップ。";

        public static string FirstRunCarryHome() =>
            "朝まで残れなくても、" + MetaCurrencyDisplayFormatter.CarryHome();
    }
}
