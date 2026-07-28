# ヨルノシルベ Story Hub

Date: 2026-07-28  
Status: **CURRENT STORY ENTRYPOINT**

> 物語、世界の謎、人物の謎、伏線、Happy End、続編について考える時は最初にここへ入る。  
> repo全体から古いscenario資料を探し直さない。

---

# 1. まずStory Book

**`docs/story-book-v1.md`**

Character Bookと同じレベルの人物理解用master。

ここを読むと:

- ヨルノシルベがどんな物語か
- 何をHappy Endとするか
- どう泣かせたいか
- Main Mystery / Character Mystery
- 夜 / Game Over / Retry
- 黒インクの強いCandidate
- Shadowの思想
- 日常伏線
- optional report
- 1で閉じるもの / 2へ残すもの
- open questions

まで一度に戻れる。

---

# 2. Story detail masters

Story Bookで足りない時だけ読む。

| Area | Current master |
| --- | --- |
| Gameplay ↔ Lore engine | `docs/STORY-ENGINE.md` |
| Happy End / tears / sequel | `docs/story-ending-sequel-architecture-v1.md` |
| Main Mystery vs Character Mystery | `docs/story-foreshadowing-payoff-map-v1.md` |
| Character | `docs/CHARACTERS.md` |
| Optional reports / archive | `docs/PROGRESSION-ARCHIVE.md` |
| Gameplay / meta | `docs/GAMEPLAY-META-PROGRESSION.md` |
| Ideas not yet fixed | `docs/idea-book-v1.md` |

---

# 3. Current story direction

- 世界は暗いが、人間の性格は明暗を揃えない
- 全員がその人らしいまま成長する群像劇
- Main Gameはヴァンサバ系の戦闘 / build / replay
- loreはプレイの副作用として増える
- Main MysteryとCharacter Mysteryは別レーン
- Character Mysteryを100%解かなくても本編は理解・clearできる
- 深掘るほど世界と人物がつながって見える
- 正史はHappy End
- Permanent deathを泣き装置の中心にしない
- Game Overは死亡ではない
- 日常の蓄積から感動を作る
- 1作の中心人物 / 中心感情は1作で救う
- series mysteryは違和感 / props / reportとして残せる
- sequelで1の意味が変わっても、1のHappy Endは無効化しない

---

# 4. Story information is optional

```txt
戦闘 / 達成
↓
Gameplay reward
+
Story / Character informationが自然に解放
```

読む人:

- 夜の観測記録
- Character Mystery
- 日常会
- 黒耀化記録
- 敵 / 忘れ物の背景

まで深く読める。

読まない人:

- 新しい強化 / build / character / Supportが開いたことだけ分かればよい
- Main Story / Happy Endへ到達できる

---

# 5. High-value Story Engine Candidate

旧設計から非常に整合の高い候補:

> 悲しい出来事は消えない。  
> ただ、その出来事についた「間違った意味」が黒インクで固定される。  
> ユイたちは出来事を消すのではなく、その固定をほどく。

これを採用すると:

- 黒インク = enemy / protection / stagnationの三面性
- 記憶片 = EXPであり、固定から剥がれた意味片
- Level Up = run内で扱える読み方が増える
- 朝 = runで得たものの一部を確定
- Game Over = その読み方では朝に届かなかった
- Retry = 未確定の夜を別buildで読む

という二重意味が作れる。

**まだMain Mysteryの最終正史ではない。**

---

# 6. Mystery lanes

## Character Mystery

人物の内側。

例:

- ユイとトモリの獅子座共有
- クロオリが守っているもの
- アサと名前の関係

## Main Mystery

世界の構造。

例:

- 夜とは何か
- 黒インクとは何か
- 星獣は何を知っているか
- 誰が仕組みを作ったか

## Series Mystery

1で答えなくてもよい一段上の問い。

1の感情決着を邪魔しない。

---

# 7. Sequel structure

強い構造:

```txt
1作 = local completion
シリーズ = meta mystery continues
```

謎を:

- **C級** — その作品で必ず回収
- **B級** — 後作で意味が変わるSeed
- **A級** — series全体の問い

に分けられる。

A級を残すためにC級を投げない。

---

# 8. Foreshadowing style

説明台詞より:

```txt
小物
↓
妙な敵 / 星獣の挙動
↓
Gameplayで実際に使う
↓
Bond / Result / 灯録で意味が少し変わる
↓
後から最初の場面を再解釈できる
```

良い小物は:

1. 初見の意味
2. 1作内で分かる意味
3. series後に再解釈される意味

を持てる。

ヤバタニエン的な「後から配置や行動の意味が変わる」気持ちよさは参考にするが、正史の救いは維持する。

---

# 9. Tears / daily life

泣きは死亡人数ではなく**普通だった時間の蓄積**から作る。

- 食事
- 呼び方
- 喧嘩
- 星獣
- 修理した椅子
- 手紙
- 寝坊
- 雨
- 何気ない約束

終盤でそれらを返す。

---

# 10. Sequel hook

1は必ず一度Happy Endで閉じる。

続編hookは露骨な「2へ続く」ではなく:

- 知らない折り目
- 見覚えのない綴じ糸
- 誰も知らない星獣の足跡
- 現実側にあるはずのない紙片

などの小さな違和感が向く。

2を遊んだ後、1の最後や小物を見ると意味が変わるのが理想。

---

# 11. Open questions

まだ決めない:

- 夜の正体が夢 / virtual / shared memoryのどれなのか
- 「間違った意味」Engineを最終真相にするか
- 誰が夜を作ったか
- なぜ夜が必要だったか
- 星獣の完全な仕組み
- ユイとトモリの獅子座共有の真相
- sequel protagonist
- sequel setting
- final cliffhanger

**面白い問いを持っていること自体を資産として残す。**

---

# 12. Idea memory

まだ物語正史にしていない案も忘れない。

- `docs/idea-book-v1.md`

例:

- 年を取らない魔女 × 年を取る弟子
- optional report
- クリアゲッターとのstory連携
- 集合TOP
- future characters
- sequel seeds

Story Bookへ書かれたUSER IDEA / OPEN QUESTIONも、Human decision前に勝手にCANONへ昇格しない。

---

# 13. Legacy no-read

移行済み旧Story docsは通常読まない。

一覧:

- `docs/legacy-design-migration-2026-07-28.md`

通常順:

```txt
docs/CANON.md
↓
docs/STORY.md
↓
docs/story-book-v1.md
↓
必要なCurrent detail 1つ
```
