# ヨルノシルベ Canon Hub

Date: 2026-07-28  
Status: **CURRENT HUMAN / AI DESIGN ENTRYPOINT**

> ヨルノシルベの設計を確認・追加・変更する時は、最初にこのファイルを読む。  
> repo全体から過去資料を毎回掘り直さない。

---

# 1. Current entrypoints

| Domain | First read | Purpose |
| --- | --- | --- |
| Character | `docs/CHARACTERS.md` | 21人、関係、Bond、日常、星獣、黒耀化 |
| Gameplay / Meta | `docs/GAMEPLAY-META-PROGRESSION.md` | ヴァンサバ系主循環、永続強化、達成盤、fail-forward |
| Collection / Lore | `docs/PROGRESSION-ARCHIVE.md` | 灯録、夜明け星図、情報解放、任意レポート |
| Story / Mystery | `docs/STORY.md` | Main Mystery、Character Mystery、Happy End、続編 |
| 黒耀化 | `docs/BLACK-YOUKA.md` | 共通システム名、21人固有呼称、歪み、星獣反応 |
| Production / Runtime | `docs/181-current-production-canon.md` | 現在のUnity/production正本 |

通常の企画・会話・キャラ質問はこの6入口だけから開始する。

---

# 2. Canon layers

## CURRENT CANON

今後の新規設計が参照する正本。

- `docs/CANON.md`
- `docs/CHARACTERS.md`
- `docs/character-book-v2.md`
- `docs/character-bond-support-system-v1.md`
- `docs/GAMEPLAY-META-PROGRESSION.md`
- `docs/PROGRESSION-ARCHIVE.md`
- `docs/STORY.md`
- `docs/story-ending-sequel-architecture-v1.md`
- `docs/story-foreshadowing-payoff-map-v1.md`
- `docs/BLACK-YOUKA.md`
- `docs/180-unified-character-canon.md`
- `docs/181-current-production-canon.md`
- current `src/game/data/*` production canon

## LEGACY SOURCE

過去に良い案があるが、そのままCurrent Canonとして読まない資料。

Current Canonへの移植が済んだ資料は、通常作業では読まない。
必要なのは「昔どう考えていたか」を監査する時だけ。

移植状況は:

- `docs/legacy-design-migration-2026-07-28.md`

で管理する。

---

# 3. Mandatory read policy

AI / Agent / Humanの通常設計手順:

```txt
1. docs/CANON.md
2. 対象domainのCurrent entrypoint
3. Current detail canon
4. 必要ならruntime data
5. legacy sourceは原則読まない
```

Legacyを読む例外:

- Current Canonに「MIGRATION PENDING」と明記された情報を回収する時
- 過去の命名・仕様変更の理由を監査する時
- regression / history確認

禁止:

- repo-wide searchで最初に古い資料へ入る
- 古いキャラ名や古い星座をcurrentとして復活させる
- legacy案とcurrent canonを混ぜて新しい正本を作る
- 同じ情報を複数のCurrent masterへ別内容で二重管理する

---

# 4. Gameplay-first invariant

ヨルノシルベは資料閲覧ゲームではない。

```txt
戦う
→ ビルドする
→ 強くなる
→ 違うキャラ / Support / 条件を試す
→ 達成・永続成長
→ また戦う
```

人物情報・世界情報・レポートはこの主循環から自然に増える。

読まないプレイヤー:

- パラメータや機能が上がって「ラッキー」でよい
- メインゲームと主要ストーリーを問題なく遊べる

読むプレイヤー:

- キャラをもっと好きになれる
- 伏線を拾える
- 世界の解像度が上がる
- 続編のヒントに気づける

情報量は、任意閲覧である限り豊富でよい。
戦闘テンポを止めないことを優先する。

---

# 5. Current terminology bridge

過去名称とCurrent UI用語を混ぜない。

| Current | Meaning |
| --- | --- |
| 灯録 | 収集・記録の総合Hub |
| 夜明け星図 | クリアゲッター型の達成盤ビュー |
| 記憶のしるし | 星図上の個別達成 / achievement node |
| 灯し手の記録 | キャラ / Bond / 成長 / 黒耀化の記録 |
| カゲモノ図鑑 | 敵の遭遇・攻略・背景記録 |
| 忘れ物絵札 | 灯具 / 持ち物 / 忘れ物 / 所有者の気配 |
| 言葉の記録 | 会話・短文・関係の変化 |
| 夜の観測記録 | Main Mysteryを任意で深掘りするレポート群のworking label |
| 黒耀化 | 共通システム名 |
| キャラ別黒耀呼称 | 各人物固有の黒耀化の呼び名 |

---

# 6. Update rule

新しい重要設計を決めた時:

```txt
詳細Current canonを更新
↓
該当domain Hubを同期
↓
必要なら docs/CANON.md の入口を同期
↓
吸収元legacyがある場合 migration ledgerへ記録
```

同じ設計を再発掘しないため、重要情報をlegacyだけに残さない。
