# ヨルノシルベ Visual Asset Generation Foundation v1

Status: **CHARACTER DESIGN MASTER PACK FOUNDATION CONNECTED / YUI SHEET 01 PREPARED / NO STORY OR RUNTIME PROMOTION**

## 目的

ゲーム・アニメ・Lorebook・Gameplay派生が長期に参照できるCharacter Design正本を、画像1枚や複数の独立Masterへ分裂させずversion管理する。

```txt
SOURCE OF TRUTH
→ CHARACTER DESIGN MASTER PACK
→ OVERVIEW READ MODEL / LOREBOOK DERIVED / GAMEPLAY DERIVED
```

- 1 characterにつき1つの論理的なCharacter Design Master Packを持つ。
- Packのvisual evidenceは4枚のsource sheetであり、4つの独立Character Masterではない。
- Overviewは決定論的read modelで、source、generation parent、authorityではない。
- Lorebook / Gameplay childは承認済みPackだけを直接親にし、`parentPackId`、`parentPackHash`、`usedSheetIds`を固定する。
- partial Packはderivative parentになれない。現在のplanned childはactual parent fieldsをnull/emptyのまま保持する。
- Visual approvalはStory Canon、final、runtimeを昇格しない。

## Character Design Master Pack

Packは次の4 roleをuniqueに1枚ずつ要求する。

1. `identity-turnaround`: neutral front / anatomical left / anatomical right / back。同一縮尺、共通ground/proportion line、同一人物構造、body-relative equipment固定、mirror禁止。
2. `face-expression-acting`: neutral front、左右3/4、左右profile、目・眉・口・固有landmark・表情・年齢印象・nearest-face distinction。
3. `costume-equipment-material`: layer front/back/inside、留め具、収納、靴、手元、palette/material/wear/repair、hold/stow/use。固有物体のorthographicはObject Masterへ分離する。
4. `silhouette-motion-derivation`: one-color silhouette、rest/locomotion/signature interaction/action/exertion/hurt/recovery、motion signature、portrait/icon crop、gameplay-size proof。

Sheet 01はHuman identity/construction approvalを得るまでSheet 02–04を生成しない。各sheetのHuman review、cross-sheet consistency review、Pack reviewを別々に行う。承認済みsheetはimmutableで、差替えはversionを上げる。

例: Face sheet v2と他sheet v1でPack v2を作る。Packの`replaces` / `supersededBy`は双方向にする。Overview layoutだけの変更はOverview versionのみを上げる。

## 基盤ファイル

- `src/game/data/visualAssetGenerationInventory.ts`: projection source。
- `data/character-assets/manifests/visual-asset-master-registry.v1.json`: logical Packとreject記録の中央registry。
- `data/character-assets/manifests/visual-asset-coverage.v1.json`: Pack + 4 sheet + Overviewの36人coverage read model。
- `data/character-assets/manifests/visual-character-prompt-packets.v1.json`: 36 Pack planとstructured authority snapshot。
- `data/character-assets/manifests/visual-image-production-list.v1.json`: 36 logical Pack、144 source sheet evidence、36 Overview、その他Visual派生のproduction plan。
- `data/character-assets/manifests/visual-generation-batches.v1.json`: 14 batch予約。全batchは停止中。
- `data/character-assets/reviews/yui-character-design-master-pack-v1.json`: Yui Sheet 01 Turnaround prompt packet。

5 manifestは手編集しない。再生成・検査:

```sh
pnpm visual-assets:inventory:export
pnpm visual-assets:check
```

## Authority / Lineage

各upstream snapshotは`sourceId`、`path`、`contentHash`、`authorityClass`、`consumedFields`を持つ。Story値をVisual側の新しい正本として複製しない。

生成時Lineageはparent IDs/hashes、authority source/commit/hash/consumed fields、prompt/reference/output hashes、generator/version/seed（取得可能な範囲）、automatic QA、Human decision scope、replacement linkage、reject ledgerを記録する。

## Yui境界

- dominant handは`OPEN_NO_SOURCE`。保持物から推論しない。
- Lanternはanatomical RIGHT hand。Paperはanatomical LEFT hand。
- Strapはanatomical RIGHT shoulder → anatomical LEFT waist。Bagはanatomical LEFT waist。
- Frontではbody-right = viewer left。Backではanatomical right = viewer right。
- 年齢印象は`YOUNG_ADULT`。
- soft oval、rounded cheeks、non-pointed chin、smaller almost-level almond-round brown eyes、tapered double eyelids、soft straight brows、warm-dark asymmetric bob、one ear tuck、bilateral smile dimplesをidentity anchorとする。
- generic V jaw、giant eyes、missing dimples、side duplication/mirror、装備左右矛盾はhard veto。
- Sheet 01だけがauthoring/generation準備可能。Sheet 02–04と全derivativeはTurnaround Human approval待ち。

過去のYui Full Body v2 4候補は全件rejectのlearning-only記録であり、Master、parent、Golden、Story、final、runtimeに使わない。

## Hard veto

- required sheet欠落またはrole重複
- duplicated/mirrored side、hard identity landmark欠落、cross-sheet別人化
- body-relative equipment conflict
- Open/CandidateをCurrentとして描写
- lineage/hash不整合
- OverviewをMasterまたはparent登録
- Pack approvalからchild final/runtimeを自動昇格
- partial Packのderivative parent化

## 客観検査のみ

checkerはID、role uniqueness、source/hash、lineage/version/replacement、parent gate、Yui equipment/identity lock、Story/final/runtime境界を検査する。quality score、completion %、popularity score、台詞やpromptの最低文字数は使わない。
