# Visual Quality Guide

Vamp Pon を Web/Phaser のまま一段上のアプリ品質に寄せるための実装ガイド。

`docs/visual-direction.md` は世界観と見た目の基本文法。
このドキュメントは **画面品質・UI密度・演出の触り心地** に寄せた、PR49以降の実装判断用ガイド。

---

## 1. 判断基準

### 画面の合格条件

```txt
1. 390x844で読める
2. 画面の主役が3秒以内に分かる
3. 押せるものが押したく見える
4. 暗いが黒つぶれしない
5. 紙・インク・灯り・記憶帳の文法から外れない
6. 数字や説明に頼りすぎない
7. 気持ちいい演出に、溜め・解放・余韻がある
```

### 画面の不合格条件

```txt
- 背景 + 矩形UI + テキストだけに見える
- ボタンがWebフォームに見える
- 報酬画面が精算表に見える
- 戦闘画面でユイの位置が分からない
- エフェクトで敵/弾/EXPが読めない
- 画面ごとの差がタイトル文言だけ
- “光っているだけ”で意味がない
```

---

## 2. 画面ごとの主役

| 画面 | 主役 | 画面の感情 | NG |
|---|---|---|---|
| TOP | ユイ/ランタン/ロゴ | 夜へ入る期待 | メニュー一覧 |
| StageSelect | 地図帳/夜路カード | どこへ行くか選ぶ | 設定画面 |
| Growth | 黒曜片と強化カード | 次は勝てる | 数値表 |
| Battle | ユイのランタン/敵/EXP | 撃破と吸引 | HUD過多 |
| LevelUp | 3択カード | 選ぶ楽しさ | 説明文の山 |
| Result | 記憶ページ/報酬/朝 | 持ち帰った嬉しさ | 精算表 |
| Collection | 忘れ物帳/星図/実績 | 世界が読める | データベース |
| 黒耀化 | 侵食とランタン光 | 危険だが主人公 | 悪魔化テンプレ |

---

## 3. 共有UIトークンの方向

既存の `STORYBOOK_UI` は方向性として使える。
ただし、PR49以降では “色定義” だけでなく “画面品質の役割” として整理する。

### 追加したい概念トークン

```txt
screenVignetteDark     : 画面端の黒インク/夜のにじみ
screenWarmFocus        : ランタン周辺の暖色焦点
paperCardBase          : 古紙カード基本色
paperCardPressed       : 押下時の沈み色
paperCardEdge          : 手描き縁/破れ縁
inkBleedSoft           : 背景端のにじみ
inkBleedCombat         : 撃破・被弾の黒インク粒子
memoryGold             : EXP/記憶の欠片
memoryGoldSoft         : EXP trail/glow
morningReward          : Clear/Resultの朝色
dangerBlack            : 黒耀化の侵食
```

### 色の考え方

```txt
暗い背景: ただ黒くしない。藍紫/濃紺/紙の影で階層を作る。
暖色光: ランタン、EXP、報酬に限定して価値を作る。
黒インク: 敵、画面端、黒耀化。背景の黒とは少し分ける。
紙色: ボタン、カード、記録。明るすぎると世界観から浮く。
朝色: Clear/Result/回復/合体のご褒美に使う。
```

---

## 4. 紙カード/ボタン品質

### 現状の弱点

`drawPaperCard` / `drawStorybookPanel` は便利だが、矩形 + stroke の印象が強く、量産UIに見えやすい。

### 改善方針

```txt
- 角丸だけに頼らない
- 内側ハイライトを水平線だけで終わらせない
- 紙片の微妙なズレ、影、端の欠けをGraphicsで少量追加する
- 押下時に scale だけでなく y+1 / 影縮小 / 光の一瞬点灯を入れる
- primary CTAだけは紙 + ランタン光 + 外周の微細な揺れを持たせる
```

### 実装候補

```txt
createPremiumPaperButton(scene, options)
createPaperPanel(scene, options)
createLanternBadge(scene, options)
createNewSparkBadge(scene, options)
```

最低限の振る舞い:

```txt
pointerdown : 0.97 scale / y+1 / shadow alpha down / se
pointerup   : 1.00 scale / warm flash / se if confirm
pointerover : web only, subtle glow
idle primary: 1.5〜2.4secの極薄呼吸
```

NG:

```txt
- すべてのボタンを同じ光量で光らせる
- primary/secondary/mutedの差を色だけにする
- テキストを増やして階層を作る
```

---

## 5. TOP品質ガイド

### 目標

TOPは単なるメニューではなく、ゲームの顔。

```txt
ロゴ / ユイ / ランタン / 夜の紙片 / 黒インクの端 / 主CTA
```

この6つが同時に見えること。

### 実装改善候補

```txt
TopScene
- 背景に screenVignetteDark + paper grain + ink edge を追加
- 中央にランタン焦点を作る
- 可能なら Yui silhouette / lantern icon / title ornament を追加
- titleDecoration をロゴ周りの“額縁”ではなく“ランタンで照らされた紙片”に寄せる
- main CTAを大きく、他ボタンは小さく整理
- NEW badge は ★N ではなく小さな灯り/封印紙のように見せる
```

### 390x844視線誘導

```txt
1. 画面中央上のタイトル
2. 中央のランタン光
3. 夜へ出るボタン
4. 成長/忘れ物帳
5. 下部の小さな導線
```

---

## 6. Battle品質ガイド

### 目標

戦闘は “撃破 → 黒インクがほどける → 記憶が吸い込まれる” を気持ちよく見せる。

### Combat Juice の基本単位

```txt
hit:
- 1〜2fの短い明滅
- 小さいインク粒子
- 低音SE or 短い紙破れSE

kill:
- 敵の中心から黒インク粒子
- 白目/輪郭が一瞬ほどける
- 小さな暖色欠片が残る
- EXPへ視線がつながる

pickup:
- EXPが直線ではなく曲線で吸い込まれる
- 吸い込み終点に小さい暖色pop
- 複数取得時は粒が遅れて集まる

levelup:
- BGMを少しduck
- 周辺が暗くなり、カードだけ暖色で浮く
- 3択カードが stagger で入る

ultimate:
- ready時は右下が一段格上げ
- fire時は画面が一瞬締まり、光が横へ抜ける
- ただの白flashで終わらせない

黒耀化:
- 端から黒インクが侵食
- 中央のランタン光は残る
- 終了時に黒インクが剥がれて疲労感が残る
```

### 視認性ルール

```txt
ユイ > 敵 > EXP > 弾 > 背景装飾 > HUD装飾
```

この順番を崩さない。

NG:

```txt
- 画面揺れが長い
- 粒子が白/金だらけでEXPと混ざる
- 黒インクが濃すぎて敵HP/弾が見えない
- 右下必殺がHUDと同化する
```

---

## 7. Result品質ガイド

### 目標

Resultは “今回の夜から何を持ち帰ったか” を見せる画面。

### Clear

```txt
- 背景に朝色が差す
- 黒インクが端へ退く
- 中央に記憶ページが開く
- Rankはシール/封蝋/押印のように見える
- 報酬はcount-up + SE + 小さい光
- 成長CTAが一番押したく見える
```

### Defeat

```txt
- 真っ暗にしすぎない
- 小さいランタン光を残す
- “持ち帰った黒曜片/EXP/記録” を前に出す
- 負けても進んだ感を出す
- 成長へ導線をprimaryにする
```

### 現状からの改善候補

```txt
Overlays.showResult
- 数字の行を詰め込みすぎず、報酬カードを2段構成にする
- “持ち帰ったもの” summaryを上に出す
- detail logは折りたたみ相当の小さな扱いにする
- unlock/achievementは小さなtoastではなく記憶ページ内の特別枠にする
- clear時のaddResultWarmGlowを背景演出として強めるが、文字の裏は暗膜を保つ
```

NG:

```txt
- 7行の精算表が画面の主役になる
- TOPへ戻るが一番目立つ
- Defeatが“損した”だけに見える
```

---

## 8. Collection / Achievements品質ガイド

### 目標

Collectionはデータ一覧ではなく、忘れ物帳。

### 6タブ問題

PR47で実績タブが入ったため、タブが横に増えた。
390pxでは以下を守る。

```txt
- shortLabelは2〜3文字まで
- タブの高さは28〜32px
- activeは色 + 少し上に出る / 光る / 紙が乗る など複合で示す
- inactiveは暗くしすぎず、押せることを残す
- NEWはタブ文字を押し潰さない。小さい灯り点で示す
```

### 実績カード

```txt
達成済み : 暖色紙 + 小さい灯り
未達成   : 暗紙 + うっすら輪郭
hidden   : 黒インクで読めない紙
報酬済み : 緑ではなく“封済み/押印済み”表現も検討
```

---

## 9. 画像生成 / Claude Design の使い方

### 目的

画像生成は本番素材を一発で作るものではなく、完成画面の基準を作るもの。

```txt
- TOP / Battle / Result の3枚を最初に作る
- その後、StageSelect / Collection / LevelUp / 黒耀化 を足す
- 生成結果はそのまま実装せず、構図・密度・光・UI階層を抽出する
```

### 生成物のレビュー観点

```txt
1. Vamp Ponに見えるか
2. 390x844で成立するか
3. ユイ/ランタンの固定事項を守っているか
4. UIが押せそうか
5. 文字領域が破綻していないか
6. Web/Phaser実装へ分解できるか
7. 普通のソシャゲ/普通の3Dアバターに見えないか
```

---

## 10. 疑似3D / 3D風素材の判断

### 使ってよい

```txt
- TOPのユイ立ち絵/3D風紙人形
- Resultの記憶ページ演出
- 黒耀化カットイン
- 30秒Unityデモ用の見た目検証
```

### 注意

```txt
- 本物3Dモデル化を前提にしない
- TripoSR/OBJは検証用として扱う
- 戦闘中の量産キャラを急に全3D化しない
- VRoid/量産アバター感が出たら不採用
```

### 現実的な本命

```txt
AI生成3D風素材 + 2D/擬似3Dアニメ
```

理由:

```txt
- ユーザーが3D手作業できない
- ドット連番スプライト量産は重い
- Vamp Ponに合う本物3Dは難しい
- 2Dで構図と光を決めた方が早い
```

---

## 11. PR分割

### PR48: Visual Target Board / App Quality Foundation

```txt
- docs/visual-target-board.md
- docs/visual-quality-guide.md
- 現状診断
- 画面別ターゲット
- TOP/Battle/Result生成プロンプト
- PR49/PR50の範囲分け
```

### PR49: Web/Phaser Visual Polish

```txt
- TopScene
- StageSelectScene
- storybookUi
- pressFeedback
- Collection表層
- 390x844確認
```

### PR50: Combat Juice Overhaul

```txt
- EffectManager
- RunPacingEffects
- BerserkFeedback
- Hud
- MainScene visual hooks
- EXP吸引/撃破/必殺/黒耀化/Result演出
```

### PR51以降

```txt
PR51: App Shell / PWA準備
PR52: Unity 30秒デモ仕様
PR53: Unity 30秒デモ検証
PR54: Stage Content Factory
PR55: Stage3 Vertical Slice
```

---

## 12. 検証

docsのみPR48:

```txt
- 目視レビュー
- markdownのリンク/表記確認
```

PR49以降:

```txt
pnpm build
pnpm test
pnpm stage1:fun-pass:verify
pnpm character-assets:verify
pnpm runtime-assets:verify
git diff --check
```

390x844 manual:

```txt
TOP
StageSelect
Growth
Collection
Stage1 battle
Stage2 battle
LevelUp
Ultimate ready/fire
黒耀化 start/end
Boss warning
Result clear/defeat
console errorなし
```

---

## 13. 最重要メモ

```txt
Stage追加より、まず完成画面の基準。
機能追加より、まず触りたくなる画面。
派手にするより、意味のある光・紙・インク・朝。
Webで届くところまで詰める。
Unityは逃げ道ではなく、30秒比較検証だけ。
```
