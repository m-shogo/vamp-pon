# TOP Living Night V3 — Final Key Art Generation Prompt

Status: `GENERATION_READY / NOT_FINAL_ART`

Use this only to generate a replacement candidate for the current visual-recovery bridge. The five Core5 repository masters are mandatory visual references.

## Locked reference authority

Use all five Core5 master images as hard identity references:

- `assets/reference/character-master/core5/yui-character-master-v1.png`
- `assets/reference/character-master/core5/asa-character-master-v1.png`
- `assets/reference/character-master/core5/nagi-character-master-v1.png`
- `assets/reference/character-master/core5/michiru-character-master-v1.png`
- `assets/reference/character-master/core5/tomori-character-master-v1.png`

Their current binary authority is locked by:

- `docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json`

Before final generation/review, the five files must pass `check-top-living-night-core5-reference-integrity.ts`. Do not silently substitute another revision of a character master. An intentional master change requires an explicit reference-manifest update and downstream identity/generation review reset.

Composition-only reference:

- `docs/design-targets/generated/top-living-night-v2/previews/top-living-night-layered-candidate-430x932.png`

Do not copy the generic bridge humans. Keep only its useful quiet-night / camp / rail / town / animal / robot composition logic.

## Primary prompt

Create a production-quality portrait key visual for the mobile game **ヨルノシルベ**, master size **430x932**, intended for a persistent animated Unity TOP screen rather than a loading/event illustration.

The scene is a serious, quiet night immediately before the party departs again: an abandoned railway/station camp, deep indigo night, restrained crescent moon and stars, receding rail line, compact campfire, distant fantasy-town lights. The emotional tone is calm, slightly melancholic, trusted companions after a long journey, warm but not cheerful-party energy.

The **five foreground humans must be exactly the approved Core5 identities** from the locked repository masters. Do not substitute, redesign or merge them.

### Yui — identity lock

Use `assets/reference/character-master/core5/yui-character-master-v1.png`.

- warm brown bob
- deep navy oversized hooded cape
- cream dress
- small warm lantern clearly readable
- gentle, open expression
- near-center / fire-adjacent visual anchor

### Asa — identity lock

Use `assets/reference/character-master/core5/asa-character-master-v1.png`.

- dark brown side braid
- navy cape
- visible paper-label / name-tag language
- name-tag lantern motif
- calm observant expression
- do not let her silhouette collapse into Yui or Nagi

### Nagi — identity lock

Use `assets/reference/character-master/core5/nagi-character-master-v1.png`.

- straight dark hair with blunt bangs
- deep navy moon-pattern hood
- crescent clasp large enough to remain readable on phone
- moon box / key motif
- quiet reserved expression

### Michiru — identity lock

Use `assets/reference/character-master/core5/michiru-character-master-v1.png`.

- brown tied-up hair
- teal ribbon
- dark teal route-pattern cape
- glowing compass clearly readable
- slightly active guide posture
- strongest cool-color separator in the group, but no neon

### Tomori — identity lock

Use `assets/reference/character-master/core5/tomori-character-master-v1.png`.

- warm brown tied hair
- rust-red repair cape
- repair lamp
- a few readable tool details
- warm practical expression
- strongest warm-cloth separator without competing with the fire

## Group blocking

Do not line the five characters up at equal scale.

Use layered depth:

- two characters slightly closer to camera
- two in middle depth
- one slightly behind / beside the fire
- every face readable at 360x800
- each character retains one large signature prop/silhouette
- Yui, Asa and Nagi should not form three adjacent nearly-identical navy blobs
- use gesture, depth, hair and large props to separate them

The party should feel naturally gathered around the campfire, not posed for an idol ensemble photo.

## Companion elements

Include:

- one small white animal, resting naturally and clearly readable
- one small round robot, clearly readable with a clean dark eye region for a runtime rare blink/pulse

Do not add a sixth foreground human.

## Composition / UI safe areas

### Top 18–22%

Low-detail deep night sky for Unity UI title/subtitle.

- no face
- no signature item
- no bright lantern
- no important silhouette

### Middle 55–60%

Primary Core5 group + journey environment.

- characters are the visual subject
- compact fire is secondary focal point
- rail/station depth remains visible

### Bottom 20–22%

Dark, low-detail ground/rail region for Unity UI buttons `夜へ出る` and `灯録`.

- no face
- no animal eye
- no robot eye
- no compass
- no lantern
- no repair lamp
- no bright foreground object centered behind buttons

The image must survive EnvelopeParent-style crop at:

- 360x800
- 390x844
- 430x932

## Rendering language

Match the locked Core5 master boards rather than the current painterly bridge:

- anime/storybook character construction
- subtle black-ink linework
- fibrous paper texture
- hand-painted background feeling
- controlled shadow values
- deep indigo / black ink / muted teal
- restrained amber only from fire and lamps
- clean but not glossy
- detailed enough for key art, not a chibi sticker sheet

The characters and environment must share one coherent paper/ink lighting treatment.

## Motion-aware base still

This still will receive Unity overlays.

Paint only a restrained base for:

- low coals / low flame foundation
- gentle local fire bounce
- distant lights
- lantern local bounce

Leave motion ownership to Unity for:

- main fire flipbook
- fire glow pulse
- smoke wisps
- sparse embers
- distant-light pulse
- lantern pulse
- robot-eye rare blink/pulse
- optional restrained star/cloud drift

Do not bake large smoke plumes, dense sparks, giant glow halos or a huge detailed flame into the base image.

## Mood targets

- serious
- quiet
- night
- slightly bittersweet
- trusted companions
- memory
- long journey
- just before going back out into the night
- visually rich enough to watch for a long time
- closer to quietly watching a campfire than watching a mobile-game event banner

## Hard negative prompt

Do **not** generate:

- seasonal festival illustration
- beach / sea / fireworks event art
- swimsuit characters
- party celebration
- oversized smiles
- idol lineup
- generic substitute anime cast
- redesigned Core5 identities
- duplicated character
- sixth foreground human
- sexualized posing
- excessive skin exposure
- photorealistic human faces
- glossy 3D render
- neon cyberpunk palette
- saturated gacha rarity lighting
- giant magical effects
- giant smoke plume
- excessive embers
- progress dashboard
- infographic
- UI mockup
- loading bar
- logo
- baked text
- watermark
- development label
- white blank background
- character face in title safe zone
- important object in button safe zone

## Phase A required output — incoming candidate only

```txt
format=PNG
width=430
height=932
foregroundHumans=5
core5IdentityLock=Yui,Asa,Nagi,Michiru,Tomori
core5ReferenceAuthority=core5-reference-manifest.json
textInImage=none
uiInImage=none
```

The image-generation worker must write the newly generated candidate to the **incoming** path first:

```txt
docs/design-targets/generated/top-living-night-v3/incoming/top-living-night-core5-candidate-430x932.png
```

Do **not** write or copy a freshly generated image directly to:

```txt
docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png
```

The canonical `final/` path is owned by the existing intake/registration flow defined in `final-generation-bundle.json`:

- workflow: `.github/workflows/top-final-art-intake.yml`
- staging: `scripts/unity/stage-top-living-night-final-art-intake.py`
- registration: `scripts/unity/register-top-living-night-final-art.ts`

That flow validates dimensions/SHA/provenance and invalidates candidate-sensitive stale evidence. Registration itself does not approve the image. Never bypass the intake boundary with a direct overwrite or manual approval-flag edit.

## P0 family continues after the canonical candidate

This prompt produces **Phase A: one canonical candidate**. It does not by itself complete `ART-P0-TOP-CORE5-V3`.

Once a candidate direction is selected for continued production, derive the remaining assets from the **same locked composition and Core5 identity set**:

- six structural semantic layers from `layered-final-production-contract.md`
- ten effect companion assets from `final-effect-companion-brief.md`

P0 image-generation completion therefore means **17 generated master-family artifacts total**:

- 1 canonical candidate
- 6 structural layers
- 10 effect companion assets

Do not independently reinterpret those 16 derived assets from scratch. They must remain spatially/materially registered to the candidate family. The six `semanticLayerRuntime.requiredLayers` in `final-generation-bundle.json` are the structural runtime-registration subset, not the full image-generation completion list.

## Required review after generation

Do not accept the first aesthetically pleasing result automatically.

Review in this order:

1. Count exactly five Core5 humans.
2. Match each face/hair/cape/prop to the relevant locked repository master.
3. Confirm Yui/Asa/Nagi are distinguishable.
4. Confirm Michiru teal and Tomori rust identities read immediately.
5. Confirm animal and robot readability.
6. Crop to 360x800 / 390x844 / 430x932.
7. Overlay approximate title/button rectangles.
8. Confirm main flame can be replaced/supplemented by runtime flipbook.
9. Confirm smoke/embers are not excessively baked in.
10. Confirm the artwork is serious TOP key art, not Loading/event art.
11. Confirm Core5/crop/motion/human/Unity/capture/device evidence is bound to the exact registered final-art SHA.

Only after those checks may the candidate enter runtime replacement work.

## Boundary

```txt
generationPromptReady=true
core5ReferencesMandatory=true
core5ReferenceManifestLocked=true
currentBridgeStillActive=true
finalCandidateGenerated=false
finalCore5ArtApproved=false
runtimeCaptureComplete=false
humanVisualReviewComplete=false
runtimeApproved=false
finalApprovalBlocked=true
```