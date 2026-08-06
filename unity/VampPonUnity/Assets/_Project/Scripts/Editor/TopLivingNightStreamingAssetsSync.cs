using System.IO;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    public sealed class TopLivingNightStreamingAssetsSync :
        IPreprocessBuildWithReport,
        IPostprocessBuildWithReport
    {
        private const string SourceRelativePath =
            "docs/design-targets/generated/top-living-night-v2/layers";
        private const string DestinationRelativePath =
            "Assets/StreamingAssets/TopLivingNight";

        private static readonly string[] RequiredFiles =
        {
            "00-environment-starless.png",
            "01-stars.png",
            "01-moon.png",
            "02-clouds-far.png",
            "03-clouds-near.png",
            "04-distant-lights-mask.png",
            "05-distant-companion.png",
            "06-characters.png",
            "08-animal-robot.png",
            "08-robot-eye-mask.png",
            "09-fire-base.png",
            "10-fire-flipbook-atlas.png",
            "11-fire-glow-mask.png",
            "12-smoke-atlas.png",
            "13-embers-atlas.png",
            "14-foreground-accents.png",
            "14-lantern-glow-mask.png",
        };

        public int callbackOrder => -140;

        public void OnPreprocessBuild(BuildReport report)
        {
            var source = ResolveSourceDirectory();
            var destination = ResolveDestinationDirectory();

            if (!Directory.Exists(source))
                throw new BuildFailedException(
                    $"TOP Living Night source directory is missing: {source}");

            Directory.CreateDirectory(destination);
            foreach (var fileName in RequiredFiles)
            {
                var sourcePath = Path.Combine(source, fileName);
                var destinationPath = Path.Combine(destination, fileName);
                if (!File.Exists(sourcePath))
                    throw new BuildFailedException(
                        $"TOP Living Night source asset is missing: {sourcePath}");

                File.Copy(sourcePath, destinationPath, true);
            }

            File.WriteAllText(
                Path.Combine(destination, "README.generated.txt"),
                "Generated for Unity build from docs/design-targets/generated/top-living-night-v2/layers.\n" +
                "Do not edit or commit this StreamingAssets copy.\n");

            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            Debug.Log(
                $"TopLivingNightStreamingAssetsSync: staged {RequiredFiles.Length} files for {report.summary.platform}.");
        }

        public void OnPostprocessBuild(BuildReport report)
        {
            CleanupGeneratedStreamingAssets();
        }

        [MenuItem("Vamp Pon/TOP Living Night/Stage StreamingAssets")]
        private static void StageFromMenu()
        {
            var source = ResolveSourceDirectory();
            var destination = ResolveDestinationDirectory();
            if (!Directory.Exists(source))
                throw new DirectoryNotFoundException(source);

            Directory.CreateDirectory(destination);
            foreach (var fileName in RequiredFiles)
                File.Copy(Path.Combine(source, fileName), Path.Combine(destination, fileName), true);

            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
            Debug.Log($"TopLivingNightStreamingAssetsSync: staged {RequiredFiles.Length} files.");
        }

        [MenuItem("Vamp Pon/TOP Living Night/Cleanup StreamingAssets")]
        private static void CleanupFromMenu()
        {
            CleanupGeneratedStreamingAssets();
        }

        private static void CleanupGeneratedStreamingAssets()
        {
            var destination = DestinationRelativePath.Replace('/', Path.DirectorySeparatorChar);
            FileUtil.DeleteFileOrDirectory(destination);
            FileUtil.DeleteFileOrDirectory(destination + ".meta");

            const string streamingAssets = "Assets/StreamingAssets";
            if (Directory.Exists(streamingAssets) &&
                Directory.GetFileSystemEntries(streamingAssets).Length == 0)
            {
                FileUtil.DeleteFileOrDirectory(streamingAssets);
                FileUtil.DeleteFileOrDirectory(streamingAssets + ".meta");
            }

            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
        }

        private static string ResolveSourceDirectory()
        {
            var repoRoot = Path.GetFullPath(
                Path.Combine(Application.dataPath, "..", "..", ".."));
            return Path.Combine(
                repoRoot,
                SourceRelativePath.Replace('/', Path.DirectorySeparatorChar));
        }

        private static string ResolveDestinationDirectory()
        {
            var projectRoot = Path.GetFullPath(
                Path.Combine(Application.dataPath, ".."));
            return Path.Combine(
                projectRoot,
                DestinationRelativePath.Replace('/', Path.DirectorySeparatorChar));
        }
    }
}
