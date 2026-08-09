# Repository Integrity Audit — 2026-07-24 to 2026-07-25

Status: **INTEGRATED AND LOCALLY VERIFIED / remote validation pending**

## Scope

Repository only:

```txt
/Users/m-shogo/Developer/personal/vamp-pon
https://github.com/m-shogo/vamp-pon.git
```

Audited implementation inputs:

```txt
origin/main baseline=9af0418418eece712a5ea6f170630c4ee8770086
local U49 implementation head=6f90c234f07ab40dee6ff71f29a0ba0674a004e4
PR #75 audit head=74aceef453266b1710991e352ac915d287e7e8e3
integration branch=integration/u49-pr75-integrity-20260727
report commit=current document commit; resolve through Git
latest validating workflow=resolve from the integration Draft PR checks
```

The local U49 work was protected by `backup/u49-before-pr75-integration-20260727` before PR #75 was squash-integrated. The integration did not reset, clean, stash, amend, rebase, overwrite, or force-push the seven U49 commits. No other repository was inspected or modified.

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

- added one canonical current-state registry and one shared active-document manifest
- embedded exactly one fenced JSON current-state block in every active source
- reject duplicate keys, unknown keys, malformed blocks, duplicate markers, and canonical mismatch
- reject U47-current regression, candidate-provider reconnection, and unsupported readiness promotion
- verify full-preflight and CI coverage contracts from typed manifests

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
- U49 static/evidence checker
- U50 unresolved-threshold gate
- Unity meta GUID checker
- tests and build

The runner and static checker now import the same typed manifest. Missing critical checks, duplicate entries, unknown package scripts, or invalid phase/dependency order fail static preflight.

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

`fetch-depth: 0` downloads full reachable branch history and costs more network/time than a shallow checkout. This is intentional while recorded evidence can reference older ancestors. A future optimization may fetch only the base/head plus each recorded evidence commit, but must prove every ancestry check before replacing the full-history checkout.

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

### P1: U48 Golden Reference provenance mixed historical and current policy

PR #75 rewrote U48 Batch C historical manifests to the hash of the current `docs/unity-responsive-screen-policy.md` while keeping the historical `sourceHead`. That mixed two points in time and broke reproducibility.

Old hash:

```txt
2f352b145930a7e15c8f24a910eac96fc1395a53741126874e9d423156da4d0f
```

Immutable historical snapshot:

```txt
docs/design-targets/generated/unity-u48/batch-c/policy-snapshots/unity-responsive-screen-policy.2f352b145930.md
SHA-256=2f352b145930a7e15c8f24a910eac96fc1395a53741126874e9d423156da4d0f
```

Resolution:

- restored the policy content from historical source HEAD `eba336591d6414465a87cbe72db69715d7517d61`
- changed historical manifests to reference the immutable snapshot
- added `policy-supersession.json` for the separately reviewed current policy hash and compatibility result
- changed `scripts/unity/refresh-u48-batch-c-policy-hashes.py` into a read-only integrity checker
- prohibited current-policy references in:
  - `docs/design-targets/generated/unity-u48/batch-c/golden-references.json`
  - `docs/design-targets/generated/unity-u48/batch-c/generation-contracts.json`
- did not regenerate timestamps, prompts, candidates, runtime assets, human approval, or historical screenshots

### P1: U49 BGM QA contradicted intentional silence

U49 had no production-approved BGM candidate, but the QA text required an audible BGM sequence and treated any silence as a failure.

Resolution:

- adopted machine-readable `INTENTIONALLY_DISABLED`
- production BGM clip count remains 0 and audible expectation remains false
- missing/null clip errors, unexpected playback, and duplicate sources remain failures
- static AudioMixer implementation is separated from actual-device verification
- intentional silence does not promote `audioReady`

### P1: U50 thresholds were not machine-decidable

No calibrated target device class or measured baseline exists, so numeric PASS thresholds were not invented.

Resolution:

- added `docs/design-targets/generated/unity-u50/thresholds.json`
- all required numeric/method/acceptance fields remain `null`
- `u50ThresholdsDefined=false`, `calibrationRequired=true`, and `mobileMetricsReady=false`
- U50 stays blocked until threshold calibration and a future checker/schema promotion

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
- no U49 Unity C# runtime change made by the integrity integration; the seven pre-existing U49 commits are preserved
- no image/audio asset change
- no importer/meta change
- no save schema change
- no balance/reward/spawn change
- no device/audio/haptic/performance/RC readiness promotion
- no actual-device readiness promotion
- no U50/U51 promotion
- no direct update to `main`
- no local unpushed U49 work touched

## GitHub Actions verification

This repository document does not freeze its own report commit SHA, a moving branch HEAD, or a workflow run as “latest.” Resolve the report commit through Git and use the integration Draft PR checks for the latest validation.

PR #75 CI and Stage1 Quality successes are historical input evidence only; they did not include the local U49 commits and are not validation of this integration branch.

The CI contract is:

- repository contracts / static preflight / full preflight / broad regression
- U48 provenance and approval/promotion/connection/verification chain
- U49 static/evidence checker
- Unity meta, test, and build through the typed full-preflight manifest
- retained static/full logs

Stage1 Quality is a separate gameplay/assets fun-pass regression layer. Its overlap is intentional defense in depth; neither workflow result promotes actual-device readiness.

## Local integration verification

The integration worktree completed:

```txt
pnpm install --frozen-lockfile: PASS
pnpm implementation:preflight:check: PASS
pnpm implementation:preflight:full: PASS
pnpm test: 64 files / 418 tests PASS
pnpm build: TypeScript and Vite production build PASS
pnpm unity:meta:check: 1160 / 1160 unique GUIDs PASS
U48 provenance/approval/promotion/connection/verification chain: PASS
Replacement interaction: 34 Editor assertions PASS
U49 checker: PASS with U49_BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE
U50 threshold checker: PASS with BLOCKED_THRESHOLD_CALIBRATION
Unity 6000.5.1f1 normal batch compile: PASS
```

The Unity compile emitted non-fatal licensing-client reconnect and shutdown warnings, then reported script compilation success and exited batchmode with code 0. No tracked Unity file changed.

iOS export/Xcode Release build was not repeated because this integrity integration did not modify the preserved U49 C#, AudioMixer, or native Core Haptics implementation. Existing tracked U49 build evidence remains historical evidence; it does not replace pending physical-device launch and human review.

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

The integration branch starts from the protected local U49 HEAD and incorporates PR #75 as one squash-equivalent commit. It must remain Draft while actual-device audio/haptic human review is incomplete. Repository integration can be complete independently, but U49 readiness promotion and U50 start remain blocked.
