using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using TMPro;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    [DefaultExecutionOrder(-900)]
    public sealed class LoadingTopVisualPolishCoordinator : MonoBehaviour
    {
        private const float SearchInterval = .08f;
        private const float RevealSeconds = .36f;
        private const float TopReadyTimeout = 8f;
        private const string LoadingCopy = "夜の記憶をひらいています…";

        private static readonly string[] ExpectedTopLayerNames =
        {
            "Environment",
            "Stars",
            "Moon",
            "CloudsFar",
            "CloudsNear",
            "DistantLights",
            "DistantCompanion",
            "Characters",
            "FireBase",
            "AnimalRobot",
            "RobotEye",
            "FireFlipbook",
            "FireGlow",
            "Foreground",
            "LanternGlow",
            "Smoke_01",
            "Ember_01",
        };

#if UNITY_EDITOR
        private static readonly IReadOnlyDictionary<string, string> EditorTopLayerFiles =
            new Dictionary<string, string>(StringComparer.Ordinal)
            {
                ["Environment"] = "00-environment-starless.png",
                ["Stars"] = "01-stars.png",
                ["Moon"] = "01-moon.png",
                ["CloudsFar"] = "02-clouds-far.png",
                ["CloudsNear"] = "03-clouds-near.png",
                ["DistantLights"] = "04-distant-lights-mask.png",
                ["DistantCompanion"] = "05-distant-companion.png",
                ["Characters"] = "06-characters.png",
                ["FireBase"] = "09-fire-base.png",
                ["AnimalRobot"] = "08-animal-robot.png",
                ["RobotEye"] = "08-robot-eye-mask.png",
                ["FireFlipbook"] = "10-fire-flipbook-atlas.png",
                ["FireGlow"] = "11-fire-glow-mask.png",
                ["Foreground"] = "14-foreground-accents.png",
                ["LanternGlow"] = "14-lantern-glow-mask.png",
            };
#endif

        private static LoadingTopVisualPolishCoordinator instance;

        private readonly Dictionary<RawImage, float> intendedLayerAlpha = new();
        private readonly HashSet<RawImage> hiddenUntilTextureReady = new();
        private readonly List<Texture2D> editorPreviewTextures = new();

        private LoadingSeasonalView loading;
        private Image loadingTrack;
        private Image loadingFill;
        private TextMeshProUGUI loadingStatus;
        private TopLivingNightView top;
        private CanvasGroup topArtGroup;
        private CanvasGroup topUiGroup;
        private float nextSearchAt;
        private float topStartedAt;
        private float revealStartedAt;
        private bool revealStarted;
        private bool editorPreloadAttempted;

        public static bool IsCurrentTopReady { get; private set; }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (instance != null)
                return;

            instance = FindFirstObjectByType<LoadingTopVisualPolishCoordinator>();
            if (instance != null)
                return;

            var coordinator = new GameObject(
                "LoadingTopVisualPolishCoordinator",
                typeof(LoadingTopVisualPolishCoordinator));
            DontDestroyOnLoad(coordinator);
            instance = coordinator.GetComponent<LoadingTopVisualPolishCoordinator>();
        }

        private void Awake()
        {
            if (instance != null && instance != this)
            {
                Destroy(gameObject);
                return;
            }

            instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private void Update()
        {
            if (Time.unscaledTime >= nextSearchAt)
            {
                nextSearchAt = Time.unscaledTime + SearchInterval;
                DiscoverViews();
            }

            UpdateLoadingLine();
            UpdateTopReadiness();
        }

        private void DiscoverViews()
        {
            var currentLoading = FindFirstObjectByType<LoadingSeasonalView>();
            if (currentLoading != loading)
            {
                loading = currentLoading;
                PolishLoadingView();
            }

            var currentTop = FindFirstObjectByType<TopLivingNightView>();
            if (currentTop != top)
            {
                ResetTopTracking();
                top = currentTop;
                if (top != null)
                    PrepareTopView();
            }
        }

        private void PolishLoadingView()
        {
            loadingTrack = null;
            loadingFill = null;
            loadingStatus = null;
            if (loading == null)
                return;

            loadingTrack = FindChildComponent<Image>(
                loading.transform,
                "LoadingSeasonalProgressTrack");
            loadingFill = FindChildComponent<Image>(
                loading.transform,
                "LoadingSeasonalProgressFill");
            loadingStatus = FindChildComponent<TextMeshProUGUI>(
                loading.transform,
                "LoadingSeasonalStatus");

            if (loadingTrack != null)
            {
                var rect = loadingTrack.rectTransform;
                rect.anchorMin = new Vector2(.15f, .0272f);
                rect.anchorMax = new Vector2(.85f, .0294f);
                rect.offsetMin = Vector2.zero;
                rect.offsetMax = Vector2.zero;
                loadingTrack.color = new Color(.40f, .45f, .52f, .20f);
                loadingTrack.raycastTarget = false;
            }

            if (loadingFill != null)
            {
                loadingFill.color = new Color(.80f, .84f, .84f, .76f);
                loadingFill.raycastTarget = false;
            }

            if (loadingStatus != null)
            {
                var rect = loadingStatus.rectTransform;
                rect.anchorMin = new Vector2(.08f, .038f);
                rect.anchorMax = new Vector2(.92f, .065f);
                rect.offsetMin = Vector2.zero;
                rect.offsetMax = Vector2.zero;
                loadingStatus.text = LoadingCopy;
                loadingStatus.fontSize = 10.5f;
                loadingStatus.color = new Color(.90f, .91f, .90f, .82f);
            }
        }

        private void UpdateLoadingLine()
        {
            if (loading == null || !loading.isActiveAndEnabled)
                return;

            if (loadingStatus != null && loadingStatus.text != LoadingCopy)
                loadingStatus.text = LoadingCopy;

            if (loadingFill == null)
                return;

            var pulse = .72f + Mathf.Sin(Time.unscaledTime * 2.25f) * .08f;
            var color = loadingFill.color;
            color.a = pulse;
            loadingFill.color = color;
        }

        private void PrepareTopView()
        {
            IsCurrentTopReady = false;
            topStartedAt = Time.unscaledTime;
            revealStarted = false;
            editorPreloadAttempted = false;

            var art = FindChild(top.transform, "TopLivingNightArt");
            var safe = FindChild(top.transform, "TopLivingNightSafeArea");
            topArtGroup = art == null ? null : GetOrAddCanvasGroup(art.gameObject);
            topUiGroup = safe == null ? null : GetOrAddCanvasGroup(safe.gameObject);

            if (topArtGroup != null)
                topArtGroup.alpha = 0f;
            if (topUiGroup != null)
            {
                topUiGroup.alpha = 0f;
                topUiGroup.blocksRaycasts = false;
                topUiGroup.interactable = false;
            }

            RefreshLayerVisibility();
#if UNITY_EDITOR
            PreloadEditorBaseLayers();
#endif
            RefreshLayerVisibility();
        }

        private void UpdateTopReadiness()
        {
            if (top == null || !top.gameObject.activeInHierarchy)
                return;

            RefreshLayerVisibility();
            var contentReady = AreBaseLayersReady();

            if (!revealStarted)
            {
                if (contentReady)
                    StartTopReveal(false);
                else if (Time.unscaledTime - topStartedAt >= TopReadyTimeout)
                    StartTopReveal(true);
            }

            if (!revealStarted)
                return;

            var progress = Mathf.Clamp01(
                (Time.unscaledTime - revealStartedAt) / RevealSeconds);
            var alpha = Mathf.SmoothStep(0f, 1f, progress);
            if (topArtGroup != null)
                topArtGroup.alpha = alpha;
            if (topUiGroup != null)
                topUiGroup.alpha = alpha;

            if (progress < 1f)
                return;

            if (topUiGroup != null)
            {
                topUiGroup.blocksRaycasts = true;
                topUiGroup.interactable = true;
            }

            // A timeout may reveal the UI so the player is never trapped on a
            // blank screen, but automated capture must stay blocked until the
            // complete visual/motion content (including smoke + embers) exists.
            IsCurrentTopReady = contentReady;
        }

        private void StartTopReveal(bool timedOut)
        {
            revealStarted = true;
            revealStartedAt = Time.unscaledTime;

            if (!timedOut)
                return;

            var status = FindChildComponent<TextMeshProUGUI>(
                top.transform,
                "TopLoadStatus");
            if (status != null && string.IsNullOrWhiteSpace(status.text))
                status.text = "夜景の一部を整えています…";

            Debug.LogWarning(
                "TopLivingNight visual readiness timed out; revealing available layers while capture readiness remains blocked until all required content is ready.");
        }

        private void RefreshLayerVisibility()
        {
            if (top == null)
                return;

            foreach (var image in top.GetComponentsInChildren<RawImage>(true))
            {
                if (!intendedLayerAlpha.ContainsKey(image))
                    intendedLayerAlpha.Add(image, image.color.a);

                if (image.texture == null)
                {
                    hiddenUntilTextureReady.Add(image);
                    var hidden = image.color;
                    hidden.a = 0f;
                    image.color = hidden;
                    continue;
                }

                if (!hiddenUntilTextureReady.Remove(image))
                    continue;

                var visible = image.color;
                visible.a = intendedLayerAlpha[image];
                image.color = visible;
            }
        }

        private bool AreBaseLayersReady()
        {
            if (top == null)
                return false;

            foreach (var layerName in ExpectedTopLayerNames)
            {
                var image = FindChildComponent<RawImage>(top.transform, layerName);
                if (image == null || image.texture == null)
                    return false;
            }
            return true;
        }

#if UNITY_EDITOR
        private void PreloadEditorBaseLayers()
        {
            if (editorPreloadAttempted || top == null)
                return;
            editorPreloadAttempted = true;

            var repositoryRoot = Path.GetFullPath(
                Path.Combine(Application.dataPath, "..", "..", ".."));
            var layerRoot = Path.Combine(
                repositoryRoot,
                "docs",
                "design-targets",
                "generated",
                "top-living-night-v2",
                "layers");

            foreach (var pair in EditorTopLayerFiles)
            {
                var image = FindChildComponent<RawImage>(top.transform, pair.Key);
                if (image == null || image.texture != null)
                    continue;

                var path = Path.Combine(layerRoot, pair.Value);
                if (!File.Exists(path))
                {
                    Debug.LogWarning($"TOP editor preload source missing: {path}");
                    continue;
                }

                var texture = new Texture2D(2, 2, TextureFormat.RGBA32, false);
                if (!texture.LoadImage(File.ReadAllBytes(path), true))
                {
                    Destroy(texture);
                    Debug.LogWarning($"TOP editor preload decode failed: {path}");
                    continue;
                }

                texture.name = $"TopLivingNightPreview_{pair.Key}";
                texture.wrapMode = TextureWrapMode.Clamp;
                texture.filterMode = FilterMode.Bilinear;
                image.texture = texture;
                editorPreviewTextures.Add(texture);
            }
        }
#endif

        private void ResetTopTracking()
        {
            IsCurrentTopReady = false;
            topArtGroup = null;
            topUiGroup = null;
            revealStarted = false;
            editorPreloadAttempted = false;
            intendedLayerAlpha.Clear();
            hiddenUntilTextureReady.Clear();

            foreach (var texture in editorPreviewTextures)
                if (texture != null) Destroy(texture);
            editorPreviewTextures.Clear();
        }

        private void OnDestroy()
        {
            ResetTopTracking();
            if (instance == this)
                instance = null;
        }

        private static Transform FindChild(Transform root, string name)
        {
            if (root == null)
                return null;
            return root
                .GetComponentsInChildren<Transform>(true)
                .FirstOrDefault(value => value.name == name);
        }

        private static T FindChildComponent<T>(Transform root, string name)
            where T : Component
        {
            var child = FindChild(root, name);
            return child == null ? null : child.GetComponent<T>();
        }

        private static CanvasGroup GetOrAddCanvasGroup(GameObject target)
        {
            return target.GetComponent<CanvasGroup>() ?? target.AddComponent<CanvasGroup>();
        }
    }
}
