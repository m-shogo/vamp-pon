# Unity U26 Stage1 first playable balance review

## Summary

U26 adds a first playable balance draft for Stage1 on top of the U25 runtime loop. The implementation is intentionally production-adjacent and keeps productionApproved=0.

## Verified areas

- U25 loop remains the integration premise.
- First 30 seconds, wave intensity, XP cadence, drop / pickup, weapon / passive, Kokuyou, evolution, clear / defeat, and result draft rules are represented in runtime code.
- Seven 390 x 844 screenshots were generated for milestone review.
- No Addressables setup was introduced.
- No generated final PNG was pasted into runtime UI.

## Screenshots

- `docs/design-targets/generated/unity-u26/screenshots/stage1-0000-opening-balance.png`
- `docs/design-targets/generated/unity-u26/screenshots/stage1-0030-first-levelup-balance.png`
- `docs/design-targets/generated/unity-u26/screenshots/stage1-0200-multi-choice-balance.png`
- `docs/design-targets/generated/unity-u26/screenshots/stage1-0400-wave-intensity-balance.png`
- `docs/design-targets/generated/unity-u26/screenshots/stage1-0600-kokuyou-ready-balance.png`
- `docs/design-targets/generated/unity-u26/screenshots/stage1-0730-clear-push-balance.png`
- `docs/design-targets/generated/unity-u26/screenshots/stage1-result-balance.png`

## Human-check-needed

- Tune exact spawn curves after touch-device play.
- Confirm whether Kokuyou ready timing should be earlier for new players.
- Confirm result rewards after persistence and unlock implementation becomes final.
