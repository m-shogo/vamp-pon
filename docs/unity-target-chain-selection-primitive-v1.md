# Unity Target Chain Selection Primitive v1

Status: `IMPLEMENTED_SHARED_SELECTION_FOUNDATION / NOT_LIVE / NOT_CANON_TUNING`

## Purpose

PULSE_CHAIN系のcallerへ、各hopでlocal anchorを更新しながらdeterministicに次targetを選ぶshared primitiveを提供する。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Source

`U2EnemyTargetChainSelectionRuntime.SelectChain(...)`

Caller supplies:

- candidates
- parallel priority scores
- first origin
- max first range
- max hop distance
- max target count
- reusable result list

## Selection rule

For each hop:

1. first hopはcaller origin、以後は直前selected targetをanchorにする
2. null / untargetable / non-finite-scoreを除外
3. 既にchainへ入ったtargetを除外
4. local range外を除外
5. caller priority最大を選ぶ
6. score同値なら現在anchorから近いtargetを選ぶ
7. score / distance完全同値ならinput orderを保持
8. 選べなくなった時点でchain終了

Finite negative scoreは有効。

## Complexity

- O(maxTargets × candidates × selectedPrefix)
- LINQなし
- sortなし
- internal List allocationなし
- result collectionはcaller-owned / reused

## Non-ownership

Shared selectorは持たない:

- Weapon ID
- CONDUCTIVE / SHOCKなどStatus意味
- damage
- Status application
- hop cadence
- per-hop damage falloff
- VFX / SFX
- Canon priority/range/target count
- live registry admission

Status優先を行う場合はcallerがpriority scoreへ変換する。

## Executable proof

- `scripts/quality/unity-target-chain-selection/UnityTargetChainSelection.Contract.csproj`
- `scripts/quality/unity-target-chain-selection/Program.cs`

TEST_ONLY contract verifies:

- first-range selection
- local re-anchor per hop
- highest caller priority in local range
- unreachable lower-priority target skipped
- no duplicate targets
- equal priority -> nearer
- exact tie -> stable input order
- finite negative priority
- untargetable candidate filtering
- non-finite score filtering
- maxTargets cap
- stale result clearing
- parallel-list mismatch fail closed
- invalid range/origin/cap fail closed
- candidate/result alias fail closed

All fixture values are `NOT_CANON`.

## Admission boundary

This foundation intentionally does **not** promote `TARGET_CHAIN_SELECTION` yet.

A Selected16 caller must still prove:

- authored Status preference translated into caller score
- real per-hop damage / Status order
- no duplicate-hit policy
- telemetry
- executable caller contract

Only after consumer proof should the Title1 capability overlay change.

## Original / Canon boundary

No Story / Character / Content selection / Canon numeric values are modified.

`runtimeAutoPromotionAllowed = false`
