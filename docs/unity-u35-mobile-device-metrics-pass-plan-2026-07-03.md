# Unity U35 Mobile Device Metrics Pass Plan

## U35でやること

- Stage1 vertical sliceをmobile実機確認へ進めるためのmetrics記録model、capture hook、scenario、report template、threshold draft、Editor evidenceを追加する。
- FPS、memory、thermal、GC allocation、draw calls、audio latency、haptic behavior、touch responsiveness、save persistence、retry stability、390x844 readabilityの測定導線を定義する。
- U30 / U31 / U32 / U33 gateへ、mobile metricsの現状をaddendumとして反映する。

## U35でやらないこと

- productionApproved=falseのまま進める。
- 実機で測定できない項目をMEASURED扱いにしない。
- Editor確認とmobile実機確認を混同しない。
- generated final画像や参照PNGをruntimeへ直貼りしない。
- docs/design-targets/generatedをruntime参照しない。
- Addressables、Cloud Save、本番SE確定、経済バランス確定はしない。
- Sprite Atlas production packing completionはU36へ残す。
- RC checklistはU34へ残す。

## mobile実機測定できる場合 / できない場合

- 実機で測定できた項目のみ`MEASURED`にする。
- 実機で測定できない項目は`NOT_MEASURED`のまま残す。
- Editor batchmodeやEditor Play由来の値は`EDITOR_ONLY`にし、mobile measuredとして扱わない。
- 推測値はactual値として記録しない。未測定値はnullまたはNOT_MEASURED。

## Editor確認とmobile実機確認の違い

- Editor確認: capture hook、JSON export、390x844画面構成、scenario marker、記録形式の検証。
- mobile実機確認: FPS、memory、thermal、GC、draw calls、audio latency、haptic、touch、save persistence、retry stabilityの実測。

## 測定対象

FPS、frame time、memory、peak memory、GC allocation、draw calls、batches、thermal、battery note、audio latency / clipping、haptic behavior、touch responsiveness、save persistence、retry stability、runtime counts、390x844 readability。

## 測定しない対象

production approval、Sprite Atlas production packing completion、final SE承認、reward economy承認、本番balance承認、Stage2以降、新キャラ、新武器大量追加。

## Gate反映

U35で実機metricsが取れない場合、mobileMetricsReady=falseのまま。U30 blockerのmobile metricsは未解除、U31 NOT_MEASUREDは減らない、U32 assetReplacementReady=false、U33 balanceHardeningReady=trueを維持する。
