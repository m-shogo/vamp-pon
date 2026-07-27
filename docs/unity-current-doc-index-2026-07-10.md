# Unity Current Doc Index

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

Original adoption date: 2026-07-10
Last synchronized: 2026-07-27
Status: current

## Completion sources

- U46: `docs/unity-u46-app-flow-save-result-collection-2026-07-11.md`
- U46.1: `docs/unity-u46-1-result-save-hardening-2026-07-11.md`
- U47: `docs/unity-u47-gameplay-data-runtime-2026-07-13.md`
- U48 human decision: `docs/unity-u48-human-asset-approval-2026-07-21.md`
- U48 completion: `docs/unity-u48-production-asset-expansion-completion-2026-07-21.md`

## 最初に読む

1. `docs/unity-big-implementation-control-center-v1.md`
2. `docs/181-current-production-canon.md`
3. `docs/unity-runtime-ownership-contract-v1.md`
4. `docs/unity-runtime-visual-readiness-gate-v1.md`
5. `docs/unity-ui-design-system-v1.md`
6. `docs/asset-generation-consistency-system-v1.md`
7. `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md`
8. `docs/design-heavy-production-future-roadmap-2026-07-27.md`

## 現在のPhase

```txt
Completed: U45.1 Character and Enemy Dot Runtime Pass
Completed: U45.1 candidate/production readiness hardening
Completed: U46 AppFlow / Save / Result / 灯録 candidate
Completed: U46.1 Result / Save Hardening
Completed: U47 gameplay data/runtime
Completed: U48 production asset expansion
Current: U49 actual-device audio/haptic
Next: U50 performance/touch metrics
Then: U51 RC
```

U49実機reviewで音質、touch、常時揺れ、TOP/StageSelect/LevelUp、黒耀化操作経路の不合格が確認された。U50へ進む前に
`docs/unity-u49-actual-device-quality-remediation-2026-07-27.md`
を完了する。

StageSelect／LevelUpはstructural remediation後も人間reviewで`FAIL`となった。キャラクター・敵以外のwhole-app visualは未承認であり、U49 Audio/Hapticとは分離したHeavy Design Phaseで扱う。phase IDを割り当て、実装を開始する前の監査正本は
`docs/unity-whole-app-heavy-design-audit-2026-07-27.md`
とする。既存の`runtimeVisualReady=true`はU48 asset connectionの履歴値であり、whole-app human visual approvalを意味しない。

Heavy Designは現在`HOLD / documentation only`であり、画像生成・Unity実装は未開始とする。今後の制作順、既存targetの再評価、ChatGPT人間監督下での画像生成、Unity実装開始ゲートは
`docs/design-heavy-production-future-roadmap-2026-07-27.md`
を正本とする。ユーザーの明示指示があるまで画像生成・runtime変更へ進まない。

## 現在の境界

```txt
Unity Editor=6000.5.1f1
2D URP
uGUI runtime
runtimeVisualClassification=production-animated-sprite
simulatorPlayableCandidateReady=true
actualDeviceSmokeResult=NOT_PROVIDED
characterDotRuntimeReady=true
characterAnimationReady=true
enemyDotRuntimeReady=true
enemyAnimationReady=true
runtimeVisualCandidateReady=false
runtimeVisualReady=true
runtimeCandidateAssetProviderConnected=false
productionVisualAssetProviderConnected=true
productionCharacterAssetReady=true
productionEnemyAssetReady=true
candidateAssetsApprovedAsFinal=true
productionDataRegistryImplemented=true
audioMixerImplemented=true
audioMixerDeviceVerified=false
audioReady=false
hapticReady=false
devicePlayableReady=false
mobileMetricsReady=false
audioMixerReady=false
audioLatencyMeasured=false
hapticMeasured=false
rcReady=false
productionApproved=false
```

`runtimeVisualReady=true` はU48で承認されたvisual groupがproduction providerへ接続され、responsive Simulator verificationを通過した意味です。actual-device、音、振動、性能、RC、store release approvalは別ゲートです。

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
| heavy design future roadmap | `docs/design-heavy-production-future-roadmap-2026-07-27.md` |
| responsive | `docs/unity-responsive-screen-policy.md` |
| performance | `docs/unity-mobile-performance-budget.md` |
| mobile QA | `docs/mobile-release-qa-gates.md` |
| current roadmap | `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md` |

## Current evidence

- `docs/design-targets/generated/unity-big-implementation/readiness.json`
- `docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json`
- `docs/design-targets/generated/unity-u47/simulator-smoke/manifest.json`
- `docs/design-targets/generated/unity-u48/approval-pack/approval-manifest.json`
- `docs/design-targets/generated/unity-u48/human-selection-decision.json`
- `docs/design-targets/generated/unity-u48/approved-production-set.json`
- `docs/design-targets/generated/unity-u48/production-visual-connection.json`
- `docs/design-targets/generated/unity-u48/production-verification/manifest.json`
- `docs/design-targets/generated/unity-u49/readiness.json`
- `docs/design-targets/generated/unity-u49/device-build-result.json`
- `docs/design-targets/generated/unity-u49/device-install-launch-result.json`
- `docs/design-targets/generated/unity-whole-app-design-audit-2026-07-27/screen-audit.json`
- `docs/design-targets/generated/unity-whole-app-design-audit-2026-07-27/human-visual-rejection.json`
- `docs/design-targets/generated/unity-u50/thresholds.json`
- `docs/design-targets/generated/unity-current-state/state.json`

U45.1 evidence remains historical prerequisite evidence and must not override the current U48 readiness:

- `docs/design-targets/generated/unity-u45-1/runtime-dot-readiness.json`
- `docs/design-targets/generated/unity-u45-1/animation-smoke-result.json`
- `docs/design-targets/generated/unity-u45-1-hardening/readiness.json`
- `docs/design-targets/generated/unity-u45/ai-simulator-smoke-readiness.json`
- `docs/design-targets/generated/unity-u45/settings-repair-readiness.json`
- `docs/design-targets/generated/asset-generation-consistency/readiness.json`
- `docs/design-targets/generated/unity-u46/ui-design-system-readiness.json`
- `docs/design-targets/generated/unity-big-implementation/readiness.json`
- `docs/design-targets/generated/unity-u48/readiness.json`
- `docs/design-targets/generated/unity-u48/approved-production-set.json`
- `docs/design-targets/generated/unity-u48/production-visual-connection-verification.json`
- `docs/design-targets/generated/unity-u48/production-verification/manifest.json`

## Current checks

```sh
pnpm implementation:preflight:check
pnpm implementation:preflight:full
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm asset-generation:check
pnpm assets:verify
pnpm unity:u47-gameplay-data-runtime:check
pnpm unity:u48-production-asset-expansion:check
pnpm unity:u48-production-asset-approval-pack:check
pnpm unity:u48-human-selection:check
pnpm unity:u48-approved-production-set:check
pnpm unity:u48-production-visual-connection:check
pnpm unity:u48-production-visual-verification:check
pnpm unity:meta:check
pnpm unity:u49-actual-device-audio-haptic:check
pnpm unity:u50-thresholds:check
```

## Historical documents

U0〜U45.1のPhase docsは履歴と証跡として残します。現在の実装順、Editor version、asset approval、READY判定を決める正本として単独使用しません。

特に以下はhistoricalです。

- U1開始用prompt
- U1 technical spike手順
- placeholder/proof-only合格条件
- Point Filterだけをvisual completionとみなす古い記述
- U45.1 candidate runtimeが現在値であるように見える記述
- 6.5.1f1という旧version誤記

## Final rule

新規エージェントはこのindexから入り、対象Phaseの個別docだけで判断しません。active source of truth同士でPhase、readiness、provider、approval stateが一致しない場合は作業を停止し、先に整合性を修復します。
