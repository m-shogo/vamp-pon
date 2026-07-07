# Unity U45 Stage / Battle / LevelUp App Quality Plan

Date: 2026-07-06

## scope

U45 targets only:

- StageSelect
- BattleHUD
- LevelUp

Based on U44 commit: `8fbaad60a8e52badcc877bfd1ff185521b6c68f6`

Not in scope:

- Top
- Collection
- Result full replacement
- Kokuyou runtime
- Evolution runtime
- AudioMixer final
- Mobile metrics
- RC / production approval

## approach

Keep U43 runtime behavior stable and improve only the visual candidate layer:

- Add candidate UI image assets under `docs/design-targets/generated/unity-u45/assets/`.
- Add runtime candidate copies under `unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/`.
- Add thin Unity loaders/factory helpers.
- Keep generated assets as candidate-only and replaceable.
- Keep fallback UI active if a candidate sprite is missing.

## target rules

- 390x844 vertical reference.
- Safe Area and CanvasScaler remain mobile-first.
- StageSelect feels like a paper map / memory notebook.
- Battle HUD is thin, readable, and does not own the play field.
- Virtual stick is lower-left and decorative only; movement logic remains in `PlayerController`.
- LevelUp cards keep finger-sized tap targets.
- Paper UI / black ink / lantern light remain the visual axis.

## readiness boundary

This is not actual device smoke.

- `actualDeviceSmokeResultProvided=false`
- `actualDeviceSmokeResult=NOT_PROVIDED`
- `deviceScreenshot=DEVICE_SCREENSHOT_NOT_PROVIDED`
- `devicePlayableReady=false`
- `mobileMetricsReady=false`
- `audioMixerReady=false`
- `audioLatencyMeasured=false`
- `hapticMeasured=false`
- `rcReady=false`
- `productionApproved=false`

## Unity settings

The pre-existing Unity setting diffs are not part of U45:

- `unity/VampPonUnity/Assets/DefaultVolumeProfile.asset`
- `unity/VampPonUnity/Assets/UniversalRenderPipelineGlobalSettings.asset`
- `unity/VampPonUnity/Assets/_Project/Settings/U1UniversalRenderPipelineAsset.asset`
- `unity/VampPonUnity/ProjectSettings/ProjectSettings.asset`
- `unity/VampPonUnity/ProjectSettings/ShaderGraphSettings.asset`
