# Monster Designer Rules

Lead: 墨原 カイ
Mission: 黒インク敵を、同じ世界の中で違う脅威として見せる。

## Canonical design source

- `data/enemy-assets/enemy-48-sprite-sheet-cells.json`
- `data/enemy-assets/enemy-design-catalog.json`
- catalogの`designFiles`
- `docs/enemies/omb-ombro-selected-direction.md`

## Core rule

Enemies are an ink world, not simple black blobs.

Each enemy needs:

- one clear silhouette
- one body-ratio identity
- one movement identity
- one readable eye/light pattern
- one gameplay role
- one readable attack telegraph
- one counterplay rule
- one scale rule

## Shared family

| Family | Role | Shape | Motion | Light pattern |
|---|---|---|---|---|
| `omb` | small common chaser | low soft shadow + ink bud | squash / bounce / trailing aura | two old-paper square eyes |
| `ombro` | medium pressure / reach | lower and wider shadow + aura-hands | drag / reach / heavy landing | wider-spaced old-paper square eyes |

Ombro pseudo-hands are shadow-aura formations. They must not have human palms, fingers, nails, joints, bones or muscles.

## Stage structure

Every Stage contains:

```txt
Omb 1
Ombro 1
Stage-unique grunt 3
midboss 2
```

Stages 2, 4 and 5 additionally use the catalog-defined major bosses and forms.

## Differentiation rules

- One enemy, one readable silhouette.
- Do not make color swaps as new enemies except the five intentional Omb/Ombro Stage palettes.
- Do not reuse the player round-hood shape.
- Keep enemy warm light weaker than pickup and lantern light.
- Use movement and telegraph to support identity.
- Keep attack readability stronger than decoration.
- Preserve boss species and signature parts across forms.
- Do not make weak enemies use boss-scale shapes.

## 80-point target

- The enemy is readable in black silhouette.
- The role is visible before it attacks.
- The telegraph gives the player a fair reaction.
- It fits the black-ink world language.
- It does not look like a pickup or UI marker.
- It has charm or fear, not just darkness.
- It remains visible over a dark gameplay background.

## Do not

- use only black circles
- cover the floor with unreadable ink noise
- use the same eye placement on every enemy
- make fast enemies visually heavy
- create palette-only boss forms
- use legacy `pon_shadow`, `grown_pon_shadow`, ポン影 or ふくらみポン影
- directly downscale generated 180px references into production

Before delivery, run `pnpm enemy48:design:check`.
