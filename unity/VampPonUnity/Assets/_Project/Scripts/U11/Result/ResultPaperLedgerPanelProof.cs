using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.Result
{
    public sealed class ResultPaperLedgerPanelProof : MonoBehaviour
    {
        public static ResultPaperLedgerPanelProof Create(
            Transform parent,
            Sprite ledgerSprite,
            Sprite rankSealSprite,
            Sprite badgeSprite,
            TMP_FontAsset font)
        {
            var root = new GameObject("ResultPaperLedgerPanelProof", typeof(RectTransform), typeof(ResultPaperLedgerPanelProof));
            root.transform.SetParent(parent, false);
            var ledger = PaperPanelProof.Create(root.transform, "LedgerImage", ledgerSprite, new Color(1f, 0.95f, 0.84f, 0.96f));
            Stretch(ledger.GetComponent<RectTransform>());

            AddImage(root.transform, "RankSeal", rankSealSprite, new Vector2(104f, 168f), new Vector2(90f, 90f), Color.white);
            AddLabel(root.transform, "RankLabel", "A", font, 22f, new Color32(245, 205, 154, 255), new Vector2(104f, 168f), new Vector2(56f, 30f));
            AddImage(root.transform, "NewBadge", badgeSprite, new Vector2(-112f, 76f), new Vector2(54f, 54f), Color.white);
            AddLabel(root.transform, "MemoryCount", "拾った記憶 3", font, 16f, new Color32(44, 31, 26, 255), new Vector2(0f, 118f), new Vector2(180f, 28f));
            return root.GetComponent<ResultPaperLedgerPanelProof>();
        }

        private static void AddImage(Transform parent, string name, Sprite sprite, Vector2 pos, Vector2 size, Color color)
        {
            var image = PaperPanelProof.Create(parent, name, sprite, color);
            var rect = image.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(0.5f, 0.5f);
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = pos;
            rect.sizeDelta = size;
        }

        private static void AddLabel(Transform parent, string name, string text, TMP_FontAsset font, float size, Color color, Vector2 pos, Vector2 rectSize)
        {
            var label = PaperLabelProof.Create(parent, name, text, font, size, color);
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
