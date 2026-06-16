# ユイ 52px Aseprite GUI ハンドオフ

この文書は、**Aseprite GUI で実際に手を動かす人/エージェント** 向けの作業指示。

目的は、c10e6c0 のような「Lua bootstrap を手仕上げと偽って production 化」を二度と繰り返さないこと。
**script 生成だけで完成にしない。GUI で1px単位の手仕上げを行う。**

前提として読む:
- [yui-52px-master-design.md](yui-52px-master-design.md)（IP核・比率・色・NG）
- [yui-merchandise-character-checklist.md](yui-merchandise-character-checklist.md)（IP採点）
- [../reviews/yui-next-production-readiness-plan.md](../reviews/yui-next-production-readiness-plan.md)（production条件）

---

## 0. 絶対ルール

- production は触らない（`assets/source/aseprite/player/yui_idle.aseprite` / `public/assets/sprites/player/yui_idle_42.png`）。
- 作業は prototype / draft 配下に保存する（例: `assets/source/aseprite/player/prototypes/yui_idle_52_draft.aseprite`）。
- **charm/appeal が 4 未満なら、保存はしても production化しない。**
- script は補助（canvas/palette/layer/rough/export）まで。顔・束・厚み・ランタンの魅力・最終判断は GUI 手作業で行う。
- `final-candidate` / `hand-final candidate` と呼ぶのは readiness ゲート通過後だけ。

---

## 1. キャンバス

- サイズ: **52 x 52px**
- カラーモード: RGB
- 背景: 透明
- パレット: [yui-52px-master-design.md](yui-52px-master-design.md) §4 の Yui固定色を最初に palette に登録しておく。

---

## 2. 推奨レイヤー（下から上）

```txt
shadow      … 接地影（半透明、輪郭なし）
boots       … 脚・靴
dress       … ワンピース/エプロン/襟/裾/しおり紐
cloak       … 肩〜側面のドレープ（dressの後ろ・hoodの下）
hood        … 青フード本体＋内側ライニング影
face        … 肌・頬の下地
hair        … 前髪・サイドの髪
eyes        … 目・眉・口（表情）
cheeks      … 頬の赤み（faceの上、必要なら独立調整用）
lantern     … 右腕/手/取っ手/ケージ/暖色/記憶の光
outline     … ink-safe outline（純黒NG）
glow        … ランタン暖色のにじみ（半透明、最前面）
```

> レイヤーを分けるのは、後から表情・ランタン・フードを個別に手直しできるようにするため。

---

## 3. 作業順（重要：シルエット→顔→ランタン→服と陰影）

### Step 1. シルエットを作る
- まず黒1色で **フード/顔/体/ランタン** のシルエットだけを置く。
- ここで §3 比率（フード40〜45% / 顔20〜25% / 体25〜30% / ランタン8〜12%）を満たす。
- **この時点で「黒塗りでもユイと分かるか」をチェック**（checklist #1）。ダメなら先に進まない。
- キノコ化していたらここで直す。先で直すのは手遅れ。

### Step 2. 顔
- face 下地 → hair（前髪の束）→ eyes（目・キャッチライト・眉・口）→ cheeks。
- **顔だけで可愛いか、1xと4xの両方で確認**（checklist #2,#3,#5）。
- 目が点・無表情なら止まる。

### Step 3. ランタン
- 右腕→手→取っ手→ケージ→暖色→記憶の光スパークの順に、必ずつなげて描く。
- **ランタンが浮いていないか、記号として効くか確認**（checklist #4、design NG「ランタンが浮く」）。
- 中央 `hitCore` 帯と縦で重ねない。

### Step 4. 服と陰影
- cloak のドレープ → dress の厚み・折り・裾・しおり紐 → 全体の柔らかい陰影。
- フード内側ライニング影で顔に奥行きを出す。
- **服が三角形になっていないか、脚・靴が見えるか確認**（design NG「服が三角形」）。

### 各Stepで毎回:
- 1x実寸 / 4x拡大 / 暗背景 の3つで確認する。
- 1xで読めても拡大で可愛くなければ直す（逆も同様）。

---

## 4. 1px単位で調整する具体箇所

| 箇所 | 何を調整するか | 合格の目安 |
| --- | --- | --- |
| 目の形 | 丸く大きく、左右対称に近づける。下まぶたの柔らかさ | 拡大で「可愛い」と言える |
| キャッチライト | 白を目の上部に1〜2px。左右で位置を揃える | 「光を見ている」生気が出る |
| 前髪の束 | strand tip を数本、明暗2〜3階調。べた塗りにしない | 楕円塗りに見えない |
| 頬 | 薄ピンクを目の下に左右。濃すぎない | ほんのり体温 |
| 口元 | 小さく柔らかく。少しだけ困り/優しさ | 無表情でない |
| フード内側の影 | 顔開口の縁に1px暗ライン | 顔に奥行き・フードが立体 |
| 服の折り | 縦の折り線を1〜2本、明暗で | のっぺり円錐にしない |
| 裾 | 赤裾band＋下端の暗み | 服に厚み・重さ |
| 靴 | 暗色ブーツ＋上端1pxハイライト | 「立っている子」になる |
| ランタンの取っ手 | 手→取っ手の接続を1pxずつ | 浮かない |
| ランタンのケージ | 枠を1px、縦バー1本 | 構造物に見える |
| ランタン内の記憶の光 | 暖色コア＋中心に1px spark | 「記憶の光」として読める |

---

## 5. export と確認

- export は source からのみ。public PNG を直接編集しない。
- prototype PNG（例 `public/assets/sprites/player/prototypes/yui_idle_52_draft.png`）として書き出す。
- 1x / 4x / 暗背景 / 既存42pxとの before-after を出す。
- IP採点は [yui-merchandise-character-checklist.md](yui-merchandise-character-checklist.md)。
- ゲーム品質ゲートは [../pixel-art-quality-gate.md](../pixel-art-quality-gate.md)。

---

## 6. やってはいけないこと（c10e6c0 の教訓）

- Lua/script で楕円・矩形を置いただけで「手仕上げ済み」と書かない。
- charm/appeal が 4 未満の素材を production source / production PNG に入れない。
- commit message と実態を食い違わせない（「手仕上げ」と書くなら本当に手仕上げする）。
- temporary / draft を final-candidate と呼ばない。
- readiness ゲート未達で production export しない。
