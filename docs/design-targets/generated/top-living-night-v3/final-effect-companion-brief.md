# TOP Living Night V3 — Final Effect Companion Brief

Status: generation brief only. No final-art or runtime approval is changed by this document.

## Purpose

The final Core5 composite and runtime effect layers must look like one authored scene. Existing V2 effects remain temporary implementation fallbacks only; they are not automatically the final visual match after the Core5/environment art is replaced.

Generate from one locked 430x932 canonical composition. Do not independently reinterpret each layer.

## Structural layers

- `00-environment-base.png`
- `04-distant-town.png`
- `06-core5.png`
- `07-animal-robot.png`
- `09-fire-base.png`
- `15-foreground-accents.png`

## Effect companion deliverables

- `01-stars.png` — transparent sparse star field matching the final sky
- `02-clouds-far.png` — transparent far cloud band with drift overscan
- `03-clouds-near.png` — transparent near cloud band with broader drift overscan
- `05-distant-lights-mask.png` — sparse local luminance mask
- `08-robot-eye-mask.png` — local robot-eye luminance mask
- `10-fire-flipbook-atlas.png` — restrained adjacent fire states for irregular runtime cadence
- `11-fire-glow-mask.png` — local fire luminance mask
- `12-smoke-atlas.png` — several thin low-density wisps with transparent edges
- `13-embers-atlas.png` — sparse varied ember sprites/frames
- `14-lantern-glow-mask.png` — local lantern/prop luminance mask independent from fire

## Generation rules

1. Lock the canonical final composite and exact Core5 identity first.
2. Derive structural and effect assets from the same sky/fire/light/material language.
3. Keep full-canvas layers spatially registered to the 430x932 master.
4. Derive 390x844 and 360x800 from the registered master; do not regenerate them independently.
5. Cloud layers need enough off-edge content for current parallax plus the rare cloud-opening event.
6. Fire states must not make large silhouette jumps; runtime owns cadence.
7. Smoke/embers must support meaningful empty intervals rather than constant density.
8. Additive masks must remain local so scene contrast is preserved.

## Runtime ownership

- `TopLivingNightAmbientMotionDirector`: continuous micro motion, density, airflow, light variation
- `TopLivingNightRareMomentDirector`: sparse larger environment moments
- `TopLivingNightFireCadenceDirector`: irregular fire-state cadence
- luminance additive shader: local light masks

Generated assets provide authored states/masks. Runtime provides timing and motion.

## Acceptance

- structural layers plus effects reconstruct the canonical mood without obvious seams
- alpha edges remain clean on deep navy and warm-amber test backgrounds
- clouds have enough overscan for movement
- fire does not expose an obvious short repeated pattern with the current cadence director
- smoke and embers stay restrained
- effects share the same rendering language as the final composite

## Honesty boundary

Until generated and actually reviewed/executed, effect companion final match and current V3 runtime evidence remain unapproved / NOT_RUN as applicable.
