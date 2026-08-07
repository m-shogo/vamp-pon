# TOP Living Night V3 — 5-minute Motion Review Plan

Status: `STATIC_CONTRACT_READY / RUNTIME_REVIEW_NOT_RUN`

This document defines the motion quality gate for the persistent TOP screen. It does not mark the runtime review as complete.

## Goal

The TOP should feel alive in the same way a quiet campfire can be watched for several minutes: multiple small systems move independently, no single short loop dominates, and motion never competes with the Core5 characters or UI.

The intended impression is **breathing night**, not an animated event banner.

## Motion hierarchy

### Tier 1 — continuous focal motion

1. **Fire flipbook**
   - 12-frame atlas
   - ping-pong direction rather than hard restart
   - small Perlin-driven interval variation
   - occasional held frame to break mechanical cadence
   - Reduced Motion: slower cadence

2. **Fire glow**
   - two independent Perlin frequencies mixed together
   - subtle amplitude only
   - must not flash in sync with the fire atlas
   - Reduced Motion: retain a very small glow variation

### Tier 2 — slow environmental motion

3. **Far clouds**
   - very slow horizontal drift
   - different frequency from near clouds
   - Reduced Motion: stop movement

4. **Near clouds**
   - slightly faster and wider drift than far clouds
   - phase offset from far clouds
   - Reduced Motion: stop movement

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

### Tier 3 — sparse stochastic accents

8. **Robot eye**
   - rare event on a long cycle
   - brief soft pulse only
   - no rapid blinking
   - Reduced Motion: rare pulse disabled

9. **Smoke wisps**
   - several particles with different duration / phase / rise
   - slight lateral drift
   - fade in/out rather than popping
   - Reduced Motion: visually disabled

10. **Embers**
    - several independent particles with varied duration / phase / rise
    - sparse, small and local to the fire
    - Reduced Motion: visually disabled

## Current static timing anchors

These values are implementation anchors to prevent accidental synchronization. Small deliberate tuning is allowed only with corresponding contract/review updates.

| System | Static anchor |
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
| normal fire interval | ~`0.105 s` + bounded Perlin variance |
| Reduced Motion fire interval | `0.25 s` |
| smoke duration family | `4.8 + index * 1.05 s` |
| smoke phase family | `0.17 + index * 0.23` |
| ember duration family | `2.6 + index % 4 * 0.44 s` |
| ember phase family | `0.09 * index` |

## Anti-loop requirements

During a five-minute watch:

- no obvious global reset should be visible
- cloud layers must not reverse together
- fire atlas and fire glow must not peak together repeatedly
- distant lights and lantern must not pulse together repeatedly
- smoke wisps must not share the same rise/fade phase
- embers must not launch as one synchronized burst
- robot eye must remain a rare accent rather than a metronome
- UI text/buttons must remain visually stable enough to read and tap

The goal is not mathematical non-repetition. The goal is that a viewer cannot easily perceive a short, mechanical master loop.

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

The visual subject remains the Core5 party.

## Reduced Motion gate

With either supported Reduced Motion preference active:

- far cloud movement: stopped
- near cloud movement: stopped
- smoke: visually disabled
- embers: visually disabled
- robot rare blink/pulse: disabled
- stars: stable restrained alpha
- fire flipbook: slowed, not removed
- fire glow: very small variation retained for scene readability
- UI must remain fully functional

A future runtime review should also confirm that any newly added motion follows the same reduction policy.

## Five-minute runtime review protocol

This gate can only be completed after Unity runtime execution.

### Minute 0–1 — entry quality

Check:

- Loading → TOP reveal has no white/black flash
- base composite appears before capture readiness is reported
- fire position matches painted base
- no doubled flame/glow
- no obvious texture pop-in after UI becomes interactive

### Minute 1–3 — loop perception

Watch without interacting.

Check:

- fire feels irregular but calm
- clouds do not reveal a short synchronized loop
- lights remain subtle
- smoke/embers stay sparse
- robot-eye event remains surprising and unobtrusive
- no motion distracts from character faces

### Minute 3–5 — stability

Check:

- no accumulating particles
- no duplicated `BaseComposite`
- no progressive brightness drift
- no missing/released textures
- no UI input regression
- no visible memory/lifecycle symptom after TOP remains open

### Reduced Motion pass

Repeat a shorter review with Reduced Motion enabled and verify the gate above.

## Evidence required for promotion

Record separately:

- Unity version
- commit SHA
- normal-motion review duration
- Reduced Motion review duration
- visual result
- any observed loop/repetition issue
- any texture/lifecycle issue
- reviewer decision

Do not infer this evidence from static CI.

## Current boundary

```txt
motionStaticContractReady=true
fiveMinuteRuntimeReviewComplete=false
reducedMotionRuntimeReviewComplete=false
motionApproved=false
runtimeCaptureComplete=false
runtimeApproved=false
finalApprovalBlocked=true
```
