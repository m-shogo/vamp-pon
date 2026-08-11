# ヨルノシルベ — Family / Household Atlas v2

Date: 2026-08-11  
Status: **P1 CHARACTER LIFE FOUNDATION / MULTI-GENERATION WORLD REQUIRED / FAMILY RETCONS BLOCKED**

> 目的: 「家族設定がない = 一人暮らし」にせず、人物がReality側でどこへ帰り、誰と食べ、何を家と感じるかを持つ。
> 同時に、各EraをCore5一人だけで代表させず、父 / 母 / 伯父叔母 / 祖父母 / 子ども / 単身者 / 夫婦 / 三世代等の複数視点で社会を見せる。
> **具体的な親・配偶者・子ども・死別等の重大設定は、既存sourceがない限り勝手にCanon化しない。**

Related:

- `docs/era-family-generation-lens-v1.md`
- `docs/core5-era-character-master-v1.md`
- `docs/era-satire-cross-generation-dialogue-bible-v1.md`

---

# 1. Household fields

各人物:

- knownFamily
- currentHouseholdKnown
- childhoodHouseholdKnown
- chosenFamily
- homeAnchor
- domesticSkill
- domesticWeakness
- keepsAtHome
- neverThrowsAway
- whatMakesAPlaceFeelLikeHome
- whatMakesThemLeaveAPlace
- familyOpenQuestions

を持つ。

---

# 2. Family truth levels

- `KNOWN_CANON`
- `CURRENT_DERIVED`
- `CANDIDATE`
- `OPEN_QUESTION`

親が未設定なら`OPEN_QUESTION`。

禁止:

- 「両親死亡」を主人公背景defaultにする
- Eraが古いから大家族と自動決定
- Eraが現代だから核家族 / 一人暮らしと自動決定
- 母=家事、父=仕事、祖母=知恵袋、伯父=酒飲み等の固定役

---

# 3. Era population must include multiple generations

**World rule:**

各主要Eraには、Core5本人以外にも最低限:

- child perspective
- teen / young-adult perspective
- parent-age adult perspective
- older-adult perspective
- non-parent adult / aunt-uncle-like perspective
- parents+children以外のhousehold example

を持てる社会人口を設計する。

これはCore5に全員親族を生やすruleではない。

> **Eraを一人で代表させない。**

同じ年でも、子ども・親・祖父母・伯父叔母では「何が問題か」が違って見える。

Detailed source:
`docs/era-family-generation-lens-v1.md`

---

# 4. Current21 household anchors

## ユイ
Known family: `OPEN_QUESTION`
Home anchor: **誰かの物が一時的に置かれても嫌がらない小さな共有table** Candidate。
Domestic strength: 忘れ物を見つける / 返す。
Domestic weakness: 他人の物まで自分が管理しようとする時がある。
Keeps: 名前の分からない小物をすぐ捨てない。
Home feeling: ランタンを置いて「これ誰の？」と聞ける場所。

## アサ
Known family: `OPEN_QUESTION`
Home anchor: 名前 / ラベルが整っている生活空間。
Strength: 分ける / 書く / 配るが速い。
Weakness: 本人に聞く前に整理しすぎる。
Keeps: 手書きラベルの端紙。
Home feeling: 呼ばれたい名前で呼ばれる場所。

## ナギ
Known family: `OPEN_QUESTION`
Home anchor: 鍵 / 箱 / 引き出しに「開けていい時」がある家。
Strength: 保管。
Weakness: 大切な物ほどしまい込みすぎる。
Home feeling: 閉じた扉を勝手に開けられないこと。

## ミチル
Known family: `OPEN_QUESTION`
Home anchor: 帰り道を説明できる場所。
Strength: 買い出し / 道案内。
Weakness: 寄り道しすぎる。
Keeps: 使い終えた地図に書き足した線。
Home feeling: 迷っても帰れる。

## トモリ
Known family: `OPEN_QUESTION`
Home anchor: 修理途中の物が置いてあっても怒られない作業場所。
Strength: repair / maintenance。
Weakness: 「まだ使える」で物を残しすぎる。
Keeps: 交換した古い部品。
Home feeling: 壊れても捨てられない場所。

## セン
Known family: `OPEN_QUESTION`
Home anchor: 誰かへ説明するための紙 / 黒板 / 小さな道具。
Strength: 教える / 整理。
Weakness: 簡単なことも説明し始める。
Home feeling: 分からないと言っても恥ずかしくない。

## リツ
Known family: **コヨリ = sibling / CANON**
Household: sibling household detail `OPEN_QUESTION`。
Strength: 人数分に分ける。
Weakness: 自分の分を後回し。
Home feeling: 半分にした物を自然に渡す相手がいる。

## コヨリ
Known family: **リツ = sibling / CANON**
Strength: 小さい物へ名前を付ける。
Weakness: 「自分もやる」で背伸びする。
Home feeling: 人数を数える時に自分も含まれる。

## ゲン
Known family: `OPEN_QUESTION`
Home anchor: 長く使った物 / 古い道の話。
Strength: 簡単な食事 / 道具の手入れCandidate。
Weakness: 古い物を捨てる判断が遅い。
Home feeling: 「昔はこうだった」を馬鹿にされず話せる。

## ハナ
Known family: `OPEN_QUESTION`
Home anchor: 保存瓶 / 押花 / 布包み。
Strength: 保存 / 季節仕事。
Weakness: 人の分までしまっておく。
Home feeling: 後で誰かへ渡せる物がある。

## ユウビ
Known family: `OPEN_QUESTION`
Home anchor: 帰宅後に鞄を置く定位置 / 未処理の紙を分ける場所。
Strength: 配達 / 確認。
Weakness: 自分宛の物を後回し。
Home feeling: 「おかえり」と受領確認されなくても入れる場所。

## マドカ
Known family: `OPEN_QUESTION`
Home anchor: 窓 / 遠くが見える席。
Strength: 人の変化に気づく。
Weakness: 声をかけるまで迷う。
Home feeling: 見ているだけでも一緒にいられる。

## シロ
Known family: `OPEN_QUESTION`
Home anchor: 未分類箱 / 本棚 / 白いしおり。
Strength: 分類。
Weakness: 整理を終えるまで寝ないCandidate。
Home feeling: 分からない物を保留してよい。

## トバリ
Known family: `OPEN_QUESTION`
Home anchor: 玄関 / 鍵 / 戻ってくるための境界。
Strength: 戸締り / 帰宅確認。
Weakness: 帰る人を待ちすぎる。
Home feeling: 出ていく自由と戻る入口が両方ある。

## ネム
Known family: `OPEN_QUESTION`
Home anchor: 安心して眠れる場所。
Strength: 人の緊張を下げる。
Weakness: 起きる時間を忘れる。
Home feeling: 寝ている間に置いていかれない。

## クロオリ
Known family: `OPEN_QUESTION`
Home anchor: 開けない物を勝手に開けられない場所。
Strength: privacy / preservation。
Weakness: 理由も一緒に折り畳む。
Home feeling: 話さないことも関係として許される。

## カナメ
Known family: `OPEN_QUESTION`
Home anchor: 大きな荷物 / 家具を自然に引き受ける生活。
Strength: physical care / carrying。
Weakness: 自分の疲労を報告しない。
Home feeling: 自分が守られる側になっても居場所が減らない。

## カスミ
Known family: `OPEN_QUESTION`
Home anchor: 名前を出さずに置ける私物 / curtain / privacy。
Strength: 人の境界を守る。
Weakness: 自分の希望までぼかす。
Home feeling: 説明しなくても一人になれる時間がある。

## トキ
Known family: `OPEN_QUESTION`
Home anchor: 時計 / 記録 / 整った日課。
Strength: schedule / measurement。
Weakness: 予定外を失敗扱いしがち。
Home feeling: 時間を守ることだけでなく、遅れても帰れる。

## ツムギ
Known family: `OPEN_QUESTION`
Home anchor: unfinished work / thread / blank margin。
Strength: unfinishedを残せる。
Weakness: 終わらせることを喪失に感じる時がある。
Home feeling: 途中のものが途中のまま置ける。

## レン
Known family: `OPEN_QUESTION`
Home anchor: 比較できる小さな記録。
Strength: 違いに気づく。
Weakness: 確信が出るまで共有を遅らせる。
Home feeling: 仮説を間違えても責められない。

---

# 5. Family scene rules

家族を出す場合:

- Characterの性格説明専用NPCにしない。
- 親 = trauma原因、だけにしない。
- 家庭が良い / 悪いの二択にしない。
- sibling以外の関係も連絡頻度 / 距離 / 家事 / money / care /趣味を持つ。
- 家族NPCにも主人公不在sceneを持たせられる。

Recurring family NPCは最低:

```txt
own work / study / role
own pleasure
own irritation
one relation outside protagonist
one opinion protagonist disagrees with
one scene protagonist is absent from
```

を持つ。

---

# 6. Family generation roles are not stereotypes

## Father

仕事だけの存在にしない。
家庭 / 趣味 /親のcare /友人 /地域役割を持てる。

## Mother

家事専任defaultにしない。
work / career / childcare / own social lifeを持てる。

## Aunt / Uncle

重要な中間adult。

- 親とは違う価値観
- childへ別のadult model
- new culture / technology / foodを家へ持ち込む
- unmarried / divorced / remarried / city worker等、多様な生活形

を担える。

## Grandparent

wisdom machine / conservative obstacleにしない。
新技術が好きな祖母、若者より柔軟な祖父も普通に成立する。

## Child

pure truth machineにしない。
間違う / selfish /怖がる /大人を真似る /流行に弱い等も持つ。

Detailed generation scene rules:
`docs/era-family-generation-lens-v1.md`

---

# 7. Ritsu / Koyori sibling hard guard

Current known:

- sibling relation
- romanceなし
- 兄だけが守る関係にしない

家庭を追加しても:

- コヨリをprotecteeだけにしない
- リツの人格を兄役だけにしない

---

# 8. Chosen family

Nightで生まれる友情を重視するため:

> Reality familyとNight chosen familyは競合させない。

「本当の家族より仲間が大事」と単純化しない。

家族に言えないことを仲間には言える、または逆もあり得る。

---

# 9. Future family vocabulary

Future15 / future societyでは、人間家庭型だけをfamily正解にしない。

Strong axes:

- クロエ / レンジ: 師弟が世代を越える。恋愛自動化禁止。
- カイ / ナオ: twins。一組扱いと個人性。
- クウ / ヨモ: 飼い主だけで人格を定義しない。
- ノア: same snapshot two-bodyを親族語彙だけで説明しない。
- ルム: collective memoryからindividuality。
- アマネ: wheelchairを家族負担storyへしない。

Far Future Candidate vocabulary:

- biological parent
- legal parent
- adoptive / chosen family
- Human + Android household
- creator / manufacturer ≠ automatic parent
- copied-memory branches who may or may not call each other siblings
- grandparent with replaced body
- Robot caregiver

family制度のfinal answerはOpen。

---

# 10. Family major-decision queue

Human consultation / high-impact review対象:

- Core5の実親 / 養親 / siblings
- Core5の伯父叔母 /祖父母をRecurring主要人物にする決定
- spouse / ex-spouse
- children
- Current主要人物のfamily death
- missing family
- abuse / domestic violence
- family member = Main Mystery creator等

これらは人気作っぽい重い過去を作るためだけに追加しない。

---

# 11. Ordinary household scene reservoir

- 余ったご飯を誰が包む
- 洗濯物の畳み方
- 雨の日に傘が一本足りない
- 冷蔵庫 / 保存棚
- 靴をどこへ置く
- 鍵を失くす
- 誰が先に寝る
- 誰が灯りを消す
- 旅行後の荷物をいつ片付ける
- 誰かのmugを勝手に使わない
- 伯父が新しい食べ物を持ってくる
- 祖母が新しいphoneを一番使いこなしている
- 子どもが大人の建前を素朴に突く
- 親と伯父叔母で「その子のため」の意味が違う

大事件なしでもCharacter / Eraが見えるsceneを一級素材にする。

---

# 12. Household ↔ Waking payoff

**旧Dawn payoffはSUPERSEDED。**
ヨルノシルベにphysical morningは来ない。

Night / Dreamでの成長は、Waking後のReality homeで小さな行動として返す。

例:

- 「全部自分で戻す」人物が、忘れ物を本人へ聞く。
- 「全部閉じる」人物が、箱へ開封期限を書く。
- 「全部守る」人物が、重い荷物を半分持ってもらう。
- 「親のため」を繰り返していた人物が、本人に何を望むか聞く。
- 「子どもだから」で話から外していた家庭が、子ども本人へ説明する。

Waking payoffを家庭で見せると、戦闘成長が生活へ戻る。

---

# 13. Completion definition

- Current21全員にhomeAnchorがある。
- 家族未設定をdeath / orphanで埋めない。
- known relationとopen relationを区別する。
- 各主要Eraに複数generation lensがある。
- father / mother / aunt-uncle / grandparent / childをstereotype roleへ固定しない。
- Waking payoffを普通のReality生活へ戻せる。
- Future familyをHuman nuclear-family型へ無理に均さない。