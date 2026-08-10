# ヨルノシルベ Enemy48 Encounter Synergy Source v1

## Status / Authority

- Scope: **Current Enemy48** × **Series1 Stage20**
- Machine source: `src/game/data/enemyEncounterSynergySource.ts`
- Authority: **CONTENT_SOURCE_ONLY**
- Enemy49体目をこのSourceから追加しない。
- Stage composition外の敵を勝手に出現させない。
- runtime waveへ自動反映しない。
- Bossを**完全status immune**にしない。

## 目的

Enemy48を「属性・状態異常が設定されている48個の単体データ」で終わらせない。

狙いは、

> **単体では弱い**敵でも、別の役割と同時に出ると危険になる

Encounter grammarを作ること。

これによりプレイヤーが、

- どちらを先にほどくか
- Status resistanceを積むか
- movement / Break / cleanseで順序を壊すか
- Characterを変えるか
- 好きなCharacterのままItem/Weaponを変えるか

を考えられるようにする。

## Source architecture

Pairingは新しいEnemy IDを手入力しない。

各Stageについて `series1StageCampaignContentSource.ts` の既存enemy compositionを読み、同じStage内の全pair候補を比較する。

scoreは主に:

- status interaction
- movement geometry
- rank差
- anchor / flank
- tracking / delayed pressure

から決める。

その後、scoreの高いpairを優先しながら**全Enemyを少なくとも一つのpairへ含めるedge-cover**を作る。

そのため、Enemy48やStage compositionが変わった時に「新しい敵だけ組み合わせ設計がない」状態をcheckerで検出できる。

## Pressure grammar

### SOAK + CHILL

濡れた場所へ冷えを重ね、いきなりFREEZEで停止させるのではなく段階的に移動余裕を削る。

player answer:
SOAK/CHILL resistance、cleanse、WIND route controlのどれかで順序を壊す。

### ROOTED + charger

**ROOTED + charger** は分かりやすい危険pair。

ただしROOTEDと突進を同フレームで成立させない。

`root cue → 回答窓 → charge cue`

の順で読み、ROOTED対策Item / WIND push / EARTH-METAL Breakで崩せるようにする。

### ROOTED + BURN

その場へ残るほどBURN時間圧が効く。

player answerは「火力で両方即死」だけにせず、ROOTED/BURN片方の短縮、trap、line weaponによる退路確保も成立させる。

### DROWSY + delayed / charger

DROWSYでtempoを鈍らせた後、時間差攻撃や接近圧をずらして重ねる。

入力遅延は起こさない。
敵側のcue timingだけでtempo pressureを作る。

### ECLIPSED / DISORIENTED + tracking pressure

**ECLIPSED**を画面暗転として使わない。

追尾精度・回復支援・認識補助へfrictionを置き、別角度からcharge/tracking敵を重ねる。

player answer:
attack cue / silhouette / residueを読み、WIND/BLANKでtrackingを崩すかheavy側をBreakする。

### MARKED + tracking

MARKED対象へ執着するほど別方向を見失うpressure。

player answer:
MARKED cleanseだけでなく、MARKEDをReactionへ消費する、追跡役をpriority targetにする等を用意する。

### ERASED + self-buff pressure

stack buildを薄めるEnemyと、時間経過でpressureを上げるEnemyを組ませる。

完全build deleteは禁止。
短cycle Reaction / BLANK cleanse / target priorityで戻せる。

### SEALED + anchor

特殊行動の回転を鈍らせるstatusと、重い空間圧を組み合わせる。

SEALEDでWeaponそのものを使用不能にはしない。

### lane cross

lane setter + charger / flank、または異なるlane geometryを重ねる。

一方向knockbackだけで永久に解けない構造にしない。

### anchor + flank

Medium/Elite/Bossへ視線を固定した横・斜めからsmall enemyを入れる。

物量だけを増やさず「見る方向が増える」ことで難しくする。

## Stage20 integration

Pairingは**Stage20**すべてに作る。

各Stage entryは:

- pair enemy IDs
- ranks
- defensive attributes
- inflicted Status
- pressure kind
- readable threat
- why together is dangerous
- **player answer**
- anti-frustration rule
- wave use

を持つ。

Enemyのattribute/statusをPair Sourceへコピー固定せず、既存 `enemyAttributeIdentitySource.ts` / `enemyStatusTraitSource.ts` から読む。

## Boss rule

Current Boss:

- 持ち主のない名前
- 閉じた朝箱
- 帰路のない夜

もpair pressureを持つ。

ただしBoss pairは:

- Bossの大技と相方の強いcueを同時開始しない
- FREEZE / SLEEP / ROOTED等はslow/delayへ変換
- 完全status immuneにしない
- 相方を無限補充しない
- 回復 / reposition可能な間を残す

ことを固定する。

Bossを「状態異常buildを捨てる試験」にしない。

## Anti-frustration

Pairingが強い理由は、操作不能時間の足し算ではなく**異なる読みを同時に要求すること**。

禁止:

- hard control二つの同時着弾
- full-screen darkness
- strobe
- cue色とsilhouetteを二体で完全に同じにする
- Boss + elite大技の同時開始
- unavoidable chain stun
- status immunityによるbuild無効化

通常waveでは、まず一方を単体で学習させてから二体目を遅らせる。

## Runtime boundary

このSourceはEncounter設計原本。

runtime実装時には別途:

1. spawn scheduler
2. wave budget
3. simultaneous enemy cap
4. device performance
5. telegraph duration
6. status buildup tuning
7. Boss add timing
8. human playtest

を通す。

CONTENT_SOURCE_ONLYから直接production waveへ自動昇格しない。
