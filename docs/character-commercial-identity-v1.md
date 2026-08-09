# ヨルノシルベ Character Commercial Identity v1

Date: 2026-08-09  
Status: **CURRENT COMMERCIAL DIRECTION / CANON-SAFE**

Machine-readable:

- `public/lorebook/data/character-commercial-hooks.v1.json`

Authority inputs:

- `docs/title1-world-law-canon-v1.md`
- `docs/RELATIONSHIPS.md`
- `docs/character-star-beast-constellation-canon-v1.md`
- `src/game/data/characterThemeColors.ts`
- `docs/series-commercial-franchise-architecture-v1.md`

---

# 1. Goal

Character人気が出た後で慌てて商品を作るのではなく、Current21全員へあらかじめ:

```txt
Character identity
+ Theme HEX
+ Star Beast
+ everyday motif
+ Named Object / prop
+ relationship hook
+ entry goods
+ core goods
+ premium candidate
```

を持たせる。

目的は「21人全員同じSKUを作る」ことではない。

> **誰の人気が伸びても、その人らしい商品・scene・pair/ensembleへすぐ接続できるproduction memoryを持つ。**

---

# 2. 商業identityの5層

## A. Face / Character

- name
- primary HEX
- silhouette / posture（visual authority承認後）
- recurring action
- voice / phrase

アクスタ・badge・profile cardの土台。

## B. Star Beast

- mascot単体
- Characterとのpair
- Star Beast同士の日常
- constellation clue

Characterを知らない人の入口にもなるが、必ずCharacterへ戻れる導線を持つ。

## C. Named Object / Prop

Characterの物を現実へ持ち帰る。

例:

- lantern
- tag
- key / box
- map / compass
- letter
- ticket
- bookmark
- notebook

高価格商品は「大きいアクスタ」より、**作中物の再現**を優先する。

## D. Relationship

- buddy
- sibling
- ideological mirror
- quiet night-born trust
- object lineage
- ensemble

`favoriteRelationship` はromance投票ではない。

## E. Scene / Time

- Night station
- desk / archive
- Lake / star path
- Dawn
- seasonal night

Character単体人気へ依存しないworld goodsを作る。

---

# 3. Price / commitment ladder

Exact priceは販売時に決める。
構造だけ固定する。

## Discovery

無料〜低負担:

- wallpaper
- profile share card
- Star Beast icon
- relationship mini diagram

## Entry

低価格:

- sticker
- postcard
- bookmark
- mini charm
- badge

## Core Collection

中価格:

- acrylic stand
- character + Star Beast set
- pair card
- stationery set
- small diorama

## Lore Collector

中〜高価格:

- bound booklet
- route map
- archive box
- scene art
- object-history set

## Premium Identity

高価格:

> **作中の物を現実へ持ち帰る。**

- lantern-like collector object
- moon box
- compass
- sealed memory case
- stitched notebook
- ticket punch / route object

Premiumを価格だけ高い同型商品にしない。

---

# 4. Character-specific rule

Current21全員:

- primary HEX unique
- Star Beast / constellation hook
- everyday motif >= 2
- relationship hook >= 2
- entry goods >= 3
- core goods >= 3
- premiumCandidate >= 1

ただし**全部productionする義務はない**。
DBは候補在庫。

実販売は需要、製造難度、spoiler、品質、利益率で絞る。

---

# 5. Popularity data

最低でも別軸で取る:

```txt
favoriteCharacter
favoriteStarBeast
favoriteRelationship
wantToCollect
wantMoreStory
favoriteScene
```

一つの総合人気順位へ潰さない。

例:

- Character票は低いがStar Beast plush需要が高い。
- Character票は中位だがpair story需要が非常に高い。
- Character票は高いがpremium replica需要は低い。

これらは別情報。

---

# 6. Popularityで変えてよいもの

- SKU比率
- initial production quantity
- restock
- event露出
- optional side story順
- Lorebook feature順
- seasonal art優先度
- optional Bond追加量

---

# 7. Popularityで変えないもの

- personality
- family / blood relation
- friendship / siblingsのforced romance化
- Main Mystery truth
- death / resurrection
- Relative Era fact
- Named Object owner / lineage
- Star Beast duplicate reason
- Title 1 Happy End

人気は「もっと何を見たいか」。
Canonを書き換える投票ではない。

---

# 8. Relationship goods

単に二人を並べない。

良いpair goodsは最低1つ持つ:

- shared action
- shared object
- contrast motif
- two-part graphic
- line / path that connects
- one scene remembered by both

Examples:

## ユイ × アサ

- 夜青 / 薄紅のcontrast
- lantern / name tag
- buddy speed vs confirmation

## リツ × コヨリ

- two dogs / Canes Venatici
- half motif
- siblings / non-romance

## ユイ × クロオリ

- open / sealed
- paper edge
- current choice vs past request

## ユイ × トモリ

- same physical lantern
- two different repair/ownership eras
- shared Leo gold
- **not blood Canon**

---

# 9. Spoiler tiers

Commercial DB has working spoiler tier:

- `spoiler-free`
- `game-clear`
- `deep-lore`

販売ページ / event / Lorebookで同じ画像を無条件に見せない。

例:

- Yui単体 / child lion = spoiler-free寄り。
- Yui/Tomori same-lantern truth = game-clear。
- Night maintainer history = deep-lore。

---

# 10. Series carry-forward

2/3で旧Character goodsを継続する時:

- growth済みの姿を尊重する。
- 1のcostumeを毎回defaultへ戻す必要はない。
- old Named Objectへ新しいhistory layerを足せる。
- 新Characterを旧人気Characterのvariantにしない。
- old pair人気のために新中心人物のsceneを奪わない。

Series merchandiseは:

```txt
Title-local identity
+ inherited object / route
+ shared world motif
```

で繋ぐ。

---

# 11. Visual production boundary

Commercial identity ready != final art approved。

- portrait
- silhouette
- Star Beast asset
- replica dimensions
- material
- package

はvisual / product approvalを別に持つ。

AI generated mockをfinal product artへそのまま使用しない。

---

# 12. One sentence

> **ヨルノシルベの商品は「人気Characterの顔を何種類も刷る」だけにしない。Characterが夜で触っていた物、隣にいた星獣、誰かとの間に生まれた小さな行動まで現実へ持ち帰れるIPにする。**
