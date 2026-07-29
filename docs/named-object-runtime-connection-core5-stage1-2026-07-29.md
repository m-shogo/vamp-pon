# ヨルノシルベ Named Object Runtime Connection — Core5 / Stage1

Date: 2026-07-29  
Status: **PARTIAL RUNTIME CONNECTION COMPLETE / STAGE1 DUAL-READ CONNECTED / ECONOMY CONCEPTS SEPARATED / FULL CURRENT21・SAVE・GLOBAL UI OPEN**

> 名前のある物をDefinitionに置いただけの段階から、既存Collection runtimeの壊さない範囲へ接続した。
>
> 接続対象はStage1のCurrent用語表示、Core5の光る持ち物、既存6枚の忘れ物絵札、旧Stage1 runtimeとCurrent48のdual-read bridge、Collection経済用語の非混同契約である。

---

# 1. Result

```txt
Current21 stable luminous possessions = 21 / 21
Core5 keeper UI connection            = 5 / 5
Remaining keeper UI connection        = 16
Stage1 historical cells preserved     = 25 / 25
Stage1 active completion candidates   = 22
Stage1 legacy archive-only cells      = 3
Stage1 legacy runtime subjects        = 8
Stage1 legacy binding cells           = 8
Stage1 黒耀化 current display          = connected
Achievement 黒耀化 descriptions       = 4 / 4 repaired
Lost-item records schema migration     = 6 / 6
Nagi / Michiru current rebinding       = 2 / 2
Legacy binding preservation            = 2 / 2
Economy/mechanic concepts separated    = 4
Collection save v2                     = draft only
Global constellation UI                = not connected
全灯の朝                               = fail-closed / not implemented
```

---

# 2. Stage1 夜明け星図

Active source:

- `src/game/data/collectionProgress.ts`

Current visible condition:

```txt
忘れ物通り 深度1を黒耀化なしで夜明けする
```

Preserved legacy display history:

- `src/game/data/collectionProgressCompatibility.ts`

```txt
legacy:  黒曜化なし
Current: 黒耀化なし
```

The following remain unchanged:

- cell ID
- board ID
- x / y coordinates
- revealBy graph
- completed / claimed IDs
- reward type / amount

Compatibility definition:

```txt
stage1-compat-v2
```

---

# 3. Stage1 legacy runtime bridge

Active source:

- `src/game/data/stage1LegacyRuntimeCompatibility.ts`
- `src/game/systems/collectionProgress.ts`

The previous audit counted six legacy Enemy cells. That was incomplete.
The complete inventory is:

```txt
Legacy runtime subjects = 8
Legacy board bindings   = 8
Enemy / boss cells      = 7
Legacy story cells      = 1
```

Previously missed:

- `fs_023_calm_yorishiro_with_ultimate`
- `fs_025_view_nemori_record`

## 3.1 Dual-read targets

| Legacy runtime ID | Legacy display | Current production ID | Relation | Stage1 progress |
| --- | --- | --- | --- | --- |
| `ink_shadow` | しずくオンブラ | `ombu_small_ink` | exact Stage1 successor | old / Current ID both accepted |
| `black_label_shadow` | くろよオンブロ | `omburo_ink_arm` | Stage1 role successor | old / Current ID both accepted |
| `bag_yorishiro` | かばんヨリシロ | `boss_name_without_owner` | Stage1 boss-role successor | old / Current ID both accepted |

This is a **dual-read**, not a destructive rename.

```txt
ink_shadow          OR ombu_small_ink
black_label_shadow  OR omburo_ink_arm
bag_yorishiro       OR boss_name_without_owner
```

Existing saves keep the old IDs.
A future Current runtime may record the Current IDs without making the old achievements unreachable.

## 3.2 Moved to another Stage

| Legacy runtime ID | Current motif | Current Stage direction | Stage1 reuse |
| --- | --- | --- | --- |
| `paper_scrap_shadow` | `ombu_small_paper` | name-tag / paper-wing stages | prohibited |
| `lost_direction` | `ombu_small_compass` | return-map Stage4 | prohibited |
| `black_capsule` | `ombu_small_keyhole` | moon-box Stage3 | prohibited |

The same motif is not enough to reuse a completion condition in the wrong Stage.

## 3.3 No Current successor

| Legacy runtime ID | Board cell | Result |
| --- | --- | --- |
| `night_haze` | `fs_003_release_night_haze` | preserve as legacy archive |
| `yanushi_nemori` | `fs_025_view_nemori_record` | preserve as legacy story archive |

No Current21 / Current48 successor is invented.

## 3.4 Display boundary

`autoRenameDisplay=false` for every compatibility entry.

Even where a Current role successor exists, the visible old condition is not silently replaced before runtime and evidence agree.

---

# 4. 25 historical nodes / 22 future completion candidates

The Stage1 graph preserves all 25 source IDs.

Three nodes are now explicitly:

```txt
LEGACY_ARCHIVE_ONLY
```

- `fs_002_release_paper_scrap_shadow`
- `fs_003_release_night_haze`
- `fs_025_view_nemori_record`

These nodes:

- remain visible as historical records
- keep existing completion state
- are not deleted from saves
- are not automatically counted toward a future `全灯の朝` denominator

The remaining 22 nodes are:

```txt
ACTIVE_CURRENT_OR_DUAL_READ
```

This does **not** freeze the launch denominator.
It only prevents known obsolete nodes from becoming mandatory homework by accident.

Active source:

- `src/game/data/globalConstellationDefinition.ts`

```txt
migrated Stage1 nodes        = 25
active Stage1 completion     = 22
legacy archive-only          = 3
runtime denominator frozen   = false
```

---

# 5. Core5 keeper records

Active source:

- `src/game/data/keeperRecords.ts`

## Current luminous possession connection

| Character | Stable ID | Current display |
| --- | --- | --- |
| ユイ | `named-object:yui:luminous_possession` | 持ち主待ちのランタン |
| アサ | `named-object:asa:luminous_possession` | 名結びの小鋏 |
| ナギ | `named-object:nagi:luminous_possession` | 月箱の銀鍵 |
| ミチル | `named-object:michiru:luminous_possession` | 帰り針のコンパス |
| トモリ | `named-object:tomori:luminous_possession` | 継火の修理ランプ |

`CollectionScene` currently displays `lightMotif` in the keeper detail panel.
`lightMotif` now uses the exact luminous-possession display name, so the five Current object names are visible without adding new assets or changing record IDs.

## Legacy personal items preserved

| Character | Preserved legacy prop |
| --- | --- |
| ユイ | 左腰の小さな拾い物バッグ |
| アサ | 止まったままの小さな懐中時計 |
| ナギ | 書き足しだらけの折り畳み星図 |
| ミチル | 水音を閉じ込めた青い小瓶 |
| トモリ | 色の違う糸を巻いた古い針差し |

These are stored in `legacyPersonalItems`.
They may remain as secondary props, historical objects or archive references.
They are not silently declared to be the same object as the Current luminous possession.

## Character-core correction

- ナギ: route roleから、seal / protect / reopenへCurrent correction
- ミチル: water-memory roleから、route / reroute / chooseへCurrent correction
- アサ: speed-first roleから、name / mark / consentへCurrent correction
- ユイ: forced returnではなくhold / owner-check / return
- トモリ: repair while preserving scar and blank

Individual 黒耀化 proper names remain `Working`.
The keeper runtime displays descriptive Working labels and does not claim final naming approval.

---

# 6. Lost-item records

Active source:

- `src/game/data/lostItemRecords.ts`

Added schema:

```txt
legacyRelatedKeeperIds
connectionStatus
```

## Current / Legacy bindings

### 折れた地図の角

```txt
Current relatedKeeperId = keeper-michiru
Legacy preserved        = keeper-nagi
Status                  = CURRENT_WITH_LEGACY_BINDING
```

### 錆びた部屋の鍵

```txt
Current relatedKeeperId = keeper-nagi
Legacy preserved        = keeper-michiru
Status                  = CURRENT_WITH_LEGACY_BINDING
```

The existing six record IDs and six card assets remain unchanged.

### くすんだ灯貨

```txt
Status = REVIEW_REQUIRED
```

It is connected to the economy terminology review but is not yet declared to be the same tracked resource as `PlayerProfile.currency`.

---

# 7. Economy terminology separation

Active sources:

- `src/game/data/collectionEconomyTerminology.ts`
- `docs/collection-economy-terminology-review-2026-07-29.md`
- `docs/design-targets/generated/collection-economy-terminology-v1.json`

Separated concepts:

| Concept ID | Current meaning | Current display/status |
| --- | --- | --- |
| `economy:meta_upgrade_currency` | persistent and spendable upgrade resource | `黒曜片` / naming review pending |
| `economy:run_memory_fragment` | run-only XP pickup | `記憶片` |
| `economy:prototype_light_coin_counter` | Stage1 proxy achievement counter | `灯貨` / not a wallet |
| `mechanic:black_youka` | battle/story mechanic | `黒耀化` / not currency |

High-value candidate only:

```txt
Persistent meta currency display = 灯貨
Legacy display alias              = 黒曜片
Status                            = NOT CURRENT
```

Promotion requires:

- preserve `PlayerProfile.currency`
- preserve `light_coin` as an internal alias
- add an actual per-run earned-currency counter
- replace the fs019 proxy formula
- connect `くすんだ灯貨` to the persistent currency lineage
- save / purchase / refund / reward tests
- Human naming approval

No automatic rename was performed.

---

# 8. Active 黒耀化 terminology repair

The following active achievement descriptions were repaired without changing IDs or rewards:

```txt
no-berserk:s1:shallow
no-berserk:s1:middle
no-berserk:s1:deep
no-berserk:s2:shallow
```

`src/game/data/achievements.ts` is now an active term-lock target.

Remaining separate debt:

- `PlayerProfile.UPGRADE_DEFS` Legacy `黒曜化` wording
- `CollectionScene` abbreviated `黒曜` keeper header
- StageSelect `黒曜片` / `黒曜研究所` naming review

---

# 9. Collection save v2 hardening

An explicit unknown group ID is preserved even when it does not yet have a matching `groupStates` entry.

Verification includes:

- explicit unknown ID
- unknown ID derived from group state
- deduplication
- whitespace normalization
- idempotent v2 re-migration
- no automatic 100% unlock
- compatibility fallback version `stage1-compat-v2`

Production save service still does not use v2.

---

# 10. Quality gate

Package command:

```sh
pnpm named-object:check
```

`implementation:preflight:check` includes:

```txt
unity:term-lock:check
→ named-object:check
→ big implementation readiness
```

The checker now verifies:

- 21 lineages / 126 objects
- Core5 keeper stable-object references
- exact luminous possession display names
- preserved legacy personal items
- Current 黒耀化 display
- four achievement descriptions use 黒耀化
- Nagi / Michiru current and legacy lost-item binding
- 8 legacy runtime subjects
- 8 legacy board bindings
- exact / role / moved / no-successor classification
- old and Current Stage1 dual-read IDs
- 22 active Stage1 completion nodes
- 3 archive-only Stage1 nodes
- 4 separated economy/mechanic concepts
- unknown save cell and group preservation
- 全灯の朝 fail-closed state
- global constellation reference integrity

---

# 11. GitHub Actions state

CI workflow action majors were restored to the known working v4 series.
This did not resolve the current failure.

Latest observed behavior:

```txt
job created
status = failure
steps = []
job log = unavailable / BlobNotFound
```

This means the runner stops before repository commands execute.
It is not evidence that the new TypeScript tests or build failed.

Possible external categories include hosted-runner allocation, account billing/usage restriction or another pre-step GitHub Actions condition, but the exact cause is not proven from available evidence.

Therefore:

- repository tests are not claimed PASS
- repository tests are not claimed code-failure
- current Actions evidence is `NOT_EXECUTED`

---

# 12. Remaining work

```txt
1. Restore a GitHub Actions run that reaches checkout/install steps
2. Run pnpm named-object:check / test / build
3. Repair PlayerProfile UPGRADE_DEFS 黒曜化 wording through a full-file-safe patch
4. Safely patch the CollectionScene keeper header
5. Decide the meta-currency display name after Human review
6. Replace fs_019 proxy logic with an actual run-earned counter before any 灯貨 promotion
7. Replace or archive visible labels for the seven legacy Enemy/boss cells only after runtime evidence
8. Connect Collection save v2 through the production save service
9. Expand keeper UI/assets from Core5 5 to remaining 16
10. Implement global constellation UI incrementally
11. Freeze launch-v1 completion requirements only after Human review
12. Produce 全灯の朝 scene / art / music / cosmetic / remix mode
```

---

# 13. Readiness boundary

This work does not promote:

- `runtimeNamedObjectConnected` for all Current21
- `collectionSaveV2Connected`
- `globalConstellationReady`
- `allLightsMorningReady`
- U49
- U50
- RC
- production approval

---

# 14. One sentence

> **Core5の光る持ち物、Stage1黒耀化表示、ナギ／ミチルの忘れ物、旧Stage1とCurrent48のdual-read、25札中22札の将来分母候補、経済4概念の分離まで既存saveを壊さず接続した。通貨表示名はまだ自動変更していない。**
