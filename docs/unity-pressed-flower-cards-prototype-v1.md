# Unity Pressed Flower Cards Prototype v1

Status: `SELECTED16 / CALLER_PROOF_VERIFIED / CAPABILITY_IMPLEMENTED / IMPLEMENTATION_REVIEW_ADMITTED / NOT_LIVE`

## Purpose

Selected16 `pressed_flower_cards` / 押花札の `TRAP_FIELD` を、shared trap persistence + caller-owned trigger radius + typed ROOTEDとして実装する。

Authoring Authority: `TITLE1_SELECTED`。

Mechanical identity:

- small discrete card traps
- visible arming delay
- target enters card radius -> one physical trigger is consumed
- ROOTED on eligible target
- no giant persistent AoE

1枚のplaced card = `PressedFlowerCardsPrototypeState` 1instance。Weapon全体の同時枚数、placement cadence、pool sizeは固定しない。

## Composition

Uses `U2PersistentTrapState` + typed ROOTED + per-placement target ledger。

Application order:

`PLACE_ARM_WAIT_TARGET_ENTER_CONSUME_TRIGGER_THEN_TYPED_ROOTED`

Shared trap owns placement / arming / active lifetime / trigger budget / lifecycle。Caller owns trigger radius / targetability / unique-target policy / ROOTED / telemetry。

Out-of-range / duplicate / untargetable targetはtrigger budgetを消費しない。

Eligible physical trigger:

1. shared budgetをconsume
2. target ledgerへ記録
3. typed ROOTEDをattempt

ROOTED internal cooldown may block Status but does **not refund** the physical trigger.

## Caller-supplied tuning

固定しない: placement、arming delay、active lifetime、trigger budget、radius、ROOTED policy、card count、placement cadence。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Executable proof

- `scripts/quality/unity-pressed-flower-cards/UnityPressedFlowerCards.Contract.csproj`
- `scripts/quality/unity-pressed-flower-cards/Program.cs`

Verified:

- pre-arm rejection without budget loss
- arming overshoot / lifetime accounting
- radius filtering
- unique target ledger
- trigger exhaustion
- typed ROOTED
- ROOTED cooldown does not refund physical trigger
- large tick arm + expire
- invalid inputs fail closed
- reset/telemetry reset

All fixture values NOT_CANON。

## Boss boundary

Content runtime note includes root conversion for bosses. This implementation-review admission does **not** invent a boss conversion policy before a shared boss-Status gate exists.

- normal typed ROOTED + trap lifecycle are proven
- boss conversion remains later live/implementation evidence
- no boss immunity/slow/action-delay value is frozen

Boss conversion未実装はlive admission blockerであり、generic fallbackをCanon化しないためのhonesty boundary。

## Admission state

Shared trap foundation + executable Selected16 caller proof are green:

`TRAP_PERSISTENCE = IMPLEMENTED`

Caller proof is registered and current decision is:

`ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`

Still:

`runtimeStatus = NOT_IMPLEMENTED`

## Live boundary

No automatic Web catalog / LevelUp / `Stage1GameplayRuntimeCoordinator` / U47 executor / save migration / final VFX/SFX / production balance。

`runtimeAutoPromotionAllowed = false`
