# ヨルノシルベ — Character Author DB Environment Coverage Extension v1

Date: 2026-08-12  
Status: **CURRENT AUTHOR-DB COVERAGE EXTENSION / 10 DIMENSIONS / STATUS INHERITED / NO CANON FLATTENING**

Base schema:

- `docs/character-author-db-schema-and-coverage-v1.md`

New source:

- `docs/character-environment-sensory-reservoir-v1.md`
- `src/game/data/characterEnvironmentSensoryReservoir.ts`

## Why this is an extension

`character-author-db-schema-and-coverage-v1.md` correctly recorded the DB when it had 9 discoverability dimensions. That historical statement is not rewritten away.

After Environment / Sensory Reservoir landed, the **Current machine index becomes 10 dimensions**.

Current coverage dimensions:

1. Reality Root
2. Season Architecture
3. Ordinary Life
4. Social Chemistry
5. Behavior Identity
6. Lived Artifact
7. Theme Color
8. Living Place
9. Environment / Sensory
10. Physical Identity authority

Target:

> **36 / 36 discoverable across all 10 dimensions**

## Status inheritance

`environmentSensory` is:

`AUTHOR_RESERVOIR_NON_CANON_NO_DIAGNOSIS_INFERENCE`

It does not become Canon because it is indexed.

The Author DB must continue to preserve:

- Current vs Candidate
- Reservoir vs authority
- Open vs false
- Future15 vs Current21
- stable ID alias vs rename
- production reference vs runtime implementation

## Stable ID handling

Environment/Sensory uses existing stable profile IDs, including:

- `yubi`
- `kage1`
- `kage2`
- `kage3`
- `kage4`

The Author DB continues to expose navigation aliases:

- `yuubi` ↔ `yubi`
- `kaname` ↔ `kage1`
- `kasumi` ↔ `kage2`
- `toki` ↔ `kage3`
- `tsumugi` ↔ `kage4`

**Alias mapはrename migration命令ではない。**

## Environment/Sensory boundary

Indexing the field must not turn preference into diagnosis.

Forbidden inference:

```txt
quiet preference -> shy
crowd preference -> sociability
weather preference -> origin
sound sensitivity -> diagnosis
smell association -> supernatural truth detection
wheelchair accessibility -> personality
artificial sensor capability -> emotionless
```

For Current/Future roster logic:

- Future15 coverage does not promote roster.
- Candidate coverage does not promote Canon.
- `OPEN != false`.
- Runtime does not automatically consume Author DB Reservoirs.

## Authoring / Web implication

Future Character Book / Web DB should be able to render an Environment section such as:

```txt
Ambient sound
Light
Weather
Crowd
Temperature
Smell association
Texture / touch
Travel environment
Rest environment
```

Each visible field should also retain:

- source status
- source document
- spoiler level
- confidence / authority class when needed
- whether production-ready or author-only

Do not flatten it into a single `likesQuietPlaces: true` boolean.

## Current machine expectation

```txt
characters = 36
coverageDimensions = 10
fullyCovered = 36
Environment/Sensory coverage = 36
Future15 promoted = false
Candidate promoted = false
runtimeAutoPromotionAllowed = false
```

Guiding principle:

> **情報量が増えるほど、何が決定で何が素材かを見失わないDBにする。**
