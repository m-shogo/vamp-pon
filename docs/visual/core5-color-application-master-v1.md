# ヨルノシルベ — Core5 Color Application Master v1

Date: 2026-08-13  
Status: **CURRENT VISUAL PRODUCTION AUTHORITY / COLOR APPLICATION ONLY / DOES NOT REPLACE THEME COLOR CANON**

## 0. Purpose

Core5 の色を「キャラのテーマ色を全身へ塗る」「高解像度だから差し色を増やす」「星獣色を衣装へ大量投入する」といった画像生成側の補完へ任せない。

この Master は既存の色 Canon を変更しない。

色の正本は以下。

- `src/game/data/characterThemeColors.ts`
- `src/game/data/characterThemeColorReservoir.ts`
- `docs/183-character-theme-colors.md`

本 Master が決めるのは、**正本の色を人物デザインへどう配分し、どこへ置き、何に使ってはいけないか**である。

画像生成では色を personality shorthand として使わない。色は body / silhouette / clothing construction / material / prop の読みやすさを支える。

---

# 1. Authority order

1. Current character / world canon
2. `src/game/data/characterThemeColors.ts`
3. per-character Living Visual Profile
4. Appearance Source / Distinction Contract
5. `docs/visual/visual-design-production-master-v1.md`
6. 本 Master
7. resolved generation brief
8. generated candidate
9. human visual review

本 Master は hair color / eye color / skin tone の未確定値を勝手に作らない。

---

# 2. Shared color grammar

## 2.1 Four roles

各キャラは最低でも以下を分ける。

- **identity color** — 既存 `themeColor.hex`。人物を識別する主系統。
- **support neutral** — body / material / era / daily use を支える低彩度帯。新しい signature color にしない。
- **accent color** — 既存 `accentColor.hex`。小面積で視線誘導する。
- **emitted / reflected light** — lantern / dawn / environment light。衣服そのものの恒常色と混同しない。

Star Beast color は別 authority であり、**常用衣装の第三主色ではない**。

## 2.2 Default area discipline

面積比は厳密な印刷指定ではなく、生成時の discipline。

- identity color: **25–50%**
- support neutral / material color: **35–60%**
- accent color: **3–10%**
- emitted light: **物体・光源・反射部だけ**

例外は garment construction / material / era / existing master から理由がある場合のみ。

## 2.3 Forbidden shortcuts

禁止:

- theme color で髪・目・服・靴・小物を全部統一する
- accent を全縁取りへ使う
- 金属だから金色にする
- 主人公だから gold / white を増やす
- 高レア感のため彩度と発光を上げる
- Star Beast color を追加の豪華色として使う
- Kokuyou / Dawn で恒常 palette identity を別人レベルに置換する
- skin tone を palette harmony のために明るく / 暗く補正する

---

# 3. Yui / ユイ

## Canon colors

- identity: `#264A86` 瑠璃色
- accent: `#F6B44B` 山吹色
- Star Beast: `#D6A541` — Leo shared lineage color; **garment defaultではない**

## Application

- 瑠璃色は outer layer / medium-size cloth mass / edge-to-center block のいずれかを主担当にする。
- 全身を青にせず、古紙・灰・柔らかい暗色など Living Profile の neutral を十分残す。
- 山吹色は **small lantern / lamp core / tiny memory-light reflection** を第一用途とする。
- 山吹色をリボン、靴紐、宝石、髪飾りへ分散しない。
- emitted warm light が顔へ当たっても、顔そのものを恒常的な暖色 palette へ変更しない。

## Read target

**quiet blue person carrying one warm practical light**。

暖色面積が増えて「金青の主人公装備」へ見えたら失敗。

---

# 4. Asa / アサ

## Canon colors

- identity: `#F4A7B9` 薄紅
- accent: `#F7D94C` 菜の花色
- Star Beast: `#E0B75D`

## Application

- 薄紅は「甘いヒロイン色」ではなく、**name-tag / morning / clear identification** の人物色として扱う。
- compact / angular / diagonal silhouette を壊さないよう、薄紅は clean panel / inner layer / controlled block に使う。
- dark or neutral support を十分残し、全身 pastel 化しない。
- 菜の花色は label / paper highlight / small closure cue 等、小さく明快な一点へ。
- yellow-gold metallic ornament へ変換しない。

## Read target

**sharp construction carrying a restrained pale-red identity**。

「薄紅だから柔らかい・可愛い・ふわふわ」へ寄せたら失敗。

---

# 5. Nagi / ナギ

## Canon colors

- identity: `#7B90D2` 藤紫
- accent: `#C7B78B` 白橡
- Star Beast: `#D98B77`

## Application

- 藤紫は long / vertical / closed silhouette を支える静かな面として使う。
- support は cool dark neutral / greyed material を優先し、紫一色の幻想衣装にしない。
- 白橡は key / old box edge / restrained fastening / aged hard material など、**古い物体との接点**に置く。
- sparkle / silver-glitter / crystal replacement をしない。
- Star Beast の殻色を makeup / eye glow / jewelry に流用しない。

## Read target

**closed vertical quietness with a small old-object edge**。

「月キャラだから銀・紫・宝石」の三点セットになったら失敗。

---

# 6. Michiru / ミチル

## Canon colors

- identity: `#2E5C6E` 御召御納戸
- accent: `#D7C447` 刈安色
- Star Beast: `#9CC8E8`

## Application

- identity の青緑は route / map / outdoor travel の cloth mass として使い、ユイの青と明確に分ける。
- support に dust / soil / canvas / leather-like neutral を許可し、旅の実用品が全部 theme color にならないようにする。
- 刈安色は compass needle / route thread / tiny navigation cue が第一用途。
- accent を大面積の黄色衣装へ拡張しない。
- Star Beast の明るい北天色を常時発光 outline にしない。

## Read target

**weathered blue-green traveler with one readable navigation cue**。

「冒険キャラだから青＋黄＋革ベルト大量」になったら失敗。

---

# 7. Tomori / トモリ

## Canon colors

- identity: `#8F2E14` 弁柄色
- accent: `#FAD689` 淡香
- Star Beast: `#D6A541` — Yui と共有する Leo lineage color; **関係種別を色だけで確定しない**

## Application

- 弁柄色は repair / soot / lamp / workwear history と会話する cloth or repaired panel へ使う。
- support は work-dark neutral / worn material / old hardware を優先する。
- 淡香は repaired lamp / warm reflected work light / small repaired marking へ限定する。
- Star Beast 金を brass overload / steampunk decoration へ変換しない。
- patched areas は色数を増やすためではなく repair history を見せるために使う。

## Read target

**red-brown work history with a small repaired warm light**。

「メカニックだから真鍮・ゴーグル・歯車・金縁」を増殖させたら失敗。

---

# 8. Core5 ensemble test

5人を同一照明・neutral standing poseで並べて確認する。

1. grayscaleでも body / silhouette / clothing mass で区別できる
2. colorを戻すと theme family が補助的に識別を強める
3. Yui blue と Michiru blue-green が同じ塊に見えない
4. Asa pale red が soft-romantic shorthand にならない
5. Nagi purple が generic moon-magic shorthand にならない
6. Tomori red-brown が generic steampunk shorthand にならない
7. accent だけ消しても人物性が残る
8. Star Beast color を消しても人物性が残る
9. emitted light を消しても衣装構造が読める
10. 全員に gold / white highlight を足さなくても commercial-quality design が成立する

---

# 9. Asset-type translation

## Character Master / high-res

- material local colorを保持
- accent は小面積
- light は反射として扱い、恒常色と区別
- high-res detail で palette role を増やさない

## Conversation / 4-koma

- identity + support + accent の3段階で十分
- micro color accentsを省略してよい
- expression readabilityを優先

## Chibi

- identity block 1つ
- support block 1–2つ
- accent 1点
- Star Beast lineage color は必要sceneのみ

## Pixel

- strongest identity block
- strongest support block
- prop accent

まで圧縮可能であること。

---

# 10. Image-generation gate

Core5 の画像生成では、resolved prompt に本 Master の対象キャラ profile を実データとして含める。

生成前に以下を満たさない場合、Character Master生成を止める。

- canonical theme / accent HEX loaded
- per-character color application loaded
- accent placement known
- star-beast color role separated
- emitted-light role separated
- no unspecified third signature color
- no theme-color full-body wash
- no generic gold premiumization

**色は最後に人物へ貼る装飾ではない。人物の形・素材・生活を読みやすくする設計階層として使う。**
