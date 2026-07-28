# ヨルノシルベ Play Experience Hub

Date: 2026-07-29  
Status: **CURRENT PLAY-EXPERIENCE ENTRYPOINT / RUNTIME & PLAYTEST EVIDENCE SEPARATE**

> Character / Storyではなく「触って面白いゲームとしてどう仕上げるか」を扱う時はここから入る。

---

# 1. Read order

```txt
CANON.md
↓
game-core-book-v1.md
↓
GAME-DESIGN.md
↓
PLAY-EXPERIENCE.md
├ COMBAT-RUN-DESIGN.md
├ STAGE-ENCOUNTER-DESIGN.md
├ stage-encounter-expansion-06-20-v1.md
├ FIRST-RUN-EXPERIENCE.md
├ MOBILE-CONTROL-EXPERIENCE.md
├ DIFFICULTY-AND-PLAYER-AIDS.md
├ META-ECONOMY-DESIGN.md
├ POSTGAME-ENDGAME-DESIGN.md
├ AUDIO-HAPTIC-DIRECTION.md
├ ACCESSIBILITY-BASELINE.md
└ FUN-BALANCE-PLAYTEST.md
```

---

# 2. What is Current now

## Run
- weak → build → pressure → answer → power spike → completed build → dawn
- Stage1 existing 8min baselineをplaytest targetとして利用
- exact final balanceは未LOCK

## Stage
- Stage1〜20すべてにprimary gameplay identityあり
- exact wave / boss placement / tuningはOPEN

## First session
- 最初の10秒で移動
- 自動攻撃を体験で理解
- first LevelUp
- first visible growth
- Defeat/Clearどちらでも次run hook

## Mobile control
- current floating-anchor dragを正式方向として採用
- current runtime baselineと一致
- physical-device tuning open

## Difficulty
- HP spongeよりdirection / pattern / overlap / telegraph pressure
- Main StoryをHardで塞がない

## Meta
- core currency原則1family
- raw powerよりplay variety / comfort
- respec可能方向
- anti-grind / anti-FOMO

## Postgame
- Main Endingは本編で完結
- postgame = alternate play / mastery / challenge / hidden build
- 100%でTrue Endingを人質にしない

## Audio/Haptic
- quiet night → small certainty
- hapticをrare resourceとして使う
- U49 technical readinessとは別

## Accessibility
- critical infoを1channelだけへ置かない
- touch / typography / reduced motion / flash / semantic orderのbaseline

## Fun metrics
- technical U50とは別
- first kill / first LevelUp / build / clear / retry desireを観測

---

# 3. The playable chain

```txt
TOP
↓
Stage Select
↓
指を置いて動く
↓
auto attack
↓
ほどく
↓
fragment
↓
LevelUp
↓
build identity
↓
Stage pressure
↓
Support / movement / buildで回答
↓
Evolution / 黒耀化
↓
completed build
↓
Dawn / Defeat
↓
Result
↓
Meta / Clear Getter
↓
next run
```

この鎖に返らない追加機能は優先度を下げる。

---

# 4. Design complete vs product complete

Design masterが存在することとproduct readyは別。

```txt
Design Current
≠ Runtime Implemented
≠ Device Verified
≠ Fun Proven
≠ Release Ready
```

特に:
- exact balance
- physical touch feel
- actual audio/haptic
- first-time comprehension
- build diversity
- Stage identity recognition

はHuman/device playtestが必要。

---

# 5. What should NOT be designed further by default

新しく増やす前に止まる:
- extra currency
- extra button
- extra tutorial screen
- extra difficulty
- extra rarity
- extra permanent stat tree
- extra Stage mechanic layered on top

まず既存Coreをtestする。

---

# 6. Next implementation order

Design→Runtimeへ進める時の推奨順:

```txt
1. current Stage1 baseline capture
2. first-run flow audit
3. mobile input physical test
4. combat/run telemetry hooks
5. Stage1 fun tuning
6. Stage2〜5 mechanic prototype
7. Stage6〜20 vertical mechanic prototypes as needed
8. difficulty variants
9. meta economy numbers
10. postgame content count
```

U49/U50/U51のengineering gateを勝手に飛ばさない。

---

# 7. Human review order

Humanへ一度に全部聞かない。

優先:
1. 操作は気持ちいいか
2. 敵を倒すのは気持ちいいか
3. LevelUpは嬉しいか
4. buildが変わったか
5. 8分の間に退屈したか
6. Stageの違いを感じるか
7. もう一回したいか

Story細部はその後でもよい。

---

# 8. Machine-readable memory

- `docs/design-targets/generated/play-experience-design-coverage-v1.json`

---

# 9. 一文

> **ヨルノシルベの次の品質課題はアイディア不足ではなく、すでにあるCoreを実機で触り、弱い→強い→危険→回答→朝→もう一回、の連鎖が本当に気持ちいいか証明すること。**