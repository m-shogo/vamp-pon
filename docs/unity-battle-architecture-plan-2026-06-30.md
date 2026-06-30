# Unity Battle Architecture Plan 2026-06-30

## Purpose

U6では `U2BattleController` の大規模分割はしない。今後、キャラクター、敵、武器、黒耀化、Result、Collectionを足してもBattleControllerが肥大化しないように、責務境界を先に固定する。

## 現在のU2BattleController責務

- battle loop
- enemy spawn
- enemy pool
- projectile pool
- pickup / EXP pool
- VFX pool
- hit stop trigger
- camera impulse trigger
- lantern pulse
- HUD pulse
- LevelUp通知hook
- verification counters

## Current Observations

- `U2BattleController.Initialize(...)` は `BattleVisualAssetSet` を受け取るため、U5 candidate asset名の直書きは外れている。
- enemy / projectile / pickup / VFX actor classは同一ファイル内にあり、prototypeとしては読めるが、production機能を追加すると肥大化しやすい。
- LevelUp連携は `SetLevelUpNotifier(...)` とEXP収集時の通知だけで、カードUI生成や候補データは混ざっていない。
- hit stop / camera impulse / lantern pulseはBattleControllerからtriggerされるが、TimeScaleの最終所有者はまだ統一されていない。

## 分割予定

- BattleLoopController
- EnemySpawnController
- ProjectileController
- PickupController
- VfxController
- BattleHudController
- LevelUpTriggerController
- BattleTimeScaleService
- BattleObjectPool
- BattleVisualAssetSet / AssetProvider

## 禁止事項

- UI生成をBattleControllerに入れない
- LevelUp card生成をBattleControllerに入れない
- asset名をBattleControllerに直書きしない
- Time.timeScaleを各所から直接触らない
- candidate素材をproduction approved扱いしない

## U6での実装範囲

- 大規模分割はしない
- 責務棚卸しと分割計画をdoc化
- 可能ならBattleVisualAssetSet周りのコメント整理だけ

## Migration Order

1. Keep the current U2 behavior stable and keep verification counters available.
2. Move visual loading decisions behind AssetProvider before adding new production assets.
3. Replace direct hit stop / overlay timeScale ownership with `BattleTimeScaleService`.
4. Extract pools after asset and time boundaries are stable.
5. Extract UI-facing hooks last, keeping BattleController as a gameplay event source only.

## U6 Decision

U6 only adds documentation and safe boundary comments. No new runtime feature, asset generation, production approval, Addressables migration, Result implementation, StageSelect implementation, Collection implementation, 黒耀化 runtime implementation, or cut-in runtime implementation is included.

## U7 Proof Update

U7 adds only two small boundary proofs:

- `BattleTimeScaleService` sits behind U3 hit stop and U4 LevelUp pause.
- `IAssetProvider` / `U5ProofAssetProvider` sits before `BattleVisualAssetSet`.

`U2BattleController` remains a prototype controller. It still receives `BattleVisualAssetSet`, does not build UI cards, does not own LevelUp card data, and does not contain U5 asset ids or resource paths.
