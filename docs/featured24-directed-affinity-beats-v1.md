# Current24 Featured Relationship — Directed Affinity Beats v1

Date: 2026-08-11  
Status: **CURRENT CONTENT DIRECTION / EXACT SCENE + NUMERIC TUNING NOT FROZEN**

## Purpose

Current21全210pairはBond/Affinityを持てるが、重要な24関係は「数値が上がるだけ」で終わらせない。

各Featured relationへ3段階を持たせる。

```txt
FRICTION
→ RECOGNITION
→ CHOSEN_TRUST
```

24 relations × 3 beats = **72 authored Affinity beats**。

## 1. FRICTION

一方向だけのAffinityが揺れる。

典型:

```txt
A→B DOWN
B→A はその場では変えない
```

重要なのは、共有Bondを消さないこと。

長く一緒にいた二人でも:

- 腹が立つ
- 失望する
- 警戒が戻る
- 相手の守り方を嫌う

ことはある。

```txt
shared history remains
current feeling can worsen
```

という分離を使う。

## 2. RECOGNITION

別方向の人物が相手の新しい一面を見て、一方向だけUPする。

FRICTIONで下がった側を即元通りにする必要はない。

これにより:

```txt
A→B = DOWN
B→A = UP
```

のようなズレを物語として使える。

## 3. CHOSEN_TRUST

終盤は二人が「昔の相手」ではなく、変わった現在の相手との関係を選び直す。

両方向を明示するが:

```txt
UP / UP
```

だけにしない。

例:

- `UP / UNCHANGED`
- `UNCHANGED / UP`

も使う。

### なぜUNCHANGEDを使うか

兄妹愛、長年の信頼、寡黙な敬意などを:

> クライマックスだから数値をさらに上げる

へ変換しないため。

「感情量」ではなく「関係の形」が成熟する場合がある。

## Representative arcs

### ユイ × アサ

- FRICTION: アサ→ユイ DOWN — 確認が足止めに見える
- RECOGNITION: アサ→ユイ UP — ユイが本人へ選択を返す
- CHOSEN_TRUST: UP / UP — 違う速度のまま一緒に行く

### ユイ × クロオリ

- ユイ→クロオリ DOWN — 理由のない「預かる」を拒む
- クロオリ→ユイ UP — ユイも「今は開けない」を選べると知る
- 最後はユイ側UP、クロオリ側UNCHANGED — 急に親密キャラへ変えない

### リツ × コヨリ

- コヨリ→リツ DOWN — 過保護が「自分には無理」と扱われたように感じる
- リツ→コヨリ UP — コヨリが他人を救う姿を見る
- 最後はリツ→コヨリ UNCHANGED / コヨリ→リツ UP

兄妹愛を「さらに好き」の無限ゲージにはしない。
呼称も「お兄ちゃん」を維持できる。

### アサ × カスミ

- アサ→カスミ DOWN — 本人を守るためでも名を隠すことへ反発
- カスミ→アサ UP — アサが本人の沈黙を待つ
- 最後はアサ側UP / カスミ側UNCHANGED

カスミが終盤だけ急に開放的になるのを避ける。

### ゲン × トキ

- トキ→ゲン DOWN — anecdoteをdataとして扱えない
- ゲン→トキ UP — 昔話を笑わず測定対象にする
- CHOSEN_TRUST UP / UP — 経験と測定を上下関係にしない

## 24 relationship coverage

対象は現在の`currentRelationshipInventory`全24本。

- 12 detailed machine arcs
- 12 Current hub coverage arcs

Reserveレンを含む関係もContent上は持つが、runtime選択可否を勝手に昇格しない。

## Placement rule

現段階は:

- `EARLY_FLEX`
- `MID_FLEX`
- `LATE_FLEX`

だけを固定。

Exact Stage / exact incidentはまだ凍結しない。

理由:

- Stage20 campaignとscene pacingを後から合わせる
- 3人partyの選択自由度を潰さない
- 「特定キャラを編成しないとMain Storyが成立しない」を避ける

必要ならHub scene / Result / Night Record / Stage pre/post beatへ分散できる。

## Gameplay echo

各beatはstoryだけでなくgameplay echoを持つ。

例:

- Guardを二人とも重ねて失敗 → Guard relayへ変化
- 即配達と門のtimingが衝突 → hold deliveryへ変化
- Dreamとmeasurementが衝突 → uncertain labelを残す
- repairとarchiveが衝突 → before/after双方を保持

ただしContent echoであり、runtime effect実装済みを意味しない。

## Romance boundary

72beatすべてで:

```txt
romanceInferred = false
```

Affinity UPは恋愛ではない。

恋愛、片想い、家族、師弟、友情、ライバル等のrelation typeは別authorityで明示する。

## Numeric boundary

UP/DOWN/UNCHANGEDの方向だけをContentとして持つ。

具体的な:

- +5
- -10
- threshold
- recovery cap

等はまだ固定しない。

`numericDeltaFrozen = false`

## Runtime boundary

未実装:

- authored Affinity event save/replay
- numeric deltas
- Stage placement resolver
- scene seen ledger
- party composition fallback
- voice/subtitle variants
- UI relationship graph updates

Content Sourceだけでruntime readyとは扱わない。
