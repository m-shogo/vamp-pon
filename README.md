# ヨルノシルベ

旧名 `Vamp Pon` / `ヴァンサバ改` は開発コード名です。
正式販売タイトルは **ヨルノシルベ** です。

スマホ縦持ち向けのサバイバルローグライトです。

---

## 一言コンセプト

```txt
影を払い、記憶を拾い、朝まで残る。
```

夜にあふれる影を払い、消えかけた記憶を朝までに取り戻す、縦持ちサバイバルローグライトです。

---

## 最新の正本入口

世界観・キャラ・敵・アイテム・ステージ・Unity UIの正本は、まず以下を確認してください。

```txt
docs/181-current-production-canon.md
docs/unity-ui-design-system-v1.md
docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md
```

重要な現行資料:

```txt
docs/180-unified-character-canon.md
docs/183-character-database-v1.md
docs/184-production-content-databases.md
docs/design/world-labels.md
docs/design/item-and-character-production-canon.md
docs/design/character-production-plans.md
docs/design/emblem-canon.md
docs/design/az-emblem-canon.md
docs/prompts/az-emblem-asset-prompts.md
```

---

## 現在の開発状態

### Web

Web版は、ゲーム仕様・データ・画面比較・素材確認の正本/検証環境です。
8分のStage1ループ、武器・持ち物・進化・旅の記録などが存在します。

### Unity

Unity 6000.5.1f1 / 2D URPへ製品実装を移行中です。

現在の到達点:

```txt
U43: 実機前P0 runtime repair
U44: Web → Unity parity audit / app-quality計画
U45: StageSelect / Battle HUD / LevelUp app-quality candidate
U45: Unity設定安全化 / iOS build generation
U45: AI-only iOS Simulator smoke
```

AI-only iOS Simulator smokeでは以下を確認済みです。

```txt
Simulator build / install / launch
StageSelect pause
Stage1開始
左下virtual stick移動 / release停止
UI movement collision guard
enemy hit / pickup
LevelUp common / rare / evolution
Result pause
Retry
StageSelect復帰
Audio / haptic request hook
crashなし / unhandled exception 0
```

```txt
simulatorPlayableCandidateReady=true
actualDeviceSmokeResult=NOT_PROVIDED
devicePlayableReady=false
candidateAssetsApprovedAsFinal=false
productionApproved=false
```

Simulator結果は実機証跡や最終美術承認の代替ではありません。

---

## 現在の主な課題

AI Simulator visual reviewで確認された主な残課題:

```txt
P1: Resultがまだ疎なruntime placeholder
P2: Battle HUDの文字・slotコントラスト
P2: LevelUp説明文の余白と副テキストのコントラスト
P2: rare / evolution cardの文字分離
```

次の本実装はU46です。

```txt
1. Result ledger / Retry / StageSelect復帰の製品品質化
2. Collection / 灯録のUnity実装
3. UI Design Systemを使ったPrefab Variant移行
4. Compact / Standard / Largeのレイアウト確認
5. Component Catalog / import checker / simulator screenshotで回帰確認
```

---

## Unity UI Design System

9-sliceだけでなく、以下を正式採用しています。

```txt
9-slice / Sprite Border
ScriptableObject Theme
Visual State
Responsive Layout Profile
Editor Component Catalog
Prefab Variant policy
UI Sprite Import Policy
Sprite Atlas運用
```

正本:

```txt
docs/unity-ui-design-system-v1.md
```

基本方針:

```txt
runtime UIはuGUIを維持
UI ToolkitはEditor専用
Prefab継承はBase → Variantの2階層まで
生成画面画像をそのままruntimeへ貼らない
UIとpixel gameplay spriteのimport設定を分離
```

Unityメニュー:

```txt
VampPon > UI > Create or Refresh Design System Assets
VampPon > UI > Open Component Catalog
VampPon > UI > Validate UI Sprite Import Policy
```

repository checker:

```sh
pnpm unity:ui-design-system:check
```

---

## 現行の用語

```txt
灯技 / 継灯 / 暁灯
黒耀化 / 煤返り / 黒耀瓶
灯具 / 持ち物 / 忘れ物 / 落とし物 / 記憶片
灯継ぎ / 暁開き / 灯合わせ
灯録 / 記憶のしるし / 旅の記録 / 夜明け
灯紋具 / 灯紋 / 無紋 / 暁紋 / 黒紋 / 双灯紋 / A-Z灯紋
```

`黒曜化`ではなく、必ず **黒耀化** と表記します。

---

## Web版の実装済み要素

```txt
移動（仮想スティック / WASD・矢印）
自動攻撃
記憶片の吸引・回収
3択レベルアップ
灯具5種
持ち物5種相当
敵6種 + 8分ウェーブ
記憶包み
進化2種
暁灯「消えない名前」
HUD / ポーズ / クリア / ゲームオーバー / 旅の記録
vitestによるロジックテスト
```

WebにあるすべてがUnity runtimeへ移植済みという意味ではありません。
差分は `docs/unity-u44-web-to-unity-parity-audit-2026-07-06.md` を参照してください。

---

## 開発・起動

### Web

```sh
pnpm install
pnpm dev
pnpm build
pnpm test
```

### Unity quality checks

```sh
pnpm unity:meta:check
pnpm unity:ui-design-system:check
pnpm unity:u43-predevice-automated-smoke:check
pnpm unity:u45-stage-battle-levelup-app-quality:check
pnpm unity:u45-settings-repair:check
pnpm unity:u45-ai-simulator-smoke:check
```

主要なUnity project:

```txt
unity/VampPonUnity
```

基準解像度:

```txt
390x844 portrait
```

確認解像度:

```txt
360x800
375x812
390x844
393x852
412x915
430x932
```

---

## 技術方針

```txt
Web: TypeScript + Phaser + Vite
Unity: 6000.5.1f1 / 2D URP / uGUI
Editor design tools: UI ToolkitまたはEditorWindow
Mobile: iOS優先、縦持ち
```

Webを捨てず、仕様・データ・見た目の比較元として維持します。
製品runtimeはUnity側へ段階移行します。

現段階では以下を採用しません。

```txt
runtime UI Toolkit全面移行
Addressablesの早期導入
大規模外部UIフレームワーク
生成画面画像の直貼り
```

---

## 採用ビジュアル方向

```txt
紙片・絵本風ドット
夜の街
黒インクの影
小さなランタン
光る記憶片
紙カードUI
A-Z灯紋
やさしい不穏さ
```

重要:

```txt
コンセプトは濃く。
実装は見やすく軽く。
通常画面は静かに。
レア・進化・黒耀化だけ強く。
```

詳細は `docs/88-adopted-visual-direction.md` と `docs/unity-ui-design-system-v1.md` を参照してください。

---

## 資料について

`docs/`には過去のPrototype資料も残っています。
古い資料と矛盾した場合、以下を優先してください。

```txt
1. docs/181-current-production-canon.md
2. docs/unity-ui-design-system-v1.md
3. src/game/data/*
4. 現在のUnity evidence / checker
```

---

## 注意

パスワード、認証コード、秘密鍵、Apple Team ID、Provisioning Profile、証明書、トークンなどの機密情報はリポジトリへ保存しないでください。

外部素材を使う場合は、必ず `docs/asset-license-log.md` に出所とライセンスを記録します。
