# Unity U34 Release Candidate Checklist Plan

## U34でやること

- Stage1 vertical sliceをrelease candidate候補へ進められるか判定するchecklist、blocker register、caution register、evidence index、next action matrixを作る。
- RC readiness modelとgenerated JSON evidenceを追加する。
- U30〜U36 gateの現状を整理し、RC未達の理由を明確にする。

## U34でやらないこと

- RC合格扱いにしない。
- productionApproved=falseのまま進める。
- mobile metrics NOT_MEASUREDをPASS扱いしない。
- assetReplacementReady=falseを無視しない。
- final SE未確定、本番balance未確定、経済バランスdraftを確定扱いにしない。
- generated final画像や参照PNGをruntimeへ直貼りしない。
- docs/design-targets/generatedをruntime参照しない。
- Addressables、Cloud Save、Stage2作り込み、大きな新機能追加はしない。

## 現状の扱い

- mobileMetricsReady=false。mobile実機metricsはNOT_MEASURED。
- assetReplacementReady=false。U36でSprite Atlas packingは進んだが、final production asset replacementは未完。
- final SE未確定。U28はdraft SE routing。
- 本番balance未確定。U33はbalanceHardeningReady=trueだがproduction balanceではない。

## U37 / U38へ渡す項目

- U37: final mobile tuning after device metrics。
- U38: production approval re-check。
- U39: final SE / AudioMixer pass。
- U40: final production asset replacement pass。
- U41: economy / reward hardening。
- U42: release notes / known issues pass。
