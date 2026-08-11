# Unity Targeted Projectile Primitive v1

## Purpose

Selected16のscatter / homing / priority targetへ進む前に、既存Projectile runtimeを:

- **target selection**
- **projectile spawn**

へ分離する。

これまでnearest enemy選択とProjectile生成が`FireGameplayProjectile`の一つのmethodに閉じていた。

このPRでは生成部分を:

`FireGameplayProjectileAtTarget(...)`

へ一本化する。

## Existing behavior

既存live call:

`FireGameplayProjectile(damage, pierce)`

は引き続きnearest-target。

内部:

1. `FindNearestEnemy()`
2. `FireGameplayProjectileAtTarget(...)`

へdelegateするだけ。

つまりcurrent Stage1 runtimeの:

- target choice
- projectile speed
- damage
- pierce
- lifetime
- optional Status request transport

は変えない。

## Explicit target primitive

`FireGameplayProjectileAtTarget` はcallerが選んだ`U2EnemyActor`を受ける。

fail closed:

- null target → false
- targetableでないenemy → false

成功時は既存poolからProjectileを取り出し、同じconfigで発射する。

Projectile生成logicをここへ集約するため、今後scatter / homing / chain候補がそれぞれ独自pool処理を複製しない。

## Why this comes before scatter

`ember_matchcase` はSCATTER_PROJECTILE。

必要なのは:

1. 複数targetを選ぶprimitive
2. 選択した各targetへ同じProjectile spawn primitiveを使う
3. BURN Status requestを運ぶ

であり、「scatter専用Projectile classをもう一つ作る」ことではない。

今回2を先に共通化する。

## Not implemented yet

このPRではまだ:

- multi-target query
- scatter executor
- homing priority selector
- chain selector
- real Selected16 definition
- real Status tuning

を追加しない。

live target selectionは**nearest-target**のまま。

Selected16 Unity **admitted=0**も維持する。

## U47 evidence

内部refactorは**behavior-equivalent**。

historical U47 captureが実行したlive coordinatorは今も:

`battle.FireGameplayProjectile(damage, effect.pierce)`

だけを呼ぶ。

そのため既存normalizerで:

1. target指定refactorを前のoptional-hook sourceへ戻す
2. optional hook自体をhistorical sourceへ戻す

という段階的normalizationを行う。

**U47 evidence** のmanifest fingerprintを手書き更新しない。

一方、future live coordinatorが:

- `FireGameplayProjectileAtTarget`
- multi-target selector
- Status request overload

を実際に使い始めた場合、そのcall-siteはnormalizeしないのでnew captureが必要になる。

## Performance boundary

このprimitive自体は:

- 新List allocationなし
- sortなし
- query allocationなし

で、既存Projectile poolをそのまま使う。

multi-target selectionのperformance設計は**next** PRで別に扱う。

## next

次はallocationを避けたmulti-target query primitive。

目標:

- pooled/owned scratch collection
- targetable only
- deterministic nearest ordering
- max target cap
- no duplicate target
- no per-shot LINQ

その上に`ember_matchcase` scatter executorを載せる。
