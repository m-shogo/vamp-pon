# Unity U40 Asset Replacement Readiness Rules

## runtimeApprovedDraftをfinalCandidateに上げられる条件

- Stage1 runtimeで既に読める大きさと役割を満たしている。
- 390x844 Editor evidenceで破綻していない。
- U36 Sprite Atlas対象またはfallback方針と整合している。
- generated docs / screenshot / public prototypeを直接final扱いしていない。

## finalCandidateをfinalApprovedLaterへ進める条件

- mobile実機でreadability、FPS、thermal、draw calls、audio/haptic影響を確認する。
- human reviewで世界観、紙UI、黒インク、ランタン光、通常画面の静けさが通る。
- U38 production approval re-checkでproductionApproved条件と矛盾しない。

## prototypeをruntimeに残してよい条件

Prototypeはreference baselineとして残してよい。ただしruntime final assetとしては扱わず、Unity-finished candidateまたはfallbackが存在すること。

## prototypeをneedsReplacementにする条件

画面サイズ、PPU、alpha、atlas、可読性、世界観のいずれかがStage1 runtimeで弱い場合はneedsReplacementに戻す。

## docsGeneratedOnly / generatedReferenceOnly

`docs/design-targets/generated`、screenshots、generated reference PNGはruntime禁止。checkerとU40 boundary policyでブロックする。

## U39 finalCandidate SE

U39 SEはfinalCandidate。final approved SEではない。AudioMixerReady=false、audio latency / hapticはNOT_MEASUREDのまま。

## U36 Sprite Atlas済みasset

U36 Sprite Atlas packingはStage1 candidate groupsとしてready。ただしdraw calls / batches / memoryはmobile未測定。

## mobile metrics未測定asset

mobile metrics未測定でもassetReplacementReadyはregistry / boundary / fallback / atlas readinessとしてtrueにできる。ただしproductionApproved、rcReady、mobileMetricsReadyはfalseのまま。

## assetReplacementReady=trueに必要な条件

critical Stage1 runtime groupsにneedsReplacementが残らず、unsafe generated referencesが0で、fallbackが明記され、U36 atlas evidenceと整合していること。

## assetReplacementReady=false維持になる条件

critical groupにneedsReplacementが残る、generated docsをruntime参照する、fallbackがない、public prototypesをfinal扱いする、Addressables / Cloud Saveなど不要なasset systemを導入する場合。

## productionApproved=false / rcReady=falseとの違い

assetReplacementReadyはasset boundary readiness。production approvalやRC readinessではない。mobile metrics、AudioMixer、production balance、economy、final SE approvalが残ればproductionApproved=false / rcReady=falseを維持する。
