# Unity Implementation Roadmap

Unityへ進む場合の実装ロードマップ。

目的は、全移行で迷子にならず、30〜60秒Vertical Sliceから段階的に判断すること。

## Current Position

Phaser側で以下を先に固める。

- design targets
- design system
- asset pipeline
- UI implementation contract
- visual QA gates
- Result / LevelUp / StageSelect / Battle HUD の方向性

Unityはその後、比較用の30〜60秒デモから始める。

## Migration Rule

Unityは一気に全移植しない。

Sequence:

```txt
Phase 0: Phaser visual baseline
Phase 1: Unity technical spike
Phase 2: Unity 30s battle feel demo
Phase 3: Unity UI panels demo
Phase 4: Unity vertical slice
Phase 5: migration decision
Phase 6: production port only if Unity clearly wins
```

## Phase 0: Phaser Visual Baseline

Goal:

Unityに渡す正解画面をPhaserで作る。

Must have:

- Result Clear memory page
- LevelUp paper cards
- StageSelect night map card
- Battle HUD paper tags
- Ultimate lantern button
- 黒曜化 gauge/cutin direction
- design-targets organized

Exit criteria:

- 390x844で読める
- 世界観が安定
- UI部品が分解されている
- Unityで作るべき見た目が明確

## Phase 1: Unity Technical Spike

Goal:

Unity projectがこのゲームに向いているか、最小確認する。

Tasks:

1. Create Unity 6 2D URP project
2. Set portrait 390x844 Canvas
3. Add SafeArea root
4. Add simple dark paper background
5. Add Yui placeholder
6. Add player lantern Light2D
7. Add one Ombu placeholder
8. Add one ink burst particle
9. Add one EXP fragment pickup curve
10. Add basic UI button press feedback

Exit criteria:

- Editor再生で動く
- ランタン光が雰囲気に合う
- 黒インクparticleが重すぎない
- EXP吸引がPhaserより気持ちよくできそう

Do not:

- full game loop
- save
- all screens
- all weapons

## Phase 2: Battle Feel Demo

Goal:

Unityで戦闘が本当に気持ちよくなるか確認する。

Tasks:

1. Yui move placeholder
2. enemy spawn 30〜60体
3. auto attack placeholder
4. enemy damage/death
5. pooled ink burst
6. pooled EXP fragments
7. magnet pickup curve
8. hit stop
9. camera impulse
10. HUD minimal

Exit criteria:

- enemy death feels better than Phaser
- EXP collect feels better than Phaser
- no readability loss
- no obvious performance hitch

## Phase 3: UI Panels Demo

Goal:

Unity UIで紙UIが気持ちよく作れるか確認する。

Tasks:

1. PaperButton prefab
2. PaperCard prefab
3. LevelUpPanel
4. ResultMemoryPage
5. RankSeal stamp
6. Reward row reveal
7. UltimateLanternButton
8. KokuyouGauge

Exit criteria:

- UI looks handmade/paper, not generic Unity UI
- TextMeshProで文字が読める
- card/button feedbackが気持ちいい
- Prefabとして再利用可能

## Phase 4: 30〜60秒Vertical Slice

Goal:

一連の体験をUnityで見せる。

Flow:

```txt
Title
-> Stage Start
-> Battle 30 sec
-> Enemy death
-> EXP pickup
-> LevelUp
-> Ultimate / 黒曜化
-> Result Clear
```

Required:

- no full progression system
- no complete save
- no complete collection
- only demo data

Exit criteria:

- 30秒で世界観が伝わる
- Phaserより演出が良い
- 390x844で読める
- mobile performance is plausible
- production cost feels manageable

## Phase 5: Migration Decision

Compare Phaser vs Unity.

### Unity Wins If

- Battle feel is clearly better
- Lantern/ink/EXP are clearly better
- UI remains readable
- workload is acceptable
- asset pipeline is manageable
- mobile performance is stable enough

### Phaser Continues If

- visual gain is small
- UI is slower to build
- asset workload explodes
- performance is worse
- gameplay iteration slows too much

## Phase 6: Production Port

Only after Unity wins.

Port order:

1. data definitions
2. player/enemy runtime
3. weapon system
4. pickups/EXP
5. LevelUp
6. Result
7. StageSelect
8. Save/progression
9. Collection
10. achievements
11. full asset pipeline
12. mobile build/test

## Recommended Unity PR / Task Split

### PR U1: Project Setup

- Unity project skeleton
- portrait settings
- folder structure
- Boot/Title/BattleDemo scenes

### PR U2: Core Presentation

- Yui placeholder
- Ombu placeholder
- lantern Light2D
- camera
- paper background

### PR U3: Combat Loop Demo

- enemy spawn
- auto attack
- damage/death
- object pooling

### PR U4: EXP Feel

- memory fragment prefab
- pickup curve
- collect pulse
- collect SE placeholder

### PR U5: Battle Juice

- hit stop
- camera impulse
- ink burst tuning
- particle cap

### PR U6: LevelUp UI

- paper card prefab
- 3 choice panel
- card reveal/press

### PR U7: Ultimate / 黒曜化

- ultimate button
- kokuyou gauge
- cutin band
- ink edge effect

### PR U8: Result Clear

- result memory page
- rank seal stamp
- rewards row
- growth CTA

### PR U9: Vertical Slice Flow

- Title -> BattleDemo -> Result flow
- demo timeline
- report comparison

## Unity Demo Data Scope

Only include:

```txt
Character: Yui
Enemies: Ombu, Omburo
Weapons: 1-2 placeholder weapons
Cards: 3 LevelUp cards
Stage: Memory Street demo
Result: fixed sample reward
Kokuyou: one activation
```

Do not include:

- 20 characters
- 50 stages
- all weapons
- all achievements
- all collection records

## Stop Conditions

Stop Unity work if:

- project setup takes too long without visual gain
- combat is less readable than Phaser
- mobile performance is bad early
- UI feels generic
- asset requirements explode

Stopping is not failure. It means Phaser remains the better path.

## Success Definition

Unity path is successful when:

- 30秒デモを見て「こっちの方が明らかに売れそう」と感じる
- 作業量が現実的
- 画面が読みやすい
- touch feelが良い
- battle feelが良い
- design-systemの世界観が守れている

## Final Rule

Do not migrate because Unity is famous.

Migrate only if Unity makes this specific game better.
