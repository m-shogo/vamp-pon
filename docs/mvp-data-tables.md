# MVP Data Tables

Stage1 Web完成度向上とUnity移行のためのMVPデータ表。

目的は、今すぐ全量を作ることではなく、Stage1の遊びとUnity 30秒デモに必要な最小データを固定すること。

## Data Rules

- 内部IDは英小文字 / kebab-case / 安定名にする。
- 表示名は後から変更可能にする。
- Unity移行時はScriptableObjectへ変換できる構造にする。
- まずはStage1 Easyを基準にする。
- 数値は仮値。Web実装とテスト結果に合わせて調整する。

## Character Table

| id | 表示名 | 役割 | 初期武器 | HP | Speed | Pickup | 固定要素 | Unity優先度 |
|---|---|---|---|---:|---:|---:|---|---|
| yui | ユイ | 初期主人公 | north-star-lantern | 100 | 1.00 | 1.00 | 右手ランタン / 右肩から左腰バッグ紐 / 左腰バッグ | 必須 |
| asa | アサ | 2人目候補 | morning-thread | 95 | 1.08 | 1.00 | 朝の光 / 素早い補助型 | 後回し |
| nagi | ナギ | 遠距離候補 | quiet-paper-plane | 90 | 0.96 | 1.08 | 紙片 / 風 / 距離管理 | 後回し |
| michiru | ミチル | 範囲候補 | tide-ink-bottle | 110 | 0.92 | 0.95 | 水 / インク / 面制圧 | 後回し |
| tomori | トモリ | 防御候補 | ember-lamp-post | 115 | 0.90 | 1.00 | 灯り / 守り / 安定 | 後回し |

## Enemy Table

| id | 表示名 | 種別 | HP | Speed | Touch | EXP | Spawn帯 | 見た目 | Unity優先度 |
|---|---|---|---:|---:|---:|---:|---|---|---|
| ombu-small | オンブ | 雑魚 | 10 | 0.92 | 8 | 1 | 0:00- | 腕なし / 短いインク芽 / 丸い影炎 | 必須 |
| ombu-small-fast | 速いオンブ | 雑魚 | 8 | 1.18 | 7 | 1 | 1:30- | 小さめ / 後方モヤ長め | Web優先 |
| ombu-small-tough | 重いオンブ | 雑魚 | 22 | 0.72 | 10 | 2 | 2:30- | 濃い影 / 少し大きい | Web優先 |
| omburo-mid | オンブロ | 中ボス | 160 | 0.62 | 18 | 12 | 4:00- | 両腕太い / 影炎長い / 攻撃時腕伸長 | 必須 |
| ink-memory-boss-1 | 忘れ墨の塊 | Stage1ボス | 900 | 0.48 | 24 | 40 | Boss | 黒インクの塊 / 紙片を巻き込む | 後回し |

## Weapon Table

| id | 表示名 | 種別 | MaxLv | 役割 | 初期CD | 進化 / 合体 | Unity優先度 |
|---|---|---|---:|---|---:|---|---|
| north-star-lantern | 北極星のランタン | starter | 5 | 近中距離の安定光攻撃 | 1.15 | yui-kokuyou-lantern | 必須 |
| night-pencil | 夜の鉛筆 | weapon | 5 | 直線 / 斜めの紙線攻撃 | 1.00 | night-pencil-evolved | Web優先 |
| paper-plane | 紙飛行機 | weapon | 5 | 誘導 / 反射 / 視認しやすい弾 | 1.35 | paper-plane-evolved | Web優先 |
| black-ink-bottle | 黒インク小瓶 | weapon | 5 | 範囲継続 / 黒曜化と相性 | 1.80 | ink-lamp-ring | 必須 |
| lamp-post-ring | 街灯の輪 | weapon | 5 | 周回 / 接近拒否 | 1.50 | ink-lamp-ring | 必須 |
| ink-lamp-ring | 黒街灯の輪 | evolved | 1 | 黒インク範囲 + 暖色core | 1.20 | - | Unity演出優先 |

## Passive Table

| id | 表示名 | MaxLv | 効果 | 値 | 備考 |
|---|---|---:|---|---|---|
| warm-shoes | あたたかい靴 | 5 | MoveSpeed | +4% / Lv | 操作感改善に直結 |
| bigger-lantern | 大きなランタン芯 | 5 | PickupRange | +8% / Lv | EXP吸引の気持ちよさ |
| paper-armor | 紙の守り | 5 | MaxHP | +8 / Lv | 初心者救済 |
| quiet-clock | 静かな時計 | 5 | CooldownReduction | -4% / Lv | 爽快感 |
| memory-coin | 記憶の小銭 | 5 | RewardBonus | +5% / Lv | 成長導線 |

## Rare Item Table

| id | 表示名 | 役割 | 効果 | 注意 |
|---|---|---|---|---|
| dawn-ticket | 夜明けの切符 | 救済 | 一度だけHP30%で復帰 | 強すぎ注意 |
| cracked-map | ひび割れた地図 | 報酬 | クリア報酬+20% / 被タッチ値+10% | リスク報酬 |
| keeper-bell | 管理人の鈴 | 演出 | 中ボスクリア時に追加欠片 | Stage1向け |

## Evolution / Fusion Table

| id | 必要1 | 必要2 | 結果 | 発動条件 | 画面演出 |
|---|---|---|---|---|---|
| fusion-ink-lamp-ring | black-ink-bottle Lv5 | lamp-post-ring Lv5 | ink-lamp-ring | LevelUp報酬抽選 | 黒インクが輪になり、中心だけ暖色に残る |
| evolve-north-star-lantern | north-star-lantern Lv5 | yui affinity / story flag | yui-kokuyou-lantern | 黒曜化解放後 | カットイン + ランタンcore強調 |

## Stage Table

| id | 表示名 | Time | 背景 | 難易度 | 目的 | Unity優先度 |
|---|---|---:|---|---|---|---|
| stage-1-forgotten-street | 忘れ物の夜道 | 480 | night street / paper map | Easy / Normal / Hard | Stage1縦スラ完成 | 必須 |
| stage-2-quiet-canal | 静かな水路 | 600 | canal / ink reflection | Easy以降 | Stage2候補 | 後回し |
| stage-3-paper-tower | 紙片の塔 | 600 | paper tower / wind | Easy以降 | 縦移動感 | 後回し |
| stage-4-ink-park | 黒墨の公園 | 600 | park / swings / shadow | Easy以降 | 中盤 | 後回し |
| stage-5-dawn-gate | 夜明けの門 | 600 | dawn gate | Easy以降 | Chapter1締め | 後回し |

## Stage1 Wave Draft

| Time | 内容 | 狙い |
|---|---|---|
| 0:00-0:30 | ombu-small 少量 | 操作と攻撃確認 |
| 0:30-1:30 | ombu-small 増加 | 撃破テンポを作る |
| 1:30-2:30 | fast混在 | 移動を促す |
| 2:30-4:00 | tough混在 | 武器強化の意味を出す |
| 4:00 | omburo-mid | 中ボス演出確認 |
| 4:00-6:30 | small / fast / tough混在 | ビルド差を出す |
| 6:30-7:30 | 密度上昇 | 黒曜化 / Ultimateを使わせる |
| 7:30-8:00 | boss or clear rush | Resultへの締め |

## Permanent Growth Table

| id | 表示名 | MaxLv | 効果 | コスト方針 | 優先度 |
|---|---|---:|---|---|---|
| growth-hp | 小さな体力 | 10 | MaxHP +3% | 安い | 必須 |
| growth-damage | 灯りの強さ | 10 | Power +3% | 中 | 必須 |
| growth-pickup | 欠片を呼ぶ力 | 10 | Pickup +4% | 中 | 必須 |
| growth-reward | 記憶の手帳 | 10 | Reward +5% | 高 | Web優先 |
| growth-reroll | 選び直し | 3 | LevelUp reroll +1 | 高 | 後回し |

## Save Data Draft

```txt
version: 1
selectedCharacterId: yui
clearedStages: stage-1-forgotten-street:easy
currency.memoryFragments: 0
growthLevels.growth-hp: 0
growthLevels.growth-damage: 0
growthLevels.growth-pickup: 0
collectionSeenIds: []
achievementUnlockedIds: []
```

## Unity ScriptableObject Conversion Priority

1. CharacterDefinition: yui only.
2. WeaponDefinition: north-star-lantern / black-ink-bottle / lamp-post-ring / ink-lamp-ring.
3. EnemyDefinition: ombu-small / omburo-mid.
4. StageDefinition: stage-1-forgotten-street.
5. GrowthDefinition: hp / damage / pickup.

## Balance Notes

- Stage1 Easyは簡単でよい。
- 敵を硬くするより、数・速度・出現方向で難易度を上げる。
- Lv5まで寂しくしない。
- EXP吸引は序盤から気持ちよくする。
- 回復ドロップは吸い寄せ無効にして、拾う判断を残す。
- 進化後は性能だけでなく見た目・音・画面揺れで分からせる。

## Next Implementation Targets

1. Web版Stage1の敵HP / spawn / EXPテンポ調整。
2. LevelUpカードの可読性再確認。
3. Result → Growth導線の強化。
4. Weapon / Passive / RareのID整理。
5. Unity 30秒デモ用に必須データだけ抽出。