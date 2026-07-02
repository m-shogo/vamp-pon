# Unity U31 Stage1 Mobile QA Handoff

## Goal

Run mobile device QA for the U30 approval blockers and collect evidence that can turn critical gates from `NOT_MEASURED` or `FAIL` into `PASS`.

## Required Evidence

- Device name, OS version, build type, graphics API, and target FPS.
- FPS at opening, first LevelUp, mid wave, Kokuyou / Evolution, result transition, and retry.
- Memory, texture memory, thermal state, draw calls, Canvas rebuilds, and GC allocation.
- Audio latency, clipping, voice cap behavior, and mixer status.
- Haptic intensity, cooldown behavior, and platform fallback behavior.
- Save persistence across app restart.
- Sprite Atlas packing proof and visual comparison after packing.

## Blocker Resolution Targets

- Mobile performance gate: measured and passing on target devices.
- Sprite Atlas gate: production `.spriteatlas` packing complete with no visual regression.

## Keep Out Of Scope

- Addressables unless explicitly planned.
- Cloud Save unless explicitly planned.
- Runtime use of generated final screenshots or design-target PNGs.
