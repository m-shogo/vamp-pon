# Unity U45 Generated Candidate Asset QA

Date: 2026-07-06

## summary

12 candidate UI assets were created for U45 and copied to Unity runtime candidate storage. They are not approved as final production assets.

Generated paths:

- `docs/design-targets/generated/unity-u45/assets/`
- `unity/VampPonUnity/Assets/_Project/Resources/U45Candidates/UI/`

## QA policy

Minimum candidate checks:

- no readable text
- no logo
- no character/person
- transparent background where required
- room for Unity TMP text
- paper UI / black ink / lantern light direction
- not final approval

## asset QA

| assetId | size | safeForRuntimeCandidate | approvedAsFinal | fallback |
| --- | --- | --- | --- | --- |
| `u45-stage-select-map-panel` | 768x1024 | true | false | Unity panel color |
| `u45-stage-card-frame` | 512x256 | true | false | Unity panel color |
| `u45-battle-hud-top-frame` | 768x160 | true | false | HUD plate color |
| `u45-battle-inventory-slot-frame` | 128x128 | true | false | slot Image color |
| `u45-virtual-stick-ring` | 256x256 | true | false | procedural ring area |
| `u45-virtual-stick-knob` | 128x128 | true | false | procedural knob |
| `u45-levelup-card-common` | 512x720 | true | false | U5 paper panel |
| `u45-levelup-card-rare` | 512x720 | true | false | U5 paper panel + glow |
| `u45-levelup-card-evolution` | 512x720 | true | false | U5 paper panel + awakening glow |
| `u45-small-lantern-accent` | 128x128 | true | false | small color accent |
| `u45-black-ink-divider` | 512x64 | true | false | plain divider line |
| `u45-paper-button-frame` | 384x128 | true | false | U5 paper panel |

## issues

- Assets are procedurally generated candidate UI pieces and still need art direction review.
- Editor screenshots are pre-device evidence only.
- Final production approval requires device review, alpha/fringe review, and comparison against the current design targets.

See machine-readable QA:

```txt
docs/design-targets/generated/unity-u45/generated-asset-qa.json
```
