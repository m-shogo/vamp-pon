# Unity U43 Runtime Pause Gate Evidence

Date: 2026-07-06

## scope

U43 actual runtimeに対して、実機smoke test前のruntime gateを追加した。目的はStart前、StageSelect中、Result中に裏でBattleが進むP0破綻を防ぐこと。

## implementation evidence

- `U1Stage1SceneBootstrap` keeps a `U2BattleController` reference and a `PlayerController` reference.
- Awake creates the Stage1 runtime, then calls `SetOverlayBattlePaused(true)`.
- Stage1へ tap closes StageSelect, calls `SetOverlayBattlePaused(false)`, then plays battle start feedback.
- `OpenResultOverlay` calls `SetOverlayBattlePaused(true)` before showing Result.
- Result StageSelect tap closes Result, opens StageSelect, and keeps `SetOverlayBattlePaused(true)`.
- `U2BattleController.Update` returns before elapsed time, spawn timer, projectile timer, enemies, projectiles, pickups, damage, and VFX ticks when `runtimePaused` is true.
- `PlayerController.SetRuntimeInputBlocked(true)` clears velocity and stops player movement while overlays are active.

## input collision evidence

- `DevicePointerMoveInputSource` checks `EventSystem.current.IsPointerOverGameObject(...)` before starting or continuing pointer movement.
- Mouse and touch pointer UI hits reset dragging instead of becoming movement input.
- Movement area is limited to the lower-left virtual stick area: `Screen.width * 0.42f` and `Screen.height * 0.34f`.
- Overlay visibility also blocks movement through `SetRuntimeInputBlocked(true)`.

## non-ready boundary

This is static/runtime repair evidence only. It does not approve device readiness, mobile metrics, final audio, haptic design, RC, or production.
