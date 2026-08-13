# All Character Cross-Asset Consistency Master v1

Status: `CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION`

## Purpose

Keep one character recognizably the same person/body/animal/artificial entity across production asset kinds and resolutions.

The problem this Master prevents is not only same-face drift between characters. It also prevents **same-character drift between assets**: a reference image can be correct while the sprite, cut-in, transformation or emblem-adjacent asset quietly changes face anatomy, body shape, clothing structure, exposure, color logic or prop relation.

This Master creates no new character canon. It controls simplification and transformation.

## Supported asset kinds

- `character_reference`
- `sprite_sheet_180`
- `normal_cutin`
- `dawn_cutin`
- `kokuyou_cutin`
- `emblem_blank`
- `emblem_normal`
- `emblem_dawn`
- `emblem_kokuyou`

## Identity preservation hierarchy

When information must be reduced, preserve in this order:

1. species / age / body identity
2. face construction and nearest-face distinction
3. body shape / proportion / mobility equipment
4. head and hair mass
5. neutral silhouette and posture logic
6. clothing silhouette and major layer construction
7. body exposure / piercing / tattoo boundaries
8. exact source-backed theme/base color identity
9. signature prop relation / storage / support
10. major material contrast
11. secondary closure / pocket / repair information
12. tiny seams / texture / minor accessory detail

Never simplify by changing a higher layer in order to keep a lower layer.

## Character reference

The reference asset is an inspection asset, not an excuse for premium ornament.

Required:

- full identity geometry visible,
- body proportions readable,
- major clothing construction readable,
- prop relation physically plausible,
- source-backed color roles separated,
- no extra detail added because the canvas is large,
- neutral/world-credible inspection light rather than cinematic redesign.

## 180px sprite sheet

At 180px cell scale, identity must survive without adding oversized decorative signals.

Preserve:

- head-to-body proportion,
- main head/hair mass,
- body mass and center of gravity,
- black-fill silhouette family,
- large clothing masses,
- one or two source-backed color blocks,
- signature prop only if it can be held/stored/read without distorting anatomy,
- mobility equipment and non-human anatomy as structural identity.

Simplify first:

- tiny seam lines,
- subtle surface texture,
- micro-fasteners,
- minor repair stitching,
- tiny secondary accessories.

Forbidden sprite shortcuts:

- making every head the same chibi circle,
- making every body the same tiny slim template,
- enlarging eyes until face signatures collapse,
- inventing giant ribbons, hats, gems or weapons for readability,
- removing wheelchair/equipment because it is difficult to fit,
- humanoidizing dog/cat/robot for animation convenience,
- turning plus-size/older/child body identity into one standard sprite base,
- replacing prop handling with floating icons.

## Cut-ins

`normal_cutin`, `dawn_cutin`, and `kokuyou_cutin` may change crop, gesture, motion and effect intensity. They may not redesign the person.

Cut-in effects may not change:

- face anatomy,
- age coding,
- body size,
- disability/species,
- clothing construction,
- exposure/body modification,
- theme/base color identity,
- signature prop ownership or handling logic.

A dramatic crop may hide information; hidden information is not permission to replace it.

### Dawn

Dawn treatment may add source-backed state/effect information but must not:

- whiten skin,
- turn all accents gold,
- add angelic jewelry or flowing cloth,
- beautify/youngen faces,
- change normal clothing into ceremonial gacha costume unless a separate authority explicitly defines that costume.

### Kokuyou

Kokuyou treatment may use soot, bleed, missing edges, damaged value structure or other source-backed state language. It must not:

- change face/bone structure into monster anatomy,
- create random horns/tattoos/scars,
- turn clothing into black armor,
- convert every color to black + neon,
- sexualize damage through torn exposure,
- erase body/species/disability identity.

## Emblems

Emblem assets are symbolic assets, not miniature character portraits.

Do not force face/body likeness into an emblem unless the existing emblem authority explicitly requires it.

Character consistency for emblem assets means:

- use the correct authored emblem identity,
- keep phase/state differences within emblem canon,
- do not import random character jewelry, body marks, eye shapes or costume detail as emblem decoration,
- do not infer new character design from an emblem generated variant.

An emblem cannot overwrite character appearance canon.

## Color across scale

At smaller scales, combine nearby source-backed color regions if necessary for readability, but do not invent a new saturated accent.

Priority:

1. body identity color where visible,
2. garment base/theme mass,
3. critical accent or prop focus,
4. secondary neutrals.

Star Beast color remains separate and does not become a sprite readability shortcut.

## Prop across scale

If a signature prop is too small to read:

- simplify its silhouette,
- retain correct placement/hand/support relation,
- or omit nonessential micro-detail.

Do not enlarge it until it changes the character silhouette unless the source already defines that scale.

Do not replace it with a generic sword, staff, gem, aura or floating icon.

## Pose and animation

Movement exaggeration may amplify an existing motion signature but may not invent a new personality shorthand.

Examples:

- forwardness may become a clearer forward lean, but not a universal runner pose;
- closed posture may simplify to compact elbow/body spacing, not a weak slouch;
- work posture may lower center of gravity, not become a stock mechanic crouch;
- animal gait remains animal-specific;
- wheelchair/support relation remains physically coherent.

## Cross-asset comparison gate

Before an asset candidate can be approved, compare it against the production character reference and at least one other relevant asset at neutral scale.

Check:

- face geometry remains same character,
- body proportions/body mass remain same character,
- silhouette hierarchy remains same character,
- hair/head mass remains same character,
- clothing still belongs to same wardrobe/construction,
- exposure/body modification did not drift,
- theme/base colors did not migrate into body identity,
- prop scale/position did not become a new identity,
- rendering/effects did not become design changes.

## Generated candidate boundary

A successful simplification or transformation does not create new canon.

If an asset accidentally produces a visually appealing new detail, it remains a candidate artifact and must go through the same human review/promotion process as every other generated design change.
