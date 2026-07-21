#if UNITY_EDITOR
using System;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using UnityEditor;
using UnityEngine;
using VampPon.UnitySpike.Runtime.Visuals;

namespace VampPon.UnitySpike.Editor
{
    public static class U48ProductionVisualCatalogBuilder
    {
        private const string Root = "Assets/_Project/Art/Production/U48";
        private const string DirectoryPath = "Assets/_Project/Resources/Production/U48";
        private const string AssetPath = DirectoryPath + "/U48ProductionVisualCatalog.asset";
        [MenuItem("VampPon/U48/Build Production Visual Catalog")]
        public static void Build()
        {
            Directory.CreateDirectory(Path.Combine(Application.dataPath, "_Project/Resources/Production/U48")); AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            var paths = AssetDatabase.FindAssets("t:Texture2D", new[] { Root }).Select(AssetDatabase.GUIDToAssetPath).OrderBy(value => value, StringComparer.Ordinal).ToArray();
            if (paths.Length != 46) throw new InvalidOperationException("Expected 46 U48 production textures, found " + paths.Length);
            var entries = paths.Select(path =>
            {
                var sprites = AssetDatabase.LoadAllAssetsAtPath(path).OfType<Sprite>().OrderBy(value => value.name, StringComparer.Ordinal).ToArray();
                if (sprites.Length == 0) throw new InvalidOperationException("Production sprite import missing: " + path);
                var absolute = Path.GetFullPath(Path.Combine(Application.dataPath, "..", path));
                return new U48ProductionVisualCatalog.Entry { assetGroup = Path.GetFileNameWithoutExtension(path), productionPath = "unity/VampPonUnity/" + path, productionSha256 = Hash(absolute), primary = sprites[0], sprites = sprites };
            }).ToArray();
            var catalog = AssetDatabase.LoadAssetAtPath<U48ProductionVisualCatalog>(AssetPath);
            if (catalog == null) { catalog = ScriptableObject.CreateInstance<U48ProductionVisualCatalog>(); AssetDatabase.CreateAsset(catalog, AssetPath); }
            catalog.ConfigureForEditor(entries); EditorUtility.SetDirty(catalog); AssetDatabase.SaveAssets(); AssetDatabase.Refresh();
            Debug.Log("U48 production visual catalog built: 46 entries.");
        }
        private static string Hash(string path) { using var algorithm = SHA256.Create(); return BitConverter.ToString(algorithm.ComputeHash(File.ReadAllBytes(path))).Replace("-", string.Empty, StringComparison.Ordinal).ToLowerInvariant(); }
    }
}
#endif
