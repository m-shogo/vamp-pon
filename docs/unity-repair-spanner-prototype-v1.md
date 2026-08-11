# Unity Repair Spanner Prototype v1

Status: `NON_SELECTED_RETURN_FAMILY_PROOF / PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

## Purpose

`repair_spanner` / 修理スパナは現在 **Selected16ではない**。

Authoring selection authorityでは:

`HOLD_RETURN_FAMILY_OVERLAP`

としてCandidate reservoirに保持されている。

このruntime作業はその選定を変更せず、返投familyのmotion + 往路/復路別hit semanticsを実コードで検証する **non-selected prototype proof** として使う。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Selection boundary

保持する事実:

- `selectedForTitle1 = false`
- `decision = HOLD_RETURN_FAMILY_OVERLAP`
- Selected return familyは現Authoring Authority上 `return_compass_needle` を優先
- `repair_spanner` をruntime進捗だけでSelected16へ昇格しない
- `runtimeAutoPromotionAllowed = false`

このproofは将来のreturn family実装へ再利用できるが、Content selection proofではない。

## Runtime composition

`RepairSpannerPrototypeState`

uses:

- `U2ReturningProjectileMotionState`
- real `U2EnemyActor.TakeDamage(...)` surface
- typed `EnemyStatusApplicationRequest`
- `EnemyStatusRuntimeKind.Exposed`

Hit policy:

`ONE_HIT_PER_TARGET_PER_LEG_OUTBOUND_AND_RETURN_SEPARATE`

同じenemyは:

- outboundで最大1hit
- returnで最大1hit

したがって同一throw中に最大2hitできるが、同じleg内の多重hitはしない。

## Motion and hit detection

Caller state owns:

- current projectile position
- outbound target point mirror
- outbound hit ledger
- return hit ledger

Shared motion owns:

- Outbound / Returning / Complete phase
- movement
- turnaround
- moving return anchor
- same-frame travel-budget conservation
- Z preservation

Hit detectionはprevious→nextのXY segmentに対するpoint-to-segment距離で判定するため、高速stepでenemy中心を飛び越えてもendpoint-only判定よりtunnelingしにくい。

Turnaroundが同一frame内で起きた場合は:

1. previous → outbound target をOutbound ledgerで処理
2. outbound target → final step position をReturn ledgerで処理

する。

## Damage / Status order

各leg hit:

1. ledger重複確認
2. `TakeDamage`
3. telemetryへhit結果
4. 生存targetのみtyped EXPOSED request

倒れたenemyへEXPOSEDを後付けしない。

EXPOSED internal cooldownでreturn側Statusがblockされても、return damageは独立して成立する。

## Caller-supplied tuning

固定しない:

- speed
- delta
- arrival distance
- hit radius
- damage
- damage flash duration
- EXPOSED duration/stacks/magnitude/cooldown
- outbound target
- moving return anchor
- candidate set

すべて `PROTOTYPE_TUNING_NOT_CANON`。

## Telemetry

Caller-owned telemetry records:

- begin / step
- turnaround / complete
- outbound / return hit counts
- defeat count
- EXPOSED apply / cooldown-block outcomes

Global/static lifetimeを作らない。

## Executable proof

- `scripts/quality/unity-repair-spanner/UnityRepairSpanner.Contract.csproj`
- `scripts/quality/unity-repair-spanner/Program.cs`

TEST_ONLY contract verifies:

- outbound motion
- outbound segment hit
- death short-circuit before EXPOSED
- same-leg de-dup
- turnaround
- return hit table independent from outbound
- EXPOSED cooldown independent from return damage
- off-path target ignored
- Z preservation
- reset/reuse
- invalid input fail closed
- telemetry exactness

## Capability boundary

このPRでは `RETURNING_PROJECTILE` capabilityをまだ `IMPLEMENTED` へ上げない。

理由:

- shared motion foundationはmain済み
- non-selected Repair Spannerでhit table / turnaround semanticsを実証する
- Selected16本命 `return_compass_needle` のcaller proofは別に必要
- Content selectionとruntime capabilityを混同しない

Repair SpannerはTitle1 Admission matrixの対象ではないので、Selected16 decisionを作成しない。

## Live boundary

未接続:

- Web live catalog
- LevelUp
- `Stage1GameplayRuntimeCoordinator`
- U47 live executor
- save migration
- final VFX/SFX
- production balance

`runtimeAutoPromotionAllowed = false`

## Original / Canon boundary

このruntime実装から原本を変更しない。

Weapon name / attribute / EXPOSED identity / affinity / transformation graph / Canon values / Hold decisionを変更しない。

次のSelected16側のreturn proofは `return_compass_needle` で行う。
