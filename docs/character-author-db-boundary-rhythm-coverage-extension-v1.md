# Character Author DB — Boundary / Rhythm Coverage Extension v1

Status: **CURRENT AUTHOR-DB COVERAGE EXTENSION / 18 DIMENSIONS / STATUS INHERITED / NO CANON FLATTENING**

This document extends the Character Author DB coverage index from 15 to 18 dimensions without rewriting the historical 9 / 10 / 13 / 15-dimension records.

## Current 18 dimensions

1. Reality Root
2. Season Architecture
3. Ordinary Life
4. Social Chemistry
5. Behavior Identity
6. Lived Artifact
7. Theme Color
8. Living Place
9. Environment / Sensory
10. Competence / Learning
11. Communication Habit
12. Everyday Economy
13. Leisure / Play
14. Humor / Teasing
15. Decision / Commitment
16. Shared-space Etiquette
17. Rest / Daily Rhythm
18. Physical Identity authority

Target: **36 / 36 discoverable across all 18 dimensions**.

## Historical preservation

The following remain valid records of earlier coverage states:

- `docs/character-author-db-schema-and-coverage-v1.md` — 9 dimensions
- `docs/character-author-db-environment-coverage-extension-v1.md` — 10 dimensions
- `docs/character-author-db-life-coverage-extension-v1.md` — 13 dimensions
- `docs/character-author-db-experience-coverage-extension-v1.md` — 15 dimensions

This file records the later 18-dimension state. It does not retroactively rewrite those historical checkpoints.

## New source layers

### Decision / Commitment

Source: `src/game/data/characterDecisionCommitmentReservoir.ts`

Index status:

`AUTHOR_RESERVOIR_NON_CANON_NO_LOYALTY_MORALITY_SCORE`

Hard boundary:

- indecision != weakness
- decisiveness != leadership
- keeping a promise != morality score
- breaking/changing a promise != automatic betrayal
- deadline timing != affection
- no major Canon promise, romance commitment, betrayal event, legal obligation or runtime leadership value is promoted here

### Shared-space Etiquette

Source: `src/game/data/characterSharedSpaceEtiquetteReservoir.ts`

Index status:

`AUTHOR_RESERVOIR_NON_CANON_NO_DOMESTIC_GENDER_ROLE_NO_ACCESS_SIDE_SEAT`

Hard boundary:

- hosting != wealth/class
- domestic labor != gender
- guest etiquette != morality
- body size != space burden
- wheelchair != special side seat / parking spot
- artificial person != appliance/service staff
- animal != mascot host
- exact household, cohabitation, permanent seat and caregiver role remain Open

### Rest / Daily Rhythm

Source: `src/game/data/characterRestDailyRhythmReservoir.ts`

Index status:

`AUTHOR_RESERVOIR_NON_CANON_NO_DIAGNOSIS_NO_PRODUCTIVITY_WORTH_SCORE`

Hard boundary:

- rest need != weakness
- productivity != worth
- fatigue/sleep habit != diagnosis
- age/body/disability/gender/origin != stamina or rhythm
- artificial body != no-rest assumption
- exact bedtime, wake time, chronotype and runtime stamina remain Open

## No-flattening rules

These remain mandatory across all 18 dimensions:

- Current != Candidate != Author Reservoir != Open
- Future15 coverage does not promote a character to Current21
- richer profile coverage does not promote Canon
- missing optional data does not mean `false`
- stable profile IDs remain stable; aliases are navigation only
- runtime does not automatically consume or promote Author DB reservoir data
- representation constraints are not personality generators

Stable aliases remain:

- `yuubi` ↔ `yubi`
- `kaname` ↔ `kage1`
- `kasumi` ↔ `kage2`
- `toki` ↔ `kage3`
- `tsumugi` ↔ `kage4`

## Authoring principle

**Characterの境界は「何を拒むか」だけではなく、決め直す・一緒に過ごす・休む時に相手と自分をどう扱うかで見える。**

This extension is an authoring index. It is not a runtime stat sheet, morality score, relationship score, diagnosis table, household authority, or Canon promotion mechanism.
