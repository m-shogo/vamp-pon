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

## Store-Readiness Minimum

Before store submission:

- portrait lock verified
- audio mute / pause behavior verified
- app pause / resume verified
- memory and thermal checked on at least one iPhone and one Android device
- crash / ANR reporting path confirmed
- no debug-only UI visible
- no candidate asset marked as production approved without intake gate pass
