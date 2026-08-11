using UnityEngine;

namespace VampPon.UnitySpike.Runtime.Gameplay.SelectedBaseWeapons
{
    /// <summary>
    /// Resets prototype-only projectile styling when the pooled projectile is disabled.
    /// This component is attached lazily at most once per projectile and owns no gameplay state.
    /// </summary>
    public sealed class EmberMatchcaseProjectileVisualResetter : MonoBehaviour
    {
        private SpriteRenderer spriteRenderer;
        private Vector3 baseScale;
        private bool baseScaleCaptured;

        public void Apply(SpriteRenderer renderer, Color tint, float scaleMultiplier)
        {
            if (renderer == null) return;
            if (!baseScaleCaptured)
            {
                baseScale = transform.localScale;
                baseScaleCaptured = true;
            }

            spriteRenderer = renderer;
            spriteRenderer.color = tint;
            transform.localScale = baseScale * scaleMultiplier;
        }

        public void ResetVisual()
        {
            if (spriteRenderer != null)
            {
                spriteRenderer.color = Color.white;
            }
            if (baseScaleCaptured)
            {
                transform.localScale = baseScale;
            }
        }

        private void OnDisable()
        {
            ResetVisual();
        }
    }
}
