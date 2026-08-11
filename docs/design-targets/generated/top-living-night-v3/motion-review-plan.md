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
   - adjacent-frame random walk only; no arbitrary frame jumps
   - independent Perlin cadence variation
   - occasional held frame
   - rare interior direction reversal to break the obvious `0 → 11 → 0` loop
   - atlas texture/resource lifecycle remains owned by `TopLivingNightView`
   - Reduced Motion: much slower cadence, fire remains visible rather than freezing or disappearing

2. **Fire glow**
   - two independent Perlin frequencies mixed together
   - subtle amplitude only
   - must not flash in sync with the fire atlas
   - Reduced Motion: retain a very small glow variation

### Tier 2 — slow environmental motion

3. **Far clouds**
   - final visible displacement is owned by `TopLivingNightAmbientMotionDirector`
   - slow low-amplitude Perlin x/y drift rather than short sine pendulum motion
   - unrelated frequency from near clouds
   - Reduced Motion: exact authored zero displacement

4. **Near clouds**
   - final visible displacement is owned by `TopLivingNightAmbientMotionDirector`
   - slightly wider/faster Perlin drift than far clouds
   - no shared phase/reset with far clouds
   - Reduced Motion: exact authored zero displacement

5. **Stars**
   - low-amplitude Perlin luminance movement
   - no synchronized whole-sky blink
   - Reduced Motion: stable restrained alpha

6. **Distant lights**
   - slow low-amplitude Perlin pulse
   - should read as distant habitation, not warning lights

7. **Lantern glow**
   - independent low-frequency pulse
   - must not lock to fire glow

8. **Whole-art breathing / title micro-motion**
   - post-view motion owned by `TopLivingNightAmbientMotionDirector`
   - art root: sub-pixel x/y Perlin drift plus extremely small scale breathing
   - title: sub-pixel Perlin vertical movement only
   - no camera shake, no large parallax, no synchronized sine reset
   - Reduced Motion: art returns to captured authored base pose; title returns to exact zero anchored position

### Tier 3 — sparse stochastic accents

9. **Robot eye**
   - rare event on a long cycle
   - brief soft pulse only
   - no rapid blinking
   - Reduced Motion: rare pulse disabled

10. **Smoke wisps**
    - several particles with different duration / phase / rise
    - slight lateral drift
    - fade in/out rather than popping
    - Reduced Motion: visually disabled

11. **Embers**
    - several independent particles with varied duration / phase / rise
    - sparse, small and local to the fire
    - Reduced Motion: visually disabled

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

`TopLivingNightAmbientMotionDirector` executes after the base view and replaces short periodic presentation displacement with unrelated slow Perlin fields. It also normalizes normal/Reduced Motion alpha **after** `TopLivingNightView`, allowing a live accessibility preference change to settle without rebuilding the TOP.

| Visible system | V3 director anchor |
| --- | --- |
| art x | Perlin seed `0.31`, frequency `0.031`, ~1.4 px span |
| art y | Perlin seed `1.73`, frequency `0.027`, ~0.9 px span |
| art scale | Perlin seed `4.91`, frequency `0.019`, ±~0.09% |
| title y | Perlin seed `7.33`, frequency `0.047`, ~0.7 px span |
| far cloud x | seeds `11.17` + `29.53`, frequencies `0.0125` + `0.0047`, low-amplitude long-period two-term drift |
| far cloud y | seed `13.61`, frequency `0.0091` |
| near cloud x | seeds `17.29` + `37.11`, frequencies `0.0215` + `0.0083`, slightly more presence than far |
| near cloud y | seed `19.87`, frequency `0.0163` |

`TopLivingNightFireCadenceDirector` executes after both the base view and ambient director and writes only `FireFlipbook.uvRect`:

| Fire cadence property | V3 director anchor |
| --- | --- |
| normal interval | Perlin-driven `0.076–0.142 s` |
| Reduced Motion interval | Perlin-driven `0.30–0.46 s` |
| hold decision | independent Perlin seed `29.47` |
| rare interior reversal | independent Perlin seed `37.19`, only frames `2–9` |
| frame movement | adjacent `±1` only; boundaries clamp/reverse |

The two directors do **not** load textures, replace the V3 composite, own capture readiness, or write approval evidence.

## Anti-loop requirements

During a five-minute watch:

- no obvious global reset should be visible
- cloud layers must not reverse together
- art breathing/title/cloud drift must not expose a common periodic reset
- fire must not read as a repeated `0 → 11 → 0` metronome
- fire never jumps between non-adjacent atlas cells
- fire atlas and fire glow must not peak together repeatedly
- distant lights and lantern must not pulse together repeatedly
- smoke wisps must not share the same rise/fade phase
- embers must not launch as one synchronized burst
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

## Reduced Motion gate

With either supported Reduced Motion preference active:

- far cloud movement: stopped at exact authored zero position
- near cloud movement: stopped at exact authored zero position
- whole-art breathing: stopped at captured authored base pose
- title micro-motion: stopped at exact authored zero position
- smoke: visually disabled
- embers: visually disabled
- robot rare blink/pulse: disabled
- stars: stable restrained alpha
- fire flipbook: slowed by the post-view cadence director, not removed
- fire glow: very small variation retained for scene readability
- UI must remain fully functional

### Live preference toggle gate

The final review must not verify Reduced Motion only via a fresh TOP build. Keep the **same TOP instance visible** and perform the preference transition in both directions:

1. Start in normal motion and switch Reduced Motion **ON**.
2. Without rebuilding/reopening TOP, confirm cloud/title/art displacement settles, robot eye/smoke/embers disappear, stars become stable, and fire/fire-glow remain restrained.
3. Switch Reduced Motion **OFF** while the same TOP remains visible.
4. Confirm stars, robot-eye schedule, smoke, embers, fire-glow amplitude, cloud drift and art/title micro-motion recover naturally.
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
- post-view motion directors bind without a one-frame jump in title/cloud/art position

### Minute 1–3 — loop perception

- fire feels irregular but calm
- no repeated `0 → 11 → 0` cadence becomes obvious
- fire never jumps between non-adjacent atlas cells
- clouds do not reveal a short synchronized loop
- whole-art breathing is barely perceptible and never looks like camera zoom/shake
- lights remain subtle
- smoke/embers stay sparse
- robot-eye event remains surprising and unobtrusive
- no motion distracts from character faces

### Minute 3–5 — stability

- no accumulating particles
- no duplicated `BaseComposite`
- no progressive brightness drift
- no missing/released textures
- no UI input regression
- no visible memory/lifecycle symptom after TOP remains open
- no persistent transform drift after long idle time

### Reduced Motion pass

Run at least 60 seconds of Reduced Motion and perform the **same-view ON → OFF → ON** sequence above. The Reduced Motion result is not PASSED unless all five existing reduced observations and all three live-toggle observations are positive.

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
