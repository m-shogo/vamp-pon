# Unity U36 Sprite Atlas Production Packing Plan

## U36でやること

- Stage1 runtime候補のSprite Atlas本体を作成する。
- characters、enemies、items/icons、UI paper、effectsのatlas target inventoryとpacking evidenceを作る。
- docs/design-targets/generated、screenshots、generated final PNG、design reference、runtime未承認参照PNGをAtlas対象外として記録する。
- runtime reference safety、texture/import consistency、assetReplacementReady再判定、U30〜U35 gate addendumを残す。

## U36でやらないこと

- productionApproved=falseのまま進める。
- Addressablesは導入しない。
- Cloud Saveは導入しない。
- 本番SE、経済バランス、本番balanceは確定しない。
- mobile実機metricsはNOT_MEASUREDのまま扱う。
- 大量import設定変更や大きな新機能追加はしない。

## Atlas境界

- runtime: Unity側でruntime proof / candidateとして参照される `_Project/Resources` 配下のSprite候補。
- prototype: Web / public配下の参照基準。U36 Atlasには入れない。
- docsGeneratedOnly: `docs/design-targets/generated`、review screenshots、generated final PNG。runtimeにもAtlasにも入れない。

## U32から改善すること

U32はpacking mapのみで`.spriteatlas`本体が未作成だった。U36ではUnityプロジェクト内に`U36Characters.spriteatlas`、`U36Enemies.spriteatlas`、`U36ItemsIcons.spriteatlas`、`U36UiPaper.spriteatlas`、`U36Effects.spriteatlas`を作成し、対象/除外をJSONで検証する。

## U34 release candidate checklistへ渡す項目

- Atlas後の実機draw calls / batches確認。
- final production asset replacement。
- mobileMetricsReady、assetReplacementReady、productionApproved再判定。
- texture import platform compressionの最終化。
