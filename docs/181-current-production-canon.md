# 181. Current Production Canon

<!-- CURRENT_STATE_BEGIN -->
```json
{
  "schemaVersion": 1,
  "currentPhase": "U49 actual-device audio/haptic",
  "nextPhase": "U50 performance/touch metrics",
  "thenPhase": "U51 RC",
  "runtimeVisualReady": true,
  "physicalDeviceReady": false,
  "devicePlayableReady": false,
  "audioMixerImplemented": true,
  "audioMixerDeviceVerified": false,
  "audioReady": false,
  "audioLatencyMeasured": false,
  "hapticReady": false,
  "hapticMeasured": false,
  "u50ThresholdsDefined": false,
  "mobileMetricsReady": false,
  "rcReady": false,
  "productionApproved": false
}
```
<!-- CURRENT_STATE_END -->

Date: 2026-07-10
Status: current production canon

ヨルノシルベのキャラ、敵、アイテム、ステージ、用語、Unity実装、生成素材、runtime visual運用の正本入口。

大規模実装では最初に次を読む。

```txt
docs/unity-big-implementation-control-center-v1.md
docs/unity-current-doc-index-2026-07-10.md
docs/unity-runtime-ownership-contract-v1.md
```

## Source of truth

| Layer | Runtime / doc |
| --- | --- |
| implementation control | `docs/unity-big-implementation-control-center-v1.md` |
| current Unity index | `docs/unity-current-doc-index-2026-07-10.md` |
| runtime ownership / navigation / save | `docs/unity-runtime-ownership-contract-v1.md` |
| UI/world terms | `src/game/data/worldTerms.ts` / `docs/design/world-labels.md` |
| 20-character canon | `src/game/data/characterCanon.ts` / `docs/180-unified-character-canon.md` |
| Character Database | `src/game/data/characterDatabase.ts` / `docs/183-character-database-v1.md` |
| Character prompts | `src/game/data/assetFactoryCharacterPrompts.ts` |
| Enemy database | `src/game/data/enemyProductionDatabase.ts` |
| Item database | `src/game/data/itemAssetProductionDatabase.ts` |
| Stage database | `src/game/data/stageProductionDatabase.ts` |
| Asset Factory Catalog | `src/game/data/assetFactoryCatalog.ts` / `docs/185-asset-factory-catalog.md` |
| generation contract / references | `src/game/data/assetGenerationPolicy.ts` / `src/game/data/goldenReferenceRegistry.ts` |
| asset generation operation | `docs/asset-generation-consistency-system-v1.md` |
| UI system | `docs/unity-ui-design-system-v1.md` |
| runtime visual approval | `docs/unity-runtime-visual-readiness-gate-v1.md` |
| current roadmap | `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md` |

古い検討メモと矛盾した場合は、この表、`src/game/data/*`、現行Unity runtime、最新evidence/checkerを優先する。

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

## Character production contract

1キャラにつき最低限次を同時に持たせる。

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
15. Unity handoff ID
16. Asset Factory prompt / negative prompt / review checklist
17. Asset Generation Contract / Golden Reference / Lineage
18. Runtime Visual Readiness / animation evidence / provider境界

## Core5 production set

| Character | 初期灯具 | 持ち物 | 忘れ物 | 灯技 | 継灯 | 暁灯 | A-Z灯紋 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ユイ | 夜の鉛筆 | 金のコンパス | 誰かの名前札 | 夜解きの灯 | 忘れ火の道標 | 消えない名前 | Y-01 消えない名の灯紋 |
| アサ | 絵はがきカッター | 旅のバッジ | 封のされた手紙 | 名札灯し | 暁綴り | 暁に結ぶ名 | A-02 名札結びの灯紋 |
| ナギ | 月のしおり | 月明かりのしおり | 小さな銀の鍵 | 月箱の鍵 | 封月の守り | 夜をしまう箱 | N-03 月箱守りの灯紋 |
| ミチル | 街灯の輪 | 外れた地図ピン | 折れたコンパス針 | 帰針 | 星図の道糸 | 帰り道の星 | M-04 帰星の灯紋 |
| トモリ | 黒インクの小瓶 | 白い余白 | 切れた灯芯 | 継火 | ほころび灯し | 夜を直す灯 | T-05 ほころび継火の灯紋 |

## Production databases

| Database | Current scope |
| --- | --- |
| Character Database | 20人の統合データ |
| Character prompts | 20人 x 9種類 |
| Enemy production DB | 48体: 雑魚35 / 中ボス10 / 大ボス3 |
| Item asset DB | キャラ由来100件 + field drop 5件 |
| Stage production DB | 20ステージ |
| A-Z emblems | 20人分のnormal/dawn/kokuyou等 |

キャラprompt種類:

```txt
sprite_sheet_180
character_reference
normal_cutin
dawn_cutin
kokuyou_cutin
emblem_blank
emblem_normal
emblem_dawn
emblem_kokuyou
```

## Asset Generation rule

生成画像はpromptだけで採用しない。

必須:

```txt
Asset Generation Contract
Golden Reference Registry
Generation Lineage
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

禁止:

- 1枚生成して即final採用
- Golden Referenceなしのfinal承認
- Lineageなしの採用
- candidate pathのproduction runtime直結
- 既存assetの無断上書き
- UI全画面への文字/ボタン焼き込み

## Runtime Visual Readiness rule

Point Filter、GameObject名、静止画表示、操作可能、Simulator route smokeだけではドットruntime完成と認めない。

現在:

```txt
runtimeVisualClassification=production-animated-sprite
simulatorPlayableCandidateReady=true
simulatorCandidateAnimationVisualReviewPassed=true
simulatorFinalArtApprovalProvided=true
characterDotRuntimeReady=true
characterAnimationReady=true
enemyDotRuntimeReady=true
enemyAnimationReady=true
productionCharacterAssetReady=true
productionEnemyAssetReady=true
runtimeVisualCandidateReady=false
runtimeVisualReady=true
runtimeCandidateAssetProviderConnected=false
productionVisualAssetProviderConnected=true
```

`characterDotRuntimeReady=true`最低条件:

- candidate or production provider with explicit approval level
- proof provider除外
- Sprite Mode Multiple
-実frame slice
- idle / walk / hurt / attack
- 左右向きと装備位置
- Golden Identity Reference
- Generation Lineage
- gameplay-size review
- Simulator animation evidence

`enemyDotRuntimeReady=true`最低条件:

- candidate or production provider with explicit approval level
- proof/procedural fallback除外
- Sprite Mode Multipleまたは承認済みframe source
- idle / move / hurt / death
- family正本との一致
- gameplay-size review

## Runtime ownership / data / save rule

正本:

```txt
docs/unity-runtime-ownership-contract-v1.md
```

必須:

- UIはcommandを送るだけでbattle/saveを直接実装しない
- navigation/pauseは単一owner
- Definition / Runtime State / Save DTOを分離
- saveはversioned JSON
- saveにはIDだけ保存
- Result/灯録はread modelを表示
- proof / candidate / production provider approval levelを分離
- `U1Stage1SceneBootstrap`と`U2BattleController`へ責務を増殖させない

## Unity UI rule

新規画面は次を使う。

- Theme
- Visual State
- 9-slice
- Responsive Layout Profile
- Base -> Variant最大2階層
- Import Policy
- Component Catalog
- Compact / Standard / Large確認

runtime UIはuGUIを維持し、UI ToolkitはEditor専用。

## Asset rule

- カットイン/灯紋画像に文字を焼かない
- UI textはruntimeで描画する
- 1画像1asset
- 白フリンジ、市松模様、ロゴ、文字は禁止
- 390x844のgameplay-sizeを優先
- reference承認とruntime承認を混同しない
- Point Filterをドット完成の証拠にしない
- Single spriteをanimated sheetとして扱わない
- proof providerをproduction providerと呼ばない

## Implementation status

| Area | Status |
| --- | --- |
| implementation control | control center / current index / preflightあり |
| runtime ownership contract | documented / implementation incremental |
| world terms and content DB | source dataあり |
| Asset Generation Contract | foundationあり |
| Golden Reference | global/UIあり、identityは段階登録 |
| Runtime Visual Readiness | U48 production visual scope ready / device・whole-app approvalは別 |
| UI Design System | foundationあり、全画面移行は未完了 |
| AppFlow/Pause production owner | U46実装済み |
| versioned SaveService | U46実装、U46.1 hardening済み |
| production DataRegistry | U47実装済み |
| Result/Collection read model | U46実装済み |
| U48 production asset expansion | 46 asset / 138 Simulator captureで完了 |
| actual device/audio/haptic | U49 build・install・launch、22 SE、10 haptic、Core Haptics Supportedまで実機確認済み。音質は人間FAIL、touch/UI/黒耀化操作の是正と18項目reviewは未完了 |
| performance/touch metrics | U50 threshold calibration前、未確認 |
| RC/production | false |

## Next implementation order

1. `pnpm implementation:preflight:check`
2. U46 AppFlow/Pause + Result ViewModel + SaveService v1 + 灯録: completed candidate
   - U46.1 Result empty state / copy-on-write save / subscription hardening: completed
3. U47 gameplay definitions/runtime state: completed
4. U48 remaining assets/background/VFX: completed
5. U49 actual-device audio/haptic: current
6. U50 performance/touch metrics
7. U51 RC

## Required checks

```sh
pnpm implementation:preflight:check
pnpm implementation:preflight:full
pnpm asset-generation:check
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm unity:u45-ai-simulator-smoke:check
pnpm unity:u49-actual-device-audio-haptic:check
pnpm unity:u50-thresholds:check
```

READYは実装、evidence、checkerが揃った時だけ上げる。
