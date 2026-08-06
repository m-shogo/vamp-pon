using System;
using System.Collections;
using System.IO;
using TMPro;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    public sealed class LoadingSeasonalView : MonoBehaviour
    {
        private const string LastArtIndexKey = "vamp_pon_loading_last_art_index";
        private const string CaptureArtIndexKey = "vamp_pon_loading_capture_art_index";
        private const string CaptureHoldKey = "vamp_pon_loading_capture_hold";
        private const float MinimumVisibleSeconds = 1.35f;
        private const float FadeSeconds = .28f;

        private static readonly LoadingArtSpec[] ArtSpecs =
        {
            new(
                "spring",
                "docs/design-targets/generated/loading-seasonal-v1/sources/loading-01-spring.png",
                "LoadingSeasonal/loading-01-spring"),
            new(
                "summer",
                "docs/design-targets/generated/loading-seasonal-v1/sources/loading-02-summer.png",
                "LoadingSeasonal/loading-02-summer"),
            new(
                "autumn",
                "docs/design-targets/generated/loading-seasonal-v1/sources/loading-03-autumn.png",
                "LoadingSeasonal/loading-03-autumn"),
            new(
                "winter",
                "docs/design-targets/generated/loading-seasonal-v1/sources/loading-04-winter.png",
                "LoadingSeasonal/loading-04-winter"),
        };

        private Action completed;
        private CanvasGroup canvasGroup;
        private RawImage artwork;
        private AspectRatioFitter artworkFitter;
        private Image progressFill;
        private TextMeshProUGUI status;
        private Coroutine sequence;
        private Texture2D loadedTexture;
        private bool ownsTexture;
        private bool callbackSent;

        public int SelectedArtIndex { get; private set; }
        public string SelectedArtId =>
            SelectedArtIndex >= 0 && SelectedArtIndex < ArtSpecs.Length
                ? ArtSpecs[SelectedArtIndex].Id
                : string.Empty;

        public void Build(
            Transform parent,
            TMP_FontAsset font,
            Action onCompleted)
        {
            completed = onCompleted ?? throw new ArgumentNullException(nameof(onCompleted));
            transform.SetParent(parent, false);

            var root = gameObject.AddComponent<RectTransform>();
            Stretch(root, Vector2.zero, Vector2.one);
            canvasGroup = gameObject.AddComponent<CanvasGroup>();
            canvasGroup.alpha = 1f;
            canvasGroup.blocksRaycasts = true;
            canvasGroup.interactable = true;

            var backdrop = U46ScreenFactory.Panel(
                transform,
                "LoadingSeasonalBackdrop",
                Vector2.zero,
                Vector2.one,
                null,
                new Color(.008f, .011f, .032f, 1f));
            backdrop.GetComponent<Image>().raycastTarget = true;

            var artViewport = new GameObject(
                "LoadingSeasonalArtViewport",
                typeof(RectTransform),
                typeof(RectMask2D));
            artViewport.transform.SetParent(transform, false);
            Stretch(artViewport.GetComponent<RectTransform>(), Vector2.zero, Vector2.one);

            var artObject = new GameObject(
                "LoadingSeasonalArtwork",
                typeof(RectTransform),
                typeof(RawImage),
                typeof(AspectRatioFitter));
            artObject.transform.SetParent(artViewport.transform, false);
            var artRect = artObject.GetComponent<RectTransform>();
            artRect.anchorMin = new Vector2(.5f, .5f);
            artRect.anchorMax = new Vector2(.5f, .5f);
            artRect.pivot = new Vector2(.5f, .5f);
            artRect.anchoredPosition = Vector2.zero;
            artRect.sizeDelta = Vector2.one;

            artwork = artObject.GetComponent<RawImage>();
            artwork.raycastTarget = false;
            artwork.color = Color.white;
            artworkFitter = artObject.GetComponent<AspectRatioFitter>();
            artworkFitter.aspectMode = AspectRatioFitter.AspectMode.EnvelopeParent;
            artworkFitter.aspectRatio = 390f / 844f;

            var topVeil = U46ScreenFactory.Panel(
                transform,
                "LoadingSeasonalTopVeil",
                new Vector2(0f, .72f),
                Vector2.one,
                null,
                new Color(.006f, .008f, .027f, .18f));
            topVeil.GetComponent<Image>().raycastTarget = false;

            var bottomVeil = U46ScreenFactory.Panel(
                transform,
                "LoadingSeasonalBottomVeil",
                Vector2.zero,
                new Vector2(1f, .18f),
                null,
                new Color(.006f, .008f, .027f, .72f));
            bottomVeil.GetComponent<Image>().raycastTarget = false;

            var safe = new GameObject(
                "LoadingSeasonalSafeArea",
                typeof(RectTransform),
                typeof(VampPon.UnitySpike.UI.SafeAreaFitter));
            safe.transform.SetParent(transform, false);
            Stretch(safe.GetComponent<RectTransform>(), Vector2.zero, Vector2.one);

            var title = U46ScreenFactory.Label(
                safe.transform,
                "LoadingSeasonalTitle",
                "ヨルノシルベ",
                18f,
                new Color(.97f, .91f, .77f, .96f),
                new Vector2(.08f, .075f),
                new Vector2(.92f, .122f),
                TextAlignmentOptions.Center,
                font);
            title.fontStyle = FontStyles.Bold;
            title.raycastTarget = false;

            status = U46ScreenFactory.Label(
                safe.transform,
                "LoadingSeasonalStatus",
                "夜の記憶をひらいています…",
                11f,
                new Color(.88f, .89f, .96f, .86f),
                new Vector2(.08f, .041f),
                new Vector2(.92f, .074f),
                TextAlignmentOptions.Center,
                font);
            status.raycastTarget = false;

            var track = U46ScreenFactory.Panel(
                safe.transform,
                "LoadingSeasonalProgressTrack",
                new Vector2(.12f, .024f),
                new Vector2(.88f, .035f),
                null,
                new Color(.15f, .17f, .27f, .88f));
            track.GetComponent<Image>().raycastTarget = false;

            var fillObject = U46ScreenFactory.Panel(
                track.transform,
                "LoadingSeasonalProgressFill",
                Vector2.zero,
                Vector2.one,
                null,
                new Color(.83f, .70f, .42f, .96f));
            progressFill = fillObject.GetComponent<Image>();
            progressFill.raycastTarget = false;
            progressFill.type = Image.Type.Filled;
            progressFill.fillMethod = Image.FillMethod.Horizontal;
            progressFill.fillOrigin = 0;
            progressFill.fillAmount = 0f;

            SelectedArtIndex = ResolveSelectedArtIndex();
            PlayerPrefs.SetInt(LastArtIndexKey, SelectedArtIndex);
            PlayerPrefs.Save();

            sequence = StartCoroutine(RunSequence());
        }

        public static int SelectNonRepeatingIndex(
            int count,
            int previousIndex,
            int candidateIndex)
        {
            if (count <= 0)
                throw new ArgumentOutOfRangeException(nameof(count));
            if (count == 1)
                return 0;

            var normalized = Mathf.Abs(candidateIndex) % count;
            if (normalized == previousIndex)
                normalized = (normalized + 1) % count;
            return normalized;
        }

        public static void SetCaptureOverride(int artIndex, bool hold)
        {
#if UNITY_EDITOR
            PlayerPrefs.SetInt(CaptureArtIndexKey, Mathf.Clamp(artIndex, 0, ArtSpecs.Length - 1));
            PlayerPrefs.SetInt(CaptureHoldKey, hold ? 1 : 0);
            PlayerPrefs.Save();
#endif
        }

        public static void ClearCaptureOverride()
        {
#if UNITY_EDITOR
            PlayerPrefs.DeleteKey(CaptureArtIndexKey);
            PlayerPrefs.DeleteKey(CaptureHoldKey);
            PlayerPrefs.Save();
#endif
        }

        public static void ReleaseCaptureHold()
        {
#if UNITY_EDITOR
            PlayerPrefs.SetInt(CaptureHoldKey, 0);
            PlayerPrefs.Save();
#endif
        }

        private IEnumerator RunSequence()
        {
            var startedAt = Time.realtimeSinceStartup;
            yield return LoadSelectedTexture();

            while (Time.realtimeSinceStartup - startedAt < MinimumVisibleSeconds)
            {
                var elapsed = Time.realtimeSinceStartup - startedAt;
                if (progressFill != null)
                    progressFill.fillAmount = Mathf.Clamp01(elapsed / MinimumVisibleSeconds * .92f);
                yield return null;
            }

#if UNITY_EDITOR
            while (PlayerPrefs.GetInt(CaptureHoldKey, 0) == 1)
            {
                if (progressFill != null)
                    progressFill.fillAmount = 1f;
                if (status != null)
                    status.text = $"capture hold · {SelectedArtId}";
                yield return null;
            }
#endif

            if (progressFill != null)
                progressFill.fillAmount = 1f;

            var fadeStartedAt = Time.realtimeSinceStartup;
            while (Time.realtimeSinceStartup - fadeStartedAt < FadeSeconds)
            {
                var t = (Time.realtimeSinceStartup - fadeStartedAt) / FadeSeconds;
                if (canvasGroup != null)
                    canvasGroup.alpha = 1f - Mathf.SmoothStep(0f, 1f, t);
                yield return null;
            }

            sequence = null;
            SendCompleted();
        }

        private IEnumerator LoadSelectedTexture()
        {
            var spec = ArtSpecs[SelectedArtIndex];
#if UNITY_EDITOR
            var uri = ResolveEditorUri(spec.EditorRelativePath);
            using var request = UnityWebRequestTexture.GetTexture(uri, true);
            yield return request.SendWebRequest();
            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogWarning(
                    $"LoadingSeasonalView: failed to load {spec.Id}: {request.error}");
                yield break;
            }

            loadedTexture = DownloadHandlerTexture.GetContent(request);
            loadedTexture.name = $"LoadingSeasonal_{spec.Id}";
            loadedTexture.wrapMode = TextureWrapMode.Clamp;
            loadedTexture.filterMode = FilterMode.Bilinear;
            ownsTexture = true;
#else
            loadedTexture = Resources.Load<Texture2D>(spec.ResourcePath);
            ownsTexture = false;
            if (loadedTexture == null)
            {
                Debug.LogWarning(
                    $"LoadingSeasonalView: Resources/{spec.ResourcePath} was not found.");
                yield break;
            }
#endif

            if (artwork != null)
                artwork.texture = loadedTexture;
            if (artworkFitter != null && loadedTexture != null)
                artworkFitter.aspectRatio =
                    loadedTexture.width / (float)Mathf.Max(1, loadedTexture.height);
        }

        private int ResolveSelectedArtIndex()
        {
#if UNITY_EDITOR
            var commandLineOverride = ResolveCommandLineOverride();
            if (commandLineOverride >= 0)
                return commandLineOverride;

            if (PlayerPrefs.HasKey(CaptureArtIndexKey))
                return Mathf.Clamp(
                    PlayerPrefs.GetInt(CaptureArtIndexKey),
                    0,
                    ArtSpecs.Length - 1);
#endif

            var previous = PlayerPrefs.GetInt(LastArtIndexKey, -1);
            var candidate = UnityEngine.Random.Range(0, ArtSpecs.Length);
            return SelectNonRepeatingIndex(ArtSpecs.Length, previous, candidate);
        }

        private static int ResolveCommandLineOverride()
        {
            const string prefix = "-vampPonLoadingArt=";
            foreach (var argument in Environment.GetCommandLineArgs())
            {
                if (!argument.StartsWith(prefix, StringComparison.OrdinalIgnoreCase))
                    continue;
                if (int.TryParse(argument.Substring(prefix.Length), out var value))
                    return Mathf.Clamp(value, 0, ArtSpecs.Length - 1);
            }
            return -1;
        }

        private void SendCompleted()
        {
            if (callbackSent)
                return;
            callbackSent = true;
            completed?.Invoke();
        }

        private void OnDisable()
        {
            if (sequence != null)
            {
                StopCoroutine(sequence);
                sequence = null;
            }
            ReleaseTexture();
        }

        private void OnDestroy()
        {
            ReleaseTexture();
            completed = null;
        }

        private void ReleaseTexture()
        {
            if (artwork != null)
                artwork.texture = null;
            if (loadedTexture == null)
                return;

            if (ownsTexture)
                Destroy(loadedTexture);
            else
                Resources.UnloadAsset(loadedTexture);

            loadedTexture = null;
            ownsTexture = false;
        }

        private static string ResolveEditorUri(string relativePath)
        {
            var repositoryRoot = Path.GetFullPath(
                Path.Combine(Application.dataPath, "..", "..", ".."));
            return new Uri(
                Path.Combine(
                    repositoryRoot,
                    relativePath.Replace('/', Path.DirectorySeparatorChar)))
                .AbsoluteUri;
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

        private readonly struct LoadingArtSpec
        {
            public LoadingArtSpec(
                string id,
                string editorRelativePath,
                string resourcePath)
            {
                Id = id;
                EditorRelativePath = editorRelativePath;
                ResourcePath = resourcePath;
            }

            public string Id { get; }
            public string EditorRelativePath { get; }
            public string ResourcePath { get; }
        }
    }
}
