# Yui sprite final package

## Files

- `yui-basic-48-final-1440x1080.png`
- `yui-expression-rage-48-final-1440x1080.png`
- `frames/basic/` — 48 individual 180x180 PNG frames
- `frames/expression-rage/` — 48 individual 180x180 PNG frames
- `manifest.json`
- `qa-report.json`
- `previews/`

## Verified technical format

- 1440x1080 px
- 8 columns x 6 rows
- 180x180 px per cell
- PNG RGBA
- Real alpha transparency
- 48 non-empty cells per sheet
- No cell-edge contact

## Important source note

The supplied basic design source visually contained 46 major original cells rather than 48.
Two missing implementation slots were completed as derived placeholders:

- R1C8 `ready_right`: mirrored from the existing side-ready frame
- R2C8 `walk_back_b`: derived from the existing back-walk frame with a changed lower-body step phase

The package is technically usable now. For final art-direction perfection, these two frames are the only cells that still merit a dedicated hand-drawn replacement.
