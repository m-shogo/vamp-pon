# Asset Sourcing Strategy

Vamp Pon の素材制作では、全部をゼロから作らない。
使えるものは使う。ただし、完成素材として雑に貼らない。

---

## 1. 基本方針

| source | role | final扱い |
| --- | --- | --- |
| CC0 assets | 背景・小物・UI・pickup・敵シルエットのraw素材 | そのままfinalにしない |
| AI image generation | reference / concept / variation | そのままfinalにしない |
| Aseprite | 実素材の手仕上げ / export | final候補の必須工程 |
| SVG | UI / 地図線 / 紙片 / アイコン / frame | 用途によってfinal可 |
| Shader / WebGL / Canvas effects | glow / ink / paper noise / ultimate演出 | 用途によってfinal可 |
| Python scripts | palette変換 / contact sheet / tile preview | 補助 |
| Blender / voxel | 小物や背景propsのreference | そのままfinalにしない |

---

## 2. 使うべきもの

### CC0素材

使う対象:

- 背景tileの土台
- 石畳
- 紙片
- 地図風パーツ
- 木箱
- 本
- ランプ
- UI枠
- pickup案
- 敵のシルエット案
- effect mask

使い方:

1. CC0か確認する
2. source URL と license を記録する
3. `assets/vendor/cc0/` に raw として置く
4. Vamp Pon palette に寄せる
5. `assets/derived/cc0/` に加工版を置く
6. Asepriteで手仕上げする
7. quality gateを通す

---

## 3. 使いすぎ注意

### ユイ本体

ユイはゲームの顔なので、CC0合成で作らない。
AI reference + Aseprite手仕上げを基本にする。

### 主要敵

敵の完成形も、CC0の直貼りではなく、シルエットや質感の参考として使う。
最終素材は black ink family に寄せて作り直す。

### 最終背景

CC0背景をそのまま貼らない。
低コントラスト・tile・視認性・紙/夜/地図の世界観へ寄せる。

---

## 4. 使える制作ルート

### Route A: Hero assets

対象:

- Yui
- major enemy
- ultimate effect core

流れ:

```txt
AI reference
↓
Aseprite hand-finish
↓
quality gate
```

### Route B: World assets

対象:

- background
- props
- pickups
- UI parts

流れ:

```txt
CC0 raw asset
↓
license manifest
↓
palette adaptation
↓
Aseprite cleanup
↓
quality gate
```

### Route C: Effects / UI

対象:

- glow
- ink edge
- map line
- card frame
- paper particle

流れ:

```txt
SVG / shader / Canvas / code
↓
visual mock
↓
gameplay readability check
```

---

## 5. Palette adaptation

CC0素材をそのまま使わない。
必ず Vamp Pon palette に寄せる。

優先する色味:

- night blue-gray
- old-paper cream
- sepia brown
- black ink purple
- restrained warm lantern yellow

背景は彩度とコントラストを下げる。
player / enemy / pickup は背景から分離させる。

---

## 6. 優先順位

1. 背景tileのraw素材探し
2. UI紙片 / card frame / map line素材探し
3. pickup小物素材探し
4. enemy silhouette参考探し
5. palette adapter / contact sheet作成
6. Aseprite手仕上げ

---

## 7. やらないこと

- CC0以外を勝手に使わない
- license不明素材をrepoに入れない
- asset pageのlicense確認なしで使わない
- raw vendor assetをfinal扱いしない
- AI画像を縮小してfinal扱いしない
- ユイ本体をCC0素材合成で作らない
