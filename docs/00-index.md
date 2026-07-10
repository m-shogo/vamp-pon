# ヨルノシルベ ドキュメント入口

旧名 `Vamp Pon` / `ヴァンサバ改` は開発コード名です。

このディレクトリは、ヨルノシルベの企画・仕様・実装・品質証跡を積み上げる場所です。

## 最初に読む正本

```txt
181-current-production-canon.md
unity-ui-design-system-v1.md
asset-generation-consistency-system-v1.md
unity-runtime-visual-readiness-gate-v1.md
unity-u44-to-u51-app-quality-roadmap-2026-07-06.md
```

古いprototype資料や検討メモと矛盾した場合、上記正本、`src/game/data/*`、最新Unity evidence/checkerを優先します。

## 現在の最優先

```txt
U45.1 Character and Enemy Dot Runtime Pass
```

現在のUnity Stage1は操作・route smokeは成立していますが、ユイとオンブはproof用Single spriteで、production sprite sheetとanimationは未接続です。

```txt
simulatorPlayableCandidateReady=true
characterDotRuntimeReady=false
characterAnimationReady=false
enemyDotRuntimeReady=false
enemyAnimationReady=false
runtimeVisualReady=false
```

Point Filter、GameObject名、操作可能、Simulator route成功だけでは、ドットruntime完成と扱いません。

## 主な品質チェック

```sh
pnpm asset-generation:check
pnpm assets:verify
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm unity:u45-ai-simulator-smoke:check
pnpm unity:meta:check
```

## 旧構成メモ

初期の企画資料も履歴として残しています。

- `01-concept.md` — 初期ゲームコンセプト
- `02-core-loop.md` — 初期1プレイの流れ
- `03-five-front-system.md` — 初期5戦線案
- `04-mvp-scope.md` — 初期MVP
- `05-tech-stack.md` — 初期技術方針
- `06-roadmap.md` — 初期ロードマップ
- `07-agent-rules.md` — AIエージェント作業ルール
- `08-idea-backlog.md` — アイデア置き場

これらは現行正本ではありません。

## 最優先の判断基準

面白そうな追加より、**完成に近づく追加**を優先します。

見た目の名前や設定だけを変えて完成扱いにせず、実装・runtime接続・実寸確認・evidence・checkerが揃った時だけreadinessを上げます。
