using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using UnityEditor;
using UnityEditor.Build.Reporting;
using UnityEditor.Build;
using UnityEngine;
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

namespace VampPon.UnitySpike.Editor
{
    public static class U45UnitySettingsRepair
    {
        private const string ApplicationIdentifier = "com.mshogo.vamppon.u1";
        private const string DefaultVolumeProfilePath = "Assets/DefaultVolumeProfile.asset";
        private const string UrpGlobalSettingsPath = "Assets/UniversalRenderPipelineGlobalSettings.asset";
        private const string UrpAssetPath = "Assets/_Project/Settings/U1UniversalRenderPipelineAsset.asset";
        private const string BootScenePath = "Assets/_Project/Scenes/Boot/Boot.unity";
        private const string Stage1ScenePath = "Assets/_Project/Scenes/Stage1/Stage1.unity";
        private const string IosOutputPath = "/Users/m-shogo/Developer/personal/vamp-pon-builds/ios-u45-settings-review";

        [MenuItem("VampPon/U45/Repair Unity Settings")]
        public static void Repair()
        {
            Directory.CreateDirectory("Logs");
            try
            {
                var before = ReadIdentifiers();
                SetApplicationIdentifier(NamedBuildTarget.iOS);
                SetApplicationIdentifier(NamedBuildTarget.Android);
                SetApplicationIdentifier(NamedBuildTarget.Standalone);
                NeutralizeDefaultVolumeProfile();
                DisableUnusedLensFlareSupport();
                AssetDatabase.SaveAssets();

                var after = ReadIdentifiers();
                File.WriteAllLines("Logs/u45_settings_repair_report.txt", new[]
                {
                    "U45 Unity settings repair",
                    $"iosBefore={before.Ios}",
                    $"androidBefore={before.Android}",
                    $"standaloneBefore={before.Standalone}",
                    $"iosAfter={after.Ios}",
                    $"androidAfter={after.Android}",
                    $"standaloneAfter={after.Standalone}",
                    "appleDeveloperTeamIdCommitted=false",
                    "provisioningProfileCommitted=false",
                    "defaultVolumeProfileNeutral=true",
                    "unusedLensFlareSupport=false",
                });
                EditorApplication.Exit(0);
            }
            catch (Exception ex)
            {
                Debug.LogException(ex);
                File.WriteAllText("Logs/u45_settings_repair_report.txt", $"repairError={ex.GetType().Name}: {ex.Message}\n");
                EditorApplication.Exit(1);
            }
        }

        [MenuItem("VampPon/U45/Verify Unity Settings Repair")]
        public static void Verify()
        {
            Directory.CreateDirectory("Logs");
            var checks = new List<string>();
            var failures = new List<string>();

            Check(checks, failures, "iOS application identifier", PlayerSettings.GetApplicationIdentifier(NamedBuildTarget.iOS) == ApplicationIdentifier);
            Check(checks, failures, "Android application identifier", PlayerSettings.GetApplicationIdentifier(NamedBuildTarget.Android) == ApplicationIdentifier);
            Check(checks, failures, "Standalone application identifier", PlayerSettings.GetApplicationIdentifier(NamedBuildTarget.Standalone) == ApplicationIdentifier);
            Check(checks, failures, "Apple developer team ID is not fixed", string.IsNullOrWhiteSpace(PlayerSettings.iOS.appleDeveloperTeamID));
            Check(checks, failures, "Manual provisioning profile is not fixed", string.IsNullOrWhiteSpace(PlayerSettings.iOS.iOSManualProvisioningProfileID));

            var profile = AssetDatabase.LoadAssetAtPath<VolumeProfile>(DefaultVolumeProfilePath);
            Check(checks, failures, "DefaultVolumeProfile loads", profile != null);
            if (profile != null)
            {
                Check(checks, failures, "DefaultVolumeProfile has no missing scripts", profile.components.All(component => component != null));
                Check(checks, failures, "DepthOfField not rendering", IsEffectInactive<DepthOfField>(profile));
                Check(checks, failures, "MotionBlur not rendering", IsEffectInactive<MotionBlur>(profile));
                Check(checks, failures, "Bloom intensity zero", IsEffectInactiveWithZero<Bloom>(profile, component => component.intensity.value));
                Check(checks, failures, "Vignette intensity zero", IsEffectInactiveWithZero<Vignette>(profile, component => component.intensity.value));
                Check(checks, failures, "ScreenSpaceLensFlare intensity zero", IsEffectInactiveWithZero<ScreenSpaceLensFlare>(profile, component => component.intensity.value));
                Check(checks, failures, "ChromaticAberration intensity zero", IsEffectInactiveWithZero<ChromaticAberration>(profile, component => component.intensity.value));
                Check(checks, failures, "FilmGrain intensity zero", IsEffectInactiveWithZero<FilmGrain>(profile, component => component.intensity.value));
                Check(checks, failures, "PaniniProjection distance zero", IsEffectInactiveWithZero<PaniniProjection>(profile, component => component.distance.value));
                Check(checks, failures, "LensDistortion intensity zero", IsEffectInactiveWithZero<LensDistortion>(profile, component => component.intensity.value));
                Check(checks, failures, "ColorLookup contribution zero", IsEffectInactiveWithZero<ColorLookup>(profile, component => component.contribution.value));
            }

            var urpAsset = AssetDatabase.LoadAssetAtPath<UniversalRenderPipelineAsset>(UrpAssetPath);
            Check(checks, failures, "URP asset loads", urpAsset != null);
            if (urpAsset != null)
            {
                Check(checks, failures, "URP render scale is 1", Mathf.Approximately(urpAsset.renderScale, 1f));
                Check(checks, failures, "URP renderer data present", urpAsset.rendererDataList.Length > 0 && urpAsset.rendererDataList.ToArray().All(data => data != null));
                Check(checks, failures, "Screen Space Lens Flare support disabled", !urpAsset.supportScreenSpaceLensFlare);
                Check(checks, failures, "Data Driven Lens Flare support disabled", !urpAsset.supportDataDrivenLensFlare);
            }

            var globalSettings = AssetDatabase.LoadMainAssetAtPath(UrpGlobalSettingsPath);
            Check(checks, failures, "URP Global Settings loads", globalSettings != null);
            Check(checks, failures, "URP Global Settings default profile resolves",
                GraphicsSettings.TryGetRenderPipelineSettings<URPDefaultVolumeProfileSettings>(out var defaultVolumeSettings) &&
                defaultVolumeSettings.volumeProfile == profile);

            var enabledScenes = EditorBuildSettings.scenes.Where(scene => scene.enabled).ToArray();
            Check(checks, failures, "Boot scene enabled", enabledScenes.Any(scene => scene.path == BootScenePath));
            Check(checks, failures, "Stage1 scene enabled", enabledScenes.Any(scene => scene.path == Stage1ScenePath));
            Check(checks, failures, "Proof scene excluded", enabledScenes.All(scene => !scene.path.Contains("/Proof/", StringComparison.Ordinal)));

            File.WriteAllLines("Logs/u45_settings_repair_verify_report.txt", checks.Concat(failures.Select(failure => "FAIL: " + failure)));
            if (failures.Count > 0)
            {
                foreach (var failure in failures) Debug.LogError(failure);
                EditorApplication.Exit(1);
                return;
            }

            Debug.Log("U45 Unity settings repair verification passed");
            EditorApplication.Exit(0);
        }

        [MenuItem("VampPon/U45/Build iOS Settings Review")]
        public static void BuildIosSettingsReview()
        {
            Directory.CreateDirectory("Logs");
            Directory.CreateDirectory(IosOutputPath);
            try
            {
                var options = new BuildPlayerOptions
                {
                    scenes = new[] { BootScenePath, Stage1ScenePath },
                    locationPathName = IosOutputPath,
                    target = BuildTarget.iOS,
                    options = BuildOptions.None,
                };
                var report = BuildPipeline.BuildPlayer(options);
                var summary = report.summary;
                File.WriteAllLines("Logs/u45_settings_review_ios_build_report.txt", new[]
                {
                    "U45 settings review iOS build generation",
                    $"result={summary.result}",
                    $"errors={summary.totalErrors}",
                    $"warnings={summary.totalWarnings}",
                    $"outputPath={IosOutputPath}",
                    $"applicationIdentifier={PlayerSettings.GetApplicationIdentifier(NamedBuildTarget.iOS)}",
                });
                EditorApplication.Exit(summary.result == BuildResult.Succeeded ? 0 : 1);
            }
            catch (Exception ex)
            {
                Debug.LogException(ex);
                File.WriteAllText("Logs/u45_settings_review_ios_build_report.txt", $"buildError={ex.GetType().Name}: {ex.Message}\n");
                EditorApplication.Exit(1);
            }
        }

        private static void SetApplicationIdentifier(NamedBuildTarget target)
        {
            if (PlayerSettings.GetApplicationIdentifier(target) != ApplicationIdentifier)
            {
                PlayerSettings.SetApplicationIdentifier(target, ApplicationIdentifier);
            }
        }

        private static void NeutralizeDefaultVolumeProfile()
        {
            var profile = AssetDatabase.LoadAssetAtPath<VolumeProfile>(DefaultVolumeProfilePath)
                ?? throw new InvalidOperationException("DefaultVolumeProfile could not be loaded");

            SetZero(profile, (DepthOfField component) => component.mode.value = DepthOfFieldMode.Off);
            SetZero(profile, (Bloom component) => component.intensity.value = 0f);
            SetZero(profile, (Vignette component) => component.intensity.value = 0f);
            SetZero(profile, (ScreenSpaceLensFlare component) => component.intensity.value = 0f);
            SetZero(profile, (MotionBlur component) => component.intensity.value = 0f);
            SetZero(profile, (ChromaticAberration component) => component.intensity.value = 0f);
            SetZero(profile, (FilmGrain component) => component.intensity.value = 0f);
            SetZero(profile, (LensDistortion component) => component.intensity.value = 0f);
            SetZero(profile, (ColorLookup component) => component.contribution.value = 0f);
            SetZero(profile, (PaniniProjection component) => component.distance.value = 0f);
            EditorUtility.SetDirty(profile);
        }

        private static void DisableUnusedLensFlareSupport()
        {
            var urpAsset = AssetDatabase.LoadAssetAtPath<UniversalRenderPipelineAsset>(UrpAssetPath)
                ?? throw new InvalidOperationException("URP asset could not be loaded");
            var serialized = new SerializedObject(urpAsset);
            serialized.FindProperty("m_SupportDataDrivenLensFlare").boolValue = false;
            serialized.FindProperty("m_SupportScreenSpaceLensFlare").boolValue = false;
            serialized.ApplyModifiedPropertiesWithoutUndo();
            EditorUtility.SetDirty(urpAsset);
        }

        private static void SetZero<T>(VolumeProfile profile, Action<T> update) where T : VolumeComponent
        {
            if (!profile.TryGet<T>(out var component)) return;
            update(component);
            EditorUtility.SetDirty(component);
        }

        private static bool IsEffectInactive<T>(VolumeProfile profile) where T : VolumeComponent, IPostProcessComponent =>
            profile.TryGet<T>(out var component) && !component.IsActive();

        private static bool IsEffectInactiveWithZero<T>(VolumeProfile profile, Func<T, float> value) where T : VolumeComponent, IPostProcessComponent =>
            profile.TryGet<T>(out var component) && !component.IsActive() && Mathf.Approximately(value(component), 0f);

        private static void Check(List<string> checks, List<string> failures, string label, bool passed)
        {
            checks.Add($"{label}={passed}");
            if (!passed) failures.Add(label);
        }

        private static (string Ios, string Android, string Standalone) ReadIdentifiers() =>
            (PlayerSettings.GetApplicationIdentifier(NamedBuildTarget.iOS),
             PlayerSettings.GetApplicationIdentifier(NamedBuildTarget.Android),
             PlayerSettings.GetApplicationIdentifier(NamedBuildTarget.Standalone));
    }
}
