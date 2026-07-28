# AGENTS.md — docs design scope

This file applies to design/documentation work under `docs/`.

## Mandatory design entry

For character, relationship, Bond, story, mystery, collection, achievement, permanent progression, 黒耀化, or lore work, read first:

```txt
docs/CANON.md
```

Then read only the matching Current master listed there.

Do **not** begin with repo-wide searches for old design notes.

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
move it into the appropriate Current master
→ update the domain Hub if needed
→ update migration ledger
→ stop using the legacy file for normal design
```

## Current design masters

```txt
docs/CANON.md
├ docs/CHARACTERS.md
│  ├ docs/character-book-v2.md
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
- Main Game is Vampire-Survivors-like combat/build/replay.
- Lore/information is optional side effect of play, not the main reward loop.
- Gameplay rewards come first; reading is never required to claim power.
- Happy End is the canonical ending direction.
- Game Over is not permanent character death.
- Main Mystery and Character Mystery are separate lanes with selective intersections.
- Do not auto-promote HIGH-VALUE CANDIDATE story truths to CANON.
- Do not mix Current 21 characters with future candidates.
- Do not mutate Unity/runtime/U49/U50 merely because a design doc was updated.
