using System.IO;
using UnityEditor;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    public static class U8VisualCandidateImportSetup
    {
        private const string CandidateRoot = "Assets/_Project/Resources/U8Candidates";

        [MenuItem("VampPon/U8/Apply Visual Candidate Import Settings")]
        public static void Run()
        {
            var guids = AssetDatabase.FindAssets("t:Texture2D", new[] { CandidateRoot });
            foreach (var guid in guids)
            {
                var path = AssetDatabase.GUIDToAssetPath(guid);
                var importer = AssetImporter.GetAtPath(path) as TextureImporter;
                if (importer == null)
                {
                    continue;
                }

                importer.textureType = TextureImporterType.Sprite;
                importer.spriteImportMode = SpriteImportMode.Single;
                importer.alphaSource = TextureImporterAlphaSource.FromInput;
                importer.alphaIsTransparency = true;
                importer.mipmapEnabled = false;
                importer.filterMode = FilterMode.Bilinear;
                importer.wrapMode = TextureWrapMode.Clamp;
                importer.textureCompression = TextureImporterCompression.Uncompressed;
                importer.spritePixelsPerUnit = PixelsPerUnit(path);
                importer.SaveAndReimport();
            }

            Debug.Log($"U8 visual candidate import settings applied: {guids.Length} texture(s)");
        }

        private static float PixelsPerUnit(string path)
        {
            var normalized = path.Replace(Path.DirectorySeparatorChar, '/');
            if (normalized.Contains("/FullscreenArt/"))
            {
                return 240f;
            }

            if (normalized.Contains("/VFX/"))
            {
                return 900f;
            }

            return 100f;
        }
    }
}
