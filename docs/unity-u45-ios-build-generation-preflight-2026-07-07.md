# Unity U45 iOS Build Generation Preflight

Date: 2026-07-10

## Result

Unity 6000.5.1f1 batchmode completed the U45 iOS build generation preflight.

- Result: `Succeeded`
- Total errors: `0`
- Total warnings: `3`
- Output: `/Users/m-shogo/Developer/personal/vamp-pon-builds/ios-u45-app-quality-smoke`
- Generated project: `Unity-iPhone.xcodeproj`

The three warnings are TextMeshPro IL2CPP messages indicating that large methods were assigned their own C++ compilation files. No C# compiler error or build-generation error was reported.

The C# batchmode compile/import check also exited successfully before build generation. U45 asset provider, UI factory, tap targets, and the U45 preflight runner compiled without a reported C# compiler error.

## Evidence Boundary

This is not actual device smoke evidence.

- `deviceInstallAttempted=false`
- `deviceRunConfirmed=false`
- `actualDeviceSmokeResultProvided=false`
- `actualDeviceSmokeResult=NOT_PROVIDED`
- `deviceScreenshot=DEVICE_SCREENSHOT_NOT_PROVIDED`
- `humanCheckNeeded=true`

Xcode signing, provisioning, device installation, device launch, touch behavior, audio, haptic feedback, frame pacing, and crash/freeze behavior remain unverified on hardware.

## Candidate Boundary

- U45 generated UI assets remain candidate-only.
- `candidateAssetsApprovedAsFinal=false`
- Build generation success does not approve the generated assets as final production art.
- No new image was generated in this preflight.
- U45 runtime behavior was not changed.

## Readiness

Keep false:

- `devicePlayableReady=false`
- `mobileMetricsReady=false`
- `audioMixerReady=false`
- `audioLatencyMeasured=false`
- `hapticMeasured=false`
- `rcReady=false`
- `productionApproved=false`

## Evidence

```txt
docs/design-targets/generated/unity-u45/ios-build-generation-preflight.json
docs/design-targets/generated/unity-u45/u45-app-quality-readiness.json
```

The five pre-existing unstaged Unity settings files were inspected and excluded from this preflight commit.
