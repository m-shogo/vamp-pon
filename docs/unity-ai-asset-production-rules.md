# Unity AI Asset Production Rules

目的: Unity移行後の素材制作で、Codex / 画像生成AI / Asset Factory が迷わないように、Unity用素材の作り方・使い方・禁止事項を固定する。

---

## 結論

本番Unity用素材は、Web/Phaser用PNGの使い回し前提にしない。

ただし、U1〜U2では検証速度を優先し、既存素材をplaceholderとして最小限だけ使ってよい。

```txt
U1〜U2 = 既存素材を仮置きしてUnity検証
U3以降 = Unity用素材仕様を確定
本番 = Unity用に作り直したapproved素材を使う
```

---

## Core Rule

```txt
設計・世界観・シルエット・色・名前・設定は流用する。
ファイルとしての本番runtime素材はUnity用に作り直す。
```

AI生成素材は、そのまま完成品として扱わない。

```txt
AI生成 = Unity用素材マスター候補
QA通過 = approved runtime asset
QA未通過 = reference / rejected
```

---

## What can be reused

Unity本番へ引き継いでよいもの:

- 世界観
- キャラ設定
- enemy canon
- item canon
- stage canon
- 色方針
- シルエット方針
- UI方向性
- 画面構成の学び
- generated reference image as reference only

Unity本番でそのまま使わないもの:

- Web用の古いruntime sprite
- `public/assets/sprites/`
- 文字入り画像
- 完成画面スクショ
- design target画像そのもの
- サイズや余白がバラバラの仮素材
- 白フリンジが出るPNG
- AI感が強い1枚絵

---

## U1 / U2 exception

U1〜U2だけは、次の目的で既存素材を仮置きしてよい。

- 390x844検証
- Safe Area検証
- lantern glow検証
- EXP吸引検証
- 敵/プレイヤーの画面内サイズ確認
- repo / import / .meta / Git管理の確認

この段階の素材は本番採用とみなさない。

---

## AI generation use cases

Codex / 画像生成AIに作らせてよい素材:

### Character

- Unity用キャラsprite原案
- idle / walk / hit / special poseの原案
- 黒耀化差分
- cutin元絵
- silhouette variation

### Enemy

- Ombu / Omburo sample
- enemy family variation
- mid boss / boss concept
- shadow flame variation
- ink body variation

### VFX

- ink splash texture
- ink smoke blob
- hit spark
- lantern halo
- collect burst
- EXP sparkle
- black edge pulse texture

### UI

- paper frame piece
- paper button piece
- icon frame
- level up card frame
- reward plate
- gauge frame
- wax seal / stamp piece

### Icon

- weapon icon
- passive icon
- rare item icon
- drop item icon

### Background

- background parts
- paper texture
- night map fragment
- street silhouette layer
- memory fragment layer

---

## AI generation forbidden patterns

AIに作らせても、runtimeへそのまま入れないもの:

- 文字入りUI画像
- 完成画面スクショ
- full screen UI mock as runtime asset
- 4K concept art
- 背景つき単体sprite
- 白背景つき素材
- 市松模様つき素材
- ロゴ入り素材
- 謎の記号や疑似文字入り素材
- 余白ゼロで端に接触するsprite
- 顔や手の破綻が強いキャラ素材
- 他作品に寄りすぎた素材

---

## Unity runtime asset requirements

Unity本番候補の素材は、原則として次を満たす。

```txt
背景: 透明 or 明確な背景layer
文字: なし
ロゴ: なし
白フチ: なし
余白: 四辺に安全余白あり
向き: 指定どおり
解像度: 用途別に固定
色: Vamp Pon canon準拠
UI: 部品化前提
```

---

## Initial size guide

最終値はU2/U3で調整するが、生成開始時の目安は以下。

| Asset | Initial generation size | Notes |
| --- | --- | --- |
| Character frame master | 180x180 or 256x256 transparent | Unity表示サイズで調整 |
| Enemy frame master | 180x180 or 256x256 transparent | 端接触禁止 |
| Item / icon master | 256x256 transparent | 64px表示でも読める形 |
| UI frame piece | 512x512 or 1024x512 transparent | 9-slice想定 |
| VFX texture | 256x256 or 512x512 transparent | particle/material想定 |
| Cutin source | 1440x360 transparent | 文字なし |
| Background layer | 1536x2048 or larger | layer分け優先 |

---

## Naming rule

候補素材:

```txt
unity_candidate_<category>_<id>_v001.png
```

approved素材:

```txt
unity_approved_<category>_<id>_v001.png
```

rejected素材:

```txt
unity_rejected_<category>_<id>_v001.png
```

Example:

```txt
unity_candidate_enemy_ombu_small_v001.png
unity_approved_vfx_lantern_halo_v001.png
unity_candidate_ui_paper_card_frame_v001.png
```

---

## Folder rule

U1ではUnity project内に大量投入しない。

作業候補はdocsまたはasset-factory側で管理し、approvedだけUnityへコピーする。

Suggested staging:

```txt
docs/design-targets/generated/              = reference / review only
tools/asset-factory/                        = production metadata / prompt / QA records
public/assets/prototypes/                   = Web/prototype reference
unity/VampPonUnity/Assets/_Project/Art/     = approved Unity runtime subset only
```

Unity runtimeに入れるのは、approvedかつU1/U2で必要な最小素材だけ。

---

## Prompt requirements

AI生成promptには必ず入れる。

```txt
Unity mobile game runtime asset
transparent background when applicable
no text
no logo
no watermark
no border
no checkerboard
no white background
no white fringe
centered
safe margin
readable at small size
Vamp Pon style: night, memory, forgotten things, black ink, small warm light, paper storybook pixel flavor
not horror, not glossy plastic, not realistic human
```

用途別に追加する。

Character:

```txt
front/3/4 view as specified, simple silhouette, readable at mobile battle size, no over-detailing
```

Enemy:

```txt
soft black ink shadow, readable silhouette, not too scary, no mouth unless specified, no arms unless specified
```

UI:

```txt
separate reusable UI part, no baked text, paper texture, 9-slice friendly, clean edges
```

VFX:

```txt
particle texture source, transparent alpha, soft edge, no background, designed for additive or alpha blending
```

---

## QA before Unity import

素材をUnityへ入れる前に確認する。

- [ ] 透明が綺麗
- [ ] 白フリンジなし
- [ ] 文字なし
- [ ] ロゴなし
- [ ] 端接触なし
- [ ] 390x844で読める
- [ ] 小さくしても潰れない
- [ ] 背景と同化しない
- [ ] AI感が強すぎない
- [ ] canonとズレていない
- [ ] 用途別サイズに合っている
- [ ] Unity import設定が想定できる

---

## Unity import QA

Unityへ入れた後に確認する。

- [ ] PPUでサイズが破綻しない
- [ ] pivotが扱いやすい
- [ ] sorting layerで破綻しない
- [ ] Light2D / particle / materialと相性がよい
- [ ] UIの場合、Canvas上でぼやけない
- [ ] sprite atlas化しても問題ない
- [ ] alpha edgeが汚くない

---

## Priority

最初にAI生成で作るべきもの:

1. EXP fragment
2. lantern halo / glow texture
3. Ombu Unity sample
4. ink burst texture
5. paper UI card frame
6. black edge pulse texture
7. Yui Unity sprite candidate

理由:

- U1/U2/U3の比較に直結する
- Unityの優位性を見やすい
- 作り直しコストが低い
- 早く失敗に気づける

---

## Final rule

Unity本番素材はAIで作ってよい。

ただし、Codex / 画像生成AIは素材の量産係ではなく、Unity runtime asset候補を作る工房として扱う。

```txt
prompt -> candidate -> QA -> approved -> Unity import -> in-game QA -> keep or regenerate
```

この流れを守る。
