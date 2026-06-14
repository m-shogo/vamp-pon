# Visual Audit (Current)

現在のビジュアル生成関数の棚卸し。ギャラリー（[visual-gallery.md](visual-gallery.md)）で目視確認した結果も記す。

> 確認日: 2026-06-14 / クロード。VisualGalleryScene で全ページをスクショ確認済み。

---

## 1. ビジュアル生成関数の対応

| 関数 | 場所 | 描くもの |
|---|---|---|
| `createBackground` | ui/background.ts | 藍紫の夜＋紙グレイン＋ヴィネット＋縁の紙片/街灯/インク染み（グリッドなし） |
| `createPlayerView` | ui/factory.ts | ユイ: フード＋ワンピース＋手元のランタン＋足元の暖光 |
| `createEnemyView` | ui/factory.ts | 黒インク影＋足元のインク溜まり＋白目。visualKind別モチーフ |
| `createProjectileView` | ui/factory.ts | 弾。ProjectileVisualKind別（下表） |
| `createAreaView` | ui/factory.ts | 地面範囲。ink/lamp/dawn |
| `createOrbiterView` | ui/factory.ts | 月のしおり（紙のしおり＋月のしるし） |
| `createPickupView` | ui/factory.ts | 記憶の欠片（金の星＋柔光） |
| `createHealPickupView` | ui/factory.ts | 回復（朝色の包帯紙） |
| `createCapsuleView` | ui/factory.ts | 記憶カプセル（コルク瓶＋中の星） |
| `evolutionBurst` | ui/effects.ts | 進化演出。EvolutionKind別アクセント（強化/合体/覚醒） |
| `Hud` | ui/hud.ts | 時間/Lv/HP/XP/必殺ゲージ/所持品 |
| `Overlays.levelUpCard` | ui/overlays.ts | レベルアップカード（古紙＋茶縁＋レア度） |
| `Overlays.showCapsule` | ui/overlays.ts | カプセル演出（種別アクセント） |
| `Overlays.showResult` | ui/overlays.ts | リザルト |

## 2. enemy visualKind → 見た目

| visualKind | 敵 | 見た目 |
|---|---|---|
| `ink_blob` | インクの影 | 黒い丸＋白目＋インク溜まり |
| `paper_scrap` | 紙くずの影 | 影＋刺さった紙片 |
| `signpost` | 迷子の方角 | 影＋小さな道しるべ |
| `capsule` | 黒いカプセル | 影＋コルク＋縦長の輪郭 |
| `haze` | 夜のもや | 半透明のにじんだ影 |
| `label_elite` | 黒ラベルの影 | 紫帯びの影＋黒く塗った名前ラベル |

## 3. weaponId → 弾/範囲の見た目（`domain/weaponVisual.ts`）

| 武器 | 種別 | kind |
|---|---|---|
| 夜の鉛筆 | 強化進化元 | `pencil` |
| ビー玉 | 覚醒元 | `glass_marble` |
| 月のしおり | — | orbit（しおり） |
| 黒インクの小瓶 | 合体元 | area `ink` |
| 星くず弾 | 強化進化元 | `star` |
| 絵はがきカッター | 覚醒元 | `blade` |
| 紙ひこうき | 覚醒元 | `paper_airplane` |
| 街灯の輪 | 合体元 | area `lamp` |
| 未完成の一行 | 強化進化 | `pencil_line` |
| 北極星のランタン | 強化進化 | `paper_lantern` |
| 夜明けのインク灯 | 合体 | area `dawn` |
| 消えない名前 | 覚醒 | `name_line` |
| 追憶のビー玉 | 覚醒 | `lens_marble` |
| 宛先のない刃 | 覚醒 | `envelope_blade` |
| 追い風の紙ひこうき | 覚醒 | `big_plane` |

## 4. 強化進化 / 合体 / 覚醒の見た目差（`EVOLUTION_ACCENT`）

| 種別 | 演出アクセント | 弾の見た目の方向 |
|---|---|---|
| upgrade（強化進化） | 暖色1リング | 元武器の延長（濃い鉛筆線 / 紙ランタン光） |
| fusion（合体） | 朝色＋黒インク2リング | 2モチーフ（夜明けの輪＝インク＋街灯） |
| awakening（覚醒） | 淡菫＋金2リング | レア別モチーフ（名前札 / レンズ / 封筒 / 風） |

## 5. Claude が目視できた部分（ギャラリーでスクショ確認）

```txt
背景 / ユイ / 敵6種          OK（白目・モチーフ確認）
拾得物 / 実HUD / カード      OK（レア度の差も確認）
通常武器8種の弾             OK（別モチーフで区別可能）
進化・合体・覚醒の弾と分類   OK（3種別＋レア別が見分け可能）
戦闘モックの視認性          OK（敵が範囲の上でも見える、欠片明瞭）
```

## 6. まだ仮の部分

```txt
本スプライト（ドット絵）への差し替え（現在はベクター図形での近似）
背景タイルの本テクスチャ（紙質はグレインで近似）
カードの手描き縁・破れの質感（矩形＋stroke）
敵のアニメーション
弾の軌跡（トレイル）
```

## 7. 実機確認で見るべき部分（ギャラリーでは分からない）

```txt
動いている時の弾の見やすさ（残像/速度感）
敵が大量に出た時の埋もれ具合（ギャラリーは数体のみ）
スマホ実機の発色（藍紫が黒つぶれしないか）
60fps時の演出のうるささ
進化演出（evolutionBurst）の実発動時の印象
```

レビュー観点は [visual-next-review-checklist.md](visual-next-review-checklist.md)。

---

## 8. 画像移行の観点での分類（2026-06-14 追記）

Graphics で描き続けず、画像アセット＋fallback へ移すための分類。
パイプラインは [art-pipeline.md](art-pipeline.md)、素材は [visual-asset-manifest.md](visual-asset-manifest.md)。

| 区分 | 対象 | 方針 |
|---|---|---|
| 1. 今のまま残せる | HP/XP/必殺ゲージ、画面シェイク/フラッシュ、inkPuff/collectSpark | Graphicsで継続（画像化不要） |
| 2. 方向は合うが仮 | 背景ヴィネット/グレイン、カード枠、進化リング演出 | 本素材（タイル/カード紙）が来るまで暫定 |
| 3. fallbackとして残す | createPlayerView / createEnemyView / createProjectileView / createAreaView / createPickup・Heal・Capsule・Orbiter View | 画像が来たら自動置換。コードは残す |
| 4. 画像素材化すべき | 背景タイル / ユイ / 敵6種 / 欠片・回復・カプセル / レア4 / 通常武器8 / 進化4・合体1・覚醒4 / カード3 | manifest に定義済み。優先順位は art-pipeline §4 |
| 5. 今すぐ弱める/消す | （前段で対応済み）ビーム/魔法陣/ネオン/ギラ星/十字スラッシュ | 既に紙・インク・灯りへ置換済み。今後も増やさない |

### Claude が目視できなかった部分

```txt
実スプライト（まだ1枚も無い）の見た目 — 制作後にギャラリーで要確認
画像導入後の NEAREST フィルタの効き（ドットのにじみ）
```
