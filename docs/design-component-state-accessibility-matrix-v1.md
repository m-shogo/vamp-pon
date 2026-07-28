# ヨルノシルベ Component State / Accessibility Matrix v1

Date: 2026-07-28
Status: **PROPOSED / DOCUMENTATION-ONLY**
Repository: `m-shogo/vamp-pon`

## 1. 目的

Normal状態だけを作って完成扱いすることを防ぎ、全component familyの必要state、視覚差、操作、accessibility、fallbackを実装前に定義する。

## 2. State vocabulary

| State | 意味 | 必須差分 |
| --- | --- | --- |
| Normal | 通常利用可能 | base shape / paper / ink |
| Pressed | 押下中 | inward edge、scale、短い反応 |
| Selected | 現在選択 | notch/thread、L2 light、raised |
| Disabled | 条件不足で操作不可 | detail減、neutral、label維持 |
| Locked | 未解放 | seal / ink / non-interactive |
| New | 初回発見 | small mark、one-shot L1 |
| Completed | 完了・回収済み | stamp/check、moss/dawn |
| Rare | 稀少 | unique edge、L3 reveal |
| Evolution | 進化候補 | violet seal-break language |
| Kokuyou | 黒耀化 | ink invasion、light conflict |
| Loading | 処理中 | stable layout、progress feedback |
| Empty | 内容なし | 理由と次の行動 |
| Error | 失敗 | 原因の簡潔表示、復帰action |
| Fallback | asset/feature代替 | 意味を失わない簡易表現 |
| ReducedMotion | motion低減 | static light/edge/opacity |

## 3. 共通state表現

| State | Color | Shape / asset | Light / ink | Motion | Interaction |
| --- | --- | --- | --- | --- | --- |
| Normal | base | standard edge | L0 | none | enabled |
| Pressed | slight raised | inward edge | brief L1 | 0.08〜0.12s | enabled |
| Selected | raised | notch/thread | stable L2 | 0.16〜0.24s | enabled |
| Disabled | neutral | detail reduced | none | none | blocked |
| Locked | dark neutral | seal/cross | ink | none | blocked |
| New | base + accent | new mark | one-shot L1 | one-shot | enabled |
| Completed | moss/dawn | stamp/check | restored light | one-shot | context |
| Rare | rare accent | rare edge | L3 | reveal | enabled |
| Evolution | violet | breakable seal | L3/L4 | reveal | enabled |
| Kokuyou | violet-black | invasion edge | ink consumes light | phase | context |
| Loading | neutral | stable skeleton | subtle | low motion | blocked/partial |
| Empty | base | dedicated illustration/mark | none | none | CTA if available |
| Error | muted danger | warning shape | none | one-shot max | retry/back |
| Fallback | base | simplified formal shape | none | none | preserved |
| ReducedMotion | same meaning | same shape | static | distance -50%+ | preserved |

色だけのstate差は禁止する。

## 4. Component coverage matrix

Legend:

```txt
R = required
C = conditional
N = not applicable
D = deferred but must be designed before implementation
```

| Family | Normal | Pressed | Selected | Disabled | Locked | New | Completed | Rare | Evolution | Kokuyou | Loading | Empty | Error | Fallback | ReducedMotion |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Primary button | R | R | C | R | N | N | N | N | N | N | C | N | C | R | R |
| Secondary button | R | R | C | R | N | N | N | N | N | N | C | N | C | R | R |
| Destructive button | R | R | C | R | N | N | N | N | N | N | C | N | C | R | R |
| Paper panel | R | N | C | C | C | C | C | C | C | C | C | R | R | R | R |
| Generic card | R | R | R | R | R | R | C | C | C | C | C | C | C | R | R |
| LevelUp card | R | R | R | R | N | C | N | R | R | C | C | N | C | R | R |
| Stage node | R | R | R | R | R | C | R | C | N | C | C | N | C | R | R |
| Stage path | R | N | R | C | R | N | R | N | N | C | N | N | N | R | R |
| Inventory slot | R | R | R | R | R | R | C | R | C | C | C | R | C | R | R |
| Replacement slot | R | R | R | R | R | C | C | R | C | C | C | R | C | R | R |
| Result reward card | R | R | C | C | N | R | R | R | C | C | C | R | C | R | R |
| Collection entry | R | R | R | C | R | R | R | C | N | C | C | R | C | R | R |
| Modal | R | N | N | N | N | N | N | C | C | C | C | R | R | R | R |
| Pause item | R | R | R | R | C | N | N | N | N | N | C | N | C | R | R |
| HUD slot | R | C | R | C | C | C | C | R | C | C | C | C | C | R | R |
| Status chip | R | N | R | R | R | R | R | R | R | R | C | N | C | R | R |
| Navigation tab | R | R | R | R | C | R | C | N | N | N | C | N | C | R | R |
| Ink seal | N | N | C | N | R | N | N | N | C | R | N | N | N | R | R |
| Lantern marker | R | C | R | C | C | R | R | R | C | C | C | N | C | R | R |

実装前にDを残さない。

## 5. Button family

### 5.1 Hierarchy

- Primary: 画面に原則1つ。
- Secondary: 最大2〜3個。
- Destructive: Primaryから距離を取り、muted dangerを使用。
- Icon-only: 44x44以上、accessible label必須。

### 5.2 State

Pressedはscaleだけでなく、edgeとshadowの内向き変化を持つ。

Disabledはalphaを下げるだけでなく、detailとlightを減らし、labelは読める状態を保つ。

Loading中にlabel幅を変えず、button layoutを跳ねさせない。

## 6. Card family

Cardは共通frameを持つが、全cardを同じ外観にしない。

```txt
Base geometry common
+ purpose-specific top edge
+ state mark
+ icon plate policy
+ rarity/evolution/kokuyou overlay
```

- Selected: notch/thread + stable L2。
- Rare: goldだけでなくedge shapeとreveal。
- Evolution: seal-breakとviolet。
- Locked: paperを暗くするだけでなくink seal。
- DisabledとLockedを同じ見た目にしない。

## 7. Loading / Empty / Error

### Loading

- Skeletonをgeneric gray rectangleだけにしない。
- Paper Ghostまたは静かなlantern markerを利用。
- 2秒以上なら進行中であることを明示。
- cancel可能ならactionを出す。

### Empty

必須:

```txt
何が空か
なぜ空か
次に何をすると増えるか
```

「データがありません」だけは禁止。

### Error

- technical error codeを主表示にしない。
- retry、back、安全な継続のいずれかを提示。
- destructiveな復旧をdefaultにしない。
- save破損等は既存runtime contractへ従う。

## 8. Accessibility baseline

### 8.1 Tap / safe area

- minimum 44x44
- comfortable 56x56
- gesture areaと重ねない
- decorationよりsafe areaを優先
- visual surfaceが小さくてもhit areaは契約を守る

### 8.2 Typography

| Role | Minimum |
| --- | ---: |
| Body | Compact 14 / Standard 15 |
| Button | Compact 15 / Standard 16 |
| Caption | Compact 11、重要情報には使用しない |
| Numeric critical | 19以上 |

- Auto Sizeだけに依存しない。
- 省略時は意味が変わらない箇所だけellipsis。
- 効果説明は2〜4行を基準。
- 重要な結果や条件をtooltipだけへ隠さない。

### 8.3 Contrast

- Paper上はink textを基本。
- Night上の長文を禁止。
- Stateの意味をcolorだけに依存しない。
- Texture、glow、outline込みでdevice captureを確認。

### 8.4 Audio / haptic alternatives

- 音だけで成功・失敗を伝えない。
- 振動だけでrareやdamageを伝えない。
- Visual state、text、shape、motionのいずれかを必ず併用。
- U49 evidenceとHeavy Design approvalを混同しない。

### 8.5 Reduced motion

- 移動距離を50%以上縮小。
- flash、large zoom、shakeを削除。
- paper enterはopacity + small edge changeへ。
- lantern pulseはstatic haloへ。
- ink spreadは最終形を短くfade表示。
- 操作可能になる時刻を通常modeと大きく変えない。

### 8.6 Flashing

- 高contrast明滅の連続を禁止。
- Climaxでも短いone-shotに制限。
- 画面全体white flashを常用しない。
- Reduced motionではflashを削除。

## 9. VoiceOver / semantic order

Unity/iOS accessibility実装方式は別途技術確認するが、screen briefでsemantic orderを先に定義する。

共通順序:

```txt
Screen title
Current status
Primary content
Selection state
Primary action
Secondary actions
Navigation / close
```

Icon-only actionはvisible tooltipの有無に関係なくlabelが必要。

Decorative imageは読み上げ対象にしない。

選択cardは次を読み上げる。

```txt
名前
種類
現在level / rarity
効果
選択状態
操作
```

## 10. First-time flow

### TOP

- Primary actionを位置、形、light、labelで判別。
- 初回と再訪で主操作を変えすぎない。

### StageSelect

- current stageをlantern markerとpath continuityで示す。
- locked reasonを確認可能にする。
- scroll先にprimary actionを隠さない。

### Battle

- 移動方法を初回だけ簡潔に提示。
- Pause入口を隠さない。
- HUDの意味を一度に全部説明しない。

### LevelUp

- 選択可能な3枚を明示。
- weapon/passive/rare/evolutionをmarkと文言で区別。
- 初回だけ短い説明、再訪時は邪魔しない。

### Result

- 結果→獲得→新規記録→次のactionの順。
- next actionを画面下部に固定しすぎてsafe areaと衝突させない。

### Collection

- 未発見、発見済み、completedの違いをshapeとtextで示す。

## 11. Discoverability test

各画面で初見ユーザーへ次を確認する。

```txt
5秒以内にprimary actionを指せる
selected / locked / disabledを区別できる
戻る方法を説明できる
操作結果を音なしで理解できる
rare/evolutionを色名なしで説明できる
```

## 12. Implementation gate

```txt
componentStateMatrixComplete=true
requiredMissingStates=0
colorOnlyStateDifferences=0
firstTimeFlowDefined=true
primaryActionDiscoverable=true
accessibilityRolesDefined=true
audioOnlyMeaning=0
hapticOnlyMeaning=0
reducedMotionAlternativeDefined=true
semanticOrderDefined=true
```

## 13. 現在判定

```txt
ComponentStateMatrix=PROPOSED_COMPLETE
AccessibilityBaseline=PROPOSED_COMPLETE
FirstTimeFlow=PROPOSED_COMPLETE
VoiceOverImplementationMethod=TO_BE_TECHNICALLY_VERIFIED
ImageGenerationStarted=false
UnityImplementationStarted=false
NextAction=COMPLETE_REPRESENTATIVE_SCREEN_BRIEFS
```
