# ヨルノシルベ ドキュメント入口

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
U45.1 Character and Enemy Dot Runtime Pass
```

現在のUnity Stage1はroute/input/pauseのSimulator証跡がありますが、ユイとオンブはproof用Single spriteです。

```txt
implementationFoundationReady=true
simulatorPlayableCandidateReady=true
characterDotRuntimeReady=false
enemyDotRuntimeReady=false
runtimeVisualReady=false
versionedSaveServiceImplemented=false
sceneFlowCoordinatorImplemented=false
actualDeviceSmokeResult=NOT_PROVIDED
productionApproved=false
```

Point Filter、GameObject名、操作可能、Simulator route成功だけではvisual完成と扱いません。

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
