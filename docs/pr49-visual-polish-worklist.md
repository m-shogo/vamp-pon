# PR49 Visual Polish Worklist

PR49 で Web/Phaser 実装へ落とすための細かい作業分解。

前提:

```txt
- PR48 Visual Target Board / App Quality Foundation は merge 済み
- 目的は Stage追加ではなく Visual Polish
- まず TOP / StageSelect / Collection / 共通UI を磨く
- Combat Juice は PR50 へ分ける
```

---

## 0. PR49 の範囲

### 対象ファイル

```txt
src/game/scenes/TopScene.ts
src/game/scenes/StageSelectScene.ts
src/game/scenes/CollectionScene.ts
src/game/ui/storybookUi.ts
src/game/ui/pressFeedback.ts
```

必要なら追加:

```txt
src/game/ui/premiumPaperUi.ts
src/game/ui/lanternBadge.ts
src/game/ui/visualTokens.ts
```

### やること

```txt
- TOPの主役構図をランタン/ユイ/タイトルへ寄せる
- 紙カード/ボタンを矩形から紙片へ近づける
- 背景粒子を紙片・インク・灯りに整理する
- StageSelectを地図帳/記録帳寄りにする
- Collectionを忘れ物帳寄りにする
- NEW badgeを通知ではなく小さい灯りにする
- press feedbackを紙の押し込みにする
```

### やらないこと

```txt
- Stage3追加
- 戦闘バランス変更
- Unity移行
- 大量画像追加
- 全キャラ3D化
- 新規永続成長システム
- PR50対象のCombat Juice大改造
```

---

## 1. 共通UIの先行整理

PR49 は画面ごとに個別実装する前に、共通UI helper を薄く作るとブレにくい。

### 追加候補: `visualTokens.ts`

目的:

```txt
STORYBOOK_UI の色を壊さず、画面品質の役割名を足す。
```

候補トークン:

```txt
screenVignetteDark     : 画面端の黒インク/夜のにじみ
screenWarmFocus        : ランタン周辺の暖色焦点
paperCardBase          : 古紙カード基本色
paperCardPressed       : 押下時の沈み色
paperCardEdge          : 手描き縁/破れ縁
inkBleedSoft           : 背景端のにじみ
memoryGold             : EXP/記憶の欠片
memoryGoldSoft         : EXP trail/glow
morningReward          : Clear/Resultの朝色
kokuyouDangerBlack     : 黒耀化の侵食
```

### 追加候補: `premiumPaperUi.ts`

候補関数:

```txt
createPremiumPaperButton(scene, options)
createPaperPanel(scene, options)
createLanternBadge(scene, options)
createNewSparkBadge(scene, options)
drawInkBleedEdge(scene, graphics, options)
drawPaperScrap(scene, graphics, options)
drawMapLine(scene, graphics, options)
```

### ボタン押下仕様

```txt
pointerdown:
  scale 0.97
  y + 1
  shadow alpha down
  warm edge light short pulse

pointerup:
  scale 1.00
  y restore
  warm flash if confirm

idle primary:
  1.5〜2.4秒の極薄呼吸

secondary:
  呼吸なし、hover/pressのみ

muted:
  光らせない。紙の沈みだけ。
```

### NG

```txt
- 全ボタンを同じ光量で光らせる
- primary/secondary/mutedの差を色だけにする
- テキストを増やして階層を作る
- 角丸矩形 + stroke のまま終える
```

---

## 2. TopScene worklist

### 目的

TOP をメニューではなくゲームの顔にする。

### 現状から変えるポイント

```txt
- 中央の見せ場をランタン/ユイ/紙片へ寄せる
- ロゴ周りを単なるテキストから、ランタンで照らされた紙片へ寄せる
- メインCTAを一段大きく、他は静かにする
- 背景粒子を「点」から「紙片 / 黒インク / 小さい灯り」へ整理する
- NEW badgeを小さなランタン火にする
```

### 画面配置目安

```txt
y=0-120:
  logo/title
  subtitle
  tiny lantern particles

y=120-430:
  lantern focus / Yui silhouette / paper scraps

y=430-660:
  夜へ出る primary
  成長 secondary
  忘れ物帳 secondary + NEW spark

y=660-820:
  settings/version/small map lines
```

### 実装タスク

```txt
1. background graphics を3層化
   - paper night base
   - ink edge/vignette
   - paper scraps + tiny light particles

2. title group を強化
   - title back plate
   - warm tiny light behind title
   - small paper ornament

3. emotional center を追加
   - assetがなければ lantern icon / silhouette placeholder
   - Graphicsだけで暖色焦点を作る
   - Yuiがない場合でも「ランタン主役」にする

4. CTA hierarchy を整理
   - main CTA width/height/brightness up
   - secondaryは小さく
   - 設定は主役にしない

5. NEW badge を置換
   - generic red/labelではなく tiny lantern spark
   - glow + small paper tag

6. 390x844確認
   - ロゴが読める
   - 主CTAが押したく見える
   - Collection導線が分かる
   - Growth導線が分かる
```

### 完了条件

```txt
- TOPを見て3秒以内に「夜/紙/ランタン/記憶」のゲームだと分かる
- メニュー一覧ではなく、タイトル画面に見える
- primary CTAが最も押したく見える
- NEWが通知ではなく世界観内の灯りに見える
```

---

## 3. StageSelectScene worklist

### 目的

地図帳をめくって夜路を選ぶ画面にする。

### 画面配置目安

```txt
y=0-90:
  title: 夜の地図
  fragments / progress

y=100-340:
  selected stage large card
  preview
  stage name
  flavor text
  clear stamp / locked ink

y=350-510:
  difficulty cards
  easy / normal / hard
  paper damage / ink density / lantern thinness

y=520-690:
  route cards / stage route / unlock hints

y=700-820:
  start button
  bottom nav: TOP / Growth / Collection
```

### 実装タスク

```txt
1. selected stage cardを主役化
   - 現在選択中のステージカードを一番大きくする
   - card内にpaper map line / preview / stampを追加
   - clear済みは押印、lockedは黒インクで隠す

2. difficulty cardsをテキスト依存から脱却
   - Easy: 紙がきれい、灯り太い、黒インク少ない
   - Normal: 標準
   - Hard: 紙が傷む、黒インク多い、灯り細い

3. bottom navigationを業務UIから脱却
   - 小さい紙片ボタン
   - icon-like marks
   - primary startだけ強く

4. StageSelect / Growth modeの見た目差
   - StageSelectは地図帳
   - Growthは黒曜片/研究所/支度
   - 同じパネルに見えないようにする
```

### 完了条件

```txt
- 難易度差が文字を読まなくても雰囲気で分かる
- 選択中ステージが主役に見える
- 下部ナビが設定画面のボタン群に見えない
- 390x844で開始導線が迷わない
```

---

## 4. CollectionScene worklist

### 目的

データベースではなく、忘れ物帳を開いている画面にする。

### 画面配置目安

```txt
y=0-76:
  title: 忘れ物帳
  back
  completion / atlas progress

y=80-120:
  six compact tabs
  図鑑 / 影 / 絵札 / 灯し手 / 言葉 / 実績
  active tab lifts forward
  NEW spark

y=130-690:
  content area
  collection: two-column paper cards
  achievements: one-column achievement records
  undiscovered: black ink hidden
  completed: warm paper + small light
  claimed: stamp/seal

y=700-820:
  page controls / filter / small description
```

### 実装タスク

```txt
1. 6タブの圧迫を軽減
   - short label優先
   - active tabは紙片が前に出る
   - inactiveは暗紙
   - NEWは小さい灯り点

2. 実績カードの質感強化
   - completed: warm paper + small lantern point
   - incomplete: dark paper
   - hidden: ink covered
   - claimed: stamp/seal

3. ページング中NEW保持を壊さない
   - 表示だけ変える
   - logicは触りすぎない

4. 390px可読性
   - tab labelが潰れない
   - achievement rowが長文になりすぎない
   - reward stateが分かる
```

### 完了条件

```txt
- Collectionがsettings/data tableに見えない
- NEWが嬉しい発見に見える
- 実績タブが他タブと整合しつつ、記録カードに見える
- 6タブが390pxで読める
```

---

## 5. Growth surface worklist

StageSelectScene 内に Growth mode がある場合、PR49で表層だけ整える。

### 目的

数値表ではなく、次の夜へ持っていく支度にする。

### 実装タスク

```txt
1. titleを支度/研究所寄りに見せる
2. currency 黒曜片を主役化する
3. 強化カードを紙片化する
4. 強化可能/不可を暖色/暗紙で分ける
5. primary CTAは夜へ出る or 戻る導線を分かりやすく
```

### 完了条件

```txt
- Growthが単なるstatus tableに見えない
- 強化可能カードが押したく見える
- 黒曜片の価値が分かる
```

---

## 6. PR50へ送るもの

PR49で触りすぎない。

```txt
- Enemy hit / kill ink burst
- EXP curved pickup
- Ultimate ready/fire演出
- Kokuyou edge invasion
- LevelUp stagger
- Result Clear dawn reveal
- Result Defeat fail-forward animation
- SE / hit stop / screen shake
```

PR49では、これらの見た目の受け皿だけ作る。

---

## 7. Manual QA: 390x844

### TOP

```txt
- ロゴが読める
- ランタン/光が主役
- 夜へ出るが最も押したい
- 成長/忘れ物帳/設定の階層が分かる
- NEW badgeが灯りに見える
```

### StageSelect

```txt
- 選択中ステージが主役
- depth/difficulty差が文字以外でも分かる
- 開始ボタンが迷わない
- bottom navが邪魔しない
```

### Growth

```txt
- 黒曜片が見える
- 強化可能/不可が分かる
- 数値表に見えない
```

### Collection / Achievements

```txt
- 6タブが読める
- active tabが分かる
- NEWが分かる
- 実績カードの状態が分かる
- ページングで破綻しない
```

---

## 8. 検証コマンド

```bash
pnpm build
pnpm test
pnpm stage1:fun-pass:verify
pnpm character-assets:verify
pnpm runtime-assets:verify
git diff --check
```

Docs-onlyではなく実装PRなので、PR49では上記を実行する。

---

## 9. PR本文テンプレ

```md
## Summary
- TOPをメニュー画面からゲームの顔へ寄せました
- StageSelectを地図帳/記録帳の見た目へ寄せました
- Collection/実績を忘れ物帳の質感へ寄せました
- 共通紙UI/press feedback/NEW sparkを改善しました

## Changed files
- src/game/scenes/TopScene.ts
- src/game/scenes/StageSelectScene.ts
- src/game/scenes/CollectionScene.ts
- src/game/ui/storybookUi.ts
- src/game/ui/pressFeedback.ts
- ...

## Visual intent
- 390x844で読める
- 紙/黒インク/ランタン/記憶帳のUI文法を強める
- primary CTAを押したく見せる
- generic web menu感を減らす

## Verification
- [ ] pnpm build
- [ ] pnpm test
- [ ] pnpm stage1:fun-pass:verify
- [ ] pnpm character-assets:verify
- [ ] pnpm runtime-assets:verify
- [ ] git diff --check

## 390x844 manual check
- [ ] TOP
- [ ] StageSelect
- [ ] Growth
- [ ] Collection
- [ ] Achievements tab
- [ ] NEW badge
- [ ] Back to TOP flow
- [ ] No console error

## Out of scope
- Stage3
- Combat balance
- Unity migration
- Full 3D conversion
- Combat Juice overhaul

## Remaining risks
- 実機タッチでの押し心地は追加確認が必要
- Combat JuiceはPR50で対応
- Claude Design targetとの差分はスクショ比較で再確認
```

---

## 10. Claude Code用プロンプト

```txt
あなたは /Users/m-shogo/Developer/personal/vamp-pon のみを対象に作業してください。
GitHub repo は https://github.com/m-shogo/vamp-pon.git です。
このrepo以外は絶対に触らないでください。

mainへ直接pushしないでください。
PR48 が merge 済みか確認してください。
未mergeなら作業を止めて報告してください。

目的:
PR49 Web/Phaser Visual Polish を実装する。
Stage3や戦闘バランス追加ではなく、TOP / StageSelect / Collection表層 / 共通UIのアプリ感を上げる。

必ず先に読む:
- docs/visual-target-board.md
- docs/visual-quality-guide.md
- docs/visual-direction.md
- docs/visual-audit-current.md
- docs/claude-design-handoff-pack.md
- docs/pr49-visual-polish-worklist.md

さらに、Claude Designのv2成果物がある場合はそれも実装基準として読む。

対象:
- src/game/scenes/TopScene.ts
- src/game/scenes/StageSelectScene.ts
- src/game/scenes/CollectionScene.ts
- src/game/ui/storybookUi.ts
- src/game/ui/pressFeedback.ts
- 必要なら小さな共通UI helperを追加

やること:
1. TOPを「メニュー」ではなく「ゲームの顔」にする
2. StageSelectを地図帳/記録帳っぽくする
3. Collection表層を忘れ物帳っぽくする
4. 共通UI品質を上げる
5. 390x844で確認する

やらないこと:
- Stage3追加
- Unity移行
- 戦闘バランス大改造
- 新規ゲームシステム
- 全キャラ3D化
- 大量画像追加
- 汎用ソシャゲUI化
- ネオンSF化
- 魔法陣や赤目悪魔化の追加

検証:
- pnpm build
- pnpm test
- pnpm stage1:fun-pass:verify
- pnpm character-assets:verify
- pnpm runtime-assets:verify
- git diff --check

PRを作成してください。
mergeはしないでください。
PR本文には変更ファイル、改善内容、検証、390x844確認、残リスクを書いてください。
```
