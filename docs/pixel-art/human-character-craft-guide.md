# Human Character Pixel Art Craft Guide

Vamp Pon の人物ドット、特にユイを作るための制作ノウハウです。

## Core idea

人物ドットは `小さい絵` ではなく、`1px単位の設計` です。細部を足す前に、何を残し、何を捨てるかを決めます。

ユイで優先すること:

1. 1xで主人公と読める。
2. 4x/6xで見ても可愛い。
3. 暗背景で沈まない。
4. フード、顔、服、ランタンの比率が気持ちいい。
5. 別ポーズでも同じ人物に見える。

## 1. Silhouette first

色や目より先に、輪郭で成立させます。

52px master の目安:

| Part | Target | Notes |
| --- | ---: | --- |
| Hood | 40-45% height | 45%を超えるとキノコ化しやすい |
| Face | 20-25% height | 小さすぎると愛嬌が消える |
| Body | 25-30% height | 三角形だけにしない |
| Lantern | 8-12% width | 小さすぎると記号にならない |

42px gameplay は、52pxで決めた比率を簡略化して使います。

## 2. Face is the priority

人物の印象は顔で決まります。

ユイの顔で守ること:

- 目は点だけで終わらせない。
- 白いキャッチライトを入れる。
- 頬は1-2pxの暖色で控えめに示す。
- 口は大きくしない。
- 表情は `少し不安だけど優しい`。

## 3. Hair as clusters, not lines

髪は線ではなく、2-3個の色面と少数の束で見せます。

- 茶赤を固定する。
- 顔上部に2-3束だけ入れる。
- フード内側の影と混ざらない明度差を作る。
- 1xで髪と分かることを優先する。

## 4. Hood design

フードはユイの最大記号です。ただし大きすぎるとキノコ化します。

良いフード:

- 顔を囲む丸さがある。
- 上左に控えめなハイライトがある。
- 内側の影で顔が浮く。
- 外周outlineが強すぎない。
- 下側が服につながる。

## 5. Costume and lantern

服は三角形だけにしない。古紙色の服に厚み、裾、赤茶のヘムまたはしおり紐を入れます。

ランタンは小物ではなくユイの記号です。

- 腕と手につながっている。
- 取っ手とケージの形がある。
- 中に記憶の光がある。
- glowは控えめ。
- hitCoreと混ざらない位置にある。

## 6. Palette and clusters

色数を増やせば良くなるわけではありません。

- 主要部位は base / shadow / highlight の3段階を目安にする。
- 1pxノイズを散らさず、同じ色のまとまりで描く。
- 顔や服にディザを入れすぎない。
- outlineは真っ黒固定にしない。

Vamp Pon の基本色:

- Yui blue: フード。
- old-paper cream: 服。
- memory amber: ランタン。
- brown-red: 前髪、裾。
- soft cheek pink: 頬。
- ink-safe outline: 暗紫から濃紺。

## 7. AA and dithering

AAは自動ぼかしではなく、段差を馴染ませるために近い色を1px置く手作業です。

使ってよい場所:

- フード外周。
- 顔の輪郭。
- ランタンの丸み。

避ける場所:

- 目。
- 全体blur。
- 半透明edgeの乱用。

ディザは52px以下の人物ではノイズ化しやすいので、基本は使いすぎない。

## 8. Review views

必ず以下で確認します。

- 1x: gameplay readability。
- 4x: ドット配置の粗さ。
- 6x: キャラとしての可愛さ。
- dark background: 背景との分離。
- combat mock: hitCore / pickup / enemy / glow との誤認。

## Production gate

以下を満たすまで production に入れません。

- charm / appeal >= 4。
- mascot silhouette >= 4。
- merchandise potential >= 4。
- 1x readability >= 4。
- reference match >= 4。
- gameplay visibility >= 4。
- dark background separation >= 4。
- GUI手仕上げ済み。
- before/after比較あり。
- sourceからexport済み。

## Research notes

Lospecのtutorial indexでは、lines / colors / anti-aliasing / dithering / clusters / selective outlining / character / sprites / animation などがpixel art基礎トピックとして整理されています。一般的なpixel artの定義でも、少ない色数と意図的な1px配置が重要です。Asepriteはlayers / frames / palette / onion skin / CLI / Lua scriptingを備えますが、Luaは制作補助であって最終品質判断ではありません。
