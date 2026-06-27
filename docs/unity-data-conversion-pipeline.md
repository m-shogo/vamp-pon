# Unityデータ変換パイプライン

`docs/phaser-to-unity-data-map.md` の対応表を、実際にUnityへ移すための変換手順へ落とした補足メモ。
Web版のTypeScript dataをそのままUnityへ手入力しない。まず中間JSONを作り、Unity Editor上でScriptableObjectへ変換する方針を基本にする。

## 参照した公式情報

- Unity Manual: ScriptableObject  
  https://docs.unity3d.com/Manual/class-ScriptableObject.html
- Unity Manual: JSON Serialization  
  https://docs.unity3d.com/Manual/json-serialization.html
- Unity Scripting API: CreateAssetMenuAttribute  
  https://docs.unity3d.com/ScriptReference/CreateAssetMenuAttribute.html
- Unity Addressables: Load assets by asset references  
  https://docs.unity3d.com/Packages/com.unity.addressables@3.1/manual/AssetReferences.html

## 結論

Vamp PonのUnityデータ移行は、以下の順が一番戻しにくい。

```txt
TypeScript data
↓
Export scriptで中間JSON生成
↓
JSON schema / ID / asset path検証
↓
Unity Editor importer
↓
ScriptableObject生成
↓
DataRegistryで参照
↓
BattleDemoで最小検証
```

手入力でScriptableObjectを作るのは、30秒デモの最小数だけにする。
本移行では、TypeScript dataから自動生成できる形を残す。

## Unity公式情報からの採用方針

### ScriptableObject

Unity公式では、ScriptableObjectは`UnityEngine.Object`由来のserializableな型で、GameObjectのcomponentとしてではなくproject内のassetとして存在する。
主な価値は共有データストアで、Prefabごとに同じ不変データを複製せず、1つのasset参照にできる点。

Vamp Ponでは、以下の定義データに向く。

- CharacterDefinition
- WeaponDefinition
- PassiveDefinition
- RareItemDefinition
- EvolutionDefinition
- EnemyDefinition
- StageDefinition
- WaveDefinition
- AchievementDefinition

向かないもの:

- 実行中のHPやXP
- 実行中の所持武器レベル
- そのrunだけの敵数やwave進行
- セーブデータ本体

### JsonUtility

Unity公式のJsonUtilityは、構造化JSON向け。`[Serializable]`なclass/structを使い、Unity serializerと同じルールでfieldsを扱う。
`Dictionary<>`はサポートされないため、Vamp Ponの中間JSONは辞書ではなく配列中心にする。

良い形:

```json
{
  "weapons": [
    { "id": "night_pencil", "displayName": "夜の鉛筆" }
  ]
}
```

避ける形:

```json
{
  "weapons": {
    "night_pencil": { "displayName": "夜の鉛筆" }
  }
}
```

### CreateAssetMenu

`CreateAssetMenuAttribute` は、ScriptableObject派生typeを `Assets/Create` submenuに出し、`.asset`として作れるようにするための属性。
手作業で最小デモを作る時には便利だが、本移行ではimporterで自動生成する方がよい。

### Addressables AssetReference

AddressablesのAssetReferenceは、assetをアドレス参照でロードするために使える。
ただしStage1縦スライス初期では複雑さが増えるため、最初は直接参照でよい。
将来、追加キャラ/追加ステージ/イベント素材が増えたらAssetReference化を検討する。

## データ分類

### Authoring Definition

UnityでScriptableObject化するもの。

```txt
CharacterDefinition
WeaponDefinition
PassiveDefinition
RareItemDefinition
EvolutionDefinition
EnemyDefinition
StageDefinition
WaveDefinition
AchievementDefinition
CollectionEntryDefinition
```

特徴:

- 基本的に不変
- 複数runで共有
- idで参照
- 表示名・説明・icon・prefab参照を持てる

### Runtime State

ScriptableObjectにしないもの。

```txt
RunState
PlayerState
InventoryState
EnemyInstanceState
ProjectileState
PickupState
RewardState
WaveRuntimeState
```

特徴:

- プレイ中に変化する
- run終了で破棄される
- PoolされたGameObjectと紐づく
- セーブ対象とは限らない

### Save Data

JSON save候補。

```txt
PlayerSaveData
CharacterProgressSave
PermanentUpgradeSave
CollectionSeenSave
AchievementSave
SettingsSave
```

特徴:

- バージョン番号が必要
- migration hookが必要
- ScriptableObject assetを直接保存しない
- IDだけ保存する

## 中間JSON設計

UnityのJsonUtility互換を考え、配列中心にする。

### weapons.json

```json
{
  "schemaVersion": 1,
  "weapons": [
    {
      "id": "night_pencil",
      "displayName": "夜の鉛筆",
      "description": "...",
      "maxLevel": 5,
      "iconPath": "public/assets/prototypes/sprite-sheets/weapon/night_pencil.png",
      "levels": [
        { "level": 1, "label": "...", "damage": 8, "cooldownMs": 900 }
      ]
    }
  ]
}
```

### passives.json

```json
{
  "schemaVersion": 1,
  "passives": [
    {
      "id": "old_ticket",
      "displayName": "あったか靴",
      "description": "歩く速さが少し上がる。",
      "stat": "moveSpeedMultiplier",
      "iconPath": "public/assets/prototypes/sprite-sheets/passive/old_ticket.png",
      "levels": [
        { "level": 1, "value": 1.04, "label": "移動速度 +4%" }
      ],
      "unityMigrationId": "warm_shoes"
    }
  ]
}
```

### evolutions.json

```json
{
  "schemaVersion": 1,
  "evolutions": [
    {
      "id": "night_pencil_name_tag_awaken",
      "kind": "awakening",
      "fromWeaponId": "night_pencil",
      "requiredRareItemId": "name_tag",
      "evolvedWeaponId": "awakened_night_pencil"
    }
  ]
}
```

### enemies.json

```json
{
  "schemaVersion": 1,
  "enemies": [
    {
      "id": "ink_shadow",
      "displayName": "インク影",
      "role": "basic_chaser",
      "hp": 12,
      "speed": 48,
      "contactDamage": 8,
      "expDrop": 1,
      "spritePath": "public/assets/prototypes/sprite-sheets/enemies-original/...png"
    }
  ]
}
```

### stage1_waves.json

```json
{
  "schemaVersion": 1,
  "stageId": "stage1_forgotten_street",
  "durationSec": 480,
  "waves": [
    {
      "startSec": 0,
      "endSec": 60,
      "enemyId": "ink_shadow",
      "spawnRatePerSec": 0.8,
      "maxAlive": 16
    }
  ]
}
```

## ID互換ルール

Web版では既存セーブや参照を壊さないため、IDを安易に変えない。
Unity移行時に整理したい場合は、`unityMigrationId` または mapping table を使う。

| Web ID | 表示/役割 | Unity候補 | 方針 |
|---|---|---|---|
| `old_ticket` | あったか靴 / 移動速度 | `warm_shoes` | Unity移行時にrename候補 |
| `name_tag` | 覚醒素材 | `name_tag` | 維持候補 |
| `dawn_ticket` | 復帰/救済レア候補 | `dawn_ticket` | 役割確定後 |
| `black_ink_bottle` | 武器 | `black_ink_bottle` | 維持候補 |
| `night_pencil` | ユイ初期武器 | `night_pencil` | 維持候補 |

セーブデータではUnity側IDではなく、安定したcanonical IDを保存する。
renameが必要ならmigration tableで吸収する。

## Unity側ScriptableObject構成案

### Base

```csharp
public abstract class GameDefinition : ScriptableObject
{
    public string id;
    public string displayName;
    [TextArea] public string description;
}
```

### PassiveDefinition

```csharp
[CreateAssetMenu(fileName = "PassiveDefinition", menuName = "VampPon/Passive Definition")]
public sealed class PassiveDefinition : GameDefinition
{
    public Sprite icon;
    public PassiveStatType stat;
    public PassiveLevel[] levels;
}

[System.Serializable]
public struct PassiveLevel
{
    public int level;
    public float value;
    public string label;
}
```

### DataRegistry

```csharp
[CreateAssetMenu(fileName = "DataRegistry", menuName = "VampPon/Data Registry")]
public sealed class DataRegistry : ScriptableObject
{
    public CharacterDefinition[] characters;
    public WeaponDefinition[] weapons;
    public PassiveDefinition[] passives;
    public RareItemDefinition[] rareItems;
    public EvolutionDefinition[] evolutions;
    public EnemyDefinition[] enemies;
    public StageDefinition[] stages;
}
```

runtimeでは起動時に配列からDictionaryを構築してよい。ただし、ScriptableObject自体にDictionary fieldを持たせない。

## Importer方針

### Stage1縦スライス

最初は手作業 + 最小Editor importerでよい。

対象:

- Yui
- night_pencil
- black_ink_bottle
- old_ticket / あったか靴
- name_tag
- Stage1敵3〜5体
- Stage1背景
- LevelUp sample cards

### 本移行

Node/TS側でexportし、Unity Editor importerで `.asset` を生成する。

```txt
pnpm export:unity-data
↓
/exports/unity-data/*.json
↓
Unity Editor: Tools/VampPon/Import Data
↓
Assets/VampPon/Data/**/*.asset
```

## Validation rules

### JSON export時

- [ ] idが空ではない。
- [ ] idが重複していない。
- [ ] displayNameが空ではない。
- [ ] iconPathが存在する。
- [ ] levelsがmaxLevelと一致する。
- [ ] evolutionの参照IDが存在する。
- [ ] stage waveのenemyIdが存在する。
- [ ] runtime採用済みassetとtest-pack止まりassetを混ぜない。
- [ ] `public/assets/sprites/` を参照しない。

### Unity import時

- [ ] ScriptableObject assetが生成される。
- [ ] DataRegistryへ登録される。
- [ ] Sprite参照がmissingにならない。
- [ ] Prefab参照がmissingにならない。
- [ ] duplicate IDがない。
- [ ] enum変換に失敗しない。
- [ ] warningsはimport reportへ出る。

### BattleDemo確認

- [ ] Yuiが読み込める。
- [ ] startingWeaponIdが解決できる。
- [ ] passive/rare/evolutionの参照が解決できる。
- [ ] Stage1 enemy waveが解決できる。
- [ ] iconがUIに表示される。
- [ ] missing asset時に分かりやすいplaceholderが出る。

## Save data方針

ScriptableObject assetの参照を直接saveしない。

保存するもの:

```json
{
  "schemaVersion": 1,
  "ownedCharacters": ["yui"],
  "characterProgress": [
    { "characterId": "yui", "level": 3, "xp": 120 }
  ],
  "permanentUpgrades": [
    { "upgradeId": "base_hp", "level": 2 }
  ],
  "seenCollectionIds": ["memory_yui_001"],
  "unlockedAchievements": ["first_clear_stage1"]
}
```

保存しないもの:

- Sprite参照
- Prefab参照
- ScriptableObject instance ID
- Scene object参照
- runtime enemy instance

## 移行順序

### Step 1: 30秒デモ

- 手入力ScriptableObjectでも可。
- Yui / Ombu / night_pencil / XP / LevelUpだけ。
- データ完全移行はしない。

### Step 2: Stage1再現

- Stage1で使うデータだけexport/import。
- icons/background/cutin/enemiesを整理。
- DataRegistryを使う。

### Step 3: MVP移行

- 全weapons/passives/rare/evolutionsをexport/import。
- save schemaを作る。
- migration tableを作る。

### Step 4: 運用拡張

- Addressables化。
- 追加ステージ/追加キャラのremote update候補。
- Editor validation強化。

## 今やらないこと

- 全データの完全変換ツール実装。
- Addressables全面採用。
- セーブデータ完全移行。
- 過去のWeb localStorage互換をUnityで完全再現。
- runtime IDをWeb版で大規模rename。

## Codex向け停止ルール

以下の場合は実装を広げず、報告して止める。

- 既存runtime IDを変えないと進められない。
- `public/assets/sprites/` を参照しそうになる。
- JSON exportがDictionary前提になっている。
- Unity importでmissing referenceが大量に出る。
- ScriptableObjectへruntime stateを入れようとしている。
- save dataにUnity object参照を入れようとしている。

## 最終判断

Vamp PonのUnityデータ移行で一番重要なのは、TypeScript dataを捨てないこと。
Web版で固まった仕様を、まず中間JSONとして保存し、UnityではScriptableObjectとしてauthoring/runtime参照に変換する。

これにより、Web版とUnity版の仕様差分を追いやすくし、ID変更・素材差し替え・ステージ追加による戻しを減らす。
