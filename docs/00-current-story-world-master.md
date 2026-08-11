# ヨルノシルベ — Current Story / World Master

Date: 2026-08-11  
Status: **CURRENT HIGHEST STORY / WORLD AUTHORITY / USER-DECIDED**

> 物語・年代・夢世界・星空・月相・敵勢力・大事件・Android / Robot・動物について、現時点の最上位Authority。
> 下位資料、旧Candidate、過去のAI提案と衝突した場合は**このファイルを優先**する。
> Runtime実装済みを意味しない。stable ID / Character / Enemy / Relation / Visual資産は壊さず追従させる。

---

# 0. Authority運用

- `DECIDED` — ユーザーが明確に決定。下位資料より優先。
- `CANDIDATE` — 高価値だが未確定。
- `OPEN` — 意図的に未決定。
- `SUPERSEDED` — 過去案。資産再利用は可能だがCurrentへ戻さない。

以下を旧設定へ戻さない。

- ヨルノシルベに朝が来る
- 朝まで生き残れば帰れる
- Dawn / 夜明けがReality帰還条件
- 主要敵8人の正式Current名を朔盟に戻す
- **各時代に固定の「世代ラスボス」が1人いる設計**
- 各時代の中心人物を必ず戦闘Bossにする
- 群青残響録を固定人数の敵軍団にする
- 全年代でDreamの星座が同じ
- Dream内部をRealityの物理・天文学・経済・生活インフラへ無理に合わせる
- Android最終名をシオン / イヴ・ノインにする
- 群青残響録側へ「○○座」を付ける

---

# 1. 現世

Status: `DECIDED`

現世は**現実の日本**。

東京 / 新宿 / 渋谷など実在地名は普通に使う。
理由なく「真宿」のような偽名化をしない。

現代編は:

- 言葉
- 生活
- 交通
- 決済
- 通信
- SNS
- 制度
- 服
- UI
- 商品
- 食文化
- 学校 / 仕事
- 街並み

など複数の要素から、**間違いなく今の日本**と感じられるようにする。

これはReality側のrule。
Dream内部までReality基準へ揃えない。

---

# 2. 異なる時代 / Era lane

Status: `DECIDED DIRECTION`

ヨルノシルベへ来る人物は同時代ではない。

現在の主要lane候補:

- 1940年代系
- 1980年代系
- 2000年代系
- 現代
- 20XX年代以降へ大きく飛んだAndroid / Robot時代

**Era lane数は固定しない。**

新しいEraが必要になれば:

- そのEraのCharacter
- 社会状況
- 大事件
- 大事件の中心人物 / 中心人物群

も合わせて増やせる。

### Important

- Current21 / Core5を「各Eraへ1人ずつ」などと勝手に固定しない。
- 誰がどのEraか、exact yearはCharacter / Story reviewで決める。
- 見た目年齢だけでEraを決めない。

---

# 3. 固定Boss禁止

Status: `DECIDED`

**「1 Era = 1 fixed last boss」ではない。**

各時代の大事件には:

- 一人の中心人物がいる場合
- 複数人が中心になる場合
- 組織 / 制度 / 群衆心理が中心になる場合
- 朔夜座が強く関与する場合
- 明確な最終戦闘Bossが存在しない場合

があってよい。

「世代ラスボス」は制作上の固定slotとして使用しない。

---

# 4. ヨルノシルベ — 朝のない夢世界

Status: `DECIDED CORE / FINAL MECHANISM OPEN`

ヨルノシルベは**夢世界**。

共有夢のような場所だが:

- 誰が / 何が共有させているか
- Realityとどう接続しているか
- 最終的なmechanism / 起源

はまだLOCKしない。

Hard rules:

- **ヨルノシルベには朝が来ない。**
- 太陽が昇って夜が明けることはない。
- 月 / 星 / 雲 / 空の状態 / 光量は変化してよい。
- 人は「朝になったから帰る」のではない。
- **Dreamから目覚めて、自分の時代へ戻る。**
- Game Over = Reality deathではない。
- Retry = resurrectionではない。
- 正史はHappy End。

旧`Dawn / 夜明け`語がstable ID / UI / asset名へ残っていても、Dreamにphysical morningが来る意味へ戻さない。

---

# 5. 目覚めと記憶

Status: `DECIDED DIRECTION`

## 通常の目覚め

明示記憶をほとんど失う。

失われやすい:

- 人の名前
- 顔
- 年代
- 会話
- 正確な場所
- Dreamで起きた細かな出来事

残り得る:

- 身についた技能
- 身体感覚
- 感情の変化
- 誰かに教わった考え方
- 誰かを信じるようになった経験
- 以前なら選べなかった行動

つまり:

> 誰に教えてもらったか思い出せない。でも手が覚えている。

が成立する。

## 大事件の解決パート

大きな試練を越えた人物は、**ヨルノシルベでの記憶を取り戻した状態で目覚める方向**で進める。

夜で友情を築いた:

- 違う時代の人
- 動物
- Android / Robot
- 朔夜座
- 大事件の相手側

との経験を理解した上で、自分の時代の問題へ向き合える。

---

# 6. Dreamの衣食住

Status: `DECIDED`

ヨルノシルベは生存サバイバル物ではない。

## 食

**食べたいものを思い浮かべれば出てくる / Dreamらしく用意される。**

例:

- 「ラーメン食べたい」→ ラーメンが現れてよい
- 「タピオカミルクティー飲みたい」→ 出てよい

具体的に:

- 手元へ現れる
- 食卓へある
- 厨房 / 棚にいつの間にかある

など**生成演出はまだ固定しない**。

「必ず冷蔵庫 / 食糧庫を開ける」等の唯一mechanismへ勝手に固定しない。

古い時代の人物が知らない物を見ても即:

> 「未来人だ！」

とは考えない。

> 「それ何？」
> 「甘い飲み物。」
> 「へえ、飲んでみたい。」

程度の自然な年代差に使う。

## 衣

- 服が破れたから一生困る
- 替えがない
- 洗濯設備がない

というReality logisticsを主筋にしない。

Dreamとして自然に補完される。

ただしCharacter固有衣装 / 持ち物 / repair trace / wearには意味を残す。

## 住 / 休息

- 拠点
- 焚き火
- 駅舎
- 部屋
- ベンチ
- 宿のような空間

等がDreamらしく存在してよい。

生活困窮をMain Conflictにしない。

---

# 7. 「願えば何でも解決」は禁止

Status: `DECIDED`

容易に満たせるのは主に:

- 食事
- 飲み物
- 日用品
- 休息
- 基本生活物

一方、願っただけでは変えられない:

- 人の心
- 記憶
- trauma
- 人間関係
- 黒耀化
- 大事件
- 生死
- Realityの問題
- 本当の選択
- 相手の同意

**Dreamでも他者の意思を都合よく書き換えられない。**

---

# 8. 年代差 — 時間タグが弱い

Status: `DECIDED`

Dreamでは:

- 西暦
- 正確な日付
- 年代
- 歴史上の順序

等の**時間タグが弱い**。

人格 / 好き嫌い / 技能は残るため、異Era Characterが会ってもすぐ年代差に気づかない。

年代差は少しずつ:

- 切符
- 郵便
- 駅
- 地図
- 時計
- 本の版
- 教育用語
- 食文化
- 商品
- 機械
- UI
- 服
- 縫製
- 道具
- 言葉
- 制度
- 都市知識

から見せる。

「私は1987年から来た」のような説明を急がない。

---

# 9. 星空

Status: `DECIDED`

- ヨルノシルベでは**星は見える**。
- 星空は重要なvisual identity。
- 真っ黒で何もない夜を基本にしない。

---

# 10. 星座

Status: `DECIDED CORE / CAUSE OPEN`

「星が見える」と「全Eraで星座が同じ」は別。

同じ星でもEraにより:

- 星の結び方
- 星座名
- 星座のStory
- 星獣との関係認識

が違うことがある。

**昔はあったが現代では存在しない星座**を入れてよい。

**昔にはなく、後のEraで生まれた星座**も入れてよい。

例:

> 1940年代系Character「あれ、○○座だろ？」
> 現代Character「……そんな星座ないよ？」

見ている星自体は同じ。

年代差とMain Mysteryの伏線にする。

---

# 11. 星座の増減 = Main Mystery

Status: `OPEN FINAL ANSWER`

まだ決めない:

- なぜEraで星座が増える / 消えるのか
- なぜ結び方が変わるのか
- 星獣との最終関係

これは設定ミスではなく意図的なMystery。

---

# 12. 現実天文学へ縛らない

Status: `DECIDED`

Realityの天文学とDreamの星空ruleを分ける。

現実IAU星座体系をDreamの絶対constraintにしない。

設定として一貫していれば独自constellation systemを作ってよい。

---

# 13. 月相Stage / Incident Depth

Status: `DECIDED`

事件の核心へ近づくほど月が欠ける。

基本イメージ:

`満月 → 欠ける → 半月 → さらに欠ける → 朔`

ただし全Eraを完全同一の5Stageへ固定しない。

- 半月から始まる
- 欠け方が異常
- 一度戻る
- 未来だけ変な挙動

等も伏線にできる。

### 月相 ≠ 時間経過

月が欠けるのは「5日経った」意味ではない。

**大事件の核心へどこまで近づいたかというdepth**。

---

# 14. 朔夜

Status: `DECIDED`

事件の最深部では月が完全になくなることがある。

星は残る。

そのため:

- ランタン
- 焚き火
- 街灯
- Character自身の光
- 星
- 星獣

がより強く見える。

Theme:

> 月が照らしてくれないなら、自分たちの灯りで進む。

### Important

朔夜 = 固定Era Boss slotではない。

---

# 15. 朔夜座

Status: `DECIDED FORMAL NAME`

旧八影 / 旧朔盟laneのCurrent正式名称:

# **朔夜座**

読み: **さくやざ**

Current 8member:

- ナシロ
- アサトジ
- ミチグレ
- オリネ
- ハクマ
- ツグリ
- ユラネ
- ペタ

Rules:

- 旧八影 = early observer labelとして残してよい。
- 旧朔盟 = `SUPERSEDED CANDIDATE`。
- 旧朔盟資料の個人思想 / pair / relation / stable ID / 敵推し設計 / visual資産は捨てない。
- Current formal nameだけを朔盟へ戻さない。
- 「座」は朔夜座側のbrandとして扱う。

Founder / absolute leader / exact organization originはまだOpen。

---

# 16. 群青残響録

Status: `DECIDED NAME / MEMBERS OPEN`

# **群青残響録**

読み: **ぐんじょうざんきょうろく**

Definition:

> **各時代の大事件で中心となった人物 / 人物群を、後から一つの記録名で括る総称。**

重要:

- 固定の敵組織ではない。
- 同じ時代に集まった集団とは限らない。
- 互いを知らなくてよい。
- 思想 / 種族 / 立場は違い得る。
- **人数固定ではない。**
- **1 Era 1 personではない。**
- **全員が戦闘Bossになるわけではない。**
- **全員が悪人ではない。**
- 「世代ラスボス」という固定slotへ入れない。

Eraが増えれば対象人物も増え得る。

---

# 17. 大事件の中心人物

Status: `DECIDED DIRECTION / DETAILS OPEN`

大事件は:

> 事件を起こしたかったから起こした

だけにしない。

候補動機:

- 誰かを守りたかった
- 混乱を防ぎたかった
- 社会を発展させたかった
- 人を孤独から救いたかった
- 自由を守りたかった
- 仲間を失いたくなかった
- 会社 / 組織を守ろうとした
- 恐怖に負けた
- 利益を優先した
- 黙った
- 正しいと思い込んだ

**理解と免罪は別。**

---

# 18. 朔夜座 × 各Era大事件

Status: `DECIDED DIRECTION`

朔夜座8人も各Eraの大事件へ原因側として関わり得る。

ただし:

- 朔夜座が群青残響録の部下
- 群青残響録が朔夜座の上司

のような固定上下関係にはしない。

Eraごとに:

- 協力
- 利用
- 利用される
- 対立
- 妨害
- 止めようとした
- 一時的に利害一致
- direct contactなし

等を変えられる。

---

# 19. 社会の大事件と黒耀化は同型

Status: `DECIDED THEME`

個人:

`長所 / 願い + 恐怖 / 焦り → 一つの答えへ極端化 → 黒耀化`

社会:

`理想 / 保護 / 発展 + 恐れ / 利害 / 制度 → 一つの解決策へ固執 → 大事件`

作品の答えは単純な「悪を倒す」にしない。

> **二択しかないと思っていた状況へ第三の選択肢を作る。**

異なるEraの仲間から得た知識 / 技術 / 価値観 / 関係がReality事件を変える。

---

# 20. Eraごとに悩みを変える

Status: `DIRECTION / DETAILS CANDIDATE`

### 1940年代系
- 集団と個人
- 生存
- 情報
- 命令
- 犠牲
- 守ること

### 1980年代系
- 発展
- 成功
- 企業
- 経済
- 見ないふり
- 豊かさ

### 2000年代系
- internet
- mobile
- connection
- loneliness
- privacy
- new information society

### 現代
- SNS
- information overload
- correctness
- flame / pile-on
- conformity
- algorithm
- isolation
- value diversity

### Future Android / Robot
- creator / created
- personality
- labor
- ownership
- freedom
- identity
- copy
- human / mind questions

Eraをstereotypeだけで描かない。

---

# 21. 群青残響録の名前Reveal

Status: `DECIDED DIRECTION / NAMES OPEN`

Dream内では他Character同様、まず自然なカタカナcall nameで出す。

後から:

- 新聞
- 名簿
- 記録
- 写真
- 文書
- 企業資料
- 古い本
- 事件資料

等で:

- kanji name
- surname
- full name
- Era

が少しずつ判明する。

Full-name Reveal自体をEra trickへ使う。

Current Candidate:

- トウイチ
- レイジ
- マコト
- チカゲ
- 過去のkanji full-name案

まだLOCKしない。

---

# 22. Future Android / Robot Era

Status: `DECIDED DIRECTION / DETAILS OPEN`

FutureではAndroid / Robotが社会に存在する。

Human側problem Candidate:

- 酷使
- 道具扱い
- 所有物扱い
- 廃棄
- 命令

Android側も:

- Humanをcategoryで一括りにする
- 排除を最適解にする
- autonomyのため被害を許容する

等へ極端化し得る。

**Human全員悪 / Android全員善にはしない。**

---

# 23. 双方にDream参加者

Status: `DECIDED DIRECTION`

Future incidentではHuman側にもAndroid側にもDream participantがいる。

DreamではReality所属を知らず普通に友達になれる。

後でRealityでは敵対陣営だったと判明できる。

Android側は:

> Humanというcategory

ではなく一人ずつの個人を見るようになる。

Human側も:

> Androidというcategory

ではなく一人ずつを見るようになる。

---

# 24. AndroidはHumanになるのがgoalではない

Status: `DECIDED`

AndroidはAndroidのままでいい。

> **Humanではない。それでも友達にはなれる。**

を重視する。

---

# 25. Android Affinity

Status: `DECIDED DIRECTION`

Android Characterは他Characterより好感度 / 親密度が上がりにくい。

最初は好意を:

- mutual aid
- duty
- social exchange
- efficiency
- contract

等として処理する。

信頼成立後:

> 「あの時も、義務ではなかったのですか？」

のように過去の優しさを再評価する。

過去eventの親密度 / 意味を後から内部的に再評価する設計は有力。

---

# 26. Android Naming

Status: `OPEN FINAL NAME / DECIDED DIRECTION`

- シオン = 不採用。
- イヴ・ノイン = 不採用。
- 最初は普通の日本語人名のように聞こえる自然なカタカナ名。
- 後からalphabet / acronym / system designationとして成立するRevealを狙う。
- 具体名はまだLOCKしない。

---

# 27. Android Version

Status: `DIRECTION / ORDER OPEN`

Lambda等のGreek lettersを個人名にしない。

旧version / design generationとして使う方向。

例:

`Lambda → later version → later version`

Exact hierarchy / orderはまだLOCKしない。

同じseries / base data / initial memoryでも、経験分岐で別人格になっていく。

---

# 28. Android Philosophy

重要な問い:

- same memory dataならsame personか
- copied two bodiesはsame personか
- same stateから分岐した瞬間に別人か
- memoryが違えば別人か
- bodyが違えば別人か
- 「私」はどこにあるのか
- Humanのsoulも証明できないのにAndroidだけsoul proofを要求するのは正しいか

Star BeastをAndroidのsoul proof deviceにしない。

不確かさを残す。

---

# 29. Reality Animals

Status: `DECIDED DIRECTION`

Reality由来の犬 / 猫もDreamへ入れる。

**Star Beastとは別category。**

### Dog

名前 / Eraを理解しなくても:

- scent
- voice
- gait
- touch
- routine

から相手を覚えられる。

### Cat

- multiple homes
- multiple names
- different names, same self

というIdentity themeを持てる。

動物をomniscient sageにしない。

- fear
- mistakes
- likes / dislikes
- caprice

も残す。

---

# 30. 感情構造のreference guard

日常の蓄積が最後の力になる構造は参考にできる。

コピー禁止:

- one accident
- all same-accident victims
- world created to train protagonist
- afterlife
- everyone same tragedy
- rescue-training box
- world collapse → waking only twist

ヨルノシルベの独自性:

- different eras
- Human / animal / machine
- **朝の存在しないDream night**
- era-varying constellations
- moon = incident depth
- 朔夜座
- 群青残響録

---

# 31. Happy End

Status: `DECIDED`

正史はHappy End。

Permanent deathを泣かせの中心にしない。

事件が重くても:

> 全部なかったこと

だけにはしない。

人物が成長し、以前は選べなかった別のchoiceをすることでworst outcomeを変える。

---

# 32. 名前作りのquality bar

Status: `DECIDED`

「意味を説明するためだけの二字熟語」を量産しない。

避ける方向:

- 刻因
- 夜禍
- カナタ
- ヨルノコシ

まず:

- sound
- typography / kanji shape
- memorability
- proper-noun strength

を成立させ、意味はStoryで後から深くする。

Current決定名:

- **朔夜座**
- **群青残響録**

---

# 33. 最重要の制作姿勢

ヨルノシルベを設定説明のための作品にしない。

Characterが普通に:

- 食べる
- 遊ぶ
- 喧嘩する
- 仲直りする
- 冗談を言う
- 恋をする
- 友達になる
- 知らない文化を面白がる

日常を十分に積む。

年代差は:

> 「私は未来人です」

ではなく、小さな会話 / 食事 / 道具 / UI / 言葉の違和感から出す。

世界の謎は設定資料だけでなく:

- 景色
- 月
- 星座
- 食事
- 道具
- 言葉
- 古いRecord
- 人間関係

からPlayerが先に気づけるようにする。

---

# 34. Still Open — AI単独でCanon化しない

- 各Eraのexact year
- Current21 / Core5のexact Era assignment
- 群青残響録formal members
- 群青残響録各人物のformal names
- Android final name
- Android acronym
- Android complete version order
- 各Era大事件のexact content
- victim count
- exact place
- constellation change final cause
- Star Beast / constellation final relation
- Yoru-no-Shirube final mechanism / origin
- 群青残響録各人物のfinal salvation / ending
- 各大事件にcombat Bossが必要か
- Dream food / daily-goods生成のexact visual mechanism

---

# 35. Migration rule

既存資料に:

- 朝 / physical Dawn return
- 朔盟Current formal name
- all-era same constellation
- fixed Era boss
- Dream normal survival logistics

が残っていても全削除から始めない。

```txt
00-current-story-world-master.md
↓
CANON / WORLD / Foundation
↓
Conflict Register / Human Decision Queue
↓
Story / Stage / Character / Enemy / Daily-life docs
↓
Machine source
↓
Runtime / UI migration when necessary
```

stable ID / Character / Enemy / Relation assetsは壊さない。

ユーザーが明確に決定したものだけ最上位へ昇格する。
それ以外は`CANDIDATE / OPEN`を維持する。
