# ヨルノシルベ Design Documentation Readiness Control Center v1

Date: 2026-07-28
Status: **ACTIVE / DOCUMENTATION FOUNDATION REVIEW / NO IMPLEMENTATION**
Repository: `m-shogo/vamp-pon`
Branch: `integration/u49-pr75-integrity-20260727`

## 1. 目的

Heavy Designを感覚で「十分」「完璧」と判定せず、画像生成前、画像生成後、Unity実装前、実装後の条件を分離して管理する。

この文書は現在のHeavy Design documentationの最上位control centerである。

## 2. 現在の絶対境界

```txt
heavyDesignStatus=DOCUMENTATION_REFINEMENT
selectedArtDirection=QUIET_NIGHT_SMALL_WARMTH
imageGenerationStarted=false
repositoryAgentMayGenerateImages=false
imageGenerationAuthority=CHATGPT_HUMAN_SUPERVISED
unityDesignImplementationStarted=false
runtimeMutationAllowed=false
u49EvidenceMutationAllowed=false
wholeAppHumanVisualAccepted=false
u50MayStart=false
pr76MustRemainDraft=true
```

## 3. 読む順番

1. `docs/unity-current-doc-index-2026-07-10.md`
2. 本書
3. `docs/design-art-direction-quiet-night-warmth-v1.md`
4. `docs/design-language-foundation-proposal-v1.md`
5. `docs/design-screen-completion-specifications-v1.md`
6. `docs/design-component-state-accessibility-matrix-v1.md`
7. `docs/design-motion-transition-spec-v1.md`
8. `docs/design-technical-art-asset-pipeline-spec-v1.md`
9. `docs/design-generation-briefs-wave1-v1.md`
10. `docs/design-targets/generated/design-production/reference-registry.json`
11. `docs/design-targets/generated/design-production/generation-request-queue.json`
12. `docs/design-production-completeness-gates-v1.md`
13. `docs/design-human-decision-interaction-protocol-v1.md`

## 4. Source precedence

```txt
1. latest explicit human decision
2. this control center
3. selected Art Direction document
4. Screen Completion Specifications
5. Component State / Accessibility Matrix
6. Motion / Transition Specification
7. Technical Art / Asset Pipeline
8. Reference Registry
9. Generation Briefs / Queue
10. current runtime captures and audit
11. automated visual pass
12. historical docs
```

旧文書の`final`、`current target`、自動PASSは現在のhuman decisionを上書きしない。

## 5. 23-domain documentation review

| Domain | Status | Evidence | Remaining condition |
| --- | --- | --- | --- |
| 1 Color token / area ratio | DEFINED_PROPOSAL | Art Direction / Design Language | device comparison後にLOCK |
| 2 Typography roles / font | DEFINED_BASELINE | Art Direction / Design Language | font license/glyph audit、visual comparison |
| 3 Paper texture / edge | DEFINED_PROPOSAL | Art Direction | candidate/device comparison |
| 4 Ink semantics | DEFINED | Art Direction | motion asset validation |
| 5 Lantern meaning / intensity | DEFINED | Art Direction | candidate/device validation |
| 6 UI / dot character cohesion | PRINCIPLES_DEFINED | Art Direction | representative screen comparison |
| 7 Icon family | DEFINED_PROPOSAL | Art Direction / State Matrix | formal icon production |
| 8 Motion / reduced motion | DEFINED | Motion Spec | runtime validation |
| 9 Screen transitions | DEFINED_7_FAMILIES | Motion Spec | runtime/input validation |
| 10 Wave1 generation briefs | PREPARED | Generation Briefs | active brief human approval |
| 11 Existing target reuse | CLASSIFIED | Reference Registry | new comparison decisions |
| 12 Master/runtime dimensions | DEFINED | Technical Art Spec | asset-family implementation confirmation |
| 13 Cleanup process | DEFINED | Technical Art Spec | candidate execution |
| 14 Comparison pack | DEFINED | Generation Briefs | candidate creation |
| 15 Visual freeze changes | DEFINED | Completeness Gates | D10 execution |
| G1 Technical art budget | DEFINED_PROPOSAL | Technical Art Spec | U50 calibration |
| G2 Export/import policy | DEFINED_PROPOSAL | Technical Art Spec | Unity import mapping |
| G3 Component state matrix | DOCUMENTED_COMPLETE | State Matrix | component production verification |
| G4 First-time flow | DEFINED | State Matrix / Screen Specs | fresh-eyes test |
| G5 Accessibility | DEFINED_BASELINE | State Matrix | VoiceOver technical method/device test |
| G6 Rights/provenance | SCHEMA_DEFINED | Completeness Gates / Technical Art | candidate-by-candidate review |
| G7 Store surfaces | ROADMAP_RESERVED | Completeness Gates | after product visual lock |
| G8 Fresh-eyes review | PLANNED_NOT_STARTED | Completeness Gates | after representative visuals |

## 6. Documentation foundation verdict

現時点で、次は文書化済みである。

- Human-selected emotional direction。
- Art Directionの意味、強度、禁止例。
- Color、Typography、Paper、Ink、Lantern、Iconのsystem proposal。
- 13 screenのcompletion spec。
- Component state matrix。
- First-time flowとaccessibility baseline。
- Motion tokenと7 transition family。
- Technical art budget、export/import、atlas、cleanup、rollback。
- Existing referenceの現在分類。
- TOP / StageSelect / LevelUpのgeneration brief。
- Comparison packとoutput path。

ただし、文書の存在だけで販売品質は保証しない。

## 7. 画像生成前の残作業

画像生成を開始する前に、最低限次を完了する。

```txt
fontLicenseAndGlyphAuditComplete
internalReferenceRightsBoundaryConfirmed
currentRuntimeComparisonManifestComplete
activeWave1BriefHumanApproved
comparisonPackFolderContractConfirmed
humanDecisionQueueConsistent
```

TOPはruntime screenがMISSINGであるため、`current runtime capture`の代わりに次を比較材料とする。

```txt
missing-state audit evidence
existing TOP references
current Boot→StageSelect route evidence
A-direction brief
```

## 8. 画像生成後の残作業

```txt
threeDirectionCandidatesCreated
humanDirectionSelected
refinedReferenceApproved
componentBoardCreated
componentCandidateApproved
cleanupComplete
commercialUseReviewed
assetLineageRecorded
```

## 9. Unity実装前の残作業

```txt
implementationBranchDefined
exactFilesAndRuntimeOwnersMapped
prefabThemeMigrationPlanDefined
responsiveBehaviorConfirmed
stateVariantsConfirmed
safeAreaAndTapContractConfirmed
performanceRiskReviewed
rollbackPlanBoundToBaseline
humanImplementationStartApproval=true
```

## 10. 実装中の原則

- 画面ごとに小さくcommit。
- TOP → StageSelect → LevelUpの順。
- 共通componentを抽出してから次画面へ。
- gameplay、save、navigation、U49 evidenceを混ぜない。
- structural passをvisual passと呼ばない。
- 自動captureをhuman approvalの代わりにしない。
- 失敗した画面を残したまま次の画面へ進まない。

## 11. 実装開始判定

現時点:

```txt
documentationFoundationPrepared=true
documentationFoundationHumanReviewed=false
imageGenerationMayStart=false
unityImplementationMayStart=false
```

実装開始条件:

```txt
preGenerationDocumentationGate=true
Wave1 reference and component assets approved=true
implementation handoff pack complete=true
human explicit implementation start=true
```

## 12. 次の自走タスク

順番:

```txt
1. font license / glyph coverage documentation audit
2. current runtime comparison manifest
3. rights/provenance registry template
4. implementation handoff template
5. documentation contradiction scan
6. userへ必要な判断だけクリック式で提示
```

## 13. 停止条件

次を検出したら作業を止めて整合性を修復する。

- active source of truth間のstatus矛盾。
- human decisionとregistryの不一致。
- image generationがHOLD中に開始された形跡。
- runtime、U49 evidence、U50がdocumentation commitへ混入。
- old final targetのautomatic approval。
- incorrect term `黒曜化`を新規正本で使用。

## 14. 現在判定

```txt
DocumentationFoundation=PREPARED_FOR_COMPLETENESS_REVIEW
ArtDirectionHumanDirectionLocked=true
ArtDirectionVisuallyLocked=false
ScreenSpecs=13/13
ComponentStateMatrix=DOCUMENTED_COMPLETE
MotionTransitionFamilies=7
TechnicalArtPipeline=DOCUMENTED
ReferenceRegistry=DOCUMENTED
Wave1Briefs=3_PREPARED_NOT_APPROVED
ImageGeneration=NOT_STARTED
UnityImplementation=NOT_STARTED
NextAction=COMPLETE_REMAINING_DOCUMENT_AUDITS
```
