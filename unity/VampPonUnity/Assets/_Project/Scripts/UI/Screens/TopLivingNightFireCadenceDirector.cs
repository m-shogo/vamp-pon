using System;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    // Executes after TopLivingNightView. The view owns the atlas texture and its
    // lifecycle; this component owns only the visible UV cadence. Adjacent-frame
    // motion is intentionally preserved, while irregular holds, short heat bursts
    // and sparse reversals remove the obvious 0->11->0 flipbook rhythm.
    [DefaultExecutionOrder(920)]
    public sealed class TopLivingNightFireCadenceDirector : MonoBehaviour
    {
        private const int Columns = 4;
        private const int Rows = 3;
        private const int LastFrame = 11;
        private const float UnboundSearchInterval = .15f;
        private const float BoundSearchInterval = 1f;
        private const float PreferencePollInterval = .5f;

        private static TopLivingNightFireCadenceDirector instance;

        private TopLivingNightView top;
        private RawImage fire;
        private int frameIndex;
        private int direction = 1;
        private int stepCount;
        private int heatBurstStepsRemaining;
        private float nextFrameAt;
        private float nextSearchAt;
        private float nextPreferencePollAt;
        private bool reducedMotion;

        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        private static void Bootstrap()
        {
            if (instance != null)
                return;

            instance = FindFirstObjectByType<TopLivingNightFireCadenceDirector>();
            if (instance != null)
                return;

            var directorObject = new GameObject(
                "TopLivingNightFireCadenceDirector",
                typeof(TopLivingNightFireCadenceDirector));
            DontDestroyOnLoad(directorObject);
            instance = directorObject.GetComponent<TopLivingNightFireCadenceDirector>();
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
                nextSearchAt = time + (top == null ? UnboundSearchInterval : BoundSearchInterval);
                var current = FindFirstObjectByType<TopLivingNightView>();
                if (current != top)
                    Bind(current, time);
            }

            if (time >= nextPreferencePollAt)
            {
                nextPreferencePollAt = time + PreferencePollInterval;
                RefreshReducedMotion();
            }

            if (top == null || !top.isActiveAndEnabled || fire == null)
                return;

            if (time >= nextFrameAt)
                Advance(time);

            // TopLivingNightView can update its own uvRect earlier in the frame.
            // Always write our current frame after it so cadence ownership stays
            // deterministic without taking texture/resource ownership.
            fire.uvRect = AtlasCell(frameIndex);
        }

        private void Bind(TopLivingNightView current, float time)
        {
            top = current;
            fire = null;
            frameIndex = 0;
            direction = 1;
            stepCount = 0;
            heatBurstStepsRemaining = 0;
            nextFrameAt = time;

            if (top == null)
                return;

            var fireTransform = FindTransform(top.transform, "FireFlipbook");
            fire = fireTransform != null ? fireTransform.GetComponent<RawImage>() : null;
            if (fire == null)
            {
                Debug.LogWarning("TOP fire cadence: FireFlipbook RawImage was not found; preserving base fire animation.");
                return;
            }

            fire.uvRect = AtlasCell(frameIndex);
        }

        private void Advance(float time)
        {
            stepCount++;

            var bodyHeat = Mathf.PerlinNoise(21.31f, time * .317f);
            var coalHeat = Mathf.PerlinNoise(24.73f, time * .097f);
            var cadenceNoise = bodyHeat * .68f + coalHeat * .32f;

            if (!reducedMotion && heatBurstStepsRemaining <= 0 && stepCount > 7)
            {
                var burstReadiness = Mathf.PerlinNoise(28.17f, time * .041f);
                var burstTrigger = Mathf.PerlinNoise(33.59f, stepCount * .113f);
                if (burstReadiness > .72f && burstTrigger > .925f)
                    heatBurstStepsRemaining = burstTrigger > .972f ? 3 : 2;
            }

            var edgeHold = frameIndex <= 1 || frameIndex >= LastFrame - 1
                ? 1.12f
                : 1f;
            float interval;
            if (reducedMotion)
            {
                interval = Mathf.Lerp(.31f, .48f, cadenceNoise) * edgeHold;
            }
            else if (heatBurstStepsRemaining > 0)
            {
                interval = Mathf.Lerp(.055f, .082f, cadenceNoise);
                heatBurstStepsRemaining--;
            }
            else
            {
                interval = Mathf.Lerp(.082f, .151f, cadenceNoise) * edgeHold;
            }
            nextFrameAt = time + interval;

            // Cooler moments linger slightly more often. Hot bursts suppress holds,
            // which reads as a brief lick of flame rather than a uniformly fast loop.
            var holdNoise = Mathf.PerlinNoise(39.47f, stepCount * .131f);
            var holdThreshold = reducedMotion
                ? .12f
                : heatBurstStepsRemaining > 0
                    ? .035f
                    : Mathf.Lerp(.23f, .11f, bodyHeat);
            if (holdNoise < holdThreshold)
                return;

            // Interior reversals stay sparse and are less likely during a heat burst.
            // Adjacent frames are never skipped, preserving authored silhouette flow.
            if (!reducedMotion && heatBurstStepsRemaining <= 0 && frameIndex >= 2 && frameIndex <= 9)
            {
                var reverseNoise = Mathf.PerlinNoise(47.19f, stepCount * .173f);
                var reverseThreshold = Mathf.Lerp(.89f, .83f, 1f - coalHeat);
                if (reverseNoise > reverseThreshold)
                    direction *= -1;
            }

            frameIndex += direction;
            if (frameIndex >= LastFrame)
            {
                frameIndex = LastFrame;
                direction = -1;
            }
            else if (frameIndex <= 0)
            {
                frameIndex = 0;
                direction = 1;
            }
        }

        private void RefreshReducedMotion()
        {
            reducedMotion =
                PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1 ||
                PlayerPrefs.GetInt("reduce_motion", 0) == 1;
            if (reducedMotion)
                heatBurstStepsRemaining = 0;
        }

        private static Rect AtlasCell(int index)
        {
            var column = index % Columns;
            var rowFromTop = index / Columns;
            var width = 1f / Columns;
            var height = 1f / Rows;
            var y = (Rows - 1 - rowFromTop) * height;
            return new Rect(column * width, y, width, height);
        }

        private static Transform FindTransform(Transform root, string name)
        {
            if (root == null)
                return null;

            if (string.Equals(root.name, name, StringComparison.Ordinal))
                return root;

            for (var index = 0; index < root.childCount; index++)
            {
                var found = FindTransform(root.GetChild(index), name);
                if (found != null)
                    return found;
            }

            return null;
        }

        private void OnDestroy()
        {
            fire = null;
            top = null;
            if (instance == this)
                instance = null;
        }
    }
}
