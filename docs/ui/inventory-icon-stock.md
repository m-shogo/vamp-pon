# インベントリアイコン制作ストック

## 目的

下部HUDの武器・忘れ物・レアを固定スロットの画像アイコンとして表示する。
専用画像が未制作でもHUDを壊さず、画像追加後はコード変更なしで自動採用する。

## 正本

用途ごとに正本を分ける。

```txt
必要数・ID・配置先:
  data/ui-assets/inventory-icon-requirements.json

描き方・禁止・手直し・個別差別化:
  docs/ui/inventory-icon-design-bible.md

制作担当へ渡す一括指示:
  docs/ui/inventory-icon-production-prompt.md
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
- 四辺2px以上を完全透明にする
- セル外へのはみ出し禁止
- 紙片・絵本風のドット絵
- 読める文字や細かすぎる装飾は禁止
- 16〜24px表示でもシルエットを判別できること
- 同カテゴリ内で光源・輪郭・彩度を揃えること
- スロット枠とレベル数字は画像内へ描かない

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

画像を置いただけで `ready` にしない。
実ゲームの16px・24px・32px表示を確認し、`inventory-icon-design-bible.md` の採用判定を通した物だけ `ready` に変更する。

## HUD動作

表示優先順位:

1. 専用の32pxインベントリアイコン
2. 既存の武器弾・レアアイテム画像を暫定利用
3. 台帳の `fallbackGlyph`

武器と忘れ物は右下にレベルバッジを表示する。レアにはレベルバッジを表示しない。
空き枠は暗い固定スロットとして残すため、所持上限と空き数を画面だけで確認できる。

## 制作単位

27種を一括生成しない。

```txt
Batch A: 通常武器8
Batch B: 忘れ物8
Batch C: レア4
Batch D: 進化・合体・覚醒7
```

各Batchでシルエットを先に揃え、実ゲーム確認と1px手直しを終えてから次へ進む。

## 追加ルール

新しい武器・忘れ物・レアをデータへ追加する時は、同じコミットで台帳にも1件追加する。
台帳追加がない場合、unit testと `pnpm inventory-icons:check` が失敗する。

新しいアイコンを追加する時は、同じコミットで次も更新する。

- `visualBrief`
- デザインBible内の個別方針または既存familyとの関係
- `status`
- 実ゲーム確認結果
