# Unity Enemy Status Runtime Foundation v1

## Purpose

Selected16 runtime admissionで最大の共通blockerになっている `STATUS_APPLICATION` を実装する前段として、Unity側に**Status16の共通lifecycle state**を追加する。

これは武器ごとのhackではなく、今後すべてのWeapon / Reaction / Enemy counterplayから再利用するWave A foundation。

## Status16 authority

Content正本は `src/game/data/combatAffinitySource.ts`。

Unity runtimeは以下16 IDをexact/case-sensitiveでround-tripする:

- BURN
- SOAK
- CHILL
- FREEZE
- SHOCK
- CONDUCTIVE
- EXPOSED
- ROOTED
- DROWSY
- SLEEP
- MARKED
- ILLUMINATED
- ECLIPSED
- ERASED
- SEALED
- DISORIENTED

未知ID、lowercase typo、追加済みだが未同期のIDはfail closedする。

## Runtime state responsibilities

`EnemyStatusRuntimeState` が持つのはgeneric lifecycleだけ。

- exact Status kind
- remaining duration
- bounded stack
- duration refresh
- explicit reapply cooldown
- deterministic expiry
- deterministic snapshot
- clear/reset

### bounded stack

callerが`maxStacks`を渡し、stateは必ず上限を守る。

BURNやMARKEDの具体的なmax stack数はこのfoundationで固定しない。

### duration refresh

再付与で残り時間を短くしない。

`max(currentRemaining, newDuration)`。

具体秒数はWeapon / Reaction / balance layerが後から与える。

### reapply cooldown

FREEZEなどの無限拘束を避けるため、Statusごとに明示的な再付与CDを持てる。

foundation自体は「FREEZEは必ず何秒CD」と数値を固定しない。

## Boss boundary

Content authorityではBossにhard Status完全無効を基本採用しない。

foundationはBoss用の**disposition種類だけ**を持つ:

- FREEZE → slowへ変換
- ROOTED → slowへ変換
- SLEEP → action delayへ変換
- CHILL → magnitude低下
- DROWSY → magnitude低下
- その他 → Preserve

ここでも**数値**は固定しない。

- slow率
- action delay秒
- duration倍率
- stack上限

は後のplaytest/tuning layer。

`Immune`というBoss dispositionは作らない。

## Pure C# contract

`EnemyStatusRuntimeState.cs` は `UnityEngine` に依存しない。

理由:

1. lifecycle logicをUnity sceneから切り離す
2. GitHub Actionsで実際にcompileできる
3. Console contractで挙動まで実行検証できる
4. 将来のdomain testを高速に回せる

Executable contractで確認する:

- Status16 round-trip
- unknown ID reject
- lowercase reject
- first apply
- duration refresh
- bounded stack
- max-stack refresh
- Tick expiry
- remove
- reapply cooldown
- invalid arguments reject
- Boss hard-control conversion
- deterministic snapshot order
- Clear

## Important: not wired yet

このPRだけではまだ `STATUS_APPLICATION` をAdmissionでIMPLEMENTEDへ上げない。

**not wired**:

- `U2EnemyActor`へのstate保持
- Weapon hit → Apply
- GroundArea hit → Apply
- movement speedへのCHILL/ROOTED反映
- BURN DoT
- SHOCK chain
- EXPOSED damage calculation
- SEALED special-action cadence
- visual cue
- telemetry

したがってSelected16はまだruntime admitted=0のままが正しい。

## Next Wave A integration

次の小PRで:

1. `U2EnemyActor`が`EnemyStatusRuntimeState`を一つ持つ
2. spawn/reset/despawnでClear
3. battle tickからStatus Tick
4. read-only inspection API
5. 既存damage behaviorを変えないregression

まで接続する。

その後:

6. generic hit → Status application request
7. 最初の実WeaponでStatus付与
8. visual cue + simulator capture

へ進む。

`STATUS_APPLICATION`をIMPLEMENTEDへ上げるのは、hit接続 + runtime verificationまで揃った後。
