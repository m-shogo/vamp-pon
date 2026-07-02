# Unity U26 Stage1 first playable balance draft

## Premise

U26 starts from the U25 production-adjacent runtime loop. It keeps productionApproved=0 and treats every value below as a first playable draft.

## First 30 seconds feel

- The opening uses a low-pressure wave bucket with slow spawn cadence and a small active enemy cap.
- The first LevelUp target is placed near 00:30 so the player sees the choice UI before the loop feels empty.
- Pickup radius is generous enough for mobile readability while keeping movement relevant.

## Wave draft

- 00:00 opening: teach movement, attacks, pickups, and safe spacing.
- 00:30 first pressure: introduce more enemies after the first LevelUp.
- 02:00 choice pressure: support multiple LevelUp choices and passive selection.
- 04:00 wave intensity: raise enemy cap and contact damage pressure.
- 06:00 Kokuyou ready: make the climax gauge reachable before the clear push.
- 07:30 clear push: intensify spawns while preserving a readable escape path.

## XP / LevelUp cadence

- Level 2 is targeted around 00:30.
- Level 3 and beyond require more kills, pickups, and risk-taking.
- Choice count stays at 3 for readable mobile decisions.

## Drop / pickup draft

- Common XP pickups carry the main growth loop.
- Recovery drops are rare and are not a replacement for avoiding damage.
- Rare pickup and evolution material hooks are reachable but not guaranteed.

## Weapon / passive draft

- The player starts with a basic weapon and two draft upgrade lanes.
- Passive choices support movement, pickup, and survival.
- Evolution is gated by weapon level, passive ownership, and material availability.

## Kokuyou balance

- Kokuyou gauge fill is tied to pickups, survival, and KO pressure.
- Ready state should appear before the last wave.
- Active duration is short enough to feel powerful without becoming the whole run.

## Clear / defeat / result

- Stage1 clear target is 08:00.
- Defeat remains possible before clear when HP reaches zero.
- Result uses U25 reward and progress draft models and does not write final save data.
