using VampPon.UnitySpike.U5;

namespace VampPon.UnitySpike.Runtime
{
    public interface IAssetProvider
    {
        string ProviderName { get; }
        bool IsProofOnly { get; }
        BattleVisualAssetSet LoadBattleVisuals();
    }
}
