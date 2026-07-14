# U48 Candidate Live Preview Foundation

## 結論

U48 candidate別live renderの前提となるverification-only Preview Provider基盤を追加した。通常runtimeの`RuntimeVisualAssetProvider`は変更せず、`VAMPPON_U48_ASSET_PREVIEW`をbuild-local defineとして指定し、さらに明示的な環境変数でasset groupとcandidate IDを指定した場合だけPreview Providerを生成する。

このcheckpointはcandidate capture基盤の準備完了だけを示す。`productionAssetApprovalPackReady=false`、`approvedProductionAssetSetAvailable=false`、`runtimeVisualReady=false`を維持し、U48全体は`IN_PROGRESS_BLOCKED`のままである。

## 隔離境界

- defineなしではPreview Provider、scene binder、verification bridgeの型自体がcompile対象外となる。
- defineありでも`VAMPPON_U48_PREVIEW_ENABLED=1`がなければ通常Providerを返す。
- asset groupとcandidate IDの完全一致が1件である場合だけ候補を解決する。0件または重複は明示FAILし、別候補へfallbackしない。
- preview catalogはiOS Simulator verification buildの直前に作成し、buildの`finally`で削除する。repoにはcommitしない。
- Preview ProviderはCandidate approval levelかつproduction approval falseを固定する。
- bootstrap破棄時、load例外時、scene binder無効化・破棄時に、sprite復帰、coroutine停止、event listener解除、static session解除を行う。
- gameplay state、damage、HP、enemy count、inventory capacity、U47 runtime契約は変更しない。

## UI比較単位

旧5グループを履歴上`split-required`として残し、同じ責務・論理サイズ・text-safe area・runtime position・required statesを持つ30単位へ分割した。

| owner | active comparison units |
|---|---:|
| HUD | 7 |
| LevelUp | 6 |
| Replacement | 6 |
| Result | 6 |
| StageSelect | 5 |

候補生成とhuman reviewは未実施であり、全単位の`approvalReviewReady`、`approvedAsFinal`、`runtimeApproved`はfalse、`humanReviewStatus`はpendingである。

## 検証結果

- Unity通常batchmode compile: PASS
- defineなしiOS Simulator export: PASS
- defineありiOS Simulator export: PASS
- Xcode Release Simulator build: PASS
- Simulator install / launch: PASS
- 環境変数off: preview不発、cleanup PASS、例外0、assertion 0
- 正常candidate: preview発動、cleanup PASS、例外0、assertion 0
- 未登録candidate: fallbackなしの明示FAIL、cleanup PASS
- 登録済みresource欠落: load例外を明示検出し、static session cleanup PASS
- U47 Editor verification、catalog、manifest、completion regression: PASS
- Unity meta GUID: 832件、重複0

機械可読証跡は`docs/design-targets/generated/unity-u48/preview-foundation/`に置く。negative caseの例外1件は期待したFAILの観測値であり、正常candidate runtimeのunhandled exceptionとassertion failureはともに0である。
