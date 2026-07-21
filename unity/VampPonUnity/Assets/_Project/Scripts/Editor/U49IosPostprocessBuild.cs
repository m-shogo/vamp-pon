#if UNITY_IOS
using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

namespace VampPon.UnitySpike.Editor
{
    public static class U49IosPostprocessBuild
    {
        [PostProcessBuild(100)]
        public static void AddCoreHapticsFramework(BuildTarget target, string path)
        {
            if (target != BuildTarget.iOS) return;
            var projectPath = PBXProject.GetPBXProjectPath(path);
            var project = new PBXProject();
            project.ReadFromFile(projectPath);
            project.AddFrameworkToProject(project.GetUnityFrameworkTargetGuid(), "CoreHaptics.framework", false);
            project.WriteToFile(projectPath);
        }
    }
}
#endif
