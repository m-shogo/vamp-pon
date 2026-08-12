# Lorebook Relationship Source-Aware UI v1

Status: **IMPLEMENTED CANDIDATE / EXISTING 24 RELATION LANES REUSED / NO AFFECTION GRAPH**

## Goal

既存 `/lorebook/` の人間関係図を、線の見た目から感情値を推測する画面ではなく、**どのSourceを読めば二人の関係を深掘りできるか**が分かる作者用navigation graphへ寄せる。

## Existing data reused

No new relationship inventory is created for the Web.

The UI continues to read:

- `public/lorebook/data/world-bible.v1.json`
- `public/lorebook/data/relationship-arcs.v1.json`

Upstream authoring read-model:

- `src/game/data/characterRelationshipGraphReadModel.ts`
- `src/game/data/currentRelationshipInventory.ts`

## UI changes

The relationship chapter adds:

- a Source-Aware Graph reading guide
- explicit statement that an edge is a navigable relationship lane, not an affection score
- explicit missing-edge warning
- per-list status + ARC/LANE chip
- per-detail provenance panel
- primary source pointer to `docs/RELATIONSHIPS.md`
- ARC availability indicator

## Edge semantics

An edge means:

**There is a source-backed Current relationship lane worth navigating.**

It does not automatically mean:

- romance
- blood relation
- best friend
- high affection
- high trust
- positive relation
- permanent party pairing
- exact incident
- Main Mystery involvement

A missing edge does not mean there is no relationship.

## Visual semantics

The UI explicitly warns against treating:

- line thickness as affection
- line color as romance/hate/morality
- node size as importance
- visual proximity as Canon intimacy

Filters may use source-owned status/type metadata. They are navigation tools, not emotion scores.

## Status boundary

`CANON` and `CANDIDATE` labels remain visible where the existing Lorebook data owns them.

The Web must not convert Candidate to Canon merely because a five-step arc exists. Likewise, an absent detailed arc does not mean the relation is weak; it means the detailed arc layer is not currently available.

## Future15 boundary

v1 remains Current relationship coverage. The UI must not generate Future15 lines from profile similarity, sexuality, theme color, origin, season, or other shared traits.

## Runtime boundary

- no affinity stat
- no romance system
- no party AI
- no relationship gameplay effect
- no automatic Canon promotion

## Authoring principle

**人間関係図の線は「二人がどれだけ好き合っているか」ではなく、「二人について次にどのSourceを読むか」を示す。**
