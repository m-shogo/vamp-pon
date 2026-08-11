# ヨルノシルベ — Historical Incident Ledger v3

Date: 2026-08-11  
Status: **P0 HISTORY FRAME / CURRENT ERA-BAND ALIGNED / SUPPORTING INCIDENT LEDGER / EXACT DATES OPEN**

> Reality大事件を「固定Bossの過去」ではなく、人物・制度・社会・朔夜座が複雑に関わる事件として管理する。
>
> **Current Core5 major-incident detail authority:**
> `docs/era-major-incident-family-lens-atlas-v1.md`
>
> **Research authority:**
> `docs/research/era-major-incident-social-sourcebook-v1.md`
>
> 本Ledgerは、既存のsupporting incident / evidence / multi-era record候補を保持する。
> Core5 5 EraのCurrent大事件構造と衝突する場合は、最上位Master + Era Major Incident Atlasを優先する。

---

# 0. Migration from v2

v2に残っていた:

- `1940S_LIKE`
- `1980S_LIKE`
- `2000S_LIKE`
- `FUTURE_ANDROID_ROBOT`
- 「Future exact incidentはOpen」
- 「Modern exact incidentはOpen」

は、Core5 Era設計確定前の**legacy seed labels / generic reservoirs**。

Currentでは使用しない。

Current Core5 Era bands:

- `POSTWAR_RECOVERY_SCARCITY_JAPAN`
- `LATE_HIGH_GROWTH_POLLUTION_ENERGY_TRANSITION_JAPAN`
- `POST_BUBBLE_EARLY_MOBILE_INTERNET_JAPAN`
- `PRESENT_DAY_JAPAN`
- `FAR_FUTURE_HUMAN_ANDROID_ROBOT_AVATAR_SOCIETY`

Supporting recordsでは:

- `MULTI_ERA`
- `UNKNOWN`
- `OPEN`

も使える。

Exact yearは依然Open。

---

# 1. Incident entry contract

各事件は最低:

- incidentId
- workingPublicName
- eraLane
- eraConfidence
- Reality place evidence
- affected institutions
- ordinary life before incident
- stated ideal / protective purpose
- fear / interest / pressure
- centralPersonOrPeople
- centralityReason
- SakuyazaRelation
- officialExplanation
- witnessVersions
- rumorVersions
- physicalEvidence
- object / place / knowledge lineage
- Character links
- whatChangedAfter
- localThirdOption
- combatBoss: `NONE / CANDIDATE / SEPARATE_GAMEPLAY_ROLE`
- GunjoAdmission: `OPEN / CANDIDATE / ADMITTED_BY_HUMAN_REVIEW`
- unresolvedGap
- payoffClass
- status

Critical:

```txt
incident central person / people
!=
combat Boss
```

をdefaultにする。

---

# 2. Current Core5 major incident overlay

Exact incident names are still working titles / Candidate.

| Core5 | Current Era | Current major incident | Main failure |
|---|---|---|---|
| トモリ | `POSTWAR_RECOVERY_SCARCITY_JAPAN` | **空欄世帯事件** | recordに追いつかない生活者がdistribution eligibilityから落ちる |
| ミチル | `LATE_HIGH_GROWTH_POLLUTION_ENERGY_TRANSITION_JAPAN` | **一本線計画事件** | priority route外のhealth / local accessがinvisible costになる |
| ナギ | `POST_BUBBLE_EARLY_MOBILE_INTERNET_JAPAN` | **安心共有名簿事件** | warning copyがcorrectionより速く残る |
| ユイ | `PRESENT_DAY_JAPAN` | **消えたSOS事件** | unverifiedだが本物のSOSがtrusted attention surfaceから落ちる |
| アサ | `FAR_FUTURE_HUMAN_ANDROID_ROBOT_AVATAR_SOCIETY` | **「一人分しか通らない」事件** | one valid continuityだけがfull person statusを持つ |

Detailed ordinary-life / generation / family lenses / Third Option / Season weave:

`docs/era-major-incident-family-lens-atlas-v1.md`

Machine source:

`src/game/data/eraMajorIncidentFamilyLens.ts`

These five are:

- fictional
- exact year Open
- exact place Open except already-decided Character root constraints
- exact casualty count Open
- Gunjo formal people Open
- combat Boss separate

---

# 3. 群青残響録 admission rule

群青残響録は事件の中心人物 / 人物群を後から括るrecord taxonomy。

各Incidentで:

- 一人
- 複数人
- institution中心
- social pressure中心

のどれも成立する。

Formal admission前に最低:

1. 何を望んだか
2. 何を恐れたか
3. どの選択が事件へ影響したか
4. 何を止められた / 止められなかったか
5. 「一番悪い人」だけへ縮めていないか
6. combat Boss roleと分離されているか

を確認する。

Fixed rules:

- one per Eraではない
- fixed countではない
- fixed enemy factionではない
- mandatory villainではない
- mandatory combat Bossではない

---

# 4. 朔夜座 relation field

`SakuyazaRelation` Candidate values:

- `NO_DIRECT_CONTACT`
- `UNKNOWN`
- `COOPERATED`
- `USED_BY_CENTRAL_SIDE`
- `USED_CENTRAL_SIDE`
- `OPPOSED`
- `TRIED_TO_STOP`
- `WAS_STOPPED_BY`
- `TEMPORARY_ALIGNMENT`
- `MULTIPLE_MEMBERS_DIFFER`

8人全員を同じ立場へ置かない。

Core5 major incidentは現在すべて:

> `MULTIPLE_MEMBERS_DIFFER / OPEN`

方向。

---

# 5. Supporting Candidate 01 — 無番線案内

`INC-ROUTE-001`

- Status: `HIGH_VALUE_CANDIDATE`
- Payoff: `C/B`
- Era: `UNKNOWN / supporting transit record`
- combatBoss: `NONE BY DEFAULT`
- GunjoAdmission: `OPEN`
- SakuyazaRelation: `UNKNOWN`

Known:

- station営業終了後、通常numberでない方向案内が出たRecord
- witnessごとにstairs / platform widthが一致しない
- Reality設備上は該当platformがない

Official explanation Candidate:

- signage / temporary guidance malfunction

Witness:

- 旧platformへ出た
- stairsを下りたのに外へ出た
- 誰かがrouteを教えた

Objects:

- old ticket
- ticket punch
- station compass

Character hooks:

- トバリ
- ゲン
- ミチル

Important:

> Michiru major incident `一本線計画事件`そのものではない。
> Later evidence / supporting mysteryとして接続可能。

---

# 6. Supporting Candidate 02 — 未配達保管延長

`INC-POST-001`

- Status: `HIGH_VALUE_CANDIDATE`
- Payoff: `C/B`
- Era: `UNKNOWN`
- centralPersonOrPeople: `OPEN`
- combatBoss: `NONE`

Known:

本来return / disposal対象になり得るowner-unknown mailを、誰かが長期間holdしたRecord。

Ordinary motive:

> 「捨てるのが忍びなかった。」

Evidence:

- handwritten hold tag
- multiple postmark formats
- address damage

Character hooks:

- ユウビ
- アサ
- カスミ

Theme:

`届かなかった` と `まだ捨てなかった` は別。

May connect to:

- Yuubi ↔ Tobari institutional legacy
- later archive evidence

but not automatically to one Core5 major incident.

---

# 7. Supporting Candidate 03 — 地図改訂連鎖

`INC-ROUTE-002`

- Status: `HIGH_VALUE_CANDIDATE`
- Payoff: `B/A`
- Era: `MULTI_ERA`
- GunjoAdmission: `OPEN / likely NONE`

Known:

同一 / 近似areaでroute廃止・名称変更・detour等が重なる。

Later mapだけ見るとOld mapがwrongに見えるが、当時はcorrectだったversionがある。

Theme:

> 正解は時点によって変わる。

Hooks:

- ゲン
- ミチル
- トキ
- ミチグレ

Current integration:

- `一本線計画事件`のS1 evidence seedへ接続可能
- Michiru ↔ Gen place lineageへ接続可能

朔夜座ミチグレの「間違う道なら消す」思想へのObject evidence反証にも使える。

---

# 8. Supporting Candidate 04 — 白紙台帳保存

`INC-ARCHIVE-001`

- Status: `CANDIDATE`
- Payoff: `C/B`
- Era: `UNKNOWN`
- combatBoss: `NONE`

Known:

内容不明 / unreadable materialを「未分類」として残したoperation record。

Conflict:

- 整理不足
- 不要資料
- 分からないから残した

Hooks:

- シロ
- ハナ
- セン
- ハクマ

Theme:

> 空白 = 無価値ではない。

May echo Tomori `空欄世帯事件`, but:

- archive preservation
- scarce-goods eligibility

は別mechanism。

---

# 9. Supporting Candidate 05 — 継火修理記録

`INC-LAMP-001`

- Status: `HIGH_VALUE_CANDIDATE / OBJECT_LINEAGE_DEPENDENT`
- Payoff: `B/A`
- Era: `MULTI_ERA`

Known:

- lamp / related fixtureに複数Eraのrepair trace
- 一部はTomori repair languageと整合Candidate
- Yui lanternとのsameObjectはevidence必要

Guard:

- `Tomori -> Yui direct hand-off`をCanon化しない
- Tomori ↔ Yui lantern chainはnon-blood object inheritance
- Nagi → Yui parent-child Candidateのproofへ流用しない

Emotional:

> 会ったことのないEraの誰かの手仕事が、後世の人の日常を支える。

---

# 10. Supporting Candidate 06 — 押花避難帳

`INC-CIVIC-001`

- Status: `CANDIDATE`
- Payoff: `C`
- Era: `OPEN`

Candidate:

evacuation / civic listに小さなpressed flowerが挟まれている。

Evidence use:

- who was present
- season hint
- someone treated official list as a lived object

Hooks:

- ハナ
- コヨリ
- アサ

Human gate:

- disaster type
- victim count
- Character family loss
- exact date

Hard:

> 大事件を作るために大量犠牲を追加しない。

Current Yui `消えたSOS事件`のexact emergencyへ自動統合しない。

---

# 11. Supporting Candidate 07 — 名前訂正騒動

`INC-NAME-001`

- Status: `CANDIDATE`
- Payoff: `C/B`
- Era: `OPEN`

Known Candidate:

- board / roster / luggage label上のwrong name corrections
- 本人confirm前に別の「correct」へreplaceされたcase
- old typoが長く残ったcase

Hooks:

- アサ
- カスミ
- ナシロ
- ペタ

Theme:

> 名前を正すこと != 本人より先に決めること。

May foreshadow Asa future incident, but is not the same incident.

---

# 12. Supporting Candidate 08 — 解除条件を失った閉鎖区画

`INC-GATE-001`

旧working name `夜明け前の閉鎖区画` はphysical morningを連想させるため**SUPERSEDED**。

- Status: `CANDIDATE`
- Payoff: `B`
- Era: `UNKNOWN`
- formal public name: `OPEN`

Known Candidate:

安全確保のためclosureしたareaで、解除条件 / deadlineだけlostしたRecord。

Initial:

> 合理的protection。

Later:

> `今は入れない` -> `永遠に開けない`。

Hooks:

- ナギ
- トバリ
- アサトジ
- カナメ

Theme:

> 守ることの期限。

---

# 13. Current Era architecture — use Atlas, not generic decade buckets

## Tomori

Use:

- scarcity
- distribution
- reconstruction
- repair
- household mobility

Current major incident:

> `空欄世帯事件`

Do not reduce to:

- war character
- command / sacrifice generic 1940s stereotype

## Michiru

Use:

- growth
- housing
- transport
- pollution
- energy transition

Current major incident:

> `一本線計画事件`

Do not reduce to generic 1980s prosperity.

## Nagi

Use:

- early Internet
- mobile mail
- privacy
- copied reputation
- digital divide

Current major incident:

> `安心共有名簿事件`

Do not import:

- generative AI
- deepfake
- everyone-smartphone present-day mechanics

## Yui

Use:

- smartphone
- SNS
- generated / recycled media
- misinformation
- live verification
- information abundance

Current major incident:

> `消えたSOS事件`

Exact emergency type remains Open.

## Asa

Use:

- digital identity
- body / avatar migration
- copy / branch identity
- Human / Android / Robot coexistence
- rights / contract / care continuity

Current major incident:

> `一人分しか通らない事件`

Asa本人はHuman。

---

# 14. Research sensitivity

Historical / present / future design uses:

`docs/research/era-major-incident-social-sourcebook-v1.md`

Hard:

- real historical event = research evidence
- fictional Yoru-no-Shirube incident = authored event
- real victims / casualties / companies / neighborhoodsをrename-copyしない
- Future extrapolation = fiction, not policy prediction
- long-lived SFからquestion structureを学べるが固有用語 / 組織 / plotをコピーしない

---

# 15. Cross-link guard

一Incidentへ全Characterを接続しない。

目安:

- direct Reality witness: `0–3`
- indirect evidence: `1–5`
- later reader: 必要数
- Dream reaction: broader cast allowed

「実は全員あの日同じ場所にいた」を禁止。

`origin != incident location`の場合は、Era-plausible mobility reasonが必要。

single-accident convergenceへしない。

---

# 16. Official record != truth

最低分離:

```txt
official record
witness memory
physical evidence
later interpretation
```

plus when useful:

```txt
company / institution position
media report
social rumor
Sakuyaza interpretation
Dream reconstruction
```

一つを神視点にしない。

---

# 17. Waking / Reality resolution

大事件の解決はDream内で「事件を消す」だけにしない。

```txt
Dream relation / learning
↓
Resolution Waking where appropriate
↓
Reality
↓
以前は選べなかったThird Option
↓
worst outcome changes
```

Normal Wakingではexplicit Dream memoryをほぼ失う。

Physical morningは存在しない。

過去Realityをtime-travel resetしない。

---

# 18. Season weave

## Season 1

Primary:

- Nagi `安心共有名簿`
- Yui `消えたSOS`
- Asa identity/belonging side

Evidence seeds:

- Tomori ledger / repair
- Michiru map revision

Ending:

`UNEASY_PARTIAL_VICTORY`

Exact blood relation reveal: **0**。

## Season 2

Primary:

- Tomori resource / distribution
- Michiru progress / route / health
- Asa rights / care / resource

Nagi / Yui consequences carry over.

## Optional Season 3

5事件をもう一度回さない。

Theme:

> 何を次へ渡すか / 何をここで終わらせるか。

---

# 19. Happy End compatibility

- Series canonical ending = Happy End
- every Season complete Happy Endは不要
- Permanent deathをmain tear deviceにしない
- 被害者をMystery keyだけにしない
- central personを全部許す必要はない
- understanding != absolution
- local resolutionはReality actionへ返す
- tragedy erasureだけをsolutionにしない

---

# 20. Incident distribution

一Titleで全Era incidentを同じ尺にしない。

- main-facing
- evidence seed
- optional supporting incident
- later-season payoff

を分ける。

固定件数自体をLore ruleにしない。

---

# 21. Current next evidence work

High-value next work:

- five Era incident Stage placement
- direct Reality witnesses vs Dream responders
- official record / witness / physical evidence sets
- existing object lineage IDsへ接続
- 朔夜座member-by-member incident positions
- 群青残響録admission candidates
- combat Boss kept separate

Exact:

- year
- victim count
- major family damage
- formal Gunjo people
- exact Sakuyaza involvement

はHuman decision / evidence reviewまでOpen。

---

# 22. SUPERSEDED labels

Do not use as Current authority:

- `1940S_LIKE`
- `1980S_LIKE`
- `2000S_LIKE`
- `FUTURE_ANDROID_ROBOT`
- “Modern exact incident is fully Open”
- “Future exact incident is fully Open”
- `夜明け前の閉鎖区画`

They may remain in Git history / old notes as migration evidence only.
