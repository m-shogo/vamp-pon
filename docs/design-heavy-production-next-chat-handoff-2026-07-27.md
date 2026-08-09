# ヨルノシルベ Heavy Design 次チャット引き継ぎ

Date: 2026-07-27
Status: **HOLD / documentation refinement only**
Repository: `m-shogo/vamp-pon`
Branch at recording: `integration/u49-pr75-integrity-20260727`

## 1. この文書の役割

この文書は、次のチャットでHeavy Design検討を再開するときの入口である。

今すぐ画像生成、Unity実装、asset加工を始めるための指示ではない。

ユーザーの現在意図は次で固定する。

```txt
- 今はデザイン制作を開始しない。
- 今は画像を生成しない。
- 今はUnityへ実装しない。
- まず設計、ロードマップ、完成基準をさらにブラッシュアップする。
- 画像生成を行う場合はrepository agentではなく、このChatGPT会話で人間確認を挟んで行う。
- 過去の失敗を繰り返さず、プロのアプリ制作に近い工程で商品品質へ持っていく。
- 次のチャットでも方針を探し直さず、Gitの正本から継続する。
```

## 2. 次のチャットで最初に読む順番

1. `docs/unity-current-doc-index-2026-07-10.md`
2. `docs/design-heavy-production-future-roadmap-2026-07-27.md`
3. 本書 `docs/design-heavy-production-next-chat-handoff-2026-07-27.md`
4. `docs/unity-whole-app-heavy-design-audit-2026-07-27.md`
5. `docs/design-targets/generated/unity-whole-app-design-audit-2026-07-27/screen-audit.json`
6. `docs/design-targets/generated/unity-whole-app-design-audit-2026-07-27/human-visual-rejection.json`
7. `docs/unity-ui-design-system-v1.md`
8. `docs/asset-generation-consistency-system-v1.md`
9. `docs/non-battle-final-design-implementation-plan.md`
10. `docs/current-visual-targets-2026-06-30.md`

個別画像やhistorical documentだけを見て作業開始してはいけない。

## 3. 現在の絶対境界

```txt
heavyDesignStatus=HOLD
heavyDesignDocumentationMayBeRefined=true
imageGenerationStarted=false
repositoryAgentMayGenerateImages=false
unityDesignImplementationStarted=false
runtimeMutationAllowed=false
u49EvidenceMutationAllowed=false
wholeAppHumanVisualAccepted=false
u50MayStart=false
pr76MustRemainDraft=true
```

次のいずれかを行うには、ユーザーの明示指示が必要である。

- 画像候補を生成する。
- 既存画像を加工する。
- Unity scene、Prefab、ScriptableObject、runtime C#を変更する。
- candidateをproductionへ昇格する。
- Design LanguageをLOCKEDにする。
- whole-app visualを承認済みにする。

## 4. 現在確定している人間判断

- キャラクター画像と敵キャラクター画像はKEEP候補。
- 敵消滅演出もKEEP候補。
- キャラクターと敵以外は、現状では仮UIに見える。
- StageSelectはFAIL。
- LevelUpはFAIL。
- whole-app visualは未承認。
- U48 UI PNGの存在はwhole-screen approvalを意味しない。
- `final`というファイル名は現在の承認根拠にならない。
- safe area、tap領域、runtime hook、画面遷移、操作contract、既存assertionは維持する。
- U49 Audio/Haptic evidenceとHeavy Designは独立させる。

## 5. 今までの失敗を再発させないための原因整理

### 5.1 レイアウト改善を完成デザインと誤認した

端切れ解消、文字順序、tap領域、ScrollRect改善は必要だが、完成visualではない。

今後は次を分離する。

```txt
STRUCTURAL_ACCEPTANCE
VISUAL_ACCEPTANCE
ASSET_ACCEPTANCE
DEVICE_ACCEPTANCE
```

構造PASSがvisual PASSを意味しない。

### 5.2 formal PNGの存在を画面品質と混同した

一部のframeやpanelがproduction pathにあっても、画面全体が矩形、単色、TMP中心なら仮UIに見える。

今後はasset単体評価とwhole-screen評価を別に記録する。

### 5.3 画面ごとにprimitiveを足して統一感を失った

画面固有の色、線、glow、余白をその場で追加しない。

先にcomponent family、state family、typography、spacing、lightingを確定する。

### 5.4 AI画像を画面完成品として扱いかねなかった

AI生成は次のいずれかの用途に限定する。

```txt
COMPOSITION_REFERENCE
STYLE_EXPLORATION
COMPONENT_SOURCE_CANDIDATE
BACKGROUND_LAYER_CANDIDATE
ORNAMENT_CANDIDATE
MOTION_KEYFRAME_REFERENCE
```

生成画像を無加工でruntimeへ一枚貼りしない。

### 5.5 既存targetの存在を忘れた

次の既存targetを必ず最初に比較する。

```txt
docs/design-targets/final/top-final.png
docs/design-targets/final/stage-select-final.png
docs/design-targets/final/result-clear-final.png
docs/design-targets/final/collection-final.png
docs/design-targets/final/level-up-final.png
docs/design-targets/final/kokuyou-cutin-final.png
docs/design-targets/final/battle-final.png
```

新規生成は、既存targetで満たせない理由を説明できる場合だけ行う。

## 6. プロに近い制作モデル

Heavy Designは次の職能・工程を一つずつ通す。

### 6.1 Product and experience definition

最初に画面の目的を決める。

- プレイヤーが何を理解するか。
- 何を押すか。
- 何を感じるか。
- どの情報を最初に見るか。
- その画面がなくても成立する情報は何か。

この段階では装飾を決めない。

### 6.2 Art direction

全画面共通の世界観、感情、色、質感、光、密度を固定する。

ヨルノシルベのbrand pillars:

```txt
夜
記憶
忘れ物
黒インク
小さな光
朝
```

### 6.3 Visual development

いきなりproduction assetを作らず、代表画面で複数方向を比較する。

最初の代表画面:

```txt
TOP
StageSelect
LevelUp
Battle HUD
Result
```

ただし、最初から5画面を同時に生成しない。

```txt
TOPでbrand directionを確認
StageSelectでworld/navigation languageを確認
LevelUpでcard/state/rarity languageを確認
Battle HUDでgameplay readabilityを確認
Resultでinformation hierarchyと余韻を確認
```

### 6.4 Design system definition

代表画面から共通部品へ抽出する。

- Color tokens。
- Typography roles。
- Spacing scale。
- Button family。
- Card family。
- Panel family。
- Icon family。
- Selection family。
- Locked/disabled family。
- Rarity family。
- Lantern lighting family。
- Ink ornament family。
- Motion family。

画面を先に量産してから共通化しない。

### 6.5 Asset production

approved directionからruntime assetを作る。

- Whole-screen referenceとruntime componentを分離する。
- Text-freeにする。
- Alpha、9-slice、tile、seam、state variantを先に指定する。
- 必要に応じて手修正、cleanup、pixel-fitを行う。
- Masterとruntime sizeを分ける。

### 6.6 Runtime integration

Unityでは既存のuGUI、Theme、Visual State、Responsive Layoutを使う。

内部構造はprimitiveを許可するが、ユーザーが見る完成surfaceをprimitiveだけで構成しない。

### 6.7 QA and visual acceptance

```txt
Component Catalog
Compact 360x800
Standard 390x844
Large 430x932
Simulator route
side-by-side comparison
human review
physical iPhone review
performance review
visual freeze
```

自動PASSは人間承認を代替しない。

## 7. 本物のアプリに見せるための制作原則

### 7.1 画面ではなくsystemを作る

一つの画面だけ綺麗でも売り物には見えない。

同じbutton、card、icon、state、paper edge、ink mark、lantern lightが、意味を保って複数画面で使われる必要がある。

### 7.2 キャラクターとUIの質感を一致させる

- キャラだけdot、UIだけgeneric flat designにしない。
- キャラの輪郭密度とUI ornamentの密度を合わせる。
- UIを写実的な紙写真にしすぎない。
- pixel gameplayとsoft paper UIの境界を意図的に設計する。

### 7.3 視線誘導を装飾より先に作る

各画面の視線順を最大4段階に制限する。

例: Result

```txt
1. 結果とrank
2. 獲得物
3. 新しい記録
4. 次の行動
```

同じ強さのpanelを並べない。

### 7.4 光を意味として使う

lantern lightは単なるglowではない。

- Primary action。
- Current location。
- New discovery。
- Rare choice。
- Memory restored。

に限定する。

全要素を光らせない。

### 7.5 黒インクを状態として使う

黒インクはdecorative splatterではなく、次の意味を持つ。

- Locked。
- Forgotten。
- Corrupted。
- Sealed。
- 黒耀化による侵食。

画面ごとに意味を変えない。

### 7.6 通常と特別演出の差を守る

通常画面を静かに保つから、Rare、Evolution、Awakening、黒耀化、朝が強く見える。

通常から常時発光、粒子、強い色を使わない。

## 8. 画像生成を上手く行う方法

画像生成開始前に、必ず1件のgeneration briefを完成させる。

### 8.1 Brief必須項目

```txt
briefId
screenId
assetFamilyId
goal
player purpose
emotional intent
composition hierarchy
viewport
safe zones
existing references
elements to preserve
elements to reject
required layers
transparent background requirement
9-slice intent
text-free requirement
state variants
forbidden motifs
candidate count
comparison criteria
reserved Git paths
```

### 8.2 生成の順序

```txt
1. Existing reference review
2. Runtime gap analysis
3. Brief approval
4. Direction exploration
5. Human direction selection
6. Refined whole-screen reference
7. Component board
8. Individual component candidates
9. Cleanup and technical preparation
10. Human component approval
11. Git candidate registration
12. Unity integration
```

### 8.3 Candidate数

大量生成で偶然当たりを探さない。

推奨:

```txt
方向性探索: 明確に異なる3案
選択方向の深化: 2〜3案
component family: state差を含む1 family board
```

似た画像を大量に作らない。

### 8.4 候補比較

比較時は「好き」だけでなく次で評価する。

- ヨルノシルベ固有性。
- キャラとの相性。
- 情報を載せる余白。
- 390x844での可読性。
- componentへ分解可能か。
- 9-sliceやstate variationを作れるか。
- 他画面へ展開可能か。
- 過剰装飾ではないか。

### 8.5 生成禁止事項

- AI文字。
- 固定button label。
- 数字や説明文の焼き込み。
- 不要なキャラクター追加。
- generic fantasy gold frame。
- 過剰な宝石、金属、neon。
- 画面全面を埋める装飾。
- 既存キャラと異なる画風。
- 使途不明の1枚絵。

## 9. Gitへ残す情報

生成開始後は、候補ごとに次を残す。

```txt
candidateId
briefId
prompt summary
reference paths
reference hashes
output path
output hash
intended usage
technical constraints
human decision
selection reason
rejection reason
supersedes
source commit
```

Human decisionはappend-onlyとし、過去判断を削除しない。

## 10. 承認レベル

```txt
REFERENCE_ACCEPTED
DIRECTION_SELECTED
COMPONENT_APPROVED
RUNTIME_INTEGRATED
SIMULATOR_VISUAL_PASS
DEVICE_VISUAL_PASS
WHOLE_SCREEN_APPROVED
WHOLE_APP_VISUAL_FROZEN
```

`DIRECTION_SELECTED`をproduction approvalとして扱わない。

## 11. 販売候補品質の評価

各画面を0〜4で評価する。

- Brand distinctiveness。
- Composition。
- Visual hierarchy。
- Readability。
- Interaction clarity。
- Asset cohesion。
- Character/UI cohesion。
- State clarity。
- Emotional impact。
- Mobile fit。

承認条件:

```txt
全項目3以上
brand distinctiveness=4
readability=4
interaction clarity=4
asset cohesion=4
合計36/40以上
placeholder=0
missing formal icon=0
clipped text=0
broken safe area=0
human explicit approval=true
```

さらに、代表画面5枚を並べたとき、同一productに見えることをwhole-app gateとする。

## 12. 次回ブラッシュアップすべき未確定事項

次のチャットでは、画像生成ではなく、まず以下を文章と設定として深める。

1. 最終Color token案と画面内面積比率。
2. 日本語Typography roleとfont asset候補。
3. Paper textureの密度、明度、edge表現。
4. Ink stateの意味と使用禁止例。
5. Lantern lightingの意味、強度、animation範囲。
6. UIとdot characterの質感接続方法。
7. Icon familyの線幅、形状、色数、背景plate。
8. Motion duration、easing、reduced-motion方針。
9. Screen transition family。
10. TOP／StageSelect／LevelUpのgeneration brief。
11. Existing final targetを再利用する具体条件。
12. Production-ready componentのmaster/runtime dimension。
13. 画像生成後のcleanup手順。
14. Human review時に並べるcomparison pack仕様。
15. Visual freeze後に許可する変更範囲。

これらを固めるまで画像生成を開始しない。

## 13. 次のチャットでの禁止事項

ユーザーが明示的に開始するまでは、次のチャットでも禁止する。

- 画像生成toolを呼ぶ。
- Unity実装へ進む。
- 新branchを作る。
- candidate assetをGitへ追加する。
- 既存targetを勝手に承認する。
- D2をLOCKEDにする。
- U49、U50、U51 readinessを変更する。

## 14. 次のチャットでの推奨開始タスク

```txt
GitのHeavy Design正本を読み、現在のHOLD境界を確認する。
画像生成やUnity実装は行わず、Art DirectionとDesign Languageの未確定項目をレビューする。
特にColor、Typography、Paper、Ink、Lantern、Icon、Motionを具体化し、既存targetとの矛盾と不足を指摘する。
その結果を次のdocumentation update候補としてまとめる。
```

## 15. 次チャット用の短い開始文

```txt
/Users/m-shogo/Developer/personal/vamp-pon のみ。
Heavy DesignはまだHOLD。画像生成・Unity実装はしない。
docs/design-heavy-production-future-roadmap-2026-07-27.md と docs/design-heavy-production-next-chat-handoff-2026-07-27.md を正本として読み、Art DirectionとDesign Languageをさらに深めて。今までの仮UI化、primitive依存、既存target見落とし、formal PNGとwhole-screen approvalの混同を再発させないこと。生成は後でこのChatGPT上で人間確認しながら行う。
```

## 16. 再開判定

現在の正しい判定:

```txt
Heavy Design roadmap=DOCUMENTED
Professional production method=DOCUMENTED
Art Direction=PROPOSED_NOT_LOCKED
Design Language=INCOMPLETE
Generation briefs=NOT_APPROVED
Image generation=NOT_STARTED
Unity design implementation=NOT_STARTED
Whole-app visual approval=false
Next action=DOCUMENTATION_REFINEMENT
```
