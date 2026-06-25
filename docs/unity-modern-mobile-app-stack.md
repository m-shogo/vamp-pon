# Modern Unity Mobile App Stack

Unityで今どきのスマホゲーム/アプリ品質へ持っていく時の組み合わせ。

この文書はVamp Pon / Lantern Ledger向け。全部を最初から入れるのではなく、30秒Vertical Slice、MVP、正式版で段階的に採用する。

## Conclusion

Vamp Pon向けの基本構成はこれ。

```txt
Unity 6
2D URP
TextMeshPro
Sprite Atlas
ObjectPool<T>
ScriptableObject data
Particle System
TrailRenderer / custom curve tween
Cinemachine or small camera impulse
Custom tween layer or DOTween-like tweening
Local JSON save first
Firebase Crashlytics later
Unity Analytics or Firebase Analytics later
Remote Config later
AdMob or Unity LevelPlay later
Cloud Save only after retention is proven
Addressables only after asset count grows
```

## Do Not Install Everything First

最新アプリっぽくしたいからといって、SDKを最初から全部入れると重くなる。

30秒デモで必要なのは、演出と操作感。

最初に入れないもの:

- ads
- IAP
- cloud save
- push notification
- full analytics funnel
- remote config
- addressables
- social login
- multiplayer backend

理由:

- app sizeが増える
- build設定が複雑になる
- iOS/Androidの権限/同意/依存関係が増える
- gameplay feelの検証が遅くなる

## Stack by Phase

### Phase 1: Unity 30s Demo

Purpose:

Phaserより気持ちよく見えるか判断する。

Use:

- Unity 6
- 2D URP
- TextMeshPro
- SpriteRenderer
- Particle System
- TrailRenderer or curve tween
- ObjectPool<T>
- ScriptableObject minimal data
- Local demo state
- custom UI tween helper

Do not use yet:

- Firebase
- Unity Gaming Services
- Ads
- IAP
- Addressables
- Cloud Save

### Phase 2: Playable Prototype

Purpose:

数分遊べる縦画面版。

Add:

- simple local save JSON
- basic analytics abstraction interface
- performance debug overlay
- versioned data registry
- scene flow manager
- audio manager
- object pool registry

Maybe add:

- Firebase Crashlytics
- Unity Analytics or Firebase Analytics

Still avoid:

- ad monetization
- remote config balance tuning
- cloud save
- addressables unless assets are already large

### Phase 3: MVP Beta

Purpose:

実機配布と継続率確認。

Add:

- Crashlytics
- analytics event taxonomy
- Remote Config for balance flags
- optional App Distribution / TestFlight workflow
- privacy/consent preparation
- store build checks

Maybe add:

- rewarded ads only if game loop supports it
- IAP only if monetization design is fixed
- Cloud Save only if multi-device need is real

### Phase 4: Production

Purpose:

正式運用。

Add based on need:

- AdMob or Unity LevelPlay
- IAP
- Remote Config / A/B testing
- Cloud Save
- Addressables
- push notifications
- user acquisition attribution
- store analytics
- consent management

## Recommended Engine / Rendering Stack

### Unity 6 + 2D URP

Best for this project because:

- 2D lights can sell lantern mood
- dark storybook scenes need controlled light
- SpriteRenderer + 2D Renderer keeps it 2D-first
- not forced into full 3D pipeline

Use for:

- player lantern
- stage ambient mood
- black ink edge overlays
- result dawn glow

Avoid:

- many dynamic lights
- complex shadows everywhere
- 3D materials for everything

### TextMeshPro

Use for all UI text.

Rules:

- no baked text in images
- short labels
- readable 390x844
- title can be changed later

### Sprite Atlas

Use when runtime assets grow.

Good for:

- icons
- small UI decals
- enemy sprites
- effects

Do not worry about this on day one unless imports are already messy.

### ObjectPool<T>

Use for:

- enemies
- projectiles
- EXP fragments
- damage numbers
- ink bursts
- hit sparks

Do not Instantiate/Destroy repeatedly in combat.

## Presentation / Game Feel Stack

### Particle System

Use for:

- ink burst
- paper dust
- memory spark
- reward glow

Keep particle counts low.

### TrailRenderer / Curve Tween

Use for:

- EXP pickup curve
- lantern light streak
- black ink slash edge

For many EXP fragments, prefer simple sprite tween over heavy trail per fragment.

### Camera Impulse

Use for:

- elite death
- boss death
- ultimate activation
- result seal stamp maybe tiny

Avoid constant shake.

### Tweening

Options:

- custom tween helper first
- DOTween-like package later if needed

Use for:

- button press
- card reveal
- reward reveal
- seal stamp
- EXP travel

Avoid making all motion Animator state machines.

## Data / Architecture Stack

### ScriptableObject Definitions

Use for:

- CharacterDefinition
- WeaponDefinition
- EnemyDefinition
- StageDefinition
- LevelUpCardDefinition
- AchievementDefinition

Benefits:

- editable in Unity
- stable data registry
- easier designer iteration
- good bridge from Phaser data

### Local JSON Save First

Use first for:

- progress
- unlocked stages
- growth levels
- collection seen states
- settings

Add versioning immediately:

```txt
saveVersion
playerProgress
collectionState
settings
lastUpdatedAt
```

### Cloud Save Later

Use only when:

- retention is proven
- user account/login policy is decided
- multi-device restore matters
- support cost is worth it

## Backend / LiveOps Options

### Unity Gaming Services

Good fit if you want Unity-native operations:

- Analytics
- Remote Config
- Cloud Save
- Economy / Cloud Code later if needed
- LevelPlay for monetization

Best when:

- keeping tools in Unity ecosystem is important
- game is Unity-only
- LiveOps grows gradually

### Firebase

Good fit if you want mobile app-style backend/ops:

- Crashlytics
- Analytics
- Remote Config
- A/B Testing
- Cloud Messaging
- App Distribution
- Performance Monitoring
- Firestore/Functions if you build backend features

Best when:

- crash quality matters early
- app distribution/testing matters
- Google ecosystem is okay
- you want flexible mobile app operations

### Recommendation for this project

For first Unity demo:

```txt
No backend SDK.
```

For prototype/beta:

```txt
Firebase Crashlytics OR Unity Analytics.
Not both at first unless needed.
```

For MVP:

```txt
Crashlytics + Analytics + Remote Config.
```

For production:

```txt
Add Ads/IAP/Cloud Save only after game loop and monetization design are fixed.
```

## Analytics Stack

Track only what you will act on.

Early events:

```txt
app_start
run_start
run_end
stage_select
level_up_open
level_up_pick
weapon_evolve
ultimate_used
kokuyou_activated
result_growth_tap
collection_open
```

Metrics:

- run length
- death time
- clear rate
- level reached
- card pick rate
- retry rate
- growth tap rate
- crash-free sessions

Do not track everything.

## Crash / Quality Stack

Crash reporting should enter before external beta.

Use:

- Firebase Crashlytics or equivalent
- version/build number tagging
- scene/run state breadcrumbs if possible
- device model / OS checks

Useful custom keys:

```txt
scene
stageId
characterId
elapsedSec
enemyCount
weaponCount
kokuyouState
buildChannel
```

## Remote Config Stack

Use Remote Config after tuning begins.

Good parameters:

```txt
stage1_enemy_hp_multiplier
stage1_exp_multiplier
drop_rate_recovery
kokuyou_charge_multiplier
levelup_rare_weight
first_run_easy_mode
ad_enabled
result_growth_cta_variant
```

Rules:

- keep defaults in app
- remote values are overrides
- never require remote config for app to run
- log config assignment for analysis

## Monetization Stack

Do not add ads before core loop is fun.

Best eventual ad types for this game:

1. rewarded ad after defeat for bonus memory shards
2. rewarded ad for optional reroll
3. interstitial only at natural breaks, if ever
4. no banner during battle

Ad providers:

- AdMob simple path
- Unity LevelPlay if mediation/revenue optimization matters

Avoid:

- app open ads early
- banner ads in battle
- forced ads before retention is proven
- rewarded interstitial without careful UX

## IAP Stack

Only if product design is clear.

Possible IAP later:

- remove ads
- supporter pack
- cosmetic lantern skins
- character skin pack
- season memory pass, if liveops exists

Avoid pay-to-win early.

## Attribution / UA Stack

Only needed if you spend on ads.

Candidates later:

- Firebase/Google Analytics campaign tracking
- AppsFlyer / Adjust / Singular if paid UA scales
- Apple Search Ads attribution

Do not add in prototype.

## Build / CI Stack

For Unity later:

- GitHub Actions or Unity Cloud Build
- GameCI can be evaluated if self-hosting Unity builds
- iOS build requires Apple signing pipeline
- Android build requires keystore management

First demo can be local Editor only.

## Privacy / Consent Stack

Before production with analytics/ads:

- privacy policy
- App Store privacy nutrition labels
- Google Play Data safety
- consent flow for EEA/UK if ads/analytics require it
- child-directed flags if relevant

Do not bolt this on last minute.

## What Modern Unity Apps Usually Combine

### Casual / Roguelite Mobile Game

```txt
Unity + C#
URP or built-in depending project
TextMeshPro
Sprite Atlas
Object pooling
ScriptableObjects
Analytics
Crash reporting
Remote Config
Rewarded ads
IAP optionally
Local save + optional cloud save
```

### High-Polish 2D Game

```txt
Unity 2D URP
2D lights
SpriteRenderer
Particle System
Cinemachine/camera impulse
Tweening
Custom shaders sparingly
TextMeshPro
Local JSON save
Analytics later
```

### LiveOps Mobile Game

```txt
Unity
UGS or Firebase
Analytics
Remote Config
A/B Testing
Cloud Save
Economy
Ads mediation
IAP
Push notification
Attribution
```

## Best Stack for Vamp Pon Now

### Right Now

```txt
Phaser baseline continues.
Unity docs and design system continue.
No Unity project yet unless 30s demo starts.
```

### Unity 30s Demo

```txt
Unity 6
2D URP
TextMeshPro
SpriteRenderer
Particle System
TrailRenderer/custom tween
ObjectPool<T>
ScriptableObject minimal data
custom UI tween
no ads
no backend
no cloud
```

### If Demo Wins

```txt
Add local JSON save
Add analytics abstraction
Add Crashlytics before beta
Add Remote Config for tuning
Add ads/IAP only after loop is fun
Add cloud save only after account/multi-device need is real
```

## Final Rule

Modern app quality is not created by adding many SDKs.

For this project, the winning combination is:

```txt
Unity 2D URP + controlled light + precise particles + object pooling + clean UI prefabs + analytics/crash/liveops only when needed.
```
