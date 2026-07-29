# ヨルノシルベ Collection Economy Terminology Review

Date: 2026-07-29  
Status: **CURRENT RUNTIME CONCEPT SEPARATION / ACTUAL RUN COUNTER CONNECTED / DISPLAY RENAMING NOT APPROVED**

> `黒曜片`、`灯貨`、`記憶片`、`黒耀化`を、似た字面だけで同じ概念へまとめない。
>
> 現在のsave・報酬・Stage1札を守りながら、1ラン獲得額の実カウンターだけを先に正しく接続した。

---

# 1. Current runtime facts

## 1.1 永続強化資源

Stable storage:

```txt
PlayerProfile.currency
PlayerProfile.totalCurrencyEarned
```

Current internal paths:

```txt
RunSettlement.currencyEarned
RunSettlement.achievementReward
NightBoardReward.type = light_coin
UpgradeId = currencyGain
```

Current visible label:

```txt
黒曜片
```

Role:

- 探索後に持ち帰る
- 永続強化で消費する
- 強化リセットで返還する
- 実績・夜明け星図報酬でも増える

This is the only current persistent and spendable resource in this terminology group.

## 1.2 記憶片

Runtime path:

```txt
RuntimeStats.memoryFragmentsCollected
```

Role:

- ラン中に拾う
- 経験値とLevelUpへつながる
- ラン終了時の報酬計算へ数値寄与する
- 直接walletへ保存・消費しない

`記憶片` is not an alias of `PlayerProfile.currency`.

## 1.3 Stage1札の灯貨counter

Current named uses:

```txt
Stage1 cell: fs_019_collect_100_light_coin
Lost item: くすんだ灯貨
```

Current tracked flow:

```txt
settleRunProgress
→ RunSettlement.currencyEarned を確定
→ recordRunEarnedMetaCurrency(state.stats, currencyEarned)
→ transient: RunStats.earnedMetaCurrencyThisRun
→ fs_019 が100以上かを判定
```

The counter now reads the **actual settled per-run meta-currency amount**.

It does not read:

- `profile.currency` balance
- lifetime `totalCurrencyEarned`
- `achievementReward`
- `memoryFragmentsCollected` directly
- the removed `kills * 0.35 + fragments * 0.7` proxy

The transient counter is not a wallet and is not persisted.
The display name `灯貨` remains pending Human naming review.

## 1.4 黒耀化

Runtime path:

```txt
RuntimeStats.berserkUses
UpgradeId = noBerserkBonus
```

Role:

- battle / story mechanic
- not a currency
- not a display alias for 黒曜片

---

# 2. Current contract

Machine-readable source:

- `src/game/data/collectionEconomyTerminology.ts`

Current concept IDs:

```txt
economy:meta_upgrade_currency
economy:run_memory_fragment
economy:prototype_light_coin_counter
mechanic:black_youka
```

The third ID is preserved for compatibility even though its runtime predicate is no longer a proxy.

Rules:

1. No runtime ID may belong to multiple concepts.
2. `profile.currency` and `NightBoardReward.type:light_coin` belong to the same persistent resource.
3. `記憶片` remains run-only and non-spendable.
4. `fs_019` reads the actual settled run amount through a transient counter.
5. The transient run counter excludes wallet balance and achievement rewards.
6. `黒耀化` remains outside the economy model.
7. Automatic display renaming is forbidden.
8. Stable save fields are not renamed merely to clean up UI wording.

---

# 3. High-value naming candidate

Status: **HIGH-VALUE CANDIDATE / NOT CURRENT DISPLAY AUTHORITY**

The strongest future unification candidate remains:

```txt
Persistent meta currency display = 灯貨
Legacy display alias              = 黒曜片
```

Why this is strong:

- `くすんだ灯貨` already exists as a named object.
- `灯貨あつめ` already exists as a Stage1 record.
- `灯` is central to the world language without colliding with `黒耀化`.
- A spendable coin-like resource reads naturally in upgrade and refund UI.
- It reduces the visual confusion between `黒曜片` and `黒耀化`.

Completed prerequisites:

- `PlayerProfile.currency` is preserved.
- internal `light_coin` is preserved.
- an actual per-run earned-currency counter exists.
- `fs_019` no longer uses its proxy formula.
- tests prove the counter equals `RunSettlement.currencyEarned`.
- tests prove achievement rewards are excluded.

Why the display migration is **not applied yet**:

- Existing UI and tests still use `黒曜片` as the established display.
- A single display formatter has not been connected across every screen.
- The lost-item meaning must be connected to the same currency lineage rather than merely sharing a word.
- Full save / purchase / refund / reward round-trip evidence has not been produced on the current HEAD.
- Human naming review has not approved the display migration.

---

# 4. Required migration if 灯貨 is approved

The remaining migration must be performed in this order:

1. Keep `PlayerProfile.currency` and `totalCurrencyEarned` unchanged.
2. Keep `NightBoardReward.type:light_coin` as a Legacy/internal alias.
3. Add one Current display formatter for the persistent resource.
4. Change StageSelect, Result, Collection reward text, growth reset and HUD labels through that formatter.
5. Preserve `黒曜片` in a Legacy display alias ledger.
6. Connect `くすんだ灯貨` to the persistent currency lineage and its archive entry.
7. Add full save round-trip, reward, purchase and refund evidence.
8. Run visual review for every active display surface.
9. Obtain Human naming approval.
10. Only then mark the display migration Current.

Forbidden shortcuts:

- global string replacement
- renaming the `currency` save field
- treating memory fragments as wallet currency
- counting lifetime balance for a one-run achievement
- including achievement rewards in the one-run counter
- changing 黒曜片 on only some screens

---

# 5. Active terminology and counter repairs completed

Achievement descriptions corrected from Legacy `黒曜化` to Current `黒耀化`:

```txt
no-berserk:s1:shallow
no-berserk:s1:middle
no-berserk:s1:deep
no-berserk:s2:shallow
```

Upgrade definition corrections:

```txt
UPGRADE_DEFS group       黒曜化 → 黒耀化
noBerserkBonus description 黒曜化 → 黒耀化
```

Actual counter connection:

```txt
old: kills * 0.35 + memoryFragmentsCollected * 0.7 >= 100
new: earnedMetaCurrencyThisRun >= 100
```

Protected by:

- `collectionEconomyTerminology.test.ts`
- `profileRunCurrencyTracking.test.ts`
- `check-named-object-registry.ts`
- `check-unity-term-lock.ts`

IDs, reward amounts and save fields were not changed.

---

# 6. Remaining terminology debt

The following must be handled separately from the completed counter repair:

- `CollectionScene` keeper header still uses the abbreviated `黒曜` wording.
- StageSelect contains the established `黒曜片` display and `黒曜研究所` title; these are economy/facility naming decisions, not automatic 黒耀化 typo replacements.
- `くすんだ灯貨` is not yet connected to the persistent currency lineage.
- The persistent currency display name is not Human-approved.

These are not readiness blockers for U49, but they remain active product-language debt.

---

# 7. Readiness boundary

This work does not claim:

- canonical economy display migration
- production save migration
- global constellation readiness
- 全灯の朝 readiness
- U49 completion
- U50 or RC readiness

GitHub Actions still has no current-head test/build execution evidence while jobs stop before their first step.

---

# 8. One sentence

> **Stage1の灯貨札は、撃破数と記憶片のproxyではなく、精算で確定した1ラン獲得通貨だけを読むようになった。永続通貨の表示名を灯貨へ変える判断は、画面統一・忘れ物接続・save証跡・Human reviewまで保留する。**
