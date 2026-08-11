# ヨルノシルベ Canon Hub

Date: 2026-08-11  
Status: **CURRENT HUMAN / AI DESIGN ENTRYPOINT / STORY-WORLD MASTER ROUTED**

> **物語・年代・Dream・星空・月相・朔夜座・群青残響録は `00-current-story-world-master.md` が最上位Authority。**
> Design Current、Definition Foundation、Runtime Implemented、Device Verified、Release Readyを混同しない。

---

# 1. Top-level read order

```txt
00-current-story-world-master.md
↓
CANON.md
↓
game-core-book-v1.md
↓
GAME-DESIGN.md
↓
必要なHub
├ WORLD.md
├ PLAY-EXPERIENCE.md
├ CHARACTER-STORY-INTEGRATION.md
├ NAMED-OBJECT-CONNECTIONS.md
├ CHARACTERS.md / RELATIONSHIPS.md / FUTURE-CAST.md
├ STORY.md
├ ENEMIES.md
└ 181-current-production-canon.md
```

---

# 2. Story / World highest invariants

- 現世は現実の日本。
- Characterは現実では同時代とは限らない。
- ヨルノシルベは**朝の来ない夢世界**。
- 帰還は朝を待つのではなく**Waking / 目覚め**。
- Dream内では西暦等の時間タグが弱い。
- 食事 / 飲料 / 日用品 / 休息はDreamらしく補完可能。
- 心 / 同意 / 記憶真実 / 黒耀化 / Reality大事件は願うだけで変えられない。
- 星は見える。
- 星座は年代で同一とは限らない。
- 月相は日数ではなく事件深度。
- 朔では月がなくなるが星は残る。
- 主要敵8人のCurrent formal name = **朔夜座**。
- 八影 = early observer label。
- 朔盟 = Superseded Candidate / legacy authored asset namespace。
- **群青残響録 = 各時代大事件の中心人物 / 人物群を後から括る記録名。**
- 群青残響録は1時代1人 / 固定人数 / 必須戦闘Boss / 固定敵組織ではない。
- Androidは人間になることを成長goalにしない。
- Reality動物と星獣は別category。
- 正史はHappy End。

---

# 3. Game identity

`game-core-book-v1.md`

ヨルノシルベは:

> 朝の来ない夢の夜で大量の影をほどき、記憶片を拾い、そのrunだけの強いbuildを作り、Character / Support / 黒耀化 / Stage条件を変えながら何度も夢の深部へ挑み、Result / Wakingへ到達するヴァンサバ系周回アクション。

Core:

- 1run中に強くなる
- buildを試す
- Clear Getter
- Support / BondがGameplayへ返る
- 黒耀化は危険だが強い選択
- fail-forward
- Story informationはplayの副作用
- 正史Happy End

### Dawn / 朝 wording compatibility

既存の:

- `夜明け星図`
- `全灯の朝`
- `akatsuki_biraki`
- `Dawn`を含むinternal field / asset / flag

はstable ID / 既存商品名 / legacy wordingとして残る場合がある。

**それらは「ヨルノシルベ内に太陽が昇る」というStory ruleを意味しない。**

最終player-facing namingは必要に応じ別Human Reviewで扱う。IDをStory都合で破壊しない。

---

# 4. Cross-domain hubs

## World

`WORLD.md`

- Dream rules
- Reality / Dream separation
- era
- constellation
- moon phase
- 朔夜座
- 群青残響録
- conflict / human decision routing

## Play Experience

`PLAY-EXPERIENCE.md`

- Combat / Run pacing
- Stage Encounter 1–20
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

- Current21 / Future15
- voice / relation
- 黒耀化 / rescue
- Enemy pressure
- Stage placement
- **Waking payoff**
- Story / Game return

## Named Objects / Clear Getter

`NAMED-OBJECT-CONNECTIONS.md`

- item names
- luminous possessions
- owner / keeper
- Stage / Enemy / Gameplay
- 記憶のしるし
- lineage
- **Waking / post-dream state**
- 100% reward

Runtime-safe foundation:

- `named-object-runtime-migration-plan-v1.md`
- `named-object-runtime-foundation-2026-07-29.md`

---

# 5. Current domain entrypoints

| Domain | First read |
| --- | --- |
| Story / World highest authority | `00-current-story-world-master.md` |
| World | `WORLD.md` |
| Game identity | `game-core-book-v1.md` |
| Design coverage | `GAME-DESIGN.md` |
| Play experience | `PLAY-EXPERIENCE.md` |
| Character / Story integration | `CHARACTER-STORY-INTEGRATION.md` |
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

# 6. Character state

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
- Dreamで初めて生まれる友情を残す
- 通常Wakingでは明示記憶を失い得る
- 技能 / 感情 / 行動変化は残り得る
- 大事件解決パートではDream記憶を取り戻して目覚める方向
- 黒耀化 = 外部悪人格ではない
- rescue = 仲間が治すのではなく本人の選択肢を増やす
- relation coverage >=2 = 21/21
- black-youka rescue = 21/21
- legacy Dawn-proof assetsはWaking payoffへ読み替える
- luminous possession direction = 21/21

Stable Shadow IDs:

```txt
kage1 = カナメ
kage2 = カスミ
kage3 = トキ
kage4 = ツムギ
```

Stable IDは維持する。

## Future15

ヒヨリ / セリカ / クロエ / レンジ / トウマ / クウ / ヨモ / ノア / ルム / マキ / スズ / イオ / カイ / ナオ / アマネ

Rules:

- Current21へ自動昇格しない
- sequel cast確定ではない
- representationだけをCharacter Coreにしない
- relation/story reservoir = 15/15
- exact era / romance / final rosterはHuman decision前にLOCKしない

---

# 7. Named-object invariant

> **名前のある物はdisplay nameだけで漂わせず、stable IDを持ち、最低でもCharacter・Stage・Gameplay・Archiveへ接続する。**

lineage:

- Relationship
- Enemy motif
- 記憶のしるし
- 黒耀化 distortion
- Waking / post-dream state
- evolution phase

へ繋げる。

## Definition foundation

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

`akatsuki_biraki`はstable ID。物理的なDream dawnを意味するよう再解釈しない。

Non-destructive migration:

- old propを削除しない
- old nameを削除しない
- unknown save IDを削除しない
- Nagi / Michiru旧bindingをsilent overwriteしない
- Shadow stable IDを変えない
- `黒曜化`はlegacy alias、visible Currentは`黒耀化`

---

# 8. Item / luminous possession state

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

```txt
Character object read models = 21
runtimeConnectionState = NOT_CONNECTED
```

---

# 9. Clear Getter / 100%

Existing stable names:

```txt
灯録
└ 夜明け星図
   └ 星座群
      └ 記憶のしるし
```

`夜明け星図`はexisting product / collection name。**Dreamに朝が来るcosmologyの証明ではない。**

Global constellation foundation:
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

### New Story / World constraint

Collection側の「星座群」は、年代差のあるDream constellation rulesと衝突しないよう今後再審査する。

- 全年代で同じ星座が固定表示される、と自動解釈しない
- Reality constellation / Dream constellation / collection diagramを分離可能にする
- 昔あった / 後世で増えた星座のMysteryを潰さない

## 100% legacy direction

既存名 `全灯の朝` と以下のreward案は、Story / World Master更新後は**名称・演出再審査対象**。

既存stable IDs / evaluatorは削除しない。

重要:

> Dream Layerに物理的な朝を発生させるcompletion rewardにはしない。

現世で目覚めた後のcelebration、記録上の象徴名、UI legacy title等へ意味を移す余地を残す。

Fail-closed evaluator:
- `src/game/data/allLightsCompletion.ts`

```txt
version = design-v1
runtimeFrozen = false
```

Production unlockはまだLOCKED。

---

# 10. 黒耀化

Common name: **黒耀化**

`黒曜化`は新規canonで使わない。

```txt
本人の長所 / 願い
+ 恐怖 / 焦り
→ 一方向へ極端化
→ wrong arrival
→ power spike
→ 視野狭窄
```

社会の大事件も同型:

```txt
理想 / 保護 / 発展
+ 恐れ / 利害 / 制度
→ 一つの解決策へ固執
→ 大事件
```

作品は「悪を倒す」だけでなく、二択へ第三の選択肢を作る。

---

# 11. Story / Mystery

Main Story:

- gameplay-first
- Happy End
- permanent deathを主な泣かせ装置にしない
- Game Over = Reality deathではない
- Dreamには朝が来ない
- WakingでRealityへ戻る
- 日常蓄積から感動
- 異なる年代の知識 / 技能 / 関係がRealityの選択を変える

Mystery:

```txt
C-grade = Title1で払う
B-grade = Title1で意味が分かり後作で再読可能
A-grade = series OPEN
```

Open:

- Dream最終mechanism
- 星座増減の最終原因
- 星獣との最終関係
- 黒インク最終起源

Dreamであること自体はOpenへ戻さない。

---

# 12. 朔夜座 / 群青残響録

## 朔夜座

Current formal name: **朔夜座（さくやざ）**

8member:
ナシロ / アサトジ / ミチグレ / オリネ / ハクマ / ツグリ / ユラネ / ペタ。

- 八影 = early observer label
- 朔盟 = Superseded Candidate / legacy authored assets
- stable IDs / pair / relation / deep profileは保持

## 群青残響録

> 各時代の大事件で中心となった人物 / 人物群を、後から一つの記録名で括ったもの。

Not fixed:

- 人数
- 1時代1人
- 敵組織
- 戦闘Boss
- 善悪
- 朔夜座との上下

正式member / 名前 / exact incidentはHuman decision前にLOCKしない。

---

# 13. Stage / Enemy

Stage authority:
- `src/game/data/stageProductionDatabase.ts`

Current:

- gameplay identity 20/20
- exact wave / combat Boss / difficulty / launch count OPEN
- **大事件中心人物が必ずStage combat Bossになるとは限らない**
- Stage16–19 production seedとCurrent Shadowを推測で直接LOCKしない

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

---

# 14. Play experience

Run conceptual flow:

```txt
weak
→ choice
→ build identity
→ pressure
→ alternate answer
→ Evolution / 黒耀化
→ completed build
→ Result / Waking
```

既存runtimeが`Dawn` tokenを持つ場合はmigration対象であり、Story physical dawnを意味しない。

First Run:
- first 10 secondsで移動
- auto attackを体験で理解
- tutorial modalを増やさない
- Resultからsecond run hook

Difficulty:
- HP sponge first禁止
- Main StoryをHard gateしない

Meta:
- core currency原則1family
- raw powerよりplay variety
- Bondをcurrencyで買わない
- daily / FOMO / staminaなし

Postgame:
- Main Endingは本編で完結
- mastery / challenge / alternate build
- 100% celebrationはDream物理朝を発生させない

---

# 15. Runtime foundation status

Implemented foundation:

- stable object registry 126
- migration ledger
- 21 object read models
- 2 lost-item compatibility rows
- Stage1 25-cell compatibility layer
- Collection save v2 draft
- all-lights fail-closed evaluator
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
- completion Scene / art / music / cosmetic / remix mode are not final

DefinitionだけでREADY扱いしない。

---

# 16. Mandatory routing

## Story / World

```txt
00-current-story-world-master
→ CANON / WORLD
→ World Foundation
→ Conflict Register / Human Decision Queue
→ Story / Character / Stage / Enemy lower docs
```

## Gameplay

```txt
CANON
→ Game Core
→ GAME-DESIGN
→ PLAY-EXPERIENCE
```

## Character

```txt
CANON
→ CHARACTERS
→ character-book-v4
→ deep / voice / relation
→ CHARACTER-STORY-INTEGRATION
```

## Named Object

```txt
CANON
→ NAMED-OBJECT-CONNECTIONS
→ luminous item / Clear Getter
→ runtime foundation
```

## Runtime

```txt
CANON
→ 181-current-production-canon
→ source / Unity
→ evidence / checker
```

---

# 17. Status labels

- `DECIDED` — User決定 / highest authority
- `CORE / CURRENT` — game identity
- `CANON / CURRENT` — design前提
- `CURRENT-DIRECTION` — exact detail Open
- `DEFINITION FOUNDATION` — data/type foundation、runtime未接続可
- `USER IDEA` — 保存し育てる
- `CANDIDATE` — 強いが未LOCK
- `OPEN` — 答えを急がない
- `SUPERSEDED` — 過去案。Currentへ戻さない
- `LEGACY` — compatibility / history

---

# 18. Runtime readiness boundary

Design docsだけで以下をtrueにしない:

- physicalDeviceReady
- devicePlayableReady
- audioReady
- hapticReady
- mobileMetricsReady
- rcReady
- productionApproved
- collectionSaveV2Connected
- globalConstellationReady
- allLightsMorningReady

`allLightsMorningReady`等に旧Morning語が残っていてもstable runtime flagとして扱い、Story ruleを逆流させない。

---

# 19. Current state

> **Character / Story / Enemy / Stage / Object / World Bibleの土台に、朝の来ないDream、Waking、年代差星座、月相depth、朔夜座、非固定Boss型の群青残響録、Android / 動物ruleを最上位Authorityとして重ねた。今後は旧Dawn / 朔盟 / 同一星座前提をstable資産を壊さず下流から順次migrationする。**

---

# 20. Update rule

```txt
new idea
↓
00-current-story-world-master照合
↓
DECIDED / CANDIDATE / OPEN
↓
matching Hub
↓
conflict check
↓
stable ID preservation
↓
Human decision when required
↓
machine-readable source同期
```

Master変更は明示的User decisionのみ。
