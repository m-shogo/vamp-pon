# Enemy 48 Sprite Sheet Plan

## Status

- status: `design-ready`
- all 48 cells have complete visual and gameplay briefs
- generated image status: `prototype-reference`
- production status: Aseprite source and hand-finish still required
- runtime status: existing six-enemy implementation is legacy and migrates separately

## Canonical sources

- cell order and sheet contract: `data/enemy-assets/enemy-48-sprite-sheet-cells.json`
- design catalog index: `data/enemy-assets/enemy-design-catalog.json`
- detailed records: the eight `enemy-design-stage-*.json` files listed by the catalog
- selected common-family direction: `docs/enemies/omb-ombro-selected-direction.md`
- generation prompt: `assets/concept-design/06_prompts/enemy-48-sprite-sheet-generation-prompt.md`
- readiness decision: `docs/enemies/enemy-48-production-readiness.md`
- runtime migration: `docs/enemies/enemy-runtime-migration-plan.md`

## Distribution

```txt
grunts                  25
  Omb variants           5
  Ombro variants         5
  Stage-unique grunts    15
midbosses               10
boss base forms          3
boss alternate forms    10
total                    48
```

Each Stage uses exactly:

```txt
Omb                 1
Ombro               1
Stage-unique grunt  3
midboss             2
```

Stages 2, 4 and 5 additionally contain the major bosses and their visual forms.

## Common family: Omb / Ombro

The selected direction is fixed for reference production:

- Omb: soft shadow body, one ink bud, two old-paper square eyes, dark non-luminous flame-like aura
- Ombro: lower and wider, stronger aura, two drooping aura-hands
- Ombro hands are not human hands; no shoulder, elbow, palm, fingers, nails or bones
- hand tips remain round while idle and split into at most three blunt lobes only during attack
- five Stage variants preserve silhouette, face, camera angle and animation timing
- Stage color is secondary; at least 70% of the body remains black-ink family

## Major-boss timer rule

During a major boss:

- pause Stage survival timer
- pause normal wave progression
- pause normal spawn
- pause time-based difficulty growth
- continue player control, attacks, cooldowns, invulnerability and status durations
- continue boss internal phase time and boss gimmicks
- do not add boss duration to survival time
- resume after boss defeat and result transition

## Exact sheet order

| No. | Stage | Tier | Name | Role | Native target |
|---:|---:|---|---|---|---:|
| 01 | 1 | grunt | オンブ・欠片色 | `bounce_chase` | 42px |
| 02 | 1 | grunt | オンブロ・欠片色 | `heavy_reach` | 52px |
| 03 | 1 | grunt | 紙くずの影 | `fast_chase` | 42px |
| 04 | 1 | grunt | 夜のもや | `swarm` | 48px |
| 05 | 1 | grunt | 消し跡虫 | `zigzag_slow` | 42px |
| 06 | 2 | grunt | オンブ・名札色 | `bounce_chase` | 42px |
| 07 | 2 | grunt | オンブロ・名札色 | `heavy_reach` | 52px |
| 08 | 2 | grunt | 名札影 | `prop_attract` | 46px |
| 09 | 2 | grunt | 名前喰い | `silence_bite` | 48px |
| 10 | 2 | grunt | 呼び声コウモリ | `arc_flyer` | 48px |
| 11 | 3 | grunt | オンブ・封箱色 | `bounce_chase` | 42px |
| 12 | 3 | grunt | オンブロ・封箱色 | `heavy_reach` | 52px |
| 13 | 3 | grunt | 箱影 | `orbit_guard` | 48px |
| 14 | 3 | grunt | 鍵穴蜘蛛 | `bind` | 50px |
| 15 | 3 | grunt | 封蝋ガニ | `frontal_guard` | 52px |
| 16 | 4 | grunt | オンブ・切符色 | `bounce_chase` | 42px |
| 17 | 4 | grunt | オンブロ・切符色 | `heavy_reach` | 52px |
| 18 | 4 | grunt | 迷子の方角 | `offset_chase` | 48px |
| 19 | 4 | grunt | 逆走ネズミ | `reverse_dash` | 44px |
| 20 | 4 | grunt | 改札バサミ | `lane_block` | 52px |
| 21 | 5 | grunt | オンブ・灯火色 | `bounce_chase` | 42px |
| 22 | 5 | grunt | オンブロ・灯火色 | `heavy_reach` | 52px |
| 23 | 5 | grunt | 火消し蛾 | `light_charge` | 50px |
| 24 | 5 | grunt | 残り火ウサギ | `jump_chase` | 46px |
| 25 | 5 | grunt | 朝隠しカラス | `screen_dim` | 50px |
| 26 | 1 | midboss | 紙墓の大喰らい | `absorb_growth` | 72px |
| 27 | 1 | midboss | にじみの母 | `summoner` | 72px |
| 28 | 2 | midboss | 名を呼ばぬ司書 | `weapon_lock` | 76px |
| 29 | 2 | midboss | 百面ラベル | `decoy` | 76px |
| 30 | 3 | midboss | 内鍵の番人 | `directional_guard` | 76px |
| 31 | 3 | midboss | 封蝋の女王 | `shield_support` | 80px |
| 32 | 4 | midboss | 終着駅の車掌 | `forced_lane` | 80px |
| 33 | 4 | midboss | 帰らずの機関獣 | `screen_dash` | 84px |
| 34 | 5 | midboss | 灯喰らいの大蛾 | `light_absorb` | 84px |
| 35 | 5 | midboss | 朝を縫う魔女影 | `arena_shrink` | 80px |
| 36 | 2 | boss | 三路喰らい《ナナシノ》 | `multi_head` | 128px |
| 37 | 4 | boss | 帰路巨鹿《ミチシルベ》 | `railfield` | 128px |
| 38 | 5 | boss | 夜綴じ六翼竜《アサマデ》 | `multi_phase` | 144px |
| 39 | 2 | boss_form | ナナシノ・鎖断ち形態 | `phase_2` | 132px |
| 40 | 2 | boss_form | ナナシノ・二首暴走形態 | `phase_3` | 132px |
| 41 | 2 | boss_form | ナナシノ・名札核形態 | `phase_4` | 136px |
| 42 | 4 | boss_form | ミチシルベ・線路角展開形態 | `phase_2` | 136px |
| 43 | 4 | boss_form | ミチシルベ・逆転時計形態 | `phase_3` | 136px |
| 44 | 4 | boss_form | ミチシルベ・駅心核露出形態 | `phase_4` | 140px |
| 45 | 5 | boss_form | アサマデ・夜頁封鎖形態 | `phase_2` | 148px |
| 46 | 5 | boss_form | アサマデ・記憶混線形態 | `phase_3` | 148px |
| 47 | 5 | boss_form | アサマデ・残火守護形態 | `phase_4` | 148px |
| 48 | 5 | boss_form | アサマデ・朝割れ形態 | `phase_5` | 152px |

## Sheet contract

```txt
canvas: 1440x1080px
grid: 8 columns x 6 rows
cell: 180x180px
format: PNG color type 6 / true RGBA
background: alpha 0
cells: 48 non-empty
safe border: 4px transparent on every edge of every cell
```

No text, number, frame, grid, background, floor or checkerboard may be drawn into the sheet.

## Production states

| State | Meaning |
|---|---|
| `design-ready` | visual/gameplay brief is complete enough to draw |
| `prototype-reference` | generated or composited reference; not production |
| `aseprite-source` | editable source exists; not necessarily hand-finished |
| `hand-final-candidate` | Aseprite finish + 1x/4x/dark/combat review + quality gate |
| `production` | approved exported game asset |

All 48 records are currently `design-ready`. None are automatically `hand-final-candidate`.

## Mechanical checks

```sh
pnpm enemy48:design:check
pnpm enemy48:manifest:check
pnpm enemy48:sprites:verify
```

The design check validates:

- exactly 48 records and 48 cells
- 25 / 10 / 3 / 10 tier distribution
- Omb 5 / Ombro 5 / Stage-unique 15
- each Stage has Omb 1 / Ombro 1 / unique 3 / midboss 2
- no legacy `pon_shadow` or `ポン影` names
- every manifest cell has a complete design record
- every boss form references one of the three bosses
- every record has silhouette, role, attack, telegraph, counterplay, animation and size fields

The sprite check additionally validates exact PNG dimensions, true RGBA, 48 non-empty cells and 4px safe borders.

## What may start now

Ready now:

1. generate the 48-cell reference sheet
2. review silhouette duplication and Stage readability
3. select the initial runtime subset
4. create native Aseprite sources in production priority order
5. implement data-driven behaviors from the catalog

Not yet allowed:

- call generated PNGs production
- directly downscale the 180px sheet into game sprites
- mark any enemy final without gameplay composition review
