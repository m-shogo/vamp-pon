# ヨルノシルベ1 Ending / Completion Boundary v1

## Status

Title1のEndingとCollectionを、同じ「クリア率」に潰さないためのContent Authority。

この資料はruntimeの最終credits条件を確定するものではない。

- Stage20 `dawn_return_square` = **content end anchor**
- exact runtime Happy End trigger = 未freeze
- All Lights exact runtime denominator = 未freeze
- Existing Achievement14 = legacy runtime catalog

## 4 layers

### Story Complete

**Main Happy End。作品の感情決着。**

重要なのは「すべてを知った」ことではなく、人物が生き続けられるだけの正しい意味を持ち帰ること。

要求しない:

- 全灯100%
- Achievement全解除
- Combat Item18全取得
- Transformation Selected29全使用/取得
- Night Record全読了
- Challenge 100%
- Future15 / Title2 / Title3
- 全謎解明

Stage20をcontent ending anchorとするが、`Stage20 clear = runtime Happy End exact condition` と早期固定しない。

### Game Complete

Main Stage / system / core buildを十分遊んだ層。

Story Complete後も任意で進められる。
Creditsを閉じ込めない。

### Mastery

Character / Pair / Challengeを深く遊ぶ層。

- 好きなCharacterの弱点をBuildで越える
- Pair Traitを使う
- 黒耀化なし / safe return
- route switch
- alternate build

など。

Main powerやHappy EndをMasteryへ閉じ込めない。

### 100% / 全灯

launch scopeの有限な「記憶のしるし」とnamed-object connectionを全て灯した後の最大級の祝福。

Reward direction: **全灯の朝**。

100%未達でもヨルノシルベ1は完走できる。

## All Lights design groups

現Current design:

**20 / 21 / 21 / 48 / 21 / 1**

| Group | Design target | Meaning |
|---|---:|---|
| night_roads | 20 | Series1 Stage20 |
| keepers | 21 | Current21 Character proof |
| item_lineages | 21 | Current21 character named-object lineage |
| kagemono | 48 | Current48 Kagemono |
| bonds | 21 | Current21を関係の中で一人ずつ灯すproof |
| night_margin | 1 | secret / anomalyを束ねるdesign placeholder |

合計design target = 132。

ただしこれは**exact runtime node denominatorではない**。

`allLightsCompletionDesign.runtimeFrozen=false`

かつruntime draft specificationも `runtimeFrozen=false` のまま。

## Important denominator boundaries

### item_lineages=21 は Combat Item18ではない

`item_lineages`はCurrent21それぞれのnamed-object lineage。

現在のCombat Item Candidate 18は:

- PASSIVE 14
- FIELD_ITEM 2
- RARE_SUPPORT 2

という別のCombat Content Master。

18個を100% groupの21 lineagesへ置き換えたり、逆に21 lineagesをCombat Item poolとして扱わない。

**Combat Item18ではない。**

### bonds=21 は Relationship Arc24ではない

Current relationship inventoryは24 arc。

一方All Lightsの`bonds` design targetは21。

これはCurrent21を一人ずつ関係の中で灯すproofというCurrent designであり、24 relation arc全部をそのままcompletion denominatorにする意味ではない。

**Relationship Arc24ではない。**

今後exact bond node designを作る時に、24 arc / Pair Trait / Character proofをどう束ねるかを別途決める。

## Achievement14 boundary

現在runtimeの`ACHIEVEMENT_DEFS`は **Achievement14**。

内容には:

- legacy Stage1/2 shallow/middle/deep clear
- no-berserk challenge
- elite first
- evolution first
- capsule first
- Stage2 unlock

などがある。

これは現在動いているruntime catalogとして尊重する。

しかし:

- Stage1〜20 editorial achievement coverage
- All Lights exact nodes
- Story Complete condition

の正本ではない。

`Achievement14を全部取る = Happy End` にしない。

今後Stage20向けAchievementを増やす場合も、既存14を壊さず別migration / reward balanceを通す。

## Combat Content boundary

現在Title1 Content Masterは:

- Base Weapon: Current8 + Selected16 = Base24
- Combat Item: existing18 placed Stage2-17
- Transformation: Selected29 / Hold9

まで接続済み。

これらは「遊びの幅」であり、Story Completeのチェックリストではない。

禁止:

- Combat Item18全取得でないとラスボス不可
- Selected29を全部見ないとHappy End不可
- Hold9があるため100%不可、という矛盾

Hold candidateは将来再評価可能であり、launch completion denominatorへ自動混入させない。

## Reading boundary

100%へ不要:

- 全文章を最後まで読む
- 全会話既読
- 全Night Record読了

読むこと自体を作業率にしない。

意味のあるunlock / encounter / playはcompletion nodeにできるが、Loreを読むPlayerだけにMain powerを与えない。

## Time / live-service boundary

100%へ不要:

- daily
- weekly
- login streak
- 期間限定event
- 極端な周回数
- 全Character 999回使用

買い切り/完結作品として、後から始めたPlayerが永続的に100%不能になる条件を作らない。

## Future15 boundary

Future15 / Title2以降はTitle1 completion denominatorへ含めない。

Future Characterを候補として深掘りすることと、Title1のHappy End/100%をFuture release待ちにすることは別。

Title1はTitle1だけでStory Complete可能にする。

## All Lights reward

`全灯の朝` はStory endingの代替ではなく、100% Playerへの**postgame celebration**。

方向:

- 戦闘ではない短いfree-walk
- Current21
- Star Beast
- named items
- Current48をほどいた記憶の紙影
- Stage1〜20 motif
- Playerが灯した星図線

などが一つの朝へ集まる。

しかしexact scene / asset / denominatorはruntime freeze前に確定しない。

## Runtime boundary

このSourceから自動で:

- credits gate
- save schema
- 100% denominator
- Achievement migration
- reward claim state

を変更しない。

実runtime確定には:

1. exact Story Complete trigger
2. exact Game Complete definition
3. exact finite All Lights node set
4. denominator versioning
5. existing saves migration
6. duplicate reward claim prevention
7. Achievement expansion/migration
8. UI progress presentation
9. postgame unlock sequence
10. playtest

が必要。
