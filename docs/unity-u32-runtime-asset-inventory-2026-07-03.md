# Unity U32 Runtime Asset Inventory

## Policy

Runtime assets, prototype references, generated docs evidence, generated final PNGs, draft SE, and future production assets are separated. `docs/design-targets/generated` is QA evidence only and is blocked from runtime.

| Asset | Path | Current usage | Runtime reference | Production status | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- |
| player sprites | `public/assets/prototypes/sprite-sheets/core5-original-frames/` | reference baseline | no | runtimePrototype | web/prototype source, not Unity-finished | replace with Unity-finished character sprites |
| enemy sprites | `public/assets/prototypes/sprite-sheets/enemies-original/` | reference baseline | no | runtimePrototype | readability needs Unity QA | finish or replace for Unity runtime |
| weapon/projectile sprites | `public/assets/prototypes/sprite-sheets/weapon/` | reference candidates | no | productionCandidate | import scale and alpha need review | register through replacement hook |
| item/passive/rare icons | `public/assets/prototypes/sprite-sheets/passive/`, `rare/` | icon reference | no | productionCandidate | icon consistency not final | review with LevelUp and reward cards |
| pickup sprites | Unity procedural/draft proof visuals | runtime proof | yes | runtimeApprovedDraft | not final art | replace by asset key later |
| UI paper parts | `unity/VampPonUnity/Assets/_Project/Resources/U8Refined/UI/` | UI candidates | yes | needsReview | candidate resources need final review | atlas only after review |
| HUD parts | Unity UI presenters | runtime HUD proof | yes | runtimeApprovedDraft | proof shapes are not final art | keep readable and replace gradually |
| LevelUp card parts | Unity UI presenters | LevelUp proof | yes | runtimeApprovedDraft | cards/icons not final | replace via key |
| Result ledger / stamp / seal | Unity UI presenters | Result/reward proof | yes | runtimeApprovedDraft | economy and polish not final | review after U33 |
| StageSelect route / lantern | Unity UI presenters | StageSelect proof | yes | runtimeApprovedDraft | map art not final | replace route/lantern art by key |
| Kokuyou / Rare / Evolution effects | Unity proof effects and U24/U25 evidence | climax proof | yes | needsReplacement | final effect/cut-in art pending | replace with Unity-finished effects |
| draft SE | `unity/VampPonUnity/Assets/_Project/Audio/U28DraftSe/` | U28 routing proof | yes | needsReview | draft-placeholder-not-final | replace with final SE later |
| haptic definitions | `unity/VampPonUnity/Assets/_Project/Scripts/U28/FeelIntegration/` | haptic routing | yes | runtimeApprovedDraft | device behavior not measured | verify on device |
| generated screenshots / design references | `docs/design-targets/generated/` | QA evidence only | no | blockedFromRuntime | must never be runtime referenced | keep checker blocking runtime references |

## Blocked From Runtime

- `docs/design-targets/generated/`
- generated final PNGs
- completed screen images
- review screenshots

## Needs Replacement

- player sprites
- enemy sprites
- Kokuyou / Rare / Evolution final effects
- draft SE

## Needs Review

- UI paper candidates
- item/passive/rare icon consistency
- texture import settings
- Sprite Atlas production packing
