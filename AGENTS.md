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

## 2. Use useful sources, but do not lower quality

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

## 3. CC0 asset policy

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

## 4. Read these files before pixel-art work

Before editing or reviewing any pixel-art asset, read:

- `CLAUDE.md`
- `docs/art-direction.md`
- `docs/reference-art-map.md`
- `docs/pixel-art-quality-gate.md`
- `docs/asset-quality-audit.md`
- `docs/pixel-art-production-workflow.md`
- `docs/aseprite-hand-finish-workflow.md`
- `docs/asset-sourcing-strategy.md`
- `docs/cc0-asset-sourcing-workflow.md`

For Claude-specific setups, also see:

- `.claude/agents/pixel-art-director.md`
- `.claude/skills/vamp-pon-pixel-art/SKILL.md`

Codex should follow the same art rules even though it may not load Claude-specific files automatically.

---

## 5. Aseprite hand-finish rule

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

## 6. Lua and script role

Lua is useful, but it is not the art director.

Lua/Aseprite scripts may be used for:

- canvas setup
- palette setup
- layer setup
- rough layout
- seed generation
- deterministic export
- sprite sheet export

Do not use script output alone as final art.

Lua/script should not decide:

- face charm
- cloth thickness
- prop appeal
- final background density
- final-candidate status

---

## 7. Pixel-art quality gate

Rate each asset from 1 to 5:

- 1x readability
- reference match
- charm / appeal
- gameplay visibility
- separation from background
- style consistency
- final-candidate confidence

If any score is 3 or lower, do not mark the asset as `final-candidate`.

---

## 8. Current art direction

The current art target is:

- soft painterly pixel art
- readable at 1x
- high-density but not muddy
- cute but gameplay-readable
- large readable face for player characters
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

---

## 9. Yui rule

Yui is the top priority.

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

1. `yui_idle_42`
2. `yui_move_42`
3. `yui_hurt_42`
4. `yui_ultimate_42`

Do not expand to other poses if idle is still weak.

---

## 10. Enemy rule

Enemies are a black-ink family, but should not be black blobs only.

The four base enemy families are:

- `ink_blob`
- `torn_paper_wisp`
- `hooded_ink_specter`
- `ink_hound`

Each enemy must differ by silhouette, eye/light placement, and gameplay role.

---

## 11. Background rule

Backgrounds are gameplay tiles, not illustration-only images.

They must be:

- low contrast
- subtle
- tileable
- readable under player/enemies/projectiles/pickups
- night / paper / map / forgotten-object themed

If the background looks impressive but hurts gameplay readability, reduce it.

---

## 12. Standard workflow for Codex

For any pixel-art task, do this order:

1. Inspect current files.
2. Read the reference docs.
3. State what is wrong with the current asset.
4. State what must not be copied from the current asset.
5. Decide what the reference requires.
6. Modify Aseprite source or setup files.
7. Export from source.
8. Review 1x / 4x / dark background / gameplay composition.
9. Apply the quality gate.
10. Report unresolved issues.
11. Commit and push when the task asks for it.

For CC0-based work, also update `data/asset-licenses.json` and `docs/third-party-assets.md`.

---

## 13. Tests and checks

When relevant, run:

- `pnpm test`
- `pnpm build`
- `pnpm assets:verify`
- Aseprite export command, when Aseprite is available

If a check cannot be run, say so explicitly.

---

## 14. Reporting template

Use this template for pixel-art work:

```md
## Current problems

## Reference difference

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
| reference match |  |  |
| charm / appeal |  |  |
| gameplay visibility |  |  |
| background separation |  |  |
| style consistency |  |  |
| final confidence |  |  |

## Status

## Checks

## Unresolved

## Next step
```
