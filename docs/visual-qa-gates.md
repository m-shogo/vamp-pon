# Visual QA Gates

画面品質改善PRをmergeする前の判定基準。

目的は、見た目を上げながら、390x844の可読性・既存ロジック・世界観・今後のUnity移行を壊さないこと。

## Gate 0: Scope Check

PRの種類を最初に分類する。

### Docs Only

- docs追加/更新のみ
- runtime変更なし
- assets変更なし

Required:

- 変更範囲がdocsのみであること
- build/test未実行なら理由を書く

### Asset Organization

- 画像整理
- ファイル名変更
- docs/design-targets整備

Required:

- UUID画像を意味ある名前へ変更
- `assets/` 直下に参照画像を残さない
- final / implementation / unknown を分類
- 画像を本番UIとして一枚貼りしない

### Visual Implementation

- Phaser画面の見た目変更
- UI helper追加
- animation/effect調整

Required:

- gameplay logic変更なし、または明記
- 390x844確認
- build/test実行

### Gameplay Change

- balance
- reward
- spawn
- unlock
- save

Required:

- Visual PRと分ける
- テスト追加または更新
- 仕様説明

## Gate 1: World Consistency

Merge OK if:

- 夜 / 記憶 / 忘れ物 / 黒インク / ランタン / 紙 / 星図 のうち複数が自然に入っている
- 汎用ファンタジーUIになっていない
- ソシャゲ風の金属・ネオン・宝石UIになっていない
- 390x844で世界観が読める

Reject / Rework if:

- generic anime gachaに見える
- metallic sci-fiに見える
- horrorに寄りすぎる
- AI画像そのままの読めない文字がある
- 画面ごとに別ゲームのように見える

## Gate 2: Readability

Merge OK if:

- 主要テキストが390x844で読める
- CTAがどれか分かる
- Battleでユイ/敵/EXP/HUDが見える
- LevelUpで3択内容が分かる
- Resultで報酬と次の行動が分かる

Reject / Rework if:

- 装飾が文字を邪魔している
- 背景が敵やEXPを邪魔している
- 全ボタンが同じ強さに見える
- Rare演出が説明文を隠す
- カットインが長すぎてテンポを壊す

## Gate 3: Tap Clarity

Merge OK if:

- primary CTAが最も押したく見える
- secondary CTAが控えめだが分かる
- disabled/lockedが分かる
- selected/activeが分かる
- touch targetが小さすぎない

Reject / Rework if:

- 押せる場所と装飾の区別がつかない
- 小さい紙片がボタンに見える
- Start/Growth/Retryが弱い
- 右下Ultimateが押しづらい

## Gate 4: Reusability

Merge OK if:

- paper card / paper button / seal / badge などが再利用可能
- 画面固有の一回きり描画が増えすぎていない
- 色やサイズが引数化されている
- helperが既存UIと共存している

Reject / Rework if:

- コピペGraphicsが大量に増える
- 同じ紙カードを画面ごとに別実装している
- helperが巨大化して読めない
- 一画面のためだけに汎用ファイルを壊している

## Gate 5: Logic Safety

Merge OK if:

- visual変更だけでgameplayロジックが変わっていない
- save/localStorageに影響しない
- reward/unlock/spawnに影響しない
- existing tests pass

Reject / Rework if:

- 見た目PRで報酬量が変わった
- 見た目PRで敵の湧きが変わった
- LevelUp抽選が変わった
- Collection seen/newが壊れた
- Result保存が変わった

## Gate 6: File Safety

High-risk files:

- `src/game/ui/overlays.ts`
- `src/game/ui/hud.ts`
- `src/game/scenes/CollectionScene.ts`
- `src/game/scenes/StageSelectScene.ts`
- `src/game/scenes/TopScene.ts`

Merge OK if:

- diffが関数単位で読みやすい
- helper切り出しがある
- 既存のinput/update/stateを大きく触っていない

Reject / Rework if:

- 大ファイルが丸ごと置換されている
- unrelated formattingが大量に入っている
- UI改善とロジック変更が混在している
- 既存scene lifecycleを変えている

## Gate 7: Screen-Specific Checks

### TOP

Must pass:

- main CTAが強い
- secondary buttonsが整理されている
- タイトルは差し替え可能
- 大きいキャラ絵に依存しない

Fail if:

- Webフォーム風
- 汎用タイトル画面
- 何を押すか分からない

### StageSelect

Must pass:

- stage previewが地図カードに見える
- Easy/Normal/Hardの差が文字以外で分かる
- Start CTAが強い

Fail if:

- stage cardがただの画像枠
- 難易度が同じ見た目
- CTAが埋もれる

### Battle

Must pass:

- player readable
- enemies readable
- EXP readable
- HP/time/level readable
- Ultimate readable
- 黒曜化 gauge readable

Fail if:

- background too detailed
- effects hide enemies
- UI blocks gameplay
- hit/EXP feedback is invisible

### LevelUp

Must pass:

- 3 cards readable
- icon/title/description/rarity structure clear
- Rare special but tasteful
- tap target clear

Fail if:

- description too small
- card variants too inconsistent
- neon/gacha look

### Result Clear

Must pass:

- memory page feeling
- rank seal clear
- reward row clear
- Growth CTA strongest
- retry/stage/top secondary

Fail if:

- spreadsheet feeling
- rewards scattered
- next action unclear

### Collection

Must pass:

- notebook/ledger feeling
- six tabs readable
- NEW is lantern dot
- locked is black ink

Fail if:

- database feeling
- red badge spam
- tabs unreadable

### 黒曜化 / Ultimate

Must pass:

- display text is `黒曜化`
- dangerous but heroic
- warm lantern core remains
- not too long/blocking

Fail if:

- `KOKUYOU` appears in UI
- red-eye demon look
- unreadable chaos
- generic anime slash only

## Gate 8: Required Commands

For implementation PRs:

```bash
pnpm build
pnpm test
pnpm stage1:fun-pass:verify
pnpm character-assets:verify
pnpm runtime-assets:verify
```

For docs-only PRs:

- commands may be skipped
- must state `docs only`

For asset-only PRs:

Recommended:

```bash
pnpm runtime-assets:verify
```

## Gate 9: PR Report Template

Every visual PR should include:

```md
## Summary

## Changed files

## Visual intent

## Gameplay logic changes
None / explain

## 390x844 check
Checked / not checked

## Verification
- pnpm build:
- pnpm test:
- pnpm stage1:fun-pass:verify:
- pnpm character-assets:verify:
- pnpm runtime-assets:verify:

## Screens affected

## Known risks

## Follow-up
```

## Gate 10: Unity Readiness

A Phaser visual PR improves Unity readiness if:

- components are clearly separated
- UI hierarchy is fixed
- generated images are documented as reference
- actual UI text remains game-rendered
- visual language is documented

It hurts Unity readiness if:

- everything becomes one-off Phaser Graphics
- images are baked with text
- gameplay state and drawing logic are tangled
- screen-specific magic numbers are everywhere

## Merge Decision

### Merge

- docs-only safe
- visual scope clear
- tests pass or correctly skipped
- no logic drift
- world/readability/tap clarity pass

### Hold

- visual direction good but tests missing
- screenshots missing
- 390x844 not checked
- minor labels inconsistent

### Rework

- gameplay logic changed silently
- AI image used as full UI
- text baked into image
- battle readability worsened
- large files rewritten wholesale
- generic/gacha/SF look introduced

## Final Rule

A PR is not good because it adds more effects.

A PR is good when the next developer can safely build the next screen on top of it.
