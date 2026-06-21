# Sprite Image Production Playbook

This document defines the required image-production workflow for Vamp Pon character, enemy, item, weapon, pickup, cut-in, and effect assets.

## Core principle

Separate these two jobs:

1. **Visual design and approval**
2. **Deterministic technical finishing and runtime integration**

Do not force one image-generation step to solve both. Image models establish appealing designs, poses, and visual language. Scripts and image-processing tools handle exact size, real alpha, cell cutting, filenames, manifests, QA, and runtime wiring.

## Evaluation order

Judge every visual candidate in this order:

1. Is it appealing enough to preserve?
2. Is it unmistakably the same character or asset family?
3. Does the silhouette, face, prop, item shape, enemy type, and movement read at gameplay size?
4. Are anatomy, direction, handedness, equipment placement, and motion physically coherent?
5. Does it fit Vamp Pon's night / memory / forgotten-object / black-ink / small-light world?
6. Only then check dimensions, grid, alpha, naming, edge contact, and runtime registration.

Technical correctness cannot rescue weak art. Strong approved art must not be repeatedly regenerated merely because canvas size or transparency is imperfect.

## Mandatory reference stack

Before generating or editing a character image, inspect and pass the actual images rather than relying on text-only descriptions:

1. Character master
2. Current best sprite sheet or approved visual baseline
3. Approved four-direction turnaround when available
4. Current direct edit target when correcting an existing image

For Core5 characters:

```txt
assets/reference/character-master/core5/<character>-character-master-v1.png
public/assets/prototypes/sprite-sheets/core5-original/<character>-sprite-sheet-v1.png
```

The direct edit target has the highest priority for preserving good cells. The character master defines identity and world. The turnaround defines physical construction. The current best sprite sheet defines gameplay readability and pixel density.

## Universal body-relative handedness and equipment rule

This is a **shared rule for every character and asymmetric asset**, not a Yui-only rule.

Before producing a turnaround, sprite sheet, animation, cut-in, enemy sheet, weapon pose, or transformed state, create a body-relative placement map for every persistent asymmetric element.

Examples of elements that must be mapped:

- right-hand weapon or prop
- left-hand weapon or prop
- right or left shoulder strap
- right or left hip bag, sheath, pouch, holster, or ornament
- back-mounted item
- one-sided horn, wing, sleeve, armor plate, wound, crest, or mechanical part
- near-side and far-side enemy limbs or weapons

The map must state:

- which body side owns the element
- which hand or attachment point carries it
- whether it may be occluded in side views
- whether it is an identity anchor that must remain visible even on the far side
- whether its position changes intentionally in a specific action

Then convert the body-relative map into screen-space placement for each direction:

- front
- back
- facing left
- facing right

Never treat screen-left and screen-right as permanent body sides.

Never mirror a character or enemy and assume the result is physically correct. A mirrored image swaps body-relative handedness and equipment unless the artwork is corrected afterward.

Across idle, walk, cast, attack, hurt, recoil, transformation, rage, downed, and recovery states:

- the same hand keeps the same persistent prop unless the design explicitly includes a hand transfer
- the same shoulder keeps the same strap
- the same hip keeps the same bag, sheath, or pouch
- near-side and far-side occlusion must follow the viewing direction
- far-side identity props should remain visible outside the silhouette when required for recognition

A character-specific assignment, such as one character holding a lantern in the right hand, is only an instance of this universal rule. Do not copy that assignment to other characters without checking their own design master.

## Standard production pipeline

### Phase 1: establish one appealing design

Create or select one strong full-body design first.

Approve:

- face
- hair
- silhouette
- costume
- signature prop
- palette balance
- personality
- asymmetric equipment map

Do not start a 48-cell sheet before the main design and its body-relative equipment logic are worth preserving.

### Phase 2: approve a four-direction turnaround

Create front, left, right, and back views.

Verify:

- same person in every direction
- consistent head-to-body proportion
- stable costume construction
- correct body-relative handedness and attachment points
- physically correct near-side/far-side occlusion
- readable back design
- signature prop visibility when it is an identity anchor

The turnaround is the place to resolve left/right logic. Do not defer ambiguous handedness until the 48-cell sheet.

### Phase 3: create the basic 48-cell design sheet

Produce the normal gameplay sheet as a **design original**.

The image generator may return a visually strong sheet with an imperfect size or a baked checkerboard. That does not invalidate the approved art. Freeze the sheet once visual quality is strong enough.

Do not regenerate the entire sheet merely to fix:

- 1448x1086 instead of 1440x1080
- baked checkerboard
- missing alpha
- exact filenames
- manifests
- minor edge cleanup

Those are deterministic technical tasks.

### Phase 4: create additional sheets only when needed

Do not overload one sheet with every possible state.

Use separate sheets for additional expression sets, transformations, rage states, bosses, weapon variants, or special animations when that preserves a strong existing basic sheet.

For the current Yui asset set, the approved structure is:

- basic gameplay 48 cells
- expression / story / rampage 48 cells
- total 96 cells

This is a project-specific sheet structure, not a universal handedness rule.

## Cut-in asset rule

A runtime cut-in is **not** the same as a `180 x 180` sprite-sheet cell.

Use `180 x 180` only for:

- sprite-sheet cells
- small portrait cells
- HUD preview icons
- cut-in thumbnails inside a 48-cell sheet

For an actual in-game cut-in that slides across the vertical mobile screen, create a separate wide asset.

Recommended source format:

```txt
1440 x 360 px
PNG RGBA
transparent background
wide horizontal composition
```

Recommended runtime display target for the 390 x 844 mobile viewport:

```txt
width: 100vw
height: about 96-140 CSS px
a horizontal band across the screen
```

Cut-in composition rules:

- use a wide, dramatic banner composition, not a square portrait
- keep the face, signature prop, and emotional state readable at speed
- leave motion room for slash, light, ink, paper, or memory effects
- do not bake UI text into the image unless the task explicitly asks
- keep transparent edges so the cut-in can slide or flash cleanly over gameplay
- still obey body-relative handedness and equipment rules

For a character with both normal and dark/altered ultimate states, create two separate wide cut-in assets rather than forcing both into `180 x 180` cells.

### Phase 5: freeze approved art

Once the user approves the direction:

- stop full-sheet regeneration
- keep good cells unchanged
- mark the approved image as the design source
- identify weak cells using `R<row>C<column>`
- request direct edits for only those cells or weaknesses

A correction prompt must say:

> This is a direct correction of the current sheet, not a new full-sheet redesign. Preserve good cells and change only the named cells or named weaknesses.

### Phase 6: deterministic technical finishing

After visual approval, use code or image tools to:

- remove baked checkerboard or background carefully
- create real RGBA alpha
- crop or repack to the exact required canvas
- split exact cells
- verify every expected cell is non-empty
- verify edge contact is zero
- generate exact frame filenames
- generate manifests and QA reports
- generate dark-background previews
- place assets in the correct repository directories
- register runtime IDs
- run tests and build

Do not claim transparency from appearance. Inspect alpha programmatically.

```python
from PIL import Image
img = Image.open(path).convert('RGBA')
print(img.size)
print(img.getchannel('A').getextrema())
```

If alpha extrema are `(255, 255)`, the image is fully opaque even when it displays a checkerboard.

## Shared 180x180 cell rule

This applies to characters, enemies, items, weapons, pickups, and effects unless another format is explicitly required.

- The canvas or cell is `180 x 180 px`.
- The subject does not need to be 180 px tall or wide.
- Place the subject at an appropriate readable size inside the cell.
- Leave transparent room for silhouette, animation, weapon, equipment, glow, impact, and directional motion.
- No opaque pixel, accessory, glow, shadow, or effect may touch a cell edge.
- Do not shrink the subject until gameplay readability is lost.
- Keep scale consistent across related frames and assets.

> 180x180 is the container, not the subject size.

## Prompt strategy

A strong prompt identifies:

- direct edit target
- supporting visual references
- body-relative handedness and attachment map
- exact cells or states to change
- what must remain untouched
- delivery format

Long prompts are useful only when they resolve concrete ambiguity. Do not bury the primary visual goal beneath unrelated mechanical rules.

## Cell-specific correction

When a sheet is already good, request targeted changes such as:

- `R4C1` and `R4C2`: use opposite walk phases
- `R5C1-R5C4`: cast is charge/compression
- `R5C5-R5C8`: attack is active release
- `R6C1`: mild hurt
- `R6C2`: stronger recoil

Do not ask the model to reinterpret all cells every time.

## Motion distinctions

A/B animation pairs must differ through more than vertical bobbing:

- foot phase
- knee bend
- center of mass
- shoulder and hip tilt
- prop swing
- attached-equipment swing
- cape or clothing flow
- effect trail

Cast and attack must differ:

- cast = gathering, containing, compressing, preparing
- attack = releasing, thrusting, striking, projecting

Hurt and recoil must differ:

- hurt = small impact
- recoil = stronger displacement or knockback

## Transparency rule

A checkerboard visible inside a delivered image is not proof of transparency.

Before calling an asset final, verify:

- PNG RGBA
- alpha minimum is 0
- alpha maximum is 255 when opaque content exists
- background pixels are actually alpha 0
- no white or gray matte fringe
- glow fades naturally to alpha 0

## Repository placement strategy

Use a staging directory when speed matters:

```txt
assets/import-staging/<asset-batch>/
```

Then a coding agent performs:

1. source inspection
2. final placement
3. slicing
4. manifest generation
5. runtime registration
6. verification
7. commit and push

For the current Yui package:

- normal source replaces `public/assets/prototypes/sprite-sheets/core5-original/yui-sprite-sheet-v1.png`
- normal runtime frames live in `public/assets/prototypes/sprite-sheets/core5-original-frames/yui/`
- expression/rampage source uses its own directory and must not be mixed into the strict Core5 source set
- `public/assets/sprites/` remains retired

Wide cut-ins should use their own runtime directory, for example:

```txt
public/assets/prototypes/cutins/<character-id>/
```

## Stop conditions

Stop regenerating the whole sheet when:

- the art is attractive enough to preserve
- identity is stable
- handedness and equipment continuity are coherent
- required states are covered
- remaining problems are technical or isolated to a few cells

At that point, move to deterministic finishing and targeted repair.

## Forbidden failure patterns

Do not repeat these mistakes:

- praising weak art because dimensions and alpha pass
- calling a sheet perfect without checking motion meaning
- treating a runtime cut-in as a `180 x 180` cell when the task expects a wide screen cut-in
- repeatedly regenerating good cells to fix dimensions or transparency
- assuming a checkerboard means real alpha
- filling the full 180x180 cell with the subject
- mirroring asymmetric characters or enemies without correcting handedness
- letting weapons, bags, props, or one-sided details switch body sides between directions or frames
- copying one character's right/left equipment assignment to another character without checking its master
- silently inventing missing frames without documenting them
- changing gameplay values while integrating art

## Final completion checklist

### Visual

- approved art direction is preserved
- same character or asset family throughout
- body-relative handedness and equipment map is documented
- front/back/left/right screen placement is derived correctly
- animation states are readable
- cut-ins use the correct wide format when meant for runtime screen presentation
- weak cells are targeted rather than causing a full remake

### Technical

- exact required canvas size
- exact grid and cell size
- PNG RGBA
- real transparency
- all expected cells non-empty
- no cell-edge contact
- frame names and manifests agree
- runtime IDs resolve
- tests and build pass
- commit and push completed

This playbook applies to all future characters, enemies, items, weapons, pickups, cut-ins, and effects. Subject-specific left/right assignments come from each asset's own design master; the universal rule is to define, preserve, and verify those assignments across every direction and state.
