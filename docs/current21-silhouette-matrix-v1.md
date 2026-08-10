# ヨルノシルベ Current21 Silhouette Matrix v1

Date: 2026-08-10  
Status: **CURRENT VISUAL DIFFERENTIATION DIRECTION / RUNTIME UNCHANGED**

Production source:

- `src/game/data/current21SilhouetteMatrix.ts`
- `src/game/data/characterSilhouetteCanon.ts`
- `public/lorebook/data/current21-silhouette-matrix.v1.json`

## 目的

Current21を集合絵・portrait・季節絵・loading・cut-inへ量産した時、

> **同じ細身体型 + 同じ正面立ち + 髪と色だけ違う**

状態へ崩れるのを防ぐ。

全員へ新しい身長・体重を設定する資料ではない。

- 既にCurrent factがある体型 / 年齢 / accessoryは守る。
- 未LOCK人物は姿勢、衣服の面積、Named Objectの位置、重心、motionで差を作る。
- body measurementsを雰囲気だけでCanon化しない。

---

## 21 / 21 visual lane

| Character | Visual lane | 3秒の輪郭 |
| --- | --- | --- |
| ユイ | 主人公 / 拾い手 | 青フード + 前へ出るランタン |
| アサ | 行動派 / 名づけ | 名札 + 先に差し出す片腕 |
| ナギ | 静かな守り | 月箱 + 内側へ寄せる肘 |
| ミチル | 道読み | 斜め地図 + 歩き出した脚 |
| トモリ | repair | ゴーグル + 工具 + しゃがみ姿勢 |
| セン | 教える人 | チョーク線 + 少し長い上衣 |
| リツ | 分ける兄 | 飴缶 + 分ける両手 |
| コヨリ | 子ども | 低い目線 + 小さな名札 |
| ゲン | 渋い年長男性 | 古い帽子 + 外套 + コンパス |
| **ハナ** | **ぽっちゃり女性 / 年長女性** | **丸い胴・腕・頬 + 丸いショール** |
| ユウビ | 配達 / 時間差 | 斜め鞄 + 封筒 + 遅れる軌跡 |
| マドカ | 遠景観測 | 観測レンズ + 窓の縦線 |
| シロ | 丸メガネ / 未分類 | 白いしおり + 頁を読む前傾 |
| トバリ | 門番 | 直線外衣 + 改札鋏 + 境界線 |
| ネム | 夢見 | 長めの袖 + 水面頁 + 揺れる裾 |
| クロオリ | 預かり手 | 折り紙面 + 内側へ抱える腕 |
| **カナメ** | **ぽっちゃり男性 / 守り** | **広い肩 + 厚い柔らかな胴 + 腕帯** |
| カスミ | ぼかす守り | 半身 + 濃淡布 + 白灯 |
| トキ | 計測 | 細い縦線 + 夜定規 + 角度光 |
| ツムギ | 余白 | 糸巻き + 広い白面 + 未完成裾 |
| レン | reserve / 差分 | 丸メガネ + 片焦点レンズ |

---

## Hard anchors

次はmatrix以上に強いCurrent visual factを持つ。

- ハナ — plus-size older woman
- カナメ — plus-size young adult man
- ゲン — older man
- シロ — round glasses / page posture
- レン — round glasses / focal-lens differentiation / reserve
- トモリ — work goggles / repair posture

Hard source:

`src/game/data/characterSilhouetteCanon.ts`

Matrix側からこれらを弱めない。

---

## Generation rule

1 character promptでもensemble promptでも:

```txt
Character identity
+ Theme HEX
+ Star Beast
+ Named Object
+ silhouetteRead
+ posture
+ clothingShape
+ motionSignature
```

をセットで渡す。

禁止:

- `young anime character` だけでbody/poseをmodel defaultへ任せる
- 全員正面立ち
- 全員同じ肩幅 / 腰幅 / 頭身へ自動normalization
- Shadow全員を細い黒服へ揃える
- 女性全員をmodel proportionsへ揃える
- 男性全員をathletic proportionsへ揃える
- 子どもを成人bodyの縮小で作る
- 年長者を皺だけ追加した若者bodyとして作る

---

## Ensemble QA

390x844相当へ縮小して確認する。

- 顔を隠しても最低12/20以上をobject + posture + silhouetteで識別できることを初期目標とする。
- ハナ / カナメ / コヨリ / ゲンは特にbody / age / scale differenceを失わない。
- シロ / レンは丸メガネだけで同一人物に見えない。
- Core5は全員同じhero stanceにしない。
- Shadow5は全員同じvillain stanceにしない。

将来visual evidenceが揃ったら識別目標を20/20へ引き上げる。

---

## Runtime boundary

```txt
21/21 silhouette coverage
!= sprite replacement complete
!= hitbox change
!= movement balance change
!= final character art approval
```

既存runtimeを勝手に変更しない。

> **違いを設定表だけに置かず、遠目の輪郭・立ち方・物の持ち方に変換して初めてCharacter designと呼ぶ。**
