# ヨルノシルベ — 星座の使える情報 Book v1

Date: 2026-08-12  
Status: **CURRENT USABLE KNOWLEDGE / STORY・CHARACTER・STAR BEAST・MERCH REFERENCE**

> 星座史・旧星座・日本の星文化から、ヨルノシルベで実際に使いやすいものだけを抜き出した制作向けBook。
> Historical factの根拠詳細は `docs/research/constellation-history-story-integration-v1.md` を参照する。
> 星座subdomainの最上位ルールは `docs/00-current-story-world-master-constellation-amendment.md`。

---

# 0. 使い方

このBookの情報は主に以下へ使う。

- `ERA_CLUE` — 年代差の自然な伏線
- `IDENTITY` — 同一人物 / 名前 / 所属 / 分岐のテーマ
- `MEMORY` — 消える / 残る / 後世に戻る
- `RELATION` — 離れていても一つ、一つから複数になる
- `ANDROID` — model / copy / legal name / chosen name
- `STAR_BEAST` — 星獣のvisual / stable identity
- `MERCH` — グッズ・カード・星図・set gimmick
- `ARCHIVE` — ゲーム内資料 / 灯録 / 星図
- `STAGE` — 夜空visual / environmental clue

Historical factをそのまま説明台詞にせず、まずCharacterの普通の会話や星図差分として見せる。

---

# 1. 現代の絶対基準 — IAU 88星座

## 使える事実

- 現代天文学の星座は88。
- IAUが1922年に88星座と3文字略号を採択。
- 1928年に境界を承認。
- 1930年にDelporteの境界体系が出版。
- 日本では1944年『天文術語集』が88星座和名の重要な標準化点。

## 制作上の使い方

`STAR_BEAST / MERCH / COLLECTION UI` のstable authorityはIAU88へ固定する。

旧星座・古星図は別layerとして使い、通常星獣rosterを増減させない。

Tags: `STAR_BEAST` `MERCH` `ARCHIVE`

---

# 2. 星座の「線」は唯一の公式図ではない

## 使える事実

現代天文学で星座は、基本的に境界で区切られた天空領域。
星をどう線で結んで人物・動物・道具の形にするかに唯一の公式line-artはない。

## ヨルノシルベでの価値

- Project側でModern canonical line-artを1本固定できる。
- Historical atlasでは別の結び方をoverlayできる。
- 「同じ星なのに線が違う」という年代 / 文化の伏線を作れる。
- グッズの見た目をブレさせずHistorical差分を商品にできる。

Tags: `ERA_CLUE` `MERCH` `STAGE`

---

# 3. 壁面四分儀座 / Quadrans Muralis

Priority: **SSS**

## 使える事実

- 1795年にJérôme Lalandeが作った旧星座。
- 現代IAU88には採用されなかった。
- 名称は現在も**しぶんぎ座流星群 / Quadrantids**に残る。
- 2025年、IAUは44 Boo Aへ正式恒星名 **Quadrans** を採用。

## 使える意味

> **形が消えても、名前は残る。さらに後世に別の形で戻ることもある。**

## 使いどころ

### ERA_CLUE
昔の星図に詳しい人物が「四分儀座」と自然に呼ぶ。
現代Characterは「今はない」とだけ知っている。

### MEMORY
「忘れられた = 完全消滅」ではない象徴。

### PRESENT CLUE
2025年採用の`Quadrans`を知る人物はかなり新しい情報を持つ。
古い知識だけでなく**新しすぎる知識**も年代伏線にできる。

### MERCH
- old / modern transparent overlay
- Quadrantids seasonal pin
- `LOST CONSTELLATION: QUADRANS MURALIS`
- `QUADRANS RETURN 2025`

Tags: `ERA_CLUE` `MEMORY` `MERCH` `ARCHIVE`

---

# 4. アルゴ座 / Argo Navis

Priority: **SSS**

## 使える事実

古代の巨大な船`Argo Navis`は、現代88星座では主に:

- Carina / りゅうこつ座
- Puppis / とも座
- Vela / ほ座

へ分かれている。

## 使える意味

> **一つだったものが複数へ分かれても、どれか一つだけが偽物になるわけではない。**

## 使いどころ

### ANDROID
同一snapshotから複数body / versionへ分岐したAndroid問題の前振り。

### RELATION
一つの家族 / groupが別々の人生へ分かれる話にも使える。

### MERCH
Carina / Puppis / Velaの3商品を並べると一隻の旧Argoになるtriptych。

### STORY GUARD
Android編で初めて説明しない。
もっと前に普通の星座雑談として出し、後から意味が返る方が強い。

Tags: `IDENTITY` `RELATION` `ANDROID` `MERCH`

---

# 5. へび座 / Serpens

Priority: **SSS**

## 使える事実

現代のへび座は一つの正式星座だが、天空では:

- Serpens Caput / 頭
- Serpens Cauda / 尾

の離れた2領域に分かれ、その間にへびつかい座がある。
それでも星座identityは一つの`Serpens / Ser`。

## 使える意味

> **離れていることと、別物であることは同じではない。**

## 使いどころ

- 別Eraで離れた友人
- 家族
- buddy
- Robot body separation
- remote avatar
- 長期間会えない関係

### STAR_BEAST
へび座星獣だけhead / tailが空間的に離れた2-piece visualでもよい。
ただしstable identityは**1星獣**。

Tags: `RELATION` `IDENTITY` `ANDROID` `STAR_BEAST` `MERCH`

---

# 6. てんびん座 / さそり座 — 昔の所属が名前に残る

Priority: **SS**

## 使える事実

現在てんびん座に属する`Zubenelgenubi`などの星名には、歴史上「さそりの爪」と捉えられていた痕跡が残る。

## 使える意味

> **所属が変わっても、昔どこにいたかが名前の中に残ることがある。**

## 使いどころ

- 旧姓
- former team
- family history
- old job
- Android旧model名
- かつて敵側だったCharacter
- 改名後も残るnickname

「今の所属だけがその人の全部ではない」を説明抜きで重ねられる。

Tags: `IDENTITY` `MEMORY` `CHARACTER`

---

# 7. Antinous — 図から消え、星名へ戻る

Priority: **SS**

## 使える事実

- Historical atlasではAquila付近に`Antinous`が独立figureとして描かれた例がある。
- 現代88星座の独立星座には残らない。
- 2024年、IAUがθ Aquilaeへ正式恒星名`Antinous`を採用。

## 使える意味

> **昔の姿は消えても、名前が別の単位で戻る。**

Quadransと似るが、こちらはより**人名 / 個人の記憶**側へ使いやすい。

Tags: `MEMORY` `IDENTITY` `ARCHIVE`

---

# 8. 2024–2025 Historical name revival

Priority: **SS**

## 使える事実

2024–2025のIAU恒星名採用には、歴史的星図・asterism・文化名に由来するものが複数含まれる。

Examples:

- Antinous
- Quadrans
- Ramus
- Rangifer
- Tarandus
- Solitaire
- Stellio

## 使える意味

> **標準から外れた名前も、後世の人が拾い直すことがある。**

## 使いどころ

- Happy End
- Archive completion
- 群青残響録
- 「忘れられていたCharacterの名前を後世が拾う」構造

ただし2024–2025固有情報をMain Plot必須知識にはしない。
Easter egg / Archive / 現代Characterの専門知識として扱いやすい。

Tags: `PRESENT` `MEMORY` `ARCHIVE`

---

# 9. 日本1944『天文術語集』

Priority: **SS**

## 使える事実

- 昭和19年 / 1944年刊。
- 日本の88星座和名を確認する重要な一次資料。
- 現代表記と完全に同一とは限らないため、旧表記を台詞へ使う前に原資料比較する。

## 使いどころ

Historical Era Characterの本棚 / 小冊子 / 天文メモ。
年代説明の看板としてではなく、後から奥付や用語差が年代を示すpropにする。

### Guard

1940年代だから「公式星座数が現在と違う」とはしない。

Tags: `ERA_CLUE` `PROP` `ARCHIVE`

---

# 10. 二十八宿 / 日本の古い星空

Priority: **S**

## 使える事実

江戸期の日本では、中国系の二十八宿を基礎とする星図が使われた。
現代西洋88星座とは星の区切り方そのものが異なる。

Examples:

- 参宿 = 現代オリオン座の一部
- 現代さそり座領域 = 房宿 / 心宿 / 尾宿など

## 使える意味

> **空が違うのではなく、人間が星を結ぶ体系が違う。**

## 使いどころ

将来、江戸 / 明治初期 / 古い家系 / 寺社 / 天文家のCharacterを追加した場合の強力なEra clue。

1940年代Characterに自動で使わせない。
そのCharacterが古書・家業・寺社・天文趣味を持つ理由が必要。

Tags: `ERA_CLUE` `CULTURE` `SERIES_EXPANSION`

---

# 11. すばる / Pleiades / M45

Priority: **S**

## 使える事実

同じ星団に複数の名前 / identifierが共存する。

- すばる
- 昴
- 六連星
- Pleiades
- M45

日本各地にも異なる呼称がある。

## 使える意味

> **呼び名が違っても、見ているものは同じ。**

## 使いどころ

- 猫が複数家庭から別名で呼ばれる
- Androidのmodel name / call name / chosen name
- family nickname
- 世代差よりCharacter背景差

年代判定の決定打には使わない。

Tags: `IDENTITY` `ANDROID` `ANIMAL` `CULTURE`

---

# 12. Vega / Altair — 一つの星に複数identifier

Priority: **S**

## 使える事実

一つの恒星には:

- proper name
- Bayer designation
- catalog designation
- folklore / cultural name

など複数のidentifierがあり得る。

Examples:

- Vega = α Lyrae = 織姫
- Altair = α Aquilae = 彦星 / 牽牛

## Android命名への使い方

```txt
call name
≠ model designation
≠ legal registry
≠ serial number
≠ chosen name
```

全部が同じ個体を指し得る。
ただし**本人が何と呼ばれたいか**は別問題。

Tags: `IDENTITY` `ANDROID` `NAME`

---

# 13. 人工物・道具も星座になっている

Priority: **S**

Modern IAU88にも道具 / 技術由来の星座が複数ある。

Examples:

- ぼうえんきょう座 / Telescopium
- けんびきょう座 / Microscopium
- とけい座 / Horologium
- ろくぶんぎ座 / Sextans
- はちぶんぎ座 / Octans
- らしんばん座 / Pyxis
- コンパス座 / Circinus
- ポンプ座 / Antlia

## 使える意味

Future Androidに:

> 「人間は、道具にも空の居場所を与えていたのですね。」

のような発見をさせられる。

「星座 = 人 / 動物 / 神話だけ」ではない。
Robot / Androidを星空テーマから排除しない史実foundationになる。

Tags: `ANDROID` `STAR_BEAST` `CULTURE`

---

# 14. IAU境界が「古い名前を壊さない」ために曲がった

Priority: **SSS THEME**

## 使える事実

現代星座境界の標準化では、既に使われていた変光星の星座designation等が不必要に変わらないよう配慮され、そのため境界に単純でない部分も生まれた。

## 使える意味

> **新しい正しさを作るために、過去の名前を全部消す必要はない。**

これはヨルノシルベの世界観・黒耀化・社会事件の解決原則へ非常に強く接続できる。

「綺麗な新システムのために例外を消す」側と、
「過去の履歴を残したまま新しい境界を作る」側の対比に使える。

Tags: `THEME` `BLACK_YOUKA` `SOCIAL_INCIDENT` `ARCHIVE`

---

# 15. Storyへの投入順

一気に天文設定を説明しない。

```txt
1. 線の引き方が違う
2. 今は正式ではない星座名が出る
3. 古星図で本当に存在したと分かる
4. Argo / Serpensで「同じ / 別」のテーマへ広がる
5. すばる / Vega等で複数nameを自然化
6. Androidのcopy / name / body問題へ返る
7. Quadrans / Antinousで「消えても残る / 戻る」をlate payoff
```

Playerが天文学を知らなくても、後で意味が分かればよい。

---

# 16. グッズ / 星獣への固定ルール

## Permanent

`IAU88 / Star Beast Standard`

- constellation stable ID
- Star Beast stable ID
- Project canonical line-art
- canonical symbol / theme / color

を固定する。

## Historical

`Historical Sky / Lost & Changed`

- old atlas overlay
- transparent comparison card
- historical skin
- archive pin
- special badge
- vintage poster

として別商品laneにする。

### Strong gimmicks

- Argo = 3-piece combine
- Serpens = split visual but one identity
- Quadrans = old / modern transparent overlay
- 二十八宿 = modern IAU88とのcomparison sheet

Historical情報でModernのstable identityを上書きしない。

---

# 17. やらないこと

- 年代伏線用に「昔存在した架空星座」を捏造しない。
- 1940年代と現代で公式88星座数が違うことにしない。
- 1940→現代程度で恒星固有運動により星座形状が大きく変わったことにしない。
- 20XX程度で歳差により北極星が全く別物になったことにしない。
- 13星座 / へびつかい座だけをMain Mysteryにしない。
- 旧星座ごとに新Star Beastを増やしてrosterを壊さない。
- 史実とDream-specific supernatural phenomenonを同じ説明に混ぜない。
- 星座を天文知識quizにしない。

---

# 18. 優先採用候補

## SSS — Story spineへ使いやすい

1. Quadrans Muralis — 消える / 残る / 戻る
2. Argo Navis — 一つから複数へ
3. Serpens — 離れていても一つ
4. IAU boundary preservation — 新しい標準でも古い名前を守る

## SS — Character / Archiveで強い

5. Libra / Scorpius claw trace — 旧所属が名前に残る
6. Antinous — 消えたfigure名が星名へ戻る
7. 1944『天文術語集』 — 日本のEra clue
8. historical-name revival — 後世による名前の再発見

## S — 世界を厚くする

9. 二十八宿 — 日本の別の星の結び方
10. すばる / Pleiades / M45 — 複数の正しい呼称
11. Vega / Altair — name / designationの多層性
12. Tool constellations — 人工物も空の一員

---

# 19. Source of truth

Detailed research:
- `docs/research/constellation-history-story-integration-v1.md`

Current constellation authority:
- `docs/00-current-story-world-master-constellation-amendment.md`

今後星座ネタを追加するときは:

```txt
史実確認
↓
Researchへ根拠保存
↓
このUsable Bookへ用途付きで追加
↓
Character / Stage / Star Beast / Merchへ接続
```
