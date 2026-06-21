# Vamp Pon Stage Visual App Safety Plan

## 0. 目的

この文書は、`docs/145-stage-1-to-5-emotional-beat-map.md` と `docs/146-stage-visual-design-guide.md` を、ブラウザだけでなく将来の iOS / Android アプリ化まで破綻させずに制作・実装するための安全基準である。

対象:

- Phaser のWeb実装
- スマホブラウザ
- PWA
- Capacitor等によるWebViewアプリ
- iOS / Android
- タブレット
- PCブラウザ

この段階ではゲームバランス、敵AI、武器性能、既存キャラクター素材を変更しない。

---

# 1. 絶対に壊してはいけない不変条件

## 1.1 論理解像度

```txt
logical gameplay size: 390 × 844
```

ゲーム内の座標、敵出現、弾道、ドロップ、当たり判定はこの論理領域を基準にする。

端末が広くても狭くても、ゲームプレイ上の可視範囲を安易に変更しない。

## 1.2 画面の役割分離

```txt
core gameplay
safe UI
visual overscan
browser / app shell
```

- `core gameplay`: 戦闘に影響する領域
- `safe UI`: HUDと操作UIを置く領域
- `visual overscan`: 端末差やカメラ演出のための追加背景
- `shell`: PC左右余白やアプリ外装。ゲーム判定を持たない

## 1.3 広い端末を有利にしない

禁止:

- PCだけ敵を早く発見できる
- タブレットだけ欠片を遠くまで確認できる
- 横長端末だけボス攻撃の安全地帯が広く見える
- 端末サイズでspawn位置、敵数、攻撃距離が変わる

余剰領域に表示できるものは背景、遠景、非戦闘情報だけとする。

## 1.4 重要物は可変トリミング領域へ置かない

以下はコア安全領域内へ置く。

- Stage固有の象徴物
- ギミック対象
- ボス登場位置
- 読ませる必要がある演出
- 必須ドロップ

端へ置いてよいもの:

- 紙の家の一部
- 遠景街灯
- ページの裂け目
- 装飾用の紙片
- 雰囲気用のインク

---

# 2. 現行実装から見た安全な変更順

現行のPhaser設定は `390×844`、`Phaser.Scale.FIT`、中央配置を基準としている。

この基準は当面維持する。

安全な作業順:

1. 設計資料
2. 静止画モック
3. 複数端末クロップ検証
4. アセット分解
5. 背景だけ仮実装
6. UI・敵・弾込みの視認性検証
7. パフォーマンス検証
8. production candidate昇格

避ける順序:

```txt
生成背景を作る
→ そのまま本編へ置く
→ 端末差に気づいて作り直す
```

---

# 3. Safe Area

## 3.1 CSS / OS Safe Area

将来のWebView・PWA・アプリでは以下を考慮する。

```css
env(safe-area-inset-top)
env(safe-area-inset-right)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
```

OSのノッチやホームインジケータ寸法を画像側へ焼き込まない。

## 3.2 論理画面内のデザイン安全帯

390×844上の目安:

```txt
上部HUD reserve:      y = 0〜104
主戦闘推奨領域:       y = 104〜660
操作UI reserve:       y = 660〜844
左右警告・余白:       x = 0〜48 / 342〜390
主視認領域:           x = 48〜342
```

実際のOS safe areaはCSS / runtimeで加算し、ゲーム画像へ固定しない。

## 3.3 操作UI

- 左下スティックと右下必殺ボタンは下端へ密着させない
- 親指で隠れる範囲へ重要情報を置かない
- UI背後の背景コントラストを下げる
- 操作UIは装飾画像の位置ではなくanchorから配置する

---

# 4. 対応端末マトリクス

最低限、次の表示をモックと実装で確認する。

| 区分 | 代表サイズ / 比率 | 確認項目 |
|---|---|---|
| 小型スマホ | 360×640前後 | UI可読性、縮小限界 |
| 基準スマホ | 390×844 | 正本 |
| 縦長スマホ | 393×873以上 | 上下余白、操作位置 |
| Android縦長 | 360×800〜900 | パンチホール、ナビ領域 |
| タブレット縦 | 3:4前後 | 左右拡張、ゲーム範囲不変 |
| PC縦窓 | 9:16周辺 | FIT、キーボードUI |
| PC横長 | 16:9 / 21:9 | 左右shell、黒帯防止 |
| 低いブラウザ | 高さ600px前後 | HUDと操作UIの衝突 |

すべての実機を毎回用意する必要はない。まずブラウザの固定viewportで機械的に確認し、節目で実機確認する。

---

# 5. 向きとアプリ挙動

## 5.1 画面方向

ゲームプレイは縦向きを正本とする。

アプリ化時の本命:

```txt
portrait lock
```

横向き対応を本編レイアウトの拡張として扱わない。

端末が横向きになった場合は次のどちらかとする。

1. OS側で縦固定
2. ゲームを停止し、縦向き案内を表示

横向き専用の広い戦闘範囲は作らない。

## 5.2 ライフサイクル

アプリがバックグラウンドへ移動した時:

- ゲーム時間を停止
- 敵AIを停止
- 攻撃クールダウンを勝手に進めない
- 音声を停止または減衰
- 復帰時に即被弾させない

復帰時は短い入力猶予またはポーズ画面を挟む。

## 5.3 画面回転・リサイズ

リサイズ時に次を再計算する。

- Phaser canvas表示倍率
- safe area
- HTML shell
- UI anchor

ゲーム内のワールド座標や敵位置をリサイズ倍率で書き換えない。

---

# 6. 入力安全性

## 6.1 タッチ

- `touch-action` によりブラウザスクロールやズーム誤作動を防ぐ
- pointer cancel時にスティック入力を必ず解除
- 複数指入力で移動が固定されないようにする
- 画面外へ指を動かしてもpointer up相当を処理する

## 6.2 マウス・キーボード

- PCで操作できても、タッチUIとゲームバランスを変えない
- hover必須UIを作らない
- 右クリックやブラウザショートカットへ重要操作を割り当てない

## 6.3 アクセシビリティへの余地

初期実装で全対応を必須にしないが、次を画像へ焼き込まない。

- 操作ボタン文字
- 数値
- 説明文
- 色だけに依存した危険判定

文字と数値はUIとして描画し、将来の拡大・言語変更に耐えるようにする。

---

# 7. 背景アセットのアプリ安全基準

## 7.1 一枚絵へ依存しない

必須分解:

```txt
base_floor
floor_variants
decals
props
landmarks
page_edges
ambient_effects
gimmick_objects
shell
```

生成画像は構図参照として使えるが、そのまま巨大背景1枚としてproductionへ昇格しない。

## 7.2 マスターサイズ

Stage 1の構図マスター:

```txt
minimum composition master: 720×1280
core crop guide:             390×844
```

マスターには上下左右の余剰背景を含める。

ただしproduction用素材は用途別の必要サイズへ分解する。

## 7.3 画像形式

- 透過が必要: PNG RGBA
- 完全不透明の大面積背景: 圧縮候補を実機で比較
- ピクセルアート: nearest、antialias無効
- 透過余白を不必要に巨大化しない
- Retina倍率を理由にゲーム内論理サイズを変えない

## 7.4 テクスチャ制約

安全側の初期方針:

- 1枚の巨大テクスチャを避ける
- 端末依存の最大テクスチャサイズへ近づけない
- 同種小物はatlas化候補
- 動かない背景へ毎フレームblendを重ねない
- 半透明巨大レイヤーを複数枚重ねない

実際の上限値は導入するラッパーと対象端末を確定後に計測で固定する。

---

# 8. パフォーマンス予算

## 8.1 基準

最初の基準端末では以下を目標とする。

```txt
normal play target: 60fps
fallback acceptance: stable 30fps
```

Stage背景だけでフレーム時間を大きく消費しない。

## 8.2 背景演出の上限方針

初期Stage 1では次を守る。

- 常時動く大型背景: 0〜1
- 常時ambient particle: 少量
- 大型半透明光: 必要最小限
- 背景パララックス: まず無し
- shader依存: まず無し
- ランタン等の点滅: 低頻度、低振幅

見た目を強くするために、動きより構図、シルエット、明度差を使う。

## 8.3 低品質モードへの余地

将来、次を個別に無効化できる構造を維持する。

- ambient particle
- 背景アニメーション
- 発光追加レイヤー
- カメラ演出
- shell装飾

ゲームプレイに必要な危険予告は低品質モードでも消さない。

---

# 9. 生成・制作フローの安全ゲート

## Gate 0: brief

必要条件:

- Stageの感情
- 象徴物
- 色
- 中央の静けさ
- UI reserve
- core crop
- overscan
- 禁止事項

## Gate 1: environment-only concept

背景だけの構図確認。

この段階はproduction素材ではない。

合格条件:

- 場所に見える
- Stage象徴が一つ強い
- 中央55〜65%が静か
- 端に切れてもよい装飾と重要物が分かれている

## Gate 2: gameplay composite

必ず配置:

- ユイ
- 共通小型敵
- 共通中型敵
- Stage固有敵
- 弾
- 欠片
- HUD
- スティック
- 必殺ボタン

合格条件:

- 一秒以内にユイを発見できる
- 危険予告が背景線に負けない
- 敵20体でも読みやすい
- 欠片を床装飾と誤認しない

## Gate 3: device crops

同じ構図から最低限次を出す。

- 390×844
- 小型スマホ相当
- 縦長スマホ相当
- タブレット縦
- PC横長shell込み

合格条件:

- 象徴物が失われない
- UIが重要物へ重ならない
- PC左右が黒帯に見えない
- 広い画面がゲーム上有利にならない

## Gate 4: asset decomposition

コンセプトを実装素材へ分解する。

- 再利用可能
- 差し替え可能
- 当たり判定なしを基本
- 生成画像の切り抜きだけで済ませない

## Gate 5: prototype integration

既存背景を削除せず、feature flagまたは選択可能なpreviewとして導入する。

禁止:

- いきなり既存本編を置換
- production IDの上書き
- fallback削除

## Gate 6: production candidate

- 実プレイ
- デバイス表示
- パフォーマンス
- アセット出所
- source / export証跡
- before / after

を残してから昇格する。

---

# 10. Stage 1の安全な制作順

## Phase A: 画面基準

作るもの:

1. 720×1280以上の構図マスター
2. 390×844 core crop guide
3. safe UI overlay
4. PC横長shell案

まだ実装しない。

## Phase B: 戦闘合成

作るもの:

- 通常時
- 敵密集時
- 必殺技時
- 暴走モード時
- レベルアップ直前のドロップ密集時

背景は平常時だけ良く見えても不合格。

## Phase C: 素材分解

最小セット:

- base floor 1
- floor variant 3
- map-line decal 3
- ink decal 3
- paper grass 3
- pencil lamp 2
- paper house 2
- bench 1
- nameless post 1
- page edge 2
- shell left / right

## Phase D: preview実装

専用previewまたはquery parameterから確認できる形で入れる。

本編の現行背景はfallbackとして残す。

## Phase E: 昇格判断

3回以上の実プレイと複数viewport確認後にproduction候補とする。

---

# 11. 変更時の安全ルール

## 11.1 1コミット1目的

推奨分割:

```txt
docs
reference / concept
asset source
export
preview integration
production switch
```

画像追加、ローダー変更、ゲームバランス変更を同じコミットへ混ぜない。

## 11.2 ロールバック

production背景を変更する時も旧素材を即削除しない。

最低一期間:

- fallback pathを保持
- manifestで切替可能
- preview比較を保持

## 11.3 変更禁止領域

Stage背景制作中に同時変更しない。

- player hit radius
- enemy stats
- weapon stats
- pickup range
- wave timing
- 暴走モード数値

視認性改善とゲームバランス変更を混ぜると評価不能になる。

---

# 12. リリース前チェック

## 表示

- [ ] 390×844
- [ ] 小型スマホ
- [ ] 縦長スマホ
- [ ] iOS safe area
- [ ] Android safe area
- [ ] タブレット縦
- [ ] PC 16:9
- [ ] PC 21:9
- [ ] ブラウザ高さ600px前後

## 操作

- [ ] pointer cancelで入力解除
- [ ] バックグラウンド移行でポーズ
- [ ] 復帰直後に即被弾しない
- [ ] 画面回転で座標が壊れない
- [ ] タッチとキーボードでゲーム範囲が同じ

## 視認性

- [ ] ユイを一秒以内に発見
- [ ] 敵20体で判別可能
- [ ] 弾と地図線が競合しない
- [ ] 欠片と紙片が競合しない
- [ ] 操作UI背後が静か
- [ ] 暴走演出でも危険予告が消えない

## 性能

- [ ] 通常戦で安定
- [ ] 敵密集時で急落しない
- [ ] 必殺技でメモリ異常増加なし
- [ ] 背景ambientを切れる
- [ ] app復帰後に二重ループしない

## アセット

- [ ] sourceあり
- [ ] export手順あり
- [ ] referenceとproductionを分離
- [ ] 巨大一枚絵へ依存していない
- [ ] fallbackあり

---

# 13. 現時点の判断

Stage設計と制作開始条件は固まっている。

ただし、以下が完了するまでは新背景をproductionへ入れない。

```txt
Stage 1 environment concept
Stage 1 gameplay composite
複数viewport crop
素材分解
preview integration
実プレイ確認
```

次の作業は Stage 1 の構図マスター制作であり、5Stage同時量産や既存背景の直接置換ではない。
