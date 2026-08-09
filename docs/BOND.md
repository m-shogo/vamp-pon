# ヨルノシルベ Bond / Support Canon

Date: 2026-07-28  
Status: **CURRENT RELATIONSHIP GAMEPLAY CANON — VALUES NOT LOCKED**

この文書は、Currentの `character-bond-support-system-v1.md` と、旧 `139-friendship-romance-and-bond-system.md` / `140-unstable-bond-and-variance-system.md` に残っていた有効なゲーム設計を統合した入口。

重要: Bondは読み物収集のためのシステムではない。**メインゲームで仲間と戦うほど、連携がゲーム上で強くなる**ことが一次目的。

---

# 1. 基本ループ

```txt
操作キャラを選ぶ
↓
Supportを連れて夜へ行く
↓
一緒に戦う / 助ける / 特性を噛み合わせる
↓
Bondが育つ
↓
Personal / Support / Pair性能が育つ
↓
別の組み合わせも試したくなる
```

副次的に:

- 呼び方
- 敬語
- 戦闘中の掛け声
- リザルト会話
- 日常会
- 弱音 / 冗談 / 本音
- Character Mystery fragment

が自然に増える。

読むこと自体を強化条件にしない。

---

# 2. Bondの正体

Bondは恋愛度ではない。

```txt
Bond = 一緒に過ごした時間 + 信頼 + 理解 + 関係経験
```

世界観表現としては旧案の **「意味の接続安定度」** を有力な説明候補として保持する。

この説明を採用すると:

- 仲良し = 強いだけ、にならない
- 対立していても強い組み合わせを作れる
- ペア技の安定 / 不安定に物語上の理由が付く

ただし「意味の接続」の詳細はMain Mysteryとつながるため、世界法則確定までは **STORY ENGINE CANDIDATE** とする。

Relationship TypeとBondは別。

例:

```txt
relationshipType = sibling
bond = high
```

でも恋愛にはならない。

---

# 3. Bondが上がる行動

周回回数だけで上げない。

候補:

- 同じ夜を生還
- Support Assist成功
- 危機救援
- ペア条件達成
- 灯合わせ使用
- 苦手状況を一緒に越える
- Story Event
- 特殊な夜明け星図条件

Story Gateが必要な関係は、弱いStageの反復だけで最終段階へ行けない。

---

# 4. 一次報酬 — 戦闘で強くなる

## Personal Trait

本人固有の戦い方。

例:

- アサ: 先行 / 突破
- ナギ: 封印 / 保護
- ミチル: 導線 / 帰還
- トモリ: 修復 / 継続
- カナメ: 防護 / 身代わり
- レン: 弱点露出

## Support Trait

Supportとして呼んだ時の固有行動。

## Bond Trait

特定の相手と組んだ時だけ変わる効果。

例:

### ユイ × アサ

- ユイ危機時にアサが先回り
- アサが離れすぎた時にユイの灯りが帰還方向を示す

### ユイ × ナギ

- 重要な記憶片 / pickupを一時的に保護

### ユイ × トモリ

- ランタン / 灯具の停止・破損状態からの復帰を補助

### リツ × コヨリ

- 片方が危険な時、もう片方の星獣が位置や危険を知らせる

## 成長候補

Bondで変化させられるもの:

- Assist frequency
- Assist判断精度
- cooldown
- trigger条件
- 固有効果
- Pair Trait
- 灯合わせ
- 救援 / 復帰 / 防御
- 特定buildとの相互作用

単純な攻撃力+%だけにしない。

---

# 5. Stable / Unstable Relationship Gameplay

旧設計から強く回収する。

**仲が悪い = 弱い**にはしない。

関係性の状態を、ゲーム上の「接続の性質」として分けられる。

## 安定型

関係:

- 長い信頼
- 互いの癖を理解
- 誤解が少ない

Gameplay:

- 効果が読みやすい
- cooldown / timingが安定
- defensive / utility連携が確実
- riskが小さい

## 不安定型

関係:

- 対立
- 思想差
- まだ誤解がある

Gameplay:

- 高い上振れ余地
- 強い固有効果
- 代わりに制御しづらい / costがある

例:

ユイ × Shadow:

- 「返す」と「隠す」の思想衝突
- 高い黒インク干渉力
- 代わりに黒耀側riskやpickup lossなどの候補

## 片寄り型

- 片方だけが理解している
- 片方だけが秘密を持つ

Gameplay:

- 特定条件だけ突出
- 条件外では普通

## 禁忌型

- 本来同時に扱うべきでない能力 / 意味を無理につなぐ

Gameplay:

- 非常に強い特殊build候補
- 明確なrun内cost
- 高難度 / hidden build向け

**重要:** 禁忌型を「真の最強正解」にしない。

---

# 6. 不安定 = 完全ランダムではない

旧Variance案の良い部分だけ使う。

良いrisk:

- 何が起こり得るか事前に分かる
- キャラ関係から理由が分かる
- playerが選択して取るrisk
- buildでriskを抑えられる

悪いrisk:

- 理由なく失敗
- 完全運ゲー
- 重要なクリアがランダムで崩壊
- キャラ関係と無関係なペナルティ

具体的な確率 / 数値 / 上振れ幅はCore prototypeまでLOCKしない。

---

# 7. Bond成長で「不仲」が消えるとは限らない

成長 = 全員仲良し、ではない。

例:

- ライバルは最後まで競う
- Shadowは思想差を残す
- 苦手同士は軽口を続ける
- ただし相手の次の行動を信頼できる

Gameplayでは:

```txt
低Bondの不安定
→ 強いが噛み合わない

高Bondの不安定
→ 思想は違うが、危険な連携を意図して使える
```

という成長が可能。

---

# 8. 灯合わせ

Core 5には10組のexisting canonがある。

例:

- ユイ × アサ — 名を呼ぶ灯
- ユイ × ナギ — しまえない灯
- ユイ × ミチル — 帰り道を呼ぶ灯
- ユイ × トモリ — 消えかけを継ぐ灯

推奨progression:

```txt
通常Support
↓
固有Pair Assist
↓
Pair Trait
↓
高Bond + Story Gate
↓
灯合わせ
↓
終盤: 演出 / 台詞 / 特性が完成
```

灯合わせは会話を読んだ報酬ではない。
一緒に戦った関係のGameplay payoff。

---

# 9. 人物成長 = 性能成長

例:

## アサ

人物:

`先に行く → 一緒に行く`

Gameplay:

`単独先行Assist → 主役の速度へ合わせた突破Assist`

## カナメ

人物:

`自分が全部受ける → 仲間へ任せる`

Gameplay:

`自己犠牲防御 → 交互防御 / shared guard`

## レン

人物:

`気づいても黙る → 共有する`

Gameplay:

`個人弱点視認 → party weakpoint window`

この一致を全キャラで狙う。

---

# 10. 二次報酬 — 関係が見える

Bondで変化する情報はキャラ別。

- 呼称
- 敬語
- 文の長さ
- 命令 / お願い
- 名前を呼ぶ頻度
- 弱音
- 冗談
- 自分から頼るか
- 戦闘後に誰の近くへ行くか
- 星獣同士の距離

全員を呼び捨てにすることが最大Bondではない。

詳細は `docs/CHARACTER-LIFE-AND-SPEECH.md`。

---

# 11. 星獣による非言語Bond

- 低Bond: 少し離れる
- 中Bond: 近くに座る
- 高Bond: 一緒に遊ぶ / 寝る
- 兄弟 / 血縁 / hidden relation: 人間より先に自然な反応
- 対立ペア: 人間が仲良くなっても星獣同士は少し張り合う、など個別差OK

UI gaugeだけに頼らない。

---

# 12. Anti-grind

禁止:

- 弱いStageを100回回して最大Bond
- 好感度アイテムを大量投与するだけ
- 最大Bond = 告白
- 全員同じ解放
- 最重要性能を膨大なBond grindへ置く

欲しい:

- 普通に好きな組み合わせを使っていたら育つ
- 別ペアを試すと新しいbuildが見える
- 失敗した連携が後で成功する
- 呼び方 / animation / timingの変化で育ちが分かる

---

# 13. Implementation boundary

まだLOCKしない:

- Support slot数
- Bond数値幅
- 1run獲得量
- exact cooldown
- stable / unstableの数値補正
- variance確率
- 灯合わせ解放Lv
- romance用の追加値が必要か

RuntimeへはCore prototype / balance / UI検証後に接続する。

---

# 14. Legacy migration

この文書へ設計を吸収したため、通常作業では以下を直接読まない:

- `docs/139-friendship-romance-and-bond-system.md`
- `docs/140-unstable-bond-and-variance-system.md`
- `docs/character-bond-support-system-v1.md`

旧資料にある固定的な恋愛制約・古いキャラ候補・具体的なvariance数値はCurrentへ採用していない。

Current character relationship gameplayは本書を最初に読む。
