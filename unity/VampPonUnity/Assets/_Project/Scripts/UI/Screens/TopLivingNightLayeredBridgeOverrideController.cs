using System;
using System.IO;
using System.Linq;
using UnityEngine;

namespace VampPon.UnitySpike.UI.Screens
{
    // The V3 composite is a safe visual-recovery fallback, but the verified bridge
    // already owns registered semantic layers. While final Core5 art is NOT_RUN,
    // prefer those independently movable layers over the flattened bridge image.
    // This runs after the V3 composite controller and before the ambient directors.
    [DefaultExecutionOrder(-900)]
    public sealed class TopLivingNightLayeredBridgeOverrideController : MonoBehaviour
    {
        private const float SearchInterval = .10f;
        private const string RuntimeSourceKindResource =
            "TopLivingNightV3Generated/source-kind";
        private const string EditorFinalStatusRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final-art-status.json";

        private static readonly string[] BridgeSemanticLayers =
        {
            "Environment",
            "Moon",
            "DistantCompanion",
            "Characters",
            "FireBase",
            "AnimalRobot",
            "Foreground",
        };

        private static TopLivingNightLayeredBridgeOverrideController instance;

        private TopLivingNightView top;
        private float nextSearchAt;
        private bool sourceModeResolved;
        private bool useLayeredBridge;

        public static bool IsLayeredBridgeActive { get; private set; }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (instance != null)
                return;

            instance = FindFirstObjectByType<TopLivingNightLayeredBridgeOverrideController>();
            if (instance != null)
                return;

            var controller = new GameObject(
                "TopLivingNightLayeredBridgeOverrideController",
                typeof(TopLivingNightLayeredBridgeOverrideController));
            DontDestroyOnLoad(controller);
            instance = controller.GetComponent<TopLivingNightLayeredBridgeOverrideController>();
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
            if (Time.unscaledTime < nextSearchAt)
                return;

            nextSearchAt = Time.unscaledTime + SearchInterval;
            if (!sourceModeResolved)
                ResolveSourceMode();

            var current = FindFirstObjectByType<TopLivingNightView>();
            if (current != top)
            {
                IsLayeredBridgeActive = false;
                top = current;
            }

            if (!useLayeredBridge || top == null || !top.isActiveAndEnabled)
                return;

            ApplyLayeredBridge();
        }

        private void ResolveSourceMode()
        {
            sourceModeResolved = true;
#if UNITY_EDITOR
            try
            {
                var repositoryRoot = Path.GetFullPath(
                    Path.Combine(Application.dataPath, "..", "..", ".."));
                var statusPath = Path.Combine(
                    repositoryRoot,
                    EditorFinalStatusRelativePath.Replace('/', Path.DirectorySeparatorChar));
                if (!File.Exists(statusPath))
                {
                    Debug.LogWarning(
                        $"TOP layered bridge override: final-art status missing: {statusPath}");
                    return;
                }

                var status = JsonUtility.FromJson<FinalArtStatus>(File.ReadAllText(statusPath));
                useLayeredBridge = status != null &&
                    status.schemaVersion == 1 &&
                    !status.candidateGenerated;
            }
            catch (Exception exception)
            {
                Debug.LogWarning(
                    $"TOP layered bridge override: could not resolve editor source mode: {exception.Message}");
            }
#else
            var marker = Resources.Load<TextAsset>(RuntimeSourceKindResource);
            if (marker == null)
            {
                Debug.LogWarning(
                    $"TOP layered bridge override: runtime source marker missing: Resources/{RuntimeSourceKindResource}");
                return;
            }

            useLayeredBridge = string.Equals(
                marker.text.Trim(),
                "bridge",
                StringComparison.Ordinal);
            Resources.UnloadAsset(marker);
#endif
        }

        private void ApplyLayeredBridge()
        {
            var art = FindChild(top.transform, "TopLivingNightArt");
            if (art == null)
                return;

            var baseComposite = FindChild(art, "BaseComposite");
            if (baseComposite != null && baseComposite.gameObject.activeSelf)
                baseComposite.gameObject.SetActive(false);

            var complete = true;
            foreach (var layerName in BridgeSemanticLayers)
            {
                var layer = FindChild(art, layerName);
                if (layer == null)
                {
                    complete = false;
                    continue;
                }

                if (!layer.gameObject.activeSelf)
                    layer.gameObject.SetActive(true);
            }

            if (!complete)
            {
                IsLayeredBridgeActive = false;
                Debug.LogWarning(
                    "TOP layered bridge override: semantic bridge layer set is incomplete; V3 readiness is not promoted by this override.");
                return;
            }

            if (!IsLayeredBridgeActive)
                Debug.Log(
                    "TOP layered bridge override: verified bridge is rendering as semantic depth layers; sky/fire/smoke/embers/additive masks remain independently animated.");
            IsLayeredBridgeActive = true;
        }

        private static Transform FindChild(Transform root, string name)
        {
            if (root == null)
                return null;

            return root
                .GetComponentsInChildren<Transform>(true)
                .FirstOrDefault(value => value.name == name);
        }

        private void OnDestroy()
        {
            IsLayeredBridgeActive = false;
            top = null;
            if (instance == this)
                instance = null;
        }

        [Serializable]
        private sealed class FinalArtStatus
        {
            public int schemaVersion;
            public bool candidateGenerated;
        }
    }
}
