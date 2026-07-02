# Unity U32 Texture Import Safety Review

## Scope

U32 reviews texture/import safety against the U29 policy without mass-changing import settings.

## Result

No broad import setting changes were applied. This avoids accidental visual regression in current Stage1 proof scenes.

## Classification

- Pixel/prototype sprites: keep as reference until Unity-finished assets exist.
- Paper UI: preserve alpha and readability; do not over-compress.
- Icons: review at card and reward sizes before production import.
- VFX/effects: separate from UI atlas and keep climax effects readable.
- Fullscreen/reference/generated docs assets: blocked from runtime and not atlas candidates.

## Import Safety Notes

- Filter mode remains a review item per asset group.
- Platform compression is not finalized.
- Max texture size is not finalized.
- Mipmaps remain off by policy for UI and small sprites, but U32 does not mass-edit importers.
- Readable flag should be off for runtime after processing, but U32 does not bulk-toggle it.
- Alpha preservation remains required for UI, pickup, icon, and effect sprites.

## Next Action

Perform production import settings after final asset replacement and compare 390x844 screenshots against the current in-repo baseline.
