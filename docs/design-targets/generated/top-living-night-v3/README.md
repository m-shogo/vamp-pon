# TOP Living Night V3 — Current Authority

Status: `CURRENT_AUTHORITY / FINAL_ART_AND_RUNTIME_APPROVAL_BLOCKED`

This directory is the current approval authority for the ヨルノシルベ TOP work in PR #78.

## Authority order

Use the files below in this order when deciding current state:

1. `final-art-status.json` — canonical final-key-art lifecycle / approval state
2. `core5-reference-manifest.json` — locked Yui / Asa / Nagi / Michiru / Tomori master-binary authority
3. `core5-identity-review-status.json` — per-character Core5 identity review state
4. `crop-review-status.json` — 360x800 / 390x844 / 430x932 crop and UI-safe review state
5. `motion-review-status.json` — five-minute normal-motion and Reduced Motion runtime review state
6. `runtime-unity-verification.json` — current V3 Unity composite/shader/Resources execution evidence
7. `../loading-seasonal-v1/runtime-capture-manifest.json` — current 15-frame Loading + TOP runtime capture evidence
8. `human-visual-review-status.json` — structured human review bound to the exact final-art SHA and 15-frame capture pack
9. `runtime-device-evidence.json` — Simulator / physical iPhone performance, recovery and composite provenance evidence
10. `../loading-seasonal-v1/runtime-review-checklist.md` — human-readable current capture/runtime checklist

Supporting design authority:

- `final-identity-brief.md`
- `core5-bridge-gap-review.md`
- `final-key-art-generation-prompt.md`
- `motion-review-plan.md`

Operational helper:

- `scripts/unity/register-top-living-night-final-art.ts` — validates/registers the canonical 430x932 final candidate and safely invalidates candidate-sensitive stale evidence. `--dry-run` is exercised by Stage1.

## Historical / supporting directories

### `top-living-night-v1`

Historical four-candidate exploration only. Candidate A informed later work but is not directly promotable.

### `top-living-night-v2`

Verified 17-asset production layer kit, provenance and motion-source authority. Its real Unity evidence is PASSED at the recorded V2 commit, but that does not prove the current V3 composite/shader/capture.

### V3 bridge

Until a canonical Core5 final candidate is explicitly registered, V3 uses the V2 layered 430x932 preview as a **visual-recovery bridge** for the base composite.

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

## Locked Core5 reference authority

The final TOP generation pass is bound to exactly five repository master binaries listed in `core5-reference-manifest.json`:

1. Yui
2. Asa
3. Nagi
4. Michiru
5. Tomori

Stage1 recomputes each file's Git blob SHA-1 and rejects a silent binary replacement. Intentional character-master revision is allowed only when the reference manifest and affected downstream review/generation evidence are updated together.

The reference lock does not mean the final key art is approved. It only freezes which five character masters the current generation/review pass is expected to use.

## Composite source promotion

V3 no longer requires a C# SHA edit when the final Core5 artwork becomes ready. Editor runtime, build staging and Unity verification all follow the same `final-art-status.json` authority boundary.

### Bridge selection

The bridge is selected only while:

```txt
candidateGenerated=false
candidateSha256=""
canonical final PNG does not exist
```

If a final PNG exists while `candidateGenerated=false`, Editor runtime refuses to silently use the bridge and the build source selector fails. This makes an unregistered candidate visible as an error instead of hiding it behind a successful bridge build.

### Final Core5 selection

The final source is selected only when all of the following are true:

```txt
candidateGenerated=true
candidatePath=docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png
candidateSha256=<lowercase 64-char SHA-256>
final PNG exists
actual final PNG SHA-256 == candidateSha256
final PNG dimensions == 430x932
```

The selected final PNG is staged into the same runtime Resources path as the bridge, so the controller/motion architecture does not need a second presentation path.

`runtime-unity-verification.json` records the executed source as:

```txt
sourceCompositeKind=bridge | final-core5
sourceCompositePath=<verified source path>
sourceCompositeSha256=<verified source bytes>
```

A previous V3 Unity PASS against `bridge` is **not** valid final-art Unity evidence after `candidateGenerated=true`. Any final PNG byte change changes its SHA-256 and invalidates old Core5/crop/motion/human-review/Unity/capture/device evidence for final approval until those gates are rerun against the current candidate.

This source promotion changes only which approved base composite is presented. It does not auto-promote Core5 identity, crop, motion, human review, capture, runtime or final approval flags.

### Safe candidate registration

`scripts/unity/register-top-living-night-final-art.ts` is the canonical registration helper after the 430x932 PNG is placed at the final path.

It:

- validates PNG signature and 430x932 dimensions,
- computes candidate SHA-256,
- records the candidate in `final-art-status.json`,
- resets Core5 identity and three-crop reviews,
- resets motion and structured human visual review,
- invalidates prior V3 Unity evidence,
- invalidates prior 15-frame capture evidence,
- invalidates prior Simulator / physical-iPhone evidence,
- keeps all approval flags blocked.

If the same candidate SHA is already registered, the helper is a no-op and does not destroy valid downstream review evidence. `--dry-run` never mutates repository authority/evidence files.

## Current evidence snapshot

```txt
seasonalBinariesCommitted=true
loadingUnityImportEvidence=PASSED_154_assertions_4_textures
v2LayerKitUnityEvidence=PASSED_270_assertions_17_textures
v3UnityExecuted=false
v3UnityResult=NOT_RUN
currentCaptureExecuted=false
currentCaptureResult=NOT_RUN
runtimeCaptureComplete=false
humanVisualReviewComplete=false
finalCandidateGenerated=true
core5IdentityReviewed=false
cropReviewComplete=false
fiveMinuteRuntimeReviewComplete=false
reducedMotionRuntimeReviewComplete=false
approvedAsFinal=false
runtimeApproved=false
finalApprovalBlocked=true
```

GitHub/static quality must be read from the current PR checks rather than copied here as a HEAD-specific run number. Storing a “latest HEAD / latest CI” snapshot in this file would become stale as soon as that documentation commit creates a new HEAD.

A green GitHub/static state proves source/static/document/evidence consistency only. It does **not** promote current V3 Unity execution, current 15-frame capture, final Core5 art, human review or device approval.

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

## Human visual review provenance

`human-visual-review-status.json` is the machine-readable human review gate. It cannot be completed from a bridge capture or from a different final-art SHA.

A passing review requires:

- current final Core5 candidate generated,
- current capture manifest PASSED,
- exactly 15 reviewed frames,
- 12 Loading frames reviewed,
- 3 TOP frames reviewed,
- capture `topCompositeKind=final-core5`,
- capture candidate SHA matching current final-art SHA,
- no black/blank frames,
- no development text,
- readable Core5 identities,
- all target crops safe,
- Loading → TOP visual continuity passed.

`final-art-status.json.humanVisualReviewComplete` and Loading manifest `humanVisualReviewComplete` must exactly match this structured evidence.

## Device provenance

Simulator and physical-iPhone evidence record the exact TOP composite kind/path/SHA they observed. Final runtime approval rejects bridge-only device evidence and requires Simulator, physical iPhone, V3 Unity verification and 15-frame capture evidence to agree on the same source commit and current final-art bytes.

Physical-device thermal state must remain `nominal` or `fair` for final runtime approval; `serious` / `critical` cannot be promoted.

## Promotion rules

### `runtimeCaptureComplete=true`

Allowed only after current V3 Unity evidence and the current 15-frame capture pack are executed and PASSED. Once final Core5 art exists, the V3 Unity evidence must explicitly identify `sourceCompositeKind=final-core5` and the same candidate SHA-256.

### `core5IdentityReviewed=true`

Allowed only after all five per-character identity records pass and the five humans remain distinct at phone scale.

### `cropReviewComplete=true`

Allowed only after all three target resolutions pass title / CTA / face / signature-item / animal / robot safe-region review.

### `humanVisualReviewComplete=true`

Allowed only from PASSED structured human review evidence bound to the exact current final-art SHA and current 15-frame capture pack.

### `approvedAsFinal=true`

Allowed only when final Core5 candidate, Core5 identity, crop, structured human visual review, normal five-minute motion review, Reduced Motion review, current runtime capture and runtime/device approval are all satisfied.

### `runtimeApproved=true`

Must not be promoted by GitHub/static checks alone. It requires current final-core5 runtime evidence plus Simulator and physical-device gates defined by the PR.

## Scope safety

PR #78 must not alter or infer approval for:

- PR #76 / U49 physical-device readiness,
- gameplay or balance,
- save schema,
- canonical lore.

PR #78 remains Draft while final/runtime gates are incomplete.
