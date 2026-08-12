# Lorebook Profile Book Navigation v1

Status: **IMPLEMENTED CANDIDATE / 36 CHARACTERS / 21 DIMENSIONS / 6 READING SECTIONS / NAVIGATION ONLY**

## Goal

既存 `/lorebook/` の人物図鑑を、設定カードを無秩序に足す画面ではなく、Character Author DBの21 dimensionsへ迷わず辿れる**6章の入口**にする。

## Data contract

Web navigation manifest:

- `public/lorebook/data/profile-book-navigation.v1.json`

Upstream authority:

- `src/game/data/characterProfileBookReadModel.ts`
- `src/game/data/characterAuthorDbCoverageManifest.ts`

The JSON is intentionally small: it mirrors reading-section structure and summary metadata, not the 21 dimensions' content. Dedicated CI compares the JSON section IDs/dimension assignments with the TypeScript read-model.

## Six sections

1. Identity & Authority
2. Ordinary Life
3. Social & Boundaries
4. Expression & Voice
5. Learning & Memory
6. Material Trace

All 21 Current Author DB dimensions are assigned exactly once across these six sections.

## UI

The character chapter adds:

- `36 characters / 21 dimensions / 6 sections` header
- six editorial reading cards
- each card's dimension chips
- collapsible Source legend
- Current/Canon, Candidate, Author Reservoir, Open, Future15 and Authority meanings
- selected character's Personal File gets a `READ MODEL` strip

The existing personal profile remains visible. The new UI does not replace it with generic AI personality text.

## Source boundary

The UI must not flatten:

- Current / Canon
- Candidate
- Author Reservoir
- Open
- Future15
- Authority subdomain

`Open` does not mean false or missing. Rich Future15 data does not promote Current21. Author Reservoir material does not become Canon because it appears on a polished page.

## Route / alias boundary

Profile Book routes use author-facing IDs. Stable data aliases remain provenance/navigation details only.

Examples:

- `kaname` remains the person-facing route identity, while `kage1` can remain a stable profile ID.
- `yuubi` remains person-facing while `yubi` can remain stable data identity.

## Spoiler boundary

A public/spoiler-safe projection is still **not defined**. This UI is author-facing. Do not hide arbitrary fields and call the result public-safe.

## No duplication rule

**Profile Book is not a new Story master.**

The Web may summarize navigation and display existing personal profile fields, but it should link/derive from existing sources rather than copying all Author DB content into another hand-edited JSON.

## Runtime boundary

- no game runtime consumer
- no save dependency
- no gameplay stat generation
- no automatic Canon/Future15 promotion

## Authoring principle

**人物図鑑の最初の役目は情報量を見せつけることではなく、「今知りたいことはどの章にあるか」を3秒で分からせること。**
