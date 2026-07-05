# Unity U42 Stage1 Internal Preview Release Notes

このrelease notesは正式リリース用ではなく、internal preview / QA handoff用。`productionApproved=false`、`rcReady=false`、mobile metricsはNOT_MEASURED。

## build / commit range summary

対象範囲はU25 Stage1 runtime loopからU41 economy / reward / unlock hardeningまで。Stage1 vertical sliceとしてStageSelect、Battle、LevelUp、Rare、Evolution、Kokuyou、Result、Reward / Unlock、StageSelect return、Retry、save progress、asset boundary、SE final-candidate、economy RC candidateを確認する。

## Stage1 runtime loop

U25でStageSelect startからBattle、clear / defeat、Result、StageSelect return、Retryまでのproduction-adjacent loopを接続した。これはapproval済み本番loopではなく、Stage1 preview loop。

## Battle

U33でopening density、2:00 / 4:00 / 6:00 wave、damage、pickup、heal、XP cadenceをEditor 390x844向けにhardeningした。実機touch、FPS、thermal、clear rateは未測定。

## LevelUp

LevelUp cadenceとweapon / passive選択の可視性はU33時点で改善済み。実機でカードの読みやすさ、touch誤操作、選択後の復帰感を見る。

## Rare / Evolution / Kokuyou

Rare、Evolution、Kokuyou到達性はEditorで近づけた。U39でSE final-candidateは用意済みだが、device speaker clipping、audio latency、haptic挙動はNOT_MEASURED。

## Result

U27 Result ledgerをU41でreward display hardeningした。rank、best updated、reward cards、新unlock、retry / stage select導線を確認対象にする。

## Reward / Unlock

U41でreward / unlock / save economyをRC candidateへ整理した。clear reward 12、defeat participation 4、first clear bonus 10、rare 4、evolution 5、cap 36、minimum 4。これは本番経済確定ではない。

## StageSelect / Retry

StageSelect after run、previous result stamp、Stage2 placeholder unlock、retry motivationを確認する。Stage2はplaceholderで、本実装ではない。

## Save safety

U27のsave integrationを基礎に、U41でfirst clear duplicate guard、attempts、clears、best、lastResult、unlocked idsの安全方針を整理した。Cloud Saveは未導入。実機restart persistenceはNOT_MEASURED。

## SE / haptic

U39で22個のStage1向けSEをfinal-candidate化し、routing draftを用意した。AudioMixer finalは未確定。audio latency、device speaker clipping、haptic device behaviorは未測定。

## Sprite Atlas

U36でspriteAtlasPackingReady=true。draw calls、batches、memoryは実機未測定。

## Asset replacement

U40でassetReplacementReady=true。generated final画像をruntimeへ貼らず、`docs/design-targets/generated` runtime参照なし。public prototypesはreference-onlyとして扱う。

## Economy hardening

U41でeconomyReadyForRc=true、rewardReadyForRc=true、unlockReadyForRc=true、saveEconomySafe=true。ただしproductionEconomyFinal=false。

## 390x844 Editor QA

U25〜U41のscreenshotsは390x844 Editor evidence。実機証跡ではない。

## What is ready

Internal preview handoff、mobile QA handoff、Stage1 runtime loop、balance hardening candidate、sprite atlas packing、asset replacement boundary、final-candidate SE、economy / reward / unlock RC candidate。

## What is not ready

mobile FPS、memory、thermal、GC allocation、draw calls、audio latency、haptic behavior、touch responsiveness、save persistence on device、AudioMixer final、本番balance、本番経済、production approval。

## How to test

QA handoff checklistに従い、launch、StageSelect idle、Stage1 start、first 30 seconds、2:00 / 4:00 / 6:00、Kokuyou、Evolution、Rare、Result clear / defeat、Reward / Unlock、Retry、restart persistence、audio、haptic、FPS、memory、thermal、battery、crash / freezeを記録する。

## Known limitations

Stage2はplaceholder unlock。Cloud Save / Addressablesは未導入。U42はrelease notes / known issues passであり、RC承認ではない。
