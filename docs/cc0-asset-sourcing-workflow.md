# CC0 Asset Sourcing Workflow

CC0素材を Vamp Pon の raw material として使うための運用。

---

## 1. 原則

CC0素材は使ってよい。
ただし、raw素材をそのまま完成素材にしない。

CC0素材は以下の用途に向いている。

- 背景tile
- props
- UI parts
- pickups
- enemy silhouette reference
- effect masks

ユイ本体や主要キャラの完成素材には使わない。

---

## 2. 推奨source

### Preferred

- Kenney: broad CC0 game asset packs
- OpenGameArt: CC0のみ。asset page単位でlicense確認
- itch.io: asset pageに明確にCC0と書かれている場合のみ

### Not allowed by default

- license不明
- CC-BY / CC-BY-SA / GPL / custom license
- non-commercial only
- no-derivatives
- AI生成素材で権利表記が曖昧なもの

CC0以外を使いたい場合は、先に明示承認を取る。

---

## 3. 保存場所

```txt
assets/vendor/cc0/
  <source>/<pack-or-asset>/

assets/derived/cc0/
  <source>/<pack-or-asset>/
```

- `vendor`: ダウンロードしたraw素材
- `derived`: Vamp Pon用に加工した素材

---

## 4. 必須記録

素材を入れるたびに `data/asset-licenses.json` と `docs/third-party-assets.md` を更新する。

記録項目:

- asset_id
- source_name
- source_url
- author
- license
- downloaded_at
- original_files
- vendor_path
- derived_files
- used_for
- notes

---

## 5. 加工フロー

```txt
CC0素材を探す
↓
licenseをasset pageで確認する
↓
manifestへ記録する
↓
rawをassets/vendor/cc0へ置く
↓
Vamp Pon paletteへ寄せる
↓
assets/derived/cc0へ保存する
↓
Asepriteで手仕上げする
↓
quality gateを通す
```

---

## 6. Palette adaptation

加工時に以下を確認する。

- 背景は低コントラストにする
- player / enemy / pickup は背景から分離させる
- 暖色ライトを使いすぎない
- 黒インクと夜背景が混ざらないようにする
- 1xで形が読めるようにする

---

## 7. 採用判定

CC0由来でも final-candidate の条件は同じ。

- Aseprite sourceがある
- Asepriteで手仕上げしている
- 1x / 4x / dark background / combat mockで確認済み
- quality gateで3以下がない

---

## 8. Codex / Claude prompt header

```txt
Use only CC0 assets unless explicitly approved.
Record source URL, author, license, downloaded_at, original files, vendor path, derived files, and used_for.
Downloaded assets are raw vendor assets, not final game art.
Derived assets must be recolored to Vamp Pon palette and hand-finished in Aseprite.
Final-candidate still requires the Aseprite hand-finish workflow and quality gate.
```
