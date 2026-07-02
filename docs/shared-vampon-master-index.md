# Vamp Pon Shared Master Index

This file is the first entry point for Vamp Pon world, asset, visual, UI/UX, spoiler, and derived-game usage references.

When another chat, another repo, Claude Code, Codex, Unity, or an asset-production workflow needs Vamp Pon context, start from this file instead of guessing which document is canonical.

## Scope

- Repository: `m-shogo/vamp-pon`
- Local project path: `/Users/m-shogo/Developer/personal/vamp-pon`
- This repository is the source of truth for Vamp Pon materials.
- Do not move, delete, or rewrite linked source documents just to satisfy this index.

## Read Order

1. [Visual Rules](#visual-rules)
2. [Spoiler Boundary](#spoiler-boundary)
3. [Characters](#characters)
4. [Enemies](#enemies)
5. [Stages](#stages)
6. [Weapons](#weapons)
7. [Items](#items)
8. [UI/UX In-world Rules](#uiux-in-world-rules)
9. [Derived Game Usage](#derived-game-usage)

## Link Classes

Use these labels when adding new references.

- **Canon**: primary source of truth or closest current design authority.
- **Runtime**: currently used or intended to be used by the game.
- **Prototype**: usable proof, draft, generated asset, or pre-runtime candidate.
- **Generated**: output from capture, generation, slicing, normalization, or verification.
- **Tooling**: scripts, checkers, importers, factories, inspectors.
- **Legacy / risk**: old, possibly stale, or must be verified before use.
- **TODO**: known gap that needs a better source later.

---

## Characters

### Canon

- [`data/character-assets/core5-character-master-assets.json`](../data/character-assets/core5-character-master-assets.json)
- [`docs/core5-runtime-loadout-map.md`](core5-runtime-loadout-map.md)
- [`docs/character-assets/core5-image-asset-ingest.md`](character-assets/core5-image-asset-ingest.md)
- [`data/pixel-art/character-recipes/yui.json`](../data/pixel-art/character-recipes/yui.json)

### Runtime

- [`src/game/assets/core5PrototypeCharacters.ts`](../src/game/assets/core5PrototypeCharacters.ts)
- [`src/game/data/characterArts.ts`](../src/game/data/characterArts.ts)
- [`public/assets/prototypes/sprite-sheets/core5-original-frames/manifest.json`](../public/assets/prototypes/sprite-sheets/core5-original-frames/manifest.json)

### Prototype / Generated

- `public/assets/prototypes/sprite-sheets/core5-52px/`
- `public/assets/prototypes/sprite-sheets/core5-original-frames/`
- `data/spritesheet-metadata/`
- [`docs/asset-image-inventory.md`](asset-image-inventory.md)
- [`docs/spritesheet-inspector.md`](spritesheet-inspector.md)

### Tooling

- [`scripts/prototypes/slice-core5-original-sheets.ts`](../scripts/prototypes/slice-core5-original-sheets.ts)
- [`scripts/prototypes/normalize-core5-sprite-sheets.ts`](../scripts/prototypes/normalize-core5-sprite-sheets.ts)
- [`scripts/prototypes/normalize-core5-74px-exact-drafts.ts`](../scripts/prototypes/normalize-core5-74px-exact-drafts.ts)
- [`scripts/quality/check-character-assets.ts`](../scripts/quality/check-character-assets.ts)
- [`scripts/quality/check-core5-74px-exact-drafts.ts`](../scripts/quality/check-core5-74px-exact-drafts.ts)
- [`tools/asset-factory/src/characterPrompts.test.ts`](../tools/asset-factory/src/characterPrompts.test.ts)

### Notes

- Core5 = Yui / Asa / Nagi / Michiru / Tomori.
- Keep character material texture consistent. Do not mix raw AI outputs directly into runtime.
- Prefer source/master assets plus validated slices over ad-hoc per-screen edits.

### TODO

- Add one consolidated character bible if the current data and recipe files become too fragmented.

---

## Enemies

### Canon

- [`docs/enemies/enemy-48-sprite-sheet-plan.md`](enemies/enemy-48-sprite-sheet-plan.md)
- [`docs/enemy-factory-design.md`](enemy-factory-design.md)
- [`.agents/skills/vamp-pon-pixel-art/enemy-style-guide.md`](../.agents/skills/vamp-pon-pixel-art/enemy-style-guide.md)
- [`.claude/skills/vamp-pon-pixel-art/enemy-style-guide.md`](../.claude/skills/vamp-pon-pixel-art/enemy-style-guide.md)

### Runtime

- [`src/game/data/enemies.ts`](../src/game/data/enemies.ts)
- [`src/game/data/enemyProductionDatabase.ts`](../src/game/data/enemyProductionDatabase.ts)
- [`src/game/systems/enemies.ts`](../src/game/systems/enemies.ts)

### Prototype / Generated

- `public/assets/prototypes/sprite-sheets/enemies-original/`
- `public/assets/prototypes/sprite-sheets/`
- [`assets/concept-design/06_prompts/enemy-48-sprite-sheet-generation-prompt.md`](../assets/concept-design/06_prompts/enemy-48-sprite-sheet-generation-prompt.md)

### Tooling

- [`tools/asset-factory/src/promptPacks.ts`](../tools/asset-factory/src/promptPacks.ts)
- [`docs/asset-factory-master-plan.md`](asset-factory-master-plan.md)
- [`docs/image-generation/chatgpt-template.md`](image-generation/chatgpt-template.md)

### Notes

- Current enemy production target: 48 enemies total.
- Primary terms: `オンブ` / `オンブロ`.
- Enemies should feel like soft black-ink shadows, not hard horror monsters.
- Keep silhouettes readable at mobile battle scale.

### TODO

- Add a single runtime enemy asset manifest if enemy images become runtime-ready in Unity.

---

## Stages

### Canon

- [`docs/151-stage1-image-delivery-list.md`](151-stage1-image-delivery-list.md)
- [`docs/reference-art-map.md`](reference-art-map.md)
- [`docs/art-direction.md`](art-direction.md)
- [`docs/web-stage1-freeze-line.md`](web-stage1-freeze-line.md)

### Runtime / Unity Migration

- [`docs/phaser-to-unity-data-map.md`](phaser-to-unity-data-map.md)
- [`docs/unity-asset-import-map.md`](unity-asset-import-map.md)
- [`docs/unity-u1-current-handoff-2026-06-30.md`](unity-u1-current-handoff-2026-06-30.md)
- [`docs/unity-u0-project-setup-plan.md`](unity-u0-project-setup-plan.md)
- [`docs/unity-u1-implementation-brief.md`](unity-u1-implementation-brief.md)

### Prototype / Generated

- `public/assets/prototypes/backgrounds/`
- `docs/design-targets/generated/`
- `docs/design-targets/generated/unity-u22/screenshots/`
- `docs/design-targets/generated/unity-u23/screenshots/`

### Notes

- Stage Select should read as a night map / route / travel record, not a generic menu.
- Stage backgrounds must preserve character and enemy readability before atmosphere.
- The game can be dark, but the player silhouette, enemy threat, pickups, HP, and level-up choices must remain legible.

### TODO

- Add stage-by-stage canon docs for Stage1-5 if not already consolidated elsewhere.

---

## Items

### Canon

- [`docs/weapon-item-factory-design.md`](weapon-item-factory-design.md)
- [`docs/asset-image-inventory.md`](asset-image-inventory.md)
- [`docs/black-ink-bottle-prototype-qa.md`](black-ink-bottle-prototype-qa.md)
- [`docs/streetlamp-ring-prototype-qa.md`](streetlamp-ring-prototype-qa.md)

### Runtime / Prototype

- `public/assets/prototypes/`
- `public/assets/prototypes/items/`
- `public/assets/prototypes/weapons/`
- `public/assets/prototypes/wepon-passive-rare-original/`
- [`src/game/assets/prototypeManifest.ts`](../src/game/assets/prototypeManifest.ts)

### Tooling

- [`scripts/quality/check-inventory-original-icons.ts`](../scripts/quality/check-inventory-original-icons.ts)
- [`scripts/quality/check-runtime-asset-sources.ts`](../scripts/quality/check-runtime-asset-sources.ts)
- [`tools/asset-factory/README.md`](../tools/asset-factory/README.md)
- [`tools/asset-factory/REAL_ASSET_TEST_PACK.md`](../tools/asset-factory/REAL_ASSET_TEST_PACK.md)

### Notes

- Inventory icons should be readable at mobile HUD size.
- Prefer 64px/detail source assets where available, then downscale intentionally.
- Do not directly mix unverified generated item images into runtime.

### TODO

- Split Weapons / Passives / Rare / Pickup / Recovery into separate manifests if asset count keeps growing.

---

## Weapons

### Canon

- [`docs/weapon-item-factory-design.md`](weapon-item-factory-design.md)
- [`docs/black-ink-bottle-prototype-qa.md`](black-ink-bottle-prototype-qa.md)
- [`docs/streetlamp-ring-prototype-qa.md`](streetlamp-ring-prototype-qa.md)

### Runtime / Prototype

- `public/assets/prototypes/weapons/`
- `public/assets/prototypes/wepon-passive-rare-original/`
- [`src/game/assets/prototypeManifest.ts`](../src/game/assets/prototypeManifest.ts)

### Visual / Evolution / Climax References

- [`docs/unity-u24-kokuyou-rare-evolution-climax-polish-plan-2026-07-01.md`](unity-u24-kokuyou-rare-evolution-climax-polish-plan-2026-07-01.md)
- [`docs/unity-u24-kokuyou-rare-evolution-climax-polish-review-2026-07-01.md`](unity-u24-kokuyou-rare-evolution-climax-polish-review-2026-07-01.md)
- [`docs/unity-u24-kokuyou-climax-visual-target-alignment-2026-07-01.md`](unity-u24-kokuyou-climax-visual-target-alignment-2026-07-01.md)
- [`unity/VampPonUnity/Assets/_Project/Scripts/U24/ClimaxPolish/`](../unity/VampPonUnity/Assets/_Project/Scripts/U24/ClimaxPolish/)

### Notes

- Weapon evolution and rare/climax moments are allowed to be flashy.
- Normal battle should remain visually calm enough that rare moments feel special.
- Combined/evolved weapons must visibly change, not only change stats.

### TODO

- Add a canonical weapon/evolution matrix if it exists only inside implementation or scattered notes.

---

## Visual Rules

These are fixed visual rules and should be treated as high-priority constraints.

1. Do not increase the color count carelessly.
2. Center the visual identity on paper UI, black ink, and lantern light.
3. Make only rare moments flashy.
4. Keep normal screens quiet.
5. Prioritize text readability.
6. Do not mix inconsistent material textures across character assets.
7. Do not mix generated images directly into runtime without curation, cleanup, and validation.

### Canon / Reference

- [`docs/art-direction.md`](art-direction.md)
- [`docs/reference-art-map.md`](reference-art-map.md)
- [`docs/asset-image-inventory.md`](asset-image-inventory.md)
- [`public/assets/README.md`](../public/assets/README.md)
- [`docs/unity-u21-1-design-gap-analysis-visual-polish-gate-plan-2026-07-01.md`](unity-u21-1-design-gap-analysis-visual-polish-gate-plan-2026-07-01.md)
- [`docs/unity-u21-1-visual-polish-candidate-notes-2026-07-01.md`](unity-u21-1-visual-polish-candidate-notes-2026-07-01.md)
- [`docs/unity-u22-stage1-battle-hud-playing-visual-polish-plan-2026-07-01.md`](unity-u22-stage1-battle-hud-playing-visual-polish-plan-2026-07-01.md)

### Tooling / Gates

- [`scripts/quality/check-unity-u21-1-design-gap.ts`](../scripts/quality/check-unity-u21-1-design-gap.ts)
- [`scripts/quality/check-unity-u22-battle-visual-polish.ts`](../scripts/quality/check-unity-u22-battle-visual-polish.ts)
- [`scripts/quality/check-unity-u23-ui-visual-polish.ts`](../scripts/quality/check-unity-u23-ui-visual-polish.ts)
- [`scripts/quality/check-unity-u24-climax-polish.ts`](../scripts/quality/check-unity-u24-climax-polish.ts)

### Notes

- Visual improvement should not mean more noise.
- Strong polish target: professional mobile-game clarity with handmade paper, black ink, lantern warmth, and selective high-impact climax effects.

---

## UI/UX In-world Rules

UI should feel like an object inside the Vamp Pon world, not a generic app/game overlay.

### Screen Mapping

- **LevelUp**: paper fragment / memory card / ink-border choice card.
- **Result**: ledger / record book / memory page / rank seal.
- **StageSelect**: night map / route line / travel record.
- **Collection**: illustrated archive / memory shelf / field guide.
- **HUD**: small light, recorded fragments, compact survival ledger.
- **Climax / Rare / Evolution**: black-ink convergence, lantern glow, controlled burst, haptic/camera/SE hook.

### Canon / Reference

- [`docs/unity-u23-levelup-result-stageselect-visual-polish-plan-2026-07-01.md`](unity-u23-levelup-result-stageselect-visual-polish-plan-2026-07-01.md)
- [`docs/unity-u22-stage1-battle-hud-playing-visual-polish-plan-2026-07-01.md`](unity-u22-stage1-battle-hud-playing-visual-polish-plan-2026-07-01.md)
- [`docs/unity-u24-climax-se-haptic-camera-hook-design-2026-07-01.md`](unity-u24-climax-se-haptic-camera-hook-design-2026-07-01.md)
- [`docs/unity-u24-kokuyou-climax-visual-target-alignment-2026-07-01.md`](unity-u24-kokuyou-climax-visual-target-alignment-2026-07-01.md)

### Runtime / Unity

- [`unity/VampPonUnity/Assets/_Project/Scripts/U23/VisualPolish/`](../unity/VampPonUnity/Assets/_Project/Scripts/U23/VisualPolish/)
- [`unity/VampPonUnity/Assets/_Project/Scripts/U24/ClimaxPolish/`](../unity/VampPonUnity/Assets/_Project/Scripts/U24/ClimaxPolish/)
- [`unity/VampPonUnity/Assets/_Project/Scripts/Editor/`](../unity/VampPonUnity/Assets/_Project/Scripts/Editor/)

### Notes

- UI clarity beats decoration.
- Decoration should explain the world or improve game feel. If it does neither, remove it.
- Mobile 390x844 readability is the baseline, not a secondary check.

### TODO

- Add a single screen-by-screen UI bible when final Unity scenes stabilize.

---

## Spoiler Boundary

### Public-safe / Trailer-safe

- Night, memories, forgotten things, black ink, lantern light, morning.
- A small heroine and companions survive a strange night.
- Enemies are shadow-like memory/ink presences.
- UI appears as paper, maps, ledgers, and memory fragments.

### Internal-only / Reveal-later

- Exact truth behind shadows, memories, families, seals, crests, and world mechanics.
- Full character relationship resolutions.
- Final-stage implications and ending structure.
- Any setting that depends on hidden causes rather than surface mood.

### Rule

When writing external prompts, store pages, social posts, demo copy, derived-game docs, or public asset briefs:

1. Use mood and visible motifs.
2. Avoid explaining hidden mechanics.
3. Do not reveal final-stage truth.
4. Keep lore hints poetic and incomplete.
5. If unsure, mark the section `internal only`.

### TODO

- Add / link a dedicated `shared-world-bible` or spoiler-specific lore file if it exists locally but is not indexed here yet.

---

## Derived Game Usage

This section is for other games, related apps, asset factories, Unity migration, and cross-repo handoff.

### Required Read Order for Derived Use

1. This file: [`docs/shared-vampon-master-index.md`](shared-vampon-master-index.md)
2. [Visual Rules](#visual-rules)
3. [Spoiler Boundary](#spoiler-boundary)
4. The target category: Characters / Enemies / Stages / Items / Weapons / UI/UX
5. Runtime or Unity migration docs only after the canon/reference docs are understood.

### Rules

- Vamp Pon is the source of truth.
- Derived projects may reference only the necessary subset.
- Derived projects must not overwrite Vamp Pon world rules.
- Do not copy hidden lore into public-facing derived documents.
- Do not import generated assets directly without validation.
- Respect mobile readability and asset consistency before adding visual effects.
- If a derived game needs to diverge, document the divergence explicitly in the derived repo, not by editing Vamp Pon canon.

### Common Derived Workflows

#### Unity migration

Read:

1. [`docs/phaser-to-unity-data-map.md`](phaser-to-unity-data-map.md)
2. [`docs/unity-asset-import-map.md`](unity-asset-import-map.md)
3. [`docs/unity-u1-current-handoff-2026-06-30.md`](unity-u1-current-handoff-2026-06-30.md)
4. U22/U23/U24 visual polish docs listed above.

#### Asset Factory

Read:

1. [`docs/asset-factory-master-plan.md`](asset-factory-master-plan.md)
2. [`docs/enemy-factory-design.md`](enemy-factory-design.md)
3. [`docs/weapon-item-factory-design.md`](weapon-item-factory-design.md)
4. [`tools/asset-factory/README.md`](../tools/asset-factory/README.md)
5. [`tools/asset-factory/REAL_ASSET_TEST_PACK.md`](../tools/asset-factory/REAL_ASSET_TEST_PACK.md)

#### New character / enemy / item generation

Read:

1. [Visual Rules](#visual-rules)
2. Relevant category section
3. Asset source folders
4. Quality checker or manifest files
5. Runtime import map only after generated candidates are curated.

### Commit / Handoff Rule

When an agent changes world, asset, or UI/UX reference structure, update this file in the same PR/commit if the reading path changes.
