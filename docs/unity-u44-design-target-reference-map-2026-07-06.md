# Unity U44 Design Target Reference Map

Date: 2026-07-06

## rule

Generated screen images are visual references, not runtime assets. Text-baked screen images must not be pasted into Unity runtime. Use them to recreate UI with uGUI/TMP, sliced panels, approved transparent assets, and runtime data.

## map

| Reference path | Intended screen | Current Unity usage | Runtime connected | Approved as final asset | Safe as visual reference | Needs new asset | Needs Unity UI recreation | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `docs/design-targets/generated/top-final.png` | TOP / Title | not connected | false | false | true | true | true | Current TOP target; recreate as Unity screen, do not paste image. |
| `docs/design-targets/final/top-final.png` | TOP / Title | not connected | false | false | true | true | true | Final copy reference. |
| `docs/design-targets/final/stage-select-final.png` | StageSelect | partial through proof/runtime overlay | false | false | true | true | true | U43 overlay is functional, not final. |
| `docs/design-targets/final/battle-final.png` | Battle HUD | partial through U22/U43 | false | false | true | true | true | Must preserve touch/visibility. |
| `docs/design-targets/final/level-up-final.png` | LevelUp | partial demo hook | false | false | true | true | true | U45 card pass. |
| `docs/design-targets/final/result-clear-final.png` | Result | partial overlay/proof prefabs | false | false | true | true | true | U46 ledger pass. |
| `docs/design-targets/final/collection-final.png` | Collection | not connected | false | false | true | true | true | U46 new runtime screen. |
| `docs/design-targets/generated/kokuyou-cutin-final.png` | 黒耀化 cutin / collection art | not final runtime connected | false | false | true | true | true | Current full-screen art reference. |
| `docs/design-targets/generated/non-battle-final-polish-ui-kit-2026-06-28.png` | UI kit | not connected | false | false | true | true | true | Component reference only. |
| `docs/design-targets/generated/runtime-paper-ui-kit-source-2026-06-29.png` | runtime paper UI kit | not connected | false | false | true | true | true | Use for sliced UI request. |
| `docs/design-targets/generated/result-pro-layout-helper-390x844.png` | Result | not connected | false | false | true | true | true | Layout helper only. |
| `docs/design-targets/generated/collection-pro-layout-helper-390x844.png` | Collection | not connected | false | false | true | true | true | Layout helper only. |
| `docs/design-targets/generated/non-top-pro-component-helper-390x844-2026-06-29.png` | StageSelect/Collection/HUD | not connected | false | false | true | true | true | Component composition reference. |
| `docs/design-targets/generated/unity-u22/screenshots/u22-battle-hud-polish-390x844.png` | Battle HUD | evidence only | false | false | true | true | true | Useful for U45 HUD polish. |
| `docs/design-targets/generated/unity-u23/screenshots/u23-stageselect-polish-390x844.png` | StageSelect | evidence only | false | false | true | true | true | U45 screen target evidence. |
| `docs/design-targets/generated/unity-u23/screenshots/u23-levelup-polish-390x844.png` | LevelUp | evidence only | false | false | true | true | true | U45 card target evidence. |
| `docs/design-targets/generated/unity-u23/screenshots/u23-result-clear-polish-390x844.png` | Result | evidence only | false | false | true | true | true | U46 Result target evidence. |
| `docs/design-targets/generated/unity-u24/screenshots/u24-kokuyou-activation-cutin-390x844.png` | Kokuyou cutin | evidence only | false | false | true | true | true | U47/U48 reference. |
| `docs/design-targets/generated/unity-u28/audio-event-map.json` | Audio | registry reference | false | false | true | false | false | Not final AudioMixer evidence. |
| `docs/design-targets/generated/unity-u28/haptic-event-map.json` | Haptic | registry reference | false | false | true | false | false | Not measured haptic evidence. |
| `docs/design-targets/generated/unity-u43/predevice-smoke/01-stage-select-paused.png` | StageSelect runtime smoke | evidence only | false | false | true | false | true | Confirms pause gate, not final art. |
| `docs/design-targets/generated/unity-u43/predevice-smoke/02-battle-started.png` | Battle runtime smoke | evidence only | false | false | true | false | true | Confirms playable start, not final art. |
| `docs/design-targets/generated/unity-u43/predevice-smoke/03-result-paused.png` | Result runtime smoke | evidence only | false | false | true | false | true | Confirms pause gate, not final art. |

## reflected

Already reflected in Unity at least as proof or partial runtime: StageSelect, Battle HUD, LevelUp, Result, Kokuyou proof, audio/haptic event maps, U43 hook/pause smoke.

## not reflected

Not yet reflected as final runtime screens: Top, Collection, final item/evolution inventory surfaces, final stage backgrounds, full character/enemy sheets, final audio/haptic implementation.
