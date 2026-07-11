# Unity Current Doc Index 2026-07-10

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
Current: U46 Result / Retry / StageSelect / 灯録
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

## Current checks

```sh
pnpm implementation:preflight:check
pnpm implementation:preflight:full
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm asset-generation:check
pnpm unity:u45-ai-simulator-smoke:check
pnpm unity:meta:check
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
