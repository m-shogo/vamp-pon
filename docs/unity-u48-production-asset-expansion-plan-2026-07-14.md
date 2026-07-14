# U48 Production Asset Expansion Plan

Date: 2026-07-14
Status: IN_PROGRESS / asset approval blockers identified

## 正本

U48専用の既存正本文書は開始時点で存在しなかったため、`docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md`のU48節を正式スコープとする。U48はU45.1のprovider/animation経路をremaining Core5、enemy families、background、pickup、VFXへ拡張するphaseである。

U49のactual-device Audio/Haptic、U50のdevice Performance/Touch、U51のRCはU48へ前倒ししない。U48中は監査結果とblockerを記録し、該当readinessをfalseのまま維持する。

## U48_BLOCKEDの意味

U47 readinessに残る`U48_BLOCKED`は「U47完了前にU48へ進めない」というhandoff guardである。U47がcommit `642c87b26ca7713064c8172d2497613597caead9`で完了したため開始条件は満たした。U47 evidenceを過去状態として変更せず、U48専用readinessでは`status=IN_PROGRESS`とする。

## Scope

| 分類 | U48で行うこと | 境界 |
| --- | --- | --- |
| Visual | player/enemy/background/pickup/VFXのproduction expansion監査と接続 | U47 gameplay数値・state transitionは変更しない |
| Asset | Contract、Golden Reference、4候補、Lineage、QA、human review、runtime approvalの確認 | 未承認candidateをproductionへ昇格しない |
| Gameplay readability | player/enemy/projectile/pickup/ground-areaの優先順位を3 viewportで確認 | enemy数やdamageを下げて見かけ上改善しない |
| UI/UX | HUD、LevelUp、replacement、Resultのasset/readability回帰 | U46/U47のUI command経路を再設計しない |
| Audio | 現状監査のみ | 実機mix/latencyはU49 |
| Haptic | 現状監査のみ | 実機強度/cooldownはU49 |
| Performance | asset由来リスクの記録のみ | device metricsはU50 |
| Device compatibility | 接続可能端末のinventoryのみ | U48 asset完成前のsmokeをcompletion evidenceにしない |
| Runtime stability | missing assetで黙ってfallbackしない境界を維持 | verification optionをproductionへ漏らさない |
| Evidence | U48専用audit/readiness/matrix/checker | U47 evidenceを上書きしない |
| RC blocker | final visual、U49、U50、実機evidenceを明記 | U51より前にRCを昇格しない |
| Deferred | audio/haptic/performance/RC | U49/U50/U51へ送る |

## Non-goals

- 新規gameplay機能、Stage2、Addressables、Cloud Save
- U47 capacity、replacement、ground-area、revival、candidate水晶、23 capture契約の変更
- candidate assetの手動`approvedAsFinal=true`化
- Web PNGやgenerated screenshotのproduction runtime直結
- 大規模runtime refactor

## Audit結論

現在のruntime providerは`RuntimeVisualAssetProvider`、approval levelはCandidateである。Yui/OnbuはMultiple animation runtimeだが、manifest上`approvedAsFinal=false`、`runtimeApproved=false`である。remaining Core5とenemy familiesのruntime registry entryはない。

Stage背景とlantern glowはprocedural placeholder、EXP collect feedbackは常時proceduralである。projectile、hit、EXP、ink、trailはcandidate common spriteで、ground-area三種は同じcandidate ink spriteを色・scaleで使い分けている。distinct item/passive/rare icon、healing pickup、黒耀化production presentationは未接続である。

このためproduction providerを追加できる承認済みasset setが存在せず、U48 completionはblockedである。既存candidateをproductionへ改名・コピーするだけの対応は行わない。

## Required completion sequence

1. 各対象assetのContract / Golden Reference / 4候補 / Lineageを揃える。
2. automatic QAとhuman reviewを実施する。
3. `approvedAsFinal=true`と`runtimeApproved=true`を承認記録から得る。
4. GUIDを維持したproduction registry/providerへ接続する。
5. Compact / Standard / Large、Simulator、実機gameplay-size reviewを行う。
6. U47 regressionとfull preflightを通す。
7. U48 readinessを昇格する。

人間によるfinal visual approvalがない間、`runtimeVisualReady=false`、`physicalDeviceReady=false`、`rcReady=false`、ゲーム全体の`productionApproved=false`を維持する。
