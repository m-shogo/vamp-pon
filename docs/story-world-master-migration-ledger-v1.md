# ヨルノシルベ — Story / World Master Migration Ledger v1

Date: 2026-08-11  
Status: **CURRENT MIGRATION CONTROL / STABLE-ASSET PRESERVATION**

> 目的: 2026-08-11 Story / World Master更新後もrepo内に残る旧`朝 / Dawn / 朔盟 / same-constellation`語を、Current authorityと誤認しないように管理する。

---

# 1. Highest authority

`docs/00-current-story-world-master.md`

Decided:

- Yoru-no-Shirube = Dream world
- physical morning = none
- return = Waking
- explicit time tags weak
- era-varying Dream constellations
- moon = incident depth
- 朔夜座 Current formal name
- 群青残響録 non-fixed retrospective label
- no fixed one-boss-per-era role
- Dream basic living is not survival logistics

---

# 2. MIGRATED — Current content meaning aligned

- `docs/00-current-story-world-master.md`
- `docs/CANON.md`
- `docs/WORLD.md`
- `docs/STORY.md`
- `docs/game-core-book-v1.md`
- `docs/story-book-v1.md`
- `docs/story-main-beat-sheet-v1.md`
- `docs/story-temporal-layer-and-character-connections-v1.md`
- `docs/story-ending-sequel-architecture-v1.md`
- `docs/world-foundation-authority-v1.md`
- `docs/world-setting-conflict-register-v1.md`
- `docs/world-human-decision-queue-v1.md`
- `docs/world-setting-expansion-index-v1.md`
- `docs/world-life-death-injury-rulebook-v1.md`
- `docs/world-civilian-society-bible-v1.md`
- `docs/world-institution-faction-map-v1.md`
- `docs/world-geography-travel-atlas-v1.md`
- `docs/world-knowledge-secret-matrix-v1.md`
- `docs/world-mystery-foreshadow-payoff-ledger-v1.md`
- `docs/world-historical-incident-ledger-v1.md`
- `docs/stage-world-lore-integration-v1.md`
- `docs/design/world/world-logistics-and-survival-rules.md` → SUPERSEDED compatibility note
- `docs/sakuyaza-current-identity-v1.md`
- `docs/gunjo-zankyoroku-current-v1.md`

Machine:

- `src/game/data/storyWorldMasterSource.ts`
- `src/game/data/worldSettingConflictRegister.ts`
- `src/game/data/worldSettingExpansionIndex.ts`
- `src/game/data/stageWorldLoreIntegration.ts`
- `src/game/data/sakumeiCandidateSource.ts`
- `scripts/quality/check-world-setting-expansion.ts`

---

# 3. LEGACY NAME / STABLE ID — Do not delete just for wording

Examples:

- `dawn_return_square`
- `夜明け星図`
- `全灯の朝`
- `akatsuki_biraki`
- `Dawn` fields / flags / test names
- `sakumei*` filenames / exported legacy aliases
- `yatsukage*` stable namespace

Rule:

> **legacy string exists ≠ old Story rule is Current.**

These may remain because:

- save compatibility
- data IDs
- existing UI / asset references
- test fixtures
- migration safety

Player-facing rename / runtime rename is a separate scoped migration, not part of Story Canon update by default.

---

# 4. SUPERSEDED CONTENT SEMANTICS

If any lower doc still says the following as a world fact, it is superseded even before that file is edited:

- morning physically arrives in Dream
- survive until morning to return
- Dawn is Reality-return mechanism
- Yoru-no-Shirube might not be a dream
- normal economy / food supply is required for Dream survival
- all Dream constellations are same in every era
- 朔盟 is Current formal identity
- 群青残響録 is fixed 5-person organization
- one fixed era boss per era
- incident-central person must be combat boss
- Sakuyaza and Gunjo have a fixed boss/subordinate hierarchy

---

# 5. Legacy authored assets preserved

## 八影

Keep:
- stable IDs
- encounter history
- 28 pair assets
- Current relations

Meaning:
- early observer label

## 朔盟

Keep:
- 8member ideology
- deep profile
- pair dynamics
- operational candidates
- fan attachment lanes
- visual candidate material

Meaning:
- superseded authored candidate / legacy namespace

Current formal identity:
- **朔夜座**

---

# 6. Dawn-word classification

When finding `朝 / Dawn` in repo, classify before editing.

### A — STORY SEMANTIC

Example:
> 「朝が来たのでRealityへ帰れた」

Action:
**must migrate to Waking.**

### B — LEGACY PRODUCT NAME

Example:
- 夜明け星図
- 全灯の朝

Action:
Do not silently delete. Re-review player-facing wording separately.

### C — STABLE ID / INTERNAL TOKEN

Example:
- `dawn_return_square`
- `akatsuki_biraki`

Action:
Preserve unless a save/runtime migration is intentionally scoped.

### D — METAPHOR

Example:
Reality-side「朝になった」or a poem / title that does not claim Dream sunrise.

Action:
Context review. Not automatically wrong.

---

# 7. Remaining review surfaces

Not blockers for current Story / World authority, but inspect before final production:

- `CHARACTER-STORY-INTEGRATION.md` legacy Dawn-proof wording
- `NAMED-OBJECT-CONNECTIONS.md` Dawn-state wording
- `PROGRESSION-ARCHIVE.md` 夜明け星図 product semantics
- `CLEAR-GETTER-AND-100-PERCENT-REWARD.md` 全灯の朝 presentation
- existing Unity/runtime fields named Dawn
- screenshots / UI copy that visually depict sunrise
- final TOP / Ending visual assets
- generated lore/search docs outside current Hub

### Rule

These are **migration surfaces**, not authority disputes.

The Master already wins.

---

# 8. Final Character Master gate

Before final character art production:

1. Master read
2. Era evidence check
3. Dream / Reality layer check
4. constellation perception check if sky visible
5. Moon depth check if stage art
6. 朔夜座 current naming check
7. Gunjo non-fixed-boss check for incident art
8. legacy Dawn wording classification
9. Human visual review

---

# 9. Runtime migration gate

Do not rename IDs merely because Story terminology changed.

Need separate migration only when:

- player-facing text is wrong
- visual scene literally shows forbidden physical dawn
- new save / archive needs Current formal terminology
- old name causes active design confusion

Any ID migration must preserve unknown save IDs and existing assets.

---

# 10. Completion rule

Story / World migration is considered structurally safe when:

- Highest Master is machine-validated
- conflict blockers = 0
- physical morning Stage count = 0 in current lore integration
- 朔夜座 Current identity is machine-readable
- 朔盟 is explicitly superseded
- 群青残響録 fixedCount=false / onePerEra=false / mandatoryCombatBoss=false
- legacy Dawn tokens are classified rather than blindly deleted
