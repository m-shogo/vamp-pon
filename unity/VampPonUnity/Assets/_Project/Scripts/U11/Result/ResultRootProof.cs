using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.Result
{
    public sealed class ResultRootProof : MonoBehaviour
    {
        public static ResultRootProof Create(Transform parent, ResultProofAssets assets, TMP_FontAsset font)
        {
            var root = new GameObject("ResultRootProof", typeof(RectTransform), typeof(ResultRootProof));
            root.transform.SetParent(parent, false);
            Stretch(root.GetComponent<RectTransform>());

            AddLabel(root.transform, "ResultTitle", "今夜の記録", font, 24f, new Color32(238, 222, 190, 255), new Vector2(0f, 362f), new Vector2(270f, 40f));

            var panel = ResultPaperLedgerPanelProof.Create(root.transform, assets.LedgerPanel, assets.RankSeal, assets.NewBadge, font);
            SetRect(panel.GetComponent<RectTransform>(), new Vector2(0f, 48f), new Vector2(322f, 520f));

            var labels = new[] { "記憶", "墨", "灯" };
            for (var i = 0; i < labels.Length; i++)
            {
                var card = ResultRewardCardProof.Create(panel.transform, assets.RewardCard, labels[i], font);
                SetRect(card.GetComponent<RectTransform>(), new Vector2(-90f + i * 90f, -12f), new Vector2(80f, 110f));
            }

            var stats = ResultStatsLineProof.Create(root.transform, assets.StatsStrip, font);
            SetRect(stats.GetComponent<RectTransform>(), new Vector2(0f, -172f), new Vector2(318f, 52f));

            var button = ResultContinueButtonProof.Create(root.transform, assets.ContinueButton, font);
            SetRect(button.GetComponent<RectTransform>(), new Vector2(0f, -236f), new Vector2(218f, 68f));
            return root.GetComponent<ResultRootProof>();
        }

        private static void AddLabel(Transform parent, string name, string text, TMP_FontAsset font, float size, Color color, Vector2 pos, Vector2 rectSize)
        {
            var label = PaperLabelProof.Create(parent, name, text, font, size, color);
            SetRect(label.GetComponent<RectTransform>(), pos, rectSize);
        }

        private static void SetRect(RectTransform rect, Vector2 pos, Vector2 size)
        {
            rect.anchorMin = new Vector2(0.5f, 0.5f);
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = pos;
            rect.sizeDelta = size;
        }

        private static void Stretch(RectTransform rect)
        {
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
        }
    }

    public readonly struct ResultProofAssets
    {
        public ResultProofAssets(Sprite ledgerPanel, Sprite rankSeal, Sprite rewardCard, Sprite newBadge, Sprite continueButton, Sprite statsStrip)
        {
            LedgerPanel = ledgerPanel;
            RankSeal = rankSeal;
            RewardCard = rewardCard;
            NewBadge = newBadge;
            ContinueButton = continueButton;
            StatsStrip = statsStrip;
        }

        public Sprite LedgerPanel { get; }
        public Sprite RankSeal { get; }
        public Sprite RewardCard { get; }
        public Sprite NewBadge { get; }
        public Sprite ContinueButton { get; }
        public Sprite StatsStrip { get; }
    }
}
