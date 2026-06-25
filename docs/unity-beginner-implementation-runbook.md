# Unity Beginner Implementation Runbook

Unity初心者でも、Vamp Pon / Lantern Ledger を安全にUnityへ検証移行するための手順書。

目的は、Unityを触ったことが少なくても、何から始めればいいか迷わず、Phaser側の成果を壊さず、30〜60秒Vertical Sliceまで到達すること。

## Golden Rule

Unityへ移行する時も、いきなり本番移植しない。

最初に作るもの:

```txt
Unity 30〜60秒 Vertical Slice
```

作らないもの:

```txt
全キャラ
全ステージ
全図鑑
全実績
全Save
広告
課金
Cloud Save
Remote Config
Addressables
```

まず見るのは、UnityでこのゲームがPhaserより気持ちよくなるか。

## Beginner Mental Model

Unityは大きく分けるとこう考える。

```txt
Scene = 画面 / 場面
GameObject = 画面上の物
Component = GameObjectに付ける機能
Prefab = 再利用できる部品
ScriptableObject = データ定義
Canvas = UIを置く場所
SpriteRenderer = 2D絵を表示する部品
Particle System = 粒子演出
Light2D = 2D用の光
```

Phaserと対応させるとこう。

```txt
Phaser Scene -> Unity Scene
Phaser Container -> Unity GameObject hierarchy
Phaser Graphics -> Unity Sprite/UI Image/LineRenderer/Procedural UI
Phaser Text -> TextMeshPro
Phaser Tween -> Tween helper / DOTween-like tween
Phaser Particles -> Particle System
Phaser data files -> ScriptableObject
localStorage -> local JSON save later
```

## Step 0: Do Not Start Unity Until This Is Ready

Phaser側で最低限確認するもの:

- Result Clearの記憶ページ方向
- LevelUpの紙カード方向
- StageSelectの地図カード方向
- Battle HUDの紙札方向
- 黒曜化の表示は `黒曜化`
- design targetsが整理されている
- docs/design-system.md がある
- docs/ui-implementation-contract.md がある

Unityは、Phaserで作った正解の見た目を参考にする。

## Step 1: Create Unity Project

Recommended:

```txt
Unity 6
2D URP
Portrait mobile
Project name: lantern-ledger-unity-demo or vamp-pon-unity-demo
```

Important:

- 本repo内にいきなり巨大なUnityプロジェクトを作るかは慎重に決める。
- 最初は別ブランチ、または別ディレクトリ運用を検討する。
- Unityプロジェクトをこのrepoへ入れる場合は、Git LFSや.gitignoreを先に決める。

## Step 2: Set Resolution / Canvas

Set baseline:

```txt
Reference resolution: 390 x 844
Orientation: Portrait
Canvas Scaler: Scale With Screen Size
Match: 0.5
SafeAreaRoot: required
```

Create UI hierarchy:

```txt
CanvasRoot
  SafeAreaRoot
    ScreenBackground
    MainContent
    HUDLayer
    OverlayLayer
    ModalLayer
    CutinLayer
    DebugLayer
```

Rules:

- UIは全部SafeAreaRootの下に置く。
- TextはTextMeshPro。
- 文字入り画像は禁止。

## Step 3: Create Folders

Use this structure:

```txt
Assets/
  _Project/
    Art/
      Characters/
      Enemies/
      UI/
      Backgrounds/
      Effects/
      Cutins/
    Audio/
      BGM/
      SE/
    Data/
      ScriptableObjects/
    Prefabs/
      Player/
      Enemies/
      Projectiles/
      Pickups/
      UI/
      Effects/
    Scenes/
      Boot.unity
      Title.unity
      BattleDemo.unity
      Result.unity
    Scripts/
      Core/
      Runtime/
      Player/
      Enemy/
      Combat/
      Weapons/
      Pickups/
      UI/
      Effects/
      Data/
      Save/
      Debug/
    Settings/
```

Do not scatter files directly under `Assets/`.

## Step 4: Make BattleDemo First

最初に作るのはTitleではなく、BattleDemoでもよい。

Reason:

- Unity移行の価値はbattle feelで決まる。
- TOPだけ良くても移行判断にならない。

BattleDemo minimum:

```txt
Yui placeholder
Ombu placeholder
Lantern light
Auto attack
Enemy death ink burst
EXP fragment pickup curve
HUD placeholder
LevelUp overlay placeholder
Result Clear placeholder
```

## Step 5: Player Placeholder

Do not wait for perfect sprite.

Create:

```txt
Player_Yui_Demo.prefab
```

Components:

```txt
SpriteRenderer
CircleCollider2D
Rigidbody2D or simple transform movement
PlayerMovementDemo
PlayerHealthDemo
LanternLight2D
PickupCollector
WeaponEmitterDemo
```

Yui design reminders:

- right-hand lantern in final art
- bag strap right shoulder to left waist
- bag at left waist
- gentle but not weak

For placeholder, simple marker is okay.

## Step 6: Enemy Placeholder

Create:

```txt
Enemy_Ombu_Demo.prefab
Enemy_Omburo_Demo.prefab
```

Components:

```txt
SpriteRenderer
CircleCollider2D
EnemyChaseDemo
EnemyHealthDemo
InkDeathEffectSpawner
```

Rules:

- Ombu = small soft black ink shadow
- Omburo = larger, heavier shadow
- no scary gore
- no generic demon

## Step 7: Object Pool Early

Pool early even in demo.

Pool:

```txt
enemies
projectiles
EXP fragments
ink bursts
hit sparks
floating texts
```

Why:

- Vampire-survivor style games spawn many objects.
- Frequent Instantiate/Destroy causes performance spikes.
- Pooling is easier if architecture starts with it.

## Step 8: EXP Pickup Curve

This is one of the most important Unity tests.

MemoryFragment flow:

```txt
enemy dies
fragment pops outward
short delay
fragment curves toward Yui
small trail/glow
collect sound
Yui lantern pulses
EXP increases
```

Use:

- simple sprite
- custom Bezier tween or magnet motion
- no real Light2D per fragment
- optional short TrailRenderer only for small counts

## Step 9: Ink Burst

Enemy death should feel like black ink dissolving, not fire explosion.

InkBurst rules:

```txt
normal enemy: 8〜16 ink particles
elite: 18〜32 ink particles
short lifetime
soft edge
pooled
```

Avoid:

- huge smoke cloud
- full-screen splatter
- horror blood

## Step 10: LevelUp Panel

Create:

```txt
LevelUpPanel.prefab
LevelUpChoiceCard.prefab
```

Card structure:

```txt
icon area
title area
description area
rarity tag area
```

States:

```txt
Normal: calm
Good: slightly highlighted
Rare: warm lantern frame + seal
```

No neon. No baked text.

## Step 11: 黒曜化 / Ultimate

Create:

```txt
UltimateLanternButton.prefab
KokuyouGauge.prefab
KokuyouCutin.prefab
```

Display text:

```txt
黒曜化
```

Rules:

- no `KOKUYOU` UI display
- no red-eye demon mode
- black ink edge
- warm lantern core remains
- short cutin, not long super move

## Step 12: Result Clear

Create:

```txt
ResultMemoryPage.prefab
RankSeal.prefab
RewardCard.prefab
```

Sequence:

```txt
background fades
dawn glow rises
memory page appears
rank seal stamps
rewards reveal
Growth CTA pulses
```

Result must feel like a memory page, not a spreadsheet.

## Step 13: Save Later

Do not build full save in 30秒 demo.

When needed:

```txt
local JSON save first
versioned schema
Cloud Save later only if needed
```

Do not start with Cloud Save.

## Step 14: Analytics Later

Do not add analytics in 30秒 demo.

When prototype is playable, add an abstraction first:

```txt
IAnalyticsService
  Track(eventName, parameters)
```

Then later choose:

- Unity Analytics
- Firebase Analytics

Do not spread analytics calls everywhere without wrapper.

## Step 15: Crash Reporting Before Beta

Before external test distribution:

- Firebase Crashlytics or Unity Cloud Diagnostics
- build version tags
- scene/stage custom keys

But do not add during first Unity spike.

## Step 16: Ads / IAP Much Later

Do not add ads or IAP until:

- core loop is fun
- retention is plausible
- reward economy is clear
- monetization design is not harmful

Likely ad fit later:

```txt
rewarded ad after defeat for bonus memory shards
rewarded ad for optional reroll
```

Avoid:

```txt
banner during battle
forced interstitial every run
app open ad at launch
```

## Beginner Mistakes To Avoid

### Mistake 1: Starting with the full game

Bad:

```txt
All scenes, all systems, all data, save, ads, store build.
```

Good:

```txt
30秒 battle feel demo.
```

### Mistake 2: Importing all images

Bad:

```txt
Import every AI image into Unity runtime.
```

Good:

```txt
Use AI images as reference. Import only clean layers/icons/effects needed.
```

### Mistake 3: Too many lights

Bad:

```txt
Every EXP fragment has Light2D.
```

Good:

```txt
Player lantern uses Light2D. Small glows are sprites.
```

### Mistake 4: Everything Animator

Bad:

```txt
Every UI button/card uses Animator controller.
```

Good:

```txt
Simple tween helper for press/reveal/stamp.
```

### Mistake 5: No pooling

Bad:

```txt
Instantiate/Destroy enemies, bullets, fragments every time.
```

Good:

```txt
Pool frequent objects from the start.
```

## First Unity Agent Prompt

Use this when actually starting Unity demo:

```txt
あなたは `/Users/m-shogo/Developer/personal/vamp-pon` の仕様とdocsを参照し、Unity 6 / 2D URP の30秒Vertical Sliceを設計してください。

重要:
これは全移植ではありません。
まずUnityでbattle feelがPhaserより良くなるか確認するdemoです。

参照docs:
- docs/design-system.md
- docs/unity-modern-mobile-app-stack.md
- docs/unity-pro-tech-stack.md
- docs/unity-game-feel-cookbook.md
- docs/unity-mobile-performance-budget.md
- docs/unity-vertical-slice-spec.md
- docs/phaser-to-unity-data-map.md
- docs/asset-pipeline.md

やる:
1. Unity 6 / 2D URP project setup案を作る
2. folder structureを作る
3. 390x844 portrait Canvas/SafeArea案を作る
4. BattleDemo sceneを最初に作る
5. Yui placeholder, Ombu placeholder, ink burst, EXP pickup curveを作る
6. ObjectPoolを最初から使う
7. LevelUpPanel / ResultMemoryPage / KokuyouCutinはplaceholderでよい

やらない:
- 全移植
- 全Save
- 広告
- 課金
- Cloud Save
- Remote Config
- Addressables
- 画像一枚貼りUI
- 文字入り画像

完了レポート:
1. 作ったScene
2. 作ったPrefab
3. 作ったScript
4. まだ仮の部分
5. Phaserより良くなった点
6. 性能リスク
7. 次にやること
```

## First Week Plan

### Day 1

- Unity project created
- folder structure
- portrait Canvas
- SafeAreaRoot
- dark background
- Yui placeholder

### Day 2

- Ombu enemy
- chase movement
- simple attack/damage
- object pool base

### Day 3

- ink death burst
- EXP fragment
- pickup curve
- collect pulse

### Day 4

- LevelUpPanel placeholder
- paper cards
- card reveal/press

### Day 5

- Ultimate button
- 黒曜化 gauge/cutin placeholder
- camera impulse/hit stop

### Day 6

- ResultMemoryPage
- rank seal stamp
- reward row reveal

### Day 7

- 30秒 flow polish
- phone performance check
- Phaser vs Unity decision note

## Decision After First Week

Move toward Unity if:

- EXP pickup feels much better
- ink burst feels better
- lantern light improves mood
- UI remains readable
- performance seems safe
- work speed is acceptable

Stay with Phaser if:

- visual gain is small
- Unity setup slows everything
- battle readability worsens
- asset preparation becomes too heavy

## Final Rule

Unity初心者でも、順番を守れば迷わない。

最初に作るのは全部ではなく、気持ちよさの証拠。
