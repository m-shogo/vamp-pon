# ヨルノシルベ Game Core Book v1

Date: 2026-07-28  
Status: **CURRENT GAME IDENTITY / CORE UNDERSTANDING MASTER**  
Scope: design understanding only. This document does not automatically change Unity/runtime/U49/U50 readiness.

> この本は「ヨルノシルベは結局どんなゲームなのか」を、人間とAIが毎回同じ場所から思い出すための最上位ゲーム設計書。
>
> Character Bookが人物、Story Bookが物語、Idea Bookが未確定の大事な案を覚えるなら、Game Core Bookは**ゲームとして絶対に見失いたくない中心**を覚える。

---

# 1. 一文で言うと

## CURRENT / USER DIRECTION

**ヨルノシルベは、夜の中で大量の影をほどき、記憶片を拾い、その1ランだけの強いビルドを作り、仲間との組み合わせや危険な力を試しながら朝を目指す、ヴァンサバ系の周回アクション。**

遊び続けると、

- 新しい武器・進化・キャラ・Support・組み合わせが増える
- 小さな永続成長が積み上がる
- Clear Getter型の達成盤が自然に埋まる
- 仲間との連携が強くなる
- 人物や世界の情報が副作用として蓄積する

という二重の成長が起きる。

最初に面白いのは**戦闘とビルド**。

長く好きになる理由として、**人物・関係・世界・伏線**が後ろから効いてくる。

---

# 2. Core Experience Promise

プレイヤーに約束したい感覚は次の5つ。

## 2.1 1ランの途中でどんどん強くなる

序盤は小さな攻撃。

数分後には、

- 攻撃範囲が広がる
- 攻撃同士が噛み合う
- 進化が成立する
- Supportが働く
- 黒耀化を切る判断が生まれる
- 画面を制圧できる

という**ラン内成長の爽快感**がある。

ここは物語より先に成立していなければならない。

## 2.2 毎回違う組み合わせを試したくなる

「強い最適解を1回作ったら終わり」にしない。

違いを作る候補:

- 主人公 / playable character
- 初期灯具
- 灯具の引き
- 持ち物
- 進化
- Support
- Pair Trait / 灯合わせ
- 黒耀化を使うか使わないか
- Stage / enemy composition
- Clear Getter条件

プレイヤーが、

> 次はこのキャラでやってみよう
> 
> このSupportと組ませたらどうなる？
> 
> 黒耀化なしでも行ける？

と自然に次のrunを始めたくなることが重要。

## 2.3 失敗しても完全な無駄ではない

Game Overは必要な敗北。

しかし、1runが丸ごと無意味にはならない。

残せるものの候補:

- 小さな永続資源
- 敵 / Item / Stageの発見進捗
- 達成条件の途中進捗
- 次回のヒント
- Relation / Bondの一部進捗
- Collectionの断片

ただし、**失敗した方が得になる設計にはしない**。

Clearは明確に嬉しい。

失敗は「次なら行けそう」を残す。

## 2.4 キャラを使うこと自体が関係性になる

キャラ情報を読むために好感度作業をするのではない。

```txt
好きな仲間をSupportで呼ぶ
↓
一緒に戦う
↓
助けてもらう / 助ける
↓
Bondが育つ
↓
Gameplay上の連携が強くなる
↓
呼び方・敬語・掛け声・日常も自然に変わる
```

一次報酬はGameplay。

- Assistが賢くなる
- Pair Traitが増える
- 灯合わせへ近づく
- 救援 / 防御 / 連携が変わる

二次報酬として、

- 名前の呼び方
- 敬語
- 冗談
- 弱音
- 日常会
- 人物情報

がついてくる。

## 2.5 遊んだ後で「あれ全部意味があったのか」と思える

物語説明を前面に出さない。

最初は単純に、

- 敵を倒す
- 記憶片を拾う
- レベルアップする
- 朝を目指す

だけでも遊べる。

好きになったプレイヤーだけが後から、

- 敵がなぜその小物を壊さなかったか
- なぜそのキャラだけ呼び方が違ったか
- なぜ星獣同士が先に反応したか
- なぜGame Overしてもやり直せるか
- 黒耀化がなぜその形に歪むか

を読む。

**Gameplayそのものが後から伏線に見える**のが理想。

---

# 3. 3つのループ

ヨルノシルベは、この3つが噛み合って初めて完成する。

## A. Run Loop — その夜の気持ちよさ

```txt
Stage開始
↓
自動攻撃 / 移動 / 回避
↓
敵をほどく
↓
記憶片を拾う
↓
Level Up
↓
灯具 / 持ち物を選ぶ
↓
組み合わせを育てる
↓
進化 / 高火力化
↓
Support / 黒耀化など判断
↓
Boss / 終盤圧力
↓
夜明け or Game Over
```

最重要評価:

> **この1runだけ切り出してもまた遊びたいか。**

## B. Meta Loop — 次の夜を遊びたくする

```txt
Result
↓
小さな永続成長
↓
新しい灯具 / 進化 / Character / Support / Stage
↓
夜明け星図が灯る
↓
次に狙えそうな条件が見える
↓
別のbuildを試す
↓
次のrun
```

重要:

- 数字成長だけにしない
- 遊び方が増える報酬を多くする
- 巨大な作業ツリーにしない
- daily obligation化しない

## C. Attachment Loop — 気づけば好きになる

```txt
一緒に戦う
↓
戦闘中の小さなやりとり
↓
Bond / Relationが育つ
↓
呼び方や行動が変わる
↓
日常の一面を知る
↓
そのキャラをまた使いたくなる
↓
Gameplayの組み合わせも深くなる
```

物語を読む人だけの別ゲームにしない。

**好きになった理由が、実際に一緒に遊んだ時間と一致する**ことが重要。

---

# 4. Clear Getter / 夜明け星図はCore寄り

## USER DIRECTION

Clear Getter型の達成盤は単なるCollectionではない。

**次の遊び方を教えるMeta Gameplay**。

役割:

1. 普通に遊ぶだけでも序盤は自然に灯る
2. Resultで複数マスが気持ちよく更新される
3. 隣の条件を見ると次のrunの目的が生まれる
4. 条件がプレイヤーへ別build / 別Character / 別Supportを試させる
5. 達成にはGameplay上のメリットが返る

報酬候補:

- 小さい永続強化
- 新灯具
- 新進化
- 新Character
- 新Support
- Pair Trait
- reroll / comfort拡張
- Stage / special rule
- cosmetic / sound

そして副作用として、

- Character record
- Enemy record
- World report
- Lost-item meaning
- Mystery hint

が追加される。

読む人は読む。

読まない人は、

> 「何か強くなった。ラッキー」

で次へ進める。

---

# 5. Bond / SupportはCore Gameplayの一部

BondをNovel / Dating side modeに置かない。

**編成と戦闘の拡張軸**として扱う。

### 低い関係

- 基本Assist
- まだ噛み合わない
- 呼び方や台詞にも距離

### 育った関係

- 固有Assist
- 連携精度上昇
- Pair Trait
- 救援や共有効果

### 高い関係 + Story条件

- 灯合わせ
- Character-specificな完成形連携
- 呼び方 / 敬語 / Actionも変化

### 対立関係

仲が悪い = 弱い、にはしない。

思想が衝突する組み合わせは、

- 高火力
- 高リスク
- 不安定
- 特殊build

として使える余地がある。

これはCurrent directionだが、具体的な確率・倍率・slot数はまだLOCKしない。

---

# 6. 黒耀化はCoreの「危険な選択」

黒耀化はStory演出だけではない。

Run中に、

> **今ここで危険を取って大きく強くなるか？**

を作るGameplay装置。

欲しい性質:

- Characterごとに強化方向が違う
- 通常buildではできない強さ
- 短期的な反動 / 煤返り
- 使い所を考える
- 使わない攻略にも意味がある
- Bond / Supportとの相互作用余地

やらない:

- ただAttack +50%
- 全Character同じ挙動
- 常に使った方が得
- 使用 = 悪人化
- Permanent deathの原因

Character-specificな黒耀化名はCharacter identityとして育てるが、具体名を早く全LOCKしない。

---

# 7. Collection / LoreはCoreを補強するSide Effect

情報量は多くてよい。

ただしGameplayの前に出さない。

```txt
Gameplay
↓
Result / Achievement / Bond / Discovery
↓
情報が増える
↓
気になる人だけ読む
```

読み物候補:

- 灯し手の記録
- カゲモノ図鑑
- 忘れ物絵札
- 言葉の記録
- 夜の観測記録
- Character profile
- Star Beast
- 黒耀化の記録
- Person-specific mystery

### 読まないプレイヤー

- Main Gameを最後まで遊べる
- Main Storyを理解できる
- Gameplay報酬を受け取れる

### 読むプレイヤー

- Characterをさらに好きになる
- World Mysteryを考察できる
- Sequelで意味が変わるSeedへ気づける

**「全文を読む」「未読を消す」をPower unlock条件にはしない。**

---

# 8. Storyの役割

StoryはCore Gameplayを止めるものではなく、**遊んだ時間へ後から意味を与えるもの**。

重要な方向:

- 世界は暗い
- 人間の性格は一色ではない
- 日常でCharacterを好きになる
- Main MysteryとCharacter Mysteryは別レーン
- 正史EndingはHappy End
- Permanent deathを主要な泣き装置にしない
- 別れ / 記憶 / 誤解 / 再会 / 成長で泣かせる
- 1作目の感情は1で救う
- Series Mysteryは残せる

Story Engineの具体的な大真相は、現在High-Value Candidateを含む。

**ゲームの核を守るために、Main Mysteryの答えを早くLOCKしない。**

---

# 9. Emotional Core

Game Coreは戦闘だけではない。

ヨルノシルベで最後に残したいのは、

> **暗い夜を何度も一緒に越えたから、その人たちと迎える朝が嬉しい。**

という感覚。

戦闘中の成長と、人物の成長を別々にしない。

例えばCharacterが、

- 一人で全部背負う
- 人を信用しない
- 先へ走る
- 閉じて守る
- 何でも直そうとする

という性格なら、Gameplay上のAssist / Pair Trait / Support behaviorにもその特徴が表れ、成長後に少し変化する余地を持つ。

数値の上昇だけでなく、**戦い方自体がCharacter growthになる**のが理想。

---

# 10. Game Coreではないもの

大切だが、Coreと混同しない。

- exact Main Mystery answer
- exact 21人全員の最終プロフィール
- exact Bond point数
- Support slot数
- 黒耀化の全固有呼称の最終読み
- Clear Getter盤面サイズ
- Permanent upgrade倍率
- Report総数
- Stage総数
- UIの最終見た目
- sequel title / protagonist

これらはCoreを実現するための**可変設計**。

Coreを守るなら後から変えてよい。

---

# 11. Feature判断の質問

新機能を追加するときは、最低でも次のどれを良くするかを見る。

1. 1runの爽快感が上がるか
2. buildの選択肢が増えるか
3. 次のrunを遊ぶ理由が増えるか
4. Character / Supportを使い分ける理由が増えるか
5. Player skill / knowledgeが報われるか
6. Achievementが別の遊び方へ誘導するか
7. Characterを遊んだ結果として好きになれるか
8. 後からGameplayの意味を再解釈できるか

どれにも寄与せず、説明量・画面・通貨・作業だけ増える機能はCoreから遠い可能性が高い。

---

# 12. Anti-Core — ヨルノシルベを別ゲームにしてしまうもの

避けたい方向:

- Storyを読むことが主目的になる
- 長い会話を見ないとPowerが受け取れない
- 好感度Item連打が最適
- Daily login / obligation
- 巨大なPermanent stat treeでSkill / buildが死ぬ
- 1つの最適buildだけが正解
- Character差が見た目だけ
- BondがAttack +%だけ
- 黒耀化が全員同じ
- Collectionを埋める作業がMain Gameになる
- Happy Endを見るために100% lore読破必須
- Sequelのために1作目を未完で終える
- 設定を増やしすぎてCombat tempoが落ちる

---

# 13. Current Booksとの関係

```txt
GAME CORE BOOK
= 何を遊ぶゲームか / 何を絶対見失わないか

Character Book
= 誰と遊ぶか

Story Book
= 遊んだ時間にどんな意味が残るか

Idea Book
= まだ決めていないが忘れたくない可能性
```

優先順位として、Game Core BookはIdea Bookより上。

IdeaがGame Coreとぶつかる場合:

```txt
Ideaを捨てる
or
Coreを変えるほど価値があるかHuman decisionする
```

勝手にCoreを曲げない。

---

# 14. 詳細設計への入口

Game Coreの詳細を詰める時だけ読む。

- `docs/GAMEPLAY-META-PROGRESSION.md` — Run外成長 / achievement / fail-forward
- `docs/BOND.md` — Support / Bond / pair gameplay
- `docs/BLACK-YOUKA.md` — 黒耀化
- `docs/PROGRESSION-ARCHIVE.md` — 夜明け星図 / Collection / optional lore
- `docs/STORY-ENGINE.md` — GameplayとLoreの二重意味候補
- `docs/story-book-v1.md` — Emotional / Story direction
- `docs/181-current-production-canon.md` — Current runtime / production state

---

# 15. まだ決めない

この本はCoreを固定するが、仕様値を固定する本ではない。

今後playtestで決める:

- 1runの最終時間
- enemy density curve
- Level Up frequency
- weapon/passive slot count
- Support slot count
- Bond growth speed
- Permanent growth budget
- 黒耀化のcost / duration
- Achievement density
- Story beat frequency

これらは**Core Experience Promiseが一番気持ちよくなる値**へ調整する。

---

# 16. 最重要

ヨルノシルベの中心は、

> **戦って、拾って、組み合わせて、その夜だけ圧倒的に強くなる。**
>
> **遊ぶほど次の遊び方が増え、仲間との戦い方も変わる。**
>
> **そして気づけば、この暗い夜と、この人たちのことをもっと知りたくなっている。**

この順番を逆にしない。
