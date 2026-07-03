# Unity U36 Sprite Atlas Production Packing Review

## 変更概要

Stage1 runtime candidate sprites向けにU36 Sprite Atlas assetsを作成し、target inventory、excluded assets、packing evidence、runtime reference safety、assetReplacementReady再判定を追加した。

## 作成した.spriteatlas一覧

- `unity/VampPonUnity/Assets/_Project/SpriteAtlases/U36/U36Characters.spriteatlas`
- `unity/VampPonUnity/Assets/_Project/SpriteAtlases/U36/U36Enemies.spriteatlas`
- `unity/VampPonUnity/Assets/_Project/SpriteAtlases/U36/U36ItemsIcons.spriteatlas`
- `unity/VampPonUnity/Assets/_Project/SpriteAtlases/U36/U36UiPaper.spriteatlas`
- `unity/VampPonUnity/Assets/_Project/SpriteAtlases/U36/U36Effects.spriteatlas`

## Packing evidence

Characters 1、Enemies 1、ItemsIcons 2、UiPaper 14、Effects 7。docs/design-targets/generated、generated final PNG、screenshots、public prototype sheets、fullscreen review art are excluded.

## Texture / import consistency

Atlas settings use padding 4, no rotation, no tight packing, mipmaps off, readable false. No broad importer changes were applied. Platform compression is not final.

## Runtime reference safety

docs/design-targets/generated runtime参照なし。generated final画像のruntime直貼りなし。Addressables未導入。Cloud Save未導入。draft SEは本番SE未確定。本番balance未確定。

## assetReplacementReady再判定

assetReplacementReady=false。Sprite Atlas production packing itself is complete for U36 candidate atlases, but final asset replacement, mobile metrics, final SE, and production balance remain incomplete.

## U30〜U35 gate addendum

Sprite Atlas blocker is improved/resolved for U36. productionApproved=false、mobileMetricsReady=false、balanceHardeningReady=true、assetReplacementReady=false。

## 390x844 evidence

`docs/design-targets/generated/unity-u36/screenshots/`に8枚のEditor evidenceを追加した。runtimeへgenerated画像を貼っていない。

## 実行したcheck一覧

U36 checker、U35〜U22 checker、unity:meta:check、git diff --check、Unity U36 verification、既存Unity verification一式を実行対象にする。

## 残リスク

mobile metrics NOT_MEASURED、final production asset approval、atlas後のdraw calls / batches実機確認、final SE、本番balance、assetReplacementReady false。

## 次に残る作業

U34 release candidate checklist、U37 final mobile tuning after device metrics、U38 production approval re-check。
