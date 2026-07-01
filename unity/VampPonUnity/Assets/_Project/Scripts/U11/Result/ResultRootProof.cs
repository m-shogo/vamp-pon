using System;
using TMPro;
using UnityEngine;
using VampPon.UnitySpike.U11.Common;

namespace VampPon.UnitySpike.U11.Result
{
    public sealed class ResultRootProof : MonoBehaviour
    {
        public static ResultRootProof Create(Transform parent, ResultProofAssets assets, TMP_FontAsset font)
        {
            return Create(parent, assets, font, ResultProofContent.Default, null);
        }

        public static ResultRootProof Create(
            Transform parent,
            ResultProofAssets assets,
            TMP_FontAsset font,
            ResultProofContent content,
            Action<string> onContinueProof)
        {
            var root = new GameObject("ResultRootProof", typeof(RectTransform), typeof(ResultRootProof));
            root.transform.SetParent(parent, false);
            Stretch(root.GetComponent<RectTransform>());

            AddLabel(root.transform, "ResultTitle", content.Title, font, 24f, new Color32(238, 222, 190, 255), new Vector2(0f, 362f), new Vector2(270f, 40f));

            var panel = ResultPaperLedgerPanelProof.Create(root.transform, assets.LedgerPanel, assets.RankSeal, assets.NewBadge, font, content.RankLabel, content.MemoryCountLabel);
            SetRect(panel.GetComponent<RectTransform>(), new Vector2(0f, 48f), new Vector2(322f, 520f));

            var labels = content.RewardCardLabels;
            for (var i = 0; i < labels.Length; i++)
            {
                var card = ResultRewardCardProof.Create(panel.transform, assets.RewardCard, labels[i], font);
                SetRect(card.GetComponent<RectTransform>(), new Vector2(-90f + i * 90f, -12f), new Vector2(80f, 110f));
            }

            var stats = ResultStatsLineProof.Create(root.transform, assets.StatsStrip, font, content.StatsLabels);
            SetRect(stats.GetComponent<RectTransform>(), new Vector2(0f, -172f), new Vector2(318f, 56f));

            var button = ResultContinueButtonProof.Create(root.transform, assets.ContinueButton, font, onContinueProof);
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

    public readonly struct ResultProofContent
    {
        public ResultProofContent(
            string title,
            string rankLabel,
            string memoryCountLabel,
            string[] rewardCardLabels,
            string[] statsLabels)
        {
            Title = title;
            RankLabel = rankLabel;
            MemoryCountLabel = memoryCountLabel;
            RewardCardLabels = rewardCardLabels;
            StatsLabels = statsLabels;
        }

        public string Title { get; }
        public string RankLabel { get; }
        public string MemoryCountLabel { get; }
        public string[] RewardCardLabels { get; }
        public string[] StatsLabels { get; }

        public static ResultProofContent Default => new(
            "今夜の記録",
            "A",
            "拾った記憶 3",
            new[] { "記憶", "墨", "灯" },
            new[] { "欠片 12", "記憶 3", "加護 +3" });
    }
}
