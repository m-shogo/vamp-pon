# Unity Two-Target Tether Pair Selection Primitive v1

Status: `IMPLEMENTED_SHARED_SELECTION_PRIMITIVE / NOT_LIVE / NOT_CANON_TUNING`

## Purpose

Selected16のTETHER / LINK_CHAIN系をgeneric Projectileへ偽装せず、2体をdeterministicに選ぶshared primitiveを提供する。

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

Negative finite priorityは有効。

Origin distance / pair distanceはXYのみ。

## Why caller-owned score

Generic selectorは「誰をtetherすべきか」のContent意味を知らない。

Callerは将来:

- marked / exposed等のruntime state
- threat
- target role
- player proximity
- combo context

を別Authorityからscoreへ変換できる。

Shared layerへ武器名やStatus意味を埋め込まない。

## Complexity

- O(n^2) pair scan
- LINQなし
- sortなし
- internal List allocationなし
- caller collection reuse前提

2-target pairという性質上、候補全pairを見ることでscore/pair-distanceのdeterministic contractを保つ。

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

All fixture values are `NOT_CANON`.

## Admission boundary

このfoundation PRではTitle1 `TWO_TARGET_TETHER` capabilityを先に昇格しない。

shared selectorがCIで実行証明された後、Admission overlay更新と具体的Selected16 callerを別gateで行う。

## Live boundary

禁止:

- Web live catalog追加
- Stage1GameplayRuntimeCoordinator接続
- LevelUp追加
- U47 executor拡張
- save migration
- generic selectorへのWeapon/Status identity追加
- Canon tuning作成

`runtimeAutoPromotionAllowed = false`

## Next

1. shared selector contractをmainへ固定
2. `TWO_TARGET_TETHER=IMPLEMENTED` overlay
3. TETHER/LINK_CHAIN consumer caller proof
4. tether lifetime/damage/Statusはcaller別gate
5. rendered line/readability evidence
