# C-011 Resolution — TOP Runtime Capture Requirement

Date: 2026-07-28
Status: **RESOLVED_BY_W1_01_EXECUTION_PACKET**

## Conflict

`docs/design-generation-briefs-wave1-v1.md`の共通Generation-start checklistには、全brief共通条件として次が記載されている。

```txt
currentRuntimeCaptureAvailable=true
```

一方、現在のUnity auditではTOPは独立runtime screenが存在せず、captureは`null`である。

```txt
TOP.runtimeState=MISSING
TOP.capture=null
```

共通checklistを文字通り適用すると、存在しないTOP captureが必要となり、W1-01を正規に開始できない。

## Resolution

W1-01 TOPでは、次の正本が共通checklistを上書きする。

```txt
docs/design-generation-execution-packet-W1-01-TOP-v1.md
docs/design-targets/generated/design-production/W1-01-TOP-execution-packet.json
docs/design-targets/generated/design-production/generation-request-queue.json
```

TOP固有条件:

```txt
requiresCurrentRuntimeCapture=false
requiresRuntimeBaselineEvidence=true
runtimeBaselineMode=ABSENCE_EVIDENCE
runtimeBaselineEvidenceReady=true
```

正式baseline:

- Whole-app auditのmissing-state evidence。
- Current runtime comparison manifestのTOP entry。
- Boot→StageSelect直行の監査記録。
- Existing TOP references。
- W1-01 A-direction brief／execution packet。

Comparison packでは、共通の`02-current-runtime-capture.png`を使わず、次へ置き換える。

```txt
02-current-runtime-absence-evidence.md
```

## Automated prevention

```txt
scripts/quality/check-design-w1-top-packet.ts
```

Stage1 Qualityで次をfail-closedする。

- TOPがruntime capture必須へ戻る。
- Baseline modeが`ABSENCE_EVIDENCE`以外になる。
- Comparison packが存在しないcapture PNGを要求する。
- W1-01 packetとgeneration queueが不一致になる。

## Current result

```txt
ContradictionId=C-011
Status=RESOLVED
ActiveContradiction=false
CurrentApprovedWholeScreenTarget=false
ImageGenerationStarted=false
UnityImplementationStarted=false
```
