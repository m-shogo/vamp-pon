# ヨルノシルベ — 朔夜座 Current Identity v1

Date: 2026-08-11  
Status: **CURRENT FORMAL IDENTITY / USER-DECIDED / LEGACY ASSETS PRESERVED**

> 最上位: `00-current-story-world-master.md`。
> 旧八影 / 旧朔盟資料を捨てず、Current player-facing identityを朔夜座へ一本化するためのmigration authority。

---

# 1. Current formal name

# **朔夜座**

読み: **さくやざ**

Status: `DECIDED`

Current 8member assets:

1. ナシロ
2. アサトジ
3. ミチグレ
4. オリネ
5. ハクマ
6. ツグリ
7. ユラネ
8. ペタ

---

# 2. Naming migration

```txt
八影
= early observer label

朔盟
= superseded redesign candidate / authored asset namespace

朔夜座
= Current formal identity
```

Rules:

- 八影のexisting IDs / relationsを削除しない。
- 朔盟資料の思想 / pair / operational detail / fan attachment / visual candidateを捨てない。
- 旧doc filenameを理由に「朔盟」をCurrent formal nameへ戻さない。
- runtime ID renameは別migrationで必要性を判断する。

---

# 3. 「座」のbrand

`座`は朔夜座側の固有brandとして扱う。

群青残響録 / 大事件中心人物群へ:

- ○○座
- 五○座
- 時代○座

のように流用しない。

朔夜座という名前と、Dream最深部で月が消える**朔夜**のvisual connectionを育てる。

ただし:

> 朔夜座がDreamの月を作った / 消している

とは現時点でCanon化しない。

---

# 4. 8人の既存強みを維持

旧朔盟deep-profile資産から保持する:

| member | Primary attachment lane |
|---|---|
| ナシロ | 倫理の揺らぎ / identity mystery |
| アサトジ | 優しい行動が暴力になる悲哀 |
| ミチグレ | 静かな圧倒感 |
| オリネ | recurring rival / transformation |
| ハクマ | uncanny minimalism / silence |
| ツグリ | 善意100%の職人気質の怖さ |
| ユラネ | 理解できる誘惑 / quiet comfort |
| ペタ | 愛着 → sudden horror |

全員を同じ黒服 / 仮面 / 厨二口調へ均さない。

---

# 5. 思想資産の扱い

旧朔盟で作った:

> 本人のために「正解」を先に固定してしまう

という思想群は高価値資産として残す。

ただし「朔夜座全員が完全に同じ一文へ署名した組織」という旧Operational detailまで自動Canon化しない。

Currentで強く残す:

- 各memberは別理由 / 別fearを持つ
- 善意 / 保護 / 訂正が他者の選択権を奪う
- member同士にも考え方の差がある
- pair登場で能力だけでなく思想が衝突する
- 一人でも主要敵Characterとして成立する

---

# 6. Organization structure — exact form remains open

Current formal identityは8人を一つの主要敵laneとして扱うが、以下はまだHuman decision前にLOCKしない。

- Founder
- absolute leader
- exact recruitment ritual
- 全員共通のorigin
- 全員共通のspecies
- 一人のCreator
- permanent headquarters

Legacy Pair Mission Ruleは**高価値Operational Candidate**として保持するが、名前変更だけでfinal Canonへ自動昇格しない。

---

# 7. 群青残響録との関係

固定上下関係はない。

Era / Incidentごとに:

- 協力
- 利用
- 利用される
- 対立
- 妨害
- 止めようとする
- 一時的に目的一致
- 個人だけ関与

を変えられる。

禁止:

- 群青残響録 = 朔夜座のBoss集団
- 朔夜座 = 群青残響録の部下
- 同じCreatorの二階級組織

---

# 8. Moonless / 朔夜 connection

事件深度が最深部へ達した時、月が完全に消える局面を**朔夜**としてvisual identityに使える。

そこでは:

- 星
- ランタン
- 焚き火
- 街灯
- Character light
- 星獣

が際立つ。

朔夜座memberの重要encounterを朔夜へ置くことはできるが、**毎回必ず8人の誰かがBossになるruleではない**。

---

# 9. Character master migration

最終画像原本前に8人それぞれ:

- face
- eye architecture
- hair
- body / height band
- posture
- clothing construction
- colors
- silhouette
- signature prop
- hand / footwear language
- damage / wear
- expression range
- combat motion
- pair contrast

を固定する。

旧朔盟candidateの欠円symbolは**reuse candidate**。

朔夜座正式化によって自動採用とはしない。Visual Reviewで最終判断する。

---

# 10. Machine source

Current identity:
- `src/game/data/storyWorldMasterSource.ts`
- `src/game/data/sakumeiCandidateSource.ts` → `SAKUYAZA_CURRENT_IDENTITY`

Legacy authored member data:
- `sakumeiCandidateMembers`

runtimeAutoPromotionAllowed = false。

---

# 11. Completion boundary

朔夜座Current identityは決定済み。

未完了:

- 8人Final Character Master
- exact organization origin
- Founder / leader
- true names / Reality identities
- final common symbol
- runtime/UI wording migration
- Human visual approval

名称決定とFinal Visual完成を混同しない。
