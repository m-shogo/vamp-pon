# ヨルノシルベ — Era Incident Evidence × Supporting Cast Matrix v1

Date: 2026-08-11  
Status: **CURRENT STORY DESIGN / SUPPORT ROLES DERIVED / DIRECT REALITY CAST KEPT MINIMAL / FUTURE15 NOT PROMOTED**

Upstream:

1. `docs/00-current-story-world-master.md`
2. `docs/era-major-incident-family-lens-atlas-v1.md`
3. `docs/world-historical-incident-ledger-v1.md`
4. `docs/character-reality-root-registry-v1.md`
5. `docs/cross-era-lineage-reveal-map-v1.md`
6. `src/game/data/currentRelationshipInventory.ts`
7. `src/game/data/seasonArchitecture.ts`

> 目的: 5つのEra大事件へ脇役を大量に「現場にいたこと」にせず、
> **Reality lead / Dream responder / evidence interpreter / later-series candidate**を分離して、既存Character関係を事件の意味へ接続する。

---

# 0. Hard separation

## Reality direct involvement

Currentで名前付き直接Reality当事者として確定してよいのは、まず**各Era leadのCore5本人だけ**。

```txt
Tomori incident  -> Tomori
Michiru incident -> Michiru
Nagi incident    -> Nagi
Yui incident     -> Yui
Asa incident     -> Asa
```

Other Current21 / Future15は、このMatrixだけを理由に:

- 同じReality Eraだった
- 同じ学校 / 会社 / 地域にいた
- direct witnessだった
- victimだった
- incident operatorだった

とは確定しない。

必要なら後で:

`CANDIDATE_DIRECT_REALITY`

へ上げ、Era / age / origin / mobility / family / occupationを検査する。

## Dream support

DreamではEraを跨いで会えるため、脇役は安全に:

- `DREAM_RESPONDER`
- `DREAM_EVIDENCE_INTERPRETER`
- `DREAM_ARGUMENT_COUNTERPOINT`
- `OBJECT_OR_PLACE_LEGACY`

として事件Themeへ参加できる。

## Future15

Future15のsupport assignmentは:

> **series reservoir usage candidate**

であり、Current21 / playable / Title1 mandatory登場への昇格ではない。

---

# 1. Evidence grammar

全Incidentは最低4層を分離する。

## A. OFFICIAL RECORD

制度側が残す。

例:
- ledger
- policy
- master plan
- warning list
- feed audit
- identity credential history

**official != omniscient truth**。

## B. WITNESS VERSION

人が経験したこと。

- child statement
- parent explanation
- clerk memo
- driver note
- phone call
- family testimony

Memory may be incomplete / emotional / later reinterpreted。

## C. PHYSICAL / DIGITAL EVIDENCE

- object
- corrected paper
- map
- fax
- cached message
- tool repair seam
- credential provenance

物も意味を自動説明しない。

## D. LATER INTERPRETATION

後世 / Dreamで別Characterが読む。

Later interpretation can be wrong first.

> **Evidenceがある = すぐ正解が分かる**

にはしない。

---

# 2. ERA-INC-TOMORI-01 — 空欄世帯事件

## Reality lead

### トモリ

Role: `REALITY_ERA_LEAD`

Current certainty:

- 同Eraで事件へ直接関わる。
- exact roleはOpen。

Possible exact role candidates later:

- repair / housing support side
- household member affected by record lag
- local distribution support
- witness to exception handling

**被害者固定はまだしない。**

## Dream supporting Current21

### リツ — `DREAM_ARGUMENT_COUNTERPOINT`

Use:

- 「公平に分ける」ことを強く理解する。
- だからこそ人数countの必要性も擁護できる。
- コヨリを守る責任から「例外を認めろ」だけでは済まない。

Relationship hooks:

- `ritsu-koyori`
- `kaname-ritsu`

### コヨリ — `DREAM_CHILD_LENS`

Use:

- 同じ家で寝ているのにrecord上別扱い、という矛盾を単純な疑問で捉える。
- child = author truth speakerにはしない。

Relationship hook:

- `sen-koyori`

### ハナ — `DREAM_HOUSEHOLD_MEMORY_INTERPRETER`

Use:

- 保存 / 食 / household memory。
- 「台帳にない人」を家庭側がどう覚えていたかを見る。
- older adult = 正解の昔語りにはしない。

Hooks:

- `hana-tsumugi`
- `hana-shiro`

### カナメ — `DREAM_CARE_AND_CARRYING_COUNTERPOINT`

Use:

- 誰かを全部自分で背負うのではなく、制度へ渡す責任を考える。
- emergency provisionとfinal eligibility分離のThird Optionに相性が良い。

Hook:

- `kaname-ritsu`

### ツムギ — `DREAM_REPAIR_TRACE_INTERPRETER`

Use:

- repaired bag / fixture / seamから「同じ物を別の人が使っていた」ことを見る。
- repair traceを血縁証明にはしない。

Hooks:

- `tomori-tsumugi`
- `shiro-tsumugi`
- `hana-tsumugi`

### シロ — `DREAM_ARCHIVE_INTERPRETER`

Use:

- corrected ledger / blank fieldを「未分類のまま残す」。
- unknownを消さない。

Hooks:

- `sen-shiro`
- `hana-shiro`
- `shiro-tsumugi`

### ユイ — `DREAM_CROSS_ERA_RECORD_ECHO`

Use:

- Presentの`unverified != false`と、Postwarの`unrecorded != nonexistent`を比較する。
- 同じ事件だとは言わない。

Hook:

- `yui-tomori`

## Future15 series candidates

### レンジ

Role: `FUTURE_SERIES_CRAFT_LEGACY_CANDIDATE`

- 師弟 / 手仕事が何世代で変わるか。

### トウマ

Role: `FUTURE_SERIES_CRAFT_INHERITANCE_CANDIDATE`

- Tomori ancestor Candidateとは別に、**職人技は血で決まらない**ことを事件側でも見せる。

### ヒヨリ

Role: `FUTURE_SERIES_HOUSEHOLD_SOCIAL_CANDIDATE`

- 人を肯定する速度と、制度上「その人を数えられるか」の差。

## Evidence pack

### Official

- `E-TOMORI-O1` 共同配給整理簿revision
- `E-TOMORI-O2` provisional / denied allocation slip Candidate
- `E-TOMORI-O3` exception-handling instruction

### Witness

- `E-TOMORI-W1` child school-meal / household-count discrepancy
- `E-TOMORI-W2` local clerk oral exception memo
- `E-TOMORI-W3` household / neighbor statement

### Physical

- `E-TOMORI-P1` corrected household page
- `E-TOMORI-P2` temporary residence note
- `E-TOMORI-P3` repair tag / reused bag / fixture

### Later interpretation

- `E-TOMORI-L1` Shiro preserves blank/corrected entry
- `E-TOMORI-L2` Yui compares record visibility across Eras
- `E-TOMORI-L3` Tomori↔Yui lantern history remains **separate object chain**

## Forbidden convergence

- Nagi→Yui parent-child proofにledgerを使わない。
- Tomori→Touma ancestor Candidateをrepair traceだけで確定しない。
- Current21全員をPostwar Reality witnessへしない。

---

# 3. ERA-INC-MICHIRU-01 — 一本線計画事件

## Reality lead

### ミチル

Role: `REALITY_ERA_LEAD`

Exact:

- planner
- family moved by plan
- route user
- worker
- witness

のどれかはOpen。

## Dream supporting Current21

### ゲン — `OBJECT_OR_PLACE_LEGACY`

Use:

- old route / new route。
- 「昔の道が正しい」ではなく、何が消えたかを覚える。

Hook:
- `gen-michiru`

### トキ — `DREAM_MEASUREMENT_COUNTERPOINT`

Use:

- time / flow / scheduleを測る価値を擁護できる。
- measurement = evilにしない。
- 測られていないものをどう扱うかでMichiruとぶつかる。

Hooks:
- `michiru-toki`
- `gen-toki`
- `ren-toki`

### ネム — `DREAM_CARE_RECOVERY_COUNTERPOINT`

Use:

- “効率よく移動できる”と“休める / recoverできる”の違い。
- health / noise / access sideへ接続。

Hooks:
- `nemu-toki`
- `madoka-nemu`

### マドカ — `DREAM_OBSERVER_TO_WITNESS`

Use:

- high-level planから見えない窓 / 通学 / side routeを見つける。
- 見ただけで正解とはせず、誰へ伝えるかが必要。

Hook:
- `madoka-ren`

### レン — `DREAM_DIFFERENCE_DETECTOR`

Use:

- old/new mapの差分を検出。
- difference itselfを善悪判定しない。

Hooks:
- `madoka-ren`
- `ren-toki`

### トバリ — `DREAM_GATE_INFRASTRUCTURE_INTERPRETER`

Use:

- 入口 / 出口 / 公共交通boundary。
- “主要routeに接続されること”と“帰れること”を分ける。

Hooks:
- `yubi-tobari`
- `nagi-tobari`

## Future15 series candidates

### アマネ

Role: `FUTURE_SERIES_ACCESSIBILITY_ROUTE_CANDIDATE`

- accessibilityを「助けられる人」問題でなくroute designへ繋ぐ。

### マキ

Role: `FUTURE_SERIES_WORK_AND_DECISION_CANDIDATE`

- decisionが速い人物だからこそ、何を決定材料へ入れるかを問える。

## Evidence pack

### Official

- `E-MICHIRU-O1` integrated master plan map
- `E-MICHIRU-O2` traffic / travel-time count
- `E-MICHIRU-O3` temporary energy-saving closure memo

### Witness

- `E-MICHIRU-W1` school-route complaint / parent note
- `E-MICHIRU-W2` driver / nurse access record
- `E-MICHIRU-W3` small-shop / resident route testimony

### Physical

- `E-MICHIRU-P1` before/after paper maps
- `E-MICHIRU-P2` removed bus stop / station notice
- `E-MICHIRU-P3` measurement sheet with blank health/local fields

### Later interpretation

- `E-MICHIRU-L1` Gen old-route memory
- `E-MICHIRU-L2` Toki measurement criticism without anti-measurement conclusion
- `E-MICHIRU-L3` `INC-ROUTE-002` map revision chain

---

# 4. ERA-INC-NAGI-01 — 安心共有名簿事件

## Reality lead

### ナギ

Role: `REALITY_ERA_LEAD`

Exact involvement remains Open:

- listed person
- helper
- witness
- operator-side worker / student

Do not freeze victimhood yet.

## Dream supporting Current21

### クロオリ — `DREAM_PRIVACY_COUNTERPOINT`

Use:

- concealment can protect。
- しかし情報を隠し続けることも人を孤立させる。

Hooks:
- `yui-kuroori`
- `kuroori-yubi`

### カスミ — `DREAM_REPUTATION_AND_WAITING_COUNTERPOINT`

Use:

- wrong name / obscured reputation。
- “今は見せない”と“訂正できない”を分ける。

Hooks:
- `asa-kasumi`
- `yubi-kasumi`

### シロ — `DREAM_VERSION_INTERPRETER`

Use:

- printed versions / unknown provenance / corrected sourceを分類。
- old copyを消さず、Currentでは無効と記録する。

Hook:
- `sen-shiro`

### トバリ — `DREAM_PROTECTION_EXPIRY_COUNTERPOINT`

Use:

- gateを閉じるのは必要。
- 解除条件 /期限が必要。

Hook:
- `nagi-tobari`

### セン — `DREAM_EXPLANATION_LITERACY_COUNTERPOINT`

Use:

- 情報literacy / school ruleを「分からない人を責める説明」にしない。
- warning sourceをどう教えるか。

Hooks:
- `sen-koyori`
- `sen-shiro`

### ユウビ — `DREAM_FORWARDING_RESPONSIBILITY`

Use:

- 届けること自体が善ではない。
- “送っていい情報か”を考える。

Hooks:
- `yubi-kasumi`
- `kuroori-yubi`
- `yubi-tobari`

### ユイ — `DREAM_FAMILY_AND_PRESENT_ECHO`

Use:

- later Eraのrecord abundanceとの比較。
- Nagi→Yui親子CandidateはS1 cluesのみ。

## Future15 series candidates

### セリカ

Role: `FUTURE_SERIES_INSTITUTION_REPUTATION_CANDIDATE`

- 家 / reputation / social trustが本人より先に判断される問題。

### ヨモ

Role: `FUTURE_SERIES_MULTIPLE_NAMES_CANDIDATE`

- 複数名を持つ猫をhuman identity proofの比喩装置へしすぎない。
- “違う名でも同じ経験を持つ”というcounterpointだけ。

### スズ

Role: `FUTURE_SERIES_PRESENTATION_LABEL_CANDIDATE`

- appearance / labelから決めつけることと本人のpresentationを分ける。

## Evidence pack

### Official

- `E-NAGI-O1` central warning-list snapshot
- `E-NAGI-O2` source-policy memo
- `E-NAGI-O3` later correction notice

### Witness

- `E-NAGI-W1` forwarded e-mail chain
- `E-NAGI-W2` school / HR decision memo Candidate
- `E-NAGI-W3` person statement challenging entry

### Physical / digital

- `E-NAGI-P1` printed list with handwritten correction
- `E-NAGI-P2` fax copy missing correction page
- `E-NAGI-P3` mobile-mail header / timestamp Candidate

### Later interpretation

- `E-NAGI-L1` Shiro compares versions
- `E-NAGI-L2` Yui recognizes a household phrase only as a clue
- `E-NAGI-L3` no face/surname-only bloodline confirmation

---

# 5. ERA-INC-YUI-01 — 消えたSOS事件

## Reality lead

### ユイ

Role: `REALITY_ERA_LEAD`

Reality root remains:

> **東京都荒川区**

Exact emergency district / type remains Open。
荒川区をdisaster attractionにはしない。

## Dream supporting Current21

### アサ — `DREAM_VERIFICATION_IDENTITY_COUNTERPOINT`

Use:

- verified identityの価値を理解しつつ、verification failureをperson failureにしない。

Hook:
- `yui-asa`

### マドカ — `DREAM_WEAK_SIGNAL_OBSERVER`

Use:

- main feedに出ない小さいsignalへ気づく。
- “見えたから正しい”ではなくcorroborationへ渡す。

### ユウビ — `DREAM_ADDRESS_AND_DELIVERY_BRIDGE`

Use:

- old address / local landmark / delivery routeがformal mapより役立つ場合。
- 届ける責任。

Hook:
- `yubi-tobari`

### トバリ — `DREAM_TRANSIT_AND_GATE_RESPONSE`

Use:

- transport interruption / closed gate / alternative exit。
- safe closureとpermanent exclusionを分ける。

### カナメ — `DREAM_PHYSICAL_RESCUE_AND_DELEGATION`

Use:

- “自分で全部助ける”ではなく、どのsignalをどのteamへ渡すか。

Hook:
- `kaname-ritsu`

### トキ — `DREAM_RESPONSE_PRIORITY_MEASUREMENT`

Use:

- response time / priority queueの必要性。
- 数字を捨てるのではなく、unknownをどう残すか。

### セン — `DREAM_INFORMATION_EXPLANATION`

Use:

- fact check / source確認を説教化しない。
- child / older adult含め誰でも使える説明へ。

### ネム — `DREAM_CARE_AFTER_RESPONSE`

Use:

- rescued = recoveredではない。
- emergency response後のrest / care。

### リツ / コヨリ — `DREAM_HOUSEHOLD_PRIORITY_PAIR`

Use:

- householdで情報が一人分しか取れない時のadult / child差。
- sibling関係を守る。

Hook:
- `ritsu-koyori`

## Future15 series candidates

### ヒヨリ

Role: `FUTURE_SERIES_LOCAL_SOCIAL_CONNECTION_CANDIDATE`

- online visibilityに関係なく人を見つけるsocial力。ただし万能networkerにしない。

### クウ

Role: `FUTURE_SERIES_ANIMAL_ROUTE_SENSORY_CANDIDATE`

- 犬はデータを読まない。
- 匂い / 人の動線反応のみ。truth detector禁止。

### マキ

Role: `FUTURE_SERIES_FAST_DECISION_WITH_UNCERTAINTY_CANDIDATE`

- decision速度とuncertaintyの扱い。

### スズ

Role: `FUTURE_SERIES_PUBLIC_PRESENTATION_AND_TRUST_CANDIDATE`

- official-looking appearanceがtruthとは限らない。

## Evidence pack

### Official

- `E-YUI-O1` feed ranking / verification policy
- `E-YUI-O2` dispatch log
- `E-YUI-O3` hidden/deprioritized request audit

### Witness

- `E-YUI-W1` phone / voice help request
- `E-YUI-W2` local shop / station handwritten board
- `E-YUI-W3` responder note explaining manual elevation

### Physical / digital

- `E-YUI-P1` cached message without verified badge
- `E-YUI-P2` photo metadata / place mismatch Candidate
- `E-YUI-P3` paper map / old local-name correspondence

### Later interpretation

- `E-YUI-L1` Nagi warning/correction Era echo
- `E-YUI-L2` Asa asks whether verification proves provenance or existence
- `E-YUI-L3` S1 ending reveals same “legibility != existence” pattern elsewhere without Main Mystery answer

---

# 6. ERA-INC-ASA-01 — 「一人分しか通らない」事件

## Reality lead

### アサ

Role: `REALITY_ERA_LEAD`

Hard:

- Asa = Human
- exact occupation / family / political position Open
- secret Android reveal禁止

## Dream supporting Current21

### カスミ — `DREAM_NAME_PRIVACY_COUNTERPOINT`

Use:

- 本人が今見せたくないidentity detailを認証制度が要求する問題。

Hook:
- `asa-kasumi`

### クロオリ — `DREAM_CONCEALMENT_VS_RIGHTS_COUNTERPOINT`

Use:

- 隠すことは守れるが、rights claimには何かを示す必要もある。

### シロ — `DREAM_MULTIPLE_VALID_RECORDS_INTERPRETER`

Use:

- conflicting recordsをone true / falseへすぐ潰さず保留する。

### レン — `DREAM_DIFFERENCE_BETWEEN_BRANCHES_INTERPRETER`

Use:

- same past / different presentの差分を見る。
- difference = fakeではない。

### ナギ — `DREAM_PRIVACY_TO_PERSONHOOD_ECHO`

Use:

- “開示を求める制度”がprotective purposeからcontrolへ変わる流れを比較。

## Future15 series candidates

### クロエ

Role: `FUTURE_SERIES_LONG_LIVED_CONTINUITY_CANDIDATE`

- 長く生きる人が同じpersonであり続けるとは何か。
- Robot問題と同一化しない。

### ノア

Role: `FUTURE_SERIES_REPLICA_PERSONHOOD_PRIMARY_CANDIDATE`

- same snapshot -> different current experiences。
- original/copyの一方をfakeにしない。

### ルム

Role: `FUTURE_SERIES_COLLECTIVE_IDENTITY_CANDIDATE`

- one-person legal modelを必ず望むとは限らない。
- collective identityのchoiceも守る。

### イオ

Role: `FUTURE_SERIES_CLASSIFICATION_PRESSURE_CANDIDATE`

- labelを急がないことと、権利請求に必要な最低情報の摩擦。

### カイ / ナオ

Role: `FUTURE_SERIES_TWIN_PERSONHOOD_COUNTERPOINT`

- same genes / home / memories overlapでも最初から二人。
- Robot copyと比較しても“Human twinだから魂が証明済み”にはしない。

### アマネ

Role: `FUTURE_SERIES_ACCESS_AND_CREDENTIAL_CANDIDATE`

- credential failureがmobility / service accessへ直結する設計を検討。
- wheelchairを悲劇装置にしない。

## Evidence pack

### Official

- `E-ASA-O1` continuity credential history
- `E-ASA-O2` dispute / appeal rule
- `E-ASA-O3` care / contract authorization decision

### Witness

- `E-ASA-W1` two branch-person testimonies
- `E-ASA-W2` family / chosen-family relationship attestation
- `E-ASA-W3` doctor / employer / counterparty statement about responsibility

### Physical / digital

- `E-ASA-P1` body migration provenance
- `E-ASA-P2` memory-state provenance / divergence log Candidate
- `E-ASA-P3` Asa handwritten label that identifies chosen name but does not prove metaphysical identity

### Later interpretation

- `E-ASA-L1` Noa uses same-past/different-present evidence
- `E-ASA-L2` Rum questions whether one-person credential is desirable for collective self
- `E-ASA-L3` Yui/Nagi records show older versions of “system-readable = real” error

---

# 7. Current21 coverage map

All Current21 should have at least one meaningful incident relation across S1/S2, but not necessarily Reality direct involvement.

| Character | Main incident use |
|---|---|
| Yui | Yui lead / Tomori+Nagi cross-era interpreter |
| Asa | Asa lead / Yui verification counterpoint |
| Nagi | Nagi lead / Asa privacy echo |
| Michiru | Michiru lead |
| Tomori | Tomori lead |
| Sen | Nagi/Yui information explanation |
| Ritsu | Tomori/Yui household allocation |
| Koyori | Tomori/Yui child lens |
| Gen | Michiru place legacy |
| Hana | Tomori household memory |
| Yuubi | Nagi forwarding / Yui address routing |
| Madoka | Michiru/Yui weak-signal observation |
| Shiro | Tomori/Nagi/Asa evidence classification |
| Tobari | Michiru/Nagi/Yui access-gate infrastructure |
| Nemu | Michiru health / Yui recovery care |
| Kuroori | Nagi/Asa privacy-concealment |
| Kaname | Tomori/Yui care and delegation |
| Kasumi | Nagi/Asa name/reputation/privacy |
| Toki | Michiru/Yui measurement and priority |
| Tsumugi | Tomori repair evidence |
| Ren | Michiru/Asa difference interpretation |

No Current21 Character requires an exact new Reality Era assignment from this Matrix.

---

# 8. Future15 coverage map — series reservoir only

| Character | Candidate use |
|---|---|
| Hiyori | Tomori household / Yui local social connection |
| Serika | Nagi institution/reputation |
| Chloe | Asa long-lived continuity |
| Renji | Tomori craft/mentor legacy |
| Touma | Tomori repair inheritance, non-genetic |
| Kuu | Yui sensory route response |
| Yomo | Nagi multiple-name counterpoint |
| Noa | Asa replica personhood |
| Rum | Asa collective identity |
| Maki | Michiru decision / Yui uncertainty |
| Suzu | Nagi/Yui label and presentation |
| Io | Asa classification pressure |
| Kai | Asa twin-vs-copy counterpoint |
| Nao | Asa twin-vs-copy counterpoint |
| Amane | Michiru route access / Asa credential access |

This table **does not promote any Future15 to Current21 or mandatory Title1 cast**.

---

# 9. Relationship inventory use

Existing Current21 relationship arcs are emotional structure, not incident attendance proof.

High-value hooks:

- `yui-asa` -> Yui verification ↔ Asa identity
- `ritsu-koyori` -> household / child-adult allocation
- `nagi-kaname` -> protection and delegation
- `michiru-toki` -> route and measurement
- `tomori-tsumugi` -> repair and traces
- `sen-koyori` -> rule explanation and child contradiction
- `yubi-tobari` -> delivery and gates
- `madoka-ren` -> observation and difference
- `shiro-tsumugi` -> unknown and unfinished evidence
- `nemu-toki` -> care / rest vs measurement
- `gen-michiru` -> old/new routes
- `asa-kasumi` -> name / privacy
- `yui-tomori` -> lantern object chain
- `sen-shiro` -> explanation / unknown classification
- `nagi-tobari` -> protective closure / reopening
- `kaname-ritsu` -> who carries responsibility
- `yubi-kasumi` -> address/privacy
- `madoka-nemu` -> witness/recovery
- `gen-toki` -> experience/measurement
- `hana-shiro` -> preserving known/unknown things
- `kuroori-yubi` -> responsibility not to deliver yet
- `ren-toki` -> difference/measurement

**The Matrix must not freeze an exact incident into these relationship arcs.**

---

# 10. Evidence-to-reveal guard

## Lineage

Blood relation reveal requires:

```txt
Dream relationship
+
multiple Reality evidence classes
+
chronology
+
Resolution Waking
+
Human approval
```

One object / one photo / one surname is insufficient.

## 群青残響録

Incident evidence can identify:

- central person
- multiple central people
- institution
- social pressure

But this Matrix does not formally admit Gunjo members.

## 朔夜座

Sakuyaza may interact with evidence, but exact member-by-incident position remains Open until separate matrix.

## Combat

Evidence role != Boss role.

No supporting-cast evidence assignment creates a fixed Era Boss.

---

# 11. Season pacing

## S1

Primary:

- Nagi
- Yui
- Asa identity side

Supporting evidence:

- Tomori ledger / repair traces
- Michiru maps / route difference

Important:

- exact Nagi→Yui blood reveal = 0
- player can suspect Reality connections
- supporting cast helps interpret evidence but cannot solve Main Mystery

## S2

Primary:

- Tomori
- Michiru
- Asa rights/care side

Carry:

- Nagi stale copy consequences
- Yui verification trust consequences

If Nagi→Yui is Human-approved later, S2 can perform full recontextualization.

## Optional S3

Focus:

- inherited systems
- inherited objects
- what should stop being inherited

Do not simply add more genealogical reveals.

---

# 12. Completion definition

- exactly 5 named Reality leads at current certainty: Core5 one per Era incident
- Current21 21/21 have meaningful S1/S2 incident function
- Future15 15/15 have optional series-reservoir incident function
- Future15 promotion count remains 0
- every incident keeps Official / Witness / Physical / Later Interpretation evidence
- relationship inventory is used but not overwritten
- exact Reality Era of supporting Current21 is not frozen
- direct Reality witnesses are not mass-created
- one Incident does not gather the whole cast in one real place
- lineage cannot be proven by one clue
- Gunjo membership remains Open
- Sakuyaza exact incident positions remain Open
- combat Boss remains separate
- runtime auto-promotion remains forbidden
