# 183. Character Database v1

Character Database v1 は、20キャラの設計情報を実装・Unity移行・Asset Factoryへ渡すための統合レイヤー。
実装参照データは `src/game/data/characterDatabase.ts`。
Asset Factory 用の素材別プロンプトは `src/game/data/assetFactoryCharacterPrompts.ts` と `docs/prompts/character-asset-factory-prompts.md`。

Character Database は20キャラの正本データであり、runtimeのプレイアブル一覧そのものではない。
runtimeの `src/game/data/characters.ts` は、段階反映用の軽量データとしてCore5だけを持つ。
20キャラ全員はまだplayableではなく、seed/shadowキャラは画像・バランス・UI確認が済むまでCharacterSelectへ出さない。

## 目的

Manual Issues連動と実画像テストの次に必要な土台は、キャラそのものの設計・データ化・Unity移行の正本。
この文書と `characterDatabase.ts` は、次の情報を1キャラ単位で束ねる。

- キャラID / 名前 / group / status
- 役割・戦闘の遊び味
- 初期灯具
- 持ち物
- 忘れ物
- 灯技 / 継灯 / 暁灯
- 灯継ぎ / 暁開き
- 黒耀化副題 / 黒耀化の歪み
- 灯合わせ候補
- A-Z灯紋
- Asset Factory 用キーワード
- Unity Handoff 用 prefabId / addressableGroup / sceneEligibility

## Data source order

`characterDatabase.ts` は手入力の二重管理ではなく、既存の正本データを統合して作る。

| Source | Role |
| --- | --- |
| `characterCanon.ts` | 名前、関係、戦闘方向、技名、カットイン方向 |
| `characterProductionPlans.ts` | 初期灯具、持ち物、忘れ物、進化、灯合わせ候補、素材キーワード |
| `kokuyouForms.ts` | 黒耀化副題、短文コピー、歪み |
| `pairLightArts.ts` | Core5 灯合わせ名 |
| `emblemCanon.ts` | A-Z灯紋、灯紋具、星座動物、グッズ展開 |
| `assetFactoryCharacterPrompts.ts` | 各キャラx各素材種別の生成プロンプト |

## CharacterDatabaseEntry shape

production/canon側の型名は `CharacterDatabaseEntry`。
runtime側の `src/game/domain/types.ts` にある `CharacterDefinition` とは別物として扱う。

```txt
CharacterDatabaseEntry
├─ id / no / name / status / group
├─ identity
│  ├─ vessel
│  ├─ lineage
│  ├─ firstAction
│  ├─ linkToYui
│  ├─ otherLink
│  └─ blank
├─ combat
│  ├─ role / starter / playFeel / strength / weakness
│  ├─ starterGear
│  ├─ passiveItem
│  ├─ rareItem
│  ├─ lampTsugi
│  ├─ akatsukiBiraki
│  ├─ fieldDropAffinity
│  └─ motifLaneIds
├─ arts
│  ├─ lampArt
│  ├─ inheritedLight
│  └─ dawnLight
├─ kokuyou
│  ├─ label
│  ├─ subtitle
│  ├─ shortCopy
│  ├─ distortedTrait
│  └─ cutinDirection
├─ pair
│  ├─ candidateIds
│  └─ core5PairArtIds
├─ emblem
├─ assetFactory
└─ unityHandoff
```

## Asset Factory prompts

`assetFactoryCharacterPrompts.ts` は `characterDatabase.ts` を元に、20キャラ全員へ9種類の素材プロンプトを作る。

| Kind | Output |
| --- | --- |
| `sprite_sheet_180` | 1440x1080 / 8x6 / 48セル / 180x180 / 透過 |
| `character_reference` | 1024x1024 / 全身基準立ち絵 / 透過 |
| `normal_cutin` | 1440x360 / 通常暁灯カットイン / 透過 |
| `dawn_cutin` | 1440x360 / 暁開きカットイン / 透過 |
| `kokuyou_cutin` | 1440x360 / 黒耀化カットイン / 透過 |
| `emblem_blank` | 512x512 / 無紋 / 純緑 `#00FF00` source |
| `emblem_normal` | 512x512 / 灯紋 / 純緑 `#00FF00` source |
| `emblem_dawn` | 512x512 / 暁紋 / 純緑 `#00FF00` source |
| `emblem_kokuyou` | 512x512 / 黒紋 / 純緑 `#00FF00` source |

すべてのプロンプトは、文字焼き込み禁止、ロゴ禁止、AZコード焼き込み禁止、白フリンジ禁止を含む。

character / cutin / sprite は最終的に true alpha transparency を要求する。
emblem source だけは、細い紋章線と透明縁のQAを安定させるため、現時点では純緑 `#00FF00` chroma key source として生成し、ローカル後処理でRGBA化する前提にする。
透明PNGへ直接寄せるかどうかは、実画像QAでフリンジや線欠けを比較してから別タスクで判断する。

## Unity Handoff

`unityHandoff` はまだUnity実装そのものではない。
Unityへ移行するときに、どのキャラをどのPrefab/Addressable/選択画面ステータスで扱うかを迷わないためのメタ情報。

| Field | Meaning |
| --- | --- |
| prefabId | `character-yui` のようなUnity側Prefab候補ID |
| addressableGroup | `characters/core5` などのグループ |
| sceneEligibility | キャラ選択へ出せるか、seed-onlyか |
| runtimeStatus | 現runtimeで使える段階か |
| notes | 実装時の注意 |

## Scene eligibility

| Value | Meaning |
| --- | --- |
| `core5_character_select_candidate` | Core5。sprite wiring / balance / UI確認後にキャラ選択候補へ進める。 |
| `seed_data_only` | Season/Future seed。設計データとして保持し、P1の選択画面には出さない。 |
| `shadow_data_only` | Shadow5。黒耀化・後半・高難度導線まで温存。 |

## Runtime promotion rule

- `characterDatabase.ts` は正本データ。
- `characters.ts` は現runtimeへ出す軽量データ。
- Core5だけを段階的にruntimeへ出す。
- 20キャラ全員を一括playable化しない。
- Unity Handoff はUnity実装ではなく、移行時のID・Addressable・選択可否のメモ。
- Asset Factory prompt は生成補助であり、生成画像は Asset Factory QA を通してから candidate / approved に進める。
- runtime assetへの移動は approved 後の別タスクで行う。

## Integrity tests

`src/game/data/characterDatabase.test.ts` で以下を検査する。

- `characterCanon` 全員分を `characterDefinitions` が持つ
- ID重複がない
- `characterProductionPlans` / `kokuyouForms` / `characterEmblems` が全キャラ分ある
- 初期灯具 / 持ち物 / 忘れ物 / 進化 / 技 / 黒耀化 / A-Z灯紋が空ではない
- 灯合わせ候補のIDが解決できる
- Core5の灯合わせが10組すべてつながる
- `characterDefinitionById` で全員引ける

`src/game/data/assetFactoryCharacterPrompts.test.ts` で以下を検査する。

- 全20キャラ分のprompt packがある
- 1キャラにつき9種類のprompt kindが揃う
- promptがキャラID/名前/outputPathHintに紐づく
- sprite/cutin/reference/emblemの出力specが分かれる
- lookup helperでキャラIDとkindからpromptを引ける

## Next work

1. `weapons.ts` / `passives.ts` / `rareItems.ts` / `evolutions.ts` へCore5分を反映する。
2. `characterDatabase.ts` をキャラ選択、灯録、Asset Factory export、Unity handoff exportから参照する。
3. `assetFactoryCharacterPrompts.ts` をAsset Factoryの生成・再生成・レビュー導線へ接続する。
4. 20人全員は正本データとして保持し、playable化はCore5から段階導入する。
