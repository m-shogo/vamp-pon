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
| Core5 playable data | added to `characters.ts` |
| 20 character relationships | canonical map |
| 20 character combat direction | draft, now filled in `characterCanon.ts` |
| 20 character cutin direction | draft, now filled in `characterCanon.ts` |
| old naming integration | use `灯技 / 継灯 / 暁灯` going forward |

## Canon source order

1. `src/game/data/worldTerms.ts`
   - UI vocabulary and naming labels.
2. `src/game/data/characterCanon.ts`
   - The single source for 20-character relationships, combat direction, art names, and cutin direction.
3. `src/game/data/characterArts.ts`
   - Core5-facing adapter derived from `characterCanon.ts`.
4. `src/game/data/characters.ts`
   - Playable-character runtime data. Core5 has draft playable data, but only the current game flow is guaranteed.

Older documents can remain as planning history. New work should not branch from old release-name candidates.

## Adopted naming rule

| Layer | Term |
| --- | --- |
| weak character art | 灯技 |
| evolved character art | 継灯 |
| former ultimate / decisive character art | 暁灯 |
| transformation | 黒耀化 |
| transformation backlash | 煤返り |
| transformation gauge | 黒耀瓶 |
| evolution | 灯継ぎ |
| second evolution | 暁開き |
| fusion | 灯合わせ |
| rare slot | 忘れ物 |
| collection | 灯録 |
| achievement | 記憶のしるし |
| result | 旅の記録 |
| stage clear | 夜明け |
| fragment currency | 記憶片 |

## Implementation boundary

`characterCanon.ts` is allowed to contain all 20 characters as planning canon.
`characters.ts` may contain Core5 draft playable data, but adding a character there does not mean that all selection UI, sprite wiring, balance, and cutin art are production-ready.

## Cutin rule

Cutin art stays textless. Display names are drawn with UI text.

- character name: UI text
- art rank: UI text
- art name: UI text
- 黒耀化 title: UI text
- image asset: no baked text

## Next work

1. Replace visible UI labels from old terms to `WORLD_TERMS` where safe.
2. Update old docs to point to this file instead of treating old release names as current.
3. Add QA for Core5 selection only after sprite wiring and balance are checked.
