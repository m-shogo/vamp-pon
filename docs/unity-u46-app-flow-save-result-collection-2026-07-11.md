# U46 AppFlow / Save / Result / 灯録 Production Candidate Pass

U46は、StageSelect、Battle、LevelUp、Result、灯録を`AppFlowCoordinator`のcommandで接続し、pauseを`RunPauseCoordinator`へ集約したproduction candidate passである。

## Architecture

- state: `Boot / StageSelect / Running / LevelUpModal / Result / Collection`
- UIはcommand forwardingのみ。Scene load、file I/O、`Time.timeScale`を所有しない。
- pause reasonはsetで重複安全に保持し、最後のreasonが外れるまでbattle/input/animationを再開しない。
- Retryはbattle pool、timer、EXP、集計、player位置、Yui animation、Result snapshotをresetする。

## Save v1

`Application.persistentDataPath/yoru-no-shirube-save-v1.json`へstable IDだけを保存する。schema v1、temporary write、backup、corrupt recovery、future schema拒否、missing field default、duplicate ID正規化を実装した。cloud saveは未導入。

## Read Models

Resultは`RunResultSnapshot`からClear/Fail用`RunResultViewModel`を生成する。灯録はdefinitionとsave snapshotからlocked spoiler境界、new/seen、category、progress、empty stateを生成する。Viewはbattle object、Web JSON、Unity asset pathを解析しない。

## Readiness

U46 shell、Result/灯録candidate、Simulator route smokeはready。U46 UI画像はCandidateでありfinal/runtime承認ではない。実機、final visual、audio、haptic、performance、RC、productionは未確認のためfalseを維持する。
