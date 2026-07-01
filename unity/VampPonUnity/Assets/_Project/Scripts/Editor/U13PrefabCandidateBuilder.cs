using System;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.U13.Common;
using VampPon.UnitySpike.U13.Result;
using VampPon.UnitySpike.U13.StageSelect;

namespace VampPon.UnitySpike.Editor
{
    public static class U13PrefabCandidateBuilder
    {
        private const string SDFFontAssetPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private const string ResultPrefabRoot = "Assets/_Project/Prefabs/UI/Result";
        private const string StagePrefabRoot = "Assets/_Project/Prefabs/UI/StageSelect";
        private const string CommonPrefabRoot = "Assets/_Project/Prefabs/UI/Common";

        private static TMP_FontAsset font;

        public static void SaveAll()
        {
            U8VisualCandidateImportSetup.Run();
            U8RefinedVisualCandidateImportSetup.Run();
            U10VisualCandidateImportSetup.Run();
            font = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>(SDFFontAssetPath);
            if (font == null) throw new InvalidOperationException($"SDF font not found: {SDFFontAssetPath}");

            Directory.CreateDirectory(ResultPrefabRoot);
            Directory.CreateDirectory(StagePrefabRoot);
            Directory.CreateDirectory(CommonPrefabRoot);

            SavePrefab(BuildPaperLabel(), $"{CommonPrefabRoot}/PaperLabel.prefab");
            SavePrefab(BuildPaperPanel(), $"{CommonPrefabRoot}/PaperPanel.prefab");
            SavePrefab(BuildPaperButton("PaperButton", "次へ"), $"{CommonPrefabRoot}/PaperButton.prefab");
            SavePrefab(BuildMemoryCard("MemoryCard", "記憶"), $"{CommonPrefabRoot}/MemoryCard.prefab");
            SavePrefab(BuildRouteLine("InkRouteLine", false), $"{CommonPrefabRoot}/InkRouteLine.prefab");
            SavePrefab(BuildLanternMarker("LanternMarker"), $"{CommonPrefabRoot}/LanternMarker.prefab");

            SavePrefab(BuildResultRoot(ResultViewModel.Sample), $"{ResultPrefabRoot}/ResultRoot.prefab");
            SavePrefab(BuildResultPaperLedgerPanel(ResultViewModel.Sample), $"{ResultPrefabRoot}/ResultPaperLedgerPanel.prefab");
            SavePrefab(BuildResultRewardCard(new ResultRewardCardViewModel("記憶")), $"{ResultPrefabRoot}/ResultRewardCard.prefab");
            SavePrefab(BuildResultStatsLine(ResultViewModel.Sample), $"{ResultPrefabRoot}/ResultStatsLine.prefab");
            SavePrefab(BuildResultContinueButton(ResultViewModel.Sample), $"{ResultPrefabRoot}/ResultContinueButton.prefab");
            SavePrefab(BuildResultRankSeal(ResultViewModel.Sample), $"{ResultPrefabRoot}/ResultRankSeal.prefab");
            SavePrefab(BuildResultNewBadge(), $"{ResultPrefabRoot}/ResultNewBadge.prefab");

            SavePrefab(BuildStageSelectRoot(StageSelectViewModel.Sample), $"{StagePrefabRoot}/StageSelectRoot.prefab");
            SavePrefab(BuildStageMapPanel(), $"{StagePrefabRoot}/StageMapPanel.prefab");
            var stageRouteLine = BuildRouteLine("StageRouteLine", false);
            stageRouteLine.AddComponent<StageRouteLineView>();
            SavePrefab(stageRouteLine, $"{StagePrefabRoot}/StageRouteLine.prefab");
            SavePrefab(BuildStageRouteNode(StageSelectViewModel.Sample.Nodes[0]), $"{StagePrefabRoot}/StageRouteNode.prefab");
            var stageLantern = BuildLanternMarker("StageLanternMarker");
            stageLantern.AddComponent<StageLanternMarkerView>();
            SavePrefab(stageLantern, $"{StagePrefabRoot}/StageLanternMarker.prefab");
            SavePrefab(BuildStageInfoPanel(StageSelectViewModel.Sample.Info), $"{StagePrefabRoot}/StageInfoPanel.prefab");
            SavePrefab(BuildStageStartButton(StageSelectViewModel.Sample), $"{StagePrefabRoot}/StageStartButton.prefab");
        }

        public static GameObject BuildResultRoot(ResultViewModel viewModel)
        {
            var root = Root("ResultRoot", new Vector2(390f, 844f));
            root.AddComponent<ResultRootView>();
            Txt(root.transform, "ResultTitle", viewModel.Title, 0f, 362f, 270f, 40f, 24f, new Color32(238, 222, 190, 255));
            var panel = BuildResultPaperLedgerPanel(viewModel);
            panel.transform.SetParent(root.transform, false);
            Rect(panel, 0f, 48f, 322f, 520f);
            var stats = BuildResultStatsLine(viewModel);
            stats.transform.SetParent(root.transform, false);
            Rect(stats, 0f, -172f, 318f, 56f);
            var button = BuildResultContinueButton(viewModel);
            button.transform.SetParent(root.transform, false);
            Rect(button, 0f, -236f, 218f, 68f);
            var statLabels = viewModel.StatLabels;
            for (var i = 0; i < 3; i++)
            {
                Txt(root.transform, $"ResultStatsOverlay_{i}", statLabels[i], -106f + i * 106f, -172f, 86f, 22f, 16f, new Color32(255, 242, 210, 255));
            }
            Txt(root.transform, "ResultContinueOverlay", viewModel.ContinueLabel, 0f, -236f, 168f, 24f, 18f, new Color32(38, 25, 18, 255));
            return root;
        }

        public static GameObject BuildStageSelectRoot(StageSelectViewModel viewModel)
        {
            var root = Root("StageSelectRoot", new Vector2(390f, 844f));
            root.AddComponent<StageSelectRootView>();
            Txt(root.transform, "StageSelectTitle", viewModel.Title, 0f, 362f, 300f, 40f, 22f, new Color32(238, 222, 190, 255));
            var map = BuildStageMapPanel();
            map.transform.SetParent(root.transform, false);
            Rect(map, 0f, 62f, 322f, 548f);
            AddRoute(map.transform, "RouteLineA", -46f, 56f, 162f, 32f, -16f);
            AddRoute(map.transform, "RouteLineB", 56f, -26f, 160f, 30f, 18f);
            AddRoute(map.transform, "RouteLineC", -30f, -106f, 154f, 28f, -10f);
            var positions = new[] { new Vector2(-112f, 96f), new Vector2(-28f, 34f), new Vector2(72f, -40f), new Vector2(-44f, -154f), new Vector2(104f, -212f) };
            for (var i = 0; i < positions.Length; i++)
            {
                var nodeVm = i < viewModel.Nodes.Length ? viewModel.Nodes[i] : new StageNodeViewModel($"future_{i}", "", StageNodeVisualState.Locked);
                var node = BuildStageRouteNode(nodeVm);
                node.transform.SetParent(map.transform, false);
                Rect(node, positions[i].x, positions[i].y, nodeVm.VisualState == StageNodeVisualState.Active ? 62f : 58f, nodeVm.VisualState == StageNodeVisualState.Active ? 62f : 58f);
            }
            var lantern = BuildLanternMarker("StageLanternMarker");
            lantern.AddComponent<StageLanternMarkerView>();
            lantern.transform.SetParent(map.transform, false);
            Rect(lantern, positions[0].x, positions[0].y, 54f, 54f);
            var info = BuildStageInfoPanel(viewModel.Info);
            info.transform.SetParent(root.transform, false);
            Rect(info, 0f, -286f, 318f, 104f);
            var button = BuildStageStartButton(viewModel);
            button.transform.SetParent(info.transform, false);
            Rect(button, 108f, 0f, 112f, 50f);
            Txt(root.transform, "StageStartOverlay", viewModel.StartLabel, 108f, -286f, 90f, 22f, 16f, new Color32(38, 25, 18, 255));
            return root;
        }

        public static GameObject BuildFlowMapProof()
        {
            var root = Root("U13FlowMapProof", new Vector2(390f, 844f));
            root.AddComponent<PaperPanelView>();
            Txt(root.transform, "Title", "StageSelect → Battle → Result", 0f, 330f, 330f, 34f, 17f, new Color32(238, 222, 190, 255));
            var steps = new[] { "StageSelect", "Battle", "Result", "StageSelect" };
            var subs = new[] { "stageId / difficulty", "startTime / play data", "rank / fragments / memories", "summary / unlock候補" };
            for (var i = 0; i < steps.Length; i++)
            {
                var y = 206f - i * 122f;
                Panel(root.transform, $"FlowStep_{i}", 0f, y, 286f, 72f, new Color32(38, 31, 26, 225)).AddComponent<PaperPanelView>();
                Txt(root.transform, $"FlowStepTitle_{i}", steps[i], 0f, y + 12f, 240f, 24f, 15f, new Color32(248, 232, 200, 255));
                Txt(root.transform, $"FlowStepSub_{i}", subs[i], 0f, y - 14f, 250f, 18f, 10.5f, new Color32(205, 182, 143, 255));
                if (i < steps.Length - 1)
                {
                    Txt(root.transform, $"Arrow_{i}", "↓", 0f, y - 62f, 40f, 30f, 20f, new Color32(190, 166, 124, 235));
                }
            }
            Txt(root.transform, "Note", "U13では設計のみ。実Scene遷移 / save / reward / unlockは未接続。", 0f, -326f, 330f, 34f, 11f, new Color32(238, 222, 190, 230));
            return root;
        }

        private static GameObject BuildResultPaperLedgerPanel(ResultViewModel viewModel)
        {
            var root = Root("ResultPaperLedgerPanel", new Vector2(322f, 520f));
            root.AddComponent<ResultPaperLedgerPanelView>();
            Image(root.transform, "LedgerImage", S("U8Candidates/UI/result_paper_ledger_panel"), 0f, 0f, 322f, 520f, new Color(1f, 0.95f, 0.84f, 0.96f));
            var seal = BuildResultRankSeal(viewModel);
            seal.transform.SetParent(root.transform, false);
            Rect(seal, 104f, 168f, 90f, 90f);
            var badge = BuildResultNewBadge();
            badge.transform.SetParent(root.transform, false);
            Rect(badge, -112f, 76f, 54f, 54f);
            Txt(root.transform, "MemoryCount", $"拾った記憶 {viewModel.MemoryCount}", 0f, 118f, 180f, 28f, 16f, new Color32(44, 31, 26, 255));
            for (var i = 0; i < viewModel.Rewards.Length; i++)
            {
                var card = BuildResultRewardCard(viewModel.Rewards[i]);
                card.transform.SetParent(root.transform, false);
                Rect(card, -90f + i * 90f, -12f, 80f, 110f);
            }
            return root;
        }

        private static GameObject BuildResultRewardCard(ResultRewardCardViewModel viewModel)
        {
            var root = Root("ResultRewardCard", new Vector2(80f, 110f));
            root.AddComponent<ResultRewardCardView>();
            Image(root.transform, "RewardCardImage", S("U8Candidates/UI/result_reward_memory_card"), 0f, 0f, 80f, 110f, new Color(1f, 0.96f, 0.85f, 0.98f));
            Txt(root.transform, "RewardCardLabel", viewModel.Label, 0f, -38f, 70f, 22f, 14f, new Color32(44, 31, 26, 255));
            return root;
        }

        private static GameObject BuildResultStatsLine(ResultViewModel viewModel)
        {
            var root = Root("ResultStatsLine", new Vector2(318f, 56f));
            root.AddComponent<ResultStatsLineView>();
            Image(root.transform, "StatsInkStrip", S("U10Candidates/UI/result_stats_ink_strip"), 0f, 0f, 318f, 56f, new Color(1f, 1f, 1f, 0.5f));
            var labels = viewModel.StatLabels;
            for (var i = 0; i < 3; i++)
            {
                var x = -106f + i * 106f;
                Panel(root.transform, $"StatsChip_{i}", x, 0f, 92f, 34f, new Color32(31, 25, 22, 138));
                Txt(root.transform, $"StatsLabel_{i}", labels[i], x, 0f, 86f, 22f, 16f, new Color32(255, 242, 210, 255));
            }
            return root;
        }

        private static GameObject BuildResultContinueButton(ResultViewModel viewModel)
        {
            var root = BuildPaperButton("ResultContinueButton", viewModel.ContinueLabel);
            root.AddComponent<ResultContinueButtonView>();
            return root;
        }

        private static GameObject BuildResultRankSeal(ResultViewModel viewModel)
        {
            var root = Root("ResultRankSeal", new Vector2(90f, 90f));
            root.AddComponent<ResultRankSealView>();
            Image(root.transform, "RankSealImage", S("U8Candidates/UI/result_rank_wax_seal"), 0f, 0f, 90f, 90f, Color.white);
            Txt(root.transform, "RankLabel", viewModel.Rank, 0f, 0f, 56f, 30f, 22f, new Color32(245, 205, 154, 255));
            return root;
        }

        private static GameObject BuildResultNewBadge()
        {
            var root = Root("ResultNewBadge", new Vector2(54f, 54f));
            root.AddComponent<ResultNewBadgeView>();
            Image(root.transform, "NewBadgeImage", S("U8Refined/UI/result_new_badge_refined"), 0f, 0f, 54f, 54f, Color.white);
            return root;
        }

        private static GameObject BuildStageMapPanel()
        {
            var root = Root("StageMapPanel", new Vector2(322f, 548f));
            root.AddComponent<StageMapPanelView>();
            Image(root.transform, "StageMapImage", S("U8Candidates/UI/stageselect_paper_map_base"), 0f, 0f, 322f, 548f, new Color(1f, 0.95f, 0.84f, 0.96f));
            return root;
        }

        private static GameObject BuildStageRouteNode(StageNodeViewModel viewModel)
        {
            var root = Root("StageRouteNode", new Vector2(62f, 62f));
            var sprite = viewModel.VisualState == StageNodeVisualState.Active
                ? S("U10Candidates/UI/stageselect_route_active_node")
                : S("U10Candidates/UI/stageselect_route_locked_node");
            var tint = viewModel.VisualState == StageNodeVisualState.Active ? Color.white : new Color(0.58f, 0.53f, 0.48f, 0.92f);
            Image(root.transform, "NodeImage", sprite, 0f, 0f, 62f, 62f, tint);
            root.AddComponent<StageRouteNodeView>().Bind(viewModel);
            return root;
        }

        private static GameObject BuildStageInfoPanel(StageInfoViewModel viewModel)
        {
            var root = Root("StageInfoPanel", new Vector2(318f, 104f));
            root.AddComponent<StageInfoPanelView>();
            Panel(root.transform, "StageInfoPanelBg", 0f, 0f, 318f, 104f, new Color32(38, 31, 26, 225));
            Txt(root.transform, "StageName", viewModel.SelectedStageTitle, -58f, 24f, 190f, 28f, 18f, new Color32(238, 222, 190, 255), FontStyles.Normal, TextAlignmentOptions.Left);
            Txt(root.transform, "Difficulty", viewModel.DifficultyLabel, -98f, -4f, 110f, 22f, 13f, new Color32(205, 182, 143, 255), FontStyles.Normal, TextAlignmentOptions.Left);
            Txt(root.transform, "State", viewModel.StateLabel, -76f, -28f, 160f, 20f, 11.5f, new Color32(190, 166, 124, 235), FontStyles.Normal, TextAlignmentOptions.Left);
            return root;
        }

        private static GameObject BuildStageStartButton(StageSelectViewModel viewModel)
        {
            var root = BuildPaperButton("StageStartButton", viewModel.StartLabel);
            root.AddComponent<StageStartButtonView>();
            return root;
        }

        private static GameObject BuildPaperLabel()
        {
            var root = Root("PaperLabel", new Vector2(120f, 28f));
            Txt(root.transform, "Label", "Label", 0f, 0f, 120f, 28f, 14f, new Color32(238, 222, 190, 255));
            root.AddComponent<PaperLabelView>();
            return root;
        }

        private static GameObject BuildPaperPanel()
        {
            var root = Root("PaperPanel", new Vector2(180f, 90f));
            Panel(root.transform, "PanelImage", 0f, 0f, 180f, 90f, new Color32(38, 31, 26, 225));
            root.AddComponent<PaperPanelView>();
            return root;
        }

        private static GameObject BuildPaperButton(string name, string label)
        {
            var root = Root(name, new Vector2(218f, 68f));
            var image = Image(root.transform, "ButtonImage", S("U10Candidates/UI/result_continue_paper_button"), 0f, 0f, 218f, 68f, Color.white);
            var button = root.AddComponent<Button>();
            button.targetGraphic = image.GetComponent<Image>();
            Txt(root.transform, "ButtonLabel", label, 0f, 0f, 168f, 24f, 18f, new Color32(38, 25, 18, 255));
            root.AddComponent<PaperButtonView>().Configure(label, name, null);
            return root;
        }

        private static GameObject BuildMemoryCard(string name, string label)
        {
            var root = Root(name, new Vector2(80f, 110f));
            Image(root.transform, "MemoryCardImage", S("U8Candidates/UI/result_reward_memory_card"), 0f, 0f, 80f, 110f, new Color(1f, 0.96f, 0.85f, 0.98f));
            Txt(root.transform, "MemoryCardLabel", label, 0f, -38f, 70f, 22f, 14f, new Color32(44, 31, 26, 255));
            root.AddComponent<MemoryCardView>();
            return root;
        }

        private static GameObject BuildRouteLine(string name, bool routeBAnimationCandidate)
        {
            var root = Root(name, new Vector2(162f, 32f));
            Image(root.transform, "RouteLineImage", S("U8Candidates/UI/stageselect_route_line_ink"), 0f, 0f, 162f, 32f, new Color(1f, 1f, 1f, 0.86f));
            root.AddComponent<InkRouteLineView>().MarkRouteBAnimationCandidate(routeBAnimationCandidate);
            return root;
        }

        private static GameObject BuildLanternMarker(string name)
        {
            var root = Root(name, new Vector2(54f, 54f));
            Image(root.transform, "LanternMarkerImage", S("U8Candidates/UI/stageselect_start_marker_lantern"), 0f, 0f, 54f, 54f, Color.white);
            root.AddComponent<LanternMarkerView>();
            return root;
        }

        private static void AddRoute(Transform parent, string name, float x, float y, float w, float h, float angle)
        {
            var line = BuildRouteLine(name, name == "RouteLineB");
            line.transform.SetParent(parent, false);
            Rect(line, x, y, w, h);
            line.transform.localEulerAngles = new Vector3(0f, 0f, angle);
        }

        private static GameObject Root(string name, Vector2 size)
        {
            var root = new GameObject(name, typeof(RectTransform));
            root.GetComponent<RectTransform>().sizeDelta = size;
            return root;
        }

        private static GameObject Panel(Transform parent, string name, float x, float y, float w, float h, Color color)
        {
            return Image(parent, name, null, x, y, w, h, color);
        }

        private static GameObject Image(Transform parent, string name, Sprite sprite, float x, float y, float w, float h, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(parent, false);
            Rect(obj, x, y, w, h);
            var image = obj.GetComponent<Image>();
            image.sprite = sprite;
            image.color = color;
            image.preserveAspect = sprite != null;
            image.raycastTarget = false;
            return obj;
        }

        private static TextMeshProUGUI Txt(Transform parent, string name, string text, float x, float y, float w, float h, float size, Color color, FontStyles style = FontStyles.Normal, TextAlignmentOptions alignment = TextAlignmentOptions.Center)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(TextMeshProUGUI));
            obj.transform.SetParent(parent, false);
            Rect(obj, x, y, w, h);
            var tmp = obj.GetComponent<TextMeshProUGUI>();
            tmp.font = font;
            tmp.text = text;
            tmp.fontSize = size;
            tmp.fontStyle = style;
            tmp.color = color;
            tmp.alignment = alignment;
            tmp.textWrappingMode = TextWrappingModes.NoWrap;
            tmp.overflowMode = TextOverflowModes.Overflow;
            tmp.enableAutoSizing = false;
            tmp.raycastTarget = false;
            obj.transform.SetAsLastSibling();
            return tmp;
        }

        private static void Rect(GameObject obj, float x, float y, float w, float h)
        {
            Rect(obj.GetComponent<RectTransform>(), x, y, w, h);
        }

        private static void Rect(RectTransform rect, float x, float y, float w, float h)
        {
            rect.anchorMin = new Vector2(0.5f, 0.5f);
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = new Vector2(x, y);
            rect.sizeDelta = new Vector2(w, h);
        }

        private static Sprite S(string sub)
        {
            var path = $"Assets/_Project/Resources/{sub}.png";
            var sprite = AssetDatabase.LoadAssetAtPath<Sprite>(path);
            if (sprite == null) throw new InvalidOperationException($"Sprite not found: {path}");
            return sprite;
        }

        private static void SavePrefab(GameObject obj, string path)
        {
            PrefabUtility.SaveAsPrefabAsset(obj, path);
            UnityEngine.Object.DestroyImmediate(obj);
        }
    }
}
