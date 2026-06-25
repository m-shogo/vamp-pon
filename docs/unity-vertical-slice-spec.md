# Unity 30-60s Vertical Slice Spec

Unity移行を判断するための最小デモ仕様。

これは全移植ではない。Phaserで固めた画面・世界観・手触りを、Unityでどこまで上げられるかを見るための検証用Vertical Slice。

## 目的

30秒〜60秒で以下を確認する。

- Unityの演出力がPhaserより明確に良いか
- 黒インク / ランタン / EXP吸引 / カットインの表現が強いか
- スマホ縦画面でUIが読めるか
- 今後の量産が現実的か

## Demo Flow

```txt
0s:
Title screen
Start tap

3s:
Stage Start
Stage 1 / Memory Street style intro

5s:
Battle starts
Yui or placeholder appears near lower center
Ombu enemies spawn from edges

8s:
Auto attack
Enemy defeated
Black ink burst
Memory fragments drop

12s:
EXP absorb
Fragments curve toward player
Small pop feedback

16s:
LevelUp overlay
3 paper cards appear
Rare card has warm lantern highlight

22s:
Ultimate or 黒曜化
Ink edge invasion
Warm lantern core remains
Cut-in band appears

28s:
Enemy clear moment
Small camera shake / hit stop

32s:
Result Clear
Memory page / Rank seal / Rewards / New Records / Growth CTA
```

## Required Scenes

### Boot.unity

- Loads data
- Sets resolution/safe area
- Goes to Title

### Title.unity

- Dark storybook title screen
- Large primary CTA
- Small secondary buttons are optional
- No full character illustration required

### BattleDemo.unity

- 30秒デモの本体
- Minimal player
- Ombu / Omburo placeholders
- Auto attack
- Enemy death
- EXP pickup
- LevelUp overlay
- Ultimate / 黒曜化演出

### Result.unity

- Result Clear memory page
- Rank seal
- Reward row
- New records row
- Growth CTA

## Required Prefabs

### Player_Yui_Demo.prefab

Must include:

- SpriteRenderer or placeholder marker
- CircleCollider2D
- Rigidbody2D
- PlayerMovementDemo
- PlayerHealthDemo
- LanternLight2D
- PickupCollector
- WeaponEmitterDemo
- KokuyouControllerDemo

### Enemy_Ombu_Demo.prefab

Must include:

- SpriteRenderer or shadow blob placeholder
- CircleCollider2D
- Rigidbody2D
- EnemyChaseDemo
- EnemyHealthDemo
- InkDeathEffectSpawner

### Enemy_Omburo_Demo.prefab

Must include:

- Larger SpriteRenderer or shadow blob placeholder
- CircleCollider2D
- Rigidbody2D
- EnemyChaseDemo
- EnemyHealthDemo
- InkDeathEffectSpawner

### MemoryFragment.prefab

Must include:

- SpriteRenderer
- Collider2D
- PickupMagnet
- TrailRenderer or curved path effect
- Optional Light2D

### LevelUpPanel.prefab

Must include:

- Dark overlay
- 3 reusable paper cards
- Normal / Good / Rare state
- Icon slot
- title slot
- description slot
- rarity tag

### ResultMemoryPage.prefab

Must include:

- Dawn glow background
- Large paper page
- Rank seal
- Rewards row
- New records row
- CTA buttons

### UltimateLanternButton.prefab

Must include:

- Seal frame
- Lantern icon slot
- Charge ring
- Ready state glow
- Press state

### KokuyouGauge.prefab

Must include:

- Ink-bound frame
- Charge fill
- Ready state
- Active state
- Fatigue state

### KokuyouCutin.prefab

Must include:

- Dark diagonal band
- Character/cutin slot
- Ink slash effect
- Warm lantern light streak
- Text banner area using TextMeshPro

## UI Rules

### Canvas

- Reference resolution: 390 x 844
- Canvas Scaler: Scale With Screen Size
- SafeArea root required
- TextMeshPro required

### Typography

- Generated image text is not used.
- All text is TextMeshPro.
- Title can be placeholder.
- Final project title can change later.

### Buttons

- Paper / seal / lantern motif
- No generic rounded rectangles
- Primary CTA must be obvious
- Press feedback required

### Color

Use controlled palette:

- deep night navy: `#0F1320`
- black ink violet: `#151020`
- paper beige: `#D8C49A`
- paper dark: `#6E5A3B`
- warm amber: `#F4C46A`
- lantern core: `#FFE7AE`
- muted teal: `#6FAE9B`
- dusty rose: `#B96A76`
- dawn peach: `#DFA07A`
- ink black: `#07060B`

## Visual Rules

### Lantern Light

- Warm amber only
- Bloom controlled
- Used around player, CTA, result reward, ready states
- Do not over-glow the whole screen

### Black Ink

Used for:

- enemy death
- screen edges during 黒曜化
- locked/unknown cards
- hard difficulty feeling
- defeat result

Do not overuse.

### Memory Fragments

- Small amber/teal fragments
- Curve toward player
- Small pop on collect
- Must not hide enemies or projectiles

### 黒曜化

Text display:

- `黒曜化`

Rules:

- dangerous but heroic
- not red-eye demon mode
- black ink invasion
- warm lantern core remains
- strong but readable

## What Not To Build

- Full stage system
- Full save data system
- Full collection system
- Full achievement system
- Full weapon roster
- Full enemy roster
- Real store/app build
- Monetization
- All character assets

## Success Criteria

Unity demo is successful if:

- The first 30 seconds feel more premium than Phaser.
- Enemy death and EXP absorb feel significantly better.
- 黒曜化 looks dangerous but still heroic.
- Result Clear feels like a memory page.
- UI remains readable at 390x844.
- Performance feels plausible for mobile.
- Workload looks manageable.

## Failure Criteria

Unity demo is not worth continuing if:

- It looks similar to Phaser but costs much more.
- UI is slower to build.
- Effects are nice but readability worsens.
- The project becomes asset-heavy immediately.
- Mobile performance looks risky.
- 30秒デモでも完成感が出ない。

## Deliverable Report Format

When Unity demo work is done, report:

1. Scenes created
2. Prefabs created
3. Scripts created
4. Assets used
5. What looked better than Phaser
6. What looked worse than Phaser
7. Performance concerns
8. Missing assets
9. Migration recommendation
10. Next steps
