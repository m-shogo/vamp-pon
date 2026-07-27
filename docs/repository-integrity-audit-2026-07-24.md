# Repository Integrity Audit — 2026-07-24 to 2026-07-25

Status: **COMPLETE on review branch / GitHub Actions verified**

## Scope

Repository only:

```txt
/Users/m-shogo/Developer/personal/vamp-pon
https://github.com/m-shogo/vamp-pon.git
```

Remote baseline and review branch:

```txt
origin/main baseline=9af0418418eece712a5ea6f170630c4ee8770086
branch=maintenance/u49-integrity-audit-20260724
verified head=7d6ccb3ee975553f5982ad083fe3cd427fd16733
pull request=#75
```

This audit used the GitHub repository as the accessible remote source of truth. The local Mac worktree and any unpushed U49/device-test commits were not accessible through the connector and were intentionally not reset, cleaned, stashed, overwritten, or force-pushed. No other repository was inspected or modified.

## Audit objectives

- find active documentation that contradicts current implementation/evidence
- prevent stale Phase/provider/readiness text from passing preflight
- verify the complete U48 human approval -> promotion -> connection -> runtime verification chain
- review CI behavior, historical Git requirements, failure diagnostics, and log retention
- preserve strict U49 actual-device audio/haptic boundaries
- define current U50 performance/touch and U51 RC gates without premature promotion
- preserve gameplay, save, asset, and current readiness values
- protect unpushed local work during integration

## Current verified boundary

```txt
Completed: U47 gameplay data/runtime
Completed: U48 production asset expansion
Current: U49 actual-device audio/haptic
Next: U50 performance/touch metrics
Then: U51 RC

runtimeVisualClassification=production-animated-sprite
runtimeVisualCandidateReady=false
runtimeVisualReady=true
runtimeCandidateAssetProviderConnected=false
productionVisualAssetProviderConnected=true
productionCharacterAssetReady=true
productionEnemyAssetReady=true
candidateAssetsApprovedAsFinal=true
actualDeviceSmokeResult=NOT_PROVIDED
devicePlayableReady=false
mobileMetricsReady=false
audioMixerReady=false
audioLatencyMeasured=false
hapticMeasured=false
rcReady=false
productionApproved=false
```

`runtimeVisualReady=true` remains limited to the U48 production visual runtime scope. It does not prove actual-device playability, audio/haptic quality, performance, RC readiness, or App Store release approval.

## Findings and remediation

### P0: active source-of-truth drift

Current evidence and production canon recorded U47/U48 complete, U49 current, and the production provider connected. Several active entry/review/agent files still described U47 as current and the U45.1 candidate provider as the current visual state.

Affected active files included:

- `README.md`
- `docs/00-index.md`
- `docs/unity-current-doc-index-2026-07-10.md`
- `AGENTS.md`
- `CLAUDE.md`
- `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md`
- `docs/unity-runtime-visual-readiness-gate-v1.md`
- `docs/visual-qa-gates.md`

Impact:

- a new agent could reconnect candidate visuals
- U48 could be incorrectly reported incomplete
- historical candidate evidence could overwrite current production readiness
- device/RC/product boundaries could be interpreted inconsistently

Resolution:

- synchronized all active entry, agent, roadmap, runtime visual, and review documents
- explicitly separated `production-animated-sprite` from `production-approved`
- retained device/audio/haptic/performance/RC/product readiness as false
- added machine-checkable `Completed / Current / Next / Then` wording

### P0: static preflight accepted contradictory active documents

`check-unity-big-implementation-readiness.ts` previously checked file existence and selected phrases, but did not compare the same Phase/provider/readiness values across active documents.

Impact: contradictory source-of-truth files could pass `implementation:preflight:check`.

Resolution:

- cross-check current Phase and visual boundary across current index, README, docs index, AGENTS, CLAUDE, roadmap, runtime visual policy, and visual QA
- reject U47-current regression
- reject candidate-provider reconnection
- reject device-ready or production-approved promotion without evidence
- verify full-preflight and CI coverage contracts

### P0: formal term checker did not cover active operating documents

The formal title/term checker inspected only a narrow historical set. Active agent workflow and review documents could reintroduce `黒曜化`, old title usage, Android scope, or stale mobile contracts without being detected.

Resolution:

- expanded `check-unity-term-lock.ts` to active entry/agent/review/mobile/performance/responsive documents
- allow explicit correction sentences only when both incorrect and correct terms are present with correction wording
- added content contracts for current iOS scope, U49-U51 boundaries, responsive tiers, readiness false values, current index routing, and CI behavior
- made `implementation:preflight:check` run this contract checker first

### P1: full preflight omitted final U48 promotion chain

The full runner covered early U48 candidate/review checks but not every final human approval, promotion, production connection, and runtime verification checker.

Resolution:

Added coverage for:

- Batch B review-ready
- Batch C contract/capture/review-ready
- human selection
- approved production set
- production visual connection
- production visual verification
- StageSelect runtime
- Replacement interaction
- current runtime visual readiness
- tests and build

### P1: CI did not execute source-of-truth or full preflight

The pull-request workflow ran selected assets, tests, and build, but could merge contradictory current docs because it did not run the implementation preflight. It also did not prove that the modified full runner itself worked.

Resolution:

- run static implementation preflight in CI
- run full implementation preflight in CI
- upload both logs with `if: always()` for failure diagnosis
- add concurrency cancellation and a 20-minute timeout
- keep Core5, enemy design, and inventory checks after full preflight

### P1: shallow checkout caused audited-ancestor false failures

The U48 production asset checker verifies that recorded readiness/completion source commits are ancestors of current HEAD using `git merge-base --is-ancestor`. GitHub Actions default checkout depth did not include those historical commits.

Impact: valid U48 evidence failed only in CI because the required Git history was absent.

Resolution:

```yaml
fetch-depth: 0
```

The ancestry checker was preserved without weakening its evidence contract.

### P1: U49 scope could absorb completed U48 visual work

The top-level control center said U48 was complete, then described U49 onward as including remaining backgrounds, VFX, and asset replacement. This allowed unrelated visual work to re-enter the actual-device audio/haptic phase.

Resolution:

- rewrote the control center as the current single entry
- U49 is actual-device audio/haptic only
- U50 is device performance/touch only
- U51 is RC only
- new visual assets start as candidates and require their own approval/verification chain
- U49 cannot automatically promote U50/U51 readiness

### P1: current mobile QA mixed old/general/Android guidance with iOS-only production scope

The mobile release and performance documents contained older general-prototype language, Android fallback assumptions, 390x844-only checks, weak performance acceptance, and insufficient Simulator/actual-device separation.

Resolution:

Updated current sources:

- `docs/mobile-release-qa-gates.md`
- `docs/unity-mobile-performance-budget.md`
- `docs/unity-responsive-screen-policy.md`

Current contracts now require:

- iOS-only current product scope
- Compact / Standard / Large responsive review
- Safe Area, notch, Dynamic Island, and home indicator handling
- actual-device U49 audio/haptic evidence
- U50 p95/p99 frame time, sustained run, memory, GC, rendering, UI rebuild, touch, and thermal evidence
- U51 device-backed RC, privacy/store/known-issues, and explicit human verdict
- no device/performance/RC promotion from Editor or Simulator alone

### P1: Golden Reference SHA-256 became stale after current policy repair

`docs/unity-responsive-screen-policy.md` is a tracked U48 Batch C Golden Reference. Correcting the active responsive policy legitimately changed its SHA-256, causing the strict Batch C checker to reject stale manifest hashes.

Old hash:

```txt
2f352b145930a7e15c8f24a910eac96fc1395a53741126874e9d423156da4d0f
```

Current hash:

```txt
5c757ea87aa4396ec59a23ffd2aeef3e7c74b76e183b1b9ecbc3fa7921a34cae
```

Resolution:

- added `scripts/unity/refresh-u48-batch-c-policy-hashes.py`
- it updates/checks only explicitly mutable policy-reference hashes
- it does not regenerate timestamps, recipes, prompts, candidate outputs, or historical screenshots
- refreshed the exact references in:
  - `docs/design-targets/generated/unity-u48/batch-c/golden-references.json`
  - `docs/design-targets/generated/unity-u48/batch-c/generation-contracts.json`
- full preflight now runs the utility in `--check` mode before the Batch C contract checker

### P2: Batch C hash failures lacked actionable diagnostics

The checker previously reported only the path, requiring external hash calculation to determine expected/current values.

Resolution: hash failures now include path, expected SHA-256, and actual SHA-256 without weakening comparison.

### P2: agent workflow distributed stale operating instructions

`docs/agent-pr-workflow.md` still contained the incorrect term, 390x844-only emphasis, old Web-centered commands, and insufficient local-work protection.

Resolution:

- current source-of-truth reading order
- current U49 boundary
- Compact/Standard/Large review
- static/full preflight commands
- formal title and term
- branch/worktree/unpushed-work protection
- runtime/readiness evidence separation

## Security and repository safety review

Targeted GitHub code searches found no matches for common committed secret markers:

```txt
BEGIN PRIVATE KEY
BEGIN CERTIFICATE
ghp_
```

This is a targeted pattern check, not a substitute for a dedicated historical secret scanner. No secret, certificate, provisioning profile, token, runtime asset, Unity importer, gameplay code, save schema, balance value, or current readiness JSON was changed by this audit.

## Changed areas

```txt
.github/workflows/ci.yml
AGENTS.md
CLAUDE.md
README.md
docs/00-index.md
docs/agent-pr-workflow.md
docs/mobile-release-qa-gates.md
docs/repository-integrity-audit-2026-07-24.md
docs/unity-big-implementation-control-center-v1.md
docs/unity-current-doc-index-2026-07-10.md
docs/unity-mobile-performance-budget.md
docs/unity-responsive-screen-policy.md
docs/unity-runtime-visual-readiness-gate-v1.md
docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md
docs/visual-qa-gates.md
docs/design-targets/generated/unity-u48/batch-c/golden-references.json
docs/design-targets/generated/unity-u48/batch-c/generation-contracts.json
package.json
scripts/quality/check-unity-big-implementation-readiness.ts
scripts/quality/check-unity-term-lock.ts
scripts/quality/check-unity-u48-batch-c-contracts.ts
scripts/quality/run-unity-big-implementation-preflight.ts
scripts/unity/refresh-u48-batch-c-policy-hashes.py
```

## Explicit non-changes

- no gameplay implementation change
- no Unity C# runtime change
- no image/audio asset change
- no importer/meta change
- no save schema change
- no balance/reward/spawn change
- no current readiness JSON mutation
- no actual-device readiness promotion
- no U50/U51 promotion
- no direct update to `main`
- no local unpushed U49 work touched

## GitHub Actions verification

Verified head:

```txt
7d6ccb3ee975553f5982ad083fe3cd427fd16733
```

Results:

```txt
CI #1100: SUCCESS
run id: 30141205525
Stage1 Quality #931: SUCCESS
run id: 30141205511
```

CI steps confirmed:

- active implementation contracts: PASS
- full implementation preflight: PASS
- Core5 gameplay frame existence: PASS
- enemy 48 design catalog: PASS
- inventory icon stock: PASS
- 180px inventory originals: PASS

Full preflight highlights:

```txt
U48 policy hash sync check: PASS
U48 human approval/promotion/connection/verification chain: PASS
Replacement interaction: 34 Editor assertions PASS
runtime visual provider: RuntimeVisualAssetProvider
runtime visual classification: production-animated-sprite
Unity meta GUIDs: 1137 / 1137 unique
Vitest: 64 files / 418 tests PASS
TypeScript + Vite production build: PASS
```

The GitHub Actions artifacts retain static and full preflight logs for 14 days.

## Evidence boundary

The successful GitHub Actions runs prove repository-static checks, tracked evidence consistency, Web tests, and Web production build. They do not prove:

- local macOS worktree cleanliness
- Unity Editor compile on the current local U49 worktree
- iOS build/install/launch for this review branch
- physical-device audio/haptic review
- physical-device performance/touch review
- RC or production approval

Those remain U49-U51 evidence responsibilities.

## Merge and local integration safety

This branch started from remote `origin/main` at `9af0418418eece712a5ea6f170630c4ee8770086` and is intentionally isolated from unpushed local U49 work.

Before integration:

1. record the actual local U49 branch, HEAD, `origin/main`, and `git status --short`
2. preserve all uncommitted/untracked/unpushed work
3. merge or rebase the audit branch into the real local U49 branch/worktree
4. resolve only genuine overlaps in current docs/checkers
5. do not reset, clean, discard, or overwrite device-test work
6. rerun `pnpm implementation:preflight:check` and `pnpm implementation:preflight:full`
7. rerun the relevant Unity compile/build/device sequence before any U49 readiness promotion

The PR should remain reviewable/squash-mergeable until local U49 integration is explicitly safe.
