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

テンプレート:

```txt
docs/56-balance-log-template.md
```

---

# Current Baseline

## Prototype 1 初期想定値

```txt
インクの影 HP: 18
インクの影 moveSpeed: 55
インクの影 contactDamage: 8
インクの影 xpDrop: 1
夜の鉛筆 damage: 12
夜の鉛筆 cooldown: 1.25s
欠片吸引範囲: 70px
欠片取得範囲: 18px
初回Lv2目標: 60秒以内
```

## 判断基準

```txt
最初の敵撃破: 10秒以内
初回Lv2到達: 60秒以内
移動: 不快ではない
欠片回収: 面倒ではない
```

---

# Logs

## 2026-06-14 フルMVP初回実装

### 何を実装したか

- フルMVPを実装（武器5・パッシブ5・敵7・8分ウェーブ・3択レベルアップ・記憶カプセル・進化2・必殺技・リザルト）。
- XPカーブは暫定 `xpToNext(level) = 8 + (level-1)*5`（`src/game/domain/balance.ts`）。
- 進化後武器の効果値（未完成の一行 / 北極星のランタン）は仮設定（`src/game/data/weapons.ts`）。

### 観測（自動操作による粗い検証）

- 開始・敵出現・自動攻撃・被弾・移動・ゲームオーバー・リザルトは動作確認済み。
- 自動操作で敵群へ突っ込み続けると約14秒で力尽きた。接触ダメージ8 / 無敵0.6秒のため、群れに留まると約13ダメージ/秒。
- これは「逃げ続ける」プレイ前提なら想定内だが、初見プレイヤー向けに序盤接触ダメージ/初期スポーン圧を実機で要確認。

### 次に見ること

- 実機（スマホ縦持ち）で、初回Lv2到達が60秒以内か。
- 序盤（0:00-1:30）の被弾が理不尽でないか（初回被弾が10秒以内に来ないか）。
- 8分到達時の到達Lvが18〜24に収まるか（XPカーブ調整の要否）。
- 進化後武器の体感的な強さ（仮値の妥当性）。

---

## 実機/実プレイ確認チェックリスト（未実施）

> 状態: **未実施**。理由 — 自動検証に使うプレビュー環境への合成クリックが不安定で、
> エージェント側からは8分プレイを駆動できない。下記は**人が実プレイで埋める**項目。
> `pnpm dev` を実機ブラウザ（または実マウス/タッチ）で開いて確認する。`?debug=true` で経過秒/Lv/敵数を表示。

### A. 手触り・視認性（直近修正の確認）

- [ ] 敵のシルエットで種類が見分けられる（紙くず / 標識 / カプセル / もや / ラベル）
- [ ] 夜のもや（6:00頃〜）が被弾後も半透明のままで、濃い影に変わらない
- [ ] 撃破の煙・被弾シェイク・必殺技フラッシュ・命中ポップが気持ちよく、過剰でない
- [ ] レベルアップ/カプセル画面を右半分でタップしても、復帰直後に必殺技が暴発しない
- [ ] 欠片の吸引・取得が気持ちいい（吸引範囲が狭すぎない）

### B. バランス受け入れ（docs/82）

- [ ] 初回Lv2到達 ≤ 60秒
- [ ] 初回被弾が早すぎない（≤10秒で来ない）
- [ ] 3分Lv5〜7 / 5分Lv8〜11 / 8分Lv18〜24
- [ ] 初カプセル 3:00±15秒、以降5:00・7:00
- [ ] 8分クリア率: 初回0〜30% / 数回後40〜70%
- [ ] 終盤（7:00〜）に重さ・操作不能がない

### C. 記録

- 端末 / ブラウザ:
- 結果（生存時間・到達Lv・倒した影・進化有無）:
- ズレた指標と推定原因:
- 調整案:

---

## プレイログ様式（固定）

ゲーム終了時（クリア/ゲームオーバー）に、ブラウザのコンソールへ次の1行JSONを出力する
（`[vamp-pon playlog] {...}`）。リザルト画面にも主要な計測値を表示する。
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
elite3mKilled   3分エリート撃破（170〜300秒窓）※下記の判定窓を参照
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
3分エリート: 170〜300秒   ← 3:00 ちょうどのスポーン/撃破のブレ約10秒を許容（180秒より前に撃破は起きないため実害なし）
5分エリート: 300〜420秒
7分エリート: 420〜600秒
```

実装は `src/game/domain/playLog.ts` の `ELITE_WINDOWS` を正とする（この表と一致）。

### プレイログ記録欄（3プレイ分から）

1プレイ = JSON1行 + 人間記入（goodPoints / painPoints）。

```txt
■ Run 1
device:
playlog: { ここにコンソールの1行JSONを貼る }
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

> 状態: **未記録**（3プレイ分が埋まったら、次の「序盤調整ガイド」に従って調整する）。

---

## 序盤（0:00〜3:00）調整ガイド

最初の1分で離脱させないための調整表。**指標がズレたら、対応する数値だけを小さく動かす**。
一度に複数を変えない（原因が分からなくなる）。

| 指標 | 目標 | ズレ時にいじる数値 | 場所 |
|---|---|---|---|
| firstKillSec | ≤10秒 | `ink_shadow.hp`(18) を下げる / `night_pencil` L1 `damage`(12)↑・`cooldown`(1.25)↓ | `src/game/data/enemies.ts` / `src/game/data/weapons.ts` |
| level2Sec | ≤60秒 | `xpToNext(1)`(=8) を下げる / `ink_shadow.xpDrop`(1)↑ / 0–60秒の `spawnRatePerSecond`↑ | `src/game/domain/balance.ts` / `enemies.ts` / `src/game/data/waves.ts` |
| firstDamageSec | >10秒 | 序盤 `spawnRatePerSecond`/`maxAlive`↓ / `ink_shadow.moveSpeed`(55)↓ / `SPAWN.minPlayerDist`(120)↑ | `waves.ts` / `enemies.ts` / `src/game/domain/constants.ts` |
| 3分時点Lv | 5〜7 | `xpToNext` カーブ（`8 + (level-1)*5`） / 60–180秒の敵密度 | `balance.ts` / `waves.ts` |
| 3分エリート撃破 | 可能性あり | `black_label_shadow.hp`(280)↓ / 武器火力（`might`系パッシブ・武器damage） | `enemies.ts` / `weapons.ts` |
| 同時敵数 | 5〜18体（序盤） | 各 wave の `maxAlive` | `waves.ts` |

目指す感覚:

```txt
ぼけぇっと遊んでも気持ちいい。でも雑に突っ込むと少し痛い。
```

調整したら、何を・なぜ・どうなったかを下の Logs に1件ずつ残す（数値は一度に1つ）。
