# Web実装 → Unity実装 対応表

作成日: 2026-06-28
目的: WebのTypeScript実装とUnityのどの仕組みが対応するかを整理する。

---

## システム対応表

| Web側 | 役割 | Unity側候補 | 移行優先度 | 注意点 |
|---|---|---|---|---|
| `MainScene.ts` | ゲームループ全体の統括 | `GameManager.cs` + `RunController.cs` | 必須 | Phaser Sceneの概念をMonoBehaviourに分割する |
| `RuntimeState` (runtime.ts) | 1run中の全変数 | `RunState.cs` (ScriptableObject or POCO class) | 必須 | PhaserのstateパターンをC#クラスに変換 |
| `EffectManager.ts` | VFX / ヒットストップ / 演出調停 | `VfxManager.cs` + Particle System | 高 | Phaser Tweenに依存する演出はParticle Systemで再設計 |
| `pickups.ts` | XP断片スポーン・吸引・回収 | `PickupSystem.cs` | 必須 | 磁石範囲・速度定数をそのまま移植可能 |
| `enemies.ts` | 敵当たり判定・ダメージ・撃破 | `EnemyController.cs` + `EnemyDamageSystem.cs` | 必須 | `applyPlayerDamage()` を `PlayerHealth.cs` に |
| `spawn.ts` | 敵スポーン (画面外オフセット) | `EnemySpawner.cs` | 必須 | スポーン範囲計算はそのまま移植可能 |
| `movement.ts` | プレイヤー移動 | `PlayerController.cs` | 必須 | バーチャルスティックをNew Input Systemで実装 |
| `levelup.ts` | LvUp選択肢生成・applyChoice | `LevelUpSystem.cs` | 必須 | `generateChoices()` のロジックをC#へ |
| `survivalRevival.ts` | dawn_ticket HP0復帰 | `RevivalSystem.cs` | 高 | role判定ロジックをそのまま移植 |
| `weapons.ts` (data) | 武器定義 | `WeaponDefinition.asset` (ScriptableObject) | 必須 | 各武器をSOファイルに分割 |
| `passives.ts` (data) | パッシブ定義 | `PassiveDefinition.asset` (ScriptableObject) | 必須 | 同上 |
| `rareItems.ts` (data) | レアアイテム定義・role分類 | `RareItemDefinition.asset` (ScriptableObject) | 必須 | role: awakening_material / survival_revival をenumで管理 |
| `evolutions.ts` (data) | 進化・覚醒・合体定義 | `EvolutionDefinition.asset` (ScriptableObject) | 高 | fromWeaponId / requiredRareItemId をSO参照に |
| `capsule.ts` | カプセル報酬生成・進化判定 | `CapsuleSystem.cs` | 中 | applyReadyEvolutions()の判定ロジックをC#へ |
| `berserk.ts` | 黒曜化ゲージ・疲労管理 | `BerserkSystem.cs` | 中 | activeRemaining / fatigueRemainingの変数管理 |
| `xp.ts` | XPカーブ・レベルアップ閾値 | `XpSystem.cs` + balance constants | 必須 | addXp()とlevelUpをRunStateに統合 |
| `passives.ts` (system) | パッシブ効果計算 | `PassiveSystem.cs` | 高 | recomputePlayerStats()をC#メソッドに |
| `HUD` (UI/Hud系) | HP/XP/タイマー/kills表示 | `HudController.cs` + uGUI | 必須 | TextMeshPro推奨 |
| `storybookChoiceCard` | LvUpカードUI | `CardChoiceUI.cs` + uGUI/UI Toolkit | 必須 | 3枚カードレイアウト、Normal/Good/Rareラベル |
| `StageSelectScene.ts` | ステージ選択画面 | `StageSelectController.cs` | 中 | 最低限の遷移のみ |
| `GrowthScene` | 成長・恒久強化画面 | `GrowthController.cs` | 中 | 最低限の遷移のみ |
| `CollectionScene.ts` | 図鑑・コレクション画面 | `CollectionController.cs` | 低 | Vertical Sliceでは最低限 |
| Asset Manifest | inventory iconの管理 | `AssetRegistry.asset` (ScriptableObject) | 高 | Addressables key or Resource path へ対応 |
| `inventoryOriginalIcons` (check script) | icon QAスクリプト | Unityエディタスクリプト or CI | 低 | 移行後に再設計 |
| Background Manifest | 背景管理 | `BackgroundRegistry.asset` | 中 | Stage1背景から開始 |
| localStorage保存 | runStats / 恒久強化保存 | `SaveDataService.cs` (PlayerPrefs or JSON) | 高 | 保存フォーマットは再設計 |
| debug snapshot | デバッグ値表示 | `DebugOverlay.cs` | 低 | Unity Debug.Logやin-game overlayで代替 |
| VisualGallery | アセット確認用QAシーン | Unity Editorプレビュー or QAシーン | 低 | 移行後は不要かEditorのみ |
| `GameFeelConfig.ts` | ゲームフィールチューニング値 | `GameFeelConfig.asset` (ScriptableObject) | 高 | hitStopMs / particleQuality等をSO化 |
| `PLAYER_DEFAULTS` / `PICKUP` / `SPAWN` 定数 | ゲームバランス定数 | `BalanceConstants.cs` (static class) | 必須 | C#のconst/readonlyにそのまま移植可能 |
| `COLORS` 定数 | UI/ゲームカラー | `ColorPalette.asset` (ScriptableObject) | 低 | Unity MaterialやUI Colorで管理 |

---

## Phaser固有の概念 → Unity対応

| Phaser概念 | Unity対応 |
|---|---|
| `Scene` | `MonoBehaviour` + Scene管理 |
| `GameObjects` (circle/rectangle) | `GameObject` + `SpriteRenderer` |
| `Tweens` | `DOTween` or `LeanTween` or Coroutine |
| `Particles` | `ParticleSystem` |
| `PointerEvent` | `Input System` (TouchPhase) |
| `localStorage` | `PlayerPrefs` or `Application.persistentDataPath` |
| `requestAnimationFrame` / game loop | `MonoBehaviour.Update()` |
| `scene.time.now` | `Time.time` / `Time.deltaTime` |

---

## 注意点

- Web側のstateはmutableなプレーンオブジェクト。Unity側はMonoBehaviourのフィールドかSO経由に変換する。
- `RuntimeState` の全フィールドを一対一でC#クラスに移植しなくてよい。役割ごとに `PlayerHealth`, `Inventory`, `RunStats` に分割する。
- `iid` (インスタンスID) はUnity側では `GetInstanceID()` で代替可能。
- `active` フラグ (pool管理) はUnityのオブジェクトプールパターンで管理する。
- `type === 'xp'` 等のstring判別はUnityではenum化する。
