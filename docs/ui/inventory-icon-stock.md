# インベントリアイコン制作ストック

## 目的

下部HUDの武器・忘れ物・レアを固定スロットの画像アイコンとして表示する。
専用画像が未制作でもHUDを壊さず、画像追加後はコード変更なしで自動採用する。

## 正本

```txt
data/ui-assets/inventory-icon-requirements.json
```

現在の必要数:

- 武器: 15
- 忘れ物: 8
- レア: 4
- 合計: 27

検査:

```sh
pnpm inventory-icons:check
```

## 画像仕様

- 32×32px
- PNG RGBA
- 完全透過背景
- 実絵の安全領域は28×28px以内
- セル外へのはみ出し禁止
- 紙片・絵本風のドット絵
- 読める文字や細かすぎる装飾は禁止
- 16〜24px表示でもシルエットを判別できること
- 同カテゴリ内で光源・輪郭・彩度を揃えること

出力先:

```txt
public/assets/ui/inventory-icons/weapon/
public/assets/ui/inventory-icons/passive/
public/assets/ui/inventory-icons/rare/
```

## ステータス

- `planned`: 未制作。既存ゲーム素材または仮記号を表示する
- `draft`: 画像はあるが未採用・要レビュー
- `ready`: HUDで正式採用。ファイル実在が検査対象になる

画像を追加したら、対応する台帳行の `status` を `ready` に変更する。

## HUD動作

表示優先順位:

1. 専用の32pxインベントリアイコン
2. 既存の武器弾・レアアイテム画像を暫定利用
3. 台帳の `fallbackGlyph`

武器と忘れ物は右下にレベルバッジを表示する。レアにはレベルバッジを表示しない。
空き枠は暗い固定スロットとして残すため、所持上限と空き数を画面だけで確認できる。

## 追加ルール

新しい武器・忘れ物・レアをデータへ追加する時は、同じコミットで台帳にも1件追加する。
台帳追加がない場合、unit testと `pnpm inventory-icons:check` が失敗する。
