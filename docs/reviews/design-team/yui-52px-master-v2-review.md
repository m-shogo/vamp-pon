# Review: Yui 52px Master Prototype v2 (V2a / V2b / V2c)

date: 2026-06-15
reviewer: pixel-art director pass（prototype review）
brief: [docs/design-team/yui-52px-master-prototype-brief.md](../../design-team/yui-52px-master-prototype-brief.md)
prev review (A/B/C): [yui-52px-master-abc-review.md](./yui-52px-master-abc-review.md)

Design role: pixel-art director / pro app quality gate
iteration history: A/B/C → **v2 合成（B charm + C gameplay + 腕/手/首 追加）**

---

## Asset

- `public/assets/prototypes/yui_idle_52_v2a.png` — balanced synthesis（推奨ベース）
- `public/assets/prototypes/yui_idle_52_v2b.png` — charm-biased
- `public/assets/prototypes/yui_idle_52_v2c.png` — gameplay-biased
- review sheet: `public/assets/prototypes/yui_idle_52_v2_review_sheet.png`
  （旧A/B/C vs 新v2 の3x比較 / 1x / 6x夜背景 / インク斑背景 + 欠片pickup + hitCore中心点）
- generator: `scripts/prototypes/build-yui-52-v2.lua`（variant=V2a/V2b/V2c）
- review sheet generator: `scripts/prototypes/build-yui-52-v2-review-sheet.lua`
- source: `assets/source/prototypes/yui_idle_52_v2{a,b,c}.aseprite`

status: **prototype**（Lua図形bootstrap。GUI手仕上げ未実施）

3案とも「A/B/Cの焼き直し」ではなく、全案で **右腕＋手＋首・肩** を追加した v2 改善案。
差分は charm↔gameplay の軽いバイアスのみ（顔ベース＝B / 視認ベース＝C は共通）。

## Target score

80 / 100（master prototype合格ライン。これ未満は production-candidate にしない）

## Current score

V2a=80, V2b=77, V2c=79（各 director 主観・100点換算）

| 案 | 1x可読 | reference一致 | 魅力 | ゲーム視認 | 背景分離 | 同一画風 | final自信 | 合成 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| V2a balanced | 4 | 4 | 4 | 4 | 4 | 4 | 3 | **80** |
| V2b charm    | 4 | 4 | 5 | 3 | 3 | 4 | 3 | **77** |
| V2c gameplay | 4 | 4 | 3 | 5 | 5 | 4 | 3 | **79** |

`final自信` が全案 3 なのは **Lua bootstrap であり GUI手仕上げ未実施だから**（意図通り）。
このため点数に関係なく `final-candidate` / `hand-final` には**しない**。

## 旧B / 旧C から何が改善したか

旧 A/B/C レビューの「80に足りない6点」を順に潰した:

1. **ランタンが手から浮いていた → 右腕＋袖＋手＋handleで「右手で持つ」状態に**（最重要・解決）
2. **顔が胴に直付き → 首の肌＋襟(V)＋肩の接続を追加**（解決）
3. **フードがきのこ/帽子 → 冠部を下げ・top sheenを小さくして「被った布」化**（概ね解決。幅はまだ大きめ）
4. **1xで目が暗帯に潰れる → 目を 0.024 上げ、瞳/白の階調コントラストを上げ、catchlightを拡大**（解決）
5. **glowが欠片/敵と混ざる → tight glow（半径 0.098–0.110）に固定**（解決）
6. **暗背景分離 → C のリムライトを全案標準化（V2cは肩にも）＋1pxアウトライン**（解決）

旧ベスト=旧B(72)。v2 は上記6点を実装し、ベスト V2a=80 まで前進。

## チェック項目（doc必須）

- **ランタンが「手で持っている」と読めるか**: ✅ YES。肩→袖→手→handle が繋がり、手の上にランタン本体が乗る。旧案の「宙に浮く黄色い箱」は消えた。6xで手はまだミトン状（指の作り込みはGUI手仕上げ案件）。
- **首・肩が読めるか**: ✅ YES。顎下に肌の首＋襟のV＋肩の傾斜で「直付き」は解消。ただし肩幅はやや広い。
- **青いキノコ化が消えたか**: ◯ 概ね YES。冠部を下げ thin-stalk 感は消えた（首・肩・腕で接地）。ただしフードは依然「幅広」。V2c(hood_rx=0.40)が最も締まり、V2b(0.42)が最も広い。
- **1xで目が読めるか**: ✅ YES。左カラム1xで目が暗点として読め、暗帯に沈まない。
- **暗背景で見失わないか**: ✅ YES。リム＋1pxアウトラインで夜背景・インク斑背景の両方で輪郭が立つ。
- **欠片・敵・hitCoreと混同しないか**: ✅ YES。欠片pickup（クール生成り菱形）と ランタン（暖色glow）は色温度で分離。tight glow は中心 hitCore（マゼンタ点）に届かない＝中心の当たり判定読みがクリーン。

## Keep

- 右腕＋手＋handle でランタンを持つ構造（v2の核・全案維持）
- 首＋襟V＋肩接続（直付き解消）
- B 由来の顔・目・頬・口（charmの核）
- C 由来のリムライト / tight glow / 中心からランタンを離す配置
- 1pxアウトライン（A案の重い2pxは廃止済み）
- 色設計（青フード階調 / 茶赤前髪 / 古紙色服 / 暖色ランタン）と裾バンドの服の厚み
- 台形胴（三角胴ではない）

## Discard

- 旧A/B/C の「宙に浮くランタン」配置
- 旧の「首なし直付き」構造
- 旧A の2pxアウトライン・最大フード
- V2b の最大フード幅（mushroom寄りに戻りかけ＝広すぎ）
- 6xで露呈するミトン手・平坦な前髪（GUI手仕上げで作り込む）

## まだ80点未満 / 80ぎりぎりの要因（what is missing for 80 / beyond）

V2a=80 は「6つのブロッカーを実装した」ことによる到達であり、絵としての作り込みは未達。
80を超えて production 品質にするには GUI手仕上げが必須:

- フード幅をあと1〜2px締める（特にV2b）。top sheenを2〜3pxのクラスタに整理。
- 手に2〜3本の指を彫り、handleを握る形にする。
- ランタン光が当たる袖・手に1pxの暖色リムを足す。
- 前髪を平坦な帯から2〜3房のクラスタへ。
- 顎下に1pxの首影ラインを入れて首をさらに明確化。
- 目に手置きの1px clean catchlight＋下まぶた1px。

## 次にGUI手仕上げで直すべきpixel単位の指示（next exact edit）

1. hood: 左右端を各1px内側へ（V2b は2px）。冠部 top sheen を `(0.42, hood_cy-0.075)` 周辺の3px塊に整理。
2. hand: 手 `(hand_nx, 0.672)` に縦2px×横1pxの指3本を彫り、handle下に握り影1px。
3. arm: 袖の上面 `seg(0.625→hand_nx)` に1px `DRESS_HI`、下面に1px `DRESS_SH` を手置き。
4. lantern: 暖色リム1px（左上）＋ glow最外周を1px落として欠片との被りゼロを確定。
5. eyes: 各目の白を1px clean dot に置き換え、下まぶたに `SKIN_SH` 1px。
6. hair: 額の前髪を中央1房＋左右各1房の3クラスタに。
7. neck: 顎下 `(0.49, face_bot)` に `SKIN_SH` 1pxの首影。

これらは全て GUI（Aseprite手作業）案件。Luaは構造bootstrapまで。

## Production touched

**no** — production sprite / production .aseprite source / gameplay定数は一切変更していない。

- 変更は prototype / review / generator のみ:
  `assets/source/prototypes/`, `public/assets/prototypes/`,
  `scripts/prototypes/`, `docs/reviews/design-team/`, （+`package.json` に prototype:verify 追加 / `scripts/quality/`）
- 未変更を確認するコマンド（preview / git）:
  - `pnpm prototype:verify`（prototype画像・review doc 存在チェック）
  - `git diff --stat HEAD -- public/assets/sprites/player assets/source/aseprite/player`（空であること）
  - production 反映は GUI手仕上げ後の別レビューで行う（このdocでは preview/production へ接続しない）

## Final decision

- **V2b (77) / V2c (79) → iterate**（80未満）
- **V2a (80) → prototype-pass**（80到達、ただし **Lua生成のみ**のため prototype-pass 止まり）
- **production-candidate にはしない** — production-candidate は GUI手仕上げ＋80点rubric再通過の**後のみ**。
  本docは Lua bootstrap 段階であり、`final自信=3`。次は V2a を土台に上記「次のexact edit」をGUIで実施し再採点する。

一番良い案: **V2a**（balanced）。charm を残しつつ視認・接地・ランタン把持が最もまとまる。
charm最優先なら V2b、視認最優先なら V2c だが、master基準としては V2a を採用候補とする。
