using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.StageSelect
{
    public enum StageRouteNodeProofState
    {
        Active,
        Locked,
    }

    public sealed class StageRouteNodeProof : MonoBehaviour
    {
        public StageRouteNodeProofState State { get; private set; }

        public static StageRouteNodeProof Create(
            Transform parent,
            Sprite activeSprite,
            Sprite lockedSprite,
            StageRouteNodeProofState state,
            Vector2 pos,
            TMP_FontAsset font)
        {
            var sprite = state == StageRouteNodeProofState.Active ? activeSprite : lockedSprite;
            var node = PaperPanelProof.Create(parent, $"StageRouteNodeProof_{state}", sprite, Color.white);
            var rect = node.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(0.5f, 0.5f);
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = pos;
            rect.sizeDelta = state == StageRouteNodeProofState.Active ? new Vector2(62f, 62f) : new Vector2(58f, 58f);

            var proof = node.gameObject.AddComponent<StageRouteNodeProof>();
            proof.State = state;
            var label = state == StageRouteNodeProofState.Active ? "選択中" : "未解放";
            var labelColor = state == StageRouteNodeProofState.Active
                ? new Color32(248, 232, 200, 230)
                : new Color32(170, 154, 132, 190);
            var text = PaperLabelProof.Create(node.transform, "NodeStateLabel", label, font, 9f, labelColor);
            var textRect = text.GetComponent<RectTransform>();
            textRect.anchorMin = new Vector2(0.5f, 0f);
            textRect.anchorMax = new Vector2(0.5f, 0f);
            textRect.pivot = new Vector2(0.5f, 1f);
            textRect.anchoredPosition = new Vector2(0f, -4f);
            textRect.sizeDelta = new Vector2(72f, 14f);
            return proof;
        }
    }
}
