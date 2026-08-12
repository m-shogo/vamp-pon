# ヨルノシルベ Visual Asset Generation Foundation v1

Status: **FOUNDATION ONLY / NO IMAGE GENERATED / NO STORY PROMOTION**

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
- `data/character-assets/templates/visual-asset-record.template.json`: asset record。
- `data/character-assets/templates/visual-prompt-packet.template.json`: prompt packet。
- `data/character-assets/templates/visual-generation-batch.template.json`: batch record。
- `data/character-assets/templates/visual-qa-record.template.json`: QA。
- `data/character-assets/templates/visual-reject-ledger.template.json`: reject理由。

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
11. `pnpm visual-assets:check`を通す。
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
