# ヨルノシルベ Screen Completion Specifications v1

Date: 2026-07-28
Status: **PROPOSED / DOCUMENTATION-ONLY / NO IMAGE GENERATION**
Repository: `m-shogo/vamp-pon`
Art direction: `QUIET_NIGHT_SMALL_WARMTH`
Reference viewport: `390x844`

## 1. 目的

主要13領域の目的、情報階層、保持するruntime contract、必要asset、state、responsive、accessibility、performance、完成条件を統一形式で定義する。

この文書は画像生成やUnity実装の開始許可ではない。

## 2. 共通ルール

全画面で守る。

- Primary actionは原則1つ。
- 視線順は最大4段階。
- Night / Paper / Inkを主成分とする。
- 通常画面は静か、specialだけ強くする。
- 色だけでstateを区別しない。
- 44x44 minimum / 56x56 comfortable tap。
- Compactで可読性とtapを削らない。
- Largeで情報量を増やさない。
- AI文字・固定文言を画像へ焼き込まない。
- Whole-screen generated imageをruntimeへ貼らない。
- 既存navigation、save、gameplay、U49 audio/haptic contractを壊さない。

## 3. 共通screen spec fields

各画面は以下を持つ。

```txt
screenId
player purpose
emotional purpose
primary action
secondary actions
visual hierarchy
composition
runtime structure to preserve
visual surfaces to replace
asset families
state coverage
first-time behavior
responsive behavior
accessibility
performance risks
generation brief requirements
human acceptance criteria
```

# S01 TOP

## Purpose

- Player: ゲームを始める、続きへ戻る、必要な設定へ入る。
- Emotion: 静かな夜への入口。怖さより安心と好奇心。

## Hierarchy

```txt
1. ヨルノシルベの存在と夜の空気
2. Primary action
3. 続き／新規など現在状態
4. Secondary navigation
```

## Composition

- 上部: logoと十分な余白。
- 中央: 小さな光、夜の奥行き、必要なら小さなYui silhouette。
- 下部: Primary actionを1つ、secondaryを低い強度で配置。
- 巨大character portraitへ依存しない。
- menu buttonを同じ強さで縦積みしない。

## Preserve

- Existing app flow/navigation hooks。
- Continue/new game判定。
- Safe areaとtap contract。
- Audio/haptic event routing。

## Replace / Produce

- TOP background composition reference。
- logo support ornament。
- primary/secondary button family。
- lantern focal element。
- quiet ambient particle reference。

## States

- First visit。
- Continue available。
- Continue unavailable。
- Loading。
- Error/fallback。
- Reduced motion。

## Accessibility

- 最初のfocusはscreen titleまたはPrimary action。
- Primary actionを5秒以内に発見可能。
- background decorationはsemantic対象外。

## Performance

- UI draw calls 12以下目安。
- 常時particle 20以下。
- realtime blur禁止。

## Acceptance

- generic fantasy title screenに見えない。
- 何を押すか説明なしで分かる。
- キャラを外してもヨルノシルベと分かる。
- 390x844でlogo、action、safe areaが衝突しない。

# S02 StageSelect

## Purpose

- Player: 現在地を理解し、stageを選び、開始する。
- Emotion: 夜を一歩ずつ進む期待。

## Hierarchy

```txt
1. Current location
2. 次に進めるstage
3. stage情報
4. Start action
```

## Composition

- 縦方向の連続した夜路。
- current nodeはlantern marker。
- locked nodeはink seal。
- stageごとに小さなvignette。
- 下部またはcontext areaにstage infoとStart。
- flowchart、業務diagram、丸node＋線だけにしない。

## Preserve

- Vertical scroll/tap contract。
- Stage selection state。
- Locked/unlocked logic。
- Start navigation。
- Existing assertionsとsafe area。

## Replace / Produce

- Night road background layers。
- Stage path family。
- Stage node family。
- Current lantern marker。
- Ink lock seal。
- Stage vignette frame。
- Stage info panel。

## States

- Normal、Selected、Locked、Completed、New、Loading、Empty/error、Reduced motion。

## First-time

- current stageを自動的に視界へ入れる。
- 最初の進行方向をpath continuityで示す。
- Locked reasonを確認可能。

## Accessibility

- node reading orderは進行順。
- Stage name、state、condition、selectedを読み上げる。
- path decorationは読み上げない。

## Performance

- Scroll内の見えないnode ornamentをcull。
- UI draw calls 18以下目安。
- full-screen fog/glow重複を避ける。

## Acceptance

- 一枚の連続した道に見える。
- current/locked/completedを色名なしで区別できる。
- Start actionがscrollに埋もれない。
- StageSelect human review FAILの原因である仮UI感がない。

# S03 Battle Background

## Purpose

- Player: 敵、projectile、pickup、dangerを読む。
- Emotion: 夜の世界を歩いている感覚。

## Hierarchy

```txt
1. Player / enemy / danger
2. Pickup / projectile
3. Environment landmark
4. Ambient detail
```

## Composition

- Gameplay readability最優先。
- 中央fieldのcontrastを安定。
- edgeや遠景で世界観を出す。
- floor pattern、fog、lightがenemy silhouetteを潰さない。

## Preserve

- Gameplay coordinates/camera。
- Character/enemy production sprites。
- Collision、spawn、pickup。
- Existing runtime visual provider。

## Replace / Produce

- Stage-specific background layers。
- Low-frequency ground texture。
- Edge landmark。
- restrained ambient VFX。

## States

- Normal wave、climax、黒耀化、damage pressure、result transition、performance fallback。

## Performance

- Gameplay particle budgetを優先。
- UI装飾による中央overdrawを禁止。
- Parallaxは低振幅、fallback停止可能。

## Acceptance

- Character/enemyが背景へ埋もれない。
- 背景単体でもstage identityがある。
- gameplay中に装飾を見なくても操作できる。

# S04 Battle HUD

## Purpose

- Player: 生存、時間、level、装備、special stateを瞬時に読む。
- Emotion: 戦場を邪魔せず、小さな灯りに守られている。

## Hierarchy

```txt
1. Critical survival / timer
2. Level / progression
3. Weapon/passive slots
4. Special state / contextual feedback
```

## Composition

- battlefieldを主役にする。
- 上部reserved heightとsafe areaを維持。
- slotを正式iconとstateで表示。
- text-heavyな常時説明を置かない。
- virtual stick / gesture ownershipを侵害しない。

## Preserve

- Existing HUD data hooks。
- U47 inventory presenter。
- Timer、HP、level、slot logic。
- Pause entry。

## Replace / Produce

- HUD plate family。
- Weapon/passive slot family。
- Status chip。
- Timer/rank frame。
- Special gauge/黒耀化 indicator。

## States

- Empty slot、occupied、new、rare、evolution-ready、disabled、cooldown、warning、kokuyou、fallback。

## Accessibility

- 色だけでHP warningを表現しない。
- 重要変化はvisual＋audio/hapticの複数手段。
- Small textを避け、iconには補助label。

## Performance

- UI draw calls 16以下目安。
- 常時HUD particle 10以下。
- Damage中のfull-screen overlayを重ねすぎない。

## Acceptance

- 3秒以内にHP、timer、levelを読める。
- formal icon missing 0。
- battlefield centerを隠さない。
- 管理dashboardに見えない。

# S05 Pause

## Purpose

- Player: 安全に停止し、再開、設定、終了判断をする。
- Emotion: 夜の中で一息つく静かな場所。

## Hierarchy

```txt
1. Resume
2. Current run summary
3. Settings / secondary
4. Return/quit destructive action
```

## Composition

- ResumeをPrimary。
- Backgroundはbattleを暗く残す。
- Paper panelは1つのまとまり。
- Return/quitは距離とmuted dangerで分離。

## Preserve

- Pause ownership。
- TimeScale/input contract。
- Resume/return navigation。
- Audio lifecycle。

## Replace / Produce

- Pause panel。
- Pause item family。
- Run summary compact block。
- destructive confirmation modal。

## States

- Normal、pressed、disabled、loading、confirmation、error、reduced motion。

## Acceptance

- Resumeが最初に分かる。
- 誤操作でrun終了しにくい。
- player-facingの完成画面でありdebug overlayに見えない。

# S06 LevelUp

## Purpose

- Player: 3候補を比較し、1つ選ぶ。
- Emotion: 忘れていた記憶を拾う喜び。

## Hierarchy

```txt
1. 3つの選択肢
2. 各候補の名称と効果
3. 種類 / rarity / evolution
4. Reroll等のsecondary action
```

## Composition

- Icon left、名称・効果rightの改善済み構造を維持。
- 3枚のmemory card。
- Commonは静か、Rareは限定的、Evolutionはseal-break。
- 長い説明を縮小して押し込まない。
- 同じ強さのborder/glowを3枚へ付けない。

## Preserve

- 3-choice logic。
- Selection/input hook。
- Weapon/passive/evolution logic。
- Safe area、tap target、assertions。

## Replace / Produce

- LevelUp card family。
- Icon frame。
- Type/rarity marks。
- Selected ornament。
- Rare edge。
- Evolution seal-break。
- Reroll secondary control。

## States

- Common、Rare、Evolution、Selected、Pressed、Disabled、Loading、Error、Reduced motion。

## First-time

- 1つ選ぶことを短く明示。
- Weapon/passive差をmark＋labelで示す。
- 再訪ではtutorialを繰り返さない。

## Performance

- UI draw calls 18以下目安。
- Full-screen dim＋paper＋glowのoverdraw注意。

## Acceptance

- LevelUp human review FAILの仮card感がない。
- 390x844で3候補が読める。
- rarityを色名なしで区別できる。
- 管理画面ではなく記憶を選ぶ体験に見える。

# S07 Inventory

## Purpose

- Player: 現在装備、空slot、成長状態を理解する。
- Emotion: 集めた灯りと記憶を整理する。

## Hierarchy

```txt
1. Current equipment
2. Empty / replaceable slots
3. Level / evolution readiness
4. Detail
```

## Preserve

- Inventory data、slot ID、runtime state。
- Battle input ownership。
- Existing 180px original icon policy。

## Produce

- Slot family。
- Empty slot symbol。
- Level pips。
- Evolution-ready seal。
- Detail panel。

## States

- Empty、occupied、selected、new、rare、evolution-ready、locked、disabled、fallback。

## Acceptance

- Fixed slot layoutが読みやすい。
- Emptyとlockedを混同しない。
- formal iconsが揃う。

# S08 Replacement

## Purpose

- Player: 受け取るものと入れ替えるものを安全に選ぶ。
- Emotion: 大事な記憶を手放す慎重さ。

## Hierarchy

```txt
1. Incoming item
2. Existing slots
3. Replacement consequence
4. Confirm / cancel
```

## Preserve

- Replacement contractと34 Editor assertions。
- Receive/reject logic。
- Inventory IDs。

## Produce

- Incoming card。
- Replaceable slot state。
- Comparison indicator。
- Confirm/cancel hierarchy。

## States

- Selectable、selected、cannot replace、confirming、error、fallback。

## Acceptance

- 何を失い何を得るか一目で分かる。
- confirmとcancelを誤認しない。
- destructive actionがPrimaryに見えない。

# S09 Evolution

## Purpose

- Player: 進化条件達成と変化内容を理解し、体験する。
- Emotion: 封印が解ける高揚。

## Hierarchy

```txt
1. Evolution achieved
2. Before → after
3. New effect
4. Continue
```

## Composition

- Violetはこのphaseに限定。
- Paper sealが光と共に解ける。
- 常時派手ではなく、短いclimax。

## Preserve

- Evolution data/condition。
- Weapon replacement/runtime state。
- Continue hook。

## Produce

- Seal-break frame。
- Before/after icon frame。
- Evolution title mark。
- Motion keyframe reference。

## States

- Ready、revealing、completed、fallback、reduced motion。

## Acceptance

- LevelUp Rareとの差が明確。
- generic purple magicに見えない。
- 効果内容が演出後に読める。

# S10 Awakening

## Purpose

- Player: 特別な覚醒を理解し、通常成長より大きい変化を体験する。
- Emotion: 記憶がつながる驚き。

## Composition

- Evolutionより物語・人物寄り。
- Paper fragmentが結び直される。
- Dawnへの伏線を含める。

## Preserve

- Awakening trigger/data contract。
- Input lock/release。

## Produce

- Fragment composition。
- Awakening seal。
- Character/UI connection reference。

## Acceptance

- Evolutionと同じ演出の色違いにしない。
- 情報と感情の両方が伝わる。

# S11 黒耀化

## Purpose

- Player: 強力だが危うい特殊状態を認識し、操作する。
- Emotion: 光を侵す力への緊張。

## Hierarchy

```txt
1. 黒耀化が起きたこと
2. 残り時間 / state
3. Player power feedback
4. 終了 / recovery
```

## Composition

- Deep violet-black inkがLantern lightを侵食。
- Generic purple auraや全画面暗転だけにしない。
- gameplay readabilityを維持。

## Preserve

- 黒耀化 gameplay contract。
- Input path。
- Timer/state hooks。
- Correct term `黒耀化`。

## Produce

- Activation cutin reference。
- Ink invasion edge。
- HUD state indicator。
- Recovery/dawn contrast。

## States

- Available、activating、active、ending、unavailable、fallback、reduced motion。

## Acceptance

- 強さと危険性を同時に理解できる。
- enemy/projectile visibilityを失わない。
- 通常Evolutionと混同しない。

# S12 Result

## Purpose

- Player: 結果、獲得、記録、次の行動を理解する。
- Emotion: 戦いの余韻と記憶を持ち帰る感覚。

## Hierarchy

```txt
1. Clear / fail / rank
2. Rewards
3. New records / restored memories
4. Next action
```

## Composition

- Spreadsheetではなく記憶のpage。
- Rankはseal/stamp。
- 数字を整然と見せるがtable感を抑える。
- New recordをlantern/restored lightで限定強調。

## Preserve

- Result read model。
- Save hook。
- Reward/record logic。
- Continue/navigation。

## Produce

- Result paper ledger。
- Rank seal。
- Reward card。
- Stats line family。
- New/restored mark。
- CTA hierarchy。

## States

- Clear、fail、new record、empty reward、loading save、save error、fallback、reduced motion。

## Performance

- UI draw calls 18以下目安。
- revealはone-shot、常時particleを抑える。

## Acceptance

- 数字の表ではなく余韻がある。
- 5秒以内に結果と次のactionが分かる。
- save error時も安全な選択ができる。

# S13 Collection / 灯録

## Purpose

- Player: 発見した記憶を閲覧し、未発見とcompletedを理解する。
- Emotion: 少しずつ記憶が蓄積する満足。

## Hierarchy

```txt
1. Category / current filter
2. Entries
3. Selected entry detail
4. Completion / new state
```

## Composition

- 図鑑gridではなく、記憶の索引・page rhythm。
- Entry familyはcategoryでshape languageを変える。
- Newは一度だけ静かに灯る。
- Completedはstamp。

## Preserve

- Collection read model。
- Seen ID保存。
- New/completed diff logic。
- Filter behavior。

## Produce

- Index tab family。
- Entry family。
- Locked/unknown state。
- Completed stamp。
- Detail page。
- Empty category state。

## States

- Unknown、discovered、new、completed、selected、empty category、loading、error、fallback。

## Accessibility

- Filter→entry→detailのreading order。
- Unknown entryのネタバレ境界を守る。
- New/completedを音だけで示さない。

## Performance

- Scroll maskとentry countを管理。
- Visible item以外のanimationを止める。

## Acceptance

- Inventory gridに見えない。
- 未発見のspoilerを出さない。
- Entry、detail、completedが同じdesign languageに見える。

## 4. Cross-screen cohesion gate

代表5画面:

```txt
TOP
StageSelect
Battle HUD
LevelUp
Result
```

を並べて次を確認する。

- 同じNight、Paper、Ink、Lantern language。
- Button、card、state、iconのfamilyが連続。
- 画面ごとに役割は違うが別productに見えない。
- 通常とspecialの強度差がある。
- Character/UI cohesionが維持される。

## 5. Generation order

```txt
1. TOP direction exploration
2. TOP refined reference
3. TOP component board
4. StageSelect direction exploration
5. StageSelect component board
6. LevelUp direction exploration
7. LevelUp component board
8. Battle HUD
9. Result
10. Remaining screens by shared component reuse
```

一度に複数画面を生成しない。

## 6. Screen approval gate

各画面:

```txt
structuralAcceptance=true
visualAcceptance=true
assetAcceptance=true
responsiveCompactPass=true
responsiveStandardPass=true
responsiveLargePass=true
accessibilityCriticalFailure=0
performanceCriticalFailure=0
placeholder=0
missingFormalIcon=0
clippedText=0
brokenSafeArea=0
humanExplicitApproval=true
```

## 7. 現在判定

```txt
ScreenSpecificationsDocumented=13/13
GenerationBriefs=STRUCTURALLY_PREPARED_NOT_APPROVED
ImageGenerationStarted=false
UnityImplementationStarted=false
NextAction=DEFINE_REFERENCE_REGISTRY_COMPARISON_AND_DOCUMENT_READINESS
```
