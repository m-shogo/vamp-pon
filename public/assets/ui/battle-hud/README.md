# Battle HUD UI Assets

このディレクトリはBattle HUD用UI素材の置き場です。
`processed/` は元画像を削除・リネームせず、実装候補として透過処理と実装用ファイル名へのコピー/出力を行ったものです。

現時点では `hud.ts` には未接続です。

## Processed Assets

| asset key | file name | use scene | purpose | size | has alpha | source note | status |
| -- | -- | -- | -- | --: | -- | -- | -- |
| `battle-hud-ultimate-seal-lantern-button` | `processed/battle-hud-ultimate-seal-lantern-button-v1.png` | Battle HUD | 右下必殺ボタン本体。封蝋＋ランタン。 | 1186×1150 | yes | `battle-hud/battle-hud-ultimate-seal-lantern-button.png` の透明RGBを掃除して出力。 | adopted |
| `battle-hud-kokuyou-bottle-frame` | `processed/battle-hud-kokuyou-bottle-frame-v1.png` | Battle HUD | 左下黒曜ゲージ瓶枠。 | 716×1418 | yes | `battle-hud/battle-hud-kokuyou-bottle-frame.png` の透明RGBを掃除して出力。 | adopted |
| `kokuyouBottleLabel` | `processed/battle-hud-kokuyou-bottle-label-v1.png` | Battle HUD | 黒曜瓶ゲージ下部の紙ラベル帯。Text領域を中央に確保する。 | 2508×627 | yes | `ChatGPT Image Jun 26, 2026, 03_28_38 PM.png` を緑背景透過。文字はPhaser Textで載せる。 | adopted |
| `kokuyouBottleLabelRuntime` | `processed/battle-hud-kokuyou-bottle-label-runtime.png` | Battle HUD | 黒曜瓶ゲージ下部の紙ラベル帯runtime版。実装で優先使用する。 | 216×54 | yes | `ChatGPT Image Jun 26, 2026, 03_28_38 PM.png` を緑背景透過後、216×54へ縮小。文字はPhaser Textで載せる。 | adopted |
| `battle-hud-inventory-paper-slot` | `processed/battle-hud-inventory-paper-slot-v1.png` | Battle HUD | 下部インベントリ通常スロット。 | 912×1229 | yes | `battle-hud/battle-hud-inventory-paper-slot.png` の透明RGBを掃除して出力。 | adopted |
| `battle-hud-dual-gauge-frame` | `processed/battle-hud-dual-gauge-frame-v1.png` | Battle HUD | HP/EXP 2段ゲージ外枠。 | 1788×714 | yes | `battle-hud/battle-hud-dual-gauge-frame.png` の透明RGBを掃除して出力。 | adopted |
| `battle-hud-memory-street-progress-frame` | `processed/battle-hud-memory-street-progress-paper-v1.png` | Battle HUD | Memory Street進行バー。左右札＋中央星ライン。 | 2172×724 | yes | `ChatGPT Image Jun 26, 2026, 02_16_44 PM (5).png` を緑背景透過。 | adopted |
| `battle-hud-ultimate-button-label` | `processed/battle-hud-ultimate-button-label-v1.png` | Battle HUD | 必殺ボタン下の紙ラベル帯。 | 2172×724 | yes | `ChatGPT Image Jun 26, 2026, 02_16_44 PM (6).png` を緑背景透過。 | adopted |
| `battle-hud-paper-tag-lv` | `processed/battle-hud-paper-tag-lv-v1.png` | Battle HUD | 左上LV吊り紙札。 | 1122×1402 | yes | `ChatGPT Image Jun 26, 2026, 02_22_23 PM (1).png` を緑背景透過。 | adopted |
| `battle-hud-paper-tag-dawn` | `processed/battle-hud-paper-tag-dawn-v1.png` | Battle HUD | Dawn inタイマー紙札。 | 1122×1402 | yes | `ChatGPT Image Jun 26, 2026, 02_22_23 PM (2).png` を緑背景透過。 | adopted |
| `battle-hud-paper-tag-currency` | `processed/battle-hud-paper-tag-currency-v1.png` | Battle HUD | ランタン数/Shard数の2段紙札。 | 1536×1024 | yes | `ChatGPT Image Jun 26, 2026, 02_22_24 PM (3).png` を緑背景透過。 | adopted |
| `battle-hud-paper-tag-menu` | `processed/battle-hud-paper-tag-menu-v1.png` | Battle HUD | 右上メニュー吊り紙札。 | 1122×1402 | yes | `ChatGPT Image Jun 26, 2026, 02_22_24 PM (4).png` を緑背景透過。 | adopted |
| `battle-hud-inventory-paper-slot` | `processed/battle-hud-inventory-paper-slot-hold-large-v1.png` | Battle HUD | 大型吊り紙slot backup。 | 1086×1448 | yes | `ChatGPT Image Jun 26, 2026, 02_16_43 PM (1).png` を緑背景透過。 | hold |
| `battle-hud-paper-tag-dawn` | `processed/battle-hud-paper-tag-dawn-hold-square-v1.png` | Battle HUD | 正方形寄りのDawn札backup。 | 1254×1254 | yes | `ChatGPT Image Jun 26, 2026, 02_16_43 PM (2).png` を緑背景透過。 | hold |
| `battle-hud-dual-gauge-frame` | `processed/battle-hud-dual-gauge-frame-hold-v1.png` | Battle HUD | 2段ゲージ枠backup。 | 1536×1024 | yes | `ChatGPT Image Jun 26, 2026, 02_16_43 PM (3).png` を緑背景透過。 | hold |
| `battle-hud-paper-tag-lv` | `processed/battle-hud-paper-tag-hold-dark-panel-v1.png` | Battle HUD | 黒内枠が強い吊り紙。 | 1024×1536 | yes | `ChatGPT Image Jun 26, 2026, 02_16_44 PM (4).png` を緑背景透過。 | hold |
| `battle-hud-memory-street-progress-frame` | `processed/battle-hud-memory-street-progress-hold-simple-v1.png` | Battle HUD | シンプルなMemory Street進行バーbackup。 | 2172×724 | yes | `ChatGPT Image Jun 26, 2026, 02_22_24 PM (5).png` を緑背景透過。 | hold |
| `battle-hud-ultimate-button-label` | `processed/battle-hud-paper-label-hold-simple-v1.png` | Battle HUD | 素朴な横長紙帯backup。 | 2172×724 | yes | `ChatGPT Image Jun 26, 2026, 02_22_24 PM (6).png` を緑背景透過。 | hold |

## Still Missing

- `battle-hud-kokuyou-bottle-fill-mask`

`battle-hud-kokuyou-bottle-fill-mask` は画像生成せず、瓶フレームの内側に合わせてPhaser Graphics/maskで作る方針を次フェーズで検討する。現時点では未実装。

## Display Guide

- 実装では `processed/battle-hud-kokuyou-bottle-label-runtime.png` を優先使用する。
- `processed/battle-hud-kokuyou-bottle-label-v1.png` は高解像度の採用元processedとして残す。
- 黒曜瓶フレームの下に配置し、実表示目安は幅92〜108px、高さ38〜54px。
- ラベル内の「黒曜」「BERSERK」などの可変/固定テキストは画像に焼き込まず、Phaser Textで中央に重ねる。

## Notes

- `processed/battle-hud-ui-assets-manifest.json` はBattle HUD素材候補だけの軽いmanifestです。
- Runtimeへの読み込み、`hud.ts` への差し込み、ゲーム内配置調整は次フェーズで行います。
