# Handoff: Yui 52px Master V2a → GUI Hand-finish

date: 2026-06-15
role: pixel-art director → GUI手仕上げ担当へのハンドオフ
status: **prototype-pass の引き継ぎ**（production-candidate ではない）

prev review: [yui-52px-master-v2-review.md](./yui-52px-master-v2-review.md)
brief: [yui-52px-master-prototype-brief.md](../../design-team/yui-52px-master-prototype-brief.md)
before/after用テンプレート: [yui-52px-v2a-before-after-template.md](./yui-52px-v2a-before-after-template.md)
人間向けGUI実作業ガイド（1px座標つき）: [yui-52px-v2a-human-aseprite-guide.md](./yui-52px-v2a-human-aseprite-guide.md)
pipeline: [vamp-pon-pixel-art-pipeline-v1.md](../../pixel-art/vamp-pon-pixel-art-pipeline-v1.md)

> **ルート分離（pipeline v1）**: 人間ルート（A）＝player / 主役級の GUI 手仕上げ + 最終レビュー。
> procedural ルート（B）＝量産・基礎底上げ（`script-assisted-candidate` 止まり、hand-final ではない）。
> 任意で B の PF を手仕上げの出発点にしてよい（[PF review](./yui-52px-v2a-procedural-finish-review.md)）が、
> player の production 昇格は A 必須。**production 昇格はこのハンドオフとは別工程。**

---

## 0. このdocの位置づけ

V2a（52px master prototype）を土台に、**Aseprite GUI で手作業仕上げ**するための作業パック。

ここは依然 prototype フェーズ。以下を厳守:

- production sprite / production `.aseprite` source / gameplay定数は触らない
- V2a/V2b/V2c を production に接続しない
- **Lua生成のままを final / hand-final / production-candidate と呼ばない**
- 出力は prototype / review / handoff docs のみ

土台ファイル:

- source: `assets/source/prototypes/yui_idle_52_v2a.aseprite`
- png: `public/assets/prototypes/yui_idle_52_v2a.png`
- 手仕上げの出力先も `assets/source/prototypes/` / `public/assets/prototypes/` 配下にとどめる
  （例: `yui_idle_52_v2a_hf.aseprite` / `yui_idle_52_v2a_hf.png`）。
  production パスへは**書かない**。

---

## Score context（V2a 引き継ぎ時点）

iteration history: A/B/C → v2（V2a/V2b/V2c）→ **本handoff（V2a土台のGUI手仕上げ）**

- Target score: **80 / 100**（master合格ライン。これ未満は production 昇格判断に進めない）
- Current score: **V2a=80（prototype-pass / Lua bootstrap）**, V2b=77, V2c=79
- final自信: 3（Lua段階のため。手仕上げ後に再採点して 4 以上を狙う）

### Missing points for 80（80を「絵として」超えるために手仕上げで埋める差分）

§3 の pixel単位指示 #1–#8（hood幅 / hand指 / arm陰影 / lantern glow / eyes / hair / neck影 / rim）。
点数は付いていても作り込みが未達なので、ここを GUI で埋めて初めて 80超の production 品質になる。

### Keep（V2aから維持するもの）

- 右腕＋手＋handle でランタンを持つ構造
- 首＋襟V＋肩接続（直付き解消）
- B由来の顔・目・頬・口（charmの核）
- C由来のリム / tight glow / 中心からランタンを離す配置
- 1pxアウトライン / 既存パレット / 台形胴

### Discard（V2aへ持ち込まないもの）

- V2b の最大フード幅（きのこ寄り）
- V2c の硬い無表情（charm低下）
- 旧A/B/C の宙に浮くランタン・首なし直付き・2pxアウトライン

### Production touched

このhandoff doc の作成では production sprite / source / gameplay定数を触らない（review/handoff のみ）。
昇格判断 doc の段階でも production / preview へは接続しない。source は `assets/source/prototypes/` 内にとどめる。

---

## 1. なぜ V2a を土台にするか

v2レビュー（V2a=80 / V2b=77 / V2c=79）で V2a が総合最良。

- charm（顔・目・頬・ダブルキャッチライト＝B由来）を残しつつ
- 視認（リムライト・tight glow・中心からランタンを離す＝C由来）も確保
- v2の核である「右腕＋手でランタンを持つ」「首・襟・肩」を最も破綻なくまとめている
- フード幅が V2b より締まり、charm が V2c より高い＝**charmと視認の両立点**

master は「作品全体のビジュアル基準」になるため、charm と gameplay 視認の**両立点**を土台にするのが正しい。V2a がそれ。

## 2. なぜ V2b / V2c を採用しないか

- **V2b（charm寄り・77）不採用**: 目とフードが最大で可愛いが、フード幅が広くきのこ寄りに戻りかけ、背景分離とゲーム視認が3案中最弱。masterの基準としては「可愛いが見にくい」リスク。charm要素（目の大きさ・blush）は V2a 手仕上げ時に**部分的に取り込む**。
- **V2c（gameplay寄り・79）不採用**: 分離と中心読みは最良だが表情が硬く charm が弱い。mascot/merchandise 適性が落ちる。V2c の強み（強リム・最tight glow）は V2a 手仕上げで**必要分だけ寄せる**。

→ 結論: **V2a を土台に、V2bのcharmとV2cの視認を1px単位で微注入する**。土台の差し替えはしない。

---

## 3. GUI手仕上げで直す pixel単位の指示

すべて Aseprite GUI（手作業）案件。Lua では構造 bootstrap までで、ここから先は手で彫る。

| # | 部位 | 指示 | 狙い |
| --- | --- | --- | --- |
| 1 | hood幅 | 左右端を各1px内側へ。冠部の top sheen を `(0.42, hood_cy-0.075)` 付近の **3pxクラスタ**に整理 | きのこ感を消す／布の被り感 |
| 2 | hand | 手 `(hand_nx≈0.77, 0.672)` に縦2px×横1pxの**指3本**を彫り、handle下に握り影1px | ミトン手→握っている手 |
| 3 | arm | 袖の上面 `seg(0.625→hand_nx)` に1px `DRESS_HI`、下面に1px `DRESS_SH` | 腕の立体・ランタン光の当たり |
| 4 | lantern | 暖色リム1px（左上）＋ glow 最外周を1px落とす | 欠片pickupとの被りをゼロに固定 |
| 5 | eyes | 各目の白を**1px clean dot**に置換、下まぶたに `SKIN_SH` 1px。V2bのキャッチライトの明るさを部分注入 | 1x可読＋charm |
| 6 | hair | 額の前髪を平坦帯→**中央1房＋左右各1房の3クラスタ**へ | 髪の情報量・同一人物性 |
| 7 | neck | 顎下 `(0.49, face_bot)` に `SKIN_SH` 1pxの**首影ライン** | 首をさらに明確化 |
| 8 | rim | 左肩エッジに V2c 由来の1pxリムを**控えめに**追加（顔の上には乗せない） | 暗背景分離を底上げ |

色は V2a の既存パレット（`scripts/prototypes/build-yui-52-v2.lua` の Palette 節）を流用し、新色を増やさない。

## 4. 修正順序（必ずこの順で）

1. **#1 hood幅** … 全体シルエットを先に確定（後工程の基準になる）
2. **#7 neck影 → #2 hand → #3 arm** … 接地と「持っている」読みを固める
3. **#5 eyes → #6 hair** … charmの核を仕上げる
4. **#4 lantern → #8 rim** … 視認・分離の最終調整
5. 各段階ごとに 1x / 6x / 夜背景 で見て、潰れたら戻す

理由: シルエット → 構造 → charm → 視認 の順。charmや視認を先に詰めるとシルエット変更で崩れる。

## 5. NG例（やってはいけない）

- フードを締めるつもりで**幅を広げて**きのこに戻す
- 2pxアウトラインの復活（A案の重さ。1px固定）
- glowを広げて弱いドットを誤魔化す／欠片・hitCoreと被らせる
- 目を大きくしすぎて顔が潰れる（V2b過剰）
- 手の指を描き込みすぎて1xでノイズになる
- ランタンを中心 hitCore（nx 0.46–0.54）側へ寄せる
- 新しい色を増やしてパレットを濁らせる
- production パス（`public/assets/sprites/player/` / `assets/source/aseprite/player/`）へ書く
- Lua再生成しただけで「手仕上げ済み」と称する

## 6. production-candidate に昇格してよい条件

**すべて**満たした時のみ:

1. Aseprite **GUI で実際に手作業**した（Lua再生成だけではない／手作業の証跡を残す）
2. before/after を [テンプレート](./yui-52px-v2a-before-after-template.md)で記録した
3. 品質ゲート7軸＋master固有が **80点以上**、かつ `final自信 ≥ 4`
4. 1x / 6x / 夜背景 / 欠片近接 / hitCore中心 の全確認をパス
5. `mascot silhouette` / `merchandise potential` が 4 以上（masterは作品の顔）
6. production touched: **no** を維持（昇格判断docの段階ではまだ production に書かない）

## 7. 昇格禁止条件（1つでも該当したら昇格しない）

- Lua生成のみ（手作業なし）
- 80点未満、または `final自信 ≤ 3`
- きのこフードが残る／ランタンが浮いて見える／首が読めない
- 1xで目が潰れる／暗背景で見失う
- 欠片・敵・hitCore と混同する
- before/after 証跡がない
- production / gameplay定数を触っている

## 8. before/after review で見るべき項目

[before/after テンプレート](./yui-52px-v2a-before-after-template.md)の各項目を before（V2a素のLua）/ after（GUI手仕上げ）で対で採点:

- 1x readability / reference match / charm appeal
- mascot silhouette / merchandise potential
- gameplay visibility / background separation
- final confidence
- GUI手仕上げ証跡（実際にAsepriteで手作業した修正一覧）
- production touched: yes/no
- final decision

「after が before（V2a=80）を上回っているか」「#1–#8 の各指示が反映されているか」を必ず確認する。

## 9. 確認画面チェックリスト（1x / 6x / 夜背景 / 欠片 / hitCore）

- [ ] **1x**: ユイと一目で分かる／青フード・茶前髪・ランタンが読める／目が潰れない
- [ ] **6x**: 指・首影・前髪クラスタ・袖の陰影が破綻していない
- [ ] **夜背景**: リム＋1pxアウトラインで輪郭が立つ／沈まない
- [ ] **インク斑背景**: 黒だまりに溶けない
- [ ] **欠片近接**: 暖色ランタン と クール生成り欠片が混同しない／glowが欠片に被らない
- [ ] **hitCore中心**: 中心マゼンタ点にglowが届かない／中心の当たり判定読みがクリーン

確認には `scripts/prototypes/build-yui-52-v2-review-sheet.lua` を手仕上げ版を指すように複製して使うか、GUIで実背景に重ねて確認する。production preview へは接続しない。

## 10. Final decision（このhandoff時点）

- V2a = **prototype-pass**（Lua bootstrap段階）。production-candidate ではない。
- 次工程 = **GUI手仕上げ**（本docの #1–#8 を順に実施）→ before/after記録 → 80点rubric再通過 → その時にのみ production-candidate を判断。
- 本docでは production / preview へ接続しない。
