# Unity U40 Final Production Asset Replacement Pass Plan

## U40でやること

- U32 runtime asset inventory、U36 Sprite Atlas evidence、U39 finalCandidate SEを踏まえてStage1 runtime assetを再棚卸しする。
- runtime asset replacement registryをU40用に強化し、asset key、category、current path、future final path、fallback、blocked flag、generated/docs forbidden flag、final approval requirementを明示する。
- runtime reference scanで`docs/design-targets/generated`、screenshots、generated final PNG、Addressables、Cloud Save、final-approved SE誤認をブロックする。
- safe replacement / no-op confirmationとして、実体の大きな見た目差し替えではなくregistry statusとfallbackを整備する。
- assetReplacementReadyを再判定し、U38 production approval re-checkへ渡す。

## U40でやらないこと

- `productionApproved=1`や`productionApproved=true`にしない。
- `rcReady=true`にしない。
- mobile metrics、audio latency、haptic実機挙動を測定済みにしない。
- 本番balance、経済バランス、final SE、AudioMixerを最終確定しない。
- generated final画像、参照PNG、screenshots、`docs/design-targets/generated`をruntimeへ貼らない。
- public prototypesを無根拠にfinal production asset扱いしない。
- Addressables、Cloud Save、大きな新機能、Stage2作り込みを導入しない。

## approval flags

productionApproved=false、rcReady=false、mobileMetricsReady=falseを維持する。U40で扱うassetReplacementReadyは、runtime asset boundary / registry / fallback / Sprite Atlas evidenceのready判定であり、production approvalとは別のゲート。

## assetReplacementReady=trueにできる条件

- Runtime registryがStage1 critical assetsを網羅している。
- generated / design-target / screenshot assetがruntime対象外としてブロックされている。
- missing asset fallbackがあり、runtimeが落ちない。
- U36 Sprite Atlas packing対象と整合している。
- critical assetが`needsReplacement`で残らず、残る課題が`needsReview`またはfuture final approvalに整理されている。

## generated / prototype / SEの扱い

- `docs/design-targets/generated`、screenshots、generated referencesはruntime禁止。
- public prototypesはreference baselineであり、U40ではproduction final扱いしない。
- U39 finalCandidate SEはruntime candidateとして扱うが、final approved SEではない。

## Addressables

Addressablesは導入しない。既存のdirect asset / Resources candidate / registry fallback方針を維持する。

## U38へ渡す項目

production approval再判定、mobile実機metrics、AudioMixer final、final SE approval、device speaker clipping、haptic、production balance、reward economy。
