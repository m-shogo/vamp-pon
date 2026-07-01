using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.StageSelect
{
    public sealed class StageInfoPanelProof : MonoBehaviour
    {
        public static StageInfoPanelProof Create(
            Transform parent,
            TMP_FontAsset font,
            string stageName = "はじまりの路地",
            string difficultyLabel = "やさしい",
            string stateLabel = "選択中")
        {
            var root = new GameObject("StageInfoPanelProof", typeof(RectTransform), typeof(StageInfoPanelProof));
            root.transform.SetParent(parent, false);
            var bg = PaperPanelProof.Create(root.transform, "StageInfoPanelBg", null, new Color32(38, 31, 26, 225));
            Stretch(bg.GetComponent<RectTransform>());

            AddLabel(root.transform, "StageName", stageName, font, 18f, new Color32(238, 222, 190, 255), new Vector2(-58f, 24f), new Vector2(190f, 28f));
            AddLabel(root.transform, "Difficulty", difficultyLabel, font, 13f, new Color32(205, 182, 143, 255), new Vector2(-98f, -4f), new Vector2(110f, 22f));
            AddLabel(root.transform, "State", stateLabel, font, 11.5f, new Color32(190, 166, 124, 235), new Vector2(-76f, -28f), new Vector2(160f, 20f));
            return root.GetComponent<StageInfoPanelProof>();
        }

        private static void AddLabel(Transform parent, string name, string text, TMP_FontAsset font, float size, Color color, Vector2 pos, Vector2 rectSize)
        {
            var label = PaperLabelProof.Create(parent, name, text, font, size, color, TextAlignmentOptions.Left);
            var rect = label.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(0.5f, 0.5f);
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = pos;
            rect.sizeDelta = rectSize;
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
