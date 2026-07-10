# U45 AI-only iOS Simulator Smoke

## Scope

U45反映済みStage1を、実機とは独立したiOS Simulator証跡としてbuild、install、launch、自動route検査した。対象は`iPhone 17 Pro / iOS 26.5`、architectureは`arm64`、Bundle Identifierは`com.mshogo.vamppon.u1`。

この結果は`simulatorPlayableCandidateReady=true`を許可するが、actual device smokeやproduction approvalの代替ではない。

## Environment

- Xcode: `26.6 (17F113)`
- selected developer directory: `/Applications/Xcode.app/Contents/Developer`
- host: Apple Silicon `arm64`
- Simulator runtime: `iOS 26.5 (23F77)`
- Simulator: `iPhone 17 Pro`
- runtime追加install: なし。既存runtimeを使用
- Unity: `6000.5.1f1`
- Unity Simulator build: Succeeded、errors 0、warnings 4
- xcodebuild clean build: Succeeded、error lines 0、warning lines 31
- simctl install: Succeeded
- simctl launch: Succeeded、PID `45380`

## Build Safety

`U45IosSimulatorBuild`はdevice向けPlayerSettingsを保存し、Simulator SDK / ARM64を一時選択する。`VAMPPON_AI_SIMULATOR_SMOKE`は`BuildPlayerOptions.extraScriptingDefines`だけで付与し、終了時にSDK、architecture、既存defineが復元されたことをJSONで確認した。Simulator専用値はProjectSettingsへ永続化していない。

procedural UGUIがiOS buildでmagentaになったため、実機でも必要な`UI/Default`を`GraphicsSettings.m_AlwaysIncludedShaders`へ追加した。これはSimulator専用設定ではなく、runtime生成UIのshader stripを防ぐP0修復である。

## Launch Gate

bridge全体は`#if VAMPPON_AI_SIMULATOR_SMOKE`でguardされる。起動時には指定の`--u45-ai-simulator-smoke`を常にsimctlへ渡す。Unity iOS playerでは`simctl launch`のargumentが`Environment.GetCommandLineArgs()`へ露出しなかったため、同時に`SIMCTL_CHILD_VAMPPON_U45_AI_SIMULATOR_SMOKE=1`を渡してSimulator専用gateを成立させた。defineがない通常device / production buildにはbridge自体が含まれず、gateがない通常Simulator起動でも自動routeは動かない。

## Automated Route

すべてpassed:

- Boot -> Stage1 / StageSelect表示
- StageSelect中のbattle pause、counter freeze、movement block
- `Stage1へ` route / battle resume
- 左下movement、release停止、中央領域ignore、UI movement collision guard
- enemy hit / death、pickup / EXP counter
- LevelUp common / rare / evolution表示、tap target、card select
- Result中のbattle pause
- Retry、Stage1再初期化
- StageSelect return、再pause
- Audio hook request / haptic request counter
- unhandled exception 0、crashなし
- duplicate EventSystem / AudioListenerなし

## Evidence Notes

player内ではPPM readbackを生成し、host側でPNGへ変換した。初回StageSelectのMetal readbackにタイル欠損が出たため、同一routeの正常なStageSelect return画像を`01-stage-select.png`にも採用した。route判定自体は初回と復帰後の双方でpassedしている。これはproduction画面の欠損ではなくSimulator smoke harnessのreadback制約で、外部build成果物はcommitしていない。

2台目のSimulatorは今回未実施。通常サイズ1台の必須検査を優先し、iPhone 17eは利用可能だがshutdownのままとした。

## Readiness Boundary

- `simulatorPlayableCandidateReady=true`
- `deviceInstallAttempted=false`
- `deviceRunConfirmed=false`
- `actualDeviceSmokeResultProvided=false`
- `actualDeviceSmokeResult=NOT_PROVIDED`
- `candidateAssetsApprovedAsFinal=false`
- `devicePlayableReady=false`
- `mobileMetricsReady=false`
- `audioMixerReady=false`
- `audioLatencyMeasured=false`
- `hapticMeasured=false`
- `rcReady=false`
- `productionApproved=false`

Simulatorではtouch品質、実音量・遅延、実haptic、thermal/performance、safe areaの実機差、candidate assetの最終美術品質を承認できない。
