# ユイ 32px 高密度化リデザイン（v3 prototype）

ユイは「32pxのまま、もっと可愛く・解像度高めに感じるドット絵」にしたい、という方針。
本ドキュメントは **prototype（比較案）** の記録であり、本番 `yui_idle` / `yui_move`（hand-final candidate）はまだ差し替えていない。

## 前提・制約（変更しない）

- サイズは **32px** を維持（36/40/48 比較には今回進まない）。
- `PLAYER_DEFAULTS.radius = 6` / `visualSize = 36` を変更しない。
- pickup `collectRadius` / `magnetRange` / `magnetSpeed` を変更しない。
- hp / moveSpeed / invulnSec を変更しない。
- 既存 `yui_idle` / `yui_move` hand-final candidate を上書きしない。`yui_hurt` / `yui_ultimate` も今回触らない。

## 参考画像から採用する要素

良い方向性として採用された参考画像（青フード・金の月リム・茶髪・大きめ顔・右手ランタン・古紙色ワンピ）から、次を採用:

- **丸くて大きめの青フード**（親しみやすいシルエット）。
- **金色の月リム / 三日月モチーフ**（フード上縁＝記号的なアクセント、夜背景からの分離）。
- **茶〜赤毛の前髪**（顔まわりの情報）。
- **大きめの顔**（頭身をデフォルメ寄りにして顔のピクセル配分を増やす）。
- **右手のランタン**（暖色の灯り。ただし中央 hitCore と混ざらない位置に置く）。
- **古紙色（クリーム）のワンピ**（藍紫の夜背景・金の欠片と分離）。

## 方針: 「そのまま縮小」ではなく「32px用に記号化」

参考画像を縮小すると 32px では潰れる。so 情報量を足すのではなく、**情報の優先順位を整理して記号化**する:

- 主要改善点は **顔 / フード / ランタン / 外周 / 色段数**。
- 顔は大きめにして、目（白ハイライト付き）・頬・前髪の3点で「可愛い」を成立させる。
- フードは丸シルエット＋上縁の金リム/三日月だけで記号化（模様は増やさない）。
- ランタンは cage 型で右手側に置き、中央の hitCore（金芯）と**形・位置で**区別する。
- 外周は selective な 1px ダーク outline で締め、**黒インク敵と外形が混ざらない**ようにする。
- 肌 / 髪 / フード / 服 / ランタンの**明暗段数を1〜2段だけ増やす**（解像度感の主因）。
- 必要最小限の 1px は使うが、輪郭はぼかさない。記号性を優先する。

## v3 prototype の作り方（再現手順）

- ソース: `assets/source/aseprite/player/prototypes/yui_idle_v3.aseprite`
- ビルド（from-scratch / 縮小ではない）:

  ```sh
  aseprite -b \
    --script-param out=assets/source/aseprite/player/prototypes/yui_idle_v3.aseprite \
    --script scripts/aseprite/build-yui-idle-v3-source.lua
  ```

- PNG export（prototype 専用、本番 export とは分離）:

  ```sh
  pnpm aseprite:export:proto
  # -> public/assets/sprites/player/prototypes/yui_idle_v3_32.png
  ```

- prototype は本番 `assetManifest` ではなく `src/game/assets/prototypeManifest.ts` で別管理。
  generate-pixel-assets / assets:verify の対象外。ギャラリー比較ページでのみ読み込む。

## 比較ページ

- URL: `/?scene=yui-redesign32`（VisualGallery の 8/8 ページ）
- 表示: 現行 `yui_idle`（hand-final candidate）と `yui_idle_v3_32` を
  - 1x（32px原寸）/ 4x + hitCore・debugHitCircle / 実背景上 + 近接（欠片・回復・カプセル・黒インク敵）
  で並置。
- 画面内の比較観点:
  - 顔が読めるか
  - かわいく見えるか
  - ランタンと hitCore が混ざらないか
  - 記憶の欠片（金の星）と誤認しないか
  - 32pxのまま情報量/解像度感が上がっているか
  - 黒インク敵の中で埋もれないか

## 現行案と v3案の違い（観測: ブラウザ比較ページ / 実機スマホは未確認）

- 顔: 現行は小さめ・目が控えめ → v3は顔を大きく取り、白ハイライト入りの大きめ目＋頬で可愛さが上がった。
- フード: 現行は紺の塊 → v3は丸い青フード＋上縁の金リム/三日月で記号的に可愛く、夜背景からも分離。
- ランタン: 現行は体の右やや内側で中央芯と近い → v3は cage 型を右手側にはっきり離し、hitCore と混ざりにくい。
- 色段数: v3でフード3段・髪3段・肌2段にして 32px でも解像度感が上がった。
- 外周: v3は selective 1px outline で締め、黒インク敵と外形が分離。

## まだ弱いところ（次の改善候補）

- 服（ワンピ）の情報が薄く、ベル型でやや単調。裾の襞や前掛けの記号をもう1段ほしい。
- 金の三日月リムが上部でやや目立ち、欠片（金の星）と色が近い。月は寒色寄りの縁にする等で差別化余地。
- 腕が省略され、ランタンが浮いて見える瞬間がある。袖口1pxの接続を検討。
- **実機スマホ 1x は未確認**。原寸での可読性は実機で要確認。

## 次の判断

- まず `/?scene=yui-redesign32` と実機で v3 を確認し、方向性が良ければ v3 を磨いて本番 `yui_idle` 差し替え候補にする（その際 move/hurt も同基準で更新）。
- 32px のままで「顔・ランタン・外周」の改善が頭打ちになったら、その時点で **36px 比較**へ進む（visualSize/collision は別途検討）。
- 現状はまだ prototype。本番採用はしていない。

## 追記: 32px だと小さく感じる → 42px前後の見た目サイズ比較へ

ユーザー確認で「32pxだとプレイヤーが小さい。42pxくらいに大きくしたい」という方針が出た。
v3 の**かわいい方向性は維持**しつつ、見た目サイズを 36 → 40/42/44 に上げた比較を別途用意した。

- 見た目だけ大きくし、**collision radius=6 / pickup / stats は変更しない**（東方方式を維持）。
- 詳細・比較導線・所感は [yui-42px-visual-size-test.md](yui-42px-visual-size-test.md)。
- 比較ページ: `/?scene=yui-redesign42`、実地確認: `/?scene=combat-mock&density=late&playerVisual=40|42|44`。
- 42px が良ければ `yui_idle_v4_42` を基準に idle→move→hurt→ultimate を作り直し、本番 `visualSize` を上げる。大きすぎれば 40px へ戻す。**42px 採用は未決定**。
