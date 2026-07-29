# ヨルノシルベ 永続通貨表示 Migration Foundation

Date: 2026-07-29  
Status: **CURRENT FORMATTER FOUNDATION / GUARDED CODEMOD READY / 2 OF 11 WALLET SURFACES CONNECTED / DISPLAY RENAME BLOCKED / CURRENT-HEAD EXECUTION OPEN**

> `黒曜片 → 灯貨`は、画面ごとの文字置換では行わない。
>
> save・内部ID・報酬計算を維持したまま、すべてのwallet表示面を一つのformatterへ接続し、証跡とHuman承認が揃った後にだけ一括で表示Authorityを切り替える。

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

Stable compatibility:

```txt
PlayerProfile.currency             preserve
PlayerProfile.totalCurrencyEarned  preserve
NightBoardReward.type:light_coin   preserve
UpgradeId:currencyGain             preserve
```

`灯貨`はまだCurrent wallet名ではない。

---

# 2. Shared formatter

Source:

- `src/game/data/metaCurrencyDisplay.ts`

Current label source:

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

The formatter already owns the phrases required by TOP, StageSelect, Result, first-run guidance and the currency-gain upgrade. Those large active files have not yet been rewritten.

---

# 3. Surface inventory

Machine-readable sources:

- `src/game/data/metaCurrencyDisplayMigration.ts`
- `docs/design-targets/generated/meta-currency-display-migration-v1.json`

Current wallet coverage:

```txt
wallet surfaces total       = 11
formatter connected         = 2
formatter remaining         = 9
ready for Human approval    = false
```

Connected:

1. Collection Clear Getter reward text
2. Collection achievement-section description

Remaining:

1. TOP wallet tag
2. StageSelect wallet balance
3. StageSelect growth onboarding
4. StageSelect insufficient-funds text
5. StageSelect reset/refund text
6. Result currency reward title
7. Result currency-use CTA
8. first-run carry-home guidance
9. currency-gain upgrade name/description

---

# 4. Source contract

Test:

- `src/game/data/metaCurrencyDisplaySurfaceSourceContract.test.ts`

It reads the active source files and verifies:

- both connected surfaces import and call their formatter functions
- all nine direct Current-label surfaces still exist and remain inventoried
- `黒曜研究所` stays outside wallet migration
- Result `黒曜なし` stays classified as a separate 黒耀化 terminology repair
- candidate `灯貨` is not introduced early

This prevents the machine-readable ledger from drifting away from active code.

---

# 5. Guarded codemod

Source:

- `scripts/migrations/connect-meta-currency-display-surfaces.ts`

Tests:

- `scripts/migrations/connect-meta-currency-display-surfaces.test.ts`

Commands:

```sh
pnpm currency-display:codemod:check
pnpm currency-display:codemod:write
```

`--check` classifies the repository as:

```txt
PENDING   = all 13 guarded replacements are still in the Current direct-string state
MIGRATED  = all 13 guarded replacements are formatter-connected
PARTIAL   = some replacements are pending and some migrated; fail closed
INVALID   = a needle is missing, duplicated or structurally changed; fail closed
```

The 13 guarded replacements comprise:

```txt
4 import blocks
9 wallet display surfaces
```

Write sequence:

1. read all four active files
2. require every `before` needle exactly once and every `after` needle zero times
3. build all transformed files in memory
4. write temporary files
5. rename them into place
6. inspect all files again
7. rollback originals if any write or post-write verification fails

A second `--write` after successful migration is an idempotent no-op.

The codemod deliberately does **not** change:

- Current display authority `黒曜片`
- candidate authority `灯貨`
- `黒曜研究所`
- Result `黒曜なし`
- save fields
- reward IDs
- economy formulas

It only replaces direct wallet text construction with calls to the existing Current formatter.

`implementation:preflight:check` now runs:

```txt
unity:term-lock:check
→ named-object:check
→ currency-display:codemod:check
→ big implementation readiness
```

Both coherent states, `PENDING` and `MIGRATED`, are allowed. `PARTIAL` and `INVALID` stop the preflight.

---

# 6. Separate non-wallet review

The following are intentionally excluded from wallet display migration:

```txt
黒曜研究所
→ facility naming review

Resultの「黒曜なし」
→ 黒耀化 terminology repair
```

Neither may be changed merely because the wallet candidate is `灯貨`.

---

# 7. Lifecycle evidence added

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

Expected wallet flow:

```txt
previous balance
+ RunSettlement.currencyEarned
+ RunSettlement.achievementReward
+ newly claimed Collection light_coin rewards
- upgrade purchase cost
+ exact upgrade reset refund
```

`totalCurrencyEarned` increases only on earned rewards and is not reduced by purchases or reset.

---

# 8. Preflight connection

`pnpm named-object:check` validates:

```txt
Current display = 黒曜片
candidate display = 灯貨
Human approval = false
wallet surfaces = 11
formatter connected = 2
formatter remaining = 9
readyForHumanApproval = false
```

It rejects:

- duplicate surface IDs
- candidate `灯貨` appearing on an active Current surface
- formatter-connected surfaces without a formatter function
- facility／黒耀化 terms being mixed into wallet migration
- premature Human approval state

The separate codemod check rejects source-level partial or invalid migration.

---

# 9. Why StageSelect / Result were not directly edited in this pass

Both are large active rendering files.

The available GitHub connector exposes full-file replacement rather than a safe line-level patch. A partial or truncated source replacement could delete unrelated runtime code.

The local Mac path is not mounted into this execution environment, and outbound DNS prevents cloning the repository into the container. GitHub Actions also still stops before its first step.

Therefore this pass completed the safe execution mechanism rather than pretending the large-file migration had run:

1. full surface inventory
2. shared phrase functions
3. lifecycle round-trip proof
4. active-source contract
5. guarded codemod
6. codemod fixture tests
7. preflight integration
8. machine-readable migration state

The actual four-file write remains unclaimed until `pnpm currency-display:codemod:write` executes on the repository and subsequent tests/build pass.

---

# 10. Promotion gate

`灯貨` may become Current wallet display only after all are true:

1. all 11 wallet surfaces are formatter-connected
2. `黒曜片` is recorded as a Legacy display alias
3. save/purchase/refund/run/achievement/Collection tests execute on current HEAD
4. visual review confirms no clipping or ambiguity
5. Human naming approval is explicit
6. `くすんだ灯貨` owner/origin is decided or intentionally left unknown

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

> **永続通貨は11表示面を台帳化し、2面を共通formatterへ接続したうえで、残り9面を全件一致・一時ファイル・rollback付きcodemodへ固定し、部分移行を通常preflightで拒否できる状態にした。**
