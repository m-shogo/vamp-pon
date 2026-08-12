# Lorebook Reality Root Atlas v1

Status: **AUTHORING READ MODEL / NON-CANON NAVIGATION**

## Goal

既存 `/lorebook/` のWorld章で、36人のReality Rootを地域・移動理由・Source statusと一緒に確認できる作者向けAtlasを提供する。

これは新しい地理正本ではない。Web mirrorは `src/game/data/characterRealityRootMapReadModel.ts` をCIで照合し、Story authorityを複製しない。

## Coverage

- 36 characters
- Current21: 21
- Future15: 15
- Real-Japan region-level: 32
- Future abstract: 3
- Open / unmapped: 1
- exact coordinates: 0

## Hard boundaries

- Reality Root != birthplace/home
- Reality Root != incident area
- incident area != birthplace/home
- region != personality
- dialect != intelligence / class / roughness / friendliness
- skin tone != origin
- Future15 != future-era origin
- exact address / school / workplace / incident pin remains OPEN
- Future abstract and Open entries are never forced onto fake present-day Japan coordinates
- no pilgrimage recommendation, stage unlock, save coordinate, gameplay stat, or automatic Canon/runtime promotion

## UI derivation

Broad region groups such as `関東` or `中部・北陸` are **UI navigation only**. They are derived from region-level Reality Root strings and are not Story authority.

The Atlas must keep these fields visible together:

- name / authorId
- roster layer
- Reality Root
- incident area
- mobility
- dialect visibility metadata
- source status
- placement kind
- pin policy
- exact coordinate state

## Why this matters

The purpose is not to say「この地域の人だからこういう性格」. The purpose is to answer:

1. この人物のReality Rootはどこまで決まっているか。
2. 事件地域と同じ場所なのか、移動が必要なのか。
3. 移動理由は時代・人物設定と両立しているか。
4. どこまでがCurrent / Candidate / Openなのか。

This keeps geography useful for continuity and foreshadowing without turning a map into biography Canon.

## Files

- Read-model authority: `src/game/data/characterRealityRootMapReadModel.ts`
- Web mirror: `public/lorebook/data/reality-root-map.v1.json`
- UI: `public/lorebook/geography-enhancement.js`
- CSS: `public/lorebook/geography.css`
- Guard: `scripts/quality/check-lorebook-reality-root-atlas.ts`
