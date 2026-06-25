# Unity Pro Tech Stack Guide

Vamp Pon / Lantern Ledger をUnityで良いアプリ品質へ持っていくための技術構成。

これは全移行の宣言ではなく、Unity 30〜60秒Vertical Sliceを作る時に迷わないための技術選定メモ。

## Core Principle

Unityで勝つべきところは、Phaserより派手にすることではない。

Unityで勝つべきところ:

1. ランタン光
2. 黒インク演出
3. EXP吸引の気持ちよさ
4. カメラ揺れ / hit stop / particle
5. UIの押し心地
6. 2Dキャラとエフェクトの重なり
7. スマホでの安定感

Unityでやりすぎると負けるところ:

- 重い3D化
- 過剰なポストエフェクト
- 画面を暗くしすぎる2Dライト
- 派手すぎるparticle
- UIをPrefabだらけにして管理不能にする
- 全素材を作り直す

## Recommended Stack

### Project

- Unity 6 LTS or current stable Unity 6 line
- 2D URP
- Portrait mobile
- Reference resolution: 390 x 844
- TextMeshPro
- Sprite Atlas
- Object Pooling
- ScriptableObject-based data
- Addressablesは本移行時に検討。30秒デモでは必須ではない。

### Rendering

Use:

- URP 2D Renderer
- SpriteRenderer
- 2D Lights for lantern and selected UI accents
- Sprite Mask only where needed
- Particle System for ink / memory / dust
- TrailRenderer or custom curve animation for EXP

Avoid at first:

- heavy full-screen post processing
- 3D lighting pipeline
- VFX Graph for 30秒デモ
- complex shaders before gameplay feel is proven

### Camera

Use:

- Cinemachine or simple camera controller
- small impulse/shake on hit, enemy clear, ultimate
- small zoom pulse for LevelUp / Result only if readable

Avoid:

- constant shake
- large shake during normal combat
- camera movement that makes touch controls feel bad

### Input

Use:

- Unity Input System later if full project
- simple touch abstraction for 30秒デモ
- virtual stick and right-bottom action button

30秒デモでは、入力を作り込みすぎない。

### Animation / Tween

Options:

1. Unity Animator for character sprites
2. DOTween-style tweening for UI and small effects
3. Coroutine-based minimal tweens for demo if dependencyを増やしたくない場合

Recommendation:

- production-like demo: DOTween導入候補
- zero-dependency demo: custom tween helperで十分

Use tweening for:

- button press
- card reveal
- reward row reveal
- EXP pickup curve
- seal stamp
- lantern pulse

Avoid:

- UI Animator state machineを細かくしすぎる
- everything Animator化

### Data

Use ScriptableObjects for:

- CharacterDefinition
- WeaponDefinition
- PassiveDefinition
- EnemyDefinition
- StageDefinition
- AchievementDefinition
- CollectionSectionDefinition

30秒デモでは、全部作らない。

Minimum:

- CharacterDefinition: Yui
- WeaponDefinition: 1〜2個
- EnemyDefinition: Ombu / Omburo
- LevelUpCardDefinition: 3枚
- StageDefinition: Stage1 demo

### Save

30秒デモでは不要。

本移行時:

- PlayerPrefs for simple flags only
- JSON save for structured progression
- versioned save schema
- migration hooks

### UI

Use:

- Canvas / RectTransform
- TextMeshPro
- Prefab-based reusable paper components
- CanvasGroup for fade/tap blocking
- LayoutGroupは使いすぎない。390x844固定UIは手動配置の方が読みやすい場合が多い。

UI Prefabs:

- PaperButton
- PaperCard
- PaperTab
- RankSeal
- RewardCard
- InventorySlot
- UltimateLanternButton
- KokuyouGauge
- LevelUpChoiceCard
- ResultMemoryPage

Avoid:

- full-screen screenshot UI
- text baked into textures
- generic rounded Unity UI buttons
- too many nested layout groups

## Recommended Package / Feature Combination

### Minimum Unity Demo Stack

```txt
Unity 6
2D URP
TextMeshPro
SpriteRenderer
Particle System
TrailRenderer or curve tween
ObjectPool<T>
ScriptableObject data
Simple touch abstraction
Custom UI tween helper
```

### More Polished Demo Stack

```txt
Unity 6
2D URP
2D Lights
TextMeshPro
Sprite Atlas
Particle System
Cinemachine impulse/shake
ObjectPool<T>
ScriptableObject data
DOTween or equivalent tween layer
Addressables later, not first day
```

### Production Candidate Stack

```txt
Unity 6 LTS/current stable
2D URP
2D Renderer + Light2D
TextMeshPro
Sprite Atlas
ObjectPool<T>
Addressables for asset growth
Input System
Cinemachine
ScriptableObject data registry
Versioned JSON save
Performance budget gates
Automated smoke test scenes
```

## Architecture Target

### Runtime Layers

```txt
GameApp
  Boot
  SceneFlow
  Save
  DataRegistry

Run
  RunState
  PlayerState
  InventoryState
  WaveState
  RewardState

Combat
  PlayerController
  EnemyController
  WeaponController
  ProjectileController
  PickupController
  DamageSystem

Presentation
  CameraFX
  HitStop
  ScreenShake
  Particles
  FloatingText
  UI Panels
```

### UI Layers

```txt
SafeAreaRoot
  ScreenBackground
  MainContent
  HUDLayer
  OverlayLayer
  ModalLayer
  CutinLayer
  DebugLayer
```

### Battle Layers

```txt
BackgroundLayer
EnemyLayer
PickupLayer
ProjectileLayer
PlayerLayer
EffectLayer
HUDLayer
OverlayLayer
```

## Must-Have Technical Practices

### Pool Everything Frequent

Pool:

- enemies
- projectiles
- EXP fragments
- damage numbers
- ink particles if using prefab particles
- floating UI pips

Do not instantiate/destroy repeatedly during combat.

### Separate Logic From Presentation

Bad:

```txt
EnemyHealth directly creates UI, particles, save updates, achievements.
```

Good:

```txt
EnemyHealth emits death event.
EnemyDeathPresenter plays ink burst.
PickupSpawner drops fragments.
RunStats records kill.
AchievementSystem listens separately.
```

### Fixed Naming

Unity assets must use stable English filenames.

Examples:

```txt
Prefab_Player_Yui_Demo
Prefab_Enemy_Ombu_Demo
SO_Character_Yui
SO_Enemy_Ombu
UI_ResultMemoryPage
FX_InkBurst_Soft
FX_LanternPulse
```

### No Text In Images

All text must be TextMeshPro.

Reasons:

- title can change
- localization possible
- font/readability can be tuned
- generated image noise avoided

## Recommended First Unity Scene

Make one `BattleDemo.unity` first.

It should include:

- Yui placeholder
- lantern light
- Ombu spawner
- auto attack
- enemy death ink burst
- EXP drop
- EXP curved pickup
- LevelUp panel
- Ultimate / 黒曜化 cutin
- Result panel

Do not create the full game loop first.

## What Makes It Feel Pro

### Micro-feedback Stack

Every important action should combine 2〜4 signals:

Enemy hit:

- tiny hit stop
- small particle
- sprite flash
- short sound

Enemy death:

- black ink burst
- memory fragment pop
- small camera impulse
- soft low-pitched SE

EXP collect:

- curved motion
- light trail
- small pitch-up SE
- tiny player lantern pulse

LevelUp:

- background dim
- card stagger
- paper slide/pop
- rare warm seal pulse

Result:

- dawn glow
- rank seal stamp
- reward row reveal
- primary CTA lantern pulse

### Restraint

Pro quality is not max particles.

Rules:

- normal combat: readable
- milestone moment: strong
- result/levelup: calm but tactile
- 黒曜化: dangerous but not unreadable

## Unity Decision Matrix

Move to Unity if:

- 30秒デモでbattle feel is clearly better
- effects are better without losing readability
- UI still feels handmade/paper
- mobile performance looks safe
- asset workflow is manageable

Stay in Phaser if:

- Unity visual gain is small
- UI work becomes slower
- asset prep becomes heavy
- performance budget is hard to keep
- game feel can be achieved in Phaser with less cost

## Final Rule

Unity should be used only if it makes the game feel more alive without making production uncontrollable.
