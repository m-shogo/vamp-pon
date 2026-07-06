# Unity U43 iOS Build Generation Preflight

Date: 2026-07-06

## scope

U43 Pre-Device Automated Smokeの次段として、Unity batchmodeでiOS build generationを試す。これはXcode実機インストール、署名成功、実機起動成功、device smoke passの証跡ではない。

## command

```txt
/Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app/Contents/MacOS/Unity -batchmode -projectPath /Users/m-shogo/Developer/personal/vamp-pon/unity/VampPonUnity -buildTarget iOS -executeMethod VampPon.UnitySpike.Editor.U43IosBuildGenerationPreflight.Run -logFile /Users/m-shogo/Developer/personal/vamp-pon/unity/VampPonUnity/Logs/u43_ios_build_generation_preflight_unity.log
```

## output

```txt
/Users/m-shogo/Developer/personal/vamp-pon-builds/ios-u43-predevice-smoke
```

The output folder is allowed by the request only for this iOS build generation preflight. Build artifacts are not placed in the repository.

## result

Unity batchmode completed with exit code 0 on 2026-07-06.

Result:

- `iosBuildGenerationAttempted=true`
- `iosBuildGenerationReady=true`
- `iosBuildResult=Succeeded`
- `iosBuildTotalErrors=0`
- `iosBuildTotalWarnings=3`
- `iosBuildGenerationError=null`

Evidence:

```txt
docs/design-targets/generated/unity-u43/ios-build-generation-preflight.json
```

The generated folder contains a Unity iOS Xcode project, including `Unity-iPhone.xcodeproj`, `Info.plist`, `Data/`, `Classes/`, `Libraries/`, `MainApp/`, and `UnityFramework/`.

## boundary

- `iosBuildGenerationReady` may become true only if Unity build generation succeeds.
- `deviceInstallAttempted=false`
- `deviceRunConfirmed=false`
- `actualDeviceSmokeResultProvided=false`
- `actualDeviceSmokeResult=NOT_PROVIDED`
- `deviceScreenshot=DEVICE_SCREENSHOT_NOT_PROVIDED`
- iOS build generation is not actual device smoke evidence.

## READY flags

Keep false:

- `devicePlayableReady=false`
- `mobileMetricsReady=false`
- `audioMixerReady=false`
- `audioLatencyMeasured=false`
- `hapticMeasured=false`
- `rcReady=false`
- `productionApproved=false`

## Unity settings

The following pre-existing unstaged Unity setting diffs are not part of this preflight commit unless explicitly required and reviewed separately:

- `unity/VampPonUnity/Assets/DefaultVolumeProfile.asset`
- `unity/VampPonUnity/Assets/UniversalRenderPipelineGlobalSettings.asset`
- `unity/VampPonUnity/Assets/_Project/Settings/U1UniversalRenderPipelineAsset.asset`
- `unity/VampPonUnity/ProjectSettings/ProjectSettings.asset`
- `unity/VampPonUnity/ProjectSettings/ShaderGraphSettings.asset`
