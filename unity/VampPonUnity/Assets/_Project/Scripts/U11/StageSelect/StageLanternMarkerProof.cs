using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.StageSelect
{
    public sealed class StageLanternMarkerProof : MonoBehaviour
    {
        public static StageLanternMarkerProof Create(Transform parent, Sprite lanternSprite, Vector2 pos)
        {
            var marker = PaperPanelProof.Create(parent, "StageLanternMarkerProof", lanternSprite, new Color(1f, 0.97f, 0.88f, 1f));
            var rect = marker.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(0.5f, 0.5f);
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = pos;
            rect.sizeDelta = new Vector2(84f, 102f);
            return marker.gameObject.AddComponent<StageLanternMarkerProof>();
        }
    }
}
