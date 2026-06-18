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

- Date: 2026-06-18 11:30 JST
- Device / browser: Chrome requested, but Codex Chrome Extension communication was unavailable after setup checks.
- Build passed: yes (`pnpm stage1:fun-pass:verify`)
- Test passed: yes (`pnpm stage1:fun-pass:verify`)
- Reached time: unverified by live mobile run
- Player level at 150 sec: unverified by live mobile run
- Kills at 150 sec: unverified by live mobile run
- Damage taken: unverified by live mobile run
- First elite defeated: unverified by live mobile run
- Capsule opened: unverified by live mobile run

Notes:

- Chrome was running.
- Codex Chrome Extension was installed and enabled in the selected Default profile.
- Native host manifest was present and correct.
- Browser communication still returned unavailable, so the required three mobile viewport playtests remain human-check-needed.
- Added a `?playtest=true` debug snapshot hook so future browser runs can read elapsed time, HP, kills, fragments, capsules, enemy counts, and elite/capsule telemetry without changing normal gameplay.
