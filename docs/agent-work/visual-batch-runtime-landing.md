# Visual Batch V1 — Runtime Landing Contract

This is the short handoff from generated UI art to Unity runtime. It does not approve any generated image as final.

## Scope

Repository only: `m-shogo/vamp-pon`.

Generated review candidates live under the `outputRoot` recorded in:

`docs/agent-work/visual-asset-generation-queue.json`

Only a candidate chosen for runtime comparison is copied/staged into:

`unity/VampPonUnity/Assets/_Project/Resources/VisualBatchV1/UI/`

The filename stem must exactly match `VisualBatchAssetProvider`.

## Runtime file stems

### StageSelect
- `stage-map-paper-base`
- `selected-destination-frame`
- `station-route-icon`

### Result
- `memory-page-base`
- `result-rank-seal`
- `result-reward-card`
- `result-stat-chip`

### Collection
- `collection-page-base`
- `entry-card-unlocked`
- `entry-card-locked`
- `collection-tab-active`
- `collection-tab-inactive`
- `new-seal`
- `detail-memory-page`

### LevelUp
- `levelup-card-normal`
- `levelup-card-selected`
- `levelup-card-rare`
- `levelup-card-evolution`

### Battle HUD
- `battle-hud-top-frame`
- `battle-hud-inventory-panel`
- `battle-hud-slot-frame`
- `battle-virtual-stick-ring`
- `battle-virtual-stick-knob`

## Import policy

For these UI surfaces:

- Texture Type: Sprite (2D and UI)
- Sprite Mode: Single
- sRGB: on for authored color assets
- Alpha Source: input texture alpha where used
- Alpha Is Transparency: on for transparent frames/masks
- Read/Write: off
- Mip Maps: off
- Wrap: Clamp
- Filter: Bilinear for paper/frame UI art
- iPhone compression: ASTC 6x6 unless a measured artifact requires a scoped exception

Frames/panels that stretch in runtime must be authored with safe quiet borders and configured as sliced sprites after the actual image exists. Do not fake a Sprite atlas by giving `Resources.Load<Sprite>` a whole sheet.

## Runtime ownership boundary

Generated UI images may own material texture, frame silhouette, paper grain, seals, or decorative chrome.

They must not bake:

- gameplay numbers
- HP/EXP/Kokuyou values
- stage names
- collection entry names
- LevelUp option text
- Result numbers/text
- selected/locked runtime state that code already owns

## Candidate rule

A file being present in `VisualBatchV1/UI` means “runtime comparison candidate is available”, not “final approved”. Existing evidence/readiness flags are not changed by file placement alone.

If a new batch asset is absent, runtime falls back to the current U45/U46 candidate asset. This allows one family to be reviewed at a time without breaking unrelated screens.

## Claude → Codex instruction

After generating a queue item, keep all attempts in the task `incoming/` directory. Stage only the chosen comparison candidate(s) into `VisualBatchV1/UI` with the exact stems above, let Unity generate/commit the corresponding `.meta` files with the import policy above, run relevant Unity/static checks, and commit. Do not bulk-stage rejected attempts.
