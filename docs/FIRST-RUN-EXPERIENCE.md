# ヨルノシルベ First Run Experience

Date: 2026-07-29  
Status: **CURRENT FIRST-SESSION DIRECTION / EXACT TIMINGS REQUIRE PLAYTEST**

> 目的: 初回起動から「もう1回」までを一本の体験として設計する。説明を読ませるTutorialではなく、触る→分かる→選ぶ→失敗/成功→次の目的が見える流れを作る。

Related:
- `docs/game-core-book-v1.md`
- `docs/COMBAT-RUN-DESIGN.md`
- `docs/MOBILE-CONTROL-EXPERIENCE.md`
- `docs/PROGRESSION-ARCHIVE.md`
- `docs/GAMEPLAY-META-PROGRESSION.md`

---

# 1. First-session promise

初回プレイヤーが短時間で理解する順番:

```txt
1. 動ける
2. 攻撃は自動
3. 敵を倒すとfragmentが出る
4. fragmentを拾うとLevel Upする
5. Level Upでbuildを選ぶ
6. 強くなる
7. 朝まで残る / 負ける
8. run外でも少し進んだ
9. 次に試すものがある
```

最初から理解させない:
- 黒耀化の世界設定
- 全Support system
- Bond
- 全rarity
- 全slot rule
- 夜の正体
- Collection taxonomy

---

# 2. TOP

初回TOPはPrimary actionを一つ明確にする。

Priority:

```txt
夜へ行く
```

Secondary:
- 灯録
- 設定

初回から全機能を強調しない。
未解放項目が多い場合も「大量の鍵マーク」を並べない。

---

# 3. Stage Select

初回はStage1を視線上最優先。

表示したい:
- Stage名
- 短い一文
- 推奨/選択Character
- Start

表示しすぎない:
- 詳細enemy table
- Story長文
- 全Clear Getter条件
- 複雑な推奨build

初回のStageSelectは**選択の自由を見せつつ迷わせない**。

---

# 4. Battle first 15 seconds

Playerへ求める最初の操作は移動だけ。

## Sequence

```txt
Spawn
→ 1〜2秒以内に敵が見える
→ auto attack fires
→ enemyほどける
→ fragment drops
→ playerが動く
→ fragment magnet / pickup
```

必要なら初回だけ短い操作hint:

> **指を置いて、そのまま動かす**

またはvisual gesture。

避ける:
- modal tutorial
- 「次へ」連打
- attack button tutorial
- 5項目同時説明

Playerが動いたらhintは消える。

---

# 5. First kill / pickup

最初のkillは「自分で攻撃ボタンを押していないのに倒した」と理解できる必要がある。

First fragment:
- 敵から出る
- 少し跳ねる
- Player側へ寄る
- lanternが微pulse

初回だけ短い語を出してもよい:

> 記憶片

説明文は不要。

---

# 6. First LevelUp

初LevelUpはFirst Sessionの最重要reward。

初回3choiceは、可能なら違いが見た目/文面で分かる組み合わせにする。

例:
- 攻撃範囲
- 攻撃頻度
- pickup / utility

3つ全部が「攻撃力+5%」にならない。

First LevelUp UIだけ短い補助:

> **ひとつ選ぶ**

Card説明は短く、専門語を避ける。

選択後、battleへすぐ戻る。

---

# 7. First visible growth

初回は数字より**見た目・頻度・範囲の変化**で強化を理解させる。

良い:
- projectile数が増える
- 範囲が広がる
- cooldownが体感で短い
- fragmentが寄りやすい

弱い:
- 見えない+2%だけ

最初のrunには最低1回、

> 「明らかに最初より強い」

と感じる瞬間を作る。

---

# 8. First danger

初回から完全無双だけにはしない。

中盤までに一度:
- 囲まれる
- routeを変える
- Supportが救う
- defensive choiceが効く

など「移動が必要」なpressureを見せる。

ただしStage1初回は**クリア可能性を高くする**。

---

# 9. Evolution introduction

First SessionでEvolutionへ届いた場合:
- 大きなrewardとして見せる
- 長文system説明は後回し

初回表示:

```txt
進化
[before] → [after]
```

程度でよい。

届かなかった場合も失敗扱いにしない。
Resultや星図で:

> 「この組み合わせ、まだ先がある」

程度のseedを見せられる。

---

# 10. 黒耀化 introduction

初回runで必須にしない。

解放/到達した場合:
- 強い
- 危険
- 終了後に反動

の3点だけ体験で分かればよい。

Loreは後。

初回から「黒耀化しないと負ける」pressureは避ける。

---

# 11. First defeat

初敗北でやること:

```txt
Defeat
→ 何分まで行ったか
→ 得たもの
→ 1〜3個の新しい進捗
→ Retry / Growth
```

避ける:
- 取得物ゼロ
- 全進捗没収
- 長い敗北演出
- Story閲覧強制

重要:

> **負けても「次のrunならここを変える」が一つ見える。**

例:
- 新しい灯具を試せる
- 永続強化1点
- enemy図鑑が増えた
- 星図条件が途中まで進んだ

---

# 12. First Clear

Clear後は報酬を一度に20個見せない。

Priority:

1. 朝へ届いた
2. reward
3. unlock
4. 夜明け星図が灯る
5. 次に狙えそうな条件

Storyは短いDawn beatでよい。

初Clearでplayerへ残したい考え:

> **次は別のやり方でも行けそう。**

---

# 13. First 夜明け星図

First Session終了時、盤面を見せる理由はCollectionではなくnext-run motivation。

初回は自然に複数点灯してよい。

例:
- Stage1へ入った
- 初LevelUp
- 初Support assist
- 初Clear / first dawn
- 初Evolution（達成していれば）

未達成条件は近いものだけ数個見せる。

避ける:
- 100個の空欄を最初から圧として見せる
- loreを読まないと条件が分からない

---

# 14. First Growth

初永続強化は「数字を買う作業」より:

- pickup comfort
- reroll / choice幅
- small survivability
- build access

などを優先候補にする。

Playerが:

> 強化したからもう一回試したい

となること。

---

# 15. Second-run hook

First Sessionの最終目的はTutorial完了ではない。

> **2run目を始めること。**

2run目のhookは最低1つ:
- 新Character
- 新Support
- 新灯具
- 別Stage condition
- Evolution hint
- 黒耀化なし条件
- 星図の近い未達成

同時に全部出さない。

---

# 16. Accessibility baseline

初回説明は:
- tiny textだけに頼らない
- colorだけでrare/危険を区別しない
- animationを見逃しても進行可能
- reduced motionでも意味が残る
- touch targetを小さくしない
- Story音声/SEがなくても遊べる

VoiceOver等の正式Current contractは別Accessibility trackと同期する。

---

# 17. First-session observational metrics

測る:
- TOP→StageSelectまで
- StageSelect滞在時間
- battle開始→first movement
- first kill
- first pickup
- first LevelUp
- first damage
- first death/clear
- First Result滞在
- 星図を開いたか
- Growthを使ったか
- 2run目開始

数値thresholdはまだLOCKしない。

Human observation:
- 何をすればいいか迷った場所
- 読まなかった文章
- 押そうとして押せなかった場所
- 「おっ」と反応した瞬間
- 退屈した瞬間

---

# 18. Runtime boundary

この文書は体験設計。
既存runtimeを自動変更しない。

実装時:

```txt
Current flow audit
→ minimum hint implementation
→ simulator
→ physical device
→ first-time player test
→ friction fix
```

Story / tutorialを増やす前に、操作とgameplayで理解できるか確認する。

---

# 19. 一文

> **最初の10分で世界を理解させるのではなく、最初の10秒で動け、最初の数十秒で強くなり、最初の1runが終わる頃には「次は違うbuildでやりたい」と思わせる。**