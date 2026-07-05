# Unity U42 Stage1 Remaining Roadmap

## 1. 実機測定

最初にFPS、memory、thermal、GC allocation、draw calls、batches、touch responsiveness、save persistence、audio latency、speaker clipping、haptic behaviorを測る。U35のNOT_MEASURED一覧を解消するのが次のP0。

## 2. U37 final mobile tuning after device metrics

U37は実機測定前にやらない。理由は、Editor 390x844の手触りだけでenemy density、pickup radius、damage、reward cadence、performance budgetを詰めると、端末上のstutter、thermal、touch誤差を見落とすため。

## 3. AudioMixer final / device speaker pass

U39でfinal-candidate SEとrouting draftはあるが、AudioMixerReady=false。実機speaker clippingとlatencyを確認し、Unity .mixer asset、volume、category routingをfinal candidateへ進める。

## 4. Haptic device pass

HapticはEditorでは評価できない。iOS / Androidで強度、cooldown、発火タイミング、無効設定時の挙動を確認する。

## 5. U38 production approval re-check

現時点でU38をやらない理由は、mobile metrics、AudioMixer final、audio latency、haptic、production balanceが未測定/未確定のため。U38はblocker更新後に実施する。

## 6. final release notes / known issues refresh

U42のrelease notesはinternal preview版。実機QAとU37/U38結果を反映し、正式release notes / known issuesへ更新する。

## U41で軽減されたこと

U41でeconomyReadyForRc、rewardReadyForRc、unlockReadyForRc、saveEconomySafeはtrueになり、U34のreward economy draft blockerはRC candidateまで改善した。ただし本番経済確定ではなく、productionEconomyFinal=false。
