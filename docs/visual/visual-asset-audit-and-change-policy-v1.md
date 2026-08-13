# ヨルノシルベ Visual Asset Audit / Change Policy v1

Status: **CURRENT WORKING GOVERNANCE / NO AUTOMATIC IMAGE GENERATION**

この文書は、画像・設定画・派生素材を増やしても「同じ画像を何度も作る」「何が入っているか分からなくなる」「差し替えで古い正本が復活する」を防ぐための運用ルールです。

## 1. 何を見れば現在地が分かるか

用途ごとに見るファイルを固定します。

1. `data/character-assets/manifests/visual-asset-master-registry.v1.json`
   - 実際に登録されたVisual Asset
   - `id / subjectId / kind / current / reviewStatus / sourceOfTruth / derivedFrom / files / replacementPolicy / approvalBoundary`
2. `data/character-assets/manifests/visual-image-production-list.v1.json`
   - 既存の生成計画。Character Pack / Lorebook / Gameplayを含む決定論的一覧
3. `data/character-assets/manifests/visual-generation-count-baseline.v1.json`
   - Master / Guide / TOP / Gameplay全体の母数と現時点の正確な数・TBD境界
4. `data/character-assets/manifests/visual-pre-game-master-expansion-queue.v1.json`
   - 元の480行だけでは不足する、ゲーム制作より先に必要なMaster群
5. `data/character-assets/manifests/visual-item-lineage-review-queue.v1.json`
   - 同名Itemを安易に二重生成しないためのlineage審査
6. `docs/visual/visual-generation-master-backlog-v1.md`
   - 人間が読みやすい全体制作順・分類

GitHubの履歴は「いつ何を追加・変更したか」の監査履歴として使い、上記manifestは「今の状態」の正本一覧として使います。

## 2. 同じ画像を作らないルール

- 同じ画像を複数用途で使う場合、画像をコピーしない。
- 1つのAsset Recordの`usageTargets`を増やして再利用する。
- 同じVisual binaryを別Asset IDとして登録しない。
- 同じファイルpathを別Visual Assetへ登録しない。
- 同じSHA-256の画像を別pathへコピーして別Assetとして登録しない。
- Itemは名前が同じだけでは自動統合しない。`visual-item-lineage-review-queue.v1.json`で物理的同一性・進化状態・別物を審査する。
- 八影8体はEnemy 48体のsubsetであり、48+8として二重計上しない。
- Named ObjectとCharacter Itemはownerやモチーフが近いだけでは自動統合しない。
- TOP / Loading / Guide / Gameplayは、承認済みMasterから派生させる。用途が違うだけで同じ正本画像を再生成しない。

## 3. 差し替えのルール

Visual Asset IDは`...-vN`でversion管理します。

差し替える場合:

- 既存Assetのファイルを黙って上書きしない。
- 新versionを作る。
- `replacementPolicy.replaces`と旧Assetの`supersededBy`を双方向に接続する。
- 旧Assetは`current=false`へ移す。
- 同一`subjectType + subjectId + kind`で`current=true`を複数持たない。
- rejected / archived / superseded Assetをgeneration parent・Golden Reference・Final・Runtimeへ戻さない。
- Masterを差し替えてもLorebook / TOP / Gameplayを自動承認しない。派生物は個別に再検証する。

## 4. 追加・変更時のFail-Closed

`Visual Asset Master Registry` CIで以下を確認します。

- Registry / Coverage / Production Listがsourceから再生成可能で、hand editによるdriftがないこと
- Asset ID重複がないこと
- current Assetの重複がないこと
- source / parent / replacement参照が解決すること
- replacement linkが双方向で循環しないこと
- registered fileが存在すること
- hash付きfileは実binaryと一致すること
- Visual binary pathの二重登録がないこと
- 別pathでもSHA-256が同一なら二重Visual Assetとして拒否すること
- Character / Enemy / Item / Stage / Star Beast / Named Object / Toumonの母数がsource変更に追従していること
- 八影subsetがEnemyへ二重加算されていないこと
- Item同名collisionがlineage review queueへ全件出ていること
- Item lineageを自動統合していないこと
- Asset Factory contract数がsource/kind変更後も一致すること

source側でキャラ・敵・Item・Stage等を増減したのに台帳を更新し忘れた場合、CIを失敗させます。

## 5. 画像生成前の確認順

1. Source Authorityを確認
2. Registryで既存Asset / current / superseded / rejectedを確認
3. Production List / Expansion Queueで対象が既に予約済みか確認
4. Itemならlineage queueを確認
5. 既存binary / hashを確認
6. `EXISTS_REUSE`なら生成しない
7. `BLOCKED_AUTHORITY`なら生成しない
8. `MISSING_GENERATE`だけprompt authoringへ進める
9. 候補生成後はQA/Human Reviewを通す
10. 承認後もFinal/Runtimeは別gate

## 6. 制作順

固定順序:

`MASTER SETTING BOOK → GUIDE / LOREBOOK / DB → TOP / LOADING / PRESENTATION → GAMEPLAY DERIVATIVES LAST`

ゲーム用画像をVisual Authorityへ逆輸入しません。

## 7. Yui

Yuiの既存rejectはlearning-onlyで保持します。現在の一覧化・governance作業中は再生成しません。過去rejectを削除して履歴を失わせたり、Golden/Parentへ戻したりしません。
