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

#### Library フィルタ & ソート (v2)
- タイプ / ステータス / 最低スコア / テキスト検索で絞り込み
- ソート: 更新日↓↑ / 作成日↓↑ / スコア↓↑ / タイプ / 名前
- クイックフィルタボタン: 採用済み / 再生成待ち / 候補 / Score 4+ / クリア
- フィルタ結果カウント表示 (「表示中: X / 全Y件」)
- ライブラリカードにタイプ・ステータス・スコア・エラー/警告バッジ表示

#### Approved Export (v2)
4種類のエクスポート:
- **Approved Library JSON**: 採用済みエントリの完全データ
- **Approved Manifests JSON**: 採用済みマニフェストのみ抽出
- **Unity Handoff JSON**: Unity 移行用構造化データ (exportedAt, tool, purpose, counts, assets)
- **Regeneration Queue JSON**: 再生成待ちエントリ (warnings, prompt 含む)

使い方: Libraryタブ → フィルタバー下部のExportボタンから出力

#### Approved Export 注意事項
- approved にする前に必ず実画像を目視確認すること (自動検査だけでは不十分)
- fixture PNG は構造確認用であり、商用品質判定用ではない
- Unity Handoff JSON は画像そのものを含まない — sourceFileName と manifest を元に実ファイルを別途管理する必要がある
- 手動チェック問題 (Manual Issues) を確認してから approved に設定する

### Manual Issues (手動チェック問題)
- マニフェストタブで手動発見した問題をチェックボックスで記録
- 自動検出できない問題: 白背景 / チェッカーボード背景 / 白フリンジ / アイデンティティずれ / テキスト焼込み / レアリティ枠焼込み / ポスター構図 / UI焼込み 等
- ライブラリカードに `Manual: N` バッジとして表示
- Manual Issues は再生成プロンプトに自動反映される (issue別の修正指示付き)
- Manual Issues は Regeneration Queue JSON / Unity Handoff JSON に含まれる
- Manual Issues が残ったまま approved にすると警告 toast が表示される
- approved は「問題なし」ではなく「採用判断済み」を意味する — Manual Issues が残っていても approved にできるが、Unity 側での確認が必要
- 詳細: [REAL_ASSET_QA.md](./REAL_ASSET_QA.md)

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
  - 生成後チェックリスト (アセットタイプ別: spritesheet / icon / cutin / background)
- コピー / 全タイプコピー / ダウンロード / 全タイプDL
- 文字数カウント表示

#### アセットタイプ別仕様
- **Character / Enemy**: 8x6 / 180px スプライトシート
- **Weapon / Item**: 1024x1024 アイコン (64px/32px可読)
- **Cutin**: 1440x360 横長ワイドカットイン (transparent PNG)
- **Background**: 390x844 縦型モバイル戦闘背景 (endless runnerではない)

#### 敵名表記
- 小型敵: オンブ (Ombu) — 「オンブー」は誤表記
- 大型敵/ボス: オンブロ (Omburo) — 「オンブロー」は誤表記

#### プリセット別プロンプト展開 (v2)
- Enemy (7種): ombu-small / ombu-shoe-zigzag / ombu-umbrella-shield / ombu-key-dasher / ombu-letter-shooter / omburo-lamppost-aura / forgotten-umbrella-keeper
- Weapon (6種): north-star-lantern / night-pencil / paper-plane / black-ink-bottle / lamp-post-ring / ink-lamp-ring
- Item (7種): warm-shoes / bigger-lantern-core / paper-armor / quiet-clock / dawn-ticket / cracked-map / keeper-bell
- 展開モード: なし / 全プリセット / 個別プリセット選択
- 各プリセットにはシルエット・配色・デザイン固有の指示が含まれる
- 使い方: パックタイプ (Enemy/Weapon/Item) 選択 → プリセット展開セクションで対象を選択 → 生成

#### Character Prompts (Character Database)
- 一括プロンプトタブ内の Character Prompts セクションから、`src/game/data/assetFactoryCharacterPrompts.ts` の 20キャラ x 9種類の素材プロンプトを選択できる
- Character選択: 初期表示は Core5 only。All 20 characters に切り替えると seed / shadow data も制作プロンプトとして表示する
- Prompt kind: sprite sheet / reference / normal cutin / dawn cutin / kokuyou cutin / emblem 4相を選べる
- 表示内容: prompt / negativePrompt / reviewChecklist / outputPathHint / sizeSpec
- 操作: Copy prompt / Copy negative / Copy all / Download markdown / Core5一括markdown / All20一括markdown
- Character Database は制作正本であり、runtime playable list ではない。All20を表示してもゲーム本体で20キャラがplayableになるわけではない
- 生成画像は Asset Factory QA を通して candidate / approved を判断する。approved前に `public/assets/prototypes` からruntime assetへ移動しない
- `emblem_*` は `#00FF00` source-only。最終素材ではなく、クロマキー除去後のRGBA、64px/32px可読性、緑フリンジを確認してからcandidate/approvedに進める

#### black_ink_bottle candidate運用
- `black_ink_bottle` はトモリ初期武器で、`streetlamp_ring` との `dawn_ink_lamp_fusion` 素材
- test-pack masterは `public/assets/prototypes/sprite-sheets/weapon/asset-factory-test-pack/weapon-black-ink-bottle-icon-v1-clean-1024-rgba.png`
- runtime参照中prototypeは `public/assets/prototypes/sprite-sheets/weapon/black_ink_bottle.png`
- 390x844最終確認後、`black_ink_bottle.png` は `v1-clean-180` と同一の180px軽量版として昇格済み
- Asset Factoryでは `weapon` / `black-ink-bottle` / `approved` / score 4 / Manual Issuesなしとして扱う

#### streetlamp_ring candidate運用
- `streetlamp_ring` はミチル初期武器で、`black_ink_bottle` との `dawn_ink_lamp_fusion` 素材
- runtime参照中prototypeは `public/assets/prototypes/sprite-sheets/weapon/streetlamp_ring.png`
- 現prototypeは180x180 RGBAで、灯部・ポール・足元リングが読める
- ただし test-pack master / 64px / 32px / display-review は未整備
- Asset Factoryでは現時点で `weapon` / `lamp-post-ring` / `candidate` / score 3 / Manual Issuesなしとして扱い、approvedやruntime昇格は別タスクで判断する

#### 再生成プロンプトビルダー (v2)
- 検査結果から修正指示を自動生成
- アセットタイプ別に指示を分岐:
  - character/enemy: 8x6 / 180px / cell edge / empty cell / jitter を重視
  - weapon/item: 1024x1024 icon / centered / readable at 64px/32px
  - background: 390x844 crop/readability / no UI baked in
  - cutin: 1440x360 / transparent / horizontal cutin / character identity
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
7. **エクスポート**: Libraryタブで採用済みフィルタ → Approved Export / Unity Handoff JSON 出力
8. **再生成管理**: 再生成待ちフィルタ → Regeneration Queue JSON で修正対象を一覧化

### Export
- Manifest JSON ダウンロード
- Inspection Report JSON ダウンロード
- Prompt Text ダウンロード

## Fixture QA

`tools/asset-factory/fixtures/` に QA 検証用の軽量 PNG を同梱。AI 生成素材ではなく、inspector / filter / export が壊れないことを確認するためのテストデータ。

### Fixture 一覧

| ファイル | サイズ | 検証内容 |
|---------|--------|---------|
| `valid-enemy-sheet-1440x1080.png` | 1440x1080 | 8x6 / 180px 正常シート。全48セルに図形、端接触なし |
| `edge-touch-enemy-sheet-1440x1080.png` | 1440x1080 | 一部セルで端接触あり。再生成プロンプト検証用 |
| `empty-cells-enemy-sheet-1440x1080.png` | 1440x1080 | 4セル空。空セル警告検証用 |
| `weapon-icon-1024x1024.png` | 1024x1024 | 武器アイコン。中央にダイヤ図形 |
| `cutin-1440x360.png` | 1440x360 | 横長カットイン。透明背景 |
| `background-390x844.png` | 390x844 | 縦型戦闘背景。不透明 |

### Fixture 再生成

```bash
node --experimental-strip-types tools/asset-factory/scripts/create-fixtures.ts
```

### QA 手順

1. `pnpm asset-factory:dev` で起動
2. 各 fixture を読込タブにドロップ
3. 検査タブで警告・エラーを確認
4. マニフェストタブでプリセット適用 → ライブラリ保存
5. ライブラリタブでフィルタ・ソート・クイックフィルタ動作確認
6. エクスポートボタンで JSON ダウンロード確認
7. edge-touch シートで再生成プロンプト作成を確認

詳細チェックリスト: [QA_CHECKLIST.md](./QA_CHECKLIST.md)

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
