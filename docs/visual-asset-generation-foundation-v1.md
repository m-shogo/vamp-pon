# ヨルノシルベ Visual Asset Generation Foundation v1

Status: **INVENTORY CONNECTED / ONE REJECTED YUI TEST BATCH RECORDED / NO STORY PROMOTION**

## 目的

設定変更に耐えられる形で、画像生成前のAuthority確認、asset ID、派生関係、coverage、batch、prompt packet、QA、reject、置換履歴を一つの系へ接続する。

```txt
SOURCE OF TRUTH
-> MASTER
-> LOREBOOK READ MODEL
-> GAMEPLAY DERIVED
```

Lorebook画像をGameplay派生の親にしない。画像の出来栄えを理由にStoryをCanonへ昇格しない。

## 基盤ファイル

- `data/character-assets/manifests/visual-asset-master-registry.v1.json`: 中央DAG。
- `data/character-assets/manifests/visual-asset-coverage.v1.json`: 必要画像チェックリスト。coverageは品質評価ではない。
- `data/character-assets/manifests/visual-generation-batches.v1.json`: 生成batch予約。
- `data/character-assets/manifests/visual-character-prompt-packets.v1.json`: 36人のAuthority snapshotとprompt packet下書き。
- `data/character-assets/manifests/visual-image-production-list.v1.json`: 生成担当が上から処理する画像リスト。asset ID、batch、parent、output、4候補、QA、blockerを保持。
- `data/character-assets/templates/visual-asset-record.template.json`: asset record。
- `data/character-assets/templates/visual-prompt-packet.template.json`: prompt packet。
- `data/character-assets/templates/visual-generation-batch.template.json`: batch record。
- `data/character-assets/templates/visual-qa-record.template.json`: QA。
- `data/character-assets/templates/visual-reject-ledger.template.json`: reject理由。

5 manifestは手編集する正本ではない。`src/game/data/visualAssetGenerationInventory.ts`が既存Author DBとVisual Design Masterを束ねる投影定義で、次のコマンドから再生成する。

```sh
pnpm visual-assets:inventory:export
pnpm visual-assets:check
```

checkerは投影結果との完全一致を検査する。Character / Era / Reality Root等の正本が変わった時にmanifestだけ古い状態で残ることを許可しない。

## 接続済み正本

| 軸 | 正本 | 接続範囲 |
|---|---|---|
| Character identity | `characterAuthorDbCoverageManifest.ts` | 36人、Author ID、stable ID |
| Physical identity | `characterAppearanceGenerationContracts.ts` | 36人、face/body/age/species/forbidden drift |
| Era | `characterEraForeshadowDialogueReservoir.ts` | 36人、laneとCurrent/Candidate/Open |
| Reality Root | `characterRealityRootRegistry.ts` | 36人、rootとstatus。birthplace/incident areaとは分離 |
| Theme Color | `characterThemeColorReservoir.ts` | 36人、全件Author Reservoir・final未承認 |
| Reference production | `characterReferenceProductionQueue.ts` | Current20の既存/不足/再審査とpriority |
| Existing master | `core5-character-master-assets.json` | Core5 Master Board 5枚をreference-onlyで登録 |
| Named Object | `namedObjectVisualSharedSource.ts` | Current21 luminous possession 21件のgeometry candidate |
| Star Beast | `starBeastVisualSharedSource.ts` | Current20 + Official Reserveの形態source。画像は未生成 |
| Group authority | `storyWorldMasterSource.ts` / `yatsukageIdentitySource.ts` | 朔夜座8人と群青残響録taxonomy |

`subjectAliases`には `yuubi/yubi`、`kaname/kage1`〜`tsumugi/kage4`、Future15の`F01`〜`F15`を自動接続する。別名を別人として数えない。

未merge PRのデータはmainの正本として複製しない。PR #302のLiving Visual roster/profileがmainへ入った後、同じprojection moduleへsource adapterを追加する。

## 現在の実インベントリ

- Character coverage: 36/36行。ただし割合を品質評価には使わない。
- Core5既存Master Board: 5件。ユイはreference承認済み、他4人はboundary review待ち。全件final/runtime/currentではない。
- Theme Color: 36件は候補として接続。色だけでidentityを作らない。
- Named Object geometry: 21件は候補として接続。画像完成とは数えない。
- Star Beast silhouette source: Current20 + Reserveはsource有り。Star Beast Master画像完成とは数えない。
- Batch 01〜14: `planned-not-started`、`generationAllowed=false`。画像生成は停止中。
- Character prompt packet: 36/36件。主promptはAuthority/Visual Language審査後に確定し、現状は生成禁止。
- Yui Full Body v2 test: 4候補を生成したが全件reject。画像、prompt、QA、reject理由は`assets/import-staging/batch-character-master/yui/rejected-v2/`と`data/character-assets/reviews/`に保持し、Master parent/final/runtimeには使わない。

既存のAsset Generation Contract、Golden Reference、Generation Lineage、candidate intake、U48 runtime approval chainは置換しない。この基盤はそれらを横断して追跡するindexである。

## 画像生成前チェックリスト

1. 最新mainとsource commitを記録する。
2. Story AuthorityとOpen/Candidate/Researchを分離する。
3. asset IDとversionを予約する。
4. `sourceOfTruth`を指定する。
5. parentを指定する。Masterは`derivedFrom=[]`。
6. 実画像referenceを確認し、それぞれの役割を宣言する。
7. prompt packetを作る。変更可能な設定はAuthority snapshot側に置く。
8. 同一prompt/contractの4候補を予約する。
9. QA recordとreject ledgerの保存先を予約する。
10. output staging pathを予約し、既存asset上書きを禁止する。
11. `pnpm visual-assets:inventory:export`で正本を投影し、`pnpm visual-assets:check`を通す。
12. ここで生成前の人間判断が必要なら止める。

## 生成後チェックリスト

1. `generated-unreviewed`として登録する。
2. output hashとGeneration Lineageを記録する。
3. identity / face / body / age / silhouette / costume / props / Eraを目視QAする。
4. small-size、alpha、edge、text/watermarkを技術QAする。
5. reject理由をledgerへ残す。
6. 4候補比較を行う。
7. Human review前に`approved-current`へ上げない。
8. Master承認後にだけLorebook/Game派生を作る。

## 承認待ちになる地点

- 画像生成の開始。
- Candidateの選別・採用。
- Story重大Canon決定。
- `approved-current`、final、runtimeへの昇格。

Registry、coverage、template、checker、CIの作成自体は承認待ちにしない。

## Status境界

- 初期状態は`needs-generation`。
- 生成直後は`generated-unreviewed`。
- 自動QAだけで`approved-current`にしない。
- `current=true`はHuman review済み`approved-current`だけ。
- Story Candidate/Research/OpenはVisualが良くてもStory Canonにならない。
- Gameplay derivativeはMasterを直接親にする。

## Replacement

既存ファイルを上書きしない。新versionを追加し、`replaces`と`supersededBy`を双方向で記録する。置換cycleは禁止。

## 客観検査のみ

許可: duplicate ID、missing source/file/parent、invalid layer/status、DAG cycle、orphan derivative、duplicate current、置換不整合、coverage ID/slot不整合。

禁止: 台詞やpromptの文字数、完成率、quality/popularity score、長いほど良いという判定。
