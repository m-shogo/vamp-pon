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
- **終盤に空が明るくなる現象を「太陽が昇った普通の朝」と説明する**
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
- **全員を細身・若者・同じ美形faceへ均す**
- **ぽっちゃり / 高齢 / 褐色 / 刺青 / 傷 / ほくろ / ピアス等を画像生成の都合で消す**
- **Dream上の外見とRealityの身体 / species / gender presentationが必ず一致する、と固定する**
- IF reward artへAIがその場で作ったgeneric mobを主要castとして混ぜる

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

# 8. ヨルノシルベ — 朝のないDream / 終わりへ向かう空の明るさ

Status: `DECIDED CORE / USER-DECIDED VISUAL RULE / FINAL MECHANISM OPEN`

ヨルノシルベは**夢世界**。

- shared dream-likeだが最終mechanism / originはOpen。
- **Realityと同じ意味での物理的な朝は来ない。**
- 太陽の円盤が地平線からはっきり昇る通常の日の出は見せない。
- ただし、**戦い・事件・その夜の役目が本当に終わりへ向かう時、空そのものは徐々に明るくなってよい。**
- 明るさは夜の黒 /濃紺が薄れ、空・雲・地平線・水面・建物の輪郭が見えやすくなる方向。朝焼けのような温度を感じてもよいが、原因となる太陽を明瞭に見せる必要はない。
- この現象に**固有名は付けない**。Characterは普通に「明るくなってきた」「……終わりだ」「もう終わるんだ」等と感じればよい。
- Playerにも説明UIではなく、**画面が明るくなること自体で「この戦い / 夜は終わりへ向かっている」と伝える。**
- 逆に、**Boss戦・未解決の最深部では明るくしない。** 朔夜 / Boss confrontationは暗さを保ち、星・ランタン・焚き火・Character light・星獣等の局所光を強く見せる。
- Boss撃破や真の解決が成立した後、初めて空が明るくなり始める演出は高価値。
- 「Bossを倒した = 必ず同じ秒数・同じ色で明るくなる」という固定Game formulaにはしない。偽の解決 /未解決 /途中撤退なら暗いままでもよい。
- 月 /星 /雲 /光量は変化してよい。空が明るくなっても星が即座に全部消える必要はない。
- 人は朝になったから帰るのではなく、**Dreamから目覚め自分のReality Eraへ戻る**。
- Game Over ≠ Reality death。
- Retry ≠ resurrection。
- 正史はHappy End。

Visual grammar:

```txt
事件が深くなる
↓
月が欠ける / 夜が深くなる
↓
朔夜・Boss / 最深部 = 月がなく暗い
↓
解決
↓
空が少しずつ明るくなる
↓
Character / Playerが「終わりだ」と感覚で理解する
↓
Waking / 帰還
```

> **朝そのものを待つ物語ではない。けれど、夜が終わる時には世界が明るくなる。**

旧`Dawn / 夜明け`がstable ID / UI名へ残っていても、Realityと同じ日の出を意味しない。

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
- each cross-form CharacterのDream bodyがなぜその形になるか。理由不要のDream logicも許可する。

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

---

# 23. Character Physical Identity / Dream Form / IF Reward Visuals

Status: `USER-DECIDED MASTER / VISUAL-PRODUCTION HARD RULE`

## 23.1 Characterは髪色だけで差別化しない

全Named Characterは、画像生成 / 原本 / TOP / Event Art / Clear Getter / merchandiseで同一人物として再現できる**Physical Identity Sheet**を持つ。

最低必須field:

```txt
referenceHeightCm
referenceWeightKg / referenceMass
ageImpression
bodyFrame
shoulderWidth / torso / hip / limb balance
skinTone / sun exposure
faceShape / cheekVolume
eye aperture / angle / spacing / eyelid
eyebrow / eyelashes
nose
mouth / lips / teeth
moles / freckles / birthmarks / vitiligo if present
scars / work marks if present
tattoo / body art if present
piercing / ear details
hands / nails / work traces
hairline / hair texture / hair mass
posture / habitual gesture / gait
clothing silhouette / material / fastening / drape
footwear
named accessories / objects
Reality form
Dream form
hardLandmarks
softLandmarks
forbiddenDrift
```

**ほくろ / 傷 / 刺青 / pierceは「ある」だけでは不十分。**

存在する場合は:

- Character本人から見たleft / right
- anatomical location
- exact-ish size
- shape
- color / fade
- orientation
- coverage boundary
- clothingで隠れる範囲
- age / old-faded or fresh

まで固定する。

刺青は `tattooed man` のようなgeneric promptで済ませず、**模様・位置・向き・面積をreference map化**する。
文化固有のpatternを使う場合は、その文化・時代・地域・本人の人生を調査してから採用する。generic `tribal` 化禁止。

## 23.2 Existing hard landmarks — Masterへ昇格

既存Appearance / Silhouette資料のhard landmarkはMaster subordinate authorityとして維持し、画像生成都合で消さない。

特に:

- **ユイ** — 笑顔の左右エクボ。
- **アサ** — compact / quick silhouette、横長寄りの鋭い目。Human。
- **ナギ** — 細い水平眼、閉じた縦長姿勢。
- **ミチル** — 太い眉 / そばかす / outdoor skin texture。
- **トモリ** — hooded half-lidded eye / repair marks / 作業ゴーグル。
- **ハナ** — 年長女性 + ぽっちゃり。丸い胴・腕・頬を細身へ戻さない。
- **カナメ** — plus-size broad young adult man。広い肩、厚いsoft torso、太い腕脚。bodybuilderへ置換しない。
- **ゲン** — 年齢線 / 深い眼窩 / 渋い年長男性。若返らせない。
- **シロ** — 丸眼鏡 + page-holding identity。
- **レン** — 丸眼鏡でも焦点 / 観察のvisual languageでシロと区別。
- **クウ** — Reality由来の犬。
- **ヨモ** — Reality由来の猫。
- **ノア** — humanoid artificial-person body identity。
- **ルム** — small maintenance Robot。human chibiへしない。

Reference:
- `docs/character-appearance-source-book-v1.md`
- `docs/character-silhouette-diversity-current-canon-v1.md`
- `docs/character-height-age-era-lineup-v1.md`
- `docs/character-future-diversity-and-nonhuman-expansion-v2.md`

## 23.3 Reference height / weight anchors

以下は**画像生成・立ち絵・集合絵のscale再現用Production Anchor**。
medical evaluation / attractiveness / strength / speed / hitboxへ直結させない。
明示Master更新なしに細身defaultへ寄せない。

### Current21

| Character | Reference height | Reference weight / mass | Body anchor |
|---|---:|---:|---|
| ユイ | 161 cm | 52 kg | standard-soft / dimples |
| アサ | 157 cm | 49 kg | compact / quick |
| ナギ | 169 cm | 55 kg | lean vertical |
| ミチル | 164 cm | 57 kg | active / grounded |
| トモリ | 169 cm | 63 kg | practical work-built |
| セン | 176 cm | 69 kg | long rectangular adult |
| リツ | 180 cm | 77 kg | broad protector |
| コヨリ | 133 cm | 29 kg | child proportion;縮小成人禁止 |
| ゲン | 170 cm | 69 kg | older / slightly lowered center |
| ハナ | 154 cm | 76 kg | plus-size older woman |
| ユウビ | 164 cm | 54 kg | route-forward |
| マドカ | 161 cm | 51 kg | quiet observer |
| シロ | 168 cm | 57 kg | slim-average / page posture |
| トバリ | 182 cm | 79 kg | tall gatekeeper |
| ネム | 158 cm | 52 kg | soft relaxed |
| レン | 171 cm | 60 kg | observer / balanced |
| クロオリ | 172 cm | 61 kg | folded / closed geometry |
| カナメ | 188 cm | 112 kg | plus-size broad shield mass |
| カスミ | 161 cm | 50 kg | low-contrast compact |
| トキ | 178 cm | 68 kg | straight measured frame |
| ツムギ | 165 cm | 57 kg | asymmetrical / thread-gap |

### Future15 / series pool

Future poolは全員をS1へ投入する意味ではない。scale referenceとして保持する。

| Character | Reference height | Reference weight / mass | Body / identity anchor |
|---|---:|---:|---|
| ヒヨリ | 166 cm | 59 kg | brown skin / lively gyaru-mind |
| セリカ | 170 cm | 57 kg | refined adult |
| クロエ | 162 cm | 53 kg | long-lived adult appearance |
| レンジ | 175 cm | 72 kg | adult base; age variants preserve aging |
| トウマ | 180 cm | 82 kg | brown skin / craftsman build |
| クウ | shoulder 55 cm | 24 kg | Reality dog |
| ヨモ | shoulder 30 cm | 4.8 kg | Reality cat |
| ノア | 173 cm | 84 kg body mass | humanoid artificial person |
| ルム | 70 cm | 23 kg body mass | small maintenance Robot |
| マキ | 173 cm | 64 kg | decisive adult woman |
| スズ | 168 cm | 56 kg | adult man / feminine presentation |
| イオ | 172 cm | 61 kg | adult human / gender undisclosed |
| カイ | 177 cm | 69 kg | twin A |
| ナオ | 175 cm | 66 kg | twin B |
| アマネ | 164 cm standing-equivalent | 56 kg body only | wheelchair user; chair geometry separate |

### Nonhuman / variable form

朔夜座等、human kgが意味を持ちにくいCharacterは無理に人体weightへ変換しない。
代わりに:

```txt
referenceOverallHeight
referenceWidth
referenceDepth
massClass
centerOfMass
silhouetteScaleVsYui
variableRange if applicable
```

を固定する。
既存 `character-height-age-era-lineup-v1.md` の朔夜座relative scaleを維持し、variable formを一枚のhuman体型へ潰さない。

## 23.4 体型・年齢・肌・身体装飾をCastの普通の差として扱う

Cast全体で:

- slim
- standard
- soft / curvy
- plus-size
- broad
- muscular
- short / tall
- child
- middle-aged
- older adult
- wrinkles / age spots
- freckles
- moles
- scars
- brown / dark skin
- sun-tanned skin
- heterochromia
- glasses
- piercings
- tattoo / body art
- prosthetic / mobility device Candidate

等が普通に共存してよい。

**「主要Character = 若い細身の美男美女」「多様な体型 / 年齢 = mob」にはしない。**
ぽっちゃりCharacter、イケおじ、イケおば、刺青Character、褐色Characterも主人公級 / 人気Character / rival / Boss /恋愛対象になり得る。

体格・年齢・肌・sexuality・gender presentationを能力値や善悪へ直結しない。

## 23.5 日本の服装 / 身装文化を広く使う

日本 = 一種類の外見 / 和服だけ、にしない。

人物のEra / region / work / class / family / hobby / subcultureに応じて、史実・実在文化を研究した上で:

- historical Japanese dress / kimono-derived construction
- Westernization / mixed Japanese-Western dress
- postwar repair / practical clothing
- uniforms / school / workwear
- utility jackets / denim / sneakers / leather
- avant-garde construction
- Harajuku / street style
- Lolita / Gothic Lolita
- Decora
- gyaru / gyaru-mind
- punk / neo-goth / cyber-punk lineage
- casual regional / festival / outdoor wear
- age-specific ordinary clothing

等をCharacter design reservoirとして使える。

ただし:

- `日本人 = 和服`
- `昔 = 全員もんぺ`
- `現代若者 = 全員Harajuku`
- `不良 = 刺青 / pierce`
- `外国人 = 金髪青眼`

の一対一short-handは禁止。

Research foundation:

- 国立国会図書館 / 昭和館等の服飾・身装史
- 京都服飾文化研究財団（KCI）
- Japan Foundation等のstreet-fashion archive
- museum / local cultural institution

アイヌ文様、沖縄 / 琉球のハジチ等の**文化固有の服飾・身体装飾**は、generic aestheticとして借りず、該当人物の出自・地域・時代と一次 / 博物館資料を確認してから使う。

## 23.6 Dream form ≠ Reality body — USER-DECIDED DIRECTION

ヨルノシルベはDreamなので、**Dreamで見えている身体がRealityの身体と同じとは限らない。**

物語上、少数Characterで以下を取り入れてよい:

- Reality Human → Dream Robot / artificial-looking form
- Reality Human → Dream animal / animal-like form
- Reality animal → Dreamで別の表現形を取るCandidate
- Reality male → Dreamではfemale-coded / feminine body
- Reality female → Dreamではmale-coded / masculine body
- RealityとDreamで年齢感 / body size / voice / presentationが違う
- 見た目から推測されたgenderと本人のidentityが一致しない

ただし、以下は別field:

```txt
realitySpecies
dreamSpecies
sex / assigned sex if story-relevant
genderIdentity
genderPresentation
preferredName / self-identification
dreamBody
voicePresentation
```

**「女に見えたけど本当は男だった」等を単純な騙し / humiliation / trap jokeにしない。**
Revealを使うなら:

- 信頼が深まる
- 相手の思い込みが見える
- bodyとidentityは同じ問題ではないと分かる
- Realityの過去 /生活が見えて関係が一段深くなる

等のCharacter sceneへ使う。

理由は全員へ説明しなくてよい。

- 本人が望んだ姿
- subconscious body image
- Realityで失った / 得た身体感覚
- Dreamの曖昧なtranslation
- 本人にも理由不明

のどれもCandidateになり得る。最終mechanismはOpen。

Main thematic value:

> **身体が違う。名前が違う。呼ばれ方が違う。それでも、その人との関係まで別物になるとは限らない。**

## 23.7 Existing diversity poolを消さない

Future / series poolで既に保存されている:

- brown skin Human 2人（ヒヨリ / トウマ）
- Reality dog（クウ）
- Reality cat（ヨモ）
- Replica Robot（ノア）
- Collective / maintenance Robot（ルム）
- Gay Character Candidate（トウマ）
- Lesbian Character Candidate（セリカ）
- Bisexual Character（マキ）
- adult man / feminine presentation（スズ）
- gender undisclosed（イオ）
- twins（カイ / ナオ）
- wheelchair user（アマネ）

は、単なるquotaではなく**人物Coreを持ったseries inventory**として維持する。

S1でも外国籍 / 海外出身 / 海外育ち、体型差、年齢差、刺青等は必要に応じて既存Characterへ自然に入れてよい。

## 23.8 Sunny IF Reward Art — non-canon bonus

Status: `USER-DECIDED REWARD DIRECTION`

本編の夜とは別に、Ending / Clear Getter / gallery rewardで、**太陽の下で全員が和気藹々としているnon-canon IF illustration**を使える。

High-value theme:

1. **お花見**
2. **海 / プール**
3. **BBQ**
4. 運動会 / outdoor event Candidate

Rule:

- 本編で実際にそのeventが起きたCanon証明にはしない。
- 「もしみんなが同じ昼を過ごせたら」というreward image。
- 太陽 / 青空 / 水 / 桜 / 緑 / 強いdaylightを、本編の夜とのcontrastとして大切に扱う。
- 太陽をenemy /封印対象 /奪われた物という意味へ自動接続しない。
- actual castのCharacter referenceを使用する。
- **AIがその場で作ったgeneric mobを主要cast代わりに増やさない。**
- 主人公 / Core / important castが一目で分かるvisual hierarchyを作る。
- 同時に、ぽっちゃり / 年長 / 褐色 / 刺青 / Robot / 動物等の既存Character差を画面から消さない。
- 「多様性を出した結果、主人公が埋もれて全員mobに見える」構図もReject。

### Clear Getter Candidate

一枚の大きなIF ensemble artを**約24piece**へ分割し、achievementで徐々に開く方式はCurrent high-value direction。

- exact 24 / grid shapeはUI reviewで調整可能。
- 顔の中央を悪く切るだけの機械分割にしない。
- 各piece単体にも小さな見所を持たせる。
- 全解放時に一枚絵として完成する。
- high-resolution full art閲覧を最終rewardにできる。

---

# 24. Character Visual Generation Acceptance

Status: `DECIDED PRODUCTION GUARD`

画像生成時は、名前だけのpromptを禁止する。

最低でも:

```txt
Character ID
reference height / weight or mass
body frame
age impression
skin tone
face shape
eye / brow / nose / mouth / teeth
exact hard landmarks
mole / scar / tattoo map if present
hairline / texture / mass
posture
clothing construction
Reality / Dream form distinction
forbidden drift
```

を渡す。

Group artでは、さらに:

- relative height chart
- foreground / midground / background assignment
- protagonist visual hierarchy
- body-type distribution
- age distribution
- skin-tone distribution
- nonhuman placement
- no duplicate face
- no duplicate pose
- no default slimming

を渡す。

Reference imageがあっても、**reference imageのミスよりCharacter Masterを優先**する。

> **画像生成で同じ人を何度描いても、体格・顔・ほくろ・傷・刺青・年齢・Dream/Reality差が「たまたま変わらない」のではなく、原本があるから変わらない状態を作る。**

---

# 25. Temporal / Dream Body / Combat / Language / Aftercare Core Rules

Status: `USER-DECIDED MASTER / CURRENT OPERATIONAL RULES / FINAL COSMOLOGY DETAILS OPEN`

> 2026-08-12 USER DECISION: 以下8項目はCandidateではなくCurrent Masterへ採用する。
> ただし、物語上必要な**運用ルール**を固定するもので、ヨルノシルベの最終originや宇宙論的説明を早期に閉じない。

## 25.1 Reality historyは一本を基本にし、選択で変わる

Status: `DECIDED DIRECTION`

Characterが自分のReality Eraへ戻り、Dreamで得たknowledge / relationship / skill / third optionを使って大事件の最悪の結末を変えた場合、**Reality historyそのものが変化してよい。**

基本:

```txt
old Reality history
→ Dreamで異時代の他者と出会う
→ CharacterがRealityへ戻る
→ 以前は選べなかったthird optionを選ぶ
→ Reality historyが更新される
```

Hard:

- 基本構造を「変更ごとに別universeが無限分岐するmultiverse」へしない。
- 過去を直すために特定の人間を存在ごと消すことをHappy Endの標準解法にしない。
- **誰かを消して歴史を直すより、その人が違う選択をできることで歴史が変わる**方向を優先する。
- 変更後の未来を「全部同じまま」にも、「蝶の羽ばたきで全員消滅」にも固定しない。変更規模は事件ごとに設計する。

### Dream側の記憶保護

ヨルノシルベで既に成立した出会い・関係・経験は、Reality historyが更新されても**即座に無かったことにならない。**

- Dreamで会っていたFuture Characterが、過去改変の瞬間に会話途中で消えるような処理を標準にしない。
- Dreamは少なくとも物語運用上、**変更前のReality historyの残響を保持できる場所**として扱う。
- 更新後Realityへ戻ったCharacterが「昔からこうだった」という現在の記憶と、「何か違った気がする」という薄い感覚を両方持つ場合がある。
- 変更前historyのexact preservation mechanism / 誰がどこまで覚えるか / Dreamが時間軸の外側かどうかの最終説明はMain MysteryとしてOpen。

Theme:

> **記録された歴史が変わっても、そこで誰かから受け取ったものまで必ず消えるとは限らない。**

## 25.2 Dream bodyはRealityの「真の姿」を暴く装置ではない

Status: `DECIDED CORE RULE`

#23.6をさらに具体化する。

Dream bodyは完全Randomでも、Reality bodyの単純copyでも、魂の真実を表示する装置でもない。

Current operational model:

```txt
long-term self-image
+
body memory / lived bodily experience
+
relationships / how one exists among others
+
current role / pressure / need
↓
Dream form
```

- 4要素の比率はCharacterごとに違ってよい。
- 本人がDream formの理由を理解していない場合がある。
- 「こうなりたい」と思った姿がそのまま出るwishlist systemではない。
- 外見と性自認が違う場合、**Dream bodyを性自認判定器にしない。性自認は本人が決め、本人が語る。**
- Realityのsex / gender identity / presentation / Dream body / voice / speciesは別field。

Allowed:

- Human ↔ Robot-like body
- Human ↔ animal / animal-like body
- Reality male ↔ Dream female-coded body
- Reality female ↔ Dream male-coded body
- age / stature / voice / mobility presentation difference

High-value reveal:

> Realityでは姿が全く違っていても、歩き方、手癖、間の取り方、言葉、守り方などから「お前だ」と気付ける。

これを単純な性別どんでん返しではなく、**姿が変わっても関係を認識できるか**というCharacter payoffへ使う。

Individual Characterごとの「なぜこのDream formなのか」はOpenにできるが、上記4軸を無視した後付けRandom revealにはしない。

## 25.3 大量に倒す雑魚Enemyは人間の魂ではない

Status: `DECIDED COMBAT ONTOLOGY`

Vampire Survivors系の大量戦闘で倒すgeneric / swarm Enemyを、Realityで生きる人間の魂や無辜の死者そのものにはしない。

Core:

> **人間や社会が「一つの答えしかない」と固まっていく時に生まれるpressure / fear / rule / rumor / shortage / surveillance / exclusion等が、Dreamで戦闘可能な形を取ったもの。**

Named Characterとswarm Enemyを原則分ける:

```txt
Named Character
= person / choice / responsibility / relationship

Swarm Enemy
= pressure / phenomenon / fixation made combat-visible
```

Era-specific visual vocabularyを持てる:

- トモリEra: 配給票、空箱、列、空の器、欠品、修繕不能の反復等から抽象化。
- ミチルEra: route、煙、騒音、標識、工業 / 都市の過密pattern等から抽象化。
- ナギEra: 閉じた端末、匿名札、警告、誤登録、chain message、遮断等から抽象化。
- ユイEra: notification、認証、ranking、複製、fake signal、information flood等から抽象化。
- アサEra: identity token、ownership lock、copy mismatch、continuity error等から抽象化。

Hard:

- 実在文化記号や被災者の姿を雑魚Enemy skinとして消費しない。
- Named villainを倒すことと、pressureを大量撃破することを同じ倫理にしない。
- 最終的な「なぜpressureが物理的Enemyになるのか」の宇宙論はOpenでよい。

## 25.4 朔夜座と群青残響録は上下関係ではなく、別軸で交差する

Status: `DECIDED RELATION RULE`

- **朔夜座** = S1でヨルノシルベ内を能動的に動くprimary antagonist team 8人。
- **群青残響録** = 各Reality Eraの大事件で中心となった人物 / 人物群を後から括る記録分類。

したがって:

```txt
朔夜座 ⊄ 群青残響録
群青残響録 ⊄ 朔夜座
```

単純なBoss / subordinate関係にしない。

朔夜座は全Era事件の黒幕ではない。

Allowed:

- 朔夜座が既に生じている事件へ介入する。
- 思想上の理由で事件を悪化させる。
- 同じ思想から、結果的に被害を減らす場合もある。
- 群青残響録側の人物と敵対する。
- 一時的に利害一致する。
- 直接会わない。
- Reality側の人物が朔夜座の介入自体を知らない。

さらに、ある人物が別々の条件を満たせば、**朔夜座memberであり、別のReality事件では後世に群青残響録へ分類される**ことも論理上は可能。

ただし誰が該当するかは個別に決め、全員を二重所属させない。

## 25.5 Star Beast — 魂判定ではなく「世界をどう結んで見るか」の表現

Status: `USER-DECIDED CORE NATURE / DETAILS OPEN`

Star BeastのCore Natureは以下へ寄せる:

> **その存在が世界・他者・記憶をどう結んで見ているかが、星空を媒介にDream内で姿を持ったもの。**

Hard:

- soul detector / humanity detectorではない。
- Star Beastが出た = 魂がある、とは証明しない。
- Star Beastが出ない = 人格がない / 価値が低い、にもならない。
- Human限定にしない。Android / Robot / Reality animalにも可能性を残す。
- 同じconstellationを複数Characterが持ってよい。
- 一人一星座を機械的なhoroscope assignmentにしない。
- IAU88をCollection / UI / permanent merchのstable ID基準として維持する。

Star Beast自身は:

- emotion / preference / reactionを持てる。
- Characterとの関係差を出せる。
- ただし何でも説明するomniscient mascot / guardian spiritにはしない。

Historical constellation / cultural name / Serpens / Argo / Pleiades等は、identityやrelationを豊かにする**interpretive layer**として使う。

Open:

- 誰にいつStar Beastが現れるか
- 一人に複数形があり得るか
- Star Beast同士の独立personhoodの程度
- exact manifestation mechanism

つまり#21の`Star Beast final nature`は、**core thematic natureはCurrent化済み、exact metaphysical mechanismのみOpen**へ狭める。

## 25.6 Dream language — 意味は通るが文化差まで消さない

Status: `DECIDED DIALOGUE RULE`

ヨルノシルベでは、異なるEra / country / languageのCharacter同士でも、**ordinary meaning-level communicationは原則成立する。**

これにより毎回通訳探しをMain Gameの必須工程にしない。

ただし完全automatic translationではない。

残りやすいもの:

- person name
- place name
- food name
- constellation / star name
- honorific / kinship term
- proverb
- joke / pun
- slang
- prayer / ritual term
- technical term
- historical institution name
- culture-specific word

Example:

> 「すばる」と「Pleiades」が同じ天体groupを指すことは会話上通じても、**なぜその名前で呼ぶか**までは自動共有されない。

これにより:

- 海外出身
- 地域差
- 世代差
- 家庭文化
- 職業知識

を消さずに会話できる。

古い日本語 / 方言 / Future vocabularyも、意味はある程度通る一方で「その言い方なに？」というCharacter会話を残せる。

翻訳現象に固有名を急いで付けない。final mechanismはOpen。

## 25.7 Dream daily life — 身体感覚はある、生存管理は主題にしない

Status: `DECIDED DAILY-LIFE RULE`

ヨルノシルベでは身体感覚を消さない。

存在してよい:

- 空腹
- 満腹
- 味 / 匂い
- 喉の渇き
- 暑い / 寒い
- 濡れる
- 疲れる
- 眠い
- 痛み
- 風呂 / 洗う
- 着替え
- 休息

ただし本作をsurvival managementへ変えない。

- 食べないから餓死、風呂に入らないから衛生崩壊、家賃を払えず追放、等を通常plotにしない。
- 食事 / 風呂 / 着替え / 睡眠はCharacter scene・関係・時代差を育てるために使う。
- 衣服やbasic daily goodsもDream Provisioningの範囲で、収納・棚・closet等を介して自然に見つけられる。
- **Dream内で眠っても、それだけでRealityへWakingしない。** 普通の休息として眠れる。
- Dreamの中でさらにDreamを見る展開は、常設ruleにせず特殊Episodeでのみ扱える。
- 髪や爪の日々の成長をsimulationする必要はない。

### Injury

- 戦闘の痛み / injuryは存在し、Characterは無傷の人形ではない。
- Realityの致命傷と単純一対一にしない。
- 休息 / treatment / time / episode transition等で回復できる。
- 傷を受けてもGame Over = Reality deathではない。
- permanent scarを残すかはCharacter / eventごとに決める。

> **生活する身体はある。ただし、生存手続きが物語を占領しない。**

## 25.8 黒耀化から戻った後 — 消去ではなく統合

Status: `DECIDED AFTERCARE / RESPONSIBILITY RULE`

黒耀化はexternal possessionではないため、解除後に:

> 「操られていただけなので本人に関係ありません」

とはしない。

同時に:

> 「黒耀化中の全行為を通常状態と全く同じ意図で行った」

とも単純化しない。

Current:

- 黒耀化中の記憶は、完全 / 断片 / 感覚のみ等Character差があってよい。
- 本人のstrength / wish / fearから生じたものなので、本人は自分との関係を避けられない。
- 被害があれば、周囲が即座に許す必要はない。
- apology / repair / distance / trust rebuildingをCharacterごとに描ける。
- 理解可能なantagonistであることと、無罪であることを同一視しない。

### Power integration

黒耀化で現れた能力 / 強さを、解除と同時に全部捨てる必要はない。

```txt
strength / wish
→ fearで一つの答えへ固定
→ 黒耀化で極端なpower
→ recovery
→ 同じstrengthを複数の選択肢の中で扱える
```

例:

> 「全員を守るため全部自分で受ける」が黒耀化した人物が、回復後は同じ防御力を持ちながら、任せる / 守られる / 退くも選べる。

これを成長の主要payoffにできる。

### Relapse

- 再黒耀化は可能。
- ただし同じ悩み・同じBoss・同じ学びをresetして反復しない。
- 一度得た成長は残し、再発するなら別pressure / 別relationship / 別のone-answer fixationとして描く。

### Trace

黒耀化後の身体的trace（黒い硝子状の薄い跡、変色、傷等）を残すCharacterがいてよい。
全員共通markへ固定せず、残る / 消える / 本人が隠す / 見せるを個別設計する。

Theme:

> **間違った自分を切り捨てて元に戻るのではなく、そこにあった強さと恐怖を知った上で、もう一度選べるようになる。**

---

## 25.9 Eight-rule integration summary

```txt
Reality history
= one primary history, choices can update it

Dream memory
= can preserve echoes of pre-update history

Dream body
= self-image + body memory + relationship + role; not soul truth

Swarm enemies
= social / psychological pressure made combat-visible; not human souls

Sakuyaza vs Gunjou Zankyouroku
= separate axes that may intersect; not a hierarchy

Star Beast
= how a being connects world / others / memory, embodied through stars; not soul proof

Language
= meaning-level communication works, culture-specific words remain meaningful differences

Black Youka recovery
= responsibility + trust repair + power integration; not reset
```

この8項目は以後、下位資料 / implementation / episode designで矛盾させない。
