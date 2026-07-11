using System.Collections.Generic;
using TMPro;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Result;

namespace VampPon.UnitySpike.UI.Screens
{
    public sealed class ResultView : MonoBehaviour
    {
        private Transform content;
        private TMP_FontAsset font;
        private U46UiAssetCatalog assets;
        private ResultPresenter presenter;

        public void Build(Transform parent, TMP_FontAsset uiFont, U46UiAssetCatalog catalog, ResultPresenter resultPresenter)
        {
            font = uiFont; assets = catalog; presenter = resultPresenter;
            transform.SetParent(parent, false);
            var rect = gameObject.AddComponent<RectTransform>(); rect.anchorMin = Vector2.zero; rect.anchorMax = Vector2.one; rect.offsetMin = Vector2.zero; rect.offsetMax = Vector2.zero;
            U46ScreenFactory.Panel(transform, "ResultBlocker", Vector2.zero, Vector2.one, null, new Color(0.025f, 0.02f, 0.025f, 1f));
            CreateContentRoot();
            gameObject.SetActive(false);
        }

        public void Show(RunResultSnapshot snapshot)
        {
            var vm = presenter.Present(snapshot);
            if (content != null)
            {
                content.gameObject.SetActive(false);
                Destroy(content.gameObject);
            }
            CreateContentRoot();
            var clear = snapshot.outcome == RunOutcome.Clear;
            U46ScreenFactory.Label(content, "Outcome", vm.OutcomeLabel, 16f, clear ? Amber() : Silver(), new Vector2(0.08f, 0.89f), new Vector2(0.34f, 0.95f), TextAlignmentOptions.Left, font);
            U46ScreenFactory.Label(content, "Title", vm.Title, 20f, Ink(), new Vector2(0.08f, 0.8f), new Vector2(0.72f, 0.9f), TextAlignmentOptions.Left, font);
            U46ScreenFactory.Label(content, "Stage", vm.StageTitle, 15f, Ink(), new Vector2(0.08f, 0.75f), new Vector2(0.78f, 0.81f), TextAlignmentOptions.Left, font);
            U46ScreenFactory.Decoration(content, "RankSeal", assets.Result.RankSeal, new Vector2(0.83f, 0.83f), new Vector2(78f, 78f), Vector2.zero);
            U46ScreenFactory.Label(content, "Rank", vm.Rank, 27f, Ink(), new Vector2(0.75f, 0.77f), new Vector2(0.91f, 0.89f), TextAlignmentOptions.Center, font);
            Stat(0.08f, "時間", vm.ElapsedTimeLabel); Stat(0.51f, "影払い", vm.DefeatedEnemyLabel);
            Stat(0.08f, "記憶の欠片", vm.FragmentLabel, 0.61f); Stat(0.51f, "到達", vm.ReachedLevelLabel, 0.61f);
            U46ScreenFactory.Label(content, "RewardsTitle", "持ち帰った記憶", 16f, Ink(), new Vector2(0.08f, 0.48f), new Vector2(0.92f, 0.54f), TextAlignmentOptions.Left, font);
            IReadOnlyList<string> rewards = vm.RewardCards.Count == 0 ? new[] { "記憶の欠片", "夜の足跡" } : vm.RewardCards;
            for (var i = 0; i < rewards.Count && i < 3; i++) Reward(i, rewards[i]);
            IReadOnlyList<string> records = vm.NewRecordRows.Count == 0 ? new[] { clear ? "最初の帰還" : "今夜の記録を保存" } : vm.NewRecordRows;
            U46ScreenFactory.Label(content, "Records", string.Join("\n", records), 14f, Ink(), new Vector2(0.08f, 0.2f), new Vector2(0.92f, 0.3f), TextAlignmentOptions.Left, font);
            U46ScreenFactory.Button(content, "RetryButton", "もう一度", assets.Result.PrimaryButton, new Vector2(0.12f, 0.105f), new Vector2(0.88f, 0.175f), font, () => presenter.Retry());
            U46ScreenFactory.Button(content, "StageSelectButton", "行き先へ戻る", assets.Result.SecondaryButton, new Vector2(0.22f, 0.025f), new Vector2(0.78f, 0.09f), font, () => presenter.ReturnToStageSelect());
            gameObject.SetActive(true);
        }

        private void CreateContentRoot()
        {
            content = U46ScreenFactory.Panel(transform, "ResultMemoryPage", new Vector2(0.045f, 0.055f), new Vector2(0.955f, 0.95f), assets.Result.MemoryPage, new Color(0.88f, 0.79f, 0.62f)).transform;
        }

        private void Stat(float x, string title, string value, float y = 0.68f)
        {
            var chip = U46ScreenFactory.Panel(content, "StatChip", new Vector2(x, y), new Vector2(x + 0.4f, y + 0.065f), assets.Result.StatChip, new Color(0.84f, 0.75f, 0.58f));
            U46ScreenFactory.Label(chip.transform, "Text", $"{title}  {value}", 14f, Ink(), Vector2.zero, Vector2.one, TextAlignmentOptions.Center, font);
        }

        private void Reward(int index, string value)
        {
            var x = 0.08f + index * 0.29f;
            var card = U46ScreenFactory.Panel(content, "RewardCard", new Vector2(x, 0.32f), new Vector2(x + 0.25f, 0.47f), assets.Result.RewardCard, new Color(0.88f, 0.78f, 0.58f));
            U46ScreenFactory.Label(card.transform, "Text", value, 13f, Ink(), new Vector2(0.08f, 0.08f), new Vector2(0.92f, 0.42f), TextAlignmentOptions.Center, font);
        }

        private static Color Ink() => new(0.11f, 0.075f, 0.06f, 1f);
        private static Color Amber() => new(0.58f, 0.3f, 0.08f, 1f);
        private static Color Silver() => new(0.27f, 0.35f, 0.42f, 1f);
    }
}
