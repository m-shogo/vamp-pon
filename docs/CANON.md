# ヨルノシルベ Canon Hub

Date: 2026-07-29  
Status: **CURRENT HUMAN / AI DESIGN ENTRYPOINT**

> ヨルノシルベを考える時は最初にここを見る。repo全体から過去資料を毎回掘り直さない。
>
> **Design Current、Runtime Implemented、Device Verified、Release Readyを混同しない。**

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

---

# 4. Current domain entrypoints

| Domain | First read |
| --- | --- |
| Game identity | `game-core-book-v1.md` |
| Design coverage | `GAME-DESIGN.md` |
| Play experience | `PLAY-EXPERIENCE.md` |
| Character/Story integration | `CHARACTER-STORY-INTEGRATION.md` |
| Named object / item lineage | `NAMED-OBJECT-CONNECTIONS.md` |
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

> **名前のある物は、人物・Stage・Gameplay・Enemy・星図・記録・関係・黒耀化・夜明けのうち最低3方向以上へつなぐ。**

固有名詞を飾りで終わらせない。

Every named object needs:

- stable ID
- display name / status
- type
- owner / keeper
- first appearance
- gameplay verb
- motif lane
- enemy connection
- Clear Getter connection
- archive connection
- relation connection
- black-youka distortion
- dawn state
- evolution lineage

全部をPlayerへ同時表示する必要はない。
制作memoryでは失わない。

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
Reserve Ren            = partial
```

Current21 luminous possessions:

- `character-luminous-personal-item-book-v1.md`

Same display nameが複数categoryへ出る場合:

1. same object / phase changeとしてlineageを明示
2. accidental collisionならHuman Naming Reviewで改名

文字列一致だけで後から同一物設定を捏造しない。

---

# 8. Clear Getter / 100%

```txt
灯録
└ 夜明け星図
   └ 星座群
      └ 記憶のしるし
```

夜明け星図はachievement checklistではなく、人物・物・敵・Stage・関係の線を可視化するClear Getter。

100% exact direction:

## **全灯の朝**

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

---

# 9. 黒耀化

Common name:

**黒耀化**

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

光る持ち物も黒耀化で別物へ交換せず、同じ長所が歪む。

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
- `kage1..4` mappingを証拠なく決めない

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

# 13. Known stale/runtime gaps

2026-07-29 audit:

- `collectionProgress.ts` = Stage1 25-cell prototype only
- old enemy labels / `黒曜化` display textあり
- `keeperRecords.ts` = 5/21、旧Character coreあり
- `lostItemRecords.ts` = 6 entries、旧Nagi/Michiru bindingあり
- same-name item lineage runtime schemaなし
- global constellation saveなし
- `全灯の朝`未実装

Design Currentだけで修正済みとは扱わない。

Audit:

- `named-object-clear-getter-audit-2026-07-29.md`

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

## Named Object / Clear Getter

```txt
CANON
→ NAMED-OBJECT-CONNECTIONS
→ luminous item book / Clear Getter master
→ production data only when implementing
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
- **USER DIRECTION** — user明示
- **USER IDEA** —保存し育てる
- **HIGH-VALUE CANDIDATE** —強いが未LOCK
- **OPEN QUESTION** —答えを急がない
- **LEGACY** —履歴

---

# 16. Runtime readiness boundary

Design docsだけで以下をtrueにしない:

- physicalDeviceReady
- devicePlayableReady
- audioReady
- audioLatencyMeasured
- hapticReady
- hapticMeasured
- mobileMetricsReady
- rcReady
- productionApproved

U49/U50/U51 authorityはproduction/runtime docsとevidenceを使う。

---

# 17. Current state in one sentence

> **Character・Story・Enemy・20Stage・Play Experienceに加え、名前のある物・Current21の光る持ち物・Clear Getter・100%祝祭までCurrent骨格を一本化した。次は古いcollection/keeper/lost-item dataを安全にmigrationし、Stage1から実機とHuman playtestで証明する。**

---

# 18. Update rule

```txt
new idea / new named object
↓
matching Hubへ保存
↓
Game Coreとの衝突確認
↓
connection cardを作る
↓
CandidateならCandidateのまま
↓
Human decision / implementation need
↓
Current masterへ昇格
↓
CANON / index同期
```

Game Core変更は明示的Human decisionとして扱う。
