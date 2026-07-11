# U46 iOS Simulator Smoke

Unity 6000.5.1f1でAI-only define付きiOS Simulator buildを生成し、Xcode 26.6でiPhone 17 Pro / iOS 26.5向けにbuild、install、launchした。

確認経路はBoot、StageSelect pause、灯録index/locked/unlocked detail/seen、Battle、LevelUp pause/resume、Result Clear、Retry、Result Fail、StageSelect return、save generate/reload。13 screenshot、例外0、crash false、EventSystem/AudioListener各1を記録した。

SimulatorのCoreAudio RPC timeoutを避けるためAI-only buildではaudioを一時無効化し、build後にProjectSettingsを復元した。したがってaudio品質・latencyの証跡ではなく、`audioMixerReady=false`と`audioLatencyMeasured=false`を維持する。

証跡は`docs/design-targets/generated/unity-u46/simulator-smoke/`。
