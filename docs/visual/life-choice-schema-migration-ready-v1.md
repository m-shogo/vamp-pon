# Life-Choice Schema Migration Ready v1

Status: `DERIVED_NON_CANON_REQUIRES_HUMAN_SCHEMA_REVIEW`

This read model identifies the 109 life-choice decisions already backed by character-specific candidate evidence and makes their six-domain migration mechanically reviewable.

## Scope

- Current16: 63 decisions
- Future15: 46 decisions
- Total: 109 decisions

These are the `MIGRATION_READY_AUTHOR_CANDIDATE` decisions from the existing Current16 and Future15 intakes. OPEN decisions, partial-evidence decisions, and body-type `NOT_APPLICABLE` decisions are excluded.

## Storage rule

The read model does not copy source values. Each decision stores:

- the source profile and intake paths;
- the source file hashes;
- the exact evidence paths used by that domain;
- a hash of the referenced evidence values;
- a pending Human schema-review state.

The source profiles remain the evidence owner. This artifact is a deterministic index, not a replacement authority.

## Six-domain mapping

| Target domain | Referenced source evidence |
| --- | --- |
| `bodyAdornment` | piercing, tattoo, jewelry |
| `skinCoverage` | exposure |
| `personalGrooming` | makeup, nails, wear/grooming evidence, maintenance when present |
| `accessoryPropInventory` | storage and relevant wear habits |
| `footwearGroundInterface` | footwear / ground interface |
| `materialWearMaintenance` | materials, maintenance, wear habits |

Only domains classified exactly as `MIGRATION_READY_AUTHOR_CANDIDATE` enter this v1 read model.

## Safety boundary

- Migration does not promote a source value to Canon.
- Missing evidence may not be supplied by a generic visual-fidelity policy.
- An inherited Current16 value remains `AUTHOR_CANDIDATE`.
- A Future15 value remains candidate inventory.
- All 109 mappings remain `PENDING_HUMAN_SCHEMA_REVIEW`.
- Image generation cannot close or approve a mapping.

## Deterministic validation

`scripts/quality/build-life-choice-schema-migration-ready-v1.ts` fails on:

- source profile or intake hash drift;
- Current16 total other than 96;
- Future15 total other than 90;
- migration-aware audit or queue total other than 109;
- Current16 B1 count other than 63;
- Future15 B1 count other than 46;
- duplicate decision IDs;
- a selected domain without source evidence;
- stale materialized JSON.

Current next action: `HUMAN_SCHEMA_REVIEW_OF_109_MAPPINGS_NO_CANON_OR_IMAGE_PROMOTION`.
