# Unity U42 Remaining Blocker Matrix

| blocker | priority | target phase | required evidence | why it blocks RC | expected fix type | risk if ignored |
| --- | --- | --- | --- | --- | --- | --- |
| mobile metrics measurement | P0 | 実機測定 / U37 | FPS, memory, thermal, GC, draw calls, batches | mobileMetricsReady=falseのままではRC品質を保証できない | measurement + tuning | 実機でstutter/crash/thermal劣化 |
| crash / freeze check | P0 | 実機測定 / U37 | sustained run video, device logs | crash/freeze未確認はRC不可 | bug fix / asset or loop stabilization | previewで停止する |
| touch responsiveness | P0 | 実機測定 / U37 | movement, LevelUp, Result, Retry操作動画 | 操作感はEditorでは代替できない | input tuning / UI target adjustment | 遊べない印象になる |
| save persistence on device | P0 | 実機測定 / U37 | restart前後screenshots/log | save消失はprogressionを壊す | repository / migration / fallback fix | progress loss |
| audio latency / clipping | P1 | Audio device pass | pickup/hit/Kokuyou/Evolution/Result動画 | feedback品質と端末speaker riskが未測定 | mix / cooldown / normalization | 音割れや遅延 |
| haptic device behavior | P1 | Haptic device pass | iOS / Android挙動メモ | hapticは端末差が大きい | intensity / cooldown tuning | 不快、または無反応 |
| AudioMixer final | P1 | AudioMixer final | Unity .mixer asset, routing, volume review | U39はrouting draftでaudioMixerReady=false | mixer asset + review | volume balanceが不安定 |
| final mobile tuning after device metrics | P1 | U37 | metrics-driven tuning diff | 実機データなしのtuningは根拠が弱い | gameplay/perf tuning | balanceやperformanceの再劣化 |
| release approval re-check | P2 | U38 | updated gate report | productionApproved=falseの再判定が必要 | gate review | approval混同 |
| release notes finalization | P2 | final release notes refresh | updated known issues and QA evidence | U42はinternal preview版 | docs refresh | 古いknown issuesで判断する |
