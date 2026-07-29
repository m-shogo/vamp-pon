# ヨルノシルベ Named Object Runtime Connection — Core5 / Stage1

Date: 2026-07-29  
Status: **PARTIAL RUNTIME CONNECTION COMPLETE / FULL CURRENT21・SAVE・GLOBAL CONSTELLATION OPEN**

> 名前のある物をDefinitionに置いただけの段階から、既存Collection runtimeの壊さない範囲へ接続した。
>
> 今回の接続対象はStage1のCurrent用語表示、Core5の光る持ち物、既存6枚の忘れ物絵札である。

---

# 1. Result

```txt
Current21 stable luminous possessions = 21 / 21
Core5 keeper UI connection            = 5 / 5
Remaining keeper UI connection        = 16
Stage1 Clear Getter cells              = 25 / 25 IDs preserved
Stage1 黒耀化 current display          = connected
Lost-item records schema migration     = 6 / 6
Nagi / Michiru current rebinding       = 2 / 2
Legacy binding preservation            = 2 / 2
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
- completion state IDs
- reward type / amount

Six legacy Enemy-label cells remain `REVIEW_ENEMY_REBIND`.
They were not guessed into Current48.

---

# 3. Core5 keeper records

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

# 4. Lost-item records

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

`light_coin / 灯貨 / 黒曜片 / 記憶片` is an economy naming and migration decision.
It was not converted as a side effect of the 黒耀化 terminology repair.

---

# 5. Collection save v2 hardening

Fixed a non-destructive migration gap:

```txt
completion.unknownLegacyGroupIds
```

An explicit unknown group ID is now preserved even when it does not yet have a matching `groupStates` entry.

Verification includes:

- explicit unknown ID
- unknown ID derived from group state
- deduplication
- whitespace normalization
- idempotent v2 re-migration
- no automatic 100% unlock

Production save service still does not use v2.

---

# 6. Quality gate

Package command:

```sh
pnpm named-object:check
```

`implementation:preflight:check` now includes:

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
- Nagi / Michiru current and legacy lost-item binding
- unknown save cell and group preservation
- 全灯の朝 fail-closed state
- global constellation reference integrity

---

# 7. GitHub Actions state

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

# 8. Remaining work

```txt
1. Restore a GitHub Actions run that reaches checkout/install steps
2. Run pnpm named-object:check / test / build
3. Safely patch the remaining CollectionScene legacy abbreviated header
4. Review six legacy Enemy cell mappings against Current48 authority
5. Decide the economy display name and migration contract
6. Connect Collection save v2 through the production save service
7. Expand keeper UI/assets from Core5 5 to remaining 16
8. Implement global constellation UI incrementally
9. Freeze launch-v1 completion requirements only after Human review
10. Produce 全灯の朝 scene / art / music / cosmetic / remix mode
```

---

# 9. Readiness boundary

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

# 10. One sentence

> **Core5の光る持ち物とStage1の黒耀化表示、ナギ／ミチルの忘れ物接続は既存IDを壊さずCurrentへつながった。残る16人、正式save、大星図、全灯の朝は、検証とasset gateを分けたまま次段階へ進める。**
