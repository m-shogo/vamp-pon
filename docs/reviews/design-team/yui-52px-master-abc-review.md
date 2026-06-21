# Review: Yui 52px Master Prototype A/B/C

date: 2026-06-15
reviewer: pixel-art director pass（prototype review）
brief: [docs/design-team/yui-52px-master-prototype-brief.md](../../design-team/yui-52px-master-prototype-brief.md)

---

## Asset

- `public/assets/prototypes/yui_idle_52_A.png` — silhouette-first
- `public/assets/prototypes/yui_idle_52_B.png` — charm-first
- `public/assets/prototypes/yui_idle_52_C.png` — gameplay-first
- review sheet: `public/assets/prototypes/yui_idle_52_review_sheet.png`（1x + 6x / 夜背景 + インク斑）
- generator: `scripts/prototypes/build-yui-52-master.lua`
- source: `assets/source/prototypes/yui_idle_52_{A,B,C}.aseprite`

status: **prototype**（Lua図形bootstrap。GUI手仕上げ未実施）

## Target score

80 / 100（master prototypeとしての合格ライン。これ未満は production-candidate にしない）

## Current score

| 案 | 1x可読 | reference一致 | 魅力 | ゲーム視認 | 背景分離 | 同一画風 | 合成 |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| A silhouette | 4 | 3 | 3 | 4 | 4 | 4 | **68** |
| B charm | 3 | 4 | 4 | 3 | 3 | 4 | **72** |
| C gameplay | 4 | 4 | 3 | 4 | 5 | 4 | **70** |

（各軸5点満点。合成は7軸＋master固有要件で100点換算した director 主観値）

**3案とも80点未満 → 全案 prototype 止まり。** これは想定通り。

## A/B/C comparison

### A: silhouette-first（68）
- 良: フード最大＋2pxアウトラインでシルエットが最も強い。ランタンcoreが明るく一発で読める。重心が安定。
- 悪: フード冠部が最も広く **きのこ/帽子に最も近い**（NG該当リスク）。頭でっかちで頭身バランスが重い。アウトラインが裾で重く見える。glowが最も広く欠片と混ざるリスク。

### B: charm-first（72・現状ベスト）
- 良: 顔・目が最大、ダブルキャッチライト＋強めの頬で **一番可愛く愛着が湧く**。フードがやや締まりmushroom感が3案中最小。ランタンが体寄りで「持っている」方向に一歩近い。
- 悪: 1xで目が暗い帯に潰れやすい（情報量を顔に寄せた副作用）。背景分離は3案中最弱。ランタンはまだ手から浮いている。

### C: gameplay-first（70）
- 良: フード左上の **リムライトで暗背景分離が最良**。glowを最小に閉じ込めてあり pickup/敵と混ざらない。ランタンが中心から最も離れ **hitCore中心の読みが最もクリーン**。1xでも輪郭が立つ。
- 悪: 表情が3案中最も硬い（charm弱め）。ランタンが最も離れて「持っている感」が最も薄い。リムが片側のみで少し不自然。

### 3案共通の未解決（最重要）
- **ランタンが手から浮いている**（腕・手が無い）→ 右手で持つ描写が必要
- **首・肩の繋ぎが無く顔が胴に直付き**
- 1xで目が暗帯に潰れやすい
- フード冠部の締め（mushroom回避）が全案で不十分

## Missing points for 80

1. 右腕＋手を足してランタンを「右手で持つ」状態にする（最重要・物語的にもランタンは灯りを掲げる子）
2. 首・肩を1〜2px足して顔と胴を繋ぐ（三角胴・直付き解消）
3. フード冠部を1〜2px締め、襟元の布の落ち感を足して「きのこ」を消す
4. 1xで目が読めるよう、目の暗部とハイライトのコントラストを上げ位置を1px上げる
5. ランタンglowを「中心hitCoreと欠片に被らない」サイズへ固定（C基準を採用）
6. 暗背景分離のリムライト（C）を、顔charm（B）を殺さない範囲で全案標準化

## Keep

- B の顔・目・頬・口（charmの核）
- B のやや締まったフード幅（mushroom抑制方向）
- C のリムライト（暗背景分離）
- C のtight glow（pickup/敵と混ざらない）
- C のランタン位置＝中心hitCoreから離す（中心読み確保）
- 全案共通の色設計（青フード階調 / 茶赤前髪 / 古紙色服 / 暖色ランタン）と裾バンドの服の厚み
- 台形胴（三角胴ではない）方向

## Discard

- A の最大フード（mushroom化／頭でっかち）
- A の2pxアウトライン（裾で重い。1pxへ）
- A/Bの広め・拡散glow
- 「ランタンが手から浮いている」現状配置（全案）
- 顔が胴に直付きの首なし構造（全案）

## v2 合成方針

**B(charm) を顔のベース + C(gameplay) を視認性のベース** に合成する。

- 顔・目・頬・口・前髪 = B
- フード幅 = B寄り（締める）＋冠部をさらに1〜2px締める
- リムライト・tight glow・ランタン中心離し = C
- アウトライン = 1px（C/B）
- 新規追加: 右腕＋手でランタンを持つ / 首・肩の繋ぎ
- glowサイズは hitCore と欠片に被らないことを最優先で固定

合成後は **GUI手仕上げ必須**（目1pxディテール / フード階調遷移 / 髪束 / 手の指 / glow最終調整）。
手仕上げ前は何があっても final-candidate にしない。

## Next exact edit

`scripts/prototypes/build-yui-52-master.lua` をベースに v2 generator を作り、以下を順に:

1. variant=B の `face_*` / `eye_scale=1.15` / `double_catchlight` / `blush_scale=1.25` を v2 既定にする
2. `hood_rx` を 0.41 まで締め、冠部上端を1px下げて「きのこ」回避
3. 右腕＋手レイヤーを新規追加: 胴右肩(nx≈0.66, ny≈0.62)から手(nx≈0.78, ny≈0.66)へ袖を描き、手の上にランタン handle を載せる
4. 首・肩レイヤー: face下端(ny≈face_cy+face_ry)から胴へ2px幅のskin/襟を繋ぐ
5. ランタン: `lantern_cx≈0.80`（手の位置）/ glow=tight固定 / 中心hitCore(nx 0.46–0.54)に被らせない
6. リムライト(C)を全variant標準ON、ただし顔上には乗せない
7. 目: `eye_y` を 0.01 上げ、`IRIS_D` と `EYE_W` のコントラストを上げて1x可読化
8. アウトライン1px固定
9. export → review sheet 再生成 → 1x/6x/夜背景で再採点
10. 80点到達かつGUI手仕上げ後にのみ production-candidate を検討

## Production touched

**no** — production sprite / production .aseprite source / gameplay定数は一切変更していない。
変更は新規 prototype / review / generator のみ（`assets/source/prototypes/`, `public/assets/prototypes/`, `scripts/prototypes/`, `docs/design-team/`, `docs/reviews/design-team/`）。
この段階の素材は preview / production には接続しない（prototype review のみ）。

## Final decision

**iterate**

3案とも80点未満（68 / 72 / 70）。最有力は **B(charm)=72**、ただしゲームクリティカルな視認軸は **C** が勝つ。
production-candidate にできる80点以上の根拠は無い。
次は上記 v2 合成（B顔 + C視認 + 腕/手/首 追加）→ GUI手仕上げ → 再採点。
