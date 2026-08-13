# ヨルノシルベ — Core5 Identity Geometry Master v1

Date: 2026-08-13  
Status: **CURRENT VISUAL PRODUCTION AUTHORITY / CORE5 FACE-BODY-HAIR-CLOTHING GEOMETRY**

## Purpose

Core5 が画像生成時に「同じ美形base + 髪色/髪型差分」へ収束するのを防ぐ。

本 Master は新しい顔を発明しない。正本は `src/game/data/characterAppearanceGenerationContracts.ts`。そこにある faceShape / eyeShape / eyelid / brow / lashes / nose / mouth / surface identity / hair structure / body shape / clothing construction / nearest-face distinction / forbidden drift を画像生成用に明示的に束ねる。

`data/visual/core5-identity-geometry-master-v1.json` が machine-readable source。

## Non-negotiable

- same face base 禁止
- hair color / eye color を主な差別化にしない
- render style で face anatomy を変えない
- hero pose / glow / prop で弱い人物識別を隠さない
- body proportion を若い美形標準へ正規化しない
- body modification の candidate は candidate のまま。画像生成が確定させない

## Core5 recognition anchors

### Yui — `YUI-SOFT-DIMPLE`

- soft oval / rounded cheeks / non-pointed chin
- almond-round, almost-level eyes
- medium soft straight brow
- gently rounded nose tip
- bilateral smile dimples
- dark asymmetric hair
- hood + curved soft travel layers

Yui と Michiru の差は **soft oval / straight brow / neutral eye / no freckles / dimples**。

### Asa — `ASA-SHARP-UPTURN-ASYM`

- compact angular short face
- narrow horizontally long upturned fox-like eyes
- thin arched short-tail brows
- sparse sharp outer lashes
- flat cheek plane
- short choppy asymmetric bangs
- cropped asymmetric jacket / diagonal construction

Asa を round cat-eye / fluffy-lash / round-face へ戻さない。

### Nagi — `NAGI-FINE-HORIZONTAL`

- long slim oval / narrow cheek width
- fine horizontal slightly downcast eyes
- nearly monolid thin fold
- low dense straight brow
- clearest straight nose bridge among Core5
- heavy long downward hair mass
- closed collar / long vertical / box geometry

Nagi と Tomori を「細いクール顔」の共通baseへ統合しない。

### Michiru — `MICHIRU-CAT-GEJI-FRECKLE`

- short broad oval / active cheeks
- wide lively cat eyes
- thick natural bushy/gejibrow
- visible lower lashes
- rounded nose tip
- widest grin in Core5
- freckles / sun marks
- active tied hair / movement-friendly layers

Michiru は Asa の目を丸くしただけの顔ではない。

### Tomori — `TOMORI-HOODED-REPAIR`

- mature inverted-egg / visible cheekbone
- hooded half-lidded small-aperture eyes
- deep double covered by upper lid
- medium-high bridge / slightly longer nose tip
- fuller lower lip / dry smile
- repair/soot surface trace
- messy half-up / work clip
- repaired seams / diagonal patchwork / real tool access

Tomori は Nagi に工具とゴーグルを足した顔ではない。

## Generation gate

Core5 の resolved image prompt には対象キャラの geometry profile を本文で埋め込む。

生成前に:

1. face signature
2. face shape
3. eye / eyelid / brow / lash
4. nose / mouth
5. surface identity + candidate status
6. hair mass
7. body shape
8. clothing construction
9. nearest-face distinction
10. forbidden drift
11. neutral-pose recognition

を解決する。

**色・光・ポーズを外しても人物が別人として成立することがCharacter Master生成の前提。**
