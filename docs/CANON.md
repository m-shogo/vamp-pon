# ヨルノシルベ Canon Hub

Date: 2026-07-28  
Status: **CURRENT HUMAN / AI DESIGN ENTRYPOINT**

> ヨルノシルベの企画・キャラ・物語・メタ進行を扱う時は、まずこの1ファイルを読む。  
> repo全体から過去資料を毎回掘り直さない。

---

# 1. Current entrypoints

| Domain | First read | Purpose |
| --- | --- | --- |
| Character | `docs/CHARACTERS.md` | 21人、人物像、日常、星獣、関係 |
| Bond / Support | `docs/BOND.md` | 同行、関係成長、連携強化、安定/不安定ペア |
| 黒耀化 | `docs/BLACK-YOUKA.md` | 共通システム名、21人固有呼称、歪み、星獣反応 |
| Gameplay / Meta | `docs/GAMEPLAY-META-PROGRESSION.md` | ヴァンサバ系主循環、永続強化、fail-forward |
| Achievement / Archive | `docs/PROGRESSION-ARCHIVE.md` | 灯録、夜明け星図、記憶のしるし、任意情報 |
| Story / Mystery | `docs/STORY.md` | Main Mystery、Character Mystery、Happy End、続編 |
| Story/Game logic | `docs/STORY-ENGINE.md` | ゲーム仕様と世界法則の接続、再読型伏線、series architecture |
| Production / Runtime | `docs/181-current-production-canon.md` | 現在のUnity / production正本 |

通常の企画・回答はこの8入口から始める。

---

# 2. Character detail masters

Character Hubから必要時だけ読むCurrent detail:

- `docs/character-book-v2.md` — 21人ひと目カード / 成長 / 強い関係
- `docs/character-personal-profile-canon-v1.md` — 誕生日、好物、趣味、日常profile
- `docs/character-star-beast-constellation-canon-v1.md` — 星座 / 星獣 / 由来
- `docs/character-silhouette-diversity-current-canon-v1.md` — 体型 / 年齢感 / 眼鏡
- `docs/CHARACTER-LIFE-AND-SPEECH.md` — 日常、癖、怒り、嘘、呼び方 / 敬語
- current `src/game/data/*` — production/runtime data

---

# 3. Canon layers

## CURRENT CANON

今後の新規設計が参照する正本。

```txt
docs/CANON.md
├ docs/CHARACTERS.md
│  ├ character-book-v2.md
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

`docs/180-unified-character-canon.md` と current `src/game/data/*` はproduction-facing canonical dataとして保持する。

## LEGACY SOURCE

過去に良い案があるが、そのままCurrent Canonとして読まない資料。

Currentへの移植が済んだ資料は通常作業では読まない。

移行状況:

- `docs/legacy-design-migration-2026-07-28.md`

---

# 4. Mandatory read policy

AI / Agent / Humanの通常設計手順:

```txt
1. docs/CANON.md
2. 対象domainのCurrent entrypoint
3. 必要なCurrent detailだけ読む
4. 必要ならcurrent runtime dataを見る
5. legacy sourceは読まない
```

Legacyを読む例外:

- migration ledgerに `MIGRATION PENDING` とある領域を一度だけ回収する時
- 過去の変更理由 / regression / history監査

禁止:

- repo-wide searchで最初に古い資料へ入る
- migrated legacyをCurrent設計根拠として引用する
- 古いキャラ名 / 旧星獣 / 旧用語を復活させる
- Current 21とfuture candidateを混ぜる
- 同じ情報を複数masterへ違う内容で二重管理する

---

# 5. Gameplay-first invariant

ヨルノシルベは資料閲覧ゲームではない。

```txt
戦う
→ ビルドする
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
- Main Game / Main Storyは問題なく完走できる

## 読む人

- キャラをもっと好きになる
- 人物の過去や日常を読む
- 世界の観測記録を読む
- 伏線 / 矛盾を考察する
- 続編で意味が変わるSeedに気づく

**任意閲覧である限り、情報量は豊富でよい。**

未読を消すこと、全文を読むこと、既読ボタンを押すことをGameplay強化条件にしない。

---

# 6. Current terminology bridge

| Current | Meaning |
| --- | --- |
| 灯録 | 収集・記録の総合Hub |
| 夜明け星図 | Clear Checker型の達成盤view |
| 記憶のしるし | 星図上の個別achievement |
| 灯し手の記録 | キャラ / Bond / 成長 / 黒耀化 |
| カゲモノ図鑑 | 敵の遭遇 / 攻略 / 背景記録 |
| 忘れ物絵札 | 灯具 / 持ち物 / 忘れ物 / 所有者の気配 |
| 言葉の記録 | 会話 / 短文 / 関係変化 |
| 夜の観測記録 | Main Mysteryを任意で深掘るreport群のworking label |
| 黒耀化 | 共通システム名 |
| キャラ別黒耀呼称 | 各人物固有の黒耀化名 |

---

# 7. Current / Candidateを混ぜない

新しい資料では明示する。

- **CURRENT / CANON** — 今後の設計前提
- **USER DIRECTION** — ユーザーが明示した方向
- **HIGH-VALUE CANDIDATE** — 旧設計から強く残すが真相等は未LOCK
- **LEGACY** — 履歴専用

特にMain Mysteryの具体的答えは、整合が高くてもHuman decision前にCANONへ昇格しない。

---

# 8. Update rule

新しい重要設計を決めた時:

```txt
詳細Current masterを更新
↓
該当domain Hubを同期
↓
必要なら docs/CANON.md を同期
↓
legacyから移植した場合 migration ledgerを更新
```

重要情報をlegacyだけに残さない。
