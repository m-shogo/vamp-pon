using VampPon.UnitySpike.U5;

namespace VampPon.UnitySpike.Runtime
{
    public enum AssetApprovalLevel
    {
        Proof,
        Candidate,
        Production,
    }

    public interface IAssetProvider
    {
        string ProviderName { get; }
        AssetApprovalLevel ApprovalLevel { get; }
        bool IsProofOnly { get; }
        bool IsProductionApproved { get; }
        BattleVisualAssetSet LoadBattleVisuals();
    }
}
