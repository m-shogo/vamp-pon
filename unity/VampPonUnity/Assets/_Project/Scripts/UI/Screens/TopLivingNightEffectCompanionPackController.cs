using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    // Replaces only the V2 motion/effect textures after the base TopLivingNightView
    // has created its existing RawImage/particle objects. Motion ownership remains
    // in the existing view/directors; this controller owns final-candidate texture
    // selection, provenance validation and texture lifecycle only.
    [DefaultExecutionOrder(-870)]
    public sealed class TopLivingNightEffectCompanionPackController : MonoBehaviour
    {
        private const float SearchInterval = .10f;
        private const string PlayerRoot = "TopLivingNightV3EffectsGenerated";
        private const string PlayerReadyMarker = PlayerRoot + "/pack-ready";
        private const string EditorEffectRootRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final/effects";
        private const string EditorFinalStatusRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final-art-status.json";
        private const string EditorManifestRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final/effect-companion-pack.json";

        private static readonly EffectSpec[] Effects =
        {
            new("Stars", "01-stars.png"),
            new("CloudsFar", "02-clouds-far.png"),
            new("CloudsNear", "03-clouds-near.png"),
            new("DistantLights", "05-distant-lights-mask.png"),
            new("RobotEye", "08-robot-eye-mask.png"),
            new("FireFlipbook", "10-fire-flipbook-atlas.png"),
            new("FireGlow", "11-fire-glow-mask.png"),
            new("SmokeAtlas", "12-smoke-atlas.png"),
            new("EmbersAtlas", "13-embers-atlas.png"),
            new("LanternGlow", "14-lantern-glow-mask.png"),
        };

        private static TopLivingNightEffectCompanionPackController instance;

        private readonly Dictionary<string, Texture2D> textures =
            new(StringComparer.Ordinal);
        private readonly List<Texture2D> ownedEditorTextures = new();
        private readonly List<Texture2D> loadedResourceTextures = new();

        private TopLivingNightView top;
        private Transform artRoot;
        private float nextSearchAt;
        private bool activationAttempted;
        private bool wasTopActive;

        public static bool IsEffectPackReady { get; private set; }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (instance != null)
                return;

            instance = FindFirstObjectByType<TopLivingNightEffectCompanionPackController>();
            if (instance != null)
                return;

            var controller = new GameObject(
                "TopLivingNightEffectCompanionPackController",
                typeof(TopLivingNightEffectCompanionPackController));
            DontDestroyOnLoad(controller);
            instance = controller.GetComponent<TopLivingNightEffectCompanionPackController>();
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
            var time = Time.unscaledTime;
            if (time >= nextSearchAt)
            {
                nextSearchAt = time + SearchInterval;
                var current = FindFirstObjectByType<TopLivingNightView>();
                if (current != top)
                    Bind(current);
            }

            if (top == null)
                return;

            var isTopActive = top.isActiveAndEnabled && top.gameObject.activeInHierarchy;
            if (!isTopActive)
            {
                if (wasTopActive || IsEffectPackReady)
                {
                    ReleasePackTextures();
                    activationAttempted = false;
                }
                wasTopActive = false;
                return;
            }

            if (!wasTopActive)
            {
                wasTopActive = true;
                activationAttempted = false;
                artRoot = FindChild(top.transform, "TopLivingNightArt");
            }

            if (!activationAttempted && DependenciesReady())
            {
                activationAttempted = true;
                TryActivateEffectPack();
            }
        }

        private void Bind(TopLivingNightView current)
        {
            ReleasePackTextures();
            top = current;
            artRoot = top == null ? null : FindChild(top.transform, "TopLivingNightArt");
            activationAttempted = false;
            wasTopActive = false;
        }

        private bool DependenciesReady()
        {
            if (artRoot == null || !ShouldUseFinalEffectPack())
                return false;

            foreach (var runtimeName in new[]
            {
                "Stars", "CloudsFar", "CloudsNear", "DistantLights",
                "RobotEye", "FireFlipbook", "FireGlow", "LanternGlow",
                "Smoke_01", "Ember_01",
            })
            {
                var image = FindChildComponent<RawImage>(artRoot, runtimeName);
                if (image == null || image.texture == null)
                    return false;
            }

            return true;
        }

        private void TryActivateEffectPack()
        {
            var staged = new Dictionary<string, Texture2D>(StringComparer.Ordinal);
            foreach (var spec in Effects)
            {
                var texture = LoadEffectTexture(spec.FileName);
                if (texture == null)
                {
                    ReleasePackTextures();
                    Debug.LogWarning(
                        $"TOP effect companion pack: required texture unavailable: {spec.FileName}");
                    return;
                }
                staged[spec.FileName] = texture;
            }

            foreach (var pair in staged)
                textures[pair.Key] = pair.Value;

            Assign("Stars", "01-stars.png");
            Assign("CloudsFar", "02-clouds-far.png");
            Assign("CloudsNear", "03-clouds-near.png");
            Assign("DistantLights", "05-distant-lights-mask.png");
            Assign("RobotEye", "08-robot-eye-mask.png");
            Assign("FireFlipbook", "10-fire-flipbook-atlas.png");
            Assign("FireGlow", "11-fire-glow-mask.png");
            Assign("LanternGlow", "14-lantern-glow-mask.png");

            for (var index = 1; index <= 4; index++)
                Assign($"Smoke_{index:00}", "12-smoke-atlas.png");
            for (var index = 1; index <= 10; index++)
                Assign($"Ember_{index:00}", "13-embers-atlas.png");

            IsEffectPackReady = true;
            Debug.Log(
                "TOP effect companion pack: final-candidate stars/clouds/lights/fire/smoke/embers/lantern/robot-eye textures are active; existing motion ownership is preserved.");
        }

        private void Assign(string runtimeName, string fileName)
        {
            if (!textures.TryGetValue(fileName, out var texture) || texture == null)
                return;
            var image = FindChildComponent<RawImage>(artRoot, runtimeName);
            if (image != null)
                image.texture = texture;
        }

        private bool ShouldUseFinalEffectPack()
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
                var manifest = JsonUtility.FromJson<EffectPackManifest>(File.ReadAllText(manifestPath));
                if (status == null || manifest == null ||
                    status.schemaVersion != 1 || manifest.schemaVersion != 1 ||
                    !status.candidateGenerated ||
                    !IsLowerHexSha256(status.candidateSha256) ||
                    !string.Equals(status.candidateSha256, manifest.candidateSha256, StringComparison.Ordinal) ||
                    !string.Equals(
                        status.candidateCore5ReferenceSetSha256,
                        manifest.core5ReferenceSetSha256,
                        StringComparison.Ordinal) ||
                    manifest.effectCount != Effects.Length ||
                    manifest.effects == null || manifest.effects.Length != Effects.Length)
                    return false;

                var fingerprint = new StringBuilder();
                fingerprint.Append("candidate=").Append(manifest.candidateSha256).Append('\n');
                fingerprint.Append("core5=").Append(manifest.core5ReferenceSetSha256);
                var effectRoot = Path.Combine(
                    root,
                    EditorEffectRootRelativePath.Replace('/', Path.DirectorySeparatorChar));

                foreach (var spec in Effects)
                {
                    var record = FindManifestEffect(manifest, spec.FileName);
                    var path = Path.Combine(effectRoot, spec.FileName);
                    if (record == null || !File.Exists(path) || !IsLowerHexSha256(record.sha256))
                        return false;
                    var actualSha = ComputeSha256(path);
                    if (!string.Equals(actualSha, record.sha256, StringComparison.Ordinal))
                        return false;
                    fingerprint.Append('\n').Append(spec.FileName).Append(':').Append(record.sha256);
                }

                var packSha = ComputeSha256(Encoding.UTF8.GetBytes(fingerprint.ToString()));
                return IsLowerHexSha256(manifest.packSha256) &&
                    string.Equals(packSha, manifest.packSha256, StringComparison.Ordinal) &&
                    manifest.runtimePolicy != null &&
                    manifest.runtimePolicy.representation == "candidate-bound-effect-companion-pack" &&
                    !manifest.runtimePolicy.legacyV2FallbackAllowedForFinal;
            }
            catch (Exception exception)
            {
                Debug.LogWarning(
                    $"TOP effect companion pack: editor authority check failed: {exception.Message}");
                return false;
            }
#else
            var marker = Resources.Load<TextAsset>(PlayerReadyMarker);
            if (marker == null)
                return false;
            var ready = string.Equals(marker.text.Trim(), "final-core5-effects", StringComparison.Ordinal);
            Resources.UnloadAsset(marker);
            return ready;
#endif
        }

        private Texture2D LoadEffectTexture(string fileName)
        {
#if UNITY_EDITOR
            var path = Path.Combine(
                RepositoryRoot(),
                EditorEffectRootRelativePath.Replace('/', Path.DirectorySeparatorChar),
                fileName);
            if (!File.Exists(path))
                return null;

            var texture = new Texture2D(2, 2, TextureFormat.RGBA32, false);
            if (!texture.LoadImage(File.ReadAllBytes(path), true))
            {
                Destroy(texture);
                return null;
            }
            texture.name = $"TopLivingNightFinalEffect_{Path.GetFileNameWithoutExtension(fileName)}_Editor";
            texture.wrapMode = TextureWrapMode.Clamp;
            texture.filterMode = FilterMode.Bilinear;
            ownedEditorTextures.Add(texture);
            return texture;
#else
            var resourceName = Path.GetFileNameWithoutExtension(fileName);
            var texture = Resources.Load<Texture2D>($"{PlayerRoot}/{resourceName}");
            if (texture != null)
                loadedResourceTextures.Add(texture);
            return texture;
#endif
        }

        private void ReleasePackTextures()
        {
            IsEffectPackReady = false;
            textures.Clear();

            foreach (var texture in ownedEditorTextures)
                if (texture != null) Destroy(texture);
            ownedEditorTextures.Clear();

            foreach (var texture in loadedResourceTextures)
                if (texture != null) Resources.UnloadAsset(texture);
            loadedResourceTextures.Clear();
        }

        private static EffectPackEffect FindManifestEffect(
            EffectPackManifest manifest,
            string fileName)
        {
            if (manifest?.effects == null)
                return null;
            foreach (var effect in manifest.effects)
                if (effect != null && string.Equals(effect.file, fileName, StringComparison.Ordinal))
                    return effect;
            return null;
        }

        private static T FindChildComponent<T>(Transform root, string name)
            where T : Component
        {
            var child = FindChild(root, name);
            return child == null ? null : child.GetComponent<T>();
        }

        private static Transform FindChild(Transform root, string name)
        {
            if (root == null)
                return null;
            if (root.name == name)
                return root;
            for (var index = 0; index < root.childCount; index++)
            {
                var found = FindChild(root.GetChild(index), name);
                if (found != null)
                    return found;
            }
            return null;
        }

        private static string RepositoryRoot()
        {
            return Path.GetFullPath(
                Path.Combine(Application.dataPath, "..", "..", ".."));
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

        private readonly struct EffectSpec
        {
            public EffectSpec(string runtimeName, string fileName)
            {
                RuntimeName = runtimeName;
                FileName = fileName;
            }

            public string RuntimeName { get; }
            public string FileName { get; }
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
        private sealed class EffectPackManifest
        {
            public int schemaVersion;
            public string candidateSha256;
            public string core5ReferenceSetSha256;
            public int effectCount;
            public string packSha256;
            public EffectPackEffect[] effects;
            public RuntimePolicy runtimePolicy;
        }

        [Serializable]
        private sealed class EffectPackEffect
        {
            public string file;
            public string sha256;
        }

        [Serializable]
        private sealed class RuntimePolicy
        {
            public string representation;
            public bool legacyV2FallbackAllowedForFinal;
        }
    }
}
