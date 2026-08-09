# ヨルノシルベ TOP「生きている夜」Production Layer Kit v2

Date: 2026-08-01  
Runtime connection: 2026-08-06  
Status: `V2_LAYER_KIT_VERIFIED / V3_RUNTIME_RECAPTURE_REQUIRED / FINAL_ART_BLOCKED`  
Target: Unity `6000.5.1f1`, URP `17.5.0`, portrait iPhone

## Current role

This directory is the **verified 17-asset production layer kit and motion-source authority** for TOP. It is no longer the whole-screen static composition authority by itself.

Current Runtime V3 uses:

- `top-living-night-layered-candidate-430x932.png` as a temporary visual-recovery base composite,
- the V2 fire flipbook / smoke / embers as live motion overlays,
- V2 distant-light / robot-eye / fire-glow / lantern-glow masks through the V3 luminance-additive shader,
- V2 source assets and manifest as provenance / build-input authority.

The current V3 base composite is **not final Core5 art**. Final human identity remains blocked until the Core5-locked replacement passes its dedicated identity, crop, motion and runtime gates.

## Runtime flow

TOP appears after seasonal Loading in normal startup. `夜へ出る` enters the existing StageSelect flow and `灯録` enters the existing Collection flow. AppFlow state, save and battle contracts are unchanged.

`VAMPPON_AI_SIMULATOR_SMOKE` remains isolated so existing canonical simulator evidence is not silently redefined by the new normal-start screen.

## V2 build architecture

```txt
docs/design-targets/generated/top-living-night-v2/layers
  ├─ Editor: source PNGs are read from the repository
  └─ Build: manifest bytes / SHA-256 are validated
             ↓
           Assets/Resources/TopLivingNight temporary staging
             ↓
           Unity TextureImporter
           - iOS ASTC 6x6
           - Read/Write OFF
           - mipmap OFF
           - Clamp / Bilinear
             ↓
           built player uses Resources.Load<Texture2D>
             ↓
           generated Resources are cleaned after build
```

The committed source of truth remains under `docs/`; generated Resources copies are temporary and must not be committed.

Both the V2 layer-kit staging path and the V3 composite staging path now clean temporary Resources on normal completion **and on staging/import failure**.

## Layer stack and current V3 use

| Order | File | Role | Current V3 use |
| --- | --- | --- | --- |
| 00 | `00-environment-starless.png` | environment source | provenance / fallback only while V3 composite is active |
| 01 | `01-stars.png` | stars | provenance / fallback; star timing contract retained |
| 01 | `01-moon.png` | crescent moon | provenance / fallback |
| 02 | `02-clouds-far.png` | far clouds | provenance / fallback; motion contract retained |
| 03 | `03-clouds-near.png` | near clouds | provenance / fallback; motion contract retained |
| 04 | `04-distant-lights-mask.png` | station-light mask | live V3 additive mask |
| 05 | `05-distant-companion.png` | distant companion | provenance / fallback only |
| 06 | `06-characters.png` | current bridge character source | provenance / fallback only; **not final Core5 identity** |
| 08 | `08-animal-robot.png` | animal + robot | provenance / fallback only |
| 08 | `08-robot-eye-mask.png` | robot eye mask | live V3 additive mask / rare event |
| 09 | `09-fire-base.png` | fire base | provenance / fallback only |
| 10 | `10-fire-flipbook-atlas.png` | 4x3 / 12-frame fire atlas | live V3 motion overlay |
| 11 | `11-fire-glow-mask.png` | fire glow mask | live V3 additive mask |
| 12 | `12-smoke-atlas.png` | 3x2 / 6 smoke sprites | live V3 motion overlay |
| 13 | `13-embers-atlas.png` | ember sprites | live V3 motion overlay |
| 14 | `14-foreground-accents.png` | foreground accents | provenance / fallback only |
| 14 | `14-lantern-glow-mask.png` | lantern glow mask | live V3 additive mask |

## Motion policy

The TOP remains deliberately non-video-based. MP4/WebP files under `previews/` are review-only and are never referenced by runtime code.

Independent timing anchors are retained for:

- fire frame progression,
- fire glow,
- far/near clouds,
- stars,
- distant station lights,
- lantern light,
- rare robot-eye event,
- smoke,
- embers.

This is intended to create a quiet, asynchronous “breathing night” rather than a short obvious master loop.

## Reduced Motion

When `vamp_pon_reduced_motion=1` or `reduce_motion=1`:

- cloud displacement stops,
- smoke / embers are visually suppressed,
- rare robot-eye event is disabled,
- fire playback slows,
- fire-glow variation is restrained,
- UI remains interactive.

The static source contract is checked in CI; actual Reduced Motion runtime behavior remains a separate review gate.

## Evidence split — do not conflate V2 and V3

### V2 layer-kit Unity evidence — PASSED

`docs/design-targets/generated/top-living-night-v2/runtime-unity-verification.json` records real Unity 6000.5.1f1 execution:

```txt
executed=true
result=PASSED
verifiedCommit=f4b9480926371d5710824f913e6719b2afa11418
assertionCount=270
failureCount=0
sourceAssetCount=17
resourceTextureCount=17
buildImportPolicyPassed=true
```

This proves the V2 17-asset import/build contract at that verified commit. It does **not** prove the current V3 composite/shader/capture.

### Current V3 Unity evidence — NOT_RUN

`docs/design-targets/generated/top-living-night-v3/runtime-unity-verification.json` is the authority for the current V3 composite/shader/build path:

```txt
executed=false
result=NOT_RUN
assertionCount=0
resourceTextureCount=0
resourceMaterialCount=0
```

Therefore the current V3 implementation must not be described as Unity-runtime verified yet.

### Current V3 capture evidence — NOT_RUN

`docs/design-targets/generated/loading-seasonal-v1/runtime-capture-manifest.json` currently records:

```txt
executed=false
result=NOT_RUN
expectedCaptureCount=15
captureCount=0
```

Historical captures remain regression history only.

## Preview evidence

- `previews/top-living-night-layered-candidate-360x800.png`
- `previews/top-living-night-layered-candidate-390x844.png`
- `previews/top-living-night-layered-candidate-430x932.png`
- `previews/layer-contact-sheet.png`
- `previews/motion-checkpoints.png`
- `previews/top-living-night-layer-motion-preview.mp4`
- `previews/top-living-night-layer-motion-preview.webp`

The 430x932 layered preview currently serves as the V3 **visual-recovery bridge** only. It is not final Core5 key art.

## Final-art boundary

Final TOP approval is controlled by V3 structured evidence:

```txt
docs/design-targets/generated/top-living-night-v3/final-art-status.json
docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json
docs/design-targets/generated/top-living-night-v3/crop-review-status.json
docs/design-targets/generated/top-living-night-v3/motion-review-status.json
```

Current boundary:

```txt
finalCandidateGenerated=false
core5IdentityReviewed=false
cropReviewComplete=false
fiveMinuteRuntimeReviewComplete=false
reducedMotionRuntimeReviewComplete=false
approvedAsFinal=false
runtimeApproved=false
finalApprovalBlocked=true
```

## Completed source/static work

- 17/17 V2 PNG integrity / dimensions / SHA-256 contract
- real V2 Unity 6000.5.1f1 verification: 270 assertions / 17 textures / PASS
- Unity normal-start TOP connection
- StageSelect / Collection route reuse
- fire / smoke / ember / cloud / star / light / rare robot-eye motion source contract
- Reduced Motion source policy
- verified compressed Resources staging policy
- failure-safe build cleanup for V2 and V3 staging
- V3 base-composite lifecycle reuse / fallback restore / mask cleanup
- current capture waits for both layered TOP readiness and V3 composite readiness
- final Core5 / crop / motion / approval consistency gates wired into Stage1 Quality

## Remaining gates

These require current runtime/art evidence and must not be promoted from static GitHub checks alone:

- current V3 Unity compile / shader / Resources verification,
- current Loading 12 + TOP 3 runtime captures,
- human visual review of the current capture artifact,
- Core5-locked final 430x932 key art,
- per-character Core5 identity review,
- 360x800 / 390x844 / 430x932 crop review,
- five-minute normal-motion runtime review,
- one-minute Reduced Motion runtime review,
- Simulator FPS / memory,
- physical iPhone FPS / memory / thermal,
- background / foreground recovery.

PR #76, U49 device evidence, readiness flags, gameplay, balance, save schema and canonical lore are unchanged.
