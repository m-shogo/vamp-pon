# Agent PR Workflow Guide

<!-- CURRENT_STATE_BEGIN -->
```json
{
  "schemaVersion": 1,
  "currentPhase": "U49 actual-device audio/haptic",
  "nextPhase": "U50 performance/touch metrics",
  "thenPhase": "U51 RC",
  "runtimeVisualReady": true,
  "physicalDeviceReady": false,
  "devicePlayableReady": false,
  "audioMixerImplemented": true,
  "audioMixerDeviceVerified": false,
  "audioReady": false,
  "audioLatencyMeasured": false,
  "hapticReady": false,
  "hapticMeasured": false,
  "u50ThresholdsDefined": false,
  "mobileMetricsReady": false,
  "rcReady": false,
  "productionApproved": false
}
```
<!-- CURRENT_STATE_END -->

Last synchronized: 2026-07-24  
Status: current agent workflow

Claude Code / Codex / ChatGPT / other coding agentsへ作業を渡す時のPR運用ルールです。速度を落とさず、未push作業、runtime ownership、source of truth、readinessを壊さないことを目的とします。

## Core Rule

Agentには大きい目的を渡してよいですが、実装単位と証跡単位は分けます。

Good:

```txt
目的: U49 actual-device audio/hapticを完了する
1. device launch blocker解消
2. deterministic audio/haptic sequence実行
3. foreground/background回帰
4. human review
5. evidence/checker/readiness同期
```

Bad:

```txt
1作業でU49、U50、U51、全画面改修、balance変更、asset再生成を同時実施
```

大きな統合promptを渡す場合も、agentはPhase / responsibility / evidence familyごとにcommitを分け、stop conditionを守ります。

## Repository Scope

Every heavy prompt must begin with:

```txt
あなたは `/Users/m-shogo/Developer/personal/vamp-pon` のみを対象に作業してください。
GitHub repo は `https://github.com/m-shogo/vamp-pon.git` です。
このrepo以外、他ディレクトリ、他プロジェクトは絶対に触らないでください。
```

## Mandatory Current Entry

作業前に読む順番:

```txt
docs/unity-big-implementation-control-center-v1.md
docs/unity-current-doc-index-2026-07-10.md
docs/181-current-production-canon.md
docs/unity-runtime-ownership-contract-v1.md
docs/unity-runtime-visual-readiness-gate-v1.md
docs/unity-ui-design-system-v1.md
docs/asset-generation-consistency-system-v1.md
docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md
docs/visual-qa-gates.md
```

Historical Phase docsはsupporting evidenceです。current index/readinessを上書きする指示として使いません。

Current boundary:

```txt
Completed: U47 gameplay data/runtime
Completed: U48 production asset expansion
Current: U49 actual-device audio/haptic
runtimeVisualClassification=production-animated-sprite
runtimeVisualReady=true
devicePlayableReady=false
mobileMetricsReady=false
rcReady=false
productionApproved=false
```

## Before Editing

1. `git status --short`とbranch/HEAD/originを確認する
2. uncommitted/untracked workを勝手に削除・stash・resetしない
3. 同じfile/pathを別作業が編集していないか確認する
4. source of truth同士のPhase/readinessが一致するか確認する
5. 大規模作業前に実行する

```sh
pnpm implementation:preflight:check
```

矛盾がある場合、feature workより先に整合性を修復します。

## Default Change Size

- docs/policy synchronization: coherent source-of-truth family
- visual helper/component: 1 responsibility
- screen implementation: 1 screen/state family
- gameplay logic: 1 system/state transition family
- asset change: 1 contract/approval/promotion family
- device validation: 1 evidence matrix

Avoid:

- unrelated formatting
- broad rename
- silent logic/balance changes
- multiple transitional monolithsの同時大改造
- docs/readinessだけの昇格

## Prompt Structure

Every prompt should include:

```txt
Target repo:
Allowed branch/worktree:
Baseline HEAD / origin:
Goal:
Current Phase/readiness:
Scope:
Do not touch:
Must preserve:
Source of truth:
Stop conditions:
Verification:
Evidence:
Commit/push policy:
Completion report:
```

## Current Visual / UI Prompt Template

```txt
目的:
<screen/state> を現行production visual、UI Design System、Visual QA Gatesに沿って改善する。

必須参照:
- docs/unity-current-doc-index-2026-07-10.md
- docs/181-current-production-canon.md
- docs/unity-ui-design-system-v1.md
- docs/unity-runtime-visual-readiness-gate-v1.md
- docs/visual-qa-gates.md

対象:
- <explicit file paths>

維持:
- gameplay/save/balance
- navigation/pause ownership
- production provider/registry
- proof/candidate/production approval境界
- Compact / Standard / Large readability
- 正式表記「黒耀化」

禁止:
- AI画像のfull-screen直貼り
- text/controlの画像焼き込み
- candidate assetのproduction昇格
- readiness JSONだけの変更
- U1Stage1SceneBootstrap / U2BattleControllerへの無関係な責務追加

検証:
pnpm implementation:preflight:check
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm assets:verify
pnpm test
pnpm build

完了レポート:
1. baseline / end HEAD
2. changed files and owners
3. gameplay/save/readiness changes
4. Compact / Standard / Large evidence
5. command results
6. known risks
7. commit/push/CI
```

## Asset Prompt Template

```txt
目的:
<asset group> をcandidate生成からapproval/runtime verificationまで安全に進める。

必須:
- Asset Generation Contract
- Golden Reference
- prompt/reference/output hashes
- Generation Lineage
- automatic QA
- human review
- approvedAsFinal/runtimeApproved分離
- production provider/registry connection
- gameplay-size verification

禁止:
- 未承認assetのproduction path接続
- Web PNGを由来記録なしでproduction化
- 既存U48承認を新規assetへ自動継承
- filename/import設定だけでvisual approval
```

## U49 Actual-device Prompt Template

```txt
目的:
U49 actual-device audio/hapticを、同一buildと端末証跡で検証する。

必須:
- device/build identity
- deterministic SE sequence
- deterministic haptic sequence
- mixer/BGM/mute behavior
- foreground/background recovery
- duplicate/missing feedback確認
- human review
- evidence/checker/readiness同期

境界:
- Editor/SimulatorだけでaudioMixerReady/audioLatencyMeasured/hapticMeasuredを上げない
- U49結果からmobileMetricsReady/rcReady/productionApprovedを自動昇格しない
- launch blockerがある場合はBLOCKEDとして記録し、偽PASSにしない
```

## Review Prompt Template

```txt
このPRを、実装・evidence・checker・docsの4面でレビューしてください。

確認:
1. repo/branch/baselineは正しいか
2. userの未push作業を破壊していないか
3. scopeとruntime ownerは適切か
4. gameplay/save/balanceにsilent driftがないか
5. proof/candidate/production/device/release境界が維持されるか
6. source of truth同士が一致するか
7. Compact / Standard / Largeで読めるか
8. required commands/evidenceが実行・記録されているか
9. historical evidenceをcurrent evidenceへ流用していないか
10. P0/P1と残リスクは何か

出力:
- MERGE / HOLD / REWORK
- findingsをP0/P1/P2順
- required fixes
- verification gaps
- merge/local-work safety
```

## File Risk Tiers

### Low Risk

- isolated docs/history additions
- independent test fixture
- generated report with stable schema

### Medium Risk

- current index/policy/checker
- reusable UI component
- asset manifest/catalog
- read model/presenter

### High Risk

- `U1Stage1SceneBootstrap.cs`
- `U2BattleController.cs`
- AppFlow/pause/save owner
- production asset provider/registry
- Sprite importer/animator
- gameplay definition/runtime state
- readiness evidence/checker pair
- CI/preflight runner

Rules:

- high-risk changes require small responsibility scope and explicit regression evidence
- current docs + checker should change together when a contract changes
- readiness promotion requires implementation + evidence + checker

## Safe Parallel Work

Safe when paths and ownership do not overlap:

- device verification vs unrelated historical docs
- asset inventory vs isolated UI component
- QA checklist vs runtime implementation

Avoid parallel edits to:

- same scene/controller
- same provider/registry
- same evidence manifest
- same current index/readiness JSON
- same branch with uncommitted work

## Conflict Prevention

1. fetch/compare latest remote before branching
2. preserve user worktree changes
3. use a dedicated branch when local work is stopped or unpushed
4. do not force-push or reset shared work without explicit instruction
5. rebase/merge only after checking actual overlap
6. do not merge a maintenance PR over newer unpushed device evidence blindly

## Verification and Reporting

Do not claim commands or device actions that were not executed.

Agent completion must include:

```md
## Result
COMPLETE / CONDITIONAL / BLOCKED

## Git
Start HEAD:
End HEAD:
Branch:
origin/main:
Worktree:
Commit/push/PR:

## Changed scope

## Runtime/gameplay/save/readiness impact

## Verification
- static preflight:
- full preflight:
- tests:
- build:
- Unity compile/export:
- Simulator:
- actual device:
- CI:

## Evidence

## P0/P1/P2 findings resolved

## Remaining risks
```

## Merge Decision

### MERGE

- source of truth一致
- scope/ownership明確
- required checks/evidence PASS
- no silent gameplay/save/readiness drift
- local unpushed workとの統合方法が安全

### HOLD

- CI/evidence/human review不足
- actual-device必須項目が未実施
- minor contradiction/reference gap
- merge baseが古く、local workとの重複確認が必要

### REWORK

- user worktreeを破壊
- wrong repo/path変更
- readiness docs-only promotion
- candidate/proofをproduction扱い
- Simulatorをactual-device evidence扱い
- 正式用語、ownership、save migration、source of truth破壊

## Final Rule

Velocity is valuable only when the next change becomes safer. 見栄えの良い大量差分より、次の開発者が現在地を誤認せず、未push作業を失わず、同じcheckerで再検証できる変更を優先します。
