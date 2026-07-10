using System.Collections.Generic;
using UnityEditor;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    public static class UiSpriteImportPolicyValidator
    {
        private const string CandidateRoot = "Assets/_Project/Resources/U45Candidates/UI";

        private static readonly HashSet<string> StretchableSpriteNames = new()
        {
            "u45-stage-select-map-panel",
            "u45-stage-card-frame",
            "u45-battle-hud-top-frame",
            "u45-battle-inventory-slot-frame",
            "u45-levelup-card-common",
            "u45-levelup-card-rare",
            "u45-levelup-card-evolution",
            "u45-paper-button-frame",
        };

        [MenuItem("VampPon/UI/Validate UI Sprite Import Policy")]
        public static void ValidateFromMenu()
        {
            if (!Validate(logSuccess: true))
            {
                throw new System.InvalidOperationException("UI sprite import policy validation failed. See Console for details.");
            }
        }

        public static bool Validate(bool logSuccess)
        {
            var failures = new List<string>();
            var guids = AssetDatabase.FindAssets("t:Texture2D", new[] { CandidateRoot });

            foreach (var guid in guids)
            {
                var path = AssetDatabase.GUIDToAssetPath(guid);
                var importer = AssetImporter.GetAtPath(path) as TextureImporter;
                if (importer == null)
                {
                    failures.Add($"TextureImporter missing: {path}");
                    continue;
                }

                if (importer.textureType != TextureImporterType.Sprite)
                {
                    failures.Add($"Texture Type must be Sprite: {path}");
                }

                if (importer.mipmapEnabled)
                {
                    failures.Add($"Mipmaps must be disabled for UI: {path}");
                }

                if (!importer.alphaIsTransparency)
                {
                    failures.Add($"Alpha Is Transparency must be enabled: {path}");
                }

                if (importer.wrapMode != TextureWrapMode.Clamp)
                {
                    failures.Add($"Wrap Mode must be Clamp: {path}");
                }

                if (importer.filterMode != FilterMode.Bilinear)
                {
                    failures.Add($"UI candidate Filter Mode must be Bilinear: {path}");
                }

                var spriteName = System.IO.Path.GetFileNameWithoutExtension(path);
                if (StretchableSpriteNames.Contains(spriteName) && importer.spriteBorder.sqrMagnitude <= 0.01f)
                {
                    failures.Add($"Stretchable UI sprite requires a 9-slice border: {path}");
                }
            }

            foreach (var failure in failures)
            {
                Debug.LogError(failure);
            }

            if (failures.Count == 0 && logSuccess)
            {
                Debug.Log($"UI sprite import policy passed: {guids.Length} candidate textures checked.");
            }

            return failures.Count == 0;
        }
    }
}
