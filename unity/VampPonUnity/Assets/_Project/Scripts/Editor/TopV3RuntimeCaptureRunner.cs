using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using TMPro;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEditorInternal;
using UnityEngine;
using UnityEngine.SceneManagement;
using UnityEngine.TextCore.LowLevel;
using UnityEngine.UI;
using VampPon.UnitySpike.UI.Screens;

namespace VampPon.UnitySpike.Editor
{
    /// <summary>
    /// Current-main TOP Living Night V3 runtime capture harness.
    ///
    /// Reproducible from origin/main alone: it opens an empty scene, enters Play
    /// Mode, builds a real <see cref="TopLivingNightView"/> (the same view the app
    /// flow builds), lets the RuntimeInitializeOnLoadMethod TOP controllers attach
    /// and load the registered final-core5 composite / semantic layers / effect
    /// companions from their Editor authority paths, and captures the live Game
    /// View at several elapsed times per (resolution, motion) pass.
    ///
    /// It does NOT depend on any pruned branch, separate worktree, or the
    /// Loading-Seasonal capture flow, and it does NOT promote any human/approval
    /// boundary. It only writes screenshots plus a capture manifest.
    /// </summary>
    [InitializeOnLoad]
    public static class TopV3RuntimeCaptureRunner
    {
        static TopV3RuntimeCaptureRunner()
        {
            // Re-subscribe the driver after every domain reload (Play Mode enter/
            // exit reloads the domain) while a capture run is still active.
            if (SessionState.GetBool(ActiveKey, false))
                RegisterCallbacks();
        }

        private const string OutputRelativePath =
            "docs/design-targets/generated/top-living-night-v3/runtime-captures/current";
        private const string ManifestRelativePath =
            "docs/design-targets/generated/top-living-night-v3/runtime-captures/current/manifest.json";
        private const string FinalStatusRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final-art-status.json";
        private const string SemanticPackRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final/semantic-layer-pack.json";
        private const string EffectPackRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final/effect-companion-pack.json";
        private const string FinalCompositeRelativePath =
            "docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png";

        private const string ActiveKey = "VampPon.TopV3Capture.Active";
        private const string PassKey = "VampPon.TopV3Capture.Pass";
        private const string StepKey = "VampPon.TopV3Capture.Step";
        private const string PhaseKey = "VampPon.TopV3Capture.Phase";
        private const string PlayEnterAtKey = "VampPon.TopV3Capture.PlayEnterAt";
        private const string BuildAtKey = "VampPon.TopV3Capture.BuildAt";
        private const string RequestedAtKey = "VampPon.TopV3Capture.RequestedAt";
        private const string RequestedPathKey = "VampPon.TopV3Capture.RequestedPath";
        private const string RecordsFileName = "capture-records.jsonl";

        private const double ReadyTimeoutSeconds = 60d;
        private const double ScreenshotTimeoutSeconds = 30d;

        private static readonly Vector2Int[] AllResolutions =
        {
            new Vector2Int(360, 800),
            new Vector2Int(390, 844),
            new Vector2Int(430, 932),
        };

        private const int StepsPerResolution = 13; // 4 normal + 4 reduced + 5 transition

        private static readonly CapturePass[] Passes = BuildPasses();

        [MenuItem("Vamp Pon/TOP Living Night/Capture/Run Current V3 Runtime Capture")]
        public static void RunFromMenu() => Start();

        public static void RunFromCommandLine()
        {
            // Never leave a GUI-mode Unity process open if setup fails: the shell
            // launches without -quit and relies on the runner to exit.
            try
            {
                Start();
            }
            catch (Exception exception)
            {
                Debug.LogError($"TOP V3 runtime capture could not start: {exception}");
                EditorApplication.Exit(1);
            }
        }

        private static void Start()
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode)
                throw new InvalidOperationException(
                    "Exit Play Mode before starting the TOP V3 runtime capture.");

            var directory = ResolveOutputDirectory();
            var keep = Environment.GetEnvironmentVariable("VAMPPON_CAPTURE_KEEP") == "1";
            if (!keep && Directory.Exists(directory))
                Directory.Delete(directory, true);
            Directory.CreateDirectory(directory);

            if (keep)
            {
                // Multi-process mode: only clear this run's own resolution subdir so
                // records from earlier resolutions accumulate into one manifest.
                foreach (var pass in Passes)
                {
                    var sizeDir = Path.Combine(directory, pass.SizeKey);
                    if (Directory.Exists(sizeDir))
                        Directory.Delete(sizeDir, true);
                }
            }

            SessionState.SetInt(PassKey, 0);
            SessionState.SetInt(StepKey, 0);
            SessionState.SetString(PhaseKey, "prepare");
            SessionState.SetBool(ActiveKey, true);

            RegisterCallbacks();
            Debug.Log(
                $"TOP V3 runtime capture started: {Passes.Length} passes, " +
                $"{Passes.Sum(pass => pass.Steps.Length)} frames.");
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

                // Keep the player loop and Game View advancing even when the Unity
                // window is not the foreground app, so motion progresses and
                // ScreenCapture always has a freshly rendered frame to write.
                if (EditorApplication.isPlaying)
                {
                    EditorApplication.QueuePlayerLoopUpdate();
                    InternalEditorUtility.RepaintAllViews();
                }

                var passIndex = SessionState.GetInt(PassKey, 0);
                if (passIndex >= Passes.Length)
                {
                    FinishSuccessfully();
                    return;
                }

                var pass = Passes[passIndex];
                switch (SessionState.GetString(PhaseKey, "prepare"))
                {
                    case "prepare":
                        Prepare(pass);
                        break;
                    case "await-ready":
                        AwaitReady(pass);
                        break;
                    case "capture":
                        Capture(pass);
                        break;
                    case "await-file":
                        AwaitFile(pass);
                        break;
                    case "await-exit":
                        AwaitExit();
                        break;
                }
            }
            catch (Exception exception)
            {
                Fail(exception);
            }
        }

        private static void Prepare(CapturePass pass)
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode)
                return;

            // Fresh empty scene so the gameplay bootstrap never runs; the TOP
            // controllers still self-bootstrap via RuntimeInitializeOnLoadMethod.
            EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            SetGameViewSize(pass.Width, pass.Height);
            ApplyReducedMotion(pass.Steps[0].Reduced);

            WriteTime(PlayEnterAtKey, EditorApplication.timeSinceStartup);
            SessionState.SetString(BuildAtKey, string.Empty);
            SessionState.SetInt(StepKey, 0);
            SessionState.SetString(PhaseKey, "await-ready");
            EditorApplication.EnterPlaymode();
        }

        private static void AwaitReady(CapturePass pass)
        {
            if (!EditorApplication.isPlaying)
                return;

            var enterElapsed = EditorApplication.timeSinceStartup - ReadTime(PlayEnterAtKey);
            if (enterElapsed > ReadyTimeoutSeconds)
                throw new TimeoutException(
                    $"Timed out waiting for TOP runtime readiness: {pass.SizeKey}/{pass.ModeDir}.");

            var view = UnityEngine.Object.FindFirstObjectByType<TopLivingNightView>();
            if (view == null)
            {
                BuildRuntimeView(pass);
                WriteTime(BuildAtKey, EditorApplication.timeSinceStartup);
                return;
            }

            if (!view.gameObject.activeInHierarchy)
                return;
            if (!TopLivingNightCompositeV3Controller.IsCompositeReady)
                return;
            if (!TopLivingNightSemanticLayerPackController.IsSemanticPackReady)
                return;
            if (!TopLivingNightEffectCompanionPackController.IsEffectPackReady)
                return;

            var buildElapsed = EditorApplication.timeSinceStartup - ReadTime(BuildAtKey);
            if (buildElapsed < 0.35d)
                return;

            SessionState.SetString(PhaseKey, "capture");
        }

        private static void Capture(CapturePass pass)
        {
            if (!EditorApplication.isPlaying)
                return;

            var stepIndex = SessionState.GetInt(StepKey, 0);
            var step = pass.Steps[stepIndex];

            // Live motion-mode toggle within the same runtime view; the TOP
            // directors re-read the preference each frame, so this is a real
            // runtime transition rather than a view rebuild.
            ApplyReducedMotion(step.Reduced);

            var buildElapsed = EditorApplication.timeSinceStartup - ReadTime(BuildAtKey);
            if (buildElapsed * 1000d < step.TargetMs)
                return;

            var outputPath = Path.Combine(
                ResolveOutputDirectory(),
                pass.SizeKey,
                pass.ModeDir,
                step.FileName);
            var stepDirectory = Path.GetDirectoryName(outputPath);
            if (!string.IsNullOrWhiteSpace(stepDirectory))
                Directory.CreateDirectory(stepDirectory);
            if (File.Exists(outputPath))
                File.Delete(outputPath);

            ScreenCapture.CaptureScreenshot(outputPath, 1);
            SessionState.SetString(RequestedPathKey, outputPath);
            WriteTime(RequestedAtKey, EditorApplication.timeSinceStartup);
            SessionState.SetString(PhaseKey, "await-file");
        }

        private static void AwaitFile(CapturePass pass)
        {
            var stepIndex = SessionState.GetInt(StepKey, 0);
            var step = pass.Steps[stepIndex];
            var path = SessionState.GetString(RequestedPathKey, string.Empty);
            var elapsed = EditorApplication.timeSinceStartup - ReadTime(RequestedAtKey);
            if (elapsed > ScreenshotTimeoutSeconds)
                throw new TimeoutException(
                    $"Timed out writing screenshot: {pass.SizeKey}/{pass.ModeDir}/{step.FileName}.");
            if (string.IsNullOrWhiteSpace(path) || !File.Exists(path))
            {
                // Re-issue once if the render frame was dropped while the window
                // was backgrounded and the file never appeared.
                if (elapsed > 8d && !string.IsNullOrWhiteSpace(path))
                {
                    ScreenCapture.CaptureScreenshot(path, 1);
                    WriteTime(RequestedAtKey, EditorApplication.timeSinceStartup);
                }
                return;
            }

            var info = new FileInfo(path);
            if (info.Length < 1024 || elapsed < 0.45d)
                return;

            var dimensions = ReadPngDimensions(path);
            if (dimensions.x != pass.Width || dimensions.y != pass.Height)
                throw new InvalidDataException(
                    $"Screenshot dimensions mismatch for {step.FileName}: " +
                    $"expected {pass.Width}x{pass.Height}, actual {dimensions.x}x{dimensions.y}.");

            var buildElapsed = ReadTime(RequestedAtKey) - ReadTime(BuildAtKey);
            AppendRecord(new CaptureRecord
            {
                id = $"{pass.SizeKey}-{pass.ModeDir}-{step.Label}",
                sizeKey = pass.SizeKey,
                width = dimensions.x,
                height = dimensions.y,
                motionMode = step.Reduced ? "reduced" : "normal",
                passMode = pass.ModeDir,
                frameLabel = step.Label,
                targetElapsedMs = step.TargetMs,
                actualElapsedSeconds =
                    Math.Round(buildElapsed, 3).ToString("R", CultureInfo.InvariantCulture),
                file = ToRelative(path),
                sha256 = ComputeSha256(path),
                capturedAtUtc = DateTime.UtcNow.ToString(
                    "yyyy-MM-dd'T'HH:mm:ss.fff'Z'", CultureInfo.InvariantCulture),
            });

            var nextStep = stepIndex + 1;
            if (nextStep < pass.Steps.Length)
            {
                SessionState.SetInt(StepKey, nextStep);
                SessionState.SetString(PhaseKey, "capture");
                return;
            }

            SessionState.SetString(PhaseKey, "await-exit");
            EditorApplication.ExitPlaymode();
        }

        private static void AwaitExit()
        {
            if (EditorApplication.isPlayingOrWillChangePlaymode)
                return;

            SessionState.SetInt(PassKey, SessionState.GetInt(PassKey, 0) + 1);
            SessionState.SetInt(StepKey, 0);
            SessionState.SetString(PhaseKey, "prepare");
        }

        private static void BuildRuntimeView(CapturePass pass)
        {
            var cameraObject = new GameObject("TopV3CaptureCamera", typeof(Camera));
            var camera = cameraObject.GetComponent<Camera>();
            camera.clearFlags = CameraClearFlags.SolidColor;
            camera.backgroundColor = new Color(0.014f, 0.018f, 0.055f, 1f);
            camera.orthographic = true;

            var canvasObject = new GameObject(
                "TopV3CaptureCanvas",
                typeof(RectTransform),
                typeof(Canvas),
                typeof(CanvasScaler),
                typeof(GraphicRaycaster));
            var canvas = canvasObject.GetComponent<Canvas>();
            canvas.renderMode = RenderMode.ScreenSpaceOverlay;
            canvas.sortingOrder = 0;
            var scaler = canvasObject.GetComponent<CanvasScaler>();
            scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
            scaler.referenceResolution = new Vector2(pass.Width, pass.Height);
            scaler.matchWidthOrHeight = 0.5f;

            var view = new GameObject("TopLivingNightView", typeof(TopLivingNightView))
                .GetComponent<TopLivingNightView>();
            view.Build(canvasObject.transform, LoadFont(), () => { }, () => { });
        }

        private static TMP_FontAsset LoadFont()
        {
            var font = Resources.Load<Font>("ZenMaruGothic-Medium");
            return font != null
                ? TMP_FontAsset.CreateFontAsset(font, 36, 4, GlyphRenderMode.SDFAA, 1024, 1024)
                : TMP_Settings.defaultFontAsset;
        }

        private static void ApplyReducedMotion(bool reduced)
        {
            var value = reduced ? 1 : 0;
            PlayerPrefs.SetInt("vamp_pon_reduced_motion", value);
            PlayerPrefs.SetInt("reduce_motion", value);
            PlayerPrefs.Save();
        }

        private static void FinishSuccessfully()
        {
            SessionState.SetBool(ActiveKey, false);
            EditorApplication.update -= Tick;

            var thisRun = Passes.Sum(pass => pass.Steps.Length);
            var records = ReadRecords();
            var keep = Environment.GetEnvironmentVariable("VAMPPON_CAPTURE_KEEP") == "1";

            // In multi-process mode records accumulate across resolutions; the run
            // is complete only once every resolution has contributed its frames.
            var fullExpected = FullExpectedCount();
            var result = records.Length >= fullExpected ? "PASSED" : "PARTIAL";
            WriteManifest(BuildManifest(result, records, string.Empty));
            if (!keep)
                CleanupSession();
            Debug.Log(
                $"TOP V3 runtime capture segment done: +{thisRun} this run, " +
                $"{records.Length}/{fullExpected} total ({result}).");
            EditorApplication.Exit(0);
        }

        private static void Fail(Exception exception)
        {
            try
            {
                var records = ReadRecords();
                WriteManifest(BuildManifest("FAILED", records, exception.ToString()));
            }
            catch (Exception writeException)
            {
                Debug.LogError($"TOP V3 capture manifest write failed: {writeException}");
            }
            finally
            {
                SessionState.SetBool(ActiveKey, false);
                EditorApplication.update -= Tick;
                CleanupSession();
                Debug.LogError($"TOP V3 runtime capture failed: {exception}");
                if (EditorApplication.isPlayingOrWillChangePlaymode)
                    EditorApplication.ExitPlaymode();
                EditorApplication.Exit(1);
            }
        }

        private static CaptureManifest BuildManifest(
            string result, CaptureRecord[] records, string error)
        {
            return new CaptureManifest
            {
                schemaVersion = 1,
                executed = true,
                result = result,
                sourceCommit =
                    Environment.GetEnvironmentVariable("VAMPPON_CAPTURE_SOURCE_COMMIT") ?? string.Empty,
                unityVersion = Application.unityVersion,
                candidateSha256 = ReadCandidateSha(),
                finalCompositeSha256 = SafeFileSha(FinalCompositeRelativePath),
                semanticLayerPackSha256 = SafeFileSha(SemanticPackRelativePath),
                effectCompanionPackSha256 = SafeFileSha(EffectPackRelativePath),
                expectedCaptureCount = FullExpectedCount(),
                captureCount = records.Length,
                generatedAtUtc = DateTime.UtcNow.ToString(
                    "yyyy-MM-dd'T'HH:mm:ss.fff'Z'", CultureInfo.InvariantCulture),
                error = error,
                captures = records,
            };
        }

        private static int FullExpectedCount() => AllResolutions.Length * StepsPerResolution;

        private static CapturePass[] BuildPasses()
        {
            int[] standard = { 300, 2000, 5000, 10000 };
            // One resolution per Unity process keeps every run to the first three
            // Play Mode cycles, which are reliable; later cycles degrade composite
            // reconnection in the Editor. The shell launches one process per size.
            var only = Environment.GetEnvironmentVariable("VAMPPON_CAPTURE_RESOLUTION");
            var passes = new List<CapturePass>();
            foreach (var resolution in AllResolutions)
            {
                var sizeKeyFilter = $"{resolution.x}x{resolution.y}";
                if (!string.IsNullOrWhiteSpace(only) && only != sizeKeyFilter)
                    continue;
                var sizeKey = $"{resolution.x}x{resolution.y}";
                passes.Add(new CapturePass(sizeKey, resolution.x, resolution.y, "normal",
                    standard.Select((ms, index) =>
                        new CaptureStep($"t{index}", ms, false)).ToArray()));
                passes.Add(new CapturePass(sizeKey, resolution.x, resolution.y, "reduced",
                    standard.Select((ms, index) =>
                        new CaptureStep($"t{index}", ms, true)).ToArray()));

                // One same-view Normal -> Reduced -> Normal live transition per
                // resolution proves the runtime motion contract without rebuild.
                passes.Add(new CapturePass(sizeKey, resolution.x, resolution.y, "transition",
                    new[]
                    {
                        new CaptureStep("normal-a", 400, false),
                        new CaptureStep("normal-b", 2500, false),
                        new CaptureStep("reduced-a", 5200, true),
                        new CaptureStep("reduced-b", 8000, true),
                        new CaptureStep("normal-c", 10800, false),
                    }));
            }

            return passes.ToArray();
        }

        private static string ReadCandidateSha()
        {
            try
            {
                var json = File.ReadAllText(ResolveRepositoryPath(FinalStatusRelativePath));
                var status = JsonUtility.FromJson<FinalStatus>(json);
                return status?.candidateSha256 ?? string.Empty;
            }
            catch
            {
                return string.Empty;
            }
        }

        private static string SafeFileSha(string relativePath)
        {
            try
            {
                return ComputeSha256(ResolveRepositoryPath(relativePath));
            }
            catch
            {
                return string.Empty;
            }
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

            var singletonType = typeof(ScriptableSingleton<>).MakeGenericType(sizesType);
            var sizes = singletonType
                .GetProperty("instance", BindingFlags.Static | BindingFlags.Public)
                ?.GetValue(null)
                ?? throw new InvalidOperationException("GameViewSizes singleton was not available.");

            var names = Enum.GetNames(groupType);
            var preferredGroup =
                EditorUserBuildSettings.activeBuildTarget == BuildTarget.iOS && names.Contains("iOS")
                    ? "iOS"
                    : "Standalone";
            var groupValue = Enum.Parse(groupType, preferredGroup);
            var group = sizesType
                .GetMethod("GetGroup",
                    BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                ?.Invoke(sizes, new[] { groupValue })
                ?? throw new InvalidOperationException("GameView size group was not available.");

            var runtimeType = group.GetType();
            var getTotal = runtimeType.GetMethod("GetTotalCount",
                BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                ?? throw new InvalidOperationException("GetTotalCount was not available.");
            var getSize = runtimeType.GetMethod("GetGameViewSize",
                BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                ?? throw new InvalidOperationException("GetGameViewSize was not available.");

            var total = (int)getTotal.Invoke(group, null);
            var selectedIndex = -1;
            for (var index = 0; index < total; index++)
            {
                var size = getSize.Invoke(group, new object[] { index });
                if (ReadIntMember(size, "width") == width && ReadIntMember(size, "height") == height)
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
                var addCustom = runtimeType.GetMethod("AddCustomSize",
                    BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                    ?? throw new InvalidOperationException("AddCustomSize was not available.");
                addCustom.Invoke(group, new[] { customSize });
                selectedIndex = (int)getTotal.Invoke(group, null) - 1;
            }

            var gameView = EditorWindow.GetWindow(gameViewType);
            var selectedProperty = gameViewType.GetProperty("selectedSizeIndex",
                BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic)
                ?? throw new InvalidOperationException("GameView selectedSizeIndex was not available.");
            selectedProperty.SetValue(gameView, selectedIndex);
            gameView.Show();
            gameView.Focus();
            gameView.Repaint();
        }

        private static int ReadIntMember(object value, string name)
        {
            if (value == null)
                return -1;

            var type = value.GetType();
            var property = type.GetProperty(name,
                BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
            if (property?.GetValue(value) is int propertyValue)
                return propertyValue;

            var field = type.GetField(name,
                BindingFlags.Instance | BindingFlags.Public | BindingFlags.NonPublic);
            return field?.GetValue(value) is int fieldValue ? fieldValue : -1;
        }

        private static void AppendRecord(CaptureRecord record)
        {
            File.AppendAllText(
                Path.Combine(ResolveOutputDirectory(), RecordsFileName),
                JsonUtility.ToJson(record) + "\n");
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
            var path = ResolveRepositoryPath(ManifestRelativePath);
            var directory = Path.GetDirectoryName(path);
            if (!string.IsNullOrWhiteSpace(directory))
                Directory.CreateDirectory(directory);
            File.WriteAllText(path, JsonUtility.ToJson(manifest, true) + "\n");
        }

        private static void CleanupSession()
        {
            var records = Path.Combine(ResolveOutputDirectory(), RecordsFileName);
            if (File.Exists(records))
                File.Delete(records);
        }

        private static string ResolveOutputDirectory() =>
            ResolveRepositoryPath(OutputRelativePath);

        private static string ResolveRepositoryPath(string relativePath) =>
            Path.Combine(ResolveRepositoryRoot(), relativePath.Replace('/', Path.DirectorySeparatorChar));

        private static string ResolveRepositoryRoot() =>
            Path.GetFullPath(Path.Combine(Application.dataPath, "..", "..", ".."));

        private static string ToRelative(string absolutePath)
        {
            var root = ResolveRepositoryRoot();
            var full = Path.GetFullPath(absolutePath);
            return full.StartsWith(root, StringComparison.Ordinal)
                ? full.Substring(root.Length).TrimStart(Path.DirectorySeparatorChar, '/').Replace('\\', '/')
                : full.Replace('\\', '/');
        }

        private static void WriteTime(string key, double value) =>
            SessionState.SetString(key, value.ToString("R", CultureInfo.InvariantCulture));

        private static double ReadTime(string key) =>
            double.TryParse(SessionState.GetString(key, "0"),
                NumberStyles.Float, CultureInfo.InvariantCulture, out var value)
                ? value
                : 0d;

        private static Vector2Int ReadPngDimensions(string path)
        {
            using var stream = File.OpenRead(path);
            var header = new byte[24];
            if (stream.Read(header, 0, header.Length) != header.Length)
                throw new InvalidDataException("PNG header is incomplete: " + path);

            var signature = new byte[] { 0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a };
            for (var index = 0; index < signature.Length; index++)
            {
                if (header[index] != signature[index])
                    throw new InvalidDataException("PNG signature is invalid: " + path);
            }

            return new Vector2Int(
                ReadBigEndianInt32(header, 16),
                ReadBigEndianInt32(header, 20));
        }

        private static int ReadBigEndianInt32(byte[] bytes, int offset) =>
            bytes[offset] << 24 | bytes[offset + 1] << 16 | bytes[offset + 2] << 8 | bytes[offset + 3];

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

        private sealed class CapturePass
        {
            public CapturePass(string sizeKey, int width, int height, string modeDir, CaptureStep[] steps)
            {
                SizeKey = sizeKey;
                Width = width;
                Height = height;
                ModeDir = modeDir;
                Steps = steps;
            }

            public string SizeKey { get; }
            public int Width { get; }
            public int Height { get; }
            public string ModeDir { get; }
            public CaptureStep[] Steps { get; }
        }

        private sealed class CaptureStep
        {
            public CaptureStep(string label, int targetMs, bool reduced)
            {
                Label = label;
                TargetMs = targetMs;
                Reduced = reduced;
                FileName = $"frame-{label}-{targetMs}ms.png";
            }

            public string Label { get; }
            public int TargetMs { get; }
            public bool Reduced { get; }
            public string FileName { get; }
        }

        [Serializable]
        private sealed class FinalStatus
        {
            public string candidateSha256;
        }

        [Serializable]
        private sealed class CaptureRecord
        {
            public string id;
            public string sizeKey;
            public int width;
            public int height;
            public string motionMode;
            public string passMode;
            public string frameLabel;
            public int targetElapsedMs;
            public string actualElapsedSeconds;
            public string file;
            public string sha256;
            public string capturedAtUtc;
        }

        [Serializable]
        private sealed class CaptureManifest
        {
            public int schemaVersion;
            public bool executed;
            public string result;
            public string sourceCommit;
            public string unityVersion;
            public string candidateSha256;
            public string finalCompositeSha256;
            public string semanticLayerPackSha256;
            public string effectCompanionPackSha256;
            public int expectedCaptureCount;
            public int captureCount;
            public string generatedAtUtc;
            public string error;
            public CaptureRecord[] captures;
        }
    }
}
