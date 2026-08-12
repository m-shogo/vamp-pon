# Lorebook Author Overview Dashboard v1

Status: **IMPLEMENTED CANDIDATE / EXISTING READ MODELS REUSED / NO READINESS SCORE**

## Goal

既存 `/lorebook/` のOverviewで、作者が最初の数秒で「次にどのSourceを見るべきか」と「まだ偽って埋めてはいけないOpen」を把握できる入口を作る。

これは完成度を採点するダッシュボードではない。

## Existing sources reused

No new Story authority is created. The dashboard reads existing Lorebook projections:

- `profile-book-navigation.v1.json`
- `world-bible.v1.json`
- `relationship-arcs.v1.json`
- `core5-era-canon.v1.json`
- `reality-root-map.v1.json`

`reality-root-map.v1.json` is a checked Web mirror of `characterRealityRootMapReadModel.ts`; the dashboard must use its `placementKind` / summary counts instead of guessing Future/Open state from words inside `root` strings.

Upstream authoring authorities/read-models remain separate.

## Four navigation cards

### Profile Book

Shows:

- 36 characters
- 21 dimensions
- 6 reading sections
- Current21 = 21
- Future15 = 15

The count is source coverage, not profile quality.

### Relationship Lanes

Shows:

- Current relationship lanes
- detailed arc count
- reservoir/coverage lane count

The count is not affection, trust, romance, or relationship strength.

### Temporal Map

Shows:

- Reality Era assignments
- exact-year Open count

Rough historical bands do not become fake exact years. Dream remains a cross-era overlay, not a sixth Reality era.

### Reality Root Atlas

Shows:

- 36 Reality Roots
- 32 real-Japan region-level rows
- 3 Future abstract rows
- 1 Open/unmapped row
- 0 exact coordinates

The dashboard does not create coordinates or rank locations.

Important: `Far Future activation site Open` is still `FUTURE_ABSTRACT` when the read-model says so. A substring such as `Open` must not make the Overview double-count it as `OPEN_UNMAPPED`.

## Open / Do Not Fake gates

The Overview deliberately surfaces unresolved boundaries:

- public/spoiler-safe projection = Open
- exact Core5 years = Open
- explicitly `OPEN_UNMAPPED` Reality Root rows remain Open
- Future15 remain candidates

**Open is not an error badge.** It means the current authority intentionally does not know/freeze that value yet.

## Geography boundary

- Reality Root != birthplace/home
- Reality Root != incident area
- incident area != birthplace/home
- region != personality
- dialect != intelligence/class
- skin tone != origin
- Future15 != future-era origin
- Future/Open are not forced onto fake coordinates

Counts must come from the checked read-model projection, not string heuristics.

## No score boundary

The Overview must not show or imply:

- lore completion percentage
- character completion score
- story readiness score
- relationship strength
- Canon confidence generated from data volume
- Future15 promotion readiness
- visual quality score

A larger coverage count does not make one character more complete, important, popular, or Canon than another.

## Status boundaries

The dashboard keeps these distinctions conceptually intact:

- Current / Canon
- Candidate
- Author Reservoir
- Open
- Future15
- Authority subdomain

`Candidate != Canon`

`Future15 != Current21`

`Open != false`

`coverage count != quality score`

## Navigation role

Cards link to the existing Lorebook chapters:

- 人物 → `#characters`
- relationships → `#relationships`
- time/history → `#history`
- geography/world → `#world`

The dashboard summarizes where to go; it does not copy the underlying content into a fifth hand-edited master.

## Spoiler boundary

The dashboard remains author-facing. Since the Profile Book public/spoiler-safe projection is still undefined, this Overview is not a public release contract.

## Runtime boundary

- no game runtime consumer
- no save/readiness state
- no gameplay stat generation
- no automatic Canon promotion
- no automatic Future15 promotion

## Authoring principle

**作者Overviewは「完成度何％」を出す画面ではなく、次に見るSourceと、まだ偽って埋めてはいけないOpenを同時に見せる。**
