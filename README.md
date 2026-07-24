# ヨルノシルベ

旧名 `Vamp Pon` / `ヴァンサバ改` は開発コード名です。正式販売タイトルは **ヨルノシルベ** です。

スマホ縦持ち向けのサバイバルローグライト。

```txt
影を払い、記憶を拾い、朝まで残る。
```

## 最初に読む

```txt
docs/unity-big-implementation-control-center-v1.md
docs/unity-current-doc-index-2026-07-10.md
docs/181-current-production-canon.md
docs/unity-runtime-ownership-contract-v1.md
docs/unity-runtime-visual-readiness-gate-v1.md
docs/unity-ui-design-system-v1.md
docs/asset-generation-consistency-system-v1.md
docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md
```

古いprototype資料や個別Phase資料と矛盾した場合は、上記、`src/game/data/*`、現行Unity runtime、最新evidence/checkerを優先します。

## 現在の開発状態

### Web

Web版はゲーム仕様、データ、画面比較、素材確認の正本/検証環境です。製品runtimeはUnityへ段階移行しています。

### Unity

```txt
Unity 6000.5.1f1
Render Pipeline: 2D URP
Runtime UI: uGUI
Reference viewport: 390x844 portrait
Bundle Identifier: com.mshogo.vamppon.u1
```

到達済み:

```txt
U43: 実機前P0 runtime repair
U44: Web -> Unity parity audit
U45: StageSelect / Battle HUD / LevelUp candidate
U45.1: Character / Enemy Multiple animation runtime + readiness hardening
U46: AppFlow / Save / Result / Retry / StageSelect / 灯録 candidate
U46.1: Result / Save hardening
U47: gameplay definitions / runtime state / production DataRegistry
U48: production visual asset expansion / approval / runtime connection / Simulator verification
```

## 現在の最優先

```txt
U49 actual-device audio / haptic
```

U48では、人間承認済み46 visual groupをproduction catalogへ昇格し、production providerからruntime接続しました。Preview defineなしのiOS Simulator buildでCompact / Standard / Large、合計138 captureを検証済みです。

この完了は **U48 visual runtime scope** に限定されます。実機操作、音、振動、性能、RC、ストア公開承認は未完了です。

## 現在のreadiness

```txt
implementationFoundationReady=true
simulatorPlayableCandidateReady=true
simulatorRouteEvidenceStillValid=true
simulatorCandidateAnimationVisualReviewPassed=true
simulatorFinalArtApprovalProvided=true
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

`implementationFoundationReady=true` は、正本・責務・preflightが整理された意味です。`runtimeVisualReady=true` はU48のproduction visual runtimeが接続・検証済みという意味であり、実機品質やリリース承認を意味しません。

## 次の順序

```txt
U49 actual-device audio / haptic
↓
U50 device performance / touch metrics
↓
U51 RC
```

## Runtime ownership

正本:

```txt
docs/unity-runtime-ownership-contract-v1.md
```

重要ルール:

- UIはcommandを送るがbattle/saveを直接実装しない
- pause/navigationは単一ownerを通す
- Definition / Runtime State / Save DTOを分離する
- Saveはversioned JSONで安定IDだけを保存する
- Result/灯録はread modelを描画する
- `U1Stage1SceneBootstrap`と`U2BattleController`へ新機能を集中させない
- proof / candidate / production provider approval levelを分離する

## Unity UI Design System

正式採用:

```txt
9-slice / Sprite Border
ScriptableObject Theme
Visual State
Responsive Layout Profile
Editor Component Catalog
Base -> Variant prefab policy
UI Sprite Import Policy
Sprite Atlas
```

正本:

```txt
docs/unity-ui-design-system-v1.md
```

新規・変更画面はCompact / Standard / Largeを確認し、生成された完成画面画像をそのままruntimeへ貼りません。

## Asset Generation Consistency

正式採用:

```txt
Asset Generation Contract
Golden Reference Registry
Generation Lineage
同一Contractで4候補比較
prompt/reference/output SHA-256
Automatic QA + Human Review
candidate/final/runtime approval分離
```

通常の新規asset初期値:

```txt
approvedAsFinal=false
runtimeApproved=false
```

U48で承認されたproduction setは、個別の承認記録とruntime verificationに基づきtrueへ昇格済みです。新しい生成物を自動的にU48承認済みとして扱ってはいけません。

Contract source of truthは`src/game/data/assetGenerationPolicy.ts`です。

```txt
local / ignored: data/asset-factory/generation-contracts.json
tracked: data/asset-factory/generation-contracts.summary.json
```

正本:

```txt
docs/asset-generation-consistency-system-v1.md
```

## 主要コマンド

大規模実装前の静的確認:

```sh
pnpm implementation:preflight:check
```

既存checker、asset検査、test、buildを束ねた完全確認:

```sh
pnpm implementation:preflight:full
```

個別確認:

```sh
pnpm assets:verify
pnpm asset-generation:check
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm unity:u47-gameplay-data-runtime:check
pnpm unity:u48-production-asset-expansion:check
pnpm unity:u48-human-selection:check
pnpm unity:u48-approved-production-set:check
pnpm unity:u48-production-visual-connection:check
pnpm unity:u48-production-visual-verification:check
pnpm unity:meta:check
pnpm test
pnpm build
```

GitHub接続だけで編集した場合、ローカル実行済みと記録しません。

## 対応解像度

```txt
Compact: 360x800 / 375x812
Standard: 390x844 / 393x852
Large: 412x915 / 430x932
```

Safe Area、タップ領域、HUD役割、virtual stick位置、icon比率は固定し、padding/card width/gapをtierで調整します。

## 現行用語

```txt
灯技 / 継灯 / 暁灯
黒耀化 / 煤返り / 黒耀瓶
灯具 / 持ち物 / 忘れ物 / 落とし物 / 記憶片
灯継ぎ / 暁開き / 灯合わせ
灯録 / 記憶のしるし / 旅の記録 / 夜明け
灯紋具 / 灯紋 / 無紋 / 暁紋 / 黒紋 / 双灯紋 / A-Z灯紋
```

`黒曜化`ではなく、必ず **黒耀化** と表記します。

## 技術方針

```txt
Web: TypeScript + Phaser + Vite
Unity: 6000.5.1f1 / 2D URP / uGUI
Editor tools: UI ToolkitまたはEditorWindow
Mobile: iOS優先 / portrait
```

現段階では採用しません。

- runtime UI Toolkit全面移行
- Addressablesの早期導入
- 大規模外部UIフレームワーク
- 生成画面画像の直貼り
- 未追跡生成assetのfinal/runtime採用
- proof providerやSingle spriteのproduction-ready扱い
- cloud save / account / ads / analyticsの先行導入
