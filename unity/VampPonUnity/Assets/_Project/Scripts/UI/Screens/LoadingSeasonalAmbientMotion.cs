using System;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    // Loading uses a much smaller motion budget than TOP: enough to keep the
    // seasonal illustration from feeling frozen, never enough to compete with it.
    [DefaultExecutionOrder(850)]
    public sealed class LoadingSeasonalAmbientMotion : MonoBehaviour
    {
        private const float SearchInterval = .10f;
        private const float PreferencePollInterval = .50f;

        private static LoadingSeasonalAmbientMotion instance;

        private LoadingSeasonalView loading;
        private RectTransform artwork;
        private Image progressFill;
        private Vector2 artworkBasePosition;
        private Vector3 artworkBaseScale = Vector3.one;
        private Color progressBaseColor = Color.white;
        private float nextSearchAt;
        private float nextPreferencePollAt;
        private bool reducedMotion;
        private bool poseCaptured;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (instance != null)
                return;

            instance = FindFirstObjectByType<LoadingSeasonalAmbientMotion>();
            if (instance != null)
                return;

            var owner = new GameObject(
                "LoadingSeasonalAmbientMotion",
                typeof(LoadingSeasonalAmbientMotion));
            DontDestroyOnLoad(owner);
            instance = owner.GetComponent<LoadingSeasonalAmbientMotion>();
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
                var current = FindFirstObjectByType<LoadingSeasonalView>();
                if (current != loading)
                    Bind(current);
            }

            if (time >= nextPreferencePollAt)
            {
                nextPreferencePollAt = time + PreferencePollInterval;
                RefreshReducedMotion();
            }

            if (loading == null || !loading.isActiveAndEnabled || !poseCaptured)
                return;

            if (reducedMotion)
            {
                RestorePose();
                return;
            }

            var drift = LivingSceneMotion.Drift2D(
                time,
                201.7f,
                new Vector2(1.7f, .8f),
                new Vector2(.037f, .029f));
            artwork.anchoredPosition = artworkBasePosition + drift;

            var scaleNoise = LivingSceneMotion.SignedNoise(213.9f, time, .021f);
            artwork.localScale = artworkBaseScale * (1f + scaleNoise * .0018f);

            if (progressFill != null)
            {
                var pulse = LivingSceneMotion.Layered01(
                    time,
                    227.3f,
                    .23f,
                    .61f,
                    .18f);
                var color = progressBaseColor;
                color.a = Mathf.Clamp01(progressBaseColor.a * (.82f + pulse * .18f));
                progressFill.color = color;
            }
        }

        private void Bind(LoadingSeasonalView current)
        {
            RestorePose();
            loading = current;
            artwork = null;
            progressFill = null;
            poseCaptured = false;

            if (loading == null)
                return;

            artwork = FindChild(loading.transform, "LoadingSeasonalArtwork") as RectTransform;
            var progress = FindChild(loading.transform, "LoadingSeasonalProgressFill");
            progressFill = progress == null ? null : progress.GetComponent<Image>();
            if (artwork == null)
                return;

            artworkBasePosition = artwork.anchoredPosition;
            artworkBaseScale = artwork.localScale;
            if (progressFill != null)
                progressBaseColor = progressFill.color;
            poseCaptured = true;
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
                RestorePose();
        }

        private void RestorePose()
        {
            if (artwork != null && poseCaptured)
            {
                artwork.anchoredPosition = artworkBasePosition;
                artwork.localScale = artworkBaseScale;
            }
            if (progressFill != null)
                progressFill.color = progressBaseColor;
        }

        private void OnDestroy()
        {
            RestorePose();
            loading = null;
            artwork = null;
            progressFill = null;
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
