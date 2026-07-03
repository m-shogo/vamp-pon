# Unity U35 Mobile Device Metrics Pass Review

## 変更概要

U35としてmobile device metrics passのmodel、debug capture hook、scenario、threshold、report template、Editor evidence、gate addendum、checkerを追加した。

## QA / metrics環境

実機測定は未実施。Editor 390x844 evidenceのみ。Editor evidenceはEDITOR_ONLYであり、mobile measuredではない。

## mobile metrics model

`U35MobileMetricsSession`、`U35MobileDeviceProfile`、`U35MetricStatus`、performance / audio / haptic / touch / persistence measurementを追加した。実測できない値はnullまたはNotMeasured。

## metrics scenarios

20 scenarioを定義した。app launch、Stage1 start、first 30 seconds、LevelUp、2:00 / 4:00 / 6:00 / 7:30、Kokuyou、Evolution、Rare、Result、Retry、save persistence、audio stress、haptic、thermal、390x844 readabilityを含む。

## metrics capture hooks

FPS sample、frame time sample、memory sample、GC / draw call placeholder、runtime counts、audio voice count、haptic event count、scenario marker、json exportを追加した。production buildで常時有効にする前提ではない。

## mobile metrics thresholds

60fps目標、30fps下限、390x844縦画面、low/mid device想定のdraft thresholdを追加した。

## runtime pressure summary

U33 hardening後もU29 enemy cap 38、pickup 48、projectile 24、hit effect 16、particles 64、audio voices 8と整合する。Kokuyou / Evolution中は低優先effect skip方針。

## mobile QA build notes

iOS / Android build notes、development build、profiler / logs、screenshot / recording、haptic、audio clipping、save persistence、retry stability確認手順を追加した。

## measured項目

なし。実機測定はできていない。

## NOT_MEASURED項目

mobile FPS、memory、thermal、GC allocation、draw calls、audio latency、haptic device behavior、touch responsiveness、save persistence、retry stability。

## EDITOR_ONLY項目

Editor capture hook、runtime count budget、390x844 screenshots、JSON export shape。

## mobileMetricsReady verdict

mobileMetricsReady=false。Editor evidenceだけではU30 critical blockerを解除しない。

## U30/U31/U32/U33 gate addendum

U30 mobile metrics blocker未解除。U31 NOT_MEASUREDは維持。U32 assetReplacementReady=false。U33 balanceHardeningReady=true維持。

## Boundary

productionApproved=false。generated final画像をruntimeへ貼っていない。docs/design-targets/generated runtime参照なし。Addressables未導入。Cloud Save未導入。本番SE未確定。本番balance未確定。Sprite Atlas production packing未完。

## 実行したcheck一覧

U35 checker、U33〜U22 checker、unity:meta:check、git diff --check、既存Unity verification一式を実行対象にする。

## 残リスク

実機metrics未測定、Sprite Atlas production packing未完、final SE未確定、reward economy未確定、U33 balanceの実機感触未測定。

## 次に残る作業

U36 Sprite Atlas production packing completion、U34 release candidate checklist、U37 final mobile tuning after device metrics。
