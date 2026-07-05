# Unity U43 Device P0 Playable Runtime Repair Verdict

| flag | value | note |
| --- | --- | --- |
| buildSceneCorrect | true | Boot / Stage1がBuild Settingsに含まれ、proof sceneは含まれない |
| characterRuntimeAssetReady | true | U5 runtime candidate sprite + Point filterへ修正 |
| mobileTouchMovementReady | true | touch / mouse drag virtual stickを実装 |
| uiTapReady | true | EventSystem、StageSelect、Result、Retry tap UIを追加 |
| runtimeVisualConnectionReady | true | StageSelect / Battle HUD / LevelUp / Result / Retryをruntime接続 |
| audioRuntimeHookReady | true | AudioListener + AudioSource hookを追加 |
| hapticRuntimeHookReady | true | iOS / Android haptic request hookを追加 |
| devicePlayableReady | false | 実機再確認がまだない |
| mobileMetricsReady | false | mobile metrics NOT_MEASURED |
| audioMixerReady | false | AudioMixer final未確定 |
| audioLatencyMeasured | false | audio latency未測定 |
| hapticMeasured | false | haptic実機挙動未測定 |
| rcReady | false | P0修復後も実機再確認とmetricsが必要 |
| productionApproved | false | U43はproduction approvalではない |

## next

実機でStageSelect tap、移動、LevelUp tap、Result / Retry tap、音、振動hookを確認する。その後mobile metrics取得へ進む。
