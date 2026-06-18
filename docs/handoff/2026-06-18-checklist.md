# 2026-06-18 Checklist

## Scope

Only work on the Vamp Pon repository.

## Already changed

- Background fallback cleanup
- New enemy behaviors: charger, orbit chase, coward
- Enemy roles renamed toward Ombu and Ombro
- Stage 1 early waves retuned for the first 150 seconds
- Berserk fatigue state added
- Berserk fatigue movement slowdown added
- Enemy behavior tests updated
- Berserk tests updated
- Fun pass note added at docs/150-survivors-like-fun-pass.md
- Stage 1 verification command added: `pnpm stage1:fun-pass:verify`
- Playtest/debug snapshot separated and throttled
- Evolution/fusion/awakening duplicate and reappearance guards added
- Level-up rarity is color-only; star/label wording removed
- Early level choices guarantee at least one discovery option
- Evolution/fusion/awakening hints added to choice descriptions
- Evolution/fusion/awakening presentation motifs added
- Inventory level badges improved for mobile readability
- Stage1 wave integrity tests added
- Elite warning, final 10-second countdown, and dawn clear transition added

## Image handoff source of truth

Use:

```txt
docs/151-stage1-image-delivery-list.md
```

P0 image delivery:

```txt
public/assets/prototypes/sprite-sheets/core5-original/yui-sprite-sheet-v1.png
public/assets/prototypes/cutins/yui-ultimate-780x360-rgba.png
public/assets/prototypes/cutins/yui-berserk-780x360-rgba.png
```

Do not redraw the five backgrounds, enemy sheets, or 27 inventory originals unless a playtest exposes a concrete quality problem.

## Effect/rendering direction

Use:

```txt
docs/152-stage1-effects-rendering-plan.md
```

Stage1 gameplay remains Phaser/WebGL only.
Do not add Three.js to gameplay. Re-evaluate it later only for isolated title/gallery paper-diorama screens.

## Verify first

Run:

```bash
pnpm stage1:fun-pass:verify
```

This command runs:

- runtime asset source verification
- Vitest
- TypeScript and Vite production build

If it fails, fix the smallest cause first.

## Manual playtest

Play Stage 1 from 0 to 480 seconds on a mobile sized viewport.

Check:

- Basic Ombu feels soft and satisfying
- Charger enemy is readable and not unfair
- Orbit enemy does not close all escape routes
- Coward capsule can still be chased and defeated
- Elite warnings appear shortly before 150 / 300 / 420 seconds
- First elite at 150 seconds is not too early
- Level 2 is not too slow
- Level 2-4 choices include a new weapon or passive while the build is small
- The road to level 5 feels less empty
- Evolution/fusion/awakening hints fit inside cards
- Evolution/fusion/awakening effects remain readable during combat
- Inventory level numbers are readable on a phone
- Final 10-second countdown does not hide enemies or projectiles
- Dawn clear transition runs once and reaches the result screen

## Next implementation candidates

1. Add ultimate and berserk cut-in asset loading with fallback
2. Add or tune berserk attack afterimages
3. Add or tune berserk fatigue screen feedback
4. Add short quiet/reward beats after elite defeats
5. Tune Stage 1 waves from 150 to 480 seconds after a full run
6. Add weapon-specific hit and trail effects
7. Add audio hooks for hit, kill, capsule, evolution, berserk, and clear

## Do not

- Do not make enemies harder only by increasing HP
- Do not add dense unreadable UI
- Do not mix berserk gauge with ultimate gauge
- Do not overwrite image assets blindly
- Do not add Three.js to Stage1 gameplay
- Do not touch other repositories
