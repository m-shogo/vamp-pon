using System;
using TMPro;
using UnityEngine;
using VampPon.UnitySpike.Runtime.AppFlow;

namespace VampPon.UnitySpike.UI.Screens
{
    public sealed class StageSelectView : MonoBehaviour
    {
        private AppFlowCoordinator coordinator;

        public void Build(Transform parent, TMP_FontAsset font, AppFlowCoordinator flow)
        {
            coordinator = flow ?? throw new ArgumentNullException(nameof(flow));
            transform.SetParent(parent, false);
            var rect = gameObject.AddComponent<RectTransform>();
            rect.anchorMin = Vector2.zero; rect.anchorMax = Vector2.one; rect.offsetMin = Vector2.zero; rect.offsetMax = Vector2.zero;
            U46ScreenFactory.Panel(transform, "StageSelectBlocker", Vector2.zero, Vector2.one, null, new Color(0.025f, 0.02f, 0.025f, 1f));
            var panel = U46ScreenFactory.Panel(transform, "StageSelectPaperMap", new Vector2(0.06f, 0.14f), new Vector2(0.94f, 0.9f), AppQualityAssetProvider.StageSelectMapPanel, new Color(0.85f, 0.75f, 0.58f));
            U46ScreenFactory.Label(panel.transform, "Title", "ヨルノシルベ", 30f, Ink(), new Vector2(0.08f, 0.84f), new Vector2(0.92f, 0.95f), TextAlignmentOptions.Center, font);
            U46ScreenFactory.Label(panel.transform, "Subtitle", "今夜の行き先", 16f, Ink(), new Vector2(0.08f, 0.76f), new Vector2(0.92f, 0.84f), TextAlignmentOptions.Center, font);
            var stage = U46ScreenFactory.Panel(panel.transform, "Stage1Card", new Vector2(0.1f, 0.38f), new Vector2(0.9f, 0.68f), AppQualityAssetProvider.StageCardFrame, new Color(0.9f, 0.82f, 0.64f));
            U46ScreenFactory.Label(stage.transform, "StageTitle", "Stage 1  墨夜の通り道", 20f, Ink(), new Vector2(0.08f, 0.5f), new Vector2(0.92f, 0.82f), TextAlignmentOptions.Center, font);
            U46ScreenFactory.Label(stage.transform, "StageDetail", "小さな灯を手に、夜の記憶を拾う", 14f, Ink(), new Vector2(0.08f, 0.18f), new Vector2(0.92f, 0.5f), TextAlignmentOptions.Center, font);
            U46ScreenFactory.Button(panel.transform, "StartStageButton", "Stage 1を始める", AppQualityAssetProvider.PaperButtonFrame, new Vector2(0.14f, 0.18f), new Vector2(0.86f, 0.29f), font, () => coordinator.Execute(AppFlowCommand.StartStage("stage_01")));
            U46ScreenFactory.Button(panel.transform, "OpenCollectionButton", "灯録を開く", AppQualityAssetProvider.PaperButtonFrame, new Vector2(0.22f, 0.06f), new Vector2(0.78f, 0.15f), font, () => coordinator.Execute(AppFlowCommand.OpenCollection()));
            U46ScreenFactory.Decoration(panel.transform, "LanternAccent", AppQualityAssetProvider.SmallLanternAccent, new Vector2(0.86f, 0.76f), new Vector2(50f, 50f), Vector2.zero);
        }

        private static Color Ink() => new(0.12f, 0.075f, 0.055f, 1f);
    }
}
