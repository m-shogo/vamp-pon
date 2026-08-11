using System;
using System.IO;
using Process = System.Diagnostics.Process;
using ProcessStartInfo = System.Diagnostics.ProcessStartInfo;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using UnityEngine;

namespace VampPon.UnitySpike.Editor
{
    /// <summary>
    /// Embeds the exact source Git commit into every Unity player build so device
    /// evidence can prove the installed binary came from the same source commit as
    /// the V3/capture authority. The generated Resources file is build-only and is
    /// removed after Unity finishes building.
    /// </summary>
    public sealed class VampPonBuildProvenanceSync :
        IPreprocessBuildWithReport,
        IPostprocessBuildWithReport
    {
        private const string DestinationRelativeDirectory =
            "Assets/Resources/VampPonBuildProvenance";
        private const string DestinationRelativePath =
            DestinationRelativeDirectory + "/source-commit.txt";
        private const string SourceCommitEnvironmentVariable =
            "VAMPPON_BUILD_SOURCE_COMMIT";

        public int callbackOrder => -200;

        public void OnPreprocessBuild(BuildReport report)
        {
            CleanupGeneratedProvenance(refresh: false);

            var sourceCommit = ResolveSourceCommit();
            Directory.CreateDirectory(DestinationRelativeDirectory);
            File.WriteAllText(DestinationRelativePath, sourceCommit + "\n");
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);

            var asset = AssetDatabase.LoadAssetAtPath<TextAsset>(DestinationRelativePath);
            if (asset == null || !string.Equals(asset.text.Trim(), sourceCommit, StringComparison.Ordinal))
            {
                CleanupGeneratedProvenance();
                throw new BuildFailedException(
                    "Vamp Pon build provenance could not be imported into Resources.");
            }

            Debug.Log(
                $"VampPonBuildProvenanceSync: embedded clean source commit {sourceCommit} for {report.summary.platform}.");
        }

        public void OnPostprocessBuild(BuildReport report)
        {
            CleanupGeneratedProvenance();
        }

        private static string ResolveSourceCommit()
        {
            var repositoryRoot = ResolveRepositoryRoot();
            var actualHead = RunGit(repositoryRoot, "rev-parse HEAD");
            if (!IsLowerHexCommit(actualHead))
                throw new BuildFailedException(
                    "Git HEAD is not a lowercase 40-character commit SHA; refusing ambiguous build provenance.");

            var trackedStatus = RunGit(
                repositoryRoot,
                "status --porcelain --untracked-files=no");
            if (!string.IsNullOrWhiteSpace(trackedStatus))
            {
                throw new BuildFailedException(
                    "Unity final-evidence builds require a clean tracked working tree. " +
                    $"Commit/stash tracked changes before building. git status: {trackedStatus}");
            }

            var fromEnvironment = Environment.GetEnvironmentVariable(
                SourceCommitEnvironmentVariable)?.Trim();
            if (!string.IsNullOrEmpty(fromEnvironment))
            {
                if (!IsLowerHexCommit(fromEnvironment))
                    throw new BuildFailedException(
                        $"{SourceCommitEnvironmentVariable} must be a lowercase 40-character Git commit SHA.");
                if (!string.Equals(fromEnvironment, actualHead, StringComparison.Ordinal))
                    throw new BuildFailedException(
                        $"{SourceCommitEnvironmentVariable} does not match clean Git HEAD; refusing mismatched build provenance.");
            }

            return actualHead;
        }

        private static string RunGit(string repositoryRoot, string arguments)
        {
            var startInfo = new ProcessStartInfo
            {
                FileName = "git",
                Arguments = arguments,
                WorkingDirectory = repositoryRoot,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true,
            };

            using var process = Process.Start(startInfo);
            if (process == null)
                throw new BuildFailedException(
                    $"Could not start git for Unity build provenance: git {arguments}");

            var output = process.StandardOutput.ReadToEnd().Trim();
            var error = process.StandardError.ReadToEnd().Trim();
            process.WaitForExit();

            if (process.ExitCode != 0)
            {
                throw new BuildFailedException(
                    $"Git command failed during Unity build provenance: git {arguments}; " +
                    $"exit={process.ExitCode} stderr={error}");
            }

            return output;
        }

        private static bool IsLowerHexCommit(string value)
        {
            if (value == null || value.Length != 40)
                return false;

            foreach (var character in value)
            {
                var digit = character >= '0' && character <= '9';
                var lowerHex = character >= 'a' && character <= 'f';
                if (!digit && !lowerHex)
                    return false;
            }

            return true;
        }

        private static string ResolveRepositoryRoot()
        {
            return Path.GetFullPath(
                Path.Combine(Application.dataPath, "..", "..", ".."));
        }

        private static void CleanupGeneratedProvenance(bool refresh = true)
        {
            FileUtil.DeleteFileOrDirectory(DestinationRelativeDirectory);
            FileUtil.DeleteFileOrDirectory(DestinationRelativeDirectory + ".meta");

            if (refresh)
                AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
        }
    }
}
