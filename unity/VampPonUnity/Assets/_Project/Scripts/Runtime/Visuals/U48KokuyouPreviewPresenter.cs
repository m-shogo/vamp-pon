#if VAMPPON_U48_ASSET_PREVIEW
using System;
using UnityEngine;
using VampPon.UnitySpike.Player;
using VampPon.UnitySpike.Runtime.Gameplay;
using VampPon.UnitySpike.Runtime.Gameplay.State;

namespace VampPon.UnitySpike.Runtime.Visuals
{
    public sealed class U48KokuyouPreviewPresenter : MonoBehaviour
    {
        private Stage1GameplayRuntimeCoordinator gameplay;
        private PlayerController player;
        private SpriteRenderer aura;
        private KokuyouPhase expected;
        private float baseScale;
        private bool initialized;

        internal void Initialize(U48AssetPreviewEntry entry, Sprite sprite)
        {
            if (!Enum.TryParse(entry.kokuyouPhase, true, out expected)) throw new InvalidOperationException("U48 黒耀化 preview phase is invalid: " + entry.kokuyouPhase);
            gameplay = FindAnyObjectByType<Stage1GameplayRuntimeCoordinator>() ?? throw new InvalidOperationException("U48 黒耀化 preview gameplay runtime is missing.");
            player = FindAnyObjectByType<PlayerController>() ?? throw new InvalidOperationException("U48 黒耀化 preview player is missing.");
            var visual = new GameObject("U48KokuyouCandidateAura", typeof(SpriteRenderer));
            visual.transform.SetParent(transform, false);
            aura = visual.GetComponent<SpriteRenderer>(); aura.sprite = sprite; aura.sortingOrder = 9;
            var world = Mathf.Max(sprite.bounds.size.x, sprite.bounds.size.y);
            baseScale = (expected == KokuyouPhase.Active ? 1.45f : expected == KokuyouPhase.Ready ? 1.18f : 1.02f) / Mathf.Max(.001f, world);
            initialized = true; Refresh();
        }

        private void LateUpdate() { if (initialized) Refresh(); }
        private void Refresh()
        {
            if (aura == null || gameplay?.Run == null || player == null) return;
            aura.transform.position = player.transform.position;
            aura.enabled = gameplay.Run.Kokuyou.Phase == expected;
            var pulse = 1f + Mathf.Sin(Time.unscaledTime * (expected == KokuyouPhase.Active ? 4.2f : 2.3f)) * (expected == KokuyouPhase.Active ? .055f : .025f);
            aura.transform.localScale = Vector3.one * baseScale * pulse;
        }

        private void OnDestroy() { if (aura != null) Destroy(aura.gameObject); aura = null; gameplay = null; player = null; }
    }
}
#endif
