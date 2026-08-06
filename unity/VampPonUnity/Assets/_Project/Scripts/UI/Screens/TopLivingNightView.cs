using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    public sealed class TopLivingNightView : MonoBehaviour
    {
        private const string LayerRelativeRoot = "docs/design-targets/generated/top-living-night-v2/layers";
        private const string StreamingRoot = "TopLivingNight";

        private readonly List<Texture2D> ownedTextures = new();
        private readonly List<AtlasParticle> smokeParticles = new();
        private readonly List<AtlasParticle> emberParticles = new();

        private Action openStageSelect;
        private Action openCollection;
        private RectTransform artRoot;
        private RectTransform titleRoot;
        private RectTransform farCloudsRect;
        private RectTransform nearCloudsRect;
        private RawImage stars;
        private RawImage distantLights;
        private RawImage robotEye;
        private RawImage fireAtlas;
        private RawImage fireGlow;
        private RawImage lanternGlow;
        private Transform foregroundTransform;
        private TextMeshProUGUI statusLabel;
        private Coroutine loadingRoutine;
        private bool reducedMotion;
        private int failedLayerCount;
        private int fireFrame;
        private int fireDirection = 1;
        private int fireStep;
        private float fireTimer;

        private static readonly LayerSpec[] FullCanvasLayers =
        {
            new("Environment", "00-environment-starless.png", 1f),
            new("Stars", "01-stars.png", .72f),
            new("Moon", "01-moon.png", 1f),
            new("CloudsFar", "02-clouds-far.png", .78f),
            new("CloudsNear", "03-clouds-near.png", .82f),
            new("DistantLights", "04-distant-lights-mask.png", .68f),
            new("DistantCompanion", "05-distant-companion.png", 1f),
            new("Characters", "06-characters.png", 1f),
            new("FireBase", "09-fire-base.png", 1f),
            new("AnimalRobot", "08-animal-robot.png", 1f),
            new("RobotEye", "08-robot-eye-mask.png", .78f),
            new("FireGlow", "11-fire-glow-mask.png", .62f),
            new("Foreground", "14-foreground-accents.png", 1f),
            new("LanternGlow", "14-lantern-glow-mask.png", .48f),
        };

        public void Build(
            Transform parent,
            TMP_FontAsset font,
            Action onOpenStageSelect,
            Action onOpenCollection)
        {
            openStageSelect = onOpenStageSelect ?? throw new ArgumentNullException(nameof(onOpenStageSelect));
            openCollection = onOpenCollection ?? throw new ArgumentNullException(nameof(onOpenCollection));
            transform.SetParent(parent, false);

            var rect = gameObject.AddComponent<RectTransform>();
            rect.anchorMin = Vector2.zero;
            rect.anchorMax = Vector2.one;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;

            var blocker = U46ScreenFactory.Panel(
                transform,
                "TopLivingNightBlocker",
                Vector2.zero,
                Vector2.one,
                null,
                new Color(.014f, .018f, .055f, 1f));
            blocker.GetComponent<Image>().raycastTarget = true;

            artRoot = CreateRect(transform, "TopLivingNightArt", new Vector2(-.012f, -.006f), new Vector2(1.012f, 1.006f));
            foreach (var spec in FullCanvasLayers)
            {
                var image = CreateRawLayer(artRoot, spec.Name, spec.Alpha);
                CaptureMotionReference(spec.Name, image);
            }

            fireAtlas = CreateRawLayer(artRoot, "FireFlipbook", 1f, fullCanvas: false);
            ConfigureBox(fireAtlas.rectTransform, new Vector2(.5f, .245f), new Vector2(150f, 126f));
            fireAtlas.uvRect = AtlasCell(0, 4, 3);
            if (robotEye != null)
                fireAtlas.transform.SetSiblingIndex(robotEye.transform.GetSiblingIndex() + 1);

            var safe = new GameObject("TopLivingNightSafeArea", typeof(RectTransform), typeof(VampPon.UnitySpike.UI.SafeAreaFitter));
            safe.transform.SetParent(transform, false);
            var safeRect = safe.GetComponent<RectTransform>();
            safeRect.anchorMin = Vector2.zero;
            safeRect.anchorMax = Vector2.one;
            safeRect.offsetMin = Vector2.zero;
            safeRect.offsetMax = Vector2.zero;

            BuildReadabilityVeils(safe.transform);
            BuildUi(safe.transform, font);

            reducedMotion =
                PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1 ||
                PlayerPrefs.GetInt("reduce_motion", 0) == 1;

            loadingRoutine = StartCoroutine(LoadAllLayers());
        }

        private void BuildReadabilityVeils(Transform parent)
        {
            var topVeil = U46ScreenFactory.Panel(
                parent,
                "TopReadabilityVeil",
                new Vector2(0f, .72f),
                Vector2.one,
                null,
                new Color(.01f, .015f, .055f, .30f));
            topVeil.GetComponent<Image>().raycastTarget = false;

            var bottomVeil = U46ScreenFactory.Panel(
                parent,
                "BottomReadabilityVeil",
                Vector2.zero,
                new Vector2(1f, .27f),
                null,
                new Color(.012f, .012f, .032f, .48f));
            bottomVeil.GetComponent<Image>().raycastTarget = false;
        }

        private void BuildUi(Transform parent, TMP_FontAsset font)
        {
            titleRoot = CreateRect(parent, "TitleGroup", new Vector2(.06f, .78f), new Vector2(.94f, .965f));

            var title = U46ScreenFactory.Label(
                titleRoot,
                "Title",
                "ヨルノシルベ",
                31f,
                new Color(.96f, .89f, .72f, 1f),
                new Vector2(0f, .48f),
                Vector2.one,
                TextAlignmentOptions.Center,
                font);
            title.fontStyle = FontStyles.Bold;
            title.enableVertexGradient = true;
            title.colorGradient = new VertexGradient(
                new Color(.99f, .94f, .80f, 1f),
                new Color(.99f, .94f, .80f, 1f),
                new Color(.77f, .61f, .38f, 1f),
                new Color(.77f, .61f, .38f, 1f));
            title.raycastTarget = false;

            var subtitle = U46ScreenFactory.Label(
                titleRoot,
                "Subtitle",
                "忘れられたものたちの夜",
                13f,
                new Color(.86f, .87f, .96f, .92f),
                new Vector2(0f, .19f),
                new Vector2(1f, .54f),
                TextAlignmentOptions.Center,
                font);
            subtitle.raycastTarget = false;

            var ambient = U46ScreenFactory.Label(
                parent,
                "AmbientCopy",
                "火のそばで、夜はゆっくり息をする。",
                12f,
                new Color(.90f, .88f, .82f, .86f),
                new Vector2(.08f, .205f),
                new Vector2(.92f, .252f),
                TextAlignmentOptions.Center,
                font);
            ambient.raycastTarget = false;

            U46ScreenFactory.Button(
                parent,
                "OpenStageSelectButton",
                "夜へ出る",
                AppQualityAssetProvider.PaperButtonFrame,
                new Vector2(.12f, .095f),
                new Vector2(.88f, .18f),
                font,
                OpenStageSelect);

            U46ScreenFactory.Button(
                parent,
                "OpenCollectionFromTopButton",
                "灯録",
                AppQualityAssetProvider.PaperButtonFrame,
                new Vector2(.31f, .025f),
                new Vector2(.69f, .082f),
                font,
                OpenCollection);

            statusLabel = U46ScreenFactory.Label(
                parent,
                "TopLoadStatus",
                "夜景を整えています…",
                11f,
                new Color(.83f, .79f, .72f, .78f),
                new Vector2(.08f, .002f),
                new Vector2(.92f, .026f),
                TextAlignmentOptions.Center,
                font);
            statusLabel.raycastTarget = false;
        }

        private IEnumerator LoadAllLayers()
        {
            foreach (var spec in FullCanvasLayers)
            {
                var target = FindRawImage(spec.Name);
                yield return LoadTexture(spec.File, texture => target.texture = texture);
            }

            yield return LoadTexture("10-fire-flipbook-atlas.png", texture =>
            {
                fireAtlas.texture = texture;
                fireAtlas.uvRect = AtlasCell(0, 4, 3);
            });

            yield return LoadTexture("12-smoke-atlas.png", BuildSmokeParticles);
            yield return LoadTexture("13-embers-atlas.png", BuildEmberParticles);

            loadingRoutine = null;
            if (statusLabel != null)
            {
                statusLabel.text = failedLayerCount == 0
                    ? string.Empty
                    : $"夜景素材 {failedLayerCount} 点を読み込めませんでした";
            }
        }

        private IEnumerator LoadTexture(string fileName, Action<Texture2D> onLoaded)
        {
            var uri = ResolveLayerUri(fileName);
            using (var request = UnityWebRequestTexture.GetTexture(uri, true))
            {
                yield return request.SendWebRequest();

                if (request.result != UnityWebRequest.Result.Success)
                {
                    failedLayerCount++;
                    Debug.LogWarning($"TopLivingNight: failed to load {fileName}: {request.error}");
                    yield break;
                }

                var texture = DownloadHandlerTexture.GetContent(request);
                texture.name = $"TopLivingNight_{Path.GetFileNameWithoutExtension(fileName)}";
                texture.wrapMode = TextureWrapMode.Clamp;
                texture.filterMode = FilterMode.Bilinear;
                ownedTextures.Add(texture);
                onLoaded?.Invoke(texture);
            }
        }

        private void BuildSmokeParticles(Texture2D texture)
        {
            var origins = new[]
            {
                new Vector2(-34f, -206f),
                new Vector2(2f, -196f),
                new Vector2(28f, -214f),
                new Vector2(-8f, -224f),
            };

            for (var i = 0; i < origins.Length; i++)
            {
                var image = CreateRawLayer(artRoot, $"Smoke_{i + 1:00}", .22f, fullCanvas: false);
                image.texture = texture;
                image.uvRect = AtlasCell(i % 6, 3, 2);
                image.color = new Color(.70f, .72f, .80f, .20f);
                ConfigureCenteredBox(image.rectTransform, origins[i], new Vector2(86f + i * 8f, 124f + i * 10f));
                if (foregroundTransform != null)
                    image.transform.SetSiblingIndex(foregroundTransform.GetSiblingIndex());
                smokeParticles.Add(new AtlasParticle(
                    image,
                    origins[i],
                    4.8f + i * 1.05f,
                    .17f + i * .23f,
                    38f + i * 7f));
            }
        }

        private void BuildEmberParticles(Texture2D texture)
        {
            for (var i = 0; i < 10; i++)
            {
                var image = CreateRawLayer(artRoot, $"Ember_{i + 1:00}", .7f, fullCanvas: false);
                image.texture = texture;
                image.uvRect = AtlasCell(i % 8, 4, 2);
                image.color = new Color(1f, .67f, .28f, .72f);
                var origin = new Vector2(-28f + (i % 5) * 14f, -246f + (i % 3) * 8f);
                ConfigureCenteredBox(image.rectTransform, origin, new Vector2(9f, 9f));
                if (foregroundTransform != null)
                    image.transform.SetSiblingIndex(foregroundTransform.GetSiblingIndex());
                emberParticles.Add(new AtlasParticle(
                    image,
                    origin,
                    2.6f + (i % 4) * .44f,
                    .09f * i,
                    76f + (i % 5) * 12f));
            }
        }

        private void Update()
        {
            if (openStageSelect == null || !isActiveAndEnabled) return;

            var time = Time.unscaledTime;
            var delta = Time.unscaledDeltaTime;

            AnimateTitle(time);
            AnimateSky(time);
            AnimateLightMasks(time);
            AnimateFire(time, delta);
            AnimateAtlasParticles(time);
        }

        private void AnimateTitle(float time)
        {
            if (titleRoot == null) return;
            titleRoot.anchoredPosition = new Vector2(0f, Mathf.Sin(time * .52f) * 1.2f);
        }

        private void AnimateSky(float time)
        {
            if (farCloudsRect != null)
                farCloudsRect.anchoredPosition = reducedMotion
                    ? Vector2.zero
                    : new Vector2(Mathf.Sin(time * .113f) * 2.8f, 0f);

            if (nearCloudsRect != null)
                nearCloudsRect.anchoredPosition = reducedMotion
                    ? Vector2.zero
                    : new Vector2(Mathf.Sin(time * .197f + 1.7f) * 5.2f, 0f);

            if (stars != null)
            {
                var starNoise = Mathf.PerlinNoise(.17f, time * .082f);
                stars.color = WithAlpha(stars.color, reducedMotion ? .62f : .57f + starNoise * .16f);
            }
        }

        private void AnimateLightMasks(float time)
        {
            if (distantLights != null)
            {
                var stationNoise = Mathf.PerlinNoise(2.31f, time * .071f);
                distantLights.color = WithAlpha(distantLights.color, .64f + (stationNoise - .5f) * .06f);
            }

            if (fireGlow != null)
            {
                var glowA = Mathf.PerlinNoise(5.13f, time * .83f);
                var glowB = Mathf.PerlinNoise(9.71f, time * 1.67f);
                var amplitude = reducedMotion ? .02f : .10f;
                fireGlow.color = WithAlpha(fireGlow.color, .56f + ((glowA * .62f + glowB * .38f) - .5f) * amplitude);
            }

            if (lanternGlow != null)
            {
                var lanternNoise = Mathf.PerlinNoise(12.7f, time * .19f);
                lanternGlow.color = WithAlpha(lanternGlow.color, .46f + (lanternNoise - .5f) * .045f);
            }

            if (robotEye != null)
            {
                var phase = Mathf.Repeat(time + 11.7f, 47f);
                var rareScan = reducedMotion || phase > 1.35f
                    ? 0f
                    : Mathf.Sin((phase / 1.35f) * Mathf.PI);
                robotEye.color = WithAlpha(robotEye.color, .20f + rareScan * .62f);
            }
        }

        private void AnimateFire(float time, float delta)
        {
            if (fireAtlas == null || fireAtlas.texture == null) return;

            fireTimer += delta;
            var interval = reducedMotion ? .25f : .105f + Mathf.PerlinNoise(4.2f, time * .23f) * .018f;
            if (fireTimer < interval) return;

            fireTimer -= interval;
            var shouldHold = !reducedMotion && Mathf.PerlinNoise(7.9f, fireStep * .173f) > .77f;
            fireStep++;

            if (!shouldHold)
            {
                fireFrame += fireDirection;
                if (fireFrame >= 11)
                {
                    fireFrame = 11;
                    fireDirection = -1;
                }
                else if (fireFrame <= 0)
                {
                    fireFrame = 0;
                    fireDirection = 1;
                }
            }

            fireAtlas.uvRect = AtlasCell(fireFrame, 4, 3);
        }

        private void AnimateAtlasParticles(float time)
        {
            foreach (var particle in smokeParticles)
            {
                var cycle = Mathf.Repeat(time * .16f + particle.Phase, 1f);
                var drift = Mathf.Sin((time + particle.Phase * 9f) * .73f) * 13f;
                particle.Rect.anchoredPosition = particle.Origin + new Vector2(drift, cycle * particle.Rise);
                particle.Rect.localScale = Vector3.one * Mathf.Lerp(.78f, 1.28f, cycle);
                particle.Image.color = WithAlpha(
                    particle.Image.color,
                    reducedMotion ? 0f : Mathf.Sin(cycle * Mathf.PI) * .19f);
            }

            foreach (var particle in emberParticles)
            {
                var cycle = Mathf.Repeat(time / particle.Duration + particle.Phase, 1f);
                var drift = Mathf.Sin((time + particle.Phase * 17f) * 1.91f) * 11f;
                particle.Rect.anchoredPosition = particle.Origin + new Vector2(drift, cycle * particle.Rise);
                var alpha = reducedMotion ? 0f : Mathf.Sin(cycle * Mathf.PI) * .78f;
                particle.Image.color = WithAlpha(particle.Image.color, alpha);
                var size = Mathf.Lerp(.65f, 1.15f, 1f - cycle);
                particle.Rect.localScale = Vector3.one * size;
            }
        }

        private void OpenStageSelect()
        {
            openStageSelect?.Invoke();
        }

        private void OpenCollection()
        {
            openCollection?.Invoke();
        }

        private RawImage FindRawImage(string name)
        {
            var target = artRoot.Find(name);
            return target != null ? target.GetComponent<RawImage>() : null;
        }

        private void CaptureMotionReference(string name, RawImage image)
        {
            switch (name)
            {
                case "Stars":
                    stars = image;
                    break;
                case "CloudsFar":
                    farCloudsRect = image.rectTransform;
                    break;
                case "CloudsNear":
                    nearCloudsRect = image.rectTransform;
                    break;
                case "DistantLights":
                    distantLights = image;
                    break;
                case "RobotEye":
                    robotEye = image;
                    break;
                case "FireGlow":
                    fireGlow = image;
                    break;
                case "Foreground":
                    foregroundTransform = image.transform;
                    break;
                case "LanternGlow":
                    lanternGlow = image;
                    break;
            }
        }

        private static RectTransform CreateRect(Transform parent, string name, Vector2 min, Vector2 max)
        {
            var obj = new GameObject(name, typeof(RectTransform));
            obj.transform.SetParent(parent, false);
            var rect = obj.GetComponent<RectTransform>();
            rect.anchorMin = min;
            rect.anchorMax = max;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
            return rect;
        }

        private static RawImage CreateRawLayer(
            Transform parent,
            string name,
            float alpha,
            bool fullCanvas = true)
        {
            var obj = new GameObject(name, typeof(RectTransform), typeof(RawImage));
            obj.transform.SetParent(parent, false);
            var rect = obj.GetComponent<RectTransform>();
            if (fullCanvas)
            {
                rect.anchorMin = Vector2.zero;
                rect.anchorMax = Vector2.one;
                rect.offsetMin = Vector2.zero;
                rect.offsetMax = Vector2.zero;
            }

            var image = obj.GetComponent<RawImage>();
            image.raycastTarget = false;
            image.color = new Color(1f, 1f, 1f, alpha);
            return image;
        }

        private static void ConfigureBox(RectTransform rect, Vector2 normalizedAnchor, Vector2 size)
        {
            rect.anchorMin = normalizedAnchor;
            rect.anchorMax = normalizedAnchor;
            rect.pivot = new Vector2(.5f, .5f);
            rect.sizeDelta = size;
            rect.anchoredPosition = Vector2.zero;
        }

        private static void ConfigureCenteredBox(RectTransform rect, Vector2 position, Vector2 size)
        {
            rect.anchorMin = new Vector2(.5f, .5f);
            rect.anchorMax = new Vector2(.5f, .5f);
            rect.pivot = new Vector2(.5f, .5f);
            rect.sizeDelta = size;
            rect.anchoredPosition = position;
        }

        private static Rect AtlasCell(int index, int columns, int rows)
        {
            var column = index % columns;
            var rowFromTop = index / columns;
            var width = 1f / columns;
            var height = 1f / rows;
            var y = (rows - 1 - rowFromTop) * height;
            return new Rect(column * width, y, width, height);
        }

        private static Color WithAlpha(Color color, float alpha)
        {
            color.a = Mathf.Clamp01(alpha);
            return color;
        }

        private static string ResolveLayerUri(string fileName)
        {
#if UNITY_EDITOR
            var repoRoot = Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
            var source = Path.Combine(repoRoot, LayerRelativeRoot, fileName);
#else
            var source = Path.Combine(Application.streamingAssetsPath, StreamingRoot, fileName);
#endif
            if (source.Contains("://", StringComparison.Ordinal)) return source;
            return new Uri(source).AbsoluteUri;
        }

        private void OnDisable()
        {
            fireTimer = 0f;
        }

        private void OnDestroy()
        {
            if (loadingRoutine != null) StopCoroutine(loadingRoutine);
            foreach (var texture in ownedTextures)
                if (texture != null) Destroy(texture);
            ownedTextures.Clear();
            smokeParticles.Clear();
            emberParticles.Clear();
            openStageSelect = null;
            openCollection = null;
        }

        private readonly struct LayerSpec
        {
            public LayerSpec(string name, string file, float alpha)
            {
                Name = name;
                File = file;
                Alpha = alpha;
            }

            public string Name { get; }
            public string File { get; }
            public float Alpha { get; }
        }

        private sealed class AtlasParticle
        {
            public AtlasParticle(RawImage image, Vector2 origin, float duration, float phase, float rise)
            {
                Image = image;
                Rect = image.rectTransform;
                Origin = origin;
                Duration = duration;
                Phase = phase;
                Rise = rise;
            }

            public RawImage Image { get; }
            public RectTransform Rect { get; }
            public Vector2 Origin { get; }
            public float Duration { get; }
            public float Phase { get; }
            public float Rise { get; }
        }
    }
}
