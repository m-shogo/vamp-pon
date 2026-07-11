# Unity U45.1 Hardening

Date: 2026-07-11
Status: complete

## なぜ必要だったか

U45.1のMultiple spriteとanimation runtimeは成立していたが、candidate runtimeの成功を`runtimeVisualReady=true`およびproduction provider接続として記録していた。この名前ではfinal/runtime承認済み美術と誤解される。また、Onbu builderの単純なblock samplingをquantizationと説明し、再生成可能なContract full snapshotをGitへ4.6MB載せていた。

Hardeningはruntime挙動を変更せず、承認境界、処理説明、derived artifact運用、現行Phase記述を実態へ合わせる。

## Readiness分離

candidate animation runtime:

```txt
runtimeVisualClassification=candidate-animated-multiple-sprite
runtimeAssetProviderApprovalLevel=Candidate
runtimeCandidateAssetProviderConnected=true
runtimeVisualCandidateReady=true
characterDotRuntimeReady=true
characterAnimationReady=true
enemyDotRuntimeReady=true
enemyAnimationReady=true
```

production visual:

```txt
productionVisualAssetProviderConnected=false
runtimeVisualReady=false
productionCharacterAssetReady=false
productionEnemyAssetReady=false
playerAssetApprovedAsFinal=false
playerAssetRuntimeApproved=false
enemyAssetApprovedAsFinal=false
enemyAssetRuntimeApproved=false
productionApproved=false
```

`runtimeVisualCandidateReady`はcandidate asset、Multiple import、required animation、fallback未使用、Simulator candidate visual reviewが揃ったことを示す。`runtimeVisualReady`はfinal/runtime承認済みasset、production approval-level provider、device gameplay-size reviewが揃うまでfalse。

## Provider分類

`IAssetProvider`に`AssetApprovalLevel`と`IsProductionApproved`を追加した。

- `U5ProofAssetProvider`: Proof / production false
- `RuntimeVisualAssetProvider`: Candidate / production false
- Production: 将来の承認済みregistryだけが使用可能

providerは承認flagを決定しない。現在のcandidate provider class名は互換のため維持し、checkerがapproval levelを検査する。

## Onbu block sampling

実際のalgorithmは`ApplyDeterministicBlockSampling`。

- block size: 3 x 3
- 各block中心の1 pixelをsample
- sample RGBAをblock全体へ複製
- palette探索、nearest-color変換、手作業ドット化は行わない
- sourceとoutput hashはU45.1から不変

manifest表現:

```txt
apply deterministic 3x3 block sampling to Onbu source
```

Onbuはblock-sampled runtime animation candidate。`enemyDotRuntimeReady=true`と`enemyAnimationReady=true`だが、final/runtime art approvalはfalse。

## Generation Contracts軽量化

source of truth:

```txt
src/game/data/assetFactoryCatalog.ts
src/game/data/assetGenerationPolicy.ts
```

derived outputs:

```txt
data/asset-factory/generation-contracts.json
data/asset-factory/generation-contracts.summary.json
```

full JSONは977 contracts、105,007行、4,624,002 bytesで完全再生成可能。runtimeは直接読まず、checkerもTypeScript sourceを直接検査するためGit管理から外した。`.gitignore`対象だが、`pnpm asset-factory:contracts:export`でローカル生成される。

tracked summaryはcontract count、content type別件数、policy version、contract set hashだけを保持する。`--summary-only`と`--output <path>`にも対応する。

## 正本整理

U45.1を未完了扱いしていた「次の必須フェーズ」記述とcandidate providerのproduction呼称を修正した。

```txt
Completed: U45.1 Character and Enemy Dot Runtime Pass
Completed: U45.1 Hardening
Current: U46 Result / Retry / StageSelect / 灯録
Next: U47 gameplay data/runtime
```

historicalなproof baselineは履歴として残すが、現行指示には使わない。

## Visual review境界

```txt
U45.1 animation/runtime visual review=PASS_WITH_P2
final character art approval=NOT_PROVIDED
final enemy art approval=NOT_PROVIDED
device-backed visual approval=NOT_PROVIDED
production visual approval=false
```

## Checker更新

- candidate/production provider approval level
- candidate readiness true / production readiness false
- Onbu builder名とmanifest説明の一致
- 誤ったquantization表現の禁止
- full Contract JSONのGit非管理とignore
- summary件数とTypeScript sourceの一致
- export再生成性
- U45.1完了 / U46 current

## U46へ進める条件

U45.1 runtime、Hardening、static checker、Unity compile、full preflightが通り、candidate/final境界が維持されること。U46ではResult、Retry、StageSelect、灯録を実装するが、今回それらのruntime実装は行わない。

## 未確認

- actual device touch / safe area
- final Yui / Onbu art approval
- audio volume / latency
- real haptic
- frame pacing
- thermal / performance
- production approval
