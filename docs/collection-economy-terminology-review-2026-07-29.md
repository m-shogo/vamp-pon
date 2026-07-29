# ヨルノシルベ Collection Economy Terminology Review

Date: 2026-07-29  
Status: **CURRENT RUNTIME CONCEPT SEPARATION / DISPLAY RENAMING NOT APPROVED**

> `黒曜片`、`灯貨`、`記憶片`、`黒耀化`を、似た字面だけで同じ概念へまとめない。
>
> 現在のsave・報酬・Stage1札を守りながら、将来の表示名統合に必要な条件を固定する。

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

## 1.3 灯貨

Current named uses:

```txt
Stage1 cell: fs_019_collect_100_light_coin
Lost item: くすんだ灯貨
```

Current completion predicate:

```txt
kills * 0.35 + memoryFragmentsCollected * 0.7 >= 100
```

This means `灯貨` is not yet a real tracked item or wallet.
It is a prototype completion counter estimated from unrelated runtime totals.

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

Rules:

1. No runtime ID may belong to multiple concepts.
2. `profile.currency` and `NightBoardReward.type:light_coin` belong to the same persistent resource.
3. `記憶片` remains run-only and non-spendable.
4. `灯貨` remains a prototype counter until real tracking exists.
5. `黒耀化` remains outside the economy model.
6. Automatic display renaming is forbidden.
7. Stable save fields are not renamed merely to clean up UI wording.

---

# 3. High-value naming candidate

Status: **HIGH-VALUE CANDIDATE / NOT CURRENT DISPLAY AUTHORITY**

The strongest future unification candidate is:

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

Why it is **not applied yet**:

- `灯貨あつめ` does not currently track actual currency earned.
- Existing UI and tests expect `黒曜片`.
- Save field and internal IDs need an alias ledger.
- The lost-item meaning must be connected to the same currency lineage rather than merely sharing a word.
- Human naming review has not approved the display migration.

---

# 4. Required migration if 灯貨 is approved

The migration must be performed in this order:

1. Keep `PlayerProfile.currency` and `totalCurrencyEarned` unchanged.
2. Keep `NightBoardReward.type:light_coin` as a Legacy/internal alias until save compatibility is proven.
3. Add one Current display formatter for the persistent resource.
4. Change StageSelect, Result, Collection reward text, growth reset and HUD labels through that formatter.
5. Preserve `黒曜片` in a Legacy display alias ledger.
6. Add an actual per-run earned-currency counter.
7. Change `fs_019_collect_100_light_coin` from its proxy formula to the actual counter.
8. Connect `くすんだ灯貨` to the persistent currency lineage and its archive entry.
9. Add save round-trip, reward, purchase, refund and achievement tests.
10. Only then mark the display migration Current.

Forbidden shortcuts:

- global string replacement
- renaming the `currency` save field
- treating memory fragments as wallet currency
- counting lifetime balance for a one-run achievement
- changing 黒曜片 while leaving Stage1 灯貨 as a fake counter

---

# 5. Active terminology repair completed in this pass

The following achievement descriptions were corrected from Legacy `黒曜化` to Current `黒耀化` without changing IDs, conditions or rewards:

```txt
no-berserk:s1:shallow
no-berserk:s1:middle
no-berserk:s1:deep
no-berserk:s2:shallow
```

`src/game/data/achievements.ts` is now an active term-lock target.

---

# 6. Remaining terminology debt

The following must be handled separately from the economy display decision:

- `PlayerProfile.UPGRADE_DEFS` still contains Legacy `黒曜化` category/description text.
- `CollectionScene` keeper header still uses the abbreviated `黒曜` wording.
- StageSelect contains the established `黒曜片` display and `黒曜研究所` title; these are economy/facility naming decisions, not automatic 黒耀化 typo replacements.
- `fs_019_collect_100_light_coin` still uses a proxy formula.

These are not readiness blockers for U49, but they are active product-language debt.

---

# 7. Readiness boundary

This review does not claim:

- canonical economy display migration
- production save migration
- actual 灯貨 tracking
- global constellation readiness
- 全灯の朝 readiness
- U49 completion
- U50 or RC readiness

---

# 8. One sentence

> **永続資源、記憶片、試作の灯貨、黒耀化を別概念として固定した。将来「灯貨」を永続通貨名へ採用する案は強いが、実カウンター・Legacy alias・save互換・Human reviewを通すまでCurrent表示にはしない。**
