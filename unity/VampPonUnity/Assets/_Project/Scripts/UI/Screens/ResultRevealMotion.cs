using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace VampPon.UnitySpike.UI.Screens
{
    public sealed class ResultRevealMotion : MonoBehaviour
    {
        private static readonly string[][] RevealGroups =
        {
            new[] { "Outcome", "Title", "Stage", "RankSeal", "Rank" },
            new[] { "StatChip", "U47GameplaySummary" },
            new[] { "RewardsTitle", "RewardsEmpty", "RewardCard", "Records", "SaveStatus" },
            new[] { "RetryButton", "StageSelectButton" },
        };

        private Coroutine routine;

        private void OnEnable()
        {
            if (routine != null) StopCoroutine(routine);
            routine = StartCoroutine(Reveal());
        }

        private void OnDisable()
        {
            if (routine != null) StopCoroutine(routine);
            routine = null;
        }

        private IEnumerator Reveal()
        {
            yield return null;
            var reducedMotion =
                PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1 ||
                PlayerPrefs.GetInt("reduce_motion", 0) == 1;
            var groups = ResolveGroups();
            var baselines = new Dictionary<RectTransform, Vector2>();

            foreach (var group in groups)
                foreach (var item in group)
                    if (!baselines.ContainsKey(item)) baselines.Add(item, item.anchoredPosition);

            foreach (var group in groups)
                foreach (var item in group)
                    SetPose(item, baselines[item], 0f, reducedMotion ? 0f : -10f);

            if (reducedMotion)
            {
                foreach (var group in groups)
                    foreach (var item in group) SetPose(item, baselines[item], 1f, 0f);
                routine = null;
                yield break;
            }

            for (var groupIndex = 0; groupIndex < groups.Count; groupIndex++)
            {
                var duration = groupIndex == 2 ? .22f : .18f;
                var start = Time.unscaledTime;
                while (Time.unscaledTime - start < duration)
                {
                    var t = Mathf.Clamp01((Time.unscaledTime - start) / duration);
                    var eased = 1f - Mathf.Pow(1f - t, 3f);
                    foreach (var item in groups[groupIndex])
                        SetPose(item, baselines[item], eased, Mathf.Lerp(-10f, 0f, eased));
                    yield return null;
                }
                foreach (var item in groups[groupIndex]) SetPose(item, baselines[item], 1f, 0f);
                if (groupIndex < groups.Count - 1)
                {
                    var gapStart = Time.unscaledTime;
                    while (Time.unscaledTime - gapStart < .055f) yield return null;
                }
            }
            routine = null;
        }

        private List<List<RectTransform>> ResolveGroups()
        {
            var result = new List<List<RectTransform>>();
            var rects = GetComponentsInChildren<RectTransform>(true);
            foreach (var names in RevealGroups)
            {
                var group = new List<RectTransform>();
                foreach (var rect in rects)
                    foreach (var name in names)
                        if (rect.name == name)
                        {
                            group.Add(rect);
                            break;
                        }
                result.Add(group);
            }
            return result;
        }

        private static void SetPose(RectTransform rect, Vector2 baseline, float alpha, float yOffset)
        {
            if (rect == null) return;
            var canvasGroup = rect.GetComponent<CanvasGroup>();
            if (canvasGroup == null) canvasGroup = rect.gameObject.AddComponent<CanvasGroup>();
            canvasGroup.alpha = alpha;
            rect.anchoredPosition = baseline + new Vector2(0f, yOffset);
        }
    }
}
