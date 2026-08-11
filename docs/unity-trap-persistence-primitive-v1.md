# Unity Trap Persistence Primitive v1

Status: `IMPLEMENTED_SHARED_STATE_FOUNDATION / NOT_LIVE / NOT_CANON_TUNING`

## Purpose

`TRAP_FIELD` / movement breadcrumbのようなcaller-owned trap entityへ、arming・armed lifetime・trigger budget・expiryを共通stateとして提供する。

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Source

`U2PersistentTrapState`

Phases:

1. `Inactive`
2. `Arming`
3. `Armed`
4. `Exhausted`
5. `Expired`

## Begin contract

Caller supplies:

- placement position
- arming delay
- active duration
- trigger budget

Rules:

- negative/non-finite arming delay rejected
- active duration must be finite positive
- trigger budget must be > 0
- active trap rejects replacement begin
- zero arming delay starts immediately `Armed`

Position including Z is preserved as caller-owned placement data.

## Time semantics

`TryTick(deltaSeconds)` uses one caller delta budget.

If one large tick crosses arming completion:

1. consume remaining arming time
2. enter `Armed`
3. apply leftover delta to active lifetime

Therefore low FPS / large delta does not extend trap lifetime.

A sufficiently large single tick may report both:

- `ArmedThisTick = true`
- `ExpiredThisTick = true`

## Trigger budget

`TryConsumeTrigger` succeeds only while `Armed`.

Each successful call decrements caller-supplied budget.

When budget reaches zero:

`Phase = Exhausted`

Time expiry is separate:

`Phase = Expired`

No trigger is fabricated on time expiry.

## Non-ownership

The shared state does not own:

- Weapon ID
- enemy query / overlap shape
- root / SOAK / damage / Status
- boss conversion
- placement cadence
- movement breadcrumb generation
- VFX / SFX
- pooling implementation
- Canon arming/lifetime/trigger values
- live registry admission

## Executable proof

- `scripts/quality/unity-trap-persistence/UnityTrapPersistence.Contract.csproj`
- `scripts/quality/unity-trap-persistence/Program.cs`

TEST_ONLY contract verifies:

- delayed arming
- active lifetime does not decay before arming
- leftover delta after arming reduces active lifetime
- trigger budget consumption
- final trigger -> Exhausted
- exact time expiry
- one large tick arming + expiry
- time expiry does not consume trigger budget
- immediate-arm trap
- position/Z preservation
- reset/reuse
- active replacement begin rejection
- invalid position/timing/budget/delta fail closed without state mutation

All fixture values are `NOT_CANON`.

## Admission boundary

This foundation intentionally does **not** promote `TRAP_PERSISTENCE` yet.

Before capability admission, at least one real consumer path must prove:

- trap entity ownership/reuse
- target overlap semantics
- trigger consumption order
- caller Status/damage policy
- cleanup/reset behavior

Shared state existence alone is not Selected16 caller proof.

## Original / Canon boundary

No Story / Character / Content selection / Canon numeric values are modified.

`runtimeAutoPromotionAllowed = false`
