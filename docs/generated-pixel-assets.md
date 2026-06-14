# Generated Pixel Assets

Vamp Pon の本命ドット素材は、まずコード生成で再現可能にする。
Aseprite などの手作業ツールを使う場合も、この生成物を起点に差し替える。

## 生成コマンド

```bash
pnpm generate:pixel-assets
pnpm assets:verify
```

`scripts/generate-pixel-assets.ts` は Node 標準の PNG エンコーダで `public/assets/sprites` に書き出す。
追加ライブラリには依存しない。

## 生成元

- `src/game/assets/vampPixelKit.ts`
- `generatedPixelAssets`
- `assetManifest.ts`

生成スクリプトは `assetManifest` の `id` / `path` / `width` / `height` と一致しない素材をエラーにする。

## 品質区分

- `generated-final`: 小物、弾、拾得物、紙片、インク、基本敵。現在の本編素材として使う。
- `generated-draft`: キャラ、背景、UI、大型素材。画面に載せるが、手直し前提。
- `hand-final`: 将来、手描きで確定した素材に使う。

## 現在の生成対象

`generated-final`

- `pickup_memory_fragment`
- `pickup_heal_paper`
- `pickup_capsule`
- `rare_name_tag`
- `rare_cracked_lens`
- `rare_sealed_letter`
- `rare_wind_mark`
- `weapon_night_pencil`
- `weapon_paper_airplane`
- `enemy_ink_blob`
- `enemy_paper_scrap`

`generated-draft`

- `yui_idle`
- `enemy_elite_label`
- `bg_stage1_paper_night`
- `ui_card_paper_normal`

## 方向性

参考画像 `assets/concept-design` から、藍紫の夜、紙片、黒インク影、小さな暖色灯りを採用する。
AI画像の縮小ではなく、1px単位の図形、ノイズ、輪郭処理で生成する。
