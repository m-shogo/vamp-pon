# Visual Production System

Status: repository-wide visual production authority for player-facing screens.

This document records the default production method for visual implementation. It exists so future work does not regress into flat generated images, generic effects, or screen-by-screen one-off styling.

## Core rule

Do not treat a polished screenshot as the runtime asset.

For every major player-facing screen, separate:

1. art-direction composite — the canonical review target
2. semantic runtime layers — only the depth/effect groups that benefit from independent motion or lighting
3. UI — readable controls, labels, affordances, and accessibility states
4. procedural motion / VFX — motion owned by code, particles, material/shader parameters, or authored short atlases
5. mobile rendering budget — texture count, batching, overdraw, light count, memory, and lifecycle

The correct implementation is not “animate everything”. It is “give motion ownership only to elements whose movement improves depth, feedback, atmosphere, or comprehension”.

## Baseline production principles

- Prefer semantic 2.5D decomposition over one flattened image when depth matters.
- Preserve one canonical composition for crop, identity, visual review, and regression comparison.
- Never regenerate responsive variants independently. Derive all supported crops/layouts from the same approved source and semantic layer registration.
- Use a small number of meaningful depth bands rather than dozens of arbitrary cutouts.
- Keep character identity-critical artwork more stable than environmental layers.
- Use local masks, additive/unlit materials, particles, flipbooks, and shader parameters for fire, glow, smoke, dust, fog, sparkles, rain, snow, ink, etc. instead of baking every effect into a single image.
- Avoid synchronized sine-wave animation. Use separated frequencies, stateful cadence, noise, sparse triggers, and event-driven motion where appropriate.
- Reduced Motion is a runtime state, not a different screen build. It must suppress or settle nonessential movement without breaking controls.
- Do not use generated video loops as the default background implementation.
- Keep native text and interactive UI separate from decorative art whenever possible.
- Reuse materials and atlas-friendly predefined textures to reduce batch breaks. Do not create a new material or texture for every decorative object.
- Prefer one or two lighting/blend responsibilities per scene before adding extra 2D light blend styles.
- Measure overdraw, draw calls, memory, frame pacing, and lifecycle on target devices before promoting visual complexity.

## Screen-specific production recipes

### Loading

Purpose: transition, travel, anticipation.

Use a strong static seasonal/event composition with restrained UI motion. Background images do not need deep parallax unless a later loading design explicitly benefits from it. Prefer one image plus lightweight progress/fade/pulse over a complex scene graph. Release textures after dismissal.

### TOP

Purpose: the game’s emotional home and strongest environmental scene.

Use semantic 2.5D layers: environment, stars, far/near clouds, distant town, lights, Core characters, companion/robot, fire, glow, smoke, embers, lantern light, foreground accents. Long-lived atmosphere uses asynchronous procedural motion. Character faces remain near-static.

Detailed contract: `docs/design-targets/generated/top-living-night-v3/layered-final-production-contract.md`.

### Stage Select

Purpose: destination choice and anticipation.

Prefer a map/station/route scene with 2–4 meaningful depth bands, route lights, local weather/ambient particles only where they reinforce stage identity, and a strong selected-destination focus. Do not animate every card. Selected state may move; unselected states should remain quiet. Keep labels native and readable.

### Collection

Purpose: archive, memory, ownership, inspection.

Prefer tactile paper/ink/object presentation. Use page or card depth, subtle light response, material masks, and localized rarity treatment rather than a constantly moving background. Small tilt/parallax may respond to selection, but the collection itself must stay easy to scan. Do not turn it into an animated wallpaper.

### Result

Purpose: payoff, emotional closure, reward comprehension.

Use staged reveal: hierarchy first, reward emphasis second, rare celebration last. Prefer controlled burst particles, ink/paper transitions, local glow and rarity-specific treatments. Avoid permanently looping celebratory VFX. Keep numbers and reward changes legible before spectacle.

### Level Up / choice overlays

Purpose: high-speed decision making during play.

Clarity overrides atmosphere. Use minimal background motion, strong focus separation, selected-card response, localized rarity/evolution effects, and short entrance/selection transitions. Avoid expensive full-screen environmental effects behind the choices.

### Battle / HUD

Purpose: action readability.

Do not apply TOP-style ambient parallax to gameplay just because it looks sophisticated. Environmental depth can exist, but enemies, pickups, hit feedback, hazards, player silhouette, aiming/interaction areas, and HUD readability own the budget. Use short event-driven VFX, pooling, atlases, and shared materials. Every persistent effect must justify overdraw and screen noise.

### Cut-ins / blackening / rare states

Purpose: exceptional emotional punctuation.

These may use more aggressive shaders, masks, distortion, particles, camera impulse, and lighting because they are rare and brief. Preserve identity anchors and avoid generic full-screen “AI magic” noise. Expensive effects should have bounded duration and deterministic cleanup.

### Settings / First Run / utility screens

Purpose: comprehension and trust.

Use the design language and materials, but animation should be almost entirely functional: transitions, selection, progress, and micro-feedback. Do not spend performance or visual attention on ambient decorative loops.

## Runtime layer selection test

A visual element should become an independent runtime layer only if at least one is true:

- it needs distinct parallax/depth movement
- it needs independent luminance/color control
- it is an event-driven VFX surface
- it needs to disappear/change without rebuilding the whole composition
- it benefits from independent accessibility/reduced-motion treatment
- it is reused or atlas-friendly

Otherwise keep it baked into the nearest static art band.

## Motion hierarchy

Use three motion scales where appropriate:

- macro: rare scene-level movement such as a slow camera/environment breathe, route transition, weather change, or major state change
- meso: clouds, foreground silhouettes, selected cards, hanging props, distant lights, environmental depth
- micro: flame cadence, embers, smoke wisps, eye reaction, paper grain shimmer, local glow, dust

Macro motion must be uncommon. Meso motion must not compete with interaction. Micro motion should make the scene feel alive without demanding attention.

## Lighting / shader policy

Unity 6 URP 2D lighting and Sprite Lit Shader Graph are valid tools when a screen benefits from actual light interaction, but they are not mandatory for every UI screen. Favor simple masks/material parameters when they reproduce the look more cheaply.

When using 2D lights:

- minimize light blend styles
- scope lights to required sorting layers
- avoid overlapping large lights without measured benefit
- use normal/mask maps only where the surface response is visible at phone scale
- prefer shared shader/material variants over bespoke material proliferation

TOP currently uses a custom luminance-additive mask path because its important light effects are local and controlled. A future screen may use URP Light2D where interaction with lit sprites justifies it.

## Mobile asset policy

Default player-facing 2D texture policy unless a measured exception exists:

- sRGB for color art
- no alpha where unnecessary
- mipmaps OFF for full-screen UI/2D art unless scaling evidence says otherwise
- Read/Write OFF
- Clamp for screen-aligned art
- Bilinear unless pixel-art rules require Point
- max texture size chosen from actual on-device need, not source-generation size
- iOS ASTC compression; current TOP policy uses ASTC 6x6
- atlas predefined small sprites/effects when it reduces state changes without creating oversized waste
- clean up build-only generated Resources and release runtime-owned assets explicitly

## Quality review order

For any major redesigned screen:

1. visual composition / identity
2. semantic layer correctness
3. responsive crop and Safe Area
4. interaction/readability
5. runtime motion and Reduced Motion
6. lifecycle / transition in and out
7. rendered capture on supported phone sizes
8. frame pacing, memory, overdraw/draw-call sanity
9. Simulator/device evidence where required
10. final approval

A static checker cannot substitute for runtime evidence.

## Anti-patterns

Do not:

- ship a generated screenshot as a final runtime screen merely because it looks good
- flatten text/buttons into artwork
- split art into many layers without a runtime reason
- animate all layers at the same rate
- use a fixed short loop for ambient scenes when a non-periodic procedural treatment is practical
- pulse every light simultaneously
- add full-screen glow/particles to make weak composition look premium
- use excessive blur/transparent veils that cause overdraw and erase art detail
- add effects before fixing composition, scale, hierarchy, identity, or spacing
- report static CI as visual/runtime PASS

## Current research basis

This policy is intentionally aligned with current Unity 6 production guidance rather than preserving an older implementation merely because it already exists. Relevant Unity documentation includes:

- Unity 6 UI performance optimization: batching, atlases, overdraw, memory, profiling
- Unity 6 URP 2D lighting system and mobile-oriented 2D renderer
- Unity 6 2D light optimization, including minimizing blend styles
- Unity 6 Sprite Lit Shader Graph / mask / normal-map workflows

The exact technique remains screen-dependent. “Latest/professional” means choosing the current production method that best serves the visual goal and mobile budget, not mechanically adding the newest feature everywhere.

## Authority rule for future work

When implementing or redesigning a major screen, start from this document before copying the architecture of an older screen. Existing code is evidence and a migration constraint, not automatically the best-practice authority.

If current Unity/platform practice materially changes, update this document and then adapt affected screens deliberately. Do not silently preserve obsolete visual architecture because it is already in the repository.
