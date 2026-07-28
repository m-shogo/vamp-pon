# ヨルノシルベ Canon Hub

Date: 2026-07-29  
Status: **CURRENT HUMAN / AI DESIGN ENTRYPOINT**

> ヨルノシルベについて考える時は、最初にこのファイルを見る。  
> repo全体から過去資料を毎回掘り直さない。

---

# 1. 最上位 — Game Core Book

まず読む:

- **`docs/game-core-book-v1.md`** — 何を遊ぶゲームか / 何を絶対に見失わないか
- **`docs/GAME-DESIGN.md`** — どの設計がCurrent / Partial / Proposed / Openか

Game Core BookはCharacter / Story / Ideaより上位のgame identity master。

ここで覚える:

- ヴァンサバ系1runの爽快感
- buildを作る楽しさ
- 周回で遊び方が増えるMeta Loop
- Clear Getter / 夜明け星図
- Support / BondがGameplayへ返る
- 黒耀化が危険だが強い選択
- fail-forward
- 情報はGameplayの副作用
- Happy Endを含むEmotional Core

具体数値・全設定・Main Mysteryの最終回答まで固定する本ではない。

---

# 2. 3冊の共有記憶 + Integration Hub

Game Coreを理解した上で使う。

| Book | File | 役割 |
| --- | --- | --- |
| **Character Book** | `docs/character-book-v4.md` | 誰が誰か、関係、成長、星獣、年代差をすぐ戻す |
| **Story Book** | `docs/story-book-v1.md` | 物語、謎、Happy End、続編余地を戻す |
| **Idea Book** | `docs/idea-book-v1.md` | 会話で出た大事な案を早く固定せず覚える |
| **Character / Story Integration** | `docs/CHARACTER-STORY-INTEGRATION.md` | Character・関係・黒耀化・Enemy・Stage・Dawnを一つの作品として追う |

さらにCharacterを深く扱う時:

- `docs/character-deep-core-book-v1.md` — 21人の人生の核 / 矛盾 / 黒耀化 /成長 /関係
- `docs/character-dialogue-relationship-book-v1.md` — Current21の声 / 口癖 / 仲間との会話 + Future15のvoice seed
- `docs/character-black-youka-rescue-book-v1.md` — Current21が黒耀化から「別の選択肢」を得る構造
- `docs/character-dawn-proof-book-v1.md` — 成長を夜明け後の日常の小さい差で見せる

`character-book-v3.md` はv4によりsuperseded。通常参照しない。

```txt
Game Core Book
= 何を遊ぶゲームか

Character Book v4
= 誰と遊ぶか

Character Deep Core
= なぜその人を好きになり、どう歪み、どう成長するか

Character Dialogue / Relationship Book
= その人がどう喋り、誰といる時に何が変わるか

Character / Story Integration
= 人物の長所が戦闘・関係・黒耀化・敵・周回・夜明けでどう同じ根を持つか

Story Book
= 遊んだ時間にどんな意味が残るか

Idea Book
= まだ決めていないが忘れたくない可能性
```

**Idea BookにあるだけではCANONではない。**
一方で未確定だから忘れてよいとも扱わない。

---

# 3. Current domain entrypoints

| Domain | First read | Purpose |
| --- | --- | --- |
| Game identity / Core | `docs/game-core-book-v1.md` | Run / Meta / Attachment loop |
| Design completeness | `docs/GAME-DESIGN.md` | Gap / Current / Partial / Open |
| Character / Story integration | `docs/CHARACTER-STORY-INTEGRATION.md` | 36人物候補 / 関係 / 黒耀化 / Stage / Enemy / Dawnの横断routing |
| Character | `docs/CHARACTERS.md` | Current21 /人物 /年代差 /関係 routing |
| Character summary | `docs/character-book-v4.md` | 21人をすぐ理解 |
| Character depth | `docs/character-deep-core-book-v1.md` | 人生の核 /矛盾 /黒耀化 /成長 |
| Character voice / relationship | `docs/character-dialogue-relationship-book-v1.md` | 口癖 /会話 /Bond差分 /関係lane /Future voice seed |
| Relationship | `docs/RELATIONSHIPS.md` | Current21 relation coverage / arc routing |
| Future cast | `docs/FUTURE-CAST.md` | Future15 profile / representation / series pool |
| Bond / Support | `docs/BOND.md` | 同行 /関係成長 /連携強化 |
| 黒耀化 | `docs/BLACK-YOUKA.md` | 共通system /もう一つの自分 /固有呼称 |
| 黒耀化 rescue | `docs/character-black-youka-rescue-book-v1.md` | 21人の戻り方 / safe mastery / Support差 |
| Enemy / Kagemono | `docs/ENEMIES.md` | Current48 /敵の意味 /legacy統合 /Boss方向 /production routing |
| Stage1–5 Encounter | `docs/STAGE-ENCOUNTER-DESIGN.md` | Story questionをEnemy pressure /別buildへ変換 |
| Gameplay / Meta | `docs/GAMEPLAY-META-PROGRESSION.md` | 永続強化 /achievement /fail-forward |
| Achievement / Archive | `docs/PROGRESSION-ARCHIVE.md` | 灯録 /夜明け星図 /任意情報 |
| Story / Mystery | `docs/STORY.md` | Main /Character Mystery /Happy End /続編 |
| Main Story beats | `docs/story-main-beat-sheet-v1.md` | Stage1〜5のMain Story候補 / C-B-A mystery debt |
| Story/Game logic | `docs/STORY-ENGINE.md` | Gameplayと世界法則の接続 |
| Production / Runtime | `docs/181-current-production-canon.md` | Unity /production正本 |

---

# 4. Character detail masters

Character Hubから必要時だけ読む。

- `docs/character-book-v4.md` — Current人物理解master
- `docs/character-deep-core-book-v1.md` — Deep Core master
- `docs/character-dialogue-relationship-book-v1.md` — 口癖 / base voice / Bond delta / Crisis delta / pair dialogue
- `docs/RELATIONSHIPS.md` — Current21 relationship entrypoint
- `docs/character-relationship-arc-book-v1.md` — relationをFirst read→Dawnまで育てる
- `docs/character-black-youka-rescue-book-v1.md` — 黒耀化で仲間が増やす別の選択肢
- `docs/character-dawn-proof-book-v1.md` — 21人の小さなHappy End proof
- `docs/character-story-gameplay-payoff-matrix-v1.md` — Character設定をGameplay / Enemy / Clear Getterへ返す
- `docs/character-personal-profile-canon-v1.md` — 誕生日 /好物 /趣味
- `docs/character-star-beast-constellation-canon-v1.md` — 星座 /星獣 /由来
- `docs/character-silhouette-diversity-current-canon-v1.md` — 体型 /年齢感 /眼鏡
- `docs/CHARACTER-LIFE-AND-SPEECH.md` — 日常 /癖 /怒り /嘘 /呼び方の共通原則
- `docs/BOND.md` — Gameplay-first relationship progression
- `docs/BLACK-YOUKA.md` — 黒耀化
- `docs/story-temporal-layer-and-character-connections-v1.md` — 別時代 /夜の時間層
- `docs/character-connection-web-high-value-candidates-v1.md` — 物 /思想 /年代差のconnection
- `docs/character-long-lived-witch-arc-v1.md` — 不老魔女Candidate
- `docs/FUTURE-CAST.md` — Future15 entrypoint
- `docs/future-cast-relationship-story-reservoir-v1.md` — Future15のrelation / gameplay / payoff reservoir
- current `src/game/data/*` — production/runtime data

### Important current character directions

- Current roster = 20 + reserve 1
- ユイ×アサ = 主人公級バディ、恋愛なし
- リツ×コヨリ = 兄妹、恋愛なし
- Current人物は現実では必ずしも同時代ではない
- 人は別時代でも物 / 言葉 / 記録が現実時間を渡れる
- 黒耀化 = 外部悪人格ではなく「もう一つの自分 / 間違った到達」
- 黒耀化救出 = 仲間が本人を治すのでなく、本人が戻るための選択肢を増やす
- 全員を血縁 /昔からの知人にしない
- ヨルノシルベで初めて作る友情を必ず残す
- 深み = 全員へ同じ悲劇を盛ることではない
- Current21 relation design coverage = 21/21 with >=2 distinctive lanes
- Future15は15/15 relationship/story reservoirを持つがCurrent21へ昇格しない

### Future不老魔女

旧「弟子との恋愛なし」は撤回済み。

Current Candidateでは長い人生の中で複数の弟子と:

- 純粋な師弟
- 家族
- 親友
- adult romance
- 結婚
- 子ども
- 別離
- 再会

など異なる関係を経験し得る。

全弟子が恋愛対象という意味ではない。

---

# 5. Story detail masters

Story Bookから必要時だけ読む。

- `docs/story-book-v1.md`
- `docs/story-main-beat-sheet-v1.md`
- `docs/story-stage-character-relationship-placement-v1.md`
- `docs/STAGE-ENCOUNTER-DESIGN.md`
- `docs/STORY-ENGINE.md`
- `docs/story-ending-sequel-architecture-v1.md`
- `docs/story-foreshadowing-payoff-map-v1.md`
- `docs/story-backbone-high-value-candidates-v1.md`
- `docs/story-temporal-layer-and-character-connections-v1.md`
- `docs/PROGRESSION-ARCHIVE.md`

Main Mysteryの強いCandidateもHuman decision前に最終正史へLOCKしない。

Stage1〜5のCore spineは:

```txt
Stage1 ユイ   = 戻す
Stage2 アサ   = 名前
Stage3 ナギ   = 守る
Stage4 ミチル = 道
Stage5 トモリ = 直す
```

をCurrent production directionとして使う。
Exact dialogue / Boss assignment / wave値は別途review前にLOCKしない。

---

# 6. Idea memory

`docs/idea-book-v1.md` は共有記憶。

代表:

- クリアゲッター
- 読む人 /読まない人
- Happy End
- 非現実空間だから成立する別れと救い
- 日常蓄積からの涙
- 再解釈型伏線
- optional report
- 仲間Support / Bond
- 不仲Pair gameplay
- 黒耀化個別呼称
- 星獣
- 集合TOP
- ギャル /お嬢様 /不老魔女
- ヨルノシルベ2への余白

```txt
会話でIdea
↓
Book / matching Current memoryへ保存
↓
Game Coreと衝突確認
↓
まだ案ならIdea / Candidateのまま育てる
↓
Human decision /実装上の必要
↓
確定した時だけCanonへ昇格
```

**覚える ≠ 決める。**

---

# 7. Canon layers

```txt
docs/CANON.md
├ game-core-book-v1.md
├ GAME-DESIGN.md
├ CHARACTER-STORY-INTEGRATION.md
│  ├ character-black-youka-rescue-book-v1.md
│  ├ story-stage-character-relationship-placement-v1.md
│  ├ story-main-beat-sheet-v1.md
│  ├ STAGE-ENCOUNTER-DESIGN.md
│  ├ character-dawn-proof-book-v1.md
│  ├ character-story-gameplay-payoff-matrix-v1.md
│  └ character-story-integration-audit-2026-07-29.md
├ character-book-v4.md
│  └ character-deep-core-book-v1.md
├ story-book-v1.md
├ idea-book-v1.md
├ CHARACTERS.md
│  ├ CHARACTER-LIFE-AND-SPEECH.md
│  ├ character-dialogue-relationship-book-v1.md
│  ├ RELATIONSHIPS.md
│  ├ BOND.md
│  ├ BLACK-YOUKA.md
│  ├ story-temporal-layer-and-character-connections-v1.md
│  ├ character-connection-web-high-value-candidates-v1.md
│  └ character-long-lived-witch-arc-v1.md
├ FUTURE-CAST.md
│  ├ future-cast-profile-book-v1.md
│  └ future-cast-relationship-story-reservoir-v1.md
├ ENEMIES.md
│  ├ src/game/data/enemyProductionDatabase.ts
│  ├ docs/enemies/omb-ombro-selected-direction.md
│  ├ enemy-encounter-relationship-pressure-v1.md
│  ├ enemy-ecology-and-encounter-recipes-v1.md
│  └ kagemono-collection-entry-book-v1.md
├ GAMEPLAY-META-PROGRESSION.md
│  └ PROGRESSION-ARCHIVE.md
├ STORY.md
│  ├ STORY-ENGINE.md
│  ├ story-ending-sequel-architecture-v1.md
│  └ story-foreshadowing-payoff-map-v1.md
└ 181-current-production-canon.md
```

`docs/180-unified-character-canon.md` とcurrent `src/game/data/*` はproduction-facing canonical dataとして保持。

Legacy移行状況:
- `docs/legacy-design-migration-2026-07-28.md`

移植済み資料は通常読まない。

---

# 8. Mandatory read policy

## 企画 / 会話

```txt
1. docs/CANON.md
2. docs/game-core-book-v1.md
3. docs/GAME-DESIGN.md
4. Character / Story / Enemy / Ideaの必要Book
5. 複数domainを跨ぐなら docs/CHARACTER-STORY-INTEGRATION.md
6. 必要ならdomain master
```

## Character

```txt
CANON
→ CHARACTERS
→ character-book-v4
→ deep workなら character-deep-core-book-v1
→ voice / interactionなら character-dialogue-relationship-book-v1
→ Story / 黒耀化 / Enemyまで跨ぐなら CHARACTER-STORY-INTEGRATION
```

## Future Character

```txt
CANON
→ FUTURE-CAST
→ future-cast-profile-book-v1
→ future-cast-relationship-story-reservoir-v1
```

Future15をCurrent21へ自動昇格しない。

## Enemy / Kagemono

```txt
CANON
→ ENEMIES
→ current identityが必要なら src/game/data/enemyProductionDatabase.ts
→ visual familyなら docs/enemies/omb-ombro-selected-direction.md
→ encounterなら STAGE-ENCOUNTER-DESIGN / enemy-ecology-and-encounter-recipes-v1.md
→ mechanic detailだけ必要なら data/enemy-assets/enemy-design-*.json
```

旧Enemy Bible /旧50体 /旧Stage別nameをCurrent identityへ戻さない。

## Story

```txt
CANON
→ Game Core
→ STORY
→ story-book-v1
→ Main Stageなら story-main-beat-sheet-v1 / story-stage-character-relationship-placement-v1
```

## 「前にこういうIdea話したよね？」

```txt
CANON
→ Game Coreとの衝突確認
→ idea-book-v1 / matching Current Book
```

## Legacy例外

- migration ledgerにMIGRATION PENDINGの領域を一度だけ回収
- 過去の変更理由 /regression /history監査

禁止:

- repo-wide searchで最初にlegacyへ入る
- migrated legacyをCurrent根拠へ戻す
- character-book-v3をCurrentとして読む
- 古いキャラ名 /旧星獣 /旧用語を復活
- 旧Enemy名 /旧人物対応をCurrent enemy identityへ無断復活
- Current21とfuture candidateを混ぜる
- Ideaを勝手にCanonへ昇格
- 未確定を理由にIdeaを忘れる
- IdeaのためにGame Coreを無自覚に曲げる
- Character設定をGameplay / relation / payoffへ接続せず「秘密だから面白い」で増やす

---

# 9. Gameplay-first invariant

ヨルノシルベは資料閲覧ゲームではない。

```txt
戦う
→ buildする
→ 強くなる
→ 違うcharacter / Support /条件を試す
→ 達成 /永続成長
→ また戦う
```

情報はplayの副作用。

## 読まない人

- parameter /trait /機能が上がった
- 新buildが開いた
- 「ラッキー」でよい
- Main Game / Main Story完走可能

## 読む人

- characterをもっと好きになる
- 人物の過去 /日常
- 世界の観測記録
- 伏線 /矛盾
- sequelで意味が変わるSeed

**任意閲覧なら情報量は豊富でよい。**

---

# 10. Current terminology bridge

| Current | Meaning |
| --- | --- |
| 灯録 | 収集・記録Hub |
| 夜明け星図 | Clear Getter型達成盤 |
| 記憶のしるし | 星図上achievement |
| 灯し手の記録 | character /Bond /成長 /黒耀化 |
| カゲモノ図鑑 | enemy遭遇 /攻略 /背景 |
| 忘れ物絵札 | 灯具 /持ち物 /忘れ物 |
| 言葉の記録 | 会話 /短文 /関係変化 |
| 夜の観測記録 | Main Mystery optional report working label |
| 黒耀化 | 共通system名 |
| Character固有黒耀呼称 | 各人物固有名。多くはWorking |

---

# 11. Status labels

- **CORE / CURRENT** — game identity。変更は明示的Human decision
- **CANON / CURRENT** — 今後の設計前提
- **USER DIRECTION** — user明示の強い方向
- **USER IDEA** — 覚えて育てる
- **HIGH-VALUE CANDIDATE** — 強いが未LOCK
- **OPEN QUESTION** — 答えを急がない
- **LEGACY** — 履歴専用

Main Mysteryの具体的答えは整合が高くてもHuman decision前にCANONへ昇格しない。

---

# 12. Update rule

```txt
新しい大事なIdea
↓
Book / Current memoryへ記録
↓
Game Coreとの関係確認
↓
案ならIdea / Candidateのまま育てる
↓
確定した時だけdetail Current masterへ昇格
↓
Hub / CANON同期
```

Game Core自体を変える場合は普通のIdea昇格ではなく、**ゲーム中心を変えるHuman decision**として明示する。
