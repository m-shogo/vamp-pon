# Ember Matchcase Unity Prototype Telemetry v1

## Status

`ember_matchcase` はSelected16最初の `ADMITTED_FOR_UNITY_IMPLEMENTATION_REVIEW`。

この資料はlive weapon registrationやbalance確定ではなく、prototype runtimeが本当に動いたかを測るためのtelemetry契約。

## What we measure

caller-owned `EmberMatchcasePrototypeTelemetry` が記録するのは実行事実だけ。

- `InvocationCount`
- `RequestedTargetCapacityTotal`
- `FiredProjectileCount`
- `StatusApplyAttemptCount`
- `StatusAppliedCount`
- `StatusBlockedByInternalCooldownCount`

これにより:

- prototype callerが呼ばれたか
- 何体まで狙おうとしたか
- pool/target状況の結果、実際に何発出たか
- Projectile hit後に何回Status Applyを試したか
- BURNが何回Appliedになったか
- internal cooldownで何回Blockedされたか

を分離して見られる。

## caller-owned

Telemetryはglobal staticにしない。

呼び出し側が `EmberMatchcasePrototypeTelemetry` instanceを所有し、必要なprototype検証sessionだけで渡す。

理由:

- live Stage1へ暗黙のglobal stateを追加しない
- test / simulator / future runtime captureごとに明示的にlifetimeを決められる
- pooled Projectileがrequestをclearすればobserver referenceも解放される
- production analytics設計をprototype counterで先に固定しない

## Status result observer

`EnemyStatusApplicationRequest` はoptional `Action<EnemyStatusApplyResult>` observerを受け取れる。

既存2引数constructor:

`EnemyStatusApplicationRequest(kind, policy)`

はobserverなしへdelegateするため互換維持。

`ApplyTo()` は:

1. shared `EnemyStatusRuntimeState.Apply(Kind, Policy)`
2. exact resultをoptional observerへ通知
3. same resultをreturn

の順。

ObserverはStatus判定に介入しない。duration / stack / magnitude / internal cooldown semanticsはshared Status stateだけが決める。

## No balance authority

production prototype sourceは数値を持たない。

持たないもの:

- BURN duration
- BURN magnitude
- stack count / cap
- internal cooldown
- projectile damage
- pierce
- maxTargets

すべてcaller supplied。

Authority:

`CALLER_SUPPLIED_PROTOTYPE_TUNING_NOT_CANON`

つまりtelemetry追加を理由にprototype tuningをCanon化しない。

## Executable contract

C# harness:

`scripts/quality/unity-ember-matchcase-telemetry/`

ここだけは **TEST_ONLY** の数値を使い、実際にコードをcompile/executeする。

検証sequence:

1. observerなし旧overloadを作り `HasResultObserver=false` を確認
2. Ember prototypeを1回発射
3. BURNがApplied
4. telemetry: invocation=1 / fired=1 / applied=1
5. cooldown中に同一targetへもう1回発射
6. Projectileは発射されるがBURNは `BlockedByInternalCooldown`
7. telemetry: invocation=2 / fired=2 / attempts=2 / applied=1 / blocked=1
8. `Reset()`でtelemetryのみ0へ戻す

TEST_ONLY数値はruntime sourceへコピーしない。

## Admission boundary

Telemetry追加後も:

- Unity admitted = 1
- admitted ID = `ember_matchcase`
- blocked = 15
- Web live catalogに `ember_matchcase` はいない
- live Stage1 coordinatorに `EmberMatchcasePrototypeRuntime` はいない
- `runtimeStatus = NOT_IMPLEMENTED`

つまりtelemetryはAdmissionを増やす機能ではなく、Admission後のproof qualityを上げるもの。

## live Stage1 boundary

現在のlive Stage1は既存Weapon経路を継続する。

Prototype telemetry objectをlive Stage1へglobal installしない。

次にruntimeへ近づける場合も:

1. simulator/verification専用caller
2. runtime visual cue
3. capture / readability
4. prototype tuning
5. human review
6. live registry decision

の順を守る。

## Next

次はmobile-safe ember visual cueとruntime capture。

その前にtelemetryで:

- fired/requested比
- BURN Applied/attempt比
- internal cooldown block比

を取れる状態にしておく。

数値が悪くてもContent MasterをHoldへ戻すのではなく、prototype tuning / executor / visual readabilityのどこが原因かを分離して判断する。
