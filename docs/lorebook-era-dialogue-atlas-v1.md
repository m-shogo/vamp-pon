# Lorebook Era Dialogue Atlas v1

Status: **AUTHOR READ MODEL / GENERATED / NON-CANON**

## Goal

36人の「世代」を年号表で固定するのではなく、作者が会話を書く時に必要なものを一画面で辿れるようにする。

Each character is read in this order:

1. Era lane / roster layer / assignment status
2. personal anchors
3. ordinary mismatch
4. plausible misread
5. material or record evidence
6. reinterpretation
7. dialogue pair
8. object / trace
9. forbidden shortcut
10. nine Era fingerprint dimensions

## No hand-edited second DB

The browser projection is **generated**, not hand-maintained.

Generator:

- `scripts/lorebook/generate-era-dialogue-atlas.ts`

Sources:

- `characterEraForeshadowDialogueReservoir.ts`
- `characterEraFingerprintRegistry.ts`
- `characterEraSceneSeedRegistry.ts`

Generated output:

- `public/lorebook/data/era-dialogue-atlas.v1.json`

The output file is intentionally gitignored. `vite.config.ts` generates it before Vite dev/build starts, so production `dist/lorebook/` receives a current projection without creating a second Story authority in Git.

## Coverage

- 36 characters
- Current21 = 21
- Future15 = 15
- six source lane IDs total: five chronological Reality lanes plus `CROSS_ERA_LONG_LIVED` Mystery special
- 9 fingerprint dimensions per character
- 8 scene/reveal fields per character

## What is deliberately absent

The projection does **not** include:

- exact year
- birth year
- exact age
- Canon confidence percentage
- relationship strength
- Star Beast assignment derived from Era
- obsolete constellation assignment derived from Era

## Filter behavior

Author view can filter by:

- Era lane
- Current21 / Future15
- `UPSTREAM_CURRENT`
- `AUTHOR_CANDIDATE`
- `OPEN_SPECIAL`

These are navigation filters, not rankings.

## Era writing grammar

A useful reveal should usually travel through:

`ordinary mismatch → plausible misread → material/record evidence → reinterpretation`

The dialogue should work before the reveal. If a line only exists to announce a period, it is usually too explicit.

## Hard boundaries

- exact year remains Open
- Future15 != future-era origin
- Dream appearance != Reality generation
- old era != ignorance
- future era != superiority
- one fingerprint != era proof
- one scene != era proof
- dialogue pairing != relationship Canon
- scene != Star Beast assignment
- scene != obsolete constellation assignment
- Tomori official constellation set != Present Yui official constellation set remains forbidden
- `CROSS_ERA_LONG_LIVED` is a Mystery special, not a sixth chronological Reality era

## Why this matters

The author should be able to write a scene such as:

> 「その言い方、少し変だな」

without immediately explaining why.

Later, another conversation or physical trace can make the earlier line gain a second meaning. The Atlas exists to make that delayed recognition repeatable across all 36 characters without flattening everyone into one Era stereotype.

## Generated projection rule

**TypeScript Author DB is authority. Generated JSON is disposable.**

If the source changes, regenerate. Do not patch the generated JSON by hand.
