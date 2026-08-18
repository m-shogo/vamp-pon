# Life-Choice Species / Body-Type Schema Adapter v1

Status: `DERIVED_NON_CANON_REQUIRES_HUMAN_SCHEMA_REVIEW`

This adapter covers only the nine Future15 decisions whose source values are explicitly marked `NOT_APPLICABLE` under the current human-oriented six-domain schema.

## Scope

- クウ / DOG: `skinCoverage`, `personalGrooming`, `accessoryPropInventory`
- ヨモ / CAT: `skinCoverage`, `personalGrooming`, `accessoryPropInventory`
- ルム / MAINTENANCE_ROBOT: `bodyAdornment`, `skinCoverage`, `personalGrooming`

The upstream Future15 intake remains 90 decisions. The source profile and intake are not rewritten by this adapter.

## Rule

`NOT_APPLICABLE` is not missing content. It means the current human axis does not describe that body type.

The adapter therefore maps the read surface without inventing a new character fact:

| Body type | Human-oriented domain boundary | Adapter axis |
| --- | --- | --- |
| DOG / CAT | skin exposure / modesty | coat and body boundary |
| DOG / CAT | makeup / human grooming | coat and claw care |
| DOG / CAT | pocket / carried storage | body attachment and carry context |
| MAINTENANCE_ROBOT | piercing / tattoo | shell marking and attachment topology |
| MAINTENANCE_ROBOT | skin exposure | shell, panel, and service boundary |
| MAINTENANCE_ROBOT | makeup / nail care | surface and service care |

Every mapped decision preserves the original marker and records the exact source evidence paths it may read. The mapping may not turn a source candidate into Canon.

## Hard prohibitions

- Do not apply a human fallback to an animal or robot.
- Do not infer clothing, shoes, makeup, jewelry, modesty, or storage from a generic character-design policy.
- Do not anthropomorphize クウ or ヨモ, and do not convert either into a Star Beast or fantasy familiar.
- Do not convert ルム into a humanoid luxury mecha, decorative sci-fi armor, or glowing-circuit design.
- Do not treat a generated image as evidence that closes the schema decision.
- Do not promote any mapped value without Human schema review.

## Deterministic contract

`scripts/quality/check-life-choice-species-schema-adapter.ts` reconstructs the complete adapter from:

- `data/visual/future15-living-visual-profiles-v1.json`
- `data/visual/future15-life-choice-profile-migration-intake-v1.json`

It fails if:

- the Future15 total is no longer 90;
- the upstream adapter count is no longer nine;
- membership differs from クウ3 / ヨモ3 / ルム3;
- a configured source marker no longer contains `NOT_APPLICABLE`;
- a human or unsupported species enters the adapter;
- a source hash or materialized output becomes stale;
- the adapter would imply Canon or image approval.

## Review boundary

Current next action: `HUMAN_SCHEMA_REVIEW_ONLY_NO_CANON_OR_IMAGE_PROMOTION`.

Human review may accept, revise, or hold the schema mapping. It must not use this adapter alone to approve a character fact, Master image, final asset, or runtime promotion.
