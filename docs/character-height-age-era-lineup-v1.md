# ヨルノシルベ — Height / Age / Era Lineup v2

Date: 2026-08-11  
Status: **P0 VISUAL PRODUCTION LINEUP / CORE5 DISTINCT-ERA HARD RULE / RELATIVE PROPORTIONS CANDIDATE**

> 目的: Character master / TOP / event art / sprite / merchandiseで、毎回身長・年齢感・体格・年代が変わる事故を防ぐ。
> 最上位Authority: `docs/00-current-story-world-master.md`。
> **Core5の5人はRealityでは全員が別Era / generation。exact person-to-era mappingだけがOpen。**

---

# 1. Four separate axes

混同禁止:

1. `chronologicalAge` — 実年齢。未確定なら未確定。
2. `ageImpression` — 外見 / 社会役割として見える年齢感。
3. `eraPlacement` — どの時代の人物か。
4. `dreamCoPresence` — Dream内で一緒に存在していること。

```txt
Dreamで同じテーブルを囲む
≠
Realityで同じ年代に生きている
```

Examples:

- ゲンが高齢 = OLD eraの証明ではない。
- クロエが若い外見 = 最近生まれた証明ではない。
- ユイとアサが外見同年代 = Reality同世代の証明ではない。

---

# 2. Core5 distinct-era invariant

Status: `USER-DECIDED HARD RULE`

Core5:

- ユイ
- アサ
- ナギ
- ミチル
- トモリ

は**5人とも別Reality era / generation**。

```txt
Core5 distinct era count = 5 / 5
```

禁止:

- 5人を同じ現代へ戻す
- 同じ学校 / 同級生化
- 外見年齢から同年代と推測
- TOP / event artで全員を同一modern fashionへ均す

### Open

- 誰が1940年代系か
- 誰が1980年代系か
- 誰が2000年代系か
- 誰が現代か
- 5つ目を未来Android / Robot laneへ置くか別Eraへ置くか
- exact year / exact chronological age

つまり:

> **5人が全部違うことは決定。誰がどこかはOpen。**

---

# 3. Era ≠ Narrative role

5 EraはNarrative roleの均等化ではない。

```txt
5 different Reality eras
≠
5人全員を同じ主役比重にする
```

ユイ / アサ / ナギ / ミチル / トモリの主役比重・Story機能はCharacter / Story Authorityで管理する。

Era設定をscreen-time quotaに変換しない。

---

# 4. Height bands

Human:

- `XS_CHILD` — 子ども
- `S` — 成人として小柄
- `M` — 中程度
- `L` — 高め
- `XL` — かなり大柄 / 高身長
- `SEATED` — wheelchair等、standing heightだけでcompositionしない

Enemy / nonhuman:

- `NONHUMAN_SMALL`
- `NONHUMAN_MEDIUM`
- `NONHUMAN_LARGE`
- `VARIABLE_FORM`

**exact cmはHuman visual review前にCanon化しない。**

---

# 5. Core5 visual anchors

| Character | Band | Candidate cm range | Age impression | Body / pose anchor | Era |
|---|---:|---:|---|---|---|
| ユイ | M | 158–163 | 若者寄り / exact age OPEN | 柔らかい中心、前傾しすぎない | DISTINCT / exact OPEN |
| アサ | S–M | 153–159 | 若者寄り / exact age OPEN | compact / quick / sharp | DISTINCT / exact OPEN |
| ナギ | M–L | 165–172 | 若者寄り / exact age OPEN | 縦長 / 閉じた姿勢 | DISTINCT / exact OPEN |
| ミチル | M | 160–167 | 若者寄り / exact age OPEN | active / 横幅ある動き | DISTINCT / exact OPEN |
| トモリ | M–L | 165–172 | 若者〜成人 impression / exact age OPEN | 工具を使う安定した重心 | DISTINCT / earlier evidence Candidate |

Core5 silhouette target:

- 頭頂高
- 肩幅
- 髪mass
- stance
- object silhouette

の最低3軸で5/5識別。

さらにEra差を最低2軸以上で出す:

- stitching
- fastener
- shoe construction
- bag hardware
- watch / clock habit
- textile
- repair method
- paper / ticket handling
- bottle / can familiarity
- match / lighter familiarity

「主人公だから一番小さい」等のgeneric化をしない。

---

# 6. Circle / Reserve lineup

| Character | Band | Candidate cm range | Existing age direction | Silhouette anchor | Era handling |
|---|---:|---:|---|---|---|
| セン | L | 172–180 | 成人 / 先生 | 長方形face + rolled sleeves | UNKNOWN |
| リツ | L | 175–183 | 年長の若者 / 兄 | square frame / protect-forward | UNKNOWN |
| コヨリ | XS_CHILD | 126–139 | 子ども | 丸い頬 / 小さいstep | UNKNOWN |
| ゲン | M–L | 165–173 standing base | 高齢者 | 年齢線 / 少し重心低い | OLD evidence Candidate only |
| ハナ | S | 150–158 | 高齢者 | ふっくら / soft broad mass | UNKNOWN |
| ユウビ | M | 160–168 | 若い成人 | mail bag / route-forward | TRANSIT evidence Candidate |
| マドカ | M | 157–165 | 若者寄り | window-observer / slight pause | UNKNOWN |
| シロ | M–L | 164–172 | 若者寄り | 丸眼鏡 / page-holding | UNKNOWN |
| トバリ | L–XL | 177–185 | 成人 | gatekeeper vertical mass | TRANSIT evidence Candidate |
| ネム | S–M | 154–162 | current profileを維持 | relaxed / wave / sleep-soft | UNKNOWN |
| レン | M–L | 167–175 | Reserve current | 差分を見る視線 / glasses | UNKNOWN |

---

# 7. Shadow5 lineup

Shadow5はCore5の「黒服版」にしない。

| Character | Band | Candidate cm range | Visual counterpoint | Hard body rule |
|---|---:|---:|---|---|
| クロオリ | M–L | 168–176 | folded / closed geometry | Current Appearance Source優先 |
| カナメ | XL | 183–192 | broad shield mass | **plus-size broad body hard lock** |
| カスミ | S–M | 156–165 | low-contrast / mist edge | silhouetteを細さだけに依存しない |
| トキ | L | 174–182 | measured / straight / clock geometry | postureで几帳面さを出す |
| ツムギ | M | 160–169 | thread / gap / asymmetry | thin-defaultへ均さない |

全員長身・細身・黒コートへ均さない。

---

# 8. Future15 lineup

FutureはCurrent21へ自動昇格しない。数値はCandidate。

| Future | Species / identity | Band | Candidate size | Age impression / note |
|---|---|---:|---:|---|
| ヒヨリ | human | M | 162–169 cm | 若い成人 |
| セリカ | human | M–L | 165–173 cm | 若い成人〜成人 |
| クロエ | long-lived human / witch-like | M | 158–166 cm | 外見成人、実年齢未LOCK |
| レンジ | human | M–L | 169–178 cm | 成人〜老年、登場時代で外見変化可 |
| トウマ | human | L | 175–184 cm | 成人〜中年 / craftsman |
| クウ | dog | NONHUMAN_MEDIUM | breed/size pending | Reality由来の犬 |
| ヨモ | cat | NONHUMAN_SMALL | domestic-cat scale | Reality由来の猫 |
| ノア | humanoid Robot A | M–L | 168–176 cm Candidate | same snapshot由来なら基本寸法共有可 |
| ルム | small maintenance Robot | NONHUMAN_SMALL | 55–85 cm Candidate | human chibi化しない |
| マキ | human | M–L | 168–177 cm | 成人女性 |
| スズ | human | M | 163–172 cm | 成人男性 / feminine presentation |
| イオ | human | M–L | 167–176 cm | 成人 / gender non-disclosed |
| カイ | human twin A | L | 171–180 cm | twin similarity meaningful |
| ナオ | human twin B | M–L | 169–178 cm | カイと±0–3cm程度Candidate |
| アマネ | human / wheelchair user | SEATED | 158–168 standing-equivalent Candidate | seated eye-line / chair geometry別管理 |

Guard:

- 双子は同じ身長でもstance / shoulder / hair / gesture差を持つ。
- ルムを小さいから子ども人格にしない。
- アマネmasterをstanding turnaroundだけで済ませない。

---

# 9. 朔夜座 lineup

Current formal name: **朔夜座**。
Legacy `Sakumei` namespaceはmigration資産としてのみ保持。

| Call name | Band | Relative visual scale | Silhouette promise |
|---|---|---:|---|
| ナシロ | NONHUMAN_MEDIUM | 1.05 | 空白名札 / face-area absence |
| アサトジ | NONHUMAN_LARGE | 1.20 | 箱 / 蓋 / vertical enclosure |
| ミチグレ | NONHUMAN_LARGE | 1.35–1.55 | route-erasing giant / slow landmark mass |
| オリネ | VARIABLE_FORM | 0.95–1.15 | origami folds change attack silhouette |
| ハクマ | NONHUMAN_MEDIUM | 1.10 | blank-card plane / frontal negative space |
| ツグリ | NONHUMAN_MEDIUM | 1.10 | repair seam / reconstructed mass |
| ユラネ | VARIABLE_FORM | 1.00–1.20 | dream-wave / horizontal fluid silhouette |
| ペタ | NONHUMAN_SMALL–MEDIUM | 0.85–0.95 | layered labels / compact rival |

Recognition target:

- Full silhouette 1秒: 8/8
- grayscale: 8/8
- 共通symbolを隠しても識別可能
- shared uniformへ潰さない

---

# 10. Age diversity

- コヨリを縮小成人顔にしない。
- ゲン / ハナの年齢線をbeautifyで消さない。
- カナメ / ハナの体格を細くしない。
- Chloeの不老を子ども顔へ変換しない。
- Renji older versionを若返り補正しない。
- Core5は外見年齢が近くてもEra costume cloneへしない。

---

# 11. Era visual markers

Eraはコスプレ記号だけで出さない。

使う:

- stitching
- fastener
- shoe construction
- glasses shape
- bag closure
- paper / printing
- watch / timekeeping
- ticket / postal form
- repair material
- drink container familiarity
- match / lighter familiarity
- pipe / cigarette prop familiarity

使わない:

- OLD = 全員和服
- PRESENT = 全員smartphone
- FUTURE = 全員neon cyber suit

複数markerの組み合わせで見せる。

---

# 12. Dream social-life visual implication

Core5が別Eraなので、同じParty tableにいるだけで差が出る。

- 炭酸瓶の開け方
- 焼肉の焼き方
- 氷への感覚
- 酒器の持ち方（成人のみ）
- match / lighter
- cigarette / pipeへの反応
- 調味料
- 食器

などをEra伏線に使える。

Source:
- `docs/dream-feast-party-social-bible-v1.md`

1個のevidenceだけでexact eraをRevealしない。

---

# 13. Master board measurement fields

Character master完成時に必須:

```txt
headTop
chin
shoulderLine
elbow
wrist
handLength
waist
hip
knee
ankle
footLength
eyeLineStanding
eyeLineSeated if needed
namedObjectScale
starBeastScale
```

さらに:

- front
- 3/4
- profile
- back
- neutral stance
- signature stance

を揃える。

---

# 14. Pair height composition

Relation artで毎回身長差を変えない。

Examples Candidate:

- ユイ × アサ: small gap
- リツ × コヨリ: clear sibling age/height gap
- ナギ × カナメ: Kaname visibly broader/larger
- カイ × ナオ: near-same height by design
- クロエ × older Renji: 弟子が外見年上になる視覚逆転

---

# 15. Adult social-content gate

飲酒 / 喫煙をFinal visual / eventへ入れる場合:

- adultであること
- Reality era / locationの制度と破綻しないこと
- exact age未LOCKならadult Directionが上流にあること

を確認する。

Current adult-direction examples:

- セン
- ゲン
- ハナ
- トバリ
- ユウビ

Smoking Direction:

- **主要喫煙Character 3人以上**
- **pipe smoker 1人以上**
- Candidate: ゲン=pipe / トバリ=cigarette / セン=cigarette

Final person assignmentはage / era review後。

---

# 16. Human approval gates

最終固定が必要:

1. exact cm
2. exact chronological age
3. **Core5 5人それぞれのexact person-to-era mapping**
4. exact year / Reality location
5. animal breed / body size
6. wheelchair model dimensions
7. 朔夜座 final form scale
8. 飲酒 / 喫煙CharacterのFinal adult / era legality

それまでは:

> **relative lineup + Core5 distinct-era invariant**

をCharacter master生成の上流として使う。