# AGENTS.md

This file is the repository-level instruction file for OpenAI Codex and other coding agents.

Target repository:

- `/Users/m-shogo/Developer/personal/vamp-pon`
- `https://github.com/m-shogo/vamp-pon.git`

Do not touch any repository outside `vamp-pon`.

---

## 1. Core project rule

Vamp Pon pixel art must not be treated as finished just because an asset exists.
The project uses Aseprite as the final craft tool.

For all pixel-art work, follow this policy:

- AI-generated images are reference only.
- Aseprite source is the source of truth.
- Exported PNGs are build artifacts.
- Do not hand-edit public PNG files.
- Lua/Aseprite scripts may support setup and export, but must not be the final art judgment.
- A hand-final candidate requires pixel-level finishing in Aseprite.
- A weak asset must stay `temporary`, `bootstrap`, or `remake`; do not call it `final-candidate`.

---

## 2. Pixel-art craft rules are mandatory

Before editing or reviewing any pixel-art asset, read the generic craft rules first:

- `docs/pixel-art/README.md`
- `docs/pixel-art/human-character-craft-guide.md`
- `docs/pixel-art/ng-patterns.md`
- `docs/pixel-art/agent-quality-brief.md`
- `docs/pixel-art/research-notes.md`

These rules apply to:

- player characters
- enemies
- pickups
- UI icons
- props
- backgrounds
- effects

Do not skip these docs just because the task is not about Yui. Yui-specific rules are important, but the generic pixel-art rules are the baseline for every visual asset.

---

## 3. Use useful sources, but do not lower quality

Use helpful external sources when they make the game better.

Allowed production inputs:

- CC0 assets for background props, tiles, pickups, UI parts, enemy silhouettes, and effect masks.
- AI image generation for reference, concepts, and variation exploration.
- SVG for UI, paper cards, map lines, icons, frames, and stamp-like elements.
- Shader / Canvas / WebGL effects for ink motion, lantern glow, paper noise, map shimmer, and ultimate effects.
- Python scripts for recolor, palette adaptation, contact sheets, and tile previews.
- Blender or voxel output only as reference or raw material.

Do not use these as unreviewed final art.
Everything still needs Vamp Pon palette adaptation, gameplay readability review, and the relevant quality gate.

---

## 4. CC0 asset policy

Default: CC0 only unless explicitly approved.

Before adding any third-party asset, read:

- `docs/asset-sourcing-strategy.md`
- `docs/cc0-asset-sourcing-workflow.md`
- `docs/third-party-assets.md`
- `data/asset-licenses.json`

Rules:

- Record every third-party asset.
- Keep raw assets under `assets/vendor/cc0/`.
- Keep adapted assets under `assets/derived/cc0/`.
- Update `data/asset-licenses.json`.
- Update `docs/third-party-assets.md`.
- Downloaded assets are raw material, not final game art.
- Derived assets must still pass Aseprite hand-finish and the pixel-art quality gate before final-candidate.

Do not add assets with unknown, custom, non-commercial, no-derivatives, GPL, CC-BY, or CC-BY-SA licenses unless explicitly approved.

---

## 5. Read these files before pixel-art work

Before editing or reviewing any pixel-art asset, read:

- `CLAUDE.md`
- `docs/pixel-art/README.md`
- `docs/pixel-art/human-character-craft-guide.md`
- `docs/pixel-art/ng-patterns.md`
- `docs/pixel-art/agent-quality-brief.md`
- `docs/art-direction.md`
- `docs/reference-art-map.md`
- `docs/pixel-art-quality-gate.md`
- `docs/asset-quality-audit.md`
- `docs/pixel-art-production-workflow.md`
- `docs/aseprite-hand-finish-workflow.md`
- `docs/asset-sourcing-strategy.md`
- `docs/cc0-asset-sourcing-workflow.md`

For enemy work, also read:

- `docs/enemies/enemy-48-sprite-sheet-plan.md`
- `docs/enemies/omb-ombro-selected-direction.md`
- `data/enemy-assets/enemy-48-sprite-sheet-cells.json`
- `data/enemy-assets/enemy-design-catalog.json`
- every design file listed by `enemy-design-catalog.json`

For Claude-specific setups, also see:

- `.claude/agents/pixel-art-director.md`
- `.claude/skills/vamp-pon-pixel-art/SKILL.md`

Codex should follow the same art rules even though it may not load Claude-specific files automatically.

---

## 6. Aseprite hand-finish rule

An `.aseprite` file alone is not enough.

An asset may be called `hand-final candidate` only when all are true:

1. Reference difference has been reviewed.
2. Aseprite source exists.
3. Pixel-level finishing was performed in Aseprite.
4. Public PNG was exported from source.
5. 1x view was checked.
6. 4x view was checked.
7. Dark background visibility was checked.
8. Combat mock or equivalent gameplay composition was checked.
9. No quality gate score is 3 or lower.

If these are not true, keep the asset as `temporary`, `bootstrap`, or `candidate`.

---

## 7. Lua and script role

Lua is useful, but it is not the art director.

Lua/Aseprite scripts may be used for:

- canvas setup
- palette setup
- layer setup
- rough layout
- seed generation
- deterministic export
- sprite sheet export
- GIF / contact-sheet preview generation

Do not use script output alone as final art.

Lua/script should not decide:

- final visual appeal
- final silhouette
- final palette balance
- face charm
- cloth thickness
- prop appeal
- final background density
- final-candidate status

---

## 8. Pixel-art quality gate

Rate each asset from 1 to 5:

- 1x readability
- role clarity
- visual appeal
- gameplay visibility
- separation from background
- style consistency
- final-candidate confidence

For player characters or mascot-level assets, also rate:

- charm / appeal
- mascot silhouette
- merchandise potential

If any required score is 3 or lower, do not mark the asset as `final-candidate`.

---

## 9. Current art direction

The current art target is:

- soft painterly pixel art
- readable at 1x
- high-density but not muddy
- cute but gameplay-readable
- rounded silhouette
- soft shading
- not over-outlined
- visible on dark background
- unified across player, enemies, pickups, UI, and background

Avoid:

- symbolic placeholder sprites
- script-only geometry sprites
- black-only enemies
- busy backgrounds
- direct downscales of AI images
- pretty art that does not work in gameplay
- report-only improvements that do not show real before/after gains

---

## 10. Yui rule

Yui is the top priority among player assets, but Yui-specific rules do not replace the generic pixel-art craft rules.

Required Yui identity:

- large cute face
- round blue hood
- brown-red bangs
- cream / old-paper dress
- visible cloth thickness
- right-side lantern
- lantern separated from `hitCore`
- same person across front / side / back / poses

Work order:

1. `yui_idle_42` or `yui_master_52` depending on the explicit task.
2. `yui_move_42`
3. `yui_hurt_42`
4. `yui_ultimate_42`

Do not expand to other poses if idle/master is still weak.

---

## 11. Enemy rule

Enemies are a shared black-ink world, but must never become repeated black blobs.

Canonical enemy sources:

- exact 48-cell order: `data/enemy-assets/enemy-48-sprite-sheet-cells.json`
- complete visual/gameplay design: `data/enemy-assets/enemy-design-catalog.json`
- Omb/Ombro selected direction: `docs/enemies/omb-ombro-selected-direction.md`
- production/readiness rules: `docs/enemies/enemy-48-sprite-sheet-plan.md`

The canonical shared families are:

- `omb`: small soft shadow body, ink bud, old-paper square eyes, dark non-luminous flame aura
- `ombro`: lower and wider growth form with two drooping aura-hands
- Stage-unique grunts: three per Stage, each with a distinct silhouette and combat role
- midbosses: two per Stage, each with a readable attack telegraph and counterplay
- major bosses: Nanashino, Michishirube and Asamade with catalog-defined forms

Rules:

- Do not use legacy `pon_shadow`, `grown_pon_shadow`, `ポン影`, or `ふくらみポン影` names.
- Every enemy must differ by silhouette, body ratio, eye/light placement and gameplay role.
- Every damaging action must have a readable visual telegraph.
- Ombro pseudo-hands are aura formations, not human hands; no palm, fingers, nails, joints, bones or muscles.
- Generated 180px sheets are `prototype-reference` only.
- Do not directly downscale generated reference art into production sprites.
- Use the catalog's `nativePx` target when creating Aseprite sources.
- Preserve boss identity across forms; forms must not be palette-only swaps.
- Run `pnpm enemy48:design:check` before enemy reference or implementation work.
- Run `pnpm enemy48:sprites:verify` after a 1440x1080 sheet exists.

---

## 12. Background rule

Backgrounds are gameplay tiles, not illustration-only images.

They must be:

- low contrast
- subtle
- tileable
- readable under player/enemies/projectiles/pickups
- night / paper / map / forgotten-object themed

If the background looks impressive but hurts gameplay readability, reduce it.

---

## 13. Standard workflow for Codex

For any pixel-art task, do this order:

1. Inspect current files.
2. Read the generic pixel-art craft docs.
3. Read the asset-specific reference docs.
4. State what is wrong with the current asset.
5. State what must not be copied from the current asset.
6. Decide what the reference requires.
7. Modify Aseprite source or setup files.
8. Export from source.
9. Review 1x / 4x / dark background / gameplay composition.
10. Apply the quality gate.
11. Report unresolved issues.
12. Commit and push when the task asks for it.

For CC0-based work, also update `data/asset-licenses.json` and `docs/third-party-assets.md`.

---

## 14. Tests and checks

When relevant, run:

- `pnpm test`
- `pnpm build`
- `pnpm assets:verify`
- `pnpm enemy48:design:check`
- `pnpm enemy48:manifest:check`
- `pnpm enemy48:sprites:verify` when the sheet exists
- Aseprite export command, when Aseprite is available

If a check cannot be run, say so explicitly.

---

## 15. Reporting template

Use this template for pixel-art work:

```md
## Current problems

## Reference difference

## Pixel-art craft checks
- silhouette:
- focal point:
- cluster / noise:
- palette / value separation:
- outline:
- 1x / 4x / dark / gameplay:

## Source / license check
- source type:
- source URL:
- license:
- manifest updated:

## Aseprite hand-finish check
- source:
- script role:
- hand-finished areas:
- direct PNG edit: no

## Quality gate
| Item | Score | Notes |
| --- | ---: | --- |
| 1x readability |  |  |
| role clarity |  |  |
| visual appeal |  |  |
| gameplay visibility |  |  |
| background separation |  |  |
| style consistency |  |  |
| final confidence |  |  |

## Status

## Checks

## Unresolved

## Next step
```
