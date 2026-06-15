# Aseprite workflow

Vamp Pon は、Aseprite が未導入でも `pnpm generate:pixel-assets` で generated PNG を作れる状態を維持する。
Aseprite は generated-draft を手仕上げして hand-final に近づけるための追加ツールとして扱う。
production export は stable v1.3.17.x のみを対象にする。v1.3.18-beta2 は本番exportに使わない。

## Check

```sh
pnpm aseprite:check
```

確認する候補:

- `/Applications/Aseprite.app/Contents/MacOS/aseprite`
- `~/Library/Application Support/Steam/steamapps/common/Aseprite/Aseprite.app/Contents/MacOS/aseprite`
- PATH 上の `aseprite`
- `ASEPRITE_BIN` 環境変数

未検出でもビルドや generated asset 生成は止めない。
Steam版を購入した場合は、Steamで一度Asepriteを起動し、上記Steamパスが存在するか確認する。
別の場所にある場合は以下のように指定する。

```sh
ASEPRITE_BIN="/path/to/aseprite" pnpm aseprite:check
```

## Source And Export

手仕上げ用の `.aseprite` は `assets/source/aseprite/` に置く。
player素材は `assets/source/aseprite/player/` を使う。
export 先は `assetManifest` の `path` と一致する `public/assets/sprites/player/...png` にする。

player素材の一括export:

```sh
pnpm aseprite:export
pnpm aseprite:export:yui
pnpm aseprite:export:player
```

このコマンドは以下の挙動にする。

- Aseprite CLI が無い場合は skip し、exit 0 にする。
- stable v1.3.17.x 以外、特に beta v1.3.18-beta2 は production export に使わない。
- source `.aseprite` が無い素材は skip する。
- export先は `public/assets/sprites/player/` 以外を拒否する。
- source がある素材だけ PNG を上書きする。
- generated-draft を hand-final 候補で差し替える時だけ実行する。

例:

```sh
ASEPRITE_BIN="/Applications/Aseprite.app/Contents/MacOS/aseprite"
"$ASEPRITE_BIN" -b assets/source/aseprite/player/yui_idle.aseprite \
  --script scripts/aseprite/export-vamp-assets.lua \
  --script-param out=public/assets/sprites/player/yui_idle_32.png
```

player source の対応:

| source | export |
| --- | --- |
| `assets/source/aseprite/player/yui_idle.aseprite` | `public/assets/sprites/player/yui_idle_32.png` |
| `assets/source/aseprite/player/yui_move.aseprite` | `public/assets/sprites/player/yui_move_32.png` |
| `assets/source/aseprite/player/yui_hurt.aseprite` | `public/assets/sprites/player/yui_hurt_32.png` |
| `assets/source/aseprite/player/yui_ultimate.aseprite` | `public/assets/sprites/player/yui_ultimate_32.png` |

## Quality Labels

- `generated-draft`: コード生成の下書き。ゲーム内確認に使うが、手仕上げ余地がある。
- `generated-final`: コード生成だが、Stage 1 で採用水準まで調整した素材。
- `source-missing`: hand-final 用 `.aseprite` source がまだ無い。
- `exported`: `.aseprite` source から PNG を書き出した状態。
- `hand-final`: Aseprite などで手修正し、manifest path に沿って export した本命素材。

hand-final にした素材は、`assetManifest` の id/path/size を変えずに PNG だけ差し替える。
hand-final 昇格時も `PLAYER_DEFAULTS.radius` や `visualSize` は変更しない。
キャラ素材更新と collision 変更は同じ作業に混ぜない。

## Review URLs

- `/?scene=visual-gallery`: ユイ4種、背景、敵との距離を見る。
- `/?scene=yui-gallery`: ユイ4種の1x/4x、hitCore/debugHitCircle相当、欠片比較を見る。
- `/?scene=combat-mock&density=early`: 軽い密度の戦闘モックを見る。
- `/?scene=combat-mock&density=mid`: 通常密度の戦闘モックを見る。
- `/?scene=combat-mock&density=late`: 8分後半相当の密度サンプルを見る。
- `/?scene=asset-status`: generated / fallback / missing の状態を見る。

詳細は [docs/aseprite-workflow.md](../../docs/aseprite-workflow.md) と [docs/yui-aseprite-hand-final-plan.md](../../docs/yui-aseprite-hand-final-plan.md) を参照。
