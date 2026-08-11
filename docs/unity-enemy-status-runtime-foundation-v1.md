# Unity Enemy Status Runtime Foundation v1

## Purpose

Selected16 runtime admissionで最大の共通blockerになっている `STATUS_APPLICATION` を実装するための、Unity側 **Status16共通lifecycle / application state**。

これは武器ごとのhackではなく、今後すべてのWeapon / Reaction / Enemy counterplayから再利用するWave A foundation。

現在は:

- pure C# Status state実装済み
- `U2EnemyActor` ownership / Activate / Tick / Deactivate接続済み
- Web/domainの`RuntimeStatusApplicationPolicy`とUnity policy shapeを整合
- Weapon hit → Applyはまだ未接続

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

## cross-runtime semantic authority

Application policyの意味の正本は:

`src/game/domain/statusRuntime.ts`

`RuntimeStatusApplicationPolicy`。

Unityは独自の暗黙defaultを作らず、同じ意味を明示的に受け取る。

### Stack mode

**REPLACE / REFRESH / ADD_CAPPED**

Unity mapping:

- `EnemyStatusStackMode.Replace`
- `EnemyStatusStackMode.Refresh`
- `EnemyStatusStackMode.AddCapped`

意味:

- REPLACE: `stacksPerApplication`へ置換
- REFRESH: 現stackを維持
- ADD_CAPPED: `maxStacks`まで加算

BURNやMARKEDの実際のstack数はfoundationで固定しない。

### magnitude mode

Web/domain:

- REPLACE
- MAX
- ADD_CAPPED

Unity:

- `EnemyStatusMagnitudeMode.Replace`
- `EnemyStatusMagnitudeMode.Max`
- `EnemyStatusMagnitudeMode.AddCapped`

magnitudeは:

- CHILL slow ratio
- EXPOSED damage modifier
- effect strength

などを後のeffect layerへ渡すためのgeneric value。

具体的な値はこのfoundationで持たない。

### duration refresh

成功したStatus applicationは両runtimeとも:

`remaining = caller policy duration`

へ再設定する。

古いUnity foundationの `max(currentRemaining, newDuration)` は廃止する。

これによりWebとUnityで「短いpolicyを再付与した時の残時間」が分岐しない。

### internal cooldown

active Statusとは独立したledger。

policy:

- `internalCooldownSec`
- `respectInternalCooldown`

をcallerが必須指定する。

Status本体がexpireしてもcooldownは残れる。

`ClearStatus(kind)` はactiveだけを消し、cooldownを保持する。

一方 `U2EnemyActor` のpool lifecycle用 `Clear()` は**別用途**で、active + cooldown両方を消す。前spawnの状態を次spawnへ漏らさないため。

## No balance defaults

Unity `EnemyStatusApplicationPolicy` は以下をcallerから受ける:

1. durationSeconds
2. stacksPerApplication
3. stackMode
4. maxStacks
5. magnitude
6. magnitudeMode
7. maxMagnitude
8. internalCooldownSeconds
9. respectInternalCooldown

BURN 3秒、CHILL 20%、FREEZE CD 4秒などの**数値**は一切ここへ固定しない。

invalid policyはfallbackを捏造せずfail closedする。

## Boss boundary

Content authorityではBossにhard Status完全無効を基本採用しない。

foundationはBoss用のqualitative dispositionだけを持つ:

- FREEZE → slowへ変換
- ROOTED → slowへ変換
- SLEEP → action delayへ変換
- CHILL → magnitude低下
- DROWSY → magnitude低下
- その他 → Preserve

ここでも数値は固定しない。

- slow率
- action delay秒
- duration倍率
- stack上限

は後のplaytest/tuning layer。

`Immune`というBoss dispositionは作らない。

## Pure C# executable contract

`EnemyStatusRuntimeState.cs` は `UnityEngine` に依存しない。

GitHub Actionsでexact Unity sourceを.NET 8 compileし、Console contractを実行する。

確認:

- Status16 round-trip
- unknown/lowercase reject
- REPLACE / REFRESH / ADD_CAPPED stacks
- REPLACE / MAX / ADD_CAPPED magnitude
- exact caller duration refresh
- independent internal cooldown
- active expire後もcooldown維持
- ClearStatus後もcooldown維持
- invalid policy throw
- negative Tick reject
- Boss hard-control conversion
- deterministic snapshot + magnitude
- entity Clear

TypeScript checkerは同時に`RuntimeStatusApplicationPolicy`とのcross-runtime token/semanticsを照合する。

## Wave A current state

実装済み:

1. Status16 pure C# state
2. bounded/application policy
3. U2EnemyActor ownership
4. pool Activate/Deactivate reset
5. battle Tick lifecycle
6. Web/Unity application policy parity

## Important: not wired yet

まだ **not wired**:

- Weapon hit → Apply
- GroundArea hit → Apply
- movement speedへのCHILL/ROOTED反映
- BURN DoT
- SHOCK chain
- EXPOSED damage calculation
- SEALED special-action cadence
- Status visual cue
- telemetry

したがって`STATUS_APPLICATION`をSelected16 AdmissionでIMPLEMENTEDへ上げない。

Selected16はまだUnity admitted=0のままが正しい。

## Next Wave A integration

次はtyped **hit → Apply request**。

1. Status kind
2. `EnemyStatusApplicationPolicy`
3. optional request / none
4. projectile actorへ運ぶ
5. projectile collisionから`U2EnemyActor.Statuses.Apply(...)`
6. existing projectile callersはNoneで完全互換

を小PRで接続する。

その後最初のSelected16 vertical sliceで実policy数値を限定的に与え、visual cue / simulator evidenceまで通してからAdmissionを更新する。
