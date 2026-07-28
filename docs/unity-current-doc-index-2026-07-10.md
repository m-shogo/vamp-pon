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
Status: **current**
Repository: `m-shogo/vamp-pon`

## 1. 最初に読む

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
2. `docs/design-production-state-machine-v1.md`
3. `docs/design-documentation-foundation-review-2026-07-28.md`
4. `docs/design-art-direction-quiet-night-warmth-v1.md`
5. `docs/design-screen-completion-specifications-v1.md`
6. `docs/design-component-state-accessibility-matrix-v1.md`
7. `docs/design-motion-transition-spec-v1.md`
8. `docs/design-technical-art-asset-pipeline-spec-v1.md`
9. `docs/design-generation-briefs-wave1-v1.md`
10. `docs/design-generation-execution-packet-W1-01-TOP-v1.md`
11. `docs/design-implementation-execution-plan-v1.md`
12. `docs/design-implementation-handoff-template-v1.md`
13. `docs/design-production-completeness-gates-v1.md`
14. `docs/design-human-decision-interaction-protocol-v1.md`
15. `docs/design-documentation-contradiction-register-v1.md`
16. `docs/design-documentation-contradiction-resolution-C-011.md`
17. `docs/design-font-license-glyph-audit-v1.md`
18. `docs/design-font-source-coverage-result-2026-07-28.md`
19. `docs/design-reference-rights-boundary-v1.md`

Historical handoff/roadmap:

- `docs/design-heavy-production-future-roadmap-2026-07-27.md`
- `docs/design-heavy-production-next-chat-handoff-2026-07-27.md`
- `docs/design-language-foundation-proposal-v1.md`

Historical proposal内の方向未選択表現は現在値ではない。現在の人間判断は次である。

```txt
HD-ART-DIRECTION-001=A
QUIET_NIGHT_SMALL_WARMTH
静かな夜と小さな温かさ
```

## 2. 現在のPhase

```txt
Completed: U45.1 Character and Enemy Dot Runtime Pass
Completed: U45.1 candidate/production readiness hardening
Completed: U46 AppFlow / Save / Result / 灯録 candidate
Completed: U46.1 Result / Save Hardening
Completed: U47 gameplay data/runtime
Completed: U48 production asset expansion
Current: U49 actual-device audio/haptic
Parallel: Heavy Design HD0 DOCUMENTATION_FOUNDATION
Next: U50 performance/touch metrics
Then: U51 RC
```

U49は現在のsigned buildを物理iPhoneで確認するまで`BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE`を維持する。

Heavy DesignはU49 Audio/Hapticと独立管理する。Heavy Designの文書commit、画像候補、Unity visual実装により、U49 evidence／readinessを変更しない。

StageSelect／LevelUpはstructural remediation後も人間reviewで`FAIL`。キャラクター・敵以外のwhole-app visualは未承認である。

監査正本:

```txt
docs/unity-whole-app-heavy-design-audit-2026-07-27.md
docs/design-targets/generated/unity-whole-app-design-audit-2026-07-27/screen-audit.json
docs/design-targets/generated/unity-whole-app-design-audit-2026-07-27/human-visual-rejection.json
```

`runtimeVisualReady=true`はU48 approved production visual groupsがproviderへ接続され、該当scopeのresponsive Simulator verificationを通過した履歴値である。Whole-app human visual approval、actual-device、audio、haptic、performance、RC、store approvalを意味しない。

## 3. Heavy Design現在地

### Workflow state

```txt
currentState=DOCUMENTATION_FOUNDATION
currentStateCode=HD0
allowedNextState=WAVE1_GENERATION_APPROVED
nextTransitionRequiresHumanApproval=true
```

Machine-readable source:

```txt
docs/design-targets/generated/design-production/workflow-state.json
```

### Documentation verdict

```txt
DocumentationFoundationPrepared=true
DocumentationFoundationGatePassed=true
DocumentationFoundationReview=PASS_FOR_DOCUMENTATION_FOUNDATION
RemainingDocumentationTasks=0
ArtDirectionHumanDirectionLocked=true
ArtDirectionVisuallyLocked=false
ScreenSpecifications=13/13
ComponentStateMatrix=DOCUMENTED_COMPLETE
MotionTransitionFamilies=7
TechnicalArtPipeline=DOCUMENTED
RuntimeComparisonReady=13/13
Wave1Briefs=3_PREPARED_NOT_APPROVED
W1_01_TOP_ExecutionPacket=PREPARED_NOT_HUMAN_APPROVED
ImageGenerationStarted=false
UnityDesignImplementationStarted=false
WholeAppHumanVisualAccepted=false
PendingHumanDecisionCount=0
```

Machine-readable sources:

```txt
docs/design-targets/generated/design-production/documentation-readiness.json
docs/design-targets/generated/design-production/documentation-foundation-review.json
docs/design-targets/generated/design-production/human-decision-queue.json
```

Documentation foundation PASSは、実装前設計が揃ったことを意味する。画像生成、candidate採用、Design Language visual lock、Unity実装、whole-app approvalを意味しない。

## 4. W1-01 TOP

W1-01 TOPは次の正本を使う。

```txt
docs/design-generation-execution-packet-W1-01-TOP-v1.md
docs/design-targets/generated/design-production/W1-01-TOP-execution-packet.json
docs/design-targets/generated/design-production/generation-request-queue.json
```

現在:

```txt
status=PREPARED_NOT_HUMAN_APPROVED
candidateCount=3
C01=夜路の入口
C02=記憶の窓
C03=灯りの停留所
activeRequest=null
imageGenerationStarted=false
```

TOPは独立runtime screenが存在しない。

```txt
runtimeState=MISSING
capture=null
runtimeBaselineMode=ABSENCE_EVIDENCE
```

存在しないruntime captureを開始条件にしない。Whole-app audit、Boot→StageSelect route、existing references、W1-01 packetを正式baselineとする。

画像生成はこのChatGPT会話で1 briefずつ行う。Repository agentは画像を生成しない。

## 5. Font現在地

Font:

```txt
Zen Maru Gothic Medium
License=SIL Open Font License 1.1
Commercial use=PASS
App bundling=PASS
```

Current TMP asset:

```txt
PopulationMode=DYNAMIC
SerializedGlyphTableEmpty=true
SerializedCharacterTableEmpty=true
SourceFontBound=true
MultiAtlasEnabled=true
ClearDynamicDataOnBuild=true
```

Automated source TTF coverage:

```txt
Result=PASS
MissingFromSourceFont=0
Stage1QualityRun=1002
```

正本:

```txt
docs/design-font-license-glyph-audit-v1.md
docs/design-font-source-coverage-result-2026-07-28.md
docs/design-targets/generated/design-production/font-glyph-coverage-contract.json
```

Source TTF coverage PASSだけでは`fullProductGlyphCoverageComplete`へ昇格しない。Controlled static atlas生成、atlas memory、physical iPhone表示確認が必要である。

## 6. 人間判断の運用

正本:

```txt
docs/design-human-decision-interaction-protocol-v1.md
docs/design-targets/generated/design-production/human-decision-queue.json
```

Rules:

- 作業側が調査・比較・推奨を先に完了する。
- ユーザーには原則1回1問。
- 2〜4択のクリック式を優先する。
- UIが利用できない場合のみA／B／Cで代替する。
- 技術事項をユーザーへ丸投げしない。
- 未回答中は依存するLOCK、生成、実装へ進まない。

Current queue:

```txt
pending=0
activeDecision=null
```

次の人間判断は、ユーザーが画像生成開始を意図した時点の`W1-01 TOP brief approval`である。

## 7. 現在のruntime境界

```txt
UnityEditor=6000.5.1f1
RenderPipeline=2D_URP
RuntimeUI=uGUI
EditorOnlyUI=UI_Toolkit
runtimeVisualClassification=production-animated-sprite
simulatorPlayableCandidateReady=true
actualDeviceSmokeResult=NOT_PROVIDED
characterDotRuntimeReady=true
characterAnimationReady=true
enemyDotRuntimeReady=true
enemyAnimationReady=true
runtimeVisualReady=true
productionVisualAssetProviderConnected=true
productionCharacterAssetReady=true
productionEnemyAssetReady=true
productionDataRegistryImplemented=true
audioMixerImplemented=true
audioMixerDeviceVerified=false
audioReady=false
hapticReady=false
devicePlayableReady=false
mobileMetricsReady=false
audioLatencyMeasured=false
hapticMeasured=false
rcReady=false
productionApproved=false
```

## 8. 領域別正本

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
| Heavy Design state machine | `docs/design-production-state-machine-v1.md` |
| foundation review | `docs/design-documentation-foundation-review-2026-07-28.md` |
| selected Art Direction | `docs/design-art-direction-quiet-night-warmth-v1.md` |
| screen specifications | `docs/design-screen-completion-specifications-v1.md` |
| component states / accessibility | `docs/design-component-state-accessibility-matrix-v1.md` |
| motion / transitions | `docs/design-motion-transition-spec-v1.md` |
| technical art / pipeline | `docs/design-technical-art-asset-pipeline-spec-v1.md` |
| Wave 1 briefs | `docs/design-generation-briefs-wave1-v1.md` |
| W1-01 TOP packet | `docs/design-generation-execution-packet-W1-01-TOP-v1.md` |
| implementation execution | `docs/design-implementation-execution-plan-v1.md` |
| implementation handoff | `docs/design-implementation-handoff-template-v1.md` |
| completeness gates | `docs/design-production-completeness-gates-v1.md` |
| human decision interaction | `docs/design-human-decision-interaction-protocol-v1.md` |
| contradiction register | `docs/design-documentation-contradiction-register-v1.md` |
| TOP baseline resolution | `docs/design-documentation-contradiction-resolution-C-011.md` |
| font audit | `docs/design-font-license-glyph-audit-v1.md` |
| font source result | `docs/design-font-source-coverage-result-2026-07-28.md` |
| reference rights | `docs/design-reference-rights-boundary-v1.md` |
| responsive | `docs/unity-responsive-screen-policy.md` |
| performance | `docs/unity-mobile-performance-budget.md` |
| mobile QA | `docs/mobile-release-qa-gates.md` |

## 9. Current evidence

Heavy Design:

```txt
docs/design-targets/generated/design-production/workflow-state.json
docs/design-targets/generated/design-production/documentation-readiness.json
docs/design-targets/generated/design-production/documentation-foundation-review.json
docs/design-targets/generated/design-production/human-decision-queue.json
docs/design-targets/generated/design-production/generation-request-queue.json
docs/design-targets/generated/design-production/W1-01-TOP-execution-packet.json
docs/design-targets/generated/design-production/reference-registry.json
docs/design-targets/generated/design-production/current-runtime-comparison-manifest.json
docs/design-targets/generated/design-production/asset-provenance-registry-template.json
docs/design-targets/generated/design-production/font-glyph-coverage-contract.json
```

Runtime/U48/U49:

```txt
docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json
docs/design-targets/generated/unity-u47/simulator-smoke/manifest.json
docs/design-targets/generated/unity-u48/approval-pack/approval-manifest.json
docs/design-targets/generated/unity-u48/human-selection-decision.json
docs/design-targets/generated/unity-u48/approved-production-set.json
docs/design-targets/generated/unity-u48/production-visual-connection.json
docs/design-targets/generated/unity-u48/production-verification/manifest.json
docs/design-targets/generated/unity-u49/readiness.json
docs/design-targets/generated/unity-u49/device-build-result.json
docs/design-targets/generated/unity-u49/device-install-launch-result.json
docs/design-targets/generated/unity-u50/thresholds.json
docs/design-targets/generated/unity-current-state/state.json
```

Historical prerequisite evidenceは現在のHeavy Design human rejectionやU49 readinessを上書きしない。

## 10. Current checks

```sh
pnpm implementation:preflight:check
pnpm implementation:preflight:full
pnpm unity:term-lock:check
pnpm design:heavy-documentation:check
node --experimental-strip-types scripts/quality/check-design-w1-top-packet.ts
node --experimental-strip-types scripts/quality/check-design-font-source-coverage.ts
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

Stage1 Qualityは次を順に実行する。

```txt
active terminology
Heavy Design phase-aware consistency
W1-01 TOP packet consistency
runtime font source coverage
runtime asset verification
automated tests
TypeScript / Vite build
```

## 11. Historical documents

U0〜U45.1および旧Web final planは履歴と証跡として保持する。現在の実装順、asset approval、visual completion、READY判定を決める正本として単独使用しない。

Historicalまたは現在分類で上書きされる例:

- U1開始用prompt。
- Placeholder／proof-only合格条件。
- Point Filterだけをvisual completionとする記述。
- Web画面をcurrent finalとする記述。
- `final` filenameをapprovalとする解釈。
- 正式用語ではない旧表記。
- U45.1 candidate runtimeが現在値であるように見える記述。
- 旧Unity versionの誤記。

## 12. Final rule

新規エージェントはこのIndexから入り、対象Phaseの個別文書だけで判断しない。

Active source of truth同士でPhase、workflow state、readiness、provider、approval、human decision、generation queueが一致しない場合は、画像生成や実装を停止し、先に整合性を修復する。

現在の次の正規transitionは`HD0 → HD1 WAVE1_GENERATION_APPROVED`であり、W1-01 TOPに対する明示的人間承認が必要である。
