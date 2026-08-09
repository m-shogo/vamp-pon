using System.IO;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;

namespace VampPon.UnitySpike.Editor
{
    // Stages a tiny build-only marker so player runtime can distinguish the
    // verified layered bridge from a registered final Core5 composite without
    // hard-coding environment assumptions into runtime UI code.
    public sealed class TopLivingNightRuntimeSourceKindBuildSync :
        IPreprocessBuildWithReport,
        IPostprocessBuildWithReport
    {
        private const string DestinationDirectory =
            "Assets/Resources/TopLivingNightV3Generated";
        private const string DestinationAssetPath =
            DestinationDirectory + "/source-kind.txt";

        public int callbackOrder => -134;

        public void OnPreprocessBuild(BuildReport report)
        {
            StageMarker();
        }

        public void OnPostprocessBuild(BuildReport report)
        {
            CleanupMarker();
        }

        private static void StageMarker()
        {
            var selection = TopLivingNightCompositeV3BuildAssetSync.ResolveCompositeSource();
            if (selection.Kind != "bridge" && selection.Kind != "final-core5")
                throw new BuildFailedException(
                    $"TOP runtime source marker received unsupported source kind: {selection.Kind}");

            Directory.CreateDirectory(DestinationDirectory);
            File.WriteAllText(DestinationAssetPath, selection.Kind + "\n");
            AssetDatabase.ImportAsset(
                DestinationAssetPath,
                ImportAssetOptions.ForceSynchronousImport | ImportAssetOptions.ForceUpdate);
        }

        private static void CleanupMarker()
        {
            FileUtil.DeleteFileOrDirectory(DestinationAssetPath);
            FileUtil.DeleteFileOrDirectory(DestinationAssetPath + ".meta");
            AssetDatabase.Refresh(ImportAssetOptions.ForceSynchronousImport);
        }
    }
}
