# Character Profile Book Read Model v1

Status: **CURRENT AUTHORING READ MODEL / 36 CHARACTERS / 6 SECTIONS / 21 DIMENSIONS / NOT GAME RUNTIME**

## Purpose

ヨルノシルベのCharacter情報が増え続けても、作者が「どこを見ればいいか」を失わないための読み取り専用モデル。

これはゲーム画面ではない。将来の**別WebプロフィールBook / 攻略本風作者ツール**がStory正本・Reservoir・Authorityを複製せず読むための中間層である。

## Core rule

**Source of truth is not copied into the Profile Book.**

The read-model stores navigation, grouping, coverage and source status. It does not rewrite Reservoir contents into a new Canon document.

## Six reading sections

### 1. Identity & Authority

Dimensions:

- Reality Root
- Season Architecture
- Theme Color
- Physical Identity authority

Use for: roster layer, era/season placement, visual identity and authority context.

### 2. Ordinary Life

Dimensions:

- Ordinary Life
- Living Place
- Environment / Sensory
- Everyday Economy
- Leisure / Play
- Rest / Daily Rhythm

Use for: scenes where no major plot event is happening.

### 3. Social & Boundaries

Dimensions:

- Social Chemistry
- Decision / Commitment
- Shared-space Etiquette

Use for: interpersonal distance, promises, group life and boundaries without producing affection/morality scores.

### 4. Expression & Voice

Dimensions:

- Behavior Identity
- Communication Habit
- Humor / Teasing
- Address / Naming / Register
- Voice / Prosody

Use for: screenplay, dialogue direction and voice direction without freezing exact dialogue, pronouns, dialect, pitch or casting.

### 5. Learning & Memory

Dimensions:

- Competence / Learning
- Memory / Remembering

Use for: how the character learns, fails, asks, remembers, forgets and handles conflicting recollections without intelligence/truth ranking.

### 6. Material Trace

Dimensions:

- Lived Artifact

Use for: objects and traces that make the person visible in a scene without turning possessions into biography truth.

## Coverage contract

The model requires:

- 36 characters
- 21 Current Author DB dimensions
- 6 reading sections
- each dimension assigned to exactly one section
- 36 / 36 fully covered across all 21 dimensions
- 21 Current21? **No** — roster distinction remains 21 Current21 + 15 Future15
- stable profile aliases remain visible
- source status remains visible per dimension

## Route identity

Profile routes use `authorId`, not stable-profile aliases.

Examples:

- `/characters/kaname` is the author-facing route identity.
- `stableProfileId = kage1` remains visible for data lookup/provenance.
- `/characters/kage1` is not automatically made the primary profile route.

This prevents data migration aliases from leaking into in-world/person-facing identity.

## Status display

A future Web UI should never visually flatten these into one badge:

- Current
- Candidate
- Author Reservoir
- Future15
- Open / Unknown
- Current World Master subdomain

`sourceStatus` is part of the read-model specifically so the UI can show where a statement came from and how authoritative it is.

## Spoiler boundary

v1 is **author-facing only**.

A public/spoiler-safe projection is intentionally **not defined** yet. Do not hide fields ad hoc in the UI and call the result spoiler-safe. A later explicit spoiler policy should decide:

- public-safe facts
- route/season spoilers
- relationship spoilers
- Main Mystery visibility
- Kokuuyou / Star Beast / ending boundaries
- Future15 visibility

Until then, this model is not a public encyclopedia contract.

## Separate Web boundary

The future Profile Book may be its own Web surface, but it should consume this read-model or a generated derivative. It should not import game runtime components or write back into Canon automatically.

Recommended direction after this contract:

1. author-only character list
2. character detail route using the six sections
3. status/provenance chips
4. relationship graph as a separate source-aware projection
5. timeline/history projection
6. search by character, relation, era, season, status and source
7. public/spoiler-safe projection only after an explicit policy exists

## UX principle

A page should answer three questions within seconds:

1. **誰？** — identity/roster/visual authority
2. **普段どういう人？** — ordinary life/social/expression
3. **この情報はどこまで確定？** — source status/provenance

Deep details can expand underneath. The top of the page should not dump all 21 dimensions equally.

## Runtime boundary

- no game runtime import
- no save data dependency
- no automatic gameplay stat generation
- no automatic Canon promotion
- no automatic Future15 promotion
- no relationship/affection score generation

## Guiding principle

**プロフィールBookは新しい正本ではない。散らばった正本とReservoirへ迷わず辿るための「地図」にする。**
