# Unity U29 Stage1 Performance Budget

## Scope

This is a draft budget for Stage1 at 390x844 portrait. It is not measured on device and is not a production performance guarantee.

## Target

- target resolution: 390x844 portrait
- target FPS draft: 60fps target / 30fps floor
- target device class draft: mid-range iPhone / Android from recent several years, exact devices not measured
- mobile device verification: not executed

## Runtime Caps

- max active enemies draft: 38, aligned with U26 clear_push max enemies
- max active pickups draft: 48
- max active projectiles draft: 24
- max active hit effects draft: 16
- max active particles draft: 64
- max active audio voices draft: 8 total, 4 low-priority hit / pickup voices
- haptic cooldown draft: 0.08s light tap floor, 1.0s Kokuyou activation floor

## UI Budget

- HUD text updates: timer once per second; HP / EXP only on value change
- LevelUp / Result / StageSelect: static layout build, animated glow isolated from text
- UI rebuild budget: avoid full Canvas rebuild during battle tick

## Memory / Draw Call Budget

- texture memory budget draft: keep Stage1 runtime sprite set under 32 MB before fullscreen art
- draw call budget draft: battle under 45 draw calls in Editor proof, lower after atlas packing
- Sprite Atlas target: characters, enemies, items/icons, UI paper, effects separated by material/use

## GC / Pooling

- GC allocation方針: no per-frame allocations for spawn / hit / pickup routing
- object pooling方針: enemies, pickups, projectiles, hit effects, particles, damage numbers, climax overlays
- cleanup: scene transition, retry, result transition

## Evidence Policy

Screenshots and JSON artifacts are Editor verification only. Profiler screenshots and real device FPS / memory evidence are not measured on device in U29 and must be added in U30 / U31.
