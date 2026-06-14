# Visual Asset Manifest

必要なランタイム画像アセットの一覧（人間向け）。
**正本はコード** `src/game/assets/assetManifest.ts`（id/path/サイズ/用途/fallback）。
このドキュメントは読みやすい索引。差分が出たらコードを正とする。

- 配置: `public/assets/sprites/...`（Phaser からは `assets/sprites/...`）
- 読み込み: `BootScene` → `loadAssets.ts` が全 id を preload
- 切替: `factory.ts` の各 `createXView` が `spriteOrNull()` で画像 or Graphics fallback
- 状況確認: VisualGallery `?scene=asset-status`
- 生成: `pnpm generate:pixel-assets`（詳細は [generated-pixel-assets.md](generated-pixel-assets.md)）

---

## 一覧（kind 別）

### tile（背景）
| id | path | size |
|---|---|---|
| bg_stage1_paper_night | tiles/bg_stage1_paper_night_tile.png | 128x128 |

### player
| id | size | 用途 |
|---|---|---|
| yui_idle | 32x32 | ユイ 立ち（必須） |
| yui_move | 32x32 | ユイ 移動（任意・アニメ） |

### enemy（visualKind 対応）
| id | size | 敵 |
|---|---|---|
| enemy_ink_blob | 24x24 | インクの影 |
| enemy_paper_scrap | 24x24 | 紙くずの影 |
| enemy_signpost | 24x24 | 迷子の方角 |
| enemy_capsule | 24x24 | 黒いカプセル |
| enemy_haze | 24x24 | 夜のもや |
| enemy_elite_label | 32x32 | 黒ラベルの影（エリート） |

### pickup / rare
| id | size | 用途 |
|---|---|---|
| pickup_memory_fragment | 12x12 | 記憶の欠片 |
| pickup_heal_paper | 14x14 | 回復（包帯紙） |
| pickup_capsule | 16x16 | 記憶カプセル |
| rare_name_tag | 16x16 | 誰かの名前札 |
| rare_cracked_lens | 16x16 | ひび割れたレンズ |
| rare_sealed_letter | 16x16 | 封のされた手紙 |
| rare_wind_mark | 16x16 | 風のしるし |

### weapon（通常武器の弾/範囲）
| id | size | 武器 |
|---|---|---|
| weapon_night_pencil | 16x8 | 夜の鉛筆 |
| weapon_marble | 12x12 | ビー玉 |
| weapon_bookmark_orbit | 12x16 | 月のしおり |
| weapon_ink_area | 64x64 | 黒インクの小瓶（範囲） |
| weapon_stardust | 12x12 | 星くず弾 |
| weapon_postcard_blade | 16x10 | 絵はがきカッター |
| weapon_paper_airplane | 16x12 | 紙ひこうき |
| weapon_streetlamp_area | 128x128 | 街灯の輪（範囲） |

### evolved（強化進化 / 合体 / 覚醒）
| id | size | 武器 / 種別 |
|---|---|---|
| evolved_unfinished_line | 24x10 | 未完成の一行 / 強化進化 |
| evolved_north_star_lantern | 16x16 | 北極星のランタン / 強化進化 |
| evolved_dawn_ink_lamp | 128x128 | 夜明けのインク灯 / 合体 |
| awakened_unforgotten_name | 24x12 | 消えない名前 / 覚醒 |
| awakened_memory_marble | 16x16 | 追憶のビー玉 / 覚醒 |
| awakened_addressless_blade | 18x12 | 宛先のない刃 / 覚醒 |
| awakened_tailwind_plane | 20x16 | 追い風の紙ひこうき / 覚醒 |

### ui
| id | size | 用途 |
|---|---|---|
| ui_card_paper_normal | 320x144 | カード（ふつう） |
| ui_card_paper_good | 320x144 | カード（良い） |
| ui_card_paper_rare | 320x144 | カード（大当たり） |

---

## 現在の状況

```txt
生成素材: 34 個（generated-final 23 / generated-draft 11）
表示    : assetManifest 全エントリが生成PNG image
```

`?scene=asset-status` で最新の 実素材/仮/欠品 を確認できる。
`pnpm generate:pixel-assets` を実行すると、生成対象PNGが `public/assets/sprites/...` に書き出され、その要素だけ自動で画像表示に切替わる。

整合性は `src/game/assets/__tests__/assetManifest.test.ts` と `src/game/assets/__tests__/vampPixelKit.test.ts` が検査（id一意・対応漏れ・生成path/size）。
