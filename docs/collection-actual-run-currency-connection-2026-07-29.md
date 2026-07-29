# ヨルノシルベ Collection Actual Run Currency Connection

Date: 2026-07-29  
Status: **ACTUAL RUN COUNTER CONNECTED / DULL LIGHT COIN CANDIDATE LINKED / DISPLAY NAME NOT APPROVED / CURRENT-HEAD TEST EXECUTION OPEN**

> この文書は、`docs/collection-economy-terminology-review-2026-07-29.md` と `docs/named-object-runtime-connection-core5-stage1-2026-07-29.md` のうち、`fs_019`、`くすんだ灯貨`、`UPGRADE_DEFS`、Collection灯し手headerに関する古い記述を更新するCurrent addendumである。

---

# 1. Result

```txt
fs_019 proxy formula                     = removed
actual settled run amount                = connected
transient field                          = earnedMetaCurrencyThisRun
threshold                                = 100
wallet balance read                      = no
achievement reward included              = no
memory fragments directly read           = no
くすんだ灯貨 → fs_019                    = connected
くすんだ灯貨 → meta currency concept     = candidate link connected
persistent display 黒曜片 → 灯貨          = not approved / not changed
UPGRADE_DEFS 黒耀化 wording              = repaired
Collection keeper header 黒耀化          = runtime normalization connected
save field / reward IDs                  = unchanged
U49 / U50 / RC readiness                 = unchanged
```

---

# 2. Actual per-run currency flow

Active sources:

- `src/game/data/collectionEconomyTerminology.ts`
- `src/game/persistence/profile.ts`
- `src/game/systems/collectionProgress.ts`

Runtime order:

```txt
MainScene.enterResult
→ settleRunProgress(state, cleared)
   → currencyEarnedを一度だけ計算
   → recordRunEarnedMetaCurrency(state.stats, currencyEarned)
   → profile.currencyへ加算
   → achievementRewardを別計算・別加算
→ settleCollectionProgress(state, cleared)
   → fs_019がearnedMetaCurrencyThisRun >= 100を読む
```

The Stage1 condition now uses the exact amount returned as:

```txt
RunSettlement.currencyEarned
```

It does not duplicate the reward formula inside Collection code.

---

# 3. What was removed

Previous predicate:

```txt
kills * 0.35 + memoryFragmentsCollected * 0.7 >= 100
```

Current predicate:

```txt
meetsStage1RunEarnedMetaCurrencyTarget(state.stats)
```

The old expression ignored:

- stage reward multiplier
- depth reward multiplier
- persistent currency-gain upgrade
- no-黒耀化 bonus
- first-clear bonus
- capsules
- evolutions
- elapsed time
- elite bonus
- player level

It also duplicated only part of the settlement formula. It is now forbidden by the term/contract checker.

---

# 4. Counter boundary

Transient runtime field:

```txt
earnedMetaCurrencyThisRun
```

Properties:

- initialized by absence as `0`
- normalized to non-negative integer
- written from the already-settled `currencyEarned`
- not stored in `PlayerProfile`
- not included in Collection save
- not a second wallet
- not lifetime total
- not current wallet balance

Explicit exclusions:

```txt
profile.currency
PlayerProfile.totalCurrencyEarned
RunSettlement.achievementReward
RuntimeStats.memoryFragmentsCollected (direct read)
```

A player with a large existing wallet does not complete the one-run condition unless the current run itself earns at least 100.

---

# 5. Achievement reward ordering

`achievementReward` is calculated after `currencyEarned` is recorded in the transient counter.

Therefore:

```txt
profile.currency after result
= previous balance
+ currencyEarned
+ achievementReward
+ any newly claimed Collection rewards
```

but:

```txt
earnedMetaCurrencyThisRun
= currencyEarned only
```

This prevents a first-clear achievement bonus from making the one-run Stage1 counter pass accidentally.

---

# 6. くすんだ灯貨 connection

Active source:

- `src/game/data/lostItemRecords.ts`

Current links:

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

Meaning:

- it is no longer an orphan named object
- it is related to the actual one-run currency record
- it is related to the persistent currency naming candidate
- it does not establish `灯貨` as the Current wallet display
- it does not invent an owner
- it does not rename `PlayerProfile.currency`

---

# 7. 黒耀化 active wording repair

Active source:

- `src/game/persistence/profile.ts`

Repaired without changing upgrade IDs, costs, levels or multipliers:

```txt
UPGRADE_DEFS group union: 黒曜化 → 黒耀化
noBerserkBonus group:     黒曜化 → 黒耀化
noBerserkBonus text:      黒曜化未使用 → 黒耀化未使用
```

`黒曜片` remains unchanged because it is the current economy display pending a separate naming review.

---

# 8. Collection keeper header repair

Active sources:

- `src/game/data/collectionDisplayTerms.ts`
- `src/game/ui/collectionAtlasSceneHooks.ts`

Exact Legacy sentence:

```txt
灯名・黒曜・朝明・欠けた心を、絵札として残す頁。
```

Current runtime sentence:

```txt
灯名・黒耀化・朝明・欠けた心を、絵札として残す頁。
```

Implementation boundary:

- pure exact-string normalizer is Phaser-free
- Scene hook schedules normalization after the synchronous Collection render
- only the exact known header is changed
- `くろよオンブロ` is not changed
- `黒曜片` is not changed
- `黒曜研究所` is not changed
- `くすんだ灯貨` is not changed

The large `CollectionScene.ts` was not replaced.

---

# 9. Tests and static safeguards added

```txt
src/game/data/collectionEconomyTerminology.test.ts
src/game/persistence/__tests__/profileRunCurrencyTracking.test.ts
src/game/systems/collectionProgressRunCurrency.test.ts
src/game/data/lostItemEconomyConnection.test.ts
src/game/ui/collectionAtlasSceneHooks.test.ts
scripts/quality/check-named-object-registry.ts
scripts/quality/check-unity-term-lock.ts
```

Covered contracts:

- 99 does not complete, 100 completes
- settlement amount equals transient counter
- achievement reward is excluded
- wallet balance does not complete `fs_019`
- actual Collection settlement completes `fs_019`
- old proxy expression is forbidden
- dull light coin remains candidate-not-canonical
- keeper header normalizer changes only the exact Legacy sentence

These files exist on the branch, but current-head test execution evidence is still required.

---

# 10. Remaining economy/display decision

High-value candidate remains:

```txt
Persistent meta currency display = 灯貨
Legacy display alias              = 黒曜片
```

Not yet complete:

1. one display formatter used by every active wallet surface
2. StageSelect / Result / Collection reward / reset UI atomic migration
3. full purchase / refund / reward / save round-trip evidence on current HEAD
4. visual review
5. Human naming approval
6. canonical owner/origin decision for `くすんだ灯貨`

No partial screen-by-screen rename should be performed.

---

# 11. Readiness boundary

This pass does not promote:

- canonical `灯貨` wallet display
- production Collection save v2
- global constellation UI
- `全灯の朝`
- U49
- U50
- RC
- production approval

U49 remains `BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE`.

---

# 12. One sentence

> **Stage1の「灯貨を100集める」は、現在のwallet残高や撃破数proxyではなく、精算で確定した今回の獲得額だけを読むようになり、くすんだ灯貨も候補関係を保ったまま孤立を解消した。**
