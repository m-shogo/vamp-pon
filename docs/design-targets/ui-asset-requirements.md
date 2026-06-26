# UI Asset Requirements

この文書は、`docs/design-targets/final/` の完成目標PNGをもとに、ゲーム実装で必要になる専用UI素材を整理するための仕様書です。

## 基本方針

`docs/design-targets/final/*.png` は完成目標の参照画像であり、切り抜いてゲーム内に配置する素材ではない。

実装では以下を守る。

- target PNGを切り抜いて使わない
- 画像内の文字をそのまま使わない
- 可変情報は Phaser Text / Graphics で描画する
- 紙質、封蝋、瓶、黒インク、ランタン、スロットなど、質感が必要な外側だけを専用UI素材化する
- 390×844 縦画面で読める・押せる・見やすいことを優先する
- 素材が未配置でも Graphics fallback で動く構造にする
- Battle中は敵、弾、EXP、HP、必殺、黒曜ゲージの視認性を最優先する

## Asset Directory

想定配置先:

```txt
public/assets/ui/
```

推奨サブディレクトリ:

```txt
public/assets/ui/battle-hud/
public/assets/ui/top/
public/assets/ui/cutin/
public/assets/ui/common/
```

## Naming Rules

- 小文字 kebab-case
- 画面名または用途を含める
- 9-slice前提のものは `-9slice` を付ける
- 状態差分は suffix を付ける

例:

```txt
battle-hud-paper-tag-lv.png
battle-hud-paper-slot-empty.png
battle-hud-paper-slot-selected.png
battle-hud-ultimate-seal-lantern-ready.png
common-paper-button-9slice.png
```

## Do Not Bake Text

原則として以下は画像に焼き込まない。

- LV数値
- HP/EXP数値
- タイマー
- 通貨数
- 黒曜%
- 敵残数
- アイテム個数
- 必殺ラベル
- ボタン文言
- UIラベル

ただし、完全固定の小装飾文字や英字ロゴ風表現は例外として検討可。
その場合も日本語UI本体は Phaser Text で描画する。

---

# Battle HUD Asset Requirements

参照画像:

```txt
docs/design-targets/final/battle-final.png
```

## Target Visual Summary

Battle target画像の重要要素:

- 上部HUDは1本の帯ではなく、個別の紙札タグ群で構成
- 左上に吊り紙型のLV札
- HP/EXPは黒板風の2段ゲージフレーム
- 中央にDawn in紙札
- 右上に通貨/Shardの2段紙札
- 右端に吊り紙型メニュー札
- その下にMemory Street進行バー
- 左下に瓶型黒曜ゲージ
- 右下に封蝋＋ランタンの必殺ボタン
- 下部に吊り紙風の個別インベントリスロット
- 数字、残量、ラベルはゲーム側Text/Graphicsで更新する

---

## Battle HUD MVP Assets

| asset key | file name | use scene | purpose | size guide | transparent | nine-slice | priority | notes |
| -- | -- | -- | -- | --: | -- | -- | -- | -- |
| `hudPaperTagLv` | `battle-hud-paper-tag-lv.png` | Battle HUD | 左上のLV吊り紙札 | 96×128 | yes | no | highest | 穴、金具、紙の端欠け込み。文字なし推奨。`LV.`もTextで載せる |
| `hudDualGaugeFrame` | `battle-hud-dual-gauge-frame.png` | Battle HUD | HP/EXP 2段ゲージ外枠 | 240×104 | yes | partial | highest | 黒板風フレーム。ゲージ量はGraphics。左アイコン領域あり |
| `hudPaperTagDawn` | `battle-hud-paper-tag-dawn.png` | Battle HUD | Dawn inタイマー紙札 | 124×128 | yes | no | high | 朝日小アイコン用余白あり。`Dawn in` と時間はText |
| `hudPaperTagCurrency` | `battle-hud-paper-tag-currency.png` | Battle HUD | ランタン数/Shard数の2段紙札 | 180×120 | yes | no | high | 上下区切り線あり。アイコン別素材でも可 |
| `hudPaperTagMenu` | `battle-hud-paper-tag-menu.png` | Battle HUD | 右上メニュー吊り紙札 | 82×120 | yes | no | high | 三本線はText/Graphicsでも可。押下状態を作れる形 |
| `memoryStreetProgressFrame` | `battle-hud-memory-street-progress-frame.png` | Battle HUD | Memory Street進行バー | 390×44 | yes | yes | high | 左ラベル、中央星点線、右敵残数札のセット。文字はText |
| `kokuyouBottleFrame` | `battle-hud-kokuyou-bottle-frame.png` | Battle HUD | 左下黒曜ゲージ瓶枠 | 96×220 | yes | no | highest | ガラス瓶、口、黒インク外周装飾。内部液量は別描画 |
| `kokuyouBottleFillMask` | `battle-hud-kokuyou-bottle-fill-mask.png` | Battle HUD | 黒曜瓶の液面マスク | 64×170 | yes | no | highest | 瓶内部形状に合わせる。液体色と残量はGraphics/Image mask |
| `kokuyouBottleLabel` | `battle-hud-kokuyou-bottle-label.png` | Battle HUD | 黒曜ゲージ下の紙ラベル | 100×54 | yes | no | high | 文字なし推奨。`黒曜` / `BERSERK` はText |
| `ultimateSealLanternButton` | `battle-hud-ultimate-seal-lantern-button.png` | Battle HUD | 右下必殺ボタン本体 | 156×156 | yes | no | highest | 封蝋＋中央ランタン意匠。READY光はコードで追加 |
| `ultimateSealLanternButtonReady` | `battle-hud-ultimate-seal-lantern-button-ready.png` | Battle HUD | 必殺ボタンREADY状態 | 156×156 | yes | no | medium | 余裕があれば。通常素材＋コードglowでも代替可 |
| `ultimateButtonLabel` | `battle-hud-ultimate-button-label.png` | Battle HUD | 必殺ボタン下の紙ラベル帯 | 136×42 | yes | yes | high | 星飾り付き。文字はTextで載せる |
| `inventoryPaperSlot` | `battle-hud-inventory-paper-slot.png` | Battle HUD | 下部インベントリ通常スロット | 100×132 | yes | no | highest | 吊り紙、穴、紙の欠け、淡い汚れ。アイコン/個数は別描画 |
| `inventoryPaperSlotEmpty` | `battle-hud-inventory-paper-slot-empty.png` | Battle HUD | 下部インベントリ空スロット | 100×132 | yes | no | high | コンパス風薄印刷や紙だけの状態 |
| `inventoryPaperSlotSelected` | `battle-hud-inventory-paper-slot-selected.png` | Battle HUD | 選択/強調スロット | 100×132 | yes | no | medium | 枠光や封蝋ワンポイント。コードglowでも代替可 |

---

## Battle HUD Secondary Assets

| asset key | file name | use scene | purpose | size guide | transparent | nine-slice | priority | notes |
| -- | -- | -- | -- | --: | -- | -- | -- | -- |
| `battleFloorStarMap` | `battle-floor-starmap.png` | Battle | 星図/紙地の戦闘背景 | 390×844 or 780×1688 | no | no | medium | 戦闘視認性優先。描き込みすぎない |
| `inkSplashBlackA` | `common-ink-splash-black-a.png` | Battle / Cutin | 黒インク飛沫 | 128×128 | yes | no | medium | 敵周囲、黒曜演出、ヒット演出 |
| `inkSplashBlackB` | `common-ink-splash-black-b.png` | Battle / Cutin | 黒インク飛沫別形状 | 160×160 | yes | no | medium | 3〜5バリエーション欲しい |
| `expStarPickup` | `battle-exp-star-pickup.png` | Battle | EXP星ドロップ | 40×40 | yes | no | medium | 軌跡はコード。星アイコンだけ素材 |
| `enemyHitInkBurst` | `battle-enemy-hit-ink-burst.png` | Battle | 敵被弾インク爆ぜ | 128×128 | yes | no | medium | hit時の一瞬用。数フレーム差分があると良い |
| `hudIconHeart` | `battle-hud-icon-heart.png` | Battle HUD | HPアイコン | 32×32 | yes | no | low | 既存icon/Graphics代用可 |
| `hudIconStar` | `battle-hud-icon-star.png` | Battle HUD | EXPアイコン | 32×32 | yes | no | low | 既存icon/Graphics代用可 |
| `hudIconLanternSmall` | `battle-hud-icon-lantern-small.png` | Battle HUD | 通貨上段アイコン | 32×32 | yes | no | low | 既存icon/Graphics代用可 |
| `hudIconShardBlue` | `battle-hud-icon-shard-blue.png` | Battle HUD | Shardアイコン | 32×32 | yes | no | low | 既存icon/Graphics代用可 |
| `hudIconSkullSmall` | `battle-hud-icon-skull-small.png` | Battle HUD | 敵残数アイコン | 28×28 | yes | no | low | Graphics代用可 |

---

# Battle HUD: Code-Drawn Elements

以下は素材にせず、Phaser Text / Graphics / Tween で描画する。

## Top HUD

- `LV.`
- レベル数値
- HP値 `164 / 190`
- EXP値 `78 / 120`
- HPバー残量
- EXPバー残量
- `Dawn in`
- 残り時間 `08:47`
- 通貨数
- Shard数
- メニュー三本線の押下状態

## Progress Row

- `Memory Street 3`
- 敵残数 `14 / 18`
- 進行率
- 星ノードの点灯/未点灯
- 進行線のアニメーション

## Kokuyou Bottle

- 黒曜% `63%`
- 液面の高さ
- 液面の揺れ
- READY時の発光
- 発動中/疲労中の色変化
- `黒曜`
- `BERSERK`

## Ultimate Button

- 必殺ゲージ残量
- READY時のglow
- 押下scale/tween
- `必殺技`
- `OK` / cooldown等の状態文字

## Inventory

- アイテムアイコン
- 所持数
- レベル表記
- 選択/取得時の軽い光
- slotの使用可否状態

## Combat Field

- 敵名
- 敵HPバー
- ダメージ数字
- `EXP +12`
- 敵/弾/EXPの位置
- 被弾エフェクト
- 黒インク粒子

---

# Battle HUD Implementation Notes

## Recommended HUD Structure

```txt
Hud
├─ topHud
│  ├─ lvTagImage or fallback
│  ├─ dualGaugeFrameImage or fallback
│  ├─ dawnTagImage or fallback
│  ├─ currencyTagImage or fallback
│  └─ menuTagImage or fallback
│
├─ progressRow
│  ├─ memoryStreetProgressFrameImage or fallback
│  ├─ memoryStreetText
│  ├─ enemyRemainText
│  └─ progressNodes
│
├─ kokuyouHud
│  ├─ bottleFrameImage or fallback
│  ├─ bottleFillGraphics/ImageMask
│  ├─ percentText
│  └─ labelText
│
├─ ultimateHud
│  ├─ sealLanternImage or fallback
│  ├─ gaugeGraphics
│  ├─ readyGlow
│  └─ labelText
│
└─ inventoryHud
   ├─ slotImages or fallback
   ├─ itemIcons
   └─ countTexts
```

## Fallback Rule

素材が存在する場合:

```txt
scene.textures.exists(key) === true
→ Image / NineSlice を使う
```

素材が存在しない場合:

```txt
→ 既存の Graphics fallback を使う
```

最初から全素材が揃う前提にしない。
UIは素材なしでも動き、素材追加で品質が上がる構造にする。

---

# Image Generation Requirements

## Common Style

- transparent PNG
- no text
- no logo
- no watermark
- no white background
- no checkerboard background
- no white fringe
- front-facing UI asset
- minimal perspective distortion
- mobile game UI asset
- dark storybook fantasy
- handmade paper texture
- black ink stains
- warm lantern glow
- wax seal accents
- deep navy / muted violet / aged beige / warm amber palette
- readable at small mobile size
- not realistic photo
- not glossy plastic
- not modern flat UI

## Specific Style for Battle HUD

- cozy dark fantasy
- paper ledger / forgotten street / night map feeling
- slightly worn edges
- handcrafted but clean enough for UI
- high contrast silhouette
- no baked Japanese text
- no baked numbers

---

# First Generation Batch Recommendation

最初に生成するべき素材は以下。

## Batch 1: Battle HUD Identity Assets

1. `battle-hud-ultimate-seal-lantern-button.png`
2. `battle-hud-kokuyou-bottle-frame.png`
3. `battle-hud-kokuyou-bottle-fill-mask.png`
4. `battle-hud-inventory-paper-slot.png`

理由:

- 画面印象が最も大きく変わる
- target画像との差分が大きい
- Graphicsだけでは品質が出にくい
- Battle HUDの「アプリ感」を最短で上げられる

## Batch 2: Battle HUD Top Assets

1. `battle-hud-paper-tag-lv.png`
2. `battle-hud-dual-gauge-frame.png`
3. `battle-hud-paper-tag-dawn.png`
4. `battle-hud-paper-tag-currency.png`
5. `battle-hud-paper-tag-menu.png`
6. `battle-hud-memory-street-progress-frame.png`

## Batch 3: Battle Secondary Assets

1. `battle-exp-star-pickup.png`
2. `battle-enemy-hit-ink-burst.png`
3. `common-ink-splash-black-a.png`
4. `common-ink-splash-black-b.png`

---

# TOP Asset Draft

TOP画像の実物を別途確認して精査する。
現時点で想定される候補:

| asset key | file name | use scene | purpose | size guide | transparent | nine-slice | priority | notes |
| -- | -- | -- | -- | --: | -- | -- | -- | -- |
| `topMoonSoft` | `top-moon-soft.png` | TOP | 背景の月 | 96×96 | yes | no | high | 暖色すぎず、淡い月 |
| `topCitySilhouette` | `top-city-silhouette.png` | TOP | 下部街並みシルエット | 390×160 | yes | no | high | 戦闘背景より装飾寄り |
| `topTitlePaperBanner` | `top-title-paper-banner.png` | TOP | タイトル紙札 | 300×110 | yes | yes | high | 文字なし |
| `topPrimaryCtaPaper` | `top-primary-cta-paper-9slice.png` | TOP | 主CTAボタン | 260×64 | yes | yes | high | 文字なし |
| `topSmallButtonPaper` | `top-small-button-paper-9slice.png` | TOP | 3小ボタン | 96×56 | yes | yes | high | 成長/忘れ物帳/設定 |
| `topInkSplatterDeco` | `top-ink-splatter-deco.png` | TOP | インク飛沫装飾 | 160×160 | yes | no | medium | 使い回し可 |
| `topPaperScrapSmall` | `top-paper-scrap-small.png` | TOP | 小紙片装飾 | 64×40 | yes | no | medium | 複数向き |

---

# Kokuyou Cutin Asset Draft

黒曜化カットイン画像の実物を別途確認して精査する。
現時点で想定される候補:

| asset key | file name | use scene | purpose | size guide | transparent | nine-slice | priority | notes |
| -- | -- | -- | -- | --: | -- | -- | -- | -- |
| `cutinInkSlashWide` | `cutin-ink-slash-wide.png` | Kokuyou Cutin | 斜め黒インクslash | 512×220 | yes | no | highest | 黒曜化の迫力用 |
| `cutinLanternLightStreak` | `cutin-lantern-light-streak.png` | Kokuyou Cutin | 暖色ランタン光ライン | 512×120 | yes | no | high | ADD blend想定 |
| `cutinTitleBand` | `cutin-title-band-9slice.png` | Kokuyou Cutin | 下部タイトル帯 | 360×64 | yes | yes | high | `黒曜化` のTextを載せる |
| `cutinPaperAccent` | `cutin-paper-accent.png` | Kokuyou Cutin | 紙片/帯装飾 | 240×80 | yes | no | medium | 速度感の補助 |
| `cutinKokuyouSilhouette` | `cutin-kokuyou-silhouette.png` | Kokuyou Cutin | ユイ黒曜化シルエット | 360×360 | yes | no | optional | 既存素材で代用できるなら後回し |

---

# Verification Checklist

素材作成後に確認すること:

- 透過PNGである
- 白背景がない
- 市松模様が焼き込まれていない
- 白フチがない
- 文字が焼き込まれていない
- 390×844で潰れない
- 暗背景でも見える
- 拡大しすぎても粗くない
- UI上のTextが載せやすい余白がある
- 9-slice対象は四隅が破綻しない
- 既存のworld paletteと合う
- Battle中の視認性を邪魔しない
