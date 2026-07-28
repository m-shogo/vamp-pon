# CLAUDE.md — docs design scope

For any work under `docs/` involving characters, relationships, Bond, story, mystery, collection, achievements, permanent progression, 黒耀化, or lore:

1. Read `docs/CANON.md` first.
2. Read the matching Current master only.
3. Do not search migrated legacy docs as normal authority.
4. Check `docs/legacy-design-migration-2026-07-28.md` before opening an old design file.
5. If a legacy file is marked `MIGRATED_NO_NORMAL_READ` or `HISTORY_ONLY`, do not use it for new design except explicit history/migration audit.

Current routing:

```txt
Character       -> docs/CHARACTERS.md
Bond / Support  -> docs/BOND.md
黒耀化          -> docs/BLACK-YOUKA.md
Gameplay / Meta -> docs/GAMEPLAY-META-PROGRESSION.md
Archive / Lore  -> docs/PROGRESSION-ARCHIVE.md
Story / Mystery -> docs/STORY.md
Story logic     -> docs/STORY-ENGINE.md
Runtime         -> docs/181-current-production-canon.md
```

Design invariants:

- Formal title: ヨルノシルベ
- New canon spelling: 黒耀化
- Gameplay first; lore is optional side effect
- Reading is never required to receive gameplay power
- Happy End canonical direction
- Game Over is not permanent death
- Main Mystery and Character Mystery remain separate lanes
- HIGH-VALUE CANDIDATE is not CANON until explicitly promoted
- Keep Current 21 separate from future candidates
- Design-doc work must not promote U49/U50/runtime readiness
