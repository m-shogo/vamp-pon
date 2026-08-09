# ヨルノシルベ Collection Economy Terminology Review

Date: 2026-07-29  
Status: **CURRENT CONCEPT SEPARATION / ACTUAL RUN COUNTER CONNECTED / CANDIDATE OBJECT LINKED / CURRENT FORMATTER PARTIAL / DISPLAY RENAMING NOT APPROVED**

> `黒曜片`、`灯貨`、`記憶片`、`黒耀化`は別概念として扱う。
>
> save IDを変えず、実カウンター・候補object接続・黒耀化表記・Current表示formatterの土台まで安全に接続した。

---

# 1. Current concepts

## Persistent meta currency

```txt
storage:
  PlayerProfile.currency
  PlayerProfile.totalCurrencyEarned

runtime:
  RunSettlement.currencyEarned
  RunSettlement.achievementReward
  NightBoardReward.type = light_coin
  UpgradeId = currencyGain

Current display:
  黒曜片
```

Properties:

- persistent
- spendable
- exploration, achievement and Clear Getter rewards increase it
- upgrades consume it
- upgrade reset refunds it
- display name still requires Human review

## Run memory fragment

```txt
RuntimeStats.memoryFragmentsCollected
pickup: memory_fragment
Current display: 記憶片
```

Properties:

- run-only XP pickup
- not persistent
- not directly spendable
- not a wallet alias

## Stage1 one-run counter

```txt
cell: fs_019_collect_100_light_coin
source: RunSettlement.currencyEarned
transient field: earnedMetaCurrencyThisRun
threshold: 100
visible word: 灯貨
```

Excluded:

```txt
profile.currency
PlayerProfile.totalCurrencyEarned
RunSettlement.achievementReward
memoryFragmentsCollected direct read
```

Removed proxy:

```txt
kills * 0.35 + memoryFragmentsCollected * 0.7 >= 100
```

The counter is real-tracked but is not a second wallet.

## 黒耀化

```txt
RuntimeStats.berserkUses
UpgradeId = noBerserkBonus
```

It is a battle/story mechanic, not currency.

---

# 2. Stable concept contract

Source:

- `src/game/data/collectionEconomyTerminology.ts`

```txt
economy:meta_upgrade_currency
economy:run_memory_fragment
economy:prototype_light_coin_counter
mechanic:black_youka
```

The prototype-named ID remains for compatibility; its implementation no longer uses a proxy.

Rules:

1. One runtime ID belongs to one concept.
2. Similar display words do not merge concepts automatically.
3. Stable save fields are not renamed for UI cleanup.
4. Current wallet balance and achievement rewards cannot complete `fs_019`.
5. `記憶片` remains run-only.
6. `黒耀化` remains outside the economy model.

---

# 3. Current display formatter

Source:

- `src/game/data/metaCurrencyDisplay.ts`

Current formatter reads the display label from:

```txt
economy:meta_upgrade_currency.currentDisplayLabels[0]
```

Available functions:

```txt
currentMetaCurrencyDisplayName
formatMetaCurrencyAmount
formatMetaCurrencyGain
formatMetaCurrencyReturn
```

Currently connected surfaces:

```txt
Collection Clear Getter reward label
Collection achievement-section description
```

Current output remains:

```txt
黒曜片
```

The formatter does not adopt `灯貨` before Human approval.

Remaining raw display surfaces include:

- StageSelect balance
- StageSelect insufficient-funds message
- StageSelect reset/refund message
- Result presentation
- first-run overlay guidance
- other HUD or summary text discovered during the final sweep

These should move atomically after formatter coverage and visual review, not by global replacement.

---

# 4. くすんだ灯貨

Source:

- `src/game/data/lostItemRecords.ts`

```txt
lost-dull-light-coin
→ fs_019_collect_100_light_coin
→ economy:meta_upgrade_currency
```

Boundary:

```txt
connectionStatus        = REVIEW_REQUIRED
economyConnectionStatus = HIGH_VALUE_CANDIDATE_RELATED_NOT_CANONICAL
relatedKeeperId         = undefined
```

The object is no longer orphaned, but it does not establish the wallet display name or an owner.

---

# 5. High-value future candidate

```txt
Persistent wallet display = 灯貨
Legacy display alias       = 黒曜片
Status                     = HIGH-VALUE CANDIDATE / NOT CURRENT
```

Completed prerequisites:

- stable wallet fields preserved
- internal `light_coin` preserved
- actual per-run counter connected
- old proxy removed
- achievement and wallet-balance exclusions tested
- `くすんだ灯貨` candidate relation connected
- one shared Current formatter created
- two Collection surfaces connected

Remaining before promotion:

1. migrate every active wallet surface through the formatter
2. preserve `黒曜片` in a Legacy display alias ledger
3. produce save / purchase / refund / reward round-trip evidence
4. complete visual review
5. decide canonical owner/origin of `くすんだ灯貨`
6. obtain Human naming approval

Forbidden shortcuts:

- global string replacement
- renaming `PlayerProfile.currency`
- partial screen-only promotion
- treating memory fragments as wallet currency
- including achievements in the one-run counter
- promoting candidate relations to Canon automatically

---

# 6. 黒耀化 repairs completed

Without changing IDs, rewards, costs or multipliers:

```txt
4 no-berserk achievement descriptions → 黒耀化
UPGRADE_DEFS category                 → 黒耀化
noBerserkBonus description            → 黒耀化
Collection keeper header              → 黒耀化 at runtime
```

The keeper-header normalizer changes only the exact known Legacy sentence. It does not rewrite Enemy names, `黒曜片`, `黒曜研究所` or `くすんだ灯貨`.

---

# 7. Verification files

```txt
src/game/data/collectionEconomyTerminology.test.ts
src/game/data/metaCurrencyDisplay.test.ts
src/game/persistence/__tests__/profileRunCurrencyTracking.test.ts
src/game/systems/collectionProgressRunCurrency.test.ts
src/game/data/lostItemEconomyConnection.test.ts
src/game/ui/collectionAtlasSceneHooks.test.ts
scripts/quality/check-named-object-registry.ts
scripts/quality/check-unity-term-lock.ts
```

Contracts include:

- 99 fails / 100 passes
- settlement amount equals the transient counter
- achievement rewards are excluded
- a large existing wallet cannot complete `fs_019`
- actual Collection settlement can complete `fs_019`
- formatter label comes from the Current concept
- dull light coin remains candidate-not-canonical
- old proxy is forbidden

Current-head execution evidence is still required because GitHub Actions stops before repository steps begin.

---

# 8. Remaining terminology debt

- `黒曜片` display decision remains unapproved.
- `黒曜研究所` facility title remains a separate naming review.
- formatter coverage is partial, not global.
- `くすんだ灯貨` has no canonical owner/origin.
- visual and save round-trip evidence is incomplete.

---

# 9. Readiness boundary

This work does not promote:

- canonical `灯貨` wallet display
- production Collection save v2
- global constellation readiness
- `全灯の朝`
- U49
- U50
- RC
- production approval

U49 remains `BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE`.

---

# 10. One sentence

> **Stage1の灯貨札は実精算額だけを読み、くすんだ灯貨も候補としてつながり、Currentの黒曜片表示は単一formatterへ寄せ始めたが、灯貨への正式改名は全画面・save証跡・Human reviewまで行わない。**
