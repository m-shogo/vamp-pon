# Balance Log

## 目的

Vamp Pon の数値調整を記録する。

調整時は、以下を残す。

```txt
何を変えたか
なぜ変えたか
どうなったか
次に何を見るか
```

---

# Current Baseline

## 2026-06-14 Playtest Patch 1 後

3回プレイ後の「操作しにくい / 敵が硬い / 攻撃が遅い / 気持ちよくない / クリアできない」を受け、MVP v0.1 は初回クリアよりも **気持ちよく倒せる・操作の邪魔がない** 方向へ寄せる。

```txt
プレイヤー HP: 110
プレイヤー moveSpeed: 115
無敵時間: 0.75s

インクの影 HP: 12 / contactDamage: 6
紙くずの影 HP: 8 / contactDamage: 5
迷子の方角 HP: 22 / contactDamage: 8
黒いカプセル HP: 55 / contactDamage: 10
夜のもや HP: 24 / contactDamage: 7
黒ラベルの影 HP: 210 / contactDamage: 14

夜の鉛筆 Lv1 damage: 16
夜の鉛筆 Lv1 cooldown: 0.9s
夜の鉛筆 projectile speed: 340

XP: xpToNext(level) = 6 + (level - 1) * 4
欠片吸引範囲: 95px
欠片吸引速度: 280px/s
必殺技チャージ: 60s
必殺技UI: 右上の丸アイコン / ゲージ表示
操作: 画面のどこでもドラッグ移動 / スティック表示なし
```

## 判断基準

```txt
最初の敵撃破: 10秒以内
初回Lv2到達: 45〜60秒以内
移動: 指の置き場を意識しなくていい
欠片回収: 面倒ではない
通常敵: 固いと感じない
攻撃: 遅いと感じない
初回クリア率: 0〜30% でもよいが、3回やって全く無理ならまだ硬い
```

---

# Logs

## 2026-06-14 フルMVP初回実装

### 何を実装したか

- フルMVPを実装（武器5・パッシブ5・敵6・8分ウェーブ・3択レベルアップ・記憶カプセル・進化2・必殺技・リザルト）。
- XPカーブは暫定 `xpToNext(level) = 8 + (level-1)*5`。
- 進化後武器の効果値（未完成の一行 / 北極星のランタン）は仮設定。

### 観測

- 開始・敵出現・自動攻撃・被弾・移動・ゲームオーバー・リザルトは動作確認済み。
- 自動操作で敵群へ突っ込み続けると約14秒で力尽きた。
- 実機プレイ前のため、難易度・手触りは未確定。

---

## 2026-06-14 実プレイ3回フィードバック → Playtest Patch 1

### 観測（人間プレイ）

```txt
3回プレイした。
必殺技は右上に丸いアイコンでゲージの溜まりも分かるようにしたい。
操作しにくい。どこでも動けるようにして、コントロール表示は不要。
敵が硬い。
気持ちよくない。
攻撃も遅い。
全然クリアできない。
```

### 判断

- 右半分タップ必殺は、移動入力と概念が衝突している。
- 左半分スティックは、スマホ縦画面だと指の置き場を強制しすぎている。
- MVP初回として敵HPが高く、夜の鉛筆のDPSも低い。
- クリア不能そのものより、「倒している気持ちよさ」が出ていないのが最優先問題。

### 何を変えたか

```txt
操作:
- 移動を画面のどこでもドラッグ可能に変更
- スティック表示を削除
- 必殺技を右半分タップから右上丸アイコンへ移動

UI:
- 右上に丸い必殺技アイコンを追加
- 円形ゲージでチャージ率を表示
- READY時は OK / TAP 表示

プレイヤー:
- HP 100 → 110
- moveSpeed 100 → 115
- 無敵 0.6s → 0.75s
- 回復 20 → 28

欠片:
- collectRadius 18 → 22
- magnetRange 70 → 95
- magnetSpeed 200 → 280

必殺技:
- chargeSeconds 90 → 60

敵:
- 全体的にHPと接触ダメージを下げた
- 黒ラベルの影 HP 280 → 210

武器:
- 夜の鉛筆 Lv1 damage 12 → 16
- 夜の鉛筆 cooldown 1.25s → 0.9s
- 夜の鉛筆 projectile speed 260 → 340
- 他武器も初期火力・回転率を上方修正

XP:
- xpToNext 8 + (level-1)*5 → 6 + (level-1)*4
- 武器強化が出やすいよう normal weight を weapon_upgrade 寄りへ調整
```

### 次に見ること

```txt
1. 右上アイコンが押しやすいか
2. どこでも移動が誤操作を減らすか
3. firstKillSec が10秒以内か
4. Lv2 が45〜60秒以内か
5. 通常敵が固く感じないか
6. 攻撃が遅く感じないか
7. 3分エリートを倒せる可能性が出たか
8. 8分クリアはまだ難しくても、もう一回やりたいか
```

---

## 実機/実プレイ確認チェックリスト

`pnpm dev` を実機ブラウザ（または実マウス/タッチ）で開いて確認する。`?debug=true` で経過秒/Lv/敵数を表示。

### A. 操作・UI

- [ ] 画面のどこでもドラッグ移動できる
- [ ] スティック表示がなくても操作方向が分かる
- [ ] 右上の必殺技アイコンが見やすい
- [ ] 必殺技ゲージの溜まりが分かる
- [ ] アイコンタップでだけ必殺技が発動する
- [ ] レベルアップ/カプセル画面中に必殺技が暴発しない

### B. 手触り・視認性

- [ ] 敵のシルエットで種類が見分けられる（紙くず / 標識 / カプセル / もや / ラベル）
- [ ] 夜のもや（6:00頃〜）が被弾後も半透明のままで、濃い影に変わらない
- [ ] 撃破の煙・被弾シェイク・必殺技フラッシュ・命中ポップが気持ちよく、過剰でない
- [ ] 欠片の吸引・取得が気持ちいい
- [ ] 通常敵が固すぎない
- [ ] 攻撃が遅すぎない

### C. バランス受け入れ

- [ ] 最初の敵撃破 ≤ 10秒
- [ ] 初回Lv2到達 ≤ 60秒
- [ ] 初回被弾が早すぎない（≤10秒で来ない）
- [ ] 3分Lv5〜7 / 5分Lv8〜11 / 8分Lv18〜24
- [ ] 初カプセル 3:00±15秒、以降5:00・7:00
- [ ] 8分クリア率: 初回0〜30% / 数回後40〜70%
- [ ] 終盤（7:00〜）に重さ・操作不能がない

---

## プレイログ様式（固定）

ゲーム終了時（クリア/ゲームオーバー）に、ブラウザのコンソールへ次の1行JSONを出力する（`[vamp-pon playlog] {...}`）。リザルト画面にも主要な計測値を表示する。
このJSONをコピーし、`device` / `goodPoints` / `painPoints` を埋めて下記に追記する。

固定フィールド:

```txt
device          端末/ブラウザ（人が記入）
runId           プレイ識別子（自動）
survivedSec     生存秒
cleared         8分到達でクリアか
firstKillSec    最初の撃破
level2Sec       Lv2到達
firstDamageSec  初被弾
firstCapsuleSec 初カプセル取得
elite3mKilled   3分エリート撃破（170〜300秒窓）
elite5mKilled   5分エリート撃破（300〜420秒窓）
elite7mKilled   7分エリート撃破（420〜600秒窓）
finalLevel      到達Lv
kills           撃破数
pickedWeapons   最終所持武器ID
pickedPassives  最終所持パッシブID
evolvedWeapons  進化した武器ID
goodPoints      良かった点（人が記入）
painPoints      気になった点（人が記入）
```

### エリート撃破の判定窓（docs と code を統一）

エリート（黒ラベルの影）spawn は **180 / 300 / 420 秒**。撃破時刻を次の窓 `[start, end)` で分類する。

```txt
3分エリート: 170〜300秒
5分エリート: 300〜420秒
7分エリート: 420〜600秒
```

実装は `src/game/domain/playLog.ts` の `ELITE_WINDOWS` を正とする（この表と一致）。

### プレイログ記録欄

1プレイ = JSON1行 + 人間記入（goodPoints / painPoints）。

```txt
■ Run 1
device:
playlog:
goodPoints:
painPoints:

■ Run 2
device:
playlog:
goodPoints:
painPoints:

■ Run 3
device:
playlog:
goodPoints:
painPoints:
```

---

## 序盤（0:00〜3:00）調整ガイド

最初の1分で離脱させないための調整表。**指標がズレたら、対応する数値だけを小さく動かす**。
一度に複数を変えない（原因が分からなくなる）。

| 指標 | 目標 | ズレ時にいじる数値 | 場所 |
|---|---|---|---|
| firstKillSec | ≤10秒 | `ink_shadow.hp` を下げる / `night_pencil` L1 `damage`↑・`cooldown`↓ | `src/game/data/enemies.ts` / `src/game/data/weapons.ts` |
| level2Sec | ≤60秒 | `xpToNext(1)` を下げる / `ink_shadow.xpDrop`↑ / 0–60秒の `spawnRatePerSecond`↑ | `src/game/domain/balance.ts` / `enemies.ts` / `src/game/data/waves.ts` |
| firstDamageSec | >10秒 | 序盤 `spawnRatePerSecond`/`maxAlive`↓ / `ink_shadow.moveSpeed`↓ / `SPAWN.minPlayerDist`↑ | `waves.ts` / `enemies.ts` / `src/game/domain/constants.ts` |
| 3分時点Lv | 5〜7 | `xpToNext` カーブ / 60–180秒の敵密度 | `balance.ts` / `waves.ts` |
| 3分エリート撃破 | 可能性あり | `black_label_shadow.hp`↓ / 武器火力↑ | `enemies.ts` / `weapons.ts` |
| 同時敵数 | 5〜18体（序盤） | 各 wave の `maxAlive` | `waves.ts` |

目指す感覚:

```txt
ぼけぇっと遊んでも気持ちいい。でも雑に突っ込むと少し痛い。
```
