using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    public static class U8VisualCandidateScreenshotCapture
    {
        private const string CandidateRoot = "Assets/_Project/Resources/U8Candidates";
        private const string OutputDirectory = "../../docs/design-targets/generated/unity-u8/screenshots";
        private const string ReportPath = "Logs/u8_visual_candidate_screenshot_report.txt";

        private static readonly Profile[] Profiles =
        {
            new(390, 844, "u8-candidates-390x844.png"),
            new(360, 800, "u8-candidates-360x800.png"),
            new(430, 932, "u8-candidates-430x932.png"),
        };

        private readonly struct Profile
        {
            public Profile(int width, int height, string fileName)
            {
                Width = width;
                Height = height;
                FileName = fileName;
            }

            public int Width { get; }
            public int Height { get; }
            public string FileName { get; }
        }

        public static void Run()
        {
            try
            {
                U8VisualCandidateImportSetup.Run();
                Directory.CreateDirectory("Logs");
                Directory.CreateDirectory(OutputDirectory);

                var projectRoot = Directory.GetParent(Application.dataPath)?.FullName ?? Directory.GetCurrentDirectory();
                var texturePaths = AssetDatabase.FindAssets("t:Texture2D", new[] { CandidateRoot })
                    .Select(AssetDatabase.GUIDToAssetPath)
                    .OrderBy(path => path, StringComparer.Ordinal)
                    .ToArray();
                if (texturePaths.Length != 12)
                {
                    throw new InvalidOperationException($"Expected 12 U8 candidate textures, found {texturePaths.Length}.");
                }

                var textures = texturePaths
                    .Select(path => LoadTexture(Path.GetFullPath(Path.Combine(projectRoot, path)), Path.GetFileNameWithoutExtension(path)))
                    .ToArray();
                var log = new List<string>();
                foreach (var profile in Profiles)
                {
                    var path = CaptureComposite(projectRoot, profile, textures);
                    var info = new FileInfo(path);
                    log.Add($"{profile.Width}x{profile.Height}: {profile.FileName}, bytes={info.Length}");
                }

                log.Add("Textures:");
                log.AddRange(texturePaths);
                File.WriteAllText(ReportPath, string.Join(Environment.NewLine, log));

                foreach (var texture in textures)
                {
                    UnityEngine.Object.DestroyImmediate(texture);
                }

                EditorApplication.Exit(0);
            }
            catch (Exception ex)
            {
                Debug.LogError(ex);
                File.WriteAllText(ReportPath, ex.ToString());
                EditorApplication.Exit(1);
            }
        }

        private static Texture2D LoadTexture(string absolutePath, string name)
        {
            var texture = new Texture2D(2, 2, TextureFormat.RGBA32, false);
            if (!texture.LoadImage(File.ReadAllBytes(absolutePath)))
            {
                throw new InvalidOperationException($"Texture load failed: {absolutePath}");
            }

            texture.name = name;
            return texture;
        }

        private static string CaptureComposite(string projectRoot, Profile profile, Texture2D[] textures)
        {
            var outputPath = Path.GetFullPath(Path.Combine(projectRoot, OutputDirectory, profile.FileName));
            if (File.Exists(outputPath))
            {
                File.Delete(outputPath);
            }

            var canvas = new Texture2D(profile.Width, profile.Height, TextureFormat.RGBA32, false);
            Fill(canvas, new Color32(28, 25, 22, 255));

            const int columns = 2;
            const int rows = 6;
            var cellWidth = profile.Width / columns;
            var cellHeight = profile.Height / rows;
            for (var index = 0; index < textures.Length; index++)
            {
                var column = index % columns;
                var row = index / columns;
                var maxWidth = Mathf.RoundToInt(cellWidth * 0.72f);
                var maxHeight = Mathf.RoundToInt(cellHeight * 0.72f);
                var scaled = ScaleToFit(textures[index], maxWidth, maxHeight);
                var x = column * cellWidth + (cellWidth - scaled.width) / 2;
                var y = profile.Height - ((row + 1) * cellHeight) + (cellHeight - scaled.height) / 2;
                AlphaBlend(canvas, scaled, x, y);
                UnityEngine.Object.DestroyImmediate(scaled);
            }

            canvas.Apply();
            File.WriteAllBytes(outputPath, canvas.EncodeToPNG());
            UnityEngine.Object.DestroyImmediate(canvas);
            return outputPath;
        }

        private static void Fill(Texture2D texture, Color32 color)
        {
            var pixels = Enumerable.Repeat(color, texture.width * texture.height).ToArray();
            texture.SetPixels32(pixels);
        }

        private static Texture2D ScaleToFit(Texture2D source, int maxWidth, int maxHeight)
        {
            var scale = Mathf.Min(maxWidth / (float)source.width, maxHeight / (float)source.height, 1f);
            var width = Mathf.Max(1, Mathf.RoundToInt(source.width * scale));
            var height = Mathf.Max(1, Mathf.RoundToInt(source.height * scale));
            var target = new Texture2D(width, height, TextureFormat.RGBA32, false);

            for (var y = 0; y < height; y++)
            {
                for (var x = 0; x < width; x++)
                {
                    var u = width <= 1 ? 0f : x / (float)(width - 1);
                    var v = height <= 1 ? 0f : y / (float)(height - 1);
                    target.SetPixel(x, y, source.GetPixelBilinear(u, v));
                }
            }

            target.Apply();
            return target;
        }

        private static void AlphaBlend(Texture2D canvas, Texture2D source, int offsetX, int offsetY)
        {
            for (var y = 0; y < source.height; y++)
            {
                var targetY = offsetY + y;
                if (targetY < 0 || targetY >= canvas.height)
                {
                    continue;
                }

                for (var x = 0; x < source.width; x++)
                {
                    var targetX = offsetX + x;
                    if (targetX < 0 || targetX >= canvas.width)
                    {
                        continue;
                    }

                    var src = source.GetPixel(x, y);
                    if (src.a <= 0f)
                    {
                        continue;
                    }

                    var dst = canvas.GetPixel(targetX, targetY);
                    var alpha = src.a;
                    var inv = 1f - alpha;
                    var blended = new Color(
                        src.r * alpha + dst.r * inv,
                        src.g * alpha + dst.g * inv,
                        src.b * alpha + dst.b * inv,
                        1f);
                    canvas.SetPixel(targetX, targetY, blended);
                }
            }
        }
    }
}
