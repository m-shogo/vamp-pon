# ヨルノシルベ1 Character Relationship / Spotlight Villain Deepening v1

Date: 2026-08-11  
Status: **CURRENT CONTENT SOURCE / RUNTIME PROMOTION GATED**

## 目的

Title1の人物原本を、プロフィール表ではなく「一緒に生きている人間関係」まで落とす。

今回の追加は3本柱。

1. **Current24 Relationの呼び方 / 喋り方変化を機械可読化**
2. **Current21全員が3〜5人の小グループ日常で違う顔を見せる**
3. **Enemy48を増やさず、既存8体を人物級のSpotlight Enemyへ深掘りする**

Machine source:

- `src/game/data/relationshipSpeechProgressionSource.ts`
- `src/game/data/currentGroupInteractionSource.ts`
- `src/game/data/spotlightEnemyCharacterSource.ts`

Related Current authority:

- `docs/RELATIONSHIPS.md`
- `docs/character-relationship-arc-book-v1.md`
- `docs/character-dialogue-relationship-book-v1.md`
- `docs/CHARACTER-LIFE-AND-SPEECH.md`
- `docs/BOND.md`
- `docs/character-ensemble-daily-scene-bank-v1.md`
- `src/game/data/currentRelationshipInventory.ts`
- `src/game/data/enemyProductionDatabase.ts`

---

# 1. 呼び方 / 喋り方のCurrent化

旧 `docs/design/characters/relationship-speech-evolution.md` にあった良い設計思想は残す。
ただし旧castをCurrentへ復活させず、**Current24 Relationだけ**へ移植する。

呼び方と口調は別管理する。

```txt
FIRST_READ
↓
ALLY
↓
TRUST
↓
DEEP_TRUST
↓
CRISIS       # Bondの上位ではなく、信頼があっても崩れる瞬間
↓
DAWN
```

重要:

- 数値Bond閾値はまだLOCKしない
- 全員を最終的に呼び捨てへしない
- 敬語が残ることを「仲が悪い」と扱わない
- 呼称が変わらない人物は、名前を呼ぶ頻度 / 文の短さ / 任せ方 / 弱音で変化を出す
- Crisisでは成長が消えるのではなく、本人の長所が狭くなった話し方へ一時的に戻る
- Dawnは告白や友情宣言より、初期にはできなかった小さな自然動作を優先する

## 特に重要な例

### ユイ → アサ

`アサちゃん → アサ`

ただし単なる呼び捨て解禁ではない。
ユイは「私が戻す」から「どうしたい？」へ変わり、最後はアサの半歩待つ沈黙を読める。

### アサ → ユイ

呼称は `ユイ` のまま。

変化は:

`先、行く → 一緒に行く → 何も言わず半歩待つ`

呼び方が変わらない人物の方が、行動変化を強くする。

### トキ系

高Bondでも `〜さん` や敬語を残せる。
その代わり、否定が質問へ変わる / 未測定欄を残せる / 相手の勘を観測対象として尊重できる、という変化を取る。

### Shadow系

初期は名前を呼ぶ回数を抑える。
信頼後は本名 / 個人名を使うこと自体が変化になり得る。
ただし「全Shadowが同じ変化」をしない。

## Non-romance lock

- ユイ × アサ = 主人公級Buddy / non-romance
- リツ × コヨリ = 兄妹 / non-romance

Bondは恋愛度ではない。
他relationもこのSourceだけでは恋愛Canonを増やさない。

---

# 2. PairだけでなくGroupで生きる

既存の `character-ensemble-daily-scene-bank-v1.md` の方針をmachine sourceへ接続し、12個の小グループscene laneを置く。

全Current21を最低1scene以上へ含める。
全員集合sceneは作らない。

基本:

```txt
主会話 2人
+
横で別行動 1〜3人
+
星獣 / 小物 1つ
```

## Current group lanes

1. 持ち主不明のボタン — ユイ / アサ / リツ / コヨリ / ハナ
2. 雨の日の窓際 — ナギ / カスミ / マドカ / ネム
3. 修理卓 — トモリ / ツムギ / シロ / ハナ
4. 五枚の違う地図 — ミチル / トキ / ゲン / マドカ / レン
5. 宛名を見せない郵便 — アサ / カスミ / ユウビ
6. 重い荷物を誰が持つ — ナギ / カナメ / リツ / コヨリ
7. 閉じる門と帰路と配達 — ナギ / トバリ / ミチル / ユウビ
8. Shadow五人のお茶 — クロオリ / カナメ / カスミ / トキ / ツムギ
9. 未分類の授業 — セン / シロ / コヨリ / アサ
10. 夢の話をする朝食 — ネム / トキ / マドカ / レン
11. 古い道標を直す — トモリ / ゲン / ミチル / ツムギ
12. 雨上がりのランタン — ユイ / トモリ / クロオリ / ハナ

これらは確定scriptではなくProduction lane。
同じ場面を前半 / 後半で繰り返し、呼び方や助け方の変化を見せる。

---

# 3. 長く人気が残る敵から抽出するもの

他作品のキャラクターをコピーしない。
名前、外見、固有能力、台詞、固有設定を移植しない。

参考にするのは**人気が続く敵の構造**だけ。

2025年12月にコミックシーモア会員6,077名へ行われ、2026年2月に発表された「推せる悪役」調査では、上位理由として次の要素が目立つ。

- 敵なのに主人公を助ける可能性がある曖昧さ
- 自分の信念がある
- 孤独 / 渇望など、人間的に理解できる欲求
- 邪悪さと人間への憧れのような内面矛盾
- 強さ / カリスマ / 美意識 / ユーモア
- 悪役になるまでの苦悩

Source:
- NTT Solmare / Comic Cmoa, “推せる悪役”キャラクターランキング, 2026-02-12
  https://www.nttsolmare.com/press/2026/0212.html

また、人気漫画162作品を対象にしたcharacter network研究では、漫画の人物networkは現実のsocial networkに似た性質を持ち、少年漫画では近年、より密で主人公一極ではないnetworkへ寄る傾向が報告されている。
これは人気の因果を証明する研究ではないが、**敵も主人公だけと繋がず複数人物の価値観へ刺す**設計の参考になる。

Source:
- Kashin Sugishita, Naoki Masuda, “Social network analysis of manga: similarities to real-world social networks and trends over decades”, 2023
  https://arxiv.org/abs/2303.07208

## ヨルノシルベへ入れる8原則

1. **怖さを先に見せる** — 過去話から登場しない
2. **欲しいものが分かる** — 世界征服のような大語だけにしない
3. **恐れているものがある** — 行動の狭さへ繋げる
4. **本人の正しさが過剰化している** — 本作のWrong Readingと一致させる
5. **主人公以外とも鏡関係を持つ**
6. **毎回同じ癖 / ritualがある** — 一目でその敵と分かる
7. **悲しい過去は免罪符にしない**
8. **全員を改心させない** — 敵のまま好きになれる余地を残す

---

# 4. Spotlight Enemy 8

Enemy49を追加しない。
Current Enemy48から8体を人物級へ深掘りする。

| Enemy | Role | 人気フック | Character mirror |
|---|---|---|---|
| 持ち主のない名前 | ambiguous threat | 一度だけ「味方に見える正しい行動」をする | ユイ / アサ / カスミ / ユウビ |
| 閉じた朝箱 | tragic mirror | 守る善意が期限を失い監禁へ変わった | ナギ / カナメ / トバリ / コヨリ |
| 帰路のない夜 | overwhelming force | 静かで巨大、道を一本ずつ消すだけで怖い | ミチル / トキ / ゲン / レン |
| オンブロ 黒折 | recurring rival | 毎回同じ折り目を一つだけ残す | クロオリ / ユイ / カスミ / ユウビ |
| オンブロ 余白枠 | uncanny observer | 何も書かないこと自体が意思 | シロ / ツムギ / ハナ / セン |
| オンブロ 継ぎ目 | broken caretaker | 壊れた物を勝手に直す「善意の侵害」 | トモリ / ツムギ / ハナ / ゲン |
| オンブロ 夢波 | tempting escape | 苦しい時ほど「眠れば楽」に見える | ネム / マドカ / トキ / ナギ |
| オンブロ 名札 | petty nemesis | 小物っぽいのに毎回厄介、訂正を認めない | アサ / ユイ / カスミ / コヨリ |

---

# 5. 過去話の作り方

「実は可哀想だった」で終わらせない。

各Spotlight Enemyは:

```txt
現在の怖い行動
↓
繰り返す癖
↓
戦闘後に小さな手がかり
↓
別Characterの日常 / Relationで同じ問いを安全な形で見る
↓
後半で過去の一部が分かる
↓
最初の敵行動の意味が変わる
```

という順で出す。

## 持ち主のない名前

過去:
仮名を付ける善意が、本人が名乗る前に「正解」として残り続けた。

怖さ:
本人より先に正しい名前を決める。

後から見えること:
守りたかったのは名前そのものだった。
しかし、**だから本人の選択を奪ってよいわけではない**。

## 閉じた朝箱

過去:
「今は見せない方が安全」という保護行為から始まる。
期限だけが失われ、「今は」が「永遠に」へ変わった。

重要:
閉じることを悪としない。
ナギの守り方と対比する。

## 帰路のない夜

個人一人の悲劇へしない。
複数の古い地図、訂正、善意の案内が積み重なり、互いに矛盾した。

結論:
「間違う可能性があるなら選ばせない」というWrong Readingになった。

## オンブロ 黒折

Shadowの誰かと同一人物にはしない。
血縁 / creator説もLOCKしない。

「見せない方が優しい」と折り畳まれ続け、理由が消えて、**隠す動作だけが残った**敵。

## オンブロ 余白枠

誤記を消し直し続けた結果、正しい情報まで分からなくなり「空白だけが安全」になった。

倒してもカードへ答えを書かない。
`未記入` が正式状態として残ってよい。

## オンブロ 継ぎ目

「直せる」と言い続けた記録のうち、直らなかった物の欄だけ途中で切れている。

失敗を記録できず、修理跡を隠すこと自体が目的へ変わった。
トモリの人物成長と鏡になる。

## オンブロ 夢波

「朝まで夢を続けたい」という優しさから、起こす責任だけが抜け落ちた。

病気 / 死別を後付けして泣かせない。
眠れない夜という普通の生活から深さを出す。

## オンブロ 名札

壮大な悲劇ではなく、小さな見栄と恥ずかしさ。
訂正線を引かず、間違った名札の上へ新しい名札を貼り続けた。

「弱いのに妙に人気がある敵」枠として、ギャグ敗走と本物のMARKED pressureを両立させる。

---

# 6. Story1へどう刺すか

Spotlight Enemyは戦うStageだけに物語を閉じない。
ただしcombat spawnは既存Stage affinityを勝手に変更しない。

別Stageでは:

- Night Record
- 小物
- 日常会
- 別人物の似た選択
- 戦闘後のReleased Clue

で再解釈させる。

これにより「また同じBossが出た」ではなく、**倒した敵の意味が後から深くなる**。

Title1 Happy Endは維持する。
敵の過去を100%集めなくても本編clear可能。
Spotlight Enemy全員の救済もEnding条件にしない。

---

# 7. Hard boundary

- Current21を維持
- Future15をCurrentへ昇格しない
- Enemy48を維持、49体目を追加しない
- 他作品の敵キャラ名 / 台詞 / 能力 / 外見を移植しない
- 「○○っぽいキャラ」をmachine Canonへ入れない
- 悲しい過去 = 無罪、にしない
- 全敵を喋らせない
- 全敵を元人間にしない
- 全敵を仲間化しない
- Main Mysteryの最終回答をEnemy過去だけで確定しない
- Runtimeへ自動昇格しない

---

# 8. 次のImplementation gate

Content側の次工程:

1. Relationship Speechのnumeric Bond threshold設計
2. Story Gate / Stage Gateとの解放条件
3. Battle result / Support voiceでの呼称差分
4. Group sceneをStage1〜20のintermissionへ配置
5. Spotlight EnemyのNight Record entry作成
6. Enemy encounter前後の小物 / afterimage配置
7. Spotlight8のvisual signature / animation gesture定義
8. human review後にruntime dataへ小さく昇格

このv1では**関係と敵の原本を先に深くし、数値とruntimeを早くLOCKしない**。
