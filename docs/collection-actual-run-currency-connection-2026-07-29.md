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
Current persistent currency formatter    = created / 2 of 11 wallet surfaces connected
wallet display migration preflight       = connected
wallet lifecycle round-trip test         = added
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
formatMetaCurrencyGrowthIntro
formatMetaCurrencyInsufficient
formatMetaCurrencyRefund
formatMetaCurrencyCarryHome
formatMetaCurrencyUseCta
formatMetaCurrencyUpgradeName
formatMetaCurrencyUpgradeDescription
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

Still not formatter-backed:

- TOP wallet tag
- StageSelect balance / onboarding / insufficient-funds / refund
- Result reward title / use CTA
- first-run carry-home guidance
- currency-gain upgrade name/description

Current coverage:

```txt
2 / 11 connected
9 remaining
```

---

# 7. Display migration authority

Sources:

- `src/game/data/metaCurrencyDisplayMigration.ts`
- `docs/design-targets/generated/meta-currency-display-migration-v1.json`
- `docs/meta-currency-display-migration-foundation-2026-07-29.md`

Boundary:

```txt
Current display   = 黒曜片
candidate display = 灯貨
Human approved    = false
atomic migration  = required
```

`pnpm named-object:check` now validates the 2/11 coverage and blocks premature approval.

`src/game/data/metaCurrencyDisplaySurfaceSourceContract.test.ts` reads the active source files so the migration ledger cannot silently drift away from the code.

---

# 8. Wallet lifecycle evidence

Test:

- `src/game/persistence/__tests__/metaCurrencyLifecycle.test.ts`

Contracts:

```txt
save round trip
purchase exact cost
full upgrade refund
run settlement addition
achievement reward addition
Collection reward addition
Collection reward idempotency
```

Stable fields remain:

```txt
PlayerProfile.currency
PlayerProfile.totalCurrencyEarned
```

---

# 9. 黒耀化 wording repair

Without changing IDs, costs, levels, rewards or multipliers:

```txt
UPGRADE_DEFS group union → 黒耀化
noBerserkBonus group     → 黒耀化
noBerserkBonus text      → 黒耀化未使用
4 no-berserk achievements → 黒耀化
```

`黒曜片` remains unchanged because it is a separate economy display decision.

Resultの`黒曜なし` is recorded as a separate 黒耀化 terminology repair, not as part of wallet migration.

---

# 10. Collection keeper header

Pure normalizer:

- `src/game/data/collectionDisplayTerms.ts`

Runtime hook:

- `src/game/ui/collectionAtlasSceneHooks.ts`

```txt
Legacy:  灯名・黒曜・朝明・欠けた心を、絵札として残す頁。
Current: 灯名・黒耀化・朝明・欠けた心を、絵札として残す頁。
```

Only the exact known sentence changes. Enemy names, `黒曜片`, `黒曜研究所` and `くすんだ灯貨` remain untouched.

---

# 11. Verification files

```txt
src/game/data/collectionEconomyTerminology.test.ts
src/game/data/metaCurrencyDisplay.test.ts
src/game/data/metaCurrencyDisplayMigration.test.ts
src/game/data/metaCurrencyDisplaySurfaceSourceContract.test.ts
src/game/persistence/__tests__/profileRunCurrencyTracking.test.ts
src/game/persistence/__tests__/metaCurrencyLifecycle.test.ts
src/game/systems/collectionProgressRunCurrency.test.ts
src/game/data/lostItemEconomyConnection.test.ts
src/game/ui/collectionAtlasSceneHooks.test.ts
scripts/quality/check-named-object-registry.ts
scripts/quality/check-unity-term-lock.ts
```

These files exist on the branch, but current-head execution evidence is still required.

---

# 12. Remaining display migration

High-value candidate:

```txt
Persistent wallet display = 灯貨
Legacy display alias       = 黒曜片
Status                     = NOT CURRENT
```

Remaining:

1. move the nine active wallet surfaces through the formatter
2. preserve `黒曜片` in a Legacy alias ledger
3. execute save / purchase / refund / reward round-trip tests on current HEAD
4. complete visual review
5. obtain Human naming approval
6. decide canonical owner/origin of `くすんだ灯貨`

No global or partial screen-by-screen rename should occur.

---

# 13. Readiness boundary

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

# 14. One sentence

> **Stage1の灯貨札は今回の実精算額だけを読み、くすんだ灯貨も候補としてつながり、永続通貨は11表示面を台帳化して2面を共通formatterへ接続したが、正式改名は残り9面・実行証跡・Human reviewまで行わない。**
