# Vamp Pon Pixel Art Pipeline v1

ドット絵クオリティを底上げし、キャラ・敵・アイテムを**量産**できるようにするための制作基盤。
単発のユイ修正ではなく、「人間が見る所」と「scriptが回す所」を分けて運用するための恒久ルール。

このdocは [`docs/pixel-art/`](./README.md) の汎用基礎ルール（human-character-craft-guide / ng-patterns /
agent-quality-brief / research-notes）の**上**に乗る運用レイヤー。基礎ルールを置き換えるものではない。

---

## 0. 目的

- 全spriteを人間が1px手作業する運用を避ける。
- ただし **player / 主役級 / 作品の顔になる重要キャラは人間が最終確認・手直し**する。
- 敵 / アイテム / 欠片 / UI は **procedural-first** で基礎品質を底上げしつつ量産可能にする。
- script-assisted な仕上げと、人間のGUI手仕上げを**別物として明確に分ける**。
- 今回 production には**一切反映しない**（基盤づくりのみ）。

---

## 1. 2つのルート（絶対に混同しない）

### A. Human GUI hand-finish route（人間ルート）

- 対象: **player / main character**（=作品の顔）。
- 人間が Aseprite GUI で 1px 単位の手仕上げを行う。
- これだけが `hand-final` を名乗れる。
- 参考: [yui-52px-v2a-human-aseprite-guide.md](../reviews/design-team/yui-52px-v2a-human-aseprite-guide.md) /
  [yui-52px-v2a-gui-handfinish-handoff.md](../reviews/design-team/yui-52px-v2a-gui-handfinish-handoff.md)

### B. Script-assisted finish route（量産ルート）

- 対象: **enemy / item / 欠片 / UI / prop / background**、および主役級の**叩き台底上げ**。
- Aseprite Lua / extension / CLI が、recipe と finishing pass に従って機械的に仕上げる。
- 産物は **`script-assisted-candidate` 止まり**。`hand-final` でも `GUI hand-finish` でもない。
- finisher: [`scripts/aseprite/vamp-pon-pixel-finisher.lua`](../../scripts/aseprite/vamp-pon-pixel-finisher.lua)

> **禁止**: Lua / plugin / CLI 生成だけのものを `hand-final` / `GUI hand-finish` / `final` と呼ぶこと。
> player / 主役級は B で底上げしても、最終的に **A（人間）を通さない限り production に上げない**。

---

## 2. 人間がやる領域 / script がやる領域

| 領域 | 人間（A） | script / plugin（B） |
| --- | --- | --- |
| 方向性・参考選定・世界観判断 | ◎ | × |
| player / 主役級の最終1px | ◎（必須） | △（叩き台のみ） |
| 80点rubric / 採否の最終判断 | ◎ | ×（採点しない） |
| 敵 / アイテム / 欠片 / UI の量産 | レビューのみ | ◎ |
| silhouette tighten / sheen cluster / eye dot / glow trim 等の定型仕上げ | △ | ◎ |
| palette / outline / glow / hitCore / 背景分離の機械チェック | レビュー | ◎ |
| canvas / layer / export / sprite sheet / review sheet 生成 | × | ◎ |

script は **final visual appeal / silhouette / charm / merchandise を判断しない**（CLAUDE.md §3）。

---

## 3. アセット種別ごとの制作ルート

| importance | 例 | 推奨ルート | humanReviewRequired |
| --- | --- | --- | --- |
| `player` | ユイ | recipe → procedural finish → **人間GUI手仕上げ** → 人間レビュー | **必須** |
| `main` | アサ / ナギ | recipe → procedural finish → 人間レビュー（必要なら手仕上げ） | **必須** |
| `side` | サブNPC | recipe → procedural finish → 人間スポットレビュー | 推奨 |
| `enemy` | ink_blob 他4系統 | recipe → procedural finish → quality gate | 任意（バッチ可） |
| `item` | 欠片 / pickup | recipe → procedural finish → quality gate | 任意 |
| `effect` | glow / hit | procedural → gameplay視認チェック | 任意 |
| `ui` | HUD / アイコン | procedural → 1x可読チェック | 任意 |

---

## 4. Asset status 分類

production に近づくほど上。**status を勝手に飛ばさない**。

| status | 意味 | 誰が付ける |
| --- | --- | --- |
| `generated-draft` | AI画像 / 初期Lua bootstrap。reference扱い。 | script |
| `procedural-prototype` | recipe無しの形状prototype。 | script |
| `script-assisted-candidate` | finisher pass を通した叩き台。**hand-final ではない**。 | script |
| `human-reviewed-candidate` | 人間がレビューしKeep判定。手仕上げは未/一部。 | 人間 |
| `production-candidate` | 80点rubric通過。production昇格を検討してよい。 | 人間 |
| `hand-final` | 人間がGUIで1px手仕上げ済み。**Aのみ到達可**。 | 人間 |
| `rejected` | 不採用。理由を残す。 | 人間 / gate |

> script だけで到達できる上限は **`script-assisted-candidate`**。
> `human-reviewed-candidate` 以上は人間の判断が必須。

---

## 5. production 昇格条件

次を**すべて**満たした時のみ production 反映を検討する（今回は実施しない）。

1. status が `production-candidate` 以上。
2. 80点rubric（CLAUDE.md §4 / agent-quality-brief）を通過。
   1x可読性 / role clarity / visual appeal / ゲーム中視認性 / 背景分離 / 同一画風 が全て4以上。
3. player / main は **人間のGUI手仕上げ + 人間レビュー**を経ている。
4. reference との差分がレビューされている。
5. gameplay定数を巻き込んでいない（§7）。
6. review doc に `Production touched`, `Keep/Discard`, `Final decision` が明記されている。
7. quality gate（`pnpm pixel-art:pipeline:verify` 他）が緑。

production への画像書き出しは、上記合意後に**別タスク**で行う。本pipeline作業中は禁止。

---

## 6. NG条件（このどれかに当たれば昇格不可）

- script / CLI 生成だけのものを `hand-final` / `GUI hand-finish` / `final` と称した。
- 合成後に 1px で役割が読めない / シルエットで種類が分からない。
- 黒いだけの敵 / dominant blob shape で止まった敵。
- 背景に沈む / プレイヤーと混ざる。
- glow が hitCore 中心や pickup と誤認される。
- 1px ノイズが多い / AA的に濁った / AI画像を縮小しただけ。
- before/after が弱い、報告だけ立派。
- production protected path（§7）を触った。

---

## 7. 共通ルール: palette / outline / glow / hitCore / 背景分離

- **palette**: キャラは recipe の palette に従う。同一ファミリーは色を共有。むやみに色数を増やさない。
- **outline**: 1px。Aの2px厚アウトラインは禁止。暗背景分離は outline より rim light を優先。
- **glow**: tight に保つ。最外周は弱める。hitCore 中心や pickup へ届かせない。
- **hitCore / debugHitCircle**: 見た目要素（ランタン等）を hitCore と誤認させない。中心はクリーンに。
- **背景分離**: 背景は低コントラスト・装飾控えめ（CLAUDE.md §7）。キャラ側は rim light で浮かせる。
- **gameplay定数**: `PLAYER_DEFAULTS.*` / pickup の collectRadius / magnetRange / magnetSpeed /
  `hitCore` / `debugHitCircle` は**見た目作業で変更禁止**。`visualSize` は明示タスク時のみ。

protected path（書き込み・変更禁止 / pipeline作業中）:

- `public/assets/sprites/player/`
- `assets/source/aseprite/player/`
- `src/game/domain/constants.ts`

---

## 8. review sheet 条件

procedural finish を出したら、必ず review sheet を作る（[build-pixel-finisher-review-sheet.lua](../../scripts/prototypes/build-pixel-finisher-review-sheet.lua)）。

- before（元prototype）1x / after（PF）1x
- before/after 6x 拡大
- 夜街背景 / インク斑背景 上での見え方
- 欠片 pickup を隣に置いた誤認テスト
- hitCore 中心点オーバーレイ
- 差分が分かる部位拡大（フード / 目 / 手 / ランタン / 前髪）

---

## 9. character recipe

キャラを増やすための見た目仕様を JSON 化する。

- schema: [`data/pixel-art/character-recipes.schema.json`](../../data/pixel-art/character-recipes.schema.json)
- recipes: [`data/pixel-art/character-recipes/`](../../data/pixel-art/character-recipes/)（yui / asa / nagi）

recipe は finisher / 将来の generic mode が参照する「固定アイデンティティ」「禁止事項」「レビュー優先度」の単一の出所。

---

## 10. ユイ V2a を基準にする場合の注意

ユイ 52px V2a は現状の最有力 prototype。今後の基準にしてよいが:

- V2a 自体はまだ `script-assisted-candidate`（PF適用後）/ `procedural-prototype`（PF前）。**hand-final ではない**。
- 基準として使うのは「固定アイデンティティ（青フード・茶赤前髪・右手ランタン等）」と「画風（soft painterly / 1px outline / tight glow / rim 分離）」。
- V2a の**寸法や hitCore を他キャラの gameplay 既定値として流用しない**。見た目基準と gameplay は別。
- player として production に上げる前に、必ず人間GUI手仕上げ + 人間レビューを通す。

---

## 11. ツールと検証コマンド

| コマンド | 役割 |
| --- | --- |
| `pnpm aseprite:pixel-finisher:yui52` | ユイV2aに procedural finish を適用し `_pf` を生成 |
| `pnpm aseprite:pixel-finisher:verify` | finisher の出力（`_pf` source/png）が存在するか確認 |
| `pnpm pixel-art:pipeline:verify` | pipeline 一式（doc / schema / recipe / finisher / extension / 出力 / review）＋ production未変更 |
| `pnpm prototype:verify` | prototype 成果物 + production 非変更 |
| `pnpm design:review:verify` | review doc の体裁 |
| `pnpm player:protected:verify` | production player資産 / gameplay定数の非変更 |

extension skeleton: [`tools/aseprite-extension/vamp-pon-pixel-finisher/`](../../tools/aseprite-extension/vamp-pon-pixel-finisher/)
（将来 Aseprite メニューから B ルートを実行するための雛形。GUI hand-finish ではない）

---

## 12. まとめ（運用の一言）

> **全部を人間が手作業はしない。だが player / 主役級 / 最終判断は必ず人間が見る。**
> script は基礎品質を底上げして量産を回す。`script-assisted-candidate` の壁を越えるのは人間だけ。
