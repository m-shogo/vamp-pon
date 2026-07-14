# U48 Batch A Golden Reference / Generation Contract

## Scope

Batch Aの9 groupだけを対象に、candidate生成前のGolden Reference contract、Generation Contract、prompt、deterministic recipeを固定した。Ground-area、黒耀化、UI component、production provider、U47 gameplay runtimeは対象外である。

## Golden Reference

| asset group | status | 主な判断根拠 |
|---|---|---|
| player-yui | composite | Core5 Yui master、現行8x6 sheet、U45.1 runtime-size、global visual direction |
| enemy-onbu | composite | enemy family reference、現行8x6 sheet、U45.1 runtime-size、Onbu worldbuilding |
| stage1-background | composite | Stage1 environment master、night tile、night-town concept、U47 runtime-size |
| exp-pickup | composite | 現行EXP fragment、global visual direction、U47 runtime-size |
| healing-pickup | missing | 専用の正式画像なし。Style Bible、item DB、runtime-sizeから未承認reference contractを作成 |
| common-projectile | composite | 現行lantern spark、Yui attack runtime-size、global visual direction |
| hit-effect | composite | 現行hit色、Onbu hurt runtime-size、global visual direction |
| enemy-death-effect | composite | 現行ink burst、Onbu death runtime-size、global visual direction |
| movement-trail | composite | 現行collect trail、Yui movement runtime-size、global visual direction |

全referenceについてpathとSHA-256を記録した。`approvedForRuntime=false`、`humanApprovedGoldenReference=false`を固定し、Healingは`approvedForReference=false`である。

## Generation Contract

9 group x 4候補の36契約を生成前に作成した。各契約はcandidate role、parent source/hash、Golden Reference/hash、prompt/hash、recipe、generator version、Unity import contract、runtime非変更境界を持つ。

generatorは`scripts/unity/build-u48-batch-a-candidates.py` version 1とする。既存master/sheetからの再生成、または固定seed・固定parameterによるPillow raster authoringだけを行う。生成前のため`outputSha256=null`、`createdAtUtc=null`、`lineageStatus=unknown`を正直に記録している。生成とQAが完了するまで`complete`へ上げない。

## Approval boundary

全36契約について次を維持する。

```text
humanReviewStatus=pending
approvedAsFinal=false
runtimeApproved=false
```

このcheckpointはasset生成契約の完成だけを示し、Batch A review-ready、U48 Approval Pack ready、runtime visual readyを意味しない。
