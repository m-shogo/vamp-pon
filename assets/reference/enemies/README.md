# Enemy References

Enemy reference assets live here.

## Current canonical sheet

```txt
assets/reference/enemies/enemy-48-sheet/enemy-48-sprite-sheet-v1.png
```

Canonical data and rules:

- `data/enemy-assets/enemy-48-sprite-sheet-cells.json`
- `data/enemy-assets/enemy-design-catalog.json`
- `docs/enemies/omb-ombro-selected-direction.md`
- `docs/enemies/enemy-48-sprite-sheet-plan.md`

The common enemy families are `omb` and `ombro`.

- Omb: small soft shadow with an ink bud, old-paper square eyes, and dark non-luminous shadow-flame aura.
- Ombro: lower and wider growth form with two drooping aura-hands.

The generated 180px sheet is reference only. Production enemy sprites must be rebuilt and hand-finished in Aseprite at the catalog's native target size.

Run `pnpm enemy48:design:check` before reference production and `pnpm enemy48:sprites:verify` after the complete sheet exists.
