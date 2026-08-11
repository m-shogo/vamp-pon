# ヨルノシルベ — World Setting Expansion Index v1

Date: 2026-08-11  
Status: **CURRENT EXPANSION ROUTER / P0-P2 COVERAGE INDEX / RUNTIME NOT AUTO-PROMOTED**

> ユーザー指定の不足32項目を、孤立したメモではなく相互参照できる正本候補群へ接続する。

---

# 1. Read order

```txt
docs/CANON.md
↓
docs/world-foundation-authority-v1.md
↓
P0 world structure
↓
P1 lived world / character interior / story delivery
↓
P2 visual / prop / audio / localization / merch
```

---

# 2. P0 coverage

| Requested area | Current expansion source | State |
|---|---|---|
| Institution Map | `world-institution-faction-map-v1.md` | COVERED v1 |
| Faction Map | `world-institution-faction-map-v1.md` | COVERED v1 |
| Geography / Travel Atlas | `world-geography-travel-atlas-v1.md` | COVERED v1 |
| Knowledge / Secret Matrix | `world-knowledge-secret-matrix-v1.md` | COVERED v1 |
| Historical Incident Ledger | `world-historical-incident-ledger-v1.md` | COVERED v1 / incidents Candidate |
| Life / Death / Injury | `world-life-death-injury-rulebook-v1.md` | COVERED v1 |
| Sakumei Operational Bible | `sakumei-operational-bible-candidate-v1.md` | COVERED Candidate |
| Mystery / Foreshadow / Payoff | `world-mystery-foreshadow-payoff-ledger-v1.md` | COVERED v1 |
| Height / Age / Era Lineup | `character-height-age-era-lineup-v1.md` | COVERED relative / exact pending |

---

# 3. P1 coverage

| Requested area | Current expansion source | State |
|---|---|---|
| Family / Household Atlas | `character-family-household-atlas-v1.md` | COVERED v1 / major family facts open |
| Civilian Life Bible | `world-civilian-society-bible-v1.md` | COVERED v1 |
| World Economy | `world-civilian-society-bible-v1.md` | COVERED v1 / multi-era relative economy |
| Local Food / Culture | `world-civilian-society-bible-v1.md` | COVERED v1 |
| Calendar / Festival / Ritual | `world-civilian-society-bible-v1.md` | COVERED v1 / rituals Candidate |
| Religion / Belief / Funeral | `world-civilian-society-bible-v1.md` | COVERED v1 / metaphysics guarded |
| Rumor / Media / Reputation | `world-civilian-society-bible-v1.md` | COVERED v1 |
| Language / Slang | `world-civilian-society-bible-v1.md` | COVERED v1 / slang Candidate |
| Medicine / Care / Recovery | `world-civilian-society-bible-v1.md` + `world-life-death-injury-rulebook-v1.md` | COVERED v1 |
| Desire / Need / Lie / Shame | `character-interior-social-dynamics-bible-v1.md` | Current21 21/21 |
| Character Secret Inventory | `character-interior-social-dynamics-bible-v1.md` + `world-knowledge-secret-matrix-v1.md` | pressure 21/21 / major secrets open |
| Recurring Gag Bible | `character-interior-social-dynamics-bible-v1.md` | COVERED v1 |
| Iconic Quote / Callback Bank | `character-interior-social-dynamics-bible-v1.md` | function bank v1 / exact voice pending |
| Mentor / Rival / Successor | `character-interior-social-dynamics-bible-v1.md` | COVERED v1 |
| Episode / Chapter Engine | `story-episode-emotional-engine-v1.md` | COVERED v1 |
| Cliffhanger Library | `story-episode-emotional-engine-v1.md` | COVERED v1 |
| Quiet / Breather Episode Plan | `story-episode-emotional-engine-v1.md` | 8 seeds + rules |
| Emotional Temperature Map | `story-episode-emotional-engine-v1.md` | COVERED v1 |

---

# 4. P2 coverage

| Requested area | Current expansion source | State |
|---|---|---|
| Environment Visual Bible | `world-production-expression-bible-v1.md` | COVERED v1 |
| Prop Master Book | `world-production-expression-bible-v1.md` | COVERED framework / individual masters next |
| Audio / Leitmotif Bible | `world-production-expression-bible-v1.md` | COVERED direction / composer detail pending |
| Localization Guide | `world-production-expression-bible-v1.md` | COVERED v1 |
| Merch Scene Matrix | `world-production-expression-bible-v1.md` | COVERED v1 |

---

# 5. Cross-cutting source

`franchise-content-gap-audit-v1.md`

役割:
- popular long-running IPで厚い資料カテゴリとの差分監査
- 何を作るべきかのWhy

上記各Bibleはその監査を**実際のヨルノシルベ設定へ落としたもの**。

---

# 6. Sakumei routing

```txt
Early observer identity
  yatsukageIdentitySource.ts (Current)
      ↓
User-approved redesign Candidate
  sakumei-antagonist-organization-candidate-v1.md
      ↓
Operational detail
  sakumei-operational-bible-candidate-v1.md
      ↓
Machine-readable candidate
  src/game/data/sakumeiCandidateSource.ts
```

Human review前に既存Yatsukage runtime namespaceを削除しない。

---

# 7. Character master routing

画像原本制作前に読む:

```txt
Character Canon / Deep Core
↓
character-appearance-source-book-v1.md
↓
character-height-age-era-lineup-v1.md
↓
character-interior-social-dynamics-bible-v1.md
↓
character-family-household-atlas-v1.md
↓
world geography / institution / civilian society
↓
Candidate master art
↓
Human Review
```

画像都合から設定へ逆流しない。

---

# 8. What is intentionally still open

「全部埋める」ことと「全部Canon化する」ことを分ける。

Human decisionを残すもの:

- 夜の最終正体
- 黒インク最終起源
- 星獣完全Mechanism
- 死者がNightへ本人として現れるか
- exact Reality years / locations
- Core5等の実親 / sibling / spouse / children
- Current主要人物のPermanent death
- exact character heights
- Sakumei founder / mastermind / true names
- Canon romance
- exact festival / religion adoption

これらがOPENなのは欠陥ではなく、上流矛盾を防ぐための意図的な保留。

---

# 9. Next depth pass

v1で32項目の構造と主要detailを揃えた。

次は新しいカテゴリを増やさず、以下を**一人 / 一地域 / 一事件ずつ深くする**。

1. Current21 household evidence
2. Current21 exact era evidence
3. Historical incidentsをStage20へ配置
4. Knowledge Matrixを420 Affinity / 168 enemy relationsへ接続
5. Sakumei8 interior fields / visual master contract
6. Tier S/A propsのindividual master
7. Environment culture zoneのvisual source sheets
8. Core5 character image master final production

---

# 10. Quality rule

今後、新設定を足すだけで本Indexのカテゴリを増やさない。

まず:
- 既存sourceに入るか
- 既存Characterを深くできるか
- existing Stage / Object / relationへ繋がるか

を確認する。

**広げるより、繋いで深くする。**