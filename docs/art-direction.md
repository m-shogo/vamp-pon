# Vamp Pon Art Direction

この文書はVamp Ponのアート基準を固定するためのもの。
現在の目標は、既存の「仕様を満たす記号ドット」から、**soft painterly pixel art**へ寄せること。

---

## 1. 目指す画風

Vamp Ponのドット絵は以下を基準にする。

- soft painterly pixel art
- 1xで読める
- 高密度だが濁らない
- かわいいがゲーム中で見やすい
- 暗いが怖すぎない
- 夜 / 記憶 / 忘れ物 / 黒インク / 小さな光 / 朝の世界観に合う
- player、enemy、background、pickup、UIで同じ画風に見える

重要なのは、**小さいゲーム素材として成立すること**。4x拡大で良くても、1xで読めなければ失敗扱い。

---

## 2. 避ける画風

- 黒いだけの敵
- ベタ塗りの記号ドット
- Luaの楕円・矩形・領域塗りだけで完成扱いする素材
- 1枚絵としては綺麗だがゲーム背景として邪魔な背景
- AI生成画像をそのまま縮小しただけの素材
- アンチエイリアス的に濁った素材
- 情報量だけ増やして読みにくい素材
- poseごとに別人に見えるキャラ

---

## 3. プレイヤー基準（ユイ）

ユイはゲームの顔なので、最初に品質を上げる。

必須要素:

- 丸く大きい青フード
- 茶赤の前髪
- 大きめで可愛い顔
- 白ハイライト入りの目
- 生成り〜古紙色の服
- 服の厚み
- 小さい体つき
- 右手側ランタン
- ランタンは`hitCore`と混ざらない
- front / back / sideで同一人物性がある
- 柔らかい陰影
- 強すぎないアウトライン

ユイの採用条件:

- 1xで主人公に見える
- 顔が先に読める
- フードの丸みが読める
- 服の前身頃が読める
- ランタンが小物として読める
- 黒背景でも沈まない
- 敵、欠片、hitCoreと誤認しない

---

## 4. 敵基準

敵はblack-ink worldとして統一する。ただし黒いだけで終わらせない。

正本:

- `data/enemy-assets/enemy-48-sprite-sheet-cells.json`
- `data/enemy-assets/enemy-design-catalog.json`
- catalogの`designFiles`
- `docs/enemies/omb-ombro-selected-direction.md`
- `docs/enemies/enemy-48-sprite-sheet-plan.md`

### 共通family

| id | 方向性 | 役割 | 視認性の核 |
|---|---|---|---|
| `omb` | 柔らかい小型影 | 群れ・序盤基準 | インク芽 + 四角い古紙目 + 全身の暗い影炎 |
| `ombro` | 低く横長の成長影 | 中型圧力・近距離reach | 強い影炎 + 地面へ垂れる擬手 |

各Stageにはオンブ1、オンブロ1、Stage固有雑魚3、中ボス2を配置する。

### 共通ルール

- silhouetteで区別できる
- body ratioが敵ごとに違う
- eye/light placementが重複しすぎない
- signature partsで役割が読める
- playerと混ざらない
- 暗背景に沈みすぎない
- damaging actionにはtelegraphがある
- warm accentはplayer lantern、pickup、hit coreより小さく弱い
- boss formは同一個体性を維持し、palette-only swapにしない

### オンブ／オンブロ

オンブ:

- 柔らかい低い影体
- 頭頂部のインク芽
- 古紙色の四角目2つ
- 発光しない黒・濃紺・紫黒・青灰の影炎モヤ
- 口、眉、頬、服、手足なし

オンブロ:

- オンブより低く横長
- 目の間隔と接地面を広げる
- 影炎から左右へ擬手が伸びる
- 擬手は地面へ垂れ、攻撃時だけ先端が最大3つの鈍い房へ分かれる
- shoulder、elbow、palm、人間の指、爪、骨、筋肉なし

### 禁止

- `pon_shadow`
- `grown_pon_shadow`
- ポン影
- ふくらみポン影
- hard black circle + eyesだけ
- bright ordinary fire around Omb/Ombro
- player-like hood、clothing、hair、human hands
- generated 180px referenceの直接production利用

---

## 5. 背景基準

背景は美麗な1枚絵ではなく、ゲーム用tileとして作る。

必須:

- 低コントラスト
- 装飾控えめ
- キャラ、敵、弾、欠片を邪魔しない
- 夜街、紙、地図線、忘れ物を薄く入れる
- 32x32または64x64 tile基準
- repeating時に目立つ切れ目を作らない
- 暖色lightは控えめにし、pickupやhitCoreと競合しない

禁止:

- 明るすぎる床
- 模様が多すぎる床
- 目立つ紙片を大量に置くこと
- 敵や弾より目立つlight
- tileとして破綻する1枚絵構図

---

## 6. Pickup / UI 基準

### Pickup

- 1xで種類が分かる
- 背景に埋もれない
- player lanternやhitCoreと誤認しない
- 金色・暖色を使いすぎない
- 記憶の欠片は「光る紙片 / 小さな記憶」として統一する

### UI

- 読めることを最優先
- 紙 / しおり / 切符 / メモの世界観を使う
- プレイ中に視線を奪いすぎない
- 装飾より余白と情報整理を優先する

---

## 7. AI reference の扱い

AI生成画像は完成素材ではなくreference。

1. referenceで方向性を決める
2. 現状素材との差分を書く
3. Asepriteでcatalogのnative sizeへ落とす
4. 1x / 4x / 暗背景 / combat-mockで確認する
5. 品質ゲートを通ったものだけhand-final-candidateにする

禁止:

- AI画像をそのまま縮小して完成扱いする
- referenceに似ていないのに「準拠」と書く
- 微妙な素材をhand-finalと呼ぶ
