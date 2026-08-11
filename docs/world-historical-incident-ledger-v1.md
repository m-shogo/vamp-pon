# ヨルノシルベ — Historical Incident Ledger v2

Date: 2026-08-11  
Status: **P0 HISTORY FRAME / ERA INCIDENT CANDIDATES / EXACT DATES OPEN / MASTER-ALIGNED**

> Reality大事件を「固定Bossの過去」ではなく、人物・制度・社会・朔夜座が複雑に関わる事件として管理する。

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
- Object lineage
- Character links
- whatChangedAfter
- localThirdOption
- combatBoss: NONE / CANDIDATE / SEPARATE_GAMEPLAY_ROLE
- GunjoAdmission: OPEN / CANDIDATE / ADMITTED_BY_HUMAN_REVIEW
- unresolvedGap
- payoffClass
- status

### Critical separation

```txt
incident central person / people
≠
combat Boss
```

をdefaultにする。

---

# 2. Era lanes

Current seeds:

- `1940S_LIKE`
- `1980S_LIKE`
- `2000S_LIKE`
- `PRESENT`
- `FUTURE_ANDROID_ROBOT`
- `MULTI_ERA`
- `UNKNOWN`

lane数は固定しない。

Exact yearはHuman decision前にLOCKしない。

Characterの見た目年齢からEraを推定しない。

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

---

# 5. Candidate Incident 01 — 無番線案内

`INC-ROUTE-001`

Status: `HIGH_VALUE_CANDIDATE`
Payoff: `C/B`
Era: `UNKNOWN / possible older-transit lane`

Known:
- station営業終了後、通常numberでない方向案内が出たRecord。
- witnessごとにstairs / platform widthが一致しない。
- Reality設備上は該当platformがない。

Official explanation Candidate:
- signage / temporary guidance malfunction。

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

SakuyazaRelation: `UNKNOWN`
GunjoAdmission: `OPEN`
combatBoss: `NONE BY DEFAULT`

---

# 6. Candidate Incident 02 — 未配達保管延長

`INC-POST-001`

Status: `HIGH_VALUE_CANDIDATE`
Payoff: `C/B`
Era: `UNKNOWN`

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

centralPersonOrPeople: `OPEN`
combatBoss: `NONE`

---

# 7. Candidate Incident 03 — 地図改訂連鎖

`INC-ROUTE-002`

Status: `HIGH_VALUE_CANDIDATE`
Payoff: `B/A`
Era: `MULTI_ERA`

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

朔夜座ミチグレの「間違う道なら消す」思想への反証をObject evidenceで作れる。

GunjoAdmissionは`OPEN / likely NONE`。

---

# 8. Candidate Incident 04 — 白紙台帳保存

`INC-ARCHIVE-001`

Status: `CANDIDATE`
Payoff: `C/B`
Era: `UNKNOWN`

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
空白 = 無価値ではない。

combatBoss: `NONE`

---

# 9. Candidate Incident 05 — 継火修理記録

`INC-LAMP-001`

Status: `HIGH_VALUE_CANDIDATE / OBJECT_LINEAGE_DEPENDENT`
Payoff: `B/A`
Era: `MULTI_ERA`

Known:
- lamp / related fixtureに複数Eraのrepair trace。
- 一部はTomori repair languageと整合Candidate。
- Yui lanternとのsameObjectはevidence必要。

Guard:
`Tomori → Yuiへ直接hand-off`をCanon化しない。

Emotional:
> 会ったことのないEraの誰かの手仕事が、後世の人の日常を支える。

---

# 10. Candidate Incident 06 — 押花避難帳

`INC-CIVIC-001`

Status: `CANDIDATE`
Payoff: `C`
Era: `OPEN`

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

大事件を作るために大量犠牲を追加しない。

---

# 11. Candidate Incident 07 — 名前訂正騒動

`INC-NAME-001`

Status: `CANDIDATE`
Payoff: `C/B`
Era: `OPEN`

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
名前を正すこと ≠ 本人より先に決めること。

---

# 12. Candidate Incident 08 — 解除条件を失った閉鎖区画

`INC-GATE-001`

旧working name `夜明け前の閉鎖区画` は、physical morningを連想させるため**working rename required**。

Status: `CANDIDATE`
Payoff: `B`
Era: `UNKNOWN`

Known Candidate:
安全確保のためclosureしたareaで、解除条件 / deadlineだけlostしたRecord。

Initial:
合理的protection。

Later:
`今は入れない` → `永遠に開けない`。

Hooks:
- ナギ
- トバリ
- アサトジ
- カナメ

Theme:
守ることの期限。

Formal public nameはHuman naming review前にLOCKしない。

---

# 13. Future Era incident architecture

`FUTURE_ANDROID_ROBOT`のexact incidentはOpen。

Required ingredients方向:

Human-side pressures:
- labor / ownership
- disposal
- command
- economic incentive

Android-side pressures:
- category-based hostility
- self-defense radicalization
- copy / identity fear
- autonomy

Both sidesにDream participantsを置ける。

Guard:
- Human = all evil 禁止
- Android = all victim / all good 禁止
- Star Beast = soul proof禁止
- central person = fixed final Boss禁止

群青残響録対象がHuman側 / Android側双方に複数存在する可能性もOpen。

---

# 14. Modern Era incident architecture

Exact incidentはOpen。

Theme reservoir:

- SNS
- information overload
- viral correctness
- pile-on
- algorithm
- isolation
- diversity / simplification tension

一人のinfluencer / CEOだけを倒して解決しない。

institution / user behavior / platform incentive / fearを分ける。

---

# 15. 2000s / 1980s / 1940s architecture

## 2000s
- internet adoption
- mobile
- privacy
- connection / loneliness

## 1980s
- corporate growth
- prosperity
- success pressure
- looking away

## 1940s-like
- group / individual
- information scarcity / control
- command
- survival
- sacrifice
- protection

Historical sensitivity:
exact real historical eventへ接続する場合は、その時点で一次 / authoritative historical researchを行う。

Era themeだけで実在悲劇を軽く借用しない。

---

# 16. Cross-link guard

一Incidentへ全Characterを接続しない。

目安:
- direct witness: 0–3
- indirect evidence: 1–5
- later reader: unlimited

「実は全員あの日同じ場所にいた」を禁止。

single-accident convergenceをコピーしない。

---

# 17. Official record ≠ truth

最低分離:

```txt
official record
witness memory
physical evidence
later interpretation
```

plus when useful:

```txt
company position
media report
social rumor
Sakuyaza interpretation
Dream reconstruction
```

一つを神視点にしない。

---

# 18. Waking / Reality resolution

大事件の解決はDream内で「事件を消す」だけにしない。

```txt
Dream relation / learning
↓
Waking with recovered memory direction
↓
Reality
↓
以前は選べなかった第三のchoice
↓
worst outcome changes
```

過去の悲劇を雑にeraseしない。

---

# 19. Happy End compatibility

- Permanent deathをmain tear deviceにしない。
- 被害者をMystery keyだけにしない。
- central personを全部許す必要はない。
- understanding != absolution。
- local resolutionはReality actionへ返す。

---

# 20. Incident distribution

一Titleで全Era incidentを同じ密度で扱わない。

- main-facing: 必要数
- optional report: supporting incidents
- series seed: later era / later title

固定件数自体もStory structureに合わせる。

---

# 21. Next evidence work

- Era laneごとのReality evidence pack
- Stage placement
- Object lineage IDs
- Knowledge Matrix
- Institution official records
- 朔夜座relationship matrix
- 群青残響録admission candidates
- combat Boss fields kept separate

Exact year / victim count / major family damage / formal Gunjo membersはHuman decisionまでOpen。
