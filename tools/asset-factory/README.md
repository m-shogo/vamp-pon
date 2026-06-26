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

### Prompt Packs (一括プロンプト)
- 7種類のプロンプトパック: Character / Enemy / Weapon / Item / Background / Cutin / All-in-One
- 3つのモード: 日本語 詳細 / English Detailed / コンパクト
- 各パックに含まれる内容:
  - Vamp Pon 世界観ルール
  - 共通スタイルルール
  - アセットタイプ別の仕様
  - ユイ固定ルール (Character / Cutin)
  - 180x180 セルルール (Character / Enemy)
  - プリセット一覧 (Enemy / Weapon / Item)
  - ネガティブプロンプト
  - 生成後チェックリスト (Asset Factory での確認手順)
- コピー / 全タイプコピー / ダウンロード / 全タイプDL
- 文字数カウント表示

#### プリセット別プロンプト展開 (v2)
- Enemy (7種): ombu-small / ombu-shoe-zigzag / ombu-umbrella-shield / ombu-key-dasher / ombu-letter-shooter / omburo-lamppost-aura / forgotten-umbrella-keeper
- Weapon (6種): north-star-lantern / night-pencil / paper-plane / black-ink-bottle / lamp-post-ring / ink-lamp-ring
- Item (7種): warm-shoes / bigger-lantern-core / paper-armor / quiet-clock / dawn-ticket / cracked-map / keeper-bell
- 展開モード: なし / 全プリセット / 個別プリセット選択
- 各プリセットにはシルエット・配色・デザイン固有の指示が含まれる
- 使い方: パックタイプ (Enemy/Weapon/Item) 選択 → プリセット展開セクションで対象を選択 → 生成

#### 再生成プロンプトビルダー (v2)
- 検査結果から修正指示を自動生成
- 検出する問題: 空セル / セル端接触 / 中心ガタつき / サイズ過小・過大 / シートサイズ不一致
- 出力: Detected Issues / Fix Instructions / Original Asset Intent / Negative Prompt / Asset Factory Recheck Steps
- 使い方: 画像読込 → 検査実行 → 検査結果タブの「再生成プロンプト作成」ボタン → テキストをコピーして画像AIに投入

### Review Status & Quality Score (v2)
- 採用ステータス: unchecked / candidate / needs-regeneration / approved / rejected
- 品質スコア: 1〜5 (ユーザー選択)
- 検査結果からの推奨スコア自動算出 (エラー数・警告数ベース)
- レビューメモ: 自由テキストで判断理由を記録
- ライブラリカードにステータスラベル・スコア表示
- 使い方: マニフェストタブ下部の「採用状態」セクションでステータス・スコア・メモを設定 → ライブラリに保存

### 制作フロー (推奨)

1. **プロンプト生成**: 一括プロンプトタブでタイプ・モード・プリセットを選んで生成
2. **画像生成**: 生成したプロンプトを画像AIに投入
3. **読込・検査**: 生成画像をAsset Factoryに読込 → 検査
4. **レビュー**: マニフェスト記入 → 採用ステータス・品質スコア設定 → ライブラリ保存
5. **問題がある場合**: 検査結果から再生成プロンプト作成 → 画像AIで修正生成 → 再検査
6. **承認**: approved に設定してスコア確定

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
