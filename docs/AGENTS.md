# AGENTS.md — docs design scope

This file applies to design/documentation work under `docs/`.

## Mandatory design entry

For character, relationship, Bond, story, mystery, collection, achievement, permanent progression, 黒耀化, lore, or idea-memory work, read first:

```txt
docs/CANON.md
docs/game-core-book-v1.md
docs/GAME-DESIGN.md
```

`docs/GAME-DESIGN.md` is the completeness/gap map. It prevents an existing implementation note or old proposal from being mistaken for a complete Current design master.

Then route through the shared-memory books when relevant:

```txt
Character Book -> docs/character-book-v4.md
Story Book     -> docs/story-book-v1.md
Idea Book      -> docs/idea-book-v1.md
```

For deep character work:

```txt
docs/CHARACTERS.md
→ docs/character-book-v4.md
→ docs/character-deep-core-book-v1.md
→ only the needed detail master
```

For future-cast work outside Current21:

```txt
docs/FUTURE-CAST.md
→ only the matching future-cast master
```

Use them as:

- Game Core Book = remember what game this is and what must not be lost
- GAME-DESIGN = remember which design domains are Current / Partial / Proposed / Open
- Character Book v4 = remember people quickly
- Character Deep Core = remember life contradictions, growth, Black Transformation, time hooks, and relationship depth
- Future Cast Hub = remember non-Current21 cast directions without silently promoting them into the active roster
- Story Book = remember the story and unresolved mysteries
- Idea Book = remember user ideas without automatically canonizing them

Do **not** begin with repo-wide searches for old design notes.

## Character routing invariant

`docs/character-book-v3.md` is superseded by v4 and is not normal Current authority.

Current character references:

```txt
Character summary      -> docs/character-book-v4.md
Character depth        -> docs/character-deep-core-book-v1.md
Character hub          -> docs/CHARACTERS.md
Future cast hub        -> docs/FUTURE-CAST.md
Future diversity / AI  -> docs/character-future-diversity-and-nonhuman-expansion-v1.md
Life / speech          -> docs/CHARACTER-LIFE-AND-SPEECH.md
Bond / support         -> docs/BOND.md
黒耀化                  -> docs/BLACK-YOUKA.md
Star Beast             -> docs/character-star-beast-constellation-canon-v1.md
Temporal connections   -> docs/story-temporal-layer-and-character-connections-v1.md
Connection candidates  -> docs/character-connection-web-high-value-candidates-v1.md
Long-lived witch       -> docs/character-long-lived-witch-arc-v1.md
```

Do not restore the superseded idea that the long-lived witch has no romantic history with apprentices. Current Candidate understanding allows different apprentices to have different relationships: pure mentorship, family-like bonds, friendship, adult romance, marriage, children, separation, and reunion.

Future-cast directions currently preserved include two brown/dark-skinned human characters, two real-animal characters distinct from Star Beasts, two robot/artificial-person characters with different identity questions, and gay/lesbian representation. These are USER DIRECTION / HIGH-VALUE CANDIDATE layers until explicitly promoted; do not auto-insert them into Current21.

## Game Core priority

`docs/game-core-book-v1.md` is above Idea Book in design priority.

It defines:

- Vampire-Survivors-like run/build/replay as the main game
- Clear Getter / 夜明け星図 as meta gameplay
- Support/Bond as gameplay progression, not only conversation collection
- 黒耀化 as a risky power choice
- fail-forward without making failure optimal
- lore/information as an optional side effect of play
- Happy End as part of the emotional core

If a new idea conflicts with Game Core, do not silently bend the Core. Preserve the idea and surface the conflict for Human decision.

## Completeness rule

Do not call the game design complete/perfect merely because the Game Core Book exists.

Read `docs/GAME-DESIGN.md` and distinguish:

- CURRENT
- PARTIAL
- PROPOSED
- IMPLEMENTED-NOT-DESIGN-MASTER
- OPEN
- LATER

Current known high-value open/consolidation areas include combat/run pacing, stage encounter design, first-run onboarding, mobile controls, difficulty/player aids, meta economy shape, postgame/endgame, creative audio/haptic direction, and fun/balance playtest metrics.

Do not prematurely lock exact numeric balance values just to turn an OPEN area green.

## Idea memory rule

A user idea must not be lost merely because it is not yet canon.

At the same time:

```txt
USER IDEA != CANON
```

When a meaningful new idea is given:

1. preserve it in Idea Book or the matching current Book/master,
2. label it accurately (`USER IDEA`, `USER DIRECTION`, `HIGH-VALUE CANDIDATE`, `OPEN QUESTION`),
3. compare it with Game Core,
4. do not promote it to CANON unless explicitly decided or implementation requires a formal decision,
5. do not make the user repeat it later if it is already preserved.

## Legacy policy

Read:

```txt
docs/legacy-design-migration-2026-07-28.md
```

Files marked `MIGRATED_NO_NORMAL_READ` or `HISTORY_ONLY` must not be used as current design authority.

Only open migrated legacy when:

- auditing history/regression, or
- performing a one-time migration explicitly marked pending.

If a useful old idea is found during an allowed migration:

```txt
move it into the appropriate Current master / Book
→ update the domain Hub if needed
→ update migration ledger
→ stop using the legacy file for normal design
```

## Current design masters

```txt
docs/CANON.md
├ docs/game-core-book-v1.md
├ docs/GAME-DESIGN.md
├ docs/character-book-v4.md
│  └ docs/character-deep-core-book-v1.md
├ docs/FUTURE-CAST.md
│  ├ docs/character-future-diversity-and-nonhuman-expansion-v1.md
│  └ docs/character-long-lived-witch-arc-v1.md
├ docs/story-book-v1.md
├ docs/idea-book-v1.md
├ docs/CHARACTERS.md
│  ├ docs/CHARACTER-LIFE-AND-SPEECH.md
│  ├ docs/BOND.md
│  └ docs/BLACK-YOUKA.md
├ docs/GAMEPLAY-META-PROGRESSION.md
│  └ docs/PROGRESSION-ARCHIVE.md
├ docs/STORY.md
│  ├ docs/STORY-ENGINE.md
│  ├ docs/story-ending-sequel-architecture-v1.md
│  └ docs/story-foreshadowing-payoff-map-v1.md
└ docs/181-current-production-canon.md
```

## Design invariants

- Formal title: **ヨルノシルベ**.
- Use **黒耀化**, never `黒曜化` in new canon.
- Game Core Book is the top-level game identity reference.
- Main Game is Vampire-Survivors-like combat/build/replay.
- Lore/information is an optional side effect of play, not the main reward loop.
- Gameplay rewards come first; reading is never required to claim power.
- Clear Getter / 夜明け星図 is meta gameplay, not merely collection.
- Bond/Support must return value to gameplay.
- Happy End is the canonical ending direction.
- Game Over is not permanent character death.
- Main Mystery and Character Mystery are separate lanes with selective intersections.
- Character depth must not be created by giving everyone the same tragedy, blood relation, betrayal, or amnesia.
- 黒耀化 is an integrated alternate self / wrong arrival, not an external evil personality to discard.
- Do not auto-promote HIGH-VALUE CANDIDATE story truths to CANON.
- Do not mix Current 21 characters with future candidates.
- Do not mutate Unity/runtime/U49/U50 merely because a design doc was updated.
