#if VAMPPON_U48_ASSET_PREVIEW
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using UnityEngine;
using UnityEngine.UI;

namespace VampPon.UnitySpike.Runtime.Visuals
{
    public sealed class U48AssetPreviewSceneBinder : MonoBehaviour
    {
        private readonly List<(SpriteRenderer renderer, Sprite sprite)> rendererOriginals = new();
        private readonly List<(Image image, Sprite sprite)> imageOriginals = new();
        private Coroutine binding;
        private U48KokuyouPreviewPresenter kokuyouPresenter;
        private U48GroundAreaPreviewTintBinder groundAreaTintBinder;
        private U48BatchCUiPreviewBinder uiBinder;
        private bool restored;

        public static void AttachIfActive(GameObject owner)
        {
            if (!U48AssetPreviewProvider.IsSessionActive || owner == null) return;
            if (owner.GetComponent<U48AssetPreviewSceneBinder>() == null) owner.AddComponent<U48AssetPreviewSceneBinder>();
        }

        private void Awake()
        {
            binding = StartCoroutine(BindAfterSceneConstruction());
        }

        private IEnumerator BindAfterSceneConstruction()
        {
            yield return null;
            var entry = U48AssetPreviewProvider.ActiveEntry ?? throw new InvalidOperationException("U48 preview session ended before scene binding.");
            var slot = Enum.Parse<U48AssetPreviewSlot>(entry.slot, true);
            if (slot == U48AssetPreviewSlot.Kokuyou)
            {
                kokuyouPresenter = gameObject.AddComponent<U48KokuyouPreviewPresenter>();
                kokuyouPresenter.Initialize(entry, U48AssetPreviewProvider.LoadPrimarySprite(entry.resourcePath));
                binding = null;
                yield break;
            }
            if (slot == U48AssetPreviewSlot.GroundArea) groundAreaTintBinder = gameObject.AddComponent<U48GroundAreaPreviewTintBinder>();
            if (slot is U48AssetPreviewSlot.Hud or U48AssetPreviewSlot.LevelUp or U48AssetPreviewSlot.Replacement or U48AssetPreviewSlot.Result or U48AssetPreviewSlot.StageSelect)
            {
                uiBinder = gameObject.AddComponent<U48BatchCUiPreviewBinder>();
                uiBinder.Initialize(entry, U48AssetPreviewProvider.LoadPrimarySprite(entry.resourcePath));
                binding = null;
                yield break;
            }
            if (slot is U48AssetPreviewSlot.Player or U48AssetPreviewSlot.Enemy or U48AssetPreviewSlot.ExpPickup or U48AssetPreviewSlot.HealingPickup or U48AssetPreviewSlot.Projectile or U48AssetPreviewSlot.Hit or U48AssetPreviewSlot.EnemyDeath or U48AssetPreviewSlot.Trail or U48AssetPreviewSlot.GroundArea)
            {
                binding = null;
                yield break;
            }
            if (entry.targetObjectNames == null || entry.targetObjectNames.Length == 0)
                throw new InvalidOperationException("U48 scene-bound preview entry has no target object names: " + entry.assetGroup);
            var sprite = U48AssetPreviewProvider.LoadPrimarySprite(entry.resourcePath);
            var targets = FindObjectsByType<Transform>(FindObjectsInactive.Include)
                .Where(value => entry.targetObjectNames.Contains(value.name, StringComparer.Ordinal)).ToArray();
            if (targets.Length == 0) throw new InvalidOperationException("U48 preview target objects were not found: " + string.Join(",", entry.targetObjectNames));
            foreach (var target in targets)
            {
                var renderer = target.GetComponent<SpriteRenderer>();
                if (renderer != null) { rendererOriginals.Add((renderer, renderer.sprite)); renderer.sprite = sprite; }
                var image = target.GetComponent<Image>();
                if (image != null) { imageOriginals.Add((image, image.sprite)); image.sprite = sprite; }
            }
            if (rendererOriginals.Count + imageOriginals.Count == 0) throw new InvalidOperationException("U48 preview targets have no supported SpriteRenderer/Image component.");
            binding = null;
        }

        public void Restore()
        {
            if (restored) return;
            restored = true;
            if (binding != null) { StopCoroutine(binding); binding = null; }
            foreach (var value in rendererOriginals) if (value.renderer != null) value.renderer.sprite = value.sprite;
            foreach (var value in imageOriginals) if (value.image != null) value.image.sprite = value.sprite;
            rendererOriginals.Clear();
            imageOriginals.Clear();
            if (kokuyouPresenter != null) { Destroy(kokuyouPresenter); kokuyouPresenter = null; }
            if (groundAreaTintBinder != null) { groundAreaTintBinder.Restore(); Destroy(groundAreaTintBinder); groundAreaTintBinder = null; }
            if (uiBinder != null) { uiBinder.Restore(); Destroy(uiBinder); uiBinder = null; }
        }

        private void OnDisable() => Restore();
        private void OnDestroy()
        {
            StopAllCoroutines();
            Restore();
        }
    }
}
#endif
