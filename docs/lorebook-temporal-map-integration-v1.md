# Lorebook Temporal Map Integration v2

Status: **IMPLEMENTED AUTHOR READ MODEL / CURRENT CORE5 LOCKS + 36-CHARACTER CANDIDATE ERA METHOD / NO NEW TIME AUTHORITY**

## Goal

既存 `/lorebook/` の「時間と歴史」で、

- CurrentのCore5 Reality Era
- 36人のEra authoring method
- Dream cross-era overlay
- object / record lineage

を、別の時間体系へ分裂させず同じルールで読む。

New source of truthは作らない。

## Data sources

Web read-model:

- `public/lorebook/data/core5-era-canon.v1.json`
- `public/lorebook/data/history-atlas.v1.json`

Authoring authority/read-model:

- `src/game/data/core5EraCanon.ts`
- `src/game/data/characterEraForeshadowDialogueReservoir.ts`
- `src/game/data/characterCrossEraEchoReservoir.ts`
- `src/game/data/storyTemporalMapReadModel.ts`
- `src/game/data/storyWorldMasterSource.ts`

## Core5 temporal map

The visible top map keeps five chronological Reality lanes for the Current Core5:

- Tomori — postwar recovery / scarcity
- Michiru — growth / pollution / energy transition
- Nagi — post-bubble / early mobile & internet
- Yui — present / information abundance
- Asa — far future / identity coexistence

Each lane shows:

- rough historical band
- explicit `EXACT YEAR / OPEN`
- primary pressure
- Core bridge

The map is chronological. The exact year is not.

## 36-character Era method

The author-only History Atlas no longer uses the old coarse labels:

- `OLD`
- `TRANSIT`
- `RECENT`
- `UNKNOWN`

Those labels are retired as the active authoring method because they overlap ambiguously with the current five-lane model.

36-character writing now uses:

1. `POSTWAR_RECOVERY_SCARCITY`
2. `GROWTH_POLLUTION_ENERGY_TRANSITION`
3. `POST_BUBBLE_EARLY_MOBILE_INTERNET`
4. `PRESENT_INFORMATION_ABUNDANCE`
5. `FAR_FUTURE_IDENTITY_COEXISTENCE`

`CROSS_ERA_LONG_LIVED` is a **Mystery special state**, not a sixth chronological Reality era. It currently allows cross-era evidence such as Chloe's to remain Open without inventing a birth year or lifespan mechanism.

## Dream boundary

Dream is a cross-era overlay.

It is **not**:

- a sixth Reality era
- proof that two characters share a Reality generation
- proof that an old-looking character is from the oldest Reality lane
- proof that Future15 means future-origin

Characters can meet in the same night while belonging to different Reality periods.

## Constellation-history boundary

Different historical **sources and atlases** can contain figures, labels, or obsolete constellations that a modern chart does not.

That does **not** mean the Current Core5 each lived under different official constellation standards.

In particular:

**Tomori official constellation set != Present Yui official constellation set is forbidden.**

Tomori is post-1945. The usable S-tier clue is therefore an older/inherited archival source, not a different official postwar 88-constellation list.

Allowed clue forms include:

- inherited old atlas
- older printed plate
- copied or rebound chart
- obsolete constellation in an archival source
- a name fossil such as Quadrantids preserving Quadrans Muralis

But source-specific content and artifact provenance must be evidenced before Canon consideration.

## Object-lineage boundary

History threads separate:

- Current anchor
- Author Candidate connection
- missing handoff / provenance

Example — Tomori / Yui lantern:

Current-compatible anchors:

- Yui's Current central vessel/motif is a lantern.
- Tomori's Current Era identity includes repair / reuse / material literacy.

Still Candidate:

- that Tomori repaired the **same physical lantern** later held by Yui
- the exact handoff chain
- the exact repair mark attributable to Tomori

Legacy design material may suggest this direction, but the History Atlas must not display the exact handoff as an already-known Current fact.

## Evidence before era placement

Candidate Era placement should combine multiple independent cues such as:

- language marker
- technology marker
- daily-life marker
- object / record evidence
- Reality Root compatibility
- source status

One clue does not prove an era.

## No duplication rule

The Lorebook does not create a second independent era authority.

The Core5 map reads its existing Core5 projection, while the 36-character Era Method mirrors the current authoring reservoir and is guarded by CI.

## Hard boundaries

- exact year remains Open unless separately authoritative
- rough band != exact date
- Present != correct side
- Future != Human upgrade
- old era != ignorance
- future era != superiority
- Future15 != future-era origin
- Dream != sixth Reality era
- `CROSS_ERA_LONG_LIVED` != sixth chronological era
- one evidence != era proof
- real historical incident != renamed fictional incident
- historical/archival chart difference != Tomori/Yui official IAU 88 difference
- object motif overlap != proven same-object lineage

## Runtime boundary

Lorebook remains separate from Phaser/Unity runtime. This integration does not create era unlocks, gameplay chronology, save state, constellation mechanics, or automatic Canon promotion.

## Guiding principle

**西暦を埋める前に、生活のEvidenceを揃える。物が繋がって見えても、受け渡しが証明されるまでは線を破線のまま残す。**
