# 163. Fail-Forward Permanent Growth System

This document expands permanent growth so a failed run still moves the player forward.

It builds on:

- `docs/19-permanent-growth-and-item-reward-policy.md`
- `docs/136-game-over-retry-and-revival-logic.md`
- `docs/159-black-ink-reading-release-rules.md`
- `docs/161-happy-end-and-item-consistency-rules.md`

## Core rule

A failed run is not wasted.

The player may fail to reach morning, but something should remain:

- a memory trace
- a map mark
- a vessel spark
- an item hint
- a bestiary entry
- a small permanent upgrade
- a new route clue
- a stronger relationship clue

## World logic

Game over means the night's reading failed.

However, black ink cannot fully erase:

- a fragment Yui truly identified
- a vessel resonance she noticed
- a map fold she opened
- a shadow behavior she learned
- a name mark she almost read

So even a failed run can leave residue in the mapbook.

## Reward categories after any run

| Category | Name idea | What remains | Player value |
| --- | --- | --- | --- |
| currency | memory dust | tiny loose fragments | buy small upgrades |
| map | page crease | route memory | stage hints / route unlocks |
| vessel | lantern soot | vessel experience | improve starter weapon |
| item | object trace | item meaning clue | unlock item hints |
| enemy | ink sample | enemy knowledge | bestiary and weakness hints |
| character | relation thread | link clue | future bond / story unlock |
| comfort | bookmark | retry support | reroll / revive / magnet aid |
| collection | found note | lore piece | gallery / glossary unlock |

## Minimum fail reward

After every run, even a short failed run should award at least one of:

- memory dust
- enemy entry progress
- map mark
- item trace
- run-stat stamp

Do not give nothing.

## Reward by run length

| Run result | Reward intent | Examples |
| --- | --- | --- |
| under 1 min | consolation | small memory dust, enemy seen entry |
| 1-3 min | first learning | map mark, pickup glossary progress |
| 3-5 min | useful growth | small upgrade currency, item hint |
| 5-8 min | real progress | vessel spark, weapon unlock progress |
| 8-10 min | near-clear reward | large memory dust, stage clue, permanent node |
| clear | morning reward | page confirmed, bigger unlock, story beat |

## Permanent upgrade families

### 1. Lantern care

Upgrades linked to Yui's fixed lantern.

- stronger first flame
- wider first glow
- fragment attraction while lantern is bright
- one extra small burn pulse after hit
- better visibility around Yui

Story names:

- polished glass
- replaced wick
- old oil tag
- warm handle cloth
- soot cleaned from the frame

### 2. Mapbook reading

Upgrades that make retrying smarter.

- show one enemy hint before run
- reveal one pickup direction once per run
- start with one small map crease
- unlock stage route clue
- show near-miss result reason

Story names:

- folded corner
- dry page edge
- penciled route
- bookmark thread
- margin note

### 3. Memory handling

Upgrades that improve fragments and pickups.

- slightly larger pickup range
- fragment value plus small percent
- keep one unconfirmed clue after fail
- reveal item owner hint faster
- reduce fragment loss on game over

Story names:

- labeled pouch
- clear jar
- repaired clasp
- soft cloth wrap
- tiny name tag

### 4. Shadow reading

Upgrades based on enemy knowledge.

- show enemy family in bestiary
- small damage bonus after defeating same enemy many times
- reveal attack tell in glossary
- unlock shadow family note
- get more memory dust from known shadows

Story names:

- ink sample card
- dried brush tip
- black-page rubbing
- shadow footprint
- wrong-name note

### 5. Retry comfort

Quality-of-life upgrades that reduce frustration.

- one more level-up reroll
- one small revive item chance
- slightly faster early EXP curve
- start with a tiny pickup magnet grace
- result screen suggests one next goal

Story names:

- spare bookmark
- soft page corner
- second match
- guiding thread
- retry ribbon

## Anti-grind rules

Fail-forward must feel kind, not like chores.

Do not:

- require daily login
- demand huge repeated grind
- make failure the optimal strategy
- make upgrades so strong that skill/build no longer matters
- hide basic fun behind long unlocks

## Strength budget

Recommended permanent power budget:

- early comfort: noticeable
- long-term stats: capped
- weapon variety: generous
- story/lore unlock: generous
- raw damage: cautious

Hard caps should exist for:

- attack damage
- move speed
- pickup range
- EXP gain
- revive count

## Emotional rule

The result screen should not say only "failed".

Use language like:

- The morning did not arrive, but a line remained.
- The lantern went out, but the glass remembered warmth.
- The page closed, but one crease stayed open.
- The shadow returned, but its shape is easier to read now.

## MVP recommendation

For a first implementation, use only these:

1. memory dust currency
2. lantern care upgrades
3. enemy seen entries
4. result screen next-goal hint
5. one map mark after 3 minutes

Keep the system small, but design it so many future rewards can plug in.
