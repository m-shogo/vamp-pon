# Human and Small Character Pixel Art Craft Guide

Vamp Pon の人物・小型キャラ・敵・小物を作るための汎用制作ノウハウです。

## Core idea

ドット絵は `小さい絵` ではなく、`1px単位の設計` です。細部を足す前に、何を残し、何を捨てるかを決めます。

全素材で優先すること:

1. 1xで用途が読める。
2. 4x/6xで見ても形が気持ちいい。
3. 暗背景や派手な戦闘中でも沈まない。
4. シルエット、明度、色相で役割が分かれる。
5. 同じ世界観の素材に見える。

## 1. Silhouette first

色や目より先に、黒塗りの輪郭で成立させます。

よいシルエット:

- キャラ、敵、pickup、UIアイコンの役割が黒塗りでも分かる。
- 大きい塊と小さい突起の比率が明確。
- 左右対称すぎず、少しだけ個性がある。
- 画面縮小時にも輪郭が潰れない。

小型キャラの目安:

| Part | Target | Notes |
| --- | ---: | --- |
| Head / main mass | 35-45% height | 大きすぎると塊になる |
| Face / focal area | 18-25% height | 小さすぎると感情が消える |
| Body / support mass | 25-35% height | 三角形や棒だけにしない |
| Prop / accent | 8-15% width | 小さすぎると記号にならない |

## 2. Focal point

小さいドットには、必ず見る場所を1つ決めます。

- 人物: 顔、目、前髪、手持ち小物。
- 敵: 目、口、角、手、影の穴。
- pickup: 光の中心、形の欠け、縁。
- UI: アイコンの中心記号。
- 背景: 焦点を作りすぎない。主役より弱くする。

1素材に焦点を2つ以上作りすぎると、1xで濁ります。

## 3. Clusters, not noise

ドットは孤立点を散らすより、同じ色のまとまりで描きます。

良いcluster:

- 2-6px程度のまとまりで面を作る。
- 影と明るい面がはっきり分かれる。
- 1pxの点は、目、ハイライト、小さい金具など重要箇所だけに使う。

避けるもの:

- 顔や服にランダムな1pxノイズ。
- 小さい素材への過剰なディザ。
- 色が近すぎて境界が読めない面。

## 4. Limited palette and value separation

色数を増やせば良くなるわけではありません。
部位ごとに base / shadow / highlight の3段階を基本にします。

Vamp Pon の方向性:

- night blue-gray: 夜、影、背景。
- old-paper cream: 紙、服、UI。
- memory amber: 光、ランタン、重要pickup。
- ink purple / deep navy: 黒インク、outline。
- restrained red-brown: 髪、紐、ヘム、古い印刷色。

重要なのは色名より明度差です。
暗背景上で、主役・敵・pickup・UIがそれぞれ分離することを優先します。

## 5. Manual AA, not blur

AAは自動ぼかしではありません。
段差を馴染ませるために、近い色を1pxだけ置く手作業です。

使ってよい場所:

- 丸いフードや顔の外周。
- ランタン、pickup、UIアイコンの曲線。
- 大きめの敵の輪郭。

避ける場所:

- 小さい目。
- 全体blur。
- 半透明edgeの乱用。
- 1xで消える細部。

## 6. Dithering is optional

ディザは大きな面の階調やレトロ感には使えます。
ただし、小さい人物やpickupではノイズ化しやすいです。

Vamp Ponでの扱い:

- player face: 基本使わない。
- small enemy: 基本使わない。
- pickup: 光が濁るなら使わない。
- background tile: 控えめなら使用可。
- large shadow/effect: 目的が明確なら使用可。

## 7. Props and accents

小物やアクセントは、そのキャラや敵の記号になります。
ただし、ゲーム上のhit markerやpickupと混ざってはいけません。

良い小物:

- 本体に接続している。
- 形が1xで分かる。
- glowが強すぎない。
- 本体のシルエットを補強する。

悪い小物:

- 浮いている。
- 黄色や赤の丸だけ。
- 当たり判定やpickupに見える。
- 本体より目立ちすぎる。

## 8. Background and gameplay readability

背景は美術作品ではなく、ゲームプレイの床です。

背景で守ること:

- 低コントラスト。
- 主役より暗く・弱く。
- tile境界が見えすぎない。
- pickupや敵の色と競合しない。
- 紙、地図、夜、忘れ物の質感は控えめに入れる。

## 9. Review views

必ず以下で確認します。

- 1x: gameplay readability。
- 4x: ドット配置の粗さ。
- 6x: キャラやアイコンとしての魅力。
- dark background: 背景との分離。
- combat mock: hitCore / pickup / enemy / glow との誤認。

## 10. Generic production gate

以下を満たすまで production に入れません。

- 1x readability >= 4。
- role clarity >= 4。
- visual appeal >= 4。
- background separation >= 4。
- style consistency >= 4。
- before/after比較あり。
- sourceからexport済み。
- script-onlyではない。

人物・主役級キャラの場合は、さらに以下も必須です。

- charm / appeal >= 4。
- mascot silhouette >= 4。
- 4x/6xで見ても可愛い。

## Research notes

Lospecのtutorial indexでは、lines / colors / anti-aliasing / dithering / clusters / selective outlining / character / sprites / animation などがpixel art基礎トピックとして整理されています。一般的なpixel artの定義でも、少ない色数と意図的な1px配置が重要です。Asepriteはlayers / frames / palette / onion skin / CLI / Lua scriptingを備えますが、Luaは制作補助であって最終品質判断ではありません。
