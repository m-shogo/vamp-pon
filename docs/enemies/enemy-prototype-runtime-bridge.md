# Enemy Prototype Runtime Bridge

## Status

- source images: `public/assets/prototypes/sprite-sheets/enemies-original/`
- sheet contract: 8 columns × 6 rows / 48 cells / 180×180px per cell
- runtime status: directional visual bridge enabled for the current legacy six-enemy loop
- production status: still `prototype-reference`

This bridge makes the uploaded 48-enemy sheets visible in the playable game without changing enemy stats, collision radii, spawn timing or behaviors.

## Runtime source selection

The runtime loads two 1440×1080 RGBA sheets:

1. front-facing runtime source: `enemy-48-right-1440x1080-rgba.png`
2. left-facing runtime source: `enemy-48-left-1440x1080-rgba.png`

The first filename is kept from the asset drop, but its runtime role is `front`. Runtime identifiers use `front` so the temporary upload name does not spread through game code.

Each file is loaded as a Phaser sprite sheet with 180×180px frames. The 96 individual files under `left-180/` and `right-180/` remain source/reference material and are not queued individually during gameplay.

If only one directional sheet exists, it is used as a fallback. If neither exists, the existing enemy image / Graphics fallback path remains active and the game still starts.

## Direction rules

- strongly vertical movement: front-facing sheet
- leftward horizontal or diagonal movement: left-facing sheet
- rightward horizontal or diagonal movement: left-facing sheet with `flipX=true`
- no right-facing runtime texture is required

This avoids storing and loading a third runtime direction while keeping enemy movement readable.

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
3. Confirm enemies approaching vertically show the front sheet.
4. Confirm enemies moving left show the left sheet.
5. Confirm enemies moving right show the same left sheet mirrored horizontally.
6. Confirm enemies remain centered and readable on the dark Stage background.
7. Confirm hit detection and damage behavior are unchanged.
8. Remove or rename both source sheets temporarily and confirm Graphics fallback still works.
