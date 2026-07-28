# ヨルノシルベ Canon Hub

Date: 2026-07-28  
Status: **CURRENT HUMAN / AI DESIGN ENTRYPOINT**

> ヨルノシルベについて考える時は、最初にこのファイルを見る。  
> repo全体から過去資料を毎回掘り直さない。

---

# 1. 最上位 — Game Core Book

まず読む:

- **`docs/game-core-book-v1.md`** — ヨルノシルベは何を遊ぶゲームか / 何を絶対に見失わないか

Game Core Bookは、Character / Story / Ideaより上位の**ゲーム identidade / core understanding master**。

ここで覚えるもの:

- ヴァンサバ系の1runの爽快感
- buildを作る楽しさ
- 周回で遊び方が増えるMeta Loop
- Clear Getter / 夜明け星図
- Support / BondがGameplayへ返ること
- 黒耀化が危険だが強い選択であること
- fail-forward
- 情報はGameplayの副作用であること
- Happy Endを含むEmotional Core

具体数値・全設定・Main Mysteryの最終回答まで固定する本ではない。

---

# 2. 3冊の共有記憶

Game Coreを理解した上で、次の3冊を同格の長期共有記憶として使う。

| Book | File | 役割 |
| --- | --- | --- |
| **Character Book** | `docs/character-book-v3.md` | 誰が誰か、関係、成長、日常、星獣をすぐ思い出す |
| **Story Book** | `docs/story-book-v1.md` | どんな物語か、何を救うか、謎、Happy End、続編をすぐ思い出す |
| **Idea Book** | `docs/idea-book-v1.md` | 会話で出た面白い案を、早く固定せず忘れない |

```txt
Game Core Book
= 何を遊ぶゲームか

Character Book
= 誰と遊ぶか

Story Book
= 遊んだ時間にどんな意味が残るか

Idea Book
= まだ決めていないが忘れたくない可能性
```

**Idea BookにあるだけではCANONではない。**

一方で、Idea Bookにある案を「決まっていないから忘れてよい」とも扱わない。

---

# 3. Current domain entrypoints

| Domain | First read | Purpose |
| --- | --- | --- |
| Game identity / Core | `docs/game-core-book-v1.md` | Run / Meta / Attachment loop、Core判断 |
| Character | `docs/CHARACTERS.md` | 21人、人物像、日常、星獣、関係 |
| Bond / Support | `docs/BOND.md` | 同行、関係成長、連携強化、安定/不安定ペア |
| 黒耀化 | `docs/BLACK-YOUKA.md` | 共通システム名、固有呼称、歪み、星獣反応 |
| Gameplay / Meta detail | `docs/GAMEPLAY-META-PROGRESSION.md` | 永続強化、achievement、fail-forward |
| Achievement / Archive | `docs/PROGRESSION-ARCHIVE.md` | 灯録、夜明け星図、記憶のしるし、任意情報 |
| Story / Mystery | `docs/STORY.md` | Main Mystery、Character Mystery、Happy End、続編 |
| Story/Game logic | `docs/STORY-ENGINE.md` | Gameplayと世界法則の接続、再解釈型伏線 |
| Production / Runtime | `docs/181-current-production-canon.md` | 現在のUnity / production正本 |

---

# 4. Character detail masters

Character Hubから必要時だけ読むCurrent detail:

- `docs/character-book-v3.md` — 人物理解master
- `docs/character-personal-profile-canon-v1.md` — 誕生日、好物、趣味、日常profile
- `docs/character-star-beast-constellation-canon-v1.md` — 星座 / 星獣 / 由来
- `docs/character-silhouette-diversity-current-canon-v1.md` — 体型 / 年齢感 / 眼鏡
- `docs/CHARACTER-LIFE-AND-SPEECH.md` — 日常、癖、怒り、嘘、呼び方 / 敬語
- current `src/game/data/*` — production/runtime data

---

# 5. Story detail masters

Story Bookから必要時だけ読む:

- `docs/story-book-v1.md` — Story理解master
- `docs/STORY-ENGINE.md` — GameplayとLoreの二重意味 / Story Engine Candidate
- `docs/story-ending-sequel-architecture-v1.md` — Happy End / 泣き / sequel architecture
- `docs/story-foreshadowing-payoff-map-v1.md` — Main Mystery / Character Mystery
- `docs/PROGRESSION-ARCHIVE.md` — optional report / 灯録

---

# 6. Idea memory

`docs/idea-book-v1.md` は正本仕様書ではなく**共有記憶**。

代表的に保存するもの:

- クリアゲッター
- 読む人 / 読まない人
- Happy End
- Little Busters!的な非現実空間の救い
- CLANNAD的な日常蓄積からの涙
- ヤバタニエン的な再解釈伏線
- アンセムレポート的な任意資料
- 仲間Support / Bond
- 不仲ペアのGameplay
- 黒耀化個別呼称
- 星獣
- 集合TOP
- ギャル / お嬢様 / 魔女と弟子
- ヨルノシルベ2への余白

## Idea → Canon

```txt
会話でアイディアが出る
↓
Idea Bookまたは該当Bookへ保存
↓
既存Core / Currentと比較しながら育てる
↓
Human decisionまたは実装上の必要性
↓
確定した時だけCurrent masterへ昇格
```

**「覚える」と「決める」は別。**

---

# 7. Canon layers

## CURRENT / SHARED MEMORY

```txt
docs/CANON.md
├ game-core-book-v1.md
├ character-book-v3.md
├ story-book-v1.md
├ idea-book-v1.md          ← shared memory; individual entries may be non-canon
├ docs/CHARACTERS.md
│  ├ CHARACTER-LIFE-AND-SPEECH.md
│  ├ BOND.md
│  └ BLACK-YOUKA.md
├ docs/GAMEPLAY-META-PROGRESSION.md
│  └ PROGRESSION-ARCHIVE.md
├ docs/STORY.md
│  ├ STORY-ENGINE.md
│  ├ story-ending-sequel-architecture-v1.md
│  └ story-foreshadowing-payoff-map-v1.md
└ docs/181-current-production-canon.md
```

`docs/180-unified-character-canon.md` とcurrent `src/game/data/*` はproduction-facing canonical dataとして保持する。

## LEGACY SOURCE

移行状況:

- `docs/legacy-design-migration-2026-07-28.md`

移植済み資料は通常作業では読まない。

---

# 8. Mandatory read policy

## 企画 / 会話を続ける時

```txt
1. docs/CANON.md
2. docs/game-core-book-v1.md
3. Character / Story / Idea Bookの必要なもの
4. 必要ならdomain master
```

### Character質問

```txt
CANON
→ Game Core（必要範囲）
→ CHARACTERS
→ character-book-v3
```

### Story質問

```txt
CANON
→ Game Core
→ STORY
→ story-book-v1
```

### 「前にこういうアイディア話したよね？」

```txt
CANON
→ Game Coreとの衝突確認
→ idea-book-v1
```

## Legacyを読む例外

- migration ledgerに`MIGRATION PENDING`とある領域を一度だけ回収
- 過去の変更理由 / regression / history監査

禁止:

- repo-wide searchで最初に古い資料へ入る
- migrated legacyをCurrent設計根拠へ戻す
- 古いキャラ名 / 旧星獣 / 旧用語を復活
- Current 21とfuture candidateを混ぜる
- Ideaを勝手にCanonへ昇格
- Ideaが未確定という理由で忘れる
- IdeaのためにGame Coreを無自覚に曲げる

---

# 9. Gameplay-first invariant

ヨルノシルベは資料閲覧ゲームではない。

```txt
戦う
→ buildする
→ 強くなる
→ 違うキャラ / Support / 条件を試す
→ 達成 / 永続成長
→ また戦う
```

情報はプレイの副作用として増える。

## 読まない人

- パラメータ / trait / 機能が上がった
- 新しいbuildが開いた
- 「ラッキー」でよい
- Main Game / Main Storyは完走できる

## 読む人

- キャラをもっと好きになる
- 人物の過去や日常を読む
- 世界の観測記録を読む
- 伏線 / 矛盾を考察する
- 続編で意味が変わるSeedに気づく

**任意閲覧である限り、情報量は豊富でよい。**

---

# 10. Current terminology bridge

| Current | Meaning |
| --- | --- |
| 灯録 | 収集・記録の総合Hub |
| 夜明け星図 | Clear Getter型の達成盤view |
| 記憶のしるし | 星図上の個別achievement |
| 灯し手の記録 | キャラ / Bond / 成長 / 黒耀化 |
| カゲモノ図鑑 | 敵の遭遇 / 攻略 / 背景記録 |
| 忘れ物絵札 | 灯具 / 持ち物 / 忘れ物 / 所有者の気配 |
| 言葉の記録 | 会話 / 短文 / 関係変化 |
| 夜の観測記録 | Main Mysteryを任意で深掘るreport群のworking label |
| 黒耀化 | 共通システム名 |
| キャラ別黒耀呼称 | 各人物固有の黒耀化名（具体名は一部Working） |

---

# 11. Status labels

重要設計は状態を明示する。

- **CORE / CURRENT** — ゲーム identidade。変えるなら明示的Human decisionが必要
- **CANON / CURRENT** — 今後の設計前提
- **USER DIRECTION** — ユーザーが明示した強い方向
- **USER IDEA** — 覚えて育てる
- **HIGH-VALUE CANDIDATE** — 強い候補だが未LOCK
- **OPEN QUESTION** — 答えを急がない
- **LEGACY** — 履歴専用

特にMain Mysteryの具体的答えは、整合が高くてもHuman decision前にCANONへ昇格しない。

---

# 12. Update rule

ユーザーとの会話で新しい大事な案が出た時:

```txt
Book / Current memoryへ記録
↓
Game Coreとの関係を確認
↓
まだ案ならIdea / Candidateのまま育てる
↓
確定した時だけdetail Current masterへ昇格
↓
Hub / CANONを同期
```

Game Core自体を変更する場合は、普通のIdea昇格として扱わず、**「ゲームの中心を変える判断」**として明示する。
