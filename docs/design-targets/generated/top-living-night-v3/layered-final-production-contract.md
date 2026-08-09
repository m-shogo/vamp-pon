# TOP Living Night V3 — Layered Final Production Contract

Status: production contract for PR #78 Draft. This does **not** approve any final Core5 art or runtime evidence.

## Why this exists

The final TOP must not be treated as one flattened illustration with generic effects pasted over it. The production target is a semantic 2.5D scene: a small number of independently authored visual depth bands plus procedural micro-motion. The player should feel that the night is alive without reading the screen as an animated wallpaper.

The existing V2 kit already proves the useful semantic decomposition. V3 final art must preserve that idea when the Core5 replacement arrives instead of baking every important depth cue into one immovable base composite.

## Authoring model

Create one canonical 430x932 art-directed composite for review, then author/export the following production layers from the same composition and identity references. Do not ask an image model to freely reinterpret each layer from scratch; all exported layers must remain spatially registered to the canonical composite.

| Band | Runtime asset | Alpha | Motion ownership | Notes |
| --- | --- | --- | --- | --- |
| 00 | `environment-base` | no | breathing only | starless sky, station architecture, rail bed, ground; no people/fire/glow |
| 01 | `stars` | yes | ambient director | multiple weak luminance frequencies; no whole-layer blink |
| 02 | `clouds-far` | yes | ambient director | slowest sky displacement |
| 03 | `clouds-near` | yes | ambient director | broader displacement than far clouds |
| 04 | `distant-town` | yes | ambient director | station/town silhouette that can carry tiny parallax |
| 05 | `distant-lights-mask` | yes | additive shader | sparse districts, never all lights pulsing together |
| 06 | `core5` | yes | near-static parallax | exactly Yui / Asa / Nagi / Michiru / Tomori; no sixth human |
| 07 | `animal-robot` | yes | near-static parallax | white animal + small round robot |
| 08 | `robot-eye-mask` | yes | additive + rare event | normally dark; sparse non-periodic reaction |
| 09 | `fire-base` | yes | static | logs/coals/base silhouette only |
| 10 | `fire-flipbook-atlas` | yes | FireCadenceDirector | irregular adjacent-frame random walk |
| 11 | `fire-glow-mask` | yes | additive shader | local luminance only; no full-screen orange wash |
| 12 | `smoke-atlas` | yes | view + ambient airflow | thin intermittent wisps; low density |
| 13 | `embers-atlas` | yes | view + ambient airflow | sparse particles, density modulation |
| 14 | `lantern-glow-mask` | yes | additive shader | local Yui/prop light; independent from fire cadence |
| 15 | `foreground-accents` | yes | strongest tiny parallax | rail grass, nearest silhouettes, edge framing |

## Depth policy

The semantic layers use different movement envelopes, not identical sine loops.

- sky / clouds: largest readable movement, still slow
- distant town: approximately 1–2 px drift at 430x932 reference scale
- Core5: approximately sub-pixel to 1 px drift; faces must never visibly swim
- animal / robot: slightly more independent than Core5, but restrained
- foreground accents: approximately 2–4 px drift and rare gust response
- fire / smoke / embers: local motion; never move the entire composition to fake fire

Reduced Motion must restore every semantic layer to its authored zero pose without rebuilding TOP. Smoke, embers and robot-eye events are suppressed; fire remains slow and restrained.

## Professional production rule: composite for art direction, layers for runtime

The canonical composite remains important for identity, crop and visual review, but it is not sufficient as the final runtime representation. Runtime must reconstruct the approved look from registered semantic layers plus additive masks. A flattened composite may remain as a fail-closed fallback/reference, not as the only source of depth.

This avoids the main failure mode of a one-image approach: clouds can move, but characters, foreground and distant structures remain physically glued together, so the scene reads as a still image with effects.

## Generation / cutout workflow

1. Lock the canonical 430x932 Core5 composite direction.
2. Produce a clean `environment-base` with all foreground actors, fire, smoke and glows removed and the occluded background plausibly completed.
3. Export Core5 as one registered transparent group. Per-character runtime separation is optional; identity consistency is more important than extra motion.
4. Export animal+robot separately.
5. Export foreground accents separately.
6. Keep stars/clouds/light masks/fire/smoke/embers as dedicated effect assets.
7. Edge-clean every alpha layer at 430x932 and inspect against dark navy and warm amber checker backgrounds before runtime registration.
8. Derive 390x844 and 360x800 crops from the same registered layer set; do not regenerate them independently.

## Mobile rendering policy

Do not explode the scene into dozens of independent textures. Semantic decomposition should remain coarse and meaningful. Static/predefined small assets should be atlas-friendly where practical; dynamic light masks may share the existing luminance-additive material. iOS import policy remains ASTC 6x6, mipmaps off, Read/Write off, Clamp, Bilinear unless a measured artifact requires a scoped exception.

## Current implementation mapping

`TopLivingNightAmbientMotionDirector` now owns long-period Perlin breathing, sky separation, depth-band parallax, sparse light behaviour, particle density modulation and secondary airflow.

`TopLivingNightFireCadenceDirector` owns fire atlas cadence without taking texture lifecycle ownership.

`TopLivingNightCompositeV3Controller` currently still uses a flattened base composite as the V3 replacement authority. That remains an explicit migration gap: final layered-runtime promotion must not claim completion until the approved Core5 candidate has a registered semantic runtime layer pack or an equivalent reconstruction whose depth bands remain independently movable.

## Honesty boundary

This contract is design/runtime architecture only.

- final Core5 candidate: not approved by this document
- Unity V3 execution: NOT_RUN unless separately executed
- 15-frame capture: NOT_RUN unless separately executed
- 5-minute motion review: NOT_RUN unless separately executed
- Simulator/iPhone performance: NOT_RUN unless separately executed
- `runtimeApproved` / `approvedAsFinal`: unchanged
