# ヨルノシルベ Story Hub

Date: 2026-07-28  
Status: **CURRENT STORY ENTRYPOINT**

> 物語、世界の謎、人物の謎、伏線、エンディング、続編について考える時は最初にこのファイルを見る。  
> repo全体から古いscenario資料を探し直さない。

---

# 1. Current master

| Area | Current master |
| --- | --- |
| Story ↔ Gameplay logic | `docs/STORY-ENGINE.md` |
| Happy End / tears / sequel | `docs/story-ending-sequel-architecture-v1.md` |
| Main Mystery vs Character Mystery | `docs/story-foreshadowing-payoff-map-v1.md` |
| Character | `docs/CHARACTERS.md` |
| Optional reports / archive | `docs/PROGRESSION-ARCHIVE.md` |
| Meta progression | `docs/GAMEPLAY-META-PROGRESSION.md` |

旧Season Truth / world logic / long-term scenario / game-over資料の有効要素は `STORY-ENGINE.md` へ移植済み。
通常は旧資料を読まない。

---

# 2. 現在の物語方向 — CURRENT

- 世界は暗いが、人間の性格は明暗を揃えない
- 全員がその人らしいまま成長する群像劇
- Main Gameはヴァンサバ系の戦闘 / build / replay
- loreはプレイの副作用として増える
- Main MysteryとCharacter Mysteryは別レーン
- Character Mysteryを100%解かなくても本編は理解・クリアできる
- 深掘るほどMain Mysteryの見え方が増える
- 正史はHappy Endのみ
- Permanent deathを泣き装置の中心にしない
- 夜は夢 / 記憶 / 仮想 / shared mental spaceに近い非現実レイヤー
- Game Overは死亡ではない
- 1作の中心人物 / 中心感情は1作で救い切る
- シリーズ謎は小物・挙動・記録の違和感として残せる
- 続編で1の小物の意味が変わっても、1のHappy Endは無効化しない

---

# 3. 情報の扱い

物語情報を集めることをMain Gameの作業にしない。

```txt
戦闘 / 達成
↓
Gameplay reward
+
情報が自然に解放
```

読む人:

- 夜の観測記録
- Character Mystery
- 日常会
- 黒耀化記録
- 敵 / 忘れ物の背景

まで深く読める。

読まない人:

- 「新しい強化が開いた」だけ理解すればよい
- Main Story / Happy Endに到達できる

情報量は任意閲覧なら多くてよい。

---

# 4. Story Engineの最有力Candidate

旧設計から、非常に整合が高いがまだ最終LOCKしない候補:

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

というGameplayとの二重意味が作れる。

詳細: `docs/STORY-ENGINE.md`

**この具体的な世界真相はHIGH-VALUE CANDIDATEであり、まだ最終正史ではない。**

---

# 5. 謎の階層

## Character Mystery

人物の内側。

例:

- ユイとトモリの獅子座共有
- クロオリが何を守っているか
- アサと名前の関係

## Main Mystery

世界の構造。

例:

- 夜とは何か
- 黒インクとは何か
- 星獣は何を知っているか
- 誰が仕組みを作ったか

## Series Mystery

1作で答えなくてよい一段上の問い。

1作の感情決着を邪魔しない。

---

# 6. 1作とシリーズ

強い構造:

```txt
1作 = local completion
シリーズ = meta mystery continues
```

謎を3層に分けられる。

- **C級** — その作品で必ず回収
- **B級** — 後作で意味が変わるSeed
- **A級** — シリーズ全体の問い

続編のためにC級を投げない。

---

# 7. 伏線の置き方

説明台詞より先に:

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
3. シリーズ後に再解釈される意味

の三重意味を持てる。

ヤバタニエン的な「配置や行動を後で再解釈する気持ちよさ」は構造として参考にするが、救いのない正史やPermanent deathは採用しない。

---

# 8. 泣きの方向

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

を先に好きになってもらう。

終盤で:

- 初めて名前を呼ぶ
- いつもしていた行動ができない
- 一時的に離れる
- 忘れたように見える
- 朝側で同じ癖を見せる
- 再会する

ことで泣かせる。

---

# 9. Sequel direction

1は必ず一度完結する。

続編hookは:

- 露骨な「2へ続く」ではなく違和感
- 知らない折り目
- 見覚えのない綴じ糸
- 誰のものでもない星獣
- 現実側にあるはずのない紙片

などの小さなSeedが向く。

2を遊んだ後、1の最後を見直すと意味が変わるのが理想。

---

# 10. 今は固定しない

- 夜の正体が夢 / 仮想空間 / shared memoryのどれなのか
- 「間違った意味」Engineを最終真相にするか
- 誰が夜を作ったか
- なぜ夜が必要だったか
- 地図帳 / 忘れ物係の正体
- ユイとトモリの獅子座共有の真相
- sequel protagonist
- sequel stage / region
- final cliffhanger

伏線整合とMain Game規模を見て決める。

---

# 11. Legacy no-read

移行済み旧Story docsは通常読まない。

一覧:

- `docs/legacy-design-migration-2026-07-28.md`

通常順:

```txt
docs/CANON.md
↓
docs/STORY.md
↓
必要なCurrent master 1つ
```
