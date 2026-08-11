# ヨルノシルベ — Current Story / World Master

Date: 2026-08-11  
Status: **CURRENT HIGHEST STORY / WORLD AUTHORITY / USER-DECIDED**

> 物語・年代・夢世界・星空・月相・敵勢力・大事件・Android / Robot・動物・日常生活について、現時点の最上位Authority。
> 下位資料、旧Candidate、過去のAI提案と衝突した場合は**このファイルを優先**する。
> Runtime実装済みを意味しない。stable ID / Character / Enemy / Relation / Visual資産は壊さず追従させる。

---

# 0. Authority運用

- `DECIDED` — ユーザーが明確に決定、またはユーザーの「詰めて進める」指示によりCurrent assignmentとして採用済み。
- `CANDIDATE` — 高価値だが未確定。
- `OPEN` — 意図的に未決定。
- `SUPERSEDED` — 過去案。既存asset / ID migrationには残せるがCurrentへ戻さない。

## 戻してはいけない旧設定

- ヨルノシルベに物理的な朝が来る
- 朝まで生き残れば帰れる
- Dawn / 夜明けをReality帰還条件にする
- 主要敵8人の正式Current名を朔盟へ戻す
- 各時代に固定の「世代ラスボス」を1人置く
- 各時代の中心人物を必ずcombat Bossにする
- 群青残響録を固定人数の敵軍団にする
- Core5を同じReality era / 同じ現代の5人組へ戻す
- **Core5のperson-to-era assignmentを完全Openへ戻す**
- 全年代でDreamの星座を同一にする
- DreamをRealityの物理・経済・物流・生活インフラへ無理に合わせる
- 食事を考えた瞬間に手元 / 空中へ直接materializeさせる
- Android最終名をシオン / イヴ・ノインにする
- 群青残響録側へ「○○座」を付ける

---

# 1. Reality — 現実の日本

Status: `DECIDED`

現世は**現実の日本**。

- 東京 / 新宿 / 渋谷など実在地名を普通に使える。
- 理由なく「真宿」のような偽名化をしない。
- 現代編は言葉・生活・交通・決済・通信・SNS・制度・服・UI・商品・食文化・学校 / 仕事・街並みから「間違いなく今の日本」と感じられるようにする。
- これはReality側のrule。Dream内部までReality基準へ揃えない。

---

# 2. Era structure

Status: `DECIDED`

ヨルノシルベへ来る人物は同時代ではない。

現在の主要Era lane:

1. 1940年代系 日本
2. 1980年代系 日本
3. 2000年代系 日本
4. 現代日本
5. 20XX年代以降へ大きく飛んだAndroid / Robot共存社会

**Era lane数は固定しない。**
必要なら新しいEraを追加し、そのEraのCharacter / ordinary life / institution / social pressure / 大事件も増やせる。

Era数は:

- 群青残響録人数
- combat Boss人数
- 朔夜座人数

と1:1対応しない。

---

# 3. Core5 — 5人とも別Reality era

Status: `DECIDED CURRENT ASSIGNMENT`

Core5は全員別時代。

| Character | Current Reality era | Narrative role |
|---|---|---|
| **トモリ** | **1940年代系 日本** | repair / old-light era lead |
| **ミチル** | **1980年代系 日本** | changing-city / route era lead |
| **ナギ** | **2000年代系 日本** | early-network / privacy era lead |
| **ユイ** | **現代日本** | Title1 overall viewpoint / present era lead |
| **アサ** | **未来 Android / Robot共存社会の人間** | protagonist-grade buddy / future identity era lead |

```txt
Core5 distinct era count = 5 / 5
Core5 assigned era count = 5 / 5
```

## Narrative balance

- ユイはTitle1全体の中心viewpoint / 主人公を維持。
- アサは主人公級buddy / counter-axis。ユイ×アサは恋愛なし。
- ナギ / ミチル / トモリもmain castであり、それぞれのReality解決partではera lead / protagonist-grade focusを持てる。
- `5人が別Era = 毎chapter全員同尺`ではない。
- `ユイが中心 = 他4人が脇役`でもない。

## Exact dataはOpen

固定したのは**era lane**まで。

まだOpen:

- exact year
- exact chronological age
- exact city / school / occupation / household
- 1940年代トモリが戦中 / 戦後のどこにいるか
- 未来アサのexact年代 / 政治的立場 / Android incidentでの具体的役割

年代を決めたことを理由に:

- 戦災孤児
- 家族死亡
- 犯罪被害
- abuse
- permanent trauma

を自動Canon化しない。

Dedicated source:
`docs/core5-era-character-master-v1.md`

---

# 4. Core5年代とCharacter Core

## トモリ — 1940年代系

既存Core:

> 壊れていても捨てない / 直して継ぐ。

年代は「戦争キャラ」にするためではない。
修理・再利用・手仕事が生活に近い時代背景を、工具 / repair seam / inherited lanternへ接続する。

ユイのランタンを別時代のトモリが修理していた既存案は、年代構造と非常に相性が良い`HIGH-VALUE CANDIDATE`。
血縁や戦争被害までは自動確定しない。

## ミチル — 1980年代系

既存Core:

> 正しい道を教える → 一緒に迷って帰れる。

紙地図 / 駅 / 道路 / 再開発 / 消えた道・新しい道を年代差へ使う。
1980年代をバブルや企業だけで説明しない。

## ナギ — 2000年代系

既存Core:

> 閉じることで守る → 開ける時を本人と決める。

携帯 / メール / 個人サイト / 掲示板 / password / 個人情報など、公開と非公開の境界が揺れた時代と接続する。
特定service brandやcybercrime被害は自動Canon化しない。

## ユイ — 現代日本

既存Core:

> 誰も忘れたくない → 本人が残すもの / 手放すものを一緒に選ぶ。

smartphone / 写真 / message履歴 / SNS / cloud等、**記録が残りすぎる時代**だからこそ:

> 全部残せることと、大切にすることは同じか。

を問える。

## アサ — 未来Android / Robot共存社会の人間

**アサ本人は人間。Androidへ変更しない。**

既存Core:

> 名前を返す → 本人が名乗れる場所を作る。

未来社会の:

- chosen name
- call sign
- model designation
- system identifier
- ownership record

等を人格 / 権利 / 同意の問題へ接続できる。

アサがhuman side / Android sideのどの立場だったか、誰を失ったか等はまだOpen。

---

# 5. ヨルノシルベ — 朝のないDream

Status: `DECIDED CORE / FINAL MECHANISM OPEN`

ヨルノシルベは**夢世界**。

- 共有夢のような場所。
- 誰が / 何が共有させているか、Realityとの接続mechanism / 起源はOpen。
- **物理的な朝は来ない。**
- 太陽が昇って夜が明けることはない。
- 月 / 星 / 雲 / 空の状態 / 光量は変化してよい。
- 人は朝になって帰るのではなく、**Dreamから目覚めて自分の時代へ戻る**。
- Game Over ≠ Reality death。
- Retry ≠ resurrection。
- 正史はHappy End。

旧`Dawn / 夜明け`語がstable ID / UI / asset名へ残っていても、Dreamにphysical morningが来る意味へ戻さない。

---

# 6. Waking / Memory

Status: `DECIDED DIRECTION`

## 通常Waking

失われやすい:

- 人の名前
- 顔
- 年代
- 会話
- 正確な場所
- Dreamの細かな出来事

残り得る:

- 技能
- 身体感覚
- 感情の変化
- 誰かに教わった考え方
- 信頼した経験
- 以前なら選べなかった行動

> 誰に教えてもらったか思い出せない。でも手が覚えている。

が成立する。

## 大事件の解決part

大きな試練を越えた人物は、ヨルノシルベの記憶を取り戻した状態でWakingする方向。
違うEraの人 / 動物 / Android / Robot / 朔夜座 / 大事件の相手側との経験を理解したうえで、自分のReality問題へ向き合える。

---

# 7. Dream provisioning — 食べ物は収納から見つかる

Status: `DECIDED`

ヨルノシルベは生存サバイバル物ではない。

**「思った瞬間に料理が手元へ出る」はSUPERSEDED。**

Current:

> 食べ物 / 飲み物を欲しいと思ったり会話した後、食糧庫・冷蔵庫・棚・箱・厨房・酒棚等を開けると、それが「最初からそこに入っていた」ように見つかる。

Hard:

- 手元 / open airへ料理を直接spawnしない。
- 場所を介してDreamらしく補完される。
- 焼肉 / 鍋 / ラーメン / 菓子 / 炭酸 / 酒など幅広く存在できる。
- 誰が仕入れたかを毎回Main Mysteryにしない。

Dream provisioningで補完しやすい:

- 食事
- 飲み物
- 日用品
- 休息
- 基本生活物

補完できない:

- 人の心
- 同意
- 記憶の真実
- trauma
- 人間関係
- 黒耀化
- 生死
- Reality大事件
- authentic choice
- Unique Object
- 本物の事件証拠
- dead person
- Main Mysteryの答え

> **腹は満たせる。人の意思 / 真相は食糧庫から出ない。**

衣服 / 休息場所もDreamとして自然に補完できるが、固有衣装 / 修理痕 / Named Objectの意味は残す。

---

# 8. Boss後Party / 酒 / 炭酸 / Tobacco

Status: `DECIDED DIRECTION`

Named Boss / major confrontation後は、原則としてcelebration / decompression sceneを置く。

同じ宴会を反復しない:

- 焼肉
- 鍋
- 夜食
- ラーメン
- 炭酸で乾杯
- 酒盛り
- 大人だけの二次会
- 焚き火
- 喫茶店風
- 静かな食事
- 重い勝利で誰も騒げない食卓
- 二人だけ残る後片付け

PartyはCharacter人気 / 年代差 / callback / breather / emotional payoffのStory engine。

## Alcohol

- 酒は存在する。
- 飲めば酔う。
- Dreamだから酔いを無効化しない。
- 酔い方はCharacterごとに変える。
- 酔わせれば秘密が取れる、酔えば同意不要、酔った発言=必ず真実、は禁止。
- Final drinking sceneは成人確認済みCharacterに限定。

## Tobacco

- 主要喫煙Character **3人以上**。
- **pipe smoker 1人以上**。
- Final person assignmentはage / era確認までOpen。
- Current candidate: ゲン=pipe / トバリ=cigarette / セン=cigarette。
- 未成年へ割り当てない。

## Generic product naming

実在brandへ不必要に固定しない。

例:

- 黒い炭酸
- 柑橘のシュワシュワ
- ぶどうソーダ
- 麦の泡酒
- 米の酒
- 果実酒
- 炭酸割り

---

# 9. 年代差は時間タグではなく生活差で出す

Status: `DECIDED`

Dreamでは:

- 西暦
- exact date
- 年代
- 歴史順序

の明示time tagが弱い。

一方:

- 人格
- 技能
- 好き嫌い
- 商品知識
- 道具の使い方
- UI慣れ
- 制度感覚

は残る。

年代差を:

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
- 服 / 縫製
- 道具
- slang
- law / institution
- city knowledge
- 炭酸 / 酒器 / match / lighter

から小さく出す。

「私は1987年から来た」のような説明を最初からしない。

新しい時代の人物を上位互換にしない。

- トモリはfuture UIに弱くてもmechanical repairに強い。
- ミチルはdigital routeに弱くても紙地図 / 現地観察に強い。
- ナギはprivacy / access境界に強い。
- ユイはpresent-day conventionに強い。
- アサはfuture system interfaceに慣れていてもanalog objectの個体差に弱い。

---

# 10. Stars / Constellations

Status: `DECIDED CORE / FINAL CAUSE OPEN`

- ヨルノシルベでは**星が見える**。
- 星空は重要なvisual identity。
- 同じ星を見てもEraにより星の結び方 / 星座名 /物語 / 星獣との関係認識が違い得る。
- 昔だけ存在する星座、後世で生まれた星座を入れてよい。
- Core5 5人だけでも**同じ星を違う形に結ぶscene**を作れる。

Open:

- なぜ星座が増減するか
- なぜ年代で結び方が違うか
- 星獣と星座の最終関係

RealityのIAU体系等をDreamの絶対基準にしない。

---

# 11. Moon / 朔夜

Status: `DECIDED`

月相はReality経過時間ではなく**大事件の核心へのdepth**。

基本image:

`満月 → 欠ける → 半月 → さらに欠ける → 朔`

ただし全Eraを同じ5stageへ固定しない。
半月開始 / 異常な欠け / 戻り / 未来だけ別挙動も使える。

朔では月が消えるが星は残る。
ランタン / 焚き火 / 街灯 / Characterの灯り / 星 / 星獣が強く見える。

> 月が照らしてくれないなら、自分たちの灯りで進む。

朔 = 固定Eraラスボス、ではない。

---

# 12. 朔夜座（さくやざ）

Status: `DECIDED FORMAL NAME`

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

- 八影 = early observer labelとして残せる。
- 朔盟 = `SUPERSEDED CANDIDATE / legacy authored asset namespace`。
- 既存member思想 / pair / relation / stable ID / visual資産は捨てない。
- Current正式名を朔盟へ戻さない。
- 「座」は朔夜座のbrand。群青残響録へ乱用しない。
- Founder / absolute leader / exact originはOpen。

朔夜座は複数Eraの大事件へ協力 / 利用 / 対立 / 妨害 / 止めようとする等、異なる立場で関われる。
群青残響録との固定hierarchyを作らない。

---

# 13. 群青残響録（ぐんじょうざんきょうろく）

Status: `DECIDED NAME / MEMBERS OPEN`

> 各時代の大事件で中心となった人物 / 人物群を、後から一つの記録名で括る総称。

- 固定敵組織ではない。
- 同時代でなくてよい。
- 互いを知らなくてよい。
- 思想 / 種族 / 立場は違い得る。
- 人数固定ではない。
- 1 Era 1人ではない。
- 全員combat Bossではない。
- 全員悪人ではない。
- **「世代ラスボス」という固定slotへ入れない。**

大事件の中心とcombat Boss roleは別lane。

Dreamではまず自然なカタカナ呼称で現れ、後から新聞 / 名簿 / 記録 / 写真 / 文書 / 企業資料 / 古い本等でfull name / 年代が判明する構造を使える。

トウイチ / レイジ / マコト / チカゲ等の過去案はまだCandidate。

---

# 14. 黒耀化と社会の大事件

Status: `DECIDED THEME`

個人:

`長所 / 願い + 恐怖 / 焦り → 一つの答えへ極端化 → 黒耀化`

社会:

`理想 / 保護 / 発展 + 恐れ / 利害 / 制度 → 一つの解決策へ固執 → 大事件`

黒耀化は外部evil personality / possessionではない。
本人が元から持つ長所 / 願い /恐怖の過剰化。

Storyの答えは単なる「悪を倒す」だけにしない。

> **二択しかないと思っていた状況へ第三の選択肢を作る。**

別Eraで得た知識・技能・価値観・失敗例が、自分のReality incidentの選択肢を増やす。

---

# 15. Eraごとの社会pressure

Status: `DIRECTION / DETAILS OPEN`

## 1940年代系 — トモリ

- 集団と個人
- 生存
- 情報
- 命令
- 犠牲
- 守ること
- repair / reuse / handwork

ただしトモリを戦争体験だけで説明しない。

## 1980年代系 — ミチル

- 発展
- 成功
- 企業
- 経済
- 豊かさ
- 見ないふり
- redevelopment / old route / new route

バブルだけにしない。

## 2000年代系 — ナギ

- Internet
- 携帯
- 繋がり
- 孤独
- 個人情報
- public / private
- access / lock

## 現代 — ユイ

- SNS
- 情報過多
- 正しさ
- 炎上
- 同調
- algorithm
- 孤立
- 多様な価値観
- over-documentation

## 未来Android / Robot — アサ

- 作る者 / 作られた者
- 人格
- 労働
- 所有
- 自由
- identity
- copy
- name / designation
- 人間とは何か
- 心とは何か

各Eraをstereotypeだけで描かず、ordinary life / 良い面 / 矛盾も描く。

---

# 16. Future Android / Robot Era

Status: `DECIDED DIRECTION / DETAILS OPEN`

未来ではAndroid / Robotが社会に存在する。

人間側には酷使 / 道具扱い / 所有 / 廃棄 / 命令等の問題があり得る。
Android側も人間を一括りにし、排除を最適解とする等の極端化があり得る。

**人間全員悪 / Android全員善にはしない。**

Human側 / Android側双方にDream参加者がいる。
DreamではReality所属を知らず友達になる場合がある。

Androidの成長goalは「人間になる」ではない。

> **人間ではない。それでも友達にはなれる。**

を重視する。

Android Characterは好感度 / 親密度が上がりにくい方向。
好意を義務 / 相互扶助 / 契約 / 効率と処理し、後から過去の優しさを再評価できる。

Naming:

- 最終Android名はOpen。
- シオン / イヴ・ノインは不採用。
- 普通の日本語名に聞こえるカタカナ名だが、後からalphabet / acronym / system designationでも成立する方向。
- Lambda等ギリシャ文字は個人名でなくversion / generationに使える。
- 完全なversion順序はOpen。

哲学:

- 同じmemory dataなら同じ人か
- copy二体は同一人物か
- 分岐した瞬間に別人か
- body / memoryが違えば別人か
- 「私」はどこにあるか
- 人間の魂の証明がないのにAndroidだけ魂を要求してよいか

星獣を魂証明装置にしない。

### アサとの境界

アサはこのEra出身の**Human**。
アサ自身をAndroidへretrofitしない。
Android incidentでの政治的立場 / 被害 / 家族関係はOpen。

---

# 17. Reality animals

Status: `DECIDED DIRECTION`

Reality由来の犬 / 猫もDreamへ入れる。
**星獣とは別category。**

犬は匂い / 声 / 歩き方 / 手触り / 帰る時間等から人を覚えられる。
猫は複数の家 / 複数の呼び名から「違う名で呼ばれても自分は自分」というThemeを持てる。

動物を万能賢者にしない。
怖がる / 間違う / 好き嫌い / 気まぐれを残す。

---

# 18. Happy End

Status: `DECIDED`

正史はHappy End。
Permanent deathを主要な泣かせ装置にしない。

悲劇を全部なかったことにするのではなく、人物が成長し、以前は選べなかった第三の選択を選んで最悪の結末を変える。

Party / 食事 / 酒席 / 一服等の何気ない反復を感情資産として使う。

---

# 19. Inspiration guard

「日常の積み重ねが最後の力になる」等の感情構造は研究してよい。

そのままコピーしない:

- 一つの事故
- 全員同じ事故の被害者
- 主人公を鍛えるためだけの世界
- 死後世界
- 全員同じ悲劇
- 全員を救う訓練箱
- 世界崩壊から目覚めるだけ

ヨルノシルベの独自性:

- Core5 5人 = 5 Reality eras
- 人間 / 動物 / 機械
- 朝のないDream
- storage-mediated provisioning
- Boss後Party
- 星座の年代差
- 月相 = incident depth
- 朔夜座
- 群青残響録
- Waking memory rule

---

# 20. Naming / Commercial-name guard

Current決定名:

- **朔夜座**
- **群青残響録**

固有名詞は説明用二字熟語の量産を避け、音 / 字面 / 呼びやすさを先に成立させる。
意味は物語で後から深くする。

食品 / 飲料 / 酒 / tobacco等はStory上必要がなければ実在brandへ固定しない。

---

# 21. 制作姿勢

ヨルノシルベを設定説明のための作品にしない。

人物が普通に:

- 食べる
- 焼肉する
- 鍋を囲む
- 炭酸で乾杯する
- 成人同士で酒を飲む / 酔う
- 一服する
- 遊ぶ
- 喧嘩する
- 仲直りする
- 冗談を言う
- 恋をする
- 友達になる
- 知らない文化を面白がる

時間を十分に積む。

年代差を「私は未来人です」で説明せず、食事 / 商品 / 道具 / UI / 言葉 / 星座 / 服 / repair method等からPlayerが気づくようにする。

---

# 22. Still Open — AI単独でCanon化しない

- Core5各人の**exact year / exact chronological age**
- トモリ1940年代の戦中 / 戦後exact placement
- ミチルのexact地域
- ナギのexact school / occupation / household
- ユイの作品内exact year表記
- アサのfuture exact year / political side / Android-incident role
- 群青残響録formal members / formal names
- Android最終名 / acronym / complete version order
- 各Era大事件のexact内容
- 犠牲者数
- exact場所
- 星座増減の最終原因
- 星獣と星座の最終関係
- ヨルノシルベの最終mechanism / 起源
- 群青残響録individual ending / salvation
- 各大事件にcombat Bossが必要か
- 喫煙3人以上のFinal person assignment
- 飲酒 / 喫煙Characterのexact adult age整合
- 重大Family fact / death / orphan / abuse

**Core5 person-to-era lane assignmentそのものは、もうOpenではない。**

---

# 23. Migration rule

Authority order:

```txt
00-current-story-world-master.md
↓
core5-era-character-master-v1.md / WORLD.md / CANON.md / World Foundation
↓
Conflict Register / Human Decision Queue
↓
Story / Stage / Character / Enemy / Daily-life docs
↓
Machine-readable source
↓
Runtime / UI migration（必要な場合のみ）
```

古い資料に:

- 朝 / Dawn帰還
- 朔盟Current正式名
- 全年代同一星座
- 固定人数の大事件Boss
- Reality生活インフラ必須のDream
- Core5同世代
- Core5 individual era assignment Open
- direct food materialization

が残っていてもCurrentへ戻さない。

stable ID / Character / Enemy / Relation資産は壊さず、下位資料を順次追従させる。

ユーザーの明確な後続決定は本Masterを更新して反映する。