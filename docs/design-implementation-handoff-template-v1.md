# ヨルノシルベ Design → Unity Implementation Handoff Template v1

Date: 2026-07-28
Status: **TEMPLATE / IMPLEMENTATION NOT AUTHORIZED**
Repository: `m-shogo/vamp-pon`

## 1. 目的

画像やcomponent候補が承認された後、Unity担当が推測で実装せず、保持するruntime contract、変更範囲、asset、state、responsive、QA、rollbackを1画面単位で受け取れるようにする。

このテンプレートが埋まっていない画面は実装しない。

## 2. Handoff metadata

```txt
handoffId:
screenId:
briefId:
directionDecisionId:
componentDecisionIds:
baselineCommit:
implementationBranch:
owner:
status: DRAFT | READY_FOR_IMPLEMENTATION | IN_PROGRESS | BLOCKED | COMPLETE
```

## 3. Human approvals

```txt
artDirectionHumanDirectionLocked:
wholeScreenReferenceApproved:
componentBoardApproved:
componentCandidatesApproved:
commercialUseReviewed:
implementationStartApproved:
```

すべてtrueでなければ`READY_FOR_IMPLEMENTATION`にしない。

## 4. Runtime structure to preserve

必ず具体的なclass、Prefab、Scene、data hook、input ownerを列挙する。

```txt
navigation owner:
input owner:
pause owner:
data source:
read model:
save contract:
audio event hooks:
haptic event hooks:
assertions/tests:
responsive profile:
safe area owner:
```

「既存ロジックを維持する」だけでは不十分。

## 5. Allowed changes

```txt
Theme token changes:
Prefab changes:
Sprite/import changes:
Layout changes:
Animation changes:
Diagnostic/capture changes:
Documentation changes:
```

## 6. Forbidden changes

最低限:

- gameplay balance
- save schema
- navigation ownership
- U49 evidence/readiness
- U50 thresholds
- character/enemy production approval chain
- unrelated screen refactor
- historical evidence rewrite

画面固有の禁止範囲も追加する。

## 7. Asset manifest

| Asset ID | Source path | Runtime path | Type | State | Dimensions | Import policy | Approval |
| --- | --- | --- | --- | --- | --- | --- | --- |

必須:

- source hash
- output hash
- provenance registry entry
- 9-slice border
- pivot/PPU
- atlas assignment
- fallback asset

## 8. Component mapping

| Visual role | Existing component | Target component | Reuse / replace | Notes |
| --- | --- | --- | --- | --- |

Primitive内部実装を許可しても、player-facing surfaceをprimitiveだけで完成させない。

## 9. State mapping

| Component | Required states | Asset/state implementation | Missing |
| --- | --- | --- | --- |

Missingは0でなければ実装開始不可。

## 10. Layout / responsive

```txt
Compact <=379:
Standard 380-409:
Large >=410:
Reference 390x844:
Horizontal padding:
Safe area behavior:
Gesture area behavior:
Tap targets:
Text wrapping/max lines:
Decoration reduction policy:
```

Largeで情報量を増やさない。

## 11. Accessibility

```txt
semantic reading order:
labels:
icon-only labels:
color-independent state:
audio alternative:
haptic alternative:
reduced-motion mapping:
contrast verification:
text overflow behavior:
```

## 12. Motion

```txt
transition family:
duration tokens:
easing family:
input lock window:
interrupt/cancel behavior:
reduced-motion alternative:
performance fallback:
```

Animation eventをlogicの唯一の正本にしない。

## 13. Technical art budget

```txt
atlas:
materials:
expected draw calls:
particle budget:
overdraw risks:
mask depth:
shader variants:
low-performance fallback:
```

## 14. Implementation sequence

画面内でも小さく分ける。

```txt
1. baseline capture / tests
2. import approved assets
3. add shared components
4. replace one visual surface
5. run checks and capture
6. continue next surface
7. responsive verification
8. simulator route
9. human comparison
10. device verification
```

## 15. Validation

### Static / automated

```txt
relevant checker:
unit/editor tests:
build:
meta/GUID:
responsive captures:
route smoke:
```

### Human

```txt
side-by-side pack:
390x844 review:
Compact review:
Large review:
interaction clarity:
brand distinctiveness:
asset cohesion:
character/UI cohesion:
```

## 16. Completion criteria

```txt
structuralAcceptance=true
visualAcceptance=true
assetAcceptance=true
responsiveCompactPass=true
responsiveStandardPass=true
responsiveLargePass=true
accessibilityCriticalFailure=0
performanceCriticalFailure=0
placeholder=0
missingFormalIcon=0
clippedText=0
brokenSafeArea=0
humanExplicitApproval=true
```

## 17. Rollback

```txt
baseline commit:
commits to revert:
asset registry revision:
prefabs/theme affected:
runtime contracts affected:
rollback verification:
```

## 18. Commit strategy

- design/import基盤
- shared component family
- screen visual surfaces
- responsive/accessibility
- capture/verification
- docs/decision close

1commitに複数screenの大規模変更を混ぜない。

## 19. Current use

```txt
TemplateReady=true
ActiveImplementationHandoff=null
UnityImplementationAuthorized=false
```
