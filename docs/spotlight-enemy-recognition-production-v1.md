# ヨルノシルベ Spotlight Enemy Recognition Production v1

Date: 2026-08-11  
Status: **RECOGNITION GUIDE / NOT FINAL ART**

## 目的

Spotlight8を「設定を読めば分かる敵」ではなく、スマホ画面で一瞬見ても:

- あいつだ
- また来た
- 今あの癖をやった
- 前と同じだけど少し意味が違う

と分かる敵へ育てる。

Machine source:

`src/game/data/spotlightEnemyRecognitionSource.ts`

重要:

- Enemy48の`silhouette / palette / attackCue`を上書きしない
- Enemy49を作らない
- final art承認ではない
- 他作品の人気敵の外見・技・台詞・紋章を移植しない
- 人気の理由は「反復して覚えられる個性」として取り込む

## Recognition rule

各Spotlight Enemyへ最低限:

1. signature gesture
2. entrance ritual
3. idle ritual
4. attack anticipation delta
5. defeat gesture
6. recurrence rule
7. collection pose
8. sound texture
9. humanizing beat without absolution
10. mobile recognition rule
11. accessibility rule
12. forbidden shortcut

を持たせる。

単に色を変えて覚えさせない。

```txt
silhouette
+ motion
+ prop
+ timing
+ sound
```

のうち最低2〜3個で識別できるようにする。

## Spotlight8

### 持ち主のない名前

Signature:
**大量の名札を揃えるのに、一枚だけ列から外す。**

- entrance: 床の札を一直線へ並べ、一枚だけ外す
- idle: 札の角を揃え続ける
- attack: MARKED前に札の面が同じ方向へ揃う
- defeat: 一枚の空欄だけ残す
- sound: 乾いた紙の接触音

「敵なのに一度だけ誤った札を自分で剥がす」がhumanizing beat。
仲間化の合図にはしない。

### 閉じた朝箱

Signature:
**閉じる直前の一拍。**

- entrance: 半開きから始まる
- idle: 鍵が閉じかけて戻る
- attack: 蓋の影が狭まる
- defeat: 全開にせず、銀鍵だけ外れる

「全部開けば勝ち」にしない。
中身をvisualで暴露しない。

### 帰路のない夜

Signature:
**攻撃前に、消すrouteを静かに選ぶ。**

- 怒鳴らない
- 咆哮を主signatureにしない
- routeへ向く → 一拍 → 線が変わる
- defeatでは一本だけ線を残す

Overwhelming Forceを派手な爆発量ではなく、静かな確実さで作る。

### オンブロ 黒折

Signature:
**姿が変わっても一本だけ同じ折り目。**

- entrance: 平紙から2〜3折り
- idle: 開きかけて戻す
- attack: 攻撃方向の折角だけ先に開く
- defeat: 平紙へ戻り折線だけ残る

再登場する度に形を変えてもよいがrecognition anchorは失わない。

### オンブロ 余白枠

Signature:
**中央に何も描かない。**

- 顔を足さない
- 目を足さない
- glitch文字を足さない
- idleは外周だけ動く
- attackは余白が狭くなる
- defeat直前だけ一本線が出て、文字になる前に消える

情報を増やして人気を作るのではなく、空白を守ることで個性にする。

### オンブロ 継ぎ目

Signature:
**playerより壊れた物を先に見る。**

- entrance後、まず壊れたpropを直す
- idleも周囲の亀裂へ反応
- attack lineは始点を先に固定
- defeatは結び目だけ残る

可哀想な縫いぐるみ風へ寄せない。
「勝手に直す善意の侵害」をmotionにする。

### オンブロ 夢波

Signature:
**危険になるほど静かになる。**

通常ゲームの「強敵ほど速く激しく」の逆。

- entrance: 波紋が先、本体が後
- idle: 長周期
- DROWSY前: 波紋間隔が広がる
- defeat: 朝露一滴へまとまる

画面blur / input delay / 暗転で眠気を表現しない。

### オンブロ 名札

Signature:
**間違いを剥がさず上から貼る。**

Spotlight8の中で意図的にPetty Rival枠。
全員を重い悲劇のカリスマ敵へしない。

- entrance: 一枚貼る → 間違いに気づく → 二枚目を上貼り
- idle: 札の端を気にする
- attack: 札束をめくる
- defeat: 厚い札束だけ残る
- recurrence: 次回は札が一枚増えていてよい

少し笑えるが、MARKED pressureは本物。

## Popularity design balance

8体を全部同じ「かっこいい悲しい悪役」にしない。

```txt
3 Iconic Boss
4 Recurring Elite
1 Petty Rival
```

で温度を変える。

- 圧倒的
- 悲しい鏡
- 不気味
- 静か
- 面倒だけど好き
- ちょっと笑える

が同じEnemy rosterに共存する方が、推し敵が分散する。

## Mobile / accessibility

色だけで敵を見分けさせない。

各敵は小画面でも:

- shape
- direction
- gesture
- prop
- motion timing

の組み合わせで読ませる。

禁止:

- strobe
- full-screen flash
- full-screen darkness
- attack cueの色だけ依存
- 細かい可読文字をspriteへ描く
- 生成画像の細部だけを識別記号にする

## Production boundary

この資料は**final artではない**。

既存Enemy48の:

- silhouette
- palette
- attackCue

をbase authorityとして参照する。

次は:

1. Spotlight8それぞれの既存design recordとrecognition guideを照合
2. 180px prototype referenceでgesture test
3. native target sizeで1x readability確認
4. dark combat background test
5. animation timing review
6. Aseprite hand-final candidate
7. runtime behavior evidence

の順。

生成referenceをそのままproduction spriteへしない。
