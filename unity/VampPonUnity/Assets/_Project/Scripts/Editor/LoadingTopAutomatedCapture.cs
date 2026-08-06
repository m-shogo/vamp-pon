using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;
using UnityEngine.UI;
using VampPon.UnitySpike.UI.Screens;

namespace VampPon.UnitySpike.Editor
{
    [InitializeOnLoad]
    public static class LoadingTopAutomatedCapture
    {
        private const string ActiveKey = "VampPon.LoadingCapture.Active";
        private const string IndexKey = "VampPon.LoadingCapture.Index";
        private const string PhaseKey = "VampPon.LoadingCapture.Phase";
        private const string StartedAtKey = "VampPon.LoadingCapture.StartedAt";
        private const string RequestedAtKey = "VampPon.LoadingCapture.RequestedAt";
        private const string RequestedPathKey = "VampPon.LoadingCapture.RequestedPath";
        private const string OutputRelativePath =
            "docs/design-targets/generated/loading-seasonal-v1/runtime-captures";
        private const string ManifestRelativePath =
            "docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json";
        private const string RecordsFileName = ".capture-records.jsonl";

        private static readonly CaptureDefinition[] Captures = BuildCaptures();

        static LoadingTopAutomatedCapture()
        {
            if (SessionState.GetBool(ActiveKey, false))
                RegisterCallbacks();
        }

        [MenuItem("Vamp Pon/Loading Seasonal/Capture/Run Full 15-Frame Pack")]
        public static void RunFromMenu()
        {
            StartCapturePack();
        }

        public static void RunFromCommandLine()
        {
            StartCapturePack();
        }

        private static void StartCapturePack()
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode)
                throw new InvalidOperationException(
                    "Stop Play Mode before starting the automated Loading/TOP capture pack.");

            var output = ResolveOutputDirectory();
            Directory.CreateDirectory(output);
            foreach (var file in Directory.GetFiles(output, "*.png"))
                File.Delete(file);
            var records = Path.Combine(output, RecordsFileName);
            if (File.Exists(records))
                File.Delete(records);

            WriteManifest(new CaptureManifest
            {
                schemaVersion = 1,
                executed = false,
                result = "RUNNING",
                expectedCaptureCount = Captures.Length,
                captureCount = 0,
                generatedAtUtc = string.Empty,
                error = string.Empty,
                captures = Array.Empty<CaptureRecord>(),
            });

            SessionState.SetBool(ActiveKey, true);
            SessionState.SetInt(IndexKey, 0);
            SessionState.SetString(PhaseKey, "prepare");
            SessionState.SetString(RequestedPathKey, string.Empty);
            RegisterCallbacks();
            Debug.Log($"Loading/TOP automated capture started: {Captures.Length} frames.");
        }

        private static void RegisterCallbacks()
        {
            EditorApplication.update -= Tick;
            EditorApplication.update += Tick;
        }

        private static void Tick()
        {
            if (!SessionState.GetBool(ActiveKey, false))
            {
                EditorApplication.update -= Tick;
                return;
            }

            try
            {
                if (EditorApplication.isCompiling || EditorApplication.isUpdating)
                    return;

                var index = SessionState.GetInt(IndexKey, 0);
                if (index >= Captures.Length)
                {
                    FinishSuccessfully();
                    return;
                }

                var capture = Captures[index];
                switch (SessionState.GetString(PhaseKey, "prepare"))
                {
                    case "prepare":
                        PrepareCapture(capture);
                        break;
                    case "enter":
                        WaitForPlayMode();
                        break;
                    case "wait":
                        WaitForFrame(capture);
                        break;
                    case "capturing":
                        WaitForScreenshot(capture);
                        break;
                    case "exit":
                        WaitForExit();
                        break;
                    default:
                        throw new InvalidOperationException(
                            "Unknown automated capture phase: " +
                            SessionState.GetString(PhaseKey, string.Empty));
                }
            }
            catch (Exception exception)
            {
                Fail(exception);
            }
        }

        private static void PrepareCapture(CaptureDefinition capture)
        {
            if (EditorApplication.isPlaying)
            {
                EditorApplication.ExitPlaymode();
                return;
            }

            OpenStartupScene();
            SetGameViewSize(capture.width, capture.height);
            LoadingSeasonalView.SetCaptureOverride(
                capture.artIndex >= 0 ? capture.artIndex : 0,
                capture.kind == "loading");

            SessionState.SetString(PhaseKey, "enter");
            SessionState.SetString(StartedAtKey, EditorApplication.timeSinceStartup.ToString("R"));
            EditorApplication.EnterPlaymode();
        }

        private static void WaitForPlayMode()
        {
            if (!EditorApplication.isPlaying)
                return;

            SessionState.SetString(PhaseKey, "wait");
            SessionState.SetString(StartedAtKey, EditorApplication.timeSinceStartup.ToString("R"));
        }

        private static void WaitForFrame(CaptureDefinition capture)
        {
            if (!EditorApplication.isPlaying)
                return;

            var elapsed = EditorApplication.timeSinceStartup - ReadDouble(StartedAtKey);
            if (elapsed > 20d)
                throw new TimeoutException("Timed out waiting for runtime frame: " + capture.id);

            if (capture.kind == "loading")
            {
                var loading = UnityEngine.Object.FindFirstObjectByType<LoadingSeasonalView>();
                if (loading == null || !loading.gameObject.activeInHierarchy)
                    return;
                if (loading.SelectedArtIndex != capture.artIndex)
                    throw new InvalidOperationException(
                        $"Loading art mismatch for {capture.id}: expected {capture.artIndex}, actual {loading.SelectedArtIndex}.");
                if (!loading.GetComponentsInChildren<RawImage>(true).Any(value => value.texture != null))
                    return;
                if (elapsed < 2.2d)
                    return;
            }
            else
            {
                var loading = UnityEngine.Object.FindFirstObjectByType<LoadingSeasonalView>();
                var top = UnityEngine.Object.FindFirstObjectByType<TopLivingNightView>();
                if (loading != null && loading.gameObject.activeInHierarchy)
                    return;
                if (top == null || !top.gameObject.activeInHierarchy)
                    return;
                if (elapsed < 2.8d)
                    return;
            }

            var outputPath = Path.Combine(ResolveOutputDirectory(), capture.fileName);
            if (File.Exists(outputPath))
                File.Delete(outputPath);
            ScreenCapture.CaptureScreenshot(outputPath, 1);
            SessionState.SetString(RequestedPathKey, outputPath);
            SessionState.SetString(RequestedAtKey, EditorApplication.timeSinceStartup.ToString("R"));
            SessionState.SetString(PhaseKey, "capturing");
            Debug.Log($"Loading/TOP capture requested: {capture.id} -> {outputPath}");
        }

        private static void WaitForScreenshot(CaptureDefinition capture)
        {
            var path = SessionState.GetString(RequestedPathKey, string.Empty);
            var elapsed = EditorApplication.timeSinceStartup - ReadDouble(RequestedAtKey);
            if (elapsed > 15d)
                throw new TimeoutException("Timed out writing screenshot: " + capture.id);
            if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
                return;

            var info = new FileInfo(path);
            if (info.Length < 1024 || elapsed < .45d)
                return;

            var dimensions = ReadPngDimensions(path);
            if (dimensions.x != capture.width || dimensions.y != capture.height)
                throw new InvalidDataException(
                    $"Screenshot dimensions mismatch for {capture.id}: expected {capture.width}x{capture.height}, actual {dimensions.x}x{dimensions.y}.");

            AppendRecord(new CaptureRecord
            {
                id = capture.id,
                kind = capture.kind,
                season = capture.season,
                file = capture.fileName,
                width = dimensions.x,
                height = dimensions.y,
                sha256 = ComputeSha256(path),
            });

            SessionState.SetString(PhaseKey, "exit");
            EditorApplication.ExitPlaymode();
        }

        private static void WaitForExit()
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode)
                return;

            SessionState.SetInt(IndexKey, SessionState.GetInt(IndexKey, 0) + 1);
            SessionState.SetString(PhaseKey, "prepare");
        }

        private static void FinishSuccessfully()
        {
            LoadingSeasonalView.ClearCaptureOverride();
            var records = ReadRecords();
            if (records.Length != Captures.Length)
                throw new InvalidOperationException(
                    $"Capture record count mismatch: expected {Captures.Length}, actual {records.Length}.");

            WriteManifest(new CaptureManifest
            {
                schemaVersion = 1,
                executed = true,
                result = "PASSED",
                expectedCaptureCount = Captures.Length,
                captureCount = records.Length,
                generatedAtUtc = DateTime.UtcNow.ToString("O"),
                error = string.Empty,
                captures = records,
            });

            CleanupSession();
            Debug.Log($"Loading/TOP automated capture completed: {records.Length} frames.");
            EditorApplication.Exit(0);
        }

        private static void Fail(Exception exception)
        {
            try
            {
                LoadingSeasonalView.ClearCaptureOverride();
                WriteManifest(new CaptureManifest
                {
                    schemaVersion = 1,
                    executed = true,
                    result = "FAILED",
                    expectedCaptureCount = Captures.Length,
                    captureCount = ReadRecords().Length,
                    generatedAtUtc = DateTime.UtcNow.ToString("O"),
                    error = exception.ToString(),
                    captures = ReadRecords(),
                });
            }
            finally
            {
                CleanupSession();
                Debug.LogException(exception);
                EditorApplication.Exit(1);
            }
        }

        private static void CleanupSession()
        {
            SessionState.SetBool(ActiveKey, false);
            SessionState.EraseInt(IndexKey);
            SessionState.EraseString(PhaseKey);
            SessionState.EraseString(StartedAtKey);
            SessionState.EraseString(RequestedAtKey);
            SessionState.EraseString(RequestedPathKey);
            EditorApplication.update -= Tick;
        }

        private static void OpenStartupScene()
        {
            var scene = EditorBuildSettings.scenes.FirstOrDefault(value => value.enabled);
            if (scene == null || string.IsNullOrWhiteSpace(scene.path))
                throw new InvalidOperationException("No enabled startup scene exists in EditorBuildSettings.");
            if (EditorSceneManager.GetActiveScene().path != scene.path)
                EditorSceneManager.OpenScene(scene.path, OpenSceneMode.Single);
        }

        private static void SetGameViewSize(int width, int height)
        {
            var assembly = typeof(EditorWindow).Assembly;
            var gameViewType = assembly.GetType("UnityEditor.GameView")
                ?? throw new InvalidOperationException("UnityEditor.GameView type was not found.");
            var sizesType = assembly.GetType("UnityEditor.GameViewSizes")
                ?? throw new InvalidOperationException("UnityEditor.GameViewSizes type was not found.");
            var groupType = assembly.GetType("UnityEditor.GameViewSizeGroupType")
                ?? throw new InvalidOperationException("GameViewSizeGroupType was not found.");
            var sizeType = assembly.GetType("UnityEditor.GameViewSize")
                ?? throw new InvalidOperationException("GameViewSize type was not found.");
            var sizeKindType = assembly.GetType("UnityEditor.GameViewSizeType")
                ?? throw new InvalidOperationException("GameViewSizeType was not found.");

            var singleton = typeof(ScriptableSingleton<>).MakeGenericType(sizesType);
            var instance = singleton.GetProperty("instance", BindingFlags.Static | BindingFlags.Public)
                ?.GetValue(null)
                ?? throw new InvalidOperationException("GameViewSizes singleton was not available.");
            var groupName = EditorUserBuildSettings.activeBuildTarget == BuildTarget.iOS
                ? "iOS"
                : "Standalone";
            var groupValue = Enum.Parse(groupType, groupName);
            var group = sizesType.GetMethod("GetGroup", BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                ?.Invoke(instance, new[] { groupValue })
                ?? throw new InvalidOperationException("GameView size group was not available.");

            var groupRuntimeType = group.GetType();
            var getTotal = groupRuntimeType.GetMethod("GetTotalCount", BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                ?? throw new InvalidOperationException("GetTotalCount was not available.");
            var getSize = groupRuntimeType.GetMethod("GetGameViewSize", BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                ?? throw new InvalidOperationException("GetGameViewSize was not available.");
            var total = (int)getTotal.Invoke(group, null);
            var selectedIndex = -1;
            for (var index = 0; index < total; index++)
            {
                var size = getSize.Invoke(group, new object[] { index });
                var currentWidth = (int)(sizeType.GetProperty("width")?.GetValue(size) ?? -1);
                var currentHeight = (int)(sizeType.GetProperty("height")?.GetValue(size) ?? -1);
                if (currentWidth == width && currentHeight == height)
                {
                    selectedIndex = index;
                    break;
                }
            }

            if (selectedIndex < 0)
            {
                var constructor = sizeType.GetConstructor(
                    BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic,
                    null,
                    new[] { sizeKindType, typeof(int), typeof(int), typeof(string) },
                    null)
                    ?? throw new InvalidOperationException("GameViewSize constructor was not available.");
                var fixedResolution = Enum.Parse(sizeKindType, "FixedResolution");
                var customSize = constructor.Invoke(
                    new object[] { fixedResolution, width, height, $"VampPon {width}x{height}" });
                groupRuntimeType.GetMethod("AddCustomSize", BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                    ?.Invoke(group, new[] { customSize });
                selectedIndex = (int)getTotal.Invoke(group, null) - 1;
            }

            var gameView = EditorWindow.GetWindow(gameViewType);
            var selectedProperty = gameViewType.GetProperty(
                "selectedSizeIndex",
                BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                ?? throw new InvalidOperationException("GameView selectedSizeIndex was not available.");
            selectedProperty.SetValue(gameView, selectedIndex);
            gameView.Show();
            gameView.Focus();
            gameView.Repaint();
        }

        private static CaptureDefinition[] BuildCaptures()
        {
            var values = new List<CaptureDefinition>();
            var resolutions = new[]
            {
                new Vector2Int(360, 800),
                new Vector2Int(390, 844),
                new Vector2Int(430, 932),
            };
            var seasons = new[] { "spring", "summer", "autumn", "winter" };
            for (var artIndex = 0; artIndex < seasons.Length; artIndex++)
            foreach (var resolution in resolutions)
                values.Add(new CaptureDefinition
                {
                    id = $"loading-{seasons[artIndex]}-{resolution.x}x{resolution.y}",
                    kind = "loading",
                    season = seasons[artIndex],
                    artIndex = artIndex,
                    width = resolution.x,
                    height = resolution.y,
                    fileName = $"loading-{seasons[artIndex]}-{resolution.x}x{resolution.y}.png",
                });
            foreach (var resolution in resolutions)
                values.Add(new CaptureDefinition
                {
                    id = $"top-{resolution.x}x{resolution.y}",
                    kind = "top",
                    season = string.Empty,
                    artIndex = -1,
                    width = resolution.x,
                    height = resolution.y,
                    fileName = $"top-{resolution.x}x{resolution.y}.png",
                });
            return values.ToArray();
        }

        private static void AppendRecord(CaptureRecord record)
        {
            var path = Path.Combine(ResolveOutputDirectory(), RecordsFileName);
            File.AppendAllText(path, JsonUtility.ToJson(record) + "\n");
        }

        private static CaptureRecord[] ReadRecords()
        {
            var path = Path.Combine(ResolveOutputDirectory(), RecordsFileName);
            if (!File.Exists(path))
                return Array.Empty<CaptureRecord>();
            return File.ReadAllLines(path)
                .Where(value => !string.IsNullOrWhiteSpace(value))
                .Select(JsonUtility.FromJson<CaptureRecord>)
                .ToArray();
        }

        private static void WriteManifest(CaptureManifest manifest)
        {
            var path = ResolveManifestPath();
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            File.WriteAllText(path, JsonUtility.ToJson(manifest, true) + "\n");
        }

        private static string ResolveOutputDirectory()
        {
            return Path.Combine(
                ResolveRepositoryRoot(),
                OutputRelativePath.Replace('/', Path.DirectorySeparatorChar));
        }

        private static string ResolveManifestPath()
        {
            return Path.Combine(
                ResolveRepositoryRoot(),
                ManifestRelativePath.Replace('/', Path.DirectorySeparatorChar));
        }

        private static string ResolveRepositoryRoot()
        {
            return Path.GetFullPath(
                Path.Combine(Application.dataPath, "..", "..", ".."));
        }

        private static double ReadDouble(string key)
        {
            return double.TryParse(
                SessionState.GetString(key, "0"),
                System.Globalization.NumberStyles.Float,
                System.Globalization.CultureInfo.InvariantCulture,
                out var value)
                ? value
                : 0d;
        }

        private static Vector2Int ReadPngDimensions(string path)
        {
            using var stream = File.OpenRead(path);
            var header = new byte[24];
            if (stream.Read(header, 0, header.Length) != header.Length)
                throw new InvalidDataException("PNG header is incomplete: " + path);
            var signature = new byte[]
                { 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a };
            for (var index = 0; index < signature.Length; index++)
                if (header[index] != signature[index])
                    throw new InvalidDataException("PNG signature is invalid: " + path);
            return new Vector2Int(
                ReadBigEndianInt32(header, 16),
                ReadBigEndianInt32(header, 20));
        }

        private static int ReadBigEndianInt32(byte[] bytes, int offset)
        {
            return bytes[offset] << 24 |
                   bytes[offset + 1] << 16 |
                   bytes[offset + 2] << 8 |
                   bytes[offset + 3];
        }

        private static string ComputeSha256(string path)
        {
            using var stream = File.OpenRead(path);
            using var sha = SHA256.Create();
            var hash = sha.ComputeHash(stream);
            var builder = new StringBuilder(hash.Length * 2);
            foreach (var value in hash)
                builder.Append(value.ToString("x2"));
            return builder.ToString();
        }

        [Serializable]
        private sealed class CaptureDefinition
        {
            public string id;
            public string kind;
            public string season;
            public int artIndex;
            public int width;
            public int height;
            public string fileName;
        }

        [Serializable]
        private sealed class CaptureManifest
        {
            public int schemaVersion;
            public bool executed;
            public string result;
            public int expectedCaptureCount;
            public int captureCount;
            public string generatedAtUtc;
            public string error;
            public CaptureRecord[] captures;
        }

        [Serializable]
        private sealed class CaptureRecord
        {
            public string id;
            public string kind;
            public string season;
            public string file;
            public int width;
            public int height;
            public string sha256;
        }
    }
}
