# Forward Idea Board: Asset Production

ユーザーが聞く前に先回りして蓄積する、Vamp Pon向け素材制作アイディアボード。

ここは確定仕様ではなく、使えそうなネタを、破綻しにくい形で保存する場所。

## 1. Enemy Ideas Beyond Stage1

### Forgotten Object Enemies

| Enemy | Hook | Gameplay |
|---|---|---|
| 傘オンブ | 守ってほしかった傘 | 正面防御 |
| 鍵オンブ | 開かなかった鍵 | 溜め突進 |
| 片靴オンブ | 帰れなかった片方の靴 | ジグザグ |
| 手紙オンブ | 届かなかった手紙 | 紙片弾 |
| 鈴オンブ | 呼んでも返事がなかった鈴 | 仲間呼び |
| 時計オンブ | 止まった時間 | 鈍足ゾーン |
| 写真オンブ | 顔が消えた写真 | 近づくと分身 |
| しおりオンブ | 読み終わらなかった本 | 直線突進 |
| 折り紙オンブ | 折られた約束 | 斜め移動 |
| 切符オンブ | 使われなかった切符 | 画面端ワープ |

### Place-Based Enemies

| Enemy | Hook | Gameplay |
|---|---|---|
| 街灯オンブロ | 曲がった街灯 | 光の輪で道を塞ぐ |
| ベンチオンブ | 誰も座らないベンチ | 横長壁 |
| ブランコオンブ | 揺れ続ける影 | 円弧移動 |
| 窓オンブ | 開かない窓 | 一定距離射撃 |
| 標識オンブ | 間違った道しるべ | 方向転換ギミック |
| 水たまりオンブ | 映らない水面 | 鈍足 / 分裂 |
| 門札オンブ | 名前の消えた門 | 道塞ぎ |

### Emotion Enemies

| Enemy | Hook | Gameplay |
|---|---|---|
| さみしオンブ | ひとりになりたくない | 群れで寄る |
| まよいオンブ | 決められない | 左右に揺れる |
| いらだちオンブ | 近づくほど速い | 突進 |
| こわがりオンブ | 光から逃げる | 逃げ弾 |
| ねむりオンブ | 夜に沈む | 遅いが硬い |
| わすれオンブ | 何かを落とす | EXP遅延 |

## 2. Enemy Personality Rules

敵に1行の生態を必ず持たせる。

```txt
傘オンブは、誰かを雨から守りたかった記憶が黒く丸まったもの。
鍵オンブは、開けられなかった扉の前を何度も走り続ける。
手紙オンブは、宛先を忘れて紙片だけを飛ばす。
```

この1行が書けない敵は採用しない。

## 3. Stage Gimmick Ideas

### Stage1: 忘れ物の夜道

- 道端に落ちた小物が敵になる。
- クリア後、背景の黒インクが少し薄くなる。
- ボス撃破で傘が開き、朝の光を受ける。

### Stage2: 静かな水路

- 黒い水たまりがゆっくり広がる。
- 紙舟オンブが流れに乗る。
- EXPが水面で少し遅れて吸われる。

### Stage3: 紙片の塔

- 紙片が上から降る。
- 手紙オンブの弾が背景紙片に紛れるので、色で分ける。
- ボス撃破後にページがめくれる。

### Stage4: 黒墨の公園

- ブランコの影が円弧攻撃。
- ベンチが横長の壁敵。
- 鈴オンブが遠くから音で敵を呼ぶ。

### Stage5: 夜明けの門

- 時計オンブが時間を遅くする。
- 門札オンブが道を塞ぐ。
- 最後は黒インクではなく、朝色へ戻る。

## 4. Character Factory Ideas

### Shared Body Types

| Body | Use |
|---|---|
| small-traveler | ユイ系 / 初期主人公 |
| slim-runner | アサ系 / 速いキャラ |
| quiet-reader | ナギ系 / 遠距離 |
| heavy-carrier | ミチル / 防御寄り |
| lamp-keeper | トモリ / 支援寄り |

### Parts that Matter

- 髪型。
- 頭装備。
- 右手の持ち物。
- 左腰の小物。
- 光の種類。
- 黒曜化overlay。
- 接地影。

### Expression Set

```txt
normal
smile
angry
sad
surprised
hurt
kokuyou
relieved
```

### Pose Set

```txt
front
left
right
back
sit
walk_01
walk_02
walk_03
walk_04
hit
down
ultimate_ready
```

## 5. Weapon Ideas

| Weapon | Hook | Gameplay |
|---|---|---|
| 星鍵の束 | 星座の鍵が連鎖する | chain |
| しおり刃 | 戻ってくるしおり | boomerang |
| 消えかけマッチ | 近くで小さく弾ける | burst |
| 記憶の鈴 | 音で欠片を呼ぶ | pulse / pickup |
| 夜明け時計 | 周期的に敵を鈍らせる | slow pulse |
| 傘灯り | 前方を照らし防ぐ | cone / shield |
| 紙吹雪 | 小さな紙が散る | area scatter |
| 星図の鉛筆 | 線が星座になる | beam / line |

## 6. Passive / Rare Ideas

| Item | Hook | Effect |
|---|---|---|
| やわらかいマフラー | 痛みを少し吸う | damage reduce |
| 古い地図 | 遠回りでも多く拾う | reward up |
| インク止めの栓 | 黒曜化の反動を抑える | fatigue down |
| 未開封の手紙 | 次の選択まで我慢 | next rare up |
| 小さな傘 | 一度だけ守る | one shield |
| 片方の靴紐 | 速くなるが曲がりにくい | speed up / turn down |
| 夜明けの切符 | 一度だけ戻る | revive |

## 7. Background Ideas

背景は戦闘を邪魔しない。

### Common Layers

```txt
far: dark skyline / paper texture
mid: stage objects
near: subtle floor marks
combat: low contrast readable area
fx: ink / particles / dawn overlay
```

### Stage Object Motifs

| Stage | Objects |
|---|---|
| 夜道 | 街灯 / 傘 / 鍵 / 靴 / 標識 |
| 水路 | 橋 / 水面 / 紙舟 / 反射 |
| 紙片の塔 | 本棚 / 紙片 / しおり / 階段 |
| 公園 | ベンチ / ブランコ / 鈴 / 木影 |
| 門 | 時計 / 門札 / 星 / 朝焼け |

## 8. UI / Collection Ideas

### Enemy Collection

敵図鑑はモンスター図鑑ではなく、忘れ物帳。

```txt
名前
見た目
出会った場所
生態1行
落とした欠片
浄化後の小物
```

### Weapon Collection

武器図鑑は道具帳。

```txt
道具名
効果
進化先
相性のよいパッシブ
短い記憶文
```

## 9. Merch / IP Ideas

グッズ化しやすい条件。

- 丸い。
- 小物が1つ。
- 色数が少ない。
- 表情が強すぎない。
- 名前が短い。
- シリーズ化できる。

### Good Merch Candidates

```txt
オンブ
傘オンブ
鍵オンブ
紙舟オンブ
鈴オンブ
街灯オンブロ
ユイのランタン
黒インク小瓶
夜明けの切符
```

## 10. Production Warnings

- 素材案を増やすほど本体実装が遅れる。
- Stage1で使わない敵は、すぐ実装しない。
- Factoryはまず検査と出力を作る。
- 生成AIの結果をそのまま信用しない。
- 可愛いだけの敵にしない。
- 怖いだけの敵にしない。
- 世界観説明だけでゲーム性がない敵は後回し。

## 11. Next Best Actions

1. Stage1敵7体のIDと行動を固定する。
2. 武器5種 / パッシブ5種 / レア3種を固定する。
3. アイコンFactoryのv0を作る。
4. Enemy manifest形式をコード側と合わせる。
5. Stage1で敵行動の違いを実装する。
6. その後に画像量産へ進む。

## 12. Best Current Direction

今の最適解はこれ。

```txt
Stage1を面白くする
+ Asset Factoryで量産ルールを固める
+ Unityへ持っていけるmanifestを用意する
```

画像生成だけではなく、**ルール化・検査・出力**まで持つことで、素材が増えても破綻しない。