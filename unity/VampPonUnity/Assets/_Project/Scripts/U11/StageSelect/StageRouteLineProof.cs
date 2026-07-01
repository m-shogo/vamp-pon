using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.StageSelect
{
    public sealed class StageRouteLineProof : MonoBehaviour
    {
        public static StageRouteLineProof Create(Transform parent, Sprite lineSprite, string name, Vector2 pos, Vector2 size, float rotation)
        {
            var line = PaperPanelProof.Create(parent, name, lineSprite, new Color(0.16f, 0.10f, 0.06f, 0.95f));
            var rect = line.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(0.5f, 0.5f);
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = pos;
            rect.sizeDelta = size;
            rect.localRotation = Quaternion.Euler(0f, 0f, rotation);
            return line.gameObject.AddComponent<StageRouteLineProof>();
        }
    }
}
