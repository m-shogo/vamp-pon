using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.UI.Screens
{
    /// <summary>
    /// Result is a payoff screen, not an ambient scene. Reveal hierarchy once,
    /// then settle completely so reward text stays readable.
    /// </summary>
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
            if (routine != null)
                StopCoroutine(routine);
            routine = StartCoroutine(Reveal());
        }

        private void OnDisable()
        {
            if (routine != null)
                StopCoroutine(routine);
            routine = null;
        }

        private IEnumerator Reveal()
        {
            // Show() rebuilds ResultMemoryPage immediately before enabling this object.
            yield return null;

            var reducedMotion =
                PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1 ||
                PlayerPrefs.GetInt("reduce_motion", 0) == 1;

            var groups = ResolveGroups();
            foreach (var group in groups)
                foreach (var item in group)
                    SetPose(item, 0f, reducedMotion ? 0f : -10f);

            if (reducedMotion)
            {
                foreach (var group in groups)
                    foreach (var item in group)
                        SetPose(item, 1f, 0f);
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
                        SetPose(item, eased, Mathf.Lerp(-10f, 0f, eased));
                    yield return null;
                }

                foreach (var item in groups[groupIndex])
                    SetPose(item, 1f, 0f);

                if (groupIndex < groups.Count - 1)
                {
                    var gapStart = Time.unscaledTime;
                    while (Time.unscaledTime - gapStart < .055f)
                        yield return null;
                }
            }

            routine = null;
        }

        private List<List<RectTransform>> ResolveGroups()
        {
            var result = new List<List<RectTransform>>();
            foreach (var names in RevealGroups)
            {
                var group = new List<RectTransform>();
                foreach (var rect in GetComponentsInChildren<RectTransform>(true))
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

        private static void SetPose(RectTransform rect, float alpha, float y)
        {
            if (rect == null)
                return;

            var canvasGroup = rect.GetComponent<CanvasGroup>();
            if (canvasGroup == null)
                canvasGroup = rect.gameObject.AddComponent<CanvasGroup>();
            canvasGroup.alpha = alpha;

            var position = rect.anchoredPosition;
            position.y = y;
            rect.anchoredPosition = position;
        }
    }
}
