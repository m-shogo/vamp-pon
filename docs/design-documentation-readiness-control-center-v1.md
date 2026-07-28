# ヨルノシルベ Design Documentation Readiness Control Center v1

Date: 2026-07-28
Status: **ACTIVE / DOCUMENTATION FOUNDATION PREPARED / NO IMPLEMENTATION**
Repository: `m-shogo/vamp-pon`
Branch: `integration/u49-pr75-integrity-20260727`

## 1. 目的

Heavy Designを感覚で「十分」「完璧」と判定せず、画像生成前、画像生成後、Unity実装前、実装後の条件を分離して管理する。

この文書は現在のHeavy Design documentationの最上位control centerである。

## 2. 現在の絶対境界

```txt
heavyDesignStatus=DOCUMENTATION_FOUNDATION_PREPARED
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
4. `docs/design-screen-completion-specifications-v1.md`
5. `docs/design-component-state-accessibility-matrix-v1.md`
6. `docs/design-motion-transition-spec-v1.md`
7. `docs/design-technical-art-asset-pipeline-spec-v1.md`
8. `docs/design-generation-briefs-wave1-v1.md`
9. `docs/design-implementation-execution-plan-v1.md`
10. `docs/design-implementation-handoff-template-v1.md`
11. `docs/design-font-license-glyph-audit-v1.md`
12. `docs/design-reference-rights-boundary-v1.md`
13. `docs/design-targets/generated/design-production/reference-registry.json`
14. `docs/design-targets/generated/design-production/current-runtime-comparison-manifest.json`
15. `docs/design-targets/generated/design-production/generation-request-queue.json`
16. `docs/design-production-completeness-gates-v1.md`
17. `docs/design-human-decision-interaction-protocol-v1.md`
18. `docs/design-documentation-contradiction-register-v1.md`

Historical reference only:

- `docs/design-heavy-production-future-roadmap-2026-07-27.md`
- `docs/design-heavy-production-next-chat-handoff-2026-07-27.md`
- `docs/design-language-foundation-proposal-v1.md`

## 4. Source precedence

```txt
1. latest explicit human decision
2. this control center
3. selected Art Direction document
4. Screen Completion Specifications
5. Component State / Accessibility Matrix
6. Motion / Transition Specification
7. Technical Art / Asset Pipeline
8. Implementation Execution Plan
9. Reference Registry
10. Generation Briefs / Queue
11. current runtime captures and audit
12. automated visual pass
13. historical docs
```

旧文書の`final`、`current target`、自動PASSは現在のhuman decisionを上書きしない。

## 5. 23-domain documentation review

| Domain | Status | Evidence | Remaining condition |
| --- | --- | --- | --- |
| 1 Color token / area ratio | DEFINED_PROPOSAL | Art Direction | generated/device comparison後にLOCK |
| 2 Typography roles / font | LICENSE_PASS / ROLES_DEFINED | Font Audit / Art Direction | full-product glyph execution、visual comparison |
| 3 Paper texture / edge | DEFINED_PROPOSAL | Art Direction | candidate/device comparison |
| 4 Ink semantics | DEFINED | Art Direction | motion asset validation |
| 5 Lantern meaning / intensity | DEFINED | Art Direction | candidate/device validation |
| 6 UI / dot character cohesion | PRINCIPLES_DEFINED | Art Direction | representative screen comparison |
| 7 Icon family | DEFINED_PROPOSAL | Art Direction / State Matrix | formal icon production |
| 8 Motion / reduced motion | DEFINED | Motion Spec | runtime validation |
| 9 Screen transitions | DEFINED_7_FAMILIES | Motion Spec | runtime/input validation |
| 10 Wave1 generation briefs | PREPARED_NOT_APPROVED | Generation Briefs | active brief human approval |
| 11 Existing target reuse | CLASSIFIED | Reference Registry | new comparison decisions |
| 12 Master/runtime dimensions | DEFINED | Technical Art Spec | asset-family execution confirmation |
| 13 Cleanup process | DEFINED | Technical Art Spec | candidate execution |
| 14 Comparison pack | DEFINED | Generation Briefs / Runtime Manifest | candidate creation |
| 15 Visual freeze changes | DEFINED | Completeness Gates | D10 execution |
| G1 Technical art budget | DEFINED_PROPOSAL | Technical Art Spec | runtime/U50 validation |
| G2 Export/import policy | DEFINED_PROPOSAL | Technical Art Spec | approved asset import execution |
| G3 Component state matrix | DOCUMENTED_COMPLETE | State Matrix | component production verification |
| G4 First-time flow | DEFINED | State Matrix / Screen Specs | fresh-eyes test |
| G5 Accessibility | DEFINED_BASELINE | State Matrix | VoiceOver technical method/device test |
| G6 Rights/provenance | BOUNDARY_CONFIRMED / SCHEMA_DEFINED | Rights Doc / Registry Template | candidate-by-candidate review |
| G7 Store surfaces | ROADMAP_RESERVED | Completeness Gates | after product visual lock |
| G8 Fresh-eyes review | PLANNED_NOT_STARTED | Completeness Gates | after representative visuals |

## 6. Documentation foundation verdict

次は文書化済みである。

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
- Current runtime／absence baseline manifest。
- Rights boundaryとprovenance template。
- Unity implementation handoff template。
- Low-rework implementation execution sequence。
- Contradiction register。
- Automated Heavy Design documentation checker。

Machine-readable foundation gate:

```txt
docs/design-targets/generated/design-production/documentation-readiness.json
documentationGate.gatePassed=true
remainingDocumentationTasks=[]
```

文書の存在やchecker PASSだけで販売品質を保証しない。

## 7. 画像生成前の残条件

文書作成として未完了の必須項目はない。

画像生成を意図的に開始する時点で、次を実行・承認する。

```txt
activeWave1BriefHumanApproved=true
fullProductGlyphCoverageComplete=true または Typography LOCK前に実行予定が明示されている
humanDecisionQueueConsistent=true
runtimeBaselineEvidenceReady=true
comparisonPackPrepared=true
```

TOPはruntime screenがMISSINGであるため、captureではなく次を正式baselineとする。

```txt
missing-state audit evidence
current runtime comparison manifest TOP entry
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

`docs/design-implementation-execution-plan-v1.md`と
`docs/design-implementation-handoff-template-v1.md`を必須入力とする。

```txt
implementationBranchDefined
exactFilesAndRuntimeOwnersMapped
prefabThemeMigrationPlanBound
responsiveBehaviorConfirmed
stateVariantsConfirmed
safeAreaAndTapContractConfirmed
performanceRiskReviewed
rollbackPlanBoundToBaseline
fullProductGlyphCoverageComplete
humanImplementationStartApproval=true
```

## 10. 実装中の原則

- Preview／dual-pathから始め、旧production ownerを即削除しない。
- 画面ごとに小さくcommit。
- TOP → StageSelect → LevelUpの順。
- 共通componentを抽出してから次画面へ。
- gameplay、save、navigation、U49 evidenceを混ぜない。
- structural passをvisual passと呼ばない。
- 自動captureをhuman approvalの代わりにしない。
- 失敗した画面を残したまま次の画面へ進まない。
- ownership切替commitと旧path削除commitを分ける。

## 11. 実装開始判定

現時点:

```txt
documentationFoundationPrepared=true
documentationFoundationMachineVerified=true
documentationFoundationHumanReviewed=false
imageGenerationMayStart=false
unityImplementationMayStart=false
```

実装開始条件:

```txt
Wave1 approved reference and component assets=true
implementation handoff pack complete=true
full product glyph coverage=true
human explicit implementation start=true
```

## 12. 自動検査

Stage1 Qualityで次を順に確認する。

```txt
1. active terminology lock
2. Heavy Design documentation consistency
3. runtime asset verification
4. automated tests
5. TypeScript / Vite build
```

Heavy Design checker:

```txt
scripts/quality/check-heavy-design-documentation.ts
```

検査対象:

- required source-of-truth files。
- Art Direction A。
- 13 screens。
- 3 Wave 1 briefs。
- TOP absence baseline。
- StageSelect／LevelUp captures。
- pending human decision 0。
- current approved whole-screen target 0。
- image generation false。
- Unity design implementation false。
- U49/U50境界。

## 13. 停止条件

次を検出したら作業を止めて整合性を修復する。

- active source of truth間のstatus矛盾。
- human decisionとregistryの不一致。
- image generationがHOLD中に開始された形跡。
- runtime、U49 evidence、U50がdocumentation commitへ混入。
- old final targetのautomatic approval。
- 非canonicalな用語を新規正本で使用。
- TOPへ存在しないruntime captureを要求。
- candidate importとproduction ownership切替を同時に行う。

## 14. 現在判定

```txt
DocumentationFoundation=DOCUMENTATION_FOUNDATION_PREPARED
DocumentationGatePassed=true
ArtDirectionHumanDirectionLocked=true
ArtDirectionVisuallyLocked=false
ScreenSpecs=13/13
ComponentStateMatrix=DOCUMENTED_COMPLETE
MotionTransitionFamilies=7
TechnicalArtPipeline=DOCUMENTED
ReferenceRegistry=DOCUMENTED
RuntimeComparisonReady=13/13
Wave1Briefs=3_PREPARED_NOT_APPROVED
ImplementationExecutionPlan=DOCUMENTED
ImageGeneration=NOT_STARTED
UnityImplementation=NOT_STARTED
NextAction=WAIT_FOR_INTENTIONAL_WAVE1_BRIEF_APPROVAL_OR_FURTHER_DOCUMENT_REVIEW
```
