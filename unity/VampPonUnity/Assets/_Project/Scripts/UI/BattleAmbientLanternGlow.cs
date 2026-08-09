using UnityEngine;

namespace VampPon.UnitySpike.UI
{
    /// <summary>
    /// Keeps the decorative battle lantern from reading as a static prototype
    /// placeholder without adding playfield movement or high-frequency motion.
    /// </summary>
    public sealed class BattleAmbientLanternGlow : MonoBehaviour
    {
        private SpriteRenderer spriteRenderer;
        private Vector3 baseScale;
        private Color baseColor;

        private void Awake()
        {
            spriteRenderer = GetComponent<SpriteRenderer>();
            baseScale = transform.localScale;
            if (spriteRenderer != null)
                baseColor = spriteRenderer.color;
        }

        private void OnEnable()
        {
            baseScale = transform.localScale;
            if (spriteRenderer != null)
                baseColor = spriteRenderer.color;
        }

        private void Update()
        {
            if (spriteRenderer == null)
                return;

            var reducedMotion =
                PlayerPrefs.GetInt("vamp_pon_reduced_motion", 0) == 1 ||
                PlayerPrefs.GetInt("reduce_motion", 0) == 1;

            if (reducedMotion)
            {
                transform.localScale = baseScale;
                spriteRenderer.color = baseColor;
                return;
            }

            var time = Time.unscaledTime;
            var slow = Mathf.PerlinNoise(2.73f, time * .12f);
            var micro = Mathf.PerlinNoise(8.19f, time * .31f);
            var mixed = slow * .72f + micro * .28f;

            var scale = Mathf.Lerp(.985f, 1.018f, mixed);
            transform.localScale = baseScale * scale;

            var color = baseColor;
            color.a = baseColor.a * Mathf.Lerp(.88f, 1.04f, mixed);
            spriteRenderer.color = color;
        }

        private void OnDisable()
        {
            transform.localScale = baseScale;
            if (spriteRenderer != null)
                spriteRenderer.color = baseColor;
        }
    }
}
