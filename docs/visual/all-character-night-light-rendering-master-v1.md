# All Character Night / Light Rendering Master v1

## Status
CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION

## Purpose
Keep all 36 characters inside Yoru no Shirube's night-world visual logic without using a generic blue filter, luxury rim light, magical glow, or gacha-premium lighting shorthand. Rendering must reveal the existing design; it must never redesign the person.

## Core principle
**Source → Light path → Material response → Readability.**

Light is not decoration. Every emitted light has a source. Every highlight is a material response. Every shadow must preserve the character's established anatomy, skin tone, age, body shape, clothing construction, mobility equipment, species, and object relationship.

## Night is not a palette preset
Night does not mean:
- universal navy/black recolor
- cyan ambient wash
- violet fantasy fog
- neon edge outline
- bright eyes
- glowing tattoos
- glowing seams
- universal moon rim
- desaturated or lightened brown/dark skin

Night means controlled value hierarchy, local practical sources, readable silhouette separation, source-backed reflections, and believable loss of information away from the source.

## Required source hierarchy
1. Professional Master Standard
2. Living Visual Profile
3. Appearance / geometry authority
4. All Character Garment Production Master
5. World Material Translation Master
6. Core5 dedicated color / geometry / garment authority when applicable
7. this rendering Master
8. generation prompt
9. generated image

Rendering cannot override a higher authority.

## Emitted vs reflected light
### Emitted
Only an object or phenomenon explicitly capable of producing light may emit it. The glow radius must remain local and the source must remain visible or mechanically understandable.

### Reflected
Metal, eyes, skin, hair, fabric, paper, glass, shell and painted surfaces may reflect light according to their material. Reflection is not emission.

## Character readability
- face planes remain readable without beauty-light normalization
- established eye size/shape is not enlarged for darkness
- skin tone remains stable across assets
- older skin does not become smooth because of soft lighting
- plus-size/soft bodies are not sculpted thinner by dramatic shadow
- disability/mobility equipment remains structurally legible
- child proportions remain child proportions
- feminine presentation does not trigger glamour lighting
- gender-undisclosed characters are not lit to force a gender read
- non-human characters retain species-specific surface/body structure

## Material response
Use the loaded garment/material profile. Soft matte cloth should not become glossy. Worn metal should not become gold. Paper/record surfaces should catch local light softly, not glow. Repairs should remain visible only where actual relief/material difference would catch light.

## Background interaction
For transparent character references, do not bake a scenic background. Use restrained neutral/world-credible illumination sufficient to inspect design.

For scene/cutin assets:
- background value separation may support silhouette readability
- background light cannot invent new character-side glow sources
- atmospheric particles cannot replace construction detail
- fog, bloom and bokeh cannot hide weak anatomy or clothing logic
- the environment may cast light/color onto the character, but may not recolor canonical identity into a different palette

## Worldbuilding rule
Yoru no Shirube night is lived-in and navigable. Small practical light matters because darkness remains present. Do not erase night with full-body glow. Do not make every important character the brightest object in the scene.

## Core5 special rule
Core5 canonical theme/accent colors remain controlled by the Color Application Master. Accent or Star Beast color does not automatically become emitted light.

## Non-human special rule
- DOG/CAT: fur reflects local source; no magical eye glow unless explicitly sourced.
- ARTIFICIAL_PERSON: artificiality does not imply neon seams or robot glow.
- MAINTENANCE_ROBOT: indicator/tool light only if source-backed; shell/panel response follows material.

## Review tests
1. remove bloom: does the design still read?
2. remove rim light: does the silhouette still read?
3. convert to grayscale: does the body/clothing mass still separate?
4. remove accent/emitted light: does identity remain?
5. compare skin/age/body to neutral reference: unchanged?
6. identify every glow source: all justified?
7. identify every bright metal edge: material/function justified?
8. background removed: character construction still complete?

## Hard prohibitions
- generic blue-night filter
- universal cyan/violet rim
- unexplained bloom
- glowing eyes for mood
- glowing tattoo/seam/jewelry
- gold premium highlights
- porcelain-skin night normalization
- body-slimming shadow design
- face redesign through glamour lighting
- fog/particle masking of weak design
- background light inventing costume color
- Star Beast color used as free glow

## Downstream
`tools/asset-factory/scripts/export-generation-ready-character-asset-prompt.ts` must embed this Master and a resolved character light-response profile for every character before production image generation.
