# ヨルノシルベ Character 黒耀化 Rescue Book v1

Date: 2026-07-29  
Status: **CURRENT CHARACTER RESCUE DESIGN / EXACT EVENTS & NAMES NOT RUNTIME-LOCKED**

> 目的: Current21全員について、「黒耀化したら誰かが説教して元に戻す」を避け、本人が戻る選択をできるように仲間・Gameplay・星獣・Player操作がどう選択肢を増やすかを制作可能な単位へ落とす。
>
> 黒耀化は本人の一部であり、解除 = 悪人格の排除ではない。

関連:

- `docs/BLACK-YOUKA.md`
- `docs/RELATIONSHIPS.md`
- `docs/character-relationship-arc-book-v1.md`
- `docs/BOND.md`
- `docs/character-dialogue-relationship-book-v1.md`

---

# 0. Rescue共通ルール

```txt
本人の長所
↓
焦り / 恐怖で一方向へ極端化
↓
黒耀化
↓
圧倒的なpower spike
↓
仲間は「やめろ」と人格を否定しない
↓
別route / 別target / 待つ時間 / 任せる相手をGameplayで作る
↓
Playerがその選択肢を使う
↓
本人が自分で戻る
```

## 禁止

- 抱きしめれば解除
- 「本当のあなたはそんな人じゃない」
- 恋愛相手だけが救える
- 星獣が正解を教える
- 高Bondなら自動解除
- 黒耀化を二度と使わなくなることを成長扱い
- 1人の万能救済役が全員を治す

## 欲しい

- その人物の弱点と同じ軸で救出方法が変わる
- Primary anchorとSecondary anchorの役割が違う
- Support編成によって戻し方が少し変わる
- Player操作が必要
- 成長後は黒耀化の力の一部を安全に扱える

---

# 1. ユイ — 黒灯化

**Wrong arrival:** 全部呼び戻す。他人が「今は開けたくない」記憶まで強制回収する。

**Primary anchor: クロオリ**  
回収対象を破壊せず、一時的に折って保留slotへ逃がす。ユイの「全部失う」という恐怖へ、`捨てる / 取る`以外の第三選択 **預ける** を作る。

**Secondary anchor: アサ**  
対象本人の意思確認を先に行い、名前 / ownerが確定していないものをmarkしない。

**Player action:** 吸引範囲内の記憶片を `回収 / 保留 / 残す` の3種へ短時間で振り分ける。全部取るほど火力は上がるが煤返りが重くなる。

**Return moment:** ユイ自身が一つを拾わず、クロオリへ預ける。

**Safe mastery:** 成長後は指定対象だけを強く呼び戻す選択吸引。Allyが保留指定した対象を尊重できる。

---

# 2. アサ — 黒銘化

**Wrong arrival:** 全員へ名前 / 定義を刻み、本人が何者かを先に決める。

**Primary anchor: カスミ**  
名前を消さず、表示だけを霞ませる。`名無し`と`非公開`が違うことをGameplayで見せる。

**Secondary anchor: ユイ**  
「誰のもの？」を確認し、markのownerを決めつけない。

**Player action:** 黒銘markを敵へ使えば強いdebuff、Allyへ使う場合は本人側のconfirm windowを通す。confirmしない選択も有効。

**Return moment:** アサがmarkを一つ未確定のまま残す。

**Safe mastery:** 「名前を付ける」から「本人が選んだ呼び名を共有する」markへ。

---

# 3. ナギ — 黒箱化

**Wrong arrival:** 危険だけでなく選択肢 / 出口まで閉じる。

**Primary anchor: カナメ**  
閉じる準備中の時間を身体で稼ぐが、全部は受けない。ナギが「閉じる対象」を選ぶ時間を作る。

**Secondary anchor: トバリ**  
封鎖前に必ず帰路anchorを一本残す。

**Player action:** arenaを丸ごと閉じるのでなく、hazard nodeだけ選択seal。出口を残すほど火力bonusは下がるが復帰が安定する。

**Return moment:** ナギ自身が箱を一つ開ける。

**Safe mastery:** dangerous stateだけを短時間隔離し、終了時刻 / reopen条件を先に持つ。

---

# 4. ミチル — 黒針化

**Wrong arrival:** 正解routeを一本に固定し、寄り道 / 別解を危険扱いする。

**Primary anchor: トキ**  
一本の正解を保証するのでなく、複数routeの危険度を測る。

**Secondary anchor: ゲン**  
「昔は通れた道」という過去routeを提示し、現在の地図だけが全てではないと示す。

**Player action:** 一本のperfect routeをなぞれば大強化。ただし途中で別routeへswitchすると黒耀meterが安全側へ戻る。

**Return moment:** ミチルが自分で地図へ二本目の線を描く。

**Safe mastery:** route強化は維持するが、途中分岐 / dynamic rerouteを許す。

---

# 5. トモリ — 黒継化

**Wrong arrival:** 壊れたものを傷跡 / 変化まで消して「元通り」にする。

**Primary anchor: ツムギ**  
修理対象へ意図的な余白 / seamを残す。直せないのではなく、直さない部分を選ぶ。

**Secondary anchor: ユイ**  
受け継いだランタンの古い修理跡を大切にしていることで、「跡があるから壊れたまま」ではないと示す。

**Player action:** damaged object / weaponを完全restoreするか、scar bonusを残してrepairするか選ぶ。

**Return moment:** トモリが一つの傷を残す。

**Safe mastery:** repair時に`original / current`を選べる。傷跡をtraitへ変換できる。

---

# 6. セン — 黒線化

**Wrong arrival:** 全員へ正しい手順 / routeを強制する。

**Primary anchor: コヨリ**  
ルール外の動きを「間違い」ではなく遊びとして成立させる。

**Secondary anchor: シロ**  
未分類 / 未回答を残す場所を作る。

**Player action:** guide lineを外れると通常はbonus消失だが、黒耀中に意図的に外れるとalternate bonusが発生する。

**Return moment:** センが「次、どうする？」と他人へ問う。

**Safe mastery:** 正解線ではなく、危険を示す参考線。最後の選択はPlayerへ残す。

---

# 7. リツ — 黒片化

**Wrong arrival:** 分配をやめ、riskもdamageも全部自分が受ける。

**Primary anchor: コヨリ**  
助けられる側から実際に救援側へ回る。兄に「守られるだけではない」事実を突きつける。

**Secondary anchor: カナメ**  
同じ自己犠牲傾向を持つため、説得ではなく互いに「それをやると周りが困る」と鏡になる。

**Player action:** incoming damageを100%肩代わりするか、partyへ安全に分割するか選ぶ。分割成功でPair Traitが伸びる。

**Return moment:** リツがコヨリへ一つ任せる。

**Safe mastery:** shared guard / distributed risk。

---

# 8. コヨリ — 黒綴化

**Wrong arrival:** 大切な人を全員繋ぎ止め、離れる自由を奪う。

**Primary anchor: リツ**  
「離れても兄妹」を行動で証明する。距離を取って別routeを担当する。

**Secondary anchor: セン**  
「つながる = 同じruleに従う」ではない遊びを作る。

**Player action:** tether中は強い共有bonus。ただし自分で一本ずつ外し、離れたAllyへ別bonusを発生させる。

**Return moment:** コヨリ自身が結び目を一つほどく。

**Safe mastery:** voluntary tether。接続 / 切断を相手ごとに選択可能。

---

# 9. ゲン — 黒路化

**Wrong arrival:** 過去の正しかったrouteを現在へ上書きする。

**Primary anchor: ミチル**  
今の地図へ新しい線を描く。

**Secondary anchor: トキ**  
古いrouteが「当時は正しかった」ことも数値 / 痕跡で認め、過去を間違いにしない。

**Player action:** old routeは強力なbuff laneだが一部が現在の障害物と衝突する。Playerが旧線を残す区間 / 書き換える区間を選ぶ。

**Return moment:** ゲンが「今はこっちだ」と言える。

**Safe mastery:** historical route overlay。過去の利点だけを現在へ重ねる。

---

# 10. ハナ — 黒花化

**Wrong arrival:** 大切なものを変化ごと止め、保存する。

**Primary anchor: ツムギ**  
破れ / 変色を記録として残す。

**Secondary anchor: シロ**  
意味が不明でも保存できるが、状態を固定しなくてよい分類を作る。

**Player action:** pickup / buffをfreeze保存すると長持ちするが成長しない。Playerが一つを保存状態から解放し進化させる。

**Return moment:** ハナが押し花にする前の花を一輪、花瓶へ置く。

**Safe mastery:** preservation slotは維持。ただしreleaseで別growthへ接続する。

---

# 11. ユウビ — 黒封化

**Wrong arrival:** 「預かった = 今届けるべき」となり、拒否 / timingを無視する。

**Primary anchor: トバリ**  
門を閉じるのでなくdelivery windowを作る。

**Secondary anchor: カスミ / クロオリ**  
宛名を隠す / まだ開けない、という保留を正当な配送状態として示す。

**Player action:** projectile / heal / debuffを強制転送すると大出力。`hold`を選ぶと次windowで効果が強化される。

**Return moment:** ユウビが一通を鞄へ戻す。

**Safe mastery:** immediate / hold / return の3 delivery mode。

---

# 12. マドカ — 黒窓化

**Wrong arrival:** 全部見ようとして情報過多になり、動けなくなる。

**Primary anchor: レン**  
「全部」から差分だけを抜く。

**Secondary anchor: ネム**  
確度の低い感覚情報も、確定事実と混ぜず別layerで提示する。

**Player action:** screen-wide telegraphを全部表示すると視認性が崩れる。重要warningをPlayerがpinすることで表示を減らす。

**Return moment:** マドカが一つだけ指して「これを伝える」と決める。

**Safe mastery:** priority forecast。全視認でなく重要情報の共有へ。

---

# 13. シロ — 黒頁化

**Wrong arrival:** 全てを分類し、未分類を許さない。

**Primary anchor: ツムギ**  
unfinished / blankを「まだ続く状態」として残す。

**Secondary anchor: セン / ハナ**  
仮説を置くが正答化しない / provenance不明でも保存する。

**Player action:** enemy / itemへ分類tagを貼ると強化。ただし`unknown` tagを残すほど別の探索bonusが出る。

**Return moment:** シロが一枚を未分類箱へ戻す。

**Safe mastery:** provisional classification。後からtag変更可能。

---

# 14. トバリ — 黒門化

**Wrong arrival:** 誰も出さなければ誰も帰れなくならない、と門を閉じる。

**Primary anchor: ユウビ**  
外へ出る理由を「届ける」という具体的行為へ戻す。

**Secondary anchor: ナギ**  
閉鎖にreopen条件を持たせる。

**Player action:** gateを閉じるとarena defenseは強烈になるが、出口meterも減る。Playerが一度門を開けてSupportを外へ通す必要がある。

**Return moment:** トバリ自身が門を開ける。

**Safe mastery:** one-way blockadeではなくcontrolled gate / return anchor。

---

# 15. ネム — 黒夢化

**Wrong arrival:** 夢の方が優しいから、誰も起こさない。

**Primary anchor: トキ**  
夢を否定せず、現実側の時刻 / body stateを測り続ける。

**Secondary anchor: マドカ**  
夢で見えたものを「嘘」と捨てず、現実へ持ち帰る一点を選ぶ。

**Player action:** dream fieldは強力なslow / safety zone。長く留まるとwake routeが消える。Playerが夢から一つだけclueを持って退出する。

**Return moment:** ネムが自分から目を開け、夢の続きを紙へ描く。

**Safe mastery:** short dream overlay。現実を置換せず、一時情報として重ねる。

---

# 16. クロオリ — 黒折化

**Wrong arrival:** 開かなければ壊れない、と永遠に閉じる。

**Primary anchor: ユイ**  
「全部開ける」側だった人物が、逆に`いつ開く？`と本人へ確認する。

**Secondary anchor: ユウビ**  
保留にはrecipient / trigger / reconsideration pointが必要だと示す。

**Player action:** dangerous objectをfoldして無効化できるが、無期限foldはrewardも消す。Playerがreopen条件を設定する。

**Return moment:** クロオリ自身が一つの折り目をほどく。

**Safe mastery:** timed seal / owner-confirmed seal。

---

# 17. カナメ — 黒影化

**Wrong arrival:** 全damage / riskを自分だけが受ける。

**Primary anchor: ナギ**  
hazard自体をsealし、カナメが受けなくてよい攻撃を減らす。

**Secondary anchor: リツ**  
同じ自己犠牲を互いに鏡として見せる。

**Player action:** intercept連打で無敵に近い防御ができるが自己崩壊meterが上がる。Ally guardへ受け渡す必要がある。

**Return moment:** カナメが「次、お前」と任せる。

**Safe mastery:** rotating guard / shared intercept。

---

# 18. カスミ — 黒霞化

**Wrong arrival:** 守るため、名前だけでなく存在の痕跡まで消す。

**Primary anchor: アサ**  
本人が名乗る権利を守る。

**Secondary anchor: ユウビ**  
宛先を隠してもdelivery自体は成立できると示す。

**Player action:** concealでtargetから完全に外せるが、長く隠すほどAlly supportも届かなくなる。Playerが`private / visible`を切替える。

**Return moment:** カスミが一つだけ本人の許可を取って名前を残す。

**Safe mastery:** selective privacy。visibilityを本人 / party / publicで分ける。

---

# 19. トキ — 黒刻化

**Wrong arrival:** 全てを最適値へ固定し、測れない可能性を排除する。

**Primary anchor: ミチル**  
測定後にもroute変更を許す。

**Secondary anchor: ネム / レン**  
測れない感覚情報 / 差があるだけの情報を、異常と決めない。

**Player action:** perfect timing windowでは大強化。わざとwindow外を選ぶと未知routeを発見でき、黒耀固定値が崩れる。

**Return moment:** トキが測定結果へ「暫定」と書く。

**Safe mastery:** adaptive measurement。値を更新できる。

---

# 20. ツムギ — 黒糸化

**Wrong arrival:** 終わらせたら失うから、何も完了させない。

**Primary anchor: トモリ**  
修理完了という「終わり」を置く。ただし傷跡は残せる。

**Secondary anchor: シロ / ハナ**  
未完と保存を分ける。残すことは永久に途中にすることではない。

**Player action:** unfinished stackを保持するほど成長余地が増えるが、finishしないと実効果にならない。Playerが一つを完成させる。

**Return moment:** ツムギが最後の一針を刺す。

**Safe mastery:** intentional open slot。完成品と余白を同時に持てる。

---

# 21. レン — 黒硝化

**Wrong arrival:** 一つの差へ集中し、全体 / 人間関係まで捨てる。

**Primary anchor: マドカ**  
見つけた差が「伝える価値のある差か」を選ぶ。

**Secondary anchor: トキ**  
差の大きさを測るが、意味までは自動決定しない。

**Player action:** single weakpoint focusで極端な火力。別targetへ一度視線を移すことでparty weakpoint windowへ変換する。

**Return moment:** レンがレンズを外し、全体を見る。

**Safe mastery:** delta detectionをparty共有し、差 = 異常 と扱わない。

---

# 22. Rescue role distribution

一人の万能救済役を作らないため、主な役割を分散する。

| Rescue role | Character examples |
| --- | --- |
| 保留という第三選択を作る | クロオリ / カスミ / シロ |
| 帰路 / 再開条件を残す | トバリ / ナギ / ユウビ |
| riskを一人から分ける | カナメ / リツ |
| 別routeを作る | ミチル / ゲン |
| 値 / 差 /確度を分ける | トキ / レン / マドカ |
| 完成と余白を両立 | トモリ / ツムギ / ハナ |
| ruleの外を許す | セン / コヨリ |
| 夢 / 感覚を現実へ持ち帰る | ネム / マドカ |
| owner / 本人確認へ戻す | ユイ / アサ / カスミ |

---

# 23. Main Story / Optional boundary

Current21全員にRescue構造を持たせるが、ヨルノシルベ1のMain Storyで21人全員の完全黒耀化episodeを連続実施しない。

```txt
Main Story:
Core5 + クロオリを中心に数本を大きく見せる

Major rotating:
カナメ / カスミ / トキ / ツムギ / リツ / コヨリ / ネム
→ shorter story / character run / high-Bond event

Supporting / Optional:
セン / ゲン / ハナ / ユウビ / マドカ / シロ / トバリ / レン
→ 灯し手の記録 / special run / Clear Getter / later chapter
```

これは重要度ではなく**1作目の情報密度管理**。

---

# 24. 一文

> **仲間は黒耀化した本人を“本来の姿へ戻す”のではない。本人の長所を否定せず、極端な一択しか見えなくなった場所へ二つ目・三つ目の選択肢を作り、最後は本人が選ぶ。**
