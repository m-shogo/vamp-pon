# Unity Game Feel Cookbook

Vamp Pon / Lantern Ledger をUnityで触って気持ちいいアプリにするための演出レシピ。

目的は、派手にすることではなく、プレイヤーが「押したい」「集めたい」「もう1回やりたい」と感じる小さな反応を積み上げること。

## Game Feel Philosophy

このゲームの気持ちよさは、爆発や派手な魔法ではなく、次の組み合わせで作る。

- 小さいランタン光
- 黒インクのにじみ
- 記憶欠片の吸引
- 紙UIの押し心地
- 優しいが締まったSE
- 短いhit stop
- 控えめなcamera impulse
- 朝焼けの報酬感

## Feedback Layers

1つの行動に、以下から2〜4個だけ選ぶ。

- visual pop
- light pulse
- particle
- sound
- camera impulse
- hit stop
- UI tween
- number/text feedback

全部乗せしない。

## Timing Tokens

基本時間:

```txt
micro pop: 0.06s - 0.10s
button press: 0.08s - 0.12s
card reveal stagger: 0.06s - 0.09s between cards
hit stop: 0.035s - 0.075s
enemy death pop: 0.12s - 0.18s
EXP magnet travel: 0.18s - 0.35s
levelup panel in: 0.22s - 0.35s
result page in: 0.35s - 0.55s
rank seal stamp: 0.18s - 0.28s
黒曜化 cutin: 0.45s - 0.75s
```

Rules:

- battle feedbackは短く。
- menu/resultは少し長くてもよい。
- 黒曜化は強くても、長すぎない。

## Enemy Hit Recipe

Purpose:

敵を攻撃している手応え。

Use:

- sprite flash: 0.04s
- tiny knock pulse: 1.04 scale then back
- small amber/ink particle: 3〜6 particles
- hit stop: only for heavier hits
- SE: short, soft, not metallic

Avoid:

- every hit camera shake
- huge white flash
- particles that hide enemy

Unity implementation:

```txt
EnemyHealth.OnDamaged
  -> EnemyHitPresenter.Play(position, damageType)
  -> SpriteFlash
  -> SmallParticleBurst
  -> optional HitStop.Request(0.035)
```

## Enemy Death Recipe

Purpose:

敵を倒した気持ちよさ + 記憶欠片への期待。

Use:

- black ink burst outward
- shadow body dissolves inward
- 1 small warm memory pop at center
- EXP fragments jump slightly then settle/magnet
- small camera impulse for elite/boss only

Normal enemy:

```txt
ink particles: 8〜16
memory particles: 2〜4
camera impulse: none or very tiny
hit stop: none or 0.035s
```

Elite enemy:

```txt
ink particles: 18〜32
memory particles: 5〜8
camera impulse: small
hit stop: 0.05s
```

Boss:

```txt
ink wave
screen edge pulse
fragment shower
camera impulse medium
hit stop 0.075s
```

Avoid:

- explosion fireball
- gore
- long dissolve that blocks next action

## EXP / Memory Fragment Pickup Recipe

Purpose:

集める気持ちよさ。

Memory fragments should feel like small restored memories, not coins.

Use:

- amber or muted teal small fragments
- short initial pop arc
- magnet curve to player
- trail or afterimage
- small pitch-up collect SE
- tiny lantern pulse on player

Curve:

```txt
spawn -> slight random pop -> delay 0.08s -> bezier/magnet -> player core -> vanish pop
```

Important:

- fragment travel should not hide enemies.
- large pickups can move slower than tiny pickups.
- collection pulse should be visible but not noisy.

## LevelUp Recipe

Purpose:

一瞬のご褒美 + 選ぶ楽しさ。

Sequence:

```txt
1. battle freezes/dims
2. title/prompt fades in
3. card 1 slide/pop
4. card 2 slide/pop
5. card 3 slide/pop
6. rare card seal glows if present
7. selectable state enabled
```

Timing:

```txt
background dim: 0.12s
prompt in: 0.14s
card stagger: 0.07s
card pop: 0.18s
rare glow: slow pulse 0.8s loop, low alpha
```

Card press:

```txt
selected card scale 1.03
other cards dim to 0.45
small paper rustle SE
warm confirm flash
panel out 0.15s
```

Avoid:

- huge rarity explosion
- neon glow
- long lockout after selection

## Result Clear Recipe

Purpose:

精算ではなく、夜を越えて記憶ページが増えた感覚。

Sequence:

```txt
1. battle fades under dark ink
2. dawn peach glow rises behind page
3. notebook page slides up / opens
4. CLEAR text appears via game text
5. rank seal stamps
6. rewards reveal one by one
7. new records row lights softly
8. Growth CTA lantern pulse starts
```

Timing:

```txt
background fade: 0.25s
page in: 0.35s
rank seal stamp: 0.22s
reward stagger: 0.06s
CTA pulse: slow 1.2s loop
```

Micro details:

- rank seal should feel stamped, not spawned.
- reward cards can bob 1〜2px.
- CTA should be the warmest object.

Avoid:

- spreadsheet table
- all stats appearing at once
- too many flashing rewards

## Result Defeat Recipe

Purpose:

負けても「もう一度 / 成長へ」と思わせる。

Use:

- darker paper page
- ink edge stronger
- warm ember still present
- Growth CTA still visible
- retry secondary

Avoid:

- punishment feeling
- scary horror
- dead black screen

## Ultimate Recipe

Purpose:

押した瞬間の強さ。

Sequence:

```txt
1. button press compress
2. lantern seal cracks/glows
3. short warm flash from player
4. projectiles/effects trigger
5. tiny camera impulse
6. button enters cooldown/charge state
```

Timing:

```txt
button compress: 0.08s
flash: 0.12s
camera impulse: 0.05s
cooldown state: immediate
```

Avoid:

- cutin every small attack
- huge white flash
- blocking too long

## 黒曜化 Recipe

Purpose:

危険だが主人公。黒インクに侵されても、ランタンcoreが残る。

Sequence:

```txt
1. screen edge black ink creeps in
2. player lantern core brightens
3. diagonal ink slash crosses screen
4. short cutin band appears
5. text 黒曜化 appears via TextMeshPro/game text
6. screen returns to battle with boosted state
7. after effect fades into fatigue/slow state if applicable
```

Visual rules:

- no red-eye demon mode
- no KOKUYOU text
- warm lantern remains center
- ink should frame action, not hide it

Timing:

```txt
edge ink in: 0.18s
cutin band: 0.45s - 0.75s
activation pulse: 0.12s
return to gameplay: fast
```

Sound:

- low ink swell
- lantern chime layered under it
- short activation hit

Avoid:

- long anime super move every time
- full screen unreadable ink
- horror scream

## Button Press Recipe

Purpose:

UIが押したくなる。

Paper button press:

```txt
scale: 1.0 -> 0.97 -> 1.02 -> 1.0
shadow y offset decreases on press
lantern edge glow briefly increases
paper rustle/click SE
```

Primary CTA:

- slow lantern pulse
- stronger shadow
- warmer border

Secondary CTA:

- no constant pulse
- small press feedback only

Disabled:

- desaturated paper
- ink stain overlay
- no glow

## Card Reveal Recipe

Use for:

- LevelUp
- Rewards
- Collection discoveries

Sequence:

```txt
card alpha 0 -> 1
card y +10 -> y
scale 0.98 -> 1.02 -> 1.0
small paper dust particle optional
```

Avoid:

- rotate too much
- bounce like toy UI
- long cascade

## Collection New Memory Recipe

Purpose:

新しく戻った記憶だけ気づける。

Use:

- small lantern dot
- one-time warm pulse
- card edge light sweep
- no red badge

When seen:

- lantern dot fades
- card remains softly lit if completed

Avoid:

- notification spam
- generic red exclamation

## Stage Start Recipe

Purpose:

地図帳から夜路に入る感じ。

Sequence:

```txt
stage card expands slightly
route line glows from start to target
paper edge darkens
screen fades into battle
small lantern dot travels along route
```

Timing:

```txt
route glow: 0.35s
transition: 0.25s
```

Avoid:

- long loading animation
- big fantasy portal

## Audio Pairing Notes

Every feedback should have sound in final app, but 30秒デモ can use placeholders.

Sound style:

- paper rustle
- soft chime
- muted wood tap
- ink drop
- warm bell
- low soft swell

Avoid:

- metallic sword clang everywhere
- casino reward jingles
- horror stingers
- sci-fi beeps

## Priority Implementation Order

For Unity demo:

1. EXP pickup curve + collect pulse
2. Enemy death ink burst
3. Button/card press feedback
4. LevelUp card reveal
5. Result rank seal stamp
6. 黒曜化 cutin/edge ink
7. Stage route glow

If time is short, do 1〜5 first.

## Final Rule

Good game feel is not one huge effect.

It is a chain of small, readable, consistent reactions.
