# ヨルノシルベ Relationship Hub

Date: 2026-07-29  
Status: **CURRENT RELATIONSHIP ENTRYPOINT / CURRENT FACTS + CANDIDATES SEPARATED**

> Character同士の関係、会話、Bond、Pair Gameplay、年代差、Future bridgeを扱う時は最初にこのファイルを見る。
>
> 目的は「相関図の線を増やす」ことではない。**全Current21に、その人物だから成立する複数の関係を持たせ、夜で一緒に過ごした時間によって関係が変わる構造を作ること。**

---

# 0. Authority order

```txt
1. docs/RELATIONSHIPS.md
2. docs/character-relationship-arc-book-v1.md
3. docs/character-dialogue-relationship-book-v1.md
4. docs/BOND.md
5. docs/character-connection-web-high-value-candidates-v1.md
6. docs/CHARACTER-LIFE-AND-SPEECH.md
7. docs/future-cast-profile-book-v1.md  # Future candidate only
```

機械可読:

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
- 全員を血縁 / 昔からの知人にしない
- 別時代の関係は「物 / 記録 / 言葉が時間を渡る」を優先する
- 夜で初めて会い、一緒に過ごして生まれる関係を最重要にする
- 最大Bond = 全員タメ口 / 告白 / 仲良し化、にしない
- 思想差が残っても信頼は成立する
- 恋愛を友情 / 家族より上位tierにしない
- Main Mysteryをrelationship sceneだけで勝手に確定しない

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

Status: **CURRENT ideological mirror direction;具体事件はCandidate**

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

Status: **CURRENT strong connection direction / exact history remains HIGH-VALUE CANDIDATE**

Current:

- ユイはランタンを持つ
- トモリは灯具repair
- 二人は獅子系星獣重複
- 真相未LOCK

### First read Candidate

トモリがユイではなくランタンへ反応する。

> 「それ、見せて。」

人より物を見るのでユイは少しむっとする。

### Middle

ユイは「自分の大切な物」。
トモリは「以前誰かが直した物」と見る。
所有 / 制作者 / 修理者 / 継承者が一つの物へ重なる。

### Failure

トモリが善意で勝手に手を入れようとする。
ユイは壊れるのを怖がり触らせない。

### Chosen trust

トモリ:

> 「直していい？」

ユイ:

> 「元通りじゃなくていい。」

### HIGH-VALUE history Candidate

トモリが別時代で同じランタンを修理した痕跡。
血縁 / 継承 / shared memoryのどれかはまだ確定しない。

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

- クロオリ = 開ける時を待つ
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

---

# 8. Future15 boundary

Future15のCurrent bridgeは `character-relationship-arc-book-v1.md` と生成JSONへ保存済み。

重要:

- Future15を一度に全員投入しない
- Current21の不足を埋めるためだけに追加しない
- Current21はこの時点で関係coverage floorを満たす
- Futureは新Theme / 新Gameplay / 新時代を持ち込む時に選ぶ

特に強い将来bridge:

- ノア × レン — same snapshotの最初の差
- クウ × アサ — 名前以外のrecognition
- ヨモ × アサ / カスミ — 複数名
- ルム × トモリ / ツムギ — syncと個体の傷
- アマネ × ミチル — accessibilityではなくroute specialist同士
- ヒヨリ × カスミ — 明るさと静かな配慮を互いに矯正しない

---

# 9. 一文

> **誰かを好きになる理由を「壮絶な過去を知ったから」だけにしない。何でもない夜に何度も同じ癖を見て、一度その癖のせいで失敗し、それでも次はその人へ任せられた、という積み重ねをヨルノシルベの関係の中心にする。**
