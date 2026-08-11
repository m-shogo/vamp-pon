# ヨルノシルベ — World Setting Conflict Register v1

Date: 2026-08-11  
Status: **CONTRADICTION CONTROL / ZERO UNRESOLVED BLOCKERS / HUMAN DECISIONS EXPLICITLY OPEN**

> 目的: 設定が増えた結果、「別資料では違うことを言っている」「Candidateがいつの間にかCanonになった」を防ぐ。
> `OPEN_HUMAN` は欠陥ではない。高影響の答えを意図的に保留している状態。

---

# 1. Status vocabulary

- `GUARDED` — 上流ruleで衝突を防止済み。
- `OPEN_HUMAN` — 複数案が成立し、Human decisionまで確定しない。
- `CANDIDATE_DEPENDENT` — 別Candidateが確定した時だけ決まる。
- `UNRESOLVED_BLOCKER` — 現在の資料同士が両立しない。**0件を維持する。**

---

# 2. Current conflict register

## CF-001 — Current21の時代
Status: `GUARDED`

Potential conflict:
全員が同じ夜で会うため、現実でも同時代と誤認しやすい。

Resolution:
- 現実では同時代とは限らない。
- Nightでだけ関係が生まれる。
- age impressionとeraを別dataにする。

Sources:
- `CANON.md`
- `world-foundation-authority-v1.md`
- `character-height-age-era-lineup-v1.md`

---

## CF-002 — 夜の最終正体
Status: `OPEN_HUMAN`

Potential conflict:
地理・社会・医療を具体化するとNight=夢 / 記憶世界等を暗黙に確定しやすい。

Guard:
- L4 Unknown Mechanismを別Layerに隔離。
- Society / GeographyはNightの現象を記述してもOriginを説明しない。

Human decision candidates:
- dream
- virtual
- memory
- shared mental layer
- hybrid original layer

---

## CF-003 — Game Over / Death
Status: `GUARDED`

Potential conflict:
戦闘不能・retryを死亡 / 蘇生と書く。

Resolution:
- Game Over ≠ Reality death。
- Retry ≠ resurrection。
- `DOWNED` / `LOST_FROM_ROUTE` と `DEAD`を別語彙にする。

---

## CF-004 — 死者がNightへ現れるか
Status: `OPEN_HUMAN`

Potential conflict:
Historical deathを増やすと死後世界へ自動変換される。

Guard:
- 生者のみ / 過去時点の本人 / 記録残響の3案を維持。
- Family / Incident側から決めない。

---

## CF-005 — 八影 vs 朔盟
Status: `GUARDED`

Potential conflict:
既存八影sourceでは「factionではない」、新案では朔盟が組織。

Resolution:
```txt
八影 = EARLY_OBSERVER_LABEL
朔盟 = REVEALED_ANTAGONIST_PACT_CANDIDATE
```

八影資料は**Reveal前にCurrent側が正しく観測できた範囲**として生かす。
既存`yatsukage*` namespace / 28pair / 168relationsを削除しない。

---

## CF-006 — Shadow5 vs 朔盟
Status: `GUARDED`

Potential conflict:
どちらもCore5へ別解を返すため同じ敵勢力に見える。

Resolution:
- Shadow5 = Current人物の思想的ライバル。
- 朔盟 = Wrong Reading側の主要enemy pact Candidate。
- 自動的な所属 / 上下 / 創造者関係を作らない。

---

## CF-007 — 朔盟のFounder / Leader
Status: `OPEN_HUMAN`

Potential conflict:
敵組織らしさを出すため絶対首領を後付けし、8人の主体性を失う。

Guard:
- Pair Mission Ruleでleaderなしでも運営可能。
- founder / first witnessは未LOCK。

Human consultation前に「実はラスボスが全員を作った」を追加しない。

---

## CF-008 — Stage20の地理
Status: `GUARDED`

Potential conflict:
Stage orderを現実の隣接順 / 一つの都市地図とみなす。

Resolution:
- Stage ID / gameplay orderは維持。
- Reality AtlasとNight Atlasを分離。
- Night distanceはNEAR / TRAVEL / DISCONTINUOUS。

---

## CF-009 — Historical IncidentとCurrent人物
Status: `GUARDED`

Potential conflict:
世界史を厚くするため「実は全員同じ大事故に関係していた」になる。

Resolution:
- direct witness目安0–3。
- exact Current family casualtiesをHuman Review前にLOCKしない。
- official record / witness / evidenceを分離。

---

## CF-010 — Game economy vs World economy
Status: `GUARDED`

Potential conflict:
記憶片 / meta currencyが現実の給料・家賃にも使われる。

Resolution:
- Gameplay resourceとReality moneyは別。
- 多時代なので具体価格ではなくrelative bandを先に使う。

---

## CF-011 — Religion / Belief vs Main Mystery
Status: `GUARDED`

Potential conflict:
地域の星信仰を設定した結果「星獣は死者の魂」がCanon化される。

Resolution:
- belief / rumorは世界内認識。
- metaphysical truthではない。
- 実在宗教と独自cosmologyを無断混成しない。

---

## CF-012 — Character family設定
Status: `OPEN_HUMAN`

Potential conflict:
深み目的で孤児 / 親死亡 / 虐待 / 血縁Mysteryを乱造する。

Guard:
- Current21はhomeAnchorまで詰め、重大家族factはOPENを許容。
- リツ×コヨリ等既存Canonのみhard保持。

Human decision対象:
- 実親 / 養親
- sibling追加
- spouse / child
- major family death

---

## CF-013 — Character exact height / chronological age / exact era
Status: `OPEN_HUMAN`

Potential conflict:
画像生成ごとにcmを再発明し、後からCanon扱いする。

Guard:
- relative band / candidate rangeをproduction inputにする。
- exact cm / age / yearはHuman visual/story review後。

---

## CF-014 — 黒耀化 vs 精神疾患 / 洗脳
Status: `GUARDED`

Potential conflict:
黒耀化を別人格・病気・洗脳へ読み替える。

Resolution:
- 本人の長所 / 願い / 守り方の一方向過剰化。
- RecoveryはSELF-CHOICE + AFTERCARE。
- 精神疾患を怪異 / 悪役の原因にしない。

---

## CF-015 — Named Object lineage
Status: `CANDIDATE_DEPENDENT`

Potential conflict:
似たObject / motifを見つけるたび同一物へretconする。

Resolution:
- stable named-object IDsを上流にする。
- ユイのランタン×トモリの修理痕等はevidence依存。
- 「似ている」だけでsameObjectにしない。

---

## CF-016 — Future15 promotion
Status: `GUARDED`

Potential conflict:
世界設定でFuture人物を使ったためCurrent21へ昇格した扱いになる。

Resolution:
- Future15はseries pool。
- World / production Bibleに登場してもCurrent promotionではない。

---

## CF-017 — Visual Candidate vs Character Canon
Status: `GUARDED`

Potential conflict:
生成画像に偶然入った髪 / 傷 / tattoo / 身長をCharacter設定へ逆輸入する。

Resolution:
```txt
Character life / identity
→ Appearance Source
→ Height/Era Lineup
→ prompt
→ Candidate art
→ Human Review
→ Approved Reference
```

画像都合から上流Canonへ逆流しない。

---

## CF-018 — P2 expression vs gameplay runtime
Status: `GUARDED`

Potential conflict:
Environment / Audio / Prop設定を追加しただけでUnity実装済み扱いにする。

Resolution:
- World Setting sourcesは`runtimeAutoPromotionAllowed=false`。
- Existing runtime / U49 / TOP approval boundaryは別。

---

# 3. Current summary

```txt
GUARDED              = 12
OPEN_HUMAN           = 5
CANDIDATE_DEPENDENT  = 1
UNRESOLVED_BLOCKER   = 0
```

OPEN_HUMAN:
- 夜の最終正体
- 死者がNightへ本人として現れるか
- 朔盟Founder / Leader
- Current主要人物の重大Family設定
- exact height / chronological age / exact era

---

# 4. Rule for future additions

新案が既存ruleと衝突した場合:

1. 古い資料を黙って上書きしない。
2. `UNRESOLVED_BLOCKER`として本Registerへ追加。
3. 既存Canon / User Direction / Candidateを確認。
4. 安全に導出できなければHuman consultation。
5. 解決後に`GUARDED`へ変更。

`UNRESOLVED_BLOCKER > 0`のままfinal Canon / character master productionへ進めない。