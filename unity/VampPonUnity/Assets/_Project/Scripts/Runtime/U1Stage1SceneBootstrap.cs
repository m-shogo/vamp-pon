using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.InputSystem.UI;
using UnityEngine.SceneManagement;
using UnityEngine.TextCore.LowLevel;
using UnityEngine.UI;
using VampPon.UnitySpike.Data;
using VampPon.UnitySpike.Player;
using VampPon.UnitySpike.U4;
using VampPon.UnitySpike.U5;
using VampPon.UnitySpike.UI;

namespace VampPon.UnitySpike.Runtime
{
    public sealed class U1Stage1SceneBootstrap : MonoBehaviour
    {
        private const float ReferenceWidth = 390f;
        private const float ReferenceHeight = 844f;
        private Transform playerRoot;
        private Transform enemyRoot;
        private Transform pickupRoot;
        private Transform projectileRoot;
        private Transform poolRoot;
        private Transform overlayRoot;
        private Transform yui;
        private GameObject stageSelectOverlay;
        private GameObject resultOverlay;
        private TextMeshProUGUI topHudLabel;
        private IAssetProvider assetProvider;
        private BattleVisualAssetSet battleVisualAssets;
        private U43RuntimeFeedbackBridge feedbackBridge;
        private U2BattleController battleController;
        private PlayerController playerController;
        private static TMP_FontAsset cachedJapaneseFont;

        private void Awake()
        {
            Application.targetFrameRate = 60;
            assetProvider = new U5ProofAssetProvider();
            battleVisualAssets = assetProvider.LoadBattleVisuals();
            ApplyPixelRuntimeSettings(battleVisualAssets);
            EnsureEventSystem();
            CreateCamera();
            CreateWorldRoots();
            CreateRuntimeFeedbackBridge();
            CreateBackground();
            CreateLanternGlow();
            CreatePlayer();
            CreateSafeAreaHud();
            CreateBattlePrototype();
            CreateStageSelectOverlay();
            SetOverlayBattlePaused(true);
        }

        private void Start()
        {
            feedbackBridge?.PlayStageSelect();
        }

        private static void CreateCamera()
        {
            var cameraObject = new GameObject("MainCamera");
            cameraObject.transform.position = new Vector3(0f, 0f, -10f);
            var camera = cameraObject.AddComponent<Camera>();
            cameraObject.AddComponent<AudioListener>();
            camera.orthographic = true;
            camera.orthographicSize = 5.4f;
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.03f, 0.026f, 0.026f);
            cameraObject.tag = "MainCamera";
        }

        private static void EnsureEventSystem()
        {
            if (FindAnyObjectByType<EventSystem>() != null)
            {
                return;
            }

            var eventSystemObject = new GameObject("EventSystem", typeof(EventSystem), typeof(InputSystemUIInputModule));
            DontDestroyOnLoad(eventSystemObject);
        }

        private void CreateRuntimeFeedbackBridge()
        {
            var feedbackObject = new GameObject("U43RuntimeFeedbackBridge");
            feedbackObject.transform.SetParent(poolRoot, false);
            feedbackBridge = feedbackObject.AddComponent<U43RuntimeFeedbackBridge>();
        }

        private static void ApplyPixelRuntimeSettings(BattleVisualAssetSet visualAssets)
        {
            SetPointFilter(visualAssets?.PlayerSprite);
            SetPointFilter(visualAssets?.EnemySprite);
            SetPointFilter(visualAssets?.ProjectileSprite);
            SetPointFilter(visualAssets?.ExpSprite);
            SetPointFilter(visualAssets?.HitSprite);
            SetPointFilter(visualAssets?.InkSprite);
            SetPointFilter(visualAssets?.TrailSprite);
        }

        private static void SetPointFilter(Sprite sprite)
        {
            if (sprite != null && sprite.texture != null)
            {
                sprite.texture.filterMode = FilterMode.Point;
            }
        }

        private void CreateWorldRoots()
        {
            var stageRoot = new GameObject("StageRoot").transform;
            playerRoot = new GameObject("PlayerRoot").transform;
            enemyRoot = new GameObject("EnemyRoot").transform;
            pickupRoot = new GameObject("PickupRoot").transform;
            projectileRoot = new GameObject("ProjectileRoot").transform;
            poolRoot = new GameObject("PoolRoot").transform;
            overlayRoot = new GameObject("OverlayRoot").transform;

            playerRoot.SetParent(stageRoot);
            enemyRoot.SetParent(stageRoot);
            pickupRoot.SetParent(stageRoot);
            projectileRoot.SetParent(stageRoot);
            poolRoot.SetParent(stageRoot);
            overlayRoot.SetParent(stageRoot);
        }

        private static void CreateBackground()
        {
            var background = new GameObject("DarkPaperNightBackground");
            var spriteRenderer = background.AddComponent<SpriteRenderer>();
            spriteRenderer.sprite = ProceduralSpriteFactory.CreatePaperSprite(256, 512);
            spriteRenderer.drawMode = SpriteDrawMode.Sliced;
            spriteRenderer.size = new Vector2(8.8f, 12.4f);
            spriteRenderer.sortingOrder = -100;
            background.transform.position = new Vector3(0f, 0f, 8f);
        }

        private static void CreateLanternGlow()
        {
            var glow = new GameObject("WarmLanternGlowPlaceholder");
            var spriteRenderer = glow.AddComponent<SpriteRenderer>();
            spriteRenderer.sprite = ProceduralSpriteFactory.CreateRadialSprite(160, new Color(1f, 0.62f, 0.22f, 0.52f));
            spriteRenderer.sortingOrder = -20;
            glow.transform.position = new Vector3(2.4f, 2.9f, 0f);
            glow.transform.localScale = new Vector3(2.4f, 2.4f, 1f);
        }

        private void CreatePlayer()
        {
            var player = new GameObject("YuiRuntimeDotCharacter", typeof(SpriteRenderer), typeof(PlayerController));
            player.transform.SetParent(playerRoot);
            player.transform.position = new Vector3(0f, -1.45f, 0f);
            player.transform.localScale = Vector3.one * 0.9f;
            var renderer = player.GetComponent<SpriteRenderer>();
            renderer.sprite = battleVisualAssets?.PlayerSprite
                ?? ProceduralSpriteFactory.CreateCharacterSprite(96, new Color(0.93f, 0.74f, 0.55f), new Color(0.23f, 0.12f, 0.16f));
            SetPointFilter(renderer.sprite);
            renderer.sortingOrder = 20;
            yui = player.transform;
        }

        private void CreateSafeAreaHud()
        {
            var canvasObject = new GameObject("SafeAreaCanvas", typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster), typeof(SafeAreaFitter));
            var canvas = canvasObject.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;

            var scaler = canvasObject.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(ReferenceWidth, ReferenceHeight);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0.5f;

            var hudRoot = new GameObject("HudRoot", typeof(RectTransform));
            hudRoot.transform.SetParent(canvasObject.transform, false);
            var hudRect = hudRoot.GetComponent<RectTransform>();
            hudRect.anchorMin = Vector2.zero;
            hudRect.anchorMax = Vector2.one;
            hudRect.offsetMin = Vector2.zero;
            hudRect.offsetMax = Vector2.zero;

            CreateHudPlate(hudRoot.transform, "TopHudPlaceholder", new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -30f), new Vector2(326f, 46f), "Lv 1   00:00   EXP");
            CreateHudPlate(hudRoot.transform, "BottomInventoryPlaceholder", new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0f, 34f), new Vector2(300f, 54f), "weapon placeholder");
            CreateRuntimeButtons(hudRoot.transform);
            topHudLabel = hudRoot.transform.Find("TopHudPlaceholder/Label")?.GetComponent<TextMeshProUGUI>();
        }

        private void CreateBattlePrototype()
        {
            var config = ScriptableObject.CreateInstance<GameFeelConfig>();
            config.name = "U2RuntimeBattleFeelConfig";

            var playerBounds = new Rect(-2.15f, -3.65f, 4.3f, 7.05f);
            var spawnBounds = new Rect(-2.15f, -3.65f, 4.3f, 7.65f);
            playerController = yui.GetComponent<PlayerController>();
            playerController.Initialize(config, playerBounds);

            var controllerObject = new GameObject("U2BattleController", typeof(U2BattleController));
            controllerObject.transform.SetParent(poolRoot, false);
            battleController = controllerObject.GetComponent<U2BattleController>();
            battleController.Initialize(config, yui, enemyRoot, projectileRoot, pickupRoot, overlayRoot, topHudLabel, playerBounds, spawnBounds, battleVisualAssets);
            battleController.SetRuntimeFeedbackBridge(feedbackBridge);
            battleController.SetRuntimePaused(true);

            CreateLevelUpDemo(battleController);
        }

        private void CreateLevelUpDemo(U2BattleController battleController)
        {
            var font = LoadJapaneseFont();

            var demoObj = new GameObject("U4LevelUpDemoController", typeof(U4LevelUpDemoController));
            demoObj.transform.SetParent(poolRoot, false);
            var demo = demoObj.GetComponent<U4LevelUpDemoController>();
            demo.Initialize(font);

            battleController.SetLevelUpNotifier(demo);
        }

        private void CreateRuntimeButtons(Transform parent)
        {
            var font = LoadJapaneseFont();
            var resultButton = PaperButton.Create(parent, "結果", 96f, 38f, () =>
            {
                feedbackBridge?.PlayResult();
                OpenResultOverlay(false);
            });
            resultButton.SetFont(font);
            var rect = resultButton.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(1f, 1f);
            rect.anchorMax = new Vector2(1f, 1f);
            rect.pivot = new Vector2(1f, 1f);
            rect.anchoredPosition = new Vector2(-22f, -86f);
        }

        private void CreateStageSelectOverlay()
        {
            var font = LoadJapaneseFont();
            stageSelectOverlay = new GameObject("U43StageSelectRuntimeOverlay", typeof(RectTransform), typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            var canvas = stageSelectOverlay.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.sortingOrder = 80;

            var scaler = stageSelectOverlay.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(ReferenceWidth, ReferenceHeight);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0.5f;

            var backdrop = new GameObject("PaperMapBackdrop", typeof(RectTransform), typeof(Image));
            backdrop.transform.SetParent(stageSelectOverlay.transform, false);
            var backRect = backdrop.GetComponent<RectTransform>();
            backRect.anchorMin = Vector2.zero;
            backRect.anchorMax = Vector2.one;
            backRect.offsetMin = Vector2.zero;
            backRect.offsetMax = Vector2.zero;
            backdrop.GetComponent<Image>().color = new Color(0.03f, 0.024f, 0.02f, 0.72f);

            var panel = CreatePanel(stageSelectOverlay.transform, "StageSelectPanel", new Vector2(0.07f, 0.17f), new Vector2(0.93f, 0.84f), new Color(0.88f, 0.78f, 0.58f, 0.96f));
            CreateLabel(panel.transform, "ヨルノシルベ", 28f, new Color(0.12f, 0.07f, 0.05f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -28f), new Vector2(260f, 40f), font);
            CreateLabel(panel.transform, "Stage1  墨夜の通り道", 18f, new Color(0.18f, 0.1f, 0.07f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -86f), new Vector2(286f, 32f), font);
            CreateLabel(panel.transform, "左下をドラッグして移動。カードとボタンはタップできます。", 14f, new Color(0.24f, 0.16f, 0.12f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 30f), new Vector2(282f, 60f), font);

            var startButton = PaperButton.Create(panel.transform, "Stage1へ", 180f, 48f, () =>
            {
                U43RuntimeFeedbackBridge.PlayButtonTapIfAvailable();
                stageSelectOverlay.SetActive(false);
                SetOverlayBattlePaused(false);
                feedbackBridge?.PlayBattleStart();
            });
            startButton.SetFont(font);
            var startRect = startButton.GetComponent<RectTransform>();
            startRect.anchorMin = new Vector2(0.5f, 0f);
            startRect.anchorMax = new Vector2(0.5f, 0f);
            startRect.pivot = new Vector2(0.5f, 0f);
            startRect.anchoredPosition = new Vector2(0f, 42f);
        }

        private void OpenResultOverlay(bool clear)
        {
            if (resultOverlay == null)
            {
                CreateResultOverlay();
            }

            var title = resultOverlay.transform.Find("ResultPanel/Title")?.GetComponent<TextMeshProUGUI>();
            if (title != null)
            {
                title.text = clear ? "Stage Clear" : "Result Preview";
            }

            SetOverlayBattlePaused(true);
            resultOverlay.SetActive(true);
        }

        private void CreateResultOverlay()
        {
            var font = LoadJapaneseFont();
            resultOverlay = new GameObject("U43ResultRuntimeOverlay", typeof(RectTransform), typeof(Canvas), typeof(CanvasScaler), typeof(GraphicRaycaster));
            var canvas = resultOverlay.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.sortingOrder = 90;

            var scaler = resultOverlay.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(ReferenceWidth, ReferenceHeight);
            scaler.screenMatchMode = CanvasScaler.ScreenMatchMode.MatchWidthOrHeight;
            scaler.matchWidthOrHeight = 0.5f;

            var blocker = new GameObject("ResultTapBlocker", typeof(RectTransform), typeof(Image));
            blocker.transform.SetParent(resultOverlay.transform, false);
            var blockerRect = blocker.GetComponent<RectTransform>();
            blockerRect.anchorMin = Vector2.zero;
            blockerRect.anchorMax = Vector2.one;
            blockerRect.offsetMin = Vector2.zero;
            blockerRect.offsetMax = Vector2.zero;
            blocker.GetComponent<Image>().color = new Color(0.02f, 0.015f, 0.015f, 0.65f);

            var panel = CreatePanel(resultOverlay.transform, "ResultPanel", new Vector2(0.07f, 0.2f), new Vector2(0.93f, 0.8f), new Color(0.92f, 0.84f, 0.66f, 0.97f));
            CreateLabel(panel.transform, "Result Preview", 24f, new Color(0.12f, 0.07f, 0.05f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -28f), new Vector2(260f, 36f), font, "Title");
            CreateLabel(panel.transform, "欠片 +12 / 新しい手がかり / Retry導線", 15f, new Color(0.22f, 0.14f, 0.1f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 26f), new Vector2(288f, 56f), font);

            var retryButton = PaperButton.Create(panel.transform, "Retry", 126f, 44f, () =>
            {
                feedbackBridge?.PlayRetry();
                SceneManager.LoadScene("Stage1");
            });
            retryButton.SetFont(font);
            var retryRect = retryButton.GetComponent<RectTransform>();
            retryRect.anchorMin = new Vector2(0.32f, 0f);
            retryRect.anchorMax = new Vector2(0.32f, 0f);
            retryRect.pivot = new Vector2(0.5f, 0f);
            retryRect.anchoredPosition = new Vector2(0f, 38f);

            var stageButton = PaperButton.Create(panel.transform, "StageSelect", 150f, 44f, () =>
            {
                feedbackBridge?.PlayStageSelect();
                resultOverlay.SetActive(false);
                stageSelectOverlay.SetActive(true);
                SetOverlayBattlePaused(true);
            });
            stageButton.SetFont(font);
            var stageRect = stageButton.GetComponent<RectTransform>();
            stageRect.anchorMin = new Vector2(0.68f, 0f);
            stageRect.anchorMax = new Vector2(0.68f, 0f);
            stageRect.pivot = new Vector2(0.5f, 0f);
            stageRect.anchoredPosition = new Vector2(0f, 38f);

            resultOverlay.SetActive(false);
        }

        private void SetOverlayBattlePaused(bool paused)
        {
            battleController?.SetRuntimePaused(paused);
            playerController?.SetRuntimeInputBlocked(paused);
        }

        private static GameObject CreatePanel(Transform parent, string name, Vector2 anchorMin, Vector2 anchorMax, Color color)
        {
            var panel = new GameObject(name, typeof(RectTransform), typeof(Image));
            panel.transform.SetParent(parent, false);
            var rect = panel.GetComponent<RectTransform>();
            rect.anchorMin = anchorMin;
            rect.anchorMax = anchorMax;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
            panel.GetComponent<Image>().color = color;
            return panel;
        }

        private static TextMeshProUGUI CreateLabel(
            Transform parent,
            string text,
            float fontSize,
            Color color,
            Vector2 anchorMin,
            Vector2 anchorMax,
            Vector2 anchoredPosition,
            Vector2 size,
            TMP_FontAsset font,
            string name = "Label")
        {
            var labelObject = new GameObject(name, typeof(RectTransform), typeof(TextMeshProUGUI));
            labelObject.transform.SetParent(parent, false);
            var rect = labelObject.GetComponent<RectTransform>();
            rect.anchorMin = anchorMin;
            rect.anchorMax = anchorMax;
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = anchoredPosition;
            rect.sizeDelta = size;

            var label = labelObject.GetComponent<TextMeshProUGUI>();
            label.text = text;
            label.fontSize = fontSize;
            label.color = color;
            label.alignment = TextAlignmentOptions.Center;
            label.textWrappingMode = TextWrappingModes.Normal;
            if (font != null)
            {
                label.font = font;
            }

            return label;
        }

        private static TMP_FontAsset LoadJapaneseFont()
        {
            if (cachedJapaneseFont != null)
            {
                return cachedJapaneseFont;
            }

            var font = Resources.Load<Font>("ZenMaruGothic-Medium");
            if (font != null)
            {
                var runtimeFont = TMP_FontAsset.CreateFontAsset(font, 36, 4, GlyphRenderMode.SDFAA, 1024, 1024);
                runtimeFont.name = "ZenMaruGothic-Medium Runtime SDF";
                cachedJapaneseFont = runtimeFont;
                return cachedJapaneseFont;
            }

            var loaded = Resources.Load<TMP_FontAsset>("Fonts & Materials/ZenMaruGothic-Medium SDF");
            if (IsUsableFontAsset(loaded))
            {
                cachedJapaneseFont = loaded;
                return cachedJapaneseFont;
            }

            loaded = Resources.Load<TMP_FontAsset>("ZenMaruGothic-Medium SDF");
            if (IsUsableFontAsset(loaded))
            {
                cachedJapaneseFont = loaded;
                return cachedJapaneseFont;
            }

            cachedJapaneseFont = TMP_Settings.defaultFontAsset;
            return cachedJapaneseFont;
        }

        private static bool IsUsableFontAsset(TMP_FontAsset fontAsset)
        {
            return fontAsset != null &&
                   fontAsset.atlasTextures != null &&
                   fontAsset.atlasTextures.Length > 0 &&
                   fontAsset.atlasTextures[0] != null;
        }

        private static void CreateHudPlate(Transform parent, string name, Vector2 anchorMin, Vector2 anchorMax, Vector2 anchoredPosition, Vector2 size, string text)
        {
            var plate = new GameObject(name, typeof(Image));
            plate.transform.SetParent(parent, false);
            var rect = plate.GetComponent<RectTransform>();
            rect.anchorMin = anchorMin;
            rect.anchorMax = anchorMax;
            rect.pivot = new Vector2(0.5f, 0.5f);
            rect.anchoredPosition = anchoredPosition;
            rect.sizeDelta = size;

            var image = plate.GetComponent<Image>();
            image.color = new Color(0.18f, 0.12f, 0.09f, 0.72f);

            var labelObject = new GameObject("Label", typeof(TextMeshProUGUI));
            labelObject.transform.SetParent(plate.transform, false);
            var labelRect = labelObject.GetComponent<RectTransform>();
            labelRect.anchorMin = Vector2.zero;
            labelRect.anchorMax = Vector2.one;
            labelRect.offsetMin = new Vector2(12f, 6f);
            labelRect.offsetMax = new Vector2(-12f, -6f);

            var label = labelObject.GetComponent<TextMeshProUGUI>();
            label.text = text;
            label.alignment = TextAlignmentOptions.Center;
            label.fontSize = 18f;
            label.color = new Color(0.96f, 0.86f, 0.62f);
            label.textWrappingMode = TextWrappingModes.NoWrap;
        }
    }
}
