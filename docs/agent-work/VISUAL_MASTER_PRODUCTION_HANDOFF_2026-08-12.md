# Visual Master Production handoff — 2026-08-12

Status: CURRENT WORKING CHECKPOINT / NOT MERGE READY / CONTINUE IN ONE THREAD

## Repository and branch

- Repository: `m-shogo/vamp-pon` only
- Working branch: `agent/visual-asset-inventory`
- Isolated worktree used for this checkpoint: `/private/tmp/vamp-pon-visual-registry`
- Authority snapshot: `origin/main = 5ec2a8f519e5ea5bcbf2d653a4e5f1d3893951d1`
- Main was fetched again immediately before checkpointing; local HEAD and `origin/main` agreed.
- The normal checkout had unrelated/user work and was not modified or pulled over.

At every meaningful batch boundary, run `git fetch origin main --prune`, compare `origin/main` with the branch base, and rebase/merge only after checking for Story/Gameplay/Visual overlap. Never force-push main.

## What is already implemented in this branch

- Visual Asset Master Registry generator and tracked JSON read models.
- 36-character coverage inventory connected to Author DB, Appearance, Era, Reality Root, theme color, named object, Star Beast, silhouette, Core5 reference and other source registries.
- Machine-readable generation batch plan.
- 36 character prompt-packet skeletons.
- Image production list with 624 explicit rows:
  - 324 Character Master component rows (9 × 36)
  - 36 Character Master composite rows
  - 8 朔夜座 Master rows
  - 21 Star Beast rows
  - 21 named-object rows
  - 142 Lorebook rows
  - 72 Gameplay rows
- Existing Asset Factory contracts are indexed instead of duplicated.
- Visual checker/CI extensions are in progress; generated snapshots must be re-exported and validated before PR.
- Checkpoint時点で`pnpm visual-assets:check`、`pnpm implementation:preflight:check`、`git diff --check`はPASS。PR/CIはまだ未実行。

## Handedness and equipment continuity

`src/game/data/characterHandednessEquipmentRegistry.ts` is the new 36-row machine-readable source.

Rules:

- dominant hand, held-item hand, shoulder, hip and mirror policy are separate.
- held item hand never proves dominant hand.
- pose never proves dominant hand.
- screen-left/right never replaces body-left/right.
- asymmetric art may not be mirrored without manual correction.
- unknown values remain `OPEN_NO_SOURCE`; never default the cast to right-handed.

Current Yui visual continuity from `goldenReferenceRegistry.ts`:

- dominant hand: OPEN
- lantern: body-right hand
- strap: body-right shoulder to body-left hip
- bag: body-left hip
- front view projection: body-right appears screen-left; body-left appears screen-right

The handedness/equipment registry still needs to be imported into the visual registry generator, prompt packets, production rows and checker in the next thread.

## Yui generation attempt

Four `1024 × 1536` full-body candidate images were generated and preserved under:

`assets/import-staging/batch-character-master/yui/rejected-v2/`

All four are rejected. They are not Story Canon, final, current, runtime-approved, or valid parents for Lorebook/Gameplay derivatives.

Primary failure:

- lantern body side was wrong in the front-view candidates;
- strap/bag body-relative direction was not preserved;
- young-adult/face specificity was weaker than the Appearance Contract;
- star embroidery introduced unsupported motif noise.

The exact prompt memory, file hashes, QA findings, rejection reasons and next-iteration corrections are tracked in:

- `data/character-assets/reviews/yui-full-body-master-v2.prompt.json`
- `data/character-assets/reviews/yui-full-body-master-v2.qa.json`
- `data/character-assets/reviews/yui-full-body-master-v2.rejects.json`

Do not delete rejected outputs; use them to prevent the same prompt failure. Do not regenerate until their records are connected to the central registry/checker.

## Immediate next work

1. Connect `characterHandednessEquipmentRegistry.ts` to coverage, prompt packets, production list and checker.
2. Register the rejected Yui attempt as archived learning-only records in the central registry.
3. Fix Master composite parent rules: component Masters may parent only the Character Master composite; Lorebook or Gameplay may never parent Master/Gameplay.
4. Ensure candidate IDs end in `-vN` and all registry IDs pass the naming checker.
5. Re-export all tracked manifests.
6. Run `pnpm visual-assets:check`, relevant static preflight, `git diff --check`, and CI.
7. Commit the coherent foundation, push, open a small draft PR, wait for CI, then squash merge only when green and review boundaries are intact.
8. Fetch latest main again before the next image batch.
9. Prepare Yui corrected same-prompt four-candidate batch; do not promote without human visual review.

## Boundaries that remain non-negotiable

- Source of Truth → Master → Lorebook Read Model / Gameplay Derived.
- Lorebook images never parent Gameplay.
- visual approval never promotes Story status.
- Future15 is not a future-era label.
- 群青残響録 is not an organization.
- 外典星座 is not 朔夜座.
- obsolete constellation does not mean evil or Star Beast assignment.
- root is not birthplace or incident area.
- no dialogue-length quality rule.
- coverage is not quality, and no completion/quality/popularity percentage is introduced.
