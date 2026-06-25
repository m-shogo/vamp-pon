# App Screen Functional Spec

Web版完成度向上とUnity移行の両方で使う、全画面 / 全機能の仕様書。

この文書の目的は、画面を増やすことではなく、TOPからResultまでの遊びの流れを迷わず実装できるようにすること。

## Core Loop

```txt
TOP
↓
Stage Select
↓
Battle
↓
LevelUp / Pause / Kokuyou
↓
Result
↓
Growth
↓
Stage Select or Retry
```

## Global Rules

- 基準解像度は390x844。
- 縦持ち固定。
- 文字は画像に焼き込まない。
- CTAは押せることが見た目で分かる。
- UIは紙 / ランタン / 記憶帳のモチーフで統一する。
- 黒インクは危険・未知・強化前の表現に使う。
- 暖色ランタンは進行・報酬・回復・主人公性に使う。

## 1. TOP

### Purpose

起動直後に世界観と開始導線を伝える。

### Required UI

- Title logo / temporary title。
- Primary CTA: はじめる。
- Secondary: 強化 / 図鑑 / 設定。
- 背景: 夜、紙片、灯り。

### Behavior

- はじめる: StageSelectへ。
- 強化: Growthへ。
- 図鑑: Collectionへ。
- 設定: Settingsへ。

### Acceptance

- ただのWebメニューに見えない。
- CTAが一番目立つ。
- 390x844で押しやすい。

## 2. Stage Select

### Purpose

出撃先、難易度、報酬、進行状況を選ばせる。

### Required UI

- Stage card。
- Difficulty tabs: Easy / Normal / Hard。
- Clear state。
- Reward preview。
- Start button。
- Back button。

### Behavior

- 未解放ステージはロック表示。
- 難易度変更で敵の強さと報酬倍率を表示。
- StartでBattleへ。

### Acceptance

- 難易度差が文字だけでなく、紙の痛み・黒インク量・灯りで分かる。
- Stage1 Easyが最初に迷わず押せる。

## 3. Battle

### Purpose

メインの遊び。移動、敵、攻撃、EXP、LvUp、黒曜化を気持ちよく体験させる。

### Required UI

- Time。
- HP。
- Level。
- EXP bar。
- Memory fragments / reward count。
- Weapon slots。
- Passive slots。
- Ultimate / Kokuyou button。
- Pause button。

### Behavior

- プレイヤーは移動のみ。
- 攻撃は基本自動。
- 敵は画面外から接近。
- 敵クリアでEXPを落とす。
- EXP取得でLevelUp。
- LevelUp時はゲームを止める。
- 黒曜化はゲージ満タンで発動可能。
- Stage time終了でResult Clear。
- HP0でResult Failed。

### Acceptance

- 最初の30秒が寂しくない。
- 敵クリアとEXP吸引が気持ちいい。
- HUDが邪魔にならない。
- プレイヤー、敵、EXP、攻撃が読める。

## 4. LevelUp

### Purpose

プレイヤーに成長選択の楽しさを出す。

### Required UI

- Dark overlay。
- 3 choice cards。
- Icon。
- Name。
- Short description。
- Level / New / Evolved / Rare state。
- Reroll button if available。
- Skip / take none if needed。

### Behavior

- 選択で即反映。
- 武器 / Passive / Rareを出す。
- 所持枠が満杯なら入替または受け取らないを出す。
- 進化条件達成時は進化候補を優先表示。

### Acceptance

- 390x844で文字が被らない。
- 3択を選びたくなる。
- Rareが特別だが下品に光らない。
- 入替判断で詰まらない。

## 5. Pause

### Purpose

プレイ中断、再開、TOP戻りを安全に行う。

### Required UI

- Resume。
- Retry。
- Back to TOP。
- Settings。

### Behavior

- ResumeでBattle復帰。
- Retryは確認あり。
- Back to TOPは確認あり。
- Settingsでは音量など軽い項目のみ。

### Acceptance

- 誤ってTOPへ戻らない。
- スマホで押しやすい。

## 6. Result

### Purpose

プレイ結果、報酬、成長導線を見せて、次のプレイへ戻す。

### Required UI

- Clear / Failed。
- Rank seal。
- Survived time。
- Defeated enemies。
- Acquired memory fragments。
- New records。
- Unlocked collection。
- CTA: 強化へ。
- CTA: もう一度。
- CTA: StageSelectへ。

### Behavior

- 報酬を保存する。
- New collection / achievementを表示する。
- Failedでも少し成長できる。

### Acceptance

- 精算表ではなく記憶ページに見える。
- 報酬が嬉しい。
- もう一度か強化へ進みたくなる。

## 7. Growth

### Purpose

負けても進んだ感を出す。

### Required UI

- Currency display。
- Upgrade list。
- Current level。
- Next effect。
- Cost。
- Reset button if implemented。

### Behavior

- Memory fragmentsで強化。
- 強化後は即保存。
- StageSelect / Retryへ戻れる。

### Acceptance

- 何を強化したらよいか分かる。
- 初回プレイ後に1つは強化できるのが理想。
- Hardへ挑む理由になる。

## 8. Collection

### Purpose

世界観と達成感を蓄積する。

### Required UI

- Sections。
- Records。
- Locked hint。
- New marker。
- Seen state。

### Behavior

- 新規解放だけ初回演出。
- seen状態を保存。
- 未解放はネタバレしすぎない。

### Acceptance

- データベースではなく忘れ物帳 / 星図 / 記録帳に見える。
- Newが分かりやすい。

## 9. Settings

### Purpose

最低限の操作と音量調整。

### Required UI

- BGM volume。
- SE volume。
- 操作設定。
- Data reset。
- Credits。

### Behavior

- Data resetは確認あり。
- 音量変更は即反映。

### Acceptance

- 迷わない。
- 危険操作に確認がある。

## Save Targets

| Data | 保存タイミング |
|---|---|
| currency | Result |
| growth levels | Growth購入時 |
| cleared stages | Result Clear |
| collection unlocked | 条件達成時 |
| collection seen | Collection表示時 |
| achievements | 条件達成時 |
| settings | 変更時 |

## Unity Migration Notes

- TOP / StageSelect / ResultはUnity UI Prefab化する。
- Battle HUDはSafeArea root配下。
- LevelUpは独立Prefab。
- Collectionは本移行後でよい。
- Settingsは最小でよい。

## Immediate Implementation Priority

1. Battleの気持ちよさ。
2. Result → Growth導線。
3. LevelUp可読性。
4. StageSelect難易度表示。
5. Collection new / seenの安定化。

## Definition of Done

Stage1 Web版は以下で一旦完成扱い。

- TOPからStage1を開始できる。
- 8分プレイまたは失敗まで進む。
- LvUpが複数回起こる。
- 進化または黒曜化を1回体験できる。
- Resultで報酬が保存される。
- Growthで強化できる。
- RetryまたはStageSelectへ戻れる。
- 390x844で読める。