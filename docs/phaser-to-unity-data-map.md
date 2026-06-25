# Phaser to Unity Data Map

Phaser実装で固めた仕様を、Unityへ移す時の対応表。

Unityへ移行する場合でも、Phaser側の仕様・データ・UI設計は捨てない。まず対応関係を固定し、30秒Vertical Sliceで必要なものだけ移す。

## Scene Map

| Phaser | Unity候補 | 備考 |
|---|---|---|
| `TopScene` | `Title.unity` / `TitleController` | TOP / Start / Growth / Collection導線 |
| `StageSelectScene` | `StageSelect.unity` / `StageSelectController` | 後回し。30秒デモでは簡易Stage Startで代用可 |
| `MainScene` | `BattleDemo.unity` / `BattleController` | 最重要。30秒デモの中心 |
| `CollectionScene` | `Collection.unity` / `CollectionController` | 本移行時。30秒デモでは不要 |
| Result overlay | `Result.unity` / `ResultPanel` | 30秒デモで必要 |
| LevelUp overlay | `LevelUpPanel.prefab` | 30秒デモで必要 |
| Pause overlay | `PausePanel.prefab` | 後回し |

## Runtime Map

| Phaser concept | Unity concept | Notes |
|---|---|---|
| `RuntimeState` | `GameRunState` | 実行中の状態を保持 |
| `inventory` | `InventoryModel` | weapons/passives/rare items |
| weapon defs | `WeaponDefinition` ScriptableObject | 本移行時は全武器。デモは1〜2個 |
| passive defs | `PassiveDefinition` ScriptableObject | デモでは不要でもよい |
| stage defs | `StageDefinition` ScriptableObject | デモはStage1だけ |
| enemy defs | `EnemyDefinition` ScriptableObject | Ombu/Omburoだけ |
| achievements | `AchievementDefinition` ScriptableObject | デモは表示だけでも可 |
| localStorage | PlayerPrefs / JSON save | 本移行時。デモでは不要 |
| Phaser Graphics | Unity UI Image / Sprite / LineRenderer / Procedural Mesh | UI部品化する |
| Phaser Tween | DOTween or Unity Tween | DOTweenは採用候補 |
| Phaser Particles | Unity Particle System | VFX Graphは後回し |
| camera shake | Cinemachine Impulse | 30秒デモで有効 |
| hit stop | TimeScale / custom pause | 過剰にしない |

## ScriptableObject Drafts

### CharacterDefinition

```txt
id
name
displayTitle
description
baseHp
baseSpeed
pickupRange
startingWeaponId
lanternColor
kokuyouColor
spriteSet
cutinNormal
cutinKokuyou
```

### WeaponDefinition

```txt
id
displayName
description
icon
rarity
maxLevel
cooldown
damage
range
projectilePrefab
evolutionPairIds
evolvedWeaponId
```

### PassiveDefinition

```txt
id
displayName
description
icon
maxLevel
effectType
valuePerLevel
```

### StageDefinition

```txt
id
displayName
shortDescription
background
music
durationSec
difficultyDepths
enemyWaves
clearReward
unlockCondition
```

### EnemyDefinition

```txt
id
displayName
enemyType
hp
speed
damage
expDrop
sprite
deathEffect
isElite
```

### AchievementDefinition

```txt
id
displayName
description
category
reward
conditionType
conditionValue
hidden
```

### CollectionSectionDefinition

```txt
id
displayName
shortLabel
description
motif
accentColor
lockedHint
```

## Data Migration Priority

### For 30s Demo

Move only:

1. Yui basic stats
2. 1 starting weapon
3. Ombu enemy
4. Omburo enemy
5. Memory Fragment pickup
6. LevelUp 3 card samples
7. Result reward samples
8. Kokuyou / Ultimate state samples

### For Real Migration

Move later:

1. all weapons
2. all passives
3. rare items
4. evolution/fusion rules
5. all stages
6. all enemy waves
7. achievements
8. collection records
9. permanent growth
10. save data

## UI Prefab Map

| Phaser UI | Unity Prefab |
|---|---|
| paper card helper | `PaperCard.prefab` |
| premium paper button | `PaperButton.prefab` |
| title paper banner | `TitlePaperBanner.prefab` |
| small lantern badge | `LanternBadge.prefab` |
| rank seal | `RankSeal.prefab` |
| reward card | `RewardCard.prefab` |
| collection tab | `PaperIndexTab.prefab` |
| inventory slot | `InventorySlot.prefab` |
| ultimate button | `UltimateLanternButton.prefab` |
| kokuyou gauge | `KokuyouGauge.prefab` |
| level up card | `LevelUpChoiceCard.prefab` |
| result page | `ResultMemoryPage.prefab` |

## Effect Prefab Map

| Phaser effect | Unity Prefab |
|---|---|
| enemy death ink particles | `InkBurst.prefab` |
| memory fragment absorb | `MemoryFragmentTrail.prefab` |
| lantern glow | `LanternPulse.prefab` |
| dawn result glow | `DawnGlow.prefab` |
| hit spark | `HitSpark.prefab` |
| kokuyou screen edge ink | `KokuyouEdgeInk.prefab` |
| ultimate flash | `UltimateFlash.prefab` |
| cutin slash | `CutinSlash.prefab` |

## Asset Extraction Checklist

Before Unity work, collect:

- `public/assets/prototypes/sprite-sheets/core5-*`
- `public/assets/prototypes/sprite-sheets/enemies-*`
- `public/assets/prototypes/backgrounds`
- `public/assets/prototypes/cutins`
- `public/assets/` runtime assets if used
- `docs/design-targets/final`
- `docs/design-targets/implementation`
- `src/game/data`
- `src/game/config/GameFeelConfig.ts`

## Naming Rules for Unity

Use stable names, not UUIDs.

Examples:

```txt
ui_paper_card_base.png
ui_button_primary_paper.png
ui_rank_seal_s.png
ui_icon_memory_fragment.png
fx_ink_burst_soft.png
fx_lantern_glow_core.png
cutin_yui_kokuyou_base.png
char_yui_demo_idle.png
enemy_ombu_demo.png
enemy_omburo_demo.png
```

## Migration Warnings

Do not port everything blindly.

High-risk areas:

- UI state logic
- save data
- achievement unlock logic
- weapon evolution logic
- stage unlock logic
- collection seen/new state

For first Unity demo, fake or hardcode where necessary.

The first Unity demo is not a production port. It is a visual/game-feel proof.
