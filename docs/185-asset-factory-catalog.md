# 185. Asset Factory Catalog

Asset Factory Catalog は、キャラ・敵・アイテム・ステージのプロンプトDBを1つの入口にまとめる統合カタログ。
実装参照データは `src/game/data/assetFactoryCatalog.ts`。

生成事故防止の正本:

```txt
docs/asset-generation-consistency-system-v1.md
```

## 目的

これまで素材生成用プロンプトは次のDBに分かれていた。

- `assetFactoryCharacterPrompts.ts`
- `enemyProductionDatabase.ts`
- `itemAssetProductionDatabase.ts`
- `stageProductionDatabase.ts`

`assetFactoryCatalog.ts` は、それらを統一して、Asset FactoryのUI/CLIから同じ形で扱えるようにする。

ただしPrompt Catalogだけではfinal採用できない。全Prompt recordはAsset Generation Contract、Golden Reference、Lineage、QA、承認境界と組み合わせる。

## Unified record

すべての素材プロンプトは `AssetFactoryPromptRecord` に正規化される。

```txt
AssetFactoryPromptRecord
├─ key
├─ contentType
├─ sourceId
├─ displayName
├─ kind
├─ title
├─ outputPathHint
├─ sizeSpec
├─ prompt
├─ negativePrompt
└─ reviewChecklist
```

## Key format

```txt
<contentType>:<sourceId>:<kind>
```

例:

```txt
character:yui:sprite_sheet_180
enemy:ombu_small_ink:sprite_sheet_180
item:starter_gear_yui_夜の鉛筆:icon_64
stage:forgotten_street:background_390x844
```

## Content types

| contentType | Source |
| --- | --- |
| character | `assetFactoryCharacterPrompts.ts` |
| enemy | `enemyProductionDatabase.ts` |
| item | `itemAssetProductionDatabase.ts` |
| stage | `stageProductionDatabase.ts` |

## Lookup

```ts
getAssetFactoryPrompt('character', 'yui', 'sprite_sheet_180')
getAssetFactoryPrompt('enemy', 'ombu_small_ink', 'reference')
getAssetFactoryPrompt('stage', 'forgotten_street', 'background_390x844')
```

## Prompt JSON export

```sh
pnpm asset-factory:catalog:export
```

出力:

```txt
data/asset-factory/prompt-catalog.json
```

## Contract / Golden Reference export

```sh
pnpm asset-factory:contracts:export
```

出力:

```txt
data/asset-factory/generation-contracts.json
data/asset-factory/generation-contracts.summary.json
data/asset-factory/golden-reference-registry.json
```

full `generation-contracts.json`はlocal derived outputとしてGit ignored。Git reviewとCI checkerは軽量summaryを使い、fullが必要なときはexport commandで再生成する。

各Contractは次を固定する。

- style / palette / forbidden traits
- output path / size / alpha
- required Golden Reference IDs
- 4候補生成
- prompt/reference hash
- generator/version/seed記録
- automatic QA / human review
- candidate/final/runtime承認境界

## Lineage manifest

画像生成後は必ずLineageを作る。

```sh
pnpm asset-factory:lineage:create -- \
  --key character:yui:normal_cutin \
  --output public/assets/prototypes/characters/yui/cutins/yui-cutin-v3.png \
  --generator codex-image \
  --generator-version 2026-07 \
  --reference-sets global:visual-style-v1,character:yui:identity-v1
```

作成直後は必ず:

```txt
review.status=candidate
approvedAsFinal=false
runtimeApproved=false
finalApprovalBlocked=true
```

CLIからfinal承認する機能は持たせない。

## Golden Reference

全素材は最低でも `global:visual-style-v1` を参照する。

final承認には次も必要:

```txt
<contentType>:<sourceId>:identity-v1
```

Identity Reference未登録でもcandidate生成は可能だが、final/runtime採用は禁止する。

Golden Referenceはreference用途とruntime用途を分離する。`approvedForReference=true`でも`approvedForRuntime=false`を維持できる。

## Tests / checks

`src/game/data/assetFactoryCatalog.test.ts`:

- character / enemy / item / stage promptsの統合
- catalog key uniqueness
- output path
- prompt / negative prompt
- typed lookup

`src/game/data/assetGenerationPolicy.test.ts`:

- 全Promptに1Contract
- 4候補必須
- one-shot final禁止
- Golden Reference / Lineage / QA必須
- final/runtime初期値false

repository checker:

```sh
pnpm asset-generation:check
```

通常のasset検査にも含まれる。

```sh
pnpm assets:verify
```

## Asset Factory UI/CLI usage

1. `contentType`を選ぶ。
2. Prompt Catalogから`sourceId`と`kind`を選ぶ。
3. 対応するAsset Generation Contractを読む。
4. Golden Reference setを解決する。
5. 同一Contract/参照/generator versionで4候補生成する。
6. 各候補へLineage manifestを作る。
7. 自動QAを実行する。
8. 4候補comparison sheetを作る。
9. human reviewでManual Issuesを記録する。
10. identity reference、QA、Lineageが揃った候補だけfinal候補にする。
11. import/gameplay-size/license検査後にのみruntime承認する。

## Manual Issues

生成ブレ・追跡事故として次を正式に扱う。

```txt
identity-drift
proportion-drift
palette-drift
reference-missing
prompt-lineage-missing
unapproved-runtime-use
```

既存の白背景、白フリンジ、文字焼き込み、方向違い、バッグ位置違い等も継続する。

## 優先制作順

1. Core5
2. Stage1
3. baselineオンブ系
4. 基本灯具/持ち物/忘れ物
5. Result/灯録UI素材

全20キャラ、48敵、20ステージをレビュー基盤の検証前に一括生成しない。
