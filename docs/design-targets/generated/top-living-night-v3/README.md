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

The current V3 runtime uses the V2 layered 430x932 preview as a **visual-recovery bridge** for the base composite while retaining live fire/smoke/embers and luminance-additive masks.

The bridge composition direction may be kept, but its human identities/rendering are not final Core5 approval.

## Current evidence snapshot

```txt
seasonalBinariesCommitted=true
v2LayerKitUnityVerified=true
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
- failure-safe generated-Resources cleanup,
- base-composite reuse and detach cleanup.

Current automated TOP capture must wait for both:

```txt
LoadingTopVisualPolishCoordinator.IsCurrentTopReady
TopLivingNightCompositeV3Controller.IsCompositeReady
```

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
