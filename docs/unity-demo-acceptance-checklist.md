# Unity Demo Acceptance Checklist

Unity 30〜60秒Vertical Sliceを見て、移行する価値があるか判断するための採点表。

感覚だけで判断しない。Phaserと比較して、明確に勝っているかを見る。

## Decision Summary

Unityへ進む条件:

```txt
Battle feel: clearly better
EXP pickup: clearly better
Lantern/ink mood: clearly better
UI readability: not worse
Performance: plausible
Production cost: manageable
```

Unityへ進まない条件:

```txt
見た目の差が小さい
作業量が大きすぎる
UIが読みにくい
スマホで重い
素材準備が詰まる
Phaserの方が速く改善できる
```

## Scoring

Score each category 0〜5.

```txt
0 = unusable / worse
1 = poor
2 = slightly worse or unclear
3 = acceptable / equal
4 = better
5 = clearly better / production promising
```

Unity移行候補:

```txt
Total 35+ and no critical fail
```

Unity保留:

```txt
Total 25〜34 or one major uncertainty
```

Phaser継続:

```txt
Total under 25 or critical fail
```

## Category 1: Battle Feel

Score:

- [ ] Enemy hit feels responsive
- [ ] Enemy death feels satisfying
- [ ] Hit stop improves feel without stopping flow
- [ ] Camera impulse is controlled
- [ ] Combat is more alive than Phaser

Fail if:

- combat feels floaty
- effects hide gameplay
- camera shake is annoying
- enemy hit/death feels weaker than Phaser

Score: `/5`

## Category 2: EXP / Memory Fragment Pickup

Score:

- [ ] Fragments are readable
- [ ] Pickup curve feels satisfying
- [ ] Collect pulse feels good
- [ ] Fragment count does not cause noise
- [ ] Clearly better than Phaser

Fail if:

- fragments hide enemies
- movement is hard to see
- performance hitches during pickup
- collect feedback is weak

Score: `/5`

## Category 3: Lantern / Ink Visual Identity

Score:

- [ ] Lantern light feels warm and fragile
- [ ] Black ink feels dangerous but not horror
- [ ] Night/paper/storybook mood remains
- [ ] Not generic fantasy
- [ ] Not neon sci-fi/gacha

Fail if:

- too dark to read
- too glossy/generic
- red demon/horror look
- lantern light loses protagonist warmth

Score: `/5`

## Category 4: UI Feel / Readability

Score:

- [ ] 390x844 readable
- [ ] primary CTA clear
- [ ] LevelUp cards readable
- [ ] Result page readable
- [ ] UI feels paper/handmade, not default Unity

Fail if:

- TextMeshPro too small
- default Unity button look
- baked image text
- Result looks like spreadsheet
- LevelUp cards are cramped

Score: `/5`

## Category 5: 黒曜化 / Ultimate

Score:

- [ ] `黒曜化` text is game-rendered
- [ ] dangerous but heroic
- [ ] warm lantern core remains
- [ ] ink slash/edge effect feels strong
- [ ] cutin is short and readable

Fail if:

- KOKUYOU baked text appears
- red-eye demon look
- too long/blocking
- unreadable full-screen chaos

Score: `/5`

## Category 6: Mobile Performance

Score:

- [ ] no obvious hitch in battle
- [ ] no hitch during enemy death burst
- [ ] no hitch during EXP vacuum
- [ ] no hitch during LevelUp panel
- [ ] no hitch during 黒曜化

Fail if:

- frequent frame drops
- GC spikes during battle
- too many lights/particles
- phone heats quickly in short test

Score: `/5`

## Category 7: Production Cost / Maintainability

Score:

- [ ] Prefabs are reusable
- [ ] Scripts are understandable
- [ ] Data path from Phaser is clear
- [ ] Asset import process is manageable
- [ ] Next PR would be easier, not harder

Fail if:

- demo is full of hacks
- everything is one-off
- no pooling
- no data separation
- asset workflow is unclear

Score: `/5`

## Critical Fail Conditions

Even if score is high, do not migrate if any of these are true:

- Unity demo is less readable than Phaser
- Unity demo requires huge new asset production immediately
- performance is unstable on phone
- UI implementation is significantly slower
- project setup becomes fragile
- core gameplay is not more fun

## Comparison Notes Template

```md
# Unity vs Phaser Comparison

## Phaser baseline commit

## Unity demo commit

## Device tested

## Scores

- Battle feel:
- EXP pickup:
- Lantern/ink identity:
- UI readability:
- 黒曜化/Ultimate:
- Mobile performance:
- Production cost:

Total:

## Unity clearly better at

## Phaser still better at

## Risks

## Decision
Proceed / Hold / Stay Phaser

## Next action
```

## Minimum Demo Requirements

Before scoring, Unity demo must include:

- [ ] Yui placeholder
- [ ] Ombu or Omburo enemy
- [ ] enemy hit/death
- [ ] ink burst
- [ ] EXP/memory fragment pickup curve
- [ ] LevelUp 3-card placeholder
- [ ] Ultimate or 黒曜化 placeholder
- [ ] Result Clear memory page placeholder
- [ ] 390x844 portrait UI

If not included, do not make migration decision yet.

## Decision Rules

### Proceed to Unity Port

Only if:

- total score 35+
- no critical fail
- Unity wins battle feel and EXP pickup
- UI remains readable
- performance is plausible

### Hold / Extend Demo

If:

- score 25〜34
- battle feel good but UI weak
- UI good but performance unclear
- asset workflow unclear

Next action:

- improve one weak area only
- retest

### Stay Phaser For Now

If:

- score under 25
- battle feel not better
- performance poor
- production cost too high

Next action:

- continue Phaser polish
- reuse Unity docs later if needed

## Final Rule

Unity migration is justified only by a better playable feeling, not by a better promise.
