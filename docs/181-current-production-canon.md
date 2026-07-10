# 181. Current Production Canon

最新のキャラ量産・敵・アイテム・ステージ・A-Z灯紋・Unity UI・生成素材運用の入口。
古い検討メモと矛盾した場合は、この文書と下記のruntime data / adopted docsを優先する。

## Source of truth

| Layer | Runtime / doc |
| --- | --- |
| UI/world terms | `src/game/data/worldTerms.ts` / `docs/design/world-labels.md` |
| 20-character canon | `src/game/data/characterCanon.ts` / `docs/180-unified-character-canon.md` |
| Character Database v1 | `src/game/data/characterDatabase.ts` / `docs/183-character-database-v1.md` |
| Character Asset Factory prompts | `src/game/data/assetFactoryCharacterPrompts.ts` / `docs/prompts/character-asset-factory-prompts.md` |
| Enemy production database | `src/game/data/enemyProductionDatabase.ts` / `docs/184-production-content-databases.md` |
| Item asset production database | `src/game/data/itemAssetProductionDatabase.ts` / `docs/184-production-content-databases.md` |
| Stage production database | `src/game/data/stageProductionDatabase.ts` / `docs/184-production-content-databases.md` |
| Unified Asset Factory Catalog | `src/game/data/assetFactoryCatalog.ts` / `docs/185-asset-factory-catalog.md` |
| Asset Generation Contract | `src/game/data/assetGenerationPolicy.ts` / `docs/asset-generation-consistency-system-v1.md` |
| Golden Reference Registry | `src/game/data/goldenReferenceRegistry.ts` / `docs/asset-generation-consistency-system-v1.md` |
| Unity UI Design System | `docs/unity-ui-design-system-v1.md` |
| Core5 art names | `src/game/data/characterArts.ts` |
| Kokuyou forms | `src/game/data/kokuyouForms.ts` |
| Pair light arts | `src/game/data/pairLightArts.ts` |
| Item production canon | `src/game/data/itemProductionCanon.ts` / `docs/design/item-and-character-production-canon.md` |
| Character production plans | `src/game/data/characterProductionPlans.ts` / `docs/design/character-production-plans.md` |
| A-Z emblems | `src/game/data/emblemCanon.ts` / `docs/design/emblem-canon.md` / `docs/design/az-emblem-canon.md` |
| A-Z emblem prompts | `docs/prompts/az-emblem-asset-prompts.md` |

## Current rule

キャラ量産は、キャラだけ増やさない。1人につき必ず次を同時に持たせる。

1. 初期灯具
2. 持ち物
3. 忘れ物
4. 灯技
5. 継灯
6. 暁灯
7. 灯継ぎ
8. 暁開き
9. 黒耀化副題
10. 黒耀化の歪み
11. 灯合わせ候補
12. A-Z灯紋
13. 通常/黒耀化/暁の素材キーワード
14. グッズ展開フック
15. Unity Handoff用prefabId / addressableGroup / sceneEligibility
16. Asset Factory用の素材別prompt / negative prompt / review checklist
17. Asset Generation Contract / Golden Reference / Generation Lineage

敵・ステージ・アイテムも、意味・ゲーム役割・見た目・生成prompt・review条件・承認境界を持たせる。

## Current naming lock

| Target | Label |
| --- | --- |
| Base character art | 灯技 |
| Evolved character art | 継灯 |
| Decisive character art | 暁灯 |
| Kokuyou form | 黒耀化 |
| Kokuyou backlash | 煤返り |
| Kokuyou gauge | 黒耀瓶 |
| Weapon / active item | 灯具 |
| Passive | 持ち物 |
| Rare item | 忘れ物 |
| Field drop | 落とし物 |
| Currency / fragment | 記憶片 |
| Upgrade | 灯継ぎ |
| Awakening | 暁開き |
| Fusion / pair art | 灯合わせ |
| Collection | 灯録 |
| Achievement | 記憶のしるし |
| Result | 旅の記録 |
| Stage clear | 夜明け |
| Emblem device | 灯紋具 |
| Character emblem | 灯紋 |
| A-Z series | A-Z灯紋 |

`黒曜化`ではなく、必ず **黒耀化** と表記する。

## Core5 production set

| Character | 初期灯具 | 持ち物 | 忘れ物 | 灯技 | 継灯 | 暁灯 | A-Z灯紋 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ユイ | 夜の鉛筆 | 金のコンパス | 誰かの名前札 | 夜解きの灯 | 忘れ火の道標 | 消えない名前 | Y-01 消えない名の灯紋 |
| アサ | 絵はがきカッター | 旅のバッジ | 封のされた手紙 | 名札灯し | 暁綴り | 暁に結ぶ名 | A-02 名札結びの灯紋 |
| ナギ | 月のしおり | 月明かりのしおり | 小さな銀の鍵 | 月箱の鍵 | 封月の守り | 夜をしまう箱 | N-03 月箱守りの灯紋 |
| ミチル | 街灯の輪 | 外れた地図ピン | 折れたコンパス針 | 帰針 | 星図の道糸 | 帰り道の星 | M-04 帰星の灯紋 |
| トモリ | 黒インクの小瓶 | 白い余白 | 切れた灯芯 | 継火 | ほころび灯し | 夜を直す灯 | T-05 ほころび継火の灯紋 |

## Character Database v1

`src/game/data/characterDatabase.ts`は20キャラの正本データを実装用に束ねる統合レイヤー。手入力で重複管理せず、既存の正本から導出する。

| Included | Source |
| --- | --- |
| 名前・関係・戦闘方向・技名 | `characterCanon.ts` |
| 初期灯具・持ち物・忘れ物・進化・素材キーワード | `characterProductionPlans.ts` |
| 黒耀化副題・歪み | `kokuyouForms.ts` |
| Core5灯合わせ | `pairLightArts.ts` |
| A-Z灯紋・グッズ展開 | `emblemCanon.ts` |
| Unity Handoff fields | `characterDatabase.ts` |
| Asset Factory prompt seed | `assetFactoryCharacterPrompts.ts` |

## Asset Factory prompt set

各キャラは`src/game/data/assetFactoryCharacterPrompts.ts`で次の9種類を持つ。

1. `sprite_sheet_180`
2. `character_reference`
3. `normal_cutin`
4. `dawn_cutin`
5. `kokuyou_cutin`
6. `emblem_blank`
7. `emblem_normal`
8. `emblem_dawn`
9. `emblem_kokuyou`

敵・ステージ・アイテムのpromptは`docs/184-production-content-databases.md`、統合入口は`docs/185-asset-factory-catalog.md`を参照する。

## Asset Generation Consistency rule

生成画像はPromptだけで採用しない。`docs/asset-generation-consistency-system-v1.md`を正本とする。

必須:

```txt
Asset Generation Contract
Golden Reference Registry
Generation Lineage manifest
同一Contractによる4候補比較
prompt/reference/output SHA-256
Generator名/version/seed/source commit
Automatic QA + Human Review
candidate/final/runtime approval分離
```

初期値:

```txt
review.status=candidate
approvedAsFinal=false
runtimeApproved=false
finalApprovalBlocked=true
```

Identity Golden Reference未登録でもcandidate生成は可能だが、final/runtime採用は禁止する。

禁止:

- 1枚生成して即final採用
- Lineageなしの採用
- Golden Referenceなしのfinal承認
- candidate pathのproduction runtime直結
- 既存assetの無断上書き
- promptを個別手修正して同一Contract扱いすること
- UI全画面への文字・ボタン焼き込み

検査:

```sh
pnpm asset-generation:check
pnpm assets:verify
```

## Production content databases

| Database | Current scope |
| --- | --- |
| `enemyProductionDatabase.ts` | 48 enemies: 35 small / 10 medium or elite / 3 bosses, each with 4 asset prompt kinds. |
| `itemAssetProductionDatabase.ts` | Character-linked gear/passive/rare/evolution items + field drops, each with 5 asset prompt kinds. |
| `stageProductionDatabase.ts` | 20 stages, each with 4 asset prompt kinds. |

## Kokuyou rule

黒耀化は共通システム名。ただし表示ではキャラ別副題を持たせる。

| Character | 黒耀化副題 |
| --- | --- |
| ユイ | 呼びすぎた名前 |
| アサ | 黒い名札 |
| ナギ | 開いた月箱 |
| ミチル | 迷い星図 |
| トモリ | ほころぶ継火 |

20人分は`src/game/data/kokuyouForms.ts`を参照する。

## A-Z emblem rule

A-Z灯紋はキャラ量産の必須要素。1キャラにつき最低4相を作る。

| Phase | Display | Rule |
| --- | --- | --- |
| blank | 無紋 | 未解放。薄い線だけで持ち物シルエットは読めない。 |
| normal | 灯紋 | 通常解放。持ち物、動詞、光の形が紋になる。 |
| dawn | 暁紋 | 暁灯/暁開き後。外周に朝の線が入る。 |
| kokuyou | 黒紋 | 黒耀化中。長所が歪んだ黒い傷を1つだけ入れる。 |
| pair | 双灯紋 | 灯合わせ。2人の灯紋が半分ずつ重なる。 |

## Asset rule

- カットイン画像・灯紋画像に文字を焼かない。
- キャラ名、A-Zコード、技名、ラベルはUI textで出す。
- 1画像1asset。
- UI素材生成時は必要な場合のみ純緑`#00FF00`背景を使用し、処理後は透過する。
- 白フリンジ、市松模様、ロゴ、文字は禁止。
- 390x844のスマホ縦画面で読めることを優先する。
- 生成assetは4候補を比較する。
- Golden ReferenceとLineageが揃うまでcandidate扱い。
- reference承認とruntime承認を混同しない。

## Implementation status

| Area | Status |
| --- | --- |
| World terms | 正本データあり。UI全体への参照置換は未完了。 |
| 20 characters | 正本データあり。playable runtimeはCore5から段階適用。 |
| Character Database v1 | 20人分の統合データ、ID/必須項目/integrity testあり。 |
| Unified Asset Factory Catalog | character/enemy/item/stageを統合済み。 |
| Asset Generation Contract | Prompt Catalog全recordから導出するv1実装あり。 |
| Golden Reference Registry | Global styleとU45 UI candidate referenceを登録済み。identity referenceは段階登録。 |
| Generation Lineage | SHA-256、generator/version、source commit、approval境界を記録するCLI/templateあり。 |
| Asset generation checker | Contract/Registry/Lineage/未承認境界を静的検査。 |
| Character Asset Factory prompts | 20人 x 9種類あり。 |
| Enemy production DB | 48体分、asset prompt 4種類あり。 |
| Item asset production DB | キャラ由来100件 + field drop 5件、asset prompt 5種類あり。 |
| Stage production DB | 20ステージ分、asset prompt 4種類あり。 |
| Unity UI Design System | 9-slice、Theme、Visual State、Responsive、Catalog、Import Policyあり。 |
| Core5 arts | 正本データあり。 |
| Kokuyou subtitles | 20人分あり。 |
| Pair arts | Core5 10組あり。 |
| A-Z emblems | 20人分あり。画像生成/実UI反映は未完了。 |

## Next implementation order

1. `pnpm asset-generation:check` / `pnpm test` / `pnpm build` / `pnpm assets:verify`を実行する。
2. `pnpm asset-factory:contracts:export`でContract/Registry JSONを出力する。
3. Core5からidentity Golden Referenceを承認・登録する。
4. Core5 / Stage1素材を同一Contractで4候補生成し、Lineageを作る。
5. 4候補comparison sheetとvisual similarity検査を追加する。
6. Result / 灯録をUnity UI Design Systemで実装する。
7. `weapons.ts` / `passives.ts` / `rareItems.ts` / `evolutions.ts`へCore5分を先に反映する。
8. HUD / LevelUp / Result / Collectionの旧用語を`WORLD_TERMS`参照へ寄せる。
9. A-Z灯紋は灯録・キャラ詳細・キャラ選択にnormal相から表示する。
10. season_seed / future_seed / shadow5は設計データとして保持し、選択画面には出さない。
