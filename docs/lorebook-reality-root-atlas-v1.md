# Lorebook Reality Root Atlas v1

Status: **IMPLEMENTED CANDIDATE / EXISTING 36 REALITY ROOT ROWS REUSED / REGION LEVEL / NO EXACT PIN**

## Goal

既存 `/lorebook/` の「世界設定」へ、36人の Reality Root / incident area / mobility / dialect / source status を一目で見渡す author-facing atlas を追加する。

## Existing data reused

No new geography authority is created.

The UI reads:

- `public/lorebook/data/reality-root-candidates.v1.json`

Upstream authority/read-model remains:

- `src/game/data/characterRealityRootRegistry.ts`
- `src/game/data/characterRealityRootMapReadModel.ts`

## Placement

v1 does not geocode exact coordinates.

- real Japan entries are grouped at broad region level for UI navigation
- Asa / Noa / Rum remain Future abstract
- Chloe remains Open / unmapped
- exact home / school / workplace / incident coordinates remain Open

The client-side `北海道 / 東北 / 関東 / 中部・北陸 / 近畿 / 中国・四国 / 九州・沖縄` buckets are **UI-derived navigation groups only**. They are not a new Story authority.

## Root / incident / mobility

The atlas keeps three concepts visually separate:

- root — where the character's Reality Root is currently placed
- incident area — where a major incident lane may occur
- mobility — why movement between them is plausible

`incident area != birthplace/home`.

## Hard boundaries

The map must not infer:

- region = personality
- dialect = intelligence/class/roughness/friendliness
- skin tone = origin/nationality
- name = origin
- body = origin
- sexuality/gender/presentation = origin
- mobility = trauma
- incident area = birthplace
- Future15 = future-era origin

Future/Open roots are never forced onto fake present-day coordinates.

## UI

The world chapter gains:

- Reality Root Atlas heading
- counts for real-Japan / Future / Open
- region filter chips
- per-character cards with status
- root → incident area display
- mobility and dialect metadata
- explicit `exact coordinate / OPEN`
- UI-derived grouping disclaimer

Marker/card size is not story importance.

## Runtime boundary

- no gameplay map
- no GPS
- no save coordinates
- no stage unlock generation
- no automatic pilgrimage recommendation
- no Canon/runtime promotion

## Authoring principle

**地図は「この地域の人だからこういう人」を作るためではなく、人物がどこから来て、なぜ別の地域の出来事へ関われるのかをSource付きで確認するために使う。**
