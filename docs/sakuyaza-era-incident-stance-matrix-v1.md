# ヨルノシルベ — 朔夜座 × Era Incident Stance Matrix v1

Date: 2026-08-11  
Status: **CURRENT HIGH-VALUE STANCE DESIGN / EXACT PRESENCE & OFFICIAL MISSION OPEN**

Upstream:

1. `docs/00-current-story-world-master.md`
2. `docs/sakuyaza-current-identity-v1.md`
3. `src/game/data/sakumeiCandidateSource.ts`
4. `docs/era-major-incident-family-lens-atlas-v1.md`
5. `docs/era-incident-evidence-supporting-cast-matrix-v1.md`
6. `src/game/data/seasonArchitecture.ts`

> 目的: 朔夜座8人を「Eraごとに出てくる同じ敵軍団」にせず、
> 各大事件の**善意 / fear / system pressure**へ、それぞれ違う立場で反応させる。
>
> このMatrixは思想・Story functionの設計。
> **各memberがそのReality事件に直接いたこと、公式朔夜座任務だったこと、pairが固定teamであることは確定しない。**

---

# 0. Hard rules

## Presence != stance

`STANCE`は:

> もしその事件へ関わるなら、そのmemberの既存fixationがどちらへ傾くか

を示す。

したがって:

- `stance exists` != `Reality witness`
- `stance exists` != `combat Boss`
- `stance exists` != `official Sakuyaza mission`
- `pair candidate` != `permanent pair`

## Member remains individual

朔夜座全員が同じ結論になる必要はない。

同じincidentでも:

- strict systemへ協力
- systemの行き過ぎを止める
- victimを守る
- evidenceを隠す
- classificationを強める
- temporary closureだけ支持
- 一切関与しない

が同時に成立する。

## Existing attachment lanes stay intact

- ナシロ = 倫理の揺らぎ / identity mystery
- アサトジ = 優しい行動が暴力になる悲哀
- ミチグレ = 静かな圧倒感
- オリネ = recurring rival / hidden meaning / transformation
- ハクマ = uncanny minimalism / silence
- ツグリ = 善意100%の職人気質の怖さ
- ユラネ = 理解できる誘惑 / quiet comfort
- ペタ = 愛着 → sudden horror

事件の都合で全員を同じ「悪役口調」にしない。

---

# 1. Stance vocabulary

- `PRIMARY_RESONANCE` — memberのCoreと事件のsingle-answer failureが強く共鳴
- `SECONDARY_RESONANCE` — 事件の一部に強く反応
- `COUNTER_RESONANCE` — 同じmemberの善意が、事件systemの暴走を止める側へ出る
- `AMBIVALENT` — support / opposition両方が自然
- `LOW_PRIORITY` — この事件では他memberの方が自然

Action direction Candidate:

- `ALIGN_TEMPORARILY`
- `TIGHTEN_RULE`
- `PROTECT_EXCEPTION`
- `HIDE_RISK`
- `BLANK_AMBIGUITY`
- `REPAIR_SYSTEM`
- `CLOSE_TEMPORARILY`
- `KEEP_ASLEEP_OR_AT_REST`
- `RELABEL`
- `REMOVE_ROUTE`
- `OBSERVE`
- `OPPOSE_PERMANENCE`

Exact action remains Open。

---

# 2. ERA-INC-TOMORI-01 — 空欄世帯事件

Core problem:

> fair distribution ledgerが、recordに追いつかない生活者をeligibility外へ落とす。

## ツグリ — PRIMARY_RESONANCE

Existing fixation:

> 壊れているなら直せばいい。

Likely initial position:

- damaged house / tool / distribution workflowを直す。
- ledger mismatchも「壊れたrecord」と見なす。

Danger:

> personの複雑なhousehold historyまで「正しい形へ修理」し始める。

Strong scene:

- torn household pageを完璧に直す。
- しかし元のmistakeまで綺麗に保存してしまう。

Attachment payoff:

> 善意100%。だから怖い。

## アサトジ — PRIMARY_RESONANCE

Fixation:

> 失うくらいなら閉じればいい。

Initial support:

- scarce goodsを「確認できるまで保留」する。
- theft / double allocationを防ぐためtemporary holdを支持。

Danger:

> “一時保留”に解除条件を置かず、必要な人まで永久に待たせる。

Conflict with Tomori:

> 守っている間に壊れる物 / 人もある。

## ペタ — SECONDARY_RESONANCE

Fixation:

> 間違いなら正しい札を貼ればいい。

Possible action:

- household / parcel / supplyへ`確認済み` `未確認` `対象外`等の札を貼る。

Danger:

- 状況が変わっても古い札を剥がさず、新しい札を上に貼る。
- label stackが本人より強くなる。

## ナシロ — AMBIVALENT

Possible support:

- same person / same householdをduplicateしないためname normalizationを支持。

Possible opposition:

- ledger上の名前が本人の生活関係を上書きし始めると反発できる。

ナシロは単純なstrict bureaucracy担当にはしない。

## ユラネ — COUNTER_RESONANCE

- queue / scarcityで疲弊した人を休ませたい。
- temporary shelter / careへ寄る。

Danger:

- 「今日はもう考えなくていい」が長期化すると、appeal / actionを弱くする。

## ミチグレ / オリネ / ハクマ — LOW〜SECONDARY

- ミチグレ: distribution route最適化へ寄る余地。
- オリネ: household事情をprotectするためhidden fieldを作る余地。
- ハクマ: unclear entryをblankへ戻す誘惑。

このIncidentで全員出す必要はない。

## Incident pair candidate

### アサトジ × ツグリ — `FIX_AND_LOCK`

Why strong:

```txt
壊れたrecordを直す
+
直した状態を守るため閉じる
```

→ **正しく直した後、誰も変更できなくなる。**

Status:

`INCIDENT_PAIR_CANDIDATE / OFFICIAL_MISSION_NOT_FROZEN`

ペタはpair外からlabelを重ねるpersonal actionでも強い。

---

# 3. ERA-INC-MICHIRU-01 — 一本線計画事件

Core:

> city improvementのpriority routeが、route外生活をinvisible costへする。

## ミチグレ — PRIMARY_RESONANCE

Fixation:

> 間違う道なら消せばいい。

This incident is a natural high point。

Initial support:

- duplicate / dangerous / inefficient routeを整理。

Danger:

- low-volume side routeを“間違い”として消す。
- 最後にはemergency detour / local return routeまで消す。

Strong visual:

> mapから一本ずつ線が消え、最も太い一本だけ残る。

## ツグリ — PRIMARY_RESONANCE

Position:

- cityを“壊れた機械”のようにrepairする。
- infrastructure defectを綺麗に直す。

Danger:

- messy local adaptation / old route / informal accessをdefect扱い。

## ユラネ — COUNTER_RESONANCE

Position:

- noise / health / exhaustionを見て、成長速度を落としたい。

This can put Yurane **against** a harmful part of the plan。

Danger:

- 「休ませるため止める」が、街そのものを停滞固定へ向ける。

“朔夜座だから開発推進側”の単純化を崩せる。

## アサトジ — SECONDARY_RESONANCE

- dangerous side routeをclosureする合理性へ共感。
- temporary closureをpermanent化する危険。

## ペタ — SECONDARY_RESONANCE

- `優先路線` `廃止予定` `安全`等のlabelを貼る。
- labelが実際の変化より先に人の行動を固定。

## ナシロ / オリネ / ハクマ — LOW〜AMBIVALENT

- ナシロ: district naming / boundary normalization。
- オリネ: pollution / health infoを“混乱防止”で隠す誘惑。
- ハクマ: conflicting resident explanationをblankにする誘惑。

## Incident pair candidate

### ミチグレ × ツグリ — `ONE_CORRECT_CITY`

```txt
間違う道を消す
+
残った道 / cityを綺麗に直す
```

Result:

> perfect-looking city with no detour。

Status:

`INCIDENT_PAIR_CANDIDATE / NOT_PERMANENT_TEAM`

---

# 4. ERA-INC-NAGI-01 — 安心共有名簿事件

Core:

> warning copies spread faster than correction。

S1 stronger focus: **オリネ / ハクマ / ペタ / ナシロ**側のSeason toneと相性が良い。

## オリネ — PRIMARY_RESONANCE

Fixation:

> 危険な意味は隠せばいい。

Initial benefit:

- exposed personal detail / harmful rumorをfold / hideする。

Danger:

- 本人のcorrection reason / contextまで隠し、外からは`problem resolved`に見える。

Strong recurrence:

- same crease position appears across forwarded documents。

## ペタ — PRIMARY_RESONANCE

This is one of Petta's strongest incidents。

- `注意`
- `訂正済み`
- `安全`
- `対象外`

の札を上書きする。

Danger:

> old label stays under new label; both circulate。

Comedic entry:

- everyone laughs at Petta labeling cups / boxes。

Horror payoff:

- later same gesture labels a person。

## ハクマ — PRIMARY_RESONANCE

Fixation:

> 誤解されるくらいなら意味を消せばいい。

Possible stance:

- conflicting warning recordを削除 / blank化。

Danger:

- false warningだけでなく、本人のobjection / explanationも消える。

This is not Petta repetition:

- Petta = wrong infoへnew label
- Hakuma = ambiguityごとblank

## アサトジ — SECONDARY_RESONANCE

- safetyのためaccount / accessをtemporarily close。
- deadlineなしならpermanent exclusionへ。

## ナシロ — AMBIVALENT / HIGH

- impersonation対策にはcorrect nameが必要。
- wrong identity warningが本人より長く残ることを最も嫌う。

Thus Nashiro can:

> strict identification sideを支持した後、stale copied nameへ強く反対する。

倫理の揺らぎを出せる。

## ミチグレ / ツグリ / ユラネ — SECONDARY〜LOW

- ミチグレ: unsafe access route removal。
- ツグリ: corrupted list repair。
- ユラネ: reputationから逃げるため“もう見なくていい”誘惑。

## Incident pair candidate

### オリネ × ペタ — `HIDE_AND_RELABEL`

```txt
危険なcontextを折り畳む
+
外側へ新しい正解label
```

Result:

> problemが見えなくなり、表面だけ“訂正済み”。

Status:

`INCIDENT_PAIR_CANDIDATE`

Hakumaは別個にblankingする方がCharacter差が強い。

---

# 5. ERA-INC-YUI-01 — 消えたSOS事件

Core:

> fake / duplicate対策でverified feedが有効になるが、unverified true SOSがtrusted attentionから落ちる。

## ペタ — PRIMARY_RESONANCE

Modern equivalent of label power。

- `verified`
- `official`
- `resolved`
- `duplicate`

Petta visually loves badges / stamps / labels。

Danger:

> badgeが内容を読む代わりになる。

Strong line direction:

> 「ほら、“安全”って書いてあるよ？」

Playerが以前の日常label gagを思い出す。

## ハクマ — PRIMARY_RESONANCE

- uncertain / contradictory reportをsurfaceからblankにする。

Good purpose:

- misinformation overloadを減らす。

Danger:

> uncertaintyを消すためSOSそのものを消す。

Pettaとの違い:

- Petta = positive / negative label
- Hakuma = silence / absence

## ナシロ — HIGH AMBIVALENCE

- impersonation / fake official accountにはstrict verificationを支持。
- しかしaccount name / official identityがpersonのReality voiceを上書きするなら反対。

Yuiとの倫理battleに向く。

## ユラネ — COUNTER_RESONANCE

- crisis後、panic / exhaustionから人を休ませる。
- care sceneでは一時的allyにすらなれる。

Danger:

> 「もう見なくていい / 休んでいい」が、unresolved requestから目を逸らす誘惑になる。

## オリネ — SECONDARY_RESONANCE

- harmful image / identity dataをhideする正当性。
- hide reasonが本人にも見えないとaccountabilityを失う。

## アサトジ — SECONDARY_RESONANCE

- unsafe route / channel closure。
- reopening条件が重要。

## ミチグレ / ツグリ — SECONDARY

- ミチグレ: false route removal vs alternative rescue route loss。
- ツグリ: broken feed repair vs “全部正常化”の危険。

## Incident pair candidate

### ハクマ × ペタ — `BLANK_AND_BADGE`

```txt
uncertain reportをblankにする
+
残ったreportへverified label
```

Result:

> trust surfaceが綺麗になるほど、見えない人が増える。

Status:

`INCIDENT_PAIR_CANDIDATE / S1 HIGH-VALUE`

---

# 6. ERA-INC-ASA-01 — 「一人分しか通らない」事件

Core:

> fraud preventionのone-valid-continuity systemが、legitimate person branchesを一人だけvalidへ固定する。

## ナシロ — PRIMARY_RESONANCE

This is Nashiro's strongest identity incident。

Fixation:

> 名前は一つでなければならない。

Initial support:

- one credential / one identityでfraudを止める。

Danger:

- two legitimate persons share prior name/history when system demands one。

Nashiro's best question:

> 「同じ名前を二人に返したら、それは返したことになるのか？」

Do not answer immediately。

## ツグリ — PRIMARY_RESONANCE

- branching identity / copied stateを“split defect”としてrepairしたい。

Danger:

- merge / restore / normalizeがperson historiesを消す。

## アサトジ — PRIMARY / SECONDARY

- dispute中のcredential / body useをfreezeしてprotect。

Danger:

> review中の人が生活権まで失う。

## オリネ — HIGH SECONDARY

- sensitive body / memory provenanceをprotectするためhide。

Danger:

- rights claimに必要なevidenceまでfoldする。

## ハクマ — SECONDARY

- contradictory historiesをblankへ戻す。
- `unknown`を保存するShiroと強いcounterpoint。

## ペタ — SECONDARY

- `original` `copy` `valid` `revoked` label。
- small joke → existential horrorへの最大payoff候補。

## ミチグレ — SECONDARY

- branch routeを一つだけ残す。
- timeline / continuityをrouteとして扱えるが、time-travel説明にはしない。

## ユラネ — AMBIVALENT

- identity disputeで苦しむpersonへquiet escapeを与える。

Potential ally:

- forced mergeを拒む人を一時的にprotect。

Danger:

- rights fight自体から離れさせる。

## Incident pair candidate

### ナシロ × ツグリ — `ONE_NAME_ONE_REPAIRED_PERSON`

```txt
正しいidentityを一つ決める
+
branch差分をrepairする
```

Result:

> 誰もfraudできない。誰も二人でいられない。

Status:

`INCIDENT_PAIR_CANDIDATE / S1_TO_S2 BRIDGE`

Alternative candidate:

- ナシロ × アサトジ = `NAME_AND_FREEZE`

but only one pair should receive primary focus in a single arc; exact pair remains Open until episode structure review。

---

# 7. Member cross-incident identity

## ナシロ

Not simply “strict identification villain”。

Arc across incidents:

```txt
correct naming protects people
↓
wrong name persists
↓
one name cannot contain branching personhood
```

Can oppose bad records even while supporting strong identification。

## アサトジ

Across:

- ration hold
- route closure
- account access closure
- identity dispute freeze

Theme:

> temporary protection needs an exit condition。

## ミチグレ

Across:

- city route
- access route
- identity branch route

Theme:

> removing wrong routes can remove return routes。

## オリネ

Across:

- privacy
- harmful context
- sensitive provenance

Theme:

> hiding can protect; hidden reason can remove agency。

## ハクマ

Across:

- ambiguous record
- uncertain report
- conflicting identity history

Theme:

> blank protects from misinterpretation but erases rebuttal too。

## ツグリ

Across:

- repair object / record
- repair city
- repair feed
- repair person branch

Theme:

> what counts as “broken” and who gets to decide repair。

## ユラネ

Across:

- scarcity exhaustion
- pollution / health
- disaster recovery
- identity dispute fatigue

Theme:

> rest is necessary; permanent escape steals tomorrow's choice。

## ペタ

Across:

- eligibility label
- route label
- warning label
- verified badge
- identity status

Theme:

> labels make the world easy to use — until everyone reads the label instead of the person。

---

# 8. Season fit

Existing Season direction:

## S1 heavier

- ナシロ
- ハクマ
- ペタ
- オリネ

Good incident fit:

- Nagi `安心共有名簿`
- Yui `消えたSOS`
- Asa identity / belonging side

## S2 heavier

- アサトジ
- ミチグレ
- ツグリ
- ユラネ

Good fit:

- Tomori `空欄世帯`
- Michiru `一本線計画`
- Asa rights / care / resource side

This is **focus weighting**, not “S1 members disappear in S2”。

All 8 can recur across Seasons。

---

# 9. Pair Mission guard

Existing 28 pair assets remain valuable。

This Matrix adds **incident-specific pair candidates** only:

- Tomori: `アサトジ × ツグリ`
- Michiru: `ミチグレ × ツグリ`
- Nagi: `オリネ × ペタ`
- Yui: `ハクマ × ペタ`
- Asa: `ナシロ × ツグリ` primary Candidate

Hard:

- no permanent pair team lock
- no pair means romance
- no pair automatically official mission
- one member alone can act personally
- official Sakuyaza mission exact rule remains separate / Open
- repeated member in multiple pair candidates is allowed because role is dynamic

ツグリ / ペタが複数Incident pairに出るのは、固定buddyではなく**fixationが複数systemへ刺さるため**。

---

# 10. Gunjo relation

朔夜座stanceと群青残響録centralityは別。

Examples:

- Sakuyaza member supports a system but is not Gunjo central person。
- Gunjo central person uses Sakuyaza idea without meeting them。
- Sakuyaza member tries to stop a Gunjo-central institution。
- same incident has multiple Gunjo candidates and multiple Sakuyaza stances。

Do not turn:

> incident antagonist = Sakuyaza member = combat Boss = Gunjo member

into a default equivalence。

---

# 11. Evidence use

Member stance should appear through action / object, not speech manifesto every time。

Examples:

- ペタ's layered stickers
- オリネ's crease
- ハクマ's blank card
- ツグリ's repair seam
- ミチグレ's erased route line
- アサトジ's clasp / closure
- ナシロ's aligned name tags
- ユラネ's quiet rest space

These can become Evidence but:

> symbol/object alone does not prove official Sakuyaza mission。

---

# 12. Human lock boundary

This Matrix can be Current Story Design while exact event appearance remains Open。

Before locking one member into one Reality incident, review:

1. Character exact Reality identity / Era if needed
2. direct vs Dream-only appearance
3. official mission vs personal action
4. pair mission status
5. Gunjo relation
6. combat Boss role
7. Season pacing
8. not repeating another member's attachment lane

---

# 13. Completion definition

- 8/8 members retain distinct attachment lane
- 5/5 Era incidents have differentiated Sakuyaza stance set
- all five incidents have at least one member who can **oppose or mitigate** part of the harmful system
- Sakuyaza is not one ideological block
- S1/S2 focus matches existing Season Architecture without hard separation
- 5 incident pair candidates exist but permanent pair count stays 0
- exact official mission count stays 0
- exact Reality presence stays Open
- Gunjo membership stays Open
- combat Boss stays separate
- runtime auto-promotion remains forbidden
