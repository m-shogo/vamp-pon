# Character Era Continuity Audit v1

Status: **AUTHORING QUALITY GUARD / NON-CANON**

## Purpose

36人の世代・Reality Root・伏線・会話を別々に増やした結果、後から互いに矛盾することを防ぐ。

This audit does **not** turn Candidate lanes into Canon. It protects cross-layer invariants and already-authoritative locks while allowing Candidate content to be edited deliberately.

## Cross-layer coverage

The same 36 author IDs must exist across:

- `characterEraForeshadowDialogueReservoir.ts`
- `characterEraFingerprintRegistry.ts`
- `characterEraSceneSeedRegistry.ts`
- `characterRealityRootMapReadModel.ts`

Era pool and Reality Root roster layer must agree for every character.

## Upstream-current era locks

These are protected because their era lanes are already marked `UPSTREAM_CURRENT`:

- Tomori — `POSTWAR_RECOVERY_SCARCITY`
- Michiru — `GROWTH_POLLUTION_ENERGY_TRANSITION`
- Nagi — `POST_BUBBLE_EARLY_MOBILE_INTERNET`
- Yui — `PRESENT_INFORMATION_ABUNDANCE`
- Asa — `FAR_FUTURE_IDENTITY_COEXISTENCE`

Exact year, birth year, and age remain OPEN unless separately authoritative.

## Relationship-adjacent continuity without auto-Canon

The checker protects only already-required continuity boundaries:

- Ritsu / Koyori: same household-era lane and same Reality Root unless upstream authority changes.
- Kai / Nao: twin-era and Reality Root continuity stay aligned, while scene/dialogue seeds must not collapse into one identical personality.

These checks do not create new family or relationship Canon.

## Special boundaries

- Asa proves `Current21 != present-era origin`: Current roster, Far Future Reality Root.
- Future15 must not collapse into a future-era tag.
- Chloe remains `OPEN_SPECIAL / CROSS_ERA_LONG_LIVED` with Open/unmapped Reality Root and zero exact coordinates.
- Tomori/Yui may not imply different official IAU 88 constellation sets.
- one fingerprint != era proof
- one scene != era proof
- dialogue pairing != relationship Canon
- scene seed != Star Beast assignment
- scene seed != obsolete constellation ownership/fate
- Reality Root != personality

## Reveal-writing principle

Era should emerge through repeated ordinary mismatches, counterevidence, material/record evidence, and later reinterpretation. A character saying an exact era label is not the intended reveal mechanism.

## Guard

`node --experimental-strip-types scripts/quality/check-character-era-continuity.ts`
