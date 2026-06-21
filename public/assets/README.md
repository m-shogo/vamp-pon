# Runtime asset sources

Vite が配信する画像アセットの案内。

## 現在の参照元

- `public/assets/prototypes/backgrounds/` — Stage背景（manifest.json でruntime有効）
- `public/assets/prototypes/sprite-sheets/core5-original/` — Core5 48セルシート（1440x1080）
- `public/assets/prototypes/sprite-sheets/core5-original-frames/` — Core5 個別フレーム（180x180 x 240枚）
- `public/assets/prototypes/sprite-sheets/yui-expression-rage-original/` — ユイ表情・暴走48セルシート
- `public/assets/prototypes/sprite-sheets/yui-expression-rage-original-frames/` — ユイ表情・暴走個別フレーム
- `public/assets/prototypes/sprite-sheets/enemies-original/` — 敵48体シート（左右）+ 個別フレーム
- `public/assets/prototypes/sprite-sheets/weapon/` — 武器アイコン（180x180 x 15枚）
- `public/assets/prototypes/sprite-sheets/passive/` — パッシブアイテムアイコン（180x180 x 8枚）
- `public/assets/prototypes/sprite-sheets/rare/` — レアアイテムアイコン（180x180 x 4枚）
- `public/assets/prototypes/cutins/yui/` — ユイ横長カットイン（予定、現在空）

`public/assets/sprites/` は古い生成素材の置き場だったため廃止した。再作成しない。

画像がない小物、弾、UIはコード側の Graphics fallback で動作する。キャラクター画像を依頼するときは `docs/153-character-visual-reference-policy.md` に従い、キャラクターマスターと現在の `core5-original` シートを両方、実画像として渡す。

## 画像追加時の置き場所ルール

| 種類 | 置き場所 |
|---|---|
| デザイン参考・正本 | `assets/reference/` 配下 |
| キャラクターマスター | `assets/reference/character-master/core5/` |
| ユイ参考画像 | `assets/reference/player/yui/` |
| コンセプト・検討用 | `assets/concept-design/` |
| Aseprite編集元 | `assets/source/` |
| runtime prototype画像 | `public/assets/prototypes/` 配下 |
| 一時受け渡し | `assets/import-staging/`（正式配置後に削除） |
