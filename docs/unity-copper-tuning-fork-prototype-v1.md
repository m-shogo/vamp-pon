# Unity Copper Tuning Fork Prototype v1

Status: `SELECTED16 / STAGED_CALLER_PROOF / TARGET_CHAIN_CAPABILITY_NOT_YET_PROMOTED / NOT_LIVE`

## Purpose

Selected16 `copper_tuning_fork` / 銅の音叉の `PULSE_CHAIN` を、shared target-chain selection + caller-owned CONDUCTIVE preference + typed SHOCK/CONDUCTIVEとして実装する。

Authoring Authority:

`TITLE1_SELECTED`

Mechanical identity:

- small radial/short chain
- currently CONDUCTIVE targets preferred through caller-supplied score bonus
- no long stun

## Composition

`CopperTuningForkPrototypeRuntime`

uses:

- `U2EnemyTargetChainSelectionRuntime`
- `EnemyStatusRuntimeKind.Shock`
- `EnemyStatusRuntimeKind.Conductive`
- typed `EnemyStatusApplicationRequest`

Application order:

`PRIORITY_SNAPSHOT_CHAIN_DAMAGE_SURVIVING_SHOCK_THEN_CONDUCTIVE`

## Conductive preference snapshot

Selection前にcallerが全candidateのCONDUCTIVE状態をsnapshotし、effective priorityを作る。

`effectiveScore = basePriorityScore + (currently CONDUCTIVE ? conductivePriorityBonus : 0)`

`conductivePriorityBonus` は caller supplied / NOT_CANON。

重要:

- chain全体を選択してからdamage/Statusを適用
- 同じpulse中に新しく付いたCONDUCTIVEは、そのpulseの後続hop選択をretroactiveに変えない
- generic chain selectorはCONDUCTIVE/SHOCK/Weapon IDを知らない
- bonusは絶対優先ではなく、base scoreとの差で決まる

## Per-hop effect order

Selected hopごとに:

1. damage
2. telemetry
3. defeatedなら終了
4. surviving target -> typed SHOCK
5. surviving target -> typed CONDUCTIVE

SHOCK internal cooldownがSHOCK適用をblockしても:

- damageは通る
- CONDUCTIVE適用は独立して試行される

## Shared chain behavior

`U2EnemyTargetChainSelectionRuntime` owns only:

- caller candidates + parallel scores
- first origin / max first range
- max hop distance
- max target count
- each hop re-anchors to previous selected target
- highest score
- score tie -> nearer
- exact tie -> stable input order
- duplicate exclusion

It owns no Weapon / Status / damage / cadence / VFX meaning.

## Caller-supplied tuning

固定しない:

- base priority scores
- conductive priority bonus
- first range
- hop distance
- max targets
- damage / damage flash
- SHOCK duration/stacks/magnitude/cooldown
- CONDUCTIVE duration/stacks/magnitude/cooldown

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Executable proof

- `scripts/quality/unity-copper-tuning-fork/UnityCopperTuningFork.Contract.csproj`
- `scripts/quality/unity-copper-tuning-fork/Program.cs`

TEST_ONLY scenarios:

- CONDUCTIVE bonus beats higher unmarked base score when sufficient
- insufficient bonus does not become absolute override
- local hop re-anchor / distance limit
- surviving target receives SHOCK then CONDUCTIVE
- defeated target receives neither Status after damage
- SHOCK cooldown does not block damage or later CONDUCTIVE
- newly applied CONDUCTIVE does not alter same-pulse chain selection
- invalid range / score mismatch / maxTargets / damage fail closed
- telemetry reset

All fixture values are NOT_CANON.

## Staged Admission boundary

Caller proof green前後を問わず、このcaller-only stepでは:

`TARGET_CHAIN_SELECTION = MISSING`

`copper_tuning_fork` は:

`BLOCKED_MISSING_UNITY_PRIMITIVES`

caller registryへまだ追加しない。

Shared chain foundation + this executable Selected16 caller proofがgreenになった後、別Admission overlayでatomicに:

- `TARGET_CHAIN_SELECTION = IMPLEMENTED`
- `copper_tuning_fork` caller proof registered
- `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

へ進める。

Even then:

`runtimeStatus = NOT_IMPLEMENTED`

## Live boundary

No automatic connection to:

- Web live catalog
- LevelUp
- `Stage1GameplayRuntimeCoordinator`
- U47 executor
- save migration
- final chain VFX/SFX
- production balance

`runtimeAutoPromotionAllowed = false`
