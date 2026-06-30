using TMPro;
using UnityEngine;
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
        private TextMeshProUGUI topHudLabel;
        private IAssetProvider assetProvider;
        private BattleVisualAssetSet battleVisualAssets;
        private static TMP_FontAsset cachedJapaneseFont;

        private void Awake()
        {
            Application.targetFrameRate = 60;
            assetProvider = new U5ProofAssetProvider();
            battleVisualAssets = assetProvider.LoadBattleVisuals();
            CreateCamera();
            CreateWorldRoots();
            CreateBackground();
            CreateLanternGlow();
            CreatePlayer();
            CreateSafeAreaHud();
            CreateBattlePrototype();
        }

        private static void CreateCamera()
        {
            var cameraObject = new GameObject("MainCamera");
            cameraObject.transform.position = new Vector3(0f, 0f, -10f);
            var camera = cameraObject.AddComponent<Camera>();
            camera.orthographic = true;
            camera.orthographicSize = 5.4f;
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.03f, 0.026f, 0.026f);
            cameraObject.tag = "MainCamera";
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
            var player = new GameObject("YuiPlaceholder", typeof(SpriteRenderer), typeof(PlayerController));
            player.transform.SetParent(playerRoot);
            player.transform.position = new Vector3(0f, -1.45f, 0f);
            player.transform.localScale = Vector3.one * 0.9f;
            var renderer = player.GetComponent<SpriteRenderer>();
            renderer.sprite = battleVisualAssets?.PlayerSprite
                ?? ProceduralSpriteFactory.CreateCharacterSprite(96, new Color(0.93f, 0.74f, 0.55f), new Color(0.23f, 0.12f, 0.16f));
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
            topHudLabel = hudRoot.transform.Find("TopHudPlaceholder/Label")?.GetComponent<TextMeshProUGUI>();
        }

        private void CreateBattlePrototype()
        {
            var config = ScriptableObject.CreateInstance<GameFeelConfig>();
            config.name = "U2RuntimeBattleFeelConfig";

            var playerBounds = new Rect(-2.15f, -3.65f, 4.3f, 7.05f);
            var spawnBounds = new Rect(-2.15f, -3.65f, 4.3f, 7.65f);
            yui.GetComponent<PlayerController>().Initialize(config, playerBounds);

            var controllerObject = new GameObject("U2BattleController", typeof(U2BattleController));
            controllerObject.transform.SetParent(poolRoot, false);
            var controller = controllerObject.GetComponent<U2BattleController>();
            controller.Initialize(config, yui, enemyRoot, projectileRoot, pickupRoot, overlayRoot, topHudLabel, playerBounds, spawnBounds, battleVisualAssets);

            CreateLevelUpDemo(controller);
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
