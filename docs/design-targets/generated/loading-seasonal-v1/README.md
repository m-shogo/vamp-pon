# Loading Seasonal v1

Status: `FINAL_SEASONAL_BINARIES_COMMITTED / V3_RECAPTURE_REQUIRED`

## Runtime flow

```txt
LoadingSeasonalView
  -> TopLivingNightView
    -> StageSelect / Collection
```

The Loading view owns the first visible frame of the normal startup path. It selects one of four seasonal art slots, prevents the same slot from repeating across consecutive launches, keeps the screen visible for a minimum readable interval, then fades into TOP.

`VAMPPON_AI_SIMULATOR_SMOKE` remains isolated: the existing canonical simulator evidence path does not create Loading or TOP.

## Final seasonal sources

All four intended seasonal binaries are committed and connected. No TOP-candidate fallback is used.

| Slot | Source | Runtime file | Dimensions |
| --- | --- | --- | ---: |
| Spring | `桜灯る夜、記憶を辿る仲間たち.png` | `loading-01-spring.png` | 853x1844 |
| Summer | `湖畔に灯る夏の星祭り.png` | `loading-02-summer.png` | 852x1846 |
| Autumn | `紅葉舞う黄昏の森駅.png` | `loading-03-autumn.png` | 853x1844 |
| Winter | `雪灯りの町を舞う記憶の紙飛行機.png` | `loading-04-winter.png` | 853x1844 |

Canonical committed paths:

```txt
docs/design-targets/generated/loading-seasonal-v1/sources/loading-01-spring.png
docs/design-targets/generated/loading-seasonal-v1/sources/loading-02-summer.png
docs/design-targets/generated/loading-seasonal-v1/sources/loading-03-autumn.png
docs/design-targets/generated/loading-seasonal-v1/sources/loading-04-winter.png
```

`manifest.json` is authoritative for dimensions and SHA-256. Its current source boundary is:

```txt
assetStatus=runtime-connected-seasonal-binaries
usesFallbackSources=false
seasonalBinariesCommitted=true
```

## Runtime behavior

- four-slot random rotation,
- last selected index stored in `PlayerPrefs`,
- a random result equal to the previous index advances to the next slot,
- editor-only capture override for forcing each seasonal slot,
- minimum visible duration: 1.35 seconds,
- 0.28-second fade into TOP,
- cover-style artwork crop through `AspectRatioFitter.EnvelopeParent`,
- built player loads compressed textures from `Resources/LoadingSeasonal`,
- editor reads the committed seasonal source art directly from the repository,
- textures are released when Loading is dismissed,
- rendered copy is `夜の記憶をひらいています…`,
- development-only `capture hold · ...` text must never enter the rendered UI.

## Capture boundary

An older 15-frame capture pack remains in Git for regression history. It is **not current Runtime V3 approval evidence** because it predates the current visual/runtime implementation and included obsolete development text / broken TOP mask rendering.

Current authority is:

```txt
runtime-capture-manifest.json
executed=false
result=NOT_RUN
expectedCaptureCount=15
captureCount=0
```

A new current pack must contain:

- Spring x 360x800 / 390x844 / 430x932,
- Summer x 360x800 / 390x844 / 430x932,
- Autumn x 360x800 / 390x844 / 430x932,
- Winter x 360x800 / 390x844 / 430x932,
- TOP x 360x800 / 390x844 / 430x932.

Total: **15 current runtime screenshots**.

The current automated TOP capture waits for both:

```txt
LoadingTopVisualPolishCoordinator.IsCurrentTopReady
TopLivingNightCompositeV3Controller.IsCompositeReady
```

This prevents capture before the layered runtime and V3 base composite are both ready.

## Verification

Git-side verification includes:

```txt
check-loading-top-runtime-boundary.ts
check-loading-top-capture-pack.ts
check-loading-top-review-honesty.ts
check-loading-top-visual-polish.ts
```

Unity 6000.5.1f1 execution is a separate evidence gate. Static/GitHub checks must not promote Unity/runtime evidence by themselves.

## Approval boundary

```txt
runtimeFlowImplemented=true
seasonalBinariesCommitted=true
runtimeCaptureComplete=false
humanVisualReviewComplete=false
approvedAsFinal=false
runtimeApproved=false
finalApprovalBlocked=true
```

The four seasonal illustrations are the final committed Loading sources. What remains pending is **current Runtime V3 capture, human visual review, Simulator/device evidence, and final TOP approval**.
