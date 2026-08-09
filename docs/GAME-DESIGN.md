# ヨルノシルベ Game Design Coverage Hub

Date: 2026-07-29  
Status: **CURRENT DESIGN COVERAGE / DESIGN-MASTER PASS COMPLETE, EVIDENCE PASS OPEN**

> 目的: 「設計がある」「runtimeへ実装された」「実機で気持ちいい」「release可能」を混同しない。
>
> Game identityは `game-core-book-v1.md`。Play experienceは `PLAY-EXPERIENCE.md`。Character/Story統合は `CHARACTER-STORY-INTEGRATION.md`。

---

# 1. Status vocabulary

| Status | 意味 |
| --- | --- |
| **CURRENT** | Current masterがあり通常設計の前提にできる |
| **CURRENT-DIRECTION** | 方針はCurrent。exact数値/内容はtest後に調整可能 |
| **CURRENT-BASELINE** | releaseへ向けた最低契約。platform実装証跡は別 |
| **CURRENT-PRODUCTION** | runtime / production data側のCurrent |
| **PARTIAL** | masterはあるがscope全体の実装/検証に穴がある |
| **OPEN** | 意図的に未決定 |
| **LATER** | Core完成後でよい |

重要:

```txt
CURRENT DESIGN
≠ runtime implemented
≠ device verified
≠ fun proven
≠ release ready
```

---

# 2. Current design coverage

| Domain | Status | Current master | 現在地 |
| --- | --- | --- | --- |
| Game identity / core | **CURRENT** | `game-core-book-v1.md` | Run / Meta / Attachment loop、Gameplay-first固定 |
| Play experience hub | **CURRENT** | `PLAY-EXPERIENCE.md` | Combat〜Postgameまで一本化 |
| Character | **CURRENT** | `CHARACTERS.md`, `character-book-v4.md`, `character-deep-core-book-v1.md` | Current21を21/21、Future15を別reservoirで15/15 |
| Character/Story/Gameplay integration | **CURRENT** | `CHARACTER-STORY-INTEGRATION.md` | voice / relation / 黒耀化 / enemy / dawn payoffを接続 |
| Story / Mystery | **CURRENT** | `STORY.md`, `story-book-v1.md`, `story-main-beat-sheet-v1.md` | Happy End、C/B/A mystery debt。Main Mystery最終回答はOPEN |
| Bond / Support | **CURRENT** | `BOND.md`, `RELATIONSHIPS.md` | gameplay一次報酬、Current21 relation coverage >=2 |
| 黒耀化 | **CURRENT** | `BLACK-YOUKA.md`, `character-black-youka-rescue-book-v1.md` | 21/21 wrong arrival + rescue choice direction |
| Enemy / Kagemono | **CURRENT** | `ENEMIES.md`, `kagemono-collection-entry-book-v1.md` | Current48 identity + encounter/re-reading 48/48 |
| Combat / Run pacing | **CURRENT-DIRECTION** | `COMBAT-RUN-DESIGN.md` | Stage1 8min baseline継承、final balance未LOCK |
| Stage / Encounter | **CURRENT-DIRECTION** | `STAGE-ENCOUNTER-DESIGN.md`, `stage-encounter-expansion-06-20-v1.md` | gameplay identity 20/20。exact wave / boss / tuning OPEN |
| First Run | **CURRENT-DIRECTION** | `FIRST-RUN-EXPERIENCE.md` | TOP→2run目hookまで一本化。初見Human test未実施 |
| Mobile Control | **CURRENT-DIRECTION** | `MOBILE-CONTROL-EXPERIENCE.md` | current floating-anchor dragと整合。physical tuning OPEN |
| Difficulty / Player Aid | **CURRENT-DIRECTION** | `DIFFICULTY-AND-PLAYER-AIDS.md` | HP sponge-first禁止、StoryをHardで塞がない |
| Meta Economy | **CURRENT-DIRECTION** | `META-ECONOMY-DESIGN.md` | currency family / source-sink / respec / anti-grind shape定義。価格OPEN |
| Clear Getter / Archive | **CURRENT-DIRECTION** | `GAMEPLAY-META-PROGRESSION.md`, `PROGRESSION-ARCHIVE.md` | next-run gameplayとして成立。盤面数値OPEN |
| Postgame / Endgame | **CURRENT-DIRECTION** | `POSTGAME-ENDGAME-DESIGN.md` | Happy End後のmastery/challenge方向。Endless/NG+はOPEN |
| Audio / Haptic creative | **CURRENT-DIRECTION** | `AUDIO-HAPTIC-DIRECTION.md` | quiet-night hierarchy、U49 technical gateと分離 |
| Accessibility | **CURRENT-BASELINE** | `ACCESSIBILITY-BASELINE.md` | touch / typography / multimodal / reduced motion / semantics。platform evidence OPEN |
| Fun / Balance Playtest | **CURRENT** | `FUN-BALANCE-PLAYTEST.md` | 観測frameworkあり。合格thresholdはHuman data後 |
| Save / AppFlow / ownership | **CURRENT-PRODUCTION** | `unity-runtime-ownership-contract-v1.md` | implementation boundary強い |
| Stage1 runtime gameplay | **CURRENT-PRODUCTION / VERIFIED SCOPE** | U47 docs/evidence | current implementation exists; new design passは未接続 |
| Visual / UI | **CURRENT-SEPARATE-TRACK** | Heavy Design docs | Play DesignとVisual approvalを分離 |
| U49 audio/haptic engineering | **CURRENT-ENGINEERING / BLOCKED** | U49 docs/evidence | physical-device evidence待ち |
| U50 performance/touch | **CURRENT-ENGINEERING / NEXT** | U50 roadmap | thresholds実測待ち |

---

# 3. What changed in this design pass

以前OPEN/PARTIALだった以下にCurrent masterを追加した。

```txt
Combat / Run
→ COMBAT-RUN-DESIGN.md

Stage1–5
→ STAGE-ENCOUNTER-DESIGN.md

Stage6–20
→ stage-encounter-expansion-06-20-v1.md

First session
→ FIRST-RUN-EXPERIENCE.md

Mobile input
→ MOBILE-CONTROL-EXPERIENCE.md

Difficulty
→ DIFFICULTY-AND-PLAYER-AIDS.md

Meta economy
→ META-ECONOMY-DESIGN.md

Postgame
→ POSTGAME-ENDGAME-DESIGN.md

Creative audio/haptic
→ AUDIO-HAPTIC-DIRECTION.md

Accessibility
→ ACCESSIBILITY-BASELINE.md

Fun/balance measurement
→ FUN-BALANCE-PLAYTEST.md
```

したがって今の問題は「設計書がない」ではなく、**designをruntime / device / Human playtestで証明していないこと**。

---

# 4. Combat / Run current direction

Stage1 8分は既存U33 baselineをreferenceにする。

```txt
0:00–0:30   basic kill / movement
0:30–2:00   first growth
2:00–4:00   build identity
4:00–6:00   pressure
6:00–7:30   Evolution / Rare / 黒耀化
7:30–8:00   completed-build clear push
```

重要:

> 最後30〜90秒を「まだbuildを作る時間」ではなく「作ったbuildを使う時間」にする。

Exact spawn / level / timingはplaytest targetでありfinal lockしない。

---

# 5. 20-stage differentiation

20Stageすべてにprimary gameplay identityを定義済み。

| Stage | Identity |
| ---: | --- |
| 1 | pickup / owner |
| 2 | label / visibility |
| 3 | seal / reopen |
| 4 | route / reroute |
| 5 | repair / scar |
| 6 | lane / guide line |
| 7 | split / distribute |
| 8 | helper / summon placement |
| 9 | slow pressure / safe zone |
| 10 | persistent field / preserve |
| 11 | delayed threat |
| 12 | scout / reveal / act |
| 13 | unknown / classify later |
| 14 | gate open / close |
| 15 | forecasted variance / rewrite |
| 16 | fold / unfold / close-range risk |
| 17 | fade / trace / debuff |
| 18 | angle / direction |
| 19 | blank slot / late commitment |
| 20 | Core5 integrated recall |

まだ未LOCK:
- exact waves
- boss assignment
- shadow `kage1..4` identity mapping
- difficulty numbers
- runtime mechanics

---

# 6. First Run contract

First sessionは世界説明より先に:

```txt
move
→ auto attack
→ kill
→ fragment
→ LevelUp
→ visible growth
→ pressure
→ power spike
→ Result
→ Meta / Clear Getter
→ second run hook
```

を理解する。

Tutorial modalを増やさない。

---

# 7. Mobile control contract

Current runtimeのfloating-anchor dragを正式方向として採用。

Baseline implementation:
- movement start area = left-lower area
- dead zoneあり
- analog magnitude
- UI pointer優先
- keyboard fallback

Exact current ratiosはruntime baseline。
Final comfortはphysical-deviceで調整。

---

# 8. Difficulty contract

Hardの優先順:

```txt
direction
→ pattern overlap
→ controller
→ spatial pressure
→ timing
→ speed/contact
→ HP modestly
```

禁止:
- HP spongeを主難化
- Main StoryをHard gate
- Assist使用でStory/rewardを不当に剥奪

---

# 9. Meta economy contract

Current shape:
- core meta currency = 原則1family
- raw powerよりplay variety / comfort
- refund/respec可能方向
- Bondをcurrency購入しない
- fail-forwardはあるがDefeat farming最適化禁止
- daily / stamina / FOMOなし

未LOCK:
- currency name
- reward amount
- price curve
- cap
- exact stat caps

---

# 10. Postgame contract

```txt
Story Complete
= Happy End

Postgame
= mastery / alternate build / challenge / optional lore

100%
= completionist celebration
```

100%でTrue Endingを人質にしない。
Endless / NG+はCandidate。

---

# 11. Audio / Haptic contract

Creative hierarchy:

```txt
ambient
< normal combat
< LevelUp / elite
< Evolution
< 黒耀化
< Boss defeat / Dawn
```

静けさをbudgetとして使う。

Hapticは:
- movement / normal attackへ常用しない
- Evolution / 黒耀化 / major completionへ価値を残す

U49のtechnical readinessとは別。

---

# 12. Accessibility baseline

Minimum Current:
- color only禁止
- audio only禁止
- haptic only禁止
- motion only禁止
- sufficient touch target direction
- typography floor
- reduced motion
- flashing restraint
- semantic order
- icon-only accessible name direction

Platform-specific implementation/evidenceは別。

---

# 13. Fun / Balance evidence gate

Technical U50だけでは「面白い」を証明しない。

観測:
- first input
- first kill
- first pickup
- first LevelUp
- LevelUp intervals
- kills/min
- build completion
- evolution time
- 黒耀化 usage
- death / clear
- retry / second-run intent
- build diversity
- Character / Support usage

Human markers:
- delight
- confusion
- boredom
- good panic
- bad panic
- power spike
- retry desire

ThresholdはHuman data後にlock。

---

# 14. Remaining actual gaps

設計の大穴ではなく**evidence / implementation gap**が中心。

## P0 — Human/device proof

1. current Stage1 baselineを最新buildで触る
2. first-run comprehension
3. physical mobile control comfort
4. combat telemetry
5. Stage1 fun tuning
6. build diversity observation

## P0 — Runtime connection

- design changesを必要な範囲だけDefinition/runtimeへ接続
- Story / Bond / Stage mechanicsを一気に全部実装しない
- Stage1でvertical proofしてから横展開

## P1 — Stage implementation

- Stage2〜5 mechanic prototype
- Stage6〜20はlaunch scopeに応じて段階導入
- exact Boss placement Human decision

## P1 — Product systems

- Meta price/reward numbers
- difficulty modifiers
- postgame content count
- platform accessibility evidence
- creative audio/haptic Human review

## OPEN by design

- Main Mystery final answer
- exact romance facts
- all black-youka names final
- Shadow `kage1..4` mapping
- Endless
- NG+
- sequel structure

---

# 15. Design completeness verdict

## Design-master coverage

**Large-scale design master pass: substantially complete.**

主要domainにCurrent entrypointがある。

## Product completeness

**Not complete.**

理由:
- new design direction未実装箇所あり
- physical-device U49 blocked
- U50 metrics未完
- Human fun/balance evidence未取得
- Stage mechanics未prototype多数

したがって:

> **設計不足を埋める段階から、既存設計を実装・実機・playtestで削って証明する段階へ移行した。**

---

# 16. Next work order

```txt
1. U49 physical-device evidence
2. latest Stage1 baseline playtest/capture
3. First Run + Mobile Control Human review
4. Fun telemetry / observation
5. Stage1 tuning
6. Stage2–5 mechanic prototype
7. U50 performance/touch
8. difficulty/economy numbers
9. Stage6–20 rollout by launch scope
10. U51 RC
```

ただしU49/U50/U51のengineering authorityをこのdesign docで上書きしない。

---

# 17. Machine-readable state

- `docs/design-targets/generated/play-experience-design-coverage-v1.json`
- `docs/design-targets/generated/character-story-integration-coverage-v1.json`

---

# 18. 一文

> **ヨルノシルベは今、アイディアを足して完成へ近づく段階ではなく、すでに作ったRun・Character・Stage・Metaの設計を実機で触り、不要なものを削り、数字を調整して「本当にもう1runしたい」を証明する段階に入った。**