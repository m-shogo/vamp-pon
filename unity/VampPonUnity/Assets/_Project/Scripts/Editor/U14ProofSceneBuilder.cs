using System;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.U13.Result;
using VampPon.UnitySpike.U13.StageSelect;
using VampPon.UnitySpike.U14.Battle;
using VampPon.UnitySpike.U14.Flow;
using VampPon.UnitySpike.U14.Result;
using VampPon.UnitySpike.U14.StageSelect;

namespace VampPon.UnitySpike.Editor
{
    public static class U14ProofSceneBuilder
    {
        private const string SceneRoot = "Assets/_Project/Scenes/Proof";
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium SDF.asset";
        private static TMP_FontAsset font;

        public static void SaveAll()
        {
            Directory.CreateDirectory(SceneRoot);
            U13PrefabCandidateBuilder.SaveAll();
            font = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>(FontPath);
            if (font == null) throw new InvalidOperationException($"SDF font not found: {FontPath}");

            SaveStageSelectScene();
            SaveBattleScene();
            SaveResultScene();
        }

        public static GameObject BuildStageSelectProof(Transform parent = null)
        {
            var root = U13PrefabCandidateBuilder.BuildStageSelectRoot(StageSelectViewModel.Sample);
            root.name = "U14StageSelectFlowProofView";
            if (parent != null) root.transform.SetParent(parent, false);
            root.AddComponent<U14StageSelectFlowProofController>().Configure(new U14ProofSceneRouter(false));
            return root;
        }

        public static GameObject BuildResultProof(Transform parent = null)
        {
            var summary = BattleResultSummaryProof.FromRequest(BattleStartRequestProof.Sample);
            var root = U13PrefabCandidateBuilder.BuildResultRoot(summary.ToResultViewModel());
            root.name = "U14ResultFlowProofView";
            if (parent != null) root.transform.SetParent(parent, false);
            root.AddComponent<U14ResultFlowProofController>().Configure(summary, new U14ProofSceneRouter(false));
            return root;
        }

        public static GameObject BuildBattleProof(Transform parent = null)
        {
            var root = new GameObject("U14BattleFlowProofView", typeof(RectTransform), typeof(U14BattleFlowProofView), typeof(U14BattleFlowProofController));
            if (parent != null) root.transform.SetParent(parent, false);
            Rect(root.GetComponent<RectTransform>(), 0f, 0f, 390f, 844f);
            Panel(root.transform, "BattlePanel", 0f, 28f, 322f, 390f, new Color32(38, 31, 26, 225));
            Txt(root.transform, "Title", "仮Battle", 0f, 176f, 280f, 38f, 24f, new Color32(248, 232, 200, 255));
            Txt(root.transform, "Stage", "はじまりの路地", 0f, 118f, 260f, 30f, 18f, new Color32(238, 222, 190, 255));
            Txt(root.transform, "Difficulty", "やさしい", 0f, 80f, 220f, 24f, 14f, new Color32(205, 182, 143, 255));
            Txt(root.transform, "Progress", "仮戦闘結果を作成中", 0f, 20f, 260f, 24f, 14f, new Color32(238, 222, 190, 240));
            Txt(root.transform, "Summary", "08:00 / 討伐128 / 欠片12 / 記憶3", 0f, -36f, 280f, 24f, 13f, new Color32(248, 232, 200, 255));
            Button(root.transform, "ResultButton", "Resultへ", 0f, -122f, 170f, 52f);
            root.GetComponent<U14BattleFlowProofController>().Configure(BattleStartRequestProof.Sample, new U14ProofSceneRouter(false));
            return root;
        }

        public static GameObject BuildSequenceProof(Transform parent = null)
        {
            var root = new GameObject("U14FlowSequenceProof", typeof(RectTransform));
            if (parent != null) root.transform.SetParent(parent, false);
            Rect(root.GetComponent<RectTransform>(), 0f, 0f, 390f, 844f);
            Txt(root.transform, "Title", "U14 仮Scene Flow", 0f, 328f, 320f, 36f, 20f, new Color32(238, 222, 190, 255));
            var steps = new[] { "StageSelect", "仮Battle", "Result", "StageSelect" };
            var subs = new[] { "stage_01 / やさしい", "仮結果を生成", "08:00 / A / 欠片12", "lastResultSummary保持" };
            for (var i = 0; i < steps.Length; i++)
            {
                var y = 204f - i * 118f;
                Panel(root.transform, $"Step_{i}", 0f, y, 286f, 70f, new Color32(38, 31, 26, 225));
                Txt(root.transform, $"StepTitle_{i}", steps[i], 0f, y + 12f, 250f, 24f, 15f, new Color32(248, 232, 200, 255));
                Txt(root.transform, $"StepSub_{i}", subs[i], 0f, y - 14f, 250f, 18f, 10.5f, new Color32(205, 182, 143, 255));
                if (i < steps.Length - 1) Txt(root.transform, $"Arrow_{i}", "↓", 0f, y - 58f, 40f, 26f, 18f, new Color32(190, 166, 124, 235));
            }
            Txt(root.transform, "Note", "proof-only: save / reward / unlock / 本番Battleなし", 0f, -328f, 330f, 28f, 11f, new Color32(238, 222, 190, 230));
            return root;
        }

        private static void SaveStageSelectScene()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var canvas = CreateCanvas();
            BuildStageSelectProof(canvas.transform);
            EditorSceneManager.SaveScene(scene, $"{SceneRoot}/U14StageSelectFlowProof.unity");
        }

        private static void SaveBattleScene()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var canvas = CreateCanvas();
            BuildBattleProof(canvas.transform);
            EditorSceneManager.SaveScene(scene, $"{SceneRoot}/U14BattleFlowProof.unity");
        }

        private static void SaveResultScene()
        {
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            var canvas = CreateCanvas();
            BuildResultProof(canvas.transform);
            EditorSceneManager.SaveScene(scene, $"{SceneRoot}/U14ResultFlowProof.unity");
        }

        private static Canvas CreateCanvas()
        {
            var camObj = new GameObject("U14ProofCamera", typeof(Camera));
            var cam = camObj.GetComponent<Camera>();
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.backgroundColor = new Color32(24, 22, 21, 255);
            cam.orthographic = true;
            cam.orthographicSize = 422f;
            cam.transform.position = new Vector3(0f, 0f, -10f);

            var canvasObj = new GameObject("U14ProofCanvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            var canvas = canvasObj.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceCamera;
            canvas.worldCamera = cam;
            var scaler = canvasObj.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(390f, 844f);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0.5f;
            return canvas;
        }

        private static void Panel(Transform parent, string name, float x, float y, float w, float h, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(Image));
            obj.transform.SetParent(parent, false);
            Rect(obj.GetComponent<RectTransform>(), x, y, w, h);
            obj.GetComponent<Image>().color = color;
        }

        private static void Button(Transform parent, string name, string text, float x, float y, float w, float h)
        {
            Panel(parent, name, x, y, w, h, new Color32(238, 222, 190, 255));
            Txt(parent, $"{name}Label", text, x, y, w - 20f, h - 18f, 15f, new Color32(38, 25, 18, 255));
        }

        private static void Txt(Transform parent, string name, string text, float x, float y, float w, float h, float size, Color color)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(TextMeshProUGUI));
            obj.transform.SetParent(parent, false);
            Rect(obj.GetComponent<RectTransform>(), x, y, w, h);
            var tmp = obj.GetComponent<TextMeshProUGUI>();
            tmp.font = font;
            tmp.text = text;
            tmp.fontSize = size;
            tmp.color = color;
            tmp.alignment = TextAlignmentOptions.Center;
            tmp.textWrappingMode = TextWrappingModes.NoWrap;
            tmp.overflowMode = TextOverflowModes.Overflow;
            tmp.raycastTarget = false;
        }

        private static void Rect(RectTransform rect, float x, float y, float w, float h)
        {
            rect.anchorMin = new Vector2(0.5f, 0.5f);
            rect.anchorMax = new Vector2(0.5f, 0.5f);
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = new Vector2(x, y);
            rect.sizeDelta = new Vector2(w, h);
        }
    }
}
