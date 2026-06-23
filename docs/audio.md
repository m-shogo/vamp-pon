# Audio設計

実音源がない環境でもゲームを止めず、短いWeb Audio fallbackで主要イベントを補う。実ファイルは `public/assets/audio/audio-manifest.json` の `assets` に登録されたものだけをpreloadする。`optionalKeys` は仕様上の受け口であり、loaderへ渡さない。

## Key一覧

| Category | Keys | 主な使用箇所 | 推奨音量 | 実ファイル |
| --- | --- | --- | --- | --- |
| BGM | `bgm_top`, `bgm_stage1`, `bgm_stage2`, `bgm_result`, `bgm_growth` | TOP、Stage選択、Stage1/2、Result、成長 | 0.30–0.36 | なし（optional） |
| UI | `ui_select`, `ui_confirm`, `ui_cancel`, `ui_open`, `ui_close` | TOP、Stage選択、overlayボタン | 0.34–0.48 | なし（optional） |
| Combat | `hit`, `enemy_death`, `enemy_death_elite`, `player_damage`, `heal_pickup`, `exp_pickup`, `capsule_open` | 戦闘、pickup、カプセル | 0.24–0.70 | なし（fallback） |
| Reward | `levelup`, `choice_select`, `evolution`, `stage_unlock`, `result_count`, `currency_gain` | レベルアップ、選択、進化、Result | 0.30–0.62 | なし（fallback） |
| Boss | `boss_warning`, `boss_hit`, `boss_defeat` | 黒ラベル影の接近、強打、撃破 | 0.48–0.72 | なし（fallback） |
| Berserk | `berserk_ready`, `berserk_start`, `berserk_end` | 黒耀の準備、開始、終了 | 0.48–0.68 | なし（fallback） |
| Ultimate | `ultimate_ready`, `ultimate_fire`, `ultimate_cut_in` | 必殺準備、発動、カットイン | 0.50–0.78 | なし（fallback） |
| Result | `result_clear`, `result_defeat` | clear/defeat遷移 | 0.50–0.58 | なし（fallback） |

推奨音量は各イベントのローカル音量で、さらに保存済みのmaster/SE/BGM音量が掛かる。初期値はmaster 0.82、BGM 0.42、SE 0.74。BGM実効値を低く保ち、報酬・ボス・必殺時はduckする。

## 再生とfallback方針

- 初回pointer inputまではSEを捨て、BGMは最後の1件だけを待機する。入力後にAudioContextをresumeする。
- `hit` 55ms、`enemy_death` 80ms、`exp_pickup` 55ms、`player_damage` 160msを基本cooldownとする。
- elite/boss/必殺はpriority付きで、直前の低優先度SEより優先する。
- 未ロードkeyは1keyにつき一度だけdebug通知し、可能なら短いoscillator fallbackを鳴らす。throwしない。
- BGMは共有managerで現在keyを追跡し、同一keyを二重再生しない。Result音源がなければStage BGMを小さくfadeする。
- mute、master、BGM、SE音量は `vampPon.audio.v1` に保存する。localStorageが使えなくても進行を止めない。

## 実音源の追加手順

1. 商用利用可能であることを一次情報で確認する。
2. 音源を `public/assets/audio/` に置く。短いSEはOGGを優先し、BGMは容量とloop境界を確認する。
3. この文書へ作者、出典URL、ライセンス名、取得日、改変内容を追記する。
4. manifestの `assets` に `{ "key": "hit", "url": "/assets/audio/hit.ogg" }` を追加し、同じkeyを `optionalKeys` から外す。
5. manifest内URLが実在し、keyとURLが重複しないことをテストで確認する。
6. 390×844で初回タップ、mute、retry、Stage1/2、Result、console、network 404を確認する。

## 禁止事項

- ライセンス不明、有料素材の無断追加、出典記録なしの音源追加。
- normalize不足の爆音や、控えめな初期音量を飛び越す設定。
- 存在しないURLをmanifestの `assets` に書いて404を発生させること。
- `hit`、敵撃破、EXP取得をcooldownなしで無制限に鳴らすこと。
- 非対称なSceneごとのBGMを重ね、遷移時に二重再生させること。

## ライセンス記録

PR44では実音源ファイルを追加していないため、記録対象なし。
