# Aseprite workflow

Vamp Pon は、Aseprite が未導入でも `pnpm generate:pixel-assets` で generated PNG を作れる状態を維持する。
Aseprite は generated-draft を手仕上げして hand-final に近づけるための追加ツールとして扱う。

## Check

```sh
pnpm aseprite:check
```

確認する候補:

- `/Applications/Aseprite.app/Contents/MacOS/aseprite`
- `~/Library/Application Support/Steam/steamapps/common/Aseprite/Aseprite.app/Contents/MacOS/aseprite`
- `ASEPRITE_BIN` 環境変数

未検出でもビルドや generated asset 生成は止めない。

## Source And Export

手仕上げ用の `.aseprite` は `assets/source/aseprite/` に置く。
export 先は `assetManifest` の `path` と一致する `public/assets/sprites/...png` にする。

例:

```sh
ASEPRITE_BIN="/Applications/Aseprite.app/Contents/MacOS/aseprite"
"$ASEPRITE_BIN" -b assets/source/aseprite/yui_idle.aseprite \
  --script scripts/aseprite/export-vamp-assets.lua \
  --script-param out=public/assets/sprites/player/yui_idle_32.png
```

## Quality Labels

- `generated-draft`: コード生成の下書き。ゲーム内確認に使うが、手仕上げ余地がある。
- `generated-final`: コード生成だが、Stage 1 で採用水準まで調整した素材。
- `hand-final`: Aseprite などで手修正し、manifest path に沿って export した本命素材。

hand-final にした素材は、`assetManifest` の id/path/size を変えずに PNG だけ差し替える。
