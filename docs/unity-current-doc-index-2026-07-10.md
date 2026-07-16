# Unity Current Doc Index 2026-07-10

U46 completion sources: `docs/unity-u46-app-flow-save-result-collection-2026-07-11.md`, `docs/unity-u46-ui-asset-generation-2026-07-11.md`, `docs/unity-u46-ios-simulator-smoke-2026-07-11.md`, `docs/unity-u46-visual-review-2026-07-11.md`。U46.1 hardening sources: `docs/unity-u46-1-result-save-hardening-2026-07-11.md`, `docs/unity-u46-1-ios-simulator-regression-2026-07-11.md`。U47 completion source: `docs/unity-u47-gameplay-data-runtime-2026-07-13.md`。U48 startup source: `docs/unity-u48-production-asset-expansion-plan-2026-07-14.md`。U48 approval pack checkpoint: `docs/unity-u48-production-asset-approval-pack-2026-07-14.md`。U48 candidate live preview foundation checkpoint: `docs/unity-u48-candidate-live-preview-foundation-2026-07-14.md`。U48 Batch A generation contract checkpoint: `docs/unity-u48-batch-a-generation-contracts-2026-07-14.md`。U48 Batch B human-review checkpoint: `docs/unity-u48-batch-b-human-review-ready-2026-07-16.md`。

Status: current

## 最初に読む

1. `docs/unity-big-implementation-control-center-v1.md`
2. `docs/181-current-production-canon.md`
3. `docs/unity-runtime-ownership-contract-v1.md`
4. `docs/unity-runtime-visual-readiness-gate-v1.md`
5. `docs/unity-ui-design-system-v1.md`
6. `docs/asset-generation-consistency-system-v1.md`
7. `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md`

## 現在のPhase

```txt
Completed: U46 AppFlow / Save / Result / 灯録 candidate
Completed: U46.1 Result / Save Hardening
Completed: U47 gameplay data/runtime
Current: U48 production asset expansion (IN_PROGRESS / asset approval blocked)
Completed prerequisite: U45.1 Character and Enemy Dot Runtime Pass
Completed hardening: U45.1 candidate/production readiness and Asset Factory export
```

U45.1のprovider、Multiple sprite、animation、方向、Golden Reference、Lineage、gameplay-size review、Simulator回帰を維持してU46へ進む。

## 現在の境界

```txt
Unity Editor=6000.5.1f1
2D URP
uGUI runtime
simulatorPlayableCandidateReady=true
actualDeviceSmokeResult=NOT_PROVIDED
characterDotRuntimeReady=true
enemyDotRuntimeReady=true
runtimeVisualCandidateReady=true
runtimeVisualReady=false
runtimeCandidateAssetProviderConnected=true
productionVisualAssetProviderConnected=false
productionCharacterAssetReady=false
productionEnemyAssetReady=false
devicePlayableReady=false
productionApproved=false
```

## 領域別正本

| Area | Document / code |
| --- | --- |
| title / terms | `docs/title-and-term-lock-2026-06-30.md` |
| production canon | `docs/181-current-production-canon.md` / `src/game/data/*` |
| implementation control | `docs/unity-big-implementation-control-center-v1.md` |
| runtime ownership | `docs/unity-runtime-ownership-contract-v1.md` |
| runtime visual approval | `docs/unity-runtime-visual-readiness-gate-v1.md` |
| UI | `docs/unity-ui-design-system-v1.md` |
| generated assets | `docs/asset-generation-consistency-system-v1.md` |
| responsive | `docs/unity-responsive-screen-policy.md` |
| performance | `docs/unity-mobile-performance-budget.md` |
| mobile QA | `docs/mobile-release-qa-gates.md` |
| current roadmap | `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md` |

## Current evidence

- `docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json`
- `docs/design-targets/generated/unity-u45-1/runtime-dot-readiness.json`
- `docs/design-targets/generated/unity-u45-1/animation-smoke-result.json`
- `docs/design-targets/generated/unity-u45-1-hardening/readiness.json`
- `docs/design-targets/generated/unity-u45/ai-simulator-smoke-readiness.json`
- `docs/design-targets/generated/unity-u45/settings-repair-readiness.json`
- `docs/design-targets/generated/asset-generation-consistency/readiness.json`
- `docs/design-targets/generated/unity-u46/ui-design-system-readiness.json`
- `docs/design-targets/generated/unity-big-implementation/readiness.json`
- `docs/design-targets/generated/unity-u48/batch-b/verification-summary.json`
- `docs/design-targets/generated/unity-u48/batch-b/capture-manifest.json`

## Current checks

```sh
pnpm implementation:preflight:check
pnpm implementation:preflight:full
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm asset-generation:check
pnpm unity:u45-ai-simulator-smoke:check
pnpm unity:meta:check
pnpm unity:u48-batch-b-review-ready:check
```

## Historical documents

U0〜U43のPhase docsは履歴と証跡として残す。
現在の実装順、Editor version、asset approval、READY判定を決める正本として単独使用しない。

特に以下はhistorical:

- U1開始用prompt
- U1 technical spike手順
- placeholder/proof-only合格条件
- Point Filterだけをvisual completionとみなす古い記述
- 6.5.1f1という旧version誤記

## Final rule

新規エージェントはこのindexから入り、対象Phaseの個別docだけで判断しない。
