# ヨルノシルベ Collection Economy Terminology Review

Date: 2026-07-29  
Status: **CURRENT CONCEPT SEPARATION / ACTUAL RUN COUNTER CONNECTED / CANDIDATE OBJECT LINKED / DISPLAY RENAMING NOT APPROVED**

> `黒曜片`、`灯貨`、`記憶片`、`黒耀化`は、字面が近くても別概念として扱う。
>
> save IDを変えず、Stage1札の実カウンター、くすんだ灯貨の候補接続、黒耀化の現役表記だけを安全に直した。

---

# 1. Current runtime facts

## 1.1 永続強化資源

```txt
storage:
  PlayerProfile.currency
  PlayerProfile.totalCurrencyEarned

runtime:
  RunSettlement.currencyEarned
  RunSettlement.achievementReward
  NightBoardReward.type = light_coin
  UpgradeId = currencyGain

current display:
  黒曜片
```

Properties:

- persistent
- spendable
- exploration settlement increases it
- achievements and Clear Getter rewards may also increase it
- upgrades consume it
- upgrade reset refunds it

The display name remains under Human review. Stable fields and internal IDs are unchanged.

## 1.2 記憶片

```txt
RuntimeStats.memoryFragmentsCollected
pickup: memory_fragment
```

Properties:

- run-only XP pickup
- contributes to LevelUp
- not a wallet
- not persistent
- not directly spendable
- not an alias for `PlayerProfile.currency`

## 1.3 Stage1「灯貨あつめ」counter

Stable cell:

```txt
fs_019_collect_100_light_coin
```

Current flow:

```txt
settleRunProgress
→ RunSettlement.currencyEarnedを確定
→ earnedMetaCurrencyThisRunへ一時記録
→ settleCollectionProgress
→ earnedMetaCurrencyThisRun >= 100を判定
```

Current counter source:

```txt
RunSettlement.currencyEarned
```

Explicitly excluded:

```txt
profile.currency
PlayerProfile.totalCurrencyEarned
RunSettlement.achievementReward
RuntimeStats.memoryFragmentsCollectedの直接参照
```

Removed proxy:

```txt
kills * 0.35 + memoryFragmentsCollected * 0.7 >= 100
```

The counter is now real-tracked but transient. It is not a second wallet and is not persisted.

The visible word `灯貨` remains pending Human naming review.

## 1.4 黒耀化

```txt
RuntimeStats.berserkUses
UpgradeId = noBerserkBonus
```

Properties:

- battle/story mechanic
- not currency
- not an alias for `黒曜片`

---

# 2. Machine-readable concept contract

Source:

- `src/game/data/collectionEconomyTerminology.ts`

Concept IDs:

```txt
economy:meta_upgrade_currency
economy:run_memory_fragment
economy:prototype_light_coin_counter
mechanic:black_youka
```

The third stable ID remains for compatibility. Its implementation is no longer a proxy.

Rules:

1. A runtime ID belongs to only one concept.
2. `profile.currency` and `NightBoardReward.type:light_coin` belong to the persistent resource.
3. `記憶片` remains run-only and non-spendable.
4. `fs_019` reads only the settled current-run amount.
5. Current wallet balance and achievement rewards cannot complete `fs_019`.
6. `黒耀化` remains outside the economy model.
7. Similar display words never cause automatic merging.
8. Stable save fields are not renamed for cosmetic cleanup.

---

# 3. くすんだ灯貨

Active source:

- `src/game/data/lostItemRecords.ts`

Current links:

```txt
lost-dull-light-coin
→ fs_019_collect_100_light_coin
→ economy:meta_upgrade_currency
```

Current boundary:

```txt
connectionStatus        = REVIEW_REQUIRED
economyConnectionStatus = HIGH_VALUE_CANDIDATE_RELATED_NOT_CANONICAL
relatedKeeperId         = undefined
```

This means:

- the named object is no longer orphaned
- it is tied to the actual run-earned record
- it is tied to the persistent-currency naming discussion
- it does not make `灯貨` the Current wallet name
- it does not invent a keeper/owner
- it does not change save data

---

# 4. High-value display candidate

Status: **HIGH-VALUE CANDIDATE / NOT CURRENT DISPLAY AUTHORITY**

```txt
Persistent meta currency display = 灯貨
Legacy display alias              = 黒曜片
```

Why it remains strong:

- `くすんだ灯貨` is now semantically connected.
- `灯貨あつめ` uses the actual current-run settlement amount.
- `灯` is central to the world language.
- it reduces confusion between `黒曜片` and `黒耀化`.
- it reads naturally in purchase/refund UI.

Completed prerequisites:

- `PlayerProfile.currency` preserved
- `totalCurrencyEarned` preserved
- internal `light_coin` preserved
- actual per-run counter connected
- old proxy removed
- achievement rewards excluded
- wallet balance excluded
- `くすんだ灯貨` candidate relation connected
- counter/unit/integration tests added

Remaining before promotion:

1. one formatter for every persistent-currency display
2. atomic migration of StageSelect, Result, Collection reward and reset UI
3. Legacy display alias ledger for `黒曜片`
4. full save / purchase / refund / reward round-trip evidence
5. visual review
6. Human naming approval
7. canonical owner/origin decision for `くすんだ灯貨`

Forbidden shortcuts:

- global string replacement
- renaming `PlayerProfile.currency`
- changing only some screens
- treating memory fragments as wallet currency
- including achievement rewards in the one-run counter
- promoting `くすんだ灯貨` from candidate relation to Canon automatically

---

# 5. Active terminology repairs completed

## Achievements

```txt
no-berserk:s1:shallow
no-berserk:s1:middle
no-berserk:s1:deep
no-berserk:s2:shallow
```

Descriptions now use `黒耀化` without changing IDs, conditions or rewards.

## Upgrade definitions

```txt
UPGRADE_DEFS category: 黒曜化 → 黒耀化
noBerserkBonus text:   黒曜化未使用 → 黒耀化未使用
```

Upgrade IDs, cost curves and multipliers are unchanged.

## Collection keeper header

Legacy source sentence:

```txt
灯名・黒曜・朝明・欠けた心を、絵札として残す頁。
```

Current runtime sentence:

```txt
灯名・黒耀化・朝明・欠けた心を、絵札として残す頁。
```

Implementation:

- pure exact-string normalizer in `src/game/data/collectionDisplayTerms.ts`
- runtime tree application in `src/game/ui/collectionAtlasSceneHooks.ts`
- no replacement of `黒曜片`, `黒曜研究所`, Enemy names or `くすんだ灯貨`
- no full-file replacement of `CollectionScene.ts`

---

# 6. Verification contracts added

```txt
src/game/data/collectionEconomyTerminology.test.ts
src/game/persistence/__tests__/profileRunCurrencyTracking.test.ts
src/game/systems/collectionProgressRunCurrency.test.ts
src/game/data/lostItemEconomyConnection.test.ts
src/game/ui/collectionAtlasSceneHooks.test.ts
scripts/quality/check-named-object-registry.ts
scripts/quality/check-unity-term-lock.ts
```

Covered:

- 99 is below target; 100 completes
- transient counter equals `currencyEarned`
- achievement reward is excluded
- large wallet balance does not complete the one-run condition
- actual Collection settlement completes `fs_019`
- old proxy expression is forbidden
- dull light coin remains candidate-not-canonical
- only the exact keeper header is normalized

Current-head execution evidence is still required because GitHub Actions has been stopping before step execution.

---

# 7. Remaining terminology debt

- StageSelect still uses established `黒曜片` display.
- StageSelect still uses facility title `黒曜研究所`.
- Persistent display migration has no Human approval.
- `くすんだ灯貨` has no canonical owner/origin yet.
- A single cross-screen currency formatter is not connected.

These are separate from the completed 黒耀化 typo repair and actual run-counter connection.

---

# 8. Readiness boundary

This work does not claim:

- canonical `灯貨` wallet display
- production Collection save v2
- global constellation readiness
- `全灯の朝` readiness
- U49 completion
- U50 or RC readiness

U49 remains `BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE`.

---

# 9. One sentence

> **Stage1の灯貨札は精算済みの今回獲得額だけを読み、くすんだ灯貨も候補関係として接続されたが、永続通貨の表示名を灯貨へ変える判断は全画面移行・save証跡・Human reviewまで保留する。**
