# Unity U49 Actual-device Audio / Haptic Plan

Date: 2026-07-21  
Status: implementation in progress / readiness not promoted

## 目的

U28のevent taxonomyとU39の22 original final-candidate SEを維持しつつ、現runtimeの生成tone・`Handheld.Vibrate()`・文字列routing draftを、実AudioMixer、実clip再生、iOS Core Haptics adapter、物理端末証跡へ置き換える。

U49は音・振動・実機playable smokeだけを対象とする。U48の46 production visual asset、138 Simulator capture、U47 gameplay定義・slot capacity・balance、U46 AppFlow/Save ownershipは変更しない。

## Phase開始時の実査結果

- U39 final-candidate SEは22件、clip filenameは22件とも一意。
- 製品runtimeの`U43RuntimeFeedbackBridge`はU39 clipを参照せず、実行時にsine toneを生成している。
- runtimeのAudioSourceはAudioMixerを迂回している。
- Unity `.mixer` assetは存在しない。
- U28 routerはevent記録とfile存在確認までで、AudioSource再生を所有しない。
- U39 connectorはfile存在、group文字列、voice guardを検査するが、実AudioSourceへ接続しない。
- 製品haptic経路は`Handheld.Vibrate()`、U28 mobile adapterはno-op placeholder。
- Editor no-op境界は存在する。
- SaveServiceの製品設定正本は`masterVolume`と`hapticEnabled`。U28 in-memory draft settingsは製品保存経路ではない。
- AudioListenerはStage1 cameraの1件を正本とし、Audio ownerは追加Listenerを作らない。
- BGM asset、loop point、runtime ownerは存在しない。

## 実装方針

1. `U49ProductionAudioProfile`をResourcesから読み、U39の22 clipを重複コピーせず安定sourceとして正式登録する。
2. `Assets/_Project/Audio/Production/U49/`へ実AudioMixerを生成し、Master/BGM/SE/UI/Battle/Pickup/Climax/Result/StageSelectを構成する。
3. `MasterVolumeDb`、`BgmVolumeDb`、`SeVolumeDb`、`UiVolumeDb`をexposeし、parameter名を定数へ集約する。
4. `U49AudioHapticRuntimeOwner`だけがAudioSource、mixer routing、cooldown/polyphony、haptic lifecycle、diagnosticsを所有する。
5. `U43RuntimeFeedbackBridge`は既存呼出し互換のfacadeへ縮小し、生成toneとdirect vibrationを除去する。
6. iOS実機はCore Haptics native pluginを使用し、Editor・Simulator・非対応端末は明示no-opにする。
7. development define限定のU49 harnessは製品と同じowner/routerを呼ぶ。通常buildでは到達不能にする。
8. application backgroundではAudioSourceを停止しhaptic engineを停止、foregroundではengineを再初期化する。

## BGM判断

U49ではmachine-readableな`INTENTIONALLY_DISABLED` policyを採用する。現在、権利と品質が確定したproduction BGM候補がない。StageSelect、Stage1、ResultはUI・battle・pickup・climax・result SEで空間を支える。即席合成BGMを追加してPASS扱いにしない。

このpolicyではproduction BGM clip countは0、expected audibleはfalseとする。未定義・missing clipによるerror、予期しない再生、scene transitionやforeground復帰による二重AudioSourceは許可しない。BGM channel設定が存在する場合は保存・復帰しても破損させない。BGM無効は`audioReady=true`の根拠にしない。

将来BGMを追加する場合はBGM group、loop seam、transition、pause/resume、speaker/headphone maskingを別途実機承認する。

## Readiness境界

実AudioMixerとrouteの静的実装は`audioMixerImplemented=true`、実機確認は`audioMixerDeviceVerified=false`として分離する。人間の端末確認前は互換flagの`audioMixerReady=false`、`audioLatencyMeasured=false`、`hapticMeasured=false`を維持する。物理iPhoneでbuild/install/launch、device-side scheduling計測、background/foreground、OFF/ON、speaker/触覚判断がすべてPASSした後だけU49 readinessを検討する。

U49完了まではU50へ進まない。`performanceReady`、`mobileMetricsReady`、`rcReady`、`productionApproved`はU49ではfalseを維持する。
