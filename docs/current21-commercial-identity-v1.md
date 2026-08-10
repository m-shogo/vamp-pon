# ヨルノシルベ Current21 Commercial Identity v1

Date: 2026-08-10  
Status: **CURRENT COMMERCIAL DIRECTION / NEVER OVERRIDES STORY CANON**

Production source:

- `src/game/data/characterCommercialIdentity.ts`
- `src/game/data/characterThemeColors.ts`
- `src/game/data/current21SilhouetteMatrix.ts`
- `docs/series-commercial-franchise-architecture-v1.md`

## Purpose

Character人気を一つのランキングへ潰さず、Current21全員へ複数の「好きになる入口」を持たせる。

```txt
Character
+ Star Beast
+ Named Object
+ Relationship
+ Scene
```

売上/人気dataは露出・再販・side story優先度へ使える。

しかし次は変えない。

- personality
- relationship type
- body shape / age
- family relation
- Main Mystery truth
- Named Object truth
- Star Beast duplicate meaning

---

## Popularity axes

全員を同じ6軸で見る。

1. favoriteCharacter
2. favoriteStarBeast
3. favoriteRelationship
4. wantToCollect
5. wantMoreStory
6. favoriteScene

たとえば「単体人気は中位だが星獣が非常に強い」「pairの話をもっと読みたい」「作中物replicaだけ欲しい」を別signalとして扱う。

---

## Current21 quick commercial map

| Character | Primary commercial hook | Star Beast | Named Object / premium lane |
| --- | --- | --- | --- |
| ユイ | 拾う / 戻す / ランタン | 子獅子 | 持ち主待ちのランタン replica |
| アサ | 名前 / 紙 / 小鋏 | 若い雄羊 | 名結びの小鋏 / letter tools |
| ナギ | 月 / 鍵 / 箱 | 小さな蟹 | 月箱 + 銀鍵 keepsake |
| ミチル | 地図 / 帰路 | 小熊 | 帰り針のコンパス |
| トモリ | 修理 / 継ぎ目 | 煤けた若獅子 | 修理ランプ / tool set |
| セン | 白線 / 問い | 小烏 | チョーク灯 / desk object |
| リツ | 半分 / 分担 | 大きい猟犬 | 半灯りの飴缶 |
| コヨリ | 小さな名前 / 紙縒り | 小さい猟犬 | 紙縒りmulti charm |
| ゲン | 古い道 / 駅灯 | 大熊 | 古いコンパス / 駅灯 |
| **ハナ** | **保存 / 押し花 / 布** | **ふっくらした白鳥** | **花脈の保管箱 / 生活道具set** |
| ユウビ | 手紙 / 配達 / 時間差 | 小鳩 | 郵便灯 / letter set |
| マドカ | 遠景 / 窓 / レンズ | 小鷲 | 観測レンズ optical object |
| シロ | 未分類 / 白い頁 | 山猫 | archival stationery box |
| トバリ | 門 / 切符 / 帰路 | 大きな番犬 | 改札鋏 / ticket collector box |
| ネム | 夢 / 水面 / 日記 | 小イルカ | special-bound dream diary |
| クロオリ | 黒紙 / 折る / 預かる | カメレオン | folding case / seal object |
| **カナメ** | **守る / intercept / 腕帯** | **大きな灰狼** | **受け灯の腕帯 wearable replica** |
| カスミ | ぼかす / 戻せる痕跡 | 淡い小狐 | reversible-light object |
| トキ | 測る / 角度 / 定規 | 細身の鶴 | collector ruler |
| ツムギ | 糸 / 余白 / 継ぎ目 | 白灰の野兎 | repair craft set |
| レン | 差分 / 片焦点 | 観察犬 | **Reserve candidate only** |

---

## Hana — commercial identity

Hana is not sold as “the plus-size character.”

Primary reasons to like her:

```txt
保存
+ 押し花
+ 生活の手触り
+ 年長女性
+ 丸いsilhouette
+ 白鳥
+ ハナ×ツムギ / ハナ×シロ
```

### Entry

- 押し花しおり
- 蘇芳 paper goods
- 白鳥 sticker / charm

### Core

- 丸いショールpattern cloth goods
- 花脈 pouch
- preserve / repair stationery
- archive goods

### Premium candidate

**押し花 / しおり / 花脈の保管箱をまとめた生活道具collector set**

### Never

- 「ぽっちゃり」を商品名の売りにする
- food-only line
- 体重 / XXL joke
- popularity-driven slimming
- fetish exaggeration

---

## Kaname — commercial identity

Kaname is not sold as “the heavy tank.”

Primary reasons to like him:

```txt
守る
+ 一瞬のintercept
+ 外周の安心感
+ 受け灯の腕帯
+ 灰狼
+ カナメ×ナギ / カナメ×リツ
```

### Entry

- 腕帯 motif charm
- 影の折り目 sticker
- 灰狼 pin / charm

### Core

- protection motif cloth goods
- gray-wolf mascot
- two-protection pair goods
- protector relation goods

### Premium candidate

**受け灯の腕帯 wearable replica**

### Never

- 重量級 / XXL joke
- overeating line
- slow tank stereotype
- popularity-driven slimming / bodybuilder conversion
- fetish exaggeration

---

## Relationship commerce

`favoriteRelationship` is **not a romance vote**.

Examples:

- ユイ × アサ = protagonist buddy / non-romance
- リツ × コヨリ = siblings / non-romance
- ナギ × カナメ = two protection methods
- ハナ × ツムギ = preserve / trace
- ハナ × シロ = archive / unknown
- カナメ × リツ = protector × protector

Popularity can increase:

- pair art
- booklet
- optional side story
- two-piece charm
- event scene

It cannot rewrite the relationship type.

---

## Reserve Ren

Ren belongs to Current21 understanding but is `official_reserve`.

Commercial ideas may be stored as candidates, but:

```txt
commercial candidate
!= Current20 production scope
!= playable promotion
!= automatic goods launch
```

---

## Price ladder principle

Every character should have more than acrylic-only treatment.

```txt
ENTRY
paper / sticker / small charm
↓
CORE
Star Beast / Named Object / relationship goods
↓
COLLECTOR
booklet / scene art / special material
↓
PREMIUM CANDIDATE
in-world object replica / wearable / special box
```

Actual SKU / price / manufacturing approval is a later production decision.

---

## One sentence

> **商業はCharacterを売れ筋へ変形する作業ではなく、既にいる人物のどこを好きになっても作品へ戻れる入口を増やす作業。**
