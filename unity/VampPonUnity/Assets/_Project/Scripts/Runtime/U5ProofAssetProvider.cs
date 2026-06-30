using VampPon.UnitySpike.U5;

namespace VampPon.UnitySpike.Runtime
{
    public sealed class U5ProofAssetProvider : IAssetProvider
    {
        public string ProviderName => "U5ProofAssetProvider";
        public bool IsProofOnly => true;

        public BattleVisualAssetSet LoadBattleVisuals()
        {
            return U5VisualAssetLibrary.LoadBattleVisualSet();
        }
    }
}
