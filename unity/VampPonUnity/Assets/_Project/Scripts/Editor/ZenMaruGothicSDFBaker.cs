using System;
using System.Collections.Generic;
using System.IO;
using TMPro;
using UnityEditor;
using UnityEngine;
using UnityEngine.TextCore.LowLevel;

namespace VampPon.UnitySpike.Editor
{
    public static class ZenMaruGothicSDFBaker
    {
        private const string FontPath = "Assets/_Project/Fonts/ZenMaruGothic/ZenMaruGothic-Medium.ttf";
        private const string OutputDir = "Assets/_Project/Fonts/ZenMaruGothic";
        private const string AssetName = "ZenMaruGothic-Medium SDF";
        private const string ReportPath = "Logs/zen_maru_gothic_sdf_bake_report.txt";

        private const int SamplingPointSize = 48;
        private const int AtlasPadding = 5;
        private const int AtlasWidth = 1024;
        private const int AtlasHeight = 1024;

        private static readonly string ProofCharacters = string.Join("", new[]
        {
            "今夜の記録拾った記憶次へ欠片朝加護墨灯",
            "行き先路地出発静かな道見える爆脈動",
            "黒耀化レア演出",
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
            "0123456789",
            " +-×÷=/()[]{}.,;:!?\"'@#$%&*<>_|~^`",
            "ヨルノシルベ",
            "はじまりのステージ",
            "記憶帳台帳手帳旅日誌",
            "閉じる戻る確認選ぶ続ける終わる",
            "難易度挑戦冒険探索",
            "報酬結果成績達成評価",
            "新しい獲得解放発見",
            "ランタン光影闇夜明け",
            "仲間味方守る導く",
            "危険注意警告",
        });

        public static void Run()
        {
            try
            {
                Directory.CreateDirectory("Logs");
                var log = new List<string>();

                var font = AssetDatabase.LoadAssetAtPath<Font>(FontPath);
                if (font == null)
                {
                    throw new InvalidOperationException($"Font not found at {FontPath}");
                }

                log.Add($"Source font: {FontPath}");
                log.Add($"Font name: {font.name}");

                var uniqueChars = new HashSet<char>();
                foreach (var c in ProofCharacters)
                {
                    if (!char.IsWhiteSpace(c) || c == ' ')
                    {
                        uniqueChars.Add(c);
                    }
                }

                var charArray = new char[uniqueChars.Count];
                uniqueChars.CopyTo(charArray);
                Array.Sort(charArray);
                var characterSet = new string(charArray);
                log.Add($"Character count: {characterSet.Length}");

                var fontAsset = TMP_FontAsset.CreateFontAsset(
                    font,
                    SamplingPointSize,
                    AtlasPadding,
                    GlyphRenderMode.SDFAA,
                    AtlasWidth,
                    AtlasHeight
                );

                if (fontAsset == null)
                {
                    throw new InvalidOperationException("TMP_FontAsset.CreateFontAsset returned null");
                }

                fontAsset.name = AssetName;

                uint[] unicodes = new uint[characterSet.Length];
                for (int i = 0; i < characterSet.Length; i++)
                {
                    unicodes[i] = characterSet[i];
                }

                bool tryResult = fontAsset.TryAddCharacters(unicodes, out uint[] missing);
                log.Add($"TryAddCharacters result: {tryResult}");
                log.Add($"Missing glyphs: {(missing != null ? missing.Length : 0)}");

                if (missing != null && missing.Length > 0)
                {
                    foreach (var m in missing)
                    {
                        log.Add($"  Missing: U+{m:X4} ({(char)m})");
                    }
                }

                var assetPath = Path.Combine(OutputDir, AssetName + ".asset");
                var existingAsset = AssetDatabase.LoadAssetAtPath<TMP_FontAsset>(assetPath);
                if (existingAsset != null)
                {
                    AssetDatabase.DeleteAsset(assetPath);
                }

                AssetDatabase.CreateAsset(fontAsset, assetPath);

                if (fontAsset.atlasTexture != null)
                {
                    fontAsset.atlasTexture.name = AssetName + " Atlas";
                    AssetDatabase.AddObjectToAsset(fontAsset.atlasTexture, assetPath);
                }

                if (fontAsset.material != null)
                {
                    fontAsset.material.name = AssetName + " Material";
                    AssetDatabase.AddObjectToAsset(fontAsset.material, assetPath);
                }

                AssetDatabase.SaveAssets();
                AssetDatabase.Refresh();

                log.Add($"Asset saved: {assetPath}");
                var fileInfo = new FileInfo(Path.GetFullPath(assetPath));
                log.Add($"Asset size: {fileInfo.Length} bytes");
                log.Add($"Atlas: {AtlasWidth}x{AtlasHeight}");
                log.Add($"Sampling: {SamplingPointSize}pt, padding: {AtlasPadding}");
                log.Add("Bake completed successfully");

                File.WriteAllText(ReportPath, string.Join(Environment.NewLine, log));
                Debug.Log($"ZenMaruGothic SDF bake complete: {assetPath}");
                EditorApplication.Exit(0);
            }
            catch (Exception ex)
            {
                Debug.LogError(ex);
                File.WriteAllText(ReportPath, ex.ToString());
                EditorApplication.Exit(1);
            }
        }
    }
}
