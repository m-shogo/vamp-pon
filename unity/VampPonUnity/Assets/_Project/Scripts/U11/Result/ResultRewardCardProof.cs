using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.Result
{
    public sealed class ResultRewardCardProof : MonoBehaviour
    {
        public static ResultRewardCardProof Create(Transform parent, Sprite cardSprite, string label, TMP_FontAsset font)
        {
            var root = new GameObject($"ResultRewardCardProof_{label}", typeof(RectTransform), typeof(ResultRewardCardProof));
            root.transform.SetParent(parent, false);
            var bg = PaperPanelProof.Create(root.transform, "RewardCardImage", cardSprite, new Color(1f, 0.96f, 0.85f, 0.98f));
            Stretch(bg.GetComponent<RectTransform>());
            var text = PaperLabelProof.Create(root.transform, "RewardCardLabel", label, font, 14f, new Color32(44, 31, 26, 255));
            var tr = text.GetComponent<RectTransform>();
            tr.anchorMin = new Vector2(0.5f, 0f);
            tr.anchorMax = new Vector2(0.5f, 0f);
            tr.pivot = new Vector2(0.5f, 0f);
            tr.anchoredPosition = new Vector2(0f, 16f);
            tr.sizeDelta = new Vector2(70f, 22f);
            return root.GetComponent<ResultRewardCardProof>();
        }

        private static void Stretch(RectTransform rect)
        {
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
        }
    }
}
