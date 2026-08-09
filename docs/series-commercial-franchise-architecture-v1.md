# ヨルノシルベ Series / Commercial Franchise Architecture v1

Date: 2026-08-09  
Status: **CURRENT COMMERCIAL / SERIES DIRECTION — STORY CANON IS NEVER OVERRIDDEN BY SALES DATA**

> ヨルノシルベを1作だけのゲームではなく、2・3・グッズ・本・音楽・イベントまで育てても1の物語を壊さないためのIP設計。
>
> 商業性は「人気が出たものへ設定を後付けする」ために使わない。最初からCharacter / Star Beast / Named Object / Relationship / Sceneの複数入口を持ち、どこから好きになっても本編へ戻れる構造を作る。

---

# 1. 絶対ルール

1. **作品1のHappy Endを作品2・3で無効化しない。**
2. 1で払うべきC-grade mysteryを「続編があるから」で未回収にしない。
3. 続編は旧作の真実を嘘にせず、**同じ物・言葉・記録を別時代から見ることで意味を増やす。**
4. Character growthをresetしない。再登場時に「また同じ失敗をする」だけで話を作らない。
5. 人気投票でcanon romance / death / blood relation / villain化を決めない。
6. 人気の低いCharacterを設定から削除しない。露出量と商品量は調整してもCurrent事実を消さない。
7. 恋愛だけを最上位commercial relationにしない。buddy / siblings / ideological mirror / mentor / night-born trust / generation handoffも同格の商品軸にする。
8. グッズ都合で全員を同じ服・同じ表情・同じポーズへ均すぎない。各Characterのsilhouette / color / object / star beastを優先する。
9. **Star BeastとNamed Objectは「商品化しやすいから追加」ではなく、Characterの価値観と物語上の役割を持つものだけ採用する。**
10. Series Mysteryは存在してよいが、各titleの中心感情は各titleで閉じる。

---

# 2. IPの5本柱

ヨルノシルベの商業入口は単一主人公へ集中させず、次の5軸を並列で育てる。

## A. Character

- 顔 / silhouette
- Theme primary HEX
- Accent HEX
- 口調 / 小さな癖
- signature pose
- 黒耀化との対比

Entry merchandise:

- acrylic stand
- badge
- postcard
- mini clear card
- sticker
- profile card

## B. Star Beast

Characterを知らない人にも届くマスコット入口。

- 21人の動物星座
- Character colorとは別のStar-Beast HEX
- family / lineageだけ意味のある重複
- small mascot / plush / charm / embroideryと相性がよい

Star Beast単独商品からCharacterへ戻れるよう、必ずcharacter ID / constellation / one-line relationを持つ。

## C. Named Object

ヨルノシルベ固有の強いcollector軸。

- ランタン
- 手紙
- 鍵
- 地図
- しおり
- 時計 / 定規
- 押し花
- 夢日記
- 修理痕

低価格ではminiature charm / bookmark / stationery、高価格ではreplica / prop / collector boxへ伸ばせる。

**Named Objectは126 stable IDsの世界観資産と接続し、単なる雑貨モチーフにしない。**

## D. Relationship

人物人気を「単体順位」だけへ閉じない。

商品単位:

- 2人の対照色
- 2個で1図柄になるkey charm
- paired postcard / short story card
- shared object / shared route map
- mini scene diorama
- conversation booklet

Relation typeを商品企画側でも保持する:

```txt
buddy
siblings
ideological_mirror
protection_pair
night_born_trust
time_observation
object_lineage
mentor_learning
ensemble
```

## E. Scene / Place / Time

Characterを置かない商品も育てる。

- 夜の駅
- 湖畔
- 紙飛行機
- Dawn Square
- 夜明け星図
- 四季Loading / TOP world art
- 夜→暁→朝の空

wallpaper / art print / desk mat / calendar / soundtrack jacket / exhibition backdrop向け。

---

# 3. 人気を測る時も5軸に分ける

単純な「推しCharacter 1位」だけでは、主人公と露出量の多い人物にデータが偏る。

将来fan participationを行う場合は最低でも次を分離する。

```txt
favoriteCharacter       = 一番好きな人物
favoriteStarBeast       = 一番好きな星獣
favoriteRelationship    = 続きを見たい関係
wantToCollect           = グッズとして集めたい人物 / 物
wantMoreStory           = もっと話を読みたい人物 / 関係
favoriteScene           = 忘れられない場面 / 朝
```

重要:

- 投票結果 = Canon変更権ではない
- 露出 / side story / 商品再販 / variant判断へ利用する
- 「Character人気」と「グッズ適性」と「物語を見たい」は別metric
- relation人気はromance voteへ変質させない
- 売上だけでなく再訪 / 保存 / share / pair選択も見る

---

# 4. Current21 Commercial Identity Contract

各Characterは最低限、以下のcommercial DNAを持つ。

```ts
commercialIdentity = {
  primaryHex,
  accentHex,
  starBeastHex,
  silhouetteHook,
  starBeast,
  signatureObject,
  signatureAction,
  strongestRelationshipHooks: string[],
  everydayMerchMotifs: string[],
  premiumMerchMotif,
  spoilerTier,
  seriesCarryForwardHook,
}
```

既存source:

- `src/game/data/characterThemeColors.ts`
- `docs/character-star-beast-constellation-canon-v1.md`
- `src/game/data/namedObjectRegistry.ts`
- `docs/character-luminous-personal-item-book-v1.md`
- `docs/RELATIONSHIPS.md`

このcontractは「全員同じ数の商品を出す」契約ではない。
**誰の人気が後から伸びても商品企画へ接続できる最低限の識別子を全員が持つ**契約。

---

# 5. Relationship commercial lanes

## Lane A — Broad entry / 主役級

### ユイ × アサ

- type: buddy / non-romance
- product language: lantern blue × name-card pink
- strength: 本編を知らなくても二人組として読みやすい
- good for: key visual, starter pair set, conversation card

### ユイ × クロオリ

- type: ideological mirror
- product language: open lantern / folded black paper
- strength: light-vs-blackの単純善悪にせず思想差が絵になる
- good for: reversible goods, black/blue collector set, artbook spread

## Lane B — Family / everyday warmth

### リツ × コヨリ

- type: siblings / non-romance
- shared constellation: Canes Venatici
- strength: 二頭の猟犬という星獣設定そのものがpair merchandiseになる
- good for: 2体plush, half-and-half candy motif, family short story

## Lane C — Core / Shadow mirrors

- ナギ × カナメ — close / shield
- ミチル × トキ — choose route / measure route
- トモリ × ツムギ — repair / leave trace
- アサ × カスミ — reveal name / protect by hiding

強み:

- before/afterや両面商品へ向く
- 黒耀化artと相性がよい
- 片方を悪役扱いしないことがcollector価値になる

## Lane D — Night-born / quiet pair

- ユウビ × トバリ — letter / gate
- マドカ × レン — observation / difference
- シロ × ツムギ — unknown page / unfinished page
- ネム × トキ — dream / measurement
- ゲン × ミチル — old route / current route

派手な主人公セット以外のlong-tail人気を育てるlane。
small scene / stationery / booklet / audio drama向け。

## Lane E — Ensemble

現在の4群:

1. ユイ / アサ / クロオリ
2. ナギ / カナメ / リツ / コヨリ
3. ミチル / トキ / ゲン / マドカ / レン
4. トモリ / ツムギ / ハナ / シロ

ensemble merchandiseでは「21人全部集合」だけでなく、この意味のある小集団を使う。

---

# 6. Merchandise ladder

## Tier 0 — Free / discovery

- phone wallpaper
- printable profile card
- SNS icon frame
- Star Beast mini sticker data
- Lorebook share card

目的: 好きになる入口。

## Tier 1 — Impulse / low price

- sticker
- postcard
- mini clear card
- can badge
- bookmark
- small acrylic charm

Character / Star Beast / Objectの3入口を揃える。

## Tier 2 — Core collection

- acrylic stand
- Star Beast plush / mascot
- pair acrylic
- small diorama
- theme-color stationery
- relation scene card set

## Tier 3 — Lore collector

- World Bible physical edition
- Night Map / Dawn Constellation print
- Named Object miniature collection
- OST + character booklet
- relation short-story booklet
- black-youka / dawn reversible art

## Tier 4 — Premium identity

乱発しない。

- Yui lantern replica
- high-detail luminous possession replica
- framed constellation / ensemble art
- premium music box / light object only if lore-compatible

「高いからpremium」ではなく、作中の物を現実へ持ち帰る体験にする。

---

# 7. Seasonal / anniversary strategy

四季は既にLoading / Visual assetと相性がよい。

```txt
Spring = paper / blossom / first names
Summer = lake / festival / star light
Autumn = old route / leaves / letters
Winter = snow light / repair / warm objects
Dawn = anniversary / completion / all lights
```

季節衣装だけを量産しない。
Characterのdaily-life action + Star Beast + Named Objectの季節差をセットにする。

Anniversaryでは:

- popularity recap
- fan favorite scene
- relation favorite
- Star Beast favorite
- object favorite

を分離して祝う。

---

# 8. Series continuity contract

Seriesは次の3層で管理する。

## Immutable facts

後作で否定禁止。

- 1のHappy Endは本物
- Current21が1で選んだgrowthは本物
- 黒耀化は外部悪人格ではない
- Star Beastを万能説明役にしない
- 夜では別時代が交差できる
- 物 / 言葉 / 記録は現実時間を渡れる
- relation typeを後作都合で勝手にromance / bloodへ変更しない

## Title-local truth

各作品で完結してよい。

- その地域 / 夜で起きた事件
- その主人公の中心感情
- local antagonist / pressure
- title-specific object lineage
- title-specific dawn

## Series-open truth

後作で段階的に払う。

- 夜の最初の発生条件
- 最初に夜へ帰路を整えた人々
- Star Beast現象の最古記録
- 複数地域 / 時代のNight layerが同一か
- なぜ一部のNamed Objectが強く時代を渡るか

---

# 9. ヨルノシルベ 1 / 2 / 3 の破綻しない役割

以下は**シリーズ構造のCurrent direction**。2/3の主人公・舞台・発売を確定するものではない。

## 1 — 戻す / 開く / 選び直す

中心質問:

> 「記憶や意味は、誰のために開くのか？」

1で必ず払う:

- Nightの作品内で必要な機能
- Black Inkの挙動法則
- Current21の中心growth
- ユイ vs クロオリの思想対立の1作目決着
- Main Happy End

1で全部払わなくてよい:

- Nightの宇宙的起源
- 最初のmaintainer
- Star Beast最古史

## 2 — 継ぐ / 渡す / 他人の未完を受け取る

中心質問候補:

> 「自分が始めていないものを、どう受け継ぐか？」

強い展開:

- Named Object lineageを前面へ
- 別時代 / 別地域から1の物を見る
- 1のCharacterはgrowthを保持したsupport / witness / keeperとして再登場可能
- 全員集合を義務にしない
- 1で脇だったCharacterを別角度から主役級へ上げられる

2がやってはいけないこと:

- 1の朝が偽物だった
- 実は全員死んでいた
- クロオリが単純な悪役だった
- ユイの成長reset
- 売れたpairだけcanon恋愛化

## 3 — 残す / 手放す / 夜そのものを選ぶ

中心質問候補:

> 「残すための仕組みは、いつ手放してよいのか？」

Series-level payoff:

- Night origin / maintenance historyを十分に払う
- 1と2のNamed Object lineageが一本の歴史として見える
- 『保存すること』と『生きること』を対立させない
- 夜を完全破壊して過去作の価値を消す結末にしない
- Ending後も1/2を遊び直す意味が残る

3でも「全ての宇宙の謎」を説明する必要はない。
CharacterとSeriesの中心質問が閉じればよい。

---

# 10. Returning cast rule

続編で旧Characterを出す時の優先順:

```txt
1. そのCharacterの成長を証明できる
2. 新主人公の答えを奪わない
3. Named Object / relation / eraの橋になる
4. fan serviceだけでも日常の一瞬なら許容
5. 旧Characterが説明NPC化しない
```

再登場形:

- playable returner
- support
- letter / record
- repaired object trace
- optional side story
- Star Beast trace
- voice / silhouette cameo

これにより出演できなくても「死亡 / 消失」と扱わず、商品展開も継続できる。

---

# 11. Popularity without story distortion

人気dataから許可される変更:

- goods SKU比率
- restock
- side story優先度
- event出演
- alternate costume / seasonal art
- optional Bond scene量
- Lorebook特集順

人気dataから禁止する変更:

- canon personality rewrite
- forced romance
- family relation捏造
- surprise death
- main mystery truth
- birth era rewrite
- Star Beast重複理由の後付け
- 既存Named Object所有者の差し替え

---

# 12. Commercial data to add to DB later

Character DBへ将来追加:

```txt
commercialRole
silhouetteHook
signatureObjectIds[]
starBeastMerchScale
relationshipMerchHooks[]
seasonalHooks[]
premiumReplicaCandidate
spoilerTier
seriesCarryForwardHooks[]
```

Relationship DBへ:

```txt
commercialLane
pairVisualContrast
sharedMotifs[]
sharedObjectIds[]
spoilerTier
safeForPublicMerch
```

Named Object DBへ:

```txt
replicaSuitability
miniatureSuitability
stationerySuitability
spoilerTier
physicalMaterialNotes
```

販売実績はCanon DBに直接混ぜず、analytics layerへ分離する。

---

# 13. External commercial references — design learning only

2026-08-09時点の参考。

- Bandai Namco Holdings, Integrated Report 2025 — IPをgameだけに閉じず、複数事業・licensing・physical experienceまで横断してfanとの接点を増やすIP axis strategy。
- Sanrio Character Ranking 2026 — 年次fan participationを大規模に継続し、単純総合順位だけでなく「いっしょにいたい」「たくさんあつめたい」「おはなしをみたい」のような異なる好意軸を設けている。

ヨルノシルベは規模や施策を模倣しない。
学ぶのは:

1. IPとの接点を複数作る
2. fanの「好き」を一種類の順位に潰さない
3. 商品 / story / real experienceが相互送客する
4. 長期運用でもCharacter identityを壊さない

---

# 14. Success definition

Commercial successを「一番人気が何個売れたか」だけで測らない。

強い状態:

- 主人公以外にも複数の推しclusterがある
- Star Beastから入った人がCharacterへ戻る
- Relationから入った人が単体Characterも好きになる
- Named Objectを見てstory sceneを思い出す
- 1終了後も2/3を待つ理由があるが、1だけでも満足できる
- old goods / old scenesが続編後に再読価値を持つ
- 人気Characterが変動してもworld bibleが破綻しない

> **ヨルノシルベの商業設計は、商品を増やすことではなく「好きになる入口」と「あとから意味が増える記憶」を増やすこと。**
