# Unity U45 Settings Post-Commit Review

Date: 2026-07-10

Based on settings commit: `eb0aa1b427f426a9a0f06616881c553c2891dfff`

## Result

The five Unity settings files committed after U45 were reviewed against `943b88783887f17cc8d2f241b7825114d2c6187d`. Most of the large diff is Unity 6000.5.1f1 schema migration and serialization. Three semantic risks required a focused repair:

- `applicationIdentifier: {}` removed the previous explicit identifiers and allowed Unity-generated identifiers.
- The generated global Default Volume Profile required neutral effect values to prevent unintended mobile post-processing.
- Data Driven and Screen Space Lens Flare support were enabled although U45 does not use those features.

Gameplay runtime, U43 pause/input/tap guards, and U45 candidate UI code were not changed.

## File Classification

### DefaultVolumeProfile.asset

- Unity migration: Unity generated the current complete global default component set.
- Runtime impact: every default component is required to be active with overrides enabled by the URP build preprocessor.
- Repair: retain Unity's required active/override structure, while fixing risky effect values to runtime-neutral values.
- Human check: future effect-specific profiles should be separate assets and verified on device.

URP's build preprocessor intentionally restores inactive default components to active and resets their parameters. For this reason, component `active` flags are not used as the safety criterion. Safety is verified with each effect's runtime `IsActive()` condition and neutral parameter values.

### UniversalRenderPipelineGlobalSettings.asset

- Classification: Unity 6000.5.1f1 render-pipeline settings migration and resource registration.
- References: the Default Volume Profile GUID resolves, and the runtime resource settings deserialize during batchmode build.
- Shader stripping: runtime debug shader stripping remains enabled; no broad stripping policy was changed.
- Repair: none.
- Human check: review only when URP package version or renderer architecture changes.

### U1UniversalRenderPipelineAsset.asset

- Preserved: render scale 1, MSAA 1, HDR, shadows, additional lights, SRP Batcher, adaptive performance, and Unity-generated prefilter values.
- Build-size relevance: prefilter values changed during Unity serialization/build preparation, but were not manually retuned without measurement.
- Repair: disable Data Driven Lens Flare support and Screen Space Lens Flare support.
- Human check: shadow distance, HDR, lighting, and shader variants still require device metrics before tuning.

### ProjectSettings.asset

- Unity migration: platform schema, icon slots, graphics options, and platform defaults were expanded by Unity 6000.5.1f1.
- iOS risk: the explicit application identifier map was lost.
- Repair: restore iOS, Android, and Standalone identifiers to `com.mshogo.vamppon.u1` through `PlayerSettings` APIs.
- Signing: Apple Developer Team ID and manual provisioning profile remain empty and are not committed.
- Preserved: product name and release naming were left out of scope.

### ShaderGraphSettings.asset

- Classification: serialization-only change, including an empty-name field.
- Semantic change: none identified.
- Repair: none.

## Deferred Work

- Actual device install and launch
- Signing and provisioning selection in the local Xcode environment
- Device GPU/frame-time metrics
- Dedicated profiles for 黒耀化, rare, evolution, and clear effects
- Final post-process and shader-variant tuning

No candidate asset is approved as final by this review.
