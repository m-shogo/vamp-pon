# All Character Life-Choice Visual Gap Audit v1

Status: `DERIVED_REVIEW_ARTIFACT_NON_CANON`

Scope: **36 characters × 6 domains = 216 visual-life decisions**.

This artifact is a deterministic review index derived only from character-specific living visual profiles. It does not author new character facts, does not promote `AUTHOR_CANDIDATE`, and never grants image-model freedom.

## Current result

- `SOURCE_BACKED_LOCKED`: **0**
- `SOURCE_BACKED_ABSENCE`: **0**
- `SOURCE_CONSTRAINED_UNRESOLVED`: **186**
- `AUTHOR_CANDIDATE_REVIEW_REQUIRED`: **30**
- total requiring human/author review: **216**

### Important interpretation

`SOURCE_BACKED_LOCKED = 0` does **not** mean there are no source-backed details.

Classification is performed at the six-domain level. A domain remains `AUTHOR_CANDIDATE_REVIEW_REQUIRED` whenever any governed field inside that domain is still `AUTHOR_CANDIDATE` or explicitly open, even if another field in the same domain is already `APPEARANCE_SOURCE`, `CURRENT_CANON`, or otherwise source-backed.

For example, a source-backed piercing possibility does not make the whole body-adornment domain locked while tattoo/jewelry choices remain author candidates. This fail-closed behavior prevents partial evidence from silently Canonizing the unresolved remainder.

Missing fields are always `SOURCE_CONSTRAINED_UNRESOLVED`; they are never interpreted as absence.

## Six audited domains

1. `bodyAdornment` — piercing / tattoo / jewelry
2. `skinCoverage` — exposure and coverage boundaries
3. `personalGrooming` — makeup / nails / grooming behavior
4. `accessoryPropInventory` — storage and acquisition behavior
5. `footwearGroundInterface` — footwear / barefoot / foot-ground interface
6. `materialWearMaintenance` — material preference / maintenance / wear habits

## Core5 — 30 author-candidate review decisions

The Core5 profiles contain character-specific fields for all six domains, but each current domain contains at least one `AUTHOR_CANDIDATE` or open author decision. Therefore all 30 decisions remain review-required:

- ユイ / `yui`
- アサ / `asa`
- ナギ / `nagi`
- ミチル / `michiru`
- トモリ / `tomori`

For each of these five characters:

- `bodyAdornment`: `AUTHOR_CANDIDATE_REVIEW_REQUIRED`
- `skinCoverage`: `AUTHOR_CANDIDATE_REVIEW_REQUIRED`
- `personalGrooming`: `AUTHOR_CANDIDATE_REVIEW_REQUIRED`
- `accessoryPropInventory`: `AUTHOR_CANDIDATE_REVIEW_REQUIRED`
- `footwearGroundInterface`: `AUTHOR_CANDIDATE_REVIEW_REQUIRED`
- `materialWearMaintenance`: `AUTHOR_CANDIDATE_REVIEW_REQUIRED`

The machine artifact retains the exact character/profile evidence selectors used to derive these decisions. Raw candidate values remain in the living visual profile and are not duplicated here.

## Current roster extension — 96 unresolved decisions

The following 16 characters currently lack the six dedicated life-choice fields in `current21-extended-living-visual-profiles-v1.json`. All six domains therefore remain `SOURCE_CONSTRAINED_UNRESOLVED` with no character-specific evidence path for these selectors:

`sen`, `ritsu`, `koyori`, `gen`, `hana`, `yubi`, `madoka`, `shiro`, `tobari`, `nemu`, `kuroori`, `kage1`, `kage2`, `kage3`, `kage4`, `ren`.

This is a **profile-coverage gap**, not permission to invent design values.

## Future roster — 90 unresolved decisions

The following 15 characters currently lack the six dedicated life-choice fields in `future15-living-visual-profiles-v1.json`. All six domains therefore remain `SOURCE_CONSTRAINED_UNRESOLVED`:

`hiyori`, `serika`, `chloe`, `renji`, `touma`, `kuu`, `yomo`, `noa`, `rum`, `maki`, `suzu`, `io`, `kai`, `nao`, `amane`.

This is likewise a profile-coverage gap, not image-model freedom.

## Safety boundary

For every unresolved or author-candidate decision:

- `requiresHumanDecision = true`
- `canonPromotionBlocked = true`
- `imageModelFreedom = false`
- unresolved generation may use only `SOURCE_CONSTRAINED_DOMAIN_DEFAULT_ONLY`
- a generated image may not resolve the gap
- repetition across generated candidates does not create Canon
- generic fidelity policy paths cannot substitute for character-specific evidence

## Staleness contract

The materialized JSON records SHA-256 hashes for all three source profile files. The checker re-runs the deterministic generator and verifies:

- the three source hashes;
- the exact 216-decision state summary;
- the exact Core5 author-candidate set and evidence selectors;
- the exact current/future unresolved character groups;
- that grouped unresolved domains still have zero character-specific selector evidence;
- all fail-closed safety flags.

If a living visual profile adds or changes one of these life-choice fields without refreshing this audit, CI must fail.

## Canon boundary

This document and its JSON are review tooling only. They are not a Character Master, not a Canon promotion record, and not approval for image generation to choose missing values.
