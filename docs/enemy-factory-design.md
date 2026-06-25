# Enemy Factory Design

Vamp Pon / Lantern Ledger の敵を、破綻させずに量産するための設計書。

この文書の目的は、敵を1体ずつ思いつきで増やすのではなく、**素体 / モチーフ / 行動 / 色 / サイズ / ステージ文脈**で組み合わせ、ゲーム性・世界観・図鑑・グッズ化まで同時に成立させること。

## References / Lessons

### Pokemon-like lesson: silhouette and unified pass

初期ポケモンは、複数人のドット案を最終的に統一された絵柄へ寄せる流れが重要だった。Vamp Ponでも、敵案を増やした後に必ず「オンブらしさ」「夜/記憶/黒インク/小さな光」へ戻す。

使う教訓:

- 小さいシルエットで分かる。
- 線が少なくてもキャラになる。
- タイプ / 進化 / 色違いで増やす。
- 最終統一ルールを通す。

### Mega Man Battle Network-like lesson: base family and behavior variants

GBA系の敵量産は、完全新規ではなく、基本形・属性違い・上位種・行動違いで増やすのが強い。

使う教訓:

- 基本種を作る。
- 属性 / 色 / 行動で差を作る。
- 上位種はサイズ・色・パーツ追加で作る。
- ボスは雑魚モチーフを巨大化・複合化する。

### Chain of Memories-like lesson: system conversion

3DのKHをGBAへそのまま移植せず、カードという携帯機向けルールへ変換した。Vamp Ponでも敵を「絵の種類」だけで増やさず、忘れ物・記憶・図鑑・ステージギミックへ変換する。

使う教訓:

- そのまま豪華にしない。
- 小さい画面に合うルールへ変換する。
- 敵をカード / 図鑑 / 欠片 / 報酬に接続する。

### Rain World-like lesson: creature ecology

敵をプレイヤーだけを狙う記号にせず、夜の中に住む生き物として扱う。

使う教訓:

- 敵に短い生態を持たせる。
- 図鑑説明が書ける敵にする。
- ステージの生活感から敵を作る。
- ただの障害物ではなく、夜の一部にする。

## Core Enemy Concept

敵は「忘れられた気持ち」または「忘れ物に残った記憶」が黒インクに沈んだもの。

```txt
オンブ   = 忘れられた気持ちの小さな影
オンブロ = 長く夜に沈んだ大きな影
忘れ物オンブ = 物に残った記憶の影
ボス = 場所そのものに残った大きな記憶
```

## Non-Negotiable Visual Rules

- 口を描きすぎない。
- 怖すぎない。
- 流血・肉感なし。
- 黒 / 濃紺 / 紫黒 / 青灰を中心にする。
- 暖色は敵の中心ではなく、奪われた記憶や弱点に少量だけ使う。
- 小さい画面でシルエットが読める。
- 雑魚は複雑にしない。
- ボスだけ複数パーツ化してよい。

## Base Families

### Ombu

| 項目 | ルール |
|---|---|
| 役割 | 大量雑魚 |
| 形 | 丸い小さな影 |
| 腕 | 基本なし |
| 頭 | 短いインク芽1本 |
| 顔 | 目だけ / 口なし |
| 動き | ふわふわ接近 |
| セル数 | 6〜8枚で十分 |

### Omburo

| 項目 | ルール |
|---|---|
| 役割 | 中型 / 中ボス |
| 形 | 大きな影 |
| 腕 | 両腕あり |
| 手 | 鈍い3房 |
| 頭 | 長い影炎 / 芽2本 |
| 動き | 重い / 溜める / 腕を伸ばす |
| セル数 | 8〜12枚 |

### Boss Core

| 項目 | ルール |
|---|---|
| 役割 | ステージ締め |
| 形 | 忘れ物 + 場所の影 |
| パーツ | 複数パーツ可 |
| 攻撃 | 2〜3フェーズ |
| 表現 | 背景演出を含める |
| セル数 | 本体は少なめ、エフェクトで派手にする |

## Enemy Formula

```txt
Enemy = BaseFamily + Motif + Behavior + Palette + SizeTier + StageContext
```

Example:

```txt
base: ombu
motif: umbrella
behavior: shield
palette: stage1_blueblack
size: small
stage: forgotten-street
= 傘オンブ
```

## Behavior Types

| id | 名前 | 説明 | 向くモチーフ |
|---|---|---|---|
| chaser | 追跡 | プレイヤーへ接近 | 基本オンブ |
| dasher | 突進 | 溜めて直線突進 | 鍵 / 針 / 星 |
| zigzag | 揺れ | 左右に揺れながら接近 | 靴 / 紙舟 |
| shooter | 弾 | 紙片やインクを飛ばす | 手紙 / 本 |
| spawner | 呼ぶ | 小型オンブを呼ぶ | 鈴 / 窓 |
| shield | 防ぐ | 正面または一定方向だけ硬い | 傘 / 標識 |
| slower | 鈍足 | 周辺に鈍足ゾーン | 時計 / 水たまり |
| splitter | 分裂 | 倒すと小型に分かれる | 水たまり / 紙束 |
| wall | 塞ぐ | 横長に道を塞ぐ | ベンチ / 門札 |
| bomber | 近距離破裂 | 近づくと短い範囲で弾ける | マッチ / 電球 |
| stalker | 追わない圧 | 一定距離を保ち嫌な位置に残る | 窓 / 目玉影 |
| orbit | 周回 | プレイヤーやボス周囲を回る | 星 / 鈴 / 鍵束 |

## Motif Families

### Forgotten Item Motifs

| motif | 表示案 | 推奨Behavior | グッズ化 |
|---|---|---|---|
| umbrella | 傘オンブ | shield | 強い |
| key | 鍵オンブ | dasher | 強い |
| shoe | 片靴オンブ | zigzag | 強い |
| letter | 手紙オンブ | shooter | 強い |
| bell | 鈴オンブ | spawner / orbit | 強い |
| match | マッチオンブ | bomber | 中 |
| map | 地図オンブ | wall / slower | 中 |
| clock | 時計オンブ | slower | 強い |
| bookmark | しおりオンブ | dasher | 中 |
| paperboat | 紙舟オンブ | zigzag | 強い |

### Place Motifs

| motif | 表示案 | 推奨Behavior |
|---|---|---|
| lamp-post | 街灯オンブロ | wall / aura |
| bench | ベンチオンブ | wall |
| puddle | 水たまりオンブ | slower / splitter |
| sign | 標識オンブ | shield / turn |
| window | 窓オンブ | stalker / shooter |
| gate | 門札オンブ | wall / dasher |
| swing | ブランコオンブ | orbit / arc |

### Emotion Motifs

| emotion | 表示案 | 行動 |
|---|---|---|
| lonely | さみしオンブ | 群れで寄る |
| anger | いらだちオンブ | 速い突進 |
| fear | こわがりオンブ | 逃げながら弾を残す |
| sleep | ねむりオンブ | 遅いが硬い |
| forget | わすれオンブ | EXPが遅れて出る |
| hesitation | まよいオンブ | 左右に迷う |

## Stage Enemy Rosters

### Stage 1: 忘れ物の夜道

| Role | Enemy | Behavior | Purpose |
|---|---|---|---|
| basic | オンブ | chaser | 基本テンポ |
| fast | 片靴オンブ | zigzag | 移動を促す |
| guard | 傘オンブ | shield | 方向意識 |
| rush | 鍵オンブ | dasher | 突進回避 |
| ranged | 手紙オンブ | shooter | 紙片弾 |
| support | 鈴オンブ | spawner | 敵密度変化 |
| mid | 街灯オンブロ | wall / aura | 中ボス |
| boss | 忘れ傘の番人 | shield + rain | Stage1締め |

### Stage 2: 静かな水路

| Role | Enemy | Behavior | Purpose |
|---|---|---|---|
| basic | 水たまりオンブ | slower | 足場注意 |
| swarm | 魚影オンブ | line cross | 横切り圧 |
| drift | 紙舟オンブ | zigzag | 流れ感 |
| ranged | 濡れ手紙オンブ | shooter | 遅い弾 |
| split | 泡オンブ | splitter | 数変化 |
| mid | 橋下オンブロ | arm reach | 画面端圧 |
| boss | 黒水路の渡し守 | wave + arm | Stage2締め |

### Stage 3: 紙片の塔

| Role | Enemy | Behavior | Purpose |
|---|---|---|---|
| basic | しおりオンブ | dasher | 直線回避 |
| aerial | 折り紙オンブ | diagonal | 斜め圧 |
| ranged | 本オンブ | shooter | 弾幕入口 |
| residue | 消し跡オンブ | slow stain | 場残り |
| mid | 紙吹雪オンブロ | split shots | 中ボス |
| boss | 宛先なき手紙束 | paper wave | Stage3締め |

### Stage 4: 黒墨の公園

| Role | Enemy | Behavior | Purpose |
|---|---|---|---|
| wall | ベンチオンブ | wall | 導線制限 |
| arc | ブランコオンブ | orbit / arc | 円弧移動 |
| call | 鈴オンブ | spawner | 群れ演出 |
| chase | 影犬オンブ | fast chaser | 追跡圧 |
| mid | 街灯オンブロ | aura | 中ボス |
| boss | ひとり遊びの影 | toys + swing | Stage4締め |

### Stage 5: 夜明けの門

| Role | Enemy | Behavior | Purpose |
|---|---|---|---|
| slow | 時計オンブ | slower | 終盤ギミック |
| wall | 門札オンブ | wall | 道塞ぎ |
| orbit | 星欠片オンブ | orbit | 光の逆利用 |
| rush | 朝焼けオンブ | dasher | 最終圧 |
| mid | 大オンブロ | heavy chase | 総合力 |
| boss | 止まった夜明け | clock + gate | Chapter1締め |

## Boss Upgrade Rules

ボスは完全新規ではなく、雑魚モチーフから育てる。

```txt
small motif enemy
↓
large silhouette
↓
2-3 parts
↓
1 unique stage hazard
↓
clear effect
```

### Boss Examples

| Boss | Source | Phase 1 | Phase 2 | Clear Visual |
|---|---|---|---|---|
| 忘れ傘の番人 | 傘オンブ | 傘を開き防御 | 傘を閉じ突進 / 黒い雨 | 傘骨がほどけて紙片になる |
| 黒水路の渡し守 | 水たまり / 橋下 | 水面から腕 | 黒い波で押す | 水面に小さな朝色 |
| 宛先なき手紙束 | 手紙オンブ | 紙片弾 | 封筒の壁 | 宛先欄に灯りが入る |
| ひとり遊びの影 | 公園モチーフ | 遊具攻撃 | 鈴で呼ぶ | ブランコが静かに止まる |
| 止まった夜明け | 時計 / 門 | 時計針弾 | 門が閉じる | 針が進み朝色になる |

## Sprite Production Rules

### Small Enemy Minimum

```txt
idle_01
idle_02
move_01
move_02
hit_01
clear_01
```

### Medium Enemy Minimum

```txt
idle_01
idle_02
move_01
move_02
attack_01
attack_02
hit_01
clear_01
```

### Boss Minimum

```txt
idle_01
idle_02
phase_a_01
phase_a_02
phase_b_01
phase_b_02
hit_01
clear_01
part_effects separated
```

## Palette Rules

| Tier | Palette | Use |
|---|---|---|
| normal | blue-black | basic enemy |
| fast | violet | speed warning |
| tough | deep navy | durability |
| ranged | dusty teal | projectile readable |
| elite | black-purple + amber dot | elite / mid |
| boss | stage palette + one warm weak point | boss |

## Factory Output

```txt
exports/enemies/{enemy_id}/
  {enemy_id}_master.png
  {enemy_id}_sheet_180x180_8x6.png
  {enemy_id}_preview.gif
  {enemy_id}_manifest.json
  {enemy_id}_unity.json
```

## Manifest Draft

```json
{
  "id": "ombu-umbrella-shield",
  "displayName": "傘オンブ",
  "baseFamily": "ombu",
  "motif": "umbrella",
  "behavior": "shield",
  "stage": "stage-1-forgotten-street",
  "sizeTier": "small",
  "palette": "stage1-blueblack",
  "hpTier": "normal",
  "speedTier": "slow",
  "expTier": "normal",
  "spriteSheet": "enemy_ombu_umbrella_shield_sheet.png",
  "unityPrefabHint": "EnemyOmbuShield"
}
```

## Quality Gate

新敵を採用する前に必ず確認する。

- 32〜64px表示でシルエットが読める。
- 他の敵と行動が違う。
- ステージ文脈に合う。
- 図鑑説明が1行書ける。
- グッズ化した時に小物で識別できる。
- オンブ / オンブロ系列から外れすぎない。
- エフェクトなしでも役割が分かる。
- Unity Prefab化できる。

## Anti-Patterns

- 細かすぎる敵。
- 色だけ違って行動が同じ敵を増やしすぎる。
- 怖すぎるホラー化。
- 人型を増やしすぎる。
- ボスだけ世界観が別になる。
- 全敵に攻撃アニメを大量に作る。
- 画像先行でゲーム上の役割がない。

## First Implementation Priority

1. `ombu-small` chaser。
2. `ombu-shoe-zigzag`。
3. `ombu-umbrella-shield`。
4. `ombu-key-dasher`。
5. `ombu-letter-shooter`。
6. `omburo-lamppost-aura`。
7. Stage1 boss: `forgotten-umbrella-keeper`。

まずStage1だけで敵の違いを感じられるようにする。