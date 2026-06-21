# Stage1 Fun Pass Acceptance

## Goal

Stage1 should feel better before adding more assets.

The target is not high difficulty.
The target is early clarity, role variety, and reward expectation.

## Must pass

### Build and tests

- TypeScript build passes
- Vitest passes
- No new asset path 404 spam

### First 150 seconds

- Player sees at least three enemy roles
- Basic Ombu dies quickly
- Charger enemy is avoidable
- Orbit enemy changes movement but does not fully trap the player
- Black capsule can be chased
- First elite appears as a milestone

### Readability

- Player remains readable over the new background
- Enemy direction still works with front and left sprite sheets
- Right-facing enemies use left-facing sheet flip
- HUD remains readable during level-up and combat

### Berserk

- Berserk charge increases from damage only
- Ultimate gauge is not reset by berserk
- Berserk active damage bonus works
- Berserk fatigue slowdown is visible but not a stun

## Should improve

- Level 2 should arrive earlier than before if the player kills normally
- The path to Level 5 should feel less empty
- First capsule/evolution expectation should appear earlier
- The player should have at least one moment of chasing a reward target

## Must not regress

- Do not make Stage1 hard by simply increasing HP
- Do not add unreadable text
- Do not remove fallback graphics
- Do not break gallery or preview routes
- Do not change image dimensions or overwrite source art

## If playtest fails

If too hard:

1. Reduce charger count
2. Reduce orbit count
3. Move first elite later
4. Only then reduce enemy damage

If too boring:

1. Increase basic Ombu rate
2. Add reward feedback
3. Add charger visuals
4. Only then add more enemy count

If unreadable:

1. Fix contrast and effect alpha
2. Reduce background overlay noise
3. Reduce simultaneous special enemies
4. Do not solve with bigger text only
