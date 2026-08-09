using System.Collections;
using UnityEngine;

namespace VampPon.UnitySpike.UI.Screens
{
    public sealed class CollectionDetailReveal : MonoBehaviour
    {
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
            var rect = transform as RectTransform;
            if (rect == null) yield break;

            var canvasGroup = GetComponent<CanvasGroup>();
            if (canvasGroup == null) canvasGroup = gameObject.AddComponent<CanvasGroup>();

            var reducedMotion =
                PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1 ||
                PlayerPrefs.GetInt("reduce_motion", 0) == 1;

            if (reducedMotion)
            {
                canvasGroup.alpha = 1f;
                rect.localScale = Vector3.one;
                routine = null;
                yield break;
            }

            canvasGroup.alpha = 0f;
            rect.localScale = new Vector3(.985f, .985f, 1f);
            var start = Time.unscaledTime;
            const float duration = .16f;
            while (Time.unscaledTime - start < duration)
            {
                var t = Mathf.Clamp01((Time.unscaledTime - start) / duration);
                var eased = 1f - Mathf.Pow(1f - t, 3f);
                canvasGroup.alpha = eased;
                var scale = Mathf.Lerp(.985f, 1f, eased);
                rect.localScale = new Vector3(scale, scale, 1f);
                yield return null;
            }

            canvasGroup.alpha = 1f;
            rect.localScale = Vector3.one;
            routine = null;
        }
    }
}
