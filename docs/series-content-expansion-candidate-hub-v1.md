# ヨルノシルベ — Series Content Expansion Candidate Hub v1

Date: 2026-08-10  
Status: **CANDIDATE ENTRYPOINT / CURRENT CANON UNCHANGED**

> 1・2を作品として作り込み、3への伏線を置くための新しいCandidate群の入口。
>
> 既存 `CANON.md / CHARACTERS.md / STORY.md / ENEMIES.md` のAuthorityを置換しない。Human Reviewで採用された項目だけ、後続PRでCurrent masterへ段階的に昇格する。

---

# 1. 今回追加した五つの核

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

## E. All-character Appearance Distinction / Generation Contract

Human-readable:

- `docs/character-appearance-distinction-generation-contract-v1.md`

Machine-readable:

- `src/game/data/characterAppearanceGenerationContracts.ts`
- `scripts/quality/check-character-appearance-generation-contracts.ts`
- `.github/workflows/character-appearance-generation-contracts.yml`

扱うもの:

- **Current21 + Future15 = 36人全員**の顔貌signature
- 顔型 / 顎 / 頬 / 目の形 / 目尻角度 / 二重 / 眉 / まつ毛 / 鼻 / 口 / ほくろ / そばかす / 傷
- ピアス / 舌ピ / tattoo / 和彫り等のbody modification候補を人物史と接続
- 髪型だけで差別化しないanti same-face invariant
- clothing construction / accessory densityまで人物ごとに分ける
- ユイの**エクボ必須**
- カイ /ナオの双子、ノアのreplica bodyのように「似ることに意味がある」例外を明示
- コヨリ等の年少人物へ成人向けbody modificationを配らない境界
- 犬クウ /猫ヨモ /Robotルムへ人間anime顔を貼らない境界
- 今後37人目以降の新規characterに `nearestExistingFace` / `howItDiffers` を必須化する設計

生成時はcharacter名だけでなく、このAppearance ContractをPrompt Builderへ添付する。

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
ゲジ眉
一重 /奥二重 /末広二重 /平行二重
上まつ毛 /下まつ毛の差
ほくろ /そばかす /傷 /笑い皺
ピアス /舌ピ /tattoo /和彫り
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
- ユイ = 主人公のエクボをvisual identityへ追加

三つ子は不足枠としてCandidate reservoirへ追加するが、Future15へ自動追加しない。

---

# 3. 次の昇格順

Human Review後、採用する場合は一気にCanon化しない。

推奨:

```txt
P1: Series1感情arcだけ採用
P2: Current21へのniche appeal / face appearance配布を人物ごとreview
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

---

# 5. 制作判断

このCandidate群の狙いは「キャラ数を増やす」ことではない。

> **既にいる人物を、顔・体型・見た目・生活・関係・失敗・別れ方まで交換不能なキャラへする。**

新規追加より先にCurrent21 / Future15の密度を上げる。
