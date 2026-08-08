using System;
using UnityEngine;

namespace VampPon.UnitySpike.UI.Screens
{
    // Runs after TopLivingNightView.Update so the long-period Perlin drift replaces
    // the short, visibly periodic presentation motion without changing the
    // underlying fire/smoke/ember simulation or asset lifecycle.
    [DefaultExecutionOrder(900)]
    public sealed class TopLivingNightAmbientMotionDirector : MonoBehaviour
    {
        private const float SearchInterval = .15f;
        private const float PreferencePollInterval = .5f;

        private static TopLivingNightAmbientMotionDirector instance;

        private TopLivingNightView top;
        private RectTransform artRoot;
        private RectTransform titleRoot;
        private RectTransform cloudsFar;
        private RectTransform cloudsNear;
        private Vector2 artBasePosition;
        private Vector3 artBaseScale = Vector3.one;
        private Vector2 titleBasePosition;
        private Vector2 farBasePosition;
        private Vector2 nearBasePosition;
        private float nextSearchAt;
        private float nextPreferencePollAt;
        private bool reducedMotion;
        private bool poseCaptured;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (instance != null)
                return;

            instance = FindFirstObjectByType<TopLivingNightAmbientMotionDirector>();
            if (instance != null)
                return;

            var directorObject = new GameObject(
                "TopLivingNightAmbientMotionDirector",
                typeof(TopLivingNightAmbientMotionDirector));
            DontDestroyOnLoad(directorObject);
            instance = directorObject.GetComponent<TopLivingNightAmbientMotionDirector>();
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

            if (top == null || !top.isActiveAndEnabled || !poseCaptured)
                return;

            if (reducedMotion)
            {
                RestorePose();
                return;
            }

            ApplyBreathingNight(time);
        }

        private void Bind(TopLivingNightView current)
        {
            RestorePose();
            top = current;
            artRoot = null;
            titleRoot = null;
            cloudsFar = null;
            cloudsNear = null;
            poseCaptured = false;

            if (top == null)
                return;

            artRoot = FindRect(top.transform, "TopLivingNightArt");
            titleRoot = FindRect(top.transform, "TitleGroup");
            cloudsFar = FindRect(top.transform, "CloudsFar");
            cloudsNear = FindRect(top.transform, "CloudsNear");

            if (artRoot == null || titleRoot == null || cloudsFar == null || cloudsNear == null)
            {
                Debug.LogWarning(
                    "TOP ambient motion: expected art/title/cloud transforms were not all available; preserving base motion.");
                return;
            }

            artBasePosition = artRoot.anchoredPosition;
            artBaseScale = artRoot.localScale;
            titleBasePosition = titleRoot.anchoredPosition;
            farBasePosition = cloudsFar.anchoredPosition;
            nearBasePosition = cloudsNear.anchoredPosition;
            poseCaptured = true;
        }

        private void ApplyBreathingNight(float time)
        {
            // All frequencies are deliberately slow and unrelated. Using Perlin
            // instead of sine waves avoids a visible pendulum reversal or short
            // shared loop during the five-minute review window.
            var artX = (Mathf.PerlinNoise(.31f, time * .031f) - .5f) * 1.4f;
            var artY = (Mathf.PerlinNoise(1.73f, time * .027f) - .5f) * .9f;
            var scaleNoise = Mathf.PerlinNoise(4.91f, time * .019f) - .5f;
            artRoot.anchoredPosition = artBasePosition + new Vector2(artX, artY);
            artRoot.localScale = artBaseScale * (1f + scaleNoise * .0018f);

            var titleY = (Mathf.PerlinNoise(7.33f, time * .047f) - .5f) * .7f;
            titleRoot.anchoredPosition = titleBasePosition + new Vector2(0f, titleY);

            var farX = (Mathf.PerlinNoise(11.17f, time * .023f) - .5f) * 5.8f;
            var farY = (Mathf.PerlinNoise(13.61f, time * .017f) - .5f) * 1.0f;
            cloudsFar.anchoredPosition = farBasePosition + new Vector2(farX, farY);

            var nearX = (Mathf.PerlinNoise(17.29f, time * .037f) - .5f) * 9.2f;
            var nearY = (Mathf.PerlinNoise(19.87f, time * .029f) - .5f) * 1.5f;
            cloudsNear.anchoredPosition = nearBasePosition + new Vector2(nearX, nearY);
        }

        private void RefreshReducedMotion()
        {
            reducedMotion =
                PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1 ||
                PlayerPrefs.GetInt("reduce_motion", 0) == 1;
        }

        private void RestorePose()
        {
            if (!poseCaptured)
                return;

            if (artRoot != null)
            {
                artRoot.anchoredPosition = artBasePosition;
                artRoot.localScale = artBaseScale;
            }
            if (titleRoot != null)
                titleRoot.anchoredPosition = titleBasePosition;
            if (cloudsFar != null)
                cloudsFar.anchoredPosition = farBasePosition;
            if (cloudsNear != null)
                cloudsNear.anchoredPosition = nearBasePosition;
        }

        private static RectTransform FindRect(Transform root, string name)
        {
            if (root == null)
                return null;

            if (string.Equals(root.name, name, StringComparison.Ordinal))
                return root as RectTransform;

            for (var index = 0; index < root.childCount; index++)
            {
                var found = FindRect(root.GetChild(index), name);
                if (found != null)
                    return found;
            }

            return null;
        }

        private void OnDestroy()
        {
            RestorePose();
            if (instance == this)
                instance = null;
        }
    }
}
