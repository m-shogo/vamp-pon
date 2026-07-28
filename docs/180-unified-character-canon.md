# 180. Unified Character Canon

This is the character canon index.

**For any character question, design task, dialogue work, relationship work, profile work, Bond/Support work, or character-image brief, read `docs/CHARACTERS.md` first.**

For the latest production-facing index, read `docs/181-current-production-canon.md` first when the task affects runtime / release state.

Human/AI character understanding entrypoints:

- `docs/CHARACTERS.md` — single character hub; start here instead of repo-wide search
- `docs/character-book-v2.md` — 21-person readable character book, growth, relationships, future directions
- `docs/character-bond-support-system-v1.md` — battle Support, Bond, name/honorific changes, Pair Trait and 灯合わせ direction

Runtime-facing canonical data is stored in:

- `src/game/data/worldTerms.ts`
- `src/game/data/characterCanon.ts`
- `src/game/data/reserveCharacterCanon.ts`
- `src/game/data/characterThemeColors.ts`
- `src/game/data/characterArts.ts`
- `src/game/data/kokuyouForms.ts`
- `src/game/data/pairLightArts.ts`
- `src/game/data/itemProductionCanon.ts`
- `src/game/data/characterProductionPlans.ts`
- `src/game/data/emblemCanon.ts`
- `src/game/data/characters.ts`

Story/profile-facing canonical data is stored in:

- `docs/character-personal-profile-canon-v1.md`
- `docs/character-star-beast-constellation-canon-v1.md`
- `docs/character-silhouette-diversity-current-canon-v1.md`

## Current status

| Area | Status |
| --- | --- |
| character single entrypoint | `docs/CHARACTERS.md`; character work must start here before repo-wide search |
| readable character book | `docs/character-book-v2.md`; current 21 + user directions + candidates clearly separated |
| Bond / Support direction | `docs/character-bond-support-system-v1.md`; user-direction design only, not runtime implemented |
| Core5 relationships | canonical |
| Core5 combat direction | canonical draft |
| Core5 art names | canonical |
| Core5 playable data | added to `characters.ts`, but full selection/UI/sprite wiring is still staged |
| 20 character relationships | canonical map in `characterCanon.ts` |
| 20 character combat direction | filled in `characterCanon.ts` |
| 20 character cutin direction | filled in `characterCanon.ts` |
| 20 character Kokuyou subtitles | filled in `kokuyouForms.ts` |
| 21 personal profiles | canonical story/profile layer in `character-personal-profile-canon-v1.md`; includes 20-character roster + official reserve Ren |
| 21 star-beast profiles | canonical in `character-star-beast-constellation-canon-v1.md`; biological IAU constellations only; birthday-independent |
| constellation duplicate policy | default unique; duplicates allowed only for siblings, relatives, shared lineage/memory, succession, or hidden relationship |
| silhouette diversity | current-role canon in `character-silhouette-diversity-current-canon-v1.md`; Hana = plus-size woman, Kaname = plus-size man, Gen = mature rugged man, Shiro/Ren = glasses roles |
| Shadow proper names | クロオリ / カナメ / カスミ / トキ / ツムギ adopted for story/profile; `kage1..kage4` runtime IDs remain stable and runtime display-name migration is deferred |
| Core5 pair arts | 10 pairs filled in `pairLightArts.ts` |
| 20 character item production plans | filled in `characterProductionPlans.ts` |
| A-Z emblems | 20 filled in `emblemCanon.ts` |
| official reserve character | レン added in `reserveCharacterCanon.ts` |
| theme colors | 20 + reserve character stored in `characterThemeColors.ts` |
| naming integration | use `灯技 / 継灯 / 暁灯`, `黒耀化`, `灯具 / 持ち物 / 忘れ物`, and `A-Z灯紋` going forward |

## Canon source order

### Character planning / conversation / profile tasks

1. `docs/CHARACTERS.md`
   - Single entrypoint. Read before searching the repository.
2. `docs/character-book-v2.md`
   - Human-readable overview of current 21, growth directions, key relationships, mystery seeds, future candidate directions.
3. Only then descend into the detailed source required by the question.

### Runtime / production tasks

1. `docs/181-current-production-canon.md`
   - Latest production-facing entrypoint.
2. `src/game/data/worldTerms.ts`
   - UI vocabulary and naming labels.
3. `src/game/data/characterCanon.ts`
   - The single source for 20-character relationships, combat direction, art names, and cutin direction.
4. `docs/character-personal-profile-canon-v1.md`
   - Personal names, birthdays, age impression, favorite foods/reasons, hobbies, habits, likes/dislikes, and daily-life scene hooks for the 20-character roster plus official reserve Ren.
   - Its old birthday-derived `zodiac` field is superseded and must not be used for new work.
   - For Shadow display names, this profile layer supersedes the old `カゲール1`〜`4` planning labels for story/profile work while preserving runtime IDs `kage1`〜`kage4` until a separate safe data-sync migration.
5. `docs/character-star-beast-constellation-canon-v1.md`
   - Authoritative favorite-constellation / 星獣 source.
   - Uses biological IAU constellations only; independent of birthday/astrology.
   - Default constellation assignment is unique. A duplicate is meaningful canon only when the document gives a sibling/family/lineage/memory/succession/hidden-relationship reason.
6. `docs/character-silhouette-diversity-current-canon-v1.md`
   - Current canonical body-type, mature-character, glasses, and silhouette-diversity assignments for the existing roster.
7. `docs/character-bond-support-system-v1.md`
   - User-direction design for Support/Bond/name-honorific evolution/Pair Trait; not runtime implementation authority.
8. `src/game/data/characterProductionPlans.ts`
   - Per-character starter gear, passive, rare item, evolution names, pair candidates, and asset keywords.
9. `src/game/data/emblemCanon.ts`
   - A-Z灯紋, 灯紋具, phase rules, merch hooks, and visual keywords.
10. `src/game/data/kokuyouForms.ts`
   - Character-specific 黒耀化 subtitles and distortion rules.
11. `src/game/data/pairLightArts.ts`
   - Core5 灯合わせ names.
12. `src/game/data/itemProductionCanon.ts`
   - Item categories, motif lanes, field drops, and production requirements.
13. `src/game/data/reserveCharacterCanon.ts`
   - Official reserve characters that should not be forced into the current playable build.
14. `src/game/data/characterThemeColors.ts`
   - Theme and accent colors for character cards, cutins, selection UI, collection UI, and asset prompts.
15. `src/game/data/characterArts.ts`
   - Core5-facing adapter derived from `characterCanon.ts`.
16. `src/game/data/characters.ts`
   - Playable-character runtime data. Core5 has draft playable data, but only the current game flow is guaranteed.

Older documents can remain as planning history. New work should not branch from old release-name candidates, old Shadow numeric planning labels, old birthday-zodiac assignments, or superseded silhouette candidates.

**Do not rediscover character foundations with repo-wide search when `docs/CHARACTERS.md` already routes to the answer. Repo-wide search is the fallback for genuinely missing or historical information.**

## Adopted naming rule

| Layer | Term |
| --- | --- |
| weak character art | 灯技 |
| evolved character art | 継灯 |
| former ultimate / decisive character art | 暁灯 |
| transformation | 黒耀化 |
| transformation backlash | 煤返り |
| transformation gauge | 黒耀瓶 |
| weapon / active item | 灯具 |
| passive item | 持ち物 |
| rare item | 忘れ物 |
| field drop | 落とし物 |
| recovery drop | 朝露 |
| evolution / upgrade | 灯継ぎ |
| second evolution / awakening | 暁開き |
| fusion / pair art | 灯合わせ |
| collection | 灯録 |
| achievement | 記憶のしるし |
| result | 旅の記録 |
| stage clear | 夜明け |
| fragment currency | 記憶片 |
| emblem device | 灯紋具 |
| character emblem | 灯紋 |
| A-Z emblem series | A-Z灯紋 |
| favorite constellation mascot | 星獣 |

## Character production rule

New characters must not be added as name-only entries.
For every character, prepare:

1. Initial 灯具
2. 持ち物
3. 忘れ物
4. 灯技
5. 継灯
6. 暁灯
7. 灯継ぎ
8. 暁開き
9. 黒耀化副題
10. 黒耀化の歪み
11. 灯合わせ候補
12. A-Z灯紋
13. Asset keywords
14. Merch hook
15. Personal profile: birthday, age impression, name rationale, favorite food + reason, hobby, small habit, likes/dislikes, daily-life scene hook
16. Star-beast profile: favorite biological constellation, star beast, origin kernel, character-fit reason, and shared-constellation reason when duplicated
17. Silhouette profile: body type, height/width impression, age silhouette, hair/face marker, readable prop, and diversity role

## Implementation boundary

`characterCanon.ts` is allowed to contain all 20 characters as planning canon.
`reserveCharacterCanon.ts` is allowed to contain official reserve characters such as Ren.
`characters.ts` may contain Core5 draft playable data, but adding a character there does not mean that all selection UI, sprite wiring, balance, and cutin art are production-ready.

Core5 should be the first playable expansion target.
Season seed / future seed / shadow characters should remain data-only until art, balance, and UI are ready.

Personal profile adoption does not make a character runtime-playable. Birthday is profile flavor and does not lock an exact birth year. Birthday does not determine the character's star beast. Shadow proper names do not change `kage1`〜`kage4` IDs; runtime display-name migration is a separate implementation task.

Star-beast canon adoption does not implement summons or combat assists. Shared constellations may deliberately foreshadow family/lineage/hidden relationships; the exact hidden relation stays unrevealed until its story gate.

Silhouette-diversity canon adoption does not automatically replace current production sprites; those visual changes follow Heavy Design candidate → human approval → production promotion.

Bond/Support design adoption does not implement Support slots, save data, gameplay modifiers, or relationship progression in runtime. Those require a separate gameplay implementation gate and prototype.

## Cutin and emblem rule

Cutin and emblem art stay textless. Display names are drawn with UI text.

- character name: UI text
- art rank: UI text
- art name: UI text
- 黒耀化 title/subtitle: UI text
- A-Z code: UI text
- emblem phase label: UI text
- image asset: no baked text

## Next work

1. Replace visible UI labels from old terms to `WORLD_TERMS` where safe.
2. Add Core5 missing entries to `weapons.ts`, `passives.ts`, `rareItems.ts`, and `evolutions.ts`.
3. Add Core5 character selection only after sprite wiring and balance are checked.
4. Add A-Z灯紋 display to 灯録, character detail, and character selection.
5. Keep reserve characters formal, but do not force them into character select until art and balance are ready.
6. When Shadow characters are promoted toward visible UI, migrate `characterCanon.ts` display names to カナメ / カスミ / トキ / ツムギ in a dedicated compatibility-checked data-sync commit while preserving their stable IDs.
7. When Character Detail / 灯録 profile UI is implemented, use `character-star-beast-constellation-canon-v1.md`, never the superseded birthday-zodiac fields.
8. Do not implement star-beast combat behavior until its own gameplay/design gate exists.
9. Keep `docs/CHARACTERS.md` and `docs/character-book-v2.md` synchronized whenever current character identity, relationships, growth direction, star-beast role, silhouette role, or Bond direction changes.
