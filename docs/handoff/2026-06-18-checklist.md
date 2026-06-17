# 2026-06-18 Checklist

## Scope

Only work on the Vamp Pon repository.

## Already changed

- Background fallback cleanup
- New enemy behaviors: charger, orbit chase, coward
- Enemy roles renamed toward Ombu and Ombro
- Stage 1 early waves retuned for the first 150 seconds
- Berserk fatigue state added
- Berserk fatigue movement slowdown added
- Enemy behavior tests updated
- Berserk tests updated
- Fun pass note added at docs/150-survivors-like-fun-pass.md

## Verify first

- Install dependencies if needed
- Run tests
- Run production build
- Check TypeScript errors

## Manual playtest

Play Stage 1 from 0 to 150 seconds on a mobile sized viewport.

Check:

- Basic Ombu feels soft and satisfying
- Charger enemy is readable and not unfair
- Orbit enemy does not close all escape routes
- Coward capsule can still be chased and defeated
- First elite at 150 seconds is not too early
- Level 2 is not too slow
- The road to level 5 feels less empty

## Next implementation candidates

1. Add charger telegraph visuals
2. Add berserk black flame and HUD flash
3. Add berserk fatigue visual feedback
4. Add reward effect for black capsule defeat
5. Tune Stage 1 waves after playtest

## Do not

- Do not make enemies harder only by increasing HP
- Do not add dense unreadable UI
- Do not mix berserk gauge with ultimate gauge
- Do not overwrite image assets blindly
- Do not touch other repositories
