# All Character Surface / Tone-Mapping Fidelity Master v1

Status: CURRENT_PRODUCTION_VISUAL_AUTHORITY
Scope: all 36 characters and all 9 production asset kinds.

## Purpose

Preserve the material identity of skin, hair, fur, shell, cloth, leather, paper, wood, metal, glass, tools and mobility equipment through rendering, grading and tone mapping. Premium polish must not collapse every surface into the same smooth, bright, glossy visual language.

## Authority boundary

This Master is subordinate to Living Visual, identity, color, world-material, garment, environment/weather, aging/maintenance, focus/effects and existing species/body authorities.

`OPEN` does not let the image model invent freckles, scars, pores, tattoos, beauty marks, fur patterns, shell scratches, metallic ornament or skin lightening. Unknown surface detail defaults to conservative material-appropriate rendering.

All generated microtexture and grading decisions remain `CANDIDATE_REVIEW_REQUIRED`.

## Surface invariants

1. skin-tone continuity
2. age-surface continuity
3. body-volume shading continuity
4. face-plane shading continuity
5. hair-material continuity
6. fur-material continuity
7. non-human shell continuity
8. cloth-fiber restraint
9. leather response restraint
10. paper response restraint
11. wood response restraint
12. metal roughness/specularity distinction
13. glass/translucency causality
14. tool-use surface continuity
15. mobility-equipment material continuity
16. wet-vs-dry state causality
17. wear/repair continuity
18. palette/tone-mapping continuity
19. highlight restraint
20. shadow-color restraint
21. small-scale material simplification without identity loss
22. cross-asset surface continuity

## Human skin rules

- preserve established skin tone under all lighting and grading
- preserve age cues without caricature or beauty smoothing
- preserve broad/soft body form through shading rather than slimming highlights
- do not add freckles, moles, scars, tattoos, pores-as-detail or makeup unless authorized
- do not use porcelain-skin rendering as the default quality upgrade
- do not use oily/glassy skin as generic cinematic polish

## Non-human rules

- dog/cat fur remains fur, not airbrushed human skin with animal features
- robot/artificial shells remain designed hard surfaces, not skin-like soft shading
- shell seams, panels and manipulators stay functional and do not become decorative armor filigree
- scratches, chips and grime follow maintenance authority and cannot be invented for personality

## Material distinction

Cloth, leather, paper, wood and metal must respond differently to light according to their established stiffness, roughness, wear and environment state. A single universal glossy shader is forbidden.

## Tone-mapping rules

Tone mapping may compress dynamic range but may not:
- lighten dark skin to preserve face readability
- whiten pale skin into emissive porcelain
- erase age texture
- deepen shadows until body/category information disappears
- push every accent toward neon saturation
- turn warm light into gold-costume language
- turn cool night light into blue skin
- flatten material roughness differences

## Forbidden shortcuts

- universal porcelain skin
- universal beauty smoothing
- universal glossy lips
- invented blush for femininity/cuteness
- invented freckles for naturalness
- invented scars for grit
- invented tattoos for edge
- invented beauty marks
- skin lightening for readability
- dark-skin desaturation in night scenes
- pale-skin emission
- age de-aging through smoothing
- plus-size body slimming through highlight placement
- child skin rendered as adult glamour skin
- disability-linked wear or pallor shorthand
- fur rendered as plastic
- fur rendered as human hair sheets
- robot shell rendered as wet skin
- robot shell receives random chrome premium upgrade
- metal becomes mirror by default
- leather becomes black glossy fantasy leather by default
- paper becomes translucent magical vellum without authority
- cloth becomes satin because asset is premium
- all fabrics receive identical specular response
- all materials share identical roughness
- wet state becomes permanent gloss
- rain creates sexualized wet-clothes gloss
- grime becomes personality shorthand
- scratches multiply at higher resolution
- sharpening invents pores/scars/fiber noise
- film grain hides weak surface separation
- bloom replaces highlight structure
- color grading replaces exact palette
- teal-orange grading as automatic cinematic default
- warm grade turns hardware gold
- cool grade turns skin blue
- black point crush hides garment/material boundaries
- highlight rolloff erases light skin facial planes
- generated microtexture repeats and becomes canon

## Unknown-surface default

Use `MATERIAL_APPROPRIATE_NEUTRAL_SURFACE`:
- preserve source-backed skin/fur/shell/material identity
- moderate roughness and highlights
- no invented microtexture identity marks
- no beauty smoothing or premium gloss
- simplify texture before changing material class
- stronger stylized treatments remain candidate-only for human review

## Production rule

Production candidate generation must load this Master. Surface polish and tone mapping are downstream rendering decisions. Generated freckles, scars, scratches, gloss language, grain, pores, fur pattern changes, shell wear or grading habits remain `CANDIDATE_REVIEW_REQUIRED` and never create canon by themselves.
