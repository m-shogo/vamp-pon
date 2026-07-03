# Unity U40 Final Production Asset Replacement Pass Review

## 変更概要

U40としてfinal asset inventory re-audit、runtime asset replacement registry hardening、readiness rules、runtime reference boundary scan、replacement map、safe replacement/no-op confirmation、visual consistency review、assetReplacementReady verdict、U34/U36/U39 gate addendumを追加した。

## final asset inventory re-audit

15 groupsを再棚卸しした。Stage1 critical groupsはfinalCandidate / runtimeApprovedDraft / productionCandidateへ整理し、generated evidenceとpublic prototypesはruntime final assetからブロックした。

## runtime asset replacement registry hardening

`U40FinalAssetReplacementRegistry`、`U40FinalAssetBoundaryPolicy`、`U40MissingFinalAssetFallbackPolicy`を追加した。asset key、category、current path、future final path、status、fallback、blocked flag、generated/docs forbidden flag、final approval requirementを保持する。

## replacement readiness rules

`docs/unity-u40-asset-replacement-readiness-rules-2026-07-03.md`に、runtimeApprovedDraft / finalCandidate / prototype / docsGeneratedOnly / U39 SE / U36 Atlas / mobile metrics未測定の扱いを定義した。

## runtime reference scan / boundary check

`docs/design-targets/generated` runtime参照なし、generated final PNG runtime直貼りなし、screenshots runtime参照なし、Addressables未導入、Cloud Save未導入、productionApproved=1なし、rcReady=trueなしをU40 checkerで確認する。

## production candidate replacement map

安全なものだけstatus上のfinalCandidate / runtimeApprovedDraftへ整理した。見た目を大きく変えるasset差し替えやgenerated final PNGへの置換は実施していない。

## safe replacement / no-op confirmation

U40では実体の大規模置換はせず、registry status、fallback、boundary policyを整備した。Stage1 runtime loop / save / reward / unlock / balance / audio / haptic / metrics / RC gateは変更していない。

## final visual asset consistency review

紙UI、黒インク、ランタン光、通常画面の静けさ、Rare / Evolution / 黒耀化の特別感は維持。390x844 Editor evidenceを8枚生成した。mobile測定ではない。

## assetReplacementReady verdict

- assetReplacementReady: true
- rcReady: false
- productionApproved: false

asset boundaryとしてはready。production approvalやRC readinessではない。

## U34/U36/U39 gate addendum

U34のasset blockerは改善。U36のSprite Atlas readinessを取り込み。U39 finalCandidate SEは取り込むがfinal approvedではない。AudioMixer未確定。

## safety

generated final画像をruntimeへ貼っていない。`docs/design-targets/generated` runtime参照なし。Addressables未導入。Cloud Save未導入。final SEはfinalCandidate止まり。AudioMixer未確定。mobile metrics NOT_MEASURED。本番balance未確定。経済バランス未確定。

## 実行したcheck一覧

U40 checker、U39、U34、U36、U35、U33、U32、U31、U30、U29、U28、U27、U26、U25、U24、U23、U22、Unity meta、Unity Editor verification一式を実行した。

## 残リスク

mobile device readability、draw calls / batches、thermal、AudioMixer final、final SE approval、production balance、reward economy。

## 次に残る作業

実機測定、U37 final mobile tuning after device metrics、U38 production approval re-check、U41 economy / reward hardening。
