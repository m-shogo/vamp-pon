# Visual Master Production handoff — 2026-08-12

Status: CURRENT REVIEW CHECKPOINT / PR #304 / NO STORY OR RUNTIME PROMOTION

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
- Visual checker/CIは、生成snapshot同期、36人coverage、624 production item、親子DAG、既存Asset Factory contract index、利き腕/装備、Yui reject境界まで接続済み。
- PR #304はdraftとして作成済み。各更新後にlocal verificationとGitHub CIを再実行し、greenを確認してからreview-ready/mergeへ進める。

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

The handedness/equipment registry is connected to the central registry, coverage rows, all 36 prompt packets, Character Master production rows and the objective checker.

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

1. Re-export all tracked manifests and prove that no snapshot is stale or hand-edited.
2. Run `pnpm visual-assets:check`, current Visual Design Master checkers, implementation preflight, `git diff --check`, build/test and GitHub CI.
3. Confirm PR #304 is based on latest `origin/main`, has no unrelated Gameplay/U49 changes, and remains mergeable.
4. Mark PR #304 review-ready and squash merge only when all checks are green and authority boundaries remain fail-closed.
5. Fetch latest main again after merge.
6. Use the versioned Yui v3 same-prompt four-candidate packet for the next small intake batch; generated outputs, selection and promotion remain separate gates, and only selection/promotion require Human visual review.

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
