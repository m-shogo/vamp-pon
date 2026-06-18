# Runtime asset sources

Vite が配信する画像アセットの案内。

## 現在の参照元

- `public/assets/prototypes/backgrounds/`
- `public/assets/prototypes/sprite-sheets/core5-original/`
- `public/assets/prototypes/sprite-sheets/core5-original-frames/`
- `public/assets/prototypes/sprite-sheets/enemies-original/`
- `public/assets/prototypes/sprite-sheets/weapon/`
- `public/assets/prototypes/sprite-sheets/passive/`
- `public/assets/prototypes/sprite-sheets/rare/`

`public/assets/sprites/` は古い生成素材の置き場だったため廃止した。再作成しない。

画像がない小物、弾、UIはコード側の Graphics fallback で動作する。キャラクター画像を依頼するときは `docs/153-character-visual-reference-policy.md` に従い、キャラクターマスターと現在の `core5-original` シートを両方、実画像として渡す。
