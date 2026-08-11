# ヨルノシルベ — Franchise Content Gap Audit v1

Date: 2026-08-11  
Status: **RESEARCH / PRODUCTION BACKLOG / DOES NOT AUTO-CANONIZE NEW LORE**

## 目的

現在のヨルノシルベは Character / Relationship / Combat / Stage / Enemy / Visual / Merchandise の個別設計がかなり強い。

一方、長期人気漫画・アニメでは「主要人物のプロフィール」以外にも、世界が勝手に動いて見えるための周辺資料、連載で毎話引っ張るための演出資料、敵味方以外の社会構造資料が厚い。

本書はそれらを**作品固有の設定をコピーせず、資料カテゴリだけ抽象化**し、現repoで「十分 / 薄い / 明示正本未確認」を整理する。

参考benchmark群は、2025〜2026のコミック上位や長期大型IPから、ONE PIECE / 呪術廻戦 / SPY×FAMILY / キングダム / 葬送のフリーレン / 薬屋のひとりごと / NARUTO / BLEACH等の構造を参照する。

---

# 0. 現在すでに強い領域

以下は新しい設定を増やすより、既存sourceを磨く方が優先。

- Current21 character core / growth / motif
- Future15を含む36人Appearance Source / anti-same-face contract
- birthday / favorite food / hobby / habit / daily-life scene
- theme color / constellation / Star Beast
- Current21 210 pair / 420 directed Affinity
- Featured24 authored relationship beats
- dialogue voice differentiation
- individual combat kit
- Attribute / Status / Reaction / Weapon / Fusion
- Enemy48
- Spotlight8 character depth
- 八影×Current21 168 relation
- 八影28 pair dynamics
- Stage1-20 story/combat progression
- relative time: reality / night / dawn
- object-history thread
- CANON / USER_DIRECTION / CANDIDATE / OPEN_QUESTION boundary
- commercial identity / merchandise entrance
- visual recognition / silhouette / production QA

つまり次の不足は「キャラを増やす」ではない。

**人物の外にある世界、組織、生活、情報、歴史事件、連載演出を埋める。**

---

# P0 — 原本画像へ行く前後で優先したい不足

## GAP-01 社会・組織 Institution Map

### 現状

朔盟Candidate、Current group、駅・郵便・図書・門などの役割はある。

しかし、世界全体として:

- 誰がルールを作るか
- 誰が違反を裁くか
- 誰が記録を管理するか
- 誰が治療するか
- 誰が子どもを保護するか
- 誰が交通を維持するか
- 誰が夜の異変を調査するか

の横断Authorityが薄い。

### 必要資料

`World Institution Matrix`

候補列:

```txt
organizationId
publicName
purpose
jurisdiction
leader/decisionMethod
rankOrRole
recruitment
resources
publicTrust
nightKnowledgeLevel
relationshipToCurrent
relationshipToSakumei
internalConflict
visualSymbol
```

### 理由

学校 / 軍 / 宮廷 / 海軍 / 諜報機関 / 部隊のような「人物を包む制度」があると、主人公がいない場所でも世界が動く。

---

## GAP-02 Faction Map

Current vs Enemyだけではなく、**第三者勢力**が必要。

候補:

- 夜を利用したい者
- 夜を封鎖したい者
- 夜を研究する者
- 夜を信仰 / 畏怖する者
- 夜を知らず生活している者
- 遺物を売買する者
- 記録を保存する者
- 星獣を保護する者
- 朔盟に一部だけ共感する者

全Factionを善悪に分けない。

`Faction Relationship Map`を作る。

---

## GAP-03 Geography / Travel Atlas

### 現状

Stage / route / 駅 / 門 / 古い道は強いが、**世界地理としての位置関係**が弱い。

### 必要

- 地域名
- 地形
- 気候
- 人口感
- 主要産業
- 主要交通
- 移動時間
- 夜で繋がるroute
- 現実では繋がらないroute
- 時代差
- 地域ごとの文化差
- Stageとの対応

地図は単なる背景資料ではなく、物語の因果へ使う。

---

## GAP-04 Knowledge / Secret Matrix

長編で破綻しやすい最大ポイント。

各重要事実について:

```txt
factId
truth
whoKnowsAtStart
whoBelievesWrongVersion
whoSuspects
whoLearnsWhen
howTheyLearn
whoIntentionallyHidesIt
publicVersion
playerKnowledge
revealStage
payoffStage
```

を持つ。

対象候補:

- 夜の正体
- 黒耀化
- 星獣
- 朔盟
- 欠円
- 各人物の時代
- ランタンlineage
- Main Mystery

---

## GAP-05 Historical Incident Ledger

### 現状

reality/night/dawnの3時間層とobject threadは良い。

不足しているのは**世界の歴史を変えた事件そのもの**。

最低10〜20件:

- 大事故
- 失踪
- 火災
- 駅 / route開通・廃止
- 郵便制度変更
- 記録焼失
- 大規模黒耀化
- 星獣初観測
- 朔盟成立に繋がる事件
- Current人物の人生と間接接続する社会事件

各事件は「誰かの悲しい過去を作るため」だけに存在させない。

---

## GAP-06 朔盟 Operational Bible

朔盟思想とmember個性は強くなった。

次に必要なのは「実際にどう動くのか」。

- 盟約を結ぶ条件
- 誰がmember候補へ声をかけるか
- 連絡方法
- pair missionの決め方
- 集合方法
- 欠円の授受
- 情報共有範囲
- memberが拒否できる範囲
- 脱退
- 盟約違反
- 資金 / 物資
- 拠点を持つか
- 死亡 / 行方不明memberの扱い
- publicにはどう見えているか

「悪の秘密基地」で終わらせない。

---

## GAP-07 Life / Death / Injury Rulebook

物語の危険度を固定する。

必要:

- 夜で死亡するとどうなるか
- 現実の身体との関係
- 傷は朝へ持ち帰るか
- 記憶欠損は治るか
- 黒耀化は可逆か
- permanent disability
- coma / sleep
- aging
- Star Beast death / separation
- revival禁止ライン
- death fakeoutの使用制限

これが曖昧だと、どれだけ危険な場面でも「どうせ戻る」と見える。

---

## GAP-08 Promise / Mystery / Payoff Ledger

Stage progressionはあるが、長期作品として:

```txt
promise
firstSeed
reinforcement
misread
reveal
emotionalPayoff
mechanicalPayoff
remainingQuestion
```

を一覧化する。

伏線は数ではなく**回収時に過去sceneの意味が変わるか**で評価する。

---

# P1 — 世界を「住める場所」にする不足

## GAP-09 Family / Household Atlas

兄妹等の個別関係はあるが、全cast横断の:

- 親
- 祖父母
- 養親
- guardians
- 同居人
- estranged family
- deceased family
- chosen family
- family occupation
- inherited object

を一枚で確認できる資料が必要。

血縁を増やす目的ではなく「帰る場所」を描くため。

---

## GAP-10 Civilian Life Bible

戦わない人が何をしているか。

- 朝起きる時間
- 仕事
- 学校
- 買い物
- 医療
- 銭湯 / 風呂
- 娯楽
- 新聞 / ラジオ / SNS相当
- 夜道
- 子どもの遊び
- 老人の居場所
- ペット
- 冠婚葬祭

生活が具体的になるほど怪異が侵入した時に怖くなる。

---

## GAP-11 Diegetic Economy

ゲームwallet economyとは別。

世界内の:

- 通貨
- 給料
- 物価感
- 家賃
- 宿
- 食事価格
- 交通費
- 修理費
- 医療費
- 遺物の価値
- 闇市場
- 朔盟の資源

をrough scaleで持つ。

金額を細かく固定するより、人物の生活階層差を破綻させないことが目的。

---

## GAP-12 Food / Local Culture Atlas

personal favorite foodは21人分ある。

次は世界側:

- 地域料理
- 季節料理
- 夜だけ食べる物
- 駅弁 / 屋台
- 保存食
- 子どものお菓子
- 葬儀食
- 祝い食
- 苦手な食文化

食事sceneは低コストで関係性を出せる。

---

## GAP-13 Calendar / Festival / Ritual

birthdayはあるが、世界共通の時間イベントが薄い。

- 祭り
- 季節行事
- 星を見る日
- 灯りを消す日
- 追悼日
- 駅の記念日
- 学校行事
- 家族行事

「毎年同じ日が来るのに人物の意味だけ変わる」eventを作れる。

---

## GAP-14 Religion / Belief / Funeral

宗教を必ず作る必要はない。

しかし最低限:

- 死者をどう送るか
- 星を何だと思っているか
- 夜を何だと思っているか
- 名前を残すことへの価値観
- 記憶を捨てることへの禁忌
- 墓 / 位牌 / 写真 / 手紙等

は地域差込みで決める。

「宗教なし」も明示設定にする。

---

## GAP-15 Public Rumor / Media / Reputation

Main castだけが真実を知る世界にしない。

各Arcで:

- 新聞見出し
- 子どもの噂
- 掲示板
- 駅員の注意書き
- 都市伝説
- 警察 / 行政発表
- 陰謀論
- 朔盟への誤認

を作る。

同じ事件が立場で別物に見える資料が重要。

---

## GAP-16 Language / Slang / Naming Guide

Character voice differentiationはある。

不足候補は世界言語:

- 地域方言
- 世代語
- 職業語
- 夜固有語
- 侮蔑語
- 愛称
- 敬称
- 朔盟internal term
- Star Beast呼称差
- 時代別語彙

「全員が作者と同じ日本語を話す」を避ける。

---

## GAP-17 Medicine / Care / Recovery

怪我・心的外傷・睡眠・黒耀化があるため、治療者と介護が必要。

- 誰が治療するか
- 医療技術差
- 精神care
- rehabilitation
- child protection
- elder care
- Star Beast care

戦闘後を描くことでdamageに重みが出る。

---

# P1 — Characterを「推し」にする横断資料

## GAP-18 Desire / Need / Lie / Shame / Line Matrix

主要36人に横断して:

```txt
surfaceWant
realNeed
falseBelief
privateShame
secretWish
lineTheyWillNotCross
lineTheyEventuallyCross
thingTheyCannotForgive
tinyThingThatMakesThemHappy
```

を持つ。

既存growthやcoreと重複する項目はsourceを一本化する。

---

## GAP-19 Character Secret Inventory

「秘密があるキャラ」だけでなく、全員について:

- 隠している事実
- 隠している感情
- 本人も気づいていないこと
- 誰には話せるか
- バレた時の損失

を管理する。

全員へ重大秘密を付ける必要はない。

---

## GAP-20 Recurring Gag / Comedy Grammar

日常sceneはあるが、関係性を育てる**笑いの反復**を別資料化する。

例カテゴリ:

- 呼び間違い
- 食べ物
- 方向音痴
- 工具
- 片付け
- 年齢差
- robot literal interpretation
- animal interruption
- 朔盟ペタの小競り合い

同じgagは3回目で意味を変える。

---

## GAP-21 Iconic Quote / Callback Seed Bank

キャラごとに:

- introduction line
- battle line
- ordinary line
- relationship line
- lowest-point line
- dawn line

を持つ。

名言を最初から「名言っぽく」書かず、普通の台詞が後で意味を変える設計を優先。

---

## GAP-22 Rival / Mentor / Successor Map

pair Affinityとは別に、人物の成長機能で分類:

- mentor
- reverse mentor
- rival
- successor
- failed successor
- predecessor
- inherited duty
- inherited object

を可視化する。

---

# P1 — 連載・アニメ的な引きを作る制作資料

## GAP-23 Episode / Chapter Engine

Game Stage20構造と漫画・アニメのepisode cadenceは別。

各episodeへ:

```txt
coldOpen
question
smallGoal
characterFriction
newInformation
turn
visualSetPiece
emotionalBeat
answerOrPartialAnswer
lastImage
nextHook
```

を持たせる。

---

## GAP-24 Cliffhanger Type Library

cliffhangerを毎回「敵が出た」で終わらせない。

種類:

- identity reveal
- choice
- contradiction
- object discovery
- arrival
- departure
- wrong assumption exposed
- emotional confession
- quiet impossible image
- cost revealed

同じ型を連続使用しない。

---

## GAP-25 Quiet Episode / Breather Plan

大事件の間に:

- 食事
- 修理
- 買い物
- 道に迷う
- 手紙を書く
- 動物と遊ぶ
- 夜明けを待つ

だけの短編を置く。

大作ほど休符が必要。

---

## GAP-26 Emotional Temperature Map

Series1全体を:

```txt
wonder
comfort
comedy
mystery
fear
grief
anger
romance/intimacy
triumph
quiet
```

でplotし、同じ温度が続きすぎないよう管理する。

---

# P2 — IPを長期化する時に効く資料

## GAP-27 Environment Visual Bible

Character visual ruleは強い。

次は場所ごとに:

- architecture
- material
- signage
- lighting
- weather
- clutter
- flora
- vehicle
- typography
- night transformation

を固定する。

---

## GAP-28 Prop / Object Master Book

ランタン等のNamed Objectを:

- orthographic view
- material
- dimensions
- damage history
- owner history
- repair history
- sound
- animation
- story use

まで管理する。

---

## GAP-29 Height / Age / Era Lineup

36人 + 朔盟8人を横一列にして:

- height
- shoulder height
- body mass
- age impression
- reality era
- night appearance

を確認する。

Character master制作前に特に重要。

---

## GAP-30 Audio / Music Motif Bible

- character leitmotif
- Star Beast sound
- 朔盟欠円sound
- station ambience
- lantern flame
- dawn motif
- black-youka distortion

を定義する。

台詞がなくても誰が来たか分かる状態を狙う。

---

## GAP-31 Global Naming / Localization Guide

将来の英語等を考え:

- names Romanization
- terms translation intent
- untranslatable word
- honorific policy
- pun preservation
- gender-neutral terms
- pronoun policy

を持つ。

英訳時に世界観を作り直す事故を防ぐ。

---

## GAP-32 Merchandise Scene Matrix

Commercial profileは既に強い。

さらに:

- solo iconic pose
- pair pose
- group pose
- seasonal outfit
- tiny prop
- food item
- chibi behavior
- enemy symbol

をstory sourceへ逆流させない形で整理する。

---

# 優先順位

## 今すぐ

1. GAP-06 朔盟 Operational Bible
2. GAP-04 Knowledge / Secret Matrix
3. GAP-07 Life / Death / Injury Rulebook
4. GAP-05 Historical Incident Ledger
5. GAP-01 Institution Map
6. GAP-03 Geography / Travel Atlas
7. GAP-08 Promise / Mystery / Payoff Ledger

## Character masterと並行

8. GAP-29 Height / Age / Era Lineup
9. GAP-18 Desire / Need / Lie / Shame / Line Matrix
10. GAP-19 Character Secret Inventory
11. GAP-28 Prop Master
12. GAP-27 Environment Visual Bible

## その後

13. Civilian / Economy / Food / Festival / Belief / Rumor
14. Episode Engine / Cliffhanger / Breather / Temperature
15. Audio / Localization / expanded merchandise scene matrix

---

# 結論

ヨルノシルベは現在、**「キャラクターの中身」はかなり厚い。**

次の大きな弱点は:

```txt
キャラ本人
  ↓ 強い
関係性
  ↓ 強い
戦闘 / 敵 / Stage
  ↓ 強い
社会 / 組織 / 地理 / 歴史事件 / 一般人
  ↓ 薄い
情報の伝わり方 / 秘密 / 死のルール
  ↓ 薄い
episodeごとの引き / 休符 / callback
  ↓ production資料として薄い
```

したがって新キャラ追加より、**人物の外側にある世界を厚くすること**を次の設定フェーズとする。
