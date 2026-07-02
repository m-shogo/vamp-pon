# Unity U32 Production Asset Replacement Final Polish Review

## 変更概要

U32ではruntime asset inventory、asset boundary guard、Sprite Atlas production packing evidence、texture import safety review、visual consistency polish record、runtime asset replacement hooks、assetReplacementReady verdictを追加した。production approvalではない。

## Runtime Asset Inventory

Runtime draft、prototype、production candidate、docs generated only、generated reference only、blocked from runtime、needs replacement、needs review、final approved laterを分類した。

## Asset Boundary Guard

`docs/design-targets/generated`、generated final PNG、completed screen image、Addressables、Cloud Save、production approval true、final-approved draft SEをruntimeからブロックする方針とcheckerを追加した。

## Sprite Atlas Production Packing Evidence

characters、enemies、items-icons、UI paper、effectsのpacking mapを追加した。generated docs assets、review screenshots、fullscreen reference art、completed screen imagesは除外。`.spriteatlas` production assetはU32では未完。

## Texture Import Safety Review

U29 policyに沿って分類を確認した。大量import設定変更はしていない。platform compression、max texture size、filter mode最終値は未確定。

## Final Visual Consistency Polish

390x844 evidence screenshotsを追加し、紙UI / 黒インク / ランタン光の方向を維持した。大きなデザイン変更やgameplay tuningはしていない。

## Runtime Asset Replacement Hooks

U32 runtime asset key、inventory entry、replacement entry、registry、missing asset fallback policyを追加した。Addressablesは導入していない。

## assetReplacementReady Verdict

`assetReplacementReady=false`。inventoryとguardは進んだが、Sprite Atlas production packingと最終production asset replacementが未完のため。

## U30 / U31 Gate Addendum

U32はU30/U31のasset blockerを減らしていない。internal previewとmobile QA準備は維持し、productionApprovedはfalseのまま。

## 390x844 Evidence

`docs/design-targets/generated/unity-u32/screenshots/` に8枚のEditor evidenceを生成した。

## Boundary

Generated final画像をruntimeへ貼っていない。`docs/design-targets/generated` のruntime参照なし。Addressables未導入。Cloud Save未導入。本番SE未確定。本番balance未確定。mobile実機metrics未測定。

## 実行したcheck一覧

- Unity U32 screenshot capture.
- Unity U32 verification.
- `pnpm unity:u32-production-asset-replacement:check`.
- U22-U31 regression checks.
- `pnpm unity:meta:check`.
- `git diff --check`.

## 残リスク

Sprite Atlas production packing、production art replacement、mobile metrics、final SE、production balance、platform texture compression。

## 次に残る作業

- U33 Stage1 balance hardening.
- U34 release candidate checklist.
- U35 mobile device metrics pass.
