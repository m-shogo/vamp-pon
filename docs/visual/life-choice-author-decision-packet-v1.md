# Life-Choice Author Decision Packet v1

Status: `AUTHOR_DECISION_PACKET_NON_CANON_PENDING_HUMAN_ACTION`

This packet is the unified Human author surface for the 42 decisions that automation may not close.

## Scope

- Core5 review contracts: 30 decisions
- Current16 OPEN domains: 2 decisions
- Future15 OPEN domains: 10 decisions
- Total: 42 decisions

The packet indexes existing contract evidence and OPEN source markers. It does not write answers or alternatives.

## Decision types

Core5 decisions already have candidate content in the P0/P1/P2 review contracts. Human outcomes are:

- `ACCEPT_CANDIDATE_FOR_SCHEMA_REVIEW`
- `REVISE_CANDIDATE`
- `HOLD`

Current16/Future15 OPEN decisions require explicit author content. Human outcomes are:

- `AUTHOR_SUPPLIES_DECISION`
- `KEEP_OPEN`
- `HOLD`

Acceptance at this layer does not itself promote Canon. Canon promotion remains a later explicit authority action.

## Current distribution

| Domain | Decisions |
| --- | ---: |
| Body Adornment | 16 |
| Skin Coverage | 5 |
| Personal Grooming | 6 |
| Footwear / Ground Interface | 5 |
| Accessory / Prop Inventory | 5 |
| Material / Wear / Maintenance | 5 |
| Total | 42 |

## Complete 216-decision partition

```txt
A0 Author content review       42
B1 Schema migration ready     109
C2 Partial evidence review     56
D0 Species schema adapter       9
---------------------------------
Total                          216
```

The checker rejects overlap between A0 and the B1/C2/D0 artifacts.

## Hard boundary

- OPEN remains OPEN until explicit Human author action.
- The packet does not generate candidate answers.
- The packet does not infer piercing, tattoo, makeup, jewelry, exposure, grooming, accessories, ownership, relationship meaning, or cultural meaning.
- Existing Core5 contract evidence is referenced by selector and hash, not promoted.
- Generated images are not evidence and cannot close a decision.
- Human acceptance in this packet is schema-review input, not automatic Canon or final/runtime approval.

## Deterministic validation

`scripts/quality/build-life-choice-author-decision-packet-v1.ts` checks:

- Core5 P0/P1/P2 contracts remain 10 decisions each and share the current Core5 source hash;
- Current16 OPEN remains 2 and Future15 OPEN remains 10;
- every OPEN source marker still contains an OPEN value;
- A0 remains 42 with the expected six-domain distribution;
- B1=109, C2=56, D0=9 and the full partition remains 216;
- no A0 decision overlaps B1, C2, or D0;
- all source and evidence hashes remain fresh;
- the materialized packet is an exact reconstruction.

Current next action: `HUMAN_AUTHOR_ACTION_REQUIRED_NO_AUTOMATIC_CANON_OR_IMAGE_PROMOTION`.
