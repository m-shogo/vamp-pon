# ヨルノシルベ Gameplay / Meta Progression Hub

Date: 2026-07-28  
Status: **CURRENT GAMEPLAY-FIRST DESIGN ENTRYPOINT**

> Main Gameはヴァンサバ系の戦闘・build・周回。  
> 人物情報・世界情報・レポートは遊んだ結果として増える副次報酬。

---

# 1. Main loop

```txt
戦う
↓
Level Upしてbuildを作る
↓
強敵 / Stage / 条件へ挑む
↓
失敗しても小さく前進する
↓
夜明け星図 / 記憶のしるしが灯る
↓
永続強化 / 新装備 / 新Support / 新しい組み合わせが増える
↓
また戦いたくなる
```

**情報を読むために戦わせない。**
戦闘自体が面白く、その副作用としてキャラや世界が分かっていく。

---

# 2. Reward hierarchy

## Primary reward — Gameplay

- 永続強化
- Personal Trait
- Support Trait
- Pair Trait
- Assist拡張
- 灯合わせ
- 新しい灯具 / 持ち物 / 忘れ物
- 灯継ぎ / 暁開きの選択肢
- reroll / choice拡張
- pickup / retry comfort
- route / stage option
- cosmetic / BGM

## Secondary reward — Information

- 日常profile
- 呼び方 / 敬語変化
- Character Mystery fragment
- 黒耀化記録
- 星獣記録
- 敵の生態 / 背景
- 忘れ物の持ち主
- 世界の観測記録
- sequel seed

**文章だけを主要報酬にしない。**

---

# 3. 読む / 読まないを両立する

## 読まないplayer

リザルトで:

- Parameter up
- Trait unlocked
- New option
- New achievement

が分かればよい。

「なんか強くなった、ラッキー」で次のrunへ行ける。

## 読むplayer

灯録へ寄って:

- キャラの生活
- 人物関係
- Main Mystery report
- 黒耀化の理由
- 敵や小物の裏
- 過去の同一事件を別視点で読む

ところまで掘れる。

**未読 / 既読をGameplay強化条件にしない。**

任意閲覧なので、情報量は豊富でよい。

---

# 4. Bond / Support

詳細: `docs/BOND.md`

```txt
Supportと一緒に戦う
↓
Bondが育つ
↓
戦闘連携が強くなる
↓
またその組み合わせを使いたくなる
```

Gameplay payoff:

- Assist改善
- Personal / Support / Pair Trait
- stable / unstable pair gameplay
- 灯合わせ
- rescue / guard / revival interaction

Secondary payoff:

- 呼び方
- 敬語
- 掛け声
- 日常会
- 人物情報

Bondは恋愛メーターではない。

---

# 5. 夜明け星図 — Clear Checker型の達成盤

詳細: `docs/PROGRESSION-ARCHIVE.md`

旧クリアチェッカー / 夜明け盤のCurrent representation。

```txt
1つの記憶のしるしが灯る
↓
隣の星が見える
↓
次の試したい遊び方が分かる
↓
またrunへ行く
```

Prototype balance guide:

- 自然達成 ~50%
- 少し狙う ~30%
- やり込み ~15%
- 秘密 ~5%

固定比率ではなく、普通に遊んでも複数灯る感覚を守るための目安。

条件例:

- 特定characterで夜明け
- 特定Support
- 特定灯具を育てる
- 黒耀化なし
- 特定灯合わせ
- 被弾制限
- 時間条件
- hidden build

報酬は強制感が出ない強さにする。

---

# 6. 灯録 — 情報の受け皿

```txt
灯録
├ 夜明け星図
├ カゲモノ図鑑
├ 忘れ物絵札
├ 灯し手の記録
├ 言葉の記録
└ 夜の観測記録
```

灯録を埋めるためにbattleを作業化しない。

**遊んだ結果、気づけば増えている。**

---

# 7. Optional report structure

`夜の観測記録` は、Main Mysteryを深く読む人向けのoptional report working label。

```txt
Main Story only
→ 1作目の話は理解できる

+ 夜の観測記録
→ 世界の「なぜ？」が増える

+ Character Bond / Mystery
→ 個人視点が増える

+ 全部読む
→ 別々の伏線が接続して見える
```

Kingdom HeartsのAnsem Reportのような「本筋外で世界解像度を上げる構造」を参考にするが、形式 / 内容は独自にする。

100% report回収をHappy End条件にしない。

---

# 8. Fail-forward

詳細: `docs/PROGRESSION-ARCHIVE.md`

**1run失敗 = 無駄**にはしない。

Game Overは死亡ではなく:

> その夜の読み方では朝まで残れなかった。

と扱う。

失敗でも一部は残る候補:

- small permanent currency
- route hint
- enemy observation
- item trace
- relation progress
- retry comfort
- optional record

ただしfailure farmingを最適解にしない。

Clearは大きい。
Failureは小さく学ぶ。

---

# 9. Permanent growth philosophy

旧fail-forward設計から有効なfamilyを保存する。

## 灯りの手入れ

starter / lantern系comfort。

## 地図 / 夜路理解

route hint / next goal / reading support。

## 記憶の扱い

pickup / fragment comfort。

## 影の観察

enemy knowledge / small studied-enemy advantage。

## Retry comfort

reroll / revive / early pickup grace。

raw damageを際限なく積むより:

- build幅
- convenience
- information advantage
- route variation

を厚くする。

---

# 10. 黒耀化との接続

詳細: `docs/BLACK-YOUKA.md`

黒耀化は:

- 強い
- キャラ固有
- risk / 煤返りあり
- 闇落ちではない

夜明け星図でも:

- 黒耀化を使う攻略
- 黒耀化なし攻略
- 特定character固有黒耀build

の両方を作れる。

「使わない方が正義」にはしない。

---

# 11. Result screen

戦闘中の長文を避ける。

本命はリザルト `旅の記録`。

例:

```txt
今回強くなった
- 旅支度 +1
- Pair Trait progress

夜明け星図
- 3つ灯った

新しい記録
- カゲモノ 1
- 灯し手 1
- 夜の観測記録 1
```

ここで本文を強制表示しない。

playerは:

- 次のrun
- 灯録を読む

を自由に選べる。

---

# 12. Story engineとの接続

詳細: `docs/STORY-ENGINE.md`

最有力Candidateでは、普通のヴァンサバ系mechanicに裏の意味を持たせられる。

例:

- EXP = 記憶片
- Level Up = その夜に扱える接続が増える
- Game Over = 読み筋失敗
- Retry = 別build / 別順で未確定夜を再読
- permanent unlock = 次の夜にも残る確定progress

**裏設定を知らなくてもGameplayは成立する。**

後で知ると「ずっとやっていた操作に意味があった」となるのが理想。

---

# 13. Anti-grind / anti-obligation

禁止:

- loreを読むためだけの反復周回
- Bond会話を見るため弱Stageを100回
- 全達成しないと基本buildが弱すぎる
- secretに必須機能
- daily login obligation
- 大量通貨
- failure farming
- unread notification guilt

狙う:

> **普通に遊ぶだけでも強くなる。好きになった人だけ、さらに奥まで読む。**

---

# 14. Current sources

通常は:

```txt
docs/CANON.md
↓
docs/GAMEPLAY-META-PROGRESSION.md
↓
必要なら
- docs/BOND.md
- docs/PROGRESSION-ARCHIVE.md
- docs/BLACK-YOUKA.md
- docs/STORY-ENGINE.md
```

旧clear checker / fail-forward / collection資料はmigration済み。
通常読まない。

一覧: `docs/legacy-design-migration-2026-07-28.md`

---

# 15. Not locked yet

- Support slot数
- Bond exact values
- achievement board exact size
- reward quantities
- permanent stat caps
- report count
- secret conditions
- stable / unstable exact RNG / variance

Core prototype / playtestを見て決める。
