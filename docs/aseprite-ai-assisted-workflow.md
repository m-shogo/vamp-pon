# Aseprite AI-assisted workflow

Vamp Pon では、AIを完成ドットの生成者ではなく、**設計・比較・検査・量産補助**として使う。
最終sourceと最終判断は Aseprite 側に寄せる。

## Core model

```txt
AI / Claude / Codex
  = reference整理 / 形の批評 / NG検出 / 修正指示 / automation補助

Aseprite GUI
  = source of truth / layer管理 / 1px手仕上げ / palette判断 / final visual judgment

Aseprite CLI / Lua
  = template作成 / export / sprite sheet / GIF preview / contact sheet / dark preview

Game runtime
  = bob / glow / shadow / particles / squash / rotation などの演出
```

## Do not ask AI to finish the art

AIに直接任せてよいもの:

- referenceから残す要素と捨てる要素の整理
- silhouette案の比較
- 1xで読ませるための優先順位決め
- palette候補
- before/after critique
- NG pattern検出
- Aseprite layer構造の提案
- export / preview / sheet automationのscript作成

AIに任せないもの:

- final-candidate判断
- 顔の可愛さの最終判断
- 1px単位の目、髪、輪郭、小物の最終配置
- production PNG直接修正
- script出力だけのhand-final認定

## Recommended production path

### 1. Reference and critique

AIで参考画像や現状assetを見て、以下を言語化する。

- silhouette
- focal point
- cluster / noise
- palette / value separation
- outline
- props / effects
- 1x / 4x / dark background readability

この時点では画像をproductionに入れない。

### 2. Aseprite template

52pxまたは明示サイズのtemplateを作る。

Recommended layers:

```txt
notes
fx_glow
prop
face_detail
hair
head_or_main_mass
body_or_support_mass
boots_or_contact
outline
shadow
bg_check
```

playerなら `face_detail` や `prop` を丁寧にする。
enemyなら `eye_light` / `mouth` / `ink_body` などに置き換えてよい。
backgroundなら `bg_check` ではなく tile seam check を使う。

### 3. Aseprite GUI hand finish

Asepriteで必ず見るもの:

- 1x preview
- 4x or 6x zoom
- dark background layer
- actual gameplay background
- before/after comparison
- layer visibility toggle

### 4. CLI export and preview

Aseprite CLI / Lua は再現性のために使う。

- PNG export
- sprite sheet export
- GIF preview
- dark background preview
- contact sheet

CLI/Luaは便利だが、final visual qualityを判断しない。

### 5. Promotion gate

productionに入れる前に以下を満たす。

- source exists
- export command recorded
- before/after exists
- quality gate passed
- public PNG direct editなし
- gameplay constants untouched

## Good AI prompt shape

```txt
このspriteを完成品として描き直さず、Asepriteで直すための批評をしてください。
以下の観点で、1px単位の修正方針に落としてください。
- silhouette
- focal point
- cluster/noise
- palette/value separation
- outline
- prop/effect readability
- 1x / 4x / dark background
最後に production に入れてよいかを draft / remake / production-candidate で判定してください。
```

## Bad usage

- AI画像をそのまま縮小して完成扱い。
- AIに4方向sprite sheetを1発生成させて別人化を許す。
- Luaで楕円や矩形を置いただけでhand-final扱い。
- reportだけ立派でbefore/afterが弱い。
- 1x確認なし。
- dark background確認なし。

## Best current strategy for Yui-like player sprites

1. 52px masterを作る。
2. Asepriteで顔・髪・小物・輪郭を手仕上げする。
3. 1枚masterからruntime animationやsprite sheet previewを作る。
4. 必要になった時だけ hurt / ultimate / result 差分を追加する。

フルframe animationより、最初は `single high-quality master + runtime motion` が安定しやすい。
