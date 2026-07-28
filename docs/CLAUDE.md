# CLAUDE.md — docs design scope

For any work under `docs/` involving characters, relationships, Bond, story, mystery, collection, achievements, permanent progression, 黒耀化, lore, or remembered user ideas:

1. Read `docs/CANON.md` first.
2. Read `docs/game-core-book-v1.md` to preserve game identity.
3. Read `docs/GAME-DESIGN.md` to understand which design domains are Current / Partial / Proposed / Open.
4. Use the shared-memory books when relevant:

```txt
Character Book -> docs/character-book-v3.md
Story Book     -> docs/story-book-v1.md
Idea Book      -> docs/idea-book-v1.md
```

5. Read the matching Current detail master only when the Book is insufficient.
6. Do not search migrated legacy docs as normal authority.
7. Check `docs/legacy-design-migration-2026-07-28.md` before opening an old design file.
8. If a legacy file is marked `MIGRATED_NO_NORMAL_READ` or `HISTORY_ONLY`, do not use it for new design except explicit history/migration audit.

## Memory semantics

```txt
Game Core Book = remember what game this is
GAME-DESIGN    = remember what design is complete, partial, proposed, or still open
Character Book = remember people
Story Book     = remember story, emotion, mysteries, sequel space
Idea Book      = remember user ideas without premature canonization
```

Game Core has higher design priority than an undecided Idea.

If an idea conflicts with Game Core, preserve the idea but do not silently change the Core.

A user idea must not disappear because it is still undecided.
But:

```txt
USER IDEA != CANON
```

Preserve meaningful user ideas with accurate labels:

- CORE / CURRENT
- CANON / CURRENT
- USER DIRECTION
- USER IDEA
- HIGH-VALUE CANDIDATE
- OPEN QUESTION
- LEGACY

Do not force a USER IDEA into a hard rule too early.
Do not make the user restate a preserved idea later.

## Completeness rule

Do not call the game design complete/perfect only because Game Core, Character Book, Story Book, and Idea Book exist.

Use `docs/GAME-DESIGN.md` as the gap map.

Known high-value domains that still need consolidation/design include:

- combat / run pacing
- stage / encounter design
- first-run onboarding
- mobile input / control experience
- difficulty / player aids
- meta economy shape
- postgame / endgame
- creative audio / haptic direction
- fun / balance playtest metrics

Some of these already have useful implementation notes or Proposed docs. Do not confuse those with a Current design master.
Do not prematurely lock exact balance numbers merely to remove an OPEN status.

## Current routing

```txt
Game Core       -> docs/game-core-book-v1.md
Design coverage -> docs/GAME-DESIGN.md
Character       -> docs/CHARACTERS.md
Bond / Support  -> docs/BOND.md
黒耀化          -> docs/BLACK-YOUKA.md
Gameplay / Meta -> docs/GAMEPLAY-META-PROGRESSION.md
Archive / Lore  -> docs/PROGRESSION-ARCHIVE.md
Story / Mystery -> docs/STORY.md
Story logic     -> docs/STORY-ENGINE.md
Runtime         -> docs/181-current-production-canon.md
```

## Design invariants

- Formal title: ヨルノシルベ
- New canon spelling: 黒耀化
- Game Core Book is the top-level game identity reference
- Gameplay first; lore is optional side effect
- Reading is never required to receive gameplay power
- Clear Getter / 夜明け星図 is meta gameplay
- Bond/Support returns value to gameplay
- Happy End canonical direction
- Game Over is not permanent death
- Main Mystery and Character Mystery remain separate lanes
- HIGH-VALUE CANDIDATE is not CANON until explicitly promoted
- Keep Current 21 separate from future candidates
- Design-doc work must not promote U49/U50/runtime readiness
