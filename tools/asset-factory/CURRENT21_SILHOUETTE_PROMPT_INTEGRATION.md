# Asset Factory — Current21 Silhouette Prompt Integration

Date: 2026-08-10  
Status: **CURRENT CHARACTER GENERATION CONTRACT**

## Source chain

```txt
characterThemeColors.ts
+ current21SilhouetteMatrix.ts
+ characterSilhouetteCanon.ts
↓
characterVisualGenerationBriefs.ts
↓
assetFactoryCharacterPrompts.ts
↓
Asset Factory Character Prompts UI
```

The Asset Factory must not recreate body shape or pose from memory.

## What is automatically injected

For every Current20 Character Database prompt pack:

- primary HEX
- accent HEX
- favorite constellation
- Star Beast
- 3-second silhouette
- posture
- clothing shape
- Named Object anchor
- motion signature
- ensemble placement
- hard visual direction when one exists
- generation guards / negative guidance

This applies to all nine existing prompt kinds:

1. sprite sheet
2. character reference
3. normal cutin
4. dawn cutin
5. kokuyou cutin
6. emblem blank
7. emblem normal
8. emblem dawn
9. emblem kokuyou

## Hana / Kaname

Hard lock IDs:

```txt
hana
kage1
```

Every generated prompt / checklist must preserve:

- Hana = plus-size older woman
- Kaname = plus-size young adult man

Never:

- auto-slim
- convert Kaname to a bodybuilder triangle
- make body size the joke
- make body size the black-youka corruption
- use weight loss / younger body as Dawn reward
- silently change hitbox / speed / stamina because of body size

## Reference-first workflow

Recommended order per character:

```txt
character_reference
↓ human / QA review
sprite_sheet_180
↓
normal_cutin
↓
dawn_cutin
↓
kokuyou_cutin
↓
emblem phases
```

The reference establishes body proportion, posture, clothing mass and Named Object placement.
Later assets should preserve that identity instead of reinterpreting the character from scratch.

## Reserve Ren boundary

Ren is included in Current21 silhouette coverage.

The existing Asset Factory Character Database is Current20 production scope, so this integration does **not** automatically promote Ren into that 20-character prompt pack or runtime playable list.
A dedicated reserve/future prompt route should be added only when production scope requires it.

## QA

At minimum verify:

- body / age hard facts survive the crop
- posture is not replaced by a generic hero pose
- Named Object is readable
- Star Beast does not replace the character as the focal subject
- 390x844 mobile readability
- silhouette remains consistent between reference / sprite / cutins
- black-youka changes the wrong-arrival expression and light behavior, not the person's body identity

> **Generate from Current data, not from memory. The same character must remain the same person across every asset kind.**
