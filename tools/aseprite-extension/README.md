# Vamp Pon Aseprite Extension（skeleton）

`vamp-pon-pixel-finisher` を将来 Aseprite のメニューから実行できるようにするための**雛形**。
今回はインストール自動化までは行わない。

## これは何か / 何でないか

- これは **script-assisted / procedural finish** 用のツール。
- **これは GUI hand-finish ではない。** メニューから実行しても sprite は `hand-final` にはならない。
  到達できるのは最大で `script-assisted-candidate`（[pipeline doc](../../docs/pixel-art/vamp-pon-pixel-art-pipeline-v1.md) §4）。
- **player は人間レビュー必須**。player / 主役級は、procedural で底上げしても、
  最終的に人間の GUI 手仕上げ + 人間レビューを通さない限り production に上げない。
- **production へ直接保存しない。** 出力は `assets/source/prototypes/` と `public/assets/prototypes/` のみ。

## 構成

```
tools/aseprite-extension/vamp-pon-pixel-finisher/
  package.json                       # extension manifest（menu/script contributes）
  scripts/vamp-pon-pixel-finisher.lua  # GUIエントリ skeleton（薄いシェル）
```

実体の仕上げロジックは repo の CLI script に置いている（単一の出所）:

- [`scripts/aseprite/vamp-pon-pixel-finisher.lua`](../../scripts/aseprite/vamp-pon-pixel-finisher.lua)

## どの menu 項目にしたいか

- 場所: **Edit メニュー**（`group: edit_menu`）。
- ラベル: `Vamp Pon: Procedural Finish (script-assisted)…`
- 将来は mode 選択ダイアログ（`yui52-v2a` / `generic-character-52` / `item-small` / `enemy-shadow`）を出し、
  recipe（`data/pixel-art/character-recipes/`）を読んで仕上げ、`script-assisted-candidate` としてタグ付けする。

## 将来の `.aseprite-extension` 化手順（予定）

1. `vamp-pon-pixel-finisher/` を zip 化し、拡張子を `.aseprite-extension` にする。
   ```sh
   cd tools/aseprite-extension/vamp-pon-pixel-finisher
   zip -r ../vamp-pon-pixel-finisher.aseprite-extension . -x '.*'
   ```
2. Aseprite の `Edit > Preferences > Extensions > Add Extension` から読み込む。
3. `Edit` メニューに項目が追加されることを確認する。
4. GUIエントリ skeleton を実装に差し替える（CLI と同じ passes / 同じ書き込みガード / 同じ status タグ）。

## 現状の使い方（推奨）

extension 実装が完了するまでは CLI を使う:

```sh
pnpm aseprite:pixel-finisher:yui52    # ユイV2aに procedural finish を適用
pnpm aseprite:pixel-finisher:verify   # 出力(_pf)が存在するか確認
```
