# Unity U36 Sprite Atlas Target Inventory

| path | category | current status | atlas target | reason | risk | next action |
| --- | --- | --- | --- | --- | --- | --- |
| `Assets/_Project/Resources/U5Candidates/Battle/u5-yui-battle-candidate.png` | characters | Unity runtime candidate | yes | Stage1 player proof candidate | final character art not approved | replace with final Unity-finished sprite later |
| `Assets/_Project/Resources/U5Candidates/Battle/u5-ombu-battle-candidate.png` | enemies | Unity runtime candidate | yes | Stage1 enemy proof candidate | readability still needs device QA | verify after mobile metrics |
| `Assets/_Project/Resources/U5Candidates/UI/u5-icon-frame.png` | weapon / passive icons | icon/UI candidate | yes | shared icon frame candidate | icon set not final | review in U34 RC checklist |
| `Assets/_Project/Resources/U5Candidates/VFX/u5-exp-fragment.png` | pickup sprites | pickup candidate | yes | EXP pickup proof candidate | final pickup art pending | verify at gameplay size |
| `Assets/_Project/Resources/U8Candidates/UI/`, `U8Refined/UI/`, `U10Candidates/UI/` | UI paper parts | reviewed candidates / needs review | yes | paper UI parts for StageSelect / Result | final UI polish pending | compare 390x844 evidence |
| `Assets/_Project/Resources/U5Candidates/VFX/`, `U8Candidates/VFX/`, `U8Refined/VFX/`, `U10Candidates/VFX/` | effects | effect candidates | yes | pickup / rare / ink effect candidates | final climax effects pending | device performance check |
| `public/assets/prototypes/` | prototype reference | reference only | no | Web/prototype baseline, not Unity-finished | accidental runtime use | keep excluded |
| `docs/design-targets/generated/` | docsGeneratedOnly | QA evidence only | no | screenshots/evidence only | must never be runtime referenced | checker blocks |
| generated final PNG / screenshots / completed screen images | docsGeneratedOnly | blocked from runtime | no | not runtime sprite sources | paste risk | keep excluded |
| `Assets/_Project/Resources/U8Candidates/FullscreenArt/`, `U8Refined/FullscreenArt/`, `U10Candidates/FullscreenArt/` | full-screen art reference | cut-in/review art | no | fullscreen art is not Stage1 runtime atlas part in U36 | atlas bloat / boundary blur | handle in future collection/cutin pass |
| `Assets/_Project/Audio/U28DraftSe/` | draft SE | audio only | no | non-sprite | final SE not approved | replace later |

## Categories Covered

characters, enemies, weapon / passive icons, pickup sprites, UI paper parts, HUD / LevelUp / Result / StageSelect parts, Kokuyou / Rare / Evolution effect parts are represented by Unity project candidates where available.
