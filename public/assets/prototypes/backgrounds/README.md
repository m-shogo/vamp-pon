# Stage背景アセット運用ガイド

## フォルダ構成

```
public/assets/prototypes/backgrounds/
├── README.md          ← このファイル
├── manifest.json      ← 全Stageの登録情報
├── stage-01/
│   ├── environment-master.png
│   └── meta.json
├── stage-02/ ...
├── stage-03/ ...
├── stage-04/ ...
└── stage-05/ ...
```

## 新しい背景を追加する手順

### 1. 画像を配置

```
public/assets/prototypes/backgrounds/stage-NN/environment-master.png
```

- 縦長PNG（推奨: 941x1672以上）
- RGB、8-bit/color
- ファイル名は `environment-master.png` で統一

### 2. meta.json を作成

`stage-NN/meta.json` に以下を含める（既存Stageのmeta.jsonを参考）:

- id, number, name, slug
- originalFilename（元ファイル名を記録）
- image: "environment-master.png"
- status: "incoming" または "prototype"
- width, height: 実画像から取得（推測しない）
- character, symbol, primaryMisreading
- displayAdjustments: cropX, cropY, scale, opacity, brightness, saturation, overlayAlpha, vignetteAlpha

### 3. manifest.json に登録

`manifest.json` の `stages` 配列にエントリを追加:

```json
{
  "id": "stage-NN",
  "number": N,
  "name": "ステージ名",
  "slug": "stage-slug",
  "environment": "/assets/prototypes/backgrounds/stage-NN/environment-master.png",
  "meta": "/assets/prototypes/backgrounds/stage-NN/meta.json",
  "status": "prototype",
  "enabledForPreview": true,
  "enabledForRuntime": false
}
```

### 4. 検証

```bash
pnpm backgrounds:verify
```

94項目のチェックが全て通ること。

### 5. Preview確認

```bash
pnpm dev
```

ブラウザで `/?scene=background-preview` を開き、全Stageを確認。

### 6. ゲーム内Runtime Preview

```
/?stage=1  ← Stage 1の背景で本編を起動
/?stage=2  ← Stage 2
```

指定なし（`/`）は従来の既定背景。

### 7. Production昇格条件

以下を全て満たした場合のみ `status` を昇格する:

1. `prototype` → `reviewed-candidate`: pixel-art directorのレビュー通過
2. `reviewed-candidate` → `production-candidate`: 1x / 4x / dark background / combat mock確認
3. `production-candidate` → `production`: 実機プレイテストで視認性確認済み

`enabledForRuntime: true` は `production-candidate` 以降のみ設定する。

## Status一覧

| status | 意味 |
|--------|------|
| incoming | 未整理の入稿画像 |
| prototype | AI生成reference。整理済みだが未レビュー |
| reviewed-candidate | art directorレビュー通過 |
| production-candidate | 実機テスト待ち |
| production | 本番採用 |

## NG例

- 画像をフォルダに置いただけで `production` にする
- meta.jsonのwidth/heightを推測で書く
- manifest.jsonに存在しない画像pathを登録する
- 元PNGを再圧縮・リサイズ・色変更する
- `enabledForRuntime: true` をレビュー前に設定する

## Rollback

1. manifest.jsonの該当エントリで `enabledForRuntime: false` に戻す
2. `status` を `prototype` に戻す
3. 画像ファイル自体は削除しない（git履歴で管理）
4. `pnpm backgrounds:verify` で整合性を再確認
