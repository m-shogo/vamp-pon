# Unity U49 Actual-device Audio / Haptic Review

Date: 2026-07-21
Status: `U49_BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE`

## Review scope

U49のproduction AudioMixer、22 SE route、iOS Core Haptics adapter、development-only device harnessをレビューした。U48の46 production assetと138 capture、U47 gameplay data/capacity/balanceは変更していない。

## Audio architecture

- 実`.mixer`は`Master`配下に`BGM`、`SE`、`UI`、`Battle`、`Pickup`、`Climax`、`Result`、`StageSelect`の9 groupを持つ。
- exposed parameterは`MasterVolumeDb`、`BgmVolumeDb`、`SeVolumeDb`、`UiVolumeDb`の4件。
- `U49AudioHapticRuntimeOwner`が8本の2D `AudioSource`を所有する。全voiceは生成時に`SE`へ、再生直前にevent categoryのchild groupへ明示routingされる。
- missing profile/group/clipは無音fallbackで隠さず、再生を拒否してdiagnosticへ記録する。
- muteとmaster volumeは分離し、linear 0は`log10(0)`を避けてmute dBへ変換する。
- 22 U39 final-candidate clipはGUIDを保つため元pathでproduction登録した。duplicate copy、U28 draft runtime reference、duplicate PCM/GUID、SHA mismatch、clipping sampleは0。
- production品質が確認済みのBGM候補は存在しないため、U49は意図的無音とする。即席合成BGMによる代替は行わない。

## Haptic architecture

- 製品経路は既存`IU28HapticPlatformAdapter`境界から`U49IosHapticAdapter`へ接続し、`U28MobileHapticPlaceholderAdapter`を使用しない。
- iOS native pluginはCore Haptics capability、engine start/stop/reset、reset/stopped handlerを実装する。
- `TARGET_OS_SIMULATOR`では非対応を返し、Editor・非iOSは`U49NoopHapticAdapter`を使う。
- settings OFFではnative call前に停止し、RegistryのcooldownとU29 voice budgetを維持する。
- audioとhapticの設定・失敗は独立しており、haptic非対応でもaudio/visual routeを壊さない。

## Verification route

`U49DeviceVerificationHarness`は`VAMPPON_U49_DEVICE_VERIFICATION && DEVELOPMENT_BUILD`の二重guard下だけでStage1へ追加される。製品と同じowner/routerを使い、22 audio eventと10 haptic eventを個別または自動sequenceで実行できる。通常production buildからは到達できない。

Unity normal compile、U49 Editor verification、iOS Device export、Xcode Release build、署名、CoreHaptics link、物理iPhoneへのinstallまではPASSした。ローカルcode signatureも検証済み。

## Current blocker

物理iPhoneはbooted、paired、Developer services availableだが、端末がインストール済みdeveloper profileを未信頼としてlaunchを拒否した。端末側で明示的に信頼されるまでは、harness sequence、audio latency、speaker mix、Core Haptics実行、background/foreground、human decisionを測定できない。

このため`audioMixerReady`、`audioLatencyMeasured`、`hapticMeasured`、`audioReady`、`hapticReady`、`physicalDeviceReady`、`devicePlayableReady`はfalseのまま維持する。U50はblocked。

## Readiness rule

端末launch後に自動sequenceを完走し、同一processのbackground/foreground復帰とsettings OFF/ONを確認し、最後に人間が18項目をまとめて判定した場合だけU49 readinessを再評価する。ログ、native call count、AI判断だけで音質・触覚を承認しない。
