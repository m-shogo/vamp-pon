# Unity Pavement Hammer Runtime Evidence v1

Status: `HARNESS_IMPLEMENTED / EVIDENCE_NOT_RUN / NOT_LIVE`

## Purpose

`PavementHammerPrototypeRuntime` が.NET stub contractだけでなく、**実Unity Editor runtime source** 上でも同じmechanicを実行できることを証明するためのevidence gate。

原本 / Canon / live Stage1は変更しない。

## Honest boundary

Tracked evidence:

`docs/design-targets/generated/unity-selected-base-weapons/pavement-hammer/runtime-evidence.json`

初期状態は必ず:

- `executed=false`
- `result=NOT_RUN`
- source commit / source SHA empty
- telemetry zero
- observed booleans false

GitHub CIやstatic checkerだけでUnity実行済みに昇格しない。

## Unity Editor batchmode harness

Source:

`unity/VampPonUnity/Assets/_Project/Scripts/Editor/PavementHammerPrototypeRuntimeEvidence.cs`

Method:

`VampPon.UnitySpike.Editor.PavementHammerPrototypeRuntimeEvidence.RunBatchmode`

Harnessはtemporaryなreal Unity objectsだけを生成する。

- real `U2EnemyActor.Create`
- real `U2EnemyActor.Activate`
- real `RuntimeEnemyAnimationSet`
- disposable 2x2 Sprite
- real `PavementHammerPrototypeRuntime`
- real `EnemyStatusRuntimeState`
- real slam / knockback / break-stagger primitives

Scene / prefab / ScriptableObject assetを保存しない。

## TEST_ONLY scenario

Evidence runの値は **TEST_ONLY_PROTOTYPE_TUNING_NOT_CANON**。

- defeated target: HP 5, x=2
- survivor A: HP 100, x=3
- survivor B: HP 100, x=4 / y=1
- outside target: x=-3
- damage: 10
- knockback: 1
- break amount: 60
- break threshold: 100
- stagger duration: 0.6s
- EXPOSED duration: 4s
- EXPOSED internal cooldown: 2s

これはbalance proposalではない。

## Same-run observations

1回目:

- nearest-first 3 targets selected
- HP 5 target dies in damage phase
- dead target gets no EXPOSED
- dead target gets no knockback
- dead target gets no break/stagger driver
- two survivors receive EXPOSED
- two survivors accumulate break=60
- no stagger yet
- knockback is applied

2回目:

- dead target excluded, 2 survivors selected
- immediate EXPOSED reapply is cooldown-blocked
- Status cooldown does not block damage / knockback / break
- break 60 + 60 crosses TEST_ONLY threshold 100
- residual break=20
- stagger duration=0.6
- two stagger triggers observed

さらにreal Unity `U2EnemyBreakStaggerDriver.LateUpdate` をreflection経由で実行し、通常追跡を模した位置変更が**post-knockback anchor**へ戻ることを確認する。

つまり `knockback -> break/stagger` の順序が実Unity componentでも成立する。

## Telemetry binding

同じUnity runから以下を記録する。

- invocation count
- selected target count
- damage attempts / defeated target
- Status attempts / applied / internal-cooldown blocked
- knockback attempts / applied
- break-stagger attempts / applied
- stagger trigger count

別runのtelemetryを後から合成しない。

## Provenance

PASSED evidenceは以下へSHA-256 bindingする。

- `PavementHammerPrototypeRuntime.cs`
- `U2EnemySlamWaveQueryRuntime.cs`
- `U2EnemyKnockbackRuntime.cs`
- `U2EnemyBreakStaggerRuntime.cs`
- `EnemyStatusRuntimeState.cs`
- `EnemyStatusApplicationRequest.cs`
- Unity Editor evidence harness itself

また `sourceCommit` はrunner開始時のGit HEAD。

Evidence commitを後から作るため、checkerはsource commitが現在HEADのancestorであることと、現在source bytesのSHA一致を両方要求する。

## Canonical local runner

```bash
bash scripts/unity/run-pavement-hammer-runtime-evidence.sh
```

Default Unity:

`/Applications/Unity/Hub/Editor/6000.5.1f1/Unity.app/Contents/MacOS/Unity`

override:

```bash
UNITY_BIN=/path/to/Unity bash scripts/unity/run-pavement-hammer-runtime-evidence.sh
```

RunnerはPavement runtime/harness sourceにuncommitted tracked差分がある場合fail-closed。

原本/story側の無関係なworktree変更はPavement evidence sourceではないため、このgame-side runnerのsource cleanliness判定へ含めない。

## Failure behavior

Unity exception時:

- `executed=true`
- `result=FAILED`
- error text保存
- runner non-zero

FAILED evidenceはcheckerを通らずmerge不可。

成功時のみ:

- `result=PASSED`
- exact telemetry / observed behavior
- exact source commit
- current source SHA

を要求する。

## runtimeStatus boundary

このevidenceがPASSEDでも:

- `runtimeStatus` を自動で `IMPLEMENTED` にしない
- Web live catalogへ追加しない
- LevelUpへ追加しない
- `Stage1GameplayRuntimeCoordinator`へ接続しない
- U47 live executorを増やさない
- balanceをCanon化しない

現在のauthorityは引き続き:

`PROTOTYPE_CALLER_IMPLEMENTED_NOT_LIVE`

## What this proves / does not prove

Proves:

- real Unity types compile in the project
- real U2EnemyActor can execute the prototype caller
- query / damage / EXPOSED / knockback / break-stagger composition works in Unity
- same-run telemetry corresponds to observed outcomes
- stagger driver captures post-knockback position

Does not prove:

- final gameplay balance
- mobile readability
- pavement crack final VFX
- dense-wave performance
- production Stage1 integration
- human live-admission approval

## Next

PASSED Unity evidence後はvisual/runtime captureへ進む。

1. pavement impact / crack prototype visual cue
2. stagger readability cue
3. mobile-size capture
4. dense target capture
5. telemetry + rendered evidence SHA binding
6. human live-admission review

それまでは **not live Stage1**。
