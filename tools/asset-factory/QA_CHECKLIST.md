# Asset Factory QA チェックリスト

手動 QA 用。各項目を fixture PNG で確認する。

## 前提

```bash
pnpm asset-factory:dev   # http://localhost:5174
```

fixture PNG は `tools/asset-factory/fixtures/` にある。
再生成: `node --experimental-strip-types tools/asset-factory/scripts/create-fixtures.ts`

## チェック項目

### 起動
- [ ] `pnpm asset-factory:dev` でエラーなく起動
- [ ] ブラウザでタブ切替が全て動作（読込 / 検査 / アンカー / マニフェスト / プロンプト / 一括プロンプト / ライブラリ）
- [ ] コンソールエラーなし

### PNG Import
- [ ] `valid-enemy-sheet-1440x1080.png` をドラッグ＆ドロップで読込
- [ ] Canvas にプレビュー表示
- [ ] ファイル情報（名前・サイズ・寸法）が正しい
- [ ] Asset Type を `enemy` に設定
- [ ] Grid overlay / Alpha bbox / Checkerboard / Dark bg トグルが動作

### Inspect（検査）
- [ ] `valid-enemy-sheet-1440x1080.png`: エラー 0、全48セル検出、端接触なし
- [ ] `edge-touch-enemy-sheet-1440x1080.png`: セル端接触警告が出る（セル[1,2] と [3,5]）
- [ ] `empty-cells-enemy-sheet-1440x1080.png`: 空セル警告が出る（4セル空）
- [ ] `weapon-icon-1024x1024.png`: 1024x1024 で読込可能
- [ ] `cutin-1440x360.png`: 1440x360 で読込可能
- [ ] `background-390x844.png`: 390x844 で読込可能

### Manifest プリセット
- [ ] enemy タイプで「オンブ（小型基本）」プリセット選択 → フィールドが埋まる
- [ ] weapon タイプで「北極星ランタン」プリセット選択
- [ ] item タイプで「あったか靴」プリセット選択
- [ ] プリセットの敵名が「オンブ」「オンブロ」（長音なし）

### Review Status / Quality Score
- [ ] ステータス選択が動作（unchecked / candidate / needs-regeneration / approved / rejected）
- [ ] 品質スコア 1〜5 選択が動作
- [ ] 検査後に推奨スコアが表示される
- [ ] レビューメモ入力が動作

### Library 保存
- [ ] 「ライブラリに保存」でエントリ追加
- [ ] ライブラリタブに表示される
- [ ] カードにタイプ・ステータス・スコアバッジ表示
- [ ] 読込ボタンでマニフェストタブに復元
- [ ] 複製ボタンで copy エントリ作成
- [ ] 削除ボタンで確認ダイアログ後に削除

### Filter（フィルタ）
- [ ] タイプフィルタ: enemy / weapon / item 等で絞り込み
- [ ] ステータスフィルタ: approved / needs-regeneration 等で絞り込み
- [ ] 最低スコアフィルタ: 4+ で高品質のみ
- [ ] テキスト検索: 名前・ID・タグで検索
- [ ] 表示カウント「表示中: X / 全Y件」が正しい

### Quick Filter（クイックフィルタ）
- [ ] 「採用のみ」→ approved だけ表示
- [ ] 「再生成待ち」→ needs-regeneration だけ表示
- [ ] 「候補」→ candidate だけ表示
- [ ] 「スコア4+」→ qualityScore >= 4 だけ表示
- [ ] 「フィルタークリア」→ 全件表示に戻る

### Sort（ソート）
- [ ] 更新日 新しい順 / 古い順
- [ ] 作成日 新しい順 / 古い順
- [ ] スコア 高い順 / 低い順
- [ ] タイプ / 名前

### Approved Export
- [ ] 「採用済みJSON」→ approved エントリの完全 JSON ダウンロード
- [ ] 「採用マニフェスト」→ manifest のみの JSON ダウンロード
- [ ] 「Unity Handoff」→ exportedAt / tool / purpose / counts / assets 構造
- [ ] 「再生成キュー」→ needs-regeneration エントリの JSON

### Regeneration Prompt（再生成プロンプト）
- [ ] `edge-touch-enemy-sheet-1440x1080.png` 検査後に「再生成プロンプト作成」
- [ ] 出力に Detected Issues / Fix Instructions が含まれる

### Prompt Packs（一括プロンプト）
- [ ] Enemy パック生成 → 「オンブ」表記（長音なし）
- [ ] Cutin パック → 1440x360 仕様
- [ ] Background パック → 390x844 仕様、endless runner ではない旨

### Cutin / Background 仕様
- [ ] cutin manifest デフォルト targetSize: `1440x360`
- [ ] background manifest デフォルト targetSize: `390x844`

### コンソール
- [ ] 全操作を通じてブラウザコンソールにエラーなし

## ビルド確認

```bash
pnpm asset-factory:build   # Asset Factory 単体ビルド
pnpm build                  # ゲーム本体ビルド（影響なし確認）
pnpm test                   # 全テスト通過
```
