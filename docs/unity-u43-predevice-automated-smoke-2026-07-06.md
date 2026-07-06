# Unity U43 Predevice Automated Smoke

Date: 2026-07-06

## scope

U43 device playable runtime repairを、実機確認前にEditor / batchmode / checkerで確認する。これは実機smokeではない。実機結果は引き続き `NOT_PROVIDED` / `HUMAN_CHECK_NEEDED` として扱う。

## automated harness

Unity Editor method:

```txt
VampPon.UnitySpike.Editor.U43PredeviceAutomatedSmokeVerification.Run
```

The harness opens Boot / Stage1, enters PlayMode, waits for actual Stage1 runtime bootstrap, and checks:

- MainCamera + AudioListener
- EventSystem + InputSystemUIInputModule
- StageSelect overlay
- U2BattleController
- PlayerController
- U43RuntimeFeedbackBridge
- StageSelect initial pause gate
- Stage1へ press equivalent
- Result open equivalent
- StageSelect return equivalent
- Retry route button presence
- Editor audio / haptic hook counters
- Editor screenshot generation

## result

Unity batchmode completed with exit code 0 on 2026-07-06.

Automated checks confirmed:

- C# compile / Unity batchmode method execution
- Boot scene open
- Stage1 scene open
- Build Settings include Boot / Stage1
- Proof scene excluded from Build Settings
- Stage1 actual runtime bootstrap objects exist
- StageSelect initial pause gate
- Stage1へ press equivalent resumes Battle
- Result open equivalent pauses Battle
- StageSelect return keeps Battle paused
- Retry button route exists
- UI movement collision guard source exists
- virtual stick is lower-left only
- Audio hook counters increase in Editor
- Haptic request counters increase in Editor
- Editor pre-device screenshots were generated

Not run:

- iOS build generation, because the requested safe output folder is outside the allowed touch scope for this request.
- Actual device smoke, because no device results were provided.

## boundary

- `actualDeviceSmokeResultProvided=false`
- `actualDeviceSmokeResult=NOT_PROVIDED`
- `deviceScreenshot=DEVICE_SCREENSHOT_NOT_PROVIDED`
- Editor screenshots are pre-device evidence only.
- `AudioClip.Create` tone remains hook evidence, not final SE.
- `Handheld.Vibrate()` remains hook evidence, not final haptic design.
- iOS build generation is not device install evidence.

## iOS build generation

Not run in this pass because the requested safe destination is outside `/Users/m-shogo/Developer/personal/vamp-pon`, while the task also forbids touching other folders. This is recorded as `iosBuildGenerationReady=false`.

## READY flags

Keep false:

- `devicePlayableReady=false`
- `mobileMetricsReady=false`
- `audioMixerReady=false`
- `audioLatencyMeasured=false`
- `hapticMeasured=false`
- `rcReady=false`
- `productionApproved=false`

## output

```txt
docs/design-targets/generated/unity-u43/predevice-automated-smoke-readiness.json
docs/design-targets/generated/unity-u43/predevice-smoke/
```
