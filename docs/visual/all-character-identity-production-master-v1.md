# All Character Identity Production Master v1

## Status
CURRENT_VISUAL_PRODUCTION_AUTHORITY_EXTENSION

## Purpose
Lock face, head, body and nearest-character distinction for all 36 characters before production image generation. This Master does not invent identity geometry: the canonical machine source is `src/game/data/characterAppearanceGenerationContracts.ts`.

## Core rule
**Identity geometry precedes rendering.** Hair color, costume color, prop, glow, pose, makeup, freckles, tattoos or accessories may not substitute for face/body distinction.

## Required source fields
For every character load the exact existing Appearance Generation Contract:
- roster scope
- species
- age coding
- face signature id
- intentional resemblance group
- face shape
- eye shape
- eyelid
- brow
- lashes
- nose
- mouth
- cheek/surface identity
- hair/head structure
- body shape
- body-modification list with candidate status preserved
- accessory language
- clothing construction
- resting expression
- nearest existing face
- difference from nearest
- forbidden drift

## Provenance
The Appearance Generation Contract is an existing design authority. Candidate marks or body modifications inside it remain candidates unless a stronger source explicitly promotes them. A generated image never promotes them.

## Human-like identity rule
Do not normalize the roster to one V-jaw / large-eye / small-nose / young-slim anime base. Age, cheek volume, jaw width, nose scale, eye aperture, brow density, lid structure, mouth width and body mass are identity-bearing geometry.

## Non-human identity rule
DOG, CAT, ARTIFICIAL_PERSON and MAINTENANCE_ROBOT use their source species/body/surface contract. Do not humanoid-normalize dogs/cats, animalize artificial persons, or turn a maintenance robot into a cute mascot unless explicitly sourced.

## Representation rule
Do not erase or stylize away source-backed age, plus-size/soft body, skin tone, disability equipment, feminine presentation, gender ambiguity or artificiality in order to make the image more conventionally attractive.

## Nearest-face test
Every human-like character with `nearestExistingFace` must remain recognizably different using the contract's `differenceFromNearest` even if:
- hair color is removed
- theme color is removed
- accessories are hidden
- glow is removed
- expression is neutral

## Candidate-detail rule
Beauty marks, scars, stubble, piercings, tattoos and other candidate surface/body modifications may not become mandatory recognition anchors unless a stronger authority says so. Core identity must survive without candidate-only detail.

## Rendering boundary
Rendering can change value, edge softness and local material response. It cannot change face anatomy, body proportions, age coding, species, jaw width, eye construction, nose/mouth geometry, hair/head mass or body shape.

## Production gate
A production character prompt must include the exact resolved Appearance Generation Contract. If no exact contract exists, production generation is blocked; there is no model-authored fallback for identity geometry.

## Hard prohibitions
- same attractive face base with hair/color swaps
- generic V jaw normalization
- giant eye normalization
- nose/mouth homogenization
- body-shape normalization
- de-aging
- plus-size slimming
- disability removal
- child adultification
- non-human humanoidization
- gender-guessing redesign
- candidate mark used as sole identity
- prop/accessory replacing face/body identity
- lighting hiding geometry differences

## Downstream
The final production prompt exporter must load `characterAppearanceGenerationContracts.ts`, require exactly one contract for the target character, embed it verbatim as structured JSON, and set `unknownIdentityGeometryMayBeInventedByImageModel: false`.
