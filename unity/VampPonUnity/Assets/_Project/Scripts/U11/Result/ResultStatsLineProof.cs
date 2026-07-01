using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.Result
{
    public sealed class ResultStatsLineProof : MonoBehaviour
    {
        public static ResultStatsLineProof Create(Transform parent, Sprite stripSprite, TMP_FontAsset font)
        {
            var root = new GameObject("ResultStatsLineProof", typeof(RectTransform), typeof(ResultStatsLineProof));
            root.transform.SetParent(parent, false);
            var strip = PaperPanelProof.Create(root.transform, "StatsInkStrip", stripSprite, new Color(1f, 1f, 1f, 0.96f));
            Stretch(strip.GetComponent<RectTransform>());
            var label = PaperLabelProof.Create(root.transform, "StatsLabel", "拾った欠片 12   朝の加護 +3", font, 15f, new Color32(248, 232, 200, 255));
            var rect = label.GetComponent<RectTransform>();
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.offsetMin = new Vector2(18f, 7f);
            rect.offsetMax = new Vector2(-18f, -7f);
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
