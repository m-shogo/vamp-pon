# Unity Visual Art Direction Lock 2026-06-30

## Purpose

Unity移行中に見た目が散らからないよう、Vamp Ponの美術方向を固定する。

このdocは「最終ポリッシュ指示」ではなく、今後のUI、キャラ、敵、VFX、背景、生成素材投入で守る最低限の美術ルールである。

合言葉:

```txt
今は完璧に磨かない。
でも、ダサくなる方向には進ませない。
```

## Fixed Visual Rules

以下はUnity移行中の固定ルール。

1. 色数を増やしすぎない。
2. 紙UI / 黒インク / ランタン光を主軸にする。
3. レア演出だけ派手にする。
4. 通常画面は静かにする。
5. 文字可読性を最優先する。
6. キャラ素材の質感をバラバラにしない。
7. 生成画像をそのまま混ぜない。

## Visual Core

Vamp Ponの見た目の核:

- 夜
- 記憶
- 忘れ物
- 黒インク
- 小さなランタン光
- 紙の台帳 / 絵本 / 旅支度
- 暗いが怖すぎない
- 朝に向かう救い

この核から外れる表現は、単体で良く見えても採用しない。

## Palette Discipline

色は増やさない。

主軸:

- deep night: 背景、暗幕、黒曜化の土台
- paper ivory / warm beige: 紙UI、カード、記憶帳
- black ink / blue black / purple black: 敵、黒インク、影
- lantern amber: 主人公、CTA、回復、希望、主導線
- dusty rose / crimson black: 黒曜化、危険、暴走、rare accent
- muted teal / soft blue: 補助情報、静かな選択状態

禁止寄り:

- 原色を大量に使う
- サイバーUIに寄せる
- ネオン多用
- rainbow gradientで高級感を出そうとする
- レア以外の通常UIまで強く光らせる

## Lighting Rules

光の主役はランタン。

- 通常画面の光は暖色で小さく使う。
- 強いglowはRare、必殺、黒曜化、クリア報酬に限定する。
- Battle中のhit flashは短く、白飛びさせすぎない。
- 黒曜化は赤黒/紫黒で不穏にする。可愛いキラキラにしない。
- 背景は暗めに保ち、UIとキャラの読みやすさを優先する。

## Material / Texture Rules

素材感の軸:

- 紙: ざらつき、手触り、少し厚み
- インク: にじみ、粒、影、乾いた黒
- ランタン: 小さく暖かい発光
- 記憶片: 紙片 / 光片 / ほこり

禁止:

- glossy plasticに寄せる
- リアル金属UIに寄せる
- 3Dモデル風とドット風と水彩風を無秩序に混ぜる
- 生成画像の質感差をそのままruntimeに持ち込む

## 2D / 2.5D Direction

フル3D化を正解にしない。

推奨方向:

```txt
2Dゲーム + 3Dレンダー風素材 + Unity light/glow/particle/motion
```

キャラ/敵/アイテムは2Dスプライト運用を基本にする。
ただし、元素材は3Dレンダー風、粘土風、絵本風などで立体感を作ってよい。

やること:

- 2Dスプライトに影、glow、particle、motionで厚みを出す
- UIは9-slice / Prefab / Sprite Atlas前提で組む
- 背景はparallax、fog、lantern glowで奥行きを出す
- Cutinだけは強い演出を許可する

やらないこと:

- いきなり全キャラをリアルタイム3Dモデル化する
- 3D化しただけで垢抜けると判断する
- Web素材をUnityへ雑移植してproduction扱いにする

## UI Direction

UIは「メニュー」ではなく「旅の記録帳」として扱う。

- TOP: 夜に出る入口
- Stage Select: 今夜どこへ行くか地図を開く画面
- LevelUp: 記憶カードを選ぶ儀式
- Result: 今夜拾った記憶を手帳へ貼る画面
- Collection: 集めた記憶を見返す台帳
- Cutin: 物語が一瞬だけ強く割り込む場面

UI部品は以下を優先してPrefab化する。

- PaperPanel
- PaperCTAButton
- SmallPaperCard
- WaxSealBadge
- PaperTitleBanner
- StageCompanionFaceCard
- ResultRankSeal
- ResultRewardCard
- LevelUpCard
- CutinBand

## Motion / Feel Rules

垢抜けは静止画だけでは出ない。
各UI操作には可能な限り以下を揃える。

- 見た目の状態変化
- 短いmotion
- light/glowの反応
- SE hook
- 必要ならhaptic hook
- 余韻

優先する気持ちよさ:

- LevelUp: カード入場、Rare pulse、選択時の沈み/拡大、他カードdim
- Result: ランク封蝋stamp、報酬pop、New badge後出し、成長CTA誘導
- Battle: hit flash、enemy squash、ink particle、memory shard吸い込み、必殺ゲージglow
- Stage Select: 顔札選択、route node glow、Start CTAの押したくなる感
- Cutin: 暗幕、コピー帯、shake、黒インクparticle、短い余韻

## Generated Image Intake Rules

生成画像はそのまま混ぜない。

生成画像の用途:

- 方向性確認
- design target
- 部品化の元ネタ
- candidate proof

runtime productionへ入れる条件:

1. 用途が明確である。
2. 画面サイズで可読性を確認している。
3. text-baked runtime imageではない。
4. alpha / edge / green spill / watermarkのQAを通る。
5. 質感がVamp PonのVisual Coreに合う。
6. `candidate` と `approved` を混同しない。
7. どのPrefab/Sceneがownerか明確である。

## Do / Don't

Do:

- 紙、インク、ランタン光を繰り返し使う
- 通常UIは静かに、報酬/rare/必殺だけ上げる
- 390x844 / 360x800 / 430x932で読む
- Unity Editorだけでなく実機想定で見る
- before/afterを残す
- 画面単位ではなくPrefab単位で品質を上げる

Don't:

- その場の見栄えだけで色を足す
- 画面ごとに別ジャンルの素材を混ぜる
- レア演出以外を常時キラキラさせる
- 文字を画像に焼き込む
- Web/prototype素材をproduction approved扱いする
- PC/WebGLだけで完了判断する
- かわいいだけに寄せて夜/記憶/黒インクの寂しさを消す

## Approval Gate

Unity素材やUIをproduction候補へ進める前に、以下を確認する。

- Visual Coreから外れていない
- 色数が増えすぎていない
- 紙UI / 黒インク / ランタン光の軸が残っている
- 通常画面とrare/必殺/黒曜化の強弱がある
- 文字が読める
- キャラ/敵/背景/UIの質感がバラバラでない
- 生成画像をそのまま混ぜていない
- Prefab化またはPrefab化方針がある
- mobile portraitで確認している

## When To Polish

今すぐやる:

- 美術ルールを守る
- UI Prefabの方向を揃える
- LevelUp / Result / Battle hit feelの気持ちよさを作る
- 素材をcandidate/approvedで分ける

後でやる:

- 最終的なカード反射
- レア粒子の細部調整
- 背景の最終parallax
- Cutinの完成演出
- SE/hapticの最終調整
- 全画面のproduction polish

## Current Decision

Unity移行は進めてよい。

ただし、以後のUnity作業は「FINAL画像に似ているか」だけで判断しない。

判断軸:

```txt
Vamp Ponらしいか
読めるか
触って気持ちいいか
通常とご褒美の差があるか
素材の質感が揃っているか
```
