# ヨルノシルベ Unity Runtime Visual Readiness Gate v1

Original adoption date: 2026-07-10
Last synchronized: 2026-07-24
Status: adopted source of truth

## 目的

Unity runtimeで「キャラクター名にDotが入っている」「Point Filterが設定されている」「操作できる」といった一部条件だけを根拠に、ドットキャラクター完成・製品ビジュアル完成と誤判定しないための昇格ゲートです。

この文書は、キャラクター・敵・戦闘用sprite・production visual providerのruntime readiness判定における正本です。

## 発生した事故と恒久ルール

U43では、runtime object名変更、Point Filter、静止画表示、操作可能だけでvisual repairが進んだように見えましたが、実際にはproof用Single sprite、animationなし、procedural fallbackを含む経路が残っていました。

**Point Filterは既存画像の補間を止めるだけ**であり、非ドット素材をドット絵へ変換しません。**object名もvisual evidenceではない**ため、命名・import setting・route成功だけでreadinessを昇格してはいけません。

## Readiness classification

runtime visualは必ず次のいずれかへ分類します。

| Classification | 意味 |
| --- | --- |
| `procedural-placeholder` | procedural生成だけで動いている |
| `proof-static-single-sprite` | proof/candidate静止画1枚を表示している |
| `candidate-animated-multiple-sprite` | candidate assetを使うMultiple animation runtime。歴史的U45.1到達点でありfinal/runtime承認ではない |
| `production-animated-sprite` | `approvedAsFinal=true`、`runtimeApproved=true`、production provider/registry、responsive gameplay-size verificationが揃ったproduction runtime |
| `production-approved` | production animationにactual-device visual review、performance/release QA、明示的product approvalを加えた状態 |

現在は `production-animated-sprite` です。

U48で人間承認済み46 visual groupをproduction catalogへ昇格し、production providerへ接続しました。Preview defineなしのiOS Simulator buildでCompact / Standard / Large、合計138 captureを検証済みです。

この分類はactual-device、音、振動、性能、RC、store release approvalを意味しません。

## 証拠として認めないもの

以下は単独では、ドットruntime完成またはproduction visual完成の証拠として扱いません。

```txt
GameObject名にDot / Pixel / Productionが含まれる
Texture filterModeがPoint
MipmapがOFF
静止画が表示される
キャラクターを操作できる
Simulator route smokeが完走する
Object名がplaceholderではなくなる
checkerがファイル存在だけを確認する
readiness JSONだけがtrueになる
古いPhaseの成功証跡が存在する
```

## Character runtime minimum

`characterDotRuntimeReady=true` の最低条件:

### Asset source

- candidateまたはproduction approval levelのruntime providerを使用している
- `U5ProofAssetProvider`などproof専用providerを製品経路で使用していない
- asset pathとprovider/registry keyが明記されている
- proof/candidate pathをfinal runtime pathとして偽装していない
- procedural fallbackは開発時の明示的エラー経路に限定されている
- fallback発生をログ・evidenceで検出できる

### Sprite import

- Sprite ModeがMultiple
- 必要frameが実際にsliceされている
- Point Filter
- Mipmap OFF
- Wrap Clamp
- 不要な圧縮なし、または実寸確認済み
- PPUとruntime scaleが正本化されている
- transparent edge、白フリンジ、cell edge contactがない

### Animation

最低限、次のruntime stateが存在します。

```txt
idle
walk
hurt
attack
```

さらに以下を満たします。

- 各stateが1枚の同一静止画を使い回していない
- walkは2frame以上
- hurt / attackは視認可能な差分がある
- 左右方向とランタン/バッグ配置が正しい
- input release後にwalkからidleへ戻る
- 被弾・攻撃後に状態が戻る

### Character identity

- Golden Identity Referenceが登録済み
- 髪型、頭身、顔、ランタン、バッグ、左右配置を比較済み
- Asset Generation Contractに従う
- Generation Lineage manifestが存在する
- gameplay-size reviewを通過する

## Enemy runtime minimum

`enemyDotRuntimeReady=true` はキャラクターと同様にproof静止画とPoint Filterだけでは昇格しません。

オンブ最低state:

```txt
idle
move
hurt
death
```

必要条件:

- candidateまたはproduction provider
- Multiple frames
- required animation state
- family-canon review
- gameplay-size review
- procedural fallback非稼働
- runtime evidence/checker一致

## Candidate / production / releaseの分離

以下を混同しません。

```txt
simulatorPlayableCandidateReady
characterDotRuntimeReady
characterAnimationReady
enemyDotRuntimeReady
enemyAnimationReady
productionCharacterAssetReady
productionEnemyAssetReady
runtimeVisualCandidateReady
runtimeVisualReady
devicePlayableReady
mobileMetricsReady
rcReady
productionApproved
```

### `runtimeVisualCandidateReady=true`

candidate providerを使う実animation runtimeが動き、candidate visual reviewにP0/P1がない状態です。これはU45.1 Character and Enemy Dot Runtime Passの歴史的到達点です。

### `runtimeVisualReady=true`

final/runtime承認済みasset、production provider/registry、required animation、responsive gameplay-size verification、production connection evidenceが揃った状態です。

### `productionApproved=true`

actual-device visual/playability、audio/haptic、performance、release QA、既知問題、明示的承認が揃った最終状態です。`runtimeVisualReady=true`から自動昇格しません。

## 現在の正しい状態

```txt
runtimeVisualClassification=production-animated-sprite
simulatorPlayableCandidateReady=true
simulatorRouteEvidenceStillValid=true
simulatorCandidateAnimationVisualReviewPassed=true
simulatorFinalArtApprovalProvided=true
characterDotRuntimeReady=true
characterAnimationReady=true
enemyDotRuntimeReady=true
enemyAnimationReady=true
productionCharacterAssetReady=true
productionEnemyAssetReady=true
runtimeVisualCandidateReady=false
runtimeVisualReady=true
runtimeCandidateAssetProviderConnected=false
productionVisualAssetProviderConnected=true
actualDeviceSmokeResult=NOT_PROVIDED
devicePlayableReady=false
mobileMetricsReady=false
rcReady=false
productionApproved=false
```

`runtimeVisualCandidateReady=false`はU48のproduction promotion後にcandidate providerを製品経路から外したことを表す。

U45.1のcandidate readiness JSONは歴史的証跡としてcandidate値を保持します。現在値を決めるのは `docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json` です。

`runtimeVisualReady=true`はfinal/runtime承認済みassetとproduction providerをU48 Simulator verificationで確認したproduction visual scopeだけに使用する。実機・音・振動・性能・RC・whole-app production承認を意味しない。

## Production visual promotion chain

production visualを昇格する場合、少なくとも次を同一の追跡可能なchainとして揃えます。

```txt
human decision
-> approved production set
-> production provider/registry connection
-> runtime verification manifest
-> current readiness JSON
-> checker
```

U48 current evidence:

```txt
docs/design-targets/generated/unity-u48/human-selection-decision.json
docs/design-targets/generated/unity-u48/approved-production-set.json
docs/design-targets/generated/unity-u48/production-visual-connection.json
docs/design-targets/generated/unity-u48/production-verification/manifest.json
docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json
```

## Checker policy

Repository checker:

```sh
pnpm unity:runtime-visual-readiness:check
```

Checkerは現在のruntime実装、provider approval level、Sprite importer、animation markers、fallback状態、readiness JSONを照合します。

proof providerが有効な場合は、以下がfalseであることを必須とする。

```txt
characterDotRuntimeReady
enemyDotRuntimeReady
productionCharacterAssetReady
productionEnemyAssetReady
runtimeVisualReady
```

将来これらをtrueへ変更する場合は、checkerも単純に削除・緩和してはならない。production provider、Multiple sprite、animation state、QA evidenceを実装し、同じcommitで判定条件を更新する。

proof providerが無効な現在も、将来classificationやreadinessを変更する場合はcheckerを単純に削除・緩和してはいけません。実装・evidence・checkerを同じ変更単位で更新します。

## 禁止

- object名の変更だけでreadinessを上げる
- Point Filterだけで「ドット化完了」と記録する
- Single spriteをsprite sheet扱いする
- animationなしでcharacter/enemy animation readyにする
- proof providerをproduction providerと呼び替える
- procedural fallbackが発生した状態でスクショを承認する
- Simulator route smokeだけをproduction visual承認に流用する
- candidate画像をLineageなしでruntime finalへ昇格する
- checkerを通すためにevidenceだけtrueへ書き換える
- U45.1 candidate evidenceを現在のproduction stateとして扱う
- `runtimeVisualReady=true`をactual-device/release approvalとして扱う

## 現在のフェーズ

U45.1、U46、U47、U48は完了。現在はU49 actual-device audio/hapticです。U48 production provider、animation、approval、readiness分離を維持し、actual-device evidenceなしでdevice/audio/haptic readinessを上げません。

## Source of truth

- `docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json`
- `scripts/quality/check-unity-runtime-visual-readiness.ts`
- `docs/design-targets/generated/unity-u48/approved-production-set.json`
- `docs/design-targets/generated/unity-u48/production-verification/manifest.json`
- `unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs`
- `unity/VampPonUnity/Assets/_Project/Scripts/Runtime/Visuals/Stage1RuntimeVisualAssetRegistry.cs`
