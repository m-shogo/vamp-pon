# Claude Design Handoff Pack

Vamp Pon の Visual Quality 改善を Claude Design / 画像生成 / Figma 的な設計へ渡すための実行パック。

このドキュメントは `docs/visual-target-board.md` と `docs/visual-quality-guide.md` を前提に、実際に Claude Design へ貼る順番・画面ごとの配置・レビュー観点・v2 修正指示をまとめる。

---

## 0. 目的

```txt
Stage追加ではなく、まず 390x844 の完成画面基準を作る。
Web/Phaser の現行実装を捨てず、Claude Designで画面品質の目標を固定する。
その後、PR49 Web/Phaser Visual Polish へ落とす。
```

### 成果物の使い方

Claude Design の出力は、そのまま本番素材にしない。
採用するのは主に以下。

```txt
- 画面構図
- UI階層
- 光の置き方
- 余白と密度
- 紙/黒インク/ランタンの質感
- 報酬の見せ方
- Battleの視線誘導
- Phaserで再現するための分解
```

---

## 1. 実行順

```txt
1. Full Board Prompt を投げる
2. TOP / Battle / Result を最優先で見る
3. 80点未満なら Review Prompt で厳しく戻す
4. v2 Prompt で修正させる
5. 採用する画面を決める
6. Phaser Breakdown Prompt で実装分解を作らせる
7. PR49へ進む
```

### 最初に見る4画面

```txt
1. TOP
2. Battle
3. Result Clear
4. Result Defeat
```

理由:

```txt
TOP           : ゲームの顔
Battle        : 遊びの気持ちよさ
Result Clear  : ご褒美
Result Defeat : 負けても続けたい理由
```

この4枚が弱い場合、StageSelect / Growth / Collection が良くてもアプリ品質には見えない。

---

## 2. 共通仕様

### Canvas

```txt
390x844 vertical mobile game screen
safe margin: left/right 18px, top 24px, bottom 24px
8px grid
```

### 世界観

```txt
夜
記憶
忘れ物
黒インク
小さな光
朝
紙片
絵本風
ドットの味
暗いが怖すぎない
可読性優先
```

### UI文法

```txt
紙の夜
黒インクのにじみ
小さいランタン光
記録帳
星図
古紙カード
地図線
朝色のご褒美
触りたくなる紙片ボタン
黒インクで隠れた未解放要素
NEWは通知丸ではなく小さい灯り
```

### ユイ固定事項

```txt
- ランタンは本人の右手
- バッグ紐は右肩から左腰
- バッグ本体は左腰
- 左向きでも奥側のランタンを完全に消さない
- 優しいが弱くない
- 光は暖色ランタン
- 黒耀化時は黒インクに侵食されるが、主人公性は消さない
- 普通のVRoid/量産アバター感を避ける
- 紙人形、低ポリ、ドット味、絵本、ミニチュア感を重視
```

### 敵固定事項

```txt
- 小さい敵: オンブ
- 大きい敵: オンブロ
- 黒インク影
- 怖すぎない
- 白目・輪郭・モヤで読ませる
- 背景と同化しない
```

---

## 3. 画面別の配置指定

## 3.1 TOP

### 画面目的

メニューではなく、ゲームの顔。
起動した瞬間に「暗い紙の夜に、小さなランタン光がある」と伝える。

### Layout

```txt
y=0-120:
  title/logo area
  subtitle
  tiny lantern particles

y=120-430:
  Yui or Yui silhouette as emotional center
  warm lantern glow around center
  paper scraps, forgotten objects, black ink edge

y=430-660:
  main CTA: 夜へ出る
  secondary CTA: 成長
  secondary CTA: 忘れ物帳
  NEW badge as tiny lantern spark

y=660-820:
  settings
  record/version-like tiny text
  small map lines
```

### Required elements

```txt
- title/logo
- subtitle
- Yui
- lantern in right hand
- main CTA
- growth button
- collection button
- settings
- NEW lantern badge
- paper night background
- black ink edge
```

### Reject

```txt
- web menuに見える
- titleが読めない
- YuiがVRoidっぽい
- ランタンが左手
- ボタンがただの角丸矩形
- 明るすぎて夜が消える
- generic fantasy RPG
```

---

## 3.2 Battle

### 画面目的

戦闘の気持ちよさを一枚で見せる。
敵撃破 → 黒インクがほどける → 記憶欠片EXPがユイへ吸い込まれる流れを作る。

### Layout

```txt
y=0-76:
  compact premium HUD
  HP / time / Lv / fragments / pause / speed
  old paper translucent strip

y=76-700:
  battle field
  Yui around x=195, y=430
  lantern glow marks player position
  Onbu/Onburo approach from edges
  EXP memory fragments curve toward Yui
  black ink particles from defeated enemies

x=286-374, y=620-740:
  ultimate button/gauge
  premium seal / lantern charm feeling
  not a cheap round button

x=16-112, y=620-740:
  Kokuyou gauge or portrait area
  black ink meter
  does not block readability

y=740-820:
  inventory slots
  low profile but readable
```

### Required elements

```txt
- Yui
- lantern glow
- Onbu
- Onburo
- black ink kill burst
- EXP memory fragments
- HP
- time
- Lv
- fragments
- pause
- speed
- inventory slots
- ultimate button
- Kokuyou gauge
- hit effects
- pickup trails
```

### Readability priority

```txt
Yui > enemies > EXP > bullets > background decoration > HUD decoration
```

### Reject

```txt
- Yuiがeffectで隠れる
- enemiesとEXPが同じ色
- HUDが大きすぎる
- ultimate buttonが安い丸ボタン
- Kokuyouがgeneric demon modeになる
- horror/gore
```

---

## 3.3 Result Clear

### 画面目的

精算表ではなく、夜から持ち帰った記憶ページ。
Clearは朝色のご褒美。

### Layout

```txt
y=0-110:
  big result title: 夜明け / Clear direction
  dawn light enters from upper edge

y=90-190:
  rank seal
  paper stamp / wax seal / record seal

y=180-470:
  main memory page reward card
  rewards with icons and count-up areas
  黒曜片 / EXP / 記録 / 持ち帰ったもの

y=470-640:
  achievement / new record / stage unlock small cards

y=650-810:
  primary CTA: 成長へ
  secondary: もう一度
  tertiary: ステージ選択 / TOP
```

### Required elements

```txt
- result title
- rank seal
- opened memory page
- reward card
- black stone fragments
- character EXP
- clear time
- enemies defeated
- achievement
- new record
- stage unlock
- growth button
- retry button
- stage select button
- dawn light
```

### Reject

```txt
- spreadsheet-like
- too many number rows
- CTAが弱い
- dawn feelingがない
- generic fantasy result screen
```

---

## 3.4 Result Defeat

### 画面目的

負けても進んだ、持ち帰れた、次は強くなると感じる fail-forward。

### Layout

```txt
y=0-110:
  result title: 夜に飲まれた / 灯りは残った

y=100-240:
  small lantern glow remains in darkness
  rank or survival mark

y=230-500:
  carried home reward page
  smaller than Clear but still rewarding

y=500-650:
  progress cards
  earned fragments / character EXP / new discovery

y=660-810:
  primary CTA: 成長へ
  secondary: もう一度
  tertiary: ステージ選択
```

### Reject

```txt
- pure failure screen
- darkすぎて読めない
- rewardが意味なく見える
- playerがやめたくなる
```

---

## 3.5 StageSelect

### 画面目的

地図帳をめくって夜路を選ぶ画面。
難易度はテキストだけでなく、紙の痛み・黒インク量・灯りの細さで見せる。

### Layout

```txt
y=0-90:
  title: 夜の地図
  current fragments / progress

y=100-340:
  selected stage large card
  background preview
  stage name
  short flavor text
  clear stamp / locked ink

y=350-510:
  difficulty cards
  Easy / Normal / Hard
  three paper scraps
  harder = more black ink, thinner lantern light, damaged paper

y=520-690:
  stage route cards / next night roads
  locked stages covered by black ink

y=700-820:
  start button
  bottom navigation: TOP / Growth / Collection
```

### Reject

```txt
- business settings screen
- difficulty only text
- flat rectangular stage cards
- no world mood
```

---

## 3.6 Growth

### 画面目的

数値表ではなく、次の夜へ持っていく支度。
黒曜片を使って「次は勝てる」と感じる画面。

### Layout

```txt
y=0-90:
  title: 黒曜研究所 / 灯りの支度
  currency: 黒曜片

y=100-190:
  character area
  small Yui / lantern / current build summary

y=200-620:
  upgrade cards
  HP / movement / attack / pickup range / luck / Kokuyou resistance
  available upgrades glow warm
  unavailable cards are dark paper

y=630-740:
  reset / details / small explanation

y=750-820:
  primary CTA: 夜へ出る
  secondary: 戻る
```

### Reject

```txt
- table-like status screen
- text too much
- no reward feeling
- generic RPG upgrade menu
```

---

## 3.7 Collection / Achievements

### 画面目的

データベースではなく、忘れ物帳。
NEWは作業通知ではなく、夜が少し読めるようになった嬉しさ。

### Layout

```txt
y=0-76:
  title: 忘れ物帳
  back button
  completion or small atlas progress

y=80-120:
  six compact tabs
  図鑑 / 影 / 絵札 / 灯し手 / 言葉 / 実績
  active tab lifts forward like paper
  NEW is tiny lantern spark

y=130-690:
  content area
  collection: two-column paper cards
  achievements: one-column achievement records
  undiscovered = black ink hidden
  completed = warm paper + small light
  reward claimed = stamp/seal

y=700-820:
  page controls / filter / small description
```

### Reject

```txt
- database table
- settings screen
- tabs too cramped
- NEWがgeneric notification badge
- unreadable 390px layout
```

---

## 3.8 LevelUp

### 画面目的

3択カードを選ぶ気持ちよさ。
カードは横3枚ではなく、390pxで読める縦カードを優先する。

### Layout

```txt
full screen:
  dimmed battle background
  soft vignette

y=80-140:
  title: 記憶が灯る
  level indicator

y=150-610:
  three vertical choice cards
  each card:
    left icon area
    center item name
    lower description
    top-right rarity/evolution hint
  cards enter staggered

y=620-710:
  current inventory slots
  show replacement context if needed

y=720-820:
  reroll / skip / close
  but keep 3 cards as main focus
```

### Reject

```txt
- horizontal tiny cards
- too much description
- fake unreadable text
- generic RPG card UI
- star rarity clutter
```

---

## 3.9 黒耀化 / 必殺 Activation

### 画面目的

危険だが主人公。
黒耀化はただの赤目悪魔化ではない。
黒インクに侵食されながらも、ランタン光が残る。

### Layout

```txt
full screen:
  battle screen underneath
  black ink invades from edges
  center lantern light remains

y=180-500:
  wide cut-in band
  Yui eyes / lantern / black ink
  readable at 390px

y=500-620:
  title: 黒耀化
  minimal strong typography

y=620-760:
  release effect
  black ink pulls back for a moment
  warm lantern slash/flare crosses screen

after effect:
  return to battle
  HUD Kokuyou gauge changes
  screen edges keep black ink residue
```

### Reject

```txt
- red-eye demon transformation
- cute mascot mode
- full white flash only
- unreadable cut-in
- generic anime ultimate screen
```

---

## 4. Full Board Prompt

```txt
あなたはスマホゲームのアートディレクター兼UI/UXデザイナーです。

対象:
Vamp Pon

目的:
Vamp Ponの全主要画面を、390x844 vertical mobile game screenとして再設計してください。
今回は画像素材制作ではなく、完成画面の基準を作ることが目的です。
現在はWeb/Phaser実装ですが、まずClaude Designで「どの画面に何があり、どこに配置され、何が主役か」を明確にしたいです。

全体世界観:
- 夜
- 記憶
- 忘れ物
- 黒インク
- 小さな光
- 朝
- 紙片
- 絵本風
- ドットの味
- 暗いが怖すぎない
- 可読性優先

UI文法:
- 紙の夜
- 黒インクのにじみ
- 小さいランタン光
- 記録帳
- 星図
- 古紙カード
- 地図線
- 朝色のご褒美
- 触りたくなる紙片ボタン
- 黒インクで隠れた未解放要素
- NEWは通知丸ではなく小さい灯り

Canvas:
- 390x844
- Safe margin: left/right 18px, top 24px, bottom 24px
- 8px grid
- 390px幅で文字が読めること
- UIは大きすぎず、でもスマホで押せること
- 文字が正確に描けない場合は、偽文字ではなく clean placeholder text blocks にする

主人公ユイの固定事項:
- ランタンは本人の右手
- バッグ紐は右肩から左腰
- バッグ本体は左腰
- 左向きでも奥側のランタンを完全に消さない
- 優しいが弱くない
- 光は暖色ランタン
- 黒耀化時は黒インクに侵食されるが、主人公性は消さない
- 普通のVRoid/量産アバター感は避ける
- 紙人形、低ポリ、ドット味、絵本、ミニチュア感を重視

敵:
- 小さい敵: オンブ
- 大きい敵: オンブロ
- 黒インク影
- 怖すぎない
- 白目、輪郭、モヤで読ませる
- 背景と同化しない

作成する画面:
1. TOP
2. Battle
3. Result Clear
4. Result Defeat
5. StageSelect
6. Growth
7. Collection / Achievements
8. LevelUp
9. 黒耀化 / 必殺 activation

出力してほしいもの:
1. A visual target board with all 9 screens
2. Each screen as a 390x844 layout
3. UI component kit:
   - primary button
   - secondary button
   - paper card
   - stage card
   - reward card
   - tab
   - NEW badge
   - HUD strip
   - ultimate button
   - Kokuyou gauge
4. For each screen:
   - main visual focus
   - UI hierarchy
   - what should be animated
   - what should be implemented with simple Phaser Graphics
   - what should become image assets
5. Reject list for designs that look cheap or off-brand

Important:
Do not propose Stage3.
Do not propose full Unity migration.
Do not propose full 3D conversion.
This is a visual quality target for the current Web/Phaser game.
```

---

## 5. Review Prompt

```txt
あなたはVamp Ponのアートディレクター兼スマホゲームUI/UXレビュー担当です。

今から、Claude Designで作ったVamp Ponの画面案をレビューし、v2へ修正してください。

目的:
初回案をそのまま採用せず、Vamp Ponらしさ、390x844での可読性、Web/Phaser実装可能性、スマホゲームとしての完成度を基準に、厳しく磨き込む。

評価基準:
1. 390x844で読めるか
2. 初見でスマホゲームの完成画面に見えるか
3. TOPはメニューではなくゲームの顔になっているか
4. Battleはユイ、敵、EXP、HUD、必殺、黒耀が読めるか
5. Resultは精算表ではなく、夜から持ち帰った記憶ページに見えるか
6. StageSelectは地図帳をめくって夜路を選ぶ画面に見えるか
7. Growthは数値表ではなく、次の夜へ持っていく支度に見えるか
8. Collectionはデータベースではなく、忘れ物帳に見えるか
9. LevelUpは3択カードを選ぶ気持ちよさがあるか
10. 黒耀化は generic demon mode ではなく、危険だが主人公に見えるか
11. ボタン、カード、タブ、NEW、報酬が安っぽい矩形UIになっていないか
12. 世界観とUIが分離していないか
13. 文字が多すぎないか
14. 画像素材がないと成立しない設計になりすぎていないか
15. Phaser Graphicsで実装できる部分と、画像素材が必要な部分が分かれているか

厳しく見てほしいNG:
- Webアプリのメニューに見える
- ただの角丸矩形ボタン
- 汎用ファンタジーRPG
- ネオンSF
- 魔法陣
- VRoid/量産アバター
- 赤目の悪魔化
- ホラー/グロ
- 数字だけの精算表
- 390pxで読めない
- UIが豪華でもVamp Ponらしくない
- エフェクトが派手すぎてユイや敵が見えない
- TOP/Battle/Resultの画面差が弱い

出力形式:
A. 全体評価 100点満点
B. 画面ごとの評価
C. 最も良い画面
D. 最も弱い画面
E. 安っぽく見える原因
F. Vamp Ponらしさが弱い原因
G. 390x844で読みにくい場所
H. 修正優先度 High / Middle / Low
I. v2で直す具体指示
J. Phaser実装に落とす場合の分解
   - Graphicsで描くもの
   - 画像素材化した方がいいもの
   - アニメーションで表現するもの
   - 今回は捨てるもの
K. v2生成用の最終プロンプト

重要:
80点未満なら production target と呼ばないでください。
見た目が綺麗でも、Vamp Ponらしさが弱ければ不採用にしてください。
```

---

## 6. v2 Prompt

```txt
先ほどのレビュー内容を反映して、Vamp PonのVisual Target Board v2を作成してください。

目的:
Vamp PonのTOP / Battle / Resultを中心に、スマホゲームとしての完成画面基準を作る。
今回は見た目の派手さより、Vamp Ponらしさ、390x844での読みやすさ、押したくなるUI、報酬のご褒美感を優先する。

最重要:
TOP / Battle / Result Clear / Result Defeat の4枚を最優先で磨いてください。
他の画面は、この4枚のデザイン文法に合わせてください。

Canvas:
390x844 vertical mobile screen

共通トーン:
dark paper night, black ink bleed, warm lantern light, forgotten notebook, memory fragments, storybook pixel flavor, premium mobile game UI, cozy but not childish, dark but not horror.

TOP v2:
- メニューではなくゲームの顔
- 上部に読みやすいロゴ
- 中央にユイとランタン光
- 下部に紙片ボタン
- NEWは小さい灯り
- 起動した瞬間に「小さな光が夜にある」と分かる
- ボタンはWebフォームに見えない
- ユイはVRoidではなく、紙人形/低ポリ/ドット味/絵本ミニチュア

Battle v2:
- ユイは中央やや下
- ランタン光でプレイヤー位置が読める
- 敵はオンブ/オンブロの黒インク影
- 撃破時に黒インクがほどける
- EXPは暖色の記憶欠片としてユイへ弧を描いて吸い込まれる
- HUDは薄く、高級感があり、邪魔しない
- 右下の必殺ボタンは押したくなる封蝋/紙札/ランタン印
- 黒耀ゲージは危険だが主人公性を残す
- エフェクトでユイが隠れない

Result Clear v2:
- 精算表ではなく、記憶ページ
- 朝色が入る
- 黒インクが端から退く
- Rankは押印/封蝋/記録印
- 報酬は数字だけではなく、アイコンと紙片で見せる
- 成長へCTAが一番押したく見える
- 新記録/実績/開放は小さなご褒美カード

Result Defeat v2:
- ただ暗い敗北画面にしない
- 小さなランタン光が残る
- 持ち帰った黒曜片/EXP/発見が分かる
- 負けても進んだ感がある
- 成長へCTAを強くする

Output:
1. v2 Visual Target Board
2. 390x844画面ごとの配置
3. UI Component Kit
4. Phaser実装分解
5. 画像素材として必要なもの一覧
6. Graphics実装で足りるもの一覧
7. 採用/不採用判断メモ

禁止:
- Stage3追加
- Unity全移植前提
- 全3D化前提
- 新規ゲームシステム追加
- ネオンSF
- 汎用ファンタジー
- ただの豪華なソシャゲUI
- 文字量で解決すること
```

---

## 7. 採用判定

Claude Design の出力は、下記のどれかに分類する。

```txt
A採用:
  そのままPR49/PR50の基準にする。

B採用:
  構図やUI階層は使うが、Vamp Ponらしさを修正する。

C保留:
  一部だけ使う。画像素材や演出案として保存。

D不採用:
  綺麗でもVamp Ponではない。
```

### A採用の条件

```txt
- 390x844で読める
- TOP/Battle/Resultの差が強い
- 紙/インク/灯り/記憶帳のUI文法が見える
- 押せるものが押したく見える
- 報酬が精算表ではない
- Battleでユイ・敵・EXP・HUD・必殺が読める
- 画像素材がなくてもPhaser Graphicsで土台再現できる
```

---

## 8. Phaser分解時に見ること

```txt
Graphicsで描く:
- screen vignette
- paper panels
- card shadows
- ink edge
- lantern glow circles
- simple map lines
- button press glow
- NEW spark

画像素材化した方がいい:
- Yui title silhouette / title illustration
- stage preview background
- special reward seal
- Kokuyou cut-in
- paper texture if Graphicsでは弱い場合

アニメーションで表現:
- button press y+1 / scale / shadow shrink
- paper card stagger
- EXP curved pickup
- kill ink burst
- result count-up
- dawn reveal
- Kokuyou edge invasion

今回は捨てる:
- full 3D conversion
- Unity migration
- Stage3 content
- heavy particle overkill
- new progression system
```
