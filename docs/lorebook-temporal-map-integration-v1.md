# Lorebook Temporal Map Integration v1

Status: **IMPLEMENTED CANDIDATE / EXISTING LOREBOOK DATA REUSED / NO NEW TIME AUTHORITY**

## Goal

既存 `/lorebook/` の「時間と歴史」画面へ、CurrentのCore5 Era dataを使った5-lane temporal mapを追加する。

New source of truthは作らない。

Data source:

- `public/lorebook/data/core5-era-canon.v1.json`
- `public/lorebook/data/history-atlas.v1.json`

Authoring authority remains upstream:

- `src/game/data/core5EraCanon.ts`
- `src/game/data/storyTemporalMapReadModel.ts`
- `src/game/data/storyWorldMasterSource.ts`

## UI added

The history chapter now shows:

- 5 chronological Reality Era lanes
- lead character
- rough historical band
- explicit `EXACT YEAR / OPEN`
- pressure
- Core bridge
- Dream cross-era overlay explanation
- sky / constellation-history overlay explanation
- a reading rule that Present/Future/Dream are not value rankings

## No duplication rule

The five era assignments are read directly from the existing `core5-era-canon.v1.json`.

The UI does not create a second character-era list and does not invent exact years.

Dream/sky text is presentation guidance matching Current World Master boundaries; it is not a new machine authority.

## Visual principle

The chronology should feel like five different night skies connected by one dream, not a corporate project timeline.

- thin lines rather than thick progress bars
- rough-band labels visibly marked approximate
- exact-year Open badge always visible
- dream and sky shown as cross-lane overlays
- mobile keeps horizontal era scrolling rather than collapsing chronology into fake equal cards

## Hard boundaries

- exact year remains Open
- rough band != exact date
- Present != correct side
- Future != Human upgrade
- Dream != sixth physical era
- real historical incident != renamed fictional incident
- constellation set need not be identical across eras
- final constellation-change cause remains Open

## Runtime boundary

Lorebook remains separate from Phaser/Unity runtime. This integration does not create era unlocks, gameplay chronology, save state, or constellation mechanics.

## Guiding principle

**同じ時代に並べるのではなく、違う時代に生きていたこと自体が一目で分かる画面にする。**
