# Enemy Prototype Runtime Bridge

## Status

- source images: `public/assets/prototypes/sprite-sheets/enemies-original/`
- sheet contract: 8 columns × 6 rows / 48 cells / 180×180px per cell
- runtime status: visual bridge enabled for the current legacy six-enemy loop
- production status: still `prototype-reference`

This bridge makes the uploaded 48-enemy sheet visible in the playable game without changing enemy stats, collision radii, spawn timing or behaviors.

## Runtime source selection

The loader checks these files in order and uses the first existing one:

1. `最初のモンスター横横向き.png`
2. `最初のモンスター横向き.png`

The selected file is loaded as a Phaser sprite sheet with 180×180px frames.
If neither file exists, the existing enemy image / Graphics fallback path remains active and the game still starts.

## Current visual mappings

| Legacy runtime visual | Canonical cell | Current use |
|---|---:|---|
| `enemy_ink_blob` | 01 | オンブ・欠片色 |
| `enemy_paper_scrap` | 03 | 紙くずの影 |
| `enemy_haze` | 04 | 夜のもや |
| `enemy_capsule` | 13 | 箱影 temporary visual alias |
| `enemy_signpost` | 18 | 迷子の方角 |
| `enemy_elite_label` | 26 | 紙墓の大喰らい temporary visual alias |

The two temporary aliases exist only to remove placeholder visuals from the current playable loop. They do not rename or promote the legacy gameplay definitions.

## Deliberate non-changes

- no enemy HP / speed / damage changes
- no collision-radius changes
- no wave changes
- no behavior-profile migration
- no generated reference is called production or hand-final
- no 180px reference is exported as a fake native-size final asset

The full ID and behavior migration still follows `docs/enemies/enemy-runtime-migration-plan.md`.

## Verification

Run:

```sh
pnpm test
pnpm build
```

Manual review:

1. Start the normal game.
2. Confirm the six currently spawned enemy visuals use sheet art rather than geometric fallback.
3. Confirm enemies remain centered and readable on the dark Stage background.
4. Confirm hit detection and damage behavior are unchanged.
5. Remove or rename both source sheets temporarily and confirm Graphics fallback still works.
