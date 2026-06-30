# Unity U6 Real Device Prep Review 2026-06-30

## Scope

U6では実機実行そのものは未実行。U6.1でiPhone / Android確認へ進めるため、`docs/unity-real-device-test-checklist-2026-06-30.md` に実行手順とProfiler確認項目を追加した。

## iPhone Minimum

- portrait lock
- Safe Area / Dynamic Island / home indicator
- touch input
- pause / resume
- audio latency
- thermal
- memory
- Profiler connection
- crash log

## Android Minimum

- portrait lock
- punch-hole / navigation bar
- 360x800
- 393x852
- 412x915
- touch / back gesture conflict
- audio focus
- thermal
- memory
- Profiler connection
- crash / ANR log

## Profiler Minimum

- CPU frame time during enemy spawn, hit stop, EXP burst, and LevelUp open
- Rendering cost, draw calls, batches, and transparent overdraw signs
- Memory after repeated play and after LevelUp overlay close
- GC allocations during battle Update and overlay animation
- Audio one-shot latency and audio focus recovery
- `Time.timeScale` restored to `1` after verification restore paths

## Status

実機実行: 未実行。

U6.1でDevelopment Build + Autoconnect Profilerを使い、iPhoneとAndroidの少なくとも1台ずつで確認する。

## U6.1 Follow-Up Status

iPhone real device: not executed in the Codex session.

Android real device: not executed in the Codex session.

Reason:

- No physical device install, device screen inspection, or device Profiler session was available from this execution context.
- Editor/batchmode fallback verification was used instead.

Next required action:

- Run Development Build with Autoconnect Profiler on at least one iPhone and one Android device.
- Record device name, OS version, FPS/memory rough result, Safe Area result, touch result, pause/resume result, and crash/error result in the U6.1 review doc.
