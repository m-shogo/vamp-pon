using UnityEngine;

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
        public void Activate(string weaponId, Vector3 center, float radius) { transform.position = center; transform.localScale = Vector3.one * Mathf.Max(.25f, radius * 2f); renderer.color = weaponId switch { "black_ink_bottle" => new Color(.035f,.02f,.03f,.55f), "streetlamp_ring" => new Color(1f,.58f,.18f,.34f), _ => new Color(.45f,.18f,.12f,.46f) }; IsActive = true; gameObject.SetActive(true); }
        public void Deactivate() { IsActive = false; gameObject.SetActive(false); }
    }
}
