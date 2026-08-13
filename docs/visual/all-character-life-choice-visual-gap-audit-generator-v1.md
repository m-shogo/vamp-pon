# All Character Life-Choice Visual Gap Audit Generator v1

Status: `DERIVED_REVIEW_TOOLING_NON_CANON`

## Purpose

This generator moves character design work away from endlessly adding abstract visual guards and back to the actual 36 living visual profiles.

It derives a six-domain review audit from character-specific profile evidence only:

1. body adornment / piercing / tattoo / jewelry
2. skin coverage / exposure boundaries
3. personal grooming / cosmetics / nails / grooming behavior
4. accessory / prop storage and acquisition behavior
5. footwear / barefoot / ground interface
6. material / wear / maintenance behavior

## State vocabulary

- `SOURCE_BACKED_LOCKED`
- `SOURCE_BACKED_ABSENCE`
- `SOURCE_CONSTRAINED_UNRESOLVED`
- `AUTHOR_CANDIDATE_REVIEW_REQUIRED`

`AUTHOR_CANDIDATE` and `OPEN_AUTHOR_DECISION` always remain human-review items. Missing evidence is `SOURCE_CONSTRAINED_UNRESOLVED`, never absence.

## Evidence boundary

Only these character-specific profile files are read:

- `data/visual/core5-living-visual-profiles-v1.json`
- `data/visual/current21-extended-living-visual-profiles-v1.json`
- `data/visual/future15-living-visual-profiles-v1.json`

Generic fidelity policies, prompt wrappers and generated images are excluded from evidence by construction.

## Canon boundary

The audit is a derived review artifact. It does not author new character facts, does not promote `AUTHOR_CANDIDATE`, and never grants image-model freedom. Generated output remains candidate-only until explicit human/author review.

## Materialization flow

The first CI pass runs the generator with `--emit` and exposes the deterministic JSON/Markdown result. That result is then committed as the review artifact together with a staleness checker before the replacement PR can merge.
