# Legacy Design Migration Ledger — 2026-07-28

Status: **CURRENT MIGRATION LEDGER**

目的: 過去に積み上げた設計を失わずCurrentへ吸収し、吸収後は古い資料を通常作業で読み直さないようにする。

---

# 1. Policy

Status:

- `MIGRATED_NO_NORMAL_READ` — 有効要素はCurrentへ移植済み。通常作業では読まない
- `PARTIAL_MIGRATION` — 一部だけCurrentへ移植。残りに監査価値あり
- `HISTORY_ONLY` — 現在設計には使わない。履歴確認専用
- `CURRENT` — 現正本 / 現共有記憶

通常のAI / Agentは `MIGRATED_NO_NORMAL_READ` / `HISTORY_ONLY` を検索結果から拾っても設計根拠にしない。

---

# 2. Current memory books

| Book | Status | Role |
| --- | --- | --- |
| `docs/character-book-v4.md` | CURRENT | 人物をすぐ思い出す |
| `docs/character-deep-core-book-v1.md` | CURRENT DEPTH MEMORY | 21人の人生核 / 矛盾 / 黒耀化 /成長 /関係を深く戻す |
| `docs/story-book-v1.md` | CURRENT | 物語・感情・謎・続編余地をすぐ思い出す |
| `docs/idea-book-v1.md` | CURRENT SHARED MEMORY | 未確定user案を忘れず、早くCanon化しない |

`docs/character-book-v3.md` はv4へ移行済み。通常参照しない。

---

# 3. Current master map

| Domain | Current master |
| --- | --- |
| all design | `docs/CANON.md` |
| character | `docs/CHARACTERS.md` |
| character understanding | `docs/character-book-v4.md` |
| character deep core | `docs/character-deep-core-book-v1.md` |
| story understanding | `docs/story-book-v1.md` |
| remembered ideas | `docs/idea-book-v1.md` |
| daily life / speech | `docs/CHARACTER-LIFE-AND-SPEECH.md` |
| Bond / Support | `docs/BOND.md` |
| 黒耀化 | `docs/BLACK-YOUKA.md` |
| temporal character logic | `docs/story-temporal-layer-and-character-connections-v1.md` |
| character connection candidates | `docs/character-connection-web-high-value-candidates-v1.md` |
| long-lived witch candidate | `docs/character-long-lived-witch-arc-v1.md` |
| gameplay / meta | `docs/GAMEPLAY-META-PROGRESSION.md` |
| collection / achievements / lore | `docs/PROGRESSION-ARCHIVE.md` |
| story | `docs/STORY.md` |
| story/gameplay logic | `docs/STORY-ENGINE.md` |
| ending / sequel | `docs/story-ending-sequel-architecture-v1.md` |
| mystery lanes | `docs/story-foreshadowing-payoff-map-v1.md` |
| runtime / production | `docs/181-current-production-canon.md` |

---

# 4. Character / relationship migration

| Legacy file | Status | Migrated to | Kept idea |
| --- | --- | --- | --- |
| `docs/character-book-v2.md` | MIGRATED_NO_NORMAL_READ | `character-book-v4.md`, `character-deep-core-book-v1.md` | 21人理解、関係、日常、future候補 |
| `docs/character-book-v3.md` | MIGRATED_NO_NORMAL_READ | `character-book-v4.md`, `character-deep-core-book-v1.md`, `character-long-lived-witch-arc-v1.md` | Current21 summary、年代差、深い人物核。旧魔女×弟子恋愛なしはsuperseded |
| `docs/design/daily-life/daily-life-intermission-bible.md` | MIGRATED_NO_NORMAL_READ | `CHARACTER-LIFE-AND-SPEECH.md`, `character-book-v4.md` | food, cleaning, rain, sleepless nights, habits, lies, anger, ordinary life |
| `docs/design/characters/relationship-speech-evolution.md` | MIGRATED_NO_NORMAL_READ | `CHARACTER-LIFE-AND-SPEECH.md`, `BOND.md` | individual call-name/politeness change |
| `docs/design/characters/dialogue-relationship-bible-and-ojousama.md` | MIGRATED_NO_NORMAL_READ | `character-book-v4.md`, `CHARACTER-LIFE-AND-SPEECH.md` | speech differentiation, ojousama direction |
| `docs/139-friendship-romance-and-bond-system.md` | MIGRATED_NO_NORMAL_READ | `BOND.md` | Support, connection stability, gameplay Bond, pair action |
| `docs/140-unstable-bond-and-variance-system.md` | MIGRATED_NO_NORMAL_READ | `BOND.md` | conflict pairs are not simply weak; stable/unstable/one-sided/taboo gameplay |
| `docs/141-emotional-relationship-archetype-catalog.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md`, `character-book-v4.md`, `character-deep-core-book-v1.md`, `idea-book-v1.md` | friendship, rivals, siblings, teacher/student, lifespan gap, reunion |
| `docs/142-natural-buzz-seed-adoption-plan.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md`, `story-book-v1.md`, `character-deep-core-book-v1.md` | prop → behavior → gameplay → recontextualization |
| `docs/character-bond-support-system-v1.md` | MIGRATED_NO_NORMAL_READ | `BOND.md` | Bond draft consolidated into simpler current master |

Rejected / superseded:

- categorical constraints not reaffirmed by current user direction
- old character candidates not Current21 unless explicitly preserved
- exact variance probabilities/numbers
- fixed 2-character slot count
- **old long-lived-witch rule that apprentices cannot become romantic partners**

---

# 5. 黒耀化 migration

| Legacy file | Status | Migrated to | Kept idea |
| --- | --- | --- | --- |
| `docs/150-overdrive-naming-bible.md` | MIGRATED_NO_NORMAL_READ | `BLACK-YOUKA.md`, `idea-book-v1.md` | common 黒耀化 + personal name; Yui 黒灯化; not evil |
| `docs/design/world/black-yoka-twenty-character-core.md` | MIGRATED_NO_NORMAL_READ | `BLACK-YOUKA.md`, `character-deep-core-book-v1.md` | over-amplified virtue/weakness, star-beast reaction, aftereffects |

Current semantic strengthened to:

> **本人の中に元からある力 / 願い /恐怖が極端に到達した「もう一つの自分」。後で切り捨てず統合して扱う。**

Superseded:

- old roster-specific names
- old constellation / beast assignments
- old `黒耀ゲージ` UI term; Current `黒耀瓶`
- old Core5 motif mismatches
- external-evil / disposable-personality interpretation

Runtime `src/game/data/kokuyouForms.ts` remains unchanged until a separate compatibility-checked data-sync task.

---

# 6. Achievement / collection / fail-forward migration

| Legacy file | Status | Migrated to |
| --- | --- | --- |
| `docs/19-permanent-growth-and-item-reward-policy.md` | MIGRATED_NO_NORMAL_READ | `GAMEPLAY-META-PROGRESSION.md`, `PROGRESSION-ARCHIVE.md`, `idea-book-v1.md` |
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
- 夜明け星図 = Clear Getter / Clear Checker style board
- 記憶のしるし = individual achievement
- カゲモノ図鑑
- 忘れ物絵札
- 灯し手の記録
- 言葉の記録
- 夜の観測記録 = optional deep lore working label

旧具体数値例はCurrent balanceとしてLOCKしない。

---

# 7. Story / mystery migration

| Legacy file | Status | Migrated to | Boundary |
| --- | --- | --- | --- |
| `docs/130-season-1-truth-map.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md`, `story-book-v1.md` | exact “wrong meaning” truth is HIGH-VALUE CANDIDATE, not final canon |
| `docs/131-long-term-scenario-architecture.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md`, `story-book-v1.md` | local completion + meta mystery; A/B/C mystery; triple-meaning props |
| `docs/133-world-logic-and-story-consistency.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md`, `story-book-v1.md` | gameplay↔lore mapping preserved as candidate engine |
| `docs/136-game-over-retry-and-revival-logic.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md`, `story-book-v1.md`, `PROGRESSION-ARCHIVE.md` | game over != death; retry != resurrection |
| `docs/design/world-mystery-dialogue-reveal.md` | MIGRATED_NO_NORMAL_READ | `STORY-ENGINE.md`, `PROGRESSION-ARCHIVE.md` | optional dialogue/report may deepen mystery |
| `docs/143-current-canon-index.md` | HISTORY_ONLY | `CANON.md` + current Books/masters | superseded old canon index |

---

# 8. High-value old concepts now preserved

These are no longer trapped only in old docs:

- gameplay first / lore as optional side effect
- Clear Getter-like achievement board
- gameplay reward first, information second
- fail-forward after a failed run
- game over is not death
- retry as another attempt/read of an unresolved night
- stable relationship ≠ only strong relationship
- conflict pairs can be high-risk/high-upside
- character-specific 黒耀化 names
- 黒耀化 is an integrated alternate self / wrong arrival, not evil possession
- star beast reacts to black form
- daily-life clues
- call-name and politeness change per character
- Happy End canonical direction
- tears from accumulated daily life
- Main Mystery vs Character Mystery separation
- local happy completion + series meta mystery
- A/B/C mystery hierarchy
- props with first-look / title-payoff / sequel reinterpretation
- enemy behavior as foreshadowing
- gameplay systems themselves becoming later lore revelations
- optional report layer similar in role to deep world reports
- remembered user ideas preserved separately from Canon
- characters may originate from different real-world eras
- objects / words / techniques can cross eras without timeline rewriting
- character depth comes from linked personality/gameplay/growth, not tragedy volume

---

# 9. Migration still pending

Potential old areas not yet fully audited:

- every historical stage-by-stage scenario document
- every old item-specific narrative doc
- every old enemy narrative entry
- every old marketing / merch idea
- every historical 50-stage plan

These must not be auto-imported because Current production scope and character canon may differ.

If future work genuinely needs one of these areas:

```txt
mark / treat it as MIGRATION PENDING
→ audit once
→ copy only useful current-compatible ideas into Current Book/master
→ update this ledger
→ stop reading the legacy file normally
```

Do not resume broad legacy reading for normal character/gameplay/story questions.
