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
        private const string LayerRelativeRoot =
            "docs/design-targets/generated/top-living-night-v2/layers";
        private const string ResourceRoot = "TopLivingNight";

        private static readonly LayerDefinition[] BackLayers =
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
            new("RobotEye", "08-robot-eye-mask.png", .20f),
        };

        private static readonly LayerDefinition[] FrontLayers =
        {
            new("FireGlow", "11-fire-glow-mask.png", .56f),
            new("Foreground", "14-foreground-accents.png", 1f),
            new("LanternGlow", "14-lantern-glow-mask.png", .46f),
        };

        private readonly Dictionary<string, RawImage> layers =
            new(StringComparer.Ordinal);
        private readonly List<Texture2D> editorTextures = new();
        private readonly List<Texture2D> resourceTextures = new();
        private readonly List<ParticleView> smoke = new();
        private readonly List<ParticleView> embers = new();

        private Action openStageSelect;
        private Action openCollection;
        private RectTransform artRoot;
        private RectTransform titleRoot;
        private RawImage fire;
        private Transform foreground;
        private TextMeshProUGUI status;
        private Coroutine loadRoutine;
        private bool reducedMotion;
        private int loadFailures;
        private int fireFrame;
        private int fireDirection = 1;
        private int fireStep;
        private float fireTimer;

        public void Build(
            Transform parent,
            TMP_FontAsset font,
            Action onOpenStageSelect,
            Action onOpenCollection)
        {
            openStageSelect = onOpenStageSelect ??
                throw new ArgumentNullException(nameof(onOpenStageSelect));
            openCollection = onOpenCollection ??
                throw new ArgumentNullException(nameof(onOpenCollection));

            transform.SetParent(parent, false);
            var rootRect = gameObject.AddComponent<RectTransform>();
            Stretch(rootRect, Vector2.zero, Vector2.one);

            var blocker = U46ScreenFactory.Panel(
                transform,
                "TopLivingNightBlocker",
                Vector2.zero,
                Vector2.one,
                null,
                new Color(.014f, .018f, .055f, 1f));
            blocker.GetComponent<Image>().raycastTarget = true;

            artRoot = CreateRect(
                transform,
                "TopLivingNightArt",
                new Vector2(-.012f, -.006f),
                new Vector2(1.012f, 1.006f));

            foreach (var layer in BackLayers)
                CreateFullLayer(layer);

            fire = CreateRawImage(artRoot, "FireFlipbook", 1f, false);
            ConfigureAnchoredBox(
                fire.rectTransform,
                new Vector2(.5f, .245f),
                new Vector2(150f, 126f));
            fire.uvRect = AtlasCell(0, 4, 3);

            foreach (var layer in FrontLayers)
                CreateFullLayer(layer);
            foreground = layers["Foreground"].transform;

            var safe = new GameObject(
                "TopLivingNightSafeArea",
                typeof(RectTransform),
                typeof(VampPon.UnitySpike.UI.SafeAreaFitter));
            safe.transform.SetParent(transform, false);
            Stretch(safe.GetComponent<RectTransform>(), Vector2.zero, Vector2.one);

            BuildVeils(safe.transform);
            BuildUi(safe.transform, font);

            reducedMotion =
                PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1 ||
                PlayerPrefs.GetInt("reduce_motion", 0) == 1;
            loadRoutine = StartCoroutine(LoadAllTextures());
        }

        private void CreateFullLayer(LayerDefinition definition)
        {
            var image = CreateRawImage(
                artRoot,
                definition.Name,
                definition.Alpha,
                true);
            layers.Add(definition.Name, image);
        }

        private void BuildVeils(Transform parent)
        {
            var top = U46ScreenFactory.Panel(
                parent,
                "TopReadabilityVeil",
                new Vector2(0f, .72f),
                Vector2.one,
                null,
                new Color(.01f, .015f, .055f, .30f));
            top.GetComponent<Image>().raycastTarget = false;

            var bottom = U46ScreenFactory.Panel(
                parent,
                "BottomReadabilityVeil",
                Vector2.zero,
                new Vector2(1f, .27f),
                null,
                new Color(.012f, .012f, .032f, .48f));
            bottom.GetComponent<Image>().raycastTarget = false;
        }

        private void BuildUi(Transform parent, TMP_FontAsset font)
        {
            titleRoot = CreateRect(
                parent,
                "TitleGroup",
                new Vector2(.06f, .78f),
                new Vector2(.94f, .965f));

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
                () => openStageSelect?.Invoke());

            U46ScreenFactory.Button(
                parent,
                "OpenCollectionFromTopButton",
                "灯録",
                AppQualityAssetProvider.PaperButtonFrame,
                new Vector2(.31f, .025f),
                new Vector2(.69f, .082f),
                font,
                () => openCollection?.Invoke());

            status = U46ScreenFactory.Label(
                parent,
                "TopLoadStatus",
                "夜景を整えています…",
                11f,
                new Color(.83f, .79f, .72f, .78f),
                new Vector2(.08f, .002f),
                new Vector2(.92f, .026f),
                TextAlignmentOptions.Center,
                font);
            status.raycastTarget = false;
        }

        private IEnumerator LoadAllTextures()
        {
            foreach (var layer in BackLayers)
                yield return LoadTexture(
                    layer.File,
                    texture => layers[layer.Name].texture = texture);

            yield return LoadTexture(
                "10-fire-flipbook-atlas.png",
                texture => fire.texture = texture);

            foreach (var layer in FrontLayers)
                yield return LoadTexture(
                    layer.File,
                    texture => layers[layer.Name].texture = texture);

            yield return LoadTexture("12-smoke-atlas.png", BuildSmoke);
            yield return LoadTexture("13-embers-atlas.png", BuildEmbers);

            loadRoutine = null;
            if (status != null)
                status.text = loadFailures == 0
                    ? string.Empty
                    : $"夜景素材 {loadFailures} 点を読み込めませんでした";
        }

        private IEnumerator LoadTexture(
            string fileName,
            Action<Texture2D> onLoaded)
        {
#if UNITY_EDITOR
            var uri = ResolveEditorUri(fileName);
            using var request = UnityWebRequestTexture.GetTexture(uri, true);
            yield return request.SendWebRequest();
            if (request.result != UnityWebRequest.Result.Success)
            {
                loadFailures++;
                Debug.LogWarning(
                    $"TopLivingNight: failed to load {fileName}: {request.error}");
                yield break;
            }

            var editorTexture = DownloadHandlerTexture.GetContent(request);
            editorTexture.name =
                $"TopLivingNight_{Path.GetFileNameWithoutExtension(fileName)}";
            editorTexture.wrapMode = TextureWrapMode.Clamp;
            editorTexture.filterMode = FilterMode.Bilinear;
            editorTextures.Add(editorTexture);
            onLoaded?.Invoke(editorTexture);
#else
            var resourcePath =
                ResourceRoot + "/" + Path.GetFileNameWithoutExtension(fileName);
            var resourceTexture = Resources.Load<Texture2D>(resourcePath);
            if (resourceTexture == null)
            {
                loadFailures++;
                Debug.LogWarning(
                    $"TopLivingNight: failed to load Resources/{resourcePath}");
                yield break;
            }

            resourceTextures.Add(resourceTexture);
            onLoaded?.Invoke(resourceTexture);
            yield return null;
#endif
        }

        private void BuildSmoke(Texture2D atlas)
        {
            var origins = new[]
            {
                new Vector2(-34f, -206f),
                new Vector2(2f, -196f),
                new Vector2(28f, -214f),
                new Vector2(-8f, -224f),
            };

            for (var index = 0; index < origins.Length; index++)
            {
                var image = CreateRawImage(
                    artRoot,
                    $"Smoke_{index + 1:00}",
                    .20f,
                    false);
                image.texture = atlas;
                image.uvRect = AtlasCell(index % 6, 3, 2);
                image.color = new Color(.70f, .72f, .80f, .20f);
                ConfigureCenteredBox(
                    image.rectTransform,
                    origins[index],
                    new Vector2(86f + index * 8f, 124f + index * 10f));
                image.transform.SetSiblingIndex(foreground.GetSiblingIndex());
                smoke.Add(new ParticleView(
                    image,
                    origins[index],
                    4.8f + index * 1.05f,
                    .17f + index * .23f,
                    38f + index * 7f));
            }
        }

        private void BuildEmbers(Texture2D atlas)
        {
            for (var index = 0; index < 10; index++)
            {
                var image = CreateRawImage(
                    artRoot,
                    $"Ember_{index + 1:00}",
                    .72f,
                    false);
                image.texture = atlas;
                image.uvRect = AtlasCell(index % 8, 4, 2);
                image.color = new Color(1f, .67f, .28f, .72f);
                var origin = new Vector2(
                    -28f + index % 5 * 14f,
                    -246f + index % 3 * 8f);
                ConfigureCenteredBox(
                    image.rectTransform,
                    origin,
                    new Vector2(9f, 9f));
                image.transform.SetSiblingIndex(foreground.GetSiblingIndex());
                embers.Add(new ParticleView(
                    image,
                    origin,
                    2.6f + index % 4 * .44f,
                    .09f * index,
                    76f + index % 5 * 12f));
            }
        }

        private void Update()
        {
            if (!isActiveAndEnabled || openStageSelect == null)
                return;

            var time = Time.unscaledTime;
            AnimateTitle(time);
            AnimateSky(time);
            AnimateLights(time);
            AnimateFire(time, Time.unscaledDeltaTime);
            AnimateParticles(time);
        }

        private void AnimateTitle(float time)
        {
            if (titleRoot != null)
                titleRoot.anchoredPosition =
                    new Vector2(0f, Mathf.Sin(time * .52f) * 1.2f);
        }

        private void AnimateSky(float time)
        {
            if (layers.TryGetValue("CloudsFar", out var far))
                far.rectTransform.anchoredPosition = reducedMotion
                    ? Vector2.zero
                    : new Vector2(Mathf.Sin(time * .113f) * 2.8f, 0f);

            if (layers.TryGetValue("CloudsNear", out var near))
                near.rectTransform.anchoredPosition = reducedMotion
                    ? Vector2.zero
                    : new Vector2(Mathf.Sin(time * .197f + 1.7f) * 5.2f, 0f);

            if (layers.TryGetValue("Stars", out var stars))
            {
                var noise = Mathf.PerlinNoise(.17f, time * .082f);
                stars.color = WithAlpha(
                    stars.color,
                    reducedMotion ? .62f : .57f + noise * .16f);
            }
        }

        private void AnimateLights(float time)
        {
            if (layers.TryGetValue("DistantLights", out var distant))
            {
                var noise = Mathf.PerlinNoise(2.31f, time * .071f);
                distant.color = WithAlpha(
                    distant.color,
                    .64f + (noise - .5f) * .06f);
            }

            if (layers.TryGetValue("FireGlow", out var glow))
            {
                var first = Mathf.PerlinNoise(5.13f, time * .83f);
                var second = Mathf.PerlinNoise(9.71f, time * 1.67f);
                var amplitude = reducedMotion ? .02f : .10f;
                glow.color = WithAlpha(
                    glow.color,
                    .56f + ((first * .62f + second * .38f) - .5f) * amplitude);
            }

            if (layers.TryGetValue("LanternGlow", out var lantern))
            {
                var noise = Mathf.PerlinNoise(12.7f, time * .19f);
                lantern.color = WithAlpha(
                    lantern.color,
                    .46f + (noise - .5f) * .045f);
            }

            if (layers.TryGetValue("RobotEye", out var eye))
            {
                var phase = Mathf.Repeat(time + 11.7f, 47f);
                var rare = reducedMotion || phase > 1.35f
                    ? 0f
                    : Mathf.Sin(phase / 1.35f * Mathf.PI);
                eye.color = WithAlpha(eye.color, .20f + rare * .62f);
            }
        }

        private void AnimateFire(float time, float delta)
        {
            if (fire == null || fire.texture == null)
                return;

            fireTimer += delta;
            var interval = reducedMotion
                ? .25f
                : .105f + Mathf.PerlinNoise(4.2f, time * .23f) * .018f;
            if (fireTimer < interval)
                return;

            fireTimer -= interval;
            var hold =
                !reducedMotion &&
                Mathf.PerlinNoise(7.9f, fireStep * .173f) > .77f;
            fireStep++;

            if (!hold)
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

            fire.uvRect = AtlasCell(fireFrame, 4, 3);
        }

        private void AnimateParticles(float time)
        {
            foreach (var particle in smoke)
            {
                var cycle = Mathf.Repeat(time * .16f + particle.Phase, 1f);
                var drift =
                    Mathf.Sin((time + particle.Phase * 9f) * .73f) * 13f;
                particle.Rect.anchoredPosition =
                    particle.Origin + new Vector2(drift, cycle * particle.Rise);
                particle.Rect.localScale =
                    Vector3.one * Mathf.Lerp(.78f, 1.28f, cycle);
                particle.Image.color = WithAlpha(
                    particle.Image.color,
                    reducedMotion ? 0f : Mathf.Sin(cycle * Mathf.PI) * .19f);
            }

            foreach (var particle in embers)
            {
                var cycle = Mathf.Repeat(
                    time / particle.Duration + particle.Phase,
                    1f);
                var drift =
                    Mathf.Sin((time + particle.Phase * 17f) * 1.91f) * 11f;
                particle.Rect.anchoredPosition =
                    particle.Origin + new Vector2(drift, cycle * particle.Rise);
                particle.Image.color = WithAlpha(
                    particle.Image.color,
                    reducedMotion ? 0f : Mathf.Sin(cycle * Mathf.PI) * .78f);
                particle.Rect.localScale =
                    Vector3.one * Mathf.Lerp(.65f, 1.15f, 1f - cycle);
            }
        }

        private void OnDisable()
        {
            fireTimer = 0f;
            ReleaseTextures();
        }

        private void OnDestroy()
        {
            ReleaseTextures();
            openStageSelect = null;
            openCollection = null;
        }

        private void ReleaseTextures()
        {
            if (loadRoutine != null)
            {
                StopCoroutine(loadRoutine);
                loadRoutine = null;
            }

            foreach (var image in GetComponentsInChildren<RawImage>(true))
                image.texture = null;

            foreach (var texture in editorTextures)
                if (texture != null) Destroy(texture);
            editorTextures.Clear();

            foreach (var texture in resourceTextures)
                if (texture != null) Resources.UnloadAsset(texture);
            resourceTextures.Clear();

            smoke.Clear();
            embers.Clear();
            Resources.UnloadUnusedAssets();
        }

        private static string ResolveEditorUri(string fileName)
        {
            var repositoryRoot = Path.GetFullPath(
                Path.Combine(Application.dataPath, "..", "..", ".."));
            return new Uri(
                Path.Combine(repositoryRoot, LayerRelativeRoot, fileName))
                .AbsoluteUri;
        }

        private static RectTransform CreateRect(
            Transform parent,
            string name,
            Vector2 min,
            Vector2 max)
        {
            var gameObject = new GameObject(name, typeof(RectTransform));
            gameObject.transform.SetParent(parent, false);
            var rect = gameObject.GetComponent<RectTransform>();
            Stretch(rect, min, max);
            return rect;
        }

        private static RawImage CreateRawImage(
            Transform parent,
            string name,
            float alpha,
            bool fullCanvas)
        {
            var gameObject = new GameObject(
                name,
                typeof(RectTransform),
                typeof(RawImage));
            gameObject.transform.SetParent(parent, false);
            var rect = gameObject.GetComponent<RectTransform>();
            if (fullCanvas)
                Stretch(rect, Vector2.zero, Vector2.one);

            var image = gameObject.GetComponent<RawImage>();
            image.raycastTarget = false;
            image.color = new Color(1f, 1f, 1f, alpha);
            return image;
        }

        private static void Stretch(
            RectTransform rect,
            Vector2 min,
            Vector2 max)
        {
            rect.anchorMin = min;
            rect.anchorMax = max;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = Vector2.zero;
        }

        private static void ConfigureAnchoredBox(
            RectTransform rect,
            Vector2 anchor,
            Vector2 size)
        {
            rect.anchorMin = anchor;
            rect.anchorMax = anchor;
            rect.pivot = new Vector2(.5f, .5f);
            rect.sizeDelta = size;
            rect.anchoredPosition = Vector2.zero;
        }

        private static void ConfigureCenteredBox(
            RectTransform rect,
            Vector2 position,
            Vector2 size)
        {
            ConfigureAnchoredBox(rect, new Vector2(.5f, .5f), size);
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

        private readonly struct LayerDefinition
        {
            public LayerDefinition(string name, string file, float alpha)
            {
                Name = name;
                File = file;
                Alpha = alpha;
            }

            public string Name { get; }
            public string File { get; }
            public float Alpha { get; }
        }

        private sealed class ParticleView
        {
            public ParticleView(
                RawImage image,
                Vector2 origin,
                float duration,
                float phase,
                float rise)
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
