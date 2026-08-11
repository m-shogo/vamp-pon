# Character Relationship Graph Read Model v1

Status: **CURRENT21 AUTHORING GRAPH / 21 NODES / 24 SOURCE-BACKED EDGES / NO RELATIONSHIP SCORE**

## Purpose

作者用プロフィールBookで「誰と誰に、いまどんな関係レーンがあるか」を一目で辿るためのread-model。

Graphは新しい関係性Authorityではない。`currentRelationshipInventory` とそのsourceを、**人間関係図として表示できる形へ投影するだけ**である。

## Scope

v1 is Current21 only:

- 21 graph nodes
- 24 source-backed relationship edges
- edges come from `src/game/data/currentRelationshipInventory.ts`
- canonical source pointer remains `docs/RELATIONSHIPS.md`
- detailed edges may additionally point to `docs/design-targets/generated/character-relationship-arc-map-v1.json`

Future15 relationships are not invented to make the graph look full.

## Node identity

Graph node IDs use stable relationship/profile IDs because existing relationship inventory already references those IDs.

Profile navigation still uses `authorId`.

Examples:

- graph node `kage1` → profile route `/characters/kaname`
- graph node `kage2` → `/characters/kasumi`
- graph node `kage3` → `/characters/toki`
- graph node `kage4` → `/characters/tsumugi`
- graph node `yubi` → `/characters/yuubi`

This keeps relationship data stable while preventing internal aliases from becoming person-facing names.

## Edge meaning

An edge means:

**There is a source-backed Current relationship lane worth navigating.**

It does **not** automatically mean:

- romance
- blood relation
- best friend
- high affection
- high trust
- positive relation
- permanent party pairing
- exact Canon incident
- Main Mystery involvement

A missing edge also does **not** mean two characters have no relationship. It only means v1 Current relationship inventory does not currently define a distinct navigable lane for that pair.

## Source-aware edge metadata

Every edge exposes:

- `authority`
- `detailStatus`
- `detailedMachineArcAvailable`
- `reserveInvolved`
- `source`
- optional `detailedSource`
- exact-incident / romance / blood / Main Mystery freeze flags

The UI should display or make this provenance accessible rather than flattening every line into the same certainty.

## Visual encoding guidance

Future authoring Web may encode **source/coverage status**, not emotional ranking.

Recommended semantics:

- detailed-machine-arc vs Current Hub coverage can differ by line treatment
- reserve-involved can be an explicit badge/marker
- detail status can be filterable
- hover/click should reveal source and status

Avoid by default:

- line thickness = affection
- red line = hate / pink line = romance
- node size = popularity or importance
- centrality = story importance
- proximity = Canon intimacy
- hearts or romance icons without separate relationship authority

## Directed versus undirected

v1 inventory pairs are projected as **undirected navigation edges**. This does not mean both characters feel identically. Addressee-specific or asymmetric behavior remains in other sources such as Social Chemistry and directed speech.

## Reserve boundary

`reserveInvolved` marks source/detail status only. It is not a weaker relationship score and does not lower the humanity or importance of the character.

## Future15 boundary

Future15 nodes/edges are intentionally absent from v1 graph projection. When Future15 relationship sources become authoritative enough, add a separate source-aware extension rather than inventing edges from profile similarity, shared traits, sexuality, origin, season, or theme color.

## Spoiler boundary

This graph is author-facing. A public/spoiler-safe graph is not defined here. Relationship lanes can themselves be spoilers.

## Runtime boundary

- no game runtime graph behavior
- no party AI
- no affinity meter
- no romance system
- no relationship stat generation
- no automatic Canon promotion

## Authoring principle

**人間関係図の線は「仲良し度」ではなく、今どのSourceを読めば二人の関係を深掘りできるかを示す道にする。**
