using VampPon.UnitySpike.U5;

namespace VampPon.UnitySpike.Runtime
{
    public sealed class U5ProofAssetProvider : IAssetProvider
    {
        public string ProviderName => "U5ProofAssetProvider";
        public AssetApprovalLevel ApprovalLevel => AssetApprovalLevel.Proof;
        public bool IsProofOnly => true;
        public bool IsProductionApproved => false;

        public BattleVisualAssetSet LoadBattleVisuals()
        {
            return U5VisualAssetLibrary.LoadBattleVisualSet();
        }
    }
}
