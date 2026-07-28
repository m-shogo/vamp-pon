# ヨルノシルベ ドキュメント入口

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

旧名 `Vamp Pon` / `ヴァンサバ改` は開発コード名です。

## 企画 / Character / Enemy のCurrent入口

Runtime Phase資料とは別に、人物・関係・敵を設計する時は次を入口にする。

```txt
全体Canon
→ CANON.md

Character / Story / Gameplay 統合
→ CHARACTER-STORY-INTEGRATION.md
→ character-black-youka-rescue-book-v1.md
→ story-stage-character-relationship-placement-v1.md
→ story-main-beat-sheet-v1.md
→ STAGE-ENCOUNTER-DESIGN.md
→ character-dawn-proof-book-v1.md
→ character-story-gameplay-payoff-matrix-v1.md

Character
→ CHARACTERS.md
→ character-book-v4.md
→ character-deep-core-book-v1.md

Character voice / relationship
→ RELATIONSHIPS.md
→ character-relationship-arc-book-v1.md
→ character-dialogue-relationship-book-v1.md
→ character-voice-differentiation-guardrails-v1.md
→ character-ensemble-daily-scene-bank-v1.md
→ BOND.md

Enemy / Kagemono
→ ENEMIES.md
→ enemy-encounter-relationship-pressure-v1.md
→ enemy-ecology-and-encounter-recipes-v1.md
→ kagemono-collection-entry-book-v1.md
→ src/game/data/enemyProductionDatabase.ts
```

機械可読のdesign memory:

```txt
design-targets/generated/character-relationship-arc-map-v1.json
design-targets/generated/character-relationship-coverage-v1.json
design-targets/generated/enemy-relationship-pressure-map-v1.json
design-targets/generated/character-black-youka-rescue-map-v1.json
design-targets/generated/story-stage-character-placement-v1.json
design-targets/generated/character-dawn-proof-map-v1.json
design-targets/generated/character-story-gameplay-payoff-map-v1.json
```

境界:

- Current21とFuture15を混ぜない
- Future15のbridgeはCandidateでありCurrent昇格ではない
- EnemyのCurrent identityは `src/game/data/enemyProductionDatabase.ts` を優先
- Legacy enemyからはmechanic / telegraph / silhouetteを回収しても、旧name / 旧character対応をCurrentへ戻さない
- Character rescue / Stage placement / Dawn proofの具体sceneはproduction directionであり、台詞・Boss配置・数値を自動Canon LOCKしない
- Stage1〜5のEncounter directionがCurrentになっても、20-stage全体のwave/balance設計完了とは扱わない
- この企画資料追加だけでUnity runtime / U49 / U50 / RC readinessを昇格しない

## 最初に読む

```txt
unity-big-implementation-control-center-v1.md
unity-current-doc-index-2026-07-10.md
181-current-production-canon.md
unity-runtime-ownership-contract-v1.md
unity-runtime-visual-readiness-gate-v1.md
unity-ui-design-system-v1.md
asset-generation-consistency-system-v1.md
unity-u44-to-u51-app-quality-roadmap-2026-07-06.md
```

## 現在のPhase

```txt
Completed: U46 AppFlow / Save / Result / 灯録 candidate
Completed: U46.1 Result / Save Hardening
Completed: U47 gameplay data/runtime
Completed: U48 production asset expansion
Current: U49 actual-device audio/haptic
Next: U50 performance/touch metrics
Then: U51 RC
```

U48では人間承認済み46 visual groupをproduction runtimeへ接続し、Preview defineなしのiOS Simulator buildでCompact / Standard / Large、合計138 captureを検証済みです。

この状態はU48 visual runtime scopeの完了です。実機操作、音、振動、性能、RC、アプリ全体のproduction承認は含みません。

## 現在のreadiness

```txt
implementationFoundationReady=true
simulatorPlayableCandidateReady=true
runtimeVisualClassification=production-animated-sprite
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
versionedSaveServiceImplemented=true
sceneFlowCoordinatorImplemented=true
productionDataRegistryImplemented=true
actualDeviceSmokeResult=NOT_PROVIDED
devicePlayableReady=false
mobileMetricsReady=false
audioMixerReady=false
audioLatencyMeasured=false
hapticMeasured=false
rcReady=false
productionApproved=false
```

Point Filter、GameObject名、静止画表示、操作可能、Simulator route成功だけではvisual完成と扱いません。`runtimeVisualReady=true` はfinal/runtime承認済みU48 assetがproduction providerへ接続され、responsive Simulator verificationを通過したことを表します。actual-device/release承認は別ゲートです。

## Current completion sources

```txt
unity-u46-app-flow-save-result-collection-2026-07-11.md
unity-u46-1-result-save-hardening-2026-07-11.md
unity-u47-gameplay-data-runtime-2026-07-13.md
unity-u48-human-asset-approval-2026-07-21.md
unity-u48-production-asset-expansion-completion-2026-07-21.md
```

## Current evidence

```txt
design-targets/generated/unity-big-implementation/readiness.json
design-targets/generated/unity-runtime-visual-readiness/readiness.json
design-targets/generated/unity-u47/simulator-smoke/manifest.json
design-targets/generated/unity-u48/approval-pack/approval-manifest.json
design-targets/generated/unity-u48/human-selection-decision.json
design-targets/generated/unity-u48/approved-production-set.json
design-targets/generated/unity-u48/production-visual-connection.json
design-targets/generated/unity-u48/production-verification/manifest.json
```

## 大規模実装の責務

正本:

```txt
unity-runtime-ownership-contract-v1.md
```

重要:

- navigation/pauseは単一owner
- Definition / Runtime State / Save DTOを分離
- UIからbattle/saveを直接操作しない
- Result/灯録はread modelを表示
- proof/candidate/production providerを分離
- Bootstrap/BattleControllerへ新責務を集中させない

## 主な品質チェック

静的preflight:

```sh
pnpm implementation:preflight:check
```

checker、asset、test、buildをまとめたfull preflight:

```sh
pnpm implementation:preflight:full
```

U48 production chain:

```sh
pnpm unity:u48-production-asset-expansion:check
pnpm unity:u48-production-asset-approval-pack:check
pnpm unity:u48-human-selection:check
pnpm unity:u48-approved-production-set:check
pnpm unity:u48-production-visual-connection:check
pnpm unity:u48-production-visual-verification:check
```

基盤:

```sh
pnpm asset-generation:check
pnpm assets:verify
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm unity:meta:check
```

## 正本の優先順位

古いprototype資料や個別Phase資料と矛盾した場合:

1. Big Implementation Control Center
2. Current Doc Index
3. Current Production Canon
4. Runtime Ownership Contract
5. UI / Asset / Runtime Visualのadopted docs
6. `src/game/data/*`
7. 現行Unity runtime
8. 最新evidence/checker

## Historical docs

U0〜U45.1の個別資料、初期コンセプト、U1開始prompt、candidate時代のevidenceは履歴として残します。現在のEditor version、Phase順、asset承認、READY判定には単独使用しません。

## 最優先の判断基準

面白そうな追加より、**完成に近づく追加**を優先します。

READYは、実装・runtime接続・実寸確認・evidence・checkerが揃った時だけ上げます。
