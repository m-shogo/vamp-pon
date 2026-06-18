# Sprite Image Production Playbook

This document records the image-production workflow that must be used for Vamp Pon so character, enemy, item, weapon, pickup, and effect work does not fall into repeated full-sheet regeneration loops.

## Purpose

The core rule is to separate two different jobs:

1. **Art direction and visual approval**
2. **Technical asset finishing and runtime integration**

Do not force one image-generation step to solve both jobs perfectly. Image models are useful for establishing appealing designs and pose ideas, but exact dimensions, true alpha, cell cutting, filenames, manifests, and runtime wiring must be finished deterministically with scripts or image-processing tools.

## Non-negotiable evaluation order

Judge every visual candidate in this order:

1. Is it appealing enough to keep?
2. Is it unmistakably the same character or asset family?
3. Does its silhouette, face, prop, item shape, enemy type, and movement read at gameplay size?
4. Are anatomy, direction, equipment placement, and motion physically coherent?
5. Does it fit Vamp Pon's night / memory / forgotten-object / black-ink / small-light world?
6. Only after that, check dimensions, grid, alpha, naming, edge contact, and runtime registration.

Technical correctness cannot rescue weak art. Conversely, strong approved art must not be repeatedly regenerated merely because its canvas or alpha is imperfect.

## Mandatory reference stack for character work

Before generating or editing a character image, inspect and pass the actual images, not text-only descriptions:

1. Character master
2. Current best sprite sheet or approved visual baseline
3. Approved four-direction turnaround when available
4. Current direct edit target when performing a correction

For Core5 characters, the first two sources are:

```txt
assets/reference/character-master/core5/<character>-character-master-v1.png
public/assets/prototypes/sprite-sheets/core5-original/<character>-sprite-sheet-v1.png
```

The direct edit target is always the highest-priority source for preserving good cells. The character master explains identity and world. The approved turnaround explains physical construction and equipment placement. The current best sheet defines gameplay readability and pixel density.

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

Do not start a 48-cell sheet before the main design is worth preserving.

### Phase 2: approve a four-direction turnaround

Create front, left, right, and back views.

Verify:

- same person in every direction
- consistent head-to-body proportion
- stable costume construction
- physically consistent equipment placement
- readable back design
- signature prop visible in every direction when it is an identity anchor

For Yui specifically:

- lantern is always in **Yui's right hand**
- bag strap starts at **Yui's right shoulder**
- bag body rests at **Yui's left hip**
- front view: lantern screen-left, bag screen-right
- back view: lantern screen-right, bag screen-left
- left-facing view: bag is near side; lantern is far side but remains visible beyond the silhouette
- right-facing view: lantern is near side; bag is far side and may be partly occluded

Never confuse screen-left/right with the character's body-left/right.

### Phase 3: create the basic 48-cell design sheet

Produce the normal gameplay sheet as a **design original**.

The image generator may return a visually strong sheet with an imperfect size or a baked checkerboard. That does not invalidate the approved art. Freeze the sheet once its visual quality is strong enough.

Do not repeatedly regenerate the entire sheet to fix:

- 1448x1086 instead of 1440x1080
- baked checkerboard
- missing alpha
- exact frame filenames
- manifests
- minor edge cleanup

Those are technical finishing tasks.

### Phase 4: create an additional 48-cell sheet only when needed

Do not overload one sheet with every possible state.

For Yui, the approved structure is:

- basic gameplay 48 cells
- expression / story / rampage 48 cells
- total: 96 cells

The additional sheet exists so the good basic sheet does not need to be remade merely to add portraits, cut-ins, transformation stages, rampage movement, or recovery states.

### Phase 5: freeze approved art

Once the user approves the direction:

- stop full-sheet regeneration
- keep good cells unchanged
- mark the sheet as the design source
- identify only the weak cells by `R<row>C<column>`
- request direct edits for those cells only

A correction prompt must say explicitly:

> This is a direct correction of the current sheet, not a new 48-cell redesign. Preserve good cells and change only the named cells or named weaknesses.

### Phase 6: perform deterministic technical finishing

After visual approval, use code or image tools to:

- remove baked checkerboard or background carefully
- create real RGBA alpha
- crop or repack to exact `1440 x 1080`
- split into exact `180 x 180` cells
- verify 48 non-empty cells
- verify edge contact is zero
- create frame filenames
- create manifests and QA reports
- generate dark-background previews
- place assets into the correct repository directories
- wire runtime IDs
- run tests and build

Do not claim transparency from appearance. Inspect the alpha channel programmatically.

Minimum alpha check:

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
- The subject does **not** need to be 180 px tall or wide.
- Place the subject at an appropriate readable size inside the cell.
- Leave transparent room for silhouette, animation, weapon, equipment, glow, impact, and directional motion.
- No opaque pixel, accessory, glow, shadow, or effect may touch a cell edge.
- Do not shrink the subject until gameplay readability is lost.
- Keep scale consistent across related frames and related assets.

The correct principle is:

> 180x180 is the container, not the subject size.

## Prompt strategy

### Use focused prompts

Long prompts are acceptable only when they resolve concrete ambiguity. Do not bury the primary visual goal beneath dozens of mechanical style rules.

A strong prompt identifies:

- direct edit target
- supporting visual references
- exact cells or states to change
- physical direction rules
- what must remain untouched
- delivery format

### Prefer cell-specific correction

When a sheet is already good, request corrections such as:

- `R4C1` and `R4C2`: make walk A/B use opposite leg phases
- `R5C1-R5C4`: cast is charge/compression
- `R5C5-R5C8`: attack is active release
- `R6C1`: mild hurt
- `R6C2`: stronger recoil

Do not ask the model to reinterpret all 48 cells every time.

### Distinguish motion meanings

A/B animation pairs must differ through more than vertical bobbing:

- foot phase
- knee bend
- center of mass
- shoulder and hip tilt
- prop swing
- bag swing
- cape or clothing flow
- effect trail

Cast and attack must not be the same pose:

- cast = gathering, containing, compressing, preparing
- attack = releasing, thrusting, striking, projecting

Hurt and recoil must not be the same reaction:

- hurt = small impact
- recoil = stronger displacement or knockback

## Transparency rule

A checkerboard visible inside a delivered image is not proof of transparency. It may be baked into the pixels.

Before calling an asset final, verify:

- PNG RGBA
- alpha minimum is 0
- alpha maximum is 255 when opaque content exists
- transparent background pixels are actually alpha 0
- no white or gray matte fringe
- glow fades naturally to alpha 0

Image generation should be asked for real transparency, but the final technical result must be verified and corrected outside the image model when necessary.

## Repository placement strategy

Use a staging location first when the user wants to move quickly:

```txt
assets/import-staging/<asset-batch>/
```

Then Claude Code or another coding agent performs:

1. source inspection
2. final file placement
3. slicing
4. manifest generation
5. runtime registration
6. verification
7. commit and push

For the current Yui package:

- normal source sheet replaces:
  `public/assets/prototypes/sprite-sheets/core5-original/yui-sprite-sheet-v1.png`
- normal runtime frames live in:
  `public/assets/prototypes/sprite-sheets/core5-original-frames/yui/`
- expression/rampage source uses its own directory and must not be mixed into the strict Core5 source set
- `public/assets/sprites/` remains retired and must not be recreated

## Stop conditions

Stop regenerating the whole sheet when all of the following are true:

- the character is attractive enough to preserve
- identity is stable across directions and major frames
- signature equipment is coherent
- the sheet covers the required states
- remaining problems are technical or isolated to a few cells

At that point, move to deterministic finishing and targeted cell repair.

## Forbidden failure patterns

Do not repeat these mistakes:

- praising weak art because size and alpha checks pass
- calling a sheet perfect without checking motion meaning
- repeatedly regenerating good cells to fix dimensions or transparency
- assuming the image model will reliably return exact dimensions
- assuming a visible checkerboard is real alpha
- filling the full 180x180 cell with the subject
- mixing additional character sheets into the strict Core5 source folder
- silently inventing missing frames without documenting them
- claiming final quality when derived placeholder frames still need a hand-drawn pass
- changing gameplay values while integrating art

## Final completion checklist

An asset batch is complete only when:

### Visual

- approved art direction is preserved
- same character or asset family throughout
- direction and equipment logic are coherent
- animation states are readable
- weak cells have been targeted rather than triggering a full remake

### Technical

- exact required canvas size
- exact grid and cell size
- PNG RGBA
- real transparency
- all expected cells non-empty
- no cell-edge contact
- frame names and manifest agree
- runtime IDs resolve
- tests and build pass
- commit and push completed

This playbook applies to future characters, enemies, items, weapons, pickups, and effects. Adapt the subject-specific identity rules, but keep the same approval-first, freeze-good-art, deterministic-finish workflow.
