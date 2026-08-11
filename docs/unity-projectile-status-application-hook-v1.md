# Unity Projectile Status Application Hook v1

## Purpose

Wave Aの次段として、既存Unity Projectile hitへ**optional request**でStatus applicationを運べる共通hookを追加する。

このPRでSelected16をlive化しない。

- typed requestは実装する
- pooled projectileはrequestを運べる
- hit後にenemy Status stateへApplyできる
- 既存live projectile callerはrequestを渡さない

そのため現時点は:

- live caller = 0
- Selected16 Unity admitted=0
- `STATUS_APPLICATION` high-level admission blockerはまだ残る

が正しい。

## typed request

`EnemyStatusApplicationRequest` は:

- `EnemyStatusRuntimeKind`
- `EnemyStatusApplicationPolicy`

だけを持つ。

duration / stack / magnitude / cooldownのdefaultは持たない。

数値はcallerが全て明示する。

`ApplyTo(EnemyStatusRuntimeState)` はshared foundationへそのままdelegateする。

## legacy API compatibility

既存:

`FireGameplayProjectile(float damage, int pierce)`

は残す。

この**legacy API**は:

`FireGameplayProjectile(damage, pierce, null)`

へdelegateする。

既存Stage1 runtimeはこの2引数APIしか呼ばない。

したがって既存Projectile behavior:

- nearest target
- damage
- pierce
- lifetime

は変更しない。

## optional projectile state

`U2ProjectileActor` はnullable requestを保持する。

Activate時:

- requestあり → 保存
- legacy API → null

Deactivate時:

- requestをnullへ戻す
- poolへ返す

これで前のStatus projectile設定が次の通常Projectileへ漏れない。

## hit order

Projectile collisionは:

1. `TakeDamage(...)`
2. targetが**survives**した場合だけ `ApplyStatusOnHit(...)`
3. `ConsumeHit()`

の順。

Statusは**after damage**。

この順序により、将来EXPOSEDなどのdamage modifierが実装されても「そのStatusを付けた同じhit自身」が突然増幅される曖昧さを避ける。

倒したenemyへ不要なStatus stateも残さない。

## Why STATUS_APPLICATION stays blocked

generic hookがあることと、Selected16の実Weaponが使えることは別。

まだ不足:

- Selected16 WeaponDefinition runtime登録
- archetype executor
- actual Status policy数値
- live call-site
- VFX
- simulator evidence
- mobile QA

そのためAdmission上の `STATUS_APPLICATION` はまだIMPLEMENTEDへ上げない。

## U47 evidence boundary

U47 simulator evidenceは`U2BattleController.cs`をfingerprint対象にする。

今回追加するgeneric hookはコード上存在するが、current live coordinatorは:

`battle.FireGameplayProjectile(damage, effect.pierce)`

だけを呼び、`EnemyStatusApplicationRequest`を一度も生成しない。

つまりcurrent U47 captureで動くpathは従来と同じ。

historical **U47 evidence** を偽更新しないため、manifest fingerprintだけを書き換えない。

代わりに既存normalizerで:

- optional overload
- nullable projectile request field
- request carry/reset
- unused hit Apply hook

だけをexact normalizationする。

一方`Stage1GameplayRuntimeCoordinator.cs`のlive call-siteはnormalizeしない。

将来Selected16が:

`FireGameplayProjectile(..., request)`

を実際に呼び始めたらfingerprintが変わり、その時は**再capture**または新evidenceが必要になる。

## Pool safety

2種類のpool lifecycleを守る。

### enemy pool

`U2EnemyActor`

- Activate → Status state Clear
- Tick → lifecycle
- Deactivate → Clear

### projectile pool

`U2ProjectileActor`

- Activate → optional request set
- Deactivate → request null

これでenemy / projectile双方に前run・前spawnのStatus情報を漏らさない。

## What is still not implemented

- GroundArea Status hook
- multi-target Selected16 executor
- BURN DoT
- CHILL/ROOTED movement effect
- SHOCK/CONDUCTIVE chain
- EXPOSED damage modifier
- visual cue
- real Selected16 policy

## Next

最初のvertical sliceはBURN系が安全。

候補:

`ember_matchcase`

ただしこれはSCATTER_PROJECTILEなので、次に:

1. multi-target query
2. scatter projectile executor
3. BURN policy
4. requestをlive callerへ渡す
5. U47/新evidence capture
6. visual cue

まで通して初めてSelected16の1本をadmission reviewへ進める。
