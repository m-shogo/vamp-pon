# Life-Choice Partial Evidence Review v1

Status: `DERIVED_PARTIAL_EVIDENCE_REVIEW_PACKET_NON_CANON`

This packet isolates the 56 Current16/Future15 decisions classified as `PARTIAL_MIGRATION_EVIDENCE_AUTHOR_REVIEW`.

## Scope

- Current16: 31 decisions
- Future15: 25 decisions
- Personal Grooming: 27 decisions
- Accessory / Prop Inventory: 29 decisions
- Total: 56 decisions

Existing character-specific evidence is preserved by source selector and evidence hash. The packet does not guess the exact missing answer.

## Authority-defined review dimensions

Personal Grooming follows production entrypoint v8:

- cosmetics state;
- nail treatment state;
- facial-hair and body-hair state;
- hair wear and grooming state;
- grooming routine;
- personal meaning.

Accessory / Prop Inventory follows production entrypoint v6:

- discrete removable object identity;
- ownership;
- state and location transitions;
- storage route;
- temporary placement;
- gift meaning;
- relationship meaning.

These are review dimensions, not automatic character facts. Human review decides which dimension is already sufficiently supported, which needs an author decision, and which remains intentionally unresolved.

## Partition integrity

The Current16/Future15 186-decision space remains non-overlapping:

```txt
Schema migration ready       109
Partial evidence review       56
Species schema adapter         9
Open author decisions         12
-------------------------------
Total                         186
```

C2 may not overlap the B1 read model or D0 species adapter.

## Hard boundary

- Preserve the existing evidence before asking about missing semantics.
- Do not fill a missing answer from generic fidelity policy.
- Do not invent accessories, ownership, relationship meaning, cosmetics, nails, facial hair, body hair, or routine.
- Do not treat role, gender, age, ethnicity, rarity, exposure, or a generated image as evidence.
- Review does not promote Canon.
- All 56 decisions remain `PENDING_HUMAN_SCHEMA_REVIEW`.

## Deterministic validation

`scripts/quality/build-life-choice-partial-evidence-review-v1.ts` checks:

- source profile/intake hashes;
- audit and queue C2 totals;
- v6 → v7 → v8 → v9 authority lineage;
- v6/v8 generated-content Canon guards;
- Current16=31, Future15=25, grooming=27, inventory=29;
- 186-decision partition integrity;
- no overlap with B1 or D0;
- source evidence selectors and hashes;
- materialized JSON freshness.

Current next action: `HUMAN_REVIEW_ONLY_PRESERVE_EVIDENCE_NO_GENERIC_FILL_OR_IMAGE_PROMOTION`.
