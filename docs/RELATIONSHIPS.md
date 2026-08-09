# ヨルノシルベ Relationship Hub

Date: 2026-08-09  
Status: **CURRENT RELATIONSHIP ENTRYPOINT / CURRENT FACTS + CANDIDATES SEPARATED**

> Character同士の関係、会話、Bond、Pair Gameplay、年代差、Future bridgeを扱う時は最初にこのファイルを見る。
>
> 目的は「相関図の線を増やす」ことではない。**全Current21に、その人物だから成立する複数の関係を持たせ、夜で一緒に過ごした時間によって関係が変わる構造を作ること。**
>
> **Relationship popularityは露出・side story・goods優先度へ使えるが、friendship / siblings / ideological mirrorを人気だけでromanceへ変更しない。**

---

# 0. Authority order

```txt
1. docs/CANON.md
2. docs/RELATIONSHIPS.md
3. docs/night-black-ink-star-beast-canon-v1.md  # Night / Yui-Tomori / Kuroori current law
4. docs/character-relationship-arc-book-v1.md
5. docs/character-dialogue-relationship-book-v1.md
6. docs/BOND.md
7. docs/series-commercial-franchise-architecture-v1.md
8. docs/character-connection-web-high-value-candidates-v1.md
9. docs/CHARACTER-LIFE-AND-SPEECH.md
10. docs/future-cast-profile-book-v1.md  # Future candidate only
```

機械可読:

- `public/lorebook/data/world-bible.v1.json`
- `public/lorebook/data/relationship-arcs.v1.json`
- `public/lorebook/data/franchise-strategy.v1.json`
- `docs/design-targets/generated/character-relationship-arc-map-v1.json`
- `docs/design-targets/generated/enemy-relationship-pressure-map-v1.json`

Enemy pressure:

- `docs/ENEMIES.md`
- `docs/enemy-encounter-relationship-pressure-v1.md`

---

# 1. 絶対ルール

- Current21とFuture15を混ぜない
- Future bridgeは将来候補でありCurrent21への昇格ではない
- ユイ×アサは主人公級バディ、恋愛なし
- リツ×コヨリは兄妹、恋愛なし
- ユイ×トモリは同一ランタンのobject lineage、**血縁Canonではない**
- 全員を血縁 / 昔からの知人にしない
- 別時代の関係は「物 / 記録 / 言葉が時間を渡る」を優先する
- 夜で初めて会い、一緒に過ごして生まれる関係を最重要にする
- 最大Bond = 全員タメ口 / 告白 / 仲良し化、にしない
- 思想差が残っても信頼は成立する
- 恋愛を友情 / 家族より上位tierにしない
- Main Mysteryをrelationship sceneだけで勝手に確定しない
- favoriteRelationshipをromance pollとして扱わない
- popularityでfamily / friendship / ideological relationのtypeを書き換えない
- sequelで旧Characterのgrowthをresetして同じ関係arcを再演しない

---

# 2. Relationship coverage target

Current21の最低目標:

```txt
各人物:
  strong / distinctive relation lane >= 2

うち最低1本:
  夜で初めて育つ関係
  または Currentの共同経験で変化する関係
```

「2本」は実装イベント数ではない。
制作側がその人物を別の相手と置いた時、**違う面が出る最低密度**。

Commercialでも同じ。
「人気Characterと組ませれば売れる」ではなく、二人でしか見えない差・小物・行動があるrelationを優先する。

---

# 3. Current strong arc inventory

## Detailed in `character-relationship-arc-book-v1.md`

1. ユイ × アサ — 速さと確認
2. ユイ × クロオリ — 開く / 預かる
3. ナギ × カナメ — 二つの守り
4. ミチル × トキ — 道を選ぶ / 測る
5. トモリ × ツムギ — 直す / 跡を残す
6. リツ × コヨリ — 守る兄 / 救う妹
7. セン × コヨリ — 教える人 / ruleを作る子ども
8. ユウビ × トバリ — 届ける時 / 門を開ける時
9. マドカ × レン — 気づく / 伝える
10. シロ × ツムギ — 未分類 / 未完
11. ネム × トキ — 夢 / 計測
12. ゲン × ミチル — 昔の道 / 今の道

## Coverage pass additions

13. アサ × カスミ — 名乗らせる / 隠して待つ
14. ユイ × トモリ — 持ち主 / 修理した人 / 継がれた灯り
15. ハナ × ツムギ — 保存 / 傷跡
16. セン × シロ — 説明する / 未分類で残す
17. ナギ × トバリ — 閉じる / 帰るため開ける
18. カナメ × リツ — 守る人同士が誰へ任せるか
19. ユウビ × カスミ — 宛名を見せない配達
20. マドカ × ネム — 見たこと / 夢で見たこと
21. ゲン × トキ — 古い経験 / 現在の測定
22. ハナ × シロ — 意味が分かる物 / 分からない物を残す
23. クロオリ × ユウビ — 今は渡さない責任
24. レン × トキ — 差分 / 測定値

この24本を「全部同じ密度で本編へ実装する」という意味ではない。
Characterを深める際の**優先relation reservoir**。

---

# 4. Coverage pass detailed arcs

## 13. アサ × カスミ — 名乗らせる / 隠して待つ

Status: **CURRENT ideological mirror direction; 具体事件はCandidate**

### First read

アサ:

> 「名前を消すな。」

カスミ:

> 「見せないことと、消すことは違う。」

アサは「存在を取り戻すには名前が必要」。
カスミは「名前を出せば危険になる人もいる」。

### Failure

アサが善意で名前を公開してしまう。
カスミは保護のため隠し続け、本人が自分から名乗る機会を失わせる。

### Chosen trust

二人とも本人へ戻す。

> アサ「何て呼ばれたい？」  
> カスミ「どこまでなら出していい？」

### Dawn proof

共同メモへ名前を書く前、アサがペンを止める。
カスミを見るのではなく、本人を見る。

---

## 14. ユイ × トモリ — 継がれた灯り

Status: **CURRENT CANON object lineage / intermediate handoffs OPEN**

Current Canon:

- ユイは後世でランタンを持つ
- トモリはユイより前の現実時代で、**後にユイへ届く同じ物理ランタン**を修理した
- ランタンは複数の手を経て現実時間を渡り、ユイへ届いた
- ユイが大切にしていた修理痕にはトモリの仕事が含まれる
- 二人は獅子座 / Leoを共有する
- Leo共有は同じ灯り / Named Object lineageへの共鳴
- **二人を血縁Canonにはしない**

OPEN:

- トモリからユイまでの中間所有者
- exact years / 世代間隔
- 最初のランタン製作者

### First read

トモリがユイではなくランタンへ反応する。

> 「それ、見せて。」

人より物を見るのでユイは少しむっとする。
この時点ではプレイヤーへ「昔触った同一物」と明かさなくてよい。

### Middle

ユイは「自分の大切な物」。
トモリは「昔、自分が直した物の修理痕」を見る。

所有 / 制作者 / 修理者 / 継承者が一つの物へ重なる。

### Failure

トモリが善意で勝手に手を入れようとする。
ユイは壊れるのを怖がり触らせない。

### Chosen trust

トモリ:

> 「直していい？」

ユイ:

> 「元通りじゃなくていい。」

トモリは昔と同じ直し方を再現せず、**今の持ち主であるユイが残したい傷を聞く**。

### Dawn proof

朝のユイが修理痕を「傷」ではなく、知らない誰かから続いた手仕事として指でなぞる。
トモリの名前を現実で完全に思い出さなくても、直し方を乱暴に消さない。

### Series value

2/3では中間所有者・別地域・別時代から同じランタンを見ることで、1の真実を嘘にせず意味を増やせる。

---

## 15. ハナ × ツムギ — 保存 / 傷跡

### First read

ハナは「きれいに残したい」。
ツムギは「傷まで残したい」。

### Conflict

押し花の台紙が破れる。

ハナ:

> 「そこ、直さないの？」

ツムギ:

> 「直したら、破れたことまで無くなりそう。」

### Growth

ハナは保存 = 完全状態、だけではないと知る。
ツムギも傷を残すこと自体を目的にしない。

### Dawn proof

新しい台紙へ移す時、古い台紙の小片も一緒に保管する。

---

## 16. セン × シロ — 説明 / 未分類

### First read

センは分からないものを見ると説明モデルを作りたくなる。
シロは分からないなら保留箱へ入れる。

### Conflict

セン:

> 「仮でも名前を付けた方が扱いやすい。」

シロ:

> 「仮の名前が、本当みたいに残ることもある。」

両方正しい。

### Growth

```txt
仮説ラベル
confidence
未分類状態
```

を分ける。

### Gameplay

センのguide / シロのholdを組み合わせ、unknown pickupへ暫定効果を付けるCandidate。

---

## 17. ナギ × トバリ — 閉じる / 帰るため開ける

### First read

どちらも境界を扱うため相性が良く見える。
しかし目的が違う。

- ナギ = 危険を閉じる
- トバリ = 帰れるよう門を管理する

### Failure

ナギが危険ごと門を封じ、帰路も消す。
トバリが帰路を守るため開け続け、危険まで通す。

### Growth

> **閉じる境界と、戻る境界を同じにしない。**

### Dawn proof

ナギが門を閉める前に:

> 「戻る人、いる？」

と聞く。

---

## 18. カナメ × リツ — Protector × Protector

### First read

互いに相手を「無茶する」と思う。
自分の無茶は見えていない。

### Daily comedy

重い荷物を同時に持とうとして譲らない。
最終的にコヨリや別人物が軽い荷物だけ持って先へ行く。

### Failure

二人が同時にfrontへ出てSupport後方が空く。

### Growth

守る役割を:

```txt
front intercept
resource split
retreat cover
```

へ分担。

### Dawn proof

片方が「任せた」と言った時、もう片方が確認しない。

---

## 19. ユウビ × カスミ — 宛名を見せない配達

### First read

ユウビは宛名を確認したい。
カスミは宛名が危険になる場合を考える。

### Conflict

「正しく届けるための情報」が「守るため隠す情報」と衝突。

### Growth

- sealed address
- recipient confirmation
- delayed reveal

という運用を二人で作る。

### Dawn proof

ユウビが宛名のない封筒を見ても:

> 「不備だね。」

ではなく:

> 「確認方法、別にある？」

と聞く。

---

## 20. マドカ × ネム — 見た / 夢で見た

### First read

マドカは「見たこと」に責任を持つ。
ネムは夢を見ても事実だとは言わない。

### Conflict

マドカは夢情報をwarningに使うことを怖がる。
ネムは「ただ覚えてるだけ」と軽く扱いすぎる。

### Growth

夢を予言ではなく:

> **sourceの違うobservation**

として記録する。

### Dawn proof

ネムが夢の話をすると、マドカは「本当？」ではなく:

> 「どの窓から見えた？」

と具体を聞く。

---

## 21. ゲン × トキ — 経験 / 測定

### First read

ゲン:

> 「昔はこうだった。」

トキ:

> 「今は違います。」

### Conflict

ゲンの経験則はsampleが古い。
トキの測定は今この瞬間しか見ない。

### Growth

old observationを捨てず、current measurementと並べる。
年代差解明groupで重要。

### Dawn proof

トキが古い地図へ「誤り」と書かず:

> 「当時値」

と記録するCandidate。

---

## 22. ハナ × シロ — 分かる物 / 分からない物を残す

### First read

ハナは物にまつわる生活の意味を大切にする。
シロは意味が分からなくても捨てない。

### Conflict

ハナは「誰かの思い出」を想像しすぎる。
シロは意味を推測しないことで人間味まで遠ざける。

### Growth

```txt
known provenance
possible story
unknown
```

を分ける。

### Dawn proof

二人で作る箱に:

> 「分からない。でも大切そう」

という分類が初めて出来る。

---

## 23. クロオリ × ユウビ — 今は渡さない責任

### First read

二人とも「待つ」ことができる。
しかし:

- クロオリ = 本人が開ける時まで記憶を預かる
- ユウビ = 受け取れる時を待つ

### Risk

待つことが自己目的化すると永久に渡らない。

### Growth

保留へ:

- owner
- trigger
- reconsideration point

を持たせる。

### Dawn proof

長く持っていた物を渡す時、二人とも「やっと」と言わない。
今がその時だっただけとして扱う。

---

## 24. レン × トキ — Difference / Measurement

### First read

レンはAとBの違いを見る。
トキは値を測る。

似ているが:

- difference = 何が違うか
- measurement = どれくらい違うか

### Failure

二人とも数字 / 差を見すぎ、意味のないvariationまで追う。

### Growth

> **差がある → 測る → 重要かは別途判断する。**

### Future bridge

ノア二bodyの差分を扱う時に非常に強い。
「差があるから偽物」としない安全弁になる。

---

# 5. Current21 coverage table

この表の`>=2`は**design coverage**。実装済みイベント数ではない。

| Character | Distinctive strong lanes | Coverage |
| --- | --- | ---: |
| ユイ | アサ / クロオリ / トモリ | 3 |
| アサ | ユイ / カスミ | 2 |
| ナギ | カナメ / トバリ | 2 |
| ミチル | トキ / ゲン | 2 |
| トモリ | ツムギ / ユイ | 2 |
| セン | コヨリ / シロ | 2 |
| リツ | コヨリ / カナメ | 2 |
| コヨリ | リツ / セン | 2 |
| ゲン | ミチル / トキ | 2 |
| ハナ | ツムギ / シロ | 2 |
| ユウビ | トバリ / カスミ / クロオリ | 3 |
| マドカ | レン / ネム | 2 |
| シロ | ツムギ / セン / ハナ | 3 |
| トバリ | ユウビ / ナギ | 2 |
| ネム | トキ / マドカ | 2 |
| クロオリ | ユイ / ユウビ | 2 |
| カナメ | ナギ / リツ | 2 |
| カスミ | アサ / ユウビ | 2 |
| トキ | ミチル / ネム / ゲン / レン | 4 |
| ツムギ | トモリ / シロ / ハナ | 3 |
| レン | マドカ / トキ | 2 |

**Current21 = 21/21 characters with >=2 distinctive relationship lanes.**

これは「完成」ではなく、少なくとも誰か一人だけに寄生した薄い人物を作らないためのfloor。

---

# 6. Ensemble protection against pair tunnel vision

Pairを増やしすぎると世界がカップリング表になる。
そのため、一定割合はgroup sceneで扱う。

優先group:

- ユイ / アサ / クロオリ — ownership / naming / opening
- ナギ / カナメ / リツ / コヨリ — protect / agency
- ミチル / トキ / ゲン / マドカ / レン — time-layer investigation
- トモリ / ツムギ / ハナ / シロ — preservation / repair
- ユウビ / トバリ / カスミ / クロオリ — delivery / concealment / timing

Groupでは全員に同じ量を喋らせない。
黙る人 / 作業する人 / 後から一言だけ言う人を残す。

Commercialでも「21人集合」だけに頼らず、意味のあるensembleを商品 / art / short story単位に使える。

---

# 7. Scene production order

関係sceneを大量執筆する前に、次の順番で作る。

```txt
1. recurring small behavior
2. battle assist failure
3. short result conversation
4. ordinary daily scene
5. conflict scene
6. chosen-trust gameplay change
7. black-youka rescue connection
8. dawn proof
```

いきなり「泣ける過去回」から作らない。
先に日常の反復を置くから、後で小さい変化が効く。

Relation goodsも同じで、単に二人を並べるより「二人だから思い出す小さな行動 / 物」を使う。

---

# 8. Future15 boundary

Future15のCurrent bridgeは `character-relationship-arc-book-v1.md` と生成JSONへ保存済み。

重要:

- Future15を一度に全員投入しない
- Current21の不足を埋めるためだけに追加しない
- Current21はこの時点で関係coverage floorを満たす
- Futureは新Theme / 新Gameplay / 新時代を持ち込む時に選ぶ
- sequelで人気Current Characterだけを残して新castの中心感情を奪わせない

特に強い将来bridge:

- ノア × レン — same snapshotの最初の差
- クウ × アサ — 名前以外のrecognition
- ヨモ × アサ / カスミ — 複数名
- ルム × トモリ / ツムギ — syncと個体の傷
- アマネ × ミチル — accessibilityではなくroute specialist同士
- ヒヨリ × カスミ — 明るさと静かな配慮を互いに矯正しない

---

# 9. Commercial relationship lanes

Authority:

- `docs/series-commercial-franchise-architecture-v1.md`
- `public/lorebook/data/franchise-strategy.v1.json`

## Broad entry

- ユイ × アサ — buddy / non-romance
- ユイ × クロオリ — ideological mirror

初見でも差が読みやすい。

## Family / everyday

- リツ × コヨリ — siblings / non-romance / shared Canes Venatici

兄妹そのものが二頭の星獣・半分モチーフ・日常sceneへ繋がる。

## Core / Shadow mirror

- ナギ × カナメ
- ミチル × トキ
- トモリ × ツムギ
- アサ × カスミ

善悪の両面ではなく、同じ問いへの異なる答え。
黒耀化 / Dawnの対照visualに強い。

## Quiet night-born

- ユウビ × トバリ
- マドカ × レン
- シロ × ツムギ
- ネム × トキ
- ゲン × ミチル

派手な主役pairだけに依存しないlong-tail人気を育てる。
stationery / booklet / audio scene / mini dioramaと相性がよい。

## Object lineage

- ユイ × トモリ

同一ランタンを別時代から見る。
血縁ではなく物の履歴がSeries 1 / 2 / 3を橋渡しする。

---

# 10. Popularity guardrail

将来favoriteRelationship等を取る場合:

```txt
favoriteRelationship != canon romance vote
```

人気から変えてよい:

- pair goods比率
- restock
- optional short story優先度
- seasonal visual
- event出演
- Lorebook特集順

人気でも変更しない:

- relationship type
- family / blood relation
- forced romance
- Character personality
- Main Mystery truth
- old growth
- death / resurrection

Popularityは「もっと見たい」を知るdata。
「本当はこういう関係だった」に歴史を書き換えるdataではない。

---

# 11. Series return rule

2 / 3で旧pairを再登場させる時:

1. 1で得たgrowthを保持する
2. 同じfailureを初期状態から再演しない
3. 新主人公の答えを旧pairが奪わない
4. Named Object / record / route / Star Beast traceを橋に使う
5. 出ないCharacterを死亡 / 消失扱いしない

ユイ×トモリなら2で中間所有者を知ることで1のrelationが深まってよいが、
「実は血縁でした」で1のobject-lineageの価値を置換しない。

---

# 12. 一文

> **誰かを好きになる理由を「壮絶な過去を知ったから」だけにしない。何でもない夜に何度も同じ癖を見て、一度その癖のせいで失敗し、それでも次はその人へ任せられた、という積み重ねをヨルノシルベの関係の中心にする。人気が出ても、その積み重ねを別のrelation typeへ書き換えず、見たい場面を増やす方向で育てる。**
