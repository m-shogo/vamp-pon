# Codex Pixel Art Workflow

This document explains how Codex should handle Vamp Pon pixel-art work.

The goal is to make Codex follow the same art-quality rules as Claude/Fable.

---

## 1. Primary instruction file

Codex should read `AGENTS.md` first.

`AGENTS.md` is the Codex-facing equivalent of `CLAUDE.md` for this project.

---

## 2. Important rule

Aseprite must be used as the final craft tool.

Do not treat script-generated output as final art.

A valid hand-final candidate requires:

- reference review
- Aseprite source
- pixel-level hand finishing
- source-based export
- 1x review
- 4x review
- dark background review
- combat mock review
- quality gate pass

---

## 3. Script role

Lua/Aseprite scripts are allowed for setup and export support.

Good uses:

- canvas setup
- palette setup
- layer setup
- rough layout
- seed generation
- export support

Bad use:

- final charm decision
- final character design judgment
- final-candidate label without hand finish

---

## 4. Codex prompt header

Use this header when asking Codex to work on pixel art:

```txt
Read AGENTS.md first.
Read docs/aseprite-hand-finish-workflow.md.
This is Aseprite-first, script-assisted work.
Do not treat Lua/script output as final art.
Use scripts only for setup, palette, layers, rough layout, or export support.
Final-candidate requires pixel-level hand finishing in Aseprite and must pass 1x / 4x / dark background / combat-mock review.
```

---

## 5. Recommended first real task

Do not remake all assets at once.

Start with:

1. Review current `yui_idle_42` against the new reference.
2. Mark which parts are only size/structure reference.
3. Rework `yui_idle_42` in Aseprite-first workflow.
4. Keep move/damage/ultimate unchanged until idle passes the quality gate.

---

## 6. Why this exists

Previous attempts used Aseprite source files, but some assets were still script-shaped and symbolic.
This workflow exists to make sure Aseprite is used for actual pixel-level finishing, not just as a file format.
