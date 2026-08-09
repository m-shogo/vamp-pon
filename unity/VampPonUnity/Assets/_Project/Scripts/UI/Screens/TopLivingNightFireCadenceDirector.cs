using System;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    // Executes after TopLivingNightView. The view owns the atlas texture and its
    // lifecycle; this component owns only the visible UV cadence. Adjacent-frame
    // random walk keeps motion coherent while removing the obvious 0->11->0 loop.
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

            var cadenceNoise = Mathf.PerlinNoise(21.31f, time * .317f);
            var interval = reducedMotion
                ? Mathf.Lerp(.30f, .46f, cadenceNoise)
                : Mathf.Lerp(.076f, .142f, cadenceNoise);
            nextFrameAt = time + interval;

            var holdNoise = Mathf.PerlinNoise(29.47f, stepCount * .131f);
            var holdThreshold = reducedMotion ? .10f : .18f;
            if (holdNoise < holdThreshold)
                return;

            // Interior reversals are intentionally rare and use a separate noise
            // series from cadence/hold. This prevents a shared short loop while
            // retaining adjacent frames and coherent flame silhouettes.
            if (!reducedMotion && frameIndex >= 2 && frameIndex <= 9)
            {
                var reverseNoise = Mathf.PerlinNoise(37.19f, stepCount * .173f);
                if (reverseNoise > .84f)
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
