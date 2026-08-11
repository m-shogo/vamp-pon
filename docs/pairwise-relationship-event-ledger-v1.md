# Current21 Pairwise Relationship Event Ledger v1

Date: 2026-08-11  
Status: **CONTENT EVENT CONTRACT / RUNTIME NOT IMPLEMENTED**

## Purpose

Current21の好感度を「戦闘へ連れて行けば全員勝手に仲良くなる数値」にしない。

関係stateを二つへ分ける。

```txt
Bond
= 二人で積んだ共有履歴 / 一緒に越えた夜 / 助け合った経験

Directed Affinity A→B
= Aが現在Bをどう見ているか
```

Bondは共有だが、Affinityは方向別。

```txt
A↔B Bond = 高い
A→B Affinity = 高い
B→A Affinity = 低い
```

も成立する。

## Core rule

### Bond

meaningfulな戦闘経験から育ってよい。

- 初めて一緒に夜明け
- 新しいStageを一緒にClear
- Assist成功
- 危機救援
- pair objective

ただし同じStageの反復だけでは強く伸ばさない。

### Directed Affinity

generic combatから自動成長させない。

> 助けられた = 好きになった

をシステムで決めないため。

Affinityを変える時はContent eventが:

- 誰から
- 誰へ
- UP / DOWN / UNCHANGED
- なぜ変わるか

を明示する。

これにより:

- 片想い
- 尊敬の一方通行
- 警戒
- 嫉妬
- 一時的な失望
- 相手を理解したが好きにはならない
- 共有歴史は長いが今は距離がある

を表現できる。

## Event kinds

### No relationship credit

- `PARTY_SELECTED`
- `READ_DIALOGUE`
- `COMBAT_DEFEAT`
- `CRISIS_PRESENTATION`

Partyへ入れただけ、会話を読んだだけ、敗北しただけでは関係値を動かさない。

### Shared Bond only

- `FIRST_SHARED_DAWN`
- `NEW_STAGE_SHARED_DAWN`
- `REPEATED_SAME_STAGE_DAWN`
- `ASSIST_SUCCESS`
- `CRISIS_RESCUE`

generic combatは「一緒にいた履歴」を増やせるが、directed Affinityは推定しない。

### Bond + authored directed Affinity

`PAIR_OBJECTIVE`

そのpairだから意味があるObjective。Affinityを動かす場合だけA→BかB→Aを明示する。

### Authored Affinity only

`AUTHORED_AFFINITY_SHIFT`

Story/relationship sceneで一方向だけ変える。

```txt
A→B = DOWN
B→A = UNCHANGED
```

も可能。

### Authored mutual choice

`AUTHORED_MUTUAL_CHOICE`

二人が関係を選び直す重要Beat。

両方向を別々に明示する。

```txt
A→B = UP
B→A = UNCHANGED
```

のように「相互eventだから同じ量だけ上がる」とはしない。

## Three-person battle

A / B / Cで夜明けした場合:

```txt
AB event
AC event
BC event
```

の3pairへ分解する。

`ABC group Bond` は作らない。

Assistなら、実際のactor/targetだけ。

```txt
AがBをAssist
→ ABだけ
→ AC/BCには転送しない
```

これにより:

> AとBが仲良し、BとCが仲良しだからAとCも仲良し

というtransitive好感度を防ぐ。

## Failure / Crisis

### Combat defeat

敗北だけでBond/Affinityを下げない。

失敗が関係へ影響する場合は、後続のauthored story eventで明示する。

### Crisis

CRISISは話し方や行動presentationを一時的に昔の癖へ戻せる。

stored Bond/Affinityを壊すものではない。

## Existing prototype tuning

`relationshipBondSpeechPrototypeSource.ts` の既存event weightは引き続きprototype。

本ledgerは「どの種類のeventが、どのstateへcreditできるか」を固定するContent contractであり、最終数値を固定しない。

```txt
numericDeltaFrozen = false
```

playtest後に:

- score delta
- per-run cap
- diminishing
- stage bonus

は調整できる。

## Romance / relation type boundary

数値から:

- 恋愛
- 友情
- 家族
- 師弟
- ライバル

を自動推定しない。

たとえば救援回数100回でも恋愛routeにはならない。

恋愛/片想い/家族等は別Content authorityが明示する。

## Runtime boundary

まだContent Event Contract。

Runtimeへ進めるには:

- append-only event ledger
- duplicate eventId protection
- once-per-pair/stage/objective/story-key claim set
- per-run caps
- save schema / migration
- replay / deterministic reconstruction
- directed Affinity values
- UI presentation
- analytics / debug viewer

が必要。

Content contractだけでruntime完成扱いしない。
