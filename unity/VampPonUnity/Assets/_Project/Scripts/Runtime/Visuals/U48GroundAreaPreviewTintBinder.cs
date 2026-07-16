#if VAMPPON_U48_ASSET_PREVIEW
using System.Collections.Generic;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Gameplay;

namespace VampPon.UnitySpike.Runtime.Visuals
{
    public sealed class U48GroundAreaPreviewTintBinder : MonoBehaviour
    {
        private readonly Dictionary<SpriteRenderer, Color> originals = new();
        private void LateUpdate()
        {
            foreach (var actor in FindObjectsByType<U47GroundAreaActor>(FindObjectsInactive.Exclude))
            {
                var renderer = actor.GetComponent<SpriteRenderer>(); if (renderer == null) continue;
                if (!originals.ContainsKey(renderer)) originals.Add(renderer, renderer.color);
                renderer.color = Color.white;
            }
        }
        public void Restore() { foreach (var value in originals) if (value.Key != null) value.Key.color = value.Value; originals.Clear(); }
        private void OnDestroy() => Restore();
    }
}
#endif
