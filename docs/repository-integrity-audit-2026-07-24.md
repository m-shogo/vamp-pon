# Repository Integrity Audit — 2026-07-24

Status: remediation implemented on review branch; GitHub Actions verification pending

## Scope

Repository only:

```txt
/Users/m-shogo/Developer/personal/vamp-pon
https://github.com/m-shogo/vamp-pon.git
```

Remote baseline:

```txt
origin/main=9af0418418eece712a5ea6f170630c4ee8770086
branch=maintenance/u49-integrity-audit-20260724
```

This audit used the GitHub repository as the remote source of truth. The local Mac worktree and any unpushed U49 commits were not accessible through the connector and were intentionally not overwritten. No other repository was inspected or modified.

## Audit objectives

- find active documentation that contradicts current implementation/evidence
- find readiness flags that could be promoted or reverted from stale text
- review preflight coverage for the completed U47/U48 chain
- review CI coverage for source-of-truth drift
- preserve U49 actual-device boundaries
- avoid gameplay, asset, Unity runtime, and readiness promotion changes

## Findings

### P0: active source-of-truth drift

Current evidence and production canon recorded:

```txt
Completed: U47
Completed: U48
Current: U49
runtimeVisualClassification=production-animated-sprite
runtimeVisualCandidateReady=false
runtimeVisualReady=true
productionVisualAssetProviderConnected=true
```

The following active entry/review files still described U47 as current and the U45.1 candidate provider as current:

- `README.md`
- `docs/00-index.md`
- `AGENTS.md`
- `CLAUDE.md`
- `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md`
- `docs/unity-runtime-visual-readiness-gate-v1.md`
- `docs/visual-qa-gates.md`

Impact: a new agent or reviewer could reconnect candidate visuals, report U48 incomplete, or use old candidate evidence as the current production state.

Resolution: all active files now agree on U48 completion, U49 current, production visual runtime ready, and device/audio/haptic/performance/RC/product readiness false.

### P0: preflight accepted stale active docs

`check-unity-big-implementation-readiness.ts` validated links and selected phrases but did not compare phase/provider/readiness values across active documents.

Impact: contradictory active source-of-truth files passed the static preflight.

Resolution: the checker now validates current phase and current visual boundary across:

- current index
- README
- docs index
- AGENTS
- CLAUDE
- roadmap
- runtime visual policy
- visual QA policy

It also rejects U47-current regression, candidate-provider regression, device-ready regression, and production-approved regression.

### P1: full preflight omitted the final U48 promotion chain

The full runner covered early U48 candidate/review checks but did not include all final human approval, promotion, production connection, and production verification checks.

Resolution: added final U48 checks for Batch B/C, human selection, approved production set, production visual connection, production verification, StageSelect runtime, and replacement interaction.

### P1: CI did not run the source-of-truth preflight

The main pull-request workflow ran test/build and selected asset checks, but did not run `pnpm implementation:preflight:check`.

Impact: documentation/readiness drift could merge even when the local static checker would reject it.

Resolution: `.github/workflows/ci.yml` now runs the static implementation preflight after dependency installation.

### P1: production visual classification semantics were ambiguous

The adopted visual gate mixed responsive Simulator verification with actual-device production approval wording.

Resolution:

- `production-animated-sprite` means final/runtime-approved assets, production provider/registry, required animation, and responsive runtime verification.
- `production-approved` additionally requires actual-device visual/playability, performance/release QA, and explicit product approval.

This preserves the current valid boundary:

```txt
runtimeVisualReady=true
devicePlayableReady=false
mobileMetricsReady=false
rcReady=false
productionApproved=false
```

### P2: U48 evidence filenames were easy to misstate

The final audited evidence paths are:

```txt
docs/design-targets/generated/unity-u48/human-selection-decision.json
docs/design-targets/generated/unity-u48/approved-production-set.json
docs/design-targets/generated/unity-u48/production-visual-connection.json
docs/design-targets/generated/unity-u48/production-verification/manifest.json
```

The active index/policy files now use these exact filenames.

## Changed files

```txt
.github/workflows/ci.yml
AGENTS.md
CLAUDE.md
README.md
docs/00-index.md
docs/unity-current-doc-index-2026-07-10.md
docs/unity-runtime-visual-readiness-gate-v1.md
docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md
docs/visual-qa-gates.md
scripts/quality/check-unity-big-implementation-readiness.ts
scripts/quality/run-unity-big-implementation-preflight.ts
docs/repository-integrity-audit-2026-07-24.md
```

## Non-changes

- no gameplay implementation change
- no Unity C# runtime change
- no asset/image/importer change
- no save schema change
- no balance change
- no current readiness JSON mutation
- no actual-device readiness promotion
- no U50/U51 promotion
- no direct update to `main`

## Verification contract

Required branch checks:

```sh
pnpm implementation:preflight:check
pnpm test
pnpm build
```

The full local preflight remains required before declaring a large implementation phase complete:

```sh
pnpm implementation:preflight:full
```

Because this remediation was performed through the GitHub connector, local commands are not recorded as executed. GitHub Actions results will be recorded after the pull request workflow runs.

## Merge safety

This branch is based exactly on remote `origin/main` at `9af0418418eece712a5ea6f170630c4ee8770086`. It is intentionally isolated from the user's unpushed local U49 work. Before integration, rebase or merge this branch with the actual local U49 branch/worktree and resolve only genuine overlaps; do not discard unpushed device-test work.
