# Enemy 48 Sprite Sheet Generation Prompt

## Status

- purpose: generate one 48-cell `prototype-reference` sheet
- canonical order: `data/enemy-assets/enemy-48-sprite-sheet-cells.json`
- complete visual/gameplay briefs: `data/enemy-assets/enemy-design-catalog.json`
- Omb/Ombro direction: `docs/enemies/omb-ombro-selected-direction.md`
- production note: generated PNG is not a final game asset

## Copy-paste prompt

```txt
Work only in /Users/m-shogo/Developer/personal/vamp-pon.
Repository: https://github.com/m-shogo/vamp-pon.git
Do not touch any other repository.

Create one reference sprite sheet containing all 48 enemies defined by the repository.
Before generating, read all of these files:

- AGENTS.md
- docs/art-direction.md
- docs/reference-art-map.md
- docs/enemies/omb-ombro-selected-direction.md
- docs/enemies/enemy-48-sprite-sheet-plan.md
- data/enemy-assets/enemy-48-sprite-sheet-cells.json
- data/enemy-assets/enemy-design-catalog.json
- every JSON file listed in enemy-design-catalog.json -> designFiles

The detailed design JSON files are authoritative for every enemy's:

- silhouette
- body ratio
- eye/light placement
- signature parts
- cell occupancy
- movement impression
- attack pose
- telegraph
- differentiation from other enemies
- boss-form identity

Do not invent a replacement design when a catalog description already exists.

OUTPUT CONTRACT — ABSOLUTE

- one PNG
- exactly 1440x1080px
- exactly 8 columns x 6 rows
- exactly 48 cells
- every cell exactly 180x180px
- true RGBA PNG, color type 6
- background alpha exactly 0
- every cell non-empty
- one enemy or one boss form per cell
- minimum 4px fully transparent safe border on every side of every cell
- no body, aura, shadow, glow, smoke, particle, wing, tail, antler, thread, rail or weapon may cross a cell boundary
- no text
- no numbers
- no labels
- no frames
- no grid lines
- no floor
- no background
- no checkerboard pattern

ART QUALITY

Match the current Core5 protagonist reference quality:

- soft painterly pixel art
- high-density but clean pixel clusters
- readable at 1x
- cute but gameplay-readable
- soft volume rather than flat symbols
- selective dark outline, not a uniform thick black contour
- black, dark navy, violet-black and blue-gray form the enemy body
- old-paper accents and very small warm lights are focal points only
- enemies are darker than the player but must remain visible on a dark gameplay background
- no isolated 1px noise
- no muddy downscaled illustration
- no smooth vector edges
- no 3D-render appearance
- no modern neon or sci-fi effects

All enemies belong to the same black-ink world, but they must not become repeated black blobs.
For every Stage-unique enemy and midboss, preserve at least three distinct differences among:

- silhouette
- body ratio
- eye/light placement
- signature component
- posture
- center of gravity
- movement impression

OMB / OMBRO

Omb is the shared small mascot enemy:

- soft shadow body whose outline constantly dissolves
- low rounded body, never a hard ball
- one small ink bud on top
- two small old-paper square eyes
- no mouth, eyebrows, cheeks, nose, clothes or limbs
- dark non-luminous flame-like shadow aura around the entire body
- keep the face area clear enough to read the eyes
- aura uses black, dark navy, violet-black and blue-gray; never bright fire
- movement stretches the rear aura and squashes the body

Ombro is the shared medium growth form:

- same eyes, ink bud and shadow-flame identity as Omb
- lower and wider, not a simple upscale
- stronger and longer aura
- two heavy pseudo-hands formed from the same shadow aura
- pseudo-hands droop into the ground while idle
- during attack, one pseudo-hand extends and may split into at most three blunt lobes
- no shoulder, elbow, palm, human fingers, nails, bones or muscles

The five Stage variants preserve the same silhouette, face, camera angle and pose timing. Stage palette differences remain secondary; at least 70% of the body stays in the black-ink family.

BOSS IDENTITY

Nanashino cells 36, 39, 40 and 41 are one creature:

- three-headed black-ink watchdog
- name-tag chains across the body
- pen-nib tail
- paper-beast heads
- forms change chain state, head emphasis and exposed name core without changing species

Michishirube cells 37, 42, 43 and 44 are one creature:

- giant paper stag
- branching railway antlers
- station clock in the chest
- small station structure on the back
- ticket-strip tail
- forms change antlers, reversed clock and exposed station core while keeping the stag body

Asamade cells 38, 45, 46, 47 and 48 are one creature:

- black-ink dragon with a cage-like head
- six separate torn-page wings
- small ember in the chest
- black-thread tail
- forms change page sealing, mixed memories, ember guarding and dawn cracking while preserving the same dragon

CELL ORDER — LEFT TO RIGHT, TOP TO BOTTOM

01 オンブ・欠片色
02 オンブロ・欠片色
03 紙くずの影
04 夜のもや
05 消し跡虫
06 オンブ・名札色
07 オンブロ・名札色
08 名札影

09 名前喰い
10 呼び声コウモリ
11 オンブ・封箱色
12 オンブロ・封箱色
13 箱影
14 鍵穴蜘蛛
15 封蝋ガニ
16 オンブ・切符色

17 オンブロ・切符色
18 迷子の方角
19 逆走ネズミ
20 改札バサミ
21 オンブ・灯火色
22 オンブロ・灯火色
23 火消し蛾
24 残り火ウサギ

25 朝隠しカラス
26 紙墓の大喰らい
27 にじみの母
28 名を呼ばぬ司書
29 百面ラベル
30 内鍵の番人
31 封蝋の女王
32 終着駅の車掌

33 帰らずの機関獣
34 灯喰らいの大蛾
35 朝を縫う魔女影
36 三路喰らい《ナナシノ》
37 帰路巨鹿《ミチシルベ》
38 夜綴じ六翼竜《アサマデ》
39 ナナシノ・鎖断ち形態
40 ナナシノ・二首暴走形態

41 ナナシノ・名札核形態
42 ミチシルベ・線路角展開形態
43 ミチシルベ・逆転時計形態
44 ミチシルベ・駅心核露出形態
45 アサマデ・夜頁封鎖形態
46 アサマデ・記憶混線形態
47 アサマデ・残火守護形態
48 アサマデ・朝割れ形態

SIZE HIERARCHY

- Omb: 52–60% cell occupancy
- Ombro: 64–72%
- Stage-unique grunts: 55–68%
- midbosses: 70–82%
- bosses and boss forms: 84–94%

Large bosses must appear large without touching the safe border. Fold long wings, tails, rails, threads and antlers naturally inside the cell.

FORBIDDEN

- legacy names ポン影 / ふくらみポン影 / pon_shadow / grown_pon_shadow
- empty cells
- multiple enemies in one cell
- palette-only boss forms
- identical pose duplicated across unrelated enemies
- hard black circles with eyes only
- human-looking Ombro hands
- bright ordinary flames around Omb or Ombro
- player-like clothes, hair or faces on shadow creatures
- warm focal lights large enough to look like a pickup or hit core
- direct production promotion

SAVE LOCATIONS

Reference source:
assets/reference/enemies/enemy-48-sheet/enemy-48-sprite-sheet-v1.png

Prototype copy after validation:
public/assets/prototypes/sprite-sheets/enemies-180px/enemy-48-sprite-sheet-v1.png

After writing the PNG, run:

pnpm enemy48:design:check
pnpm enemy48:manifest:check
pnpm enemy48:sprites:verify

Report exact results. Do not claim 48/48, RGBA, transparency or overflow=0 unless the mechanical check passes.
Do not call the sheet production or hand-final-candidate.
```

## Acceptance output

Only after mechanical validation may the report contain:

```txt
canvas: 1440x1080
grid: 8x6
cell: 180x180
mode: RGBA
background alpha: 0
detected non-empty cells: 48/48
cell overflow: 0
design catalog: 48/48 design-ready
legacy Pon Shadow names: 0
```
