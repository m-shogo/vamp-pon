# Human Aseprite Guide: Yui 52px V2a GUI Hand-finish

date: 2026-06-15
status: **GUI手仕上げ未実施（AI/CLIでは実行不可）**。本書は人間がAsepriteで直すための実作業ガイド。

prev: [yui-52px-v2a-gui-handfinish-handoff.md](./yui-52px-v2a-gui-handfinish-handoff.md)
記入用: [yui-52px-v2a-before-after-template.md](./yui-52px-v2a-before-after-template.md)

---

## 0. なぜこのガイドだけなのか（重要）

**Aseprite CLI / Lua / script による生成・export は「Asepriteを使った」ではあっても「GUI手仕上げ」ではない。**
AI/CLIエージェントは Aseprite の GUI キャンバスに座って鉛筆ツールで1pxを彫る作業ができない。
ここで AI が GUI を自動クリックして「手仕上げ済み」と称するのは偽装であり禁止。

したがって今回は:

- 新しい `_hf` sprite / png は**作らない**
- Lua再生成も**しない**
- production も preview も**触らない**
- 代わりに、人間が Aseprite GUI で 10〜20分で直すための **1px単位の手順**だけを置く

このガイドに沿って人間が手作業し、[before/afterテンプレート](./yui-52px-v2a-before-after-template.md)に証跡を記入して初めて hand-finish 扱いになる。

---

## Score context（土台 V2a）

iteration history: A/B/C → v2（V2a採用）→ **本ガイド（人間GUI手仕上げ待ち）**

- Target score: **80 / 100**
- Current score: **V2a=80（prototype-pass / Lua bootstrap・GUI未仕上げ）**
- final自信: 3（GUI手仕上げ後に4以上を狙う）

### Missing points for 80（人間がGUIで埋める差分）

下の §3 の12項目（フード幅 / 冠部sheen / 指 / handle / 袖陰影 / 暖色リム / glow / 目の白 / 下まぶた / 前髪3房 / 首影 / 肩リム）。

### Keep

V2aの構造（腕＋手＋handleでランタン把持 / 首・襟・肩 / B顔 / tight glow / 中心離し / 1pxアウトライン / パレット）。

### Discard

V2bの最大フード幅 / V2cの硬い無表情 / 旧A/B/Cの浮くランタン・直付き・2pxアウトライン。

### Production touched

**no**。本ガイドは doc のみ。新規 sprite / png は作らない。source も production パスへ書かない。
review/handoff フェーズであり、production / preview へは接続しない。

---

## 1. 開く / 保存 / export（パスを固定）

| 操作 | パス |
| --- | --- |
| GUIで開く（土台） | `assets/source/prototypes/yui_idle_52_v2a.aseprite` |
| **名前を付けて保存**（複製先・ここを編集） | `assets/source/prototypes/yui_idle_52_v2a_hf.aseprite` |
| PNG export（手仕上げ後のみ） | `public/assets/prototypes/yui_idle_52_v2a_hf.png` |
| 確認シート（任意・手動配置でも可） | `public/assets/prototypes/yui_idle_52_v2a_hf_review_sheet.png` |

> 土台 `..._v2a.aseprite` 自体は上書きしない（複製してから編集）。
> `public/assets/sprites/player/` と `assets/source/aseprite/player/` には**絶対に保存/exportしない**。

Aseprite起動（Steam版の例）:

```
"/Users/m-shogo/Library/Application Support/Steam/steamapps/common/Aseprite/Aseprite.app/Contents/MacOS/aseprite"
```

または Aseprite を通常起動 → File > Open → 上記土台ファイル → File > Save As → `..._v2a_hf.aseprite`。

レイヤー構成（土台に既にある）: shadow / dress / arm / neck / hood / hair / face / eyes / cheeks / lantern / rim / outline / glow。
各修正は対応レイヤーを選んでから鉛筆（B）/ 消しゴム（E）/ 選択（M）で行う。

## 2. 作業前の表示設定

- View > Zoom 600%〜800%、かつ別ウィンドウで 100%（1x）プレビューを開く（View > New View）。
- グリッド: Edit > Preferences > Grid を 1px に。
- パレットは土台のものを使う（新色を足さない）。スポイト（I）で既存色を拾う。

---

## 3. 1px単位の手順（座標は52px原寸・左上(0,0)、x→右 / y→下）

参考: 下の §4 に V2a の実ピクセルマップ。座標はそのマップに対応。

### A. シルエットを先に確定

**A1. フード左右を各1px締める**（layer: hood, outline）
- 現状フードは y5〜y26 でほぼ最大幅（左アウトラインが x3〜x7、右が x44〜x46）。
- 各行で**最外周の青1列**を消し、アウトラインを1px内側へ描き直す。左は約 x8→x9、右は約 x43→x42 を狙う。
- y7〜y10 と y22〜y26 の張り出しを優先的に削る（ここが一番「広い」）。

**A2. 冠部ハイライトを3pxの塊に整理**（layer: hood）
- 現状、明るい青(top sheen)が y9〜y13 / x17〜x24 に**広がりすぎ**（約6×5）。
- これを **x19〜x21 / y10〜y11 の3〜4px**の自然な塊に縮小。周囲は中間青(HOOD_M)で埋める。
- 目的: 「布の被り」感。ドーム/帽子に見える広い明部を消す。

### B. 接地と「持っている」読み

**B1. 顎下に首影1px**（layer: neck or face, 色: SKIN_SH）
- 顎の下端 y29〜y30 / x22〜x26 に 暗い肌色1pxを横に引く。首が顔から分かれて見える。

**B2. 手に指2〜3本を彫る**（layer: arm/lantern, 色: SKIN_SH と outline）
- 手は x32〜x39 / y32〜y35 の肌の塊。handleは概ね x38〜x41 / y34〜y37。
- 手の中に**縦1pxの暗線を2本**（例 x35 と x37、y33〜y35）入れて指3本に割る。
- handle のすぐ下（x39〜x40 / y36）に握り影1pxを置き、指がhandleを巻く形にする。
- やりすぎ注意: 1xでノイズに見えたら1本に減らす。

**B3. 袖の上面に明部1px / 下面に影1px**（layer: arm, 色: DRESS_HI / DRESS_SH）
- 肩(おおよそ x30,y36)→手(x38,y33) のライン上、**上側の縁1px**に DRESS_HI、**下側の縁1px**に DRESS_SH。
- 腕が筒（立体）に見えるようにする。

### C. charmの核

**C1. 目の白を1px clean dotに整理**（layer: eyes, 色: EYE_W）
- 左目の主キャッチライトは現状 x17〜x18 / y20〜y21、右目は x28〜x29 / y20〜y21。
- 各目の主ハイライトを**1〜2pxのきれいな点**に置き換える（ぼやけた2×2をやめ、左上に1点）。
- charmのダブルキャッチは右下に**1px**だけ残す（右目 x30/y23 付近）。明るさは潰さない。

**C2. 下まぶた1px**（layer: eyes/face, 色: SKIN_SH）
- 各目の真下 y25、左 x16〜x19 / 右 x27〜x30 に暗い肌色1pxを引く。目の収まりが良くなる。

**C3. 前髪を3房に**（layer: hair, 色: HAIR_D / HAIR_M）
- 現状の前髪フリンジは y14〜y15 のほぼ一様な帯。
- **中央1房（x23〜x27）＋左房（x17〜x20）＋右房（x29〜x32）**に割れ目（HAIR_Dの暗線）を入れ、房の下端を少し尖らせる。

### D. 視認・分離の最終調整

**D1. ランタン光の暖色リムを袖・手に1pxだけ**（layer: arm or new 1px, 色: LAN_WARM）
- ランタンに面する側（手の右縁 x39 / y33〜y35、袖下面の手寄り）に**暖色1px**を点く。光源が当たって見える。1pxだけ。

**D2. glow最外周を1px落とす**（layer: glow）
- glowレイヤーを選び、外周の半透明リングを1px分**消しゴムで削る**。
- 目的: 近くの記憶の欠片（クール生成り）や中心hitCoreにglowが被らないことを確定。

**D3. 左肩/フード端のリムを控えめに整理**（layer: rim）
- 左上フード端の明るいリム(既存)が強すぎ/途切れていたら、**1px幅で滑らか**に整える。顔の上には乗せない。

---

## 4. V2a 実ピクセル参照マップ（read-only解析・編集禁止の参考）

`public/assets/prototypes/yui_idle_52_v2a.png`（52×52）を分類表示したもの。座標合わせ用。

```
   0         1         2         3         4         5
   0123456789012345678901234567890123456789012345678901
 0 ...............#####HHHHHHHHHhh#####................
 5 ........#Hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh#.........
10 ....#HhhhhhhhhhhhhHHHHHHHHhhhhhhhhhhhhhhhhhhhh#.....
13 ...#HhhhhhhhhhhhhhHHHHHHssshhhhhhhhhhhhhhhhhhhh#....
15 ...#Hhhhhhhhhhhhhhhksssssssssss?hhhhhhhhhhhhhhh#....
18 ...#Hhhhhhhhhhhh?ss##ssssssss###ss?hhhhhhhhhhhh#....
20 ...#Hhhhhhhhhhh??#WWkk#sssss#WWkk#??hhhhhhhhhhh#....
23 ....#Hhhhhhhhhh?s#k??kk#sss#kk?Wk#s?hhhhhhhhhh#.....
25 .....#Hhhhhhhhh?ccckkk#sssss#kkkccc?hhhhhhhhh#......
28 ............#Hh??ccsssss???ssssscc??h##.............
30 ...............#??sHsssssssssssss??#................
32 .................#??sssssssssss??#..##WWWs#.........
34 ...................###ssssss####.##ssssssss#........
36 ..................####ssssss####sss??????????.......
38 ................#??????????????????????LLLL??L......
40 ..............#????ssssssssssss????ss??LssL??LL.....
42 .............#???ssssssssssssssssssWss???????L......
44 ............#??????????????????????????????L........
46 ..........#??????????????????????????????#..........
47 ...........##############################...........
50 .....................##########.....................
```

legend: `H`大きい明青/`h`中青(hood) ・ `W`白/ハイライト ・ `L`ランタン暖色 ・ `s`肌/生成り ・ `k`茶赤髪 ・ `c`頬/口 ・ `#`アウトライン ・ `?`中間色(影/dress陰) ・ `.`透明

（全行は `node` での read-only 解析で再現可能。これはガイド用の参照であり、ここから画像を生成しない。）

---

## 5. 10〜20分の最小修正セット（時間がない時はこれだけ）

優先度順。これだけでも before(V2a) から見て改善が分かる:

1. **A2 冠部sheenを3px化**（mushroom感を一番下げる・約3分）
2. **B2 手に指1〜2本＋握り影**（「持っている」読みが激変・約4分）
3. **C1 目の白を1px clean dot**（1x可読＋charm・約3分）
4. **B1 首影1px**（直付き解消・約1分）
5. **D2 glow最外周1px削り**（欠片/hitCore非干渉の確定・約2分）

残り（A1/B3/C2/C3/D1/D3）は時間があれば。各段階で 1x を見て、潰れたら Undo。

## 6. 確認方法（手仕上げ後）

```sh
# 手仕上げPNGをprototype配下にexportしたら:
pnpm prototype:verify         # 成果物存在 + production未変更（※_hf追加なら検査リストに追記）
pnpm player:protected:verify  # production player資産/定数 非変更
pnpm design:review:verify     # review doc体裁
git diff --stat HEAD -- public/assets/sprites/player assets/source/aseprite/player src/game/domain/constants.ts
                              #   ↑ 空であること
```

1x / 6x / 夜背景 / 欠片近接 / hitCore中心 を [handoff §9](./yui-52px-v2a-gui-handfinish-handoff.md) のチェックリストで確認。
結果は [before/afterテンプレート](./yui-52px-v2a-before-after-template.md)を複製して記入。

## 7. Final decision（本ガイド時点）

- **GUI手仕上げ: 未実施（iterate）**。AI/CLIでは実行不可のため、人間がAsepriteで本ガイドに沿って実施する。
- V2a は依然 **prototype-pass**。production-candidate ではない。
- production-candidate は、人間のGUI手作業証跡あり / 80点以上 / final自信≥4 / mascot silhouette≥4 / merchandise potential≥4 / checks全通過の時のみ、別レビューで判断。
- 本ガイドの commit では production / preview に一切接続しない。
