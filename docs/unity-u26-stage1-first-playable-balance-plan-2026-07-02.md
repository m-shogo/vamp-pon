# Unity U26 Stage1 first playable balance plan

## Scope

U26 adds the first playable balance draft on top of the U25 production-adjacent Stage1 runtime loop. It is a tuning scaffold for Stage1 and remains productionApproved=0.

## Goals

- Keep the U25 StageSelect -> Battle -> LevelUp -> Rare / Evolution / Kokuyou -> Result loop as the runtime premise.
- Define first 30 seconds onboarding feel: low enemy pressure, readable pickups, and a first LevelUp target around 00:30.
- Draft wave intensity from opening to clear push without changing final gameplay constants.
- Draft XP, LevelUp cadence, drop / pickup, weapon / passive, Kokuyou, clear / defeat, and result scoring inputs.
- Produce 390 x 844 verification screenshots for balance milestones.

## Non-goals

- Final balance approval.
- production approval.
- Addressables setup.
- Replacing U22 / U23 / U24 visual proof or U25 flow proof.
- Using generated final PNGs as runtime UI.

## Deliverables

- Runtime draft constants and simulator under `Assets/_Project/Scripts/U26/FirstPlayableBalance`.
- Unity Editor verification and screenshot capture.
- Balance draft and review documents.
- `unity:u26-stage1-first-playable-balance:check`.
