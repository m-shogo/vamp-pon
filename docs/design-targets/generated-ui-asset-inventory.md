# Generated UI Asset Inventory

作成日: 2026-06-26

対象ディレクトリ: `public/assets/ui`

この棚卸しは、このチャットで生成して `public/assets/ui` に置いたUI素材を、実装へ差し込む前に整理するためのものです。
現時点では元画像を削除・リネームせず、`hud.ts` などゲーム実装にも差し込まない。

## Summary

- 画像総数: 17
- 採用候補: 11
- 保留: 6
- 破棄候補: 0
- RGB / alphaなし / 緑背景あり: 13
- RGBA / alphaあり: 4
- 市松模様焼き込み疑い: 0
- processed出力: 18
- processed採用: 12
- processed保留: 6
- processed出力先: `public/assets/ui/battle-hud/processed/`

## Image Inventory

| file path | file name | image size | mode | has alpha | 緑背景っぽいか | 市松模様疑い | asset key候補 | use scene候補 | 判定 | notes |
| -- | -- | --: | -- | -- | -- | -- | -- | -- | -- | -- |
| `public/assets/ui/ChatGPT Image Jun 26, 2026, 03_28_38 PM.png` | `ChatGPT Image Jun 26, 2026, 03_28_38 PM.png` | 2508×627 | RGB | no | yes | no | `battle-hud-kokuyou-bottle-label` / `kokuyouBottleLabel` | Battle HUD | 採用候補 | 横長の古い紙ラベル。文字なし。黒曜瓶ゲージ下部ラベルとして採用。 |
| `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (1).png` | `ChatGPT Image Jun 26, 2026, 02_16_43 PM (1).png` | 1086×1448 | RGB | no | yes | no | `battle-hud-inventory-paper-slot` | Battle HUD | 保留 | 吊り紐付き大型紙slot。既存の名前付きslotより縦長で余白過多。backup候補。 |
| `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (2).png` | `ChatGPT Image Jun 26, 2026, 02_16_43 PM (2).png` | 1254×1254 | RGB | no | yes | no | `battle-hud-paper-tag-dawn` | Battle HUD | 保留 | 朝日装飾付き紙札。Dawn札候補だが、同用途では `02_22_23 PM (2)` の方が縦HUDに合わせやすい。 |
| `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (3).png` | `ChatGPT Image Jun 26, 2026, 02_16_43 PM (3).png` | 1536×1024 | RGB | no | yes | no | `battle-hud-dual-gauge-frame` | Battle HUD | 保留 | 2段ゲージ枠。名前付きRGBA版と同系統。backup候補。 |
| `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (4).png` | `ChatGPT Image Jun 26, 2026, 02_16_44 PM (4).png` | 1024×1536 | RGB | no | yes | no | `battle-hud-paper-tag-lv` / `battle-hud-paper-tag-menu` | Battle HUD | 保留 | 黒い内枠が強い吊り紙。小さく使うと情報面が狭くなる。 |
| `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (5).png` | `ChatGPT Image Jun 26, 2026, 02_16_44 PM (5).png` | 2172×724 | RGB | no | yes | no | `battle-hud-memory-street-progress-frame` | Battle HUD | 採用候補 | 左右札＋中央星ラインがtargetに近い。緑抜き後に縮小使用候補。 |
| `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (6).png` | `ChatGPT Image Jun 26, 2026, 02_16_44 PM (6).png` | 2172×724 | RGB | no | yes | no | `battle-hud-ultimate-button-label` | Battle HUD | 採用候補 | 横長紙帯。必殺ラベル台紙に使いやすい。幅は実装側で縮小または9-slice化検討。 |
| `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_23 PM (1).png` | `ChatGPT Image Jun 26, 2026, 02_22_23 PM (1).png` | 1122×1402 | RGB | no | yes | no | `battle-hud-paper-tag-lv` | Battle HUD | 採用候補 | 吊り紙の余白が素直。LV札のbest candidate。 |
| `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_23 PM (2).png` | `ChatGPT Image Jun 26, 2026, 02_22_23 PM (2).png` | 1122×1402 | RGB | no | yes | no | `battle-hud-paper-tag-dawn` | Battle HUD | 採用候補 | 朝日モチーフ入り。Dawn札のbest candidate。 |
| `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (3).png` | `ChatGPT Image Jun 26, 2026, 02_22_24 PM (3).png` | 1536×1024 | RGB | no | yes | no | `battle-hud-paper-tag-currency` | Battle HUD | 採用候補 | ランタン/Shard風アイコンが固定装飾として入っている。数値用余白あり。 |
| `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (4).png` | `ChatGPT Image Jun 26, 2026, 02_22_24 PM (4).png` | 1122×1402 | RGB | no | yes | no | `battle-hud-paper-tag-menu` | Battle HUD | 採用候補 | シンプルな吊り紙。三本線をGraphics/Textで載せるmenu札候補。 |
| `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (5).png` | `ChatGPT Image Jun 26, 2026, 02_22_24 PM (5).png` | 2172×724 | RGB | no | yes | no | `battle-hud-memory-street-progress-frame` | Battle HUD | 保留 | `02_16_44 PM (5)` のbackup。よりシンプルで小画面向きだが紙札密度は弱い。 |
| `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (6).png` | `ChatGPT Image Jun 26, 2026, 02_22_24 PM (6).png` | 2172×724 | RGB | no | yes | no | `battle-hud-ultimate-button-label` / `top-primary-cta-paper` | Battle HUD / TOP | 保留 | 横長紙帯。`02_16_44 PM (6)` より素朴。Battle labelのbackup、またはTOP CTA候補。 |
| `public/assets/ui/battle-hud/battle-hud-dual-gauge-frame.png` | `battle-hud-dual-gauge-frame.png` | 1788×714 | RGBA | yes | alphaあり。透明部RGBに緑あり | no | `battle-hud-dual-gauge-frame` | Battle HUD | 採用候補 | すでに命名済み。alphaあり。HP/EXPの2段枠としてbest candidate。 |
| `public/assets/ui/battle-hud/battle-hud-inventory-paper-slot.png` | `battle-hud-inventory-paper-slot.png` | 912×1229 | RGBA | yes | alphaあり。透明部RGBに緑あり | no | `battle-hud-inventory-paper-slot` | Battle HUD | 採用候補 | すでに命名済み。個別紙カードslotのbest candidate。 |
| `public/assets/ui/battle-hud/battle-hud-kokuyou-bottle-frame.png` | `battle-hud-kokuyou-bottle-frame.png` | 716×1418 | RGBA | yes | alphaあり。透明部RGBに緑あり | no | `battle-hud-kokuyou-bottle-frame` | Battle HUD | 採用候補 | すでに命名済み。瓶枠としてbest candidate。内側液面maskは別途必要。 |
| `public/assets/ui/battle-hud/battle-hud-ultimate-seal-lantern-button.png` | `battle-hud-ultimate-seal-lantern-button.png` | 1186×1150 | RGBA | yes | alphaあり。透明部RGBに緑あり | no | `battle-hud-ultimate-seal-lantern-button` | Battle HUD | 採用候補 | すでに命名済み。封蝋＋ランタン必殺ボタンのbest candidate。 |

## Asset Key Candidate Decisions

### Battle HUD

| asset key | best candidate | backup candidate | reject candidates | notes |
| -- | -- | -- | -- | -- |
| `battle-hud-ultimate-seal-lantern-button` | `public/assets/ui/battle-hud/battle-hud-ultimate-seal-lantern-button.png` | none | none | alphaあり。targetの右下ボタンに近い。 |
| `battle-hud-kokuyou-bottle-frame` | `public/assets/ui/battle-hud/battle-hud-kokuyou-bottle-frame.png` | none | none | alphaあり。瓶内の緑は透明扱いの可能性が高いが、最終確認が必要。 |
| `battle-hud-kokuyou-bottle-fill-mask` | none | none | none | 未生成。画像素材ではなく、瓶内部形状に合わせたPhaser Graphics/maskで作る方針。 |
| `battle-hud-inventory-paper-slot` | `public/assets/ui/battle-hud/battle-hud-inventory-paper-slot.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (1).png` | none | 名前付き版が正面構図で使いやすい。backupは縦長すぎる。 |
| `battle-hud-dual-gauge-frame` | `public/assets/ui/battle-hud/battle-hud-dual-gauge-frame.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (3).png` | none | 名前付き版を優先。どちらもゲージfillはコード描画。 |
| `battle-hud-paper-tag-lv` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_23 PM (1).png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (4).png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (4).png` | bestは余白と紙質が良い。rejectは黒内枠が強くLV札には重い。 |
| `battle-hud-paper-tag-dawn` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_23 PM (2).png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (2).png` | none | 朝日モチーフ入り。Textを重ねる余白あり。 |
| `battle-hud-paper-tag-currency` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (3).png` | none | none | アイコンが焼き込みだが、通貨/Shard札としてはむしろ用途に合う。 |
| `battle-hud-paper-tag-menu` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (4).png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (4).png` | none | 三本線はコード描画。 |
| `battle-hud-memory-street-progress-frame` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (5).png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (5).png` | none | bestはtargetの左右札＋星ラインに近い。 |
| `battle-hud-ultimate-button-label` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (6).png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (6).png` | none | どちらも横長すぎるため、後で縮小/9-slice化判断。 |
| `battle-hud-kokuyou-bottle-label` / `kokuyouBottleLabel` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 03_28_38 PM.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (6).png` | none | 専用ラベルを採用。黒曜/BERSERKなどの文字はPhaser Textで載せる。 |
| `battle-exp-star-pickup` | none | none | none | 未生成。既存Graphics/既存アイコンで代用可能だが、target寄せなら必要。 |
| `battle-enemy-hit-ink-burst` | none | none | none | 未生成。黒インクhit burst素材が必要。 |
| `common-ink-splash-black-a` | none | none | none | 未生成。 |
| `common-ink-splash-black-b` | none | none | none | 未生成。 |

## Processed Output Mapping

元画像は削除・リネームせず、以下を `public/assets/ui/battle-hud/processed/` に出力した。
RGB/alphaなし/緑背景ありだった当初12枚と、追加の黒曜瓶ラベル1枚はRGBA PNGへ変換し、緑背景をalpha化した。
既にRGBAだった4枚は実装用名で出力し、透明ピクセルのRGBも黒へ掃除した。

| status | asset key | processed file | source file | processing | notes |
| -- | -- | -- | -- | -- | -- |
| adopted | `battle-hud-ultimate-seal-lantern-button` | `public/assets/ui/battle-hud/processed/battle-hud-ultimate-seal-lantern-button-v1.png` | `public/assets/ui/battle-hud/battle-hud-ultimate-seal-lantern-button.png` | sanitize RGBA | 必殺ボタン本体。 |
| adopted | `battle-hud-kokuyou-bottle-frame` | `public/assets/ui/battle-hud/processed/battle-hud-kokuyou-bottle-frame-v1.png` | `public/assets/ui/battle-hud/battle-hud-kokuyou-bottle-frame.png` | sanitize RGBA | 黒曜瓶フレーム。 |
| adopted | `kokuyouBottleLabel` | `public/assets/ui/battle-hud/processed/battle-hud-kokuyou-bottle-label-v1.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 03_28_38 PM.png` | green key to RGBA | 黒曜瓶ゲージの下ラベルとして使用。文字はPhaser Textで描画し、黒曜/BERSERK等は焼き込まない。 |
| adopted | `kokuyouBottleLabelRuntime` | `public/assets/ui/battle-hud/processed/battle-hud-kokuyou-bottle-label-runtime.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 03_28_38 PM.png` | green key to RGBA + resize 216×54 | 黒曜瓶ゲージの下ラベルruntime版。実装ではこちらを優先使用。文字はPhaser Textで描画する。 |
| adopted | `battle-hud-inventory-paper-slot` | `public/assets/ui/battle-hud/processed/battle-hud-inventory-paper-slot-v1.png` | `public/assets/ui/battle-hud/battle-hud-inventory-paper-slot.png` | sanitize RGBA | 通常スロット。 |
| adopted | `battle-hud-dual-gauge-frame` | `public/assets/ui/battle-hud/processed/battle-hud-dual-gauge-frame-v1.png` | `public/assets/ui/battle-hud/battle-hud-dual-gauge-frame.png` | sanitize RGBA | HP/EXP枠。 |
| adopted | `battle-hud-memory-street-progress-frame` | `public/assets/ui/battle-hud/processed/battle-hud-memory-street-progress-paper-v1.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (5).png` | green key to RGBA | Memory Street進行バー。 |
| adopted | `battle-hud-ultimate-button-label` | `public/assets/ui/battle-hud/processed/battle-hud-ultimate-button-label-v1.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (6).png` | green key to RGBA | 必殺ラベル帯。 |
| adopted | `battle-hud-paper-tag-lv` | `public/assets/ui/battle-hud/processed/battle-hud-paper-tag-lv-v1.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_23 PM (1).png` | green key to RGBA | LV札。 |
| adopted | `battle-hud-paper-tag-dawn` | `public/assets/ui/battle-hud/processed/battle-hud-paper-tag-dawn-v1.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_23 PM (2).png` | green key to RGBA | Dawn札。 |
| adopted | `battle-hud-paper-tag-currency` | `public/assets/ui/battle-hud/processed/battle-hud-paper-tag-currency-v1.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (3).png` | green key to RGBA | 通貨/Shard札。 |
| adopted | `battle-hud-paper-tag-menu` | `public/assets/ui/battle-hud/processed/battle-hud-paper-tag-menu-v1.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (4).png` | green key to RGBA | メニュー札。 |
| hold | `battle-hud-inventory-paper-slot` | `public/assets/ui/battle-hud/processed/battle-hud-inventory-paper-slot-hold-large-v1.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (1).png` | green key to RGBA | 縦長slot backup。 |
| hold | `battle-hud-paper-tag-dawn` | `public/assets/ui/battle-hud/processed/battle-hud-paper-tag-dawn-hold-square-v1.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (2).png` | green key to RGBA | 正方形Dawn札 backup。 |
| hold | `battle-hud-dual-gauge-frame` | `public/assets/ui/battle-hud/processed/battle-hud-dual-gauge-frame-hold-v1.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (3).png` | green key to RGBA | 2段ゲージ backup。 |
| hold | `battle-hud-paper-tag-lv` | `public/assets/ui/battle-hud/processed/battle-hud-paper-tag-hold-dark-panel-v1.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (4).png` | green key to RGBA | 黒内枠が強い吊り紙。 |
| hold | `battle-hud-memory-street-progress-frame` | `public/assets/ui/battle-hud/processed/battle-hud-memory-street-progress-hold-simple-v1.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (5).png` | green key to RGBA | シンプル進行バー backup。 |
| hold | `battle-hud-ultimate-button-label` | `public/assets/ui/battle-hud/processed/battle-hud-paper-label-hold-simple-v1.png` | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (6).png` | green key to RGBA | 横長紙帯 backup。 |

## Processed Verification

- 透過後PNGはすべてRGBA。
- processed内の緑背景検出率はすべて0.00%。
- 市松模様焼き込み疑いは未検出。
- 元画像は削除していない。
- 画像の大規模リネームはしていない。実装用名はprocessed側の出力名として固定した。
- `processed/battle-hud-kokuyou-bottle-label-v1.png` はRGBA、緑背景検出率0.00%。薄い緑フチ候補はごく少量で、92〜108px幅の実表示では強く出にくい見込み。
- `processed/battle-hud-kokuyou-bottle-label-runtime.png` は216×54のRGBA runtime版。緑背景検出率0.00%。文字なし。
- 390×844での最終配置確認は次フェーズ。現時点では素材単体の透過・命名整理まで。

### TOP

| asset key | best candidate | backup candidate | reject candidates | notes |
| -- | -- | -- | -- | -- |
| `top-moon-soft` | none | none | none | 未生成。 |
| `top-city-silhouette` | none | none | none | 未生成。 |
| `top-title-paper-banner` | none | none | none | 未生成。Battle紙帯を流用するとTOPの顔が弱い。 |
| `top-primary-cta-paper` | none | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (6).png` | none | backup流用は可能だが、TOP主CTA専用の紙ボタン生成が望ましい。 |
| `top-small-button-paper` | none | none | none | 未生成。 |
| `top-ink-splatter-deco` | none | none | none | 未生成。 |
| `top-paper-scrap-small` | none | none | none | 未生成。 |

### Kokuyou Cutin

| asset key | best candidate | backup candidate | reject candidates | notes |
| -- | -- | -- | -- | -- |
| `cutin-ink-slash-wide` | none | none | none | 未生成。最優先で追加生成したい。 |
| `cutin-lantern-light-streak` | none | none | none | 未生成。 |
| `cutin-title-band` | none | `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (6).png` | none | backup流用は可能だが、カットイン専用の暗い帯が必要。 |
| `cutin-paper-accent` | none | none | none | 未生成。 |
| `cutin-kokuyou-silhouette` | none | none | none | 未生成。既存カットイン素材で代用できるなら後回し。 |

## Duplicate Groups

- Inventory paper slot:
  - best: `public/assets/ui/battle-hud/battle-hud-inventory-paper-slot.png`
  - backup: `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (1).png`
- Dual gauge frame:
  - best: `public/assets/ui/battle-hud/battle-hud-dual-gauge-frame.png`
  - backup: `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (3).png`
- Vertical hanging paper tag:
  - best for LV: `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_23 PM (1).png`
  - best for menu: `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (4).png`
  - weak/reject for LV: `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (4).png`
- Dawn paper tag:
  - best: `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_23 PM (2).png`
  - backup: `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (2).png`
- Memory Street progress frame:
  - best: `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (5).png`
  - backup: `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (5).png`
- Long paper label:
  - best for ultimate label: `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (6).png`
  - backup / TOP CTA placeholder: `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (6).png`

## Missing Assets

### Battle HUD

- `battle-hud-kokuyou-bottle-fill-mask`
- `battle-exp-star-pickup`
- `battle-enemy-hit-ink-burst`
- `common-ink-splash-black-a`
- `common-ink-splash-black-b`

### TOP

- `top-moon-soft`
- `top-city-silhouette`
- `top-title-paper-banner`
- `top-primary-cta-paper`
- `top-small-button-paper`
- `top-ink-splatter-deco`
- `top-paper-scrap-small`

### Kokuyou Cutin

- `cutin-ink-slash-wide`
- `cutin-lantern-light-streak`
- `cutin-title-band`
- `cutin-paper-accent`
- `cutin-kokuyou-silhouette`

## Transparency Processing Plan

### #00FF00 背景除去対象

RGBでalphaがなく、緑背景が広く残っていた以下13枚は、`processed/` 側にRGBA PNGとして出力済み。

- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (1).png`
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (2).png`
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (3).png`
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (4).png`
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (5).png`
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (6).png`
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_23 PM (1).png`
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_23 PM (2).png`
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (3).png`
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (4).png`
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (5).png`
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (6).png`
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 03_28_38 PM.png`

### alphaあり確認済み対象

以下は元からRGBAでalphaあり。`processed/` 側へ実装用名でコピー済み。

- `public/assets/ui/battle-hud/battle-hud-dual-gauge-frame.png`
- `public/assets/ui/battle-hud/battle-hud-inventory-paper-slot.png`
- `public/assets/ui/battle-hud/battle-hud-kokuyou-bottle-frame.png`
- `public/assets/ui/battle-hud/battle-hud-ultimate-seal-lantern-button.png`

### 透過処理が難しそうな対象

- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (5).png`: 細い星ラインが多く、緑抜きでエッジが欠けやすい。
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (5).png`: 細い星ラインが多く、同じくエッジ欠け注意。
- `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (3).png`: ランタンglowやShard周辺に緑の反射が残る可能性あり。

### 緑フチが残りそうな対象

- ロープ付き紙札全般:
  - `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_43 PM (1).png`
  - `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (4).png`
  - `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_23 PM (1).png`
  - `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (4).png`
- 細い黒縁がある紙帯:
  - `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_16_44 PM (6).png`
  - `public/assets/ui/ChatGPT Image Jun 26, 2026, 02_22_24 PM (6).png`

### 作り直した方が早い対象

- `battle-hud-kokuyou-bottle-fill-mask`: 現物がない。画像生成ではなく、瓶フレームの内側形状に合わせたPhaser Graphics/maskで作る方針。
- TOP素材一式: 現在のBattle紙素材流用では、TOPの「画面の顔」として弱い。
- Kokuyou Cutin素材一式: 現在の素材群に黒インクslash/ランタン光ラインがない。

## Next Generation Priority

1. `battle-hud-kokuyou-bottle-fill-mask` は生成より先にGraphics/mask実装で足りるか検討
2. `cutin-ink-slash-wide`
3. `cutin-lantern-light-streak`
4. `top-title-paper-banner`
5. `top-primary-cta-paper`
6. `top-small-button-paper`
7. `common-ink-splash-black-a`
8. `common-ink-splash-black-b`

## Implementation Readiness

まだ `hud.ts` 実装には入らない方がよい。

理由:

- RGB緑背景素材13枚の透過処理とprocessed命名整理は完了。
- Battle HUDの採用候補10枚は実装用ファイル名に固定済み。
- `battle-hud-kokuyou-bottle-label` はprocessed化済み。
- `battle-hud-kokuyou-bottle-label-runtime.png` は216×54で追加済み。Battle HUD実装ではこちらを優先使用する。
- `battle-hud-kokuyou-bottle-fill-mask` はコード側Graphics/maskで代替できるか、実装前に判断が必要。
- TOP / Kokuyou Cutinの専用素材はまだ不足している。
