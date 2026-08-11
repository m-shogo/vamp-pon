# ヨルノシルベ — Character Author DB Experience Coverage Extension v1

Date: 2026-08-12  
Status: **CURRENT AUTHOR-DB COVERAGE EXTENSION / 15 DIMENSIONS / STATUS INHERITED / NO CANON FLATTENING**

Historical coverage records remain intact:

1. `character-author-db-schema-and-coverage-v1.md` — 9 dimensions
2. `character-author-db-environment-coverage-extension-v1.md` — 10 dimensions
3. `character-author-db-life-coverage-extension-v1.md` — 13 dimensions

This extension adds:

- `leisurePlay`
- `humorTeasing`

Current target:

> **36 / 36 discoverable across all 15 dimensions**

## Current 15 dimensions

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
15. Physical Identity authority

## New source statuses

```txt
leisurePlay = AUTHOR_RESERVOIR_NON_CANON_ERA_TECH_AWARE_NO_HOBBY_STEREOTYPE
humorTeasing = AUTHOR_RESERVOIR_NON_CANON_NO_PROTECTED_TRAIT_PUNCHLINE_DEFAULT
```

## Leisure boundary

Indexing leisure must not produce:

```txt
hobby -> occupation
boredom -> laziness
competition -> aggression
age/gender/sexuality/origin -> pastime
wheelchair -> passive leisure
artificial body -> cannot play
animal play -> Human hobby
```

Exact media title/device/venue remains Era-research dependent.

## Humor boundary

Indexing humor must not produce:

```txt
teasing -> affection score
humor -> intelligence
body/age/dialect/origin -> default punchline
gender/sexuality/presentation -> default punchline
disability/access/pain -> default punchline
species/artificial-person status -> default punchline
```

A misfired joke remains repairable author material; the target never needs to laugh to prove closeness.

## Existing boundaries remain

- Current != Candidate
- Candidate != Canon
- Open != false
- Future15 != Current21
- data richness != roster promotion
- alias != migration
- Author DB != runtime

Stable aliases remain navigation only:

- `yuubi` ↔ `yubi`
- `kaname` ↔ `kage1`
- `kasumi` ↔ `kage2`
- `toki` ↔ `kage3`
- `tsumugi` ↔ `kage4`

## Future Character Book

The profile app can now expose:

- how the Character spends idle time
- how they play with others
- how they respond to boredom
- light competition style
- Era-appropriate leisure references
- celebration style
- joke entry
- teasing boundary
- self-deprecating humor
- when humor stops
- how a bad joke is repaired

Every field must retain source status and author/player-facing visibility.

## Machine expectation

```txt
characters = 36
coverageDimensions = 15
fullyCovered = 36
leisurePlay = 36
humorTeasing = 36
Future15 promoted = false
Candidate promoted = false
runtimeAutoPromotionAllowed = false
```

Guiding principle:

> **設定を増やすのは、Characterを説明し切るためではなく、事件がなくてもその人が動き続けるため。**
