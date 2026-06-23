# Visual Target Board / App Quality Foundation

Vamp Pon の見た目・アプリ感・演出品質を一段上げるための、画面別ターゲットボード。

このドキュメントは **Stage追加や機能追加より先に、完成画面の基準を固定する** ためのもの。
Web/Phaser 実装を捨てず、まず 390x844 の画面品質を上げる。Unity は全移植ではなく、必要になった場合のみ 30秒デモで検証する。

---

## 0. 今回の判断

### 先にやること

```txt
1. TOP / Battle / Result の完成目標画面を作る
2. その画面に合わせて Phaser 実装を磨く
3. 実装後に 390x844 で確認する
4. それでも限界が見えたら Unity 30秒デモへ進む
```

### 今はやらないこと

```txt
- Stage3追加
- Stage量産
- Unity全移植
- 全キャラ3D化
- 本物3Dモデル量産
- 新規ゲームシステム追加
- 戦闘バランス大改造
```

### 目的

機能数ではなく、初見で「ちゃんとしたスマホゲームに見える」基準を作る。

```txt
触る前から雰囲気がある
押した時に気持ちいい
撃破・吸引・報酬に手触りがある
390x844で読める
世界観とUIが分離していない
```

---

## 1. 固定コンセプト

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
```

### 主人公ユイの固定事項

```txt
- ランタンは本人の右手
- バッグ紐は右肩から左腰
- バッグ本体は左腰
- 左向きでも奥側のランタンを完全に消さない
- 優しいが弱くない
- 光は暖色ランタン
- 黒耀化時は黒インクに侵食されるが、主人公性は消さない
- 普通のVRoid/量産アバター感は避ける
- 紙人形、低ポリ、ドット味、絵本、ミニチュア感を重視
```

### 敵の固定事項

```txt
- 小さい敵: オンブ
- 大きい敵: オンブロ
- 黒インク影
- 怖すぎない
- 白目・輪郭・モヤで読ませる
- 背景と同化しない
```

---

## 2. 現状診断

### 全体

現状は、世界観の単語と基礎UIは揃っている。
ただし、まだ「完成画面」ではなく「機能が揃った開発画面」に見える部分が残っている。

主な原因:

```txt
- 大きな主役絵・主役シルエットが少ない
- 背景、カード、ボタンの質感が矩形 + stroke に寄っている
- 画面ごとの構図差が弱い
- UIが全部同じトーンで、TOP/Battle/Resultの記憶に残る差が弱い
- 報酬や勝利の“ご褒美感”がまだ薄い
- エフェクトが点在していて、入力→溜め→解放→余韻の連鎖が弱い
```

### TOP

現状の良いところ:

```txt
- 暗い夜 + パネル + 金色の方向は合っている
- ボタン階層はある
- 忘れ物帳の新着バッジ導線がある
- BGM導入済み
```

弱いところ:

```txt
- タイトル、ユイ、ランタンの主役感がまだ足りない
- 中央の余白がUIだけで埋まっており、タイトル画面としての記憶が弱い
- 背景粒子が“ただの点”に見えやすい
- ボタンの押し心地はあるが、質感はまだ紙カードの矩形寄り
- 起動した瞬間のアプリ感、ロゴ感、光の演出が弱い
```

TOPの目標:

```txt
暗い画面の中で、小さなランタンがまず目に入る。
タイトル、ユイ、夜の紙片、黒インクの縁が一体になっている。
ボタンは操作パネルではなく、記録帳の紙片を押している感触。
```

---

### Battle

現状の良いところ:

```txt
- MainSceneに RunPacingEffects / StageAtmosphere / BerserkFeedback / EffectManager が入っている
- EXP、カプセル、レベルアップ、進化、黒耀化の状態遷移はある
- HUDはHP/時間/Lv/欠片/所持品/必殺/黒耀の機能が揃っている
- pause, speed, inventory slot など実用導線はある
```

弱いところ:

```txt
- 画面全体の“戦っている気持ちよさ”がまだ薄い
- 撃破時の黒インク放出、EXP吸引、連鎖の快感が不足
- HUDが情報としては揃っているが、アプリの顔としてはまだ硬い
- 右下必殺/黒耀の格が足りない
- 敵撃破、被弾、回復、カプセル、進化の視覚言語が細く、報酬ループが弱く見える
```

Battleの目標:

```txt
画面は暗いが、ユイのランタンで中心が読める。
敵は黒インクとして崩れ、記憶の欠片が弧を描いて吸い込まれる。
HUDは薄く、邪魔しないが高級感がある。
必殺/黒耀化は“押したい”見た目になる。
```

---

### Result

現状の良いところ:

```txt
- クリア/敗北でトーン差がある
- 報酬カウントアップがある
- Rank表示がある
- 実績/記録/ステージ開放/成長導線が入っている
- Clear時に dawn 系の演出がある
```

弱いところ:

```txt
- 行が多く、記録帳ではなく精算表に見えやすい
- ランク、報酬、実績、成長CTAの主従がまだ弱い
- “朝が来た”という画面の劇的変化が足りない
- 負けても進んだ、という fail-forward の嬉しさがまだ薄い
- 報酬の価値が数字表示に寄っていて、獲得物の質感が足りない
```

Resultの目標:

```txt
勝利時は、暗い紙の夜が朝色に裂け、記憶ページが開く。
敗北時も、真っ暗ではなく、小さな光が残る。
数字はあるが、中心は“今回持ち帰ったもの”。
成長へ押したくなる。
```

---

### StageSelect

弱いところ:

```txt
- ステージカードはあるが、地図帳/旅の記録感がまだ弱い
- Easy/Normal/Hardの差がテキスト中心
- ステージごとの空気差がカードの質感に出きっていない
- 下部ボタン群が業務UIに寄りやすい
```

目標:

```txt
地図帳をめくって夜路を選ぶ。
難易度はただの数値ではなく、紙の痛み・黒インク量・灯りの細さで見える。
```

---

### Collection / 実績

弱いところ:

```txt
- 6タブ化で情報量が増えたため、390pxではタブが窮屈になりやすい
- 記録帳/星図/実績の質感差がまだ弱い
- NEW/seenは機能するが、嬉しさの演出は薄い
```

目標:

```txt
ただの一覧ではなく、忘れ物帳を開いている画面。
NEWは作業通知ではなく、“夜が少し読めるようになった”嬉しさにする。
```

---

## 3. 最優先ターゲット3枚

### 3.1 TOP Target

画面要件:

```txt
- 390x844 vertical
- タイトル画面
- ユイ/ランタン/ロゴ/ボタンが一体
- 背景は暗い紙の夜
- 端に黒インク
- 中央下に押したくなる紙ボタン
- 日本語UI領域は読みやすい
```

構図:

```txt
上部      : ロゴ + 小さな光
中央      : ユイまたはランタン主役のシルエット
中央下    : 夜へ出る / 成長 / 忘れ物帳
下部      : 小さな地図線、紙片、バージョン/設定導線
画面端    : 黒インクのにじみ + 紙の暗い縁
```

Claude Design / 画像生成プロンプト:

```txt
Create a 390x844 vertical mobile game title screen concept for Vamp Pon.

World:
dark storybook night, paper texture, black ink shadows around the edges, small warm lantern light, memory fragments, forgotten street, cozy but not childish, dark but not horror.

Main character:
Yui is a small heroine with a warm lantern in her right hand. Bag strap from right shoulder to left waist, bag on left waist. Gentle but not weak. Paper-doll / low-poly / dot-flavored miniature feeling. Avoid generic anime, avoid VRoid avatar look, avoid glossy plastic.

Composition:
Strong readable title/logo area near top. Yui and lantern glow are the emotional center. Buttons are tactile paper cards with warm glow and pressed feeling. No cheap flat rectangles. UI has app-quality mobile game finish.

Text handling:
Readable Japanese UI blocks. If exact text cannot be rendered correctly, leave text as clean placeholder blocks without fake letters.

Mood keywords:
paper night, black ink bleed, small lantern, memory notebook, premium mobile game, 390x844, title screen, not horror, no neon sci-fi.
```

Reject条件:

```txt
- VRoid/量産アバター感
- 普通のファンタジーRPG背景
- ボタンがただの角丸矩形
- ロゴが読めない
- 文字の偽字が目立つ
- ランタンが左手になる
- バッグが逆になる
- 明るすぎて夜が消える
```

---

### 3.2 Battle Target

画面要件:

```txt
- 390x844 vertical
- Web/Phaserの現行戦闘画面に落とせる
- ユイ、敵、EXP、HUD、必殺/黒耀が読める
- エフェクトは派手だが視認性を壊さない
```

構図:

```txt
上部      : compact premium HUD
中央      : ユイ + ランタン光 + 敵群
右下      : 必殺ゲージ/ボタン
左下      : 黒耀/portrait or control areaの邪魔にならない処理
下部      : 所持品スロットは薄く、でも読める
画面全体  : 黒インク粒子 + 暖色EXP吸引曲線
```

Claude Design / 画像生成プロンプト:

```txt
Create a 390x844 vertical mobile roguelite battle screenshot concept for Vamp Pon.

World:
dark paper map texture, forgotten street at night, black ink shadows, warm lantern light, small memory fragments, storybook pixel flavor.

Player:
Small Yui with a warm lantern in her right hand. The lantern glow clearly marks the player position. She should remain readable at mobile size.

Enemies:
Black ink shadow creatures, small Onbu and larger Onburo silhouettes. Soft smoky ink, white eye highlights, not horror, not realistic monsters.

Combat feel:
Enemies burst into black ink particles when defeated. Memory EXP fragments glow softly and curve toward the player. Hit effects are short black ink puffs plus warm light sparks. Ultimate gauge is visible and premium, not cheap. Black-glow transformation hint at screen edges.

UI:
Compact top HUD for time, HP, level, fragments. Bottom inventory slots are readable but low profile. Right-side ultimate button has strong pressed/tactile feeling. Keep readability. Avoid visual noise.

Style:
mobile game screenshot, app-quality UI, paper/ink/lantern language, no neon sci-fi, no generic fantasy, no horror gore.
```

Reject条件:

```txt
- 弾幕でユイが見えない
- EXPと敵が同じ色で読めない
- HUDが家庭用ゲーム風でスマホに見えない
- 必殺ボタンが安い丸ボタン
- 黒耀化がただの赤目・悪魔化になる
```

---

### 3.3 Result Target

画面要件:

```txt
- 390x844 vertical
- Clear / Defeat どちらも成立
- 報酬、記録、成長CTAが一目で分かる
- 朝・記憶ページ・忘れ物帳のご褒美感
```

構図:

```txt
上部      : 夜明け / 夜に飲まれた の大見出し
中央      : 記憶ページ型の報酬カード
右上or中央: Rank seal
中央下    : 持ち帰ったもの / 実績 / 開放
下部      : 成長へ / もう一度 / ステージ選択
背景      : Clearは朝色、Defeatは暗いが灯りが残る
```

Claude Design / 画像生成プロンプト:

```txt
Create a 390x844 vertical mobile game result screen concept for Vamp Pon.

World:
warm dawn light breaking through a dark paper night. Memory page / forgotten notebook UI. Black ink recedes at the edges. Small lantern glow remains.

Clear version:
The screen should feel rewarding and premium. A memory page opens in the center. Rank seal, reward count-up areas, achievement/record addition area, and growth CTA are clearly hierarchical.

Defeat version:
Still dark, but not punishing. A small warm light remains. The player clearly sees what progress was carried home.

UI:
Tactile paper buttons, lantern accents, no cheap flat rectangles. Clear hierarchy: result title, rank, rewards, records, next action. Readable Japanese UI blocks. If exact text cannot be rendered, use clean blocks.

Style:
premium mobile game finish screen, paper texture, black ink, memory fragments, dawn, app-quality, no generic fantasy, no neon, no clutter.
```

Reject条件:

```txt
- 精算表に見える
- 数字だけでご褒美がない
- CTAが弱い
- 朝の変化がない
- 負け画面がただ暗くて戻りたくなる
```

---

## 4. 追加ターゲット4枚

### StageSelect

```txt
390x844 vertical mobile game stage select.
A storybook map / forgotten notebook page. Stage cards look like places on a paper night map.
Difficulty is shown by ink density, lantern brightness, paper damage, not only text.
Current selected stage is a premium card with image preview and warm edge light.
Bottom navigation is tactile and not business-like.
```

### Collection / Achievements

```txt
390x844 vertical mobile collection book screen.
A forgotten notebook / atlas / memory archive.
Tabs are compact but readable. NEW badges feel like small lantern sparks, not notification noise.
Achievement cards are paper records with reward and completion state.
Premium archive feeling, not settings screen.
```

### LevelUp

```txt
390x844 vertical mobile level up choice screen.
Three tactile paper choice cards enter with staggered motion.
Each card has strong item icon area, rarity/accent by color, readable description, and pressed feedback.
Evolution/fusion/awakening candidates feel special without using neon magic circles.
```

### 黒耀化 / 必殺 Cut-in

```txt
390x844 vertical mobile special activation screen.
Black ink invades screen edges, but Yui's lantern light remains.
Cut-in is wide, fast, and readable.
The moment feels dangerous but heroic.
No generic demon mode. No cute red-eye mascot mode.
```

---

## 5. Web/Phaser 実装へ落とす優先順位

### PR49: Web/Phaser Visual Polish

対象:

```txt
TopScene
StageSelectScene
storybookUi
pressFeedback
CollectionSceneの表層
```

やること:

```txt
- TOPの主役構図をランタン/ユイ/タイトルへ寄せる
- 紙カード/ボタンを矩形から“紙片”へ近づける
- 背景粒子を紙片・インク・灯りに整理
- ステージカードを地図帳/記録帳寄りにする
- 画面遷移のApp shell感を上げる
```

やらないこと:

```txt
- 戦闘バランス変更
- Stage3追加
- 新規永続成長システム
```

### PR50: Combat Juice Overhaul

対象:

```txt
MainScene
EffectManager
RunPacingEffects
StageAtmosphere
BerserkFeedback
Hud
pickups/enemies/weapons related visual hooks
```

やること:

```txt
- 撃破 ink burst
- EXP吸引 curve / trail
- hit flash / short stop / micro shake
- death burstの音/光/粒子連携
- ultimate ready/fire の格上げ
- 黒耀化 start/end の画面端にじみ
- clear dawn / defeat carry-home の演出改善
```

やらないこと:

```txt
- 敵HP/火力の大改造
- 武器体系の大変更
- Unity移植
```

---

## 6. 390x844 確認リスト

```txt
TOP
- 起動直後にタイトル/ランタン/主ボタンが視線誘導される
- ボタンが押したく見える
- 新着バッジが通知ではなく灯りに見える
- 設定/成長/忘れ物帳が詰まりすぎない

StageSelect
- ステージカードが地図帳に見える
- 深度差がテキストだけではない
- 下部3ボタンが業務UIに見えない

Battle
- ユイの位置が一瞬で分かる
- 敵と背景が同化しない
- EXPが気持ちよく吸い込まれる
- 右下必殺が押したい見た目
- 黒耀化の存在が分かるが邪魔しない
- 下部所持品が読める

LevelUp
- 3択カードの情報が読める
- アイコン・名前・効果・特別度の優先順位が明確
- 入替/受け取らないが押し間違いにくい

Result
- Clear/Defeatの差が一目で分かる
- 報酬が精算表ではなくご褒美に見える
- 成長へ行きたくなる
- 実績/記録追加が嬉しい

Collection
- 6タブが390pxで窮屈すぎない
- NEW状態がページングしても保持される
- 実績カードが読みやすい
```

---

## 7. Unity 30秒デモへ進む条件

Web/Phaserで以下がどうしても解決しない場合だけ、Unity 30秒デモへ進む。

```txt
- TOP/Battle/Resultの画面密度が目標に届かない
- 必殺/黒耀化の演出がPhaserでは安く見える
- キャラ疑似3D/ライティング/カメラ演出の検証が必要
- 30秒の映像品質をUnityで比較したい
```

Unityでやる場合も、最初はこれだけ:

```txt
TOP
Stage Start
10〜15秒戦闘
敵撃破
EXP吸引
LevelUp
必殺/黒耀化
Result
```

やらない:

```txt
- 全移植
- 全データ移植
- 永続保存移植
- 全キャラ3D化
```

---

## 8. 合格ライン

PR48時点:

```txt
- 完成画面の基準が言語化されている
- TOP/Battle/Resultの生成プロンプトがすぐ使える
- PR49/PR50の実装範囲が分かれている
- Stage3より先にVisual品質を上げる判断が固定されている
```

PR49以降:

```txt
- 390x844でスクショを見た時、開発画面ではなくスマホゲーム画面に見える
- “紙の夜 + 黒インク + 小さな光 + 記憶帳”がUIにも戦闘にも出ている
- 機能を増やしていないのに、触りたくなる度が上がっている
```
