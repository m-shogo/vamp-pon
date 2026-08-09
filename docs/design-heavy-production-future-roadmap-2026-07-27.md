# ヨルノシルベ Heavy Design Production Future Roadmap

Date: 2026-07-27
Status: **HOLD / documentation only**
Repository: `m-shogo/vamp-pon`
Branch at adoption: `integration/u49-pr75-integrity-20260727`
Audit source runtime: `6a18de469426f923aa107c7e5f1d5ebd9bc814c9`
Audit documentation commit: `e861084b6b2a5564692971287f66c6d51a1cb3fc`

## 1. この文書の目的

この文書は、今すぐ画像生成やUnity実装を始めるための指示ではない。

ヨルノシルベのデザインを、場当たり的な色変更・矩形追加・仮UIの延長で終わらせず、最終的に商品として販売できる水準へ到達させるために、**これから行うHeavy Design工程を事前に固定する正本**である。

この文書が定義するもの:

- 何を残すか。
- 何を作り直すか。
- 既存の完成目標画像をどう再評価するか。
- 画像生成をどこで、誰が、どの順番で行うか。
- Unity実装へ進んでよい条件。
- 人間が承認しなければ進めない地点。
- 後から担当エージェントが変わっても崩れない進行順。
- U49、U50、U51との境界。

## 2. 現在の停止状態

```txt
heavyDesignTracking=DOCUMENTED_FUTURE_WORK
heavyDesignImplementationStarted=false
imageGenerationStarted=false
repositoryAgentMayGenerateImages=false
runtimeMutation=false
u49EvidenceMutation=false
wholeAppHumanVisualAccepted=false
pr76Draft=true
```

現在は設計、画像生成、Unity実装を進めない。

再開条件は、ユーザーがこのロードマップを基に次のDesign Phase開始を明示することである。

## 3. 現在確定している事実

- 現Unity runtimeは`temporary structural UI`である。
- StageSelectは人間reviewで`FAIL`。
- LevelUpは人間reviewで`FAIL`。
- whole-app visualは未承認。
- キャラクター、敵キャラクター、敵消滅演出はKEEP候補。
- safe area、tap領域、runtime hook、画面遷移、操作contract、既存assertionは維持する。
- U48 UI PNGがproduction pathに存在しても、画面全体の人間承認を意味しない。
- `final`というファイル名だけで現在承認済みとはみなさない。
- U49 Audio/Haptic evidenceはHeavy Designと独立して扱う。
- U49は`U49_BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE`を維持する。
- U50はHeavy Design完了前に開始しない。
- PR #76はDraftを維持する。

## 4. Source of Truth優先順位

矛盾がある場合は次の順で判断する。

1. 最新の明示的人間判断。
2. 本ロードマップ。
3. `docs/unity-whole-app-heavy-design-audit-2026-07-27.md`。
4. 画面別監査JSONとhuman visual rejection JSON。
5. 今後作成するDesign Language、screen brief、component specification。
6. 現runtime capture。
7. 自動visual PASS、assertion、CI結果。
8. historical design target、helper、旧実装計画。

次は人間判断を上書きしない。

- CI PASS。
- Stage1 Quality PASS。
- screenshot capture PASS。
- formal PNGの存在。
- U48 production connection。
- ファイル名の`final`表記。

## 5. 既存デザイン資産の扱い

### 5.1 既存screen target

```txt
docs/design-targets/final/top-final.png
docs/design-targets/final/stage-select-final.png
docs/design-targets/final/result-clear-final.png
docs/design-targets/final/collection-final.png
docs/design-targets/final/level-up-final.png
docs/design-targets/final/kokuyou-cutin-final.png
docs/design-targets/final/battle-final.png
```

### 5.2 既存helper

```txt
docs/design-targets/generated/non-battle-ui-helper-2026-06-28.png
docs/design-targets/generated/result-pro-layout-helper-390x844.png
docs/design-targets/generated/collection-pro-layout-helper-390x844.png
docs/design-targets/generated/non-battle-final-polish-ui-kit-2026-06-28.png
```

### 5.3 再開時の再分類

各画像を次のいずれかへ分類する。

```txt
CURRENT_APPROVED_TARGET
KEEP_CANDIDATE
REWORK_SOURCE
COMPOSITION_REFERENCE_ONLY
COMPONENT_REFERENCE_ONLY
REJECTED
HISTORICAL
```

現時点では、新しい明示的人間承認がない画像を`CURRENT_APPROVED_TARGET`にしない。

既存ファイルは削除、rename、移動しない。意味はregistryで管理する。

## 6. 残すものと作り直すもの

### 6.1 必ず残すruntime構造

- キャラクターと敵のproduction sprite。
- 敵消滅演出。
- StageSelectの縦scroll構造。
- StageSelectの端切れ解消。
- LevelUpの「icon左、名称・効果右」という情報順。
- Battle HUDを非戦闘画面で非表示にする処理。
- Safe Area。
- 44px以上のtap target。
- Runtime hook。
- Input ownership。
- Pause ownership。
- Gameplay command contract。
- Save、Result、Collectionのデータcontract。
- Simulator smokeと既存assertion。

### 6.2 見えるsurfaceとして作り直す候補

- TOP。
- StageSelectの背景、夜路、node、lantern、lock表現。
- Battle HUD。
- Pause。
- LevelUpの記憶札、正式icon、rarity、selection。
- Inventory。
- Replacement。
- Evolution。
- Awakening。
- Result。
- Selection、disabled、locked、new、completed state。
- Button、card、frame、tab、seal、tag、divider family。
- Typography hierarchy。
- UI transition、lighting、particle family。

### 6.3 POLISH候補

- Stage1 background base。
- 黒耀化aura。
- Collectionのbook/page base。
- Gameplay VFX。

## 7. 最終アートディレクション

### 7.1 世界観の柱

```txt
夜
記憶
忘れ物
黒インク
小さな光
朝
```

### 7.2 最終的な見た目の原則

1. 色数を増やしすぎない。
2. 紙UI、黒インク、ランタン光を主軸にする。
3. レア演出だけ派手にする。
4. 通常画面は静かにする。
5. 文字可読性を最優先する。
6. キャラ、敵、背景、UIの質感を統一する。
7. 生成画像をそのまま混ぜない。
8. 汎用モバイルUI、管理画面、dashboard風を禁止する。
9. 単色矩形、線、TMP文字だけで完成扱いにしない。
10. 390x844実機で成立して初めて承認候補とする。
11. screenshot一枚でヨルノシルベと分かる固有性を持たせる。
12. 暗さは世界観に使い、操作や敵の視認性を失わせない。

### 7.3 禁止する見た目

- 角丸カードの大量配置。
- 3px単色直線を完成した道として見せる。
- 単色glowだけのrare表現。
- 黒背景と白文字だけのdeveloper menu。
- Generic fantasyの金枠、宝石、過剰発光。
- 全要素を常時強調する構成。
- 読めない装飾文字。
- AI生成画像内の文字。
- 同じpaper panelを全画面へ機械的に流用すること。
- キャラだけ高品質でUIが仮素材に見える状態。

## 8. 画面ごとの感情目的

| 画面 | 感情目的 |
| --- | --- |
| TOP | 静かな入口。少し寂しいが怖すぎない。 |
| StageSelect | 未知の夜へ一歩ずつ進む期待。 |
| Battle | 暗いが、キャラ・敵・攻撃を瞬時に認識できる。 |
| LevelUp | 記憶を拾い、自分の物語が育つ喜び。 |
| Evolution | 日常から外れた明確な特別感。 |
| Awakening | 忘れ物との結びつきが見える短い物語。 |
| 黒耀化 | 光を侵食する危うさと強さ。 |
| Result | 戦績表ではなく、持ち帰った記憶を綴る余韻。 |
| Collection | 世界の断片を静かに読み返す場所。 |
| 朝 | 暗さを越えた報酬。 |

## 9. Design Phaseロードマップ

```txt
D0 Whole-app visual audit
D1 Reference consolidation
D2 Final art direction / Design Language lock
D3 Screen completion briefs
D4 ChatGPT generation request preparation
D5 ChatGPT image generation and human selection
D6 Component asset production
D7 Unity integration
D8 Simulator comparison
D9 Physical-device visual review
D10 Whole-app visual freeze
U50 Performance / Touch
U51 Release Candidate
```

### 現在値

```txt
D0=COMPLETE
D1=PARTIALLY_COMPLETE
D2=NOT_STARTED
D3=NOT_STARTED
D4=NOT_STARTED
D5=NOT_STARTED
D6=NOT_STARTED
D7=NOT_STARTED
D8=NOT_STARTED
D9=NOT_STARTED
D10=NOT_STARTED
```

## 10. 制作優先順位

### Tier 0: Design system foundation

- Color tokens。
- Typography hierarchy。
- Spacing scale。
- Surface hierarchy。
- State family。
- Button family。
- Card family。
- Icon style。
- 9-slice policy。
- Motion and lighting policy。

### Tier 1: ブランドを決める代表画面

1. TOP。
2. StageSelect。
3. LevelUp。

この3画面で世界観、紙、黒インク、ランタン光、文字、button、card、stateを固定する。

### Tier 2: 遊びの中心

4. Battle HUD。
5. Result。

### Tier 3: 共通component展開

6. Pause。
7. Inventory。
8. Replacement。
9. Collection。

### Tier 4: 特別演出

10. Evolution。
11. Awakening。
12. 黒耀化。
13. Battle background polish。

### Tier 5: 全体統一

- Transition。
- UI particles。
- Lighting consistency。
- Whole-app typography。
- Whole-app state consistency。
- Final device review。

## 11. 画面別完成方針

### TOP

- 現Unityにplayer-facing TOP stateを新設する。
- 既存`top-final.png`は再評価対象。
- 主操作は「夜へ入る」1つ。
- Collection、Settingsなどは控えめにする。
- 大きな立ち絵だけに依存しない。
- Title、small lantern、night key visualを主役にする。
- UIを増やしすぎない。

### StageSelect

- 現行の縦scrollとtap構造は維持する。
- Flowchartに見せない。
- 一続きの夜路として見せる。
- Current nodeはlantern light。
- Locked nodeは黒インク封印。
- 各stageに小景またはsilhouetteを持たせる。
- 道は記憶の軌跡として描く。
- Selected、completed、locked、newを絵で区別する。

### Battle background

- U48 backgroundを再利用候補にする。
- キャラ、敵、projectileの視認性を最優先する。
- 遠景、中景、前景を分離する。
- 局所lantern lightを使う。
- 常時派手なparticleは禁止する。
- Stage固有landmarkを用意する。

### Battle HUD

- 戦闘fieldを主役にする。
- Text-heavy status rowを減らす。
- HP、EXP、timer、inventory、rare、黒耀化を優先度別に整理する。
- Item-specific正式iconを使う。
- 重要でない情報は常時表示しない。
- Virtual stickとgesture領域を侵害しない。

### Pause

- Player-facing screenを新規設計する。
- 夜が止まった静止感を出す。
- Resumeをprimaryにする。
- Settings、returnをsecondaryにする。
- 帰還はdanger hierarchyにする。

### LevelUp

- Icon左、名称・効果右の情報順を維持する。
- 三枚の記憶札として見せる。
- Commonは静かにする。
- Rareは限定的なlantern反応。
- Evolutionは封印解除。
- Placeholder iconは禁止する。
- Selected stateを単色tintだけにしない。
- 本文可読性を装飾より優先する。

### Inventory

- Weapon、passive、rareを一目で区別する。
- Formal icon familyを使う。
- Empty、owned、max、evolvableを統一する。
- 数値中心の管理表に見せない。

### Replacement

- 捨てる記憶と迎える記憶を対比する。
- Oldとnewの情報量を揃える。
- Confirmとcancelを誤認しない。
- 確定時はink stampを使う。

### Evolution

- 通常LevelUpと明確に分離する。
- 二つの記憶が重なる。
- Seal breakを使う。
- 新しい正式iconと名称を主役にする。
- 長すぎない。
- Reduced motionを考慮する。

### Awakening

- 忘れ物との結びつきを示す短い物語演出。
- Evolutionと意味を混ぜない。
- 大量テキストを読ませない。

### 黒耀化

- Charging、ready、active、recoveryを区別する。
- 黒インクがlantern lightを侵食する。
- Activeだけを最大演出にする。
- Gameplay視認性を失わせない。

### Result

- Dashboardではなく記憶の一頁。
- 最重要結果、獲得物、新記録、次行動の順に見せる。
- Rank seal、reward cardを使う。
- 主要CTAは1つ。
- 数字を並べすぎない。

### Collection

- Book/page baseは再利用候補。
- 正式挿絵とcategory markを持たせる。
- Found、unknown、new、completedを統一する。
- Detail overlayを設計する。
- 大きな空白を無意味に残さない。

## 12. Component family候補

```txt
BasePaperPanel
BasePaperButton
PrimaryButton
SecondaryButton
DangerButton
IconButton
MemoryCard
LevelUpCommonCard
LevelUpRareCard
LevelUpEvolutionCard
StageNode
StagePathSegment
InkLockSeal
InventorySlot
ReplacementSlot
ResultRewardCard
ResultRecordRow
CollectionEntry
CollectionTab
StatusChip
Toast
Modal
PauseMenuItem
```

各componentは再開時に次を定義する。

- Purpose。
- Content anatomy。
- Minimum size。
- Responsive behavior。
- Normal、pressed、selected、disabled、locked、new、rare、completed state。
- Asset requirements。
- 9-slice requirements。
- Motion。
- Audio/Haptic hook ownership。
- Accessibility label。
- Forbidden customization。

Prefab継承はBaseからVariantまでの2階層に限定する。

## 13. Primitive使用ポリシー

### 許可するprimitive

- Invisible layout container。
- Mask。
- Safe-area spacer。
- Tap target。
- Progress fill。
- Dim overlay。
- Temporary animation mask。

### 完成surfaceとして禁止するprimitive

- 見えるcard外形。
- Primary button表面。
- StageSelect route。
- Stage node。
- Rarity frame。
- Lock seal。
- LevelUp card。
- HUD frame。
- Result page。

内部構造はuGUI、ユーザーが見る表面は正式assetという分離を守る。

## 14. 画像生成の担当境界

```txt
imageGenerationAuthority=CHATGPT_HUMAN_SUPERVISED
repositoryAgentMayGenerateImages=false
```

画像生成はこのChatGPT会話で行う。

Repository作業エージェントは禁止:

- 画像生成AIを呼ぶ。
- 外部生成サービスを使う。
- Placeholder画像を追加する。
- 既存画像を無断加工する。
- Candidateを人間承認済みにする。
- Productionへ昇格する。

Repository側で事前準備してよいもの:

- Generation brief。
- Composition specification。
- Safe zone。
- Layer separation specification。
- Asset request queue。
- Reserved output path。
- Evaluation rubric。

## 15. ChatGPT画像生成フロー

1. 既存final targetとhelperをこの会話で確認する。
2. 現runtime captureとの差分を整理する。
3. 画面またはasset familyのbriefを1つに絞る。
4. Whole-screen composition候補を生成する。
5. ユーザーが方向性を選ぶ。
6. 選んだ方向をcomponent boardへ分解する。
7. Background、frame、button、card、icon、ornamentを必要単位で生成する。
8. Text-free、layer separation、alpha、9-slice用途を確認する。
9. CandidateとしてGitへ保存する。
10. Prompt、reference、output hash、選択理由を記録する。
11. Human approval後にのみproduction component候補へ進める。
12. Unity実装後、SimulatorとiPhoneで比較する。

全画面を一気に生成しない。

最初の順序:

```txt
TOP
StageSelect
LevelUp
Battle HUD
Result
```

## 16. 画像生成単位

```txt
A. Whole-screen composition reference
B. Component board
C. Background / environmental layer
D. Frame / button / card family
E. Icon family
F. Ornament / seal / lantern / ink family
G. Motion keyframe reference
```

Whole-screen referenceをruntimeへ一枚貼りしない。

Text、button label、数値はUnity側で描画する。

## 17. Asset production分類

再開時、各asset familyを次へ分類する。

```txt
REUSE_AS_IS
REUSE_AFTER_POLISH
REWORK_FROM_REFERENCE
GENERATE_IN_CHATGPT
HAND_AUTHOR
UNITY_RUNTIME
NOT_REQUIRED
REJECTED
```

各assetに記録する項目:

- Priority。
- Screen dependencies。
- Existing references。
- Target usage。
- Production method。
- Master dimensions。
- Runtime dimensions。
- Alpha requirement。
- 9-slice requirement。
- Tile/seam requirement。
- Layer separation。
- State variants。
- Animation requirement。
- Generation brief status。
- Human approval status。
- Implementation status。

## 18. 人間承認rubric

各画面を0〜4で評価する。

```txt
0=未成立
1=prototype
2=改善はあるが仮UI
3=製品候補
4=独自性と完成度が高く、そのまま販売候補
```

評価軸:

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

画面承認条件:

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

自動checkは人間承認を代替しない。

## 19. Unity実装開始ゲート

次の全条件がtrueになるまでUnity実装を開始しない。

```txt
designLanguageLocked
screenBriefApproved
generationCandidateHumanSelected
componentBreakdownApproved
assetUsageDefined
responsiveBehaviorDefined
runtimeStructureToPreserveDefined
safeAreaDefined
tapContractDefined
performanceRiskReviewed
implementationBranchDefined
```

「とりあえず実装して確認」は禁止する。

## 20. 実装後の検証順

1. Editor component catalog。
2. Compact 360x800。
3. Standard 390x844。
4. Large 430x932。
5. Simulator semantic route。
6. Current runtimeとのside-by-side比較。
7. Human visual review。
8. Physical iPhone review。
9. Performance測定。
10. U50へ進む。

## 21. Git運用

### 推奨branch

```txt
design/heavy-production-foundation
design/top
design/stage-select
design/level-up
design/battle-hud
design/result
```

PR #76へHeavy Designの大量runtime変更を混ぜない。

### Commit単位

- Design Language。
- Screen brief。
- Generated candidate metadata。
- Human selection decision。
- Component asset family。
- Screen runtime integration。
- Simulator evidence。
- Physical-device decision。

画像生成、承認、実装、証跡を同一commitへ詰め込まない。

### Human decision

Human decisionはappend-onlyにする。

過去判断を上書きせず、`supersedes`で接続する。

## 22. U49/U50/U51との境界

- Heavy Design documentationはU49 Audio/Haptic evidenceを変更しない。
- Heavy Designのvisual FAILを理由にU49 evidenceを巻き戻さない。
- U49をコード検証だけで昇格しない。
- Heavy Designの大規模実装後にU50を行う。
- U50を先に完了すると、後のUI/VFX追加で性能値が変わるため再測定が必要になる。
- U51はwhole-app visual freeze後に行う。

推奨順:

```txt
U49 actual-device audio/haptic completion
D1-D10 Heavy Design
U50 performance/touch on final visual state
U51 RC
```

## 23. Stop condition

次の場合は停止する。

- 人間判断と文書が矛盾する。
- 既存targetの意味が判別できない。
- Screen brief未承認。
- 画像候補が未選定。
- Component分解が未定義。
- Safe areaまたはtap contractが未定義。
- Runtime structureを壊す必要がある。
- U49 evidenceへ影響する。
- 別の画面とDesign Languageが分岐する。
- Placeholderをproductionへ入れようとしている。
- 生成画像内に文字が焼き込まれている。
- Human approvalなしに`final`へrenameしようとしている。

## 24. 再開時に最初に行うこと

1. 本文書を読む。
2. Whole-app Heavy Design監査を読む。
3. 既存final targetとhelperを一覧化する。
4. 既存画像を現在のsemantic statusへ再分類する。
5. Design Languageを具体tokenまで文書化する。
6. TOP、StageSelect、LevelUpのscreen briefを作る。
7. 画像生成requestを1件だけ準備する。
8. このChatGPT会話で候補生成を開始する。

## 25. 現在の最終判定

```txt
Heavy Design roadmap=DOCUMENTED
Heavy Design implementation=NOT_STARTED
Image generation=NOT_STARTED
Image generation authority=CHATGPT_HUMAN_SUPERVISED
Whole-app human visual approval=false
U49 evidence=UNCHANGED
U49 readiness=U49_BLOCKED_BY_PHYSICAL_DEVICE_EVIDENCE
U50=BLOCKED
U51=BLOCKED
PR76=DRAFT
Next action=HOLD_UNTIL_USER_EXPLICITLY_STARTS_DESIGN_PHASE
```
