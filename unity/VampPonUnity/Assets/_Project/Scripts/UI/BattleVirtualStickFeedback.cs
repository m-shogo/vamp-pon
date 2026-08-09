using UnityEngine;
using VampPon.UnitySpike.Player;

namespace VampPon.UnitySpike.UI
{
    /// <summary>
    /// Visual-only feedback for the existing lower-left drag movement. It never reads
    /// pointer input itself and therefore cannot change gameplay; it mirrors the player's
    /// resolved velocity so the stick finally feels connected to motion.
    /// </summary>
    public sealed class BattleVirtualStickFeedback : MonoBehaviour
    {
        private PlayerController player;
        private RectTransform ring;
        private RectTransform knob;
        private Vector2 knobBase;
        private Vector3 knobBaseScale;

        public void Bind(PlayerController controller, RectTransform ringRect, RectTransform knobRect)
        {
            player = controller;
            ring = ringRect;
            knob = knobRect;
            if (knob != null)
            {
                knobBase = knob.anchoredPosition;
                knobBaseScale = knob.localScale;
            }
        }

        private void LateUpdate()
        {
            if (player == null || ring == null || knob == null)
                return;

            var velocity = player.RuntimeInputBlocked ? Vector2.zero : player.CurrentVelocity;
            var normalized = velocity.sqrMagnitude > .0001f
                ? Vector2.ClampMagnitude(velocity / 3.35f, 1f)
                : Vector2.zero;

            // Keep the visual travel deliberately inside the decorative ring. The player
            // position/input authority stays entirely inside PlayerController.
            knob.anchoredPosition = knobBase + normalized * 27f;

            var engaged = Mathf.Clamp01(normalized.magnitude);
            knob.localScale = knobBaseScale * Mathf.Lerp(.96f, 1.04f, engaged);
        }

        private void OnDisable()
        {
            if (knob == null)
                return;
            knob.anchoredPosition = knobBase;
            knob.localScale = knobBaseScale;
        }
    }
}
