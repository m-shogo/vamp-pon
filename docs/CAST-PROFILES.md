# ヨルノシルベ Cast Profiles Hub

Date: 2026-07-28  
Status: **CURRENT PROFILE ENTRYPOINT / CURRENT21 AND FUTURE CANDIDATES KEPT SEPARATE**

> 「みんなのプロフィール」を見る時の入口。Current21とFuture候補を同じ形式で比較できるが、canon statusは混ぜない。

## 0. Roster review / polish

人数・役割重複・登場密度を判断する時は先に読む:

1. `docs/CHARACTER-ROSTER-REVIEW.md` — Current21 + Future15 = 36候補の全体監査、Title1登場密度、重複risk、追加freeze
2. `docs/character-roster-polish-pass-v1.md` — マドカ / レン / セン / ユウビ / レンジと主要overlap群の具体ブラッシュアップ

Current recommendation:

```txt
DELETE NOW      = 0
MERGE NOW       = 0
DEEPEN FIRST    = マドカ / レン / レンジ / セン / ユウビ
KEEP CURRENT21  = YES
KEEP FUTURE15   = YES, candidate pool
NEW CAST FREEZE = YES, temporarily
TITLE1 STORY    = 13前後をfront-facing
TITLE1 PLAYABLE = Current21まで許容
```

**Playable roster数とMain Storyで前面に出す人数を同一にしない。**

## 1. Current21

Current roster:

- Core5: ユイ / アサ / ナギ / ミチル / トモリ
- Circle10: セン / リツ / コヨリ / ゲン / ハナ / ユウビ / マドカ / シロ / トバリ / ネム
- Shadow5: クロオリ / カナメ / カスミ / トキ / ツムギ
- Reserve: レン

Read:

1. `docs/character-book-v4.md` — 21人の人物理解
2. `docs/character-personal-profile-canon-v1.md` — birthday / food / hobby / habit / daily life
3. `docs/character-deep-core-book-v1.md` — contradiction / mystery / growth / 黒耀化
4. `docs/character-star-beast-constellation-canon-v1.md` — 星座 / 星獣
5. `docs/character-roster-polish-pass-v1.md` — overlap改善のCurrent direction

Current21 = **current canon / current shared memory**。

## 2. Future Profile Pool

Read:

1. `docs/FUTURE-CAST.md`
2. `docs/future-cast-profile-book-v1.md`
3. `docs/character-future-diversity-and-nonhuman-expansion-v2.md`
4. `docs/CHARACTER-ROSTER-REVIEW.md`
5. 必要なら `docs/character-long-lived-witch-arc-v1.md`

Future candidates:

| Working | Type / representation | Core |
| --- | --- | --- |
| ヒヨリ | brown-skinned woman / gyaru-mind | 人を肯定できるが自分の弱音が遅い |
| セリカ | ojousama / Lesbian Candidate | 頼ることも礼儀と知る |
| クロエ | long-lived witch | 終わる関係の価値 |
| レンジ | aging apprentice | 有限だから進む。Playable promotionは独立性をさらに磨いてから |
| トウマ | brown-skinned man / Gay / craftsman | 名前より仕事を残したがる |
| クウ | real dog | 名前なしでも人を覚える |
| ヨモ | real cat / multiple names | 違う名でも一匹 |
| ノア | Replica Robot | same memory / different personhood |
| ルム | collective maintenance Robot | we → I |
| マキ | Bisexual adult woman | 決断できる人も迷う |
| スズ | adult feminine-presenting man / 男の娘 | 装うことは嘘ではない |
| イオ | gender undisclosed adult | 分類を急がない |
| カイ | human twin A | 二人でいる安心 |
| ナオ | human twin B | 違いを作りすぎる |
| アマネ | wheelchair user / speed courier | mobility as choice and play |

Future = **USER DIRECTION / HIGH-VALUE CANDIDATE**。Current21へ自動追加しない。

## 3. Shared profile philosophy

Current / Futureどちらも、人物を属性だけで説明しない。

最低限:

```txt
何が好きか
何を食べるか
何をしている時に自然か
何で笑うか
何を嫌がるか
誰といると違う顔が出るか
長所がどう弱点へ歪むか
黒耀化で何が過剰になるか
成長後も何を捨てないか
Gameplayで何が違うか
```

を持つ。

さらにRoster Reviewでは:

```txt
Icon
Unique
Relation
Daily
黒耀化
Gameplay
Theme
```

の7軸で交換不能性を確認する。

## 4. Identity questions across the cast

Future castを加えることで、既存Themeを広げられる。

```txt
ユイ
→ 忘れたら、その時間は消えるのか

クロエ
→ 終わった関係は失われた関係なのか

クウ
→ 名前を忘れても人を覚えられるか

ヨモ
→ 違う名前で呼ばれても同じ自分か

カイ / ナオ
→ 同じ遺伝・家庭・思い出でも別人とは何か

ノア
→ 同じsnapshotから生まれた二人は何をもって別人か

ルム
→ 共有memoryから個人はどう生まれるか

スズ
→ 外見を選ぶことは本当の自分を隠すことか

イオ
→ 分類しないまま人と関係を作れるか
```

作品側が哲学の唯一解を説明台詞で決めない。

## 5. Gameplay-first

プロフィールは読み物を主目的にしない。

```txt
play
→ character is fun / useful
→ Bond / mastery / achievement grows
→ parameter / trait / build option unlocks
→ optional profile / relation / mystery opens
```

読まないplayerは「強くなった、ラッキー」でよい。
好きになったplayerは深く読める。

## 6. Roster-density rule

人数を感じさせないため:

- 1 sceneで重要台詞を持つ人物は3〜5人程度を基本
- 1 Stage arcは1〜2 main + 1 mirror + 2〜3 support程度
- 全員集合でも会話担当を絞る
- Baseの日常はgroup rotationする
- Story脇役でもGameplayで100run使えば推しになれる余地を残す

Supporting characterを「弱い人物」の意味で使わない。

## 7. Normal routing

```txt
docs/CANON.md
↓
docs/CAST-PROFILES.md
↓
docs/CHARACTER-ROSTER-REVIEW.md
├ Current21 -> docs/CHARACTERS.md -> character-book-v4.md
├ Deepen    -> docs/character-roster-polish-pass-v1.md
└ Future    -> docs/FUTURE-CAST.md -> future-cast-profile-book-v1.md
```

Legacy profile booksをrepo-wide searchから通常参照しない。
