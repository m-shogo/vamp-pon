# スプライトシート検査・プレビュー基盤

## 概要

スプライトシートをゲーム実装に組み込む前に、構造・品質・アニメーションを確認するための開発補助ツール。

## 構成

| ファイル | 役割 |
|---|---|
| `tools/spritesheet-inspector/inspect.ts` | CLI検査スクリプト |
| `src/game/scenes/SpriteInspectorScene.ts` | ブラウザプレビューScene |
| `data/spritesheet-metadata/spritesheet-metadata.schema.ts` | メタデータ型定義 |
| `data/spritesheet-metadata/*.json` | キャラクター別メタデータ |

## CLI検査

```bash
# core5-original の全PNGを検査（引数なし）
pnpm spritesheet:inspect

# 敵シートを検査
pnpm spritesheet:inspect:enemy

# 特定ファイルを検査
pnpm spritesheet:inspect public/assets/prototypes/sprite-sheets/core5-original/yui-sprite-sheet-v1.png

# JSON出力（CI向け）
pnpm spritesheet:inspect:json

# フォーマット指定（8x6/180以外のシート）
pnpm spritesheet:inspect --format=4x4/96 path/to/sheet.png
```

### 検査項目

| 検査 | 内容 |
|---|---|
| PNGサイズ | 1440x1080 (8列×180px, 6行×180px) |
| 透過PNG | colorType=6 (RGBA) であること |
| セルサイズ | 180x180px |
| 空セル | 不透明ピクセルが0のセルを警告 |
| 極端に小さいセル | 全体面積の2%未満のセルを警告 |
| 極端に大きいセル | 全体面積の85%超のセルを警告 |
| セル端接触 | bboxがセル端に接触している場合に警告（切れ・はみ出し） |
| ガタつき候補 | bbox中心が全セル平均から12px以上ずれているセルを警告 |
| 左右flip対称性 | idle_right/walk_rightフレームの左右ピクセル分布を分析し、flip時に持ち手が反転する可能性を警告 |
| フォーマット自動検出 | 1440x1080以外のシートもセルサイズ候補（180/128/96/64/48/32px）から自動判定 |

### 出力例

```
🔍 Vamp Pon スプライトシート検査
   対象: 5 ファイル

=== yui-sprite-sheet-v1.png ===
  セル数: 48 (描画あり 40 / 空 8)
  ⚠️  警告 (10):
    - セル[5,0] 空（不透明ピクセルなし）
    ...
```

## ブラウザプレビュー

開発サーバー起動後、URLパラメータでアクセス:

```
# ユイのシートをプレビュー
http://localhost:5173/?scene=spriteinspector&character=yui

# 任意のファイルを指定
http://localhost:5173/?scene=spriteinspector&sheet=assets/prototypes/sprite-sheets/core5-original/asa-sprite-sheet-v1.png
```

### 機能

- **48セル グリッド表示**: フレーム番号付きで全セルを一覧
- **アニメーション再生**: clip単位でアニメーション確認
- **FPS切り替え**: 上下キーまたはボタンで1〜30fps
- **背景切り替え**: Dark / チェッカーパターン（Dキー）
- **bbox表示**: 各セルの非透明ピクセル範囲を緑枠で表示（Bキー）
- **anchor表示**: bottom-center基準のアンカー点を赤丸で表示（Aキー）
- **clip切り替え**: 左右キーまたはボタンでclip選択

### キーボードショートカット

| キー | 機能 |
|---|---|
| B | bbox表示ON/OFF |
| A | anchor表示ON/OFF |
| D | 背景切り替え（dark/checker） |
| ← → | clip切り替え |
| ↑ ↓ | fps増減 |

## メタデータJSON

`data/spritesheet-metadata/` にキャラクター別のJSONを配置。
プレビューSceneが自動的に読み込んでclip定義に反映する。

### 必須フィールド

```json
{
  "assetId": "yui-sprite-sheet-v1",
  "file": "public/assets/prototypes/sprite-sheets/core5-original/yui-sprite-sheet-v1.png",
  "frameWidth": 180,
  "frameHeight": 180,
  "columns": 8,
  "rows": 6,
  "totalFrames": 48,
  "clips": [
    { "name": "idle_down", "frames": [0, 1, 2, 3], "fps": 6, "loop": true }
  ],
  "anchorPolicy": "bottom-center",
  "notes": "",
  "qualityWarnings": []
}
```

## 運用ルール

### 画像生成後の必須フロー

1. 画像を `public/assets/prototypes/sprite-sheets/` に配置
2. `pnpm spritesheet:inspect <ファイル>` を実行
3. エラーがあるシートは本実装に入れない
4. 警告内容を確認し、必要に応じて修正
5. ブラウザプレビューでアニメーション再生を目視確認
6. メタデータJSONを更新

### キャラクター別チェック観点

#### ユイ

- ランタンが右手にあること（全方向）
- バッグ紐が右肩から左腰に掛かっていること
- walk_left / walk_right でランタン・バッグが消えないこと
- walk_left がwalk_rightのflipの場合、ランタン位置反転を確認

#### 敵キャラクター

- 黒インクのシルエットが小さすぎないこと
- 白目の位置が方向で一貫していること
- エリート敵は通常敵より大きいこと

#### エフェクト

- 全フレームが180x180に収まること
- glow/光がセル端に接触しないこと
- アルファグラデーションが正しいこと

### 禁止事項

- 商用素材・外部デモ画像をテスト素材として使わない
- 検査をpassしていない素材をゲーム本実装に入れない
- 検査スクリプトでOKでも目視確認を省略しない
