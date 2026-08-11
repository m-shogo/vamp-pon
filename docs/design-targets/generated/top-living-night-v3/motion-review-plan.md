# TOP Living Night V3 — 5-minute Motion Review Plan

Status: `STATIC_CONTRACT_READY / RUNTIME_REVIEW_NOT_RUN`

This document defines the motion quality gate for the persistent TOP screen. It does not mark the runtime review as complete.

## Goal

The TOP should feel alive in the same way a quiet campfire can be watched for several minutes: multiple small systems move independently, no single short loop dominates, and motion never competes with the Core5 characters or UI.

The intended impression is **breathing night**, not an animated event banner.

## Candidate provenance rule

Motion review is evidence about one exact final TOP image, not about an interchangeable composition concept.

Before starting either runtime review, record:

- canonical candidate path: `docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png`
- candidate SHA-256 from `final-art-status.json`
- Unity/source commit SHA

`motion-review-status.json.candidateSha256` must exactly match `final-art-status.json.candidateSha256` before motion can be approved.

**Any final-art PNG byte change invalidates the previous motion review.** Clear the motion candidate SHA and runtime review approval fields back to `NOT_RUN` until the changed candidate is reviewed again.

## Motion hierarchy

### Tier 1 — continuous focal motion

1. **Fire flipbook**
   - 12-frame atlas
   - final visible cadence is owned by `TopLivingNightFireCadenceDirector`
   - adjacent-frame irregular walk only; no arbitrary frame jumps
   - body-heat + coal-heat Perlin cadence variation
   - cooler moments hold silhouettes slightly longer, including restrained edge holds
   - rare interior direction reversal to break the obvious `0 → 11 → 0` loop
   - sparse 2–3-step heat bursts briefly accelerate adjacent frames without skipping authored silhouettes
   - atlas texture/resource lifecycle remains owned by `TopLivingNightView`
   - Reduced Motion: slower cadence, no heat bursts, fire remains visible rather than freezing or disappearing

2. **Fire glow**
   - body / lick / coal Perlin bands mixed together
   - sparse low-amplitude flare envelope only
   - must not flash in sync with the fire atlas
   - Reduced Motion: retain a very small two-band glow variation

### Tier 2 — slow environmental motion

3. **Far clouds**
   - final visible displacement is owned by `TopLivingNightAmbientMotionDirector`
   - slow shared night-air mass plus independent far-cloud detail and vertical drift
   - sparse signed gust adds a temporary drift envelope rather than a pendulum reversal
   - subtle opacity/density breathing remains low amplitude
   - Reduced Motion: exact authored zero displacement and authored alpha

4. **Near clouds**
   - final visible displacement is owned by `TopLivingNightAmbientMotionDirector`
   - shares the broad air mass with far clouds so the sky feels coherent
   - independent near-cloud detail is slightly wider/faster than the far layer
   - sparse gust response is stronger than the far layer without sharing a visible reset
   - subtle opacity/density breathing remains low amplitude
   - Reduced Motion: exact authored zero displacement and authored alpha

5. **Stars**
   - slow + fine Perlin luminance movement
   - sparse gated glimmer only; no synchronized whole-sky blink
   - Reduced Motion: stable restrained alpha

6. **Distant lights**
   - two low-amplitude district Perlin bands
   - sparse late-window wake variation only
   - should read as distant habitation, not warning lights

7. **Lantern glow**
   - independent slow / micro / settling Perlin bands
   - must not lock to fire glow

8. **Whole-art breathing / title micro-motion**
   - post-view motion owned by `TopLivingNightAmbientMotionDirector`
   - art root: sub-pixel x/y Perlin drift plus extremely small scale breathing
   - title: sub-pixel Perlin vertical movement only
   - semantic depth bands receive tiny independent parallax offsets only
   - no camera shake, no large parallax, no synchronized sine reset
   - Reduced Motion: art returns to captured authored base pose; title and semantic depth bands return to exact authored position

### Tier 3 — sparse stochastic accents

9. **Robot eye**
   - rare event from two independent long-lived noise windows
   - brief soft pulse only
   - no rapid blinking
   - Reduced Motion: rare pulse disabled

10. **Smoke wisps**
    - several particles with different duration / phase / rise
    - shared slow airflow + local airflow variation
    - small rotation and anisotropic spread variation to avoid repeated identical plumes
    - fade in/out rather than popping
    - Reduced Motion: visually disabled and rotation reset

11. **Embers**
    - several independent particles with varied duration / phase / rise
    - shared slow airflow + local flutter
    - deterministic per-particle size bias, shimmer and small rotation variation
    - sparse, small and local to the fire
    - Reduced Motion: visually disabled and rotation reset

## Current static timing anchors

These values are implementation anchors to prevent accidental synchronization. Small deliberate tuning is allowed only with corresponding contract/review updates.

| System | Base-view static anchor |
| --- | --- |
| title drift | `0.52` frequency, ~1.2 px amplitude |
| far cloud | `0.113`, ~2.8 px |
| near cloud | `0.197 + 1.7 phase`, ~5.2 px |
| stars | Perlin `0.082` |
| distant lights | Perlin `0.071` |
| fire glow A | Perlin `0.83` |
| fire glow B | Perlin `1.67` |
| lantern | Perlin `0.19` |
| robot eye | `47 s` cycle, ~`1.35 s` event window |
| base fire interval | ~`0.105 s` + bounded Perlin variance |
| base Reduced Motion fire interval | `0.25 s` |
| smoke duration family | `4.8 + index * 1.05 s` |
| smoke phase family | `0.17 + index * 0.23` |
| ember duration family | `2.6 + index % 4 * 0.44 s` |
| ember phase family | `0.09 * index` |

### V3 post-view anti-loop directors

`TopLivingNightAmbientMotionDirector` executes after the base view and replaces short periodic presentation displacement with long-lived Perlin fields. Clouds intentionally share one very slow air mass for atmospheric coherence while retaining independent detail, vertical drift, density variation and a sparse signed gust. It also normalizes normal/Reduced Motion alpha **after** `TopLivingNightView`, allowing a live accessibility preference change to settle without rebuilding the TOP.

| Visible system | V3 director anchor |
| --- | --- |
| art x | Perlin seed `0.31`, frequency `0.031`, ~1.4 px span |
| art y | Perlin seed `1.73`, frequency `0.027`, ~0.9 px span |
| art scale | Perlin seed `4.91`, frequency `0.019`, ±~0.09% |
| title y | Perlin seed `7.33`, frequency `0.047`, ~0.7 px span |
| shared cloud air mass | Perlin seed `11.17`, frequency `0.018` |
| far cloud detail / y | seeds `13.61` / `24.71`, frequencies `0.031` / `0.016` |
| near cloud detail / y | seeds `17.29` / `28.91`, frequencies `0.047` / `0.027` |
| sparse cloud gust | strength seed `19.87` @ `0.010`; signed direction seed `21.43` @ `0.014` |
| far / near cloud density | seeds `32.17` / `35.53`, frequencies `0.021` / `0.028` |
| semantic depth drift | seeds `41.41` / `47.13`, frequencies `0.026` / `0.021`; sparse envelope seed `53.71` @ `0.012` |
| stars | slow `0.061` + fine `0.149`; sparse readiness `0.013` / glimmer `0.101` |
| distant lights | district `0.071` / `0.041`; sparse late-window `0.015` |
| fire glow | body `0.79` + lick `1.73` + coal `0.27`; sparse flare gate `0.11` |
| lantern | slow `0.17` + micro `0.49` + settling `0.037` |
| smoke airflow | shared `0.043` plus per-wisp local noise / shape noise |
| ember airflow | shared `0.043` plus per-ember local noise / flutter / size bias |

`TopLivingNightFireCadenceDirector` executes after both the base view and ambient director and writes only `FireFlipbook.uvRect`:

| Fire cadence property | V3 director anchor |
| --- | --- |
| normal interval | body/coal Perlin-driven `0.082–0.151 s`, multiplied by small edge hold |
| short heat burst | sparse 2–3 adjacent steps at `0.055–0.082 s` |
| Reduced Motion interval | body/coal Perlin-driven `0.31–0.48 s`, multiplied by small edge hold; heat burst disabled |
| body / coal heat | Perlin frequencies `0.317` / `0.097` |
| heat-burst gate | readiness `0.041`; step-trigger seed cadence `0.113` |
| hold decision | independent step Perlin cadence `0.131`, heat-sensitive threshold |
| rare interior reversal | independent step Perlin cadence `0.173`, only frames `2–9`, suppressed during heat burst |
| frame movement | adjacent `±1` only; boundaries clamp/reverse |

The two directors do **not** load textures, replace the V3 composite, own capture readiness, or write approval evidence.

## Anti-loop requirements

During a five-minute watch:

- no obvious global reset should be visible
- far/near clouds may share the broad air mass, but their detail/density movement must not expose a synchronized reset
- sparse cloud gusts must feel like temporary airflow rather than periodic left/right pendulum motion
- art breathing/title/cloud drift must not expose a common periodic reset
- fire must not read as a repeated `0 → 11 → 0` metronome
- fire never jumps between non-adjacent atlas cells
- brief fire heat bursts must remain local/calm rather than reading as a flashing event effect
- fire atlas and fire glow must not peak together repeatedly
- distant lights and lantern must not pulse together repeatedly
- star glimmers and distant-light wake events must stay sparse
- smoke wisps must not share the same rise/fade/shape phase
- embers must not launch as one synchronized equal-size burst
- robot eye must remain a rare accent rather than a metronome
- UI text/buttons must remain visually stable enough to read and tap

## Motion budget

Motion must remain restrained because the TOP is a menu, not gameplay.

- no full-screen particles
- no camera shake
- no continuous character bobbing
- no large parallax displacement
- no high-frequency glow flicker
- no large-opacity pulsing UI
- no video playback
- no animation that obscures title or buttons
- post-view art breathing must remain effectively sub-pixel / imperceptibly slow, not a zoom effect
- sparse gust/heat/glimmer events must never become a continuously obvious animation layer

## Reduced Motion gate

With either supported Reduced Motion preference active:

- far cloud movement: stopped at exact authored zero position; authored alpha restored
- near cloud movement: stopped at exact authored zero position; authored alpha restored
- whole-art breathing: stopped at captured authored base pose
- title and semantic depth micro-motion: stopped at exact authored position
- smoke: visually disabled; post-view rotation reset
- embers: visually disabled; post-view rotation reset
- robot rare blink/pulse: disabled
- stars: stable restrained alpha
- fire flipbook: slowed by the post-view cadence director with heat bursts cancelled, not removed
- fire glow: very small variation retained for scene readability
- UI must remain fully functional

### Live preference toggle gate

The final review must not verify Reduced Motion only via a fresh TOP build. Keep the **same TOP instance visible** and perform the preference transition in both directions:

1. Start in normal motion and switch Reduced Motion **ON**.
2. Without rebuilding/reopening TOP, confirm cloud/title/art/depth displacement settles, cloud authored alpha returns, robot eye/smoke/embers disappear, particle rotations reset, stars become stable, heat bursts stop, and fire/fire-glow remain restrained.
3. Switch Reduced Motion **OFF** while the same TOP remains visible.
4. Confirm stars, robot-eye schedule, smoke, embers, fire-glow amplitude, cloud drift/density, semantic depth drift and art/title micro-motion recover naturally.
5. Switch Reduced Motion **ON once more** and confirm suppression is repeatable.

The transition must have **no white/black flash, duplicated BaseComposite, duplicated particles, one-frame giant transform jump, stuck-zero normal alpha, or TOP view reconstruction**.

The structured review records this as:

```txt
liveToggleToReducedSettled=true
liveToggleBackToNormalSettled=true
noToggleVisualPopOrDuplication=true
```

All three are mandatory for `motionApproved=true`.

## Five-minute runtime review protocol

This gate can only be completed after Unity runtime execution.

### Minute 0–1 — entry quality

- Loading → TOP reveal has no white/black flash
- base composite appears before capture readiness is reported
- fire position matches painted base
- no doubled flame/glow
- no obvious texture pop-in after UI becomes interactive
- post-view motion directors bind without a one-frame jump in title/cloud/art/depth position
- TOP button visual polish must appear without changing the existing button tap areas or callbacks

### Minute 1–3 — loop perception

- fire feels irregular but calm
- occasional short heat burst reads as natural flame energy, not an event flash
- no repeated `0 → 11 → 0` cadence becomes obvious
- fire never jumps between non-adjacent atlas cells
- clouds feel like one atmosphere while far/near detail never reveals a short synchronized loop
- sparse gusts do not create obvious oscillation
- whole-art breathing is barely perceptible and never looks like camera zoom/shake
- stars / distant lights / lantern remain subtle and asynchronous
- smoke/embers stay sparse with varied silhouette/size rather than identical particles
- robot-eye event remains surprising and unobtrusive
- no motion distracts from character faces
- button treatment stays legible against the dark lower safe area without becoming a bright game-event CTA

### Minute 3–5 — stability

- no accumulating particles
- no duplicated `BaseComposite`
- no progressive brightness drift
- no missing/released textures
- no UI input regression
- no visible memory/lifecycle symptom after TOP remains open
- no persistent transform drift after long idle time

### Reduced Motion pass

Run at least 60 seconds of Reduced Motion and perform the **same-view ON → OFF → ON** sequence above. The Reduced Motion result is not PASSED unless all existing reduced observations and all three live-toggle observations are positive.

## Evidence required for promotion

Record separately:

- final candidate path
- final candidate SHA-256
- Unity version
- commit SHA
- normal-motion review duration
- Reduced Motion review duration
- live-toggle-to-Reduced result
- live-toggle-back-to-normal result
- no toggle pop/duplication result
- visual result
- any observed loop/repetition issue
- any texture/lifecycle issue
- reviewer decision

Do not infer this evidence from static CI. Do not reuse a motion review after the final candidate SHA-256 changes.

## Current boundary

```txt
motionStaticContractReady=true
fiveMinuteRuntimeReviewComplete=false
reducedMotionRuntimeReviewComplete=false
liveReducedMotionToggleReviewed=false
motionApproved=false
runtimeCaptureComplete=false
runtimeApproved=false
finalApprovalBlocked=true
```