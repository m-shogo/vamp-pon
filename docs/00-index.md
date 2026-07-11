# ヨルノシルベ ドキュメント入口

U46 completion: `unity-u46-app-flow-save-result-collection-2026-07-11.md`, `unity-u46-ui-asset-generation-2026-07-11.md`, `unity-u46-ios-simulator-smoke-2026-07-11.md`, `unity-u46-visual-review-2026-07-11.md`。

旧名 `Vamp Pon` / `ヴァンサバ改` は開発コード名です。

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

## 現在の最優先

```txt
Completed: U46 AppFlow / Save / Result / 灯録 candidate
Current: U47 gameplay data/runtime
```

U45.1でユイとオンブのMultiple sprite、実animation、candidate provider、Simulator回帰証跡を接続済み。Hardeningも完了し、候補runtimeとproduction visual/実機承認を分離した。

```txt
implementationFoundationReady=true
simulatorPlayableCandidateReady=true
characterDotRuntimeReady=true
enemyDotRuntimeReady=true
runtimeVisualCandidateReady=true
runtimeVisualReady=false
runtimeCandidateAssetProviderConnected=true
productionVisualAssetProviderConnected=false
productionCharacterAssetReady=false
productionEnemyAssetReady=false
versionedSaveServiceImplemented=false
sceneFlowCoordinatorImplemented=false
actualDeviceSmokeResult=NOT_PROVIDED
productionApproved=false
```

Point Filter、GameObject名、操作可能、Simulator route成功だけではvisual完成と扱いません。

U45.1 evidence:

```txt
unity-u45-1-character-enemy-dot-runtime-pass-2026-07-10.md
unity-u45-1-ios-simulator-animation-smoke-2026-07-10.md
design-targets/generated/unity-u45-1/
unity-u45-1-hardening-2026-07-10.md
design-targets/generated/unity-u45-1-hardening/readiness.json
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
- proof providerとproduction providerを分離
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

個別:

```sh
pnpm asset-generation:check
pnpm assets:verify
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm unity:u45-ai-simulator-smoke:check
pnpm unity:meta:check
```

## 正本の優先順位

古いprototype資料や個別Phase資料と矛盾した場合:

1. Big Implementation Control Center
2. Current Production Canon
3. Runtime Ownership Contract
4. UI / Asset / Runtime Visualのadopted docs
5. `src/game/data/*`
6. 現行Unity runtime
7. 最新evidence/checker

## Historical docs

U0〜U43の資料、初期コンセプト、U1開始promptは履歴として残します。
現在のEditor version、Phase順、asset承認、READY判定には単独使用しません。

## 最優先の判断基準

面白そうな追加より、**完成に近づく追加**を優先します。

READYは、実装・runtime接続・実寸確認・evidence・checkerが揃った時だけ上げます。
