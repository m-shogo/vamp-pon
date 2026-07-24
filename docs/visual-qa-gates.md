# Visual QA Gates

Last synchronized: 2026-07-24  
Status: current review policy

画面品質改善PRをmergeする前の判定基準です。見た目を上げながら、portrait mobileの可読性、既存ロジック、世界観、Unity runtime ownership、asset approval、release境界を壊さないことを目的とします。

## Gate 0: Scope Check

最初にPRの種類を分類します。

### Docs Only

- docs追加/更新のみ
- runtime変更なし
- assets変更なし
- readinessを上げない
- command未実行なら理由を明記する

### Asset Organization

- 画像整理、命名、manifest/evidence更新
- final / implementation / historical / unknownを分類する
- UUID画像を意味ある名前へ変更する
- `assets/` 直下へ未分類参照画像を残さない
- 画像を本番UIとして一枚貼りしない

### Visual Implementation

- Phaser/Unity画面の見た目変更
- UI helper/component追加
- animation/effect調整
- gameplay logic変更なし、または変更を明記する
- Compact / Standard / Largeを確認する
- proof / candidate / production / product-approvedを明記する

### Gameplay Change

- balance / reward / spawn / unlock / save
- Visual PRと分ける
- 仕様とテストを追加・更新する

## Gate 1: World Consistency

Merge OK:

- 夜 / 記憶 / 忘れ物 / 黒インク / ランタン / 紙 / 星図が自然に統合されている
- 汎用ファンタジー、generic anime gacha、metallic sci-fiへ寄っていない
- 紙UI / 黒インク / ランタン光が主軸
- 通常画面は静かで、レア演出だけが相対的に強い
- asset間の質感と色数が統一されている

Reject / Rework:

- horrorに寄りすぎる
- AI生成由来の読めない文字が残る
- 画面ごとに別ゲームのように見える
- glossy plastic、ネオン、宝石、金属装飾が主役になる
- 生成画像を未調整のまま混在させる

## Gate 2: Readability

Merge OK:

- Compact / Standard / Largeで主要テキストが読める
- primary CTAが明確
- Battleでplayer / enemy / EXP / HUD / Ultimate / 黒耀化が識別できる
- player/enemy runtime classificationがevidenceと一致する
- LevelUpで選択内容、rarity、所有状態、入替状態が理解できる
- Resultで報酬と次の行動が理解できる

Reject / Rework:

- 装飾やeffectが文字、敵、EXPを隠す
- 全ボタンが同じ強さに見える
- Rare演出が説明文を隠す
- カットインが長すぎてテンポを壊す
- proof/static assetをanimation完成と報告する
- candidate runtimeをproduction visualまたはrelease approvalと報告する

## Gate 3: Tap Clarity

Merge OK:

- primary CTAが最も押したく見える
- secondary CTAは控えめだが明確
- disabled / locked / selected / activeが判別できる
- touch targetとSafe Areaが端末tierで維持される
- decorationとinteractive regionが区別できる

Reject / Rework:

- 小さい紙片や装飾がボタンに見える
- Start / Growth / Retryが埋もれる
- Ultimateや入替操作が押しづらい
- invisible overlayが入力を奪う

## Gate 4: Reusability

Merge OK:

- paper card / paper button / seal / badge等がcomponentとして再利用可能
- Theme / Visual State / Responsive Layout Profileを使う
- 9-slice / Sprite Borderを使う
- Base -> Variantは最大2階層
- 色、spacing、sizeがtoken/profile化されている

Reject / Rework:

- コピペGraphicsや画面固有magic numberが大量に増える
- 同じ紙カードを画面ごとに別実装する
- helperが巨大化してruntime ownershipを侵食する
- 完成画面画像へtext/controlを焼き込む

## Gate 5: Logic Safety

Merge OK:

- visual変更だけでgameplay logicが変わっていない
- save / reward / unlock / spawn / LevelUp抽選に影響しない
- UIはcommandを送り、battle/saveを直接所有しない
- pause/navigationは単一ownerを通る
- existing tests/checkersが通る

Reject / Rework:

- 見た目PRで報酬量、敵spawn、抽選、保存が変わる
- Collection seen/newやResult保存が壊れる
- UIから`Time.timeScale`やfile I/Oを直接操作する
- readiness JSONだけをtrueへ変更する

## Gate 6: File and Ownership Safety

High-risk files:

```txt
src/game/ui/overlays.ts
src/game/ui/hud.ts
src/game/scenes/CollectionScene.ts
src/game/scenes/StageSelectScene.ts
src/game/scenes/TopScene.ts
unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs
unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U2BattleController.cs
production asset provider / registry / sprite importer / animator
```

Merge OK:

- diffが責務単位で読める
- unrelated formattingやmass rewriteがない
- input/update/state lifecycleを不必要に変えない
- provider、fallback、approval、readiness変更理由が明記される
- Definition / Runtime State / Save DTOの境界を維持する

Reject / Rework:

- Bootstrap/BattleControllerへ画面、save、AudioMixer、approval、release責務を追加する
- proof/candidate/production境界を曖昧にする
- source of truth同士が異なる現在値を持つ
- 古いPhase evidenceを現在Phaseの証拠に流用する

## Gate 7: Screen-Specific Checks

### TOP

Must pass:

- main CTAが強い
- secondary buttonsが整理されている
- タイトル、背景、装飾が差し替え可能
- 大きいキャラ一枚絵だけに依存しない

### StageSelect

Must pass:

- stage previewが地図/記憶カードとして読める
- 難易度差が文字以外でも分かる
- Start CTAが強い
- current production UI catalogと一致する

### Battle

Must pass:

- player / enemy / EXP / HP / time / level / Ultimate / 黒耀化が読める
- runtime classificationがcurrent readiness JSONと一致する
- required animation stateと実frameが確認できる
- production完成を主張する場合、proof/candidate providerが製品経路から外れている
- procedural fallbackが通常product routeで動いていない

Fail if:

- background/effectがgameplay entityを隠す
- GameObject名やPoint Filterだけでドット完成扱いする
- Sprite Mode Singleをsprite sheet扱いする
- Simulator route smokeだけを美術承認へ流用する
- `runtimeVisualReady=true`をactual-device/release承認へ流用する

### LevelUp / Replacement

Must pass:

- cardsのicon / title / description / rarityが読める
- ownership、slot capacity、replacement対象、declineが理解できる
- Rareは強いが通常情報を隠さない
- tap targetとfocus orderが明確

### Result

Must pass:

- 記憶ページ/ledgerの階層が読める
- rank / reward / clear-fail / next actionが明確
- Retry / StageSelect / TOPの戻り先が正しい
- Result UIがbattle simulationやfile I/Oを所有しない

### Collection / 灯録

Must pass:

- notebook/ledgerとして読める
- tabs / NEW / locked / seenが明確
- read modelを表示し、runtime battle stateを直接変更しない

### 黒耀化 / Ultimate

Must pass:

- display textは **黒耀化**
- dangerous but heroic
- warm lantern coreが残る
- 長すぎずgameplayを隠さない

Fail if:

- `KOKUYOU`をproduct UIへ表示する
- red-eye demonやgeneric anime slashだけになる
- readable state transitionが失われる

## Gate 8: Required Commands

大規模実装前:

```bash
pnpm implementation:preflight:check
```

大規模Phase完了前:

```bash
pnpm implementation:preflight:full
```

Visual/runtime implementationの最低確認:

```bash
pnpm build
pnpm test
pnpm assets:verify
pnpm asset-generation:check
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm unity:meta:check
```

U48 production visual chain変更時:

```bash
pnpm unity:u48-human-selection:check
pnpm unity:u48-approved-production-set:check
pnpm unity:u48-production-visual-connection:check
pnpm unity:u48-production-visual-verification:check
```

GitHub connectorだけで変更した場合、ローカルcommandを実行済みと報告しません。PR CI結果を別に記録します。

## Gate 9: PR Report Template

```md
## Summary

## Changed files

## Visual intent

## Asset/runtime classification
procedural-placeholder / proof-static-single-sprite / candidate-animated-multiple-sprite / production-animated-sprite / production-approved

## Gameplay logic changes
None / explain

## Responsive review
Compact / Standard / Large

## Verification
- implementation preflight:
- runtime visual readiness:
- asset checks:
- tests:
- build:
- actual device:

## Readiness changes

## Screens affected

## Known risks

## Follow-up
```

## Gate 10: Unity Readiness

A visual PR improves Unity readiness when:

- component、hierarchy、runtime ownerが明確
- actual UI text remains game-rendered
- generated images have contract/lineage/approval records
- production/provider/proof boundaries are explicit
- import mode、frame count、animation stateがmachine-checkable
- procedural fallbackが検出可能
- responsive evidenceが再現可能

It hurts Unity readiness when:

- one-off drawingやmagic numberが増える
- imageへtext/controlを焼き込む
- gameplay stateとdrawing logicが絡む
- proof providerをproduction風の名前で隠す
- naming/import settingだけをvisual evidenceにする

## Gate 11: Runtime Visual Readiness

Source of truth:

```txt
docs/unity-runtime-visual-readiness-gate-v1.md
docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json
```

Current state:

```txt
runtimeVisualClassification=production-animated-sprite
characterDotRuntimeReady=true
characterAnimationReady=true
enemyDotRuntimeReady=true
enemyAnimationReady=true
productionCharacterAssetReady=true
productionEnemyAssetReady=true
runtimeVisualCandidateReady=false
runtimeVisualReady=true
runtimeCandidateAssetProviderConnected=false
productionVisualAssetProviderConnected=true
devicePlayableReady=false
mobileMetricsReady=false
rcReady=false
productionApproved=false
```

`runtimeVisualReady=true` はU48のfinal/runtime承認済みasset、production provider/registry、required animation、Compact / Standard / Large runtime verificationが揃ったことを表します。

これはactual-device playability、audio/haptic、performance、RC、store release approvalではありません。U45.1の`candidate-animated-multiple-sprite` evidenceは歴史的前提として保持し、current stateへ戻してはいけません。

## Merge Decision

### Merge

- scopeとownershipが明確
- current source of truthが一致
- tests/checkersがpass、またはdocs-only skip理由が正しい
- world/readability/tap clarityがpass
- runtime classificationと実装/evidenceが一致
- readiness promotionに実装・evidence・checkerが揃う

### Hold

- visual directionは良いがresponsive evidenceやtestが不足
- actual-deviceが必要な項目をSimulatorだけで判定している
- animation/provider/approval chainが未完了
- CI結果が未確定

### Rework

- gameplay logicが無断変更
- AI画像をfull UIとして直貼り
- text/controlを画像へ焼き込み
- battle readability悪化
- large transitional classesを無関係に全面置換
- generic/gacha/SF look導入
- Point Filter/object名だけでドット完成扱い
- proof/candidate assetをproduction-ready扱い
- runtime visual readyをrelease ready扱い
- readiness evidenceだけをtrueへ変更

## Final Rule

PRの価値はeffect数ではなく、次の開発者が安全に積み上げられ、proof/candidate/production/device/release境界を誤昇格できないことです。
