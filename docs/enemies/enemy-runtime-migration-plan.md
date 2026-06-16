# Enemy Runtime Migration Plan

## Status

- design catalog: complete
- current runtime: legacy six-enemy P1 implementation
- migration policy: do not break the playable loop while adding the 48-enemy architecture

## Current legacy runtime

The current `src/game/data/enemies.ts` and `src/game/data/waves.ts` use:

```txt
ink_shadow
paper_scrap_shadow
lost_direction
black_capsule
night_haze
black_label_shadow
```

Only `paper_scrap_shadow`, `lost_direction` and `night_haze` remain direct members of the new 48-cell catalog.

## ID migration

| Legacy ID | New treatment |
|---|---|
| `ink_shadow` | replace with `omb_fragment_blue` |
| `paper_scrap_shadow` | retain ID |
| `lost_direction` | retain ID; Stage 4 catalog is canonical |
| `night_haze` | retain ID |
| `black_capsule` | legacy runtime-only; remove after Stage-wave migration |
| `black_label_shadow` | legacy elite; replace with the Stage-appropriate midboss pipeline |

Add `ombro_fragment_blue` and `eraser_bug` before converting the rest of Stage 1.

## Type architecture

The current closed unions for five behaviors and six visual kinds are too small for the catalog.

Required direction:

```txt
EnemyDefinition
  identity
  stats
  movementProfileId
  attackProfileId
  telegraphProfileId
  visualAssetId
  drops
  tags

BossDefinition
  base identity
  phase definitions
  timer policy
  normal-spawn policy
  transition conditions
```

Avoid adding 48 branches to one switch. Use profile registries for movement, attacks and telegraphs.

## Safe migration batches

### Batch 1: common family

- add `omb_fragment_blue`
- add `ombro_fragment_blue`
- implement soft chase and heavy reach
- point the opening wave to Omb
- keep old IDs as aliases only during migration

### Batch 2: Stage 1

- retain `paper_scrap_shadow`
- retain `night_haze`
- add `eraser_bug`
- add `paper_grave_devourer`
- add `bleed_mother`
- validate a complete Stage 1 wave before adding Stage 2

### Batch 3: Stage framework

- introduce Stage-specific enemy pools
- introduce Stage palette selection
- separate Stage elapsed time from real combat elapsed time
- add midboss scheduling

### Batch 4: boss framework

When a major boss starts:

```txt
stageTimerPaused = true
normalWavePaused = true
normalSpawnPaused = true
timeDifficultyPaused = true
bossTimeContinues = true
playerSimulationContinues = true
```

After defeat and result transition, resume the paused systems. Boss time never increments survival time.

### Batch 5: Stages 2–5

Add one complete Stage at a time. Do not register all IDs before their movement, attack and telegraph profiles exist.

## Runtime acceptance criteria

- every runtime enemy ID exists in the design catalog or an explicit temporary alias list
- no enemy uses a placeholder visual kind after its native source is promoted
- every damaging action has a readable telegraph
- boss timer pause is covered by tests
- Stage waves reference only enemies assigned to that Stage
- old `black_capsule` and `black_label_shadow` are removed only after replacement content is playable
