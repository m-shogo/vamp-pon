# Aseprite workflow

Vamp Pon の production export は **Aseprite stable v1.3.17.x** を対象にする。
**v1.3.18-beta2 は本番exportに使わない**。betaで開いたsourceをproduction exportの前提にしない。

## Commands

```sh
pnpm aseprite:check
pnpm aseprite:export
pnpm aseprite:export:yui
pnpm assets:verify
pnpm test
pnpm build
```

- `aseprite:check`: stable v1.3.17.x のCLIを探し、version / resolved path / usable を表示する。
- `aseprite:export`: 現在はユイ4ポーズのexport入口。
- `aseprite:export:yui`: `aseprite:export` と同じ。ユイ作業者向けの明示名。

Aseprite CLI が無い場合、export は skip して exit 0 にする。
通常の generated asset / test / build は Aseprite に依存しない。

## Source Layout

```txt
assets/source/aseprite/
  player/
    yui_idle.aseprite
    yui_move.aseprite
    yui_hurt.aseprite
    yui_ultimate.aseprite
```

現状repoでは、1ファイル1ポーズ方式を採用する。
理由は、既存 `assetManifest` が `yui_idle` / `yui_move` / `yui_hurt` / `yui_ultimate` を個別PNGとして管理しており、source-missing / exported の状態をポーズ単位で見やすいため。
将来アニメーションフレームが増えたら `yui.aseprite + tags` 方式を再検討する。

## Export Targets

| source | export |
| --- | --- |
| `assets/source/aseprite/player/yui_idle.aseprite` | `public/assets/sprites/player/yui_idle_32.png` |
| `assets/source/aseprite/player/yui_move.aseprite` | `public/assets/sprites/player/yui_move_32.png` |
| `assets/source/aseprite/player/yui_hurt.aseprite` | `public/assets/sprites/player/yui_hurt_32.png` |
| `assets/source/aseprite/player/yui_ultimate.aseprite` | `public/assets/sprites/player/yui_ultimate_32.png` |

export先PNGは `assetManifest` のpathと一致させる。
texture id / assetManifest id は hand-final 化しても変えない。

## Status Labels

- `generated-draft`: `vampPixelKit` が生成した仮のキャラ/背景/大型素材。ユイは `yui_ultimate` がここ。
- `generated-final`: `vampPixelKit` だけでゲームに使える小物/敵/弾/拾得物。
- `source-missing`: hand-final 用 `.aseprite` がまだ無い。
- `exported`: `.aseprite` からPNGを書き出した状態。
- `hand-final`: Aseprite sourceを手修正し、export後にVisualGalleryとcombat-mockで確認した本命素材。
  - 現状ユイは `yui_idle` / `yui_move` / `yui_hurt`。VisualGallery / late combat mock では確認済みだが、**実機スマホは未確認**なので「hand-final candidate」として扱う。`yui_move`（移動差分）・`yui_hurt`（被弾差分）は freeze した `yui_idle` を基準にした同一人物・同一ライティング。
  - asset-status は `GF=generated-final` / `HF=hand-final` / `GD=generated-draft` で分離表示する。

public配下のPNGを直接手修正しない。
`hand-final` のPNGは `pnpm generate:pixel-assets` では上書きしない（Aseprite export専用）。
Aseprite sourceを編集したら必ず `pnpm aseprite:export:yui` と `pnpm assets:verify` を通す。

## Review URLs

- `/?scene=yui-gallery`: ユイ4ポーズ、1x/4x、hitCore/debugHitCircle相当、欠片比較。
- `/?scene=visual-gallery`: 既存ギャラリー全体。
- `/?scene=combat-mock&density=early`: 軽い密度。
- `/?scene=combat-mock&density=mid`: 標準密度。
- `/?scene=combat-mock&density=late`: 8分後半相当の視認性入口。
- `/?scene=asset-status`: image / generated-draft / fallback / missing。

## Collision Boundary

hand-final 作業では以下を触らない。

- `PLAYER_DEFAULTS.radius`
- `PLAYER_DEFAULTS.visualSize`
- hp / moveSpeed / invulnSec
- pickup collectRadius / magnetRange / magnetSpeed
- `hitCore` / `debugHitCircle`
