# 181. Character Canon Integration Audit

## Done

- Added `src/game/data/characterCanon.ts` as the unified 20-character canon.
- Added relationship, vessel, lineage, first action, Yui link, other link, blank, combat direction, art names, and cutin direction for all 20 characters.
- Added Core5 draft playable data in `src/game/data/characters.ts`.
- Refactored `src/game/data/characterArts.ts` so Core5 art names derive from `characterCanon.ts`.
- Kept `src/game/data/worldTerms.ts` as the naming label source.

## Old documents status

| Document | Status | New rule |
| --- | --- | --- |
| `docs/126-character-seed-roster-20.md` | planning history | use for intent only; do not copy names directly |
| `docs/153-character-roster-light-vessel-map.md` | planning history | relationship data has been merged into `characterCanon.ts` |
| `docs/179-core-five-crest-skill-sheet.md` | planning history | old release names are superseded by `灯技 / 継灯 / 暁灯` names |
| `docs/180-unified-character-canon.md` | active index | read first before character work |

## Still not done

- Full combat tuning for all 20 characters.
- Production sprite wiring for all 20 characters.
- Production cutin images for all 20 characters.
- UI-wide replacement of visible old labels.
- QA pass for Core5 selection and runtime balance.

## Safe next step

Use `WORLD_TERMS` and `characterCanon` in UI display code, but do not change battle values until local `pnpm build`, `pnpm test`, and `pnpm assets:verify` pass.
