# ヨルノシルベ Relationship Bond → Speech Prototype v1

Date: 2026-08-11  
Status: **PROTOTYPE_TUNING_NOT_FINAL / CONTENT SUPPORT ONLY**

## 目的

既にCurrent化した「呼び方 / 喋り方の変化」を、実際にどの状態で選ぶかまで試せるcontractにする。

重要:

- **Bondは恋愛度ではない**
- 数字はprototypeであり最終balanceではない
- disagreement / rival関係をnegative affinity debtへしない
- 会話を読むこと自体をcombat power条件にしない
- 高Bondでも全員を呼び捨て / タメ口へしない
- `CRISIS` はBondの最終段階ではなく、信頼があっても一時的に本人の長所が狭くなるpresentation
- runtimeへ自動接続しない

Machine source:

- `src/game/data/relationshipBondSpeechPrototypeSource.ts`
- `src/game/data/relationshipSpeechProgressionSource.ts`
- `src/game/data/currentRelationshipInventory.ts`

## Prototype score bands

```txt
0      FIRST_READ
15     ALLY
35     TRUST
65     DEEP_TRUST
90     DAWN eligible
100    prototype cap
```

これらは**最終値ではない**。
Playtestで上げ下げする。

### Story gate

数字だけで重要な関係sceneを飛ばさない。

Detailed Machine Arcを持つrelationは:

```txt
Bond scoreだけ
  → TRUSTまで

CHOSEN_TRUST story gate + score
  → DEEP_TRUSTまで

DAWN_PROOF + score >= 90
  → DAWN presentation
```

Coverage-only relationは、具体事件がまだfreezeされていないためprototypeではscoreでDEEP_TRUSTまで試せる。
ただしDAWNはDawn proofを要求する。

これにより:

- Stage1を大量周回して重要Character Arcを飛ばす
- 会話を連打して最大Bondにする
- 高Bondだから自動で恋愛になる

を避ける。

## Prototype Bond events

| Event | Prototype | Guard |
|---|---:|---|
| 初めて二人で夜明け | +10 | relation一回 |
| 未経験Stageを二人で夜明け | +6 | relation × Stage一回 |
| Assist成功 | +1 | run内+3まで |
| Crisis rescue | +3 | run内+3まで |
| Pair objective | +8 | objective一回 |
| 同じStageの反復夜明け | +1 | run内+1 |
| Dialogueを読む | **+0** | 読むことをpower支払いにしない |

### なぜ負のBondを置かないか

ヨルノシルベでは:

- 思想対立
- ライバル
- Shadowとの不一致
- 口喧嘩

があっても「関係経験と相互理解」は深くなり得る。

そのためprototype Bondは:

```txt
好き / 嫌い
```

の一本軸ではなく:

```txt
一緒に過ごした経験
信頼
相手の次の行動を理解している度合い
```

を扱う。

嫌い合っていても高Bondはあり得る。
その場合は会話が甘くなるのではなく、**嫌味のまま連携が正確になる**方が正しい。

## 呼称の実例

### ユイ → アサ

```txt
FIRST_READ: アサちゃん
ALLY:       アサちゃん
TRUST:      アサ
DEEP_TRUST: アサ
CRISIS:     アサ
DAWN:       アサ
```

大事なのは呼び捨てそのものではなく:

```txt
「止まって」
↓
「どうしたい？」
↓
何も言わなくても半歩待つ
```

へ変わること。

### アサ → ユイ

最初から最後まで基本 `ユイ`。

呼称を変えない代わりに:

```txt
先に行く
↓
ついてきて
↓
一緒に行く
↓
半歩待つ
```

でBondを見せる。

### コヨリ → リツ

最大Bondでも `お兄ちゃん`。

兄妹関係を「親密になったから呼び捨て」へ変えない。
恋愛へ自動変換しない。

### ミチル → ゲン

最大Bondでも `ゲンさん`。

敬称が残っても対等な信頼は成立する。

## Crisis

Crisisはscoreを下げない。

例:

```txt
Bond 100
+ DAWN_PROOF
= DAWNの自然な話し方

同じ二人が危機へ入る
= CRISIS voice

危機を抜ける
= stored Bondは100のまま
```

人物が追い詰められた時に昔の癖へ戻ることと、積み上げた関係が消えることを分ける。

## Runtime boundary

このprototype resolverは、将来runtimeへ入れる時の意味contract。

まだやらない:

- save schemaへBond score追加
- production threshold lock
- run resultからscoreを永続加算
- voice asset自動切替
- localization final text
- romance route判定

runtime化するときは別PRで:

1. save migration
2. event ledger / duplicate guard
3. deterministic score calculation
4. story gate persistence
5. battle/result/support voice selection
6. localization fallback
7. playtest telemetry

を通す。

## Non-negotiable

- `PROTOTYPE_TUNING_NOT_FINAL`
- numeric values are not Canon balance
- READ_DIALOGUE = 0 Bond power
- Crisis != final Bond tier
- High Bond != romance
- High Bond != universal 呼び捨て
- detailed arcはstory gateを数字で飛ばさない
- runtime auto-promotion = false
