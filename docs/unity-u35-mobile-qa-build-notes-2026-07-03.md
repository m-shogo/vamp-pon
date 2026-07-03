# Unity U35 Mobile QA Build Notes

## iOS build notes

- Unity Build SettingsでiOS targetを確認する。
- Development Buildを使う場合はProfiler / device logsを有効にする。
- Xcodeで実機install、screen recording、device log、thermal / memoryの確認を行う。
- 手元でiOS build未実施の場合、結果はNOT_MEASURED。

## Android build notes

- Unity Build SettingsでAndroid target、graphics API、orientation、development build設定を確認する。
- Android Studio / adb logcatでdevice logを取る。
- 実機screen recording、battery / thermal状態、crash / freezeを記録する。
- 手元でAndroid build未実施の場合、結果はNOT_MEASURED。

## Unity build settings確認項目

target resolution / orientation、development build、script debugging、profiler connection、quality settings、target FPS、graphics API、input handling。

## Profiler / stats / logs

FPS、frame time、memory、GC allocation、draw calls、batchesをProfilerまたはdevice toolingで記録する。Editor profiler値はEDITOR_ONLYであり、mobile実測ではない。

## Evidence

screenshot / screen recordingはscenario名とdevice名を紐付ける。audio clipping、haptic、touch、save persistence、retry stabilityはtester noteも残す。

## 個別確認

- haptic確認: device haptic設定ON/OFF、Kokuyou activation、Rare、Result stamp。
- audio clipping確認: pickup / hit連打、Kokuyou、Evolution、Result。
- save persistence確認: clear後にapp restartしてStageSelect stampを確認。
- retry stability確認: ResultからRetryし、runtime countsとmemoryが残留しないか確認。
