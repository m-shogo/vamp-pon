# Unity Two-Target Tether Pair Selection Primitive v1

Status: `IMPLEMENTED_SHARED_SELECTION_PRIMITIVE / CAPABILITY_IMPLEMENTED / NOT_LIVE / NOT_CANON_TUNING`

## Purpose

Selected16のTETHER系をgeneric Projectileへ偽装せず、2体をdeterministicに選ぶshared primitiveを提供する。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Source

`unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Gameplay/Primitives/U2EnemyTetherPairSelectionRuntime.cs`

API:

`U2EnemyTetherPairSelectionRuntime.TrySelectPair(...)`

Caller inputs:

- candidates
- parallel priority scores
- origin
- min/max origin range
- min/max pair distance

Result:

- first / second target
- original candidate indices
- combined priority score
- pair distance squared

## Selection rule

1. null / untargetable / non-finite-score candidateを除外
2. origin range外を除外
3. 2体のpair distance band外を除外
4. `scoreA + scoreB` が最大のpairを選択
5. combined score同値なら短いpairを優先
6. exact tieはnested input orderの最初を保持

Negative finite priorityは有効。Origin distance / pair distanceはXYのみ。

## Why caller-owned score

Generic selectorは「誰をtetherすべきか」のContent意味を知らない。

Callerは将来、Status / threat / target role / player proximity / combo contextを別Authorityからscoreへ変換できる。Shared layerへ武器名やStatus意味を埋め込まない。

## Complexity

- O(n^2) pair scan
- LINQなし
- sortなし
- internal List allocationなし
- caller collection reuse前提

## Non-ownership

持たない:

- Weapon ID
- tether damage
- Status
- link duration
- tick cadence
- beam/line rendering
- break condition
- target movement
- projectile
- Canon range / pair distance / priority score

## Executable contract

- `scripts/quality/unity-two-target-tether/UnityTwoTargetTether.Contract.csproj`
- `scripts/quality/unity-two-target-tether/Program.cs`

TEST_ONLY:

- highest combined priority pair
- equal score -> shorter pair
- exact tie -> stable input pair
- pair-distance band
- origin range
- targetable filtering
- XY distance / z ignored
- negative finite scores
- invalid/mismatched input fail closed
- fewer than 2 / no eligible pair fail closed

All fixture values are `NOT_CANON`。

## Admission boundary

shared selector foundationは専用contract / Stage1 / full CIを通過してmainへ入ったため、Title1 overlayでは:

`TWO_TARGET_TETHER = IMPLEMENTED`

へ昇格する。

ただしshared capability完成だけでconsumerを自動昇格しない。

### `rain_thread`

Selected16のTETHER consumer。

required:

- `TWO_TARGET_TETHER`
- `KNOCKBACK_VECTOR`
- `STATUS_APPLICATION`

3つともIMPLEMENTED。

`KNOCKBACK_VECTOR` はRain Threadのmechanical identityにある **position control** をgeneric tether selectorへ埋め込まず、caller側で2体を互いに引き寄せるために再利用するshared displacement primitiveとして要求する。

ただしSelected16固有callerはまだ無い。

したがって:

`BLOCKED_MISSING_UNITY_CALLER_PROOF`

`runtimeStatus = NOT_IMPLEMENTED`

を維持する。

### `name_reel`

Authoring Authorityでは:

`HOLD_TARGET_LINK_READABILITY`

でありSelected16ではない。

Tether runtime進捗を理由にAdmission rowを作成したり、Title1へ昇格したりしない。

## Live boundary

禁止:

- Web live catalog追加
- Stage1GameplayRuntimeCoordinator接続
- LevelUp追加
- U47 executor拡張
- save migration
- generic selectorへのWeapon/Status identity追加
- Canon tuning作成
- capability完成だけでconsumer callerを捏造

`runtimeAutoPromotionAllowed = false`

## Next

1. `rain_thread` Selected16 caller proof
2. typed SOAK application + two-target semantics
3. `KNOCKBACK_VECTOR` を使ったcaller-owned position control
4. tether lifetime / break-distance policy
5. rendered line/readability evidence
6. human live-admission review
