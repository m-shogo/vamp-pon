# TOP Living Night V3 — Final Approval Local Runbook

Status: `VISUAL_POLISH_COMPLETE / EVIDENCE_ONLY_REMAINS`

The TOP V3 visual iteration is intentionally frozen after the merged fire refresh, local-star-twinkle polish, and owner TOP-only visual acceptance. Do not start another visual redesign unless a later formal/device review identifies a concrete defect.

## Current visual result

- owner TOP-only visual review: PASS / no remaining visual concern
- fire / smoke / embers / glow: accepted visually
- night sky / local twinkle: accepted visually
- clouds / distant lights / lantern: no additional adjustment requested
- buttons / readability: no remaining concern reported
- current TOP runtime capture path: 39-frame automated suite exists and previously passed 39/39 with 87/87 diagnostics

The owner note is recorded at:

`docs/design-targets/generated/top-living-night-v3/owner-top-visual-review-2026-08-11.md`

This is not a substitute for the formal shared Loading -> TOP human-review gate.

---

## Gate 1 — Formal current-main Loading -> TOP capture

Run from the clean local repository:

```bash
bash scripts/unity/run-top-v3-final-approval-capture.sh
```

The runner:

- fetches current `origin/main` and freezes the exact source commit;
- uses an isolated detached worktree;
- requires current final-core5 runtime packs;
- reruns Unity V3 verification;
- captures the formal 15-frame Loading -> TOP pack;
- binds V3/capture evidence to the same source commit and composite SHA;
- pushes evidence only to `agent/top-v3-final-approval-evidence-<source8>`;
- never pushes generated evidence directly to `main`.

Review that evidence branch, open a PR, allow CI to pass, and squash-merge it before continuing.

Do not claim this gate has run until the generated manifest says `executed=true`, `result=PASSED`, `captureCount=15`, and the evidence PR is actually merged.

---

## Gate 2 — Formal human review

The project owner's earlier TOP-only acceptance is preserved, but final human registration additionally requires the exact shared Loading -> TOP capture pack and its continuity/crop/Core5 checks.

Use the existing review preparation/registration authority:

- `scripts/unity/prepare-top-living-night-final-review-pack.sh`
- `scripts/unity/register-top-living-night-static-review.ts`
- `scripts/unity/register-top-living-night-motion-review.ts`
- `scripts/unity/register-top-living-night-human-review.ts`

Never auto-fill PASS values that a person did not actually review.

Formal review must remain candidate/capture SHA-bound. It may promote only the corresponding structured review fields; it must not directly set final runtime/production approval.

---

## Gate 3 — Simulator final evidence

After the formal V3/capture evidence is merged to main and a Simulator is booted, run:

```bash
bash scripts/unity/run-top-v3-final-approval-simulator-evidence.sh
```

This is the canonical one-command Simulator path:

1. resolve the exact source commit from the merged V3 + 15-frame capture evidence;
2. export a fresh iOS Simulator Xcode project from an isolated worktree at that exact commit;
3. embed clean Git build provenance into the Unity player;
4. build `Unity-iPhone` Release for the selected booted iOS Simulator with signing disabled;
5. verify the built `.app` bundle identifier;
6. install it into the Simulator;
7. launch the measured process once;
8. verify the embedded clean Git SHA emitted by that same process;
9. complete the existing 300 active-second FPS/memory/background-foreground evidence run;
10. register/check Simulator evidence without promoting final approval.

Default bundle identifier:

`com.mshogo.vamppon.u1`

The runner fails closed on source/composite drift, stale app identity, build-provenance mismatch, missing 15-frame evidence, or failed performance policy.

---

## Gate 4 — Physical iPhone final evidence

First export the exact-source device Xcode project:

```bash
bash scripts/unity/run-top-v3-final-approval-ios-export.sh device
```

Then build/sign/install that generated Xcode project using the currently valid local Apple Development team/profile. Do not silently change repository bundle/signing authority just to make signing pass.

Historical evidence shows that an older device run required a temporary generated-Xcode bundle-id adjustment because the local provisioning profile scope differed from the repository bundle identifier. Treat signing/profile selection as local device authority, not as a repository visual change.

After the exact-source signed app is installed and the iPhone is unlocked/awake, run the canonical measurement wrapper with the actual device identifier (and bundle id if signing required a generated-project override):

```bash
VAMPPON_PHYSICAL_IPHONE_DEVICE='<device identifier>' \
VAMPPON_IOS_BUNDLE_ID='<installed bundle identifier>' \
bash scripts/unity/run-top-v3-physical-iphone-performance-evidence.sh
```

The canonical wrapper does not use a separate provenance launch. The same measured iPhone process writes its embedded build SHA, which must match the exact V3/capture source commit before its 300-second FPS/memory/thermal/recovery evidence is accepted.

Physical evidence must still satisfy the existing thermal/performance policy; this runbook does not weaken those thresholds.

---

## Gate 5 — Guarded final promotion

Only after all structured Core5/crop/motion/human/Simulator/physical-iPhone gates are genuinely PASSED, use the existing guarded promoter:

`scripts/unity/promote-top-living-night-final-approval.ts`

Before that point, preserve:

- `approvedAsFinal=false`
- `runtimeApproved=false`
- `finalApprovalBlocked=true`

Do not manually edit these booleans around the promoter.

## Stop condition

If formal capture, formal human review, Simulator evidence, or physical-iPhone evidence identifies a concrete visual/runtime defect, fix only that defect and invalidate/recreate dependent evidence as required.

If those gates pass, TOP V3 is done. Do not continue visual polishing merely because more changes are possible.
