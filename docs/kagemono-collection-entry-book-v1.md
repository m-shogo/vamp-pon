# ヨルノシルベ カゲモノ図鑑 Writing Book v1

Date: 2026-07-29  
Status: **CURRENT COLLECTION WRITING GUIDE / GAMEPLAY VALUES & UNIMPLEMENTED MECHANICS NOT CLAIMED**

> 目的: Current48を「敵一覧」から、遭遇するほど少しずつ読み方が変わるカゲモノ図鑑へ落とす。
>
> 図鑑は攻略に役立つが、読了をpower条件にしない。初回は戦闘情報、再遭遇で手掛かり、後からre-readingを足す。

Authority:

- identity: `src/game/data/enemyProductionDatabase.ts`
- semantic master: `docs/ENEMIES.md`
- encounter guide: `docs/enemy-encounter-relationship-pressure-v1.md`

---

# 0. Entry layers

```txt
A. Encounter note
   見た目 / 動き / 危険の読み

B. Released clue
   倒した後に残る小さな物 / 痕跡

C. Re-reading
   「最初にこう見えた」を少し反転する短文

D. Optional character observation
   特定Character / Pairでだけ増える一言
```

Aだけで攻略可能にする。
C / Dを読まなくてもMain Gameは成立する。

---

# 1–35 Small / Ombu

## 01. オンブ 墨

**Encounter note**  
最も基本的な小影。ゆっくり寄ってくる。群れの隙間から抜ける。

**Released clue**  
短い名前の端のような紙片。

**Re-reading**  
ただの黒い塊に見えた。ほどけると、最初から何かの端だった。

---

## 02. オンブ 青灰

**Encounter note**  
少しふらついて進む。直線だけを見て避けると進路が重なる。

**Released clue**  
水色の余白。

**Re-reading**  
濡れた記憶が乾かなかったのではなく、まだ水面の形を残していたのかもしれない。

---

## 03. オンブ 紫黒

**Encounter note**  
蛇行しながらやや速く寄る。顔前のモヤが濃くなる瞬間を警戒。

**Released clue**  
紫のにじみ。

**Re-reading**  
強い感情を全部「夜」と同じ色に読んでいた。

---

## 04. オンブ 紙片

**Encounter note**  
紙のように軽く寄る。紙端が動いた方向を先に見る。

**Released clue**  
折れた紙角。

**Re-reading**  
紙片が敵だったのではない。敵に見えるほど、意味が一つへ固まっていた。

---

## 05. オンブ 切符

**Encounter note**  
一直線に近い接近。切符穴の変化を見て横へ外す。

**Released clue**  
小さな切符穴。

**Re-reading**  
行き先が一つなのではなく、一つしか見えなくなっていた。

---

## 06. オンブ 名札

**Encounter note**  
一人を決めるとまっすぐ寄る。貼り付くような動きに注意。

**Released clue**  
名札の安全ピン。

**Re-reading**  
名前を返そうとしていたのか、名前を貼り付けようとしていたのか。

---

## 07. オンブ 白線

**Encounter note**  
線に沿うように曲がる。今いる位置より、次に線が伸びる方を見る。

**Released clue**  
チョーク粉。

**Re-reading**  
消された道ではなく、一本の線だけを道だと思っていた。

---

## 08. オンブ しおり

**Encounter note**  
ゆっくり回り込む。正面だけ追わず側面を空ける。

**Released clue**  
しおりの端。

**Re-reading**  
途中で閉じた頁は、終わった頁ではない。

---

## 09. オンブ 方位

**Encounter note**  
一度止まって向きを変える。頭上の針が止まった方向を確認。

**Released clue**  
小さな針。

**Re-reading**  
方角を知っていたのではなく、方角を一つに決めたがっていたように見える。

---

## 10. オンブ 押花

**Encounter note**  
遅いが密集しやすい。群れになる前に抜け道を作る。

**Released clue**  
薄い花脈。

**Re-reading**  
枯れたから残らないのではない。残す方法が一つではない。

---

## 11. オンブ 封筒

**Encounter note**  
遅れて追いつく。今遠い個体を無視しすぎない。

**Released clue**  
薄い消印。

**Re-reading**  
届かなかったものにも、届かなかった時間が残る。

---

## 12. オンブ 窓

**Encounter note**  
横へ滑る。横方向の進路を塞がれない位置を取る。

**Released clue**  
小さな窓の光。

**Re-reading**  
見ていただけだったのか。見ていたから残ったのか。

---

## 13. オンブ 消し跡

**Encounter note**  
近づくほど輪郭が薄くなる。見失ったら最後にいた位置へ突っ込まない。

**Released clue**  
白い消し粉。

**Re-reading**  
消えた跡は、「最初から無かった」証拠ではない。

---

## 14. オンブ 定規

**Encounter note**  
斜めの直線を作る。角度線が出たら線上から外れる。

**Released clue**  
割れた目盛り。

**Re-reading**  
正しい角度を測る道具が、正しい角度は一つだと思い込んでいた。

---

## 15. オンブ 余白

**Encounter note**  
ゆっくり膨らむ。中央の黒い抜けだけを見ず外周も確認。

**Released clue**  
白い余白。

**Re-reading**  
何もない場所ではない。まだ何も決めていない場所だった。

---

## 16. オンブ 鈴

**Encounter note**  
周囲の影が集まりやすい。鈴だけでなく寄ってくる敵の密度を見る。

**Released clue**  
小さな鈴音 / 鈴片。

**Re-reading**  
呼ぶ音は、帰る方向まで教えてくれるとは限らない。

---

## 17. オンブ 朝露

**Encounter note**  
遅く、短く止まる。光る瞬間をpickupと見間違えない。

**Released clue**  
透明なしずく。

**Re-reading**  
朝のものまで夜に沈んだのではない。夜の中にも朝の形が残っていた。

---

## 18. オンブ マッチ

**Encounter note**  
短く速く踏み込む。火花が散る前に横へずれる。

**Released clue**  
焦げた軸。

**Re-reading**  
火が消えたことと、火をつけなかったことは同じではない。

---

## 19. オンブ 鍵穴

**Encounter note**  
近づくと硬く見える。無理に正面から押し切らずtimingを見る。

**Released clue**  
鍵穴の光。

**Re-reading**  
閉じているから守られている、とは限らない。

---

## 20. オンブ 糸

**Encounter note**  
細い軌跡を残す。敵本体だけでなく通った線を見る。

**Released clue**  
ほつれ糸。

**Re-reading**  
継ぎ目は傷にも見えるし、直した証拠にも見える。

---

## 21. オンブ 消印

**Encounter note**  
一定間隔で止まる。停止後の次の動きへ備える。

**Released clue**  
薄い日付跡。

**Re-reading**  
印が押された日が、意味の終わった日とは限らない。

---

## 22. オンブ 地図ピン

**Encounter note**  
止まった後に短く突っ込む。床へ刺さる予兆から離れる。

**Released clue**  
外れたピン先。

**Re-reading**  
場所を示す針が、場所へ縛る針になっていた。

---

## 23. オンブ 片ボタン

**Encounter note**  
円を描くように近づく。中心へ引き込まれないよう外側を取る。

**Released clue**  
二つ穴のボタン。

**Re-reading**  
片方だけでは留まらない。でも、片方だけでも無意味ではない。

---

## 24. オンブ リボン

**Encounter note**  
左右に揺れながら寄る。結び目が締まる動きをattack cueとして見る。

**Released clue**  
結び目の端。

**Re-reading**  
ほどけたことは、結んだ時間が無かったことにはならない。

---

## 25. オンブ レンズ

**Encounter note**  
薄いモヤで見えにくい。輪郭より移動方向を追う。

**Released clue**  
欠けたレンズ。

**Re-reading**  
歪んで見えたものも、見た人にとっては確かに「見えたもの」だった。

---

## 26. オンブ 古写真

**Encounter note**  
画面端から滑る。白枠の位置で本体の進路を読む。

**Released clue**  
古写真の白枠。

**Re-reading**  
写っていないものまで、無かったことにしていた。

---

## 27. オンブ 白蛾

**Encounter note**  
灯りへふらつく。Playerへの最短距離だけで動かない。

**Released clue**  
白い羽粉。

**Re-reading**  
光へ寄ったから、燃えるために来たとは限らない。

---

## 28. オンブ 烏紙

**Encounter note**  
素早く斜めへ動く。折り目が開く方向を見て避ける。

**Released clue**  
折り目の白い芯。

**Re-reading**  
黒い紙は、隠すためだけに折られるのではない。

---

## 29. オンブ 黒兎

**Encounter note**  
小さく跳ねる。耳影が伸びた先から離れる。

**Released clue**  
耳型の小さな余白。

**Re-reading**  
跳ねた先が正解なのではない。そこへ行ったから道になっただけかもしれない。

---

## 30. オンブ 狼火

**Encounter note**  
速めに距離を詰める。影が尖る直前に間合いを外す。

**Released clue**  
小さな隠し火。

**Re-reading**  
守るために近づくことと、近づきすぎることは違う。

---

## 31. オンブ 蝙蝠

**Encounter note**  
ジグザグに動く。現在位置より次の斜め角度を見る。

**Released clue**  
斜めの線。

**Re-reading**  
夜の角度だけが正しいのではなく、夜だから見えた角度だった。

---

## 32. オンブ ヤモリ

**Encounter note**  
低く壁沿いへ動く。中央だけでなく外周も確認。

**Released clue**  
細い足跡。

**Re-reading**  
残った跡を追うほど、今いる場所を見失っていた。

---

## 33. オンブ 羊夢

**Encounter note**  
ふわふわ遅い。夢波の広がる方向へ先に逃げ道を作る。

**Released clue**  
眠り頁。

**Re-reading**  
夢なら何でも変えられる。だから、何を変えないかも選ばなければならない。

---

## 34. オンブ 犬切符

**Encounter note**  
しつこく追う。追跡され続けるなら直線で逃げず進路を変える。

**Released clue**  
切符の端。

**Re-reading**  
待つことと、同じ場所に留まり続けることは違う。

---

## 35. オンブ 古梟

**Encounter note**  
一拍遅れて向きを変える。古い針が光る方向を確認。

**Released clue**  
古い針の光。

**Re-reading**  
古い方角が間違いなのではない。今も同じだと思い込むと迷う。

---

# 36–45 Omburo / Elite

## 36. オンブロ 墨腕

**Encounter note**  
遅いが腕が届く。伸びる側が一度縮む予兆を見て反対へ回る。

**Released clue**  
太い黒い手跡。

**Re-reading**  
抱えたものを守っていたのか、離せなくなっていたのか。

---

## 37. オンブロ 名札

**Encounter note**  
一定距離で横へ回る。名札を前へ押し出す瞬間に正面を外す。

**Released clue**  
名札の安全ピン。

**Re-reading**  
貼られた名前は、本人が選んだ名前とは限らない。

---

## 38. オンブロ 月箱

**Encounter note**  
硬く遅い。蓋が開くattack cueと弱い瞬間を分けて見る。

**Released clue**  
銀の鍵傷。

**Re-reading**  
しまえば無かったことになるのではない。箱の中でも時間は残る。

---

## 39. オンブロ 迷針

**Encounter note**  
斜めへ割り込む。針が二方向へ割れたら最初の進路へ固執しない。

**Released clue**  
折れたコンパス針。

**Re-reading**  
針が壊れたのではなく、一つの方角だけでは足りなくなったようにも見える。

---

## 40. オンブロ 継ぎ目

**Encounter note**  
じわじわ近づく。腹の継ぎ目から落ちる黒いしずくと床を両方見る。

**Released clue**  
灯芯の糸。

**Re-reading**  
直した跡から夜が漏れていた。だからといって、直したことまで間違いではない。

---

## 41. オンブロ 改札

**Encounter note**  
横幅で通路を塞ぐ。腕が閉じる前の開いたlaneから移動する。

**Released clue**  
切符穴の列。

**Re-reading**  
通れない場所が「戻れ」の意味とは限らない。

---

## 42. オンブロ 黒板

**Encounter note**  
床へ直線を作る。白線が走ったlaneから外れる。

**Released clue**  
白線の端。

**Re-reading**  
消された答えが正解に見えたのではなく、答えが一つしかないように見えていた。

---

## 43. オンブロ 夢波

**Encounter note**  
ゆっくり揺れ、波紋を広げる。速さより波の周期を見る。

**Released clue**  
水面文字。

**Re-reading**  
夢の中で道を変えられても、戻った後まで同じ道とは限らない。

---

## 44. オンブロ 黒折

**Encounter note**  
斜め移動後に止まる。折り目が刃状に開く前の白い芯を見る。

**Released clue**  
折り目の白い芯。

**Re-reading**  
折ることは隠すことにも、守って持ち運ぶことにもなる。

---

## 45. オンブロ 余白枠

**Encounter note**  
中央が抜けたように見える。外周が変化する時に距離を取り直す。

**Released clue**  
金の外周線。

**Re-reading**  
空白を黒で埋めようとして、空白が持っていた余地まで消していた。

---

# 46–48 Great Shadow

## 46. 持ち主のない名前

**Encounter note**  
名札が増えるほど、表示だけを信用しない。同じ名前が付いても動き / silhouette / contextを確認する。

**Released clue**  
誰かのものだったかもしれない名札片。

**Re-reading**  
名前は残っていた。持ち主だけが分からなかった。名前が無意味なのではなく、名前だけでは足りなかった。

**Optional resonance**

アサ:

> 「名前は大事。だから、勝手に持ち主まで決めない。」

カスミ:

> 「見せないことと、無かったことにするのは違う。」

---

## 47. 閉じた朝箱

**Encounter note**  
安全に見える場所が少しずつ狭くなる。閉じた場所へ留まり続けず、開く瞬間を見て外へ出る。

**Released clue**  
小さな銀の鍵 / 朝色の隙間。

**Re-reading**  
朝を守ろうとして閉じたのかもしれない。閉じたままでは、朝そのものへ行けない。

**Optional resonance**

ナギ:

> 「閉じるなら、開ける時も決めないと。」

トバリ:

> 「出口がない安全は、帰る場所じゃない。」

---

## 48. 帰路のない夜

**Encounter note**  
一度安全だった道を覚える。ただし同じ道が次も安全とは限らない。地図線の更新を見る。

**Released clue**  
折れたコンパス針 / 複数へ分かれた細い地図線。

**Re-reading**  
帰り道が無かったのではない。一つの正しい帰り道を探し続けて、他の道が見えなくなっていた。

**Optional resonance**

ミチル:

> 「帰れる道、一個じゃなくていいよ。」

トキ:

> 「測り直す。前の答えは、前の時点では間違いではない。」

---

# 49. Writing boundaries

## やる

- 初遭遇は攻略優先
- repeated encounterで小さい世界情報を足す
- Character observationは本人のThemeを反映
- 同じ敵を別Characterが違って読める
- 文は短くする

## やらない

- 「実はこの敵は○○の死んだ家族」などを毎体へ付ける
- 攻略に必要な情報を詩だけで隠す
- 図鑑を読まないとdamageが通らない
- 全entryへ悲しい長文
- Bossが世界の真相を全部説明する
- design mechanicをruntime実装済みと書く

---

# 50. 一文

> **カゲモノ図鑑は敵の履歴書ではない。最初は“どう避ける敵か”を覚え、何度も戦ううちに“なぜその動きをするように見えるのか”という別の読み方が増える場所にする。**
