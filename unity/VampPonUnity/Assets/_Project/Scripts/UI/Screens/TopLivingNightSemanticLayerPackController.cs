using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    // Final Core5 runtime path. The approved composite remains the art-direction
    // authority, while production rendering reconstructs the scene from a small
    // semantic layer pack whose bytes are bound to the exact final candidate.
    [DefaultExecutionOrder(-880)]
    public sealed class TopLivingNightSemanticLayerPackController : MonoBehaviour
    {
        private const float SearchInterval = .10f;
        private const float PreferencePollInterval = .50f;
        private const string PlayerRoot = "TopLivingNightV3SemanticGenerated";
        private const string PlayerReadyMarker = PlayerRoot + "/pack-ready";
        private const string EditorLayerRootRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final/layers";
        private const string EditorFinalStatusRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final-art-status.json";
        private const string EditorManifestRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final/semantic-layer-pack.json";

        private static readonly LayerSpec[] LayerSpecs =
        {
            new("SemanticEnvironment", "00-environment-base.png", "environment-base"),
            new("SemanticDistantTown", "04-distant-town.png", "distant-town"),
            new("SemanticCore5", "06-core5.png", "core5"),
            new("SemanticAnimalRobot", "07-animal-robot.png", "animal-robot"),
            new("SemanticFireBase", "09-fire-base.png", "fire-base"),
            new("SemanticForeground", "15-foreground-accents.png", "foreground-accents"),
        };

        private static readonly string[] LegacyStaticLayers =
        {
            "Environment",
            "Moon",
            "DistantCompanion",
            "Characters",
            "FireBase",
            "AnimalRobot",
            "Foreground",
        };

        private static TopLivingNightSemanticLayerPackController instance;

        private readonly Dictionary<string, RawImage> layers = new(StringComparer.Ordinal);
        private readonly List<Texture2D> ownedEditorTextures = new();
        private readonly List<Texture2D> loadedResourceTextures = new();
        private readonly Dictionary<string, Vector2> basePositions = new(StringComparer.Ordinal);

        private TopLivingNightView top;
        private RectTransform artRoot;
        private float nextSearchAt;
        private float nextPreferencePollAt;
        private bool reducedMotion;
        private bool activationAttempted;
        private bool wasTopActive;

        public static bool IsSemanticPackReady { get; private set; }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (instance != null)
                return;

            instance = FindFirstObjectByType<TopLivingNightSemanticLayerPackController>();
            if (instance != null)
                return;

            var controller = new GameObject(
                "TopLivingNightSemanticLayerPackController",
                typeof(TopLivingNightSemanticLayerPackController));
            DontDestroyOnLoad(controller);
            instance = controller.GetComponent<TopLivingNightSemanticLayerPackController>();
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
            RefreshReducedMotion();
        }

        private void Update()
        {
            var time = Time.unscaledTime;
            if (time >= nextSearchAt)
            {
                nextSearchAt = time + SearchInterval;
                var current = FindFirstObjectByType<TopLivingNightView>();
                if (current != top)
                    Bind(current);
            }

            if (time >= nextPreferencePollAt)
            {
                nextPreferencePollAt = time + PreferencePollInterval;
                RefreshReducedMotion();
            }

            if (top == null)
                return;

            var isTopActive = top.isActiveAndEnabled && top.gameObject.activeInHierarchy;
            if (!isTopActive)
            {
                if (wasTopActive || IsSemanticPackReady)
                {
                    ReleasePackVisuals(restoreFlattenedFallback: true);
                    activationAttempted = false;
                }
                wasTopActive = false;
                return;
            }

            if (!wasTopActive)
            {
                wasTopActive = true;
                activationAttempted = false;
                if (artRoot == null)
                    artRoot = FindChild(top.transform, "TopLivingNightArt") as RectTransform;
            }

            if (!activationAttempted)
            {
                activationAttempted = true;
                TryActivateSemanticPack();
            }

            if (!IsSemanticPackReady)
                return;

            ApplyDepthMotion(time);
        }

        private void Bind(TopLivingNightView current)
        {
            ReleasePackVisuals(restoreFlattenedFallback: true);
            top = current;
            activationAttempted = false;
            wasTopActive = false;
            artRoot = top == null ? null : FindChild(top.transform, "TopLivingNightArt") as RectTransform;
        }

        private void TryActivateSemanticPack()
        {
            if (artRoot == null || !ShouldUseFinalSemanticPack())
                return;

            foreach (var spec in LayerSpecs)
            {
                var texture = LoadLayerTexture(spec);
                if (texture == null)
                {
                    ReleasePackVisuals(restoreFlattenedFallback: true);
                    Debug.LogWarning(
                        $"TOP semantic layer pack: required layer unavailable: {spec.EditorFileName}");
                    return;
                }

                var image = GetOrCreateLayer(spec);
                image.texture = texture;
                image.color = Color.white;
                image.gameObject.SetActive(true);
                basePositions[spec.RuntimeName] = image.rectTransform.anchoredPosition;
            }

            PositionSemanticLayers();
            HideFlattenedAndLegacyStaticLayers();
            IsSemanticPackReady = true;
            Debug.Log(
                "TOP semantic layer pack: final Core5 scene reconstructed from candidate-bound environment/town/Core5/animal-robot/fire/foreground layers.");
        }

        private bool ShouldUseFinalSemanticPack()
        {
#if UNITY_EDITOR
            try
            {
                var root = RepositoryRoot();
                var statusPath = Path.Combine(
                    root,
                    EditorFinalStatusRelativePath.Replace('/', Path.DirectorySeparatorChar));
                var manifestPath = Path.Combine(
                    root,
                    EditorManifestRelativePath.Replace('/', Path.DirectorySeparatorChar));
                if (!File.Exists(statusPath) || !File.Exists(manifestPath))
                    return false;

                var status = JsonUtility.FromJson<FinalArtStatus>(File.ReadAllText(statusPath));
                var manifest = JsonUtility.FromJson<SemanticPackManifest>(File.ReadAllText(manifestPath));
                if (status == null || manifest == null ||
                    status.schemaVersion != 1 || manifest.schemaVersion != 1 ||
                    !status.candidateGenerated ||
                    !IsLowerHexSha256(status.candidateSha256) ||
                    !string.Equals(status.candidateSha256, manifest.candidateSha256, StringComparison.Ordinal) ||
                    !string.Equals(
                        status.candidateCore5ReferenceSetSha256,
                        manifest.core5ReferenceSetSha256,
                        StringComparison.Ordinal) ||
                    manifest.layerCount != LayerSpecs.Length ||
                    manifest.layers == null || manifest.layers.Length != LayerSpecs.Length)
                    return false;

                var layerRoot = Path.Combine(
                    root,
                    EditorLayerRootRelativePath.Replace('/', Path.DirectorySeparatorChar));
                var fingerprint = new StringBuilder();
                fingerprint.Append("candidate=").Append(manifest.candidateSha256).Append('\n');
                fingerprint.Append("core5=").Append(manifest.core5ReferenceSetSha256);

                foreach (var spec in LayerSpecs)
                {
                    var record = FindManifestLayer(manifest, spec.EditorFileName);
                    var path = Path.Combine(layerRoot, spec.EditorFileName);
                    if (record == null || !File.Exists(path) || !IsLowerHexSha256(record.sha256))
                        return false;
                    var actualSha = ComputeSha256(path);
                    if (!string.Equals(actualSha, record.sha256, StringComparison.Ordinal))
                        return false;
                    fingerprint.Append('\n').Append(spec.EditorFileName).Append(':').Append(record.sha256);
                }

                var packSha = ComputeSha256(Encoding.UTF8.GetBytes(fingerprint.ToString()));
                return IsLowerHexSha256(manifest.packSha256) &&
                    string.Equals(packSha, manifest.packSha256, StringComparison.Ordinal) &&
                    manifest.runtimePolicy != null &&
                    manifest.runtimePolicy.representation == "semantic-2.5d-layer-pack" &&
                    !manifest.runtimePolicy.flattenedFinalFallbackAllowed;
            }
            catch (Exception exception)
            {
                Debug.LogWarning(
                    $"TOP semantic layer pack: editor authority check failed: {exception.Message}");
                return false;
            }
#else
            var marker = Resources.Load<TextAsset>(PlayerReadyMarker);
            if (marker == null)
                return false;
            var ready = string.Equals(marker.text.Trim(), "final-core5-layered", StringComparison.Ordinal);
            Resources.UnloadAsset(marker);
            return ready;
#endif
        }

        private Texture2D LoadLayerTexture(LayerSpec spec)
        {
#if UNITY_EDITOR
            var path = Path.Combine(
                RepositoryRoot(),
                EditorLayerRootRelativePath.Replace('/', Path.DirectorySeparatorChar),
                spec.EditorFileName);
            if (!File.Exists(path))
                return null;

            var texture = new Texture2D(2, 2, TextureFormat.RGBA32, false);
            if (!texture.LoadImage(File.ReadAllBytes(path), true))
            {
                Destroy(texture);
                return null;
            }
            texture.name = $"TopLivingNightSemantic_{spec.ResourceName}_Editor";
            texture.wrapMode = TextureWrapMode.Clamp;
            texture.filterMode = FilterMode.Bilinear;
            ownedEditorTextures.Add(texture);
            return texture;
#else
            var texture = Resources.Load<Texture2D>($"{PlayerRoot}/{spec.ResourceName}");
            if (texture != null)
                loadedResourceTextures.Add(texture);
            return texture;
#endif
        }

        private RawImage GetOrCreateLayer(LayerSpec spec)
        {
            var existing = FindChild(artRoot, spec.RuntimeName);
            GameObject layerObject;
            if (existing != null)
            {
                layerObject = existing.gameObject;
            }
            else
            {
                layerObject = new GameObject(
                    spec.RuntimeName,
                    typeof(RectTransform),
                    typeof(RawImage),
                    typeof(AspectRatioFitter));
                layerObject.transform.SetParent(artRoot, false);
            }

            var rect = layerObject.GetComponent<RectTransform>();
            rect.anchorMin = new Vector2(.5f, .5f);
            rect.anchorMax = new Vector2(.5f, .5f);
            rect.pivot = new Vector2(.5f, .5f);
            rect.anchoredPosition = Vector2.zero;
            rect.sizeDelta = Vector2.one;

            var fitter = layerObject.GetComponent<AspectRatioFitter>();
            fitter.aspectMode = AspectRatioFitter.AspectMode.EnvelopeParent;
            fitter.aspectRatio = 430f / 932f;

            var image = layerObject.GetComponent<RawImage>();
            image.raycastTarget = false;
            layers[spec.RuntimeName] = image;
            return image;
        }

        private void PositionSemanticLayers()
        {
            SetBefore("SemanticEnvironment", "Stars");
            SetAfter("SemanticDistantTown", "CloudsNear");
            SetAfter("SemanticCore5", "DistantLights");
            SetAfter("SemanticAnimalRobot", "SemanticCore5");
            SetBefore("SemanticFireBase", "FireFlipbook");
            SetBefore("SemanticForeground", "LanternGlow");
        }

        private void HideFlattenedAndLegacyStaticLayers()
        {
            var baseComposite = FindChild(artRoot, "BaseComposite");
            if (baseComposite != null)
                baseComposite.gameObject.SetActive(false);

            foreach (var layerName in LegacyStaticLayers)
            {
                var layer = FindChild(artRoot, layerName);
                if (layer != null)
                    layer.gameObject.SetActive(false);
            }
        }

        private void RestoreFlattenedFallback()
        {
            if (artRoot == null)
                return;

            var baseComposite = FindChild(artRoot, "BaseComposite");
            if (baseComposite != null)
                baseComposite.gameObject.SetActive(true);
        }

        private void ApplyDepthMotion(float time)
        {
            ApplyMotion("SemanticDistantTown", time, .8f, .35f, .021f, .017f, 11.3f);
            ApplyMotion("SemanticCore5", time, .38f, .22f, .019f, .014f, 21.7f);
            ApplyMotion("SemanticAnimalRobot", time, .55f, .30f, .027f, .018f, 31.1f);
            ApplyMotion("SemanticFireBase", time, .20f, .14f, .041f, .029f, 41.9f);
            ApplyMotion("SemanticForeground", time, 2.6f, 1.0f, .033f, .024f, 51.7f);
        }

        private void ApplyMotion(
            string layerName,
            float time,
            float xAmplitude,
            float yAmplitude,
            float xFrequency,
            float yFrequency,
            float seed)
        {
            if (!layers.TryGetValue(layerName, out var image) || image == null)
                return;
            if (!basePositions.TryGetValue(layerName, out var basePosition))
                basePosition = Vector2.zero;

            if (reducedMotion)
            {
                image.rectTransform.anchoredPosition = basePosition;
                return;
            }

            var x = (Mathf.PerlinNoise(seed, time * xFrequency) - .5f) * 2f * xAmplitude;
            var y = (Mathf.PerlinNoise(seed + 7.31f, time * yFrequency) - .5f) * 2f * yAmplitude;
            image.rectTransform.anchoredPosition = basePosition + new Vector2(x, y);
        }

        private void SetBefore(string movingName, string anchorName)
        {
            var moving = FindChild(artRoot, movingName);
            var anchor = FindChild(artRoot, anchorName);
            if (moving == null || anchor == null)
                return;
            moving.SetSiblingIndex(Mathf.Max(0, anchor.GetSiblingIndex()));
        }

        private void SetAfter(string movingName, string anchorName)
        {
            var moving = FindChild(artRoot, movingName);
            var anchor = FindChild(artRoot, anchorName);
            if (moving == null || anchor == null)
                return;
            moving.SetSiblingIndex(Mathf.Min(artRoot.childCount - 1, anchor.GetSiblingIndex() + 1));
        }

        private void RefreshReducedMotion()
        {
            reducedMotion =
                PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1 ||
                PlayerPrefs.GetInt("reduce_motion", 0) == 1;
        }

        private void ReleasePackVisuals(bool restoreFlattenedFallback)
        {
            IsSemanticPackReady = false;

            foreach (var pair in layers)
            {
                if (pair.Value == null)
                    continue;
                pair.Value.rectTransform.anchoredPosition = Vector2.zero;
                pair.Value.texture = null;
                pair.Value.gameObject.SetActive(false);
            }
            layers.Clear();
            basePositions.Clear();

            foreach (var texture in ownedEditorTextures)
                if (texture != null)
                    Destroy(texture);
            ownedEditorTextures.Clear();

            foreach (var texture in loadedResourceTextures)
                if (texture != null)
                    Resources.UnloadAsset(texture);
            loadedResourceTextures.Clear();

            if (restoreFlattenedFallback)
                RestoreFlattenedFallback();
        }

        private void OnDestroy()
        {
            ReleasePackVisuals(restoreFlattenedFallback: true);
            top = null;
            artRoot = null;
            if (instance == this)
                instance = null;
        }

#if UNITY_EDITOR
        private static string RepositoryRoot()
        {
            return Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));
        }

        private static string ComputeSha256(string path)
        {
            using var stream = File.OpenRead(path);
            using var sha = SHA256.Create();
            return BytesToHex(sha.ComputeHash(stream));
        }

        private static string ComputeSha256(byte[] bytes)
        {
            using var sha = SHA256.Create();
            return BytesToHex(sha.ComputeHash(bytes));
        }

        private static string BytesToHex(byte[] hash)
        {
            var builder = new StringBuilder(hash.Length * 2);
            foreach (var value in hash)
                builder.Append(value.ToString("x2"));
            return builder.ToString();
        }

        private static bool IsLowerHexSha256(string value)
        {
            if (string.IsNullOrEmpty(value) || value.Length != 64)
                return false;
            foreach (var character in value)
                if (!((character >= '0' && character <= '9') ||
                      (character >= 'a' && character <= 'f')))
                    return false;
            return true;
        }

        private static SemanticPackLayer FindManifestLayer(
            SemanticPackManifest manifest,
            string fileName)
        {
            if (manifest?.layers == null)
                return null;
            foreach (var layer in manifest.layers)
                if (layer != null && string.Equals(layer.file, fileName, StringComparison.Ordinal))
                    return layer;
            return null;
        }
#endif

        private static Transform FindChild(Transform root, string name)
        {
            if (root == null)
                return null;
            return root
                .GetComponentsInChildren<Transform>(true)
                .FirstOrDefault(value => value.name == name);
        }

        [Serializable]
        private sealed class FinalArtStatus
        {
            public int schemaVersion;
            public bool candidateGenerated;
            public string candidateSha256;
            public string candidateCore5ReferenceSetSha256;
        }

        [Serializable]
        private sealed class SemanticPackManifest
        {
            public int schemaVersion;
            public string candidateSha256;
            public string core5ReferenceSetSha256;
            public int layerCount;
            public string packSha256;
            public SemanticPackLayer[] layers;
            public RuntimePolicy runtimePolicy;
        }

        [Serializable]
        private sealed class SemanticPackLayer
        {
            public string file;
            public string sha256;
        }

        [Serializable]
        private sealed class RuntimePolicy
        {
            public string representation;
            public bool flattenedFinalFallbackAllowed;
        }

        private readonly struct LayerSpec
        {
            public LayerSpec(
                string runtimeName,
                string editorFileName,
                string resourceName)
            {
                RuntimeName = runtimeName;
                EditorFileName = editorFileName;
                ResourceName = resourceName;
            }

            public string RuntimeName { get; }
            public string EditorFileName { get; }
            public string ResourceName { get; }
        }
    }
}
