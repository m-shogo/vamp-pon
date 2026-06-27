# 185. Asset Factory Catalog

Asset Factory Catalog は、キャラ・敵・アイテム・ステージのプロンプトDBを1つの入口にまとめる統合カタログ。
実装参照データは `src/game/data/assetFactoryCatalog.ts`。

## 目的

これまで素材生成用プロンプトは次のDBに分かれていた。

- `assetFactoryCharacterPrompts.ts`
- `enemyProductionDatabase.ts`
- `itemAssetProductionDatabase.ts`
- `stageProductionDatabase.ts`

`assetFactoryCatalog.ts` は、それらを統一して、Asset FactoryのUI/CLIから同じ形で扱えるようにする。

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

## Tests

`src/game/data/assetFactoryCatalog.test.ts` checks:

- character / enemy / item / stage prompts are included in one catalog
- catalog keys are unique
- output paths point under `public/assets/prototypes/`
- prompts include source IDs
- negative prompts include no-text/no-watermark rules
- typed lookup works

`src/game/data/productionContentLinks.test.ts` checks:

- stage lead characters resolve to Character DB
- stage enemy affinity resolves to Enemy DB
- enemy stage affinity resolves to Stage DB
- stage item seeds resolve to Item Asset DB or approved global seeds

## Asset Factory UI/CLI usage

1. Select `contentType`.
2. List `assetFactoryPromptCatalogByType[contentType]`.
3. Pick a `sourceId` and `kind`.
4. Render `prompt`, `negativePrompt`, `sizeSpec`, and `reviewChecklist`.
5. Generate the asset.
6. Store the result under `outputPathHint`.
7. Run review and Manual Issues regeneration.

## Next work

1. Build the actual Asset Factory selector UI/CLI on top of this catalog.
2. Add export to JSON if Unity or external tooling needs a static handoff.
3. Generate only Core5 / Stage1 / baseline Onbu / basic item packs first.
4. Do not generate all 20 characters and 48 enemies at once before review rules are proven.
