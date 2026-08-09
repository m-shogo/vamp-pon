# U49 実機品質是正

## 状態

```txt
status=U49_BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE
installedSourceBuild=b3e7350e8a47000efdb50af9f4250a5d5104cc27
deterministicSequenceSourceBuild=4b3b4eac832b0e255c137070b476ca11b8e58100
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
- タッチ移動、停止時の方向保持、黒耀化ボタンからの手動発動は実機で成立した。
- 停止中の左右反転は解消し、右攻撃と左攻撃はともに実機で正しい向きを維持した。

## 不合格・未完了

- 音は再生されるが、安っぽく爽快感がないため人間承認はFAIL。
- 現在の22 clipは`approvedAsFinal=false`のままであり、mix調整だけで最終化しない。
- TOP相当の入口、StageSelect、LevelUp選択は実機で見た目を拒否された。
- StageSelectとLevelUpは、端切れ・情報順序の改善後も人間reviewで明示的に`FAIL`となった。キャラクターと敵以外は仮UIに見えるというwhole-app visual rejectionを
  `docs/unity-whole-app-heavy-design-audit-2026-07-27.md`
  に分離して記録した。
- backgroundは観測したがforeground callback、same-process recovery、復帰直後latencyは未証明。
- 18項目human reviewは未完了。

## 即時是正

- touch開始時のactive fingerを固定し、別touch/UI touchへの切替を禁止する。
- joystickのdead zoneとradiusを固定pixelから画面短辺比率へ変更する。
- gameplay全体へ常時適用していた主人公scale bobを除去する。
- 左向きidleは複数実frameを維持しながら切替周期を落ち着かせる。
- `yui_idle_r_00`は実画像が左向きだったためright-idle routeから除外し、右向きidleは正しいframeへ固定して停止中の左右反転を止める。右向きの第2 idle frameはasset是正後に再導入する。
- `yui_attack_l_*`は実画像が右向きだったためright routeへ割り当てる。`yui_attack_r_00`は左向きだが`yui_attack_r_01`は右向きへ反転するため、left routeは正しい`00`へ固定し、誤方向frameを除外する。
- hurt / recoilは現シートに明確な右向きframeが不足しているため、非対称装備を機械的にmirrorせずasset是正対象として残す。
- HUDから`Stage1GameplayRuntimeCoordinator.ActivateKokuyou()`へcommandを送る黒耀化ボタンを追加する。
- 上記経路を静的checkerへ追加する。
- StageSelectを2列の汎用card gridから、20夜を順に辿るresponsive縦routeへ再構成する。
- StageSelect / Result / 灯録ではbattle HUDを非表示にし、画面背後の情報衝突を除去する。
- LevelUp cardをicon左・名称と効果右の選択行へ再構成し、選択時labelと非選択時の可読性を改善する。
- 上記UI変更後のU47 Simulator smokeは23 capture / 11 semantic route、例外0、assertion失敗0で再取得する。これは実機human approvalの代替にはしない。

## 次に必要な是正

1. 22 SEをイベント階層、attack、transient、body、world identityで再設計し、候補比較後に差し替える。
2. TOPを含む全画面designはU49から分離したHeavy Design Phaseで扱う。phase IDはroadmap合意前のため`UNASSIGNED`とし、U49 branchで場当たり的なprimitive追加をしない。
3. StageSelect / LevelUpのstructural fixは維持するが、現runtimeを`temporary structural UI`としvisual approvalには使用しない。
4. 最新source buildでdeterministic sequenceとsame-process background / foreground recoveryを取り直す。
5. 18項目をcontract順に明示回答する。

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
