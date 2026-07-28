# ヨルノシルベ Story / Gameplay Engine Canon

Date: 2026-07-28  
Status: **CURRENT STORY ARCHITECTURE + HIGH-VALUE ENGINE CANDIDATES**

この文書は、過去のSeason Truth / World Logic / Game Over / Long-term Scenario資料から、現在の方針と矛盾しない強い設計構造を統合する。

**重要:** 世界の最終真相そのものはまだLOCKしない。  
ここでは「ゲーム仕様と物語をどう一致させるか」「1で何を閉じ、シリーズで何を残すか」をCurrentにする。

---

# 1. 作品の二重構造

表面では、まずヴァンサバ系ゲームとして成立する。

```txt
敵をほどく
→ 記憶片を拾う
→ Level Up
→ 灯具 / buildを育てる
→ 朝まで残る
→ 次のStageへ
```

考察する人には、同じ行動へ裏の意味がある。

この**GameplayとLoreの二重意味**を重視する。

プレイヤーに説明を読ませる必要はない。
後から気づくと、今まで普通にしていた操作の意味が変わるのが理想。

---

# 2. High-value Story Engine Candidate — 「間違った意味」

旧Season Truth / World Logicでかなり完成度が高かったため、Currentの**最有力Story Engine Candidate**として保存する。

まだMain Mysteryの最終答えとして確定しない。

候補の核:

> **悲しい出来事そのものは消えない。  
> ただ、その出来事についた「間違った意味」が黒インクによって固定される。  
> ユイたちは事実を消すのではなく、その固定をほどいていく。**

この候補が強い理由:

- Happy Endと相性が良い
- 悲劇を「なかったこと」にしない
- 黒インクを単純悪にしなくてよい
- Shadowの「隠して守る」思想にも理由が付く
- 敵 / 経験値 / Level Up / run reset / permanent growthを同じ理屈にできる
- 人物の誤解とMain Mysteryを一部だけ交差させられる

---

# 3. Gameplayの行動に裏の意味を持たせる

「間違った意味」Engineを採用した場合の対応候補。

| Gameplay | Surface | Hidden interpretation candidate |
| --- | --- | --- |
| 敵をほどく | 敵を倒す | 固定された意味を少し剥がす |
| 記憶片 | EXP / pickup | 固定から剥がれた意味片 |
| Level Up | run内強化 | その夜に扱える読み方 / 接続が増える |
| アイテム進化 | weapon evolution | 小物の意味を正しく読み替えて本来の働きを取り戻す |
| Boss | 強敵 | そのページで最も強く固定された誤解 |
| 朝 | Stage clear | その夜で得たものの一部が確定する |
| 恒久解放 | meta growth | 一度確定した理解 / 技術 /準備が次の夜へ残る |
| Game Over | defeat | その夜の読み方が成立しなかった |
| Retry | replay | 同じ未確定の夜を別の読み順 / buildで開く |

**これらは裏設定であり、プレイヤーへ説明しなくてもゲームは遊べる。**

---

# 4. Game Overは死亡ではない

USER DIRECTIONと旧設計が一致している部分として強く保持する。

ヨルノシルベの夜は現実世界そのものではなく、夢 / 記憶 / 仮想空間 / 共有精神世界に近い性質を持つ。

したがって:

```txt
Game Over != 死亡
Retry != 蘇生
```

Current direction:

> **Game Over = その夜の読み方では朝まで到達できなかった。**

> **Retry = 未確定の夜を、別のbuild / 別のSupport / 別の読み順でもう一度試す。**

これは時間を完全に巻き戻す説明でなくてよい。

Gameplay上は普通のリトライとして速く処理する。
Loreを読む人だけ、「なぜ何度も同じStageへ挑めるのか」に意味を見つけられる。

---

# 5. Failureでも一部は残る

Game Overが死ではないため、fail-forwardとも自然につながる。

```txt
run内Lv / 一時build
→ 消える

player knowledge / 確定済みprogress / 小さな痕跡
→ 残る
```

詳細は `docs/PROGRESSION-ARCHIVE.md`。

物語的には、完全に読めなかった夜でも:

- 敵の動き
- 道の折り目
- 小物の輪郭
- 関係の痕跡

などが残る余地がある。

---

# 6. Main MysteryとCharacter Mysteryを分ける

## Main Mystery

作品 / シリーズ全体の問い。

例:

- この夜は何なのか
- 黒インクはなぜ存在するか
- なぜ朝で確定するのか
- 星獣は何を知っているのか
- 誰がこの仕組みを作ったのか

## Character Mystery

個人の問い。

例:

- ユイとトモリはなぜ同じ獅子座か
- クロオリは何を守るために折るのか
- アサはなぜ名前へ執着するか

原則は別レーン。

ただし一部のCharacter MysteryがMain Mysteryの証拠にもなる。

本編クリアに全Character Mystery回収を要求しない。

---

# 7. 1作 / シリーズの謎階層

旧Long-term Architectureから強く回収する。

## C級 — その作品で回収

その作品のキャラ感情 / 中心事件。

必ず1で解決する。

## B級 — 後作で意味が変わるSeed

1では普通の小物 / 違和感。
2以降で意味が変わる。

## A級 — シリーズ全体のMain Mystery

1作で説明し切らない。
ただし最初から最終設定と矛盾しない痕跡を置く。

この分け方により:

```txt
ローカル完結
+
メタ謎継続
```

を両立する。

---

# 8. 小物は三重意味を狙える

良いSeedは:

```txt
1. 初見の意味
2. その作品内で分かった意味
3. シリーズ後に再解釈される意味
```

を持てる。

候補例:

- 未配達の封筒
- 折り目の違う紙片
- 知らない綴じ糸
- 空白のカード
- 半分だけ残った小物
- 同じ日付の記録

ただしSeedを大量に見せつけない。
初見では普通の世界の小物に見えることが重要。

---

# 9. 伏線を置く順番

旧Natural Seed案から移植する。

強い順序:

```txt
1. まず小物 / 背景として存在
2. 敵 / 星獣 / NPCの挙動に違和感
3. Gameplayでその要素を実際に使う
4. Bond / Result / 灯録で別の意味が見える
5. 後から「最初から置いてあった」と気づく
```

最初から説明台詞で関係を教えない。

---

# 10. 「敵だった相手が守っていた」構造

Shadowと特に相性が良い。

初見:

- 邪魔している
- 欠片を遠ざける
- 箱を開けさせない

後から:

- 開く順番を間違えると壊れるものを守っていた
- 光へ晒さない方が安全な記憶もあった

となる余地を持つ。

これによりShadowを単純悪役にしない。

---

# 11. 関係性アーキタイプは「人物属性」ではなく事件へ落とす

旧Relationship Catalogから残す原則。

関係性はラベルを付けるだけでは弱い。

強い関係を作る時は:

```txt
誰が何を誤解したか
↓
何の小物に残ったか
↓
Gameplayでどう使われるか
↓
どの瞬間に意味が変わるか
```

まで持たせる。

Currentで特に相性が良い型:

- 主人公級バディ / ライバル
- 兄妹が互いを救う
- 師匠 × 弟子
- 年を取らない者 × 年を取る者
- 敵だった相手 × 一番理解していた相手
- 封印する人 × 封印された人
- 灯す人 × 帰ってこない人
- かつての親友 × 今の対立者
- ライバル同士
- 年の差友情
- 疑似家族

採用時に恋愛へ自動変換しない。

---

# 12. Happy Endとの接続

Current promise:

- 正史はHappy End
- Permanent deathを泣き装置にしない
- 犠牲 / 一時離脱 / 記憶欠落 / 隔離は使える
- 最後には再会 / 生存 / 目覚め / 戻れる可能性を渡す

「間違った意味」Engineを採用する場合、Happy Endは:

> **悲しい出来事が消えたのではない。  
> その出来事へ貼り付いた、自分を苦しめ続ける意味が唯一の答えではなくなった。**

という着地ができる。

CLANNAD的な日常の蓄積による涙、Little Busters!的な非現実空間だから可能な別れと再会にも接続しやすい。

固有展開はコピーしない。

---

# 13. Sequel architecture

シリーズを続ける場合:

```txt
1作目の中心人物は1作目で救う
↓
1作目のMain Themeへ答える
↓
After-credit / 背景の違和感だけ残す
↓
2では一段上の問いを扱う
```

禁止:

- 1のHappy Endを直後に台無しにする
- ラスボスが生きていた、だけ
- 1の核心を全部未解決にする
- 「本当のエンドは2で」とする

強い続編Seedは、**2を遊んだ後で1の小物の意味が変わるもの**。

---

# 14. 永遠に説明しなくてよい余白

全部説明しない。

説明しなくてもよい候補:

- 一部の落書きの持ち主
- 街の外の全容
- 星獣の全法則
- 黒インクの完全な物理法則
- 全ての夜 / ページ束の数

世界には、考察しても確定しない余白を残す。

---

# 15. Current vs Candidate boundary

## CURRENT

- Gameplay-first
- loreは副作用 / optional
- Main MysteryとCharacter Mysteryは別レーン
- Happy End only
- Game Overは死亡ではない
- Retry可能な非現実的夜世界
- 1作の人物感情は1作で閉じる
- 続編Seedは違和感 / 再解釈型
- 世界設定はゲーム仕様と矛盾させない

## HIGH-VALUE CANDIDATE — 未LOCK

- 黒インク = 間違った意味を固定するもの
- 記憶片 = 固定から剥がれた意味片
- 朝 = その夜の読みを確定する処理
- 地図帳 = 意味の返却 / 確定帳
- ユイ = 持ち主を間違えない子
- 忘れ物係 = 子どもの遊びに見える記憶隔離 / 返却手順
- Game Over時にユイはrunの読み筋を忘れるがplayerは覚える

このCandidate群は非常に整合性が高いが、Main Mystery最終決定前に正史へ固定しない。

---

# 16. Legacy migration

通常作業では以下を直接読まず、本書を読む:

- `docs/130-season-1-truth-map.md`
- `docs/131-long-term-scenario-architecture.md`
- `docs/133-world-logic-and-story-consistency.md`
- `docs/136-game-over-retry-and-revival-logic.md`
- `docs/141-emotional-relationship-archetype-catalog.md`
- `docs/142-natural-buzz-seed-adoption-plan.md`
- `docs/design/world-mystery-dialogue-reveal.md`

旧資料中のSpecific Season番号、旧ロスター、旧恋愛制約、未承認の世界真相はCurrentとして扱わない。
