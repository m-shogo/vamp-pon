# Unity U43 Device P0 Playable Runtime Repair Plan

## 実機P0症状

ユーザー実機確認で、キャラがドットではない、移動できない、クリックできない、デザインが全部できていない、音が鳴らない、振動がない、というP0破綻が出た。これはtuningではなく、Stage1 playable runtimeの接続不良として扱う。

## U37 tuningに進めない理由

U37は実機metrics後のfinal mobile tuningだが、現状は移動、tap、runtime visual、audio、hapticが成立していない。遊べる状態になる前にmetrics tuningへ進むと、未接続のruntimeを測るだけになるため、U43でP0修復を優先する。

## U43で直す対象

- iOS build対象Sceneと起動Scene。
- Stage1 bootstrap / entrypoint。
- Player visualとruntime sprite接続。
- mobile touch movement。
- StageSelect / LevelUp / Result / Retryのtap接続。
- HUD / visual runtime connection。
- button / pickup / hit / level up / rare / evolution / Kokuyou / resultのaudio runtime hook。
- button / rare / evolution / Kokuyou / resultのhaptic runtime hook。

## U43で直さない対象

- production approval。
- RC承認。
- mobile metrics測定済み化。
- AudioMixer final。
- audio latency測定済み化。
- haptic実機測定済み化。
- 本番balance確定。
- 本番経済確定。
- Cloud Save / Addressables導入。
- Stage2本実装。

## rcReady=falseのままにする理由

U43はruntime P0修復であり、実機での再確認、mobile metrics、audio latency、haptic device behavior、AudioMixer final、production approvalがまだ残るため。

## productionApproved=falseのままにする理由

実機P0破綻が報告されており、U43で接続を直してもproduction approval passではない。U38のproduction approval re-checkまでは`productionApproved=false`を維持する。
