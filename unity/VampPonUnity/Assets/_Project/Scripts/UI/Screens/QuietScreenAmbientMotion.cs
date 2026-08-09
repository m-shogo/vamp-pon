using System;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    // Quiet non-gameplay screens share motion vocabulary, not identical motion.
    // StageSelect should feel like a map under lantern light; Collection should
    // feel materially present but almost still. No gameplay state is touched.
    [DefaultExecutionOrder(840)]
    public sealed class QuietScreenAmbientMotion : MonoBehaviour
    {
        private const float SearchInterval = .20f;
        private const float PreferencePollInterval = .50f;
        private const float DynamicDecorationRefreshInterval = .75f;

        private static QuietScreenAmbientMotion instance;

        private StageSelectView stageSelect;
        private CollectionView collection;
        private RectTransform stageMap;
        private RectTransform stageLantern;
        private RectTransform collectionPage;
        private Vector2 stageMapBasePosition;
        private Vector3 stageMapBaseScale = Vector3.one;
        private Vector3 stageLanternBaseScale = Vector3.one;
        private Quaternion stageLanternBaseRotation = Quaternion.identity;
        private Vector2 collectionPageBasePosition;
        private Vector3 collectionPageBaseScale = Vector3.one;
        private readonly List<Image> collectionNewIndicators = new();
        private readonly Dictionary<int, Color> collectionNewIndicatorBaseColors = new();
        private float nextSearchAt;
        private float nextPreferencePollAt;
        private float nextDecorationRefreshAt;
        private bool reducedMotion;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (instance != null)
                return;

            instance = FindFirstObjectByType<QuietScreenAmbientMotion>();
            if (instance != null)
                return;

            var owner = new GameObject(
                "QuietScreenAmbientMotion",
                typeof(QuietScreenAmbientMotion));
            DontDestroyOnLoad(owner);
            instance = owner.GetComponent<QuietScreenAmbientMotion>();
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
                BindStageSelect(FindFirstObjectByType<StageSelectView>());
                BindCollection(FindFirstObjectByType<CollectionView>());
            }

            if (time >= nextPreferencePollAt)
            {
                nextPreferencePollAt = time + PreferencePollInterval;
                RefreshReducedMotion();
            }

            if (time >= nextDecorationRefreshAt)
            {
                nextDecorationRefreshAt = time + DynamicDecorationRefreshInterval;
                RefreshCollectionDecorations();
            }

            if (reducedMotion)
            {
                RestoreStageSelect();
                RestoreCollection();
                return;
            }

            AnimateStageSelect(time);
            AnimateCollection(time);
        }

        private void BindStageSelect(StageSelectView current)
        {
            if (current == stageSelect)
                return;

            RestoreStageSelect();
            stageSelect = current;
            stageMap = null;
            stageLantern = null;
            if (stageSelect == null)
                return;

            stageMap = FindChild(stageSelect.transform, "StageSelectPaperMap") as RectTransform;
            stageLantern = FindChild(stageSelect.transform, "LanternAccent") as RectTransform;
            if (stageMap != null)
            {
                stageMapBasePosition = stageMap.anchoredPosition;
                stageMapBaseScale = stageMap.localScale;
            }
            if (stageLantern != null)
            {
                stageLanternBaseScale = stageLantern.localScale;
                stageLanternBaseRotation = stageLantern.localRotation;
            }
        }

        private void BindCollection(CollectionView current)
        {
            if (current == collection)
                return;

            RestoreCollection();
            collection = current;
            collectionPage = null;
            collectionNewIndicators.Clear();
            collectionNewIndicatorBaseColors.Clear();
            if (collection == null)
                return;

            collectionPage = FindChild(collection.transform, "CollectionIndexPage") as RectTransform;
            if (collectionPage != null)
            {
                collectionPageBasePosition = collectionPage.anchoredPosition;
                collectionPageBaseScale = collectionPage.localScale;
            }
            RefreshCollectionDecorations();
        }

        private void AnimateStageSelect(float time)
        {
            if (stageSelect == null || !stageSelect.isActiveAndEnabled)
                return;

            if (stageMap != null)
            {
                var drift = LivingSceneMotion.Drift2D(
                    time,
                    301.7f,
                    new Vector2(.42f, .34f),
                    new Vector2(.021f, .017f));
                stageMap.anchoredPosition = stageMapBasePosition + drift;
                var scale = LivingSceneMotion.SignedNoise(317.9f, time, .013f);
                stageMap.localScale = stageMapBaseScale * (1f + scale * .00065f);
            }

            if (stageLantern != null)
            {
                var breathe = LivingSceneMotion.Layered01(
                    time,
                    331.3f,
                    .11f,
                    .31f,
                    .16f);
                stageLantern.localScale =
                    stageLanternBaseScale * Mathf.Lerp(.992f, 1.012f, breathe);
                var tilt = LivingSceneMotion.SignedNoise(347.1f, time, .027f) * .45f;
                stageLantern.localRotation =
                    stageLanternBaseRotation * Quaternion.Euler(0f, 0f, tilt);
            }
        }

        private void AnimateCollection(float time)
        {
            if (collection == null || !collection.isActiveAndEnabled)
                return;

            if (collectionPage != null)
            {
                var drift = LivingSceneMotion.Drift2D(
                    time,
                    401.3f,
                    new Vector2(.20f, .16f),
                    new Vector2(.013f, .011f));
                collectionPage.anchoredPosition = collectionPageBasePosition + drift;
                var scale = LivingSceneMotion.SignedNoise(419.7f, time, .009f);
                collectionPage.localScale = collectionPageBaseScale * (1f + scale * .00035f);
            }

            for (var index = 0; index < collectionNewIndicators.Count; index++)
            {
                var indicator = collectionNewIndicators[index];
                if (indicator == null || !indicator.isActiveAndEnabled)
                    continue;

                var id = indicator.GetInstanceID();
                if (!collectionNewIndicatorBaseColors.TryGetValue(id, out var baseColor))
                    baseColor = indicator.color;
                var gate = LivingSceneMotion.SparseGate(
                    time,
                    433.1f + index * 5.3f,
                    .037f + index * .003f,
                    .68f);
                var color = baseColor;
                color.a = Mathf.Clamp01(baseColor.a * (.82f + gate * .18f));
                indicator.color = color;
            }
        }

        private void RefreshCollectionDecorations()
        {
            if (collection == null || !collection.isActiveAndEnabled)
                return;

            collectionNewIndicators.RemoveAll(image => image == null);
            foreach (var image in collection.GetComponentsInChildren<Image>(true))
            {
                if (image == null || !string.Equals(image.name, "NewIndicator", StringComparison.Ordinal))
                    continue;
                if (!collectionNewIndicators.Contains(image))
                    collectionNewIndicators.Add(image);
                var id = image.GetInstanceID();
                if (!collectionNewIndicatorBaseColors.ContainsKey(id))
                    collectionNewIndicatorBaseColors[id] = image.color;
            }
        }

        private void RefreshReducedMotion()
        {
            var next =
                PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1 ||
                PlayerPrefs.GetInt("reduce_motion", 0) == 1;
            if (next == reducedMotion)
                return;
            reducedMotion = next;
            if (reducedMotion)
            {
                RestoreStageSelect();
                RestoreCollection();
            }
        }

        private void RestoreStageSelect()
        {
            if (stageMap != null)
            {
                stageMap.anchoredPosition = stageMapBasePosition;
                stageMap.localScale = stageMapBaseScale;
            }
            if (stageLantern != null)
            {
                stageLantern.localScale = stageLanternBaseScale;
                stageLantern.localRotation = stageLanternBaseRotation;
            }
        }

        private void RestoreCollection()
        {
            if (collectionPage != null)
            {
                collectionPage.anchoredPosition = collectionPageBasePosition;
                collectionPage.localScale = collectionPageBaseScale;
            }

            foreach (var image in collectionNewIndicators)
            {
                if (image == null)
                    continue;
                if (collectionNewIndicatorBaseColors.TryGetValue(image.GetInstanceID(), out var baseColor))
                    image.color = baseColor;
            }
        }

        private void OnDestroy()
        {
            RestoreStageSelect();
            RestoreCollection();
            stageSelect = null;
            collection = null;
            collectionNewIndicators.Clear();
            collectionNewIndicatorBaseColors.Clear();
            if (instance == this)
                instance = null;
        }

        private static Transform FindChild(Transform root, string name)
        {
            if (root == null)
                return null;
            return root
                .GetComponentsInChildren<Transform>(true)
                .FirstOrDefault(value => string.Equals(value.name, name, StringComparison.Ordinal));
        }
    }
}
