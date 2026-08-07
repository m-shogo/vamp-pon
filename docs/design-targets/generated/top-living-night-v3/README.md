# TOP Living Night V3 — Current Authority

Status: `CURRENT_AUTHORITY / FINAL_ART_AND_RUNTIME_APPROVAL_BLOCKED`

This directory is the current approval authority for the ヨルノシルベ TOP work in PR #78.

## Authority order

Use the files below in this order when deciding current state:

1. `final-art-status.json` — canonical final-key-art lifecycle / approval state
2. `core5-identity-review-status.json` — per-character Core5 identity review state
3. `crop-review-status.json` — 360x800 / 390x844 / 430x932 crop and UI-safe review state
4. `motion-review-status.json` — five-minute normal-motion and Reduced Motion runtime review state
5. `runtime-unity-verification.json` — current V3 Unity composite/shader/Resources execution evidence
6. `../loading-seasonal-v1/runtime-capture-manifest.json` — current 15-frame Loading + TOP runtime capture evidence
7. `../loading-seasonal-v1/runtime-review-checklist.md` — human review checklist for the current capture/runtime state

Supporting design authority:

- `final-identity-brief.md`
- `core5-bridge-gap-review.md`
- `final-key-art-generation-prompt.md`
- `motion-review-plan.md`

## Historical / supporting directories

### `top-living-night-v1`

Historical four-candidate exploration only. Candidate A informed later work but is not directly promotable.

### `top-living-night-v2`

Verified 17-asset production layer kit, provenance and motion-source authority. Its real Unity evidence is PASSED at the recorded V2 commit, but that does not prove the current V3 composite/shader/capture.

### V3 bridge

The current V3 runtime uses the V2 layered 430x932 preview as a **visual-recovery bridge** for the base composite.

The bridge keeps the stable scene composition while selected V2 layers remain live above it:

- transparent `Stars`,
- transparent `CloudsFar`,
- transparent `CloudsNear`,
- fire flipbook,
- smoke,
- embers,
- distant-light / robot-eye / fire-glow / lantern-glow luminance-additive masks.

Opaque/static duplicates such as environment, moon, generic characters, fire base, animal/robot body and foreground are suppressed while the V3 base composite is active.

The sky overlays are intentionally sparse/transparent and are checked in CI so an opaque replacement cannot silently cover the base composite.

The bridge composition direction may be kept, but its human identities/rendering are not final Core5 approval.

## Current evidence snapshot

```txt
seasonalBinariesCommitted=true
loadingUnityImportEvidence=PASSED_154_assertions_4_textures
v2LayerKitUnityEvidence=PASSED_270_assertions_17_textures
v3UnityExecuted=false
v3UnityResult=NOT_RUN
currentCaptureExecuted=false
currentCaptureResult=NOT_RUN
finalCandidateGenerated=false
core5IdentityReviewed=false
cropReviewComplete=false
fiveMinuteRuntimeReviewComplete=false
reducedMotionRuntimeReviewComplete=false
humanVisualReviewComplete=false
approvedAsFinal=false
runtimeApproved=false
finalApprovalBlocked=true
```

Latest GitHub/static verification completed at:

```txt
HEAD=e3caf979b62e515e47efdc31371567b4153b36f0
CI_1690=PASS
Stage1_Quality_1521=PASS
Stage1_verify_steps=57/57
```

This green state proves source/static/document/evidence consistency only. It does **not** promote current V3 Unity execution, current 15-frame capture, final Core5 art or device approval.

## Final Core5 target

The final foreground human group must contain exactly these five identities:

1. Yui
2. Asa
3. Nagi
4. Michiru
5. Tomori

No generic substitute, identity merge, duplicate or sixth foreground human may satisfy final approval.

The final candidate canonical path is:

```txt
docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png
```

Until that PNG exists and all structured review gates pass, the current bridge remains temporary.

## Runtime V3 requirements

Current V3 architecture keeps:

- base composite for stable whole-screen rendering,
- transparent stars and far/near cloud overlays for visible sky motion,
- fire flipbook,
- smoke,
- embers,
- distant-light additive mask,
- robot-eye additive mask,
- fire-glow additive mask,
- lantern-glow additive mask,
- independent/asynchronous motion timing,
- Reduced Motion policy,
- ASTC 6x6 / Read-Write OFF / mipmap OFF / Clamp / Bilinear iOS import policy,
- failure-safe generated-Resources cleanup for Loading, V2 layer kit and V3 composite staging,
- base-composite reuse and detach cleanup,
- dark-safe additive-mask detach behavior.

### Visual reveal vs capture readiness

The runtime keeps a timeout fallback so a slow or failed layer load cannot trap the user behind a blank screen. That timeout is **not an approval/capture bypass**.

After reveal completes, `LoadingTopVisualPolishCoordinator.IsCurrentTopReady` is true only while the complete required visual set is actually ready. The required set includes `Smoke_01` and `Ember_01`, so a screenshot cannot be promoted before both particle atlases have produced visible runtime nodes.

Current automated TOP capture must therefore satisfy all of the following:

```txt
Loading has been dismissed
LoadingTopVisualPolishCoordinator.IsCurrentTopReady=true
TopLivingNightCompositeV3Controller.IsCompositeReady=true
Smoke_01 exists with a texture
Ember_01 exists with a texture
```

The capture automation retains a 45-second hard timeout; a timeout produces failure evidence rather than a partial screenshot approval.

## Promotion rules

### `runtimeCaptureComplete=true`

Allowed only after current V3 Unity evidence and the current 15-frame capture pack are executed and PASSED.

### `core5IdentityReviewed=true`

Allowed only after all five per-character identity records pass and the five humans remain distinct at phone scale.

### `cropReviewComplete=true`

Allowed only after all three target resolutions pass title / CTA / face / signature-item / animal / robot safe-region review.

### `approvedAsFinal=true`

Allowed only when final Core5 candidate, Core5 identity, crop, human visual review, normal five-minute motion review, Reduced Motion review, current runtime capture and runtime approval are all satisfied.

### `runtimeApproved=true`

Must not be promoted by GitHub/static checks alone. It requires current runtime evidence plus Simulator and physical-device gates defined by the PR.

## Scope safety

PR #78 must not alter or infer approval for:

- PR #76 / U49 physical-device readiness,
- gameplay or balance,
- save schema,
- canonical lore.

PR #78 remains Draft while final/runtime gates are incomplete.
