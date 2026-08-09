# CLAUDE.md — docs design scope

For any work under `docs/` involving characters, relationships, Bond, story, mystery, collection, achievements, permanent progression, 黒耀化, lore, or remembered user ideas:

1. Read `docs/CANON.md` first.
2. Read `docs/game-core-book-v1.md` to preserve game identity.
3. Read `docs/GAME-DESIGN.md` to understand which design domains are Current / Partial / Proposed / Open.
4. Use the shared-memory books when relevant:

```txt
Character Book -> docs/character-book-v4.md
Story Book     -> docs/story-book-v1.md
Idea Book      -> docs/idea-book-v1.md
```

5. For deep Current21 character work use:

```txt
docs/CHARACTERS.md
→ docs/character-book-v4.md
→ docs/character-deep-core-book-v1.md
→ only the needed detail master
```

6. For all-cast profile comparison use:

```txt
docs/CAST-PROFILES.md
```

7. For Future cast use:

```txt
docs/FUTURE-CAST.md
→ docs/future-cast-profile-book-v1.md
→ docs/character-future-diversity-and-nonhuman-expansion-v2.md
→ only the needed future detail master
```

8. Do not search migrated legacy docs as normal authority.
9. Check `docs/legacy-design-migration-2026-07-28.md` before opening an old design file.
10. If a legacy file is marked `MIGRATED_NO_NORMAL_READ` or `HISTORY_ONLY`, do not use it for new design except explicit history/migration audit.

## Memory semantics

```txt
Game Core Book      = remember what game this is
GAME-DESIGN         = remember what design is complete, partial, proposed, or still open
Character Book v4   = remember Current21 quickly
Character Deep Core = remember why each Current21 person is compelling, how they distort, and how they grow
Cast Profiles Hub   = compare Current21 + Future while preserving status boundaries
Future Cast Hub     = remember non-Current21 directions
Future Profile Book = remember concrete Future candidates, daily life, identity, gameplay, and unresolved details
Story Book          = remember story, emotion, mysteries, sequel space
Idea Book           = remember user ideas without premature canonization
```

`docs/character-book-v3.md` is superseded and must not be used as Current character authority.
`docs/character-future-diversity-and-nonhuman-expansion-v1.md` is superseded by v2 and must not be used as Current Future authority.

Game Core has higher design priority than an undecided Idea.

If an idea conflicts with Game Core, preserve the idea but do not silently change the Core.

A user idea must not disappear because it is still undecided.
But:

```txt
USER IDEA != CANON
```

Preserve meaningful user ideas with accurate labels:

- CORE / CURRENT
- CANON / CURRENT
- USER DIRECTION
- USER IDEA
- HIGH-VALUE CANDIDATE
- OPEN QUESTION
- LEGACY

Do not force a USER IDEA into a hard rule too early.
Do not make the user restate a preserved idea later.

## Character depth rules

Do not deepen the cast by giving everyone the same tragedy.

Avoid automatically adding to every character:

- dead parents
- secret bloodlines
- betrayal
- amnesia
- hidden chosen-one status
- an old connection to every other character

Prefer:

```txt
one visible strength
↓
one weakness from the same root
↓
one ordinary-life behavior that reveals it
↓
one relationship that challenges it
↓
one 黒耀化 wrong arrival
↓
one growth that changes gameplay without erasing the original personality
```

Keep relationships varied:

1. direct family / mentorship / romance / old acquaintance
2. inherited objects / words / techniques
3. ideological mirrors
4. **relationships first created inside ヨルノシルベ**

Do not let past-lore connections replace the player's observed relationship-building time.

## Future cast rules

Current Future profile pool is documented in `docs/future-cast-profile-book-v1.md`.

Preserved directions include:

- 2 brown/dark-skinned humans
- 2 real animals distinct from Star Beasts
- 2 robot/artificial-person identity systems
- Gay character
- Lesbian character
- Bisexual character
- adult feminine-presenting male / 男の娘 character
- adult gender-undisclosed / hard-to-classify character whose sex/gender is not a reveal reward
- human twins
- long-lived witch + aging apprentices
- wheelchair-user candidate

Representation is part of the person, not a replacement for personality.

Do not write:

- bisexual = indecisive / promiscuous
- feminine-presenting man = automatically gay / secretly a woman / needs masculine correction
- gender-undisclosed character = guessing game
- queer character = only discrimination tragedy
- brown skin = exotic culture shorthand
- wheelchair = movement penalty / cure arc
- twins = one is merely the copy of the other
- Robot Star Beast = automatic proof of soul / ghost

## Long-lived witch Candidate

Current Candidate reference:

`docs/character-long-lived-witch-arc-v1.md`

Do not restore the old idea that the witch and apprentices have no romance history.

The current Candidate is a long life containing multiple different relationships with different apprentices: pure mentorship, family-like bonds, friendship, adult romance, marriage, children, separation, and reunion. Not every apprentice is romantic.

Her core is not "immortality is sad" alone. It is that she has lived ordinary human forms of love from beginning to end many times while she alone barely ages. ヨルノシルベ becomes tempting because people do not age there in the ordinary way.

## 黒耀化 semantic

`黒耀化` is not an external evil personality to discard.

It is:

> **an alternate self / wrong arrival produced when the person's existing strength, wish, fear, and power become too one-sided.**

The character ultimately recognizes:

> 「あれも自分だった。扱い方を知らなかった。」

Growth may allow part of that overwhelming power to be used safely later.

## Completeness rule

Do not call the game design complete/perfect only because Game Core, Character Book, Story Book, and Idea Book exist.

Use `docs/GAME-DESIGN.md` as the gap map.

Known high-value domains that still need consolidation/design include:

- combat / run pacing
- stage / encounter design
- first-run onboarding
- mobile input / control experience
- difficulty / player aids
- meta economy shape
- postgame / endgame
- creative audio / haptic direction
- fun / balance playtest metrics

Some of these already have useful implementation notes or Proposed docs. Do not confuse those with a Current design master.
Do not prematurely lock exact balance numbers merely to remove an OPEN status.

## Current routing

```txt
Game Core        -> docs/game-core-book-v1.md
Design coverage  -> docs/GAME-DESIGN.md
All cast profiles-> docs/CAST-PROFILES.md
Current Character-> docs/CHARACTERS.md
Character book   -> docs/character-book-v4.md
Character depth  -> docs/character-deep-core-book-v1.md
Future cast      -> docs/FUTURE-CAST.md
Future profiles  -> docs/future-cast-profile-book-v1.md
Future design    -> docs/character-future-diversity-and-nonhuman-expansion-v2.md
Bond / Support   -> docs/BOND.md
黒耀化           -> docs/BLACK-YOUKA.md
Gameplay / Meta  -> docs/GAMEPLAY-META-PROGRESSION.md
Archive / Lore   -> docs/PROGRESSION-ARCHIVE.md
Story / Mystery  -> docs/STORY.md
Story logic      -> docs/STORY-ENGINE.md
Runtime          -> docs/181-current-production-canon.md
```

## Design invariants

- Formal title: ヨルノシルベ
- New canon spelling: 黒耀化
- Game Core Book is the top-level game identity reference
- Gameplay first; lore is optional side effect
- Reading is never required to receive gameplay power
- Clear Getter / 夜明け星図 is meta gameplay
- Bond/Support returns value to gameplay
- Happy End canonical direction
- Game Over is not permanent death
- Main Mystery and Character Mystery remain separate lanes
- HIGH-VALUE CANDIDATE is not CANON until explicitly promoted
- Keep Current21 separate from Future candidates
- Character Book v4 supersedes v3
- Future diversity/nonhuman expansion v2 supersedes v1
- Character depth must keep different causes, relationship shapes, and daily-life expression
- 黒耀化 is integrated self, not disposable external evil
- Representation never substitutes for ordinary personality, gameplay identity, or daily life
- Design-doc work must not promote U49/U50/runtime readiness
