# Unity TimeScale Service Plan 2026-06-30

## Purpose

U3 hit stop、U4 LevelUp overlay、将来のpause、result遷移、黒耀化が `Time.timeScale` を奪い合わないように、最終的に `BattleTimeScaleService` 経由へ統一する。

## 現状のTime.timeScale操作箇所

- `U3HitStopController.Request()` sets `Time.timeScale = 0.18f`
- `U3HitStopController.Update()` restores `Time.timeScale = 1f`
- `U3HitStopController.OnDisable()` restores `Time.timeScale = 1f`
- `U4TimeScaleGuard.PauseForOverlay()` sets `Time.timeScale = 0f`
- `U4TimeScaleGuard.ResumeFromOverlay()` restores `Time.timeScale = 1f`
- `U4TimeScaleGuard.ForceRestore()` restores `Time.timeScale = 1f`
- `U4LevelUpOverlay.OnDisable()` calls `ForceRestore()` if overlay pause is still active
- `U4LevelUpOverlay.OnDestroy()` calls `ForceRestore()` if overlay pause is still active
- `U5VisualCandidateVerification` records pause state, then calls `ForceRestore()`
- `U5ScreenshotCapture` calls `ForceRestore()` after capture paths

## なぜ危険か

- hit stop and overlay pause use different owners but both write directly to `Time.timeScale`.
- A short hit stop can restore `1f` while a modal pause still expects `0f`.
- A modal overlay can clear a hit stop state without knowing whether it was active.
- Future pause, result, and 黒耀化 timing will add more states unless there is a single owner model.
- Verification restore is currently safe as a final escape hatch, but it is not a runtime ownership model.

## Priority

Highest to lowest:

1. ForceRestore / Play stop / scene reload safety
2. Result / modal hard pause
3. LevelUp overlay pause
4. Manual pause
5. 黒耀化 buff duration and cut-in gate
6. HitStop short impulse
7. Normal battle time

HitStopは短時間・一時的。LevelUp/Pause/Resultは明示lock。黒耀化はbuff時間管理とhit stopを分離する。

## Owner / Lock / Release 方針

- Each caller requests a token with an owner id.
- Lock owners are explicit: `LevelUpOverlay`, `PauseMenu`, `ResultTransition`.
- Impulse owners are short-lived: `HitStop`.
- The service computes the effective scale from active locks and impulses.
- Releasing an unknown owner is a no-op with debug logging in development.
- The service owns the final write to `Time.timeScale`.

## ForceRestore 方針

- `ForceRestore()` clears all locks and impulses and writes `Time.timeScale = 1f`.
- It remains available to verification, scene reload, and emergency cleanup.
- Production code should prefer releasing its own token instead of forcing global restore.

## Lifecycle Restore

- `OnDisable`: release owner token; if the service is being destroyed, force restore.
- `OnDestroy`: release owner token; if no service remains, force restore.
- scene reload: clear all owners before loading or during bootstrap.
- play stop: force restore to `1f`.

## U6でやる範囲

- Design doc only.
- No behavior replacement in U3 or U4.
- Keep U4 LevelUp pause and U3 hit stop verification unchanged.
- Keep `Time.timeScale` final restoration checks in U5 verification.

## U7以降で置き換える範囲

- Introduce `BattleTimeScaleService` as the only runtime writer.
- Replace `U3HitStopController` direct writes with a short impulse request.
- Replace `U4TimeScaleGuard` direct writes with a lock token.
- Add pause and result locks before implementing production Result.
- Keep 黒耀化 buff timing independent from hit stop and modal pause.

## U6 Decision

No proof class is added in U6 because direct coexistence with `U3HitStopController` and `U4TimeScaleGuard` would create two ownership models. The safe pass is documentation plus existing verification.
