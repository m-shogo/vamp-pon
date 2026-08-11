# ヨルノシルベ — Character Author DB Life Coverage Extension v1

Date: 2026-08-12  
Status: **CURRENT AUTHOR-DB COVERAGE EXTENSION / 13 DIMENSIONS / STATUS INHERITED / NO CANON FLATTENING**

Historical layers remain valid:

1. `docs/character-author-db-schema-and-coverage-v1.md` — original 9-dimension record
2. `docs/character-author-db-environment-coverage-extension-v1.md` — 10-dimension Environment/Sensory extension

This extension adds three author-side life dimensions:

- `competenceLearning`
- `communicationHabit`
- `everydayEconomy`

Current machine target becomes:

> **36 / 36 discoverable across all 13 dimensions**

## Current 13 dimensions

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
13. Physical Identity authority

## New source statuses

```txt
competenceLearning = AUTHOR_RESERVOIR_NON_CANON_NO_INTELLIGENCE_RANKING
communicationHabit = AUTHOR_RESERVOIR_NON_CANON_ERA_TECH_AWARE_NO_AFFECTION_SCORING
everydayEconomy = AUTHOR_RESERVOIR_NON_CANON_NO_INCOME_CLASS_FREEZE
```

Indexing never promotes these values to Canon.

## Status rules remain unchanged

- Current != Candidate
- Candidate != Canon
- Open != false
- Reservoir != runtime
- Future15 != Current21
- rich profile data != S1 roster promotion
- stable ID alias != rename migration

Aliases remain navigation only:

- `yuubi` ↔ `yubi`
- `kaname` ↔ `kage1`
- `kasumi` ↔ `kage2`
- `toki` ↔ `kage3`
- `tsumugi` ↔ `kage4`

## Competence boundary

Author DB may expose learning/failure/help/teaching material, but:

```txt
competence != intelligence
competence != runtime stat
learning habit != diagnosis
body/age/gender/origin != competence
```

## Communication boundary

Author DB may expose initiation/reply/channel/correction/home-register material, but:

```txt
reply delay != affection
channel choice != morality
historical character != modern app by default
artificial body != instant reply
animal communication != Human language
```

Exact device/app remains Era-research dependent.

## Everyday Economy boundary

Author DB may expose purchase/share/borrow/gift/value material, but:

```txt
money habit != morality
frugality != poverty
spending != social class
accessibility cost != disabled-person burden
maintenance/resource cost != artificial-person worth
animal care cost != ownership right
```

Exact income, class, historical price, payment method, Future economy and runtime currency remain Open.

## Future profile app

A Character page can now render separate author-side sections:

```txt
Life / Ordinary
Relationships
Behavior
Objects / Wardrobe / Room
Places
Environment
Learning / Failure / Help
Communication
Everyday Economy
Visual identity
```

Each field must retain:

- source authority/status
- spoiler level where relevant
- author-only vs player-facing state
- production readiness
- stable source link

Do not flatten these into personality-score booleans.

## Machine expectation

```txt
characters = 36
coverageDimensions = 13
fullyCovered = 36
competenceLearning = 36
communicationHabit = 36
everydayEconomy = 36
Future15 promoted = false
Candidate promoted = false
runtimeAutoPromotionAllowed = false
```

Guiding principle:

> **情報を増やすほど、Characterを一つの性格ラベルへ圧縮しない。**
