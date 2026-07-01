using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.Result
{
    public sealed class ResultStatsLineProof : MonoBehaviour
    {
        public static ResultStatsLineProof Create(
            Transform parent,
            Sprite stripSprite,
            TMP_FontAsset font,
            string[] statsLabels = null)
        {
            var labels = statsLabels == null || statsLabels.Length == 0
                ? new[] { "欠片 12", "記憶 3", "加護 +3" }
                : statsLabels;
            var root = new GameObject("ResultStatsLineProof", typeof(RectTransform), typeof(ResultStatsLineProof));
            root.transform.SetParent(parent, false);
            var strip = PaperPanelProof.Create(root.transform, "StatsInkStrip", stripSprite, new Color(1f, 1f, 1f, 0.5f));
            Stretch(strip.GetComponent<RectTransform>());
            for (var i = 0; i < labels.Length; i++)
            {
                var chip = PaperPanelProof.Create(root.transform, $"StatsChip_{i}", null, new Color32(31, 25, 22, 138));
                var chipRect = chip.GetComponent<RectTransform>();
                chipRect.anchorMin = new Vector2(i / (float)labels.Length, 0f);
                chipRect.anchorMax = new Vector2((i + 1f) / labels.Length, 1f);
                chipRect.offsetMin = new Vector2(7f, 9f);
                chipRect.offsetMax = new Vector2(-7f, -9f);

                var label = PaperLabelProof.Create(root.transform, $"StatsLabel_{i}", labels[i], font, 15.5f, new Color32(248, 232, 200, 255));
                label.Label.fontStyle = FontStyles.Bold;
                var rect = label.GetComponent<RectTransform>();
                rect.anchorMin = new Vector2(i / (float)labels.Length, 0f);
                rect.anchorMax = new Vector2((i + 1f) / labels.Length, 1f);
                rect.offsetMin = new Vector2(8f, 8f);
                rect.offsetMax = new Vector2(-8f, -8f);
            }
            return root.GetComponent<ResultStatsLineProof>();
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
