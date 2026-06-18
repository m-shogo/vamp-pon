# Stage1 Early Run Sheet

Use this sheet for a mobile viewport playtest from 0 to 150 seconds.

## Setup

- Branch: main
- Viewport: mobile portrait
- Stage: 1
- Debug circle: on if needed

## Run result

- Date:
- Device / browser:
- Build passed: yes / no
- Test passed: yes / no
- Reached time:
- Player level at 150 sec:
- Kills at 150 sec:
- Damage taken:
- First elite defeated: yes / no
- Capsule opened: yes / no

## 0 to 20 sec

Goal: basic Ombu should feel soft and satisfying.

Score 1 to 5:

- Kill feel:
- Crowd readability:
- Movement comfort:

Notes:

## 20 to 45 sec

Goal: charger enemy adds spice but not unfair damage.

Score 1 to 5:

- Telegraph readability:
- Avoidability:
- Damage fairness:

Notes:

## 45 to 75 sec

Goal: orbit enemy changes escape routes without trapping the player.

Score 1 to 5:

- Flank pressure:
- Escape route fairness:
- Enemy readability:

Notes:

## 75 to 120 sec

Goal: mixed wave feels alive, not chaotic.

Score 1 to 5:

- Enemy role variety:
- XP pacing:
- UI readability under pressure:

Notes:

## 120 to 150 sec

Goal: black capsule creates a chase decision.

Score 1 to 5:

- Can chase capsule:
- Reward expectation:
- Crowd pressure:

Notes:

## 150 sec elite

Goal: first elite should feel like a milestone, not a wall.

Score 1 to 5:

- Timing:
- HP feel:
- Reward clarity:

Notes:

## Tuning decision

Choose one:

- Keep current values
- Lower charger count
- Lower orbit count
- Increase basic Ombu rate
- Move first elite later
- Improve visuals before changing numbers

Final notes:

## 2026-06-18 Codex verification note

- Date: 2026-06-18 11:45 JST
- Device / browser: Codex in-app browser, 390x844 mobile portrait viewport. Chrome was also opened to the local run, but Chrome script evaluation became unstable during long checks.
- Build passed: yes (`pnpm stage1:fun-pass:verify`)
- Test passed: yes (`pnpm stage1:fun-pass:verify`)
- Reached time:
  - Run1: 152.3 sec, survived
  - Run2: 86.8 sec, game over under automated drag/click control
  - Run3: 75.8 sec, game over under automated drag/click control
- Player level at 150 sec:
  - Run1: Lv.7
  - Run2: Lv.3 at game over
  - Run3: Lv.3 at game over
- Kills:
  - Run1: 185 at 152.3 sec
  - Run2: 86 at game over
  - Run3: 73 at game over
- Damage taken:
  - Run1: 40
  - Run2: 127
  - Run3: 110
- First elite defeated: no in browser runs
- Capsule opened: no in browser runs

Notes:

- Chrome was running and opened the local Stage1 page, but long evaluation calls through the extension timed out. The mobile viewport run used the in-app browser with visible canvas screenshots.
- Browser console warnings/errors were empty for the in-app browser runs.
- The Stage1 canvas filled 390x844 without visible UI overlap in the ready/pause/combat screenshots.
- Run1 confirmed enemy role progression through 0 to 150 sec: basic Ombu, charger, orbit, black capsule, then first elite spawn.
- Run1 confirmed the latest runtime background rendered and remained readable behind enemies and HUD.
- Automated mobile dragging is rougher than human play. Runs 2 and 3 are useful as stress checks, but human tactile validation is still needed before calling the balance final.
- After Run2/Run3, wave tuning reduced charger/orbit pressure without raising enemy HP, and made black capsule introduction slightly easier to see from the bottom side.
