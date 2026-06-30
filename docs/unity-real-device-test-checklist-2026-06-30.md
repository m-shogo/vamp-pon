# Unity Real Device Test Checklist 2026-06-30

## Purpose

U5.1以降、Editor screenshotだけで品質判断しないための実機確認チェックリスト。

## iPhone

- portrait orientation lock
- Safe Area: notch / Dynamic Island / home indicator
- 390x844 baselineとの差分
- touch input and tap target size
- pause / resume
- audio one-shot latency
- thermal behavior after repeated play
- memory stability
- profiler connection
- crash log collection

### iPhone Execution Steps

1. Build a Development Build with Autoconnect Profiler enabled.
2. Install on at least one notch / Dynamic Island device if available.
3. Launch in portrait and confirm the app never rotates away from portrait.
4. Play Stage1 until enemy spawn, projectile hits, EXP collection, and LevelUp overlay are observed.
5. Pause/resume by backgrounding and foregrounding the app.
6. Connect Unity Profiler and record CPU, rendering, memory, GC allocation, and audio behavior.
7. Save crash logs if the app terminates or becomes unresponsive.

U6 status: not executed yet. This checklist prepares U6.1 real device verification.

## Android

- portrait orientation lock
- notch / punch-hole / navigation bar
- 360x800 narrow portrait
- 393x852 common portrait
- 412x915 tall portrait
- touch input and back gesture conflict
- pause / resume
- audio focus changes
- thermal / battery behavior
- memory stability
- profiler connection
- crash / ANR log collection

### Android Execution Steps

1. Build a Development Build with Autoconnect Profiler enabled.
2. Install on devices or profiles covering 360x800, 393x852, and 412x915.
3. Launch in portrait and confirm punch-hole / navigation bar / rounded-corner behavior.
4. Play Stage1 until enemy spawn, projectile hits, EXP collection, and LevelUp overlay are observed.
5. Test back gesture, app switch, lock/unlock, and audio focus changes.
6. Connect Unity Profiler and record CPU, rendering, memory, GC allocation, and thermal behavior.
7. Capture crash / ANR logs if the app terminates, hangs, or loses input.

U6 status: not executed yet. This checklist prepares U6.1 real device verification.

## Safe Area

- HUD stays inside safe area
- LevelUp overlay stays inside safe area
- bottom buttons avoid home indicator / navigation bar
- decorative background may extend beyond safe area
- gameplay background covers the full screen without black bars

## Performance

- 60fps target where possible
- 30fps fallback acceptable only if feel remains stable
- no Instantiate/Destroy spikes during combat loop
- no excessive transparent overdraw
- no long GC spikes during battle

## Profiler Minimum Checks

- CPU frame time during enemy spawn, hit stop, EXP burst, and LevelUp open
- Rendering cost, draw calls, batches, and transparent overdraw signs
- Memory after repeated play and after LevelUp overlay close
- GC allocations during battle Update and overlay animation
- Audio one-shot latency and audio focus recovery
- `Time.timeScale` restored to `1` after verification restore paths

## Store-Readiness Minimum

Before store submission:

- portrait lock verified
- audio mute / pause behavior verified
- app pause / resume verified
- memory and thermal checked on at least one iPhone and one Android device
- crash / ANR reporting path confirmed
- no debug-only UI visible
- no candidate asset marked as production approved without intake gate pass
