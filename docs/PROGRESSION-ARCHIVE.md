# ヨルノシルベ Progression / Archive Canon

Date: 2026-07-28  
Status: **CURRENT DESIGN CANON — GAMEPLAY FIRST / LORE OPTIONAL**

この文書は、過去のクリアチェッカー、夜明け盤、夜明け図鑑、fail-forward、図鑑、記憶文、レポート設計をCurrent terminologyへ統合した正本。

---

# 0. 原則

プレイヤーがヨルノシルベを遊ぶ理由は、まず戦闘が面白いこと。

```txt
戦う
→ ビルドする
→ 強くなる
→ 別キャラ / 別Support / 別条件を試す
→ 達成が増える
→ 新しい強化 / 遊び方が増える
```

その副作用として情報が増える。

## 読まない人

- 達成した
- パラメータが上がった
- 新しい装備 / trait / rerollが開いた
- 「ラッキー」でよい

## 読む人

- キャラの細かい生活や関係を読む
- 黒耀化の理由を読む
- 敵の背景を読む
- 世界の観測記録を読む
- 伏線や矛盾を拾う
- 続編の手掛かりに気づく

**任意閲覧である限り、情報量は豊富でよい。**

ただし、長文を戦闘中へ割り込ませない。

---

# 1. 灯録 — 収集 / 記録の総合Hub

Current umbrella name: **灯録**

灯録の中に複数の資料棚を持つ。

```txt
灯録
├ 夜明け星図
├ カゲモノ図鑑
├ 忘れ物絵札
├ 灯し手の記録
├ 言葉の記録
└ 夜の観測記録
```

## 夜明け星図

旧「夜明け盤 / クリアチェッカー」のCurrent representation。

- 絵札 / 星ノードで条件を表す
- 1つ灯ると隣の星が見える
- 条件を全部最初に見せない
- 次に何を試すか自然に分かる
- 星図全体が少しずつ夜明けへ近づく

個別のachievement nodeはCurrent term **記憶のしるし** とする。

```txt
夜明け星図 = 盤面 / view
記憶のしるし = 1つ1つの達成
```

---

# 2. 夜明け星図の達成密度

旧設計から以下を維持する。

- 自然達成: 約50%
- 少し狙う: 約30%
- やり込み: 約15%
- 秘密: 約5%

これは厳密な永久比率ではなく、初期バランスの目安。

目的:

- 普通に遊ぶだけでも複数灯る
- その中に「次はこれ試そう」が混ざる
- 全部が撃破数にならない
- secretは考察 / 特殊プレイ向け

## 例

### 自然達成

- 初めて敵種をほどく
- Stageを初めて夜明けする
- 灯具を一定Lvへ育てる
- 初めて灯継ぎを成立
- 初めて忘れ物を拾う

### 少し狙う

- 特定Supportと一緒に夜明け
- 黒耀化なしで夜明け
- 特定灯具系だけで一定数ほどく
- 回復なしで一定時間生存
- 特定の灯合わせを使う

### やり込み

- 被弾回数制限
- 時間内撃破
- 低HP夜明け
- 高難度Stage特殊条件

### 秘密

- 条件は最初非表示
- 隣の星を灯すと短いヒントだけ表示
- 重要機能や必須戦力をsecretへ閉じ込めない

---

# 3. 報酬はGameplayへ返す

各達成は、文章だけでなくゲーム上の小さなメリットを持つ。

候補:

- 永続強化ポイント
- キャラPersonal Traitの段階解放
- Support性能拡張
- Pair Trait
- 灯合わせの派生
- 新しい灯具 / 持ち物 / 忘れ物
- reroll / choice拡張
- pickup comfort
- stage hint
- new route
- cosmetic / BGM / visual

## 強すぎない

旧設計の重要な教訓:

> 達成盤の報酬が強すぎると「楽しい挑戦」ではなく「やらなければ損」になる。

そのため:

- 自然達成は気持ちいい小報酬
- やり込みは便利 / 特別だが必須ではない
- secretは主に遊び幅、cosmetic、情報、特殊派生
- 基本の楽しさを大量達成後にロックしない

---

# 4. 情報報酬は副作用として大量に持てる

Gameplay rewardに加えて情報が付いてくる。

情報カテゴリ:

- キャラ個人プロフィール
- Bond関係変化
- 日常会
- 黒耀化固有呼称 / 歪み / 星獣反応
- 敵の生態
- 敵の攻略ヒント
- 忘れ物の持ち主
- 世界史の断片
- Main Mysteryの観測記録
- Character Mysteryの個人視点
- 場所の過去
- 他キャラから見た同一事件
- 誤読 / 矛盾 / 訂正記録
- 続編への弱い手掛かり

## 情報量の考え方

情報そのものは多くてよい。

ただし表示階層を分ける。

```txt
戦闘中
→ 1行通知だけ

リザルト
→ 何が強くなったか / 何が灯ったか

灯録一覧
→ 1〜3行の概要

詳細ページ
→ 好きな人が読む中量テキスト

夜の観測記録
→ 考察好き向けの長めの任意資料
```

読了チェックを戦力条件にしない。

---

# 5. 夜の観測記録 — 任意の世界レポート

Kingdom Heartsのレポートのような「読む人は深く読める」構造を参考にするが、内容・形式はヨルノシルベ独自とする。

Working label: **夜の観測記録**

## 役割

メインストーリーだけでもヨルノシルベ1の話は理解できる。

観測記録を読むと:

- 夜の説明に矛盾がある
- ある人物の証言と記録が一致しない
- 黒インクが単純な敵ではない
- 星獣の記録が現実側にも存在する
- 同じ事件を別人物が違う名前で記録している
- 1では回収しない上位レイヤーが示唆される

などが見える。

## 入手はGameplayから

- Stage夜明け
- ボス鎮静
- 夜明け星図
- 特殊build
- Shadow encounter
- 高難度条件
- Bond milestone
- hidden route

取得時は強化報酬を先に表示し、観測記録は「新しい記録があります」と添えるだけでよい。

---

# 6. カゲモノ図鑑の段階解放

一度会っただけで全部説明しない。

旧設計から以下を移植する。

```txt
未確認
→ 見つけた
→ ほどいた
→ 観察した
→ 記された
→ 思い出した
```

例:

| State | Typical trigger | Information |
| --- | --- | --- |
| 見つけた | 初遭遇 | silhouette / 仮説明 |
| ほどいた | 初撃破 | 正式名 / 基本行動 |
| 観察した | 複数撃破 | gameplay hint |
| 記された | さらに観察 | 生態 / 背景 |
| 思い出した | 関連忘れ物 / 特殊条件 | 記憶文 / 人物との接続 |

情報を読まなくても、観察段階が上がることで弱点ヒントや小さな戦闘bonusが得られる余地を持つ。

---

# 7. 灯し手の記録

キャラページは人物紹介だけではなく、ゲーム使用履歴と成長が見える。

候補情報:

- Personal Trait
- Support Trait
- Bond level
- Pair Trait
- 灯合わせ
- 黒耀化 / 固有呼称
- 煤返り
- 星獣
- 日常プロフィール
- 名前の呼ばれ方
- よく一緒に夜明けした相手
- Character Mystery fragment
- 朝側の成長

Gameplay上の強化が先、読み物は後ろに置く。

---

# 8. Fail-forward

**失敗ランを無駄にしない。**

Game Overは人物の死ではなく「その夜の読み取りに失敗した」状態。

失敗でも残る候補:

| Legacy concept | Current meaning | Gameplay return |
| --- | --- | --- |
| memory dust | 細かな記憶残滓 | 小さな永続強化currency |
| page crease | 読んだ道の折り目 | route / stage hint |
| lantern soot | 灯具を使った痕跡 | starter / lantern care |
| object trace | 忘れ物に触れた記録 | item hint / unlock progress |
| ink sample | 敵の観察痕 | bestiary / weakness info |
| relation thread | 一緒に戦った痕跡 | Bond support / relationship hint |
| bookmark | retry comfort | reroll / revive / magnet aid |
| found note | 小さな記録 | optional lore |

## Minimum rule

短い失敗でも完全なゼロにはしない。

ただし、**失敗する方が効率が良いゲームにはしない。**

クリア:
- 大きな達成
- Stage進行
- 強い解放

失敗:
- 学習
- 小成長
- 観察
- 次回のヒント

---

# 9. 永続成長ファミリー

旧fail-forward設計からCurrent候補へ保存する。

## 灯りの手入れ

- 硝子を磨く
- 芯を替える
- 取っ手布
- 小さな初期光強化

## 地図 / 夜路理解

- 折れた角
- 鉛筆の道筋
- 栞糸
- next-goal hint
- route hint

## 記憶の扱い

- 名前札付き袋
- 透明瓶
- 修理した留め具
- pickup / fragment comfort

## 影の観察

- インク標本札
- 乾いた筆先
- 影の足跡
- known enemyへの小bonus

## Retry comfort

- 予備の栞
- 二本目のマッチ
- 導き糸
- reroll / revive / early pickup comfort

数値はruntime balanceで決める。
raw damageを上げすぎず、**ビルド幅 / 情報 / retry comfortを厚くする**。

---

# 10. リザルトの役割

戦闘中は止めない。

初回発見通知は短くする。

本命はリザルト。

```txt
旅の記録

今回強くなった
- 旅支度 +1
- アサSupport trait progress

夜明け星図
- 3つ灯った

新しい記録
- カゲモノ 1
- 灯し手 1
- 夜の観測記録 1
```

情報本文をその場で読ませない。

プレイヤーは:

- そのまま次のrunへ行く
- 気になったら灯録へ寄る

を自由に選べる。

---

# 11. 「灯る」演出

旧図鑑演出から以下をCurrentへ採用する。

- checkmarkではなく小さな灯り
- completedではなく「灯った」感覚
- 新規だけ一度少し強く光る
- 再訪時は静か
- 隣の星へ細線が伸びる
- 大音量ファンファーレを連打しない
- 報酬数字より「何が増えたか」を先に見せる

視覚的には管理画面ではなく、夜の資料館 / 星図 / 絵札。

---

# 12. Current terminology migration

旧資料の名前は次へ統合する。

| Legacy | Current |
| --- | --- |
| 忘れ物帳 / 夜明け図鑑 | 灯録 |
| 夜明け盤 / クリアチェッカー | 夜明け星図 |
| 達成マス | 記憶のしるし |
| 影図鑑 | カゲモノ図鑑 |
| 忘れ物一覧 | 忘れ物絵札 |
| キャラ記録 | 灯し手の記録 |
| lore / memory text | 各記録内の任意詳細 |
| world report | 夜の観測記録（working label） |

---

# 13. Do not do

- loreを読むことを必須強化条件にする
- 未読数を罪悪感のある赤バッジで煽る
- achievementを全部作業ノルマにする
- 大量の通貨を増やす
- failure farmingを最適解にする
- secretへ必須機能を置く
- battle中に長文表示
- reportを読まないとMain Storyが理解不能
- 100%収集しないとHappy Endへ行けない

---

# 14. Source migration

このCurrent Canonへ主要設計を吸収したlegacy source:

- `docs/101-collection-and-night-board-spec.md`
- `docs/134-collection-atlas-visual-asset-plan.md`
- `docs/135-collection-atlas-juice-plan.md`
- `docs/163-fail-forward-permanent-growth-system.md`
- `docs/164-fail-forward-reward-catalog.md`
- `docs/165-result-screen-fail-forward-ui.md`
- `docs/166-fail-forward-implementation-brief.md`
- `docs/167-fail-forward-canon-index.md`

通常の新規設計では上記を直接読まず、本書と `GAMEPLAY-META-PROGRESSION.md` を読む。
