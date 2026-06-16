# Enemy Style Guide

Vamp Ponの敵素材はblack-ink worldとして統一する。ただし黒いだけの仮素材で終わらせない。

## Canonical sources

- `data/enemy-assets/enemy-48-sprite-sheet-cells.json`
- `data/enemy-assets/enemy-design-catalog.json`
- catalogの`designFiles`
- `docs/enemies/omb-ombro-selected-direction.md`
- `docs/enemies/enemy-48-sprite-sheet-plan.md`

## Common families

| id | silhouette | gameplay role | visual key |
|---|---|---|---|
| `omb` | low, soft dissolving shadow | small common chaser | ink bud + old-paper square eyes + dark shadow-flame aura |
| `ombro` | lower and wider shadow | medium pressure / reach | stronger aura + two drooping aura-hands |

各Stageにはオンブ1、オンブロ1、Stage固有雑魚3、中ボス2を配置する。

## Must keep

- black, dark navy, violet-black and blue-gray body values
- old-paper accents smaller and weaker than player lantern, pickup and hit core
- silhouette difference
- body-ratio difference
- readable eye/light placement
- readable attack telegraph
- darker than player but visible over the gameplay background
- scary-lite tone with some charm
- boss identity across forms

## Ombro pseudo-hands

- formed from the same shadow aura as the body
- droop into the ground while idle
- extend only during attacks
- tip may split into at most three blunt lobes
- no shoulder, elbow, palm, human fingers, nails, bones or muscles

## Avoid

- legacy `ink_blob` as the canonical common-family ID
- `pon_shadow`, `grown_pon_shadow`, ポン影, ふくらみポン影
- black circles with eyes only
- enemies differentiated only by color
- bright ordinary fire around Omb or Ombro
- player-like hood, clothing, hair or human hands
- background collision
- warm focal points that resemble pickups or hit core
- palette-only boss forms
- direct downscales of generated 180px reference art

## Quality target

Every enemy must read at 1x by silhouette and role. A generated reference remains `prototype-reference` until rebuilt and hand-finished in Aseprite.

Run:

```sh
pnpm enemy48:design:check
pnpm enemy48:manifest:check
pnpm enemy48:sprites:verify  # after the sheet exists
```
