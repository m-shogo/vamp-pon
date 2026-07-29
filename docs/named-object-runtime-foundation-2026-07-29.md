# ヨルノシルベ Named Object Runtime Foundation

Date: 2026-07-29  
Status: **DEFINITION / COMPATIBILITY / SAVE-DRAFT / GRAPH FOUNDATION IMPLEMENTED — PRODUCTION RUNTIME NOT CONNECTED**

> 名前のある物をCurrentへつなぐためのstable Definitionから、旧データ互換、Collection save v2 draft、全灯fail-closed判定、大星図navigation graphまで実装した。
>
> 既存Collection UI・production save service・全灯の朝Sceneにはまだ接続していない。

---

# 1. Implemented scope

```txt
A. stable named-object registry
B. non-destructive migration ledger
C. 21-character object read models
D. lost-item compatibility read models
E. Stage1 25-cell compatibility layer
F. Collection Progress Save v2 draft
G. 全灯の朝 fail-closed evaluator / idempotent claim
H. global constellation Definition graph
I. machine-readable snapshots
J. unit tests / standalone checker
```

一段実装しただけで後段をREADYにしない。

---

# 2. Stable named-object registry

Source:

- `src/game/data/namedObjectRegistry.ts`

Coverage:

```txt
Current21 lineages = 21
phases per lineage = 6
named objects       = 126
completion groups   = 6
```

各lineage:

```txt
光る持ち物
→ 初期灯具
→ 持ち物
→ 忘れ物
→ 灯継ぎ
→ 暁開き
```

Stable ID:

```txt
named-object:{characterId}:luminous_possession
named-object:{characterId}:starter_gear
named-object:{characterId}:passive_item
named-object:{characterId}:rare_item
named-object:{characterId}:lamp_tsugi
named-object:{characterId}:akatsuki_biraki
```

各objectは最低でも:

- Character
- Stage
- Gameplay
- Archive

へ接続し、lineage側でRelationshipも保持する。

Shadowはstable IDを維持:

```txt
kage1 = カナメ
kage2 = カスミ
kage3 = トキ
kage4 = ツムギ
```

## Same-name phase

同一Character内の同名は、別物のcollisionではなく同じobjectの成長であることを`sameObjectPhase`で明示する。

例:

- 呼び名の紙縒り
- 駅前の道火
- 箱底の花
- 未分類の頁
- 片道ではない切符
- 眠り頁
- 四つ折りの影
- 隠し火
- 薄れ名
- 角度の火
- 余白の継ぎ目

---

# 3. Non-destructive migration ledger

Source:

- `src/game/data/namedObjectMigrationLedger.ts`

## Old Core5 props

次は削除・silent overwriteしない。

- ユイ: 左腰の小さな拾い物バッグ
- アサ: 止まったままの小さな懐中時計
- ナギ: 書き足しだらけの折り畳み星図
- ミチル: 水音を閉じ込めた青い小瓶
- トモリ: 色の違う糸を巻いた古い針差し

Historical prop / secondary item / archive referenceとして保存できる。
Currentの光る持ち物と無理に同一物へしない。

## Nagi / Michiru old binding

```txt
折れた地図の角
legacy: ナギ
Current direction: ミチル route object

錆びた部屋の鍵
legacy: ミチル
Current direction: ナギ box/key object
```

旧本文・旧bindingを消さずcompatibility dataへ残す。

## Term alias

```txt
legacy/search alias = 黒曜化
Current visible term = 黒耀化
```

## Still review-required

推測で移行しない:

- Stage1旧Enemy名6札 → Current48の正式mapping
- `light_coin` / 灯貨 / 黒曜片 → 記憶片economy migration

---

# 4. Generated compatibility read models

Source:

- `src/game/data/namedObjectReadModels.ts`

Implemented:

```txt
Character object read models = 21
Lost-item compatibility rows = 2
Completion group read models = 6
All-lights reward read model = 1 composite reward
```

全read modelは:

```txt
runtimeConnectionState = NOT_CONNECTED
```

既存5人UIを21人対応済みとは扱わない。

全灯reward parts:

- playable celebration
- ensemble animated page
- completion medley
- all-character cosmetic
- constellation remix mode
- title / seal / frame
- small future anomaly

---

# 5. Stage1 board compatibility

Source:

- `src/game/data/collectionProgressCompatibility.ts`

既存25 cellについて:

- cell ID維持
- 座標維持
- reveal relation維持
- save stateをまだ変更しない

分類:

```txt
KEEP
RENAME_DISPLAY_ONLY
REVIEW_ENEMY_REBIND
```

`fs_008_clear_depth_1_no_black_form`は表示時のみ:

```txt
黒曜化なし
→ 黒耀化なし
```

旧Enemy名を含む6札はreviewへ隔離し、Current48へ推測置換しない。

```txt
saveMigrationApplied = false
```

---

# 6. Collection Progress Save v2 draft

Source:

- `src/game/data/collectionProgressSaveV2.ts`

Added:

```txt
schemaVersion = 2
boardVersion
nodeDefinitionVersion
connectedObjectIds
unknownLegacyCellIds
completion.definitionVersion
completion.groupStates
completion.unknownLegacyGroupIds
hundredPercentState
completionRewardClaimed
migration.runtimeConnectionState
```

## Migration rules

- v1 fieldsを保持
- string arrayを安全にnormalize / deduplicate
- invalid countを非負整数へnormalize
- unknown cell IDを元配列から消さない
- unknown cell IDを`unknownLegacyCellIds`にも隔離
- unknown completion groupを消さない
- v1から100%を自動解放しない
- v1からreward claimedを自動生成しない
- valid v2を再移行しても同じになる

Current:

```txt
runtimeConnectionState = DRAFT_NOT_CONNECTED
```

Production save serviceはまだv2を使用していない。

---

# 7. 全灯の朝 fail-closed evaluator

Source:

- `src/game/data/allLightsCompletion.ts`

Current design specification:

```txt
version = design-v1
runtimeFrozen = false
```

したがって必ず:

```txt
LOCKED / DENOMINATOR_NOT_FROZEN
```

を返す。

将来`runtimeFrozen=true`にしても次は拒否:

- empty version
- group 0件
- group ID重複
- empty required IDs
- empty display name

結果:

```txt
LOCKED / INVALID_FROZEN_SPECIFICATION
```

Frozen specificationでのみ:

```txt
INCOMPLETE
→ ELIGIBLE
→ CLAIMED
```

へ進む。

Claimは:

- requirements完了時だけ
- immutable update
- idempotent
- claimed flagだけで不足条件を迂回不可

---

# 8. Global constellation Definition graph

Source:

- `src/game/data/globalConstellationDefinition.ts`

Foundation counts:

```txt
Group roots             = 6
Stage roots             = 20
Character roots         = 21
Item lineage roots      = 21
Stage1 achievement nodes= 25
Named-object links      = 126
```

126 objectは:

- Character root
- Item lineage root
- related Stage root
- related Character root

へnavigation linkを持つ。

Current:

```txt
runtimeConnected = false
runtimeDenominatorFrozen = false
```

これはUI完成ではない。

---

# 9. Machine-readable sources

- `docs/design-targets/generated/named-object-registry-v1.json`
- `docs/design-targets/generated/named-object-clear-getter-coverage-v1.json`

Coverage JSONはschemaVersion 2へ更新し、Definition foundationと未接続境界を記録した。

---

# 10. Verification

Unit tests added:

- `namedObjectRegistry.test.ts`
- `namedObjectMigrationLedger.test.ts`
- `namedObjectReadModels.test.ts`
- `collectionProgressCompatibility.test.ts`
- `collectionProgressSaveV2.test.ts`
- `allLightsCompletion.test.ts`
- `globalConstellationDefinition.test.ts`

Coverage:

- 21 / 126 counts
- ID uniqueness
- stable Shadow IDs
- 4-direction connections
- same-name phase
- snapshot sync
- old data preservation
- Nagi/Michiru compatibility
- 黒耀化 display normalization
- Stage1 25 IDs/coordinates
- old Enemy cells review isolation
- v1 / corrupt / unknown / duplicate / v2 fixtures
- 100% fail-closed
- invalid frozen spec rejection
- idempotent claim
- global graph reference integrity

Standalone checker:

- `scripts/quality/check-named-object-registry.ts`

Checks:

- registry
- migration ledger
- unknown ID preservation
- completion reward non-auto-claim
- draft completion LOCK
- global graph

Command:

```sh
node --experimental-strip-types scripts/quality/check-named-object-registry.ts
```

Registry単体はNode strip-typesで実行済み:

```txt
lineages = 21
named objects = 126
errors = 0
warnings = 1
warning = ren includes Working display names
```

今回追加した全repository test/buildはconnector環境では実行していない。
GitHub Actions結果を別途確認する。

---

# 11. Still not connected

- `keeperRecords.ts` UI source remains 5 records
- keeper emblem assets remain Core5 scope
- `lostItemRecords.ts` remains 6 cards
- lost-item card assets remain 6
- `collectionProgress.ts` remains original Stage1 prototype authority for current UI
- production save service does not use v2
- global constellation UI is absent
- launch-v1 required ID list is not frozen
- 全灯の朝Scene / art / music / cosmetic / remix mode are absent

---

# 12. Next safe implementation order

```txt
1. Local/full CI validation of new tests and checker
2. Correct any type/test regressions
3. Connect display-only Stage1 黒耀化 normalization
4. Build keeper compatibility UI behind existing asset scope
5. Review Current48 mapping for six legacy Stage1 cells
6. Connect Collection save v2 through versioned save service
7. Add old/partial/unknown/100% persistent save fixtures
8. Design and approve launch-v1 required ID specification
9. Implement global constellation UI incrementally
10. Produce and approve 全灯の朝 assets/content
```

Do not combine save migration, 21-character asset expansion and celebration production in one destructive commit.

---

# 13. Readiness boundary

This work does not promote:

- runtimeNamedObjectConnected
- collectionSaveV2Connected
- globalConstellationReady
- allLightsMorningReady
- U49
- U50
- RC
- productionApproved

---

# 14. Result

> **Current21の126個の名前ある物はstable IDとconnection graphを持ち、旧記録を消さずにsave v2へ移す土台までできた。全灯の朝は豪華な複合報酬としてDefinition化されたが、正式分母・UI・production save・Sceneはまだfail-closedで未接続である。**
