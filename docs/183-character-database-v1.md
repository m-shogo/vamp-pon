# 183. Character Database v1

Character Database v1 は、20キャラの設計情報を実装・Unity移行・Asset Factoryへ渡すための統合レイヤー。
実装参照データは `src/game/data/characterDatabase.ts`。

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

## CharacterDefinition shape

```txt
CharacterDefinition
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

## Integrity tests

`src/game/data/characterDatabase.test.ts` で以下を検査する。

- `characterCanon` 全員分を `characterDefinitions` が持つ
- ID重複がない
- `characterProductionPlans` / `kokuyouForms` / `characterEmblems` が全キャラ分ある
- 初期灯具 / 持ち物 / 忘れ物 / 進化 / 技 / 黒耀化 / A-Z灯紋が空ではない
- 灯合わせ候補のIDが解決できる
- Core5の灯合わせが10組すべてつながる
- `characterDefinitionById` で全員引ける

## Next work

1. `weapons.ts` / `passives.ts` / `rareItems.ts` / `evolutions.ts` へCore5分を反映する。
2. `characterDatabase.ts` をキャラ選択、灯録、Asset Factory export、Unity handoff exportから参照する。
3. 20人全員は正本データとして保持し、playable化はCore5から段階導入する。
