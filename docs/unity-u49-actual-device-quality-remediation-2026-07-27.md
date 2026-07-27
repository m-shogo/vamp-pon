# U49 実機品質是正

## 状態

```txt
status=U49_BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE
sourceBuild=25ea836dbee8e9c579f69844080c726e0bfc3887
deviceLaunch=PASS
deterministicAudioSequence=22/22
deterministicHapticSequence=10/10
humanAudioApproval=FAIL
humanWholeAppReview=INCOMPLETE
u50Blocked=true
```

## 実機で確認できたこと

- Development signed buildのinstallとlaunchは成功した。
- verification harnessへ到達した。
- Core Haptics capabilityは`Supported`だった。
- 22 SEは要求IDの欠落・重複なく実行され、全IDにrequest-to-router latency sampleがある。
- 10 haptic IDは欠落なく要求され、設定OFF block / ON restoreも診断上成立した。
- 敵の消滅表現は人間レビューで肯定された。

## 不合格・未完了

- 音は再生されるが、安っぽく爽快感がないため人間承認はFAIL。
- 現在の22 clipは`approvedAsFinal=false`のままであり、mix調整だけで最終化しない。
- TOP相当の入口、StageSelect、LevelUp選択は実機で見た目を拒否された。
- タッチ移動が扱いにくい。
- 主人公が常時揺れて見える。
- 黒耀化runtimeは存在するが、通常プレイの手動発動command UIがなく到達不能だった。
- backgroundは観測したがforeground callback、same-process recovery、復帰直後latencyは未証明。
- 18項目human reviewは未完了。

## 即時是正

- touch開始時のactive fingerを固定し、別touch/UI touchへの切替を禁止する。
- joystickのdead zoneとradiusを固定pixelから画面短辺比率へ変更する。
- gameplay全体へ常時適用していた主人公scale bobを除去する。
- idleは複数実frameを維持しながら切替周期を落ち着かせる。
- HUDから`Stage1GameplayRuntimeCoordinator.ActivateKokuyou()`へcommandを送る黒耀化ボタンを追加する。
- 上記経路を静的checkerへ追加する。

## 次に必要な是正

1. 実機でtouch、停止、方向保持、黒耀化発動を再確認する。
2. 22 SEをイベント階層、attack、transient、body、world identityで再設計し、候補比較後に差し替える。
3. TOPをStageSelectの別名で済ませず、ゲームの顔としてAppFlowへ定義する。
4. StageSelectを汎用カードgridから夜路を選ぶ地図帳表現へ再構成する。
5. LevelUpは候補の差、即時理解、選択の高揚が伝わる構成へ再調整する。
6. current runtimeのCompact / Standard / Largeと実機を再撮影し、人間比較する。
7. 18項目をcontract順に明示回答する。

## Readiness境界

この是正中は次を維持する。

```txt
physicalDeviceReady=false
devicePlayableReady=false
audioReady=false
hapticReady=false
audioLatencyMeasured=false
hapticMeasured=false
u50Blocked=true
performanceReady=false
mobileMetricsReady=false
rcReady=false
productionApproved=false
```
