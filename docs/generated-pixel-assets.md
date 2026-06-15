# Generated Pixel Assets

Vamp Pon の本命ドット素材は、まずコード生成で再現可能にする。
Aseprite を買わなくても生成は進められる。
手仕上げする場合は、この生成物を下敷きに、輪郭整理・アニメ差分・表情差分・カード装飾の密度調整へ使う。

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
- `hand-final`: Aseprite source から `public/assets/sprites/...` へ export した本命素材。

ユイ系の `yui_idle` / `yui_move` / `yui_hurt` / `yui_ultimate` は `hand-final`（42pxネイティブ hand-final candidate）。`assets/source/aseprite/player/yui_*.aseprite` から `pnpm aseprite:export:yui` で `public/assets/sprites/player/yui_*_42.png` へ export 済み。
4ポーズは v4·42 prototype のかわいい方向（丸い青フード、金の月リム、茶赤前髪、大きめ顔、白ハイライト入りの目、頬、古紙色ワンピ、右手側cageランタン、selective 1px outline、控えめ足元影）を基準にしている。
現在の本番候補表示は `PLAYER_DEFAULTS.visualSize=42`。素材のhand-final昇格時も `PLAYER_DEFAULTS.radius`、hp / moveSpeed / invulnSec、pickup collectRadius / magnetRange / magnetSpeed は変更しない。

追加状態:

- `source-missing`: Aseprite source がまだ無い。
- `exported`: Aseprite source から PNG を書き出した。

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
- `weapon_marble`
- `weapon_stardust`
- `weapon_postcard_blade`
- `weapon_bookmark_orbit`
- `weapon_ink_area`
- `weapon_paper_airplane`
- `weapon_streetlamp_area`
- `enemy_ink_blob`
- `enemy_paper_scrap`
- `enemy_signpost`
- `enemy_capsule`
- `enemy_haze`
- `ui_card_paper_good`
- `ui_card_paper_rare`

`generated-draft`

- `enemy_elite_label`
- `bg_stage1_paper_night`
- `ui_card_paper_normal`
- `evolved_unfinished_line`
- `evolved_north_star_lantern`
- `evolved_dawn_ink_lamp`
- `awakened_unforgotten_name`
- `awakened_memory_marble`
- `awakened_addressless_blade`
- `awakened_tailwind_plane`

## まだfallback

```txt
なし
```

`assetManifest` の全36件が生成対象。
VisualGallery `?scene=asset-status` では image 36 / fallback 0 / missing 0 を基準にする。
ユイ4ポーズは HF、`generated-draft` ではない。

## 次に手仕上げすべき素材

1. `yui_idle` / `yui_move` / `yui_hurt` / `yui_ultimate`: 42pxネイティブ候補の実機スマホ視認性と late density での重なりを確認する。
2. `bg_stage1_paper_night`: 画面全体で繰り返した時の地図線・紙片密度。
3. `evolved_dawn_ink_lamp`: 合体素材として黒インク・街灯・朝色の重なり整理。
4. `ui_card_paper_normal/good/rare`: テキスト読みやすさと紙テクスチャのノイズ量。
5. `enemy_elite_label`: エリート感と通常敵との差分。

## 方向性

参考画像 `assets/concept-design` から、藍紫の夜、紙片、黒インク影、小さな暖色灯りを採用する。
AI画像の縮小ではなく、1px単位の図形、ノイズ、輪郭処理で生成する。
