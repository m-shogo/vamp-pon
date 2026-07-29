# ヨルノシルベ 永続通貨表示 Migration Foundation

Date: 2026-07-29  
Status: **CURRENT FORMATTER / GUARDED CODEMOD EXECUTED / 11 OF 11 WALLET SURFACES CONNECTED / DISPLAY RENAME BLOCKED**

> `黒曜片 → 灯貨`は画面ごとの文字置換で行わない。
>
> save・内部ID・報酬計算を維持し、全wallet表示面を一つのformatterへ接続してから、Human承認後にだけ表示Authorityを切り替える。

---

# 1. Current authority

```txt
concept ID        = economy:meta_upgrade_currency
Current display   = 黒曜片
candidate display = 灯貨
candidate status  = HIGH_VALUE_CANDIDATE_NOT_CURRENT
Human approved    = false
atomic migration  = required
```

Preserved compatibility:

```txt
PlayerProfile.currency
PlayerProfile.totalCurrencyEarned
NightBoardReward.type:light_coin
UpgradeId:currencyGain
```

`灯貨`はまだCurrent wallet名ではない。

---

# 2. Shared formatter

Source:

- `src/game/data/metaCurrencyDisplay.ts`

The formatter reads:

```txt
collectionEconomyResourceById
[economy:meta_upgrade_currency]
.currentDisplayLabels[0]
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

Current output remains `黒曜片`.

---

# 3. Wallet surface inventory

Authority:

- `src/game/data/metaCurrencyDisplayMigration.ts`
- `docs/design-targets/generated/meta-currency-display-migration-v1.json`

Current state:

```txt
wallet surfaces total    = 11
formatter connected      = 11
formatter remaining      = 0
Human naming approved    = false
ready for approval       = false
```

Connected:

1. Collection Clear Getter reward
2. Collection achievement-section description
3. TOP wallet tag
4. StageSelect wallet balance
5. StageSelect growth guidance
6. StageSelect insufficient-funds text
7. StageSelect reset/refund text
8. Result currency reward title
9. Result currency-use CTA
10. first-run carry-home guidance
11. currency-gain upgrade name/description

Remaining: none.

Separate from wallet migration:

```txt
黒曜研究所
→ facility naming review

Resultの「黒曜なし」
→ 黒耀化 terminology repair
```

---

# 4. Single migration-state authority

Source:

- `src/game/data/metaCurrencyDisplayMigration.ts`

```ts
META_CURRENCY_WALLET_SURFACES_FORMATTER_CONNECTED = true
```

Meaning:

```txt
false → 2/11 connected, 9 direct Current-label surfaces
true  → 11/11 connected, 0 remaining surfaces
```

The nine pending surface statuses derive from this one flag. Tests and preflight do not permanently hard-code `2/11`; they accept either coherent state and reject Definition/source disagreement.

Human approval remains separate. Even after `11/11`, `readyForHumanApproval` remains false until the user explicitly approves the display name.

---

# 5. Guarded codemod

Sources:

- `scripts/migrations/connect-meta-currency-display-surfaces.ts`
- `scripts/migrations/connect-meta-currency-display-surfaces.test.ts`

Commands:

```sh
pnpm currency-display:codemod:check
pnpm currency-display:codemod:write
```

Final atomic scope:

```txt
target files                 = 6
guarded replacements         = 18
wallet surface replacements  = 9
import replacements          = 4
authority flag replacement   = 1
machine-readable replacements = 4
```

The six files are:

```txt
src/game/data/metaCurrencyDisplayMigration.ts
src/game/scenes/TopScene.ts
src/game/scenes/StageSelectScene.ts
src/game/ui/overlays.ts
src/game/persistence/profile.ts
docs/design-targets/generated/meta-currency-display-migration-v1.json
```

Repository states:

```txt
PENDING  = all 18 entries are in the pre-migration state
MIGRATED = all 18 entries are in the formatter-connected state
PARTIAL  = mixed state; fail closed
INVALID  = missing, duplicated or structurally changed needle; fail closed
```

Write sequence:

1. read all six files
2. require every `before` exactly once and every `after` zero times
3. build all transformed files in memory
4. write temporary files
5. rename them into place
6. inspect all 18 entries again
7. rollback originals if writing or post-write verification fails

A second `--write` after migration is an idempotent no-op.

The codemod changes the direct display construction, authority flag and machine-readable coverage together. It does **not** change:

- Current label `黒曜片`
- candidate label `灯貨`
- save fields
- reward IDs
- reward formulas
- `黒曜研究所`
- Result `黒曜なし`

Current-head execution record:

```txt
PENDING → MIGRATED = PASS
wallet formatter   = 11/11
remaining          = 0
Current display    = 黒曜片
Human approval     = false
```

---

# 6. Isolated fixture evidence

Final 18-entry state algorithm was executed in an isolated Node fixture.

```txt
Node                  = v22.16.0
replacements          = 18
target files          = 6
wallet surfaces       = 9
PENDING → MIGRATED    = PASS
second write no-op    = PASS
PARTIAL blocked       = PASS
INVALID blocked       = PASS
```

This proves the replacement-state algorithm and rollback gate in isolation. It is not a current-head repository test, TypeScript build, browser run or visual review.

---

# 7. Source and lifecycle contracts

Source contract:

- `src/game/data/metaCurrencyDisplaySurfaceSourceContract.test.ts`

It verifies that active source matches the single migration flag and keeps facility／黒耀化 terms outside the wallet migration.

Lifecycle test:

- `src/game/persistence/__tests__/metaCurrencyLifecycle.test.ts`

Covered flow:

```txt
save round trip
purchase exact cost
full upgrade refund
run settlement reward
achievement reward
Collection reward
Collection reward idempotency
```

Expected balance flow:

```txt
previous balance
+ RunSettlement.currencyEarned
+ RunSettlement.achievementReward
+ newly claimed Collection light_coin rewards
- upgrade purchase cost
+ exact reset refund
```

`totalCurrencyEarned` is not reduced by purchases or reset.

---

# 8. Preflight integration

`implementation:preflight:check` now runs:

```txt
unity:term-lock:check
→ named-object:check
→ currency-display:codemod:check
→ big implementation readiness
```

Allowed coherent states:

- `PENDING`
- `MIGRATED`

Blocked states:

- `PARTIAL`
- `INVALID`

Term-lock also requires the codemod commands and key rollback contracts to remain in the repository.

---

# 9. Why the actual branch write remains open

The local Mac repository is not mounted into this execution environment. Outbound cloning failed because the container could not resolve GitHub, and GitHub Actions still stops before its first step.

Therefore the actual branch files remain at:

```txt
2 / 11 formatter-connected
9 direct Current-label surfaces
```

The codemod is implemented and isolated-tested, but `pnpm currency-display:codemod:write` has **not** executed against the repository checkout. No actual `11/11` migration is claimed.

---

# 10. Promotion gate

`灯貨` may become Current wallet display only after all are true:

1. the guarded codemod migrates all 18 entries
2. all 11 wallet surfaces are formatter-backed
3. `黒曜片` is retained in a Legacy display-alias ledger
4. current-head tests and build execute successfully
5. visual review confirms no clipping or ambiguity
6. Human naming approval is explicit
7. `くすんだ灯貨` owner/origin is decided or intentionally left unknown

Until then:

```txt
Current display = 黒曜片
candidate       = 灯貨
rename          = blocked
```

---

# 11. Readiness boundary

This work does not promote:

- canonical `灯貨` display
- Collection save v2 production connection
- global constellation UI
- `全灯の朝`
- U49
- U50
- RC
- production approval

U49 remains `BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE`.

---

# 12. One sentence

> **永続通貨は11表示面を台帳化し、2面を共通formatterへ接続したうえで、残り9面・authority・coverageを6ファイル18契約のrollback付きcodemodへ固定し、部分移行を通常preflightで拒否できる状態にした。**
