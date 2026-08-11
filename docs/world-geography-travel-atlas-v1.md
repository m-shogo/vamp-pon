# ヨルノシルベ — Geography / Travel Atlas v1

Date: 2026-08-11  
Status: **P0 WORLD FOUNDATION / NIGHT GEOGRAPHY CANDIDATE / STAGE IDS PRESERVED**

> 目的: Stageを「雰囲気の違う20画面」で終わらせず、そこに人が暮らし、移動し、物が運ばれ、別時代の痕跡が重なる地理として扱う。

---

# 1. 地理を2枚持つ

ヨルノシルベでは地図を一枚へ統一しない。

## A. Reality Atlas

各人物の現実側。

- 同時代とは限らない。
- 同じ地域とも限らない。
- 正確な日本地図 / 市町村名はHuman decision前にLOCKしない。
- 時代の違う同じ場所である可能性も、別地域である可能性も残す。

## B. Night Atlas

Gameplay Stageが接続する夜側。

- 現実距離をそのまま再現しない。
- 「帰路」「記録」「忘れ物」「未完了」の強い場所が近接する候補。
- Stage ID / gameplay orderは地理的直線距離を意味しない。

---

# 2. Night geography core candidate

Status: `HIGH_VALUE_CANDIDATE`

> **夜では、現実に残った場所そのものではなく、その場所に残った“帰れなかったもの / 名前 / 記録 / 道 / 未完了”が接続点になる。**

そのため:

- 古い駅と新しい路地が徒歩数分に見える。
- 同じ建物の異なる時代断面が別Stageになる。
- 入口と出口の方角がReality Atlasと一致しない。
- 人によって「見覚えがあるのに違う」場所が存在する。

ただし夜の地理を作った主体は未確定。

---

# 3. Travel grammar

## 徒歩
Nightの基本移動。

理由:
- ランタン / 道 / 帰路という作品identityに合う。
- 人物同士の会話 / 休憩 / 寄り道を作れる。
- Stage間を巨大な乗り物設定で埋めなくてよい。

## 駅 / 改札
Thresholdとして強い。

- 現実の鉄道会社を直接再現しない。
- 駅は「夜の秘密基地」ではなく、生活の移動場所が境界として残ったもの。

## 手紙 / 配達route
物が人物より先に時代を渡る表現に使う。

## 地図
夜の地図は完全なGPSではない。

- 歩いた履歴
- 人の記憶
- 手描き補足
- 消えた道

が重要。

ミチルの役割を「正解座標を知るNavigation AI」にしない。

---

# 4. Stage20を地理的Clusterとして読む

既存Stage ID / gameplay roleを変えず、世界観上の読み方を付ける。

## Cluster A — 名前と街路

代表:
- `forgotten_street` — 忘れられた夜道
- `name_tag_alley` — 名札の路地

生活圏Candidate:
- 住宅 / 小商店 / 通学路 / 路地
- 遺失物 / 名札 / 郵便との接点

世界観:
- 夜の入口として最も「普通の街」に近い。
- 初見で異世界へ飛ばされた感より、**知っている街が少しだけ間違っている**感覚を狙う。

## Cluster B — 保存と記録

代表:
- `moon_box_library`
- `pressed_flower_archive`
- `white_bookmark_library`

生活圏Candidate:
- 図書 / 保管 / 地域資料 / 個人archive

注意:
- 3Stageを同一巨大図書館と自動確定しない。
- 別時代の似た「残す場所」が夜で重なる可能性を残す。

## Cluster C — 道と交通

代表:
- `return_map_crossing`
- `old_compass_station`
- `ticket_gate_station`

世界観:
- 帰るためのInfrastructure。
- 古い道 / 駅 / 改札が時代差の最重要visual evidenceになる。

## Cluster D — 手仕事と生活

代表:
- `repair_lamp_workshop`
- `half_candy_arcade`

世界観:
- 工房、駄菓子屋、古い看板など。
- Main Mysteryの解答より「昔ここで人が暮らしていた」を見せる。

## Cluster E — 学び / 遊び / 子どもの痕跡

代表:
- `chalk_classroom`
- `paper_cord_playground`

世界観:
- 子どもを怪異演出の道具だけにしない。
- 普通の授業、遊び、忘れ物、名前書きが先にある。

## Cluster F — 配達 / 観測

代表:
- `unposted_post_office`
- `paper_plane_window`

世界観:
- 「送った」「届いた」「見た」「見なかった」の情報差を地理で表現。

## Cluster G — 夢 / 水 /境界

代表:
- `dream_waterway`

Status:
- Night Layer固有性が強いCluster。
- 現実の具体水路と同一かは未LOCK。

Stage16–20は既存Production DBを上流とし、本Atlas側から名称 / gameplayを改変しない。今後、同様のCluster tagだけ付与する。

---

# 5. Reality-to-Night link type

各Stageは将来、以下から1つ以上を持つ。

- `DIRECT_PLACE_ECHO` — 現実の場所がかなりそのまま残る
- `MULTI_ERA_OVERLAY` — 同じ場所の複数時代が重なる
- `MOTIF_CONVERGENCE` — 別場所だが同じ用途 / 意味で接続
- `OBJECT_ANCHORED` — 特定Named Objectを軸に場所が形成
- `ROUTE_ANCHORED` — 道 / 移動履歴を軸に形成
- `UNKNOWN` — evidence不足

初期は`UNKNOWN`を恐れない。

---

# 6. Distance rules

Night内の距離はkmではなく3種類で管理する。

- `NEAR` — intermissionなしでも繋がる
- `TRAVEL` — 会話 / 休憩 / transit sceneを置ける
- `DISCONTINUOUS` — Gate / dawn /特殊接続が必要

これにより実在距離のretconを避ける。

---

# 7. Regional culture without premature prefecture lock

地域差を先に都道府県名で作らない。

使えるevidence:
- 駅舎material
- 屋根
- 雨 / 雪
- 海 / 山 / 水路
- 食文化
- 方言の強弱
- 祭り
- 郵便 / 交通方式
- 植物
- 家屋

まず`culture zone`として設計し、必要になった時だけ現実地理へ寄せる。

Working zones:

### COLD-ROUTE
雪 / 金属 / 厚い戸 / 灯りの反射。

### WATER-ROUTE
水路 / 橋 / 湿気 / 船や渡しの記憶。

### OLD-STATION
木 / 真鍮 / 紙切符 / 古看板。

### DENSE-ALLEY
路地 / 商店 / 名札 / 郵便 / 生活音。

### ARCHIVE-DISTRICT
図書 / 保管 / 学校 / 記録。

これらは国 / 県を意味しない。

---

# 8. Landmark rule

人気の出る世界には覚えられる場所が必要。

Title1で最低5つの「戦闘なしでも行きたい場所」を育てるCandidate:

1. **帰り灯のベンチ** — 誰かが必ず一度座る駅前ベンチ。
2. **保留棚** — 持ち主不明品を捨てずに置く棚。
3. **半分屋** — リツ周辺の半分にして分ける菓子文化の店Candidate。
4. **継火台** — トモリ系の修理跡が残る共同作業台Candidate。
5. **白栞机** — 読めない資料を「未分類」として残せる机。

固有名はHuman reviewで変更可。

---

# 9. Travel scene reservoir

Stage間に長いCutsceneを必須化しない。

短い生活scene:
- 地図を逆さに持つ
- 靴紐を結ぶ
- 自販機 / 茶屋 / 水筒
- 雨宿り
- ベンチで寝る
- 星獣が先へ走る
- 改札で切符が見つからない
- 誰かの荷物を自然に持つ

Relationship / Quiet episodeへ流用する。

---

# 10. Geography contradictions to avoid

- Stage順 = 現実上の隣接順、と決めつける。
- 全Stageを一つの巨大都市にする。
- 全人物が同じ駅を現実で使っていたことにする。
- 古い駅と現代施設の差を単なるTheme skinにする。
- 夜の地図を正確すぎる科学図にする。
- 地域差をキャラのステレオタイプに直結させる。

---

# 11. Production use

Character master / background master制作では各assetに:

- layer: Reality / Threshold / Night / Record
- era confidence
- culture zone
- material vocabulary
- weather
- travel evidence
- allowed signage style

を付ける。

これにより、生成画像が全部「同じ現代日本風ファンタジー夜景」になることを防ぐ。