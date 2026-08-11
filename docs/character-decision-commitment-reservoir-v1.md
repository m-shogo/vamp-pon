# ヨルノシルベ — Character Decision / Commitment Reservoir v1

Date: 2026-08-12  
Status: **AUTHOR RESERVOIR / NON-CANON / NO LOYALTY-MORALITY SCORE / FREE TO OVERWRITE**

Machine source:
- `src/game/data/characterDecisionCommitmentReservoir.ts`

## Purpose

Characterを「決断が早い / 遅い」「約束を守る / 破る」の一軸にしない。

全36人について、**どう決め始め、どこで約束し、何があれば考え直し、期限をどう扱い、共同合意をどう作り、破った後にどう戻るか**を作者側Reservoirとして持たせる。

用途:
- ordinary-life scene
- relationship scene
- sibling / mentor / rival / former-enemy scene
- Party planning
- family / work / school / route scene
- promise callback
- conflict repair
- Character Book

## Six axes

1. `DECISION_ENTRY`
2. `COMMITMENT_THRESHOLD`
3. `CHANGE_MIND`
4. `DEADLINE_HANDLING`
5. `SHARED_AGREEMENT`
6. `BROKEN_PROMISE_REPAIR`

Target:

```txt
36 characters × 6 axes = 216 decision/commitment anchors
```

## Hard boundaries

このReservoirから確定しない:
- Canon major promise
- final romantic commitment
- betrayal event
- marriage / breakup / family role
- exact work contract
- exact legal obligation
- exact deadline
- relationship affection score
- gameplay leadership/stat

禁止shortcut:

- indecisive = weak
- decisive = leader
- promise kept = good person
- promise broken = traitor
- changed mind = unreliable
- fast reply / on-time = affection
- old person = stubborn
- child = cannot make meaningful choice
- large body = dependable protector
- wheelchair user = dependent decision maker
- feminine presentation = indecisive / accommodating
- Robot / Android = perfect promise execution
- dog / cat = Human oath / loyalty contract

> **commitment != morality != affection != obedience**

## Current21 highlights

| Character | Decision / commitment identity |
|---|---|
| ユイ | 誰に影響があるかから入る。状況が変われば公開して考え直す。 |
| アサ | system ruleとpersonal choiceを分ける。即処理できてもpersonal decisionは即答義務ではない。 |
| ナギ | permission / privacy / reversibilityを確認。合意が変わればaccessも変える。 |
| ミチル | routeは変えてよいがdestinationとrejoinは共有する。 |
| トモリ | repair可能性ではなくowner choice / safety / stop conditionまで合意する。 |
| セン | ruleとcounterexampleを見てworking answerへ。説明しすぎでdeadlineを食わない。 |
| リツ | unclaimed workを見ると約束しすぎる。減らす・任せることもcommitment repair。 |
| コヨリ | age-appropriateな本物のchoiceを持つ。大人の責任を背負わせない。 |
| ゲン | old precedentを使えるがcurrent local factで更新できる。 |
| ハナ | care / storageを勝手に約束しない。本人が望まない追加ケアをapologyにしない。 |
| ユウビ | recipient / route / handoffが揃ってから約束。delayは早く更新。 |
| マドカ | perfect timing待ちで言えなくなる弱点。speaking checkpointを持てる。 |
| シロ | unknownをunknownのままworking decisionへ。erratum可能。 |
| トバリ | 待つことを自分の義務にしすぎない。相手にはroute変更や帰らない自由もある。 |
| ネム | pauseにはreturn timeを付ける。疲れた状態のyesを後で見直せる。 |
| クロオリ | scope / audience / permissionを明確に。privacyをaccountability回避にしない。 |
| カナメ | helpを約束する前にbody / space / tool / fatigueを確認。力任せ万能にしない。 |
| カスミ | provisional draftから自分のchoiceを見つける。revisionで意思表示を逃げない。 |
| トキ | baselineとexception ruleを持つ。consistency = fairnessではない。 |
| ツムギ | unfinishedでもhandoff可能な範囲を決める。全部作り直さず部分修復。 |
| レン | confidenceを含めてdecisionにする。counterexampleで更新可能。 |

## Future15 highlights

Future15は情報が増えてもCurrent21へ昇格しない。

| Character | Decision / commitment identity |
|---|---|
| ヒヨリ | livelyなinviteでもdecline optionと他人のpaceを確認する。 |
| セリカ | polished planを作れるがownerを奪わない。 |
| クロエ | long-livedでも現在の人間関係・制度をold precedentで支配しない。 |
| レンジ | masterへのdeferenceと自分のdecisionを分ける。 |
| トウマ | authorshipとrecipient choiceの両方を残す。 |
| クウ | trained cue / routineはHuman promiseではない。 |
| ヨモ | repeated home routineはloyalty oathではない。 |
| ノア | system requestとpersonal commitmentを分ける。processing speed = instant decisionではない。 |
| ルム | fleet policy / shared memory / instance consentを分ける。 |
| マキ | 「今決める必要があるか」自体を判断する。 |
| スズ | presentation / label変更をbetrayalやidentity inconsistencyにしない。 |
| イオ | actionへcommitしてもpersonal categoryはOpenのままでよい。 |
| カイ | fast start後にreversible decision。ナオのconsentを代弁しない。 |
| ナオ | perfect certaintyを待ちすぎずgood-enough entryを作る。 |
| アマネ | access / help / routeを具体的に選ぶ。independence testにしない。 |

## Broken promise is not automatic betrayal

約束が壊れる理由は複数ある:

- new information
- route / access change
- capacity misread
- illness / fatigue without moral judgment
- owner preference changed
- wrong audience / permission
- old rule became invalid
- deadline estimate failed
- someone said yes under pressure
- system and personal intent differed

Character差は**破らないことだけでなく、破った後のrepair**に出す。

Good repair:
- affected personへ先に連絡
- scopeを狭める
- taskをredistribute
- accessを戻す
- estimateを更新
- credit / ownershipを返す
- apologyだけでなくenvironment / actionを変える
- もっと大きい約束で埋め合わせない

## Representation guards

- Kaname body size does not make him automatic dependable protector.
- Hana/Gen age does not define stubbornness or reliability.
- Hiyori/Touma skin tone does not define loyalty/community duty.
- Suzu presentation does not define accommodation/indecision.
- Io gender status does not become commitment reveal device.
- Amane wheelchair use does not make decisions caregiver-mediated.
- Noa/Rum artificial status does not mean perfect obedience/commitment.
- Kuu/Yomo do not receive Human promise morality.
- Kai/Nao do not share twin consent.

## Production boundary

No automatic connection to:
- affection points
- quest deadlines
- NPC AI
- runtime leadership
- marriage/romance flags
- betrayal flags
- save-state promises

`runtimeAutoPromotionAllowed = false`

Future Author DB candidate dimension:
`decisionCommitment`

Guiding principle:

> **信頼は「一度も約束を破らないこと」だけではなく、約束を変えざるを得ない時に相手を置き去りにしないことでも育つ。**
