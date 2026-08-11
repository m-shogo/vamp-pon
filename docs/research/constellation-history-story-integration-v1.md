# ヨルノシルベ — 星座史実 × 物語統合 Research v1

Date: 2026-08-11  
Status: **CURRENT RESEARCH / HIGH-VALUE STORY CANDIDATES / NOT ALL CANON**

> 目的: 星座の歴史・標準化・旧星座・日本の星文化を史実準拠で研究し、年代伏線・星獣・グッズ・Dialogue・Stage・Main Mysteryへ使える形へ整理する。
> `docs/00-current-story-world-master.md` の星空方針を補助するresearch source。

---

# 0. Research hard rules

- 現代の恒常的な商品 / 星獣 / UI基準は **IAU 88星座**をAuthorityにする。
- 年代伏線のために「昔は実在した星座」を使う場合、**史実上の星図・旧星座・asterism・名称を根拠にする**。
- 「昔はあったことにする架空星座」を年代証拠として捏造しない。
- ヨルノシルベはDreamなので天空の見え方そのものはRealityの地理・季節に完全拘束しないが、**Historical labelは史実由来**にする。
- 星獣を旧星座ごとに無限追加しない。Modern IAU88をstable identity、Historical layerをoverlay / skin / archive / limited goodsにする。
- 星座のline-artはIAU公式図形ではない。Project側でModern canonical line-artを一つ固定し、Historical atlasとの差をoverlayとして扱う。

---

# 1. 現代88星座の史実境界

## Fact

- 19世紀には各種星図に100を超える星座が存在した。
- IAUは1922年の第1回総会で全天を覆う88星座と3文字略号を採択。
- 1928年に星座境界を承認。
- 1930年にDelporteの境界体系が出版され、現在の科学的星座区分が確立した。
- 日本では88星座の和訳名が1944年の学術研究会議『天文術語集』に掲載された。その後表記が改訂され、現在はひらがな / カタカナを基本とする。

## Story value

1940年代以後を描くとき、公式星座数そのものを年代ごとに変えない。
年代差は:

- どの時代の星図を知っているか
- 家にどんな古書があったか
- 日本語の標準名をどこで覚えたか
- cultural asterismを知っているか
- 旧星座名の痕跡を知っているか

で出す。

## Strong meta-theme

IAUの境界は、既存の変光星名を別星座へ移さないことも要件として設計され、その結果いびつな境界も生まれた。

> **新しい標準を作る時でさえ、既に人が使っていた名前を壊さないよう線を引いた。**

これはヨルノシルベの「正しさを更新しても過去の人の名前 / 履歴を消さない」と非常に相性が良い。

Sources:
- https://www.iau.org/Iau/Science/What-we-do/The-Constellations.aspx
- https://www.nao.ac.jp/news/blog/2022/20220809-constellation.html
- https://ndlsearch.ndl.go.jp/books/R100000002-I000000676957

---

# 2. 「星座」と「線画」は別

## Fact

現代天文学で星座は境界で囲まれた**天空の領域**。
星を結ぶ図形そのものは公式の唯一解ではない。
歴史的 / 文化的なasterismは、現代IAU境界とは別体系として存在し得る。

## Production decision candidate

```txt
Modern constellation stable ID
├ IAU Latin name
├ IAU 3-letter abbreviation
├ current Japanese name
├ official sky-region boundary reference
├ Yoru-no-Shirube canonical line-art  ← project fixed
├ Star Beast stable ID
└ merchandise stable identity

Historical overlay
├ source culture / atlas / year
├ historical name
├ historical line / figure
├ relation to modern IAU regions
└ story clue / archive / special goods
```

これならグッズの星獣が毎回別物にならず、古い星図の差だけを魅力として出せる。

---

# 3. SSS — Quadrans Muralis / 壁面四分儀座

## Fact

- Jérôme Lalandeが1795年に作った旧星座。
- 1922年のIAU 88星座には採用されなかった。
- 現在、その方向は主にうしかい座 / りゅう座付近。
- **しぶんぎ座流星群（Quadrantids）**の名称には旧星座名が現在も残っている。
- 2025年、IAU WGSNは44 Boo Aへ **Quadrans** という正式恒星名を採用した。

## Yoru value

### motif
**姿はなくなった。名前は残った。そして別の形で戻った。**

### clue scene candidate

古い星図を知るCharacter:
> 「四分儀座の方から流れてきた。」

現代Character:
> 「四分儀座って、今はないよ。……しぶんぎ座流星群ならあるけど。」

この時点では年代Revealにしない。
後で古書 / archiveで本当に存在した星座だと判明する。

### 2026-present reverse clue

2025年採用のQuadrans恒星名を知っている人物は、かなり新しい天文知識を持っている。
「古い名前を知る = 昔の人」だけでなく「復活した正式名を知る = 最近の人」という逆伏線にできる。

### Merch

- `LOST CONSTELLATION / QUADRANS MURALIS`
- old atlas card
- modern Bootes/Draco overlay transparent card
- Quadrantids seasonal pin
- Quadrans 2025 return card

Source:
- https://science.nasa.gov/solar-system/meteors-meteorites/quadrantids/
- https://www.iau.org/IAU/IAU/News/Ann2026/New-Star-Names-2026.aspx
- https://www.nao.ac.jp/new-info/meteor/index.html

---

# 4. SSS — Argo Navis / アルゴ座

## Fact

古代プトレマイオスの体系では巨大な船 **Argo Navis** が一つの星座として扱われた。
現在の88星座では:

- Carina / りゅうこつ座
- Puppis / とも座
- Vela / ほ座

として分かれている。

## Yoru value

### motif
**一つだったものが三つに分かれても、由来まで失われたわけではない。**

Future Android / copy問題と特に相性が良い。

```txt
same origin
→ separate names
→ separate histories
→ still share an origin
```

ただしAndroid編で初出にしない。
序盤から星図で見せ、後にAndroid問題と同じ問いだったと再読できる方が強い。

### Character scene candidate

古い体系を知る人:
> 「船が三つに割れてる。」

別Character:
> 「割れたんじゃなくて、三つに名前が付いたんじゃない？」

### Merch

Carina / Puppis / Velaの3 Star Beastを並べると、旧Argoの一隻の構図になるtriptych商品。
単体でも成立、3つ集めると別絵になる。

Sources:
- https://eco.mtk.nao.ac.jp/koyomi/faq/constellations.html
- https://science.nasa.gov/missions/hubble/hubble-sights-a-sail-of-stars/

---

# 5. SSS — Serpens / へび座

## Fact

現代のへび座は**一つの正式星座**だが、天空上では:

- Serpens Caput / 頭部
- Serpens Cauda / 尾部

という二つの離れた領域に分かれ、間にへびつかい座が入る。
国立天文台も面積を頭部・尾部に分けて記載する一方、略符は両方 `Ser`。

## Yoru value

### motif
**離れていることと、別物であることは同じではない。**

これは異なるReality Eraで離れている人物同士、Robot version、家族、友人関係へ広く効く。

### scene candidate

Android / logical Character:
> 「非連続領域なのに、同一IDなのですか。」

人間Character:
> 「離れてるからって、別って決まるわけじゃないだろ。」

Androidテーマを説明するために星座を発明する必要がなく、史実がそのまま問いになる。

### UI / goods

へび座Star Beastだけ2-piece visualにしてよい。
ただし**Star Beastは1体 / 1 stable identity**を基本にし、頭尾パーツが離れて一つのシルエットを作る。

Sources:
- https://www.nao.ac.jp/new-info/constellation.html
- https://www.nao.ac.jp/new-info/constellation3.html

---

# 6. SS — Libra / Scorpius: 古い意味が星名に残る

## Fact

現在てんびん座に属するZubenelgenubiは、かつて「さそりの南の爪」と考えられた歴史を星名に残す。NASA APODでも、ZubenelgenubiがかつてScorpiusのsouthern clawと考えられ、Zubeneschamaliがnorthern clawだったことが説明されている。

## Yoru value

### motif
**所属が変わっても、名前の中に前の所属が残る。**

Characterの:

- 旧姓
- family name
- former group
- old job title
- Android model designation
- old nickname

と重ねられる。

### subtle dialogue

天文に詳しいCharacterが「てんびん」と言いながら星名だけは「爪」の意味で覚えている。
説明台詞にせずArchiveでPayoffする。

Source:
- https://apod.nasa.gov/rjn/apod/ap040514.html

---

# 7. SS — Antinous: 星図から消え、星名へ戻る

## Historical evidence

Library of Congressは1825年『Urania's Mirror』の星図を **Delphinus, Sagitta, Aquila, and Antinous** として所蔵しており、Antinousが当時星図上の独立figureとして描かれていたことを確認できる。

IAU WGSNは2024年にθ Aquilaeへ正式恒星名 **Antinous** を採用した。

## Yoru value

Quadransと並び:

> **図として消えても、名前が別の単位へ戻る。**

を史実で示せる。

名前 / memory / archiveを重視するYoruと相性が良い。

Sources:
- https://www.loc.gov/pictures/item/2002695506/
- https://www.iau.org/IAU/IAU/News/Ann2026/New-Star-Names-2026.aspx

---

# 8. SS — 2024–2025: Historical name revival

## Fact

IAU WGSNは2024–2025に多数の恒星名を正式採用。
その中には歴史的 / cultural asterism由来を含む:

- Antinous
- Quadrans
- Ramus
- Rangifer
- Tarandus
- Solitaire
- Stellio
- その他各文化由来名称

WGSNは肉眼で見える星について、歴史的・先住民文化などのasterism名を研究して正式名称へ採用する活動を行っている。

## Yoru value

「昔の名は一度標準から外れたら永久に死ぬ」という世界観にしない。

> **標準化は終点ではない。後世の人が古い名前を再発見し、別の形で残すこともある。**

群青残響録・archive・Happy Endへ非常に相性が良い。

Sources:
- https://www.iau.org/IAU/IAU/News/Ann2026/New-Star-Names-2026.aspx
- https://www.iau.org/WG280/WG280/Home.aspx

---

# 9. SS — 日本1944『天文術語集』

## Fact

- 学術研究会議『天文術語集』は昭和19年（1944）、11ページ。
- 現在の88星座和名の基礎となる日本語名称を掲載。
- 後に表記は改訂され、現在はひらがな / カタカナが基本。

## Yoru value

戦後復興・物資不足期のトモリEraをexact yearへ固定する前に、星座用語の使い方を一次資料と照合できる。

ただし:

- 「1944だから旧星座数が違う」は禁止。
- exact旧和名 / spelling差をDialogueへ入れる前に原本確認する。

### prop candidate

傷んだ小冊子 / 天文用語メモ。
重要なのは「年代説明アイテム」ではなく、後で奥付を見て年代が刺さること。

Sources:
- https://ndlsearch.ndl.go.jp/books/R100000002-I000000676957
- https://www.nao.ac.jp/news/blog/2022/20220809-constellation.html

---

# 10. S — 二十八宿 / 江戸日本の星空

## Fact

渋川春海の1677年『天文分野之図』などは中国由来の星図を基礎とし、二十八宿で天空を区切る。
現代西洋星座とは結び方が異なる。
国立天文台の解説では:

- 参宿 = 現代オリオン座の一部
- さそり座領域 = 房宿 / 心宿 / 尾宿などに分かれる

と説明される。

## Yoru value

Core5 current Eraよりさらに古いCharacter / series expansionを追加する場合に最強のhistorical overlay。

> 同じ星を見る。
> でも「オリオン座」という一つの人型ではなく、別の宿 / 星官として結ぶ。

これを完全に史実でできる。

### Guard

1940年代Characterが二十八宿を使う場合は「時代だから」ではなく、家 / 寺社 / 天文趣味 / 古書 / 家業など個人理由が必要。

Sources:
- https://eco.mtk.nao.ac.jp/koyomi/exhibition/020/
- https://eco.mtk.nao.ac.jp/koyomi/exhibition/043/
- https://eco.mtk.nao.ac.jp/koyomi/exhibition/047/

---

# 11. S — すばる / Pleiades / M45

## Fact

同じ星の集まりに複数のidentityが共存する。

- すばる
- 昴
- 六連星
- プレアデス
- astronomical cluster designationとしてM45も一般的

国立天文台は「すばる」の古い日本語用例と、六連星 / むりかぶし等の地域名を紹介している。

## Yoru value

これは年代判定より**同一対象の複数名**に使う。

Android naming / 猫のmultiple names / chosen name問題へ強い。

> 名前が違うことは、別物である証明ではない。

### Character use

同じ星を:

- 星図好き = Pleiades
- 日本文化寄り = すばる
- catalog好きRobot = M45

と呼んでも会話が成立する。

Sources:
- https://eco.mtk.nao.ac.jp/koyomi/exhibition/007/
- https://eco.mtk.nao.ac.jp/koyomi/exhibition/058/

---

# 12. S — Vega / Altair: proper name / catalog / folklore

## Fact

同じ恒星が複数のidentifierを持つ。

Example:
- Vega = α Lyrae = 織姫
- Altair = α Aquilae = 彦星 / 牽牛

Bayer designationはGreek letter + constellation名という別identity system。

## Yoru value

Future Android名の設計へ直接使える。

```txt
personal call name
≠ model designation
≠ legal registry
≠ family / cultural name
```

どれか一つだけが「本当の名前」とは限らない。

Source:
- https://eco.mtk.nao.ac.jp/koyomi/faq/stars.html.en

---

# 13. S — Tool constellations: 人間の技術が空に残る

現代88星座には実在する道具 / 技術を名に持つものがある。

Examples:

- Telescopium / ぼうえんきょう座
- Microscopium / けんびきょう座
- Horologium / とけい座
- Sextans / ろくぶんぎ座
- Octans / はちぶんぎ座
- Pyxis / らしんばん座
- Circinus / コンパス座
- Antlia / ポンプ座

## Yoru value

Future Androidが初めて古い空を見て:

> 「人間は機械にも星座を与えていたのですね。」

と言える。

「自然物だけが星座になる」という先入観を崩す。
Android / Robotを星空から排除しないsymbolic foundationにもなる。

Source:
- https://www.nao.ac.jp/new-info/constellation.html

---

# 14. Current high-value motif set

物語へ一気に全部出さない。

## Title1 main-facing候補

1. **Quadrans Muralis** — 消えた形 / 残った名前 / 後世の復活
2. **Argo Navis** — 一つ→三つ
3. **Serpens** — 離れているが一つ
4. **1944『天文術語集』** — Reality Era clue

## Character episode / archive候補

5. Libra / Scorpius claw — 旧所属が名前に残る
6. Antinous — 星図から星名へ
7. すばる / Pleiades — 一対象に複数の正しい名
8. Vega / Altair — personal / catalog / cultural identity

## Series expansion候補

9. 二十八宿 / 江戸星図
10. 2024–25 historical name revival
11. Tool constellations / Future Android resonance

---

# 15. Story progression candidate

```txt
Early
「星の線の引き方、ちょっと違うね」
↓
Mid
「その星座、今は正式にはないよ」
↓
Archive payoff
実在する古い星図に同じ名称 / figure
↓
Deeper
Argo / Serpens / multiple star names
= 同一性そのものへの問い
↓
Future
Androidのmodel / call name / copy identity問題と再接続
↓
Late
Quadrans / Antinousのように
“消えた名前が後世に別の形で戻る”史実が
Happy End / archive philosophyへ響く
```

星座を「年代当てクイズ」で終わらせない。
**最初は伏線、後半は作品テーマそのものへ昇格**させる。

---

# 16. Merchandise stability candidate

## Permanent line

**IAU88 / Star Beast Standard Collection**

- stable ID固定
- project canonical line-art固定
- canonical color / Star Beast / symbol固定

## Historical line

**Historical Sky / Lost & Changed Constellations**

- transparent overlay card
- old-atlas style card
- archival pin / badge
- vintage map poster
- former-name seal

## Set gimmicks

- Argo 3-piece combine
- Serpens 2-piece but one ID
- Quadrans old / current overlay
- modern 88 vs Edo 28-mansion comparison sheet

Canonical gameplay / merchandise identityをHistorical layerで上書きしない。

---

# 17. Do not use as main clue

- 1940s→2020s程度の恒星固有運動で星座形状が大きく変わる、は使わない。
- 20XX程度で歳差により北極星が別星へ変わる、は使わない。
- 「13星座 / へびつかい座」だけを大Mysteryにしない。一般的すぎ、占星術との混同が大きい。
- 旧星座を大量追加してStar Beast rosterを揺らさない。
- Historical factとDream-specific phenomenonを混ぜて史実のように説明しない。

---

# 18. Next research backlog

- 1944『天文術語集』本文の88星座和名と現代表記の差分を一次資料で全件比較。
- 明治〜昭和初期の日本語星図 / 教科書で実際に一般層が使った呼称を比較。
- Quadrans / Antinous / Stellio等のhistorical atlas上の位置と現代IAU regionをmachine-readable化。
- Core5各Eraの「知っていて自然な天文知識level」をCharacter教育 / 家庭 / 趣味と一緒に決める。
- Merchandise用IAU88 stable ID / historicalAlias schemaを既存Star Beast DBと衝突確認。
- Story Stageへ星空clueを置く際、Playerが天文知識ゼロでも後で意味が分かるUIを設計。
