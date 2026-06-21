# Aseprite character template

Asepriteで player / enemy / pickup / prop を作る時の標準template方針。

## Purpose

- 毎回ゼロからlayer構造を考えない。
- AIやscript出力をそのままfinalにしない。
- 1x / 4x / dark background / gameplay check をsource内に持つ。
- final判断に必要な情報をAseprite内に残す。

## Default canvas

| asset type | source size | notes |
| --- | ---: | --- |
| player master | 52x52 | 顔・小物・輪郭を詰めるための制作サイズ |
| player gameplay export | 42x42 or explicit task size | 既存manifestに合わせる |
| small enemy | 24x24 - 32x32 | silhouette priority |
| pickup | 10x10 - 16x16 | glowはgameplay markerと混同しない |
| UI icon | 16x16 - 32x32 | shape clarity priority |
| background tile | 32x32 or 64x64 | low contrast / tile seam check |

## Standard layer stack

Top to bottom:

```txt
notes
fx_glow
prop
face_detail
hair_or_detail
head_or_main_mass
body_or_support_mass
feet_or_contact
outline
shadow
bg_check
```

Rules:

- `notes`: hidden notes / marker pixels / no export intent.
- `fx_glow`: decorative glow only. Do not confuse with gameplay markers.
- `prop`: lantern, weapon, ribbon, pickup frame, enemy accent.
- `face_detail`: eyes, mouth, cheeks, eye-light. For enemies, eye/light/mouth.
- `hair_or_detail`: hair, cracks, paper tear, ink edge, small marks.
- `head_or_main_mass`: main readable mass.
- `body_or_support_mass`: body, lower blob, paper body, icon base.
- `feet_or_contact`: legs, small contact pixels, ground touch.
- `outline`: selective outline, not heavy pure black border.
- `shadow`: floor/contact shadow.
- `bg_check`: dark background or gameplay background sample. Keep hidden for final export unless explicitly used in preview.

## Tags

For single master assets:

```txt
master
```

For animation candidates:

```txt
idle
move
hurt
ultimate
result
```

Do not create many animation frames before the master silhouette and focal point pass.

## Palette slots

Keep palette small and readable.

Suggested groups:

```txt
0 transparent
1-4 ink / outline / shadow
5-8 night blue / background-safe darks
9-12 old paper / warm cloth / UI paper
13-16 memory amber / glow / pickup highlight
17-20 red-brown / hair / print accent
21-24 skin / cheek / soft highlight
25-28 enemy eye-light / danger accents
```

The exact color can change, but the function of each group should stay clear.

## Template generation

Use the helper script:

```sh
pnpm aseprite:template:character -- --out=assets/source/aseprite/player/prototypes/yui_master_52_template.aseprite --size=52 --name=yui_master
```

This creates a structured `.aseprite` template only. It is not final art.

## Human / agent hand-finish checklist

Before promotion:

- silhouette reads in black.
- focal point is clear.
- cluster/noise is controlled.
- value separation works in grayscale.
- outline is selective.
- prop/effect is attached or clearly sourced.
- 1x, 4x, dark background, and gameplay mock are checked.
- before/after exists.
- source/export path is recorded.

## Do not

- Use this template as a reason to call an asset final.
- Put gameplay collision information into the art source as final pixels.
- Hide weak art behind glow or effects.
- Let `bg_check` export into production PNG.
