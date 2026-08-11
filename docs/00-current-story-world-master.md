# ヨルノシルベ — Current Story / World Master

Date: 2026-08-12  
Status: **CURRENT HIGHEST STORY / WORLD AUTHORITY / USER-DECIDED + RESEARCH-REFINED ERA BANDS**

> 物語・年代・夢世界・星空・月相・敵勢力・大事件・Android / Robot・動物・日常生活についての最上位Authority。
> 下位資料、旧Candidate、過去AI提案と衝突した場合は**このファイルを優先**する。
> Runtime実装済みを意味しない。stable ID / Character / Enemy / Relation / Visual資産は壊さず追従させる。

---

# 0. Authority運用

- `DECIDED` — ユーザーが明確に決定。
- `CURRENT` — ユーザー方針を満たすため研究・整合確認後に現在採用している設計。後続の明示決定で更新可能。
- `CANDIDATE` — 高価値だが未確定。
- `OPEN` — 意図的に未決定。
- `SUPERSEDED` — 過去案。asset / ID migration上は残せるがCurrentへ戻さない。

## 戻してはいけない旧設定

- ヨルノシルベに物理的な朝が来る
- 朝まで生き残ればRealityへ帰れる
- Dawn / 夜明けをReality帰還条件にする
- 主要敵8人の正式Current名を朔盟へ戻す
- **朔夜座8人をシリーズ全Season共通のprimary antagonist teamへする**
- **朔夜座8人をS1/S2で4人ずつ重点配置する**
- **Seasonが変わってもteam名だけ変えて同じprimary enemy castを使う**
- 各時代に固定の「世代ラスボス」が1人いる設計
- 群青残響録を固定人数の敵軍団へする
- Core5を同じReality era / 同じ現代の5人組へ戻す
- Core5の年代差を衣装だけへ縮小する
- 1940 / 1980 / 2000等の**初期例をExact Canonとして固定する**
- **ユイを「年齢不明のgeneric現代若者」へ戻す**
- **ユイのReality rootを荒川区以外へ勝手に移す**
- **ユイの代表Foodを焼きおにぎりへ戻す**
- S1キャストを「事件が日本だから全員日本生まれ / 日本国籍」に限定する
- 外見（髪色 / 目色 / 肌色）から国籍・民族・出生地を自動決定する
- 年代伏線のために架空のHistorical constellationを「史実」として作る
- Dream内部をRealityの物理・経済・物流へ無理に合わせる
- 食事を考えた瞬間に手元 / 空中へ直接materializeさせる
- Android最終名をシオン / イヴ・ノインにする
- 群青残響録側へ「○○座」を付ける

---

# 1. Reality — 現実の日本

Status: `DECIDED`

Realityは**現実の日本**。

- 東京 / 新宿 / 渋谷など実在地名を普通に使える。
- 理由なく「真宿」のような偽名化をしない。
- 現代編は言葉・生活・交通・決済・通信・SNS・制度・服・UI・商品・食文化・学校 /仕事・街並みから「間違いなく今の日本」と感じられるようにする。
- Historical Eraも実際の日本社会史・生活史・食文化・制度・言葉を研究してから描く。
- **S1のReality大事件・主要事件舞台は日本に限定する。**
- ただしS1に外国籍 / 海外出生 / 海外育ち / 複数国で生活したCharacterがいることは普通に成立する。
- `事件地 = 日本` と `全員の出身 = 日本` を同一視しない。
- 国籍 / 出生地 / 育った場所 / 主な生活圏 / 家庭文化 / 使用言語 / ancestry / ethnicity / appearanceは**別フィールド**として扱う。
- 金髪・青い目・オッドアイ・褐色肌などのappearanceから、欧州系 / アジア系 / 外国籍等を自動推論しない。
- 逆に、日本的に見えるappearanceでも海外出生・海外育ち・外国籍は成立する。
- 海外文化は「外国人記号」として付けず、その人物が実際に生きた場所・家庭・教育・仕事・友人関係から持つ知識として扱う。
- **実在の大事件は背景研究に使うが、ヨルノシルベのEra大事件は架空にする。**
- 実在被害者 / 実在事件を名前だけ変えて再演しない。

Research source:
`docs/research/era-society-food-future-sourcebook-v1.md`

---

# 2. Core5 — 5人とも別Reality Era

Status: `DECIDED HARD RULE / CURRENT ERA BANDS`

Core5:

- ユイ
- アサ
- ナギ
- ミチル
- トモリ

は**Realityでは5人とも別の時代 / 世代背景を持つ**。

```txt
Core5 distinct era count = 5 / 5
```

## Current research-backed Era bands

| Character | Current Reality Era band | 主要な時代pressure |
|---|---|---|
| **トモリ** | **戦後復興・物資不足期** | scarcity / distribution / reconstruction / repair |
| **ミチル** | **高度成長末期〜公害・石油危機の転換期** | development / pollution / urban planning / energy |
| **ナギ** | **バブル崩壊後〜携帯Internet初期** | unstable employment / early network / privacy / identity exposure |
| **ユイ** | **1990年代生まれ / 2026現代日本** | information excess / misinformation / algorithm / loneliness / analog→digital transition memory |
| **アサ** | **遠未来 Human / Android / Robot / Avatar共存社会** | personhood / body / copy / digital identity / ownership |

### Important

以前の:

- 1940年代系
- 1980年代系
- 2000年代系
- 現代
- 未来

は**Era explorationの例**だった。

現在はExact decadeを先に固定せず、**その人物のCoreと最も噛み合う社会の転換期**をCurrent Era bandとして使う。

例外として、**ユイは1990年代生まれがUSER-DECIDED**。Exact birth yearはOpenだが、birth decadeを再びOpenへ戻さない。

---

# 3. Core5 Narrative Role

Status: `CURRENT`

- **ユイ** — Title1全体の中心viewpoint / protagonist。
- **アサ** — protagonist-grade buddy / counter-axis。ユイ×アサはnon-romance。
- **ナギ / ミチル / トモリ** — Core5 main cast。それぞれのReality解決partではera lead / protagonist-grade focusを取れる。

`5 Era = 全chapter完全同尺`ではない。

`ユイが中心 = 他4人が脇役`でもない。

---

# 4. Era固有性 — 同じ悩みを年代だけ変えて反復しない

Status: `DECIDED QUALITY RULE`

各Era大事件は:

```txt
Era固有のordinary problem
+
Era固有のtechnology / institution
+
守りたい / 発展させたい合理的な願い
+
fear / scarcity / pressure
↓
一つの答えだけが絶対化
↓
架空の大事件
```

必須QA:

> **その事件を別Eraへそのまま移して成立するならEra固有性が弱い。**

Current ownership:

- Tomori = scarcity / reconstruction / distribution / repair
- Michiru = development / pollution / energy / city route
- Nagi = early network / privacy / identity exposure / employment insecurity
- Yui = information excess / misinformation / algorithm / isolation
- Asa = personhood / embodiment / copy / digital identity / Android coexistence

各Eraの主problemを重ねすぎない。

---

# 5. Core5 Era × Character Core

## トモリ — 戦後復興・物資不足期

既存Core:

> 壊れていても捨てない / 直して継ぐ。

時代背景は「戦争キャラ」にするためではない。

- 配給
- 遅配 / 欠配
- 買い出し
- 物々交換
- 修繕
- 住宅不足
- informal mutual aid

等を研究し、**足りない時に何を直し、どう分けるか**へ接続する。

Current fictional-incident lane Candidate:

> 公平な配給を目指した統合台帳が、記録に載らない住民を存在しないものとして扱い始める。

実在の飢饉 / 空襲 /戦災をコピーしない。

## ミチル — 高度成長末期〜公害・石油危機

既存Core:

> 正しい道を教える → 一緒に迷って帰れる。

時代背景:

- urbanization
- factories
- new towns
- expanding rail / roads
- pollution
- energy dependence
- oil shock
- growth ideology

Current fictional-incident lane Candidate:

> 新交通網・工業誘致・住宅供給を「最短成長route」へ統合した都市計画が、健康risk・古い生活道・地域の逃げ道を切り捨てる。

解決を「development全部中止」にはしない。

## ナギ — バブル崩壊後〜携帯Internet初期

既存Core:

> 閉じることで守る → 開ける時を本人と決める。

時代背景:

- feature phone / PHS
- mobile mail
- PC mail
- bulletin board / personal site
- handle name
- household Internet transition
- unstable employment /就職氷河期的pressure
- privacy norm形成途中

Current fictional-incident lane Candidate:

> 詐欺・なりすまし等を防ぐため学校 /企業 /地域が作った本人確認・注意人物共有網が、誤登録者を進学 /就職 /居場所から静かに締め出す。

Presentのalgorithm / deepfakeをこのEraの主題へ奪わない。

## ユイ — 1990年代生まれ / 東京都荒川区の下町育ち / 2026現代日本

Status: `USER-DECIDED / MASTER`

既存Core:

> 誰も忘れたくない → 本人が残すもの /手放すものを一緒に選ぶ。

### Reality root

- **東京都荒川区**。
- **下町育ち**。
- Exact neighborhood / nearest station / exact home addressはOpen。
- 誕生日は既存の **11/07** を維持。
- **1990年代生まれ**。Exact birth yearはOpen。
- 2026年現在を生きる成人として扱う。
- 「昭和レトロ好きだから下町」ではなく、古い生活の痕跡が残る場所で完全に現代を生きている人物。

### 世代として経験している変化

ユイは一つの通信環境だけで育った世代ではない。

- 紙の連絡 / 固定電話がまだ普通に残る幼少期
- 家庭PC / Internet普及
- ガラケー / 携帯メール
- 写メ / デジカメ
- SNS普及
- smartphone常時接続
- cloud photo / group chat
- recommendation / ranking
- fake image / deepfake
- generative AI

を人生の中で連続して経験した世代として描ける。

> **「記録が少なかった時代」も「記録が多すぎる時代」も生活感として知っている現代主人公。**

### Representative food — USER-DECIDED

ユイの代表的な好きな食べ物は:

1. **もんじゃ焼き**
2. **たい焼き**
3. **大判焼き**

旧`favoriteFood: 焼きおにぎり`は**代表FoodとしてSUPERSEDED**。
焼きおにぎり自体を嫌いにする必要はないが、ユイを象徴するfavoriteとして復活させない。

Foodの使い方:

- もんじゃは「観光名物説明」ではなく、誰かと鉄板を囲みながら少しずつ作る普通の食事sceneへ使う。
- たい焼き / 大判焼きは帰り道・買い食い・差し入れ・半分こ等の日常へ使う。
- 大判焼きの地域による呼び名差は、**同じ物でも呼び方が違う**という軽い世代 / 地域会話へ使える。ただし一つの呼称を全国唯一の正解扱いしない。
- Foodを「荒川区民なら必ず好き」という地域stereotypeへしない。これは**ユイ本人の好み**。

### 現代時代背景

- smartphone
- SNS
- group chat
- cloud photo
- recommendation / ranking
- generative AI
- fake image / deepfake
- misinformation
- always-connected loneliness
- aging / access issues

Current fictional-incident lane Candidate:

> 都市規模の緊急事態でfake救援情報が急増。混乱を止めるため認証済み情報だけを表示する仕組みが導入されるが、認証できない小さな本物のSOSまで消える。

実在災害の名前 /犠牲者構造をコピーしない。

## アサ — 遠未来 Human / Android / Robot / Avatar共存社会

**アサ本人はHuman。**
Androidへ変更しない。

既存Core:

> 名前を返す → 本人が名乗れる場所を作る。

未来Theme:

- human name
- chosen name
- model designation
- digital identity
- avatar / remote body
- body replacement / augmentation
- memory / skill copy
- branching identity
- Android / Robot personhood
- ownership / labor / contract

Current fictional-incident lane Candidate:

> body exchange / avatar / Android copyが一般化した社会で、行政 /企業が「本人」を一つのContinuity認証へ固定。分岐copyやbody移行したHuman / Androidが法的に本人ではないとされる。

Final answerはまだOpen。

---

# 6. Future research — 攻殻機動隊等から学ぶ範囲

Status: `RESEARCH RULE`

未来は現在の政策 /研究だけでなく、長く評価されるSF作品の**問いの構造**を研究してよい。

『攻殻機動隊』等から学べる軸:

- bodyが変わっても同じ人か
- memoryがcopyされたら同じ人か
- network接続が自由と侵入riskを同時に増やす
- institutionが本人性を固定したがる
- Human / machine境界が曖昧になる

Copyしない:

- franchise固有語を本作system名にする
- organization構造をそのまま移植
- antagonist / incident plotをコピー
- 星獣を魂証明装置にする

ヨルノシルベ独自の答えを作る。

---

# 7. 日本の風刺 / 世相をDialogueへ使う

Status: `CURRENT DIALOGUE DIRECTION`

年代差は歴史授業だけでなく、**別時代の人が別時代の「普通」を見ることで生まれる風刺**へ使う。

Research reservoir:

- 川柳
- 風刺画
- 戦後サラリーマン漫画
- サラリーマン川柳
- 新語 / 流行語
- 若者言葉

Hard:

- 昔の人を無知役へ固定しない。
- 現代人を正解役へ固定しない。
- Futureを上位互換にしない。
- 実在悲劇そのものを笑わない。
- personを笑うよりsystem / custom / contradictionを笑う。

Example direction:

```txt
Yui: 「読んだって表示されてるのに返事ないと気になる。」
Tomori: 「便利になったのに、待つ材料が一つ増えたな。」
```

```txt
Yui: 「これ、いちばん早い道出してくれるよ。」
Michiru: 「いちばん面白い道は？」
```

笑いながらEraが分かる状態を狙う。

Detail:
`docs/era-satire-cross-generation-dialogue-bible-v1.md`

---

# 8. ヨルノシルベ — 朝のないDream

Status: `DECIDED CORE / FINAL MECHANISM OPEN`

ヨルノシルベは**夢世界**。

- shared dream-likeだが最終mechanism / originはOpen。
- **物理的な朝は来ない。**
- 太陽が昇って夜が明けることはない。
- 月 /星 /雲 /光量は変化してよい。
- 人は朝になって帰るのではなく、**Dreamから目覚め自分のReality Eraへ戻る**。
- Game Over ≠ Reality death。
- Retry ≠ resurrection。
- 正史はHappy End。

旧`Dawn / 夜明け`がstable ID / UI名へ残っていてもphysical morningを意味しない。

---

# 9. Waking / Memory

Status: `DECIDED DIRECTION`

通常Wakingでは明示記憶をほとんど失う。

失われやすい:

- 名前
- 顔
- 年代
- 会話
- Dreamの細かな出来事

残り得る:

- skill
- body sense
- emotional change
- 誰かに教わった考え方
- trust experience
- 新しく選べるようになった行動

> 誰に教えてもらったか思い出せない。でも手が覚えている。

大事件の解決partでは、重要人物がDream memoryを取り戻した状態でWakingする方向。

---

# 10. Dream Provisioning — 食糧庫方式

Status: `DECIDED`

ヨルノシルベは生存サバイバル物ではない。

**「思った瞬間に料理が目の前へ出る」はSUPERSEDED。**

Current:

> 食べたい /飲みたいと考えたり話した後、食糧庫・冷蔵庫・棚・厨房・酒棚等を開けると、それが最初から入っていたように見つかる。

Hard:

- open air / handへ直接spawnしない。
- place / storageを介す。
- 焼肉 /鍋 /ラーメン /菓子 /炭酸 /酒など幅広く楽しめる。
- 誰が仕入れたかを毎回Main Mysteryにしない。

補完しやすい:

- food
- drink
- daily goods
- rest
- basic living items

補完できない:

- mind
- consent
- memory truth
- trauma
- relationship
- Black Youka
- life / death
- Reality incident
- authentic choice
- unique object
- real evidence
- dead person
- Main Mystery answer

> **腹は満たせる。人の意思 /真相は食糧庫から出ない。**

---

# 11. Boss後Party / Alcohol / Tobacco

Status: `DECIDED DIRECTION`

Named Boss / major confrontation後は原則celebration / decompression sceneを置く。

- 焼肉
- 鍋
- 夜食
- ラーメン
- 炭酸乾杯
- 酒盛り
- adult-only二次会
- 焚き火
- 喫茶店風
- 静かな食事
- 誰も騒げない重い食卓
- 二人だけ残る後片付け

PartyはCharacter人気 /年代差 /callback /breather /emotional payoffのStory engine。

## Alcohol

- alcohol exists。
- intoxication exists。
- Characterごとに酔い方を変える。
- drunk = truth serumではない。
- intoxication ≠ consent。
- Final drinking sceneはadult確認済みCharacterのみ。

## Tobacco

- major smoker **3人以上**。
- pipe smoker **1人以上**。
- Current candidate: Gen=pipe / Tobari=cigarette / Sen=cigarette。
- Final person assignmentはage / Era review後。
- 未成年へ割り当てない。

## Generic commercial naming

実在brandへ不要に固定しない。

- 黒い炭酸
- 柑橘のシュワシュワ
- ぶどうソーダ
- 麦の泡酒
- 米の酒
- 果実酒
- 炭酸割り

等を自然に使える。

---

# 12. 年代差 — 時間タグではなく生活差

Status: `DECIDED`

Dreamでは:

- 西暦
- exact date
- chronology

のtime tagが弱い。

一方:

- 言葉
- skill
- food knowledge
- tool use
- UI familiarity
- institution sense

は残る。

年代差は:

- ticket
- post
- map
- phone
- package
- food
- cooking appliance
- clothing construction
- repair method
- slang
- school / work vocabulary
- privacy sense
- map / recommendation usage
- drink container
- match / lighter
- constellation

から出す。

新しいEra = 上位互換ではない。

---

# 13. Stars / Constellations

Status: `DECIDED / HISTORICAL-AUTHORITY`

## Core sky rule

- Dreamでは星が見える。
- 星空はヨルノシルベの重要なvisual identity。
- **年代差の証拠に使う星座史・旧星座・旧名称・星図は史実準拠にする。**
- 年代伏線のために「昔は実在したことにする架空星座」を作らない。
- Dream固有の超常現象を将来追加する場合は、Historical factとは別のFiction/Candidateとして明示する。

## Modern stable authority

現代の恒常基準は **IAU 88 constellations**。

- 1922年: IAUが88星座と3文字略号を採択。
- 1928年: 境界を承認。
- 1930年: Delporteの境界体系が出版。
- 日本語では1944年『天文術語集』が88星座和名の重要な標準化点。

Star Beast / Collection UI / permanent merchandiseのstable constellation identityはIAU88へ固定する。

## Historical layer

Era / culture差は:

- obsolete constellation
- historical constellation / atlas
- asterism
- old Japanese terminology
- Chinese / Japanese traditional sky division
- cultural star name
- proper name / Bayer designation / catalog designation
- same stars with different historical grouping

として出せる。

同じ星を見ていても、その人物が**どの時代・地域・家庭・教育・職業・星図を通して空を覚えたか**で呼び方や結び方が違ってよい。

ただし:

> 出身国だけを理由に、その地域の神話・星文化へ全員が詳しいことにしない。

## Line-art / merch stability

IAUの現代星座はsky regionが科学的definitionであり、星を結ぶ唯一の公式line-artがあるわけではない。

Therefore:

- Project Modern canonical line-artを一つ固定する。
- Historical atlasのline / figureはoverlayとして扱う。
- Historical layerで通常Star Beast rosterを増減させない。
- 旧星座はarchive / historical skin / special card / transparent overlay / limited goods等に使える。

## High-value historical motifs

優先して研究・story integrationしてよい:

- **Quadrans Muralis / 壁面四分儀座** — 星座として消えたが、しぶんぎ座流星群に名が残り、2025年には`Quadrans`が恒星名として採用。`消える / 残る / 戻る`。
- **Argo Navis / アルゴ座** — 一つの巨大な星座がCarina / Puppis / Velaへ分かれる。`一つのorigin → 複数identity`。
- **Serpens / へび座** — Caput / Caudaという離れた二領域でも一つの星座。`離れていても一つ`。
- **Libra / Scorpius claw trace** — 現在の所属が変わっても昔の所属が星名に残る。`旧所属の痕跡`。
- **Antinous** — historical figureとして消えた名が2024年に正式恒星名へ戻る。`姿が消えても名前が戻る`。
- **二十八宿 / 日本・東アジアのhistorical sky** — 同じ空でも文化・時代で区切り方が違う。
- **すばる / Pleiades / M45等のmultiple identifiers** — 同じobjectに複数の正しい呼称が共存する。

## Story guard

- 星座史を天文学quizにしない。
- Playerが事前知識ゼロでも、後のarchive / dialogueで意味が返る構造にする。
- 最初は小さな呼称 / 線の違和感。
- 中盤で古い星図・記録と一致。
- 後半でidentity / relation / memory / Android themeへ意味が拡張する。

Research / usable sources:

- `docs/00-current-story-world-master-constellation-amendment.md`
- `docs/constellation-usable-knowledge-book-v1.md`
- `docs/research/constellation-history-story-integration-v1.md`
- `docs/research/world-sky-knowledge-index.md`

---

# 14. Moon / 朔夜

Status: `DECIDED`

Moon phase = Reality clockではなく**incident depth**。

基本image:

`満月 → 欠ける → 半月 → さらに欠ける → 朔`

全Eraを同じstepへ固定しない。

朔では月が消えるが星は残る。

> 月が照らしてくれないなら、自分たちの灯りで進む。

朔 = fixed era bossではない。

---

# 15. Season敵Team / 朔夜座

Status: `DECIDED SEASON ROTATION / S1 FORMAL NAME`

## Season1

Primary antagonist team:

# **朔夜座**

S1 fixed 8member:

- ナシロ
- アサトジ
- ミチグレ
- オリネ
- ハクマ
- ツグリ
- ユラネ
- ペタ

Rules:

- 八影 = early observer label。
- 朔盟 = `SUPERSEDED CANDIDATE / legacy authored asset namespace`。
- existing思想 / pair / relation / stable ID / visual assetは維持。
- S1正式名は朔夜座。
- 「座」は朔夜座brand。群青残響録やS2 teamへ自動流用しない。
- absolute leader / founder / exact originはOpen。

## Season2 / optional Season3

**primary antagonist teamはSeasonごとに変更する。**

- S2 team name = Open。
- S2 primary roster = 別Character群 / Open。
- optional S3 team name / rosterもOpen。
- Season changeを**team名だけの変更**にしない。
- S1朔夜座8人をS2 main teamへそのまま続投させない。
- S1朔夜座8人をS1/S2の4人ずつへ固定分割しない。

Allowed:

- former Sakuyaza memberのcameo
- recurring rival
- temporary ally
- unresolved individual return
- S1 evidence / relationship consequenceの継続

Main Spine / Core5 / Main Mystery / Reality historyはSeasonを跨いで継続する。

Detail:

- `docs/season-architecture-cast-matrix-v1.md`
- `docs/sakuyaza-current-identity-v1.md`

---

# 16. 群青残響録

Status: `DECIDED NAME / MEMBERS OPEN`

> 各時代の大事件で中心となった人物 /人物群を、後から一つの記録名で括る総称。

- fixed enemy organizationではない。
- fixed countではない。
- 1 Era 1人ではない。
- all combat Bossではない。
- all villainではない。
- **世代ラスボス固定slotへ入れない。**

Core5が5Eraでも群青残響録5人固定にはならない。

---

# 17. 黒耀化と社会の大事件

Status: `DECIDED THEME`

Individual:

`strength / wish + fear /焦り → one answer fixation → 黒耀化`

Society:

`ideal / protection / development + fear / interest / institution → one solution fixation → 大事件`

Black Youkaはexternal evil personality / possessionではない。

Story answer:

> **二択しかないと思っていた状況へ第三の選択肢を作る。**

別Eraから得たknowledge / skill / value / failure exampleがRealityの選択肢を増やす。

---

# 18. Future Android / Robot / Avatar

Status: `DECIDED DIRECTION / DETAILS OPEN`

- Human側 / Android側双方にDream参加者がいる。
- Human全員悪 / Android全員善にしない。
- AndroidのgoalはHuman化ではない。

> **人間ではない。それでも友達にはなれる。**

Android Characterは好感度 /親密度が上がりにくい方向。
好意を義務 /相互扶助 /契約 /効率と処理し、後から優しさを再評価できる。

Naming:

- final Android name Open。
- シオン /イヴ・ノイン rejected。
- Japanese name-like katakana + later acronym / system designation reveal方向。
- Greek lettersはpersonal nameでなくversion / generationへ使える。

星獣を魂証明装置にしない。

---

# 19. Reality Animals

Status: `DECIDED DIRECTION`

Reality由来dog / catもDreamへ入れる。
Star Beastとは別category。

- dog: smell / voice / walk / touch / return timing等で覚える。
- cat: multiple homes / multiple names /「違う名で呼ばれても自分は自分」。

omniscient sageにしない。

---

# 20. Happy End

Status: `DECIDED`

正史はHappy End。
Permanent deathを主要tear deviceにしない。

悲劇を全部なかったことにするだけでなく、Characterが成長し以前は選べなかったthird optionを選び最悪の結末を変える。

Party / food / alcohol / smoke break / joke等の日常反復を終盤の感情資産にする。

---

# 21. Still Open

AI単独でCanon化しない:

- Core5 exact year / exact chronological age。ただし**ユイのbirth decade = 1990sはDECIDED**。
- ユイのexact neighborhood / nearest station / school / work / household。
- ユイ以外のCore5 exact city / school / work / household。
- S1で登場する外国籍 / 海外出生 / 海外育ちCharacterのexact country / city / nationality / family history。既存Characterの人生に接続して決める。
- each Era fictional incident final detail / casualty / exact place
- major family death / orphan / abuse / crime victimhood
- **Season2 enemy team name / roster / count / visual identity**
- **optional Season3 enemy team name / roster / count / visual identity**
- 群青残響録formal members / full names / final endings
- Android final name / acronym / complete version order
- Future Asa exact year / political side / incident role
- Dream-specific supernatural constellation phenomenonを追加するかどうか
- Star Beast final nature
- Yoru-no-Shirube final mechanism / origin
- whether each incident needs combat Boss
- final smoker identities / adult legality

Core5の**5つの社会Era bandはCurrent**。ユイは`1990年代生まれ / 現代日本`までDECIDED、他のexact decade / yearはOpen。

---

# 22. Production / Migration order

```txt
00-current-story-world-master.md
↓
core5-era-character-master-v1.md
↓
season-architecture-cast-matrix-v1.md
↓
research/era-society-food-future-sourcebook-v1.md
↓
era-satire-cross-generation-dialogue-bible-v1.md
↓
WORLD.md / CANON.md / Character / Temporal / Appearance sources
↓
Machine-readable source
↓
Runtime / UI（必要な場合のみ）
```

stable ID / Character / Enemy / Relation資産は壊さない。
Historical research factとFictional incidentとCanon decisionを混同しない。
