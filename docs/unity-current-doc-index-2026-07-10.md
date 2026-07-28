# Unity Current Doc Index

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

Original adoption date: 2026-07-10
Last synchronized: 2026-07-28
Status: current

## Completion sources

- U46: `docs/unity-u46-app-flow-save-result-collection-2026-07-11.md`
- U46.1: `docs/unity-u46-1-result-save-hardening-2026-07-11.md`
- U47: `docs/unity-u47-gameplay-data-runtime-2026-07-13.md`
- U48 human decision: `docs/unity-u48-human-asset-approval-2026-07-21.md`
- U48 completion: `docs/unity-u48-production-asset-expansion-completion-2026-07-21.md`

## 最初に読む

### Repository / runtime

1. `docs/unity-big-implementation-control-center-v1.md`
2. `docs/181-current-production-canon.md`
3. `docs/unity-runtime-ownership-contract-v1.md`
4. `docs/unity-runtime-visual-readiness-gate-v1.md`
5. `docs/unity-ui-design-system-v1.md`
6. `docs/asset-generation-consistency-system-v1.md`
7. `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md`

### Heavy Design current entry

1. `docs/design-documentation-readiness-control-center-v1.md`
2. `docs/design-art-direction-quiet-night-warmth-v1.md`
3. `docs/design-screen-completion-specifications-v1.md`
4. `docs/design-component-state-accessibility-matrix-v1.md`
5. `docs/design-motion-transition-spec-v1.md`
6. `docs/design-technical-art-asset-pipeline-spec-v1.md`
7. `docs/design-generation-briefs-wave1-v1.md`
8. `docs/design-production-completeness-gates-v1.md`
9. `docs/design-human-decision-interaction-protocol-v1.md`
10. `docs/design-documentation-contradiction-register-v1.md`

Historical handoff/roadmap:

- `docs/design-heavy-production-future-roadmap-2026-07-27.md`
- `docs/design-heavy-production-next-chat-handoff-2026-07-27.md`
- `docs/design-language-foundation-proposal-v1.md`

`design-language-foundation-proposal-v1.md`の方向未選択表現は作成時点の履歴であり、現在の方向は`HD-ART-DIRECTION-001=A / QUIET_NIGHT_SMALL_WARMTH`である。

## 現在のPhase

```txt
Completed: U45.1 Character and Enemy Dot Runtime Pass
Completed: U45.1 candidate/production readiness hardening
Completed: U46 AppFlow / Save / Result / 灯録 candidate
Completed: U46.1 Result / Save Hardening
Completed: U47 gameplay data/runtime
Completed: U48 production asset expansion
Current: U49 actual-device audio/haptic
Parallel HOLD: Heavy Design documentation refinement
Next: U50 performance/touch metrics
Then: U51 RC
```

U49実機reviewで音質、touch、常時揺れ、TOP/StageSelect/LevelUp、黒耀化操作経路の不合格が確認された。U50へ進む前に
`docs/unity-u49-actual-device-quality-remediation-2026-07-27.md`
を完了する。

StageSelect／LevelUpはstructural remediation後も人間reviewで`FAIL`となった。キャラクター・敵以外のwhole-app visualは未承認であり、U49 Audio/Hapticとは分離したHeavy Design Phaseで扱う。監査正本は
`docs/unity-whole-app-heavy-design-audit-2026-07-27.md`
とする。既存の`runtimeVisualReady=true`はU48 asset connectionの履歴値であり、whole-app human visual approvalを意味しない。

## Heavy Design現在地

Human decision:

```txt
HD-ART-DIRECTION-001=A
selectedArtDirection=QUIET_NIGHT_SMALL_WARMTH
label=静かな夜と小さな温かさ
pendingHumanDecisionCount=0
```

Current readiness:

```txt
documentationFoundation=DOCUMENTATION_FOUNDATION_PREPARED
artDirectionHumanDirectionLocked=true
artDirectionVisuallyLocked=false
screenSpecifications=13/13
componentStateMatrix=DOCUMENTED_COMPLETE
motionTransitionFamilies=7
technicalArtPipeline=DOCUMENTED
referenceRegistry=DOCUMENTED
Wave1Briefs=3_PREPARED_NOT_APPROVED
imageGenerationStarted=false
unityDesignImplementationStarted=false
wholeAppHumanVisualAccepted=false
```

Machine-readable source:

```txt
docs/design-targets/generated/design-production/documentation-readiness.json
```

画像生成はこのChatGPT会話で1 briefずつ、人間確認を挟んで行う。Repository agentは画像を生成しない。

Unity実装は、approved reference、approved component、cleanup、commercial use review、lineage、handoff pack、人間の明示開始が揃うまで行わない。

## 人間判断の運用

`docs/design-human-decision-interaction-protocol-v1.md`を正本とする。

- 作業側が調査・比較・推奨を先に完了する。
- ユーザーには原則1回1問。
- 2〜4択のクリック式を優先する。
- 技術事項をユーザーへ丸投げしない。
- 未回答中は依存するLOCK、生成、実装へ進まない。

Current queue:

```txt
docs/design-targets/generated/design-production/human-decision-queue.json
pending=0
activeDecision=null
```

## 現在の境界

```txt
Unity Editor=6000.5.1f1
2D URP
uGUI runtime
runtimeVisualClassification=production-animated-sprite
simulatorPlayableCandidateReady=true
actualDeviceSmokeResult=NOT_PROVIDED
characterDotRuntimeReady=true
characterAnimationReady=true
enemyDotRuntimeReady=true
enemyAnimationReady=true
runtimeVisualCandidateReady=false
runtimeVisualReady=true
runtimeCandidateAssetProviderConnected=false
productionVisualAssetProviderConnected=true
productionCharacterAssetReady=true
productionEnemyAssetReady=true
candidateAssetsApprovedAsFinal=true
productionDataRegistryImplemented=true
audioMixerImplemented=true
audioMixerDeviceVerified=false
audioReady=false
hapticReady=false
devicePlayableReady=false
mobileMetricsReady=false
audioMixerReady=false
audioLatencyMeasured=false
hapticMeasured=false
rcReady=false
productionApproved=false
```

`runtimeVisualReady=true`はU48で承認されたvisual groupがproduction providerへ接続され、responsive Simulator verificationを通過した意味である。actual-device、音、振動、性能、whole-app human visual、RC、store release approvalは別ゲート。

## 領域別正本

| Area | Document / code |
| --- | --- |
| title / terms | `docs/title-and-term-lock-2026-06-30.md` |
| production canon | `docs/181-current-production-canon.md` / `src/game/data/*` |
| implementation control | `docs/unity-big-implementation-control-center-v1.md` |
| runtime ownership | `docs/unity-runtime-ownership-contract-v1.md` |
| runtime visual approval | `docs/unity-runtime-visual-readiness-gate-v1.md` |
| UI foundation | `docs/unity-ui-design-system-v1.md` |
| generated assets | `docs/asset-generation-consistency-system-v1.md` |
| Heavy Design control | `docs/design-documentation-readiness-control-center-v1.md` |
| selected Art Direction | `docs/design-art-direction-quiet-night-warmth-v1.md` |
| screen specs | `docs/design-screen-completion-specifications-v1.md` |
| state / accessibility | `docs/design-component-state-accessibility-matrix-v1.md` |
| motion / transitions | `docs/design-motion-transition-spec-v1.md` |
| technical art / pipeline | `docs/design-technical-art-asset-pipeline-spec-v1.md` |
| Wave1 generation briefs | `docs/design-generation-briefs-wave1-v1.md` |
| completeness gates | `docs/design-production-completeness-gates-v1.md` |
| human decision interaction | `docs/design-human-decision-interaction-protocol-v1.md` |
| contradiction register | `docs/design-documentation-contradiction-register-v1.md` |
| font audit | `docs/design-font-license-glyph-audit-v1.md` |
| reference rights | `docs/design-reference-rights-boundary-v1.md` |
| implementation handoff | `docs/design-implementation-handoff-template-v1.md` |
| automated documentation check | `scripts/quality/check-heavy-design-documentation.ts` |
| responsive | `docs/unity-responsive-screen-policy.md` |
| performance | `docs/unity-mobile-performance-budget.md` |
| mobile QA | `docs/mobile-release-qa-gates.md` |
| current roadmap | `docs/unity-u44-to-u51-app-quality-roadmap-2026-07-06.md` |

## Current evidence

- `docs/design-targets/generated/unity-big-implementation/readiness.json`
- `docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json`
- `docs/design-targets/generated/unity-u47/simulator-smoke/manifest.json`
- `docs/design-targets/generated/unity-u48/approval-pack/approval-manifest.json`
- `docs/design-targets/generated/unity-u48/human-selection-decision.json`
- `docs/design-targets/generated/unity-u48/approved-production-set.json`
- `docs/design-targets/generated/unity-u48/production-visual-connection.json`
- `docs/design-targets/generated/unity-u48/production-verification/manifest.json`
- `docs/design-targets/generated/unity-u49/readiness.json`
- `docs/design-targets/generated/unity-u49/device-build-result.json`
- `docs/design-targets/generated/unity-u49/device-install-launch-result.json`
- `docs/design-targets/generated/unity-whole-app-design-audit-2026-07-27/screen-audit.json`
- `docs/design-targets/generated/unity-whole-app-design-audit-2026-07-27/human-visual-rejection.json`
- `docs/design-targets/generated/design-production/human-decision-queue.json`
- `docs/design-targets/generated/design-production/design-language-foundation-proposal.json`
- `docs/design-targets/generated/design-production/documentation-readiness.json`
- `docs/design-targets/generated/design-production/reference-registry.json`
- `docs/design-targets/generated/design-production/current-runtime-comparison-manifest.json`
- `docs/design-targets/generated/design-production/generation-request-queue.json`
- `docs/design-targets/generated/design-production/asset-provenance-registry-template.json`
- `docs/design-targets/generated/unity-u50/thresholds.json`
- `docs/design-targets/generated/unity-current-state/state.json`

U45.1 evidence remains historical prerequisite evidence and must not override current U48 readiness or current Heavy Design human rejection.

## Current checks

```sh
pnpm implementation:preflight:check
pnpm implementation:preflight:full
pnpm unity:term-lock:check
node --experimental-strip-types scripts/quality/check-heavy-design-documentation.ts
pnpm unity:runtime-visual-readiness:check
pnpm unity:ui-design-system:check
pnpm asset-generation:check
pnpm assets:verify
pnpm unity:u47-gameplay-data-runtime:check
pnpm unity:u48-production-asset-expansion:check
pnpm unity:u48-production-asset-approval-pack:check
pnpm unity:u48-human-selection:check
pnpm unity:u48-approved-production-set:check
pnpm unity:u48-production-visual-connection:check
pnpm unity:u48-production-visual-verification:check
pnpm unity:meta:check
pnpm unity:u49-actual-device-audio-haptic:check
pnpm unity:u50-thresholds:check
```

Heavy Design documentation checkerは、正本存在、Art Direction A、13 screens、3 Wave 1 briefs、runtime baseline、pending decision、reference approval境界、画像生成・Unity実装が未開始であることを検査する。Stage1 Qualityでは用語lockの後、asset／test／buildより前に実行する。

## Historical documents

U0〜U45.1および旧Web final planは履歴と証跡として残す。現在の実装順、asset approval、visual completion、READY判定を決める正本として単独使用しない。

特に以下はhistoricalまたは現在分類で上書きされる。

- U1開始用prompt
- placeholder/proof-only合格条件
- Point Filterだけをvisual completionとみなす古い記述
- Web画面をcurrent finalとする記述
- `final` filenameをapprovalとする解釈
- 正式用語ではない旧表記
- U45.1 candidate runtimeが現在値であるように見える記述
- 6.5.1f1という旧version誤記

## Final rule

新規エージェントはこのindexから入り、対象Phaseの個別docだけで判断しない。active source of truth同士でPhase、readiness、provider、approval state、human decisionが一致しない場合は作業を停止し、先に整合性を修復する。
