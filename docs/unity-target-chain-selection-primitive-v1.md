# Unity Target Chain Selection Primitive v1

Status: `IMPLEMENTED_SHARED_SELECTION_FOUNDATION / CAPABILITY_IMPLEMENTED / NOT_LIVE / NOT_CANON_TUNING`

## Purpose

PULSE_CHAIN系callerへ、各hopでlocal anchorを更新しながらdeterministicに次targetを選ぶshared primitiveを提供する。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Source

`U2EnemyTargetChainSelectionRuntime.SelectChain(...)`

Caller supplies candidates / parallel priority scores / first origin / max first range / max hop distance / max target count / reusable result list。

## Selection rule

For each hop:

1. first hopはcaller origin、以後は直前selected targetをlocal anchorにする
2. null / untargetable / non-finite-score除外
3. 既selected target除外 — no duplicate
4. local range外除外
5. caller priority最大
6. score tie -> nearer
7. exact score/distance tie -> stable input order
8. 選べなければchain終了

Finite negative scoreは有効。

## Complexity / non-ownership

- O(maxTargets × candidates × selectedPrefix)
- LINQなし / sortなし / internal List allocationなし
- result listはcaller-owned

Shared selectorはWeapon ID / CONDUCTIVE / SHOCK / damage / Status application / cadence / falloff / VFX / Canon priorityを持たない。

Status preferenceはcallerがpriority scoreへ変換する。

## Executable foundation proof

- `scripts/quality/unity-target-chain-selection/UnityTargetChainSelection.Contract.csproj`
- `scripts/quality/unity-target-chain-selection/Program.cs`

Tests cover local re-anchor, highest caller priority, no duplicate, tie rules, Finite negative score, targetable/non-finite filtering, cap, stale-result clearing and fail-closed inputs. All values NOT_CANON。

## Selected16 consumer proof

`copper_tuning_fork` / 銅の音叉 が executable Selected16 callerとしてmainでgreen。

Caller:

`CopperTuningForkPrototypeRuntime`

Application order:

`PRIORITY_SNAPSHOT_CHAIN_DAMAGE_SURVIVING_SHOCK_THEN_CONDUCTIVE`

Consumer proves:

- current CONDUCTIVE state -> caller-supplied priority bonus
- chain全体をStatus適用前にsnapshot/select
- local re-anchor semanticsをshared selectorから継承
- damage first
- surviving target only -> SHOCK -> CONDUCTIVE
- defeated targetへpost-death Statusなし
- SHOCK cooldownとdamage/CONDUCTIVEを分離
- telemetry
- all tuning caller supplied

Generic selectorは`copper_tuning_fork` / CONDUCTIVE / SHOCKを知らない。

## Admission boundary

Shared foundation + Copper executable caller proofがgreenのため:

`TARGET_CHAIN_SELECTION = IMPLEMENTED`

`copper_tuning_fork` は:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Still:

`runtimeStatus = NOT_IMPLEMENTED`

これはlive runtime接続を意味しない。

## Live / Original / Canon boundary

No automatic Web catalog / LevelUp / Stage1GameplayRuntimeCoordinator / U47 executor / save migration / final VFX / production balance。

No Story / Character / Content selection / Canon numeric values are modified.

`runtimeAutoPromotionAllowed = false`
