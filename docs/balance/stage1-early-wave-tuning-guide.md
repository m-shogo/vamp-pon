# Stage1 Early Wave Tuning Guide

Stage1の0〜150秒を調整するための判断表。

## Current intent

HPで難しくするのではなく、敵の役割差で面白くする。

- `ink_shadow`: soft kill feel
- `paper_scrap_shadow`: charger pressure
- `lost_direction`: orbit and flank pressure
- `black_capsule`: chaseable reward target
- `black_label_shadow`: first elite milestone

## Target experience

### 0 to 20 sec

Goal: player understands movement and killing feels good.

If boring:

- increase `ink_shadow.spawnRatePerSecond` by 0.1
- increase `ink_shadow.maxAlive` by 3

If too crowded:

- decrease `ink_shadow.spawnRatePerSecond` by 0.1
- decrease `ink_shadow.maxAlive` by 4

### 20 to 45 sec

Goal: charger appears as spice, not punishment.

If charger feels unfair:

- decrease `paper_scrap_shadow.spawnRatePerSecond` by 0.05
- decrease `paper_scrap_shadow.maxAlive` by 2
- later add telegraph visuals before changing HP

If still boring:

- increase `paper_scrap_shadow.spawnRatePerSecond` by 0.04
- keep `maxAlive` low until telegraph is visible

### 45 to 75 sec

Goal: orbit enemy starts changing escape routes.

If escape routes disappear:

- decrease `lost_direction.maxAlive` by 1 or 2
- decrease `lost_direction.spawnRatePerSecond` by 0.03

If orbit enemy is invisible as a gameplay change:

- increase `lost_direction.spawnRatePerSecond` by 0.03
- do not increase HP first

### 75 to 120 sec

Goal: first real mixed wave.

If player is hit too often:

- reduce charger count first
- then reduce orbit count
- do not reduce basic Ombu too much because XP pacing will slow down

If level progression is too slow:

- increase basic Ombu rate
- increase XP drop only after enemy rate is tested

### 120 to 150 sec

Goal: black capsule creates a chase decision.

If black capsule cannot be killed:

- lower `black_capsule.moveSpeed`
- lower coward escape speed in behavior logic
- do not lower HP unless chase already feels fair

If black capsule is ignored:

- add reward visual
- add larger pickup burst
- add audio or pop text later

### 150 sec elite

Goal: first capsule and evolution route becomes visible earlier.

If too early:

- move elite start from 150 to 165

If too late or boring:

- keep 150
- increase reward feedback instead of making elite harder

## Berserk fatigue

Current values:

- fatigue duration: 0.8 sec
- movement multiplier: 0.58

If it feels too punishing:

- duration 0.6
- multiplier 0.7

If it feels invisible:

- keep numbers
- add visual feedback first

## Strong rule

Never solve early game boredom by making enemies tanky.
First adjust:

1. spawn timing
2. enemy role mix
3. telegraph/readability
4. reward feedback
5. only then HP
