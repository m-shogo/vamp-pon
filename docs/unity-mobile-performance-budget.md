# Unity Mobile Performance Budget

UnityでVamp Pon / Lantern Ledgerをスマホ向けに作る時の性能予算。

目的は、見た目を上げても、スマホで重くならない・読みにくくならない・量産不能にならないようにすること。

## Target

Primary target:

- portrait mobile
- 390 x 844 design baseline
- 60fps target where possible
- stable frame pacing over peak visuals

Fallback:

- low-end Androidでは30fpsでも体験が崩れない設計
- excessive particles/lightingをquality settingで落とせること

## Performance Philosophy

This game should feel premium because feedback is precise, not because everything is expensive.

Prefer:

- small particles
- pooled objects
- simple sprites
- controlled 2D lights
- short tweens
- fewer overdraw layers
- reusable UI prefabs

Avoid:

- full-screen transparent layers stacked everywhere
- too many dynamic 2D lights
- per-frame allocations
- Instantiate/Destroy during combat
- many large textures
- always-on heavy post processing

## Frame Budget Thinking

At 60fps, each frame is about 16.6ms.

Keep headroom.

Rough target:

```txt
Game logic:       2-4ms
Rendering:        5-8ms
UI:               1-3ms
Particles/FX:     1-3ms
Audio/Input/etc:  1ms
Headroom:         2-4ms
```

Do not design effects that only look good on desktop.

## Object Count Budgets

For first Unity demo:

```txt
Enemies active:          30-60
Projectiles active:      20-80
EXP fragments active:    30-120
Damage numbers active:   0-30
Particle systems active: 5-20
2D lights active:        1-6
UI canvases active:      minimal
```

For production candidate, tune after profiling.

## Pooling Rules

Pool these:

- enemies
- projectiles
- pickups / EXP fragments
- hit effects
- ink burst effects
- floating text
- card sparkle/decal effects
- audio one-shot sources if needed

Do not pool everything blindly.

Do not pool:

- long-lived UI screens unless necessary
- static background elements
- ScriptableObject data

## Allocation Rules

Avoid during combat Update:

- LINQ
- new List / new array per frame
- string concatenation for HUD every frame
- Instantiate/Destroy
- GetComponent repeated in hot loops
- FindObjectOfType
- Camera.main repeated calls

Use:

- cached references
- preallocated lists
- dirty flags for UI text
- pooling
- event-driven updates

## 2D Lighting Budget

Lantern light is important, but lights can become expensive.

Use:

- one main player Light2D
- optional small UI glow via sprites instead of real lights
- baked/painted glow textures for many small lights
- light only where it has meaning

Avoid:

- every particle having a real light
- every EXP fragment having a Light2D
- many overlapping full-screen lights
- dynamic shadows everywhere

Recommended:

```txt
Player lantern: real 2D light
Ultimate ready: sprite glow, not real light
NEW badge: sprite glow
EXP: sprite/trail glow
Result dawn: background gradient/sprite overlay
```

## Particle Budget

Particles should be small and readable.

Normal enemy death:

```txt
ink particles: 8-16
memory particles: 2-4
lifetime: 0.25-0.6s
```

Elite death:

```txt
ink particles: 18-32
memory particles: 5-8
lifetime: 0.4-0.8s
```

Boss death:

```txt
special one-off sequence
but still short and pooled where possible
```

Avoid:

- hundreds of particles per normal enemy
- long lifetime particles during combat
- full-screen alpha fog layers

## Texture Budget

Design target screenshots should not become runtime textures.

Runtime texture guidelines:

```txt
Icons: 32/48/64 px
UI decals: 64/128 px
FX sprites: 64/128/256 px
Character sprites: as needed, trimmed
Backgrounds: avoid huge unique backgrounds at first
Cutin layers: keep limited, no baked text
```

Use Sprite Atlas for production candidate.

Avoid:

- duplicate textures with tiny differences
- 4K images
- large transparent padding
- final UI screenshots imported as gameplay UI

## UI Performance Rules

Unity UI can get expensive with too many rebuilds.

Use:

- separate canvases by update frequency
- static background canvas
- HUD canvas
- modal overlay canvas
- avoid changing layout every frame
- update text only when value changes

Canvas split idea:

```txt
Canvas_StaticBackground
Canvas_HUD
Canvas_Overlay
Canvas_Cutin
Canvas_Debug
```

Avoid:

- one huge canvas constantly rebuilt
- every small glow as separate animated UI object
- layout groups recalculating during combat

## Battle Readability Budget

Performance and readability are linked.

Battle screen priority:

1. Player
2. Enemies
3. Projectiles/weapons
4. EXP fragments
5. HUD
6. Effects
7. Background decoration

If screen is busy:

- reduce background
- reduce particles
- reduce glow
- reduce UI opacity
- never hide player/enemies first

## Quality Settings

Prepare quality tiers if Unity continues.

### High

- 60fps target
- 2D lights enabled
- more particles
- camera impulse enabled
- richer trails

### Medium

- 60fps target
- fewer particles
- fewer light overlaps
- shorter trails

### Low

- 30/60 adaptive
- sprite glows instead of some lights
- reduced particles
- no expensive shadows
- no heavy screen overlays

## Profiling Gates

Before saying Unity is better, check:

- FPS on phone, not only Editor
- Profiler CPU
- Profiler GPU if possible
- memory usage
- draw calls / batches
- GC allocations during battle
- UI canvas rebuild spikes

Minimum check for demo:

```txt
Editor play: stable
Phone test: at least plausible
No visible hitch during EXP burst
No hitch during 黒曜化
No hitch during LevelUp panel
```

## Dangerous Moments

These can spike performance:

- many enemies dying at once
- EXP vacuum collecting many fragments
- LevelUp overlay opening while particles exist
- Result screen after clearing many rewards
- 黒曜化 full-screen effect

Budget each:

### Enemy Wave Clear

- pool ink bursts
- cap particles per frame
- stagger fragment spawn if needed

### EXP Vacuum

- merge close fragments visually if needed
- cap trails
- use simple sprite tween if many fragments

### LevelUp Open

- pause or slow combat logic
- fade particles behind
- no expensive layout rebuild loop

### 黒曜化

- use few strong layers
- edge ink sprite overlay
- one slash effect
- one light pulse
- no full-screen particle storm

## Audio Performance

Use AudioSource pooling or controlled one-shots.

Avoid:

- 50 collect sounds at once
- every particle playing sound
- overlapping same SE without limiter

Use:

- pitch variation
- cooldown limiter per SE type
- group collect sounds

## Build Size Caution

For mobile, avoid asset bloat.

Track:

- unused generated images
- duplicate prototypes
- large screenshots
- audio variants
- texture compression settings

## Unity Demo Performance Success Criteria

The Unity 30秒 demo passes if:

- no obvious hitch during normal enemy death
- no hitch during EXP collection
- 黒曜化 feels strong but readable
- LevelUp panel opens smoothly
- Result page appears smoothly
- no constant overheating signs in short test
- visual gain is worth added complexity

## Final Rule

If an effect makes the frame rate unstable or the battle unreadable, it is not premium.

Premium means controlled, readable, and responsive.
