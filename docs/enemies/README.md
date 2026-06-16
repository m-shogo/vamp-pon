# Enemy Design Index

Vamp Ponの敵48体に関する入口。

## Current state

```txt
design records       48 / 48 complete
grunts                25
midbosses             10
boss base forms        3
boss alternate forms  10
status                design-ready
reference sheet       not generated yet
Aseprite production   not started for the full roster
runtime migration     planned, not completed
```

## Canonical files

| Purpose | File |
|---|---|
| exact 48-cell order and sheet contract | `data/enemy-assets/enemy-48-sprite-sheet-cells.json` |
| design catalog index | `data/enemy-assets/enemy-design-catalog.json` |
| complete individual designs | catalogの`designFiles`に列挙された8 JSON |
| readable sheet plan | `docs/enemies/enemy-48-sprite-sheet-plan.md` |
| Omb/Ombro brand brief | `docs/enemies/omb-ombro-mascot-brief.md` |
| Omb/Ombro motion/art direction | `docs/enemies/omb-ombro-selected-direction.md` |
| production readiness | `docs/enemies/enemy-48-production-readiness.md` |
| runtime migration | `docs/enemies/enemy-runtime-migration-plan.md` |
| generation prompt | `assets/concept-design/06_prompts/enemy-48-sprite-sheet-generation-prompt.md` |

## Common Stage structure

```txt
Omb                 1
Ombro               1
Stage-unique grunt  3
midboss             2
```

Stages 2, 4 and 5 additionally contain the catalog-defined major bosses and alternate forms.

## Commands

```sh
pnpm enemy48:design:check
pnpm enemy48:manifest:check
pnpm enemy48:sprites:verify
```

- `design:check`: 48 designs, distribution, Stage composition, required fields, boss parent references, legacy-name absence
- `manifest:check`: design validation plus sheet contract; skips PNG inspection
- `sprites:verify`: validates the actual 1440x1080 RGBA sheet, 48 non-empty cells and 4px safe borders

## Production order

1. generate the 48-cell prototype reference sheet
2. inspect silhouette collisions and weak cells
3. build Omb/Ombro Stage 1 at native size in Aseprite
4. build Stage 1 unique grunts and midbosses
5. migrate the playable runtime in small tested batches
6. continue one complete Stage at a time

Generated references must not be called production or directly downscaled into game sprites.
