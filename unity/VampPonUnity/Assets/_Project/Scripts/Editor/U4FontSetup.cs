using System.IO;
using TMPro;
using TMPro.EditorUtilities;
using UnityEditor;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    public static class U4FontSetup
    {
        private const string FontTtfPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium.ttf";
        private const string OutputDir = "Assets/_Project/Fonts/ZenMaruGothic";
        private const string ResourcesDir = "Assets/_Project/Resources";

        [MenuItem("VampPon/U4/Generate TMP Font Asset")]
        public static void GenerateFontAsset()
        {
            var font = AssetDatabase.LoadAssetAtPath<Font>(FontTtfPath);
            if (font == null)
            {
                Debug.LogError($"Font not found at {FontTtfPath}");
                return;
            }

            var japaneseChars =
                "あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん" +
                "がぎぐげござじずぜぞだぢづでどばびぶべぼぱぴぷぺぽ" +
                "ぁぃぅぇぉっゃゅょ" +
                "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン" +
                "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポ" +
                "ァィゥェォッャュョヴ" +
                "ー・「」（）、。！？…〜『』" +
                "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz" +
                "0123456789" +
                " +-×÷=<>%#@&*/:;,.!?\"'()[]{}|~^_\\$€¥" +
                "記憶灯影墨紙夜明朝光闇守護風扇引力歩足暖外套被害減和栞範囲広攻撃速度忘鈴怯音" +
                "覚醒扉条件満開未知力将来実装選決定" +
                "武器基本遠距離周囲結界張近弾前方押返" +
                "欠片遠寄移動上" +
                "暗中軽取" +
                "少和" +
                "強" +
                "一瞬" +
                "通常候補出" +
                "パッシブレアLvNormalGoodRare" +
                "黒耀化" +
                "ランタンインクオンブロ" +
                "ヨルノシルベ" +
                "よみがえるひとつください";

            var sdfAssetPath = Path.Combine(OutputDir, "ZenMaruGothic-Medium SDF.asset");

            var fontAsset = TMP_FontAsset.CreateFontAsset(font, 36, 4,
                UnityEngine.TextCore.LowLevel.GlyphRenderMode.SDFAA,
                1024, 1024);

            if (fontAsset == null)
            {
                Debug.LogError("Failed to create TMP_FontAsset");
                return;
            }

            fontAsset.name = "ZenMaruGothic-Medium SDF";
            AssetDatabase.CreateAsset(fontAsset, sdfAssetPath);

            var charArray = japaneseChars.ToCharArray();
            var unicodeArray = new uint[charArray.Length];
            for (var i = 0; i < charArray.Length; i++)
            {
                unicodeArray[i] = charArray[i];
            }

            fontAsset.TryAddCharacters(unicodeArray);

            EditorUtility.SetDirty(fontAsset);
            AssetDatabase.SaveAssets();

            if (!Directory.Exists(ResourcesDir))
            {
                Directory.CreateDirectory(ResourcesDir);
            }

            var resourcesAssetPath = Path.Combine(ResourcesDir, "ZenMaruGothic-Medium SDF.asset");
            if (!File.Exists(resourcesAssetPath))
            {
                AssetDatabase.CopyAsset(sdfAssetPath, resourcesAssetPath);
            }

            AssetDatabase.Refresh();
            Debug.Log($"TMP Font Asset created at {sdfAssetPath}");
            Debug.Log($"TMP Font Asset copied to {resourcesAssetPath}");
        }
    }
}
