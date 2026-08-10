# ヨルノシルベ — Series Content Expansion Candidate Hub v1

Date: 2026-08-10  
Status: **CANDIDATE ENTRYPOINT / CURRENT CANON UNCHANGED**

> 1・2を作品として作り込み、3への伏線を置くための新しいCandidate群の入口。
>
> 既存 `CANON.md / CHARACTERS.md / STORY.md / ENEMIES.md` のAuthorityを置換しない。Human Reviewで採用された項目だけ、後続PRでCurrent masterへ段階的に昇格する。

---

# 1. 今回追加した六つの核

## A. Series / Story Content Master

`docs/series-1-2-3-content-master-v1.md`

扱うもの:

- Series 1: Current21中心の友情 /兄妹 /擬似家族 /青春 /仲間 /ライバル /離反 /再会 /卒業
- Series 2: Future cast候補を使った老い /不老 /師弟 /恋愛 /片想い /嫉妬 /双子 /三つ子Candidate /Robot /動物 /卒業
- Series 3: 夜の存在理由 /関係と記憶 /Main Mystery候補
- 作品1の具体Main Beats
- Core / Circle / Shadow / Reserveの感情役割
- Great Shadow 46–48との接続
- Named Object / Item /世代継承の物語利用
- Happy Endを壊さないsequel architecture

## B. Ensemble / Relationship Grammar

`docs/ensemble-relationship-grammar-v1.md`

扱うもの:

- 箱推しされる集団を作る原則
- 主人公不在の人間関係
- Social Glue / outsider / caretaker / witness等の感情role
- 食卓 /雨 /修理 /寝坊 /写真 /星獣などGroup Heartbeat
- 友情 /兄弟 /擬似家族 /師弟 /恋愛 /嫉妬 /裏切り /離反 /再会 /卒業の使い分け
- 別れた後に「元通り」ではなく変わったまま関係を選び直す設計
- 年長者 /長寿者 /Robot /双子 /三つ子の関係設計境界

## C. Niche Appeal / Fetish Matrix

`docs/character-niche-appeal-fetish-matrix-v1.md`

扱うもの:

- 190個のニッチな「刺さり」Candidate
- 体型 /年齢 /眼鏡 /手 /服 /声 /仕事 /生活癖
- 友情 /兄弟 /師弟 /恋愛 /片想い /嫉妬 /裏切り /離反 /再会 /卒業
- 双子 /三つ子 /長寿者 /動物 /Robot
- 年少者を性的フェチ化しない境界

## D. Cast-wide Niche Appeal Assignment

`docs/character-niche-appeal-assignment-v1.md`

扱うもの:

- Current21 + Future15 = 36人へ実際の刺さりを配布
- Primary / Secondary / Relationship payoffを人物ごとに分離
- 同じ眼鏡 /クール /体型でも出方を変える
- ハナ /カナメ /ゲン /シロ /レン等の既存visual factsを維持
- ヒヨリ /トウマ /クロエ /ノア /ルム /カイ /ナオ等のFuture方向を維持
- 三つ子 /若く見える長寿成人はgap reservoirのまま保持

## E. Character Appearance Source Book — 原本

`docs/character-appearance-source-book-v1.md`

**生成より上流の人物原本。**

扱うもの:

- Current21 + Future15 + 今後追加する全人物の容姿設計原則
- 顔型 / 頬 / 目の開き / 目尻 / 目間隔 / 一重・奥二重・二重 / 眉 / 上下まつ毛 / 鼻 / 唇 / 歯 / 耳 / 生え際
- エクボ / ゲジ眉 / 細目 / 吊り目 / 猫目 / 狐目 / 垂れ目 / 三白眼 / 八重歯 / 歯gap / ほくろ / そばかす / 年齢線 / 傷などの顔貌variation
- ピアス / 舌ピ / septum / helix / industrial / tattoo / 和彫りCandidate / faded tattoo / piercing hole等のbody history
- 手の大きさ / 節 / callus / 爪 / 指輪跡 / 作業痕
- 体格 / 年齢 / 肌 / 姿勢 / clothing construction / accessory hierarchy
- 友情 /兄弟 /擬似家族 /師弟 /恋愛 /離反 /再会 /卒業が外見へ残す変化
- 歳を取る顔・手・刺青・服の変化と、不老者だけ変化しない怖さ
- 双子 / 三つ子 / Replica Robotの「似ていることに意味がある」設計
- 新規37人目以降も既存36人とのnearest face比較を必須化

### HARD landmark例

- ユイ = **笑顔の左右エクボ**。欠けた候補は不合格。
- ミチル = ゲジ眉 + そばかす方向。
- ハナ = 年長 + plus-size顔/bodyを維持。
- カナメ = plus-size broad bodyを維持、slim化禁止。
- シロ / レン = 丸メガネだが顔・視線・lens roleを分離。
- ゲン = smooth young faceへ戻さず年齢を顔と手へ出す。

## F. Appearance Distinction / Generation Contract — 派生

Human-readable:

- `docs/character-appearance-distinction-generation-contract-v1.md`

Machine-readable:

- `src/game/data/characterAppearanceGenerationContracts.ts`
- `scripts/quality/check-character-appearance-generation-contracts.ts`
- `.github/workflows/character-appearance-generation-contracts.yml`

Generation Contractは**EのAppearance Source Bookから派生**する。

扱うもの:

- Current21 + Future15 = 36人全員のface signature
- anti same-face invariant
- candidate review / grayscale / crop / nearest-face QA
- ユイの`YUI-SOFT-DIMPLE`等のmachine-readable hard landmark
- カイ /ナオ、ノア等のintentional resemblance exception
- コヨリ等の年少人物へ成人向けbody modificationを配らない境界
- 犬クウ /猫ヨモ /Robotルムへ人間anime顔を貼らない境界

生成時はcharacter名だけを渡さず:

```txt
Appearance Source Book
↓
Generation Contract
↓
prompt / candidate
```

の順にする。

---

# 2. User direction captured

今回の設計で明示的に保持する感情・関係:

```txt
友情
兄弟
擬似家族
青春
仲間
師弟
恋愛
片想い
嫉妬
裏切り
離反
死別
再会
卒業
信頼
```

人物 /表現側:

```txt
双子
三つ子Candidate
おじさん
おばさん
若く見える長寿成人
メガネ
褐色女性
褐色男性
大柄女性
ぽっちゃり
ツンデレ
無愛想
クール
動物
機械 /Robot
細目
吊り目
猫目
狐目
垂れ目
三白眼
ゲジ眉
太眉 /細眉 /左右非対称眉
一重 /奥二重 /末広二重 /平行二重 /heavy hood
上まつ毛 /下まつ毛の差
エクボ /ほくろ /そばかす /傷 /笑い皺 /年齢線
八重歯 /前歯 /歯gap /唇差
ピアス /舌ピ /septum /helix /industrial
tattoo /和彫りCandidate /faded tattoo
手 /爪 /指輪 /callus /作業痕
服装construction /アクセサリー密度の差
```

既存Future15で既に保持されている:

- 褐色女性ヒヨリ
- 褐色男性トウマ
- 犬クウ
- 猫ヨモ
- Robot Aノア
- Robot Bルム
- 双子カイ /ナオ
- 不老の魔女クロエ
- 年を取る弟子レンジ

Current側で既に保持されている:

- ぽっちゃり女性ハナ
- ぽっちゃり男性カナメ
- 年長男性ゲン
- メガネのシロ /レン
- 兄妹リツ /コヨリ
- 主人公級非恋愛バディ ユイ /アサ
- ユイ = **エクボをHARD facial landmarkとして追加**

三つ子は不足枠としてCandidate reservoirへ追加するが、Future15へ自動追加しない。

---

# 3. 次の昇格順

Human Review後、採用する場合は一気にCanon化しない。

推奨:

```txt
P1: Series1感情arcだけ採用
P2: Current21へのniche appeal / Appearance Source配布を人物ごとreview
P3: Series1 Story beat / Enemy48 / Named Object接続
P4: Series2 sequel candidate roster選定
P5: Series2 relation arcs + Future appearance review
P6: Series3伏線だけ採用し、Main Mystery final answerはOPEN維持
```

---

# 4. 禁止

- Future15をCurrent21へ自動昇格しない
- Series2候補を「続編確定」と表示しない
- 三つ子を人数合わせだけで追加しない
- 既存作品の固有台詞 /事件 /デザインをコピーしない
- 特定作家の文体をそのまま模倣しない
- 恋愛を友情 /家族 /師弟より上位rewardにしない
- 死亡だけを泣き装置にしない
- 1のHappy Endを2や3で「実は全部無意味だった」にしない
- 幼く見える人物を性的に扱わない
- 顔差分を髪色 /瞳色 /アクセサリーだけで済ませない
- 生成AI defaultのV字顎 /大目 /小鼻 /同一まつ毛へ全員を収束させない
- 生成の都合で原本のHard landmarkを落とさない

---

# 5. 制作判断

このCandidate群の狙いは「キャラ数を増やす」ことではない。

> **既にいる人物を、顔・体型・手・傷・服・生活・関係・失敗・老い・別れ方まで交換不能なキャラへする。**

新規追加より先にCurrent21 / Future15の密度を上げる。
