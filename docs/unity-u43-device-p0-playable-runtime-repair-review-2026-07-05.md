# Unity U43 Device P0 Playable Runtime Repair Review

## 変更概要

実機P0破綻に対して、Stage1 actual runtime sceneのScene / input / UI tap / visual / audio / haptic接続を修復した。docs/checkerだけでは終わらせず、runtime実装を変更した。

## 実機で出た症状

キャラがドットではない、移動できない、クリックできない、デザインが全部できていない、音が鳴らない、振動がない。

## 原因

Stage1 runtimeがKeyboard入力とproof接続中心で、mobile touch、EventSystem、tap可能StageSelect/Result、AudioSource、haptic device hook、pixel filterが不足していた。

## 修正したruntime箇所

- `PlayerController`: touch / mouse drag virtual stickを追加。
- `U1Stage1SceneBootstrap`: EventSystem、AudioListener、StageSelect、Result、Retry、U43 feedback bridgeを追加。
- `U2BattleController`: weapon / hit / defeat / pickup audio hookを追加。
- `U4LevelUpDemoController` / `PaperButton` / `PaperCard`: LevelUp / card / button tap feedback hookを追加。
- `U43RuntimeFeedbackBridge`: AudioSourceとhaptic requestを追加。

## Build Scene修正

Build SettingsはBoot / Stage1構成を維持。proof sceneをBuild対象にしない。Stage1 actual runtime側の接続不足を修正した。

## Character asset修正

U5 battle candidate spriteをruntimeでPoint filterへ設定し、Yui / Ombu import filterもPointにした。generated final画像はruntimeへ貼っていない。

## Touch movement修正

左下touch / mouse drag virtual stickを実装し、keyboard互換を維持した。

## UI tap修正

EventSystem + InputSystemUIInputModuleを生成し、StageSelect / Result / Retry / LevelUp cardがPointer eventを受けられるようにした。

## Visual runtime connection修正

StageSelect overlay、Result overlay、Retry / StageSelect return buttonをStage1 runtimeへ追加した。

## Audio runtime修正

AudioListenerとAudioSource runtime hookを追加した。button tap、pickup、hit、level up、rare、evolution、Kokuyou、result、retry、stage selectのhookがある。AudioMixer未確定、audio latency未測定は維持。

## Haptic runtime修正

iOS / Androidで `Handheld.Vibrate()` を呼ぶruntime hookを追加した。実機挙動未測定のためhapticMeasured=false。

## まだ実機再確認が必要なもの

キャラの見え方、touch movement、tap、SE、haptic、device screenshot、crash/freeze、mobile metrics、audio latency、speaker clipping。

## rcReady=falseの理由

実機再確認、mobile metrics、audio latency、haptic実機挙動、AudioMixer final、production approvalが残る。

## productionApproved=falseの理由

U43はP0 runtime repairでありapproval passではない。

## U37へ進める条件

実機でStage1が遊べること、tapできること、音とhaptic hookが動くこと、crash/freezeがないことを確認し、mobile metrics取得に進める状態にする。

## verification一覧

- `pnpm unity:u43-device-p0-playable-runtime-repair:check`
- `pnpm unity:u42-release-notes-known-issues:check`
- `pnpm unity:u41-economy-reward-unlock:check`
- `pnpm unity:u40-final-production-asset-replacement:check`
- `pnpm unity:u39-final-se-audiomixer:check`
- U34 / U36 / U35 / U33 / U32 / U31 / U30 / U29 / U28 / U27 / U26 / U25 / U24 / U23 / U22 checker
- `pnpm unity:meta:check`

Unity Editor verificationとiOS build generationは起動を試したが、同じprojectを別Unity instanceが開いているためbatchmodeが起動できず未完了。実機再確認も未実施。

## git status

U43対象差分はcommit対象にする。作業前からUnity設定ファイルのdirty差分があり、U43 commitには含めない。
