# ヨルノシルベ Series Cast Selection Contract v1

Date: 2026-08-10  
Status: **CURRENT SERIES SELECTION DIRECTION / CANDIDATE EVALUATION ONLY**

Production source:

- `src/game/data/seriesCastSelection.ts`
- `docs/FUTURE-CAST.md`
- `docs/future-cast-profile-book-v1.md`
- `docs/future-cast-relationship-story-reservoir-v1.md`
- `docs/series-commercial-franchise-architecture-v1.md`

## Purpose

ヨルノシルベ2 / 3を続けても:

- 1のHappy Endを偽物にしない
- 旧Character growthをresetしない
- 人気上位だけでcastを決めない
- 旧cast全員集合を義務にしない
- 新castが旧castの説明係にならない
- 作品ごとのGameplay identityを作る

ための選定契約。

---

# 1. Title questions

## ヨルノシルベ2

**継ぐ / 渡す / 受け取る**

> 自分が始めていないものを、どう受け継ぐか？

扱えるもの:

- Named Objectの履歴
- 技術 / 作業 / 習慣の継承
- 名前や記憶の受け渡し
- route / systemの引継ぎ
- 人から人ではない存在への継承
- family以外の継承

## ヨルノシルベ3

**残す / 手放す / 夜を選ぶ**

> 残すための仕組みは、いつ手放してよいのか？

扱えるもの:

- 長く残る記憶
- maintainer / system
- 分類 / 記録 / archive
- 人がいなくなった後に残る物
- 「残すことが善」の限界
- Nightを維持する / 変える / 手放す判断

---

# 2. Selection axes

Future15を次で見る。

### Positive opportunity

1. titleThemeFit
2. gameplayNovelty
3. eraExpansion
4. namedObjectBridge
5. relationshipExpansion
6. commercialDistinctiveness

### Risk

7. oldCastDependencyRisk
8. expositionBurdenRisk

各1〜5。

これは人気予想ではない。

```txt
commercialDistinctiveness
= Star Beast / silhouette / object / goods / sceneが他Characterと区別できるか

!= このCharacterは人気が出るだろう、という予想
```

Popularity dataは発売後に使う。

---

# 3. Non-automatic score rule

`opportunityScore()` は比較補助。

```txt
positive 6 axes
- 2 risks
```

ただし:

> **スコア1位 = 主人公確定、にはしない。**

Human / editorial selectionでは:

- cast同士の重複
- title全体のtempo
- gameplay composition
- visual composition
- production cost
- voice / relation density
- existing object evidence

を合わせて決める。

---

# 4. New-viewpoint majority

続編のmain story viewpointは**新作側のcastを多数派**にする。

目的:

- 2が「ヨルノシルベ1 DLC」になるのを防ぐ
- 新規Playerが旧21人の全履修を要求されない
- 旧Characterが新Characterの答えを奪わない

Exact人数比はproduction size決定前に固定しない。

ただし:

```txt
旧castだけでmain storyを成立させる
```

のをdefaultにしない。

---

# 5. Returning cast rule

旧castは人気ではなく**必要な橋**で戻す。

Return理由:

- Named Object
- 既存relationship
- era evidence
- 既存growthの次段階
- Gameplay mechanic handoff

悪い例:

> 人気だからユイ、アサ、クロオリを毎回中心へ戻す。

良い例:

> トモリの修理した物の履歴を扱う章なので、トモリの過去の仕事だけが新主人公へつながる。

> トバリのgate知識が新しいroute problemに必要なので、短いmentor / handoff役で戻る。

---

# 6. Series 2 candidate bundles

以下は**exploration bundle**。Final castではない。

## Bundle 2-A — 受け継いだ物は誰のものか

Strong candidates:

- **トウマ** — 作った物 / 作者名 / craftsmanship
- **ノア** — 同じ過去を受け継いだ二body
- **カイ / ナオ** — shared originを持つ二人
- **アマネ** — route / systemを受け継ぎ、使える形へ変える

Strength:

- analog craft + artificial person + human twins + route accessibilityで同じ「継承」を違う素材から読める
- Gameplayが重複しにくい
- commercial silhouetteも分かれる

Risk:

- identityテーマをノア / twinsで重複させすぎない
- technologyが世界観を上書きしない

Possible returning bridges:

- トモリ — repair / object lineage
- ゲン — old route
- トバリ — gate / passage

Return必須ではない。

---

## Bundle 2-B — 記憶は同じまま渡るのか

Strong candidates:

- **ノア**
- **ルム**
- **クウ**
- **ヨモ**

Questions:

```txt
同じdata
同じmemory
名前が違う
名前が分からない
共有memory
匂いで覚える
```

を別々に扱う。

Strength:

- 人間中心の記憶論から外へ広げられる
- Robot / dog / catでvisual・goods入口も大きく分かれる

Risk:

- 「人間よりAI/動物の方が真実を知る」へしない
- Star Beastと現実動物を混同しない

Possible returning bridges:

- クロオリ — memory custody
- アサ — naming
- カスミ — visibility / trace

---

# 7. Series 3 candidate bundles

## Bundle 3-A — 残し続ける人 / 残さない仕組み

Strong candidates:

- **クロエ** — 長く残り続ける人
- **ルム** — maintenance collective / selective sync
- **イオ** — 未分類を残す / 暫定的に言葉を置く
- **ヨモ** — 呼び名が変わっても続く一匹の生活

Strength:

- long-lived / machine / human / animalで「残る」の意味を分散できる
- Main Mysteryを一人の全知人物へ集めなくてよい

Risk:

- クロエをNightの全歴史を知る人物にしない
- ルムをsystem admin解説役にしない
- イオのgenderを分類テーマの答えにしない

Possible returning bridges:

- クロオリ — custody
- ハナ — preserve / handoff
- シロ — unclassified archive

---

## Bundle 3-B — 守る仕組みを誰へ渡すか

Strong candidates:

- **ルム**
- **アマネ**
- **セリカ**
- **ヒヨリ**

Question:

> 仕組みを残すことと、人へ任せることは同じか？

Strength:

- system / route / responsibility / communityへ分解できる
- lore-heavy final chapterを日常側へ戻せる

Risk:

- 「優しい人がみんなのためにsystemを維持する」美談で終わらせない

---

# 8. Anchor potential does not mean final protagonist

Current Future Hubのanchor potential:

- クロエ
- ノア
- ルム
- カイ / ナオ

これは:

```txt
Seriesに大きな問いを作れる
```

という意味。

次を意味しない:

```txt
主人公確定
次回作playable確定
商品展開確定
romance確定
Main Mysteryの鍵確定
```

---

# 9. Renji hold

レンジは重要な候補だが、現在:

- クロエとの関係が強い
- 独立Gameplay / daily life / relationが他候補より弱い

ため:

**deepen before promotion** を維持。

クロエを採用したから自動でレンジも採用、にはしない。

---

# 10. Commercial selection boundary

Commercial distinctivenessは見る。

例:

- Robot figure
- animal plush
- crafted object
- twin pair item
- route / mobility goods
- fashion / cloth
- paper / archive

ただし:

> **商品を作りやすいからstory anchorにする、は禁止。**

逆も同じ。

> Story上重要だから全員同量SKU、も固定しない。

Story importanceとgoods mixは別data。

---

# 11. Representation boundary

Future15の:

- sexuality
- gender presentation
- skin tone
- disability
- species

は人物の一部。

Selection scoreの「diversity points」にはしない。

ただしcast全体を見た時に:

- 同じ生活背景
- 同じ年齢感
- 同じbody
- 同じvoice
- 同じGameplay

へ偏っていないかはensemble QAとして見る。

---

# 12. Immutable from Title 1

2 / 3で禁止:

- Title 1 Happy Endを偽物にする
- old Character growth reset
- friendship / siblingsを人気でromance化
- body / age / disability / presentationをmarketabilityでretcon
- old cast不在=death/disappearance
- Main Mystery説明のためにStar Beastを全知化
- 全員集合をTrue Ending条件にする

---

# 13. Selection workflow

```txt
Future15 master
↓
Title question
↓
individual fit / risk matrix
↓
bundle overlap review
↓
returning bridge necessity
↓
gameplay composition
↓
visual / commercial distinctiveness
↓
production cost
↓
Human editorial selection
↓
only then title-specific Candidate Book
↓
only then explicit Canon promotion
```

スコアだけで最後の2段を飛ばさない。

---

# 14. One sentence

> **続編は人気者をもう一度集める場所ではなく、同じ世界法則を別の人生・別の物・別の遊びから読み直し、前作の朝を守ったまま新しい朝を作る。**
