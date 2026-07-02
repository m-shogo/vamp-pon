namespace VampPon.UnitySpike.U27.SaveRewardUnlock
{
    public sealed class U27UnlockDraftModel
    {
        public string UnlockId { get; set; } = "";
        public U27UnlockType UnlockType { get; set; }
        public string UnlockReason { get; set; } = "";
        public bool IsNew { get; set; }
        public string DisplayLabel { get; set; } = "";
        public string FutureProductionNote { get; set; } = "placeholder; final Collection / Stage / Knowledge implementation later";
    }
}
