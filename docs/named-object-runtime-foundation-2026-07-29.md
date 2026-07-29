# ヨルノシルベ Named Object Runtime Foundation

Date: 2026-07-29  
Status: **PHASE 0–2 FOUNDATION IMPLEMENTED / EXISTING RUNTIME READ MODELS NOT MIGRATED**

> 名前のある物をCurrentへ接続するためのstable definition、non-destructive migration ledger、machine-readable snapshot、unit test、quality checkerを追加した。
>
> `keeperRecords.ts`、`lostItemRecords.ts`、`collectionProgress.ts`、save、UIはまだ新Definitionへ接続していない。

---

# 1. Implemented

## Stable object Definition

Source:

- `src/game/data/namedObjectRegistry.ts`

Coverage:

```txt
Current21 character lineages = 21
phases per lineage           = 6
named objects                = 126
completion groups            = 6
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

各named objectは最低でも:

- Character
- Stage
- Gameplay verb
- Archive

へ接続する。

Relationship connectionもlineageへ保持する。

## Stable ID

Display nameをkeyにしない。

```txt
named-object:{characterId}:luminous_possession
named-object:{characterId}:starter_gear
named-object:{characterId}:passive_item
named-object:{characterId}:rare_item
named-object:{characterId}:lamp_tsugi
named-object:{characterId}:akatsuki_biraki
```

例:

```txt
named-object:yui:luminous_possession
named-object:nagi:rare_item
named-object:kage3:lamp_tsugi
```

Shadowは:

```txt
kage1 = カナメ
kage2 = カスミ
kage3 = トキ
kage4 = ツムギ
```

としてCurrent displayへ接続するが、stable IDは変更しない。

## Same-name lineage

同じCharacter内で同名が再登場する場合、collisionではなく同一objectのphase成長として`sameObjectPhase`を持つ。

対象例:

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

## 全灯の朝 Definition

Definitionには:

```txt
version = design-v1
runtimeFrozen = false
reward = 全灯の朝
```

を明記した。

Design target group:

- 夜路
- 灯し手
- 灯具
- カゲモノ
- 結び
- 夜の余白

数は有限だが、**launch runtime denominatorをfreezeしたとは扱わない**。

レンはCurrent21の人物・祝祭対象としてDefinitionに含むが:

```txt
namingStatus = WORKING
requiredForLaunchCompletion = false
```

を維持する。

---

# 2. Non-destructive migration ledger

Source:

- `src/game/data/namedObjectMigrationLedger.ts`

旧情報を削除しない。

## Core5 old personal props

次はCurrentの光る持ち物へsilent overwriteしない。

- ユイ: 左腰の小さな拾い物バッグ
- アサ: 止まったままの小さな懐中時計
- ナギ: 書き足しだらけの折り畳み星図
- ミチル: 水音を閉じ込めた青い小瓶
- トモリ: 色の違う糸を巻いた古い針差し

旧小物は:

- historical prop
- secondary personal item
- optional archive reference

として再利用可能。

Currentの主objectと同一物だったことにはしない。

## Nagi / Michiru old lost-item bindings

Current rebinding direction:

```txt
折れた地図の角
legacy: ナギ
current route connection: ミチル

錆びた部屋の鍵
legacy: ミチル
current box/key connection: ナギ
```

旧本文・旧bindingはmigration historyへ保存する。

## Current terminology

```txt
legacy alias: 黒曜化
current display: 黒耀化
```

旧表記はsave/search migration用aliasとして認識してよい。
Visible Current UIへは表示しない。

## Review-required

まだ推測で移行しない:

- Stage1 boardの旧Enemy名 → Current48 mapping
- `light_coin` / 灯貨 / 黒曜片 → 記憶片 economy migration

これらはCurrent production data、save quantity、reward economyを確認してから決める。

---

# 3. Machine-readable snapshot

- `docs/design-targets/generated/named-object-registry-v1.json`

Contains:

- Current21 lineage summary
- 126 stable object IDs
- Current display names
- stage / gameplay / relationship connections
- completion group targets
- runtime boundary flags

SnapshotとTypeScript Definitionの件数・主要名をunit testで照合する。

---

# 4. Verification added

## Unit tests

- `src/game/data/namedObjectRegistry.test.ts`
- `src/game/data/namedObjectMigrationLedger.test.ts`

Checks:

- Current21 = 21
- named objects = 126
- ID uniqueness
- Shadow stable ID / Current display name
- Character / Stage / Gameplay / Archive connection
- same-name lineage marking
- finite completion targets
- runtime denominator not frozen
- Ren Working boundary
- JSON snapshot alignment
- non-destructive migration
- Nagi / Michiru rebinding direction
- 黒耀化 term migration
- unresolved mapping remains warning

## Quality checker

- `scripts/quality/check-named-object-registry.ts`

Standalone command:

```sh
node --experimental-strip-types scripts/quality/check-named-object-registry.ts
```

Current registry source was independently executed with Node strip-types:

```txt
lineages = 21
named objects = 126
errors = 0
warnings = 1
warning = ren includes Working display names
```

The repository full test/build was not executed from the connector-only environment.
GitHub Actions status remains a separate check.

---

# 5. Not migrated yet

Still unchanged:

- `keeperRecords.ts` remains old Core5 read model
- `lostItemRecords.ts` remains existing 6-card model
- `collectionProgress.ts` remains Stage1 25-cell prototype
- Collection save schema remains old schema
- keeper emblem asset coverage remains Core5
- lost-item card asset coverage remains 6
- global constellation UI is not implemented
- 全灯の朝 scene/reward is not implemented

This is intentional.
Changing definitions does not automatically claim runtime/UI/save completion.

---

# 6. Next safe implementation order

```txt
1. Generated keeper object read model
   - new Definition → read model
   - old keeper IDs preserved
   - no asset requirement expansion yet

2. Lost-item compatibility read model
   - current connection + legacy connection
   - existing 6 IDs preserved

3. Stage1 board display migration
   - keep IDs/save state
   - 黒耀化 display correction
   - old enemy labels classified individually

4. Collection save v2 draft
   - version
   - connectedObjectIds
   - completion group states
   - unknown legacy IDs preserved

5. Save migration fixtures
   - old
   - partial
   - completion
   - unknown ID

6. Global constellation Definition
   - UI implementation later

7. 全灯の朝 unlock Definition
   - reward claim idempotency
   - replayable celebration
   - runtime assets after Human approval
```

Do not migrate all of these in one destructive commit.

---

# 7. Readiness boundary

This foundation does not promote:

- runtime named-object connection ready
- Collection save migrated
- global constellation ready
- 全灯の朝 ready
- U49
- U50
- RC
- production approval

---

# 8. Result

> **名前のある物は、今後display nameだけで漂わない。Current21の126 objectへstable IDが付き、人物・Stage・Gameplay・関係・灯録と接続できるDefinition foundationができた。次は古い記録を消さず、read modelとsaveを一段ずつ移行する。**
