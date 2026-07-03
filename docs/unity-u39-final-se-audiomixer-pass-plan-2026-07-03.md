# Unity U39 Final SE / AudioMixer Pass Plan

## U39でやること

- U28 draft SE / audio routing / haptic pairingを棚卸しし、Stage1向けのoriginal final-candidate SEへ分類する。
- repo内scriptで短いfinal-candidate wavを生成し、normalization / peak risk evidenceを残す。
- U29 audio voice budget / haptic cooldownを前提に、U39 clipping / polyphony / cooldown guardを追加する。
- AudioMixerは本番確定ではなく、Stage1 category routing draft / missing mixer fallback方針として整理する。
- U34 RC blockerのうちfinal SE / AudioMixer / audio clipping / audio latency / draft SE cautionへの影響を明文化する。

## U39でやらないこと

- `productionApproved=true`または`productionApproved=1`にしない。
- `rcReady=true`にしない。
- mobile実機metrics、audio latency、haptic実機挙動を測定済みにしない。
- 外部素材、著作権素材、Web download音源を入れない。
- Addressables、Cloud Save、経済バランス確定、Stage2実装を導入しない。
- generated final画像、参照PNG、`docs/design-targets/generated`をruntime参照しない。

## approval flags

- productionApproved=falseのまま進める。
- rcReady=falseのまま進める。
- mobileMetricsReady=falseのまま進める。

## final SEの扱い

U39で生成するSEはrepo内script由来のoriginal final-candidateとする。draftよりも音量、peak、連打耐性、世界観を整理するが、スマホ実機スピーカー確認とhuman audio reviewが未完のため、本番最終承認済みにはしない。

## AudioMixerの扱い

U39ではcategory routing、volume draft、clipping guard、future user settings hook、missing mixer fallbackを定義する。Unity `.mixer` assetはEditor生成互換性と本番mix未確認のriskがあるためU39では作成しない。runtimeは落ちないpolicy接続を優先し、AudioMixerReady=false、routingDraftReady=trueとして扱う。

## audio latency / haptic

- audioLatencyMeasured=false。実機で測定できないためNOT_MEASUREDのまま。
- hapticMeasured=false。Editor no-opとcooldown方針は維持するが、iOS / Android実機確認はNOT_MEASUREDのまま。

## U34 RC blockerへの影響

- final SE未確定: draftからfinal-candidateへ改善。ただしfinal approvedではない。
- AudioMixer未確定: routing draft / fallback / category policyを追加。ただし本番mix確定ではない。
- audio clipping未確認: Editor/static risk mapで低減するが、実機speaker clippingは未測定。
- audio latency未確認: 解除しない。
- draft SE本番扱い禁止: U39 checkerでfinal-approved扱いを禁止する。

## U40 / U37 / U38へ残す項目

- U40: final production asset replacement pass。
- U37: mobile device metrics後のfinal mobile tuning。
- U38: production approval re-check。
- 実機測定: audio latency、speaker clipping、haptic intensity、thermal、touch、save/retry。
