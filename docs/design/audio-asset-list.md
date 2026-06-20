# Audio Asset List

Vamp Pon の音素材は未配置でも落ちない。実素材を追加する場合は、Phaser preload で下記キーを `se_<key>` または `bgm_<name>` として登録する。

## SE

| Key | Length | 役割 | 音色メモ |
| --- | --- | --- | --- |
| `se_hit` | 0.04-0.08s | 通常ヒット | 紙を軽く叩く音 + 小さなインク粒。多発前提で短く薄くする。 |
| `se_enemyDeath` | 0.08-0.18s | 敵死亡 | 黒インクが弾け、紙片が散る音。連続killではrateを少し上げる。 |
| `se_expCollect` | 0.03-0.08s | EXP取得 | 小さな光を拾う音。pitch ladderで連続取得の中毒性を出す。 |
| `se_levelUp` | 0.5-1.0s | LvUp | ランタンの光が広がる報酬音。BGM duck対象。 |
| `se_evolution` | 0.8-1.4s | 進化 | 黒インクと朝焼けの光が混ざる特別音。BGM duck対象。 |
| `se_heal` | 0.1-0.25s | 回復 | 紙片が戻るような柔らかい音。 |
| `se_playerDamage` | 0.1-0.25s | 被弾 | 低く短い警告音。連打で耳が痛くならないよう抑える。 |
| `se_ultimate` | 0.5-1.2s | 必殺 | 横方向に光が流れる音。カットインより薄く、強さは低域で出す。 |
| `se_blackMode` | 0.5-1.2s | 黒耀化 | 黒炎が脈打つ音。操作感を邪魔しない余韻にする。 |
| `se_bossWarning` | 0.5-1.0s | 警告 | 遠くの鐘、紙のざわめき。短い緊張感。 |

## BGM

| Key | 役割 | 音色メモ |
| --- | --- | --- |
| `bgm_stage1` | Stage1通常 | 夜、記憶、絵本風ドット。ループ境界を自然にする。 |
| `bgm_boss` | ボス/終盤 | テンポを保ちつつ低域で圧を出す。 |
| `bgm_clear` | クリア | 朝焼け、ランタン、忘れ物を取り戻す余韻。 |

## Runtime Policy

- 多発SEは `AudioManager` の cooldown で間引く。
- EXPは `playExpCollect()` で pitch/rate ladder を使う。
- 敵死亡は `playEnemyDeath(comboCount, elite)` で連続killに合わせてrateを少し上げる。
- LvUp、進化、必殺、黒耀化は BGM duck 対象。
- 素材がない環境では Web Audio oscillator fallback を鳴らし、ゲーム進行は止めない。
