# Asset Factory v0

Vamp Pon 専用のアセット制作支援ツール。
画像生成AIで作った PNG / スプライトシートを取り込み、Vamp Pon ルールで検査・整理・metadata化・プロンプト生成を行う。

## 起動方法

```bash
pnpm asset-factory:dev
```

ブラウザで http://localhost:5174 を開く。

## ビルド

```bash
pnpm asset-factory:build
```

## 機能 (v0)

### Import
- PNG ドラッグ&ドロップまたはファイル選択
- Canvas 上に画像プレビュー表示
- Asset Type 選択 (character / enemy / weapon / item / background / cutin)
- Grid overlay / Alpha bbox / Checkerboard / Dark bg トグル
- 8x6 / 180px プリセットまたはカスタムグリッド設定

### Inspect
- セルごとの alpha bounding box 検出
- 空セル検出
- セル端接触（edge touch）検出
- bbox 中心ガタつき（jitter）検出
- エラー / 警告の一覧表示
- セルカード一覧

### Anchors
- キャラクター向けアンカーポイント設定 (head, eyes, hands, waist, feet, shadow)
- ユイ固定ルール注意表示
- anchor JSON コピー

### Manifest
- Asset Type に応じたメタデータ編集
- Enemy / Weapon / Item プリセット選択
- JSON コピー / ライブラリ保存

### Prompts
- 現在の Manifest からVamp Ponルール付き画像生成プロンプト生成
- enemy spritesheet / weapon icon / item icon / character sheet / cutin / background
- テキストエリアでコピー可能

### Library
- localStorage ベースのアセット保存
- 読込 / 複製 / 削除
- ライブラリ JSON export / import

### Export
- Manifest JSON ダウンロード
- Inspection Report JSON ダウンロード
- Prompt Text ダウンロード

## v0 でできないこと

- 画像生成 API 接続
- ピクセルエディタ
- スプライト再生プレビュー
- シーンコンポーザー
- Unity 実装出力
- 画像加工・リサイズ

## 参考にした思想

| ツール | 取り入れた考え方 |
|--------|-----------------|
| Gorest 2D Animation Spritesheet Generator | asset library JSON、spritesheet preview、metadata editing、anchor/scale normalization |
| Piskel | ブラウザベーススプライトプレビュー |
| Pixelorama | animation timeline / frame tags / export 思想 |
| Universal LPC Spritesheet Generator | common body + parts + sheet definitions + palette + credits |

**注意**: 上記ツールのコード・素材は一切コピーしていない。思想のみを参考にVamp Pon用に独自実装。

## ライセンス注意

- 外部リポジトリの画像/メディア素材は含まない
- GPL 系コードや素材は混ぜない
- Aseprite / Pixelorama 本体は組み込まない

## Unity 移行で使う Manifest 方針

Asset Factory で出力する manifest JSON は Unity 側でそのまま ScriptableObject に変換可能な構造。
`unityPrefabHint` フィールドで Unity prefab 名を指定し、インポートパイプラインで自動マッピングする想定。
