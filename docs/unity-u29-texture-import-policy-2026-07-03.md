# Unity U29 Texture Import Policy

## Scope

U29 defines policy only. It does not bulk-edit existing candidate texture import settings or claim platform compression is final.

## Runtime Categories

- pixel art / 180x180 frame assets: Sprite, alpha from input, mipmap off, readable off after processing, PPU kept consistent per character/enemy runtime decision.
- paper UI: Sprite, bilinear acceptable when soft paper texture is intended, mipmap off for UI, alpha preserved.
- 64px item icon assets: Sprite, max texture size 128 or 256 draft, mipmap off, readable off after import.
- VFX / ink / lantern: Sprite, alpha preserved, compression conservative until edge fringe is checked.
- fullscreen art / cut-ins: not packed with small gameplay sprites; separate policy and memory budget.
- generated screenshots / design-target images: runtime対象外.

## Draft Settings

- filter mode: pixel art uses Point unless final art intentionally uses soft edges; paper UI can use Bilinear.
- compression: use lightweight mobile compression only after visual QA; avoid fringe on alpha-heavy assets.
- max texture size: 180x180 cells stay small; UI panels capped by actual display needs; fullscreen art separate.
- alpha: preserve transparency; no opaque edge pixels.
- mipmap: off for 2D UI / sprites unless specific scaled world sprite needs it.
- readable flag: off for runtime after deterministic processing.
- PPU: keep scale consistent across related sprites; do not change gameplay constants in U29.

## Do Not Touch

Do not treat generated final images, design targets, screenshots, or review contact sheets as runtime sprites. Do not recreate retired `public/assets/sprites`.
