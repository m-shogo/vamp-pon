# Art Pipeline（ドット絵アセット制作工程）

Vamp Pon を「紙片・絵本風ドット / 夜の街」に戻すための制作フロー。
Phaser Graphics で全部描き続けるのをやめ、**画像アセット + fallback** へ移行する。

> 今すぐ全素材を作るのが目的ではない。まず工程・仕様・置き場・manifest・確認導線を整える。

---

## 1. 正しい制作順

```txt
参考画像（assets/concept-design）
  ↓ アートディレクション（docs/visual-direction.md）
  ↓ 最小素材一覧（src/game/assets/assetManifest.ts が正本）
  ↓ サイズ規定（docs/sprite-size-guide.md）
  ↓ コード生成素材（docs/generated-pixel-assets.md / src/game/assets/vampPixelKit.ts）
  ↓ 生成/制作プロンプト（docs/pixel-art-generation-prompts.md）
  ↓ Aseprite等でドット絵作成（scripts/aseprite/README.md）
  ↓ 透過PNG書き出し → public/assets/sprites/... に配置
  ↓ Phaser preload（BootScene が assetManifest を読む）
  ↓ VisualGallery で確認（?scene=asset-status / visual-gallery / combat-mock）
  ↓ 本編へ反映（createXView が自動で画像へ切替）
```

ポイント: コードは**画像があれば使い、無ければ Graphics fallback**。素材は1個ずつ差し込める。

---

## 2. Graphics で描いてよいもの / 画像素材化すべきもの

### Graphics（fallback / 軽い演出）で良い

```txt
画面シェイク / フラッシュ / 短命の粒（inkPuff / collectSpark）
進化演出のリング（evolutionBurst）※モチーフ差はアクセントで
HUDのバー/ゲージ（HP/XP/必殺）
カードの枠（本素材化までの仮）
背景のヴィネット/グレイン（タイル本素材が来るまで）
```

### 画像素材化すべき（最終的にドット絵へ）

```txt
背景タイル / ユイ / 敵全種 / 記憶の欠片・回復・カプセル
レアアイテム4種 / 通常武器8種の弾・範囲 / 進化4・合体1・覚醒4の弾・範囲
UIカード紙素材3種
```

「ただの丸・線・星」で済ませているものは、すべて画像化候補。

---

## 3. fallback の役割

- 画像が無い段階でもゲーム/ギャラリーが**壊れない**ための代替描画。
- `src/game/ui/factory.ts` の各 `createXView` が、先頭で `spriteOrNull()` を試し、
  画像が無ければ従来の Graphics を描く。
- VisualGallery の「アセット状況」ページで **実素材 / fallback / 欠品** を一覧できる。

---

## 4. 完成素材化の優先順位

```txt
1. 背景タイル（bg_stage1_paper_night）   ← 全体の土台
2. ユイ（yui_idle）
3. 黒インク影（enemy_ink_blob ほか敵5種）
4. 記憶の欠片 / 回復 / カプセル
5. 通常武器8種の弾・範囲
6. 強化進化2種
7. 合体1種
8. 覚醒4種
9. UIカード3種
```

---

## 5. 役割分担

| 担当 | 役割 |
|---|---|
| Claude / Fable | 世界観整理・素材仕様書・命名・manifest・Phaser実装接続・VisualGallery・テスト |
| vampPixelKit | 小物・弾・拾得物・紙片・インク・基本敵の generated-final 生成。キャラ/背景/大型素材は generated-draft で土台を作る |
| ドット絵ツール（Aseprite/LibreSprite/Piskel） | 生成物の手直し・パレット管理・スプライトシート化。source は `assets/source/aseprite/` に置く |
| MCP（filesystem / Playwright / GitHub） | ファイル整理・差分確認・書き出し補助・スクショ確認 |
| 外部生成サイト（Lospec参照 / 画像生成） | ラフ案・パレット案・モチーフ案（最終素材としてそのまま使わない） |

推奨ツール: Aseprite / LibreSprite / Piskel / Lospec（パレット）/ itch.io（参考素材）。
画像生成サイトは**ラフ用のみ**。Playwright MCP で画面スクショ確認、filesystem MCP で assets 整理。

---

## 6. まだ仮のもの

```txt
ユイ / 背景タイル / カード紙素材の手仕上げ
敵アニメーション / 弾トレイル
```

現在のアセット状況は VisualGallery `?scene=asset-status` で確認。
生成済み素材は `pnpm generate:pixel-assets` で `public/assets/sprites/...` に再書き出しできる。
Aseprite CLI の検出は `pnpm aseprite:check` で確認できる。未検出でも generated asset 生成は継続する。

---

## 7. 受け入れ基準

```txt
画像が無くても本編/ギャラリーが起動する（fallback）
画像を1個置くと、その要素だけ自動で画像へ切替わる
VisualGallery で 実素材/仮/欠品 が判別できる
manifest と実コード（createXView / weaponVisual）の対応漏れがテストで落ちる
generatedPixelAssets と manifest の path/size 不一致がテスト/verifyで落ちる
ネオン/魔法陣/ビーム/ギラ星を増やさない
```

仕様の正本: [visual-asset-manifest.md](visual-asset-manifest.md) / [generated-pixel-assets.md](generated-pixel-assets.md) / `src/game/assets/assetManifest.ts`。
