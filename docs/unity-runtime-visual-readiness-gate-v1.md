# ヨルノシルベ Unity Runtime Visual Readiness Gate v1

Date: 2026-07-10  
Status: adopted source of truth

## 目的

Unity runtimeで「キャラクター名にDotが入っている」「Point Filterが設定されている」「操作できる」といった一部条件だけを根拠に、ドットキャラクター完成・製品ビジュアル完成と誤判定しないための昇格ゲート。

この文書は、キャラクター・敵・戦闘用spriteのruntime readiness判定における正本とする。

## 発生した事故

U43では実機上でキャラクターがドットに見えない問題に対して、次の修正が行われた。

- runtime object名を `YuiRuntimeDotCharacter` へ変更
- U5 candidate spriteへPoint Filterを適用
- TextureImporterのFilter ModeをPointへ変更

しかし実際のruntimeは次のままだった。

- `U5ProofAssetProvider`を使用
- proof用の静止画1枚を使用
- Sprite ModeはSingle
- sprite sheet分割なし
- idle / walk / hurt / attack animationなし
- asset load失敗時はprocedural characterへfallback

Point Filterは既存画像の補間を止めるだけであり、非ドット素材をドット絵へ変換しない。object名もvisual evidenceではない。

## Readiness classification

runtime visualは必ず次のいずれかへ分類する。

| Classification | 意味 |
| --- | --- |
| `procedural-placeholder` | procedural生成だけで動いている |
| `proof-static-single-sprite` | proof/candidate静止画1枚を表示している |
| `candidate-animated-multiple-sprite` | candidate Multiple sprite sheetと最低animationがruntime接続済み |
| `production-animated-sprite` | production provider、承認済みasset、animation、QAがruntime接続済み |
| `production-approved` | 実寸visual review、Lineage、final/runtime承認まで完了 |

現在は `candidate-animated-multiple-sprite`。U45.1でproof routeを外し、実frameとanimatorを接続した。

## 証拠として認めないもの

以下は単独では、ドットruntime完成の証拠として扱わない。

```txt
GameObject名にDot / Pixel / Productionが含まれる
Texture filterModeがPoint
MipmapがOFF
静止画が表示される
キャラクターを操作できる
Simulator smokeが完走する
Object名がplaceholderではなくなる
checkerがファイル存在だけを確認する
```

## `characterDotRuntimeReady=true` の必須条件

すべて満たした場合だけtrueへ変更できる。

### Asset source

- production runtime providerを使用している
- `U5ProofAssetProvider`などproof専用providerを製品経路で使用していない
- production asset pathが明記されている
- proof/candidate pathをfinal runtime pathとして偽装していない
- procedural fallbackは開発時の明示的エラー表示に限定されている
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

最低限、次のruntime stateが存在する。

```txt
idle
walk
hurt
attack
```

さらに以下を満たす。

- 各stateが1枚の同一静止画を使い回していない
- walkは2frame以上
- idleは2frame以上を推奨。最低でも静止画使用理由を記録
- hurt / attackは視認可能な差分がある
- 移動方向に応じた左右反転が正しい
- 左向き時にランタン・バッグ等の正本配置を意図せず壊していない
- input release後にwalkからidleへ戻る
- 被弾・攻撃後に状態が戻る

### Character identity

- Golden Identity Referenceが登録済み
- 髪型、頭身、顔、ランタン、バッグ、左右配置を比較
- Asset Generation Contractに従う
- Generation Lineage manifestが存在
- 4候補比較または既存正本assetの由来記録がある
- Golden ReferenceとGeneration Lineageにcandidate境界が明記されている

`approvedAsFinal=true`と`runtimeApproved=true`は`productionCharacterAssetReady=true`の条件であり、U45.1 candidate runtimeの条件とは分離する。

### Gameplay-size visual review

production承認では最低限、次の解像度で確認する。

```txt
360x800
390x844
430x932
```

確認項目:

- ドット粒と輪郭が視認できる
- ぼやけていない
- 小さすぎない
- 巨大すぎない
- 背景や敵と同化しない
- ランタンとバッグが読める
- animationがちらつかない
- pixel snapping由来の不自然な振動がない

### Automated evidence

- Unity compile成功
- runtime provider検査成功
- Sprite Mode Multiple検査成功
- frame count検査成功
- required animation states検査成功
- procedural fallback未使用確認
- Simulatorでanimation state transition確認
- screenshot / capture証跡がある

## `enemyDotRuntimeReady=true` の必須条件

キャラクターと同様に、proof静止画とPoint Filterだけではtrueにしない。

オンブ最低条件:

```txt
idle
move
hurt
death
```

オンブ正本:

- 腕なし
- 短い1本のインク芽
- 影炎は短く丸い
- 顔前のモヤは薄い
- 口なし
- 柔らかい影

オンブロ正本:

- 両腕が太い
- 手先は鈍い3房
- 攻撃時に右腕が伸びる
- 頭芽2本
- 待機時に垂れる

## Readinessの分離

以下を混同しない。

```txt
simulatorPlayableCandidateReady
characterDotRuntimeReady
characterAnimationReady
enemyDotRuntimeReady
enemyAnimationReady
productionCharacterAssetReady
productionEnemyAssetReady
runtimeVisualReady
devicePlayableReady
productionApproved
```

Simulatorのroute smokeだけが成功しても、character/enemy visual readinessは自動的にtrueにならない。U45.1のprovider、Multiple import、state transition、左右実画、fallback未使用、gameplay-size reviewがすべて揃った場合だけcandidate runtimeを昇格できる。

現在の正しい状態:

```txt
simulatorPlayableCandidateReady=true
simulatorRouteEvidenceStillValid=true
simulatorCharacterVisualApprovalInvalidated=false
characterDotRuntimeReady=true
characterAnimationReady=true
enemyDotRuntimeReady=true
enemyAnimationReady=true
productionCharacterAssetReady=false
productionEnemyAssetReady=false
runtimeVisualReady=true
```

`runtimeVisualReady=true`は候補素材を使う実animation runtimeがStage1で動き、P0/P1がないことを表す。final art、実機、RC、productionの承認ではない。

## Checker policy

repository checker:

```sh
pnpm unity:runtime-visual-readiness:check
```

checkerは現在のruntime実装とreadiness JSONを照合する。

現在proof providerが有効な間は、以下がfalseであることを必須とする。

```txt
characterDotRuntimeReady
enemyDotRuntimeReady
productionCharacterAssetReady
productionEnemyAssetReady
runtimeVisualReady
```

将来これらをtrueへ変更する場合は、checkerも単純に削除・緩和してはならない。production provider、Multiple sprite、animation state、QA evidenceを実装し、同じcommitで判定条件を更新する。

## 禁止

- object名の変更だけでreadinessを上げる
- Point Filterだけで「ドット化完了」と記録する
- Single spriteをsprite sheet扱いする
- animationなしでcharacter animation readyにする
- proof providerをproduction providerと呼び替える
- procedural fallbackが発生した状態でスクショを承認する
- Simulator route smokeを美術承認に流用する
- candidate画像をLineageなしでruntime finalへ昇格する
- checkerを通すためにevidenceだけtrueへ書き換える

## 次の必須フェーズ

U46のResult / 灯録より先に、次を実施する。

```txt
U45.1 Character and Enemy Dot Runtime Pass
```

内容:

1. ユイのidentity Golden Referenceを登録
2. ユイのproduction candidate sprite sheetを選定
3. idle / walk / hurt / attackをslice
4. runtime animationを接続
5. 左右反転を修正
6. オンブのidle / move / hurt / deathを接続
7. production asset providerを追加
8. proof providerを製品runtimeから外す
9. procedural fallbackを明示的エラー経路へ限定
10. Simulatorでanimationと実寸visualを再確認
11. checker/evidenceを更新

## Source of truth

- `docs/design-targets/generated/unity-runtime-visual-readiness/readiness.json`
- `scripts/quality/check-unity-runtime-visual-readiness.ts`
- `unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U1Stage1SceneBootstrap.cs`
- `unity/VampPonUnity/Assets/_Project/Scripts/Runtime/U5ProofAssetProvider.cs`
- `unity/VampPonUnity/Assets/_Project/Scripts/U5/U5VisualAssetLibrary.cs`
- `docs/asset-generation-consistency-system-v1.md`
