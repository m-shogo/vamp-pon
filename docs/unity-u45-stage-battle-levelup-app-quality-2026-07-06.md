# Unity U45 StageSelect / Battle HUD / LevelUp App Quality Visual Pass

Date: 2026-07-06

## result

U45 added candidate-quality visual parts and runtime connection points for StageSelect, Battle HUD, and LevelUp without changing the U43 battle pause/input route.

## runtime connection

- StageSelect uses `u45-stage-select-map-panel`, `u45-stage-card-frame`, `u45-small-lantern-accent`, `u45-black-ink-divider`, and `u45-paper-button-frame` when available.
- Battle HUD uses `u45-battle-hud-top-frame`, `u45-battle-inventory-slot-frame`, `u45-virtual-stick-ring`, and `u45-virtual-stick-knob` as candidate visuals.
- LevelUp cards use common / rare / evolution candidate card backgrounds.
- `AppQualityAssetProvider`, `AppQualityUiFactory`, and `AppQualityTapTargets` provide the thin loading and fallback boundary.

## preserved behavior

- StageSelect overlay keeps the `U43StageSelectRuntimeOverlay` object.
- Stage1 start still uses the `Stage1へ` tap route.
- StageSelect display still calls `SetOverlayBattlePaused(true)` before start.
- Stage1 start still calls `SetOverlayBattlePaused(false)`.
- Result overlay pause route is not replaced.
- `PlayerController` movement input guard and lower-left movement area are unchanged.
- Candidate virtual stick images are decorative and `raycastTarget=false`.
- LevelUp card click callbacks and `U4TimeScaleGuard` are preserved.

## editor screenshots

Editor pre-device screenshot only. These are not actual device screenshots.

```txt
docs/design-targets/generated/unity-u45/screenshots/01-stage-select-app-quality.png
docs/design-targets/generated/unity-u45/screenshots/02-battle-hud-app-quality.png
docs/design-targets/generated/unity-u45/screenshots/03-levelup-common-card.png
docs/design-targets/generated/unity-u45/screenshots/04-levelup-rare-card.png
docs/design-targets/generated/unity-u45/screenshots/05-levelup-evolution-card.png
docs/design-targets/generated/unity-u45/screenshots/06-mobile-tap-targets.png
```

Known candidate issue:

- Editor capture can show underlying HUD elements faintly behind overlays. U45 treats this as candidate evidence, not final visual approval. U43 behavior safety is prioritized until actual device smoke.

## candidate boundary

- `candidateAssetsApprovedAsFinal=false`
- Generated images are candidate-only.
- No generated screen composition is treated as a final production asset.
- All candidate assets have code fallback.

## evidence

```txt
docs/design-targets/generated/unity-u45/u45-app-quality-scope.json
docs/design-targets/generated/unity-u45/u45-app-quality-readiness.json
docs/design-targets/generated/unity-u45/u45-runtime-connection-map.json
docs/design-targets/generated/unity-u45/generated-asset-qa.json
docs/design-targets/generated/unity-u45/ios-build-generation-preflight.json
```

## iOS build generation preflight

The post-U45 Unity batchmode compile/import check and iOS Xcode project generation completed successfully on 2026-07-10.

- Build result: `Succeeded`
- Errors: `0`
- Warnings: `3`
- Output: `/Users/m-shogo/Developer/personal/vamp-pon-builds/ios-u45-app-quality-smoke`
- Device install/run: not attempted
- Actual device smoke: `NOT_PROVIDED`

This is not actual device smoke evidence. U45 generated assets remain candidate-only, and the READY flags below remain false.

## readiness

Keep false:

- `devicePlayableReady=false`
- `mobileMetricsReady=false`
- `audioMixerReady=false`
- `audioLatencyMeasured=false`
- `hapticMeasured=false`
- `rcReady=false`
- `productionApproved=false`
