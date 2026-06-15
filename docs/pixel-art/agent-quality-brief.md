# Agent Quality Brief for Pixel Art

This file is for Claude, Codex, and other agents working on Vamp Pon pixel art.

## Main rule

Do not treat generated assets as finished art.

A useful draft is welcome. A misleading production update is not.

## Required workflow

1. Read the art direction and pixel-art guides.
2. State the current asset problems before editing.
3. Decide what must be kept and what must be discarded.
4. Work on draft or prototype paths first.
5. Create before/after comparison images.
6. Check 1x, 4x, dark background, and gameplay composition.
7. Score the quality gate honestly.
8. Promote to production only if every required score is high enough.

## If using scripts

Scripts may help with:

- canvas setup
- palette setup
- layer setup
- deterministic export
- sprite sheet generation
- GIF preview generation

Scripts must not decide:

- face charm
- final silhouette
- final costume appeal
- final lantern appeal
- final-candidate status

## Required evidence for production promotion

A player sprite cannot move to production unless the work includes:

- source path
- exported PNG path
- before/after image
- dark background check
- gameplay or combat mock check
- review document
- quality gate
- export command
- proof that production PNG was not directly hand-edited

## Quality gate minimums for Yui

The following must be 4 or higher:

- 1x readability
- reference match
- charm / appeal
- mascot silhouette
- merchandise potential
- gameplay visibility
- background separation

If any are lower, keep the work as draft.

## Strong warning signs

Stop and report draft status if any of these are true:

- The sprite still looks like generated geometry.
- The face is readable but not charming.
- The hood dominates the body.
- The lantern does not read as a held object.
- The before/after comparison is weak.
- The report says polish, but the pixels did not visibly improve.

## Good report format

```md
## Current problems

## Kept / discarded

## What changed visually

## Before / after

## 1x / 4x / dark / gameplay review

## Quality gate

## Status
- draft / temporary / production-candidate / final-candidate

## Production touched
- yes / no

## Next step
```

## Never repeat this failure mode

Do not make a production commit that says it is hand-finished if the actual work is script output or source preparation only.

If GUI hand finishing was not done, say so and keep the asset as draft.
