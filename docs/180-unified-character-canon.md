# 180. Unified Character Canon

This is the character canon index.

Runtime-facing canonical data is stored in:

- `src/game/data/characterCanon.ts`
- `src/game/data/characterArts.ts`
- `src/game/data/worldTerms.ts`
- `src/game/data/characters.ts`

## Current status

| Area | Status |
| --- | --- |
| Core5 relationships | canonical |
| Core5 combat direction | canonical draft |
| Core5 art names | canonical |
| 20 character relationships | canonical map |
| 20 character combat direction | draft, now filled |
| 20 character cutin direction | draft, now filled |
| old naming integration | use `灯技 / 継灯 / 暁灯` going forward |

## Rule

Use `characterCanon.ts` as the single source for 20-character relation, combat, and cutin planning.
Older documents can remain as history, but new work should not branch from old release-name candidates.

Cutin art stays textless. Display names are drawn with UI text.
