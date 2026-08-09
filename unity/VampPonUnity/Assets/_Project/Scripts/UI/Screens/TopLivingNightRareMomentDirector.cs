using System;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    /// <summary>
    /// Adds rare, larger-scale environmental moments on top of the continuous micro motion.
    /// These are intentionally sparse one-shot events: a cloud opening, a faint breeze, or
    /// a distant-light swell. Character identity/pose is never animated here.
    /// </summary>
    [DefaultExecutionOrder(920)]
    public sealed class TopLivingNightRareMomentDirector : MonoBehaviour
    {
        private enum MomentKind
        {
            CloudOpening,
            ForegroundBreeze,
            DistantTownBreath,
        }

        private static TopLivingNightRareMomentDirector instance;
        private readonly System.Random random = new(0x5A17C3);

        private TopLivingNightView top;
        private RectTransform cloudsFar;
        private RectTransform cloudsNear;
        private RectTransform foreground;
        private RawImage stars;
        private RawImage distantLights;
        private float nextSearchAt;
        private float nextPreferencePollAt;
        private float nextMomentAt;
        private bool reducedMotion;
        private bool active;
        private MomentKind currentKind;
        private float momentStartedAt;
        private float momentDuration;
        private float direction;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (instance != null)
                return;

            instance = FindFirstObjectByType<TopLivingNightRareMomentDirector>();
            if (instance != null)
                return;

            var owner = new GameObject("TopLivingNightRareMomentDirector", typeof(TopLivingNightRareMomentDirector));
            DontDestroyOnLoad(owner);
            instance = owner.GetComponent<TopLivingNightRareMomentDirector>();
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
            reducedMotion = ReadReducedMotion();
            ScheduleNext(Time.unscaledTime, first: true);
        }

        private void Update()
        {
            var time = Time.unscaledTime;
            if (time >= nextSearchAt)
            {
                nextSearchAt = time + (top == null ? .2f : 1f);
                var current = FindFirstObjectByType<TopLivingNightView>();
                if (current != top)
                    Bind(current);
                else if (top != null)
                    RefreshBindings();
            }

            if (time >= nextPreferencePollAt)
            {
                nextPreferencePollAt = time + .5f;
                var nextReduced = ReadReducedMotion();
                if (nextReduced != reducedMotion)
                {
                    reducedMotion = nextReduced;
                    if (reducedMotion)
                        EndMoment(time);
                    else
                        ScheduleNext(time, first: true);
                }
            }

            if (top == null || !top.isActiveAndEnabled)
                return;

            if (reducedMotion)
            {
                active = false;
                return;
            }

            if (!active && time >= nextMomentAt)
                BeginMoment(time);

            if (!active)
                return;

            var normalized = Mathf.Clamp01((time - momentStartedAt) / Mathf.Max(.01f, momentDuration));
            // One smooth rise/fall envelope. This is not a repeating oscillator and therefore
            // does not create a discoverable short loop during a five-minute idle review.
            var envelope = Mathf.Sin(normalized * Mathf.PI);
            ApplyMoment(envelope);

            if (normalized >= 1f)
                EndMoment(time);
        }

        private void Bind(TopLivingNightView current)
        {
            top = current;
            cloudsFar = null;
            cloudsNear = null;
            foreground = null;
            stars = null;
            distantLights = null;
            active = false;
            RefreshBindings();
            ScheduleNext(Time.unscaledTime, first: true);
        }

        private void RefreshBindings()
        {
            if (top == null)
                return;

            cloudsFar = FindRect(top.transform, "CloudsFar");
            cloudsNear = FindRect(top.transform, "CloudsNear");
            foreground = FindRect(top.transform, "Foreground");

            stars = null;
            distantLights = null;
            foreach (var image in top.GetComponentsInChildren<RawImage>(true))
            {
                if (image == null)
                    continue;
                if (string.Equals(image.name, "Stars", StringComparison.Ordinal))
                    stars = image;
                else if (string.Equals(image.name, "DistantLights", StringComparison.Ordinal))
                    distantLights = image;
            }
        }

        private void BeginMoment(float time)
        {
            currentKind = (MomentKind)random.Next(0, 3);
            momentStartedAt = time;
            momentDuration = Range(6.5f, 11.5f);
            direction = random.Next(0, 2) == 0 ? -1f : 1f;
            active = true;
        }

        private void EndMoment(float time)
        {
            active = false;
            ScheduleNext(time, first: false);
        }

        private void ApplyMoment(float envelope)
        {
            switch (currentKind)
            {
                case MomentKind.CloudOpening:
                    // A readable but still restrained macro change: near cloud cover parts a
                    // little while the far layer follows less, revealing slightly more stars.
                    if (cloudsNear != null)
                        cloudsNear.anchoredPosition += new Vector2(direction * 18f * envelope, -1.8f * envelope);
                    if (cloudsFar != null)
                        cloudsFar.anchoredPosition += new Vector2(-direction * 6f * envelope, .8f * envelope);
                    if (stars != null)
                    {
                        var color = stars.color;
                        color.a = Mathf.Clamp01(color.a + .11f * envelope);
                        stars.color = color;
                    }
                    break;

                case MomentKind.ForegroundBreeze:
                    if (foreground != null)
                    {
                        foreground.anchoredPosition += new Vector2(direction * 3.2f * envelope, .7f * envelope);
                        foreground.localRotation = Quaternion.Euler(0f, 0f, direction * .42f * envelope);
                    }
                    break;

                case MomentKind.DistantTownBreath:
                    if (distantLights != null)
                    {
                        var color = distantLights.color;
                        color.a = Mathf.Clamp01(color.a + .085f * envelope);
                        distantLights.color = color;
                    }
                    if (cloudsFar != null)
                        cloudsFar.anchoredPosition += new Vector2(direction * 2.5f * envelope, 0f);
                    break;
            }
        }

        private void ScheduleNext(float time, bool first)
        {
            // First moment does not fire immediately after TOP appears. Subsequent moments use
            // a broad local-RNG interval; System.Random avoids perturbing gameplay's Unity RNG.
            nextMomentAt = time + (first ? Range(28f, 52f) : Range(42f, 96f));
        }

        private float Range(float min, float max)
        {
            return min + (float)random.NextDouble() * (max - min);
        }

        private static bool ReadReducedMotion()
        {
            return PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1 ||
                   PlayerPrefs.GetInt("reduce_motion", 0) == 1;
        }

        private static RectTransform FindRect(Transform root, string name)
        {
            if (root == null)
                return null;

            foreach (var rect in root.GetComponentsInChildren<RectTransform>(true))
                if (string.Equals(rect.name, name, StringComparison.Ordinal))
                    return rect;
            return null;
        }

        private void OnDestroy()
        {
            if (foreground != null)
                foreground.localRotation = Quaternion.identity;
            if (instance == this)
                instance = null;
        }
    }
}
