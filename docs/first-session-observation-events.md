# 初回セッション観測イベント

`docs/first-session-retention-design.md` と `docs/first-session-implementation-sprint.md` を、検証可能な観測項目へ落とす。
Analytics SDKを入れる前でも、手動QAやdebug logで使えるようにする。

## 目的

初回体験を感覚だけで判断しない。
以下を見て、どこで詰まっているかを判断する。

- いつ操作したか。
- いつ初めて敵を倒したか。
- いつ欠片を拾ったか。
- いつLevelUpしたか。
- 何を選んだか。
- どこで被弾したか。
- どこで負けたか。
- Resultで何を押したか。

## 基本方針

- 初期はSDKを入れなくてよい。
- まずdebug log、QAメモ、Playwright/手動録画で見る。
- 商用MVPで必要になったらAnalyticsへ移す。
- 収集データは最小限にする。
- 個人情報は扱わない。

## 最重要イベント

### first_run_start

発火:

- 初回run開始時。

見る理由:

- 初回導線がどこから始まるかを揃える。

記録候補:

```txt
runId
stageId
characterId
isFirstRun
startTimestamp
```

### first_input

発火:

- 初めて移動入力が入った時。

見る理由:

- 操作開始までが遅いなら、導線や説明が重い。

目標:

- 10秒以内。
- 理想は3〜5秒以内。

### first_enemy_clear

発火:

- 初めて敵を倒した時。

見る理由:

- 最初の達成が遅すぎると退屈。

目標:

- 10〜25秒。

### first_xp_collect

発火:

- 初めて記憶の欠片を回収した時。

見る理由:

- 倒す意味、成長導線が見えているか。

目標:

- 15〜30秒。

### first_levelup

発火:

- 初めてLevelUp画面が開いた時。

見る理由:

- 初回の成長体験が遅すぎないか。

目標:

- 45〜60秒。

### first_card_select

発火:

- 初回LevelUpでカードを選んだ時。

記録候補:

```txt
choiceId
choiceKind
choiceSlot
elapsedSec
```

見る理由:

- 初回カード3枚が分かりやすいか。
- どれを選ぶかで興味が見える。

### first_build_feedback_seen

発火:

- 選択後、画面に変化が出た時。

例:

- 攻撃頻度が上がった。
- 新しい攻撃が出た。
- 移動速度が変わった。
- 範囲演出が出た。

見る理由:

- 選んだ意味が体感できているか。

目標:

- カード選択後15秒以内。

### first_damage_taken

発火:

- 初めて被弾した時。

見る理由:

- 初回難易度が高すぎないか。
- 被弾の視認性があるか。

目標:

- 30秒以内に即死級はNG。
- 1〜3分で軽く危機が見えるのはOK。

### first_recovery_seen

発火:

- 初めて回復ドロップが出た時。

見る理由:

- 救済が見えているか。

目標:

- 3〜5分の危機前後。

### first_special_ready

発火:

- 黒曜化/必殺/特別ゲージが初めて使用可能に近づいた時。

見る理由:

- 特別体験の予告が機能しているか。

目標:

- 5〜7分。

### first_run_end

発火:

- 初回run終了時。

記録候補:

```txt
result
elapsedSec
stageId
characterId
level
kills
fragmentsCollected
highestWeaponLevel
specialUsed
```

見る理由:

- 初回が短すぎるか、長すぎるか。

### first_result_action

発火:

- Resultで最初に押したボタン。

候補:

```txt
upgrade
retry
collection
next_stage
home
```

見る理由:

- もう一回導線が機能しているか。
- 強化導線が見えているか。

## 手動QAで見る表

| 観測項目 | 目標 | 実測 | 判定 |
|---|---:|---:|---|
| 操作開始 | 3〜10秒 |  |  |
| 初回撃破 | 10〜25秒 |  |  |
| 初回XP回収 | 15〜30秒 |  |  |
| 初回LevelUp | 45〜60秒 |  |  |
| 選択後の変化 | 選択後15秒以内 |  |  |
| 初回被弾 | 30秒以降が理想 |  |  |
| 回復表示 | 3〜5分 |  |  |
| 特別ゲージ予告 | 5〜7分 |  |  |
| 初回run終了 | 6〜8分目安 |  |  |
| Result次アクション | 強化/再挑戦 |  |  |

## D1改善で見たい指標

Analytics導入後に見る。
初期は仮説として扱う。

- 初回run開始率。
- 初回run完了率。
- 初回LevelUp到達率。
- 初回カード選択率。
- 初回敗北後の強化画面遷移率。
- 強化後の再挑戦率。
- 初回勝利後の次ステージ開始率。
- 2回目run開始率。
- 2回目run平均到達時間。
- D1 return率。

## 改善判断

### 操作開始が遅い

原因候補:

- TopからBattleまでが重い。
- 説明が長い。
- どこを押すか分からない。

対応:

- CTAを強くする。
- 説明を減らす。
- 最初の操作ガイドを短くする。

### 初回LevelUpが遅い

原因候補:

- 敵が少ない。
- 敵が硬い。
- XP必要量が多い。
- XP回収が遅い。

対応:

- 初回だけ必要XPを下げる。
- 初回だけ敵HPを下げる。
- 初回だけXP量を増やす。

### 選んでも変化がない

原因候補:

- 効果が数字だけ。
- 見た目が変わらない。
- 敵密度が低くて効果が見えない。

対応:

- 選択後15秒以内に変化が見えるよう調整。
- 攻撃演出や移動感を少し強める。

### 初回敗北後に戻らない

原因候補:

- 何が残ったか分からない。
- 強化導線が弱い。
- もう一回で勝てそうに見えない。

対応:

- Resultで残った欠片を強調。
- 「強くする」を第一CTAにする。
- 強化後に「もう一度」へ自然に戻す。

## イベント命名ルール

- snake_case。
- 初回専用は `first_` prefix。
- run共通は `run_` prefix。
- UI行動は `ui_` prefix。

例:

```txt
first_run_start
first_input
first_enemy_clear
first_xp_collect
first_levelup
first_card_select
first_build_feedback_seen
first_damage_taken
first_recovery_seen
first_special_ready
first_run_end
first_result_action
```

## SDK導入前の注意

- 個人情報を送らない。
- 位置情報を扱わない。
- 端末IDを乱用しない。
- 広告SDKや分析SDKを入れる前に、Privacy / Data safetyへの影響を確認する。
- 初期はdebug logと手動QAで十分。

## 最終判断

初回体験は、感覚で良い悪いを決めない。

```txt
いつ分かったか
いつ育ったか
いつ変わったか
いつ危なかったか
何が残ったか
次に何を押したか
```

これを見て、Stage1初回体験を調整する。
