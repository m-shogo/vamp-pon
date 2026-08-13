# All Character Garment Production Master v1

## Status
CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION

## Purpose
Apply garment-production discipline to all 36 Yoru no Shirube characters, not only Core5, while preserving source provenance. This Master does not create new story canon and does not promote AUTHOR_CANDIDATE details into USER_DECIDED canon.

## Source of truth
Every production garment profile must be resolved from the character's existing Living Visual Profile. Core5 additionally uses `core5-garment-construction-master-v1` as the stronger dedicated override.

### Current21 Core5
`data/visual/core5-living-visual-profiles-v1.json`

### Current21 extended
`data/visual/current21-extended-living-visual-profiles-v1.json`

### Future15
`data/visual/future15-living-visual-profiles-v1.json`

## Production principle
Character Life Rule → Wearable Construction → World Material Consequence → Rendering.

A garment is not production-ready because it looks attractive. It is production-ready only when the prompt carries the character's actual movement needs, exposure boundaries, fit/silhouette preference, material preference, storage habits, footwear, wearing habits, maintenance behavior, absoluteNever and positivePreference.

## Required resolved fields for every character
1. source profile path and source status
2. species when present
3. body comfort / body presentation intent
4. exposure boundaries
5. body modification boundaries
6. silhouette / fit
7. material likes and avoids
8. pattern tolerance
9. footwear
10. storage / pocket behavior
11. wear habits / fastener behavior
12. maintenance / repair behavior
13. social presentation
14. absoluteNever
15. positivePreference
16. world-material translation rules

## Conservative derivation rule
For non-Core5 characters the production garment profile is a **source-preserving projection** of the Living Visual Profile. It does not invent missing buckle types, exact fiber blends, seam counts, pocket numbers, heel heights, repair locations, jewelry quantities, exposure, or decorative motifs.

If a required detail is absent, production rendering must either remain visually conservative and non-committal or be marked exploratory-only. OPEN is never image-model freedom.

## Core5 override rule
Core5 keeps the dedicated `core5-garment-construction-master-v1` profile. The all-character resolver still carries Living Visual source fields, but the Core5 dedicated construction profile controls material physics, closures, storage, footwear, wear, repair and prop interference where present.

## Worldbuilding rule
Yoru no Shirube is expressed through consequence: seams, folds, closures, storage, object access, edge treatment, local light response, wear and repair. Do not convert the world into universal star jewelry, floating paper, ink tattoos, gold trim, glowing seams, decorative lanterns, decorative compasses, random patchwork, belts, straps or pouches.

## Non-human rule
Dogs, cats, artificial persons and maintenance robots must not be forced through a human clothing template. Their Living Visual Profile remains authoritative. Garment fields become body equipment / surface construction / carried equipment only when supported by that character profile.

## Representation rule
Age, body size, disability, skin tone, gender presentation, sexuality, artificiality and species are not costume generators. Do not use them to invent cultural ornament, fetishized exposure, comedy wear, gender-normalizing clothes or genre shorthand.

## Image generation gate
Production-ready generation requires:
- one of the three 36-character Living Visual sources loaded
- exact character profile found
- source status preserved
- exposure and body-modification boundaries loaded
- movement / body comfort loaded
- material and fit data loaded when present
- footwear and storage loaded when present
- maintenance / wear behavior loaded
- absoluteNever and positivePreference loaded
- World Material Translation Master loaded
- Core5 dedicated garment override loaded when character is Core5
- no unresolved detail delegated to the image model

## Hard prohibitions
- same generic fantasy garment base for the cast
- empty belts / pouches / straps
- decorative hardware without function
- exposure added for visual interest
- random piercing / tattoo / jewelry
- premium gold / gemstone escalation
- generic adventurer / aristocrat / mechanic / mage / child / disabled-person costume shorthand
- human garment assumptions imposed on non-human characters
- generated details becoming canon automatically

## Downstream
`tools/asset-factory/scripts/export-generation-ready-character-asset-prompt.ts` must embed the resolved all-character garment profile into every generation-ready character prompt. Core5 additionally embeds the dedicated garment construction profile.
