# Unity向けデータ構造対応表

作成日: 2026-06-28
目的: TypeScriptのゲームデータをUnityでScriptableObject/JSON/CSVのどれにするか整理する。

---

## 1. 現在のWebデータ → Unity候補形式

| Web側 | 内容 | Unity候補形式 | 理由 |
|---|---|---|---|
| `weapons.ts` | 武器定義 (id/name/role/levels/maxLevel) | ScriptableObject | Editor編集・参照しやすい |
| `passives.ts` | パッシブ定義 (id/name/levels/maxLevel) | ScriptableObject | 同上 |
| `rareItems.ts` | レアアイテム定義 (id/role/tags) | ScriptableObject | role enumでの分類 |
| `evolutions.ts` | 進化・覚醒・合体定義 | ScriptableObject | SO参照 (fromWeapon→SO, requiredRare→SO) |
| `enemies.ts` (data部分) | 敵HP・速度・XPドロップ | ScriptableObject | 敵種別ごとにSO |
| `GameFeelConfig.ts` | hitStopMs/particleQuality等のチューニング値 | ScriptableObject | Runtime編集可能に |
| `PLAYER_DEFAULTS` / `PICKUP` / `SPAWN` 定数 | バランス定数 | static class (C# const/readonly) | 変更頻度低。C#定数で十分 |
| `LEVEL_UP` 定数 | 選択肢数・healAmount等 | static class or ScriptableObject | チューニングしやすいならSO |
| ステージ定義 (stage1等) | スポーンカーブ・背景 | ScriptableObject | ステージごとにSO |
| XPカーブ (addXp内) | レベル閾値計算 | static method or SOにテーブル | Web側の計算式をC#に移植 |

---

## 2. ScriptableObject化するもの

```
WeaponDefinition.cs    // id, name, role, maxLevel, levels[]
PassiveDefinition.cs   // id, name, role, maxLevel, levels[]
RareItemDefinition.cs  // id, name, role, tags[]
EvolutionDefinition.cs // kind, fromWeapon(SO), requiredRare(SO), evolvedWeapon(SO)
EnemyDefinition.cs     // id, name, hp, speed, contactDamage, xpDrop, radius
StageDefinition.cs     // id, name, durationSec, enemySpawnCurve[], bgAsset
GameFeelConfig.cs      // hitStopMs, particleQuality, juiceSettings...
```

---

## 3. JSONで残してよいもの

- 起動時のデータロード (Addressables経由のJSONも選択肢)
- テスト用のダミーデータ (PlayMode Test)
- ローカライズ文字列 (将来的に)

ただし初期はScriptableObject優先。JSON化は本格化後に検討。

---

## 4. enum化するもの

```csharp
// role
public enum ItemRole {
    Weapon,
    Passive,
    AwakeningMaterial,
    SurvivalRevival,
}

// EvolutionKind
public enum EvolutionKind {
    Fusion,
    Awakening,
    Evolution,
}

// RewardRarity
public enum RewardRarity {
    Normal,
    Good,
    Rare,
}

// PickupType
public enum PickupType {
    Xp,
    Heal,
    Capsule,
}
```

---

## 5. ID命名規則

| 項目 | Web | Unity |
|---|---|---|
| runtime ID | snake_case (`night_pencil`, `dawn_ticket`) | snake_caseを維持 (SOのname/IDフィールドに格納) |
| SO Asset名 | - | PascalCase (`NightPencilDefinition.asset`) |
| 表示名 | 日本語 (`夜の鉛筆`) | 日本語 (TextMeshPro) |
| enum値 | - | PascalCase (`AwakeningMaterial`) |

---

## 6. データごとの移行注意点

### weapons

- `levels[]` の各要素 (label / description / stats) はC#のネスト構造かSOに格納
- `maxLevel` は各武器で異なる (夜の鉛筆は5等)
- `evolvedWeaponIds` (Set) はUnityではHashSetまたはList

### rareItems

- `role: 'survival_revival'` は **必ず** `ItemRole.SurvivalRevival` enum値で管理する
- `role: 'awakening_material'` のみLvUp候補に出す。enumチェックで保証する
- dawn_ticketのSOを作っても通常LvUp候補への追加は禁止

### evolutions

- `fromWeaponId` → `WeaponDefinition` SO参照に変換
- `requiredRareItemId` → `RareItemDefinition` SO参照に変換
- `consumedWeaponIds` → List<WeaponDefinition>

### enemies

- `xpDrop` (Web側では1体の合計XP値) をUnityでも同様に管理し、分割数はシステム側で計算

### GameFeelConfig

- `enemyDensityMultiplierByTime[]` はSO内のAnimationCurveまたはKeyframe配列で管理
- `hitStopMs` 等のfeel値はインスペクタで調整できるSO推奨

---

## 7. テスト / Validation方針

- `RareItemDefinition.role === SurvivalRevival` のアイテムがLvUp候補に入らないことをPlayMode Testで確認
- `EvolutionDefinition` の `requiredRare.role` は必ず `AwakeningMaterial` であることをEditor Scriptで検証
- `dawn_ticket` SO を誤って通常抽選に加えないよう、抽選コードにアサーションを入れる
- バランス定数の変更はテストで期待値を更新する

---

## 8. 移行手順案

1. TypeScriptのデータ定義を読んでC# ScriptableObject定義を書く (Claude Code)
2. SOファイルを作成し、Web側の値をUnity Editorで入力 (Claude Code / Codex)
3. システムコード (LevelUpSystem.cs等) からSO参照で動作確認
4. PlayMode Testでdawn_ticket除外・覚醒条件を確認
5. バランス値は通し確認後に調整 (SOなのでホットリロード可能)
