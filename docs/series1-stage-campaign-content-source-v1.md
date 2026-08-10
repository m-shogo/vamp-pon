# ヨルノシルベ1 Stage Campaign Content Source v1

## Status / Authority

- Scope: **Stage 1-20**
- Machine source: `src/game/data/series1StageCampaignContentSource.ts`
- Authority: **CONTENT_SOURCE_ONLY**
- Current runtimeをこの資料だけで置換しない。
- Current Enemy rosterは **Enemy48** のまま。新Enemy/Bossを人数合わせで追加しない。
- Future15をCurrentへ昇格しない。
- Candidate Weapon / Fusion / ItemをProduction Ready扱いしない。
- Main Mysteryの最終回答はLOCKしない。
- **Title1 Happy End** はこの20Stageだけで完結し、Series2/3を遊ばないと救われない構造にしない。

## 目的

Stageごとに「色と背景が違う」だけではなく、次を全部つなぐ。

`Story beat → Character / Star Beast → Enemy48 composition → Attribute / Status → Weapon → Fusion / Reaction / Item → Stage gimmick → Clear Getter → Night Record → Unlock → 次Stage`

特に、**好きなCharacter用代替攻略**を全Stageへ持たせる。
有利Characterを使えば楽になるが、不利Characterが出禁になるHard lockは作らない。

## Stage 1-20 progression

| # | Stage | 中心 | Combat軸 | Pressure | プレイ中の問い |
|---|---|---|---|---|---|
| 1 | 忘れられた夜道 | ユイ | LIGHT / MEMORY | ECLIPSED / MARKED | 拾う量より、間違えて奪わない |
| 2 | 名札の路地 | アサ | MEMORY / WIND | MARKED / 誤追尾 | 速く助けるか、本人を待つか |
| 3 | 月箱の書庫 | ナギ | ICE / BLANK | SEALED / safe-zone圧縮 | 何を開け、何を閉じたままにするか |
| 4 | 帰り道の交差点 | ミチル | STAR / WIND | DISORIENTED / route揺らぎ | 地図より何を目印にするか |
| 5 | 継火の修理工房 | トモリ | FIRE / METAL | BURN / 維持負荷 | 全部直すのでなく、どの灯を継ぐか |
| 6 | 白線の教室 | セン | EARTH / BLANK | DISORIENTED / lane | 正解線でなく今の安全線を引く |
| 7 | 半分の駄菓子横丁 | リツ | FIRE / BLOOM | MARKED / 分裂群れ | 一体集中かspreadか |
| 8 | 紙縒りの遊び場 | コヨリ | BLOOM / LIGHT | ROOTED / helper pressure | 守られる側が退路を作る |
| 9 | 古針の駅前 | ゲン | EARTH / STAR | DISORIENTED / heavy pressure | 速さより足場と遠い目印 |
| 10 | 押花の保管庫 | ハナ | BLOOM / WATER | ROOTED / 持続 | 保存と変化を同時に受け入れる |
| 11 | 未配達の郵便局 | ユウビ | WIND / LIGHT | DROWSY / delay | 今の敵より後着弾を読む |
| 12 | 窓際の紙翼 | マドカ | LIGHT / STAR | ILLUMINATED / 射線 | 観察を先制とcounterへ変える |
| 13 | 白栞の未分類棚 | シロ | BLANK / MEMORY | ERASED / stack崩し | 消すのでなく保留・再構築 |
| 14 | 片道ではない改札 | トバリ | EARTH / METAL | SEALED / boundary | 押し返すか通すか |
| 15 | 夢頁の水路 | ネム | DREAM / WATER | DROWSY / tempoずれ | 夢と現実を競わせない |
| 16 | 黒折り紙の屋根 | クロオリ / カナメ | LIGHT / WIND（DARK friction） | ECLIPSED / 追尾精度 | Shadow側の正しさを攻略にする |
| 17 | 消し跡の壁 | カスミ | MEMORY / BLANK（DARK friction） | ERASED / wall pressure | 残すことが必ず優しいか |
| 18 | 夜測りの屋上 | トキ | STAR / METAL | EXPOSED / angle | 測れるものと測れないものを併用 |
| 19 | 余白の部屋 | ツムギ | BLANK / MEMORY | SEALED / build変換 | 空白を埋めない選択 |
| 20 | 夜明け前の広場 | Core5 | LIGHT / DARK / MEMORY / STAR | 複合pressure | 二つ以上のReactionで朝へ進む |

## Stage差の作り方

各Stageは最低でも以下をmachine sourceへ持つ。

- Stage identity / Story beat / Star Beast意味
- Current Enemy48から導出したEnemy composition
- wave rule / 敵同士のpairing pressure
- favored / suppressed attribute
- hazard Status
- おすすめCurrent Character
- **好きなCharacter用代替攻略**
- Current/Candidate Base Weapon recommendation
- **Fusion / Reaction / Item** counterplay
- Stage gimmick
- Boss / Elite、または「新Bossを足さず既存Enemy組み合わせで山場を作る」という明示plan
- environmental VFX language
- Clear Getter
- **Night Record** entry
- content unlock
- 次Stage transition
- Series2/3 foreshadowing

表はoverviewであり、実際のstory/combat詳細はmachine sourceの各Stage entryが正本。

## Enemy composition policy

`series1StageCampaignContentSource.ts` はEnemy IDを新しく手打ちで増やさない。

1. `stageProductionDatabase.ts` の `enemyAffinity`
2. `enemyProductionDatabase.ts` 側の `stageAffinity`

をunionしてStageごとのcompositionを作る。

そのため、このStage Masterだけが勝手に49体目を作ることはできない。
Boss/Eliteが既存stage affinityにいないStageは、新Bossを捏造せず、Current48のpairing/waveでfinaleを作る。

例:

- ROOTED enemy + charger
- DROWSY enemy + delayed attacker
- ECLIPSED / tracking friction + charge pressure
- lane setter + diagonal attacker
- SOAK pressure + non-THUNDER route option

## Weapon / Fusion / Reaction / Item

Base Weaponは「属性色違い弾」ではなくattack shapeを変える。

Stage recommendationは:

- 現行Base Weapon
- Stage affinityを持つCandidate Base Weapon
- favored attributeとmechanically噛み合うCandidate

から導出する。

Fusion / Reaction / ItemはStageごとに明示するが、CandidateはすべてCONTENT_SOURCE_ONLYのまま。

特にStage16/17では中心Shadow Character自身の属性がStage frictionを受ける。
これは人物を不適正にするためではなく、**本人の価値観を本人の得意buildだけでは解けない**場面を作るため。
Item/Fusionで本人でもclear可能なrouteを必ず残す。

## Night Record / Clear Getter

Clear Getterは「強い装備を取った証明」だけにしない。

- 開けなかった銀鍵
- 貼らなかった名札
- 書かなかったカード
- 朝へ持っていかない紙片

のように、**何をしなかったか / 何を手放したか**も記録対象にする。

Night Recordは正解集ではない。
複数視点、未分類、記録の小さな不一致を残せる器にする。

## Foreshadowing boundary

Series3向けには、記録/現実、Star Beast、黒耀化、MEMORY/BLANK、夜明けの不一致を小さく置く。

ただし:

- 原因を確定しない
- 1/2のHappy Endを無効化しない
- 「実は全部嘘」へしない
- Star Beastをomniscient explanation deviceにしない

Stage20は『全部を元通りにしない朝』でTitle1を完結させる。
