using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    [DefaultExecutionOrder(-950)]
    public sealed class TopLivingNightCompositeV3Controller : MonoBehaviour
    {
        private const float SearchInterval = .05f;
        private const float SourceAspect = 430f / 932f;
        private const string EditorCompositeRelativePath =
            "docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png";
        private const string PlayerCompositeResourcePath =
            "TopLivingNightV3Generated/base-composite-v3";
        private const string PlayerMaterialResourcePath =
            "TopLivingNightV3Generated/LuminanceAdditive";
        private const string AdditiveShaderName =
            "VampPon/UI/LuminanceAdditiveMask";

        private static readonly string[] StaticLayersReplacedByComposite =
        {
            "Environment",
            "Stars",
            "Moon",
            "CloudsFar",
            "CloudsNear",
            "DistantCompanion",
            "Characters",
            "FireBase",
            "AnimalRobot",
            "Foreground",
        };

        private static readonly MaskStyle[] AdditiveMasks =
        {
            new("DistantLights", new Color(1f, .68f, .32f, .34f)),
            new("RobotEye", new Color(.26f, .82f, 1f, .72f)),
            new("FireGlow", new Color(1f, .43f, .12f, .42f)),
            new("LanternGlow", new Color(1f, .66f, .30f, .30f)),
        };

        private static TopLivingNightCompositeV3Controller instance;

        private TopLivingNightView top;
        private RawImage baseComposite;
        private Texture2D compositeTexture;
        private bool ownsCompositeTexture;
        private Material additiveMaterial;
        private float nextSearchAt;

        public static bool IsCompositeReady { get; private set; }

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (instance != null)
                return;

            instance = FindFirstObjectByType<TopLivingNightCompositeV3Controller>();
            if (instance != null)
                return;

            var controller = new GameObject(
                "TopLivingNightCompositeV3Controller",
                typeof(TopLivingNightCompositeV3Controller));
            DontDestroyOnLoad(controller);
            instance = controller.GetComponent<TopLivingNightCompositeV3Controller>();
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
            var current = FindFirstObjectByType<TopLivingNightView>();
            if (current == top)
                return;

            Detach();
            top = current;
            if (top != null)
                Attach();
        }

        private void Attach()
        {
            IsCompositeReady = false;
            var art = FindChild(top.transform, "TopLivingNightArt");
            if (art == null)
            {
                Debug.LogError("TOP Runtime V3: TopLivingNightArt was not found.");
                return;
            }

            var texture = LoadCompositeTexture();
            if (texture == null)
            {
                Debug.LogError(
                    "TOP Runtime V3: base composite could not be loaded; preserving layered fallback.");
                SetStaticLayerVisibility(true);
                ConfigureAdditiveMasks();
                return;
            }

            baseComposite = GetOrCreateBaseComposite(art);
            baseComposite.texture = texture;
            baseComposite.color = Color.white;
            baseComposite.raycastTarget = false;
            baseComposite.gameObject.SetActive(true);

            SetStaticLayerVisibility(false);
            ConfigureAdditiveMasks();
            IsCompositeReady = true;
            Debug.Log(
                "TOP Runtime V3: base composite connected; dynamic fire, smoke, embers and additive light masks remain live.");
        }

        private RawImage GetOrCreateBaseComposite(Transform art)
        {
            var existing = FindChild(art, "BaseComposite");
            GameObject compositeObject;
            if (existing != null)
            {
                compositeObject = existing.gameObject;
            }
            else
            {
                compositeObject = new GameObject(
                    "BaseComposite",
                    typeof(RectTransform),
                    typeof(RawImage),
                    typeof(AspectRatioFitter));
                compositeObject.transform.SetParent(art, false);
            }

            compositeObject.transform.SetSiblingIndex(0);

            var rect = compositeObject.GetComponent<RectTransform>() ??
                compositeObject.AddComponent<RectTransform>();
            rect.anchorMin = new Vector2(.5f, .5f);
            rect.anchorMax = new Vector2(.5f, .5f);
            rect.pivot = new Vector2(.5f, .5f);
            rect.anchoredPosition = Vector2.zero;
            rect.sizeDelta = Vector2.one;

            var image = compositeObject.GetComponent<RawImage>() ??
                compositeObject.AddComponent<RawImage>();
            var fitter = compositeObject.GetComponent<AspectRatioFitter>() ??
                compositeObject.AddComponent<AspectRatioFitter>();
            fitter.aspectMode = AspectRatioFitter.AspectMode.EnvelopeParent;
            fitter.aspectRatio = SourceAspect;
            return image;
        }

        private Texture2D LoadCompositeTexture()
        {
#if UNITY_EDITOR
            var repositoryRoot = Path.GetFullPath(
                Path.Combine(Application.dataPath, "..", "..", ".."));
            var path = Path.Combine(
                repositoryRoot,
                EditorCompositeRelativePath.Replace('/', Path.DirectorySeparatorChar));
            if (!File.Exists(path))
            {
                Debug.LogError($"TOP Runtime V3 editor source is missing: {path}");
                return null;
            }

            var texture = new Texture2D(2, 2, TextureFormat.RGB24, false);
            if (!texture.LoadImage(File.ReadAllBytes(path), true))
            {
                Destroy(texture);
                Debug.LogError($"TOP Runtime V3 editor source could not be decoded: {path}");
                return null;
            }

            texture.name = "TopLivingNight_BaseCompositeV3_Editor";
            texture.wrapMode = TextureWrapMode.Clamp;
            texture.filterMode = FilterMode.Bilinear;
            compositeTexture = texture;
            ownsCompositeTexture = true;
#else
            compositeTexture = Resources.Load<Texture2D>(PlayerCompositeResourcePath);
            ownsCompositeTexture = false;
            if (compositeTexture == null)
                Debug.LogError(
                    $"TOP Runtime V3 resource is missing: Resources/{PlayerCompositeResourcePath}");
#endif
            return compositeTexture;
        }

        private void ConfigureAdditiveMasks()
        {
            if (top == null)
                return;

            additiveMaterial = CreateAdditiveMaterial();
            if (additiveMaterial == null)
            {
                foreach (var style in AdditiveMasks)
                {
                    var image = FindChildComponent<RawImage>(top.transform, style.Name);
                    if (image != null)
                        image.gameObject.SetActive(false);
                }
                return;
            }

            foreach (var style in AdditiveMasks)
            {
                var image = FindChildComponent<RawImage>(top.transform, style.Name);
                if (image == null)
                    continue;

                image.gameObject.SetActive(true);
                image.material = additiveMaterial;
                image.color = style.Tint;
                image.raycastTarget = false;
            }
        }

        private Material CreateAdditiveMaterial()
        {
#if UNITY_EDITOR
            var shader = Shader.Find(AdditiveShaderName);
            if (shader == null)
            {
                Debug.LogError($"TOP Runtime V3 shader was not found: {AdditiveShaderName}");
                return null;
            }

            var material = new Material(shader)
            {
                name = "TopLivingNight_LuminanceAdditive_Editor",
                hideFlags = HideFlags.DontSave,
            };
            return material;
#else
            var resource = Resources.Load<Material>(PlayerMaterialResourcePath);
            if (resource == null)
            {
                Debug.LogError(
                    $"TOP Runtime V3 material is missing: Resources/{PlayerMaterialResourcePath}");
                return null;
            }

            var material = new Material(resource)
            {
                name = "TopLivingNight_LuminanceAdditive_Runtime",
            };
            return material;
#endif
        }

        private void SetStaticLayerVisibility(bool active)
        {
            if (top == null)
                return;

            var art = FindChild(top.transform, "TopLivingNightArt");
            if (art == null)
                return;

            foreach (var layerName in StaticLayersReplacedByComposite)
            {
                var child = FindChild(art, layerName);
                if (child != null)
                    child.gameObject.SetActive(active);
            }
        }

        private void ResetAdditiveMasks()
        {
            if (top == null)
                return;

            foreach (var style in AdditiveMasks)
            {
                var image = FindChildComponent<RawImage>(top.transform, style.Name);
                if (image == null)
                    continue;

                image.material = null;
                image.gameObject.SetActive(true);
            }
        }

        private void Detach()
        {
            IsCompositeReady = false;

            if (baseComposite != null)
            {
                baseComposite.texture = null;
                baseComposite.gameObject.SetActive(false);
            }

            SetStaticLayerVisibility(true);
            ResetAdditiveMasks();

            if (ownsCompositeTexture && compositeTexture != null)
                Destroy(compositeTexture);
            else if (!ownsCompositeTexture && compositeTexture != null)
                Resources.UnloadAsset(compositeTexture);

            if (additiveMaterial != null)
                Destroy(additiveMaterial);

            baseComposite = null;
            compositeTexture = null;
            ownsCompositeTexture = false;
            additiveMaterial = null;
            top = null;
        }

        private void OnDestroy()
        {
            Detach();
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

        private readonly struct MaskStyle
        {
            public MaskStyle(string name, Color tint)
            {
                Name = name;
                Tint = tint;
            }

            public string Name { get; }
            public Color Tint { get; }
        }
    }
}
