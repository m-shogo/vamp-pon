# Unity U49 Actual-device Audio / Haptic Completion

Date: 2026-07-21

Result: `BLOCKED`
U49: `BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE`

## Completed implementation

- production AudioMixer: 9 groups / 4 exposed parameters
- production SE registration: 22 events / 22 unique clips
- production audio owner: 8 explicitly routed 2D voices
- iOS production haptic adapter: Core Haptics native plugin through `IU28HapticPlatformAdapter`
- Editor/Simulator/non-iOS no-op boundary
- development-only verification harness: 22 audio events / 10 haptic events
- Unity normal compile, Editor verification, iOS Device export, Xcode Release build, signing, install

## Incomplete physical-device evidence

Device installは成功したが、developer profile未信頼のためlaunchは失敗した。次の項目は証跡がないため完了扱いにしない。

- harness launch and automatic sequence
- gameplay smoke and same-process recovery
- device-side scheduling latency p50/p95/max
- speaker volume/mix/clipping human observation
- native haptic event-by-event human observation
- settings OFF/ON、cooldown/spam、background/foreground recovery
- combined human audio/haptic decision

## Readiness

`audioMixerReady=false`、`audioLatencyMeasured=false`、`hapticMeasured=false`、`audioReady=false`、`hapticReady=false`、`physicalDeviceReady=false`、`devicePlayableReady=false`。

U49では`performanceReady=false`、`mobileMetricsReady=false`、`rcReady=false`、`productionApproved=false`を維持する。U50は開始しない。

## Required unblock

端末でdeveloper profileを明示的に信頼する。既存build後にruntime integrity hardeningが入ったため、現行Unity runtimeから署名buildを再生成・再installしてlaunchする。その後、U49 harness sequence、background/foreground、18項目の人間確認を実施し、全測定証跡が同じbuild source commitを指し、以後にUnity runtime差分がなく、machine-readable evidenceとcheckerが一致した場合のみcompletionへ昇格する。
