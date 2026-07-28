# Legacy Design Migration Ledger — 2026-07-28

Status: **CURRENT MIGRATION LEDGER**

目的: 過去に積み上げた設計を失わずCurrent Canonへ吸収し、吸収後は古い資料を通常作業で読み直さないようにする。

---

# 1. Policy

Status:

- `MIGRATED_NO_NORMAL_READ` — 有効要素はCurrentへ移植済み。通常作業では読まない
- `PARTIAL_MIGRATION` — 一部だけCurrentへ移植。残りに監査価値あり
- `HISTORY_ONLY` — 現在設計には使わない。履歴確認専用
- `CURRENT` — 現正本

通常のAI / Agentは `MIGRATED_NO_NORMAL_READ` / `HISTORY_ONLY` を検索結果から拾っても設計根拠にしない。

---

# 2. Current master map

| Domain | Current master |
| --- | --- |
| all design | `docs/CANON.md` |
| character | `docs/CHARACTERS.md` |
| character understanding | `docs/character-book-v2.md` |
| daily life / speech | `docs/CHARACTER-LIFE-AND-SPEECH.md` |
| Bond / Support | `docs/BOND.md` |
| 黒耀化 | `docs/BLACK-YOUKA.md` |
| gameplay / meta | `docs/GAMEPLAY-META-PROGRESSION.md` |
| collection / achievements / lore | `docs/PROGRESSION-ARCHIVE.md` |
| story | `docs/STORY.md` |
| story/gameplay logic | `docs/STORY-ENGINE.md` |
| ending / sequel | `docs/story-ending-sequel-architecture-v1.md` |
| mystery lanes | `docs/story-foreshadowing-payoff-map-v1.md` |
| runtime / production | `docs/181-current-production-canon.md` |

---

# 3. Character / relationship migration

| Legacy file | Status | Migrated to | Kept idea |
| --- | --- | --- | --- |
| `docs/design/daily-life/daily-life-intermission-bible.md` | MIGRATED_NO_NORMAL_READ | `CHARACTER-LIFE-AND-SPEECH.md` | food, cleaning, rain, sleepless nights, habits, lies, anger, ordinary life |
| `docs/design/characters/relationship-speech-evolution.md` | MIGRATED_NO_NORMAL_READ | `CHARACTER-LIFE-AND-SPEECH.md`, `BOND.md` | individual call-name/politeness change, not uniform max-bond speech |
| `docs/design/characters/dialogue-relationship-bible-and-ojousama.md` | MIGRATED_NO_NORMAL_READ | `character-book-v2.md`, `CHARACTER-LIFE-AND-SPEECH.md` | speech differentiation, ojousama direction, relation language |
| `docs/139-friendship-romance-and-bond-system.md` | MIGRATED_NO_NORMAL_READ | `BOND.md` | main/support, connection stability, gameplay Bond, pair action |
| `docs/140-unstable-bond-and-variance-system.md` | MIGRATED_NO_NORMAL_READ | `BOND.md` | stable/unstable/one-sided/taboo pair gameplay; conflict is not simply weak |
| `docs/141-emotional-relationship-archetype-catalog.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md`, `character-book-v2.md` | friendship, rivals, siblings, teacher/student, lifespan gap, reunion, enemy understanding |
| `docs/142-natural-buzz-seed-adoption-plan.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md` | prop → behavior → gameplay → recontextualization sequence |
| `docs/character-bond-support-system-v1.md` | MIGRATED_NO_NORMAL_READ | `BOND.md` | Current 2026-07-28 Bond draft consolidated into simpler master |

Rejected from old relationship docs:

- old categorical sex/gender-based romance bans not restated by current user direction
- old character candidates that are not Current 21
- exact variance probabilities/numbers
- 2-character slot count lock

---

# 4. 黒耀化 migration

| Legacy file | Status | Migrated to | Kept idea |
| --- | --- | --- | --- |
| `docs/150-overdrive-naming-bible.md` | MIGRATED_NO_NORMAL_READ | `BLACK-YOUKA.md` | common 黒耀化 + personal name; Yui 黒灯化; black+symbol naming; not evil |
| `docs/design/world/black-yoka-twenty-character-core.md` | MIGRATED_NO_NORMAL_READ | `BLACK-YOUKA.md` | over-amplified virtue/weakness, star-beast reaction, aftereffects, dawn contrast |

Rejected / superseded:

- old roster-specific names
- old constellation / beast assignments
- old `黒耀ゲージ` UI term; Current `黒耀瓶`
- old Core5 motif mismatches

Runtime `src/game/data/kokuyouForms.ts` remains unchanged until a separate compatibility-checked data-sync task.

---

# 5. Achievement / collection / fail-forward migration

| Legacy file | Status | Migrated to |
| --- | --- | --- |
| `docs/101-collection-and-night-board-spec.md` | MIGRATED_NO_NORMAL_READ | `PROGRESSION-ARCHIVE.md` |
| `docs/134-collection-atlas-visual-asset-plan.md` | MIGRATED_NO_NORMAL_READ | `PROGRESSION-ARCHIVE.md` |
| `docs/135-collection-atlas-juice-plan.md` | MIGRATED_NO_NORMAL_READ | `PROGRESSION-ARCHIVE.md` |
| `docs/163-fail-forward-permanent-growth-system.md` | MIGRATED_NO_NORMAL_READ | `PROGRESSION-ARCHIVE.md` |
| `docs/164-fail-forward-reward-catalog.md` | MIGRATED_NO_NORMAL_READ | `PROGRESSION-ARCHIVE.md` |
| `docs/165-result-screen-fail-forward-ui.md` | MIGRATED_NO_NORMAL_READ | `PROGRESSION-ARCHIVE.md` |
| `docs/166-fail-forward-implementation-brief.md` | MIGRATED_NO_NORMAL_READ | `PROGRESSION-ARCHIVE.md` |
| `docs/167-fail-forward-canon-index.md` | MIGRATED_NO_NORMAL_READ | `PROGRESSION-ARCHIVE.md` |

Current terminology:

- 灯録 = archive/collection Hub
- 夜明け星図 = Clear Checker-style board
- 記憶のしるし = individual achievement
- カゲモノ図鑑
- 忘れ物絵札
- 灯し手の記録
- 言葉の記録
- 夜の観測記録 = optional deep lore working label

Legacy English reward names are concepts, not locked UI strings.

---

# 6. Story / mystery migration

| Legacy file | Status | Migrated to | Boundary |
| --- | --- | --- | --- |
| `docs/130-season-1-truth-map.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md` | exact “wrong meaning” truth kept as HIGH-VALUE CANDIDATE, not final canon |
| `docs/131-long-term-scenario-architecture.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md`, ending/sequel architecture | local completion + meta mystery; A/B/C mystery classes; triple-meaning props |
| `docs/133-world-logic-and-story-consistency.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md` | gameplay↔lore mapping preserved as candidate engine |
| `docs/136-game-over-retry-and-revival-logic.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md`, `PROGRESSION-ARCHIVE.md` | game over != death; retry != resurrection; exact mapbook mechanism candidate |
| `docs/design/world-mystery-dialogue-reveal.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md`, `PROGRESSION-ARCHIVE.md` | optional dialogue may deepen mystery; old fixed reveal percentages discarded |
| `docs/143-current-canon-index.md` | HISTORY_ONLY | `CANON.md` + current domain masters | superseded old canon index; do not use as current entrypoint |

---

# 7. High-value old concepts now preserved

The following are no longer trapped only in old docs:

- gameplay first / lore as optional side effect
- Clear Checker-like achievement board
- fail-forward after a failed run
- game over is not death
- retry is another attempt/read of an unresolved night
- stable relationship ≠ only strong relationship
- conflict pairs can be high-risk/high-reward
- character-specific 黒耀化 names
- 黒耀化 is a virtue/wish over-amplified, not evil possession
- star beast reacts to black form
- daily-life clues
- call-name and politeness change per character
- local happy completion + series meta mystery
- A/B/C mystery hierarchy
- props can carry first-look / title payoff / sequel reinterpretation
- enemy behavior can be foreshadowing
- gameplay systems themselves can become later lore revelations
- optional reports can be abundant without being required

---

# 8. Migration still pending

Potential old areas not yet fully audited in this consolidation pass:

- every historical stage-by-stage scenario document
- every old item-specific narrative doc
- every old marketing / merch idea
- every old enemy narrative entry
- every historical 50-stage plan (Current production scope may differ, so must not auto-import)

If future work needs these areas, mark them `MIGRATION PENDING`, audit once, move useful parts into a Current master, then close them here.

Do not resume broad legacy reading for normal character/gameplay/story questions.
