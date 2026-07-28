# CLAUDE.md — docs design scope

For any work under `docs/` involving characters, relationships, Bond, story, mystery, collection, achievements, permanent progression, 黒耀化, lore, or remembered user ideas:

1. Read `docs/CANON.md` first.
2. Use the three equal shared-memory books when relevant:

```txt
Character Book -> docs/character-book-v3.md
Story Book     -> docs/story-book-v1.md
Idea Book      -> docs/idea-book-v1.md
```

3. Read the matching Current detail master only when the Book is insufficient.
4. Do not search migrated legacy docs as normal authority.
5. Check `docs/legacy-design-migration-2026-07-28.md` before opening an old design file.
6. If a legacy file is marked `MIGRATED_NO_NORMAL_READ` or `HISTORY_ONLY`, do not use it for new design except explicit history/migration audit.

## Shared-memory semantics

```txt
Character Book = remember people
Story Book     = remember story, emotion, mysteries, sequel space
Idea Book      = remember user ideas without premature canonization
```

A user idea must not disappear because it is still undecided.
But:

```txt
USER IDEA != CANON
```

Preserve meaningful user ideas with accurate labels:

- CANON / CURRENT
- USER DIRECTION
- USER IDEA
- HIGH-VALUE CANDIDATE
- OPEN QUESTION
- LEGACY

Do not force a USER IDEA into a hard rule too early.
Do not make the user restate a preserved idea later.

## Current routing

```txt
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
- Gameplay first; lore is optional side effect
- Reading is never required to receive gameplay power
- Happy End canonical direction
- Game Over is not permanent death
- Main Mystery and Character Mystery remain separate lanes
- HIGH-VALUE CANDIDATE is not CANON until explicitly promoted
- Keep Current 21 separate from future candidates
- Design-doc work must not promote U49/U50/runtime readiness
