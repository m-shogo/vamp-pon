# Current24 Featured Affinity — Result / Hub Placement v1

Date: 2026-08-11  
Status: **CONTENT PLACEMENT POLICY / RUNTIME NOT IMPLEMENTED**

## Goal

Featured24の72 Affinity Beatを「資料に書いてあるだけ」にせず、3人自由編成でも自然に見られる導線へ落とす。

ただし特定pairを編成しないとMain Storyが止まる設計にはしない。

## Surfaces

### 1. RESULT_PAIR_CONDITIONAL

そのrunの3人Partyにbeat対象の2人が両方いる場合、Resultで関係scene候補になれる。

```txt
Party = A / B / C

AB beat eligible
AC beat eligible
BC beat eligible
```

ただし一度のResultで出すrelationship beatは**最大1本**。

3pair全部の長話を連続させない。

### 2. HUB_FALLBACK

preferred Result windowで:

- pairを編成しなかった
- 別pairがResult slotを使った
- sceneをまだ見ていない

場合、一定campaign milestone後にHubへ残す。

これにより:

> 好きな3人で遊んだから、別の重要関係storyを永久に失った

を防ぐ。

Hubでは対象2人が利用可能であることを要求する。
Reserveなど未解禁人物を勝手に出さない。

### 3. RELATIONSHIP_BOOK_REPLAY

一度見たbeatはRelationship Bookで再生可能。

再読にBond/Affinity/combat powerは付けない。

## Editorial windows

Exact Stageはまだ固定しない。

### FRICTION

```txt
unlock: Stage ordinal 3
preferred Result window: 3–7
Hub fallback: after 7
editorial late limit: 9
```

### RECOGNITION

```txt
unlock: 8
preferred Result window: 8–14
Hub fallback: after 14
editorial late limit: 16
```

### CHOSEN_TRUST

```txt
unlock: 15
preferred Result window: 15–19
Hub fallback: after 19
editorial late limit: 19
```

Stage20は新しい関係rule/optional relationship sceneを消費する場所にしない。

> Stage20 = Title1 Happy End / campaign ending

を優先する。

## Why flexible windows

現時点でexact Stageへ72sceneを固定すると:

- そのpairをPartyへ入れる強制
- scene過密
- Stage本編themeとの衝突
- キャラ解禁順との衝突

が起こりやすい。

そのため、現在はcampaign bandだけをContent policyとして持つ。

`exactStageFrozen = false`

## Result arbitration

1 Result = max 1 relationship beat。

候補が複数ある場合:

1. unseen
2. preferred window内
3. 古いphase（FRICTION → RECOGNITION → CHOSEN_TRUST）
4. overdueなら救済優先
5. 同条件ならstable relation order

最終runtimeではseen-line historyや直近登場数も使えるが、Contentだけでは固定しない。

## Three-person fairness

A/B/CのうちABだけrelationship sceneが出ても、Cを「存在しない人物」にしない。

Runtime sceneでは:

- Cが退出する自然な理由
- Cが一言だけ橋渡しする
- scene直後のgroup reactionでCへ戻る

などを使える。

ただしCへABのAffinity creditを転送しない。

## Main Story safety

72beatは全て:

```txt
mainStoryRequired = false
stage20ClearBlockedIfUnseen = false
readingGrantsPower = false
```

関係storyを深く追う人は楽しめるが、Title1 Happy Endの必須条件にはしない。

## Missed content

preferred windowを過ぎてもsceneを消さない。

`unseenBeatsRemainAvailable = true`

後からキャラを使い始めたplayer、推しを変えたplayer、2周目playerも拾える。

## Replay

Relationship Bookは:

- FIRST_READ / ALLY / TRUST等の状態確認
- 過去scene replay
- 呼称変化比較
- BEFORE / AFTER比較

へ将来接続できる。

ただし再生=power rewardにはしない。

## Runtime open work

- milestone availability ledger
- seen beat ledger
- Result candidate arbitration
- Hub queue
- scene cooldown / recent-speaker fairness
- Character unlock check
- Relationship Book replay UI
- voice/subtitle variants
- localization
- save migration

Content placementだけでruntime完成扱いしない。
