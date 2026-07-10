# Unity U45 Settings Repair

Date: 2026-07-10

## Bundle Identifier

Unity API values before repair:

- iOS: `com.m-shogo.Vamp-Pon-Unity-Spike`
- Android: `com.mshogo.VampPonUnitySpike`
- Standalone: `com.m-shogo.Vamp-Pon-Unity-Spike`

Values after repair:

- iOS: `com.mshogo.vamppon.u1`
- Android: `com.mshogo.vamppon.u1`
- Standalone: `com.mshogo.vamppon.u1`

The generated Xcode app target uses `PRODUCT_BUNDLE_IDENTIFIER = com.mshogo.vamppon.u1`. `Info.plist` correctly resolves its `CFBundleIdentifier` through `$(PRODUCT_BUNDLE_IDENTIFIER)`.

Apple Developer Team ID, manual provisioning profile ID, and personal certificate information were not configured or committed.

## Default Volume Profile

The global Default Volume Profile remains in the structure required by Unity 6000.5.1f1: all supported components and overrides are present. The repair fixes the risky effects to neutral runtime values:

- DepthOfField: mode `Off`; runtime inactive
- MotionBlur: intensity `0`; runtime inactive
- Bloom: intensity `0`; runtime inactive
- Vignette: intensity `0`; runtime inactive
- ScreenSpaceLensFlare: intensity `0`; runtime inactive
- ChromaticAberration: intensity `0`; runtime inactive
- FilmGrain: intensity `0`; runtime inactive
- PaniniProjection: distance `0`; runtime inactive
- LensDistortion: intensity `0`; runtime inactive
- ColorLookup: contribution `0`; runtime inactive

After the URP build preprocessor restored its required active/override structure, no persistent asset diff was needed in `DefaultVolumeProfile.asset`: the serialized risky values were already neutral. The repair method now enforces those neutral values, and the post-build Verify method validates their runtime activation conditions.

Dedicated effect profiles are deferred. This is a safety baseline, not final visual approval.

## URP

Only two semantic URP changes were made:

- Data Driven Lens Flare support: disabled
- Screen Space Lens Flare support: disabled

Render scale, HDR, MSAA, lighting, shadows, renderer data, adaptive performance, SRP Batcher, Global Settings resources, and Unity-generated shader prefilter values were preserved.

## Unity Verification

Unity 6000.5.1f1 batchmode verification passed:

- Application identifiers match the expected value.
- Team and provisioning identifiers are not fixed in the project.
- DefaultVolumeProfile loads without missing components.
- Risky post-process effects are runtime-neutral.
- URP asset and renderer data load successfully.
- Boot and Stage1 are enabled in Build Settings.
- Proof scenes are excluded.

## iOS Build Generation

- Result: `Succeeded`
- Errors: `0`
- Warnings: `0`
- Output: `/Users/m-shogo/Developer/personal/vamp-pon-builds/ios-u45-settings-review`
- Xcode project: present
- Info.plist: present
- Boot / Stage1 payload: present
- U45 candidate Resources payload: present

This is not actual device smoke evidence. Device installation, device launch, signing completion, touch behavior, audio, haptic feedback, performance, and crash/freeze behavior still require human verification.

All device, metrics, audio, haptic, RC, production, and candidate-final readiness flags remain false.
