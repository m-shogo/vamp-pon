# All Character Life-Choice Author Review Queue v1

Status: `DERIVED_AUTHOR_REVIEW_QUEUE_NON_CANON`

This queue converts the merged 36-character gap audit into actionable design-review order without authoring missing values.

## Priority

- **P0 — 10 items:** Core5 `bodyAdornment` and `skinCoverage`. Identity/exposure decisions first.
- **P1 — 10 items:** Core5 `personalGrooming` and `footwearGroundInterface`.
- **P2 — 10 items:** Core5 `accessoryPropInventory` and `materialWearMaintenance`.
- **P3_CURRENT_ROSTER_PROFILE_EXPANSION:** 16 current-roster characters / 96 unresolved domain decisions.
- **P4_FUTURE_ROSTER_PROFILE_EXPANSION:** 15 future-roster characters / 90 unresolved domain decisions.

Core5 review characters: `yui`, `asa`, `nagi`, `michiru`, `tomori`.

The 30 explicit review items are the Cartesian product of those five characters and the six audited domains, with priority determined by the machine-readable `domainPriority` map.

## Why the remaining 186 decisions are grouped

The remaining 31 characters currently lack the dedicated life-choice fields for all six audited domains. Treating those 186 missing-field decisions as equal individual P0/P1/P2 review items would bury the source-backed Core5 work and encourage invention.

They therefore remain two profile-expansion backlogs:

1. `P3_CURRENT_ROSTER_PROFILE_EXPANSION` — add character-specific evidence for the 16 current-roster extensions first.
2. `P4_FUTURE_ROSTER_PROFILE_EXPANSION` — then add the same evidence coverage for the 15 future-roster characters.

A profile-expansion backlog item is not permission to fill blanks from stereotypes, generic production policy, role, age, gender, rarity, or generated images.

## Review boundary

Every review item keeps:

- `requiresHumanDecision = true`
- `canonPromotionBlocked = true`
- `imageModelFreedom = false`
- `candidateGenerationPolicy = MAY_USE_DOMAIN_UNRESOLVED_DEFAULT_ONLY`
- `generatedImageMayCloseItem = false`

A Core5 domain closes only through explicit source/author review into either `SOURCE_BACKED_LOCKED` or `SOURCE_BACKED_ABSENCE`.

## P0 handling notes

P0 does not mean “invent the most interesting option.” It means resolve existing character-specific candidate evidence before lower-risk visual detail.

In particular:

- piercing/tattoo/jewelry remain source-constrained; no unspecified additions;
- an `OPEN_AUTHOR_DECISION` stays open until reviewed;
- coverage decisions preserve the character’s existing lived-choice logic and cannot be sexualized for premium/readability;
- generated art cannot be used as evidence that an option is now Canon.

## Staleness

The queue stores the SHA-256 of the source audit. Its checker re-expands the compact queue through the deterministic generator and fails if the audit, Core5 set, priority map, counts, or profile-expansion backlogs drift.
