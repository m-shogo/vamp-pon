using UnityEngine;
using VampPon.UnitySpike.Runtime.Visuals;

namespace VampPon.UnitySpike.Runtime.Gameplay
{
    public sealed class U47GroundAreaActor : MonoBehaviour
    {
        private SpriteRenderer renderer;
        public bool IsActive { get; private set; }
#if VAMPPON_AI_SIMULATOR_SMOKE
        internal int SortingOrder => renderer.sortingOrder;
        internal Bounds WorldBounds => renderer.bounds;
        internal bool RendererVisible => renderer.enabled && gameObject.activeInHierarchy;
#endif
        public static U47GroundAreaActor Create(Transform parent, Sprite candidateSprite, int index) { var root = new GameObject($"U47GroundAreaPooled_{index:00}", typeof(SpriteRenderer), typeof(U47GroundAreaActor)); root.transform.SetParent(parent, false); var actor = root.GetComponent<U47GroundAreaActor>(); actor.renderer = root.GetComponent<SpriteRenderer>(); actor.renderer.sprite = candidateSprite; actor.renderer.sortingOrder = 8; actor.Deactivate(); return actor; }
        public void Activate(string weaponId, Vector3 center, float radius) {
#if VAMPPON_U48_ASSET_PREVIEW
            if(!U48AssetPreviewProvider.IsSessionActive)
#endif
            renderer.sprite=U48ProductionVisualCatalog.LoadRequired().SpriteFor(weaponId switch{"black_ink_bottle"=>"ground-area-black-ink-bottle","streetlamp_ring"=>"ground-area-streetlamp-ring",_=>"ground-area-dawn-ink-lamp"}); transform.position = center; transform.localScale = Vector3.one * Mathf.Max(.25f, radius * 2f); renderer.color = Color.white; IsActive = true; gameObject.SetActive(true); }
        public void Deactivate() { IsActive = false; gameObject.SetActive(false); }
    }
}
