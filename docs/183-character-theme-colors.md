# 183. Character Theme Colors

Purpose: preserve the Japanese-traditional-color direction for all 20 characters plus official reserve characters.

Runtime-facing data:

- `src/game/data/characterThemeColors.ts`

## Rule

- Theme colors are identity colors, not full palettes.
- Use them for character cards, cutin accents, selection UI, collection UI, and asset prompt direction.
- Do not force gameplay effects to use only these colors; readability wins.
- Japanese color names are creative direction labels. Hex values are chosen for game readability, not museum-grade colorimetry.

## Core 5

| Character | Theme | Hex | Accent | Hex |
| --- | --- | --- | --- | --- |
| ユイ | 瑠璃色 | `#264A86` | 山吹色 | `#F6B44B` |
| アサ | 薄紅 | `#F4A7B9` | 菜の花色 | `#F7D94C` |
| ナギ | 藤紫 | `#7B90D2` | 白橡 | `#C7B78B` |
| ミチル | 御召御納戸 | `#2E5C6E` | 刈安色 | `#D7C447` |
| トモリ | 弁柄色 | `#8F2E14` | 淡香 | `#FAD689` |

## Circle 10

| Character | Theme | Hex | Accent | Hex |
| --- | --- | --- | --- | --- |
| セン | 利休鼠 | `#6E7955` | 鳥の子色 | `#E9E4D4` |
| リツ | 甚三紅 | `#D75455` | 退紅 | `#F8C3CD` |
| コヨリ | 桜色 | `#F7C8D0` | 練色 | `#FFF1CF` |
| ゲン | 鶯茶 | `#867835` | 桑染 | `#C0A36E` |
| ハナ | 蘇芳 | `#B5495B` | 青磁色 | `#86A697` |
| ユウビ | 代赭 | `#C1693C` | 蒸栗色 | `#E8D3A2` |
| マドカ | 勿忘草色 | `#89C3EB` | 白鼠 | `#F3F3F2` |
| シロ | 白練 | `#E3E5E8` | 藍鼠 | `#5B7E91` |
| トバリ | 墨色 | `#56564B` | 砂色 | `#D6C6AF` |
| ネム | 薄藤 | `#B4A5D4` | 水色 | `#A5DEE4` |

## Shadow 5

| Character | Theme | Hex | Accent | Hex |
| --- | --- | --- | --- | --- |
| クロオリ | 黒 | `#1C1C1C` | 深紫 | `#4A225D` |
| カゲール1 | 蝋色 | `#2B2B2B` | 紅鳶 | `#B55233` |
| カゲール2 | 鈍色 | `#787D7B` | 灰白色 | `#D8D2C0` |
| カゲール3 | 濃藍 | `#2D2D48` | 薄色 | `#C7A5CC` |
| カゲール4 | 胡粉色 | `#F2F2ED` | 黒紅 | `#3C2F41` |

## Official reserve

| Character | Theme | Hex | Accent | Hex |
| --- | --- | --- | --- | --- |
| レン | 瓶覗 | `#A2D7DD` | 銀鼠 | `#A5A5A5` |

## New character handling

New visual ideas are not deleted. They should either:

1. merge into an existing 20-character slot if they strengthen that character, or
2. become an official reserve character if merging would weaken the existing roster.

Current placement:

- glasses / round glasses / focus lens -> レン
- library / unread page / archive -> シロ
- teacher / chalk / classroom instruction -> セン
- route / station / ticket -> トバリ or ゲン depending on age and role
- dream / water-surface map -> ネム

Official reserve characters are formal canon, but they are not forced into the current playable build.
