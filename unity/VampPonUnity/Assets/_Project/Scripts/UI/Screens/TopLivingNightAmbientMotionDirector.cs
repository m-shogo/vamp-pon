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
        private const float CloudsFarBaseAlpha = .78f;
        private const float CloudsNearBaseAlpha = .82f;

        private static TopLivingNightAmbientMotionDirector instance;

        private readonly List<RawImage> smoke = new();
        private readonly List<RawImage> embers = new();
        private TopLivingNightView top;
        private RectTransform artRoot;
        private RectTransform titleRoot;
        private RectTransform cloudsFar;
        private RectTransform cloudsNear;
        private RectTransform distantCompanion;
        private RectTransform characters;
        private RectTransform animalRobot;
        private RectTransform foreground;
        private RawImage stars;
        private RawImage cloudsFarImage;
        private RawImage cloudsNearImage;
        private RawImage distantLights;
        private RawImage fireGlow;
        private RawImage lanternGlow;
        private RawImage robotEye;
        private Vector2 artBasePosition;
        private Vector3 artBaseScale = Vector3.one;
        private readonly Vector2 titleBasePosition = Vector2.zero;
        private readonly Vector2 farBasePosition = Vector2.zero;
        private readonly Vector2 nearBasePosition = Vector2.zero;
        private readonly Vector2 distantBasePosition = Vector2.zero;
        private readonly Vector2 charactersBasePosition = Vector2.zero;
        private readonly Vector2 animalRobotBasePosition = Vector2.zero;
        private readonly Vector2 foregroundBasePosition = Vector2.zero;
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
            ApplyDepthParallax(time);
            ApplyNormalMotionVisuals(time);
            ApplyParticleAirflow(time);
        }

        private void Bind(TopLivingNightView current)
        {
            RestorePose();
            top = current;
            artRoot = null;
            titleRoot = null;
            cloudsFar = null;
            cloudsNear = null;
            distantCompanion = null;
            characters = null;
            animalRobot = null;
            foreground = null;
            stars = null;
            cloudsFarImage = null;
            cloudsNearImage = null;
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
            distantCompanion = FindRect(top.transform, "DistantCompanion");
            characters = FindRect(top.transform, "Characters");
            animalRobot = FindRect(top.transform, "AnimalRobot");
            foreground = FindRect(top.transform, "Foreground");
            RefreshVisualBindings();

            if (artRoot == null || titleRoot == null || cloudsFar == null || cloudsNear == null)
            {
                Debug.LogWarning(
                    "TOP ambient motion: expected art/title/cloud transforms were not all available; preserving base motion.");
                return;
            }

            artBasePosition = artRoot.anchoredPosition;
            artBaseScale = artRoot.localScale;
            // Full-canvas authored layers use zero anchored position. Capturing
            // that canonical pose rather than the view's current animated offset
            // lets live Reduced Motion settle without a visual jump or stale drift.
            poseCaptured = true;
        }

        private void RefreshVisualBindings()
        {
            stars = null;
            cloudsFarImage = null;
            cloudsNearImage = null;
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

                if (string.Equals(image.name, "CloudsFar", StringComparison.Ordinal))
                {
                    cloudsFarImage = image;
                    continue;
                }

                if (string.Equals(image.name, "CloudsNear", StringComparison.Ordinal))
                {
                    cloudsNearImage = image;
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

            // The cloud bands share a very slow air mass but keep independent
            // detail noise. A sparse signed gust changes the drift envelope without
            // creating a pendulum loop or turning the TOP into a camera pan.
            var airMass = Mathf.PerlinNoise(11.17f, time * .018f) - .5f;
            var farDetail = Mathf.PerlinNoise(13.61f, time * .031f) - .5f;
            var nearDetail = Mathf.PerlinNoise(17.29f, time * .047f) - .5f;
            var gustStrength = Mathf.SmoothStep(
                0f,
                1f,
                Mathf.InverseLerp(.70f, .94f, Mathf.PerlinNoise(19.87f, time * .010f)));
            var gustDirection = Mathf.PerlinNoise(21.43f, time * .014f) - .5f;

            var farX = airMass * 9.4f + farDetail * 3.2f + gustDirection * gustStrength * 4.2f;
            var farY = (Mathf.PerlinNoise(24.71f, time * .016f) - .5f) * 1.6f;
            cloudsFar.anchoredPosition = farBasePosition + new Vector2(farX, farY);

            var nearX = airMass * 12.2f + nearDetail * 7.4f + gustDirection * gustStrength * 7.2f;
            var nearY = (Mathf.PerlinNoise(28.91f, time * .027f) - .5f) * 2.4f;
            cloudsNear.anchoredPosition = nearBasePosition + new Vector2(nearX, nearY);

            if (cloudsFarImage != null)
            {
                var density = Mathf.PerlinNoise(32.17f, time * .021f) - .5f;
                cloudsFarImage.color = WithAlpha(
                    cloudsFarImage.color,
                    CloudsFarBaseAlpha + density * .045f);
            }

            if (cloudsNearImage != null)
            {
                var density = Mathf.PerlinNoise(35.53f, time * .028f) - .5f;
                cloudsNearImage.color = WithAlpha(
                    cloudsNearImage.color,
                    CloudsNearBaseAlpha + density * .055f);
            }
        }

        private void ApplyDepthParallax(float time)
        {
            // Semantic depth bands are deliberately tiny. The movement should be
            // read subconsciously as a living illustration, not as a moving UI.
            var horizontal = Mathf.PerlinNoise(41.41f, time * .026f) - .5f;
            var vertical = Mathf.PerlinNoise(47.13f, time * .021f) - .5f;
            var gust = Mathf.SmoothStep(
                0f,
                1f,
                Mathf.InverseLerp(.72f, .94f, Mathf.PerlinNoise(53.71f, time * .012f)));

            if (distantCompanion != null)
                distantCompanion.anchoredPosition = distantBasePosition +
                    new Vector2(horizontal * 1.8f + gust * .8f, vertical * .5f);

            if (characters != null)
                characters.anchoredPosition = charactersBasePosition +
                    new Vector2(horizontal * .55f, vertical * .32f);

            if (animalRobot != null)
                animalRobot.anchoredPosition = animalRobotBasePosition +
                    new Vector2(horizontal * .9f, vertical * .42f);

            if (foreground != null)
                foreground.anchoredPosition = foregroundBasePosition +
                    new Vector2(horizontal * 2.8f + gust * 1.2f, vertical * .75f);
        }

        private void ApplyNormalMotionVisuals(float time)
        {
            // Re-apply normal-mode values after TopLivingNightView so a view built
            // while Reduced Motion was ON can return to full ambience without rebuild.
            if (stars != null)
            {
                var slow = Mathf.PerlinNoise(.17f, time * .061f);
                var tiny = Mathf.PerlinNoise(2.77f, time * .149f);
                var readiness = Mathf.PerlinNoise(4.37f, time * .013f);
                var spark = Mathf.PerlinNoise(8.11f, time * .101f);
                var rareGlimmer = readiness > .66f && spark > .86f
                    ? Mathf.SmoothStep(0f, 1f, Mathf.InverseLerp(.86f, .98f, spark))
                    : 0f;
                stars.color = WithAlpha(
                    stars.color,
                    .545f + slow * .125f + tiny * .022f + rareGlimmer * .055f);
            }

            if (distantLights != null)
            {
                var districtA = Mathf.PerlinNoise(12.31f, time * .071f);
                var districtB = Mathf.PerlinNoise(16.83f, time * .041f);
                var lateWindow = Mathf.PerlinNoise(18.97f, time * .015f);
                var rareWake = lateWindow > .86f
                    ? Mathf.InverseLerp(.86f, .98f, lateWindow) * .022f
                    : 0f;
                distantLights.color = WithAlpha(
                    distantLights.color,
                    .622f + (districtA - .5f) * .045f + (districtB - .5f) * .025f + rareWake);
            }

            if (fireGlow != null)
            {
                var body = Mathf.PerlinNoise(25.13f, time * .79f);
                var lick = Mathf.PerlinNoise(29.71f, time * 1.73f);
                var coal = Mathf.PerlinNoise(31.17f, time * .27f);
                var flareGate = Mathf.PerlinNoise(37.91f, time * .11f);
                var flare = flareGate > .89f
                    ? Mathf.InverseLerp(.89f, .99f, flareGate)
                    : 0f;
                var energy = body * .50f + lick * .31f + coal * .19f;
                fireGlow.color = WithAlpha(
                    fireGlow.color,
                    .545f + (energy - .5f) * .125f + flare * .035f);
            }

            if (lanternGlow != null)
            {
                var slow = Mathf.PerlinNoise(42.7f, time * .17f);
                var micro = Mathf.PerlinNoise(45.23f, time * .49f);
                var settling = Mathf.PerlinNoise(49.31f, time * .037f);
                lanternGlow.color = WithAlpha(
                    lanternGlow.color,
                    .447f + (slow - .5f) * .044f + (micro - .5f) * .012f +
                    (settling - .5f) * .014f);
            }

            if (robotEye != null)
            {
                // Two independent sparse windows avoid a mechanically repeating
                // blink interval. Most of the time the robot stays still.
                var readiness = Mathf.PerlinNoise(61.13f, time * .021f);
                var trigger = Mathf.PerlinNoise(67.71f, time * .093f);
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

                var gate = Mathf.PerlinNoise(71.7f + index * 3.1f, time * (.031f + index * .004f));
                var body = Mathf.PerlinNoise(81.9f + index * 2.3f, time * (.071f + index * .006f));
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

                var density = Mathf.PerlinNoise(93.1f + index * 1.7f, time * (.057f + (index % 3) * .011f));
                var pulse = Mathf.PerlinNoise(103.3f + index * 2.1f, time * (.19f + (index % 4) * .027f));
                var alpha = density > .69f
                    ? Mathf.InverseLerp(.69f, .96f, density) * (.35f + pulse * .48f)
                    : 0f;
                image.color = WithAlpha(image.color, alpha);
            }
        }

        private void ApplyParticleAirflow(float time)
        {
            // TopLivingNightView owns each particle's rise/reset lifecycle. This
            // pass adds a second, non-periodic airflow vector afterwards, keeping
            // smoke/embers coherent with sky gusts without reallocating particles.
            var sharedWind = Mathf.PerlinNoise(111.7f, time * .043f) - .5f;

            for (var index = 0; index < smoke.Count; index++)
            {
                var image = smoke[index];
                if (image == null || image.color.a <= .001f)
                    continue;

                var localWind = Mathf.PerlinNoise(121.3f + index * 4.7f, time * (.061f + index * .003f)) - .5f;
                var liftNoise = Mathf.PerlinNoise(131.9f + index * 2.9f, time * .052f) - .5f;
                var shapeNoise = Mathf.PerlinNoise(139.7f + index * 3.7f, time * .079f) - .5f;
                image.rectTransform.anchoredPosition +=
                    new Vector2(sharedWind * 7f + localWind * 5f, liftNoise * 2.4f);
                image.rectTransform.localRotation =
                    Quaternion.Euler(0f, 0f, (sharedWind + localWind) * 3.0f);

                var baseScale = image.rectTransform.localScale.x;
                var horizontalSpread = 1f + Mathf.Abs(sharedWind + localWind) * .12f + shapeNoise * .06f;
                var verticalStretch = 1.03f - shapeNoise * .04f;
                image.rectTransform.localScale = new Vector3(
                    baseScale * horizontalSpread,
                    baseScale * verticalStretch,
                    1f);
            }

            for (var index = 0; index < embers.Count; index++)
            {
                var image = embers[index];
                if (image == null || image.color.a <= .001f)
                    continue;

                var localWind = Mathf.PerlinNoise(151.1f + index * 1.9f, time * (.13f + (index % 3) * .017f)) - .5f;
                var flutter = Mathf.PerlinNoise(167.7f + index * 3.3f, time * .31f) - .5f;
                image.rectTransform.anchoredPosition +=
                    new Vector2(sharedWind * 5.5f + localWind * 7.5f, flutter * 3.4f);

                var baseScale = image.rectTransform.localScale.x;
                var sizeBias = .74f + (index % 5) * .07f;
                var shimmer = .94f + Mathf.PerlinNoise(181.3f + index * 2.7f, time * .37f) * .12f;
                image.rectTransform.localScale = Vector3.one * (baseScale * sizeBias * shimmer);
                image.rectTransform.localRotation =
                    Quaternion.Euler(0f, 0f, (sharedWind * 7f + localWind * 11f + flutter * 5f));
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
            if (cloudsFarImage != null)
                cloudsFarImage.color = WithAlpha(cloudsFarImage.color, CloudsFarBaseAlpha);
            if (cloudsNearImage != null)
                cloudsNearImage.color = WithAlpha(cloudsNearImage.color, CloudsNearBaseAlpha);
            if (distantLights != null)
                distantLights.color = WithAlpha(distantLights.color, .63f);
            if (fireGlow != null)
            {
                var first = Mathf.PerlinNoise(25.13f, time * .79f);
                var second = Mathf.PerlinNoise(29.71f, time * 1.73f);
                fireGlow.color = WithAlpha(
                    fireGlow.color,
                    .55f + ((first * .62f + second * .38f) - .5f) * .02f);
            }
            if (lanternGlow != null)
                lanternGlow.color = WithAlpha(lanternGlow.color, .45f);
            if (robotEye != null)
                robotEye.color = WithAlpha(robotEye.color, 0f);
            foreach (var image in smoke)
                if (image != null)
                {
                    image.color = WithAlpha(image.color, 0f);
                    image.rectTransform.localRotation = Quaternion.identity;
                }
            foreach (var image in embers)
                if (image != null)
                {
                    image.color = WithAlpha(image.color, 0f);
                    image.rectTransform.localRotation = Quaternion.identity;
                }
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
            if (distantCompanion != null)
                distantCompanion.anchoredPosition = distantBasePosition;
            if (characters != null)
                characters.anchoredPosition = charactersBasePosition;
            if (animalRobot != null)
                animalRobot.anchoredPosition = animalRobotBasePosition;
            if (foreground != null)
                foreground.anchoredPosition = foregroundBasePosition;
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
            if (cloudsFarImage != null)
                cloudsFarImage.color = WithAlpha(cloudsFarImage.color, CloudsFarBaseAlpha);
            if (cloudsNearImage != null)
                cloudsNearImage.color = WithAlpha(cloudsNearImage.color, CloudsNearBaseAlpha);
            smoke.Clear();
            embers.Clear();
            if (instance == this)
                instance = null;
        }
    }
}
