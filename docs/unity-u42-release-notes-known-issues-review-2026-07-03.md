# Unity U42 Release Notes / Known Issues Review

## 変更概要

Stage1 internal preview / QA handoff / RC再判定に向けて、release notes、known issues register、QA handoff checklist、remaining blocker matrix、remaining roadmap、readiness summary、U34/U35/U39/U40/U41 addendum、generated evidence、checkerを追加した。

## internal preview release notes

U25〜U41のStage1 runtime loop、Battle、LevelUp、Rare / Evolution / Kokuyou、Result、Reward / Unlock、StageSelect / Retry、Save safety、SE / haptic、Sprite Atlas、Asset replacement、Economy hardening、390x844 Editor QAを1つにまとめた。正式リリース用ではない。

## known issues register

mobile FPS、memory、thermal、GC allocation、draw calls、audio latency、haptic device behavior、AudioMixer final、device speaker clipping、本番balance、本番経済、Cloud Save、Addressables、Stage2 placeholder、final production approvalをissue化した。

## QA handoff checklist

app launch、StageSelect、Stage1 start、first 30 seconds、LevelUp、2:00 / 4:00 / 6:00、Kokuyou、Evolution、Rare、Result clear / defeat、Reward / Unlock、Retry、save persistence、audio、haptic、touch、FPS、memory、thermal、battery、crash / freezeを実機QA項目として整理した。

## remaining blocker matrix

P0はmobile metrics measurement、crash / freeze、touch responsiveness、save persistence on device。P1はaudio latency / clipping、haptic device behavior、AudioMixer final、device metrics後のfinal mobile tuning。P2はapproval re-checkとrelease notes finalization。

## remaining roadmap

順番は、実機測定、U37 final mobile tuning、AudioMixer final / device speaker pass、Haptic device pass、U38 production approval re-check、final release notes / known issues refresh。U37は実機測定前にやらない。U38も現時点ではやらない。

## readiness summary

internalPreviewReady=true、mobileQaReady=true、balanceHardeningReady=true、spriteAtlasPackingReady=true、assetReplacementReady=true、finalSeReady=true、economyReadyForRc=true、rewardReadyForRc=true、unlockReadyForRc=true、saveEconomySafe=true。

mobileMetricsReady=false、audioMixerReady=false、audioLatencyMeasured=false、hapticMeasured=false、rcReady=false、productionApproved=false。

## U34/U35/U39/U40/U41 addendum

U34のrelease notes blockerはinternal preview用として改善。U35のNOT_MEASUREDは維持。U39のfinalSeReadyは維持するがAudioMixer未確定。U40のassetReplacementReadyは維持。U41のeconomy readinessは維持するが本番経済未確定。

## rcReady=falseの理由

mobile metrics NOT_MEASURED、touch responsiveness未測定、save persistence on device未測定、AudioMixer未確定、audio latency未測定、haptic未測定、本番balance未確定、production approval未実施。

## productionApproved=falseの理由

U42はproduction approvalではない。U30/U34 gateに残るP0/P1 blockerを解消してからU38で再判定する。

## 残る未確定事項

- mobile metrics NOT_MEASURED。
- audioMixer未確定。
- audio latency未測定。
- haptic未測定。
- 本番balance未確定。
- 本番経済未確定。
- Cloud Save未導入。
- Addressables未導入。

## runtime boundary

generated final画像をruntimeへ貼っていない。`docs/design-targets/generated` runtime参照なし。

## 実行したcheck一覧

U42 checker、U41 / U40 / U39 / U36 / U35 / U34 / U33 / U32 / U31 / U30 / U29 / U28 / U27 / U26 / U25 / U24 / U23 / U22 checker、Unity meta check、既存Unity verification一式を実行対象にする。

## 残リスク

実機測定がないため、performance、touch、save persistence、audio latency、speaker clipping、haptic、thermalは未保証。

## 次に残る作業

実機測定、U37 final mobile tuning after device metrics、AudioMixer final / device speaker pass、Haptic device pass、U38 production approval re-check。
