# Yui Aseprite hand-final plan

ユイ4ポーズはまだ `generated-draft`。
Aseprite は導入済み前提だが、repo内にはまだ `.aseprite` source が無いため、hand-final とは扱わない。

## Production Tool

- 使用対象: Aseprite stable v1.3.17.x
- 使用しない: Aseprite v1.3.18-beta2

## Order

1. `yui_idle`
2. `yui_move`
3. `yui_hurt`
4. `yui_ultimate`

idle を先に確定し、残り3ポーズは同一人物に見える範囲で差分化する。

## Source Files

| pose | source | PNG |
| --- | --- | --- |
| idle | `assets/source/aseprite/player/yui_idle.aseprite` | `public/assets/sprites/player/yui_idle_32.png` |
| move | `assets/source/aseprite/player/yui_move.aseprite` | `public/assets/sprites/player/yui_move_32.png` |
| hurt | `assets/source/aseprite/player/yui_hurt.aseprite` | `public/assets/sprites/player/yui_hurt_32.png` |
| ultimate | `assets/source/aseprite/player/yui_ultimate.aseprite` | `public/assets/sprites/player/yui_ultimate_32.png` |

## Export

```sh
pnpm aseprite:check
pnpm aseprite:export:yui
pnpm assets:verify
```

source が無いposeは `source-missing` としてskipされる。
PNGを直接編集せず、sourceからexportする。

## Review

```txt
/?scene=yui-gallery
/?scene=combat-mock&density=late
/?scene=asset-status
```

見ること:

- 1xでidleが主人公として読める。
- 4xで顔/フード/服/ランタンの破綻がない。
- 夜背景で埋もれない。
- hitCore とランタンが近すぎない。
- 記憶の欠片とランタンが誤認されすぎない。
- 黒インク敵と外形が混ざらない。

## Do Not Touch

- collision
- pickup吸引
- player stats
- background/drop/enemy/weapon素材
