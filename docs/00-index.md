# ヨルノシルベ ドキュメント入口

<!-- CURRENT_STATE_BEGIN -->
```json
{
  "schemaVersion": 1,
  "currentPhase": "U49 actual-device audio/haptic",
  "nextPhase": "U50 performance/touch metrics",
  "thenPhase": "U51 RC",
  "runtimeVisualReady": true,
  "physicalDeviceReady": false,
  "devicePlayableReady": false,
  "audioMixerImplemented": true,
  "audioMixerDeviceVerified": false,
  "audioReady": false,
  "audioLatencyMeasured": false,
  "hapticReady": false,
  "hapticMeasured": false,
  "u50ThresholdsDefined": false,
  "mobileMetricsReady": false,
  "rcReady": false,
  "productionApproved": false
}
```
<!-- CURRENT_STATE_END -->

旧名 `Vamp Pon` / `ヴァンサバ改` は開発コード名です。

---

# 0. Runtime / production入口

```txt
docs/unity-big-implementation-control-center-v1.md
→ docs/unity-current-doc-index-2026-07-10.md
→ docs/181-current-production-canon.md
→ docs/unity-runtime-ownership-contract-v1.md
→ docs/unity-runtime-visual-readiness-gate-v1.md
→ docs/unity-ui-design-system-v1.md
→ docs/asset-generation-consistency-system-v1.md
→ docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md
```

```txt
Completed: U47 gameplay data/runtime
Completed: U48 production asset expansion
Current: U49 actual-device audio/haptic
```

Current boundary:

```txt
runtimeVisualClassification=production-animated-sprite
runtimeVisualReady=true
runtimeVisualCandidateReady=false
productionVisualAssetProviderConnected=true
runtimeCandidateAssetProviderConnected=false
devicePlayableReady=false
productionApproved=false
```

`runtimeVisualReady=true`はU48 production visual runtime scopeだけを表す。実機、audio/haptic、performance、RC、製品承認は別gate。

2026-07-29 first implementation milestone:

```txt
docs/CODEX-IMPLEMENTATION-HANDOFF-2026-07-29.md
docs/PLAYER-FACING-TERMINOLOGY.md
docs/SETTINGS-BASELINE.md
docs/design-targets/generated/codex-first-implementation-milestone-2026-07-29/visual-review.json
```

---

# 1. Design入口

```txt
全体Canon
→ CANON.md
→ game-core-book-v1.md
→ GAME-DESIGN.md

Play Experience
→ PLAY-EXPERIENCE.md
→ COMBAT-RUN-DESIGN.md
→ STAGE-ENCOUNTER-DESIGN.md
→ stage-encounter-expansion-06-20-v1.md
→ FIRST-RUN-EXPERIENCE.md
→ MOBILE-CONTROL-EXPERIENCE.md
→ DIFFICULTY-AND-PLAYER-AIDS.md
→ META-ECONOMY-DESIGN.md
→ POSTGAME-ENDGAME-DESIGN.md
→ AUDIO-HAPTIC-DIRECTION.md
→ ACCESSIBILITY-BASELINE.md
→ FUN-BALANCE-PLAYTEST.md

Character / Story / Gameplay
→ CHARACTER-STORY-INTEGRATION.md
→ CHARACTERS.md
→ RELATIONSHIPS.md
→ STORY.md
→ ENEMIES.md

Named Objects / Clear Getter / 100%
→ NAMED-OBJECT-CONNECTIONS.md
→ character-luminous-personal-item-book-v1.md
→ CLEAR-GETTER-AND-100-PERCENT-REWARD.md
→ PROGRESSION-ARCHIVE.md
→ named-object-clear-getter-audit-2026-07-29.md
→ named-object-runtime-migration-plan-v1.md
→ named-object-runtime-foundation-2026-07-29.md
→ named-object-runtime-connection-core5-stage1-2026-07-29.md

Economy terminology / display migration
→ collection-economy-terminology-review-2026-07-29.md
→ collection-actual-run-currency-connection-2026-07-29.md
→ meta-currency-display-migration-foundation-2026-07-29.md
```

---

# 2. Character routing

```txt
Current21
→ CHARACTERS.md
→ character-book-v4.md
→ character-deep-core-book-v1.md

Voice / relation
→ RELATIONSHIPS.md
→ character-relationship-arc-book-v1.md
→ character-dialogue-relationship-book-v1.md
→ character-voice-differentiation-guardrails-v1.md
→ character-ensemble-daily-scene-bank-v1.md
→ BOND.md

黒耀化 / rescue / Dawn
→ BLACK-YOUKA.md
→ character-black-youka-rescue-book-v1.md
→ character-dawn-proof-book-v1.md

Future15
→ FUTURE-CAST.md
→ future-cast-profile-book-v1.md
→ future-cast-relationship-story-reservoir-v1.md
```

---

# 3. Enemy / Stage routing

```txt
Enemy / Kagemono
→ ENEMIES.md
→ enemy-encounter-relationship-pressure-v1.md
→ enemy-ecology-and-encounter-recipes-v1.md
→ kagemono-collection-entry-book-v1.md
→ src/game/data/enemyProductionDatabase.ts

Stage
→ STAGE-ENCOUNTER-DESIGN.md
→ stage-encounter-expansion-06-20-v1.md
→ src/game/data/stageProductionDatabase.ts

Stage1 Legacy runtime bridge
→ src/game/data/stage1LegacyRuntimeCompatibility.ts
→ src/game/data/collectionProgressCompatibility.ts
→ src/game/systems/collectionProgress.ts
```

---

# 4. Named-object invariant

名前のある物は、display nameだけで漂わせない。

Current Definitionでは最低4方向へ接続する。

```txt
Character
Stage
Gameplay verb
Archive
```

lineage側でさらに:

```txt
Relationship
黒耀化
Dawn proof
Evolution phase
Clear Getter
```

へ接続する。

Current design sources:

- `NAMED-OBJECT-CONNECTIONS.md`
- `character-luminous-personal-item-book-v1.md`
- `CLEAR-GETTER-AND-100-PERCENT-REWARD.md`

Current data foundation:

- `src/game/data/namedObjectRegistry.ts`
- `src/game/data/namedObjectMigrationLedger.ts`
- `src/game/data/namedObjectReadModels.ts`
- `src/game/data/collectionProgressCompatibility.ts`
- `src/game/data/stage1LegacyRuntimeCompatibility.ts`
- `src/game/data/collectionProgressSaveV2.ts`
- `src/game/data/allLightsCompletion.ts`
- `src/game/data/globalConstellationDefinition.ts`
- `src/game/data/collectionEconomyTerminology.ts`
- `src/game/data/metaCurrencyDisplay.ts`
- `src/game/data/metaCurrencyDisplayMigration.ts`

Coverage:

```txt
Current21 object lineages      = 21
phases per lineage             = 6
stable named objects           = 126
Stage roots                    = 20
Character roots                = 21
Item-lineage roots             = 21
Stage1 historical nodes        = 25
Stage1 active candidates       = 22
Stage1 legacy archive-only     = 3
Stage1 legacy runtime subjects = 8
Named-object graph links       = 126
Economy/mechanic concepts      = 4 separated
Wallet display surfaces        = 11
Wallet formatter connected     = 2
Wallet formatter remaining     = 9
```

## Stage1 compatibility boundary

```txt
compatibility version          = stage1-compat-v2
historical cells preserved     = 25/25
active Current/dual-read cells = 22
legacy archive-only cells      = 3
runtime denominator frozen     = false
```

Dual-read Current Stage1 successors:

```txt
ink_shadow         ↔ ombu_small_ink
black_label_shadow ↔ omburo_ink_arm
bag_yorishiro      ↔ boss_name_without_owner
```

The following are retained but do not automatically enter a future completion denominator:

```txt
fs_002_release_paper_scrap_shadow
fs_003_release_night_haze
fs_025_view_nemori_record
```

## Economy terminology boundary

```txt
永続強化資源 = PlayerProfile.currency / Current display 黒曜片 / naming review pending
記憶片       = run-only XP pickup
灯貨         = real-tracked Stage1 one-run counter display / wallet candidate only
黒耀化       = battle/story mechanic, not currency
```

Wallet display migration:

```txt
Current display          = 黒曜片
candidate display        = 灯貨
formatter coverage       = 2 / 11
remaining surfaces       = 9
Human naming approved    = false
rename                    = blocked
```

## 100% reward Current direction

# **全灯の朝**

- playable Dawn Square celebration
- Current21 / 星獣 / 21の光る持ち物
- full ensemble animated page
- completion medley
- all-character cosmetic `星図継ぎの灯`
- remix mode `星図継ぎの夜`
- title / seal / archive frame
- small future anomaly

True Endingではない。
Main Happy Endを最大級に祝うcompletion festival。

Current fail-closed boundary:

```txt
design version = design-v1
runtime denominator frozen = false
runtime connected = false
```

分母freeze前は全条件が揃って見えてもunlockしない。

---

# 5. Machine-readable design / Definition memory

```txt
design-targets/generated/character-relationship-arc-map-v1.json
design-targets/generated/character-relationship-coverage-v1.json
design-targets/generated/enemy-relationship-pressure-map-v1.json
design-targets/generated/character-black-youka-rescue-map-v1.json
design-targets/generated/story-stage-character-placement-v1.json
design-targets/generated/character-dawn-proof-map-v1.json
design-targets/generated/character-story-gameplay-payoff-map-v1.json
design-targets/generated/future-cast-relationship-story-map-v1.json
design-targets/generated/character-story-integration-coverage-v1.json
design-targets/generated/play-experience-design-coverage-v1.json
design-targets/generated/named-object-registry-v1.json
design-targets/generated/named-object-clear-getter-coverage-v1.json
design-targets/generated/collection-economy-terminology-v1.json
design-targets/generated/meta-currency-display-migration-v1.json
```

---

# 6. Current design / foundation coverage

```txt
Current21 character integration       = 21/21
Current21 luminous possessions         = 21/21 Definition
Core5 luminous possession UI           = 5/5 connected
Remaining Current21 keeper UI/assets   = 16
Future15 story reservoir               = 15/15 (Future only)
Current enemy identity/writing         = 48/48
Stage gameplay identity                = 20/20 direction defined
Current20 item lineage                 = 20/20 planning data
Reserve Ren item lineage               = Working / launch denominator excluded
Stable named objects                   = 126/126 Definition
Stage1 Clear Getter history            = 25/25 preserved
Stage1 future completion candidates    = 22 active / 3 archive-only
Stage1 old/current runtime bridge      = partial dual-read connected
Stage1 fs019 actual run counter        = connected
Stage2–20 Clear Getter                 = architecture / Stage roots only
Collection Save v2                     = draft migration / production not connected
Global constellation                   = graph Definition / UI not implemented
Economy terminology                    = concepts separated / display migration not approved
Wallet formatter                       = 2/11 connected / 9 remaining
Wallet lifecycle tests                 = added / current HEAD execution open
100% reward 全灯の朝                    = design + fail-closed evaluator / content not implemented
Runtime/device/Human evidence          = NOT COMPLETE
```

---
