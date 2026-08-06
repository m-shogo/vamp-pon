# TOP Living Night V3 — Final Core5 Identity Brief

Status: `FINAL_ART_CANDIDATE_REQUIRED`  
Runtime V3 composite currently in PR #78 is a visual-recovery bridge, not final character approval.

## Objective

Create one production-oriented 430x932 portrait TOP key visual for ヨルノシルベ that preserves the existing quiet railway-camp composition while replacing generic companion identities with the approved Core5 character masters.

The final art must support a long-running Unity TOP scene. It is not a one-off splash image and must leave clear regions for animated fire, smoke, embers, light masks, title and buttons.

## Authoritative identity masters

Use only these repository masters for the five foreground human identities:

1. `assets/reference/character-master/core5/yui-character-master-v1.png`
2. `assets/reference/character-master/core5/asa-character-master-v1.png`
3. `assets/reference/character-master/core5/nagi-character-master-v1.png`
4. `assets/reference/character-master/core5/michiru-character-master-v1.png`
5. `assets/reference/character-master/core5/tomori-character-master-v1.png`

Do not invent substitute characters or merge identities.

### Yui

- warm brown bob
- deep navy oversized hooded cape
- cream dress
- small warm lantern
- gentle, open expression

### Asa

- dark brown side braid
- navy cape with paper labels/name tags
- name-tag lantern motif
- calm, observant expression

### Nagi

- straight dark hair with blunt bangs
- deep navy moon-pattern hood
- crescent clasp
- small moon box/key motif
- quiet, reserved expression

### Michiru

- brown tied-up hair with teal ribbon
- dark teal route-pattern cape
- glowing compass
- active guide posture

### Tomori

- warm brown tied hair
- rust-red repair cape
- repair lamp and small tool details
- warm, practical expression

## Scene composition

- portrait 430x932 master
- quiet abandoned railway/station camp at night
- crescent moon and restrained stars
- S-curve or receding rail line to preserve journey symbolism
- five Core5 companions gathered naturally around a compact fire
- white sleeping animal and small round robot remain present
- no large extra human companion that competes with Core5 identity
- group should feel like trusted travelling companions, not a posed idol ensemble
- subtle black-ink linework and fibrous paper texture
- palette: deep indigo / black ink / muted teal / restrained amber firelight
- no saturated mobile-gacha lighting or glossy 3D rendering

## UI safe regions

- top 18–20%: low-detail night-sky area for `ヨルノシルベ` and subtitle
- bottom 20–22%: dark, low-contrast ground/rail area for `夜へ出る` and `灯録`
- no face, signature item or animal eye behind button rectangles
- central fire must remain above the main button safe region

## Motion separation requirements

The still must permit these runtime overlays without obvious duplication:

- fire flipbook at the central fire
- soft fire glow mask
- smoke wisps rising into the open central area
- sparse embers
- distant station/window light pulse
- lantern glow pulse
- robot eye pulse
- optional restrained star/cloud drift

Avoid painting oversized smoke or excessive sparks into the base still. The base fire may be present but should tolerate a small animated flame overlay.

## Hard exclusions

- no text, logo, UI, watermark or loading indicator in the artwork
- no generic anime cast replacing Core5
- no duplicated Core5 character
- no sexualized posing or excessive exposure
- no photorealistic faces
- no neon cyberpunk palette
- no large white/blank region
- no development labels such as `capture hold`
- no bottom-center foreground object that blocks buttons

## Approval gates

A candidate cannot be promoted unless all are true:

- five Core5 identities are individually recognizable against their master boards
- Yui/Asa/Nagi are not confused with one another despite navy capes
- Michiru teal route identity and Tomori rust repair identity remain distinct
- animal and robot are clearly readable at phone scale
- title and button safe regions pass at 360x800, 390x844 and 430x932
- fire overlay does not look doubled or detached
- image retains readable dark values after iOS ASTC 6x6 import
- human visual review is recorded separately from automated capture success

## Current boundary

```txt
topRuntimeV3Implemented=true
currentCompositeRole=visual-recovery-bridge
finalCore5ArtApproved=false
humanVisualReviewComplete=false
runtimeApproved=false
finalApprovalBlocked=true
```
