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
- `src/game/data/collectionProgressSaveV2.ts`
- `src/game/data/allLightsCompletion.ts`
- `src/game/data/globalConstellationDefinition.ts`

Coverage:

```txt
Current21 object lineages = 21
phases per lineage        = 6
stable named objects      = 126
Stage roots               = 20
Character roots           = 21
Item-lineage roots        = 21
Stage1 migrated nodes     = 25
Named-object graph links  = 126
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
```

---

# 6. Current design / foundation coverage

```txt
Current21 character integration       = 21/21
Current21 luminous possessions         = 21/21 Definition
Future15 story reservoir               = 15/15 (Future only)
Current enemy identity/writing         = 48/48
Stage gameplay identity                = 20/20 direction defined
Current20 item lineage                 = 20/20 planning data
Reserve Ren item lineage               = Working / launch denominator excluded
Stable named objects                   = 126/126 Definition
Stage1 Clear Getter                    = 25-cell compatibility Definition
Stage2–20 Clear Getter                 = architecture / Stage roots only
Collection Save v2                     = draft migration / production not connected
Global constellation                   = graph Definition / UI not implemented
100% reward 全灯の朝                    = design + fail-closed evaluator / content not implemented
Runtime/device/Human evidence          = NOT COMPLETE
```

---

# 7. Important boundaries

- Current21とFuture15を混ぜない
- Future15は次回作cast確定ではない
- Enemy identityは `enemyProductionDatabase.ts` を優先
- Stage identityは `stageProductionDatabase.ts` を優先
- `kage1..4` stable IDを変更しない
- Current displayはカナメ / カスミ / トキ / ツムギ
- exact wave / Boss / difficulty / economy priceは実測前にLOCKしない
- Main Mystery最終回答はHuman decision前にLOCKしない
- old object / old connection / unknown save IDを削除しない
- named-object Definition追加だけでruntime migration済みにしない
- Collection save v2 draftだけでproduction save接続済みにしない
- global graph Definitionだけで大星図UI完成にしない
- `全灯の朝` evaluatorだけでScene / art / music / remix実装済みにしない
- Design CurrentだけでU49 / U50 / RC readinessを昇格しない

---

# 8. Runtime作業で最初に読む

```txt
unity-big-implementation-control-center-v1.md
unity-current-doc-index-2026-07-10.md
181-current-production-canon.md
unity-runtime-ownership-contract-v1.md
unity-runtime-visual-readiness-gate-v1.md
unity-ui-design-system-v1.md
asset-generation-consistency-system-v1.md
unity-u44-to-u51-app-quality-roadmap-2026-07-06.md
```

Current phase:

```txt
Completed: U46 AppFlow / Save / Result / 灯録 candidate
Completed: U46.1 Result / Save Hardening
Completed: U47 gameplay data/runtime
Completed: U48 production asset expansion
Current: U49 actual-device audio/haptic
Next: U50 performance/touch metrics
Then: U51 RC
```

U48 visual runtime scopeの完了は、実機操作・音・振動・性能・RC・アプリ全体のproduction承認を含まない。

---

# 9. Current readiness

```txt
implementationFoundationReady=true
simulatorPlayableCandidateReady=true
runtimeVisualReady=true
physicalDeviceReady=false
devicePlayableReady=false
audioReady=false
audioLatencyMeasured=false
hapticReady=false
hapticMeasured=false
mobileMetricsReady=false
rcReady=false
productionApproved=false
```

READYは、実装・runtime接続・実寸確認・evidence・checkerが揃った時だけ上げる。

---

# 10. Quality checks

```sh
pnpm implementation:preflight:check
pnpm implementation:preflight:full
pnpm asset-generation:check
pnpm assets:verify
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm unity:meta:check
node --experimental-strip-types scripts/quality/check-named-object-registry.ts
```

Named-object checker covers:

- 21 lineages / 126 object IDs
- migration ledger
- unknown legacy ID preservation
- 100% fail-closed
- Stage1 25-node compatibility
- global constellation links

---

# 11. Authority separation

Runtime / release:

```txt
Big Implementation Control Center
→ Current Doc Index
→ Current Production Canon
→ Runtime Ownership Contract
→ src/game/data/* / Unity runtime
→ evidence / checker
```

Design concept:

```txt
CANON
→ Game Core
→ GAME-DESIGN
→ PLAY-EXPERIENCE / CHARACTER-STORY-INTEGRATION / NAMED-OBJECT-CONNECTIONS
→ domain master
```

Historical U0〜U45.1資料やprototype資料は履歴として残すが、Current READY判定へ単独使用しない。
