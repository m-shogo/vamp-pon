# U48 Batch A 人間承認待ちチェックポイント

対象は Stage1 gameplay core の9 groupのみ。36候補を生成し、全候補をdefine隔離されたPreview Provider経由で実Stage1へ表示した。Standard、Compact、Large、通常密度、高密度を含む280枚を候補ID単位で記録している。

## 判定

`batchAStage1GameplayCoreApprovalReady=true`。これは人間が候補を選べる比較資料が揃ったことだけを示す。人間承認、production provider接続、U48全体完了を意味しない。

- `humanReviewStatus=pending`
- `humanApprovedCandidateId=null`
- `approvedAsFinal=false`
- `runtimeApproved=false`
- `productionAssetApprovalPackReady=false`
- `runtimeVisualReady=false`
- `simulatorReady=false`
- `U48=IN_PROGRESS_BLOCKED`

Simulator export、Xcode build、install、36候補launchがPASSしていても、ここでの実行は候補比較専用であり、ゲーム全体の`simulatorReady`は昇格しない。

## 証跡

- Golden Reference: `docs/design-targets/generated/unity-u48/batch-a/golden-references.json`
- Generation Contract: `docs/design-targets/generated/unity-u48/batch-a/generation-contracts.json`
- Automatic QA: `docs/design-targets/generated/unity-u48/batch-a/automatic-qa.json`
- Capture manifest: `docs/design-targets/generated/unity-u48/batch-a/capture-manifest.json`
- AI recommendation: `docs/design-targets/generated/unity-u48/batch-a/ai-recommendations.json`
- Contact sheets: `docs/design-targets/generated/unity-u48/batch-a/contact-sheets/`
- Verification summary: `docs/design-targets/generated/unity-u48/batch-a/verification-summary.json`

Healing pickupだけはGolden Referenceが`missing`であり、Style Bible等から作ったreference contractを使用した。これはhuman-approved Golden Referenceではないため、人間確認時の主要リスクとして維持する。
