# Yui Aseprite hand-final plan

`yui_idle` / `yui_move` / `yui_hurt` は **hand-final candidate**（`.aseprite` source あり / Aseprite export 済み）。
`yui_ultimate` はまだ `generated-draft`（source-missing）。

`yui_idle` を凍結した基準として、`yui_move`（移動差分）・`yui_hurt`（被弾差分）を同一人物・同一ライティングで作成済み。
残り `yui_ultimate` はまだ着手しない。

> 別線で「32pxのままもっと可愛く・高解像度感」リデザインの検討が進行中。
> 比較 prototype `yui_idle_v3_32` を追加（本番未差し替え）。詳細は [yui-32px-redesign-notes.md](yui-32px-redesign-notes.md)、比較は `/?scene=yui-redesign32`。
> v3 を本番採用する場合は、この hand-final 4ポーズを v3 基準で作り直す前提。

## Production Tool

- 使用対象: Aseprite stable v1.3.17.x
- 使用しない: Aseprite v1.3.18-beta2

## Order

1. `yui_idle`
2. `yui_move`
3. `yui_hurt`
4. `yui_ultimate`

idle を先に確定し、残り3ポーズは同一人物に見える範囲で差分化する。

## yui_idle hand-final candidate

### 作成方法

1. seed = 既存 `public/assets/sprites/player/yui_idle_32.png`（generated-draft）。
2. Aseprite CLI でブートストラップ:

   ```sh
   aseprite -b public/assets/sprites/player/yui_idle_32.png \
     --script-param out=assets/source/aseprite/player/yui_idle.aseprite \
     --script scripts/aseprite/build-yui-idle-source.lua
   ```

   `build-yui-idle-source.lua` は seed を読み、idle の hand-final 改善をpixelで焼き込み、`.aseprite` を保存する一度きりのbootstrap。
   以降は `.aseprite` が source of truth。export済みPNGに対して再実行しないこと（差分の二重適用になる）。
3. `pnpm aseprite:export:yui` で `.aseprite` → PNG を書き出す。

> 注意: Aseprite CLI は `--script-param` を `--script` より前に置く必要がある。export script もこの順序に修正済み。

### idle で改善した範囲（顔・フード・髪・服・ランタン・縁取り・足元影に限定）

- フード上縁の左上にクールなムーンリム（夜背景からの分離）。
- フード庇の下に肌シャドウ（額を窪ませて顔を立体化）。
- 髪の左右にハイライトの一筋。
- 目を肌の中央へ寄せ直し（従来は髪の縁に乗っていた）。鼻筋の隙間を確保。
- 頬に淡いブラッシュ。
- ランタン炎を明るく（白核＋ホット画素）、隣接エプロンへ暖色スピル。
- 足元影の外周を低alpha化して接地感（水たまり化の回避）。

シルエット（外形）は seed と同一。よって inkEdge縁取り・実行時 `hitCore`/`debugHitCircle`/collision のフットプリントは不変。

### idle で見た観点（VisualGallery / late combat mock）

- `/?scene=yui-gallery`: 1xでidleが主人公として読め、4xで顔/フード/髪/服/ランタンに破綻なし。idleが4ポーズ中もっとも"仕上がり"に見える。
- `/?scene=combat-mock&density=late`: 黒インク敵が密集してもランタンの暖色＋フードのクールリムで中央のユイが埋もれず、外形が敵と混ざらない。
- `/?scene=asset-status`: `yui_idle` が GF（final系）表示、他3ポーズは GD（generated-draft）。
- hitCore とランタン（体の右側）は離れており重ならない。記憶の欠片（星形）とランタンの誤認は許容範囲。

> idle は基準として **freeze**。move 以降の作業で idle.aseprite は編集しない（再exportは決定論的で同一バイトになるのみ）。

## yui_move hand-final candidate

### 作成方法

1. seed = 既存 `public/assets/sprites/player/yui_move_32.png`（generated-draft）。
2. `scripts/aseprite/build-yui-move-source.lua` で bootstrap:

   ```sh
   aseprite -b public/assets/sprites/player/yui_move_32.png \
     --script-param out=assets/source/aseprite/player/yui_move.aseprite \
     --script scripts/aseprite/build-yui-move-source.lua
   ```

   move の build script は idle の build script と **同一パレット・同一の編集値** を、move のジオメトリ（lean=+1 x / フード17 / ランタン腕が右へ伸びる）にずらして適用する。一度きりの bootstrap。
3. `pnpm aseprite:export:yui` で `.aseprite` → PNG を export。

### move で改善した範囲（idle と同一処理＋移動感は seed silhouette 由来）

- 顔・フード・髪・服・ランタン・縁取り・足元影に idle と同じライティング処理（ムーンリム / 肌シャドウ / 髪ハイライト / 目の中央寄せ / 頬ブラッシュ / ランタン炎の明部＋暖色スピル / 足元影外周の低alpha化）。
- 移動感は seed のシルエットが担う（前傾の歩幅・右へ振れたランタン腕・後方のモーションストリーク）。hand pass はライティング/顔/ランタンの色トーンを idle に揃えることだけを行い、**別キャラに見える差分は入れない**。
- シルエットは seed と同一（dump比較で外形バイト一致）。inkEdge縁取り・`hitCore`/`debugHitCircle`/collision のフットプリントは不変。

### idle と move の一致確認観点（観測済み）

- `/?scene=yui-gallery`: idle(基準) と move を 1x / 4x / 背景上で横並び比較。フード紺・髪マルーン・肌・エプロン・ムーンリム・ランタン炎が一致し、同一人物・同一ライティングに見える。move は前傾＋ランタンを前方へ振った歩行として読める。
  - 補助表示として各ポーズに進捗タグを追加（idle=`HF 基準` / move=`HF 差分` / hurt・ultimate=`GD`）。
- `/?scene=combat-mock&density=late`: プレイヤー（combatではidle pose）が後半密度でも埋もれない。move はランタン/顔トーンを idle と共有するため同様に成立すると判断（move単体のlate実機確認は未取得）。
- `/?scene=asset-status`: `yui_idle` / `yui_move` が GF（final系）、`yui_hurt` / `yui_ultimate` が GD。final 24 / draft 12。
  - 既知の改善余地: asset-status は hand-final も generated-final も "GF" 表示に吸われる。HF/GF の分離マークは hurt 以降でまとめて対応予定（今は yui-gallery 側に HF タグを追加して局所的に区別）。

### 次に yui_hurt へ進む条件（gate）

1. idle / move を基準として **freeze**（hurt 着手後も idle.aseprite / move.aseprite を編集しない）。
2. hurt も seed PNG から `.aseprite` を bootstrap → export し、**シルエットを変えない**（collision footprint固定）。
3. hurt は idle/move と同一人物・同一ライティング。差分は被弾の一瞬（けぞり・赤フラッシュ・表情）に留め、別キャラ化しない。
4. 実機スマホでの1x視認は idle/move とも未確認。実機確認を取るか、少なくとも late density での4ポーズ並置で破綻が無いことを確認してから hurt を本格化する。
5. 任意整理: asset-status の HF/GF 分離マーク（GF=generated-final / HF=hand-final / GD=generated-draft）を hurt 着手前後でまとめて入れる。

## yui_hurt hand-final candidate

### 作成方法

1. seed = 既存 `public/assets/sprites/player/yui_hurt_32.png`（generated-draft）。
2. `scripts/aseprite/build-yui-hurt-source.lua` で bootstrap:

   ```sh
   aseprite -b public/assets/sprites/player/yui_hurt_32.png \
     --script-param out=assets/source/aseprite/player/yui_hurt.aseprite \
     --script scripts/aseprite/build-yui-hurt-source.lua
   ```

   hurt build script は idle/move と同一の共有パレット・ライティング処理を、hurt のジオメトリ（recoil lean = -1 / フード15）にずらして適用。一度きりの bootstrap。
3. `pnpm aseprite:export:yui` で `.aseprite` → PNG を export。

### hurt の差分方針（被弾の一瞬に限定）

- seed が既に被弾を担う: recoil lean=-1、左右のインパクト火花、赤みを帯びた服。これらは silhouette/色として残す。
- seed の **目を覆う太い赤バンド**は赤すぎ＆顔の同一性を消すため撤去し、以下に置換:
  - 痛みの表情（`><` のすくめ目）でユイの顔を取り戻す。
  - 頬に控えめな赤フラッシュ（`198,118,112`／生傷の赤ではない）。
  - 口は元の wince を維持。
- idle/move と同じライティング処理を適用（ムーンリム / 肌シャドウ / 髪ハイライト / ランタン炎の明部＋暖色スピル / 足元影外周の低alpha化）。
- 大きな変形・別キャラ化はしない。シルエットは seed と同一（dump比較で外形一致）。inkEdge縁取り・`hitCore`/`debugHitCircle`/collision フットプリント不変。

### idle / move / hurt の一致確認（観測済み）

- `/?scene=yui-gallery`: 3ポーズを 1x / 4x / 背景上で比較。フード・髪・肌・エプロン・ランタン・ムーンリムが一致。hurt は「同一人物が一瞬ひるんでいる」（すくめ目＋けぞり＋火花＋服の赤み）として読め、別キャラ化していない。タグは idle=`HF 基準` / move=`HF 差分` / hurt=`HF 差分` / ultimate=`GD`。
- `/?scene=combat-mock&density=late`: プレイヤー（combat表示は idle pose）が後半密度でも埋もれない。hurt は被弾の一瞬のみ実ゲームで出るため、gallery 4x と idle とのライティング共有で判断（hurt単体のlate実機確認は未取得）。
- `/?scene=asset-status`: HF/GF/GD を分離表示（`GF 22 / HF 3 / GD 11`）。`yui_idle` / `yui_move` / `yui_hurt` が HF、`yui_ultimate` が GD。

### asset-status の HF/GF/GD 分離（今回実施）

- `qualityMark` / `qualityColor` を分離: `HF=hand-final`（teal `0x7fe0c0`） / `GF=generated-final`（green） / `GD=generated-draft`（blue）。
- ヘッダ集計を `GF / HF / GD` に分割、凡例を更新。hand-final が generated-final に吸われる問題を解消。

### 次に yui_ultimate へ進む条件（gate）

1. idle / move / hurt を基準として **freeze**（ultimate 着手後もこの3 .aseprite を編集しない）。
2. ultimate も seed PNG から bootstrap → export し、**シルエットを変えない**（collision footprint固定）。ultimate seed は発光/オーラ等で外形が大きい点に注意し、hitCore/当たり判定の前提を崩さない。
3. ultimate は同一人物・同一ライティングを保ちつつ、必殺の「華やかさ」を加える差分。ただし idle の基準トーンから乖離した別キャラ化はしない。過剰な発光で1x視認を壊さない。
4. 実機スマホでの1x視認は idle/move/hurt とも未確認。実機確認を取るか、少なくとも late density 4ポーズ並置で破綻が無いことを確認してから ultimate を本格化する。

## Source Files

| pose | source | PNG |
| --- | --- | --- |
| idle | `assets/source/aseprite/player/yui_idle.aseprite` | `public/assets/sprites/player/yui_idle_32.png` |
| move | `assets/source/aseprite/player/yui_move.aseprite` | `public/assets/sprites/player/yui_move_32.png` |
| hurt | `assets/source/aseprite/player/yui_hurt.aseprite` | `public/assets/sprites/player/yui_hurt_32.png` |
| ultimate | `assets/source/aseprite/player/yui_ultimate.aseprite` | `public/assets/sprites/player/yui_ultimate_32.png` |

## Export

```sh
pnpm aseprite:check
pnpm aseprite:export:yui
pnpm assets:verify
```

source が無いposeは `source-missing` としてskipされる。
PNGを直接編集せず、sourceからexportする。

## Review

```txt
/?scene=yui-gallery
/?scene=combat-mock&density=late
/?scene=asset-status
```

見ること:

- 1xでidleが主人公として読める。
- 4xで顔/フード/服/ランタンの破綻がない。
- 夜背景で埋もれない。
- hitCore とランタンが近すぎない。
- 記憶の欠片とランタンが誤認されすぎない。
- 黒インク敵と外形が混ざらない。

## Do Not Touch

- collision
- pickup吸引
- player stats
- background/drop/enemy/weapon素材
