# ヨルノシルベ Canon Hub

Date: 2026-07-29  
Status: **CURRENT HUMAN / AI DESIGN ENTRYPOINT**

> ヨルノシルベを考える時は最初にここを見る。repo全体から過去資料を毎回掘り直さない。
>
> このHubは「何を読むか」と「何をまだ決めていないか」を管理する。Design CurrentとRuntime Readyは別。

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
├ CHARACTERS.md / RELATIONSHIPS.md / FUTURE-CAST.md
├ STORY.md
├ ENEMIES.md
└ 181-current-production-canon.md
```

## Game Core

`docs/game-core-book-v1.md`

覚える:
- ヴァンサバ系1runの爽快感
- buildを作る楽しさ
- Meta Loop
- Clear Getter / 夜明け星図
- Support / Bond
- 黒耀化risk/reward
- fail-forward
- 情報はGameplayの副作用
- Happy End

具体数値やMain Mystery最終回答を固定する本ではない。

---

# 2. Two cross-domain hubs

## Play Experience

`docs/PLAY-EXPERIENCE.md`

対象:
- Combat / Run pacing
- Stage Encounter 1〜20
- First Run
- Mobile Control
- Difficulty
- Meta Economy
- Postgame
- Audio / Haptic creative
- Accessibility
- Fun / Balance Playtest

## Character / Story / Gameplay Integration

`docs/CHARACTER-STORY-INTEGRATION.md`

対象:
- Current21
- Future15 separation
- voice / relation
- 黒耀化
- rescue
- Enemy pressure
- Stage placement
- Dawn payoff
- story/gameplay payoff

---

# 3. Shared memory books

| Book | File | Role |
| --- | --- | --- |
| Character Book | `docs/character-book-v4.md` | 誰が誰かをすぐ戻す |
| Story Book | `docs/story-book-v1.md` | 物語 / Mystery / Happy Endを戻す |
| Idea Book | `docs/idea-book-v1.md` | 未確定だが忘れたくない案を保存 |

**Idea BookにあるだけではCANONではない。**

覚える ≠ 決める。

---

# 4. Current domain entrypoints

| Domain | First read | Purpose |
| --- | --- | --- |
| Game identity | `game-core-book-v1.md` | Run / Meta / Attachment Core |
| Design coverage | `GAME-DESIGN.md` | Design済み / evidence未完の境界 |
| Play experience | `PLAY-EXPERIENCE.md` | 触って面白いゲームとしての統合routing |
| Character/Story integration | `CHARACTER-STORY-INTEGRATION.md` | 人物設定をGameplay/Enemy/Dawnへ接続 |
| Character | `CHARACTERS.md` | Current21 routing |
| Character summary | `character-book-v4.md` | 21人の即時理解 |
| Character depth | `character-deep-core-book-v1.md` | 核 /矛盾 /成長 |
| Voice / dialogue | `character-dialogue-relationship-book-v1.md` | 口癖 / Bond delta / interaction |
| Relationship | `RELATIONSHIPS.md` | relation coverage / arc routing |
| Future cast | `FUTURE-CAST.md` | Future15 candidate pool |
| Bond / Support | `BOND.md` | Gameplay-first relation growth |
| 黒耀化 | `BLACK-YOUKA.md` | system / wrong arrival |
| 黒耀化 rescue | `character-black-youka-rescue-book-v1.md` | 21人の戻る選択肢 |
| Story | `STORY.md` | Main / Character Mystery / Happy End |
| Main beats | `story-main-beat-sheet-v1.md` | Main Story spine |
| Enemy | `ENEMIES.md` | Current48 / semantic / legacy routing |
| Stage1–5 encounter | `STAGE-ENCOUNTER-DESIGN.md` | Core5 Stage gameplay identity |
| Stage6–20 encounter | `stage-encounter-expansion-06-20-v1.md` | remaining production stages |
| Combat / Run | `COMBAT-RUN-DESIGN.md` | 1run growth / pressure / power spike |
| First Run | `FIRST-RUN-EXPERIENCE.md` | first launch→second run hook |
| Mobile Control | `MOBILE-CONTROL-EXPERIENCE.md` | floating-anchor drag / physical tuning |
| Difficulty | `DIFFICULTY-AND-PLAYER-AIDS.md` | pressure-based difficulty |
| Meta Economy | `META-ECONOMY-DESIGN.md` | currency / source-sink / anti-grind |
| Postgame | `POSTGAME-ENDGAME-DESIGN.md` | mastery / challenge / optional completion |
| Audio/Haptic creative | `AUDIO-HAPTIC-DIRECTION.md` | quiet-night sound/haptic hierarchy |
| Accessibility | `ACCESSIBILITY-BASELINE.md` | minimum multimodal baseline |
| Fun/Balance | `FUN-BALANCE-PLAYTEST.md` | Human observation / telemetry framework |
| Meta / Archive | `GAMEPLAY-META-PROGRESSION.md`, `PROGRESSION-ARCHIVE.md` | unlock / fail-forward / 灯録 |
| Production / Runtime | `181-current-production-canon.md` | Unity production authority |

---

# 5. Current character state

## Current21

Roster:
- Core5: ユイ / アサ / ナギ / ミチル / トモリ
- Circle10: セン / リツ / コヨリ / ゲン / ハナ / ユウビ / マドカ / シロ / トバリ / ネム
- Shadow5: クロオリ / カナメ / カスミ / トキ / ツムギ
- Reserve: レン

Current rules:
- Current21 = 20 + reserve 1
- ユイ×アサ = 主人公級バディ / non-romance
- リツ×コヨリ = 兄妹 / non-romance
- 現実では同時代とは限らない
- 物 / 記録 / 言葉は時代を渡れる
- 全員を血縁 /昔からの知人にしない
- 夜で初めて生まれる友情を残す
- 黒耀化 = 外部悪人格ではない
- rescue = 仲間が治すのではなく本人の選択肢を増やす
- relation coverage >=2 = 21/21
- Dawn proof = 21/21

## Future15

Future pool:
- ヒヨリ
- セリカ
- クロエ
- レンジ
- トウマ
- クウ
- ヨモ
- ノア
- ルム
- マキ
- スズ
- イオ
- カイ
- ナオ
- アマネ

Rules:
- Future15はCurrent21ではない
- sequel15人全追加を意味しない
- relation/story reservoir = 15/15
- representationを人物の唯一のCoreにしない
- exact era / romance / final rosterはHuman decision前にLOCKしない

不老魔女Candidateの弟子関係は、純師弟 / 家族 / 友情 / adult romance / 結婚 / 子ども / 別離 / 再会など複数形を取り得る。全弟子が恋愛対象という意味ではない。

---

# 6. Relationship / voice rule

詳細:
- `RELATIONSHIPS.md`
- `character-relationship-arc-book-v1.md`
- `character-dialogue-relationship-book-v1.md`
- `character-voice-differentiation-guardrails-v1.md`
- `character-ensemble-daily-scene-bank-v1.md`

Core rule:

> Bondが高い = 全員タメ口 / 告白 / 仲良し化、ではない。

信頼が上がるほど:
- 説明が減る
- 確認が減る
- 頼れる
- 任せられる
- 弱音を言える

思想差は残ってよい。

---

# 7. 黒耀化 rule

Common name:

**黒耀化**

`黒曜化`は新規canonで使わない。

Meaning:

```txt
本人の長所
+ 恐怖 / 焦り
→ 一方向へ極端化
→ wrong arrival
→ 圧倒的power
→ 視野狭窄
```

成長後:
- 同じ力を捨てない
- Timingを選ぶ
- 他人の選択を残す
- Support/Bondと共存
- 止める判断もできる

ユイの`黒灯化`以外の固有呼称は多くがWorking。

---

# 8. Story / mystery rule

Main Story:
- gameplay-first
-正史はHappy End
- permanent deathを主な泣き装置にしない
- Game Over = 死亡ではない
- 日常の蓄積から感動を作る

Mystery lanes:

## C-grade — 1で払う
- Core5 emotional answers
- クロオリが単純悪でない
- 黒耀化が本人の一部
- 別時代の人が夜で接続する
- 朝へ帰れるHappy End

## B-grade — re-reading可能
- ランタン継承
- ユイ/トモリ獅子共鳴
- クロオリの預かり物

## A-grade — series OPEN
- 夜の完全な正体
- 星獣の完全原理
- 夜を作った存在 /理由

A-gradeを残すためC-gradeまで曖昧にしない。

---

# 9. Stage rule

Production identity authority:
- `src/game/data/stageProductionDatabase.ts`

Current design:
- Stage gameplay identity 20/20
- Stage1〜5 = Core5 Narrative Spine
- Stage6〜15 = Circle/season seed gameplay identities
- Stage16〜19 = Shadow seed mechanics
- Stage20 = Core5 integrated recall

Important OPEN:
- exact wave values
- final Boss assignments
- shadow `kage1..4` → Current identity mapping
- final difficulty values
- launch stage count

Do not infer `kage1..4` mapping without Human/current production evidence.

---

# 10. Enemy rule

Authority order:

```txt
ENEMIES.md
→ src/game/data/enemyProductionDatabase.ts
→ enemies/omb-ombro-selected-direction.md
→ detail reservoir if needed
```

Current48 identity is production authority。

Enemy ontology direction:

```txt
ordinary object / trace
→ wrong reading
→ gameplay verb
→ telegraph
→ counter
→ released clue
→ re-reading
```

Defeat = kill loreではなく**ほどく**。

禁止:
- 全敵を死者の魂
- 全敵を一人のtrauma
- 旧Enemy名をCurrentへ自動復活

---

# 11. Play experience rules

## Run

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

Stage1 existing 8min baselineはplaytest reference。
Final balanceは未LOCK。

## First Run
- first 10 secondsで移動
- auto attackを体験で理解
- tutorial modalを増やさない
- first Resultからsecond run hook

## Mobile
- current floating-anchor dragを正式方向
- physical-device comfortは未証明

## Difficulty
- HP sponge first禁止
- Main StoryをHard gateしない

## Meta
- core currency原則1family
- raw powerよりplay variety
- Bondをcurrencyで買わない
- daily/FOMO/staminaなし

## Postgame
- Main Endingは本編で完結
- postgameはmastery/challenge/alternate build
- 100% True Ending hostage禁止

---

# 12. Accessibility / audio boundary

Accessibility baseline:
- color only禁止
- audio only禁止
- haptic only禁止
- motion only禁止
- reduced motion
- touch target / typography baseline
- semantic order

Audio/Haptic:
- quiet night
- micro reward
- hapticをrare resourceとして使用
- U49 technical readinessとは別

---

# 13. Gameplay-first invariant

ヨルノシルベは資料閲覧ゲームではない。

```txt
戦う
→ build
→ 強くなる
→違うCharacter / Support /条件
→達成 / Meta
→また戦う
```

Loreはplayの副作用。

読まないPlayerもMain Game / Main Story完走可能。

---

# 14. Mandatory routing

## Gameplay / feel

```txt
CANON
→ Game Core
→ GAME-DESIGN
→ PLAY-EXPERIENCE
→必要master 1つ
```

## Character

```txt
CANON
→ CHARACTERS
→ character-book-v4
→ deep core / voice / relationship as needed
→複数domainなら CHARACTER-STORY-INTEGRATION
```

## Future cast

```txt
CANON
→ FUTURE-CAST
→ future-cast-profile-book-v1
→ future-cast-relationship-story-reservoir-v1
```

## Enemy

```txt
CANON
→ ENEMIES
→ production enemy DB
→ encounter master if needed
```

## Story

```txt
CANON
→ Game Core
→ STORY
→ story-book-v1
→ main beat / Stage placement if needed
```

Legacyはmigration/history監査以外で最初に読まない。

---

# 15. Status labels

- **CORE / CURRENT** — game identity
- **CANON / CURRENT** — design前提
- **CURRENT-DIRECTION** —方向Current、exact tuning open
- **USER DIRECTION** — user明示
- **USER IDEA** — 記憶し育てる
- **HIGH-VALUE CANDIDATE** — 強いが未LOCK
- **OPEN QUESTION** —答えを急がない
- **LEGACY** —履歴

Main Mysteryの具体回答はHuman decision前にCanonへ昇格しない。

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

# 17. Current project state in one sentence

> **Character・Story・Enemy・Run・20Stage・First Run・Mobile Control・Difficulty・Meta・Postgame・Audio・Accessibilityまで主要設計masterは揃った。次の主戦場は新設定追加ではなく、Stage1を起点にruntimeへ必要分だけ接続し、実機とHuman playtestで「もう1runしたい」を証明すること。**

---

# 18. Update rule

```txt
new idea
↓
matching Book / Hubへ保存
↓
Game Coreと衝突確認
↓
CandidateならCandidateのまま
↓
Human decision / implementation need
↓
Current masterへ昇格
↓
CANON / routing同期
```

Game Core自体の変更は、普通のIdea昇格ではなく明示的Human decisionとして扱う。