# ユイ 見た目サイズ 42px 本番候補（v4 prototype → native 4ポーズ）

32px の v3 リデザインは方向性は良いが、**プレイヤーとしてやや小さく感じる**可能性がある。
そこで「見た目サイズ」を 36 → 40 / 42 / 44px に上げた場合の存在感・可読性・画面の邪魔さを比較した。
現在は **42px を本番候補** として扱い、通常ゲーム内の `PLAYER_DEFAULTS.visualSize` を `42` にしている。さらに `yui_idle` / `yui_move` / `yui_hurt` / `yui_ultimate` を v4·42 基準の42pxネイティブ hand-final candidate に更新済み。

## 前提・変更しないもの

- `PLAYER_DEFAULTS.radius = 6`（collision）は変更しない。
- `PLAYER_DEFAULTS.visualSize = 42`（本番候補の見た目）。40pxへ戻す場合はこの定数を戻す。
- pickup `collectRadius` / `magnetRange` / `magnetSpeed`、hp / moveSpeed / invulnSec は変更しない。
- 東方方式（当たり判定＝中央の小さな hitCore、見た目はそれと分離して大きくできる）を維持。
- 4ポーズは42pxネイティブ。`yui_idle_v4_42` prototype のかわいい方向を本番候補基準として採用した。

## prototype（native 解像度で再設計、32px の単純拡大ではない）

| id | サイズ | source | PNG |
| --- | --- | --- | --- |
| `yui_idle_v4_40` | 40px | `assets/source/aseprite/player/prototypes/yui_idle_v4_40.aseprite` | `public/assets/sprites/player/prototypes/yui_idle_v4_40.png` |
| `yui_idle_v4_42` | 42px | 同上 `yui_idle_v4_42.aseprite` | `yui_idle_v4_42.png` |
| `yui_idle_v4_44` | 44px | 同上 `yui_idle_v4_44.aseprite` | `yui_idle_v4_44.png` |

### 作り方

`scripts/aseprite/build-yui-idle-v4-source.lua` がデザインを **正規化座標 [0,1] で定義** し、各サイズの canvas に**ネイティブにラスタライズ**する（拡大ボケなし）。デザインは v3 のかわいい方向（青フード / 金の月リム / 茶赤前髪 / 大きめ顔 / 右手cageランタン / 古紙色ワンピ / selective 1px outline / 控えめ足元影 / ランタンは中央hitCoreから離す）を継承し、42px の余白で顔・フード・ランタン・服を1段ずつ描き込みやすくしている。

```sh
# size を変えて 40/42/44 を native 生成
aseprite -b --script-param out=...yui_idle_v4_42.aseprite --script-param size=42 \
  --script scripts/aseprite/build-yui-idle-v4-source.lua
# PNG export（prototype 専用）
pnpm aseprite:export:proto
```

prototype は本番 `assetManifest` ではなく `src/game/assets/prototypeManifest.ts` で別管理。
`assets:verify` / `generate-pixel-assets` の対象外。ギャラリーURL時のみ読み込む。

## 比較導線

### 見た目サイズ確認ページ

- URL: `/?scene=yui-redesign42`（VisualGallery 9/9）
- 表示: v3旧案 / v4·40 / v4·42 prototype / 本番42px native / v4·44 を
  - 1x実寸 / ゲーム表示想定サイズ / 拡大+hitCore・debugHitCircle / 実背景上+近接（欠片・回復・カプセル・黒インク敵・通常弾）
- 画面内の比較観点:
  - プレイヤーとして小さすぎないか / かわいく見えるか / 顔が読めるか
  - ランタンと hitCore（中央の金芯）が混ざらないか / 欠片と誤認しないか
  - 敵や弾を隠しすぎないか / 後半密度で邪魔にならないか

### combat-mock の見た目サイズ実地確認（バランスは不変）

`createPlayerView` に `visualSize`（表示サイズのみ）を追加し、combat-mock で `playerVisual` クエリで切替:

```txt
/?scene=combat-mock&density=late&playerVisual=36
/?scene=combat-mock&density=late&playerVisual=40
/?scene=combat-mock&density=late&playerVisual=42
/?scene=combat-mock&density=late&playerVisual=44
```

- 変えるのは**見た目サイズだけ**。collision radius=6 / hitCore / 敵・弾・密度・バランスは不変。
- `playerVisual` 省略時は本番候補 `PLAYER_DEFAULTS.visualSize=42` を使う。

## 観測（ブラウザ比較ページ / 実機スマホは未確認）

- 32px(=現行36表示) はスマホ縦だと主人公として小さめに見える。40/42/44 で**存在感が明確に増す**。
- 44px は最も読みやすく可愛いが、後半密度（`density=late&playerVisual=44`）では敵・弾をやや覆い気味。
- 42px は「主人公として十分大きい」と「敵・弾を隠しすぎない」のバランスが良さそう。現在は4ポーズとも42pxネイティブHF候補。
- いずれも cage型ランタンが右手側に出て、中央 hitCore（金芯）とは形・位置で分離できている。
- **実機スマホでの可読性・指の隠れは未確認**。最終判断は実機で要確認。

## 現時点の所感（本番候補）

- 本番候補: **v4·42**（存在感とプレイ視認のバランス）。次点で 44（可愛さ最大だが密度時にやや大きい）。
- 小さく感じるが邪魔しない安全側: 40。

## 次の判断

- 実機で `yui-redesign42` と `combat-mock?...&playerVisual=42/44` を確認。
- `yui_idle_v4_42` を基準に idle → move → hurt → ultimate を 42px で作り直し済み（collision radius=6 は据え置き）。
- **大きすぎる**なら `PLAYER_DEFAULTS.visualSize` を 40px へ戻す。
- 32px 継続なら v3 を磨いて 36 表示のまま進める。
- いずれも **collision / pickup / stats は変更しない**。
