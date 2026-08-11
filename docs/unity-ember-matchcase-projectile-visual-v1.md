# Ember Matchcase Projectile Visual Prototype v1

## Status

`ember_matchcase` は現在Selected16で唯一のUnity implementation-review Admission済みprototype。

この資料は最終art directionではなく、runtime captureで「火種のマッチ箱」が通常Projectileと区別できるかを確認するための **PROTOTYPE_VISUAL_NOT_FINAL** 契約。

## Visual direction

最初のcueは **projectile-local** のみ。

- tint: warm ember `Color(1.0, 0.58, 0.24, 1.0)`
- scale multiplier: `0.78`
- no screen flash
- no bloom
- no fog
- no Camera effect
- no ParticleSystem
- no new projectile prefab
- no final texture/art replacement

画面を火色へ染めるのではなく、小さい火種が数本だけ別の温度で飛んでいると読めることを目的にする。

## Why tint + scale first

Selected16 Content fantasyでは、火種のマッチ箱は大爆発ではない。

- 短射程scatter
- 小さなBURN起点を複数へ配る
- tiny dry spark
- full-screen whiteout / giant bloom禁止

そのため最初からParticleSystemやscreen-space effectを足すより、既存pooled Projectileの局所的な見え方だけを変える方がContent identityとmobile readabilityの両方に合う。

## Exact projectile selection

将来2本目のStatus projectile weaponが追加されても、Ember以外を誤着色しない。

`EmberMatchcaseProjectileVisualContext` はcaller-owned:

- reusable `List<U2ProjectileActor>` scratch
- reusable `HashSet<U2ProjectileActor>` before-fire snapshot

を一度だけ持つ。

`FireWithPrototypeVisual()` は:

1. 発射前のactive + `HasStatusApplication` Projectile集合を保存
2. balance-neutral `EmberMatchcasePrototypeRuntime.Fire(...)` を呼ぶ
3. 発射後にpooled projectileを再走査
4. active + Status requestあり + before集合にいなかった新規弾だけを選ぶ
5. その新規弾へprototype cueを適用

同期fire前後の差分を使うため、単に「Status弾なら全部Ember」と仮定しない。

## Allocation boundary

per-fire hot pathで:

- `new List`
- `new HashSet`
- LINQ
- `Instantiate`
- new ParticleSystem

を使わない。

scratch collectionsはvisual context生成時に一度だけ確保し、`Clear()`で再利用する。

Projectile visual reset componentは、そのpooled projectileへ初めてcueを当てた時だけ `AddComponent` する。以後は同じcomponentを再利用する。

## Pool reset

prototype cueが次の通常Projectileへ漏れるのは禁止。

`EmberMatchcaseProjectileVisualResetter` は初回Apply時にbase scaleを保存し、Projectile poolが`gameObject.SetActive(false)`になった **OnDisable** で:

- `SpriteRenderer.color = Color.white`
- `transform.localScale = baseScale`

へ戻す。

次回pool reuseは通常の白/標準scaleから始まる。

## U2 historical evidence boundary

`U2BattleController.cs` 自体にはEmber固有visual branchを追加しない。

visual helperは外側から:

- existing child Projectile pool
- existing `IsActive`
- existing `HasStatusApplication`

だけを読む。

そのためhistorical U47 normalizerへEmber visual用の例外を足さない。

これは重要で、prototypeの見た目を試すたびにU47 evidence fingerprintを壊さない。

## Admission boundary

visual追加後も:

- Unity Admission = **1 / 16**
- admitted ID = `ember_matchcase`
- blocked = 15
- Web live catalogへEmber追加なし
- live Stage1 coordinatorへEmber追加なし
- `runtimeStatus = NOT_IMPLEMENTED`
- runtimeAutoPromotionAllowed = false

見た目が出せることとproduction live-readyは別。

## Balance boundary

Visual helperはBURN policy / damage / pierce / maxTargetsを作らない。

それらは引き続きcore prototype callerへcaller-suppliedで渡す。

Visual Authorityは **PROTOTYPE_VISUAL_NOT_FINAL**。色とscaleもruntime capture用の仮値でありCanon/final artではない。

## Capture questions

次のsimulator/runtime captureで見る:

1. 通常Projectileと見分けられるか
2. 小さすぎて消えないか
3. 3前後のscatterでも画面を汚さないか
4. 敵/背景の暖色と埋もれないか
5. BURN Statusが入ったこととvisual cueのタイミングが矛盾しないか
6. pool再利用後に通常弾へtint/scaleが漏れないか

悪ければtint/scaleをprototype tuningで変える。Content Masterの採用/不採用へ直結させない。

## Next gate

このPRの次は、prototype専用runtime invocation/captureを作り:

- telemetry
- visual cue
- rendered evidence

を同じrunで結ぶ。

そのcaptureを見てから、embers/trail/audioなどを追加するか判断する。動画・full-screen effectへは先に進まない。
