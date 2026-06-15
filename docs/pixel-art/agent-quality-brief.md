# Agent Quality Brief for Pixel Art

This file is for Claude, Codex, and other agents working on Vamp Pon pixel art.

## Main rule

Do not treat generated assets as finished art.

A useful draft is welcome. A misleading production update is not.

This applies to:

- player sprites
- enemies
- pickups
- UI icons
- props
- backgrounds
- effects

## Required workflow

1. Read the art direction and pixel-art guides.
2. State the current asset problems before editing.
3. Decide what must be kept and what must be discarded.
4. Work on draft or prototype paths first.
5. Create before/after comparison images when visuals changed.
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
- contact sheets
- dark background previews

Scripts must not decide:

- final visual appeal
- final silhouette
- final palette balance
- final prop appeal
- final background density
- final-candidate status

## Required evidence for production promotion

A visual asset cannot move to production unless the work includes:

- source path
- exported PNG path
- before/after image or visual comparison
- dark background check when relevant
- gameplay or mock check when relevant
- review document
- quality gate
- export command or generation command
- proof that production PNG was not directly hand-edited

## Generic quality gate minimums

The following must be 4 or higher for production work:

- 1x readability
- role clarity
- visual appeal
- gameplay visibility
- background separation
- style consistency

For player characters or mascot-level assets, also require:

- charm / appeal
- mascot silhouette
- merchandise potential

If any required score is lower, keep the work as draft.

## Strong warning signs

Stop and report draft status if any of these are true:

- The sprite still looks like generated geometry.
- The focal point is readable but not appealing.
- One mass dominates the whole asset.
- Props or effects do not connect to their source.
- The before/after comparison is weak.
- The report says polish, but the pixels did not visibly improve.
- The background looks good alone but hurts gameplay readability.

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

Do not make a production commit that claims finished visual craft if the actual work is script output or source preparation only.

If final pixel-level work was not done, say so and keep the asset as draft.
