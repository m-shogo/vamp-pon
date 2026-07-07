# Unity U44 Web to Unity Parity Audit

Date: 2026-07-06

## scope

This is U44 Web to Unity Parity Audit / App Quality Design Planning. It is not actual device smoke evidence.

Keep these false:

- `devicePlayableReady=false`
- `mobileMetricsReady=false`
- `audioMixerReady=false`
- `audioLatencyMeasured=false`
- `hapticMeasured=false`
- `rcReady=false`
- `productionApproved=false`

Actual device smoke remains:

- `actualDeviceSmokeResultProvided=false`
- `actualDeviceSmokeResult=NOT_PROVIDED`
- `deviceScreenshot=DEVICE_SCREENSHOT_NOT_PROVIDED`

## summary

Web is a mature Phaser reference with Top, StageSelect, Collection, Stage1 battle, LevelUp, Result, cutin QA, weapon/item/evolution data, save/progress, audio hooks, and many QA/dev scenes. Unity is playable for Stage1 and has proof/runtime slices through U43, but production app quality is still uneven: Top and Collection are not runtime screens, many Web data systems are not connected, several visual targets remain proof screenshots or reference images, and audio/haptic/final mobile metrics are deliberately not READY.

## Web-only

- Top / Title screen with paper-title hierarchy and primary CTA.
- Collection / Album / Memory book with sections: dawn atlas, bestiary, lost item cards, keeper records, word records, achievements.
- Rich Web data for weapons, passives, rare items, evolutions, character knowledge, bonds, collection progress, and stage production.
- Dev/QA screens: visual gallery, cutin QA, weapon FX QA, sprite inspector, background preview.
- Web persistence for profile, collection, bonds, onboarding, achievement view state.
- Web battle systems for multiple weapon types, passives, rare item revival, evolution/fusion, collection settlement, and run logs.

## Unity-only

- iOS Xcode project generation preflight.
- Editor automated pre-device smoke harness with StageSelect pause, battle start resume, Result pause, StageSelect return pause, UI pointer guard checks, and screenshots.
- Unity proof/prefab generations U10-U24, Stage1 loop U25-U27, audio/haptic maps U28-U39, economy readiness U41, U43 runtime hook repair.
- Unity runtime feedback bridge with hook tones and device vibration request counters.

## Missing in Unity

| Category | Web side | Unity side | Current Unity state | Reference | Priority | Pre-device ok | Post-device | Asset | Placeholder ok | Runtime needed | Checker | Risk | Next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Screen | Top / Title | no runtime Top screen | Boot routes to Stage1 flow; no app title shell | `docs/design-targets/generated/top-final.png` | P1 | yes, plan/foundation only | implement screen after smoke if navigation changes | paper title, CTA, 3 cards | yes | yes | yes | navigation regression | U46 non-battle screen pass |
| Screen | Collection | no runtime Collection screen | proof/data references only | `docs/design-targets/final/collection-final.png` | P1 | plan only | implement after smoke | book page, tabs, card frames | yes | yes | yes | save/progress mismatch | U46 Collection pass |
| Runtime Flow | Web Boot->Top->StageSelect->Main | Boot/Stage1 only | StageSelect overlay inside Stage1 | U43 predevice evidence | P0 | no large flow change | after device smoke | none | yes | yes | yes | pause/input regression | keep U43 flow stable |
| StageSelect | multi-stage, growth, collection nav | Stage1 overlay | playable pause-gated placeholder | `docs/design-targets/final/stage-select-final.png` | P0 | light UI tokens ok | visual pass | paper map, stage card | yes | yes | yes | start gate regression | U45 pass |
| Battle HUD | Web HUD/inventory/skill affordances | basic top/bottom placeholders | playable, not final hierarchy | `docs/design-targets/final/battle-final.png`, unity-u22 | P0 | tokens only | visual pass | HUD frame, slots, buttons | yes | yes | yes | tap obstruction | U45 pass |
| LevelUp | 3-card choice with rarity | runtime demo card hook | functionally reachable, not final | `docs/design-targets/final/level-up-final.png`, unity-u23 | P0 | style constants ok | card polish | card frame, rarity flare | yes | yes | yes | touch/readability | U45 pass |
| Result | clear/fail memory page | result overlay | pause-gated overlay, not full reward ledger | `docs/design-targets/final/result-clear-final.png`, unity-u23/u27 | P0 | plan only | full pass | ledger, seal, reward cards | yes | yes | yes | retry/stage return regression | U46 pass |
| Weapon / Item | 8+ weapons, passive, rare, evolved | NightPencil/Ombu basic data | limited runtime weapon model | `src/game/data/weapons.ts` | P1 | no gameplay changes | implement after smoke | icons/effects | yes | yes | yes | balance blast radius | U47 |
| Passive / Rare | passives and dawn_ticket revival | not fully runtime connected | U41 economy proof, not Stage1 runtime complete | `src/game/data/passives.ts`, `rareItems.ts` | P1 | no | after smoke | slot icons | yes | yes | yes | save/balance | U47 |
| Evolution / Fusion | awakening/fusion/upgrade | proof slices exist | not all live in U43 runtime | unity-u24/u25 screenshots | P1 | no | after smoke | evolution panels, VFX | yes | yes | yes | state complexity | U47 |
| Kokuyou / Cutin | Web cutin + berserk systems | proof slices and hook method | not final runtime integrated | `docs/design-targets/generated/kokuyou-cutin-final.png` | P1 | no | after smoke | fullscreen art, ink band | no | yes | yes | visual/perf | U47/U48 |
| Character | Core5 refs, character db | Yui runtime dot candidate | Point filter hook, not final all characters | `public/assets/prototypes/sprite-sheets/core5-original-frames/` | P1 | no | after smoke | Unity-ready sprite sheets | no | yes | yes | asset quality | U48 |
| Enemy | enemy patterns/database | Ombu only | limited actor | `public/assets/prototypes/sprite-sheets/enemies-original/` | P1 | no | after smoke | enemy sheets | no | yes | yes | readability/perf | U48 |
| Stage / Background | stage production db and backgrounds | procedural dark paper | no real stage background connected | `public/assets/prototypes/backgrounds/` | P1 | no | after smoke | stage backgrounds | yes | yes | yes | contrast | U48 |
| Audio | Web AudioManager/BGM, Unity SE maps | hook tones only at U43 runtime | final candidate SE exists but not wired final | unity-u28/u39 | P1 | no finalization | after smoke | mixer, clips, BGM | no | yes | yes | false readiness | U49 |
| Haptic | event map | `Handheld.Vibrate()` hook only | measured=false | unity-u28 haptic map | P1 | no finalization | after smoke | none | yes | yes | yes | device variance | U49 |
| VFX | Web effects, weapon feedback | U5/U8/U10 candidates and proof VFX | subset connected | unity-u22/u24 | P1 | no large change | after smoke | hit, ink, lantern, morning | yes | yes | yes | mobile FPS | U45-U48 |
| Save / Progress | profile/collection/bonds/onboarding | U41 proof/economy readiness | not full runtime save shell | Web persistence files | P1 | no | after smoke | none | yes | yes | yes | data loss | U46/U47 |
| Metrics / QA | Web tests/dev scenes | Unity checkers/screenshots | device metrics false | U35/U43 evidence | P0 | checker only | after smoke | none | yes | yes | yes | false approval | U50 |
| Asset Pipeline | prototype + generated refs | Unity candidates/resources | needs final approval boundary | image production docs | P1 | docs/slots ok | after smoke | many | yes | no | yes | direct image paste | U44/U48 |
| App Store Quality / UX Polish | Web final screen references | partial Unity proofs | not sale-quality yet | U44 rules | P0 | rules/tokens ok | implementation after smoke | UI kit | yes | yes | yes | overbuild pre-smoke | U45-U51 |

## Needs Asset

- TOP title plaque, CTA/button kit, 3-card menu icons.
- StageSelect paper map panel, stage cards, route nodes, seal, locked node.
- Battle HUD frame, weapon/passive/rare slots, virtual stick visual, special/Kokuyou button.
- LevelUp card frame, rarity flare, owned row strip.
- Result ledger, rank seal, reward memory cards, retry/StageSelect buttons.
- Collection book page, tabs, card frames, character portrait frame, enemy album frame.
- Weapon/passive/rare/evolution icons and gameplay VFX.
- Character/enemy Unity-ready sprites and stage backgrounds.
- Final audio mixer/BGM/SE and haptic event design.

## Needs Runtime

- Top screen scene or overlay route.
- Collection scene and progress binding.
- Full inventory/evolution/rare runtime connection.
- Result reward/collection settlement, save progress, retry/stage return polish.
- Kokuyou activation/cutin as live Stage1 runtime feature.
- Final audio and haptic bridge beyond hook tones.

## Later Phase

- Stage2 implementation, Addressables, Cloud Save, store-ready RC, and production approval are outside U44.
- Mobile metrics/FPS/memory tuning is U50 after actual device smoke.
- AudioMixer final and haptic measured approval are U49 after device behavior is known.

## safe foundation added

Added `unity/VampPonUnity/Assets/_Project/Scripts/UI/AppQualityStyleTokens.cs`.

This is a token-only foundation for 390x844 reference resolution, tap target sizes, quiet paper/ink/lantern colors, and generated-image runtime boundary text. It is not connected to runtime behavior and does not change U43 pause/input/audio/haptic hooks.

## Unity settings

The pre-existing unstaged Unity setting diffs were not mixed:

- `unity/VampPonUnity/Assets/DefaultVolumeProfile.asset`
- `unity/VampPonUnity/Assets/UniversalRenderPipelineGlobalSettings.asset`
- `unity/VampPonUnity/Assets/_Project/Settings/U1UniversalRenderPipelineAsset.asset`
- `unity/VampPonUnity/ProjectSettings/ProjectSettings.asset`
- `unity/VampPonUnity/ProjectSettings/ShaderGraphSettings.asset`
