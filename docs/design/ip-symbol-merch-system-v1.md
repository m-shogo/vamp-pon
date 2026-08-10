# ヨルノシルベ — IP Symbol / Merchandise System v1

Date: 2026-08-10  
Status: **CURRENT COMMERCIAL / VISUAL DESIGN DIRECTION — NO REAL SKU APPROVAL**

> 目的は「グッズを後から考える」ではなく、ゲーム・物語の中に最初から**切り出して商品になる記号体系**を持つこと。
>
> Character人気だけへ依存せず、Star Beast / Named Object / Relationship / Night Station / Route / Sceneからも作品へ入れるIPにする。

---

# 1. IPの6入口

ヨルノシルベは次の6本を独立assetとして育てる。

1. **Character** — 顔 / silhouette / Theme HEX / 灯紋
2. **灯紋** — 1色抽象記号。顔なしでもCharacterへ戻れる
3. **Star Beast** — mascot入口。Character本体とは別のかわいい入口
4. **Named Object** — 物語とcollector goodsを繋ぐ
5. **Night Station / Route** — Characterを知らなくても買える世界観入口
6. **Relationship / Scene** — 人物同士・場所・朝夜を集める入口

### Rule

同じ絵を6商品へ貼るのではない。

```txt
Character product = 人物を好きな人
Toumon product = 記号を好きな人
Star Beast product = mascotから入る人
Named Object product = lore / propから入る人
Station product = 世界観 / travel graphicから入る人
Relationship / Scene product = 関係や場面を好きな人
```

を別々に拾う。

---

# 2. 世界共通記号 — 夜路印

Character灯紋とは別に、世界側には**夜路印**を持つ。

## 2.1 基本5記号

### A. 道の印 — ROUTE

```txt
一本のline
+ 途中node
+ 次へ抜けるopen end
```

用途:
- 路線図
- map
- loading
- page divider
- apparel pattern

### B. 帰りの印 — RETURN

```txt
lineの先が小さくreturn hook
ただし元の線へ完全接続しない
```

用途:
- exit / return route
- save / return UI
- ticket reverse
- packaging seal

Characterユイの灯紋と同一にしない。世界印はより中立的なgeometryにする。

### C. 預かりの印 — HOLD

```txt
open bracket
+ bracket内側の1点
```

用途:
- 未開封
- collection pending
- Kuroori-related UIでも使用可能だがCharacter所有記号ではない

### D. 渡す印 — HANDOFF

```txt
向かい合う2本の短line
中央にintentional gap
```

用途:
- transfer
- relationship handoff
- Named Object history card

### E. 朝の印 — DAWN

```txt
浅いopen arc
+ arcを下から抜ける短line
```

用途:
- clear
- ending
- dawn edition
- seasonal package

**日の出イラストにはしない。**

---

# 3. Night Station / Ticket IP

駅・路線はCharacterに依存しない強いworld-brandとする。

## 3.1 Station identity

各Stage / stationは最低限:

- station name
- short code
- 1-color station stamp
- route node shape
- one local motif
- dawn-side variant

を持てる。

### Station stamp rule

- 円形スタンプへ統一しない。
- 1〜2色以内。
- Character灯紋を中央logoにしない。
- 地名 / route / local objectを主役にする。
- 実在鉄道会社のロゴ・券面を近似しすぎない。

## 3.2 Ticket

Ticketは単なるデザイン雑貨ではなく、**Collection object**にする。

券面に持てる情報:

- station / place
- route
- night phase
- one punched mark
- return status
- small scene phrase

### Collectible use

- 1枚 = 1場所 / 1場面
- Character限定ticketは通常券の別版として扱う
- secret ticket = spoilerを直接印刷しない
- back sideにNight Route map fragmentを持てる

### Merchandise

- ticket card
- ticket memo
- ticket holder
- pass case
- ticket book
- stamp rally
- event admission style card

---

# 4. Star Beast IP

Star BeastはCharacterの頭に載せるaccessoryではなく、**独立mascot line**にする。

## 4.1 3 layers

### Symbol

一色silhouette / footprint / simple constellation line。

### Mascot

ぬいぐるみ / charm / stamp / sticker。

### Story art

Characterとの関係が分かるscene art。

3つを分ける。

## 4.2 Goods rule

各Star Beastに将来持たせる:

- front silhouette
- side silhouette
- sleep pose
- sit / rest pose
- tiny face rule
- paw / fin / wing micro-mark
- Character灯紋tag position

### Important

Star Beast本体へCharacter灯紋を大きく描かない。

例えばぬいなら:

- 足裏刺繍
- collar tag
- package seal

程度。

### Current21

Current Star Beast authorityは `characterThemeColors.ts` / Current star-beast canonに従う。
旧A-Z灯紋資料の古い動物割当を復活させない。

---

# 5. Named Object IP

Named Objectは**高単価化しやすいlore asset**。

## 5.1 Object design package

各Named Objectは最終的に:

- front / back / side
- scale
- material
- wear / repair marks
- one unmistakable silhouette
- handling gesture
- storage method
- replica-safe detail
- spoiler boundary

を持つ。

## 5.2 履歴刻

Object本体とは別に小さな履歴刻を付けられる。

```txt
Object
+ Character灯紋の小刻印
+ Night Route / date / owner state
```

ただし:

- Current owner / lineageだけを使う
- Candidate lineageを刻印でCanon化しない
- 人気人物の灯紋を売上目的で追加しない

## 5.3 Product ladder

1. paper illustration
2. metal charm
3. miniature
4. functional replica
5. premium collector replica

Story authorityが弱いObjectほど4/5へ進めない。

---

# 6. Character灯紋のGoods System

Source:

- `docs/design/toumon-simple-sigil-canon-v2.md`
- `src/game/data/toumonSimpleSigilCanon.ts`

## 6.1 Entry

- sticker
- pin
- small metal charm
- profile card
- stamp

## 6.2 Daily

- one-point embroidery
- socks
- towel
- pouch
- notebook
- pen clip
- mug bottom mark
- phone case corner mark

## 6.3 Fashion

Character顔を全面に出さず:

- chest one-point
- cuff embroidery
- woven tag
- metal plate
- lining pattern

で使える。

### Body / size rule

Hana / Kaname等の身体性をCharacter goodsで守ることと、apparel size rangeは別問題。

- 体型をサイズネタにしない
- Characterごとにサイズ展開を差別しない
- popularityでCharacter visual identityを細身化しない

## 6.4 Jewelry / premium

- ring engraving
- pendant
- ear cuff / charm
- bracelet tag

Premiumでも灯紋geometryは変えない。

---

# 7. Relationship Goods

2人の関係を売る時に「顔2つを並べる」だけにしない。

## 双灯紋

- 2つの灯紋を保持
- shared node / shared gapは1個だけ
- relationの意味から共有場所を決める

### Relation examples

- buddy = 同じ方向を見るのではなく、互いのopen endを残す
- siblings = shared spacing / rhythm
- ideological mirror = gapを挟んで反対方向
- handoff = one line ends / other begins
- trust = nodeを囲わず共有

### 禁止

- heart shapeへ自動変形
- romanceではない関係を恋愛商品文法へ寄せる
- 人気pairだからCurrent relation typeを変更

---

# 8. Repeat Pattern System

総柄は顔を並べない。

## Pattern families

### ROUTE

夜路印line / node / gap。

### TOUMON FRAGMENT

灯紋そのものを全面リピートせず、**stroke fragmentだけ**を使う。

### OBJECT TRACE

鍵穴、折り目、修理跡、紙縒り、目盛り等の「痕跡」。Objectそのものの絵を敷き詰めない。

### STAR BEAST TRACE

足跡 / 羽根軌道 / 水面跡など。動物顔patternにしない。

### DAWN

夜→朝のline density / open gap変化。

## Rule

- 1 pattern = motif family 2つまで
- full Toumon repeatは密度を下げる
- Character Theme HEXはaccentとして使用
- navy + goldだけを万能templateにしない
- CharacterごとのTheme HEXを生かす

---

# 9. 「夜の記録帳」— Collection Hub

**IPの中心的なcollection product候補。**

ゲーム内Collectionと現実goodsの行為を同じ意味へ寄せる。

## Sections

1. PEOPLE — Character / 灯紋
2. STAR BEAST — mascot / constellation
3. OBJECT — Named Object
4. ROUTE — station / ticket / place
5. RELATION — pair / handoff
6. DAWN — cleared scene / morning proof

## Physical merchandise

- ring binder / refill book
- card sleeve
- ticket sleeve
- stamp page
- small object pocket
- relation spread

### Important

「全部集める=真End」にはしない。
Collection completionを物語上の善悪やHappy End条件へしない。

---

# 10. Display / Carry Goods

Goodsを買った後の次の商品を世界観の中で作る。

## Display

- 夜の駅ホーム display base
- Night Route wall board
- Toumon pin board
- Star Beast rest platform
- Named Object archival tray

## Carry

- mascot carry pouch
- ticket / card case
- Toumon tag strap
- collection mini-book

### Rule

普通の推し活用品へヨルノシルベlogoを貼っただけにしない。

```txt
display = 夜の記録を並べる
carry = 夜の旅へ連れていく
store = 朝まで預かる
```

という意味を持たせる。

---

# 11. Seasonal / Event Variants

季節商品で**灯紋形状は変えない**。

変えてよい:

- material
- background
- Theme HEX balance
- season scene
- packaging
- Star Beast pose
- ribbon / tag

変えない:

- Toumon master geometry
- Character body identity
- relationship type
- Named Object ownership
- Star Beast species / reason

---

# 12. Blind / Trading Goods

Blind商品を作る場合も、Character popularity rankingだけにしない。

Possible lines:

- Toumon 20 / 21
- Star Beast
- Night Station stamps
- Named Object miniatures
- Relationship pair cards
- Route tickets

### Reserve rule

レン等official reserveはCurrent production lineへ自動混入させない。

---

# 13. Price Ladder

## Entry

買いやすい / collect入口。

- sticker
- ticket
- paper card
- small pin
- bookmark

## Core

日常使用。

- pouch
- notebook
- towel
- charm
- cloth goods
- mascot

## Collector

集める行為自体を商品にする。

- 夜の記録帳
- display base
- storage box
- route map
- multi-piece relationship set

## Premium

Story authorityが十分なものだけ。

- Named Object replica
- jewelry
- art book
- high-quality figure / mascot
- soundtrack physical edition

---

# 14. IP伸長の順序

### Phase 0 — 形を作る前

- Current21 Toumon semantics
- Star Beast authority
- Named Object authority
- Station/route grammar

### Phase 1 — one-color assets

- Toumon master SVG
- station marks
- route marks
- Object history marks

### Phase 2 — low-risk goods

- sticker / pin / paper / ticket / bookmark

### Phase 3 — mascot / daily goods

- Star Beast
- cloth / pouch / notebook

### Phase 4 — collection ecosystem

- 夜の記録帳
- display / carry
- relation goods

### Phase 5 — premium

- Named Object replicas
- jewelry
- art book / exhibition

**いきなり高価なreplicaから始めない。**

---

# 15. Commercial Firewall

Popularityで変えてよい:

- production quantity
- restock
- featured Character
- optional art
- event spotlight
- goods category priority

Popularityで変えない:

- Toumon geometry meaning
- personality
- body shape / age / disability / presentation
- relationship type
- family / blood
- death / resurrection
- Main Mystery
- Named Object owner / lineage
- Star Beast identity
- Title1 ending truth

---

# 16. Master Asset Package — 将来作るもの

画像生成ではなく**最終的にはvector master**を正本とする。

Per Character:

```txt
01_toumon_master.svg
02_toumon_micro.svg
03_toumon_reverse.svg
04_toumon_dawn.svg
05_toumon_kokuyou.svg
06_toumon_engraving.svg
07_toumon_embroidery.svg
README.md
```

### micro

16px / small engraving用に形を少し整理してもよいが、意味とsilhouetteは同じ。

### reverse

dark/light background用。geometryは変えない。

---

# 17. 一文

> **ヨルノシルベのIPは「顔がなくても誰か分かる」「誰もいなくても世界だと分かる」「物一つでも物語へ戻れる」状態を目指す。**
