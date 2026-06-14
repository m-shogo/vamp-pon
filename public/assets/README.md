# public/assets

Phaser から読み込む **ランタイム画像アセット**の置き場。
Vite は `public/` をルート（`/`）として配信するため、Phaser からは `assets/...` で参照する。

```txt
public/assets/
  sprites/
    player/      ユイ
    enemies/     敵（インク影 / 紙くず / 標識 / もや / エリート）
    pickups/     記憶の欠片 / 回復 / カプセル / レアアイテム
    weapons/     通常武器の弾・範囲タイル
    evolved/     強化進化 / 合体 / 覚醒 の弾・範囲
    ui/          カード紙素材・UIアイコン
    tiles/       背景タイル
  palettes/      パレット（.gpl / .png 等）
  atlases/       スプライトシート / TexturePacker JSON
  placeholders/  暫定素材
```

## ルール

- 必要素材の一覧・サイズ・用途は **コードの正本** `src/game/assets/assetManifest.ts`。
- 命名は manifest の `id` と対応させる（例 `yui_idle` → `assets/sprites/player/yui_idle_32.png`）。
- **画像が無い間は Phaser Graphics の fallback で動く**（壊れない）。
- 作り方・優先順位は [docs/art-pipeline.md](../../docs/art-pipeline.md)。
- サイズ規定は [docs/sprite-size-guide.md](../../docs/sprite-size-guide.md)。
- 生成/制作プロンプトは [docs/pixel-art-generation-prompts.md](../../docs/pixel-art-generation-prompts.md)。

## 参考画像（コンセプト）の場所

コンセプト/参考画像は配信不要なため `assets/concept-design/`（リポジトリ直下、`public` の外）に置く。
一覧は [docs/visual-reference-inventory.md](../../docs/visual-reference-inventory.md)。
