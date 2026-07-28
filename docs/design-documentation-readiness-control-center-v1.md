# ヨルノシルベ Design Documentation Readiness Control Center v1

Date: 2026-07-28
Status: **ACTIVE / HD0 DOCUMENTATION FOUNDATION PREPARED / NO IMAGE GENERATION / NO UNITY DESIGN IMPLEMENTATION**
Repository: `m-shogo/vamp-pon`
Branch: `integration/u49-pr75-integrity-20260727`

## 1. 目的

Heavy Designを感覚で「十分」「完璧」と判定せず、documentation、画像生成、人間選択、component制作、Unity実装、実機review、whole-app visual freezeを別のgateとして管理する。

この文書はHeavy Design documentationの最上位control centerである。

## 2. 現在state

Machine-readable source:

```txt
docs/design-targets/generated/design-production/workflow-state.json
```

State machine:

```txt
docs/design-production-state-machine-v1.md
```

現在値:

```txt
currentState=DOCUMENTATION_FOUNDATION
currentStateCode=HD0
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
allowedNextState=WAVE1_GENERATION_APPROVED
nextTransitionRequiresHumanApproval=true
```

## 3. 必読順

1. `docs/unity-current-doc-index-2026-07-10.md`
2. 本書
3. `docs/design-production-state-machine-v1.md`
4. `docs/design-art-direction-quiet-night-warmth-v1.md`
5. `docs/design-screen-completion-specifications-v1.md`
6. `docs/design-component-state-accessibility-matrix-v1.md`
7. `docs/design-motion-transition-spec-v1.md`
8. `docs/design-technical-art-asset-pipeline-spec-v1.md`
9. `docs/design-generation-briefs-wave1-v1.md`
10. `docs/design-implementation-execution-plan-v1.md`
11. `docs/design-implementation-handoff-template-v1.md`
12. `docs/design-font-license-glyph-audit-v1.md`
13. `docs/design-reference-rights-boundary-v1.md`
14. `docs/design-production-completeness-gates-v1.md`
15. `docs/design-human-decision-interaction-protocol-v1.md`
16. `docs/design-documentation-contradiction-register-v1.md`
17. `docs/design-targets/generated/design-production/documentation-readiness.json`
18. `docs/design-targets/generated/design-production/workflow-state.json`
19. `docs/design-targets/generated/design-production/reference-registry.json`
20. `docs/design-targets/generated/design-production/current-runtime-comparison-manifest.json`
21. `docs/design-targets/generated/design-production/generation-request-queue.json`

Historical reference only:

- `docs/design-heavy-production-future-roadmap-2026-07-27.md`
- `docs/design-heavy-production-next-chat-handoff-2026-07-27.md`
- `docs/design-language-foundation-proposal-v1.md`

## 4. Source precedence

```txt
1. latest explicit human decision
2. workflow-state.json / production state machine
3. this control center
4. selected Art Direction
5. Screen Completion Specifications
6. Component State / Accessibility Matrix
7. Motion / Transition Specification
8. Technical Art / Asset Pipeline
9. Implementation Execution Plan
10. Reference Registry
11. Generation Briefs / Queue
12. current runtime captures and audit
13. automated visual results
14. historical documents
```

`final` filename、旧current target記述、CI success、自動captureは、現在のhuman decisionを上書きしない。

## 5. Documentation foundation verdict

次は文書化済みである。

- 人間選択済みの感情基調「静かな夜と小さな温かさ」。
- Color、Typography、Paper、Ink、Lantern、IconのDesign Language proposal。
- 13画面のcompletion specification。
- Component state matrix。
- First-time flowとaccessibility baseline。
- Motion tokenと7 transition family。
- Technical art budget、export/import、atlas、cleanup、rollback。
- Existing referenceの現在分類。
- TOP／StageSelect／LevelUpのWave 1 generation brief。
- 13画面のruntime capture／absence baseline。
- Rights boundaryとprovenance template。
- Unity implementation handoff template。
- Low-rework implementation sequence。
- Documentation contradiction register。
- Phase-aware production state machine。
- Stage1 Quality上の自動documentation checker。

Machine-readable判定:

```txt
docs/design-targets/generated/design-production/documentation-readiness.json
documentationGate.gatePassed=true
remainingDocumentationTasks=[]
```

これは**実装前設計が揃った**ことを意味する。販売品質、画像候補承認、Unity実装承認を意味しない。

## 6. 23-domain review

| Domain | Current status | 後工程で必要な実証 |
| --- | --- | --- |
| Color token / area ratio | DEFINED_PROPOSAL | generated／device comparison後にLOCK |
| Typography roles / font | LICENSE_PASS / ROLES_DEFINED | full-product glyph verification、visual comparison |
| Paper texture / edge | DEFINED_PROPOSAL | candidate／device comparison |
| Ink semantics | DEFINED | motion asset validation |
| Lantern meaning / intensity | DEFINED | candidate／device validation |
| UI / dot character cohesion | PRINCIPLES_DEFINED | representative screen review |
| Icon family | DEFINED_PROPOSAL | formal icon production |
| Motion / reduced motion | DEFINED | runtime validation |
| Screen transitions | DEFINED_7_FAMILIES | runtime／input validation |
| Wave 1 briefs | 3_PREPARED_NOT_APPROVED | active brief human approval |
| Existing target reuse | CLASSIFIED | new human comparison |
| Master/runtime dimensions | DEFINED | approved asset execution |
| Cleanup process | DEFINED | candidate execution |
| Comparison pack | DEFINED | candidate creation |
| Visual freeze changes | DEFINED | HD9 execution |
| Technical art budget | DEFINED_PROPOSAL | runtime／U50 validation |
| Export/import policy | DEFINED_PROPOSAL | approved asset import |
| Component states | DOCUMENTED_COMPLETE | component production verification |
| First-time flow | DEFINED | fresh-eyes test |
| Accessibility | DEFINED_BASELINE | VoiceOver／device test |
| Rights/provenance | BOUNDARY_CONFIRMED / SCHEMA_DEFINED | candidate-by-candidate review |
| Store surfaces | ROADMAP_RESERVED | after product visual lock |
| Fresh-eyes review | PLANNED_NOT_STARTED | after representative visuals |

## 7. 次transition

HD0から許可される次stateは1つだけである。

```txt
WAVE1_GENERATION_APPROVED
```

このtransitionには、W1-01 TOP briefの明示的人間承認が必要である。

承認前:

```txt
activeWave1BriefHumanApproved=false
preGenerationGate=false
imageGenerationStarted=false
activeRequest=null
```

承認後も、画像生成を実際に開始するcommit／記録とは分ける。

## 8. TOP baseline

TOPは現在runtime screen自体が存在しない。

したがって、存在しないcaptureを要求せず、次を正式baselineとする。

```txt
missing-state audit evidence
current runtime comparison manifest TOP entry
existing TOP references
current Boot→StageSelect route evidence
A-direction W1-01 brief
```

## 9. 画像生成後に必要な条件

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

Candidate追加、human selection、production promotionは別commitにする。

## 10. Unity実装前に必要な条件

必須入力:

- `docs/design-implementation-execution-plan-v1.md`
- `docs/design-implementation-handoff-template-v1.md`

Gate:

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

## 11. 実装原則

- Heavy Design専用branchを使う。
- Preview／dual-pathから始め、旧production ownerを即削除しない。
- TOP → StageSelect → LevelUpの順で進める。
- Shared componentを抽出してから次画面へ進む。
- Gameplay、save、navigation、U49 evidenceを混ぜない。
- Structural passをvisual passと呼ばない。
- 自動captureをhuman approvalの代わりにしない。
- 不合格画面を残して次画面へ進まない。
- Ownership切替commitと旧path削除commitを分ける。
- 1 commitでstateを2段階以上進めない。

## 12. 自動検査

共通コマンド:

```txt
pnpm design:heavy-documentation:check
```

Stage1 Quality:

```txt
1. active terminology
2. Heavy Design documentation / legal state transition
3. runtime asset verification
4. automated tests
5. TypeScript / Vite build
```

Checkerは現在stateに応じて条件を切り替える。画像生成開始後やUnity実装開始後も、正規state transitionを記録すれば「未開始固定」によって誤停止しない。

## 13. 停止条件

次を検出したら作業を停止し、整合性を先に修復する。

- Source of truth間のstate／status矛盾。
- 許可されていないstate transition。
- Human decisionとqueue／registryの不一致。
- Repository agentによる画像生成。
- Runtime、U49 evidence、U50 readinessの不正な混入。
- Old targetのautomatic approval。
- 非canonical用語の新規正本への混入。
- TOPへ存在しないruntime captureを要求。
- Candidate importとproduction ownership切替の同時実行。
- 1 commitで複数stateを飛び越える変更。

## 14. 現在判定

```txt
WorkflowState=HD0_DOCUMENTATION_FOUNDATION
DocumentationFoundation=PREPARED
DocumentationGatePassed=true
StateMachine=ACTIVE_PHASE_AWARE
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
PendingHumanDecision=0
NextAction=CONTINUE_DOCUMENT_REVIEW_OR_EXPLICITLY_APPROVE_W1_01_WHEN_READY
```
