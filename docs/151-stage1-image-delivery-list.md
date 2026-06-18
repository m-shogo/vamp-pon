# Stage1 画像制作・受け渡し一覧

## 目的

この文書を、Stage1 Vertical Slice に必要な画像の人間向け正本とする。

- すでにある素材を二重制作しない
- 新しく必要な画像だけを明確にする
- 置き場所・ファイル名・サイズを固定する
- エフェクトで作るものと画像で作るものを分離する

ゲームの論理解像度は `390 x 844`。
画像は文字なし・透過RGBAを基本とし、紙片・絵本風ドット、夜、記憶、黒インク、小さな光、朝の方向性を守る。

---

## 結論

Stage1完成のために、新規制作を最優先する画像は次の3点。

1. ユイ最終48セルスプライトシート
2. ユイ通常必殺カットイン
3. ユイ暴走カットイン

背景、敵、武器・忘れ物・レアのアイコンは、すでにprototype/runtime用の土台がある。
現段階では作り直しを必須にしない。

---

# A. 現在すでにあるもの

## A-1. 背景5種

配置済み:

```txt
public/assets/prototypes/backgrounds/stage-01/environment-master.png
public/assets/prototypes/backgrounds/stage-02/environment-master.png
public/assets/prototypes/backgrounds/stage-03/environment-master.png
public/assets/prototypes/backgrounds/stage-04/environment-master.png
public/assets/prototypes/backgrounds/stage-05/environment-master.png
```

状態:

- 5種ともmanifest登録済み
- runtime表示可能
- 現在はprototype扱い
- Stage1完成時に必要なのはStage1背景の可読性確認であり、再制作は必須ではない

今は新しい背景を追加しない。

## A-2. 敵48体の正面・左向きシート

配置済み:

```txt
public/assets/prototypes/sprite-sheets/enemies-original/enemy-48-right-1440x1080-rgba.png
public/assets/prototypes/sprite-sheets/enemies-original/enemy-48-left-1440x1080-rgba.png
```

仕様:

```txt
1440 x 1080px
8列 x 6行
1セル 180 x 180px
48セル
透過RGBA
セル端接触なし
罫線なし
文字なし
```

runtimeでは現在、この2枚を正面・横向きのprototype sourceとして使用している。
右移動時は左向き素材の反転を利用できる。

注意:

`enemy-48-right...` はコード上では正面用として参照されているため、最終差し替え前に画像内容と名前を目視確認する。

## A-3. Core5キャラクターprototype

原本置き場:

```txt
public/assets/prototypes/sprite-sheets/core5-original/
```

分割済みフレーム:

```txt
public/assets/prototypes/sprite-sheets/core5-original-frames/
```

Stage1 runtimeで主に使用しているユイのセル:

- 正面・左・右・背面 idle
- 4方向 walk A/B
- 4方向 hurt
- 通常必殺
- 通常portrait
- 暴走portrait
- 通常紋章
- 黒紋章

現在の画像はprototypeであり、構成確認には使えるが最終品質ではない。

## A-4. 武器・忘れ物・レアの原本アイコン

runtimeは以下の180px原本を読む構成になっている。

```txt
public/assets/prototypes/sprite-sheets/weapon/<itemId>.png
public/assets/prototypes/sprite-sheets/passive/<itemId>.png
public/assets/prototypes/sprite-sheets/rare/<itemId>.png
```

対象数:

- 武器・進化武器: 15種
- 忘れ物: 8種
- レア: 4種
- 合計: 27種

現在はこの原本をHUD・取得カードで縮小表示する。
新しい32px版を別制作する必要はない。

確認コマンド:

```sh
pnpm inventory-original-icons:check
```

## A-5. 小物・弾・拾得物

以下はassetManifestとGraphics fallbackがある。

- 記憶の欠片
- 回復紙
- 記憶カプセル
- 夜の鉛筆弾
- ビー玉
- 月のしおり
- 黒インク範囲
- 星くず弾
- 絵はがきカッター
- 紙ひこうき
- 街灯の輪
- 進化・合体・覚醒後の弾/範囲

最終画像へ差し替え可能だが、Stage1完成を止める必須素材ではない。

---

# B. 新規制作が必要な画像 P0

## B-1. ユイ最終48セルスプライトシート

保存先:

```txt
public/assets/prototypes/sprite-sheets/core5-original/yui-sprite-sheet-v1.png
```

固定仕様:

```txt
画像サイズ: 1440 x 1080px
グリッド: 8列 x 6行
1セル: 180 x 180px
セル数: 48
形式: PNG RGBA
背景: 完全透過
文字: なし
罫線: なし
セル端への接触: なし
```

重要ルール:

- 48セルで同一人物に見える
- 頭身・髪・服・ランタンの位置関係を統一
- idleとwalkで顔や衣装が別人にならない
- 左右移動の向きを正しくする
- 実ゲームでは74px前後で表示しても読める輪郭にする
- 細線を増やしすぎず、目・髪・ランタン・足の位置を優先する
- ランタンはユイの識別点として必ず残す
- 背景透過の縁に白フリンジを残さない

セル配置の正本:

```txt
data/character-assets/core5-52px-sprite-sheet-cells.json
```

主要行:

1. idle / 向き / ready
2. walk A/B
3. cast / attack
4. hurt / recoil
5. 必殺 / 暴走 / interact / downed / emote
6. portrait / ランタン / アイテム / 紋章 / effect icon

投入後:

```sh
pnpm core5:sprites:slice-original
pnpm character-assets:verify
pnpm stage1:fun-pass:verify
```

## B-2. ユイ通常必殺カットイン

保存先:

```txt
public/assets/prototypes/cutins/yui-ultimate-780x360-rgba.png
```

仕様:

```txt
780 x 360px
PNG RGBA
背景透過
文字なし
人物と光は中央720 x 320px以内
画面端で切れて困る重要パーツを置かない
```

内容:

- ユイ本人
- ランタンまたは小さな光
- 暖かい朝色
- 紙片・記憶の線
- 怖さより、夜の中で道を作る印象
- 黒インクは補助に留める

禁止:

- 技名テキスト
- ネオン
- 巨大な光線
- 白飛び
- 背景込みの横長一枚絵

## B-3. ユイ暴走カットイン

保存先:

```txt
public/assets/prototypes/cutins/yui-berserk-780x360-rgba.png
```

仕様:

```txt
780 x 360px
PNG RGBA
背景透過
文字なし
人物と黒炎は中央720 x 320px以内
```

内容:

- ユイと分かる輪郭は維持
- 黒炎・邪念・影の揺れ
- ランタンの光が黒に飲まれかけている
- 理性が薄れた危険さ
- 可愛い暴走ではなく、力が制御できていない印象

禁止:

- 可愛い赤目
- 笑顔
- 悪役化した別人デザイン
- 血やグロ表現
- 技名テキスト

---

# C. 後回しでよい画像 P1

Stage1の8分体験が完成してから判断する。

## C-1. 敵シートのhand-final差し替え

現在の2枚をそのまま使えるため必須ではない。
品質を上げる場合も、同じサイズ・同じ48セル構成で置き換える。

## C-2. 武器弾・範囲の最終PNG

対象例:

- 夜の鉛筆弾
- 紙ひこうき
- ビー玉
- 絵はがきカッター
- 進化後弾
- インク範囲
- 街灯範囲

基本エフェクトはコードで作るため、弾本体のシルエットだけでよい。
発光、残像、波紋、インク飛沫まで画像へ描き込まない。

## C-3. タイトルロゴ

現状は文字UIで成立する。
公開ページの品質を上げる段階で制作する。

## C-4. Stage1クリア一枚絵

現状はゲーム画面＋朝色演出＋リザルトで成立可能。
ストア用・PV用の一枚絵はPWA公開後に分離して作る。

## C-5. 他4人のhand-finalシート

アサ、ナギ、ミチル、トモリはStage1完成後。
先にユイ1人の制作ルールとruntime表示を完成させる。

---

# D. 画像ではなくコードで作るもの

以下は新しいPNGを要求しない。

- ヒット時のインク飛沫
- 敵消滅の縮小フェード
- 記憶の欠片の光
- カプセル取得リング
- charger予兆線
- 暴走中の黒炎
- 暴走終了後の疲労色
- 進化の紙片
- 合体の黒インク＋灯り
- 覚醒の記憶札
- 画面フラッシュ
- vignette
- 色調変化
- カメラ揺れ
- 残像
- ラスト10秒演出
- 朝への画面遷移

これらはPhaser/WebGL側で実装し、素材制作の負担を増やさない。

---

# E. 受け渡し順

## 第1便

```txt
yui-sprite-sheet-v1.png
yui-ultimate-780x360-rgba.png
yui-berserk-780x360-rgba.png
```

## 第2便

実機プレイ後、必要と判断したものだけ:

```txt
敵hand-finalシート
武器弾本体PNG
タイトルロゴ
Stage1クリア一枚絵
```

---

# F. 画像投入時にやらないこと

- 既存ファイルを確認せず同名上書きしない
- 透過PNGをJPEG化しない
- 画像生成時の白背景を残さない
- 文字入り画像を作らない
- エフェクトを弾画像へ焼き込みすぎない
- Stage2以降の素材をStage1より先に作らない
- Core5全員をユイより先に最終化しない
