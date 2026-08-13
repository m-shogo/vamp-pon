# Character Image Generation Readiness Master v1

Status: `TOP_LEVEL_IMAGE_GENERATION_GATE`

## Purpose

This is the last design-side gate before character image generation. It does not design the character. It verifies that the resolved production prompt has loaded the authorities needed to prevent the image model from becoming the missing designer.

Passing this gate means **ready for candidate image generation**, not canon approval.

## Readiness states

- `READY_FOR_CANDIDATE_GENERATION`: required authorities are present and unresolved optional details are explicitly constrained.
- `EXPLORATORY_ONLY`: a deliberate exploration is allowed, but the result cannot be treated as a production candidate or authority.
- `BLOCK`: a required design authority, profile, or anti-invention guard is missing or weakened.

## BLOCK conditions

Block generation when any of the following is missing or false:
- final character design production entrypoint
- Living Visual Profile
- exact Appearance Generation Contract resolution
- identity production Master
- garment production Master
- night/light rendering Master
- world material translation Master
- embodied acting production Master
- Core5 dedicated garment authority when the target is Core5
- no-invention guard for identity geometry
- no-invention guard for garment detail
- no-invention guard for light source
- no-invention guard for embodied detail
- rendering-may-redesign-character = false
- generated-pose-creates-canon = false
- candidate-appearance-detail-creates-canon = false

## Unknown / OPEN policy

`OPEN`, `OPEN_AUTHOR_DECISION`, candidate body modifications, optional marks, optional jewelry, unknown exact grip, unknown handedness, unknown pocket count, unknown repair location, and unknown lighting source do not grant model freedom.

An unresolved optional field can remain generation-ready only when the resolved prompt explicitly says what **must not be added**. If the missing field is necessary to draw the requested asset correctly and there is no safe omission, generation is `BLOCK` or `EXPLORATORY_ONLY`.

## Design freeze rules

Before candidate generation:
1. identity geometry is frozen to loaded source authority;
2. body/age/species/disability identity is frozen;
3. Living Visual boundaries are frozen;
4. exposure and body-modification additions are frozen to source policy;
5. clothing construction cannot be redesigned by rendering;
6. world motifs cannot create new accessories or garment concepts;
7. light cannot create new glowing body/garment features;
8. pose cannot normalize or redesign the body;
9. props require grip/body/storage/support relation or omission;
10. generated details do not become canon.

## Generic-gacha drift gate

Reject or regenerate when the image introduces unsupported:
- gold trim
- gemstones
- belts / harnesses / pouches
- floating cloth
- thigh cutouts or increased exposure
- glowing jewelry / tattoos / eyes / seams
- decorative asymmetry without use/history
- universal cyan/violet rim lighting
- same V-jaw / giant-eye attractive anime face base
- body slimming, de-aging, adultification, disability removal, or non-human humanoidization

## Detail density budget

High resolution is not permission to add concepts. Extra pixels may describe:
- existing seam construction
- existing material texture
- authored wear/repair
- already-authorized fasteners
- existing hair/fur/surface structure
- physically caused light response

Extra pixels may **not** add new jewelry, symbols, straps, pockets, body marks, exposure, magical effects, or costume layers.

## Candidate review rubric

After generation, classify every meaningful deviation as:
- `KEEP_SOURCE_FAITHFUL`
- `REMOVE_UNSUPPORTED`
- `REPLACE_WRONG_INTERPRETATION`
- `BAN_RECURRING_DRIFT`
- `AUTHOR_CANDIDATE_FOR_REVIEW`

Generated output remains `CANDIDATE_REVIEW_REQUIRED`. Human review is required before any promotion to an accepted design rule.
