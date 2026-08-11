# Unity Bellows Fan Prototype Telemetry v1

## Purpose

`bellows_fan`（送り風の扇）のprototype callerについて、balance値ではなく **実行事実** を観測できるようにする。

このtelemetryはproduction analyticsではない。runtime capture / simulator evidence / contract testで、cone → DISORIENTED → knockbackの実経路が期待どおり動いたかを確認するためのprototype-only sink。

## Lifetime

`BellowsFanPrototypeTelemetry` は **caller-owned**。

- static/global instanceを持たない
- `Stage1GameplayRuntimeCoordinator` へ自動登録しない
- save dataへ書かない
- analytics backendへ送らない
- Weapon balance authorityにならない

必要なrun/harnessがinstanceを作り、`BellowsFanPrototypeRuntime.Fire(..., telemetry)` へ明示的に渡す。

## Counters

### Invocation / selection

- `InvocationCount`
  - valid preconditionを通過してcone queryまで実行した回数
  - cone query結果が0件でも1回として記録する
- `RequestedTargetCapacityTotal`
  - callerが要求した `maxTargets` の累積
- `SelectedTargetCount`
  - cone queryが実際に選択したtarget数の累積

`maxTargets <= 0`、`range <= 0`、`knockbackDistance <= 0` のようなprecondition rejectionは、実行済みcone queryとして数えない。

### DISORIENTED result

- `StatusApplyAttemptCount`
- `StatusAppliedCount`
- `StatusBlockedByInternalCooldownCount`

`EnemyStatusApplicationRequest.ApplyTo(...)` の戻り値そのものを記録する。

Statusのduration / stack / magnitude / cooldown値はtelemetryが持たない。

### Knockback result

- `KnockbackAttemptCount`
- `KnockbackAppliedCount`
- `KnockbackRejectedCount`

`U2EnemyKnockbackRuntime.TryApply(...)` のbool結果を記録する。

これにより、例えば:

- DISORIENTEDはinternal cooldownでblockされた
- しかしpushは正常に適用された

という独立したruntime outcomeを区別できる。

## Why Status and knockback are independent

送り風の扇のidentityは「扇状に押す」こととDISORIENTEDの組み合わせにある。

Statusがreapply cooldown中だからといって、共有knockback primitiveまで自動的に止める仕様はこのprototype layerでは作らない。

逆に、targetがoriginと2D同位置でknockback directionを作れない場合は:

- Statusは適用可能
- knockbackはrejected

として別々に観測する。

この分離により、後のbalance/仕様判断をtelemetry implementationが先回りして固定しない。

## Reset

`Reset()` は全counterを0へ戻す。

prototype harnessを複数scenarioで再利用しても、前scenarioの観測値を持ち越さない。

## Executable contract

`scripts/quality/unity-bellows-fan-telemetry/BellowsFanTelemetry.Contract.csproj`

real runtime sourceを.NET 8でcompileして、最小Unity/U2 stubs上で実行する。

TEST_ONLY fixtureで確認するもの:

1. 2 targetを選択する初回fire
   - invocation 1
   - selected 2
   - DISORIENTED applied 2
   - knockback applied 2
2. internal cooldown中に同じ2 targetへ再fire
   - Status attemptsは増える
   - `StatusBlockedByInternalCooldownCount` が2増える
   - knockbackは独立して2件とも成功する
3. originと2D同位置のtarget
   - Statusはapplied
   - knockbackはrejected
4. zero forwardのvalidly configured query
   - invocationは記録する
   - selected=0
   - Status/knockback attemptは増えない
5. `maxTargets=0` precondition rejection
   - invocationを増やさない
6. `Reset()`
   - 全counterが0へ戻る

contract内の数値は **TEST_ONLY / NOT_CANON**。

## Balance boundary

telemetryは以下を持たない:

- cone range default
- cone angle default
- maxTargets default
- knockback distance default
- DISORIENTED duration
- DISORIENTED magnitude
- DISORIENTED stack policy
- internal cooldown value
- damage
- cooldown

runtime sourceのAuthorityは引き続き:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

## Admission / live boundary

telemetry追加後も:

- `bellows_fan` は `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`
- `runtimeStatus = NOT_IMPLEMENTED`
- Web live catalogには入れない
- LevelUp poolには入れない
- live Stage1 coordinatorには入れない

telemetryがあること自体をproduction-ready判定には使わない。

## Next evidence

次はこのcounterをruntime capture evidenceへ束ねる。

確認したいscenario:

- cone edge target
- dense enemy wave + target cap
- DISORIENTED cooldown reapply
- source近傍targetのpush readability
- mobile 390x844相当でのairflow / push visual cue

最終的には `telemetry + rendered capture + mobile visual review` が同一runtime runへ結びついていることを証明する。
