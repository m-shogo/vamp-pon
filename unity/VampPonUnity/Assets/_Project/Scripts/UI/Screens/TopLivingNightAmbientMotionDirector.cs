using System;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    // Runs after TopLivingNightView.Update so long-period Perlin drift replaces
    // short, visibly periodic presentation motion without changing texture or
    // particle lifecycle ownership. It also normalizes post-view alpha for both
    // Reduced Motion and normal mode so live preference toggles work both ways
    // without rebuilding the TOP view.
    [DefaultExecutionOrder(900)]
    public sealed class TopLivingNightAmbientMotionDirector : MonoBehaviour
    {
        private const float UnboundSearchInterval = .15f;
        private const float BoundSearchInterval = 1f;
        private const float PreferencePollInterval = .5f;

        private static TopLivingNightAmbientMotionDirector instance;

        private readonly List<RawImage> smoke = new();
        private readonly List<RawImage> embers = new();
        private TopLivingNightView top;
        private RectTransform artRoot;
        private RectTransform titleRoot;
        private RectTransform cloudsFar;
        private RectTransform cloudsNear;
        private RawImage stars;
        private RawImage distantLights;
        private RawImage fireGlow;
        private RawImage lanternGlow;
        private RawImage robotEye;
        private Vector2 artBasePosition;
        private Vector3 artBaseScale = Vector3.one;
        private readonly Vector2 titleBasePosition = Vector2.zero;
        private readonly Vector2 farBasePosition = Vector2.zero;
        private readonly Vector2 nearBasePosition = Vector2.zero;
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
                var searchInterval = top == null
                    ? UnboundSearchInterval
                    : BoundSearchInterval;
                nextSearchAt = time + searchInterval;
                var current = FindFirstObjectByType<TopLivingNightView>();
                if (current != top)
                    Bind(current);
                else if (current != null)
                    RefreshVisualBindings();
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
                ApplyReducedMotionVisuals(time);
                return;
            }

            ApplyBreathingNight(time);
            ApplyNormalMotionVisuals(time);
        }

        private void Bind(TopLivingNightView current)
        {
            RestorePose();
            top = current;
            artRoot = null;
            titleRoot = null;
            cloudsFar = null;
            cloudsNear = null;
            stars = null;
            distantLights = null;
            fireGlow = null;
            lanternGlow = null;
            robotEye = null;
            smoke.Clear();
            embers.Clear();
            poseCaptured = false;

            if (top == null)
                return;

            artRoot = FindRect(top.transform, "TopLivingNightArt");
            titleRoot = FindRect(top.transform, "TitleGroup");
            cloudsFar = FindRect(top.transform, "CloudsFar");
            cloudsNear = FindRect(top.transform, "CloudsNear");
            RefreshVisualBindings();

            if (artRoot == null || titleRoot == null || cloudsFar == null || cloudsNear == null)
            {
                Debug.LogWarning(
                    "TOP ambient motion: expected art/title/cloud transforms were not all available; preserving base motion.");
                return;
            }

            artBasePosition = artRoot.anchoredPosition;
            artBaseScale = artRoot.localScale;
            // TopLivingNightView authors TitleGroup and both cloud layers at the
            // zero anchored pose. The view applies its own short-period motion
            // before this director runs, so capturing their current values here
            // would accidentally freeze an arbitrary animation offset in Reduced Motion.
            poseCaptured = true;
        }

        private void RefreshVisualBindings()
        {
            stars = null;
            distantLights = null;
            fireGlow = null;
            lanternGlow = null;
            robotEye = null;
            smoke.Clear();
            embers.Clear();
            if (top == null)
                return;

            foreach (var image in top.GetComponentsInChildren<RawImage>(true))
            {
                if (image == null)
                    continue;

                if (string.Equals(image.name, "Stars", StringComparison.Ordinal))
                {
                    stars = image;
                    continue;
                }

                if (string.Equals(image.name, "DistantLights", StringComparison.Ordinal))
                {
                    distantLights = image;
                    continue;
                }

                if (string.Equals(image.name, "FireGlow", StringComparison.Ordinal))
                {
                    fireGlow = image;
                    continue;
                }

                if (string.Equals(image.name, "LanternGlow", StringComparison.Ordinal))
                {
                    lanternGlow = image;
                    continue;
                }

                if (string.Equals(image.name, "RobotEye", StringComparison.Ordinal))
                {
                    robotEye = image;
                    continue;
                }

                if (image.name.StartsWith("Smoke_", StringComparison.Ordinal))
                {
                    smoke.Add(image);
                    continue;
                }

                if (image.name.StartsWith("Ember_", StringComparison.Ordinal))
                    embers.Add(image);
            }

            smoke.Sort(CompareByName);
            embers.Sort(CompareByName);
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

        private void ApplyNormalMotionVisuals(float time)
        {
            // Re-apply normal-mode values after TopLivingNightView so a view built
            // while Reduced Motion was ON can return to full ambience without rebuild.
            if (stars != null)
            {
                var slow = Mathf.PerlinNoise(.17f, time * .082f);
                var tiny = Mathf.PerlinNoise(2.77f, time * .137f);
                stars.color = WithAlpha(stars.color, .56f + slow * .14f + tiny * .025f);
            }

            if (distantLights != null)
            {
                var districtA = Mathf.PerlinNoise(2.31f, time * .071f);
                var districtB = Mathf.PerlinNoise(6.83f, time * .041f);
                distantLights.color = WithAlpha(
                    distantLights.color,
                    .625f + (districtA - .5f) * .045f + (districtB - .5f) * .025f);
            }

            if (fireGlow != null)
            {
                var first = Mathf.PerlinNoise(5.13f, time * .83f);
                var second = Mathf.PerlinNoise(9.71f, time * 1.67f);
                fireGlow.color = WithAlpha(
                    fireGlow.color,
                    .56f + ((first * .62f + second * .38f) - .5f) * .10f);
            }

            if (lanternGlow != null)
            {
                var slow = Mathf.PerlinNoise(12.7f, time * .19f);
                var micro = Mathf.PerlinNoise(15.23f, time * .53f);
                lanternGlow.color = WithAlpha(
                    lanternGlow.color,
                    .45f + (slow - .5f) * .04f + (micro - .5f) * .012f);
            }

            if (robotEye != null)
            {
                // Two independent sparse windows avoid a mechanically repeating
                // blink interval. Most of the time the robot stays still.
                var readiness = Mathf.PerlinNoise(31.13f, time * .021f);
                var trigger = Mathf.PerlinNoise(43.71f, time * .093f);
                var rare = readiness > .63f && trigger > .82f
                    ? Mathf.InverseLerp(.82f, 1f, trigger)
                    : 0f;
                robotEye.color = WithAlpha(robotEye.color, .16f + rare * .54f);
            }

            for (var index = 0; index < smoke.Count; index++)
            {
                var image = smoke[index];
                if (image == null)
                    continue;

                var gate = Mathf.PerlinNoise(51.7f + index * 3.1f, time * (.031f + index * .004f));
                var body = Mathf.PerlinNoise(61.9f + index * 2.3f, time * (.071f + index * .006f));
                var alpha = gate > .48f
                    ? Mathf.SmoothStep(0f, .19f, Mathf.InverseLerp(.48f, .92f, gate)) * (.72f + body * .28f)
                    : 0f;
                image.color = WithAlpha(image.color, alpha);
            }

            for (var index = 0; index < embers.Count; index++)
            {
                var image = embers[index];
                if (image == null)
                    continue;

                var density = Mathf.PerlinNoise(73.1f + index * 1.7f, time * (.057f + (index % 3) * .011f));
                var pulse = Mathf.PerlinNoise(83.3f + index * 2.1f, time * (.19f + (index % 4) * .027f));
                var alpha = density > .69f
                    ? Mathf.InverseLerp(.69f, .96f, density) * (.35f + pulse * .48f)
                    : 0f;
                image.color = WithAlpha(image.color, alpha);
            }
        }

        private void ApplyReducedMotionVisuals(float time)
        {
            // TopLivingNightView may still hold the preference value it read when
            // it was built. Because this director executes later, the live
            // preference can immediately suppress sparse motion. Fire glow keeps
            // only the same tiny readability variation as the base reduced path.
            if (stars != null)
                stars.color = WithAlpha(stars.color, .62f);
            if (distantLights != null)
                distantLights.color = WithAlpha(distantLights.color, .63f);
            if (fireGlow != null)
            {
                var first = Mathf.PerlinNoise(5.13f, time * .83f);
                var second = Mathf.PerlinNoise(9.71f, time * 1.67f);
                fireGlow.color = WithAlpha(
                    fireGlow.color,
                    .56f + ((first * .62f + second * .38f) - .5f) * .02f);
            }
            if (lanternGlow != null)
                lanternGlow.color = WithAlpha(lanternGlow.color, .45f);
            if (robotEye != null)
                robotEye.color = WithAlpha(robotEye.color, 0f);
            foreach (var image in smoke)
                if (image != null)
                    image.color = WithAlpha(image.color, 0f);
            foreach (var image in embers)
                if (image != null)
                    image.color = WithAlpha(image.color, 0f);
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

        private static int CompareByName(RawImage left, RawImage right)
        {
            return string.CompareOrdinal(left != null ? left.name : string.Empty, right != null ? right.name : string.Empty);
        }

        private static Color WithAlpha(Color color, float alpha)
        {
            color.a = Mathf.Clamp01(alpha);
            return color;
        }

        private void OnDestroy()
        {
            RestorePose();
            smoke.Clear();
            embers.Clear();
            if (instance == this)
                instance = null;
        }
    }
}
