# 166. Fail-Forward Implementation Brief

This is an implementation-oriented summary for the fail-forward system.

Do not implement all of this at once.
Use it to decide the first safe slice.

## First safe slice

Implement only:

1. memory dust currency
2. one lantern care upgrade
3. one mapbook upgrade
4. enemy seen progress
5. result screen next-goal hint

## Suggested data model

```ts
type PermanentProgress = {
  memoryDust: number;
  lanternCare: Record<string, number>;
  mapbook: Record<string, number>;
  enemySeen: Record<string, number>;
  itemSeen: Record<string, number>;
  bestRun: {
    survivalSec: number;
    fragments: number;
    enemiesDefeated: number;
  };
};
```

## Run result inputs

Collect these after every run:

- survived seconds
- fragments collected
- enemies defeated
- enemy families seen
- items touched
- vessel traces touched
- stage id
- whether clear happened

## Reward formula concept

Keep it simple.

```txt
base memory dust = floor(survival seconds / 20)
+ fragments collected small bonus
+ new enemy seen bonus
+ near-clear bonus
```

Never require clear for basic memory dust.

## Upgrade examples for first slice

### Polished Glass

- cost: memory dust
- effect: lantern glow readability or small flame effect
- cap: 5
- story: the lantern glass remembers warmth

### Folded Corner

- cost: memory dust
- effect: result screen gives a clearer next goal
- cap: 3
- story: the mapbook keeps a crease from failed nights

### Ink Sample Card

- progress: see enemy family several times
- effect: unlock bestiary note
- cap: per enemy family
- story: the shadow's outline becomes easier to read

## Save rule

Save only permanent progress.
Do not save temporary run build as permanent.

Permanent:

- memory dust
- upgrade levels
- seen entries
- unlocked hints
- best run records

Temporary:

- current level
- run weapons
- temporary stat boosts
- unconfirmed fragments

## Balance guard

- clear should still matter
- failure should still feel useful
- early upgrades should help but not trivialize
- raw damage upgrades need caps
- comfort and discovery rewards can be more generous

## UX guard

The result screen must show:

- what improved
- what is next
- why retrying matters

If the player cannot understand what they gained in 5 seconds, the system is too complex.

## Future expansions

After first slice:

- character vessel trees
- item album rewards
- enemy family weakness notes
- relationship thread progress
- stage route marks
- hidden evolution hints
- high-order lineage traces
