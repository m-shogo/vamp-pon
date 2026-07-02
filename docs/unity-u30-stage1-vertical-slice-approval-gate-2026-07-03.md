# Unity U30 Stage1 Vertical Slice Approval Gate

## Gate Definition

This gate judges whether the Stage1 vertical slice can be production approved. U30 does not force a pass. A gate with `FAIL` or `NOT_MEASURED` on a critical item keeps production approval false.

## Current Gate Results

| Gate | Status | Critical | Evidence | Note |
| --- | --- | --- | --- | --- |
| Stage1 runtime loop | PASS | no | U25 | StageSelect to Battle to Result flow exists. |
| Battle feel | CAUTION | no | U22-U25 | Editor proof exists; final mobile feel is not approved. |
| LevelUp choice | PASS | no | U25/U26 | First and multi-choice flow exist. |
| Rare / evolution / Kokuyou moments | CAUTION | no | U24-U26 | Moments exist; final art and device feel remain. |
| Result reward unlock | CAUTION | no | U27 | Draft reward economy and unlock proof exist. |
| StageSelect retry | PASS | no | U25/U27 | Retry and cleared-state proof exist. |
| Save safety | CAUTION | no | U27 | PlayerPrefs proof exists; Cloud Save is not introduced. |
| SE and haptic feel | CAUTION | no | U28 | Draft routing exists; mobile haptic behavior is unmeasured. |
| Mobile FPS performance | NOT_MEASURED | yes | U29 | Real device FPS, memory, thermal, draw calls, and GC are not measured. |
| Sprite Atlas packing | FAIL | yes | U29/U30 | Production `.spriteatlas` packing evidence is incomplete. |
| Visual consistency | CAUTION | no | U22-U29 | Editor visual proof exists; final asset replacement remains. |
| 390x844 readability | PASS | no | U25-U30 | Editor screenshots remain readable. |
| Production asset boundary | PASS | no | U30 | Generated proof images stay outside Unity runtime. |
| Generated final image safety | PASS | no | U30 | Generated final PNGs are not pasted as runtime screens. |
| Regression suite | PASS | no | U22-U30 | Required regression checks are defined. |

## Production Approval Rule

Production approval is true only when all critical gates pass and no gate is unmeasured. The current state does not satisfy that rule.

## Current Approval State

- `productionApproved`: false
- `internalPreviewReady`: true
- `mobileQaReady`: true
- `assetReplacementReady`: false
- `performanceQaReady`: true

## Critical Blockers

- Mobile device performance evidence is not measured.
- Production Sprite Atlas packing is incomplete.

## Cautions

- Final SE choice, AudioMixer behavior, and audio latency are not final approved.
- Mobile haptic intensity and cooldown behavior are not device verified.
- Reward economy, unlock pacing, and save persistence are still draft proof.
- Final runtime asset replacement remains.
