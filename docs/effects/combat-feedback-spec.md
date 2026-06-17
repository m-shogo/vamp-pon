# Combat Feedback Spec

This spec defines the next visual feedback pass.

## Charger enemy

Purpose: make dash damage feel fair.

States:

1. Warn
   - Duration: about 1.15 sec
   - Enemy slows down
   - Visual: small pulse, dark purple highlight, slight scale breathing

2. Dash
   - Duration: about 0.6 sec
   - Enemy moves fast
   - Visual: stretch, small afterimage, sharper shadow

3. Recovery
   - Duration: about 1.45 sec
   - Enemy almost stops
   - Visual: shrink back, low opacity pulse

Do first:

- Add readable warning before adding more damage or speed
- Keep sprite cute/dark, not horror

Do not:

- Use bright red full-screen warning
- Make the enemy tanky
- Hide the warning under background detail

## Berserk

Purpose: feel powerful but slightly dangerous.

Current numbers:

- Damage multiplier: 1.5
- Duration: 8 sec
- Fatigue duration: 0.8 sec
- Fatigue move multiplier: 0.58

Active visual:

- Black flame around player
- Small ink particles moving outward
- HUD portrait/gauge pulse
- Slight screen vignette, low alpha

Fatigue visual:

- Flame collapses inward
- Player briefly dims
- HUD gauge dulls
- No hard stun

Do not:

- Mix berserk with ultimate gauge
- Make fatigue longer before playtest
- Block player input

## Black capsule

Purpose: make a chase target with reward expectation.

Behavior:

- Runs away at close range
- Circles at medium range
- Slows when far

Defeat feedback:

- Larger fragment burst than normal enemy
- Small pop effect near defeat point
- Optional short sparkle, but keep paper/ink tone

Do not:

- Make it mandatory for progress
- Make it faster before reward feedback exists
- Spawn too many before 150 sec

## Priority order

1. Charger warning
2. Berserk active/fatigue visual
3. Black capsule reward pop
4. Wave numeric tuning
