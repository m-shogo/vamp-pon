# Unity Homing Priority Selection Primitive v1

Status: `IMPLEMENTED_SHARED_PRIMITIVE / NOT_LIVE / NOT_CANON_TUNING`

## Purpose

Selected16のprecision/homing系をnearest-target固定へ潰さず、callerが決めたpriority scoreと距離tie-breakで一体を選べるshared primitiveを追加する。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Runtime source

`unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyHomingPrioritySelectionRuntime.cs`

Main API:

`U2EnemyHomingPrioritySelectionRuntime.TrySelect(...)`

Inputs:

- candidate list
- candidateと同じ長さのcaller-owned priority score list
- origin
- min range
- max range
- distance tie-break policy

Output:

`U2EnemyPrioritySelectionResult`

- selected target
- original candidate index
- selected priority score
- 2D distance squared

## Priority ownership

Generic primitiveはpriorityの意味を知らない。

Callerがscoreを用意する。

例として将来callerは:

- 同score + `PreferFarther` でfar targetを優先
- MARKED targetへ高scoreを与える
- elite / boss / threat等のruntime priorityを別authorityからscore化する

ことができる。

ただしこのprimitive自身には:

- `star_map_pin`
- `return_compass_needle`
- MARKED
- boss / elite
- HP
- damage
- crit
- homing curve

を埋め込まない。

## Selection semantics

候補ごとに:

1. null / untargetableをskip
2. non-finite priority scoreをskip
3. XY平面のdistance squaredを計算
4. caller range外をskip
5. highest priority scoreを選択
6. score同値ならcaller指定tie-break
7. さらに同値ならinput orderを保持

Distance tie-break:

- `StableInputOrder`
- `PreferNearer`
- `PreferFarther`

range boundaryはinclusive。

Zはtarget priority distanceへ使わない。

## Fail closed

falseを返す:

- candidates null
- priority scores null
- list長不一致
- min range negative / non-finite
- max range non-positive / non-finite
- min > max
- invalid enum
- eligible targetなし

Negative priority scoreは有限なら有効。generic layerはscoreの0基準を勝手に決めない。

## Allocation / performance boundary

- LINQなし
- sortなし
- internal List生成なし
- caller owns candidate / score collections
- one pass O(n)

Target countが増えてもpriority selector自身がper-shot garbageを作らない。

## Selected16 impact

`HOMING_PRIORITY_SELECTION` を `MISSING` から `IMPLEMENTED` へ移す。

### star_map_pin

Required:

- `HOMING_PRIORITY_SELECTION`
- `STATUS_APPLICATION`

両方shared primitiveはIMPLEMENTEDになる。

ただし `StarMapPinPrototypeRuntime` caller proofはまだ無いため:

`BLOCKED_MISSING_UNITY_CALLER_PROOF`

へ進むだけ。

### return_compass_needle

Required:

- `RETURNING_PROJECTILE`
- `HOMING_PRIORITY_SELECTION`
- Status requirement if selected admission authority requires it

HOMING priorityは解消するが、`RETURNING_PROJECTILE` がまだMISSINGなのでprimitive-blockedのまま。

## Executable contract

- `scripts/quality/check-unity-homing-priority-selection-primitive.ts`
- `scripts/quality/unity-homing-priority-selection/UnityHomingPrioritySelection.Contract.csproj`
- `scripts/quality/unity-homing-priority-selection/Program.cs`

Real primitive sourceを.NET 8でcompile/runして確認する。

TEST_ONLY cases:

1. highest priority beats distance
2. equal score + PreferFarther
3. equal score + PreferNearer
4. equal score + StableInputOrder
5. inclusive min/max range
6. 2D distance / z ignored
7. negative finite score valid
8. non-finite score skipped
9. untargetable skipped
10. outside range skipped
11. list length mismatch fail closed
12. invalid range fail closed
13. no eligible target false

TEST_ONLY valuesは **NOT_CANON**。

## Live Stage1 boundary

shared selectorだけではlive接続しない。

禁止:

- `Stage1GameplayRuntimeCoordinator`へselectorを自動接続
- Web `weapons.ts`へSelected weapon追加
- U47 `WeaponEffectType`拡張
- LevelUp追加
- save migration
- Canon priority score / range / cadence作成
- generic selectorへMARKEDや敵種別を埋め込み

`runtimeAutoPromotionAllowed = false`

## Next

次は `StarMapPinPrototypeRuntime` caller proof。

Caller側で:

1. score scratchを作る
2. far/high-priority preferenceを明示
3. selected targetへ既存 targeted projectile primitiveを使う
4. typed MARKED requestをtransportする
5. caller-owned telemetryを記録する

数値は `PROTOTYPE_TUNING_NOT_CANON` のまま分離する。
