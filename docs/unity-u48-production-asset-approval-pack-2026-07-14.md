# U48 Production Asset Approval Pack

Date: 2026-07-14
Status: IN_PROGRESS_BLOCKED

## 結論

Priority Aの21 asset groupを欠落なく棚卸しし、48件のunique candidate recordと21枚のcontact sheetを作成した。これは承認準備の途中checkpointであり、Production Asset Approval Pack完成ではない。

既存U47 screenshotは現在runtimeのgameplay baselineとしてのみ再利用した。候補別live renderではなく、単純resizeをdevice-size reviewとして扱っていない。Unity runtime、preview provider、production providerは変更していない。

## Blocker

- 4候補未満: 13 group
- 4 source recordはあるが同等kit候補ではない: HUD / Result / StageSelectの3 group
- Healing pickupとreplacement modal: raw candidate 0件
- EXP/projectile/hit/death/trail/ground-area: content hashで重複を除くと各1系統
- Yui: content hash重複を除くと3候補
- Stage1 background: 3候補
- LevelUp card: 2候補
- candidate-specific Standard live render: 未実施
- Compact/LargeおよびVFX高密度live render: 未実施
- Generation Lineage: partialまたはunknown
- human approval: 全件pending

したがって`productionAssetApprovalPackReady=false`、`approvedProductionAssetSetAvailable=false`、`runtimeVisualReady=false`、ゲーム全体`productionApproved=false`を維持する。

## Evidence boundary

`approval-manifest.json`はsource path、SHA-256、lineage既知範囲、automatic PNG QA、runtime参照状況、既存baseline、候補不足理由を記録する。各contact sheetは候補raw previewと既存runtime baselineを同一画面に置くが、baselineをcandidate-specific previewとは表示しない。

次の作業は、正式pipelineで不足候補を準備し、verification-only preview経路をproductionから隔離して候補別live captureを行うことである。人間が候補IDを明示承認するまで、`approvedAsFinal`と`runtimeApproved`はfalseのままとする。
