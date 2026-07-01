using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.StageSelect
{
    public sealed class StageMapPanelProof : MonoBehaviour
    {
        public static StageMapPanelProof Create(Transform parent, Sprite mapSprite)
        {
            var panel = PaperPanelProof.Create(parent, "StageMapPanelProof", mapSprite, new Color(1f, 0.95f, 0.82f, 0.96f));
            return panel.gameObject.AddComponent<StageMapPanelProof>();
        }
    }
}
