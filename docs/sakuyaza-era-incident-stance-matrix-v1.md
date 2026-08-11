# ヨルノシルベ — Season 1 朔夜座 × Incident Stance Matrix v2

Date: 2026-08-11  
Status: **S1 CURRENT STANCE DESIGN / EXACT PRESENCE & OFFICIAL MISSION OPEN**

Upstream:

1. `docs/00-current-story-world-master.md`
2. `docs/season-architecture-cast-matrix-v1.md`
3. `docs/sakuyaza-current-identity-v1.md`
4. `src/game/data/sakumeiCandidateSource.ts`
5. `docs/era-major-incident-family-lens-atlas-v1.md`
6. `src/game/data/seasonArchitecture.ts`

> **朔夜座はSeason1の主要敵チーム。**
> S2は別team名 + 別primary antagonist cast、optional S3も別team / 別castを基本とする。
>
> このMatrixはS1で朔夜座8人をどう差別化するかを扱う。
> S2事件へ朔夜座8人を割り振る資料ではない。

---

# 0. Season rotation hard rule

```txt
S1 primary antagonist team = 朔夜座 / 8人
S2 primary antagonist team = OPEN / 別team名 / 別cast
S3 if used = OPEN / 別team名 / 別cast
```

Allowed:

- S1朔夜座memberがS2で一人だけ再登場
- rival / ally / unresolved personal arc / cameo
- S1で残した証拠がS2へ影響

Forbidden:

- S2で朔夜座8人をそのまま主敵teamとして続投
- S2でteam名だけ変えて同じ8人を使う
- S1の4人、S2の4人という固定分割
- new Season = old enemy reskin

Main Spine / Core5 / Reality history / Main Mysteryは続く。

---

# 1. Presence != stance

S1内でも:

- `stance exists` != `Reality witness`
- `stance exists` != `combat Boss`
- `stance exists` != `official Sakuyaza mission`
- `pair candidate` != `permanent pair`
- `pair candidate` != romance

8人全員が各事件へ物理登場する必要はない。

一人のpersonal actionも成立する。

---

# 2. S1 attachment lanes

| member | attachment lane |
|---|---|
| ナシロ | 倫理の揺らぎ / identity mystery |
| アサトジ | 優しい行動が暴力になる悲哀 |
| ミチグレ | 静かな圧倒感 |
| オリネ | recurring rival / transformation |
| ハクマ | uncanny minimalism / silence |
| ツグリ | 善意100%の職人気質の怖さ |
| ユラネ | 理解できる誘惑 / quiet comfort |
| ペタ | 愛着 → sudden horror |

S1の主macro problem:

> **Recognition / Record / Belonging**

Primary incident lanes:

1. Nagi — `安心共有名簿事件`
2. Yui — `消えたSOS事件`
3. Asa — `一人分しか通らない事件`のidentity / belonging側

Tomori / Michiru primary incidentsはS2側。
朔夜座のS2 primary stanceを今ここで固定しない。

---

# 3. Nagi — 安心共有名簿事件

Core failure:

> warning copyがcorrectionより速く残る。

## オリネ — PRIMARY

- harmful contextを隠して人を守ろうとする。
- correction reasonまでfoldすると、表面だけ「問題なし」になる。
- 同じ折り目が複数copyへ残るvisual clueが使える。

## ペタ — PRIMARY

- `注意 / 訂正済み / 安全 / 対象外`を貼り重ねる。
- 日常のlabel gagから人間へのlabelへ反転できる。

## ハクマ — PRIMARY

- ambiguityをblankへする。
- false warningだけでなく本人の反論も消える。

Pettaとの差:

- Petta = labelで上書き
- Hakuma = meaningごと消す

## ナシロ — PRIMARY / AMBIVALENT

- impersonation防止にはstrong identityを支持できる。
- wrong nameが本人より長く残ると強く反対できる。

## アサトジ — SECONDARY

- safetyのためtemporary closure。
- exit conditionがなければpermanent exclusionになる。

## ツグリ — SECONDARY

- corrupted listを一つのclean versionへrepair。
- 「どれが壊れているか」を本人抜きで決める危険。

## ミチグレ — LOW / SUPPORT

- unsafe access routeを消す方向。
- Nagi incidentではroute問題を主役にしすぎない。

## ユラネ — LOW / COUNTER POSSIBILITY

- reputation pressureから一度離れる休息を与える。
- 「もう見なくていい」がappeal放棄へ変わる危険。

### Pair Candidate

**オリネ × ペタ — `HIDE_AND_RELABEL`**

```txt
contextを折り畳む
+
外側へ新しいcorrect label
↓
表面だけ訂正済み
```

Status:
`S1 INCIDENT PAIR CANDIDATE / OFFICIAL MISSION OPEN`

---

# 4. Yui — 消えたSOS事件

Core failure:

> fake / duplicate対策でtrusted feedは役立つが、unverified true SOSが見えなくなる。

## ハクマ — PRIMARY

- uncertain reportをblankにしてnoiseを減らす。
- uncertaintyとSOSを一緒に消してしまう。

## ペタ — PRIMARY

- `verified / official / resolved / duplicate` badge。
- badgeが内容を読む代わりになる。

Candidate line direction:

> 「ほら、“安全”って書いてあるよ？」

## ナシロ — PRIMARY / AMBIVALENT

- fake official account / impersonationにはstrict verificationを支持。
- official identityが本人の声を上書きすると反発する。

## オリネ — SECONDARY

- harmful image / private identity dataをhideする。
- hide理由まで不可視になるとaccountabilityを失う。

## アサトジ — SECONDARY

- dangerous route / channelを閉じる。
- reopening条件が必要。

## ミチグレ — SECONDARY

- false routeを消す。
- alternative rescue routeまで消す危険。

## ツグリ — SECONDARY

- broken feedをrepairする。
- “正常化”がunknown requestを消す可能性。

## ユラネ — COUNTER

- panic / exhaustionから人を休ませる。
- 一時的allyにもなれる。
- unresolved SOSから目を逸らさせる誘惑にもなる。

### Pair Candidate

**ハクマ × ペタ — `BLANK_AND_BADGE`**

```txt
uncertain reportをblank
+
残ったreportへverified badge
↓
画面が綺麗になるほど見えない人が増える
```

Status:
`S1 HIGH-VALUE PAIR CANDIDATE`

---

# 5. Asa — 「一人分しか通らない」事件 / S1 identity side

S1で扱う部分:

> 誰がvalid name / identity / belongingを持てるか。

S2ではrights / care / resource側へ問題が進むが、**S2 primary antagonist teamは朔夜座ではない。**

## ナシロ — PRIMARY

- one identity / one nameでfraudを止めたい。
- two legitimate personsが同じpast name/historyを持つと破綻する。

Question:

> 「同じ名前を二人に返したら、それは返したことになるのか？」

## ツグリ — PRIMARY

- split / branchを「壊れた状態」と見てrepairしたくなる。
- merge / normalizeで別々の現在を消す危険。

## アサトジ — PRIMARY / SECONDARY

- identity dispute中をfreezeしてprotect。
- review中にdaily rightsまで失わせる危険。

## オリネ — SECONDARY

- body / memory provenanceをprotectするためhide。
- rights claim evidenceまで隠す危険。

## ハクマ — SECONDARY

- contradictory historiesをblankへ戻す。
- unknownを残すShiroとのcounterpointが作れる。

## ペタ — SECONDARY

- `original / copy / valid / revoked` label。
- S1のlabel horrorをFutureへ伸ばせる。

## ミチグレ — SECONDARY

- continuity routeを一つだけ残す方向。
- time-travel説明にはしない。

## ユラネ — AMBIVALENT / COUNTER

- identity disputeから一時的に逃がす。
- forced mergeを避ける助けにもなり得る。
- fight for rightsまで諦めさせる危険もある。

### Primary Pair Candidate

**ナシロ × ツグリ — `ONE_NAME_ONE_REPAIRED_PERSON`**

```txt
correct identityを一つ決める
+
branch differenceをrepair
↓
fraudは減るが、二人でいる余地も消える
```

Alternate:

- ナシロ × アサトジ = `NAME_AND_FREEZE`

同一arcでprimary pairを二重化しない。

---

# 6. S1 8人の横断arc

## ナシロ

> correct naming protects → wrong name persists → one name cannot contain every person

## アサトジ

> temporary protection needs an exit condition

## ミチグレ

> removing wrong paths can remove return paths

## オリネ

> hiding can protect; hidden reason can remove agency

## ハクマ

> blank prevents misreading but erases rebuttal too

## ツグリ

> what counts as broken, and who chooses repair

## ユラネ

> rest is necessary; permanent escape steals tomorrow's choice

## ペタ

> labels help until people read the label instead of the person

S1内で8人全員に最低1つは強いattachment payoffを作る。

---

# 7. S1 pair candidates

Current primary candidates:

- Nagi incident: `オリネ × ペタ`
- Yui incident: `ハクマ × ペタ`
- Asa identity incident: `ナシロ × ツグリ`

Rules:

- permanent pair count = 0
- pair != romance
- pair != official mission automatically
- repeated member usage allowed
- solo encounter allowed
- exact pair episode count Open

アサトジ / ミチグレ / ユラネもS1 rosterであり、S2まで温存する「S2班」ではない。

---

# 8. S2 handoff

S1終了後:

- 朔夜座team arcは一区切りつけられる。
- unresolved individual memberは後Seasonへ戻せる。
- S1 memberがReality / Dream evidenceとして影響を残せる。

しかしS2 primary antagonistは:

> **別team名 + 別Character群**

必須。

S2 new teamは:

- Progress
- Care
- Resource
- Sacrifice
- Development
- Reconstruction
- Efficiency vs dignity

から新しいCharacter design / philosophyを作る。

S1朔夜座fixationの名前だけを付け替えない。

---

# 9. Gunjo / Boss separation

朔夜座member:

- incidentへ関わる
- Gunjo central personと協力 /対立する
- combat Bossになる

はすべて別field。

Forbidden default:

```txt
S1 incident antagonist
= Sakuyaza member
= Gunjo member
= combat Boss
```

群青残響録はSeason teamではない。

---

# 10. Completion definition

- S1 formal antagonist team = 朔夜座
- S1 roster = 8/8 current members
- S1 primary incident stance lanes = 3
- all 8 retain distinct attachment lane
- all 3 S1 incidents allow internal disagreement / counter stance
- 3 primary pair candidates
- permanent pair count = 0
- exact official mission count Open
- exact Reality presence Open
- S2 team name Open
- S2 primary roster Open and **must differ from S1**
- optional S3 team / roster Open and must rotate again if used
- previous Season individuals may return but previous full team does not remain primary
- runtime auto-promotion forbidden
