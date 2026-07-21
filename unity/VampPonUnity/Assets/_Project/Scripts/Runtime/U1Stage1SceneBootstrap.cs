using TMPro;
using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.InputSystem.UI;
using UnityEngine.TextCore.LowLevel;
using UnityEngine.UI;
using VampPon.UnitySpike.Data;
using VampPon.UnitySpike.Player;
using VampPon.UnitySpike.U4;
using VampPon.UnitySpike.U5;
using VampPon.UnitySpike.UI;
using VampPon.UnitySpike.Runtime.Visuals;
using VampPon.UnitySpike.Runtime.AppFlow;
using VampPon.UnitySpike.Runtime.Gameplay;

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
        private Transform safeHudRoot;
        private IAssetProvider assetProvider;
        private BattleVisualAssetSet battleVisualAssets;
        private U43RuntimeFeedbackBridge feedbackBridge;
        private U2BattleController battleController;
        private PlayerController playerController;
        private YuiSpriteAnimator yuiAnimator;
        private U4LevelUpDemoController levelUpController;
        private U46RuntimeShell u46Shell;
        private Stage1GameplayRuntimeCoordinator gameplayRuntime;
        private static TMP_FontAsset cachedJapaneseFont;

        public string AssetProviderName => assetProvider?.ProviderName ?? string.Empty;
        public AssetApprovalLevel AssetProviderApprovalLevel => assetProvider?.ApprovalLevel ?? AssetApprovalLevel.Proof;
        public bool AssetProviderIsProofOnly => assetProvider?.IsProofOnly ?? true;
        public bool AssetProviderIsProductionApproved => assetProvider?.IsProductionApproved ?? false;
        public bool DevelopmentVisualFallbackUsed => assetProvider is RuntimeVisualAssetProvider provider && provider.DevelopmentFallbackUsed;
        public BattleVisualAssetSet BattleVisualAssets => battleVisualAssets;

        private void Awake()
        {
            Application.targetFrameRate = 60;
#if VAMPPON_U48_ASSET_PREVIEW
            var normalProvider = new RuntimeVisualAssetProvider();
            assetProvider = U48AssetPreviewProvider.CreateOrDefault(normalProvider);
            try
            {
                battleVisualAssets = assetProvider.LoadBattleVisuals();
            }
            catch
            {
                (assetProvider as System.IDisposable)?.Dispose();
                throw;
            }
#else
            assetProvider = new RuntimeVisualAssetProvider();
            battleVisualAssets = assetProvider.LoadBattleVisuals();
#endif
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
            CreateU46RuntimeShell();
            U48ProductionVisualBinder.Attach(gameObject);
#if VAMPPON_U48_ASSET_PREVIEW
            U48AssetPreviewSceneBinder.AttachIfActive(gameObject);
#endif
        }

#if VAMPPON_U48_ASSET_PREVIEW
        private void OnDestroy()
        {
            GetComponent<U48AssetPreviewSceneBinder>()?.Restore();
            (assetProvider as System.IDisposable)?.Dispose();
        }
#endif

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
            spriteRenderer.sprite = U48ProductionVisualCatalog.LoadRequired().SpriteFor("stage1-background");
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
            var player = new GameObject("YuiRuntimeDotCharacter", typeof(SpriteRenderer), typeof(PlayerController), typeof(YuiSpriteAnimator));
            player.transform.SetParent(playerRoot);
            player.transform.position = new Vector3(0f, -1.45f, 0f);
            player.transform.localScale = Vector3.one * battleVisualAssets.PlayerVisualScale;
            var renderer = player.GetComponent<SpriteRenderer>();
            renderer.sprite = battleVisualAssets.PlayerSprite;
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
            safeHudRoot = hudRoot.transform;

            CreateHudPlate(hudRoot.transform, "TopHudPlaceholder", new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -30f), new Vector2(326f, 46f), "Lv 1   00:00   EXP");
            CreateHudPlate(hudRoot.transform, "BottomInventoryPlaceholder", new Vector2(0.5f, 0f), new Vector2(0.5f, 0f), new Vector2(0f, 38f), new Vector2(318f, 62f), "");
            CreateBattleInventorySlots(hudRoot.transform);
            CreateVirtualStickVisual(hudRoot.transform);
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
            gameplayRuntime = controllerObject.AddComponent<Stage1GameplayRuntimeCoordinator>();
            gameplayRuntime.Initialize(battleController, playerController);
            gameplayRuntime.SetRuntimePaused(true);
            yuiAnimator = yui.GetComponent<YuiSpriteAnimator>();
            yuiAnimator.Initialize(battleVisualAssets.PlayerAnimation, playerController, battleController);
            yuiAnimator.SetRuntimePaused(true);

            CreateLevelUpDemo(battleController);
            levelUpController.BindGameplayRuntime(gameplayRuntime);
            var inventoryHud = new GameObject("U47InventoryHudPresenter", typeof(U47InventoryHudPresenter)).GetComponent<U47InventoryHudPresenter>();
            inventoryHud.transform.SetParent(safeHudRoot, false); inventoryHud.Build(safeHudRoot, LoadJapaneseFont(), gameplayRuntime);
        }

        private void CreateLevelUpDemo(U2BattleController battleController)
        {
            var font = LoadJapaneseFont();

            var demoObj = new GameObject("U4LevelUpDemoController", typeof(U4LevelUpDemoController));
            demoObj.transform.SetParent(poolRoot, false);
            levelUpController = demoObj.GetComponent<U4LevelUpDemoController>();
            levelUpController.Initialize(font);

            battleController.SetLevelUpNotifier(levelUpController);
        }

        private void CreateU46RuntimeShell()
        {
            var shellObject = new GameObject("U46RuntimeShell", typeof(U46RuntimeShell));
            shellObject.transform.SetParent(overlayRoot, false);
            u46Shell = shellObject.GetComponent<U46RuntimeShell>();
            u46Shell.Initialize(battleController, playerController, yuiAnimator, levelUpController);
            feedbackBridge?.ApplySettings(u46Shell.Save.Current?.settings);
#if VAMPPON_U49_DEVICE_VERIFICATION && DEVELOPMENT_BUILD
            gameObject.AddComponent<VampPon.UnitySpike.U49.AudioHaptic.U49DeviceVerificationHarness>();
#endif
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
            var panelImage = panel.GetComponent<Image>();
            AppQualityUiFactory.ApplyCandidate(panelImage, AppQualityAssetProvider.StageSelectMapPanel, new Color(0.88f, 0.78f, 0.58f, 0.96f));
            AppQualityUiFactory.CreateDecorativeImage(panel.transform, "U45StageSelectLanternAccent", AppQualityAssetProvider.SmallLanternAccent, new Vector2(1f, 1f), new Vector2(48f, 48f), new Vector2(-32f, -32f), new Color(1f, 0.62f, 0.24f, 0.28f));
            AppQualityUiFactory.CreateDecorativeImage(panel.transform, "U45StageSelectInkDivider", AppQualityAssetProvider.BlackInkDivider, new Vector2(0.5f, 1f), new Vector2(236f, 30f), new Vector2(0f, -69f), new Color(0.08f, 0.05f, 0.04f, 0.45f));
            CreateLabel(panel.transform, "ヨルノシルベ", 28f, new Color(0.12f, 0.07f, 0.05f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -28f), new Vector2(260f, 40f), font);
            var stageCard = CreatePanel(panel.transform, "U45Stage1CardFrame", new Vector2(0.12f, 0.39f), new Vector2(0.88f, 0.67f), new Color(0.93f, 0.84f, 0.64f, 0.94f));
            AppQualityUiFactory.ApplyCandidate(stageCard.GetComponent<Image>(), AppQualityAssetProvider.StageCardFrame, new Color(0.93f, 0.84f, 0.64f, 0.94f));
            CreateLabel(stageCard.transform, "Stage1  墨夜の通り道", 18f, new Color(0.18f, 0.1f, 0.07f), new Vector2(0.5f, 0.72f), new Vector2(0.5f, 0.72f), Vector2.zero, new Vector2(246f, 32f), font);
            CreateLabel(stageCard.transform, "左下だけで移動 / カードとボタンはタップ", 13f, new Color(0.24f, 0.16f, 0.12f), new Vector2(0.5f, 0.34f), new Vector2(0.5f, 0.34f), Vector2.zero, new Vector2(250f, 42f), font);

            var startButton = PaperButton.Create(panel.transform, "Stage1へ", AppQualityTapTargets.StageStartWidth, AppQualityTapTargets.StageStartHeight, () =>
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
            startRect.anchoredPosition = new Vector2(0f, 44f);
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
                title.text = clear ? "踏破" : "帰還";
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
            CreateLabel(panel.transform, "今夜、持ち帰った記憶", 24f, new Color(0.12f, 0.07f, 0.05f), new Vector2(0.5f, 1f), new Vector2(0.5f, 1f), new Vector2(0f, -28f), new Vector2(260f, 36f), font, "Title");
            CreateLabel(panel.transform, "欠片 +12 / 新しい手がかり / Retry導線", 15f, new Color(0.22f, 0.14f, 0.1f), new Vector2(0.5f, 0.5f), new Vector2(0.5f, 0.5f), new Vector2(0f, 26f), new Vector2(288f, 56f), font);

            var retryButton = PaperButton.Create(panel.transform, "Retry", 126f, 44f, () =>
            {
                feedbackBridge?.PlayRetry();
                u46Shell?.Flow.Execute(AppFlowCommand.RetryRun());
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
            yuiAnimator?.SetRuntimePaused(paused);
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
            AppQualityUiFactory.FitText(label, Mathf.Max(9f, fontSize - 6f));
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
            AppQualityUiFactory.ApplyCandidate(image, AppQualityAssetProvider.BattleHudTopFrame, new Color(0.18f, 0.12f, 0.09f, 0.72f));
            if (name == "BottomInventoryPlaceholder")
            {
                image.color = new Color(1f, 1f, 1f, 0.72f);
            }

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
            AppQualityUiFactory.FitText(label, 13f);
        }

        private static void CreateBattleInventorySlots(Transform parent)
        {
            for (var i = 0; i < 5; i++)
            {
                var slot = AppQualityUiFactory.CreateDecorativeImage(
                    parent,
                    $"U45BattleInventorySlot_{i + 1:00}",
                    AppQualityAssetProvider.BattleInventorySlotFrame,
                    new Vector2(0.5f, 0f),
                    new Vector2(42f, 42f),
                    new Vector2(-96f + i * 48f, 38f),
                    new Color(0.18f, 0.12f, 0.09f, 0.42f));
                slot.raycastTarget = false;
            }
        }

        private static void CreateVirtualStickVisual(Transform parent)
        {
            var ring = AppQualityUiFactory.CreateDecorativeImage(
                parent,
                "U45VirtualStickLowerLeftRing",
                AppQualityAssetProvider.VirtualStickRing,
                new Vector2(0f, 0f),
                new Vector2(118f, 118f),
                new Vector2(78f, 82f),
                new Color(0.72f, 0.52f, 0.28f, 0.16f));
            ring.color = new Color(ring.color.r, ring.color.g, ring.color.b, 0.52f);

            var knob = AppQualityUiFactory.CreateDecorativeImage(
                parent,
                "U45VirtualStickLowerLeftKnob",
                AppQualityAssetProvider.VirtualStickKnob,
                new Vector2(0f, 0f),
                new Vector2(42f, 42f),
                new Vector2(78f, 82f),
                new Color(0.18f, 0.12f, 0.09f, 0.35f));
            knob.color = new Color(knob.color.r, knob.color.g, knob.color.b, 0.42f);
        }
    }
}
