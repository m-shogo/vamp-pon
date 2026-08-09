# ヨルノシルベ Canon Hub

Date: 2026-07-29  
Status: **CURRENT HUMAN / AI DESIGN ENTRYPOINT**

> ヨルノシルベを考える時は最初にここを見る。repo全体から過去資料を毎回掘り直さない。
>
> **Design Current、Definition Foundation、Runtime Implemented、Device Verified、Release Readyを混同しない。**

---

# 1. Top-level read order

```txt
CANON.md
↓
game-core-book-v1.md
↓
GAME-DESIGN.md
↓
必要なHub
├ PLAY-EXPERIENCE.md
├ CHARACTER-STORY-INTEGRATION.md
├ NAMED-OBJECT-CONNECTIONS.md
├ CHARACTERS.md / RELATIONSHIPS.md / FUTURE-CAST.md
├ STORY.md
├ ENEMIES.md
└ 181-current-production-canon.md
```

---

# 2. Game identity

`game-core-book-v1.md`

ヨルノシルベは:

> 夜の中で大量の影をほどき、記憶片を拾い、そのrunだけの強いbuildを作り、Character / Support / 黒耀化 / Stage条件を変えて何度も朝を目指すヴァンサバ系周回アクション。

Core:

- 1run中に強くなる
- buildを試す
- Clear Getter / 夜明け星図
- Support / BondがGameplayへ返る
- 黒耀化は危険だが強い選択
- fail-forward
- Story informationはplayの副作用
- 正史はHappy End

---

# 3. Three cross-domain hubs

## Play Experience

`PLAY-EXPERIENCE.md`

- Combat / Run pacing
- Stage Encounter 1〜20
- First Run
- Mobile Control
- Difficulty
- Meta Economy
- Postgame
- Audio / Haptic
- Accessibility
- Fun / Balance Playtest

## Character / Story / Gameplay

`CHARACTER-STORY-INTEGRATION.md`

- Current21 / Future15 separation
- voice / relation
- 黒耀化 / rescue
- Enemy pressure
- Stage placement
- Dawn payoff
- Story/Game return

## Named Objects / Clear Getter

`NAMED-OBJECT-CONNECTIONS.md`

- item names
- luminous possessions
- owner / keeper
- Stage / Enemy / Gameplay connection
- 記憶のしるし
- item lineage
- Dawn state
- 100% reward

Runtime-safe foundation:

- `named-object-runtime-migration-plan-v1.md`
- `named-object-runtime-foundation-2026-07-29.md`

---

# 4. Current domain entrypoints

| Domain | First read |
| --- | --- |
| Game identity | `game-core-book-v1.md` |
| Design coverage | `GAME-DESIGN.md` |
| Play experience | `PLAY-EXPERIENCE.md` |
| Character/Story integration | `CHARACTER-STORY-INTEGRATION.md` |
| Named object / item lineage | `NAMED-OBJECT-CONNECTIONS.md` |
| Named-object runtime foundation | `named-object-runtime-foundation-2026-07-29.md` |
| Clear Getter / 100% | `CLEAR-GETTER-AND-100-PERCENT-REWARD.md` |
| Current21 luminous possessions | `character-luminous-personal-item-book-v1.md` |
| Character | `CHARACTERS.md` |
| Character summary | `character-book-v4.md` |
| Character depth | `character-deep-core-book-v1.md` |
| Voice / dialogue | `character-dialogue-relationship-book-v1.md` |
| Relationship | `RELATIONSHIPS.md` |
| Future cast | `FUTURE-CAST.md` |
| Bond / Support | `BOND.md` |
| 黒耀化 | `BLACK-YOUKA.md` |
| 黒耀化 rescue | `character-black-youka-rescue-book-v1.md` |
| Story | `STORY.md` |
| Main beats | `story-main-beat-sheet-v1.md` |
| Enemy | `ENEMIES.md` |
| Stage1–5 | `STAGE-ENCOUNTER-DESIGN.md` |
| Stage6–20 | `stage-encounter-expansion-06-20-v1.md` |
| Combat / Run | `COMBAT-RUN-DESIGN.md` |
| First Run | `FIRST-RUN-EXPERIENCE.md` |
| Mobile | `MOBILE-CONTROL-EXPERIENCE.md` |
| Difficulty | `DIFFICULTY-AND-PLAYER-AIDS.md` |
| Economy | `META-ECONOMY-DESIGN.md` |
| Postgame | `POSTGAME-ENDGAME-DESIGN.md` |
| Archive | `PROGRESSION-ARCHIVE.md` |
| Audio/Haptic | `AUDIO-HAPTIC-DIRECTION.md` |
| Accessibility | `ACCESSIBILITY-BASELINE.md` |
| Fun/Balance | `FUN-BALANCE-PLAYTEST.md` |
| Runtime / Release | `181-current-production-canon.md` |

---

# 5. Character state

## Current21

```txt
Core5
ユイ / アサ / ナギ / ミチル / トモリ

Circle10
セン / リツ / コヨリ / ゲン / ハナ
ユウビ / マドカ / シロ / トバリ / ネム

Shadow5
クロオリ / カナメ / カスミ / トキ / ツムギ

Reserve
レン
```

Rules:

- Current21 = 20 + reserve 1
- ユイ×アサ = protagonist-grade buddy / non-romance
- リツ×コヨリ = siblings / non-romance
- 現実では同時代とは限らない
- 物 / 記録 / 言葉は時代を渡れる
- 夜で初めて生まれる友情を残す
- 黒耀化 = 外部悪人格ではない
- rescue = 仲間が治すのでなく本人の選択肢を増やす
- relation coverage >=2 = 21/21
- black-youka rescue = 21/21
- Dawn proof = 21/21
- luminous possession direction = 21/21

Stable Shadow IDs:

```txt
kage1 = カナメ
kage2 = カスミ
kage3 = トキ
kage4 = ツムギ
```

IDは維持する。
Current visible nameを旧カゲール名へ戻さない。

## Future15

ヒヨリ / セリカ / クロエ / レンジ / トウマ / クウ / ヨモ / ノア / ルム / マキ / スズ / イオ / カイ / ナオ / アマネ

Rules:

- Current21へ自動昇格しない
- sequel cast確定ではない
- representationだけをCharacter Coreにしない
- relation/story reservoir = 15/15
- exact era / romance / final rosterはHuman decision前にLOCKしない

---

# 6. Named-object invariant

最重要Current rule:

> **名前のある物はdisplay nameだけで漂わせず、stable IDを持ち、最低でもCharacter・Stage・Gameplay・Archiveへ接続する。**

lineageではさらに:

- Relationship
- Enemy motif
- 記憶のしるし
- 黒耀化 distortion
- Dawn state
- evolution phase

へつなぐ。

全部をPlayerへ同時表示する必要はない。
制作memoryでは失わない。

## Definition foundation

Source:

- `src/game/data/namedObjectRegistry.ts`

Current counts:

```txt
Current21 lineages = 21
phases per lineage = 6
stable named objects = 126
```

Stable phase IDs:

```txt
named-object:{characterId}:luminous_possession
named-object:{characterId}:starter_gear
named-object:{characterId}:passive_item
named-object:{characterId}:rare_item
named-object:{characterId}:lamp_tsugi
named-object:{characterId}:akatsuki_biraki
```

同名phaseは`sameObjectPhase`で同一objectの成長を明示する。
偶然の重複を後から同一物に捏造しない。

## Non-destructive migration

Source:

- `src/game/data/namedObjectMigrationLedger.ts`

Rules:

- old propを削除しない
- old nameを削除しない
- unknown save IDを削除しない
- Nagi / Michiru旧bindingをsilent overwriteしない
- Shadow stable IDを変えない
- `黒曜化`はlegacy alias、visible Currentは`黒耀化`

---

# 7. Item / luminous possession state

Existing planning source:

- `src/game/data/characterProductionPlans.ts`

Coverage:

```txt
Current20 starter gear = 20/20
Current20 passive      = 20/20
Current20 rare item    = 20/20
Current20 灯継ぎ       = 20/20
Current20 暁開き       = 20/20
Reserve Ren            = Working
```

Current21 luminous possessions:

- `character-luminous-personal-item-book-v1.md`

Generated compatibility source:

- `src/game/data/namedObjectReadModels.ts`

Current:

```txt
Character object read models = 21
runtimeConnectionState = NOT_CONNECTED
```

既存Keeper UIが21人対応済みという意味ではない。

---

# 8. Clear Getter / 100%

```txt
灯録
└ 夜明け星図
   └ 星座群
      └ 記憶のしるし
```

夜明け星図はachievement checklistではなく、人物・物・敵・Stage・関係の線を可視化するClear Getter。

## Global constellation foundation

Source:

- `src/game/data/globalConstellationDefinition.ts`

```txt
Group roots              = 6
Stage roots              = 20
Character roots          = 21
Item-lineage roots       = 21
Stage1 achievement nodes = 25
Named-object links       = 126
runtimeConnected         = false
runtimeDenominatorFrozen = false
```

これはUI完成ではない。

## Collection save v2 draft

Source:

- `src/game/data/collectionProgressSaveV2.ts`

Rules:

- old IDsを保持
- unknown cell/groupを保持
- v1から100%を自動解放しない
- v1からreward claimedを生成しない
- current state = `DRAFT_NOT_CONNECTED`

Production save serviceはまだ使用していない。

## 100% exact direction

# **全灯の朝**

Reward pack:

1. playable Dawn Square celebration
2. Current21 / 星獣 / 21 luminous possessions
3. full ensemble animated page `全灯大絵図《朝を選んだ人たち》`
4. completion medley `全灯の朝 — Twenty-One Lights Medley`
5. all-character cosmetic `星図継ぎの灯`
6. remix play mode `星図継ぎの夜`
7. title `全灯を見届けた人`
8. seal `全灯印`
9. archive frame `朝綴り`
10. one small future anomaly

True Endingではない。
Main Happy Endを最大級に祝う追加の朝。

100%へ要求しない:

- 全文章既読
- arbitrary 9999 kills
- 全Pair最大Bond
- daily / weekly
- 期間限定

## Fail-closed evaluator

Source:

- `src/game/data/allLightsCompletion.ts`

Current:

```txt
version = design-v1
runtimeFrozen = false
```

したがってunlockはLOCKED。

`runtimeFrozen=true`でも空required IDs・重複group・空versionなら:

```txt
INVALID_FROZEN_SPECIFICATION
```

で拒否する。

Reward claimはeligible時のみ、immutable、idempotent。

---

# 9. 黒耀化

Common name:

# **黒耀化**

`黒曜化`は新規canonで使わない。

```txt
本人の長所
+ 恐怖 / 焦り
→ 一方向へ極端化
→ wrong arrival
→ power spike
→ 視野狭窄
```

成長後は同じ力を捨てず、Timingと他者の選択を残せる。
光る持ち物も別物へ交換せず、同じ長所が歪む。

---

# 10. Story / Mystery

Main Story:

- gameplay-first
- Happy End
- permanent deathを主な泣き装置にしない
- Game Over = 死亡ではない
- 日常蓄積から感動

Mystery:

```txt
C-grade = 1で払う
B-grade = 1で意味が分かり後作で再読可能
A-grade = series OPEN
```

A-gradeを残すためC-gradeまで曖昧にしない。
Main Mystery final answerはHuman decision前にLOCKしない。

---

# 11. Stage / Enemy

Stage authority:

- `src/game/data/stageProductionDatabase.ts`

Current:

- gameplay identity 20/20
- exact wave / final Boss / difficulty / launch count OPEN
- Stage16〜19のproduction seedとCurrent Shadowを推測で直接LOCKしない

Enemy authority:

```txt
ENEMIES.md
→ enemyProductionDatabase.ts
→ visual family
→ detail reservoir
```

Current48。
Defeat = **ほどく**。
旧name / old character bindingをCurrentへ戻さない。

Stage1の旧Enemy達成6札はCurrent48 mappingを推測せずreviewへ隔離する。

---

# 12. Play experience

Run:

```txt
weak
→ choice
→ build identity
→ pressure
→ alternate answer
→ Evolution / 黒耀化
→ completed build
→ Dawn
```

First Run:

- first 10 secondsで移動
- auto attackを体験で理解
- tutorial modalを増やさない
- Resultからsecond run hook

Mobile:

- floating-anchor drag direction
- physical comfort未証明

Difficulty:

- HP sponge first禁止
- Main StoryをHard gateしない

Meta:

- core currency原則1family
- raw powerよりplay variety
- Bondをcurrencyで買わない
- daily/FOMO/staminaなし

Postgame:

- Main Endingは本編で完結
- mastery / challenge / alternate build
- 100%は`全灯の朝`で大きく祝う

---

# 13. Runtime foundation status and remaining gaps

Implemented foundation:

- stable object registry 126
- migration ledger
- 21 object read models
- 2 lost-item compatibility rows
- Stage1 25-cell compatibility layer
- Collection save v2 draft
- 全灯fail-closed evaluator
- global constellation graph
- tests / checker

Still not connected:

- `keeperRecords.ts` current UI remains 5 records
- keeper assets remain Core5 scope
- `lostItemRecords.ts` remains 6 cards
- lost-item assets remain 6
- production save service does not use v2
- global constellation UI does not exist
- launch-v1 required IDs are not frozen
- `全灯の朝` Scene / art / music / cosmetic / remix mode are not implemented

Design / Definitionだけで修正済み・READYとは扱わない。

Audit:

- `named-object-clear-getter-audit-2026-07-29.md`
- `named-object-runtime-foundation-2026-07-29.md`

---

# 14. Mandatory routing

## Gameplay

```txt
CANON
→ Game Core
→ GAME-DESIGN
→ PLAY-EXPERIENCE
→ required master
```

## Character

```txt
CANON
→ CHARACTERS
→ character-book-v4
→ deep / voice / relation
→ cross-domainなら CHARACTER-STORY-INTEGRATION
```

## Named Object / Clear Getter design

```txt
CANON
→ NAMED-OBJECT-CONNECTIONS
→ luminous item book / Clear Getter master
```

## Named Object implementation

```txt
CANON
→ named-object-runtime-foundation-2026-07-29
→ namedObjectRegistry / migration ledger
→ compatibility / save v2 / constellation Definition
→ runtime ownership / production save / UI
→ tests / evidence
```

## Runtime

```txt
CANON
→ 181-current-production-canon
→ runtime ownership
→ source / Unity
→ evidence / checker
```

Legacyはmigration/history監査以外で最初に読まない。

---

# 15. Status labels

- **CORE / CURRENT** — game identity
- **CANON / CURRENT** — design前提
- **CURRENT-DIRECTION** — direction Current / exact tuning OPEN
- **CURRENT-BASELINE** — release最低契約 / evidence別
- **DEFINITION FOUNDATION** — type/data/compatibility foundation、runtime未接続可
- **USER DIRECTION** — user明示
- **USER IDEA** —保存し育てる
- **HIGH-VALUE CANDIDATE** —強いが未LOCK
- **OPEN QUESTION** —答えを急がない
- **LEGACY** —履歴

---

# 16. Runtime readiness boundary

Design docs / Definition foundationだけで以下をtrueにしない:

- physicalDeviceReady
- devicePlayableReady
- audioReady
- audioLatencyMeasured
- hapticReady
- hapticMeasured
- mobileMetricsReady
- rcReady
- productionApproved

Named-object workだけで以下もtrueにしない:

- collectionSaveV2Connected
- globalConstellationReady
- allLightsMorningReady

U49/U50/U51 authorityはproduction/runtime docsとevidenceを使う。

---

# 17. Current state in one sentence

> **Character・Story・Enemy・20Stage・Play Experienceに加え、Current21の126個の名前ある物、非破壊migration、save v2 draft、Clear Getter graph、全灯の朝fail-closed判定まで土台を一本化した。次は新設定追加ではなく、tests/CIを通し、既存UI・production saveへ一段ずつ安全に接続する。**

---

# 18. Update rule

```txt
new idea / new named object
↓
matching Hubへ保存
↓
Game Coreとの衝突確認
↓
connection card / stable ID
↓
CandidateならCandidateのまま
↓
Human decision / implementation need
↓
Current master / Definitionへ昇格
↓
CANON / index / machine-readable source同期
```

Game Core変更は明示的Human decisionとして扱う。
