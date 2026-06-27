# dawn-ticket 復帰レア最小仕様

`dawn-ticket` は、覚醒素材ではなく `survival_revival` role の復帰/救済レア候補として扱う。
このメモは runtime 追加前の仕様整理であり、現時点では `rareItems.ts` に追加しない。
画像生成もしない。

## 現在の関連実装

- レアアイテムは `RareItemDefinition.role` で分類する。
- 既存4種のレアはすべて `awakening_material`。
- 覚醒素材は `evolutions.ts` の `requiredRareItemId` / `consumedRareItemIds` で使われる。
- HP0 は `applyPlayerDamage()` で `state.status = GAME_STATUS.GAMEOVER` になり、次の `MainScene.resolveTransitions()` で `enterResult(false)` へ進む。
- `player.invulnRemaining` / `player.flashRemaining` は既にあり、復帰後の短い無敵に使える。
- Result は `enterResult(cleared)` で一度だけ入るため、復帰処理は `GAMEOVER` を確定させる前に行うのが安全。
- `tryConsumeSurvivalRevival()` の汎用フックは実装済み。ただし `dawn_ticket` はまだ `rareItems.ts` に追加していないため、現runtimeでは発動しない。

## 最小仕様案

| 項目 | 仕様 |
|---|---|
| runtime ID | `dawn_ticket` 候補。実装時に命名を `dawn-ticket` prompt側と揃える |
| role | `survival_revival` |
| 発動タイミング | HP0になる被弾時に自動発動 |
| 消費条件 | 所持していれば1回だけ消費。消費後は同一run中に再発動しない |
| 復帰HP | 最大HPの30%。`Math.ceil(maxHp * 0.3)` を候補値にする |
| 追加効果 | 短い無敵時間を付与する。周囲押し返しは後続候補 |
| UI演出 | 朝焼けリング、小さなカード表示、HP回復表示 |
| 失敗条件 | 未所持、または消費済みなら通常敗北 |
| 画像 | 仕様確定まで生成しない |

## 実装時の差し込み候補

最小実装では `applyPlayerDamage()` の HP0 確定直前に専用関数を呼ぶ。

```txt
被弾
↓
HPが0以下
↓
tryConsumeSurvivalRevival(state)
  ├─ 成功: rareItemsからdawn_ticketを消費、HPを30%へ戻す、invuln/flash付与、PLAYING継続
  └─ 失敗: hp=0、GAMEOVER
```

この位置なら `MainScene.enterResult(false)`、リザルト精算、黒曜化終了処理と衝突しにくい。

## UI/演出方針

- 復帰は派手すぎない朝色のリングで見せる。
- カード表示は1秒未満の小さな通知に留め、操作を止めない。
- HP回復表示は既存の回復pickupより少し特別にする。
- レア枠、星、数字はアイコン画像へ焼き込まない。

## 黒曜化との衝突確認

- 黒曜化中でもHP0になったら復帰は発動してよい。
- 復帰時に黒曜化ゲージや `berserk.activeRemaining` を勝手にリセットしない。
- 復帰後の無敵時間は `player.invulnRemaining` で管理し、黒曜化の疲労処理へ触れない。
- 復帰が失敗した場合は現行通り `GAMEOVER` へ進む。

## 必要なデータ項目

実装時に必要になる可能性が高い項目:

- `RareItemDefinition.role: 'survival_revival'`
- `reviveHpRatio` または role別定数。初期値は `0.3`
- `reviveInvulnSec` または role別定数。候補は通常被弾無敵より少し長い値
- 消費済み判定は、最小実装では `inventory.rareItems` から削除するだけで足りる
- 現在の汎用フックでは `SURVIVAL_REVIVAL_HP_RATIO = 0.3`、`SURVIVAL_REVIVAL_INVULN_SEC = 1.25` を使う

永続的な「消費済み履歴」は同一run内で再取得を許すかどうかを決めてから追加する。

## テスト観点

- `survival_revival` role は覚醒条件に使われない。
- 覚醒条件で使う rare item は必ず `awakening_material`。
- HP0時に `dawn_ticket` を所持していれば消費され、HPが最大HP30%へ戻る。
- 発動後は `GAMEOVER` にならない。
- 未所持時は現行通り `GAMEOVER` になる。
- 復帰後に `player.invulnRemaining` が付与される。
- 黒曜化中の復帰で `berserk.activeRemaining` / `fatigueRemaining` を破壊しない。
- リザルトは復帰成功時に開かず、復帰失敗時だけ開く。

## 未決定

- `dawn_ticket` を抽選に出す条件。
- レア枠を圧迫する救済アイテムとしての出現重み。
- 周囲の敵を押し返すか、短い無敵だけに留めるか。
- 復帰後に短いスロー演出を入れるか。
- 同一run中に再取得できるか。
- UI通知を `EffectManager` と `Overlay` のどちらに寄せるか。

## 実装に進む条件

- 復帰時のUI演出を1種類に絞る。
- 再取得可否を決める。
- `rareItems.ts` へ `dawn_ticket` を追加する。
- runtime画像を生成する前に、32pxで「夜明けの切符」と読めるアイコン要件を再確認する。
