# ヨルノシルベ — 朔夜座 / 群青残響録 Visual Master Plan v1

Status: **CURRENT NAMING CORRECTION / LIST ONLY / NO IMAGE GENERATION**

この文書は画像生成を開始するための許可ではない。Visual Production台帳に残っていた旧称と、未登録だった群青残響録のVisual Master familyをCurrent Story authorityへ合わせるための制作整理である。

## 1. 朔夜座

Season 1の正式な主要敵チーム名は **朔夜座（さくやざ）**。

Current 8 members:

1. ナシロ
2. アサトジ
3. ミチグレ
4. オリネ
5. ハクマ
6. ツグリ
7. ユラネ
8. ペタ

旧 `夜綴りの八影 / 八影 / Yatsukage` はearly observer label / legacy compatibilityとしてのみ保持する。Currentの制作カテゴリ名、表示名、最終設定画名へ戻さない。

### 朔夜座で必要なMaster

- 8人それぞれのFinal Character Master
  - face / eye architecture
  - hair
  - body / height band
  - posture
  - clothing construction
  - colors
  - silhouette
  - signature prop
  - hand / footwear language
  - damage / wear
  - expression range
  - combat motion
  - pair contrast
- 8人集合比較Master
  - shared vs individual visual grammar
  - height / body / silhouette rhythm
  - pair contrast
  - color/material overlap boundary
  - shared symbolはFinal承認前なので勝手に固定しない

Enemy DBの既存8 recordsと同一人物lineageを共有する場合、同じ画像を別名コピーして二重Master化しない。Character-like setting masterとgameplay enemy derivativeの役割を分ける。

## 2. 群青残響録

**群青残響録（ぐんじょうざんきょうろく）**は組織名・敵チーム名ではない。

各時代の大事件で中心となった人物 / 人物群 / 制度 / system / social pressure等を、事件後の記録・観測・シリーズ構造上から括る **record taxonomy**。

したがって、今の段階で以下を作ってはいけない。

- 群青残響録メンバー集合絵
- 5人固定Boss絵
- 共通制服
- 本部
- 組織章 / 所属バッジ
- 固定メンバー肖像一覧
- 全員敵としてのデザイン

正式member数、formal member、exact incident、exact year等はOPEN。

## 3. 群青残響録で先に作るVisual Master

### GZ-M01 — Record Taxonomy / Graphic System Master

AI一枚絵より **SVG / HTML / editable layout** を優先する。

含めるもの:

- 「群青残響録」のname treatment
- Era / Incidentの索引構造
- central person / multiple people / institution-system / social-pressure等の分類表現
- Source / Evidence / OPEN / disputed等の記録状態表現
- 資料によって中心人物評価が違う場合のambiguity表現
- 朔夜座とのrelation欄。ただし上下組織に見せない
- Incident central roleとCombat Boss roleの分離
- spoiler tier

### GZ-M02 — Record Medium / Evidence Material Master

時代ごとの記録媒体を一つの“秘密組織文書”へ均さないための設定資料。

Source-backedで扱う候補:

- newspaper
- photo
- company / institution document
- minutes
- old book / atlas
- incident record
- future digital record

含めるもの:

- paper / print / photo / archive / digital recordの材質差
- provenance
- correction / replacement trace
- missing / redacted / disputed record
- call name → surname clue → kanji/full-name revealの視覚境界

exact人物名・日付・場所等がOPENなら焼き込まない。

## 4. Incident確定後に増えるMaster

`gunjo-incident-{incidentId}-record-board-v1`

Incident単位で追加する。現在の件数は **TBD**。

追加条件:

1. Era / Incidentがauthoritativeに定義済み
2. central person/group/systemが定義済み
3. source/evidence boundaryが定義済み
4. 朔夜座relationが既知または明示的UNKNOWN
5. combat roleとincident roleが分離済み
6. spoiler tierが定義済み

OPENを埋めるために画像モデルへ人物・事件・年代を発明させない。

## 5. 攻略 / Lorebook / DB派生

Master完成後に必要に応じて:

- 群青残響録 index
- Incident dossier / detail page
- Source / Evidence panel
- record ambiguity comparison
- spoiler-safe record card / thumbnail

以下は画像化せずHTML/CSS/SVG/dataを基本とする:

- taxonomy hierarchy
- record index
- evidence badge
- timeline/date text
- relation line
- source citation
- long document copy

## 6. 重複防止

- 同じ人物・敵・資料画像を用途ごとにコピーしない。
- Registryの1 assetへ複数 `usageTargets` を付ける。
- 別pathでも同一binaryならSHA-256重複検知対象。
- 変更はversion increment + `replaces / supersededBy`。
- Legacy画像はlineageを保持してもCurrentへ自動復帰しない。

## 7. Authority

Current Story authority:

- `docs/sakuyaza-current-identity-v1.md`
- `docs/gunjo-zankyoroku-current-v1.md`
- `docs/00-current-story-world-master.md`
- `src/game/data/sakumeiCandidateSource.ts`
- `src/game/data/storyWorldMasterSource.ts`

Machine visual overlay:

- `data/character-assets/manifests/visual-current-group-record-master.v1.json`

この境界より古い `八影 / Yatsukage` source名はcompatibility inputであり、Current名称のAuthorityではない。
