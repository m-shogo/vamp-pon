# 155. Audio Asset List

`src/game/audio/AudioManager.ts` が参照する音源の一覧。
キーが見つからない場合は AudioManager 側で `console.debug` を一度だけ出して
無音再生扱いになる（致命エラーにはしない）。
新しい音を足すときは下記を更新し、`public/assets/audio/` 配下に
同名で配置すること。

## 参照規約

- SE は `se_<SeKey>` の cache key で再生（例: `se_hit`）。
- BGM は `playBgm(key, …)` の引数で指定したキーをそのまま参照（例: `bgm_night_walk`）。
- 同じ SE が短時間に連発しないよう `MIN_INTERVAL_MS` で間引き済み。
  追加時は AudioManager の `MIN_INTERVAL_MS` の見直しが必要か検討する。

## SE（効果音）

| Cache key            | SeKey          | 想定用途                                   | 推奨音量目安 | 最小間隔(ms) |
| -------------------- | -------------- | ------------------------------------------ | ------------ | ------------ |
| `se_hit`             | `hit`          | 武器が敵に当たる、小さく軽い               | 0.4 前後     | 42           |
| `se_enemyDeath`      | `enemyDeath`   | 敵撃破、葉っぱが舞うような乾いた解放感     | 0.5 / 0.9 elite | 56        |
| `se_expCollect`      | `expCollect`   | 経験値ジェム取得、こぶし大の小気味良い拾い音 | 0.3        | 38           |
| `se_levelUp`         | `levelUp`      | Lv アップ、輝きの上昇音                    | 0.8          | -            |
| `se_evolution`       | `evolution`    | 武器進化/合体、ふくらむような上昇音        | 0.95         | -            |
| `se_heal`            | `heal`         | 回復取得、柔らかい鈴                       | 0.7          | -            |
| `se_playerDamage`    | `playerDamage` | 被弾、紙が裂けるような短い衝撃             | 0.82         | 140          |
| `se_select`          | `select`       | UIメニュー選択、紙質のクリック             | 0.7          | -            |
| `se_reroll`          | `reroll`       | カード振り直し、ぱらっとめくる音           | 0.7          | -            |
| `se_ultimate`        | `ultimate`     | 必殺発動、長めの煌めき                     | 0.88         | -            |
| `se_blackMode`       | `blackMode`    | 黒耀化トリガー、低音と粒立ち               | 0.8          | -            |
| `se_bossWarning`     | `bossWarning`  | ボス予兆、警告音的に短く                   | 0.85         | 900          |
| `se_clear`           | `clear`        | クリア演出、温かな上昇                     | 0.95         | -            |

## BGM

| Cache key            | 想定用途                       | 備考                                |
| -------------------- | ------------------------------ | ----------------------------------- |
| `bgm_night_walk`     | 通常戦闘 / 序盤夜路            | ループ前提                          |
| `bgm_night_pressure` | 後半 5 分以降などの高密度帯    | テンポは大きく上げず厚みで圧を出す  |
| `bgm_elite_combat`   | エリート出現時の差し替え       | 短くループ、本体は変えない          |
| `bgm_clear`          | 朝が来た〜リザルト             | フェードアウト前提                  |

実装側で再生する位置は `MainScene` / `SpawnSystem` / `enemies.ts` を参照。
キー名はコードと表記を必ず一致させること。
