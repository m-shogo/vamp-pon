# ヨルノシルベ Design Documentation Contradiction Register v1

Date: 2026-07-28
Status: **ACTIVE / CURRENT CONTRADICTIONS RESOLVED BY PRECEDENCE**
Repository: `m-shogo/vamp-pon`

## 1. 目的

歴史文書を削除・改変して証跡を失わず、現在の明示的人間判断と矛盾する記述を一覧化し、どの正本が上書きするかを固定する。

## 2. Resolution rule

```txt
latest explicit human decision
> Design Documentation Readiness Control Center
> selected Art Direction
> current Screen Specifications
> current registries
> current audit
> automated pass
> historical docs
```

Historical documentは当時の事実として残すが、現在判断へ単独使用しない。

## 3. Contradictions

### C-001 Old `final` / `current target` wording

Historical sources:

```txt
docs/current-visual-targets-2026-06-30.md
docs/non-battle-final-design-implementation-plan.md
docs/design-targets/final/*.png
```

Conflict:

- `final`や`current target`という表現が、現在もhuman-approved targetであるように見える。
- 2026-07-27のwhole-app human rejectionでは、character/enemy以外は未承認。

Resolution:

```txt
docs/design-targets/generated/design-production/reference-registry.json
```

が現在分類を決める。Current approved target countは0。旧画像はREWORK_SOURCE、COMPOSITION_REFERENCE_ONLY、COMPONENT_REFERENCE_ONLY、HISTORICALとして保持する。

Status: `RESOLVED_BY_REGISTRY`

### C-002 StageSelect / LevelUpの過去評価

Historical sources:

- Web見本として十分。
- 3card構造やrouteが成立。

Current evidence:

```txt
StageSelect human review=FAIL
LevelUp human review=FAIL
```

Resolution:

```txt
docs/design-screen-completion-specifications-v1.md
```

で再設計する。構造改善は保持するがvisual approvalへ昇格しない。

Status: `RESOLVED_BY_CURRENT_HUMAN_REJECTION`

### C-003 TOPの存在

Historical source:

- TOP target imageとWeb TOPが存在。

Current Unity audit:

- 独立TOP runtime screenはMISSING。
- BootからStageSelectへ直接遷移。

Resolution:

- Reference imageの存在とruntime screenの存在を分離する。
- `current-runtime-comparison-manifest.json`でTOPをMISSINGとして記録。
- W1-01で新しいcomposition referenceを準備する。

Status: `RESOLVED_BY_RUNTIME_MANIFEST`

### C-004 `runtimeVisualReady=true`の意味

Possible misreading:

- Whole-app visualが完成・承認済み。

Correct meaning:

- U48 production character/enemy/visual groupsがproviderへ接続され、該当scopeのresponsive verificationを通過。

Not proven:

```txt
whole-app human visual approval
actual-device quality
audio/haptic quality
performance
RC
store approval
```

Resolution:

- Current Doc IndexとHeavy Design Control Centerの境界を優先。

Status: `RESOLVED_BY_SCOPE_BOUNDARY`

### C-005 Art Directionの選択状態

Older state:

```txt
PROPOSED_AWAITING_HUMAN_DIRECTION_SELECTION
HD-ART-DIRECTION-001=PENDING
```

Current human decision:

```txt
HD-ART-DIRECTION-001=A
QUIET_NIGHT_SMALL_WARMTH
```

Resolution:

```txt
docs/design-art-direction-quiet-night-warmth-v1.md
docs/design-targets/generated/design-production/human-decisions/HD-ART-DIRECTION-001.json
docs/design-targets/generated/design-production/documentation-readiness.json
```

が現在値。`design-language-foundation-proposal-v1.md`の未選択表現は作成時点の提案履歴として扱い、現在statusの正本にしない。

Status: `RESOLVED_BY_HUMAN_DECISION`

### C-006 黒耀化の表記

Historical documentsには`黒曜化`が残る。

Correct current term:

```txt
黒耀化
```

Resolution:

- Historical evidence内の旧表記は当時の記録として残せる。
- 新規正本、runtime label、asset brief、human decisionでは必ず`黒耀化`。
- 新規正本で`黒曜化`を検出した場合はFAIL。

Status: `RESOLVED_BY_TERM_LOCK`

### C-007 Phaser/Web implementation instructions

Historical sourcesにはPhaser GraphicsやWeb Sceneへの実装指示がある。

Current runtime:

```txt
Unity 6000.5.1f1
2D URP
uGUI runtime
UI Toolkit editor-only
```

Resolution:

- Web実装指示はhistorical reference。
- 現在はUnity screen spec、technical art、handoff templateを使用。

Status: `RESOLVED_BY_CURRENT_RUNTIME`

### C-008 Image generation authority

Potential conflict:

- Repository agentが画像を生成・自動採用する。

Current rule:

```txt
imageGenerationAuthority=CHATGPT_HUMAN_SUPERVISED
repositoryAgentMayGenerateImages=false
```

Resolution:

- Generation QueueとControl Centerを正本とする。

Status: `RESOLVED_BY_AUTHORITY_LOCK`

### C-009 Documentation work vs implementation work

Potential conflict:

- 文書が増えたためUnity実装開始可能と誤認。

Current state:

```txt
documentationFoundationPrepared=true
imageGenerationStarted=false
componentCandidateApproved=false
unityImplementationStarted=false
```

Resolution:

- Documentation readinessとimplementation readinessを別gateで管理。

Status: `RESOLVED_BY_SEPARATE_GATES`

### C-010 U49 / Heavy Design mixing

Potential conflict:

- Design更新でU49 evidence/readinessも変更する。

Resolution:

```txt
u49EvidenceMutation=false
Heavy Design is independent documentation/design phase
```

Status: `RESOLVED_BY_PHASE_BOUNDARY`

## 4. Active unresolved contradictions

```txt
count=0
```

ただし、新規commitでactive source同士に矛盾が生じた場合はfeature/design作業を停止する。

## 5. Historical documents handling

- 削除しない。
- 当時の結果を書き換えない。
- 冒頭へ大量の追記を繰り返さない。
- Current Doc Indexと本registerから現在の正本へ誘導する。
- 必要ならregistry/classificationで意味を更新する。

## 6. Required current-state wording

次の表現を使用する。

```txt
Art Direction human direction selected
Art Direction visually not locked
Design documentation foundation prepared
Image generation not started
Unity design implementation not started
Whole-app human visual approval false
U49 evidence unchanged
U50 not started
```

## 7. 現在判定

```txt
ContradictionScanComplete=true
ActiveContradictions=0
HistoricalEvidencePreserved=true
CurrentPrecedenceDefined=true
NextAction=SYNC_CURRENT_DOC_INDEX_AND_READINESS
```
