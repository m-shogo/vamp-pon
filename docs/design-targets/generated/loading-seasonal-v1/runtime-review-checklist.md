# Loading -> TOP runtime review checklist

Status: `V3_RECAPTURE_REQUIRED / CURRENT_RUNTIME_NOT_RUN`

This checklist applies to the current TOP Runtime V3 implementation.

The repository also retains an older 15-frame capture pack for historical diagnosis. That pack is **not current V3 approval evidence** and must not be used to promote runtime or final approval.

## Why the historical capture is invalid for V3 approval

The older pack did complete 15/15 screenshots, but visual inspection later exposed two material issues:

- Loading screenshots contained development-only `capture hold · season` text.
- TOP screenshots were effectively dark/black with blurred glow regions because opaque-black light-mask PNGs were being alpha-blended as ordinary `RawImage` layers.

Those screenshots remain useful as regression history only.

Current source fixes include:

- development capture text is no longer rendered,
- TOP Runtime V3 base composite bridge,
- luminance-additive mask shader,
- dark-safe mask detach behavior,
- transparent Stars / CloudsFar / CloudsNear remain live above the V3 base composite,
- sky-overlay alpha sparsity is checked in CI,
- timeout may reveal UI but does not promote capture readiness,
- capture readiness requires `Smoke_01` and `Ember_01`,
- capture waits for both complete TOP readiness and V3 composite readiness.

Therefore all current V3 capture/human-review approval items below remain pending until the new run is executed.

## Capture matrix

The automated pack is configured for all required frames at 360x800, 390x844, and 430x932.

| Frame | Forced index | Required captures |
| --- | ---: | ---: |
| loading-spring | 0 | 3 |
| loading-summer | 1 | 3 |
| loading-autumn | 2 | 3 |
| loading-winter | 3 | 3 |
| top | n/a | 3 |

Total required current runtime captures: **15**.

## Current automated capture result

Current authority:

```txt
runtime-capture-manifest.json
executed=false
result=NOT_RUN
expectedCaptureCount=15
captureCount=0
```

- [ ] Unity 6000.5.1f1 executes the current V3 full capture matrix.
- [ ] V3 Unity verification reports `PASSED` for the same current implementation.
- [ ] `runtime-capture-manifest.json` reports `PASSED`.
- [ ] Capture count is 15/15.
- [ ] PNG dimensions match 360x800 / 390x844 / 430x932.
- [ ] SHA-256 is recorded for every current PNG.
- [ ] New current V3 capture evidence is committed.

Historical capture files under `runtime-captures/` do not satisfy these boxes while the current manifest remains `NOT_RUN`.

## Flow

Source/static contract:

- [x] Loading is connected before TOP in normal startup flow.
- [x] Loading completion defers TOP construction until Loading is dismissed.
- [x] TOP source retains `夜へ出る` -> StageSelect navigation.
- [x] TOP source retains `灯録` -> Collection navigation.
- [x] Existing `VAMPPON_AI_SIMULATOR_SMOKE` isolation remains in source.

Current runtime evidence still required:

- [ ] Current V3 runtime visibly shows Loading -> TOP without StageSelect flash-through.
- [ ] `夜へ出る` is confirmed interactively in rendered runtime.
- [ ] `灯録` is confirmed interactively in rendered runtime.
- [ ] Reinitialization does not leave duplicate Loading, TOP or `BaseComposite` objects.

## Four-art Loading rotation

Static/import evidence already retained:

- [x] Four final seasonal source PNGs are committed.
- [x] Final seasonal paths replace temporary TOP candidate paths.
- [x] Random-selection and previous-index exclusion logic remain in source.
- [x] Capture override remains isolated from production selection logic.

Current rendered verification still required:

- [ ] All four current Loading slots render at all three target resolutions.
- [ ] Repeated normal launches visibly rotate the seasonal slot.
- [ ] The same slot is not shown on two consecutive rendered launches.

## Loading visual review — current V3 pack

- [ ] No `capture hold · ...` or other development text appears.
- [ ] No unsafe crop at 360x800.
- [ ] No unsafe crop at 390x844.
- [ ] No unsafe crop at 430x932.
- [ ] Important faces and silhouettes stay outside notch / Dynamic Island risk areas.
- [ ] Bottom status and progress UI stay above the home indicator.
- [ ] Progress reads as a subtle 1–2px light rather than a heavy loading bar.
- [ ] `夜の記憶をひらいています…` remains readable on all four images.
- [ ] Bottom veil does not unnecessarily hide the illustration.
- [ ] No stretched artwork.
- [ ] No black fringe, transparent edge, unintended bar, white panel or blank frame.

## TOP Runtime V3 visual review

Current bridge/runtime architecture:

- [x] V3 base composite source is fixed at 430x932 with SHA guard.
- [x] Static duplicate environment/character/body layers are suppressed while V3 composite is active.
- [x] Transparent `Stars`, `CloudsFar`, `CloudsNear` remain active above the base composite.
- [x] Stars / far clouds / near clouds are alpha-sparsity checked so they cannot regress to opaque overlays.
- [x] Fire flipbook / smoke / embers remain dynamic overlays.
- [x] Distant lights / robot eye / fire glow / lantern glow use luminance-additive treatment.
- [x] Opaque-black mask sources are hidden when additive material is detached.
- [x] `BaseComposite` is reused rather than blindly duplicated on re-attach.
- [x] Capture source waits for `LoadingTopVisualPolishCoordinator.IsCurrentTopReady`.
- [x] `IsCurrentTopReady` is not promoted merely because the visual timeout elapsed.
- [x] Capture readiness requires `Smoke_01` and `Ember_01` to exist with textures.
- [x] Capture source also waits for `TopLivingNightCompositeV3Controller.IsCompositeReady`.

Current rendered review still required:

- [ ] TOP is neither white/blank nor black/glow-only.
- [ ] Base composite is visible before capture readiness is reported.
- [ ] Stars remain subtle and do not look doubled against the baked base.
- [ ] Far/near clouds visibly drift without obvious duplicate-edge artifacts.
- [ ] Sky overlays remain translucent and never darken/cover the character scene.
- [ ] Fire overlay aligns with the painted fire base without obvious doubling.
- [ ] Smoke is already present when capture readiness is reached and remains restrained.
- [ ] Embers are already present when capture readiness is reached and remain sparse.
- [ ] Additive masks brighten only intended light areas.
- [ ] No black opaque mask layer covers characters/environment.
- [ ] Title remains readable without covering faces.
- [ ] `夜へ出る` / `灯録` remain readable and tappable without covering important props.

## Final Core5 key-art boundary

The current V3 base composite is a **visual-recovery bridge**, not approved final TOP key art.

Artifact comparison already established that the composition direction can be kept while human identity/scale/rendering require replacement.

Current final-art state:

```txt
candidateGenerated=false
core5IdentityReviewed=false
cropReviewComplete=false
approvedAsFinal=false
finalApprovalBlocked=true
```

Required before final-art approval:

- [ ] Core5-locked 430x932 candidate is generated and committed at the canonical final path.
- [ ] Exactly five foreground humans are Yui / Asa / Nagi / Michiru / Tomori.
- [ ] No generic substitute or sixth foreground human competes with Core5.
- [ ] Yui per-character identity review passes.
- [ ] Asa per-character identity review passes.
- [ ] Nagi per-character identity review passes.
- [ ] Michiru per-character identity review passes.
- [ ] Tomori per-character identity review passes.
- [ ] Yui / Asa / Nagi remain mutually distinguishable at 360px width.
- [ ] Michiru teal identity remains distinct without neon saturation.
- [ ] Tomori rust identity remains distinct without stealing the fire focal point.
- [ ] 360x800 crop review passes.
- [ ] 390x844 crop review passes.
- [ ] 430x932 crop review passes.

Authoritative structured evidence:

- `docs/design-targets/generated/top-living-night-v3/final-art-status.json`
- `docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json`
- `docs/design-targets/generated/top-living-night-v3/crop-review-status.json`

## Motion review

Static motion contract is connected, but runtime review is **NOT_RUN**.

- [x] Fire atlas uses irregular bounded timing rather than a fixed hard-reset loop.
- [x] Far/near cloud timing anchors differ.
- [x] Stars / far clouds / near clouds are actually left active by V3 composition rather than merely animated while hidden.
- [x] Stars, distant lights, fire glow and lantern use independent timing anchors.
- [x] Robot-eye event is rare rather than continuous.
- [x] Smoke/ember duration and phases vary by particle.
- [x] Capture readiness cannot pass before at least the first smoke and ember nodes exist.
- [x] Reduced Motion source policy stops/reduces high-motion elements.
- [ ] Normal TOP is watched in runtime for at least five minutes.
- [ ] No obvious short master loop is observed.
- [ ] No accumulating particles are observed.
- [ ] No progressive brightness drift is observed.
- [ ] No texture/resource lifecycle issue is observed.
- [ ] Reduced Motion runtime pass is watched for at least one minute.
- [ ] Reduced Motion stops cloud displacement.
- [ ] Reduced Motion suppresses smoke/embers and rare robot-eye event.
- [ ] Reduced Motion retains only restrained fire/glow motion.
- [ ] UI remains fully functional under Reduced Motion.

Authoritative motion evidence:

- `docs/design-targets/generated/top-living-night-v3/motion-review-plan.md`
- `docs/design-targets/generated/top-living-night-v3/motion-review-status.json`

## Build / memory / lifecycle

Static contract:

- [x] 17-layer build staging validates source bytes/SHA and uses compressed Resources.
- [x] V3 composite staging validates fixed source SHA/dimensions.
- [x] iOS texture policy is ASTC 6x6 / Read-Write OFF / mipmap OFF / Clamp / Bilinear.
- [x] Both layer-kit and V3 staging clean stale generated Resources before staging.
- [x] Both staging paths clean generated Resources if staging/import throws.
- [x] Both staging paths retain post-build cleanup.
- [x] V3 runtime releases the loaded source Material after cloning.
- [x] V3 detach clears texture/material references before unloading/destroying assets.

Runtime evidence still required:

- [ ] Current V3 Unity verifier executes and reports `PASSED`.
- [ ] TOP dismissal/recovery does not leak or duplicate visual resources.
- [ ] Simulator FPS and memory are recorded.
- [ ] Physical iPhone FPS, memory and thermal state are recorded.
- [ ] Background -> foreground recovery returns to the correct screen.

## Current approval boundary

```txt
seasonalBinariesCommitted=true
topRuntimeV3Implemented=true
stage1StaticQuality=required-green
runtimeCaptureComplete=false
humanVisualReviewComplete=false
finalCandidateGenerated=false
core5IdentityReviewed=false
cropReviewComplete=false
fiveMinuteRuntimeReviewComplete=false
reducedMotionRuntimeReviewComplete=false
approvedAsFinal=false
runtimeApproved=false
finalApprovalBlocked=true
```

- [ ] `runtimeCaptureComplete=true` only after current V3 Unity evidence + 15/15 current screenshots pass.
- [ ] `humanVisualReviewComplete=true` only after reviewing the current captures, not historical screenshots.
- [ ] `approvedAsFinal=true` only after Core5 + 3-crop + motion + runtime gates all pass.
- [ ] `runtimeApproved=true` only after runtime, Simulator and physical-device gates pass.
- [x] PR #78 remains Draft while these gates are incomplete.

## Historical evidence rule

Historical screenshots and old PASS logs may remain in Git for provenance, but they cannot satisfy a current checkbox after a visual/runtime implementation change resets the authoritative manifest to `NOT_RUN`.
