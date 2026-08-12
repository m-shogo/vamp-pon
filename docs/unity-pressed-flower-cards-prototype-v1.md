# Unity Pressed Flower Cards Prototype v1

Status: `SELECTED16 / STAGED_CALLER_PROOF / TRAP_CAPABILITY_NOT_YET_PROMOTED / NOT_LIVE`

## Purpose

Selected16 `pressed_flower_cards` / 押花札の `TRAP_FIELD` を、shared trap persistence + caller-owned trigger radius + typed ROOTEDとして実装する。

Authoring Authority:

`TITLE1_SELECTED`

Mechanical identity:

- small discrete card traps
- visible arming delay
- target enters card radius -> one physical trigger is consumed
- ROOTED on eligible target
- no giant persistent AoE

1枚のplaced cardを `PressedFlowerCardsPrototypeState` 1instanceとして扱う。Weapon全体の同時枚数、placement cadence、pool sizeはこのcallerで固定しない。

## Composition

`PressedFlowerCardsPrototypeState`

uses:

- `U2PersistentTrapState`
- typed `EnemyStatusApplicationRequest`
- `EnemyStatusRuntimeKind.Rooted`
- caller-owned per-placement target ledger

Application order:

`PLACE_ARM_WAIT_TARGET_ENTER_CONSUME_TRIGGER_THEN_TYPED_ROOTED`

## Trap lifecycle

Shared trap owns:

- placement position
- arming delay
- active lifetime
- trigger budget
- Arming / Armed / Exhausted / Expired state
- arming overshoot carryover into active lifetime

Caller owns:

- trigger radius
- targetability check
- one-trigger-per-target-per-card policy
- typed ROOTED request
- telemetry

An out-of-range/duplicate/untargetable target does not consume trigger budget.

Once an eligible target physically triggers the card:

1. shared trigger budget is consumed
2. target is recorded in the placement ledger
3. typed ROOTED is attempted

ROOTED internal cooldown may block Status application but does **not refund** the physical trap trigger.

## Caller-supplied tuning

固定しない:

- placement position
- arming delay
- active lifetime
- trigger budget
- trigger radius
- ROOTED duration/stacks/magnitude/cooldown
- total card count
- placement cadence

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Executable proof

- `scripts/quality/unity-pressed-flower-cards/UnityPressedFlowerCards.Contract.csproj`
- `scripts/quality/unity-pressed-flower-cards/Program.cs`

TEST_ONLY scenarios:

- positive arming delay begins Arming
- pre-arm trigger rejected without budget loss
- arming overshoot preserves active lifetime accounting
- out-of-range target does not consume trigger
- first unique in-range target applies ROOTED and consumes budget
- same target cannot consume same card twice
- second unique target can exhaust remaining budget
- exhausted card rejects later target
- ROOTED cooldown blocks only Status and does not refund trigger
- large tick may arm + expire without extending lifetime
- expired card rejects trigger
- invalid arming/radius fail closed
- reset clears trap + unique-target ledger

All fixture values are NOT_CANON.

## Boss boundary

Content runtime note includes root conversion for bosses. This caller proof intentionally does **not** invent a boss conversion policy before a shared boss-Status gate exists.

Therefore:

- normal typed ROOTED semantics are proven here
- boss conversion remains a later implementation/live review gate
- no boss immunity/slow/action-delay value is frozen here

This does not change Content identity; it prevents a fake generic fallback from becoming Canon.

## Staged Admission boundary

This caller-only step keeps:

`TRAP_PERSISTENCE = MISSING`

`pressed_flower_cards` remains:

`BLOCKED_MISSING_UNITY_PRIMITIVES`

Caller registry is not updated yet.

After shared trap foundation + this Selected16 executable caller proof are green, a separate atomic Admission overlay may:

- `TRAP_PERSISTENCE = IMPLEMENTED`
- register `pressed_flower_cards` caller proof
- move it to `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Even then:

`runtimeStatus = NOT_IMPLEMENTED`

Boss conversion, final card readability, live placement cadence and production balance remain separate gates.

## Live boundary

No automatic connection to:

- Web live catalog
- LevelUp
- `Stage1GameplayRuntimeCoordinator`
- U47 executor
- save migration
- final VFX/SFX
- production balance

`runtimeAutoPromotionAllowed = false`
