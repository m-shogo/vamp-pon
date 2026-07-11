# ヨルノシルベ Asset Generation Consistency System v1

Date: 2026-07-10  
Status: adopted / source of truth for generated visual assets

## 目的

画像生成モデルの出力を完全に同一にはできない。代わりに、生成の自由度を契約内へ閉じ込め、別人・別画風・別ゲーム・未承認runtime混入を防ぐ。

この仕組みは次を固定する。

1. Asset Generation Contract
2. Golden Reference Registry
3. Generation Lineage
4. 4候補比較
5. 自動QAと人間レビュー
6. candidate / final / runtime approvalの分離
7. prompt、reference、generator、source commitの追跡

## 絶対ルール

- 1枚生成して即final採用しない。
- 1生成単位につき原則4候補を作る。
- Golden Referenceなしでfinal承認しない。
- identity referenceなしでキャラ・敵・アイテム・ステージ固有assetをfinal承認しない。
- Lineage manifestなしでfinal承認しない。
- 自動QAと人間レビューの両方なしでfinal承認しない。
- `approvedAsFinal=false` と `runtimeApproved=false` を初期値にする。
- candidate画像をproduction runtimeへ直接接続しない。
- promptだけを変更して同じasset IDを上書きしない。Contract versionまたはasset versionを上げる。
- Golden Referenceはversionを上げずに差し替えない。
- UI全画面を画像生成して文字・ボタン・状態を焼き込まない。

## Source of truth

| Layer | Source |
| --- | --- |
| Unified prompt catalog | `src/game/data/assetFactoryCatalog.ts` |
| Asset Generation Contract | `src/game/data/assetGenerationPolicy.ts` |
| Contract summary snapshot | `data/asset-factory/generation-contracts.summary.json` |
| Golden Reference Registry | `src/game/data/goldenReferenceRegistry.ts` |
| Contract export | `scripts/asset-factory/export-generation-contracts.ts` |
| Lineage creation | `scripts/asset-factory/create-lineage-record.ts` |
| Lineage template | `data/asset-factory/generation-lineage.template.json` |
| Static checker | `scripts/quality/check-asset-generation-consistency.ts` |
| Asset Factory tracking fields | `tools/asset-factory/src/types.ts` |

## 1. Asset Generation Contract

Prompt Catalogの全recordに、機械的に1つのContractを生成する。

Contractには以下を含める。

- contract ID / version
- policy version
- prompt catalog key
- content type / source ID / kind
- output path / size spec
- 世界観・palette・禁止表現
- required reference set
- 4候補生成
- generator name / version
- prompt hash / reference hash
- seed記録方針
- alpha / text / logo / edge contact条件
- automatic QA / human review
- final / runtime承認境界

Contract ID:

```txt
asset-contract:<contentType>:<sourceId>:<kind>:v1
```

Prompt本文を直接コピーして運用ルールを付け足さない。必ずCatalog recordからContractを導出する。

## 2. Global Style Lock

全素材共通:

- 紙片・絵本風ドット
- 夜、記憶、黒インク、小さな暖色光
- 390x844の実寸で読める
- matte paper / ink texture
- 暗いが怖すぎない
- 通常画面は静か
- textless production asset

固定palette:

| Role | Color |
| --- | --- |
| Quiet Night | `#080708` |
| Black Ink | `#050405` |
| Paper Base | `#D6C29A` |
| Paper Edge | `#785734` |
| Lantern | `#FFA13D` |
| Morning After | `#E6C48C` |
| Rare | `#D49348` |
| 黒耀化 | `#6F466F` |

禁止:

- text / number / logo / watermark
- 高彩度ネオン中心の別ゲーム配色
- realistic photo / glossy plastic
- baby-like proportions
- 市松模様、白背景、白フリンジ
- UI全画面の焼き込み
- キャラの髪型、持ち物、左右配置、頭身の無断変更

## 3. Golden Reference Registry

Golden Referenceは「生成時に必ず比較する基準」であり、runtime final assetと同義ではない。

各reference assetは必ず次を分ける。

```txt
approvedForReference=true/false
approvedForRuntime=false
```

現行global set:

```txt
global:visual-style-v1
```

参照:

- `docs/design-targets/generated/top-final.png`
- `docs/design-targets/generated/kokuyou-cutin-final.png`
- `docs/88-adopted-visual-direction.md`
- `docs/181-current-production-canon.md`
- `docs/unity-ui-design-system-v1.md`

UIはU45のStageSelect / Battle HUD / LevelUp screenshotをcandidate referenceとして登録している。candidate referenceは構成比較には使えるが、candidate画像のfinal承認ではない。

### Identity reference

各Contractは次のreference set IDを要求する。

```txt
<contentType>:<sourceId>:identity-v1
```

例:

```txt
character:yui:identity-v1
enemy:ombu_small_ink:identity-v1
item:starter_gear_yui_夜の鉛筆:identity-v1
stage:forgotten_street:identity-v1
```

未登録でもcandidate生成は可能。ただしfinal承認は機械的にblockする。

Identity referenceを追加するときは、次を固定する。

- キャラ: 顔、髪型、頭身、持ち物、左右配置、主色、光の形
- 敵: family silhouette、腕・芽・影炎、顔、サイズtier
- アイテム: 単一物体、モチーフ、輪郭、主色、機能の見え方
- ステージ: 地形、palette、視認性、前景密度、光源

Golden Referenceの画像を差し替える場合は既存setを上書きせず、`v2`を作る。

## 4. Generation Lineage

生成画像1件につき、隣接するLineage manifestを作る。

例:

```txt
public/assets/prototypes/characters/yui/cutins/yui-cutin-v3.png
public/assets/prototypes/characters/yui/cutins/yui-cutin-v3.png.lineage.json
```

必須記録:

- asset ID
- prompt catalog key
- contract ID / version
- policy version
- prompt SHA-256
- generator name / version
- seed（対応時）
- source commit
- output SHA-256
- reference set IDs
- reference asset SHA-256
- required candidate count
- comparison sheet
- automatic QA
- human review
- issues
- final/runtime approval

作成:

```sh
pnpm asset-factory:lineage:create -- \
  --key character:yui:normal_cutin \
  --output public/assets/prototypes/characters/yui/cutins/yui-cutin-v3.png \
  --generator codex-image \
  --generator-version 2026-07 \
  --reference-sets global:visual-style-v1,character:yui:identity-v1 \
  --candidate-id yui-normal-cutin-v3
```

Lineage CLIは必ず次で作成する。

```txt
review.status=candidate
approvedAsFinal=false
runtimeApproved=false
finalApprovalBlocked=true
```

CLIからfinal承認する機能は作らない。

## 5. 4候補比較

原則:

```txt
candidate-a
candidate-b
candidate-c
candidate-d
```

同じContract、同じreference set、同じgenerator versionを使う。候補ごとにpromptを手直ししない。

比較sheetには最低限:

- 4候補
- Golden Reference
- gameplay size preview
- palette swatch
- candidate ID
- prompt hash
- generator/version
- reject理由

を表示する。

選ばれなかった候補は削除してもよいが、Lineage上のreject理由を残す。

## 6. Automatic QA

全asset:

- file存在
- expected output path
- size / format
- prompt hash
- contract version
- generator/version
- source commit
- reference set / reference hash
- candidate default
- final/runtime default false

透過asset:

- alpha channel
- 背景透過
- 白フリンジなし
- 市松模様なし
- edge contactなし

sprite sheet:

- columns / rows / cell size
- 全セル検出
- cell edge contactなし
- empty cell条件
- animation direction

icon:

- 単一object
- 64px/実寸可読性
- rarity frameなし
- textなし

stage:

- combat space
- foreground obstruction
- unwanted character/textなし
- gameplay contrast

自動判定だけで美術finalにしない。

## 7. Human Review

事故分類:

- `identity-drift`
- `proportion-drift`
- `palette-drift`
- `reference-missing`
- `prompt-lineage-missing`
- `unapproved-runtime-use`
- `white-background`
- `checkerboard-background`
- `white-fringe`
- `baked-text`
- `wrong-size`
- `wrong-direction`
- `lantern-missing`
- `bag-position-wrong`
- `rarity-frame-baked`
- `poster-composition`
- `ui-baked-in`

1件でもP0/P1相当があれば`needs-regeneration`または`rejected`。

## 8. Approval state machine

```txt
unchecked
→ candidate
→ reviewed
→ approved-final
→ runtime-approved
```

ただしAsset Factoryの既存ReviewStatusでは、`approved`はhuman review完了を示すだけとする。runtime承認は`generationTracking.runtimeApproved`で別管理する。

### approved-final条件

- identity Golden Reference登録済み
- 4候補比較sheetあり
- prompt/reference/output hashあり
- automatic QA pass
- human review pass
- unresolved P0/P1 issueなし
- Lineage manifestあり

### runtime-approved条件

- approved-final
- license/source log済み
- Unity/Web import検査pass
- gameplay-size screenshot pass
- candidate/finalのファイルパスが分離
- runtime providerで明示接続

## 9. UI asset

UIは画面全体を画像生成しない。

生成対象:

- 9-slice panel
- button frame
- card frame
- icon frame
- divider
- small accent
- cutin artwork

Unityで組み立てるもの:

- text
- button
- state
- selected / disabled / locked / new
- layout
- Safe Area
- responsive tier

`docs/unity-ui-design-system-v1.md`を正本とする。

## 10. Export / checks

ContractとGolden Reference JSON export:

```sh
pnpm asset-factory:contracts:export
```

出力:

```txt
data/asset-factory/generation-contracts.json (local derived output / Git ignored)
data/asset-factory/generation-contracts.summary.json (tracked review surface)
data/asset-factory/golden-reference-registry.json
```

full JSONは`src/game/data/assetGenerationPolicy.ts`とprompt catalogから完全再生成でき、runtime/CIの直接入力ではない。clone、diff、review、merge conflictを軽量化するためGit管理しない。summaryはcontract count、content type別件数、policy version、contract set hashだけを保持する。

```sh
pnpm asset-factory:contracts:export -- --summary-only
pnpm asset-factory:contracts:export -- --output /tmp/generation-contracts.json
```

整合検査:

```sh
pnpm asset-generation:check
```

通常のasset検査にも含める。

```sh
pnpm assets:verify
```

## 11. Regeneration rule

再生成時:

1. 元Lineageを読む
2. 同じContract IDを使う
3. 同じGolden Reference setを使う
4. generator versionを記録する
5. prompt本文を直接修正しない
6. 必要な変更はPrompt DBまたはContract versionへ戻す
7. 新しいcandidate batchを4枚作る
8. 比較sheetを更新する
9. supersedes関係をreview notesへ残す

## 12. 既存assetの移行

既存assetを一括final扱いしない。

- 現在runtime参照中でもLineageなしなら`legacy-runtime`として棚卸し
- 次に触るassetからContract / Golden Reference / Lineageへ移行
- U45 candidate UIはcandidateのまま
- generated reference画像はreference用途とruntime用途を分離
- hand-final candidateも自動的にfinalとはしない

## 13. 禁止される近道

- `approvedAsFinal=true`を手入力してcheckerを避ける
- runtime providerへcandidate pathを直接追加する
- Golden Reference set IDだけ登録し、画像を存在させない
- prompt hashを空または`UNKNOWN`でfinal化する
- generator versionを省略する
- 4候補を別promptで作って比較したことにする
- 既存画像を無断上書きする
- reference画像自体を生成結果へ混ぜて著しくコピーする

## 14. 現在の境界

このcommitでContract、Registry、Lineage CLI、template、Asset Factory tracking、test、checkerを追加した。

ただし以下は別作業:

- 全キャラ・敵・アイテム・ステージのidentity Golden Reference承認
- visual similarity modelによる自動類似度計測
- 4候補comparison sheetの画像自動生成
- 既存全assetのLineage backfill
- runtime final asset承認

これらが未完了でも、未登録・未追跡assetをfinal/runtime承認できない境界は先に固定する。
