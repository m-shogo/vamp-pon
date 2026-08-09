# TOP Living Night V3 — Core5 Bridge Gap Review

Status: `REVIEWED_FROM_STAGE1_ARTIFACT / FINAL_ART_NOT_APPROVED`

This review compares the current V3 base composite bridge with the five authoritative Core5 master boards shipped in the Stage1 visual-review artifact.

The current bridge remains useful as a composition/runtime recovery asset. It must not be promoted to final TOP art.

## Executive result

```txt
compositionDirection=KEEP
nightCampMood=KEEP
animalRobotPresence=KEEP
runtimeMotionArchitecture=KEEP
currentHumanIdentity=REPLACE
currentHumanScale=REWORK
currentRenderingStyle=REWORK
finalCore5ArtApproved=false
```

## What already works

- Portrait night composition reads immediately as a quiet travelling party around a fire.
- Crescent moon / deep indigo sky gives a useful title-safe region.
- Campfire provides a clear focal point without turning the scene into an event illustration.
- White animal and round robot are both present and readable.
- Rail / station / journey atmosphere is compatible with the intended world.
- Bottom ground is dark enough to become a button-safe region after controlled crop checks.
- The scene has a credible base for fire, glow, smoke, ember and rare-light motion overlays.

These qualities should survive the final character replacement pass.

## P0 — identity failures that block final approval

### 1. Core5 silhouettes are not preserved

The current bridge uses generic travelling figures with different body proportions, face language and costume silhouettes from the Core5 masters.

At phone scale the group reads as a mood painting, but not as `Yui / Asa / Nagi / Michiru / Tomori`.

Final art must make all five recognizable before the viewer reads any UI text.

### 2. Yui identity is not locked

Required master anchors:

- warm brown bob
- deep navy oversized hooded cape
- cream dress
- small warm lantern
- gentle/open expression

Current bridge does not provide a clearly identifiable Yui with those anchors.

### 3. Asa identity is not locked

Required master anchors:

- dark brown side braid
- navy cape
- paper label / name-tag details
- name-tag lantern motif
- calm observant expression

The paper/name-tag language is especially important because Asa otherwise risks collapsing visually into Yui/Nagi.

### 4. Nagi identity is not locked

Required master anchors:

- straight dark hair and blunt bangs
- deep navy moon-pattern hood
- crescent clasp
- moon box / key motif
- quiet reserved expression

The crescent/moon hardware needs to survive the 360x800 crop and cannot be reduced to invisible micro-detail.

### 5. Michiru identity is not locked

Required master anchors:

- brown tied-up hair
- teal ribbon
- dark teal route-pattern cape
- glowing compass
- active guide posture

Michiru should be the strongest cool-color separator in the five-person group.

### 6. Tomori identity is not locked

Required master anchors:

- warm brown tied hair
- rust-red repair cape
- repair lamp
- small tool details
- warm practical expression

Tomori should be the strongest warm-cloth separator without competing with the fire focal point.

## P0 — rendering/style mismatch

The current composite is noticeably more painterly / semi-realistic than the approved Core5 master boards.

The final TOP should move toward the master language:

- anime/storybook character construction
- subtle black-ink edge language
- fibrous paper texture
- controlled painted background
- restrained highlights
- no glossy mobile-gacha rendering
- no photorealistic facial treatment

Do not simply paste master characters over the current background. Characters and environment must share one paper/ink lighting treatment.

## P0 — phone-scale recognizability

The current figures are too small and visually compressed around the fire for identity-first TOP usage.

Recommended hierarchy:

- 2 characters slightly closer to camera
- 2 characters in middle depth
- 1 character behind/side of the fire
- no perfectly even five-person row
- keep faces out of top title and bottom button safe regions
- each character must retain at least one large identity anchor visible at 360x800

Large anchors are preferable to adding more tiny costume detail.

## P1 — composition adjustments

### Fire

Keep the fire near the lower-middle focal axis, but reduce painted flame complexity in the base still so the runtime flipbook does not look doubled.

The base should provide:

- coals
- low flame foundation
- local amber bounce

Runtime should provide the most visible flame motion.

### Smoke / embers

Base still should contain little or no obvious smoke plume and very few baked sparks. Runtime overlays own those elements.

### Robot

Keep the small round robot in a readable lower-side position. Preserve a clean eye region for the rare pulse/blink layer.

### White animal

Keep the animal clearly separate from button rectangles and fire glow. It should remain readable without becoming the primary focal point.

### Rail / station depth

Retain the receding rail/station cue because it gives the static frame narrative depth and reinforces the long-journey theme.

## P1 — UI safe-zone requirements

### Top

Reserve roughly 18–22% for:

- `ヨルノシルベ`
- subtitle

No face or signature prop enters this zone.

### Bottom

Reserve roughly 20–22% for:

- `夜へ出る`
- `灯録`

No face, animal eye, robot eye, compass, lantern or repair lamp sits directly under these controls.

All three crops must be reviewed independently:

- 360x800
- 390x844
- 430x932

## Identity placement recommendation

This is a composition recommendation, not canonical blocking/relationship lore.

- Yui: near-center / fire-adjacent anchor, lantern readable
- Asa: side-middle position where braid + labels remain readable
- Nagi: opposite navy silhouette from Asa, moon hood/crescent visible
- Michiru: slightly dynamic side angle, teal cape + compass visible
- Tomori: warmer side position, rust cape + repair lamp readable

Avoid placing Yui, Asa and Nagi adjacent as three nearly identical navy silhouettes. Use depth, gesture and props to separate them.

## Motion ownership matrix

| Element | Base still | Runtime |
| --- | --- | --- |
| characters | yes | subtle/no skeletal animation in V3 |
| fire coals/base | yes | — |
| main flame | subdued | flipbook owns motion |
| fire glow | minimal | additive pulse |
| smoke | minimal | runtime wisps |
| embers | minimal | runtime particles |
| distant lights | yes | additive low-amplitude pulse |
| robot eye | dark/readable socket | rare pulse/blink |
| lantern light | painted local bounce | restrained additive pulse |
| stars/clouds | optional restrained base | very slow/rare motion only |

## Final-art acceptance checklist

A final candidate is blocked unless all are true:

- [ ] exactly five foreground human identities map to Yui/Asa/Nagi/Michiru/Tomori
- [ ] no generic sixth human competes with Core5
- [ ] each Core5 retains at least one large signature silhouette/prop at 360x800
- [ ] Yui/Asa/Nagi remain distinguishable despite navy clothing
- [ ] Michiru teal identity is obvious without neon saturation
- [ ] Tomori rust-red identity is obvious without stealing the fire focal point
- [ ] animal and robot remain readable
- [ ] top title safe zone is clear
- [ ] bottom button safe zone is clear
- [ ] base flame can accept the runtime flipbook without doubling
- [ ] smoke/ember motion is not visibly baked twice
- [ ] rendering matches the Core5 storybook/ink-paper language
- [ ] no text/logo/UI/watermark is baked into art
- [ ] human visual review is recorded independently from capture automation

## Approval boundary after this review

```txt
stage1ArtifactReviewed=true
currentBridgeCompositionReviewed=true
core5IdentityMismatchConfirmed=true
finalReplacementRequired=true
finalCore5ArtApproved=false
runtimeCaptureComplete=false
humanVisualReviewComplete=false
runtimeApproved=false
finalApprovalBlocked=true
```
