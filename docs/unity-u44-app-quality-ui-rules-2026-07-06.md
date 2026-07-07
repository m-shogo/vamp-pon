# Unity U44 App Quality UI Rules

Date: 2026-07-06

## baseline

- Build for a 390x844 portrait reference.
- Use Safe Area fitting on all full-screen UI roots.
- Keep CanvasScaler reference resolution at 390x844 for mobile UI unless a later device metrics pass proves otherwise.
- Readability wins over decoration.
- Mobile tap targets should be at least 44px, with 56px preferred for primary actions.
- Text must be TMP-rendered in Unity, not baked into generated screen images.

## interaction

- The top Battle HUD must not hide enemies, projectiles, pickups, or critical player feedback.
- The left-bottom virtual stick should be quiet when idle and visibly responsive while touched.
- The virtual stick must remain limited to the lower-left input zone.
- Right-top/right-bottom special, Result, Retry, and StageSelect actions must be reachable by thumb and protected from movement input.
- LevelUp cards must be large enough for finger taps and must not place crucial text under the thumb.
- Overlay UI taps and drags must not be interpreted as movement.

## screen language

- Result should feel like a memory page.
- StageSelect should feel like a paper map or memory notebook.
- Collection should feel like an illustrated book, atlas, or memory album.
- Paper UI, black ink, lantern light, and morning-after warmth are the core system language.
- Normal screens should stay quiet.
- Rare, evolution, 黒耀化, and clear moments may become more theatrical.
- Do not increase color count casually; keep a restrained palette and reserve strong color for events.
- Character, enemy, item, and UI material quality must not feel mixed across asset sources.

## asset boundary

- Generated images are references only until explicitly approved as final sliced runtime assets.
- Do not paste generated screen compositions directly into runtime UI.
- Prefer 9-slice-ready panels, reusable frames, TMP text layers, and icon slots.
- Placeholder UI is acceptable before actual device smoke if it preserves layout, tap safety, and replacement slots.
- Final asset approval requires alpha/fringe inspection and Unity gameplay-size readability.

## audio and haptic

- Runtime hook tones are not final SE.
- `Handheld.Vibrate()` is hook confirmation, not final haptic design.
- `audioMixerReady=false`, `audioLatencyMeasured=false`, and `hapticMeasured=false` remain until the final device pass.

## readiness

- U44 does not approve device playability, RC, production, mobile metrics, final audio, or final haptic.
- Keep `devicePlayableReady=false`, `rcReady=false`, and `productionApproved=false` until actual device evidence exists.
