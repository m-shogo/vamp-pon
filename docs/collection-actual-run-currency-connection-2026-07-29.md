# ヨルノシルベ Collection Actual Run Currency Connection

Date: 2026-07-29  
Status: **ACTUAL RUN COUNTER CONNECTED / DULL LIGHT COIN CANDIDATE LINKED / CURRENT FORMATTER PARTIAL / DISPLAY NAME NOT APPROVED / CURRENT-HEAD TEST EXECUTION OPEN**

> この文書は、`fs_019`、`くすんだ灯貨`、`UPGRADE_DEFS`、Collection灯し手header、永続通貨formatterのCurrent runtime addendumである。

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
Current persistent currency formatter    = created / 2 Collection surfaces connected
UPGRADE_DEFS 黒耀化 wording              = repaired
Collection keeper header 黒耀化          = runtime normalization connected
save field / reward IDs                  = unchanged
U49 / U50 / RC readiness                 = unchanged
```

---

# 2. Actual per-run currency flow

Sources:

- `src/game/data/collectionEconomyTerminology.ts`
- `src/game/persistence/profile.ts`
- `src/game/systems/collectionProgress.ts`

```txt
MainScene.enterResult
→ settleRunProgress
   → currencyEarnedを一度だけ計算
   → earnedMetaCurrencyThisRunへ記録
   → profile.currencyへ加算
   → achievementRewardを別計算・別加算
→ settleCollectionProgress
   → fs_019がearnedMetaCurrencyThisRun >= 100を読む
```

The Stage1 condition uses the exact value returned as:

```txt
RunSettlement.currencyEarned
```

Collection code does not duplicate the settlement formula.

---

# 3. Removed proxy

Previous:

```txt
kills * 0.35 + memoryFragmentsCollected * 0.7 >= 100
```

Current:

```txt
meetsStage1RunEarnedMetaCurrencyTarget(state.stats)
```

The removed expression ignored stage/depth multipliers, currency upgrades, first-clear bonus, no-黒耀化 bonus, capsules, evolutions, elapsed time, elite bonus and player level.

It is now forbidden by the static contract.

---

# 4. Counter boundary

```txt
field: earnedMetaCurrencyThisRun
type: transient non-negative integer
persistent: no
wallet: no
```

Excluded:

```txt
profile.currency
PlayerProfile.totalCurrencyEarned
RunSettlement.achievementReward
RuntimeStats.memoryFragmentsCollected direct read
```

Therefore:

```txt
profile.currency after result
= previous balance + currencyEarned + achievementReward + Collection rewards

but

earnedMetaCurrencyThisRun
= currencyEarned only
```

A large existing wallet or a first-clear achievement bonus cannot complete the one-run condition accidentally.

---

# 5. くすんだ灯貨

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

The object is no longer orphaned, but it does not establish `灯貨` as the Current wallet display and does not invent an owner.

---

# 6. Current persistent-currency formatter

Source:

- `src/game/data/metaCurrencyDisplay.ts`

The formatter reads:

```txt
economy:meta_upgrade_currency.currentDisplayLabels[0]
```

Functions:

```txt
currentMetaCurrencyDisplayName
formatMetaCurrencyAmount
formatMetaCurrencyGain
formatMetaCurrencyReturn
```

Current output remains:

```txt
黒曜片
```

Connected surfaces:

```txt
src/game/ui/collectionAtlasLabels.ts
  → Clear Getter light_coin reward text

src/game/data/collectionSections.ts
  → achievement-section description
```

The formatter was placed in the data layer so Collection data and UI depend on the same direction. A temporary UI-layer duplicate was removed.

Still not formatter-backed:

- StageSelect balance
- StageSelect insufficient-funds text
- StageSelect reset/refund text
- Result presentation
- first-run overlay guidance
- remaining HUD/summary surfaces found during the final sweep

This is **partial formatter coverage**, not a display migration.

---

# 7. 黒耀化 wording repair

Without changing IDs, costs, levels, rewards or multipliers:

```txt
UPGRADE_DEFS group union → 黒耀化
noBerserkBonus group     → 黒耀化
noBerserkBonus text      → 黒耀化未使用
4 no-berserk achievements → 黒耀化
```

`黒曜片` remains unchanged because it is a separate economy display decision.

---

# 8. Collection keeper header

Pure normalizer:

- `src/game/data/collectionDisplayTerms.ts`

Runtime hook:

- `src/game/ui/collectionAtlasSceneHooks.ts`

```txt
Legacy:  灯名・黒曜・朝明・欠けた心を、絵札として残す頁。
Current: 灯名・黒耀化・朝明・欠けた心を、絵札として残す頁。
```

Only the exact known sentence changes. Enemy names, `黒曜片`, `黒曜研究所` and `くすんだ灯貨` remain untouched.

The large `CollectionScene.ts` was not replaced.

---

# 9. Verification files added

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

Contracts:

- 99 fails / 100 passes
- settlement amount equals transient counter
- achievement reward excluded
- wallet balance excluded
- actual Collection settlement completes `fs_019`
- old proxy forbidden
- formatter uses Current concept label
- dull light coin remains candidate-not-canonical
- keeper normalizer changes only the exact sentence

These files exist on the branch, but current-head execution evidence is still required.

---

# 10. Remaining display migration

High-value candidate:

```txt
Persistent wallet display = 灯貨
Legacy display alias       = 黒曜片
Status                     = NOT CURRENT
```

Remaining:

1. move every active wallet surface through the formatter
2. preserve `黒曜片` in a Legacy alias ledger
3. produce save / purchase / refund / reward round-trip evidence
4. complete visual review
5. obtain Human naming approval
6. decide canonical owner/origin of `くすんだ灯貨`

No global or partial screen-by-screen rename should occur.

---

# 11. Readiness boundary

This pass does not promote:

- canonical `灯貨` display
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

> **Stage1の灯貨札は今回の実精算額だけを読み、くすんだ灯貨も候補としてつながり、Currentの黒曜片表示は共通formatterへ寄せ始めたが、正式改名は全画面・save証跡・Human reviewまで行わない。**
