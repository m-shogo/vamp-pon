# Lorebook Profile Book Navigation v1

Status: **IMPLEMENTED CANDIDATE / 36 CHARACTERS / 21 DIMENSIONS / 6 READING SECTIONS / NAVIGATION ONLY**

既存 `/lorebook/` の人物図鑑を、Character Author DBの21 dimensionsへ迷わず辿れる6章の入口にする。

## Data contract

- Web navigation manifest: `public/lorebook/data/profile-book-navigation.v1.json`
- Upstream authority: `src/game/data/characterProfileBookReadModel.ts`
- Coverage authority: `src/game/data/characterAuthorDbCoverageManifest.ts`

JSONは21 dimensionsの内容を複製せず、section構造とsummary metadataだけをmirrorする。

## Six sections

1. Identity & Authority
2. Ordinary Life
3. Social & Boundaries
4. Expression & Voice
5. Learning & Memory
6. Material Trace

All 21 dimensions are assigned exactly once.

## Source boundary

Current/Canon、Candidate、Author Reservoir、Open、Future15、Authorityをflattenしない。Open != false。Future15 richness != Current21 promotion。

## Spoiler / route boundary

Profile Book is not a new Story master. A public/spoiler-safe projection is still **not defined**. Stable aliases are provenance/navigation details, not primary person-facing routes.

## Runtime boundary

No game runtime consumer, no save dependency, no gameplay stat generation, no automatic Canon/Future15 promotion.

**人物図鑑の最初の役目は情報量を見せつけることではなく、「今知りたいことはどの章にあるか」を3秒で分からせること。**
