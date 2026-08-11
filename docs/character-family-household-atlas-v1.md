# ヨルノシルベ — Family / Household Atlas v1

Date: 2026-08-11  
Status: **P1 CHARACTER LIFE FOUNDATION / KNOWN RELATIONS PRESERVED / FAMILY RETCONS BLOCKED**

> 目的: 「家族設定がない = 一人暮らし」にせず、人物が現実側でどこへ帰り、誰と食べ、何を家と感じるかを持つ。
> 親・配偶者・子ども・死別など重大設定は、既存sourceがない限り勝手にCanon化しない。

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

「両親死亡」を便利な主人公背景defaultにしない。

---

# 3. Current21 household anchors

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

# 4. Family scene rules

家族を出す場合:

- Characterの性格説明専用NPCにしない。
- 親 = 原因、だけにしない。
- 家庭が良い / 悪いの二択にしない。
- sibling以外の関係も、連絡頻度 / 距離 / 家事分担を持つ。

---

# 5. Ritsu / Koyori sibling hard guard

Current known:
- 兄妹 / sibling relation
- romanceなし
- 兄だけが守る関係にしない

家庭を追加しても:
- コヨリをprotecteeだけにしない
- リツの人格を兄役だけにしない

---

# 6. Chosen family

Nightで生まれる友情を重視するため:

> Reality familyとNight chosen familyは競合させない。

「本当の家族より仲間が大事」と単純化しない。

家族に言えないことを仲間には言える、または逆もあり得る。

---

# 7. Future15 household notes

詳細な親族はFuture promotionまでLOCKしない。

強い既存軸:

- クロエ / レンジ: 師弟が世代を越える。恋愛自動化禁止。
- カイ / ナオ: human twins。二人で一つ扱いと個人性。
- クウ / ヨモ: 「飼い主」だけで人格を定義しない。複数の人との生活memoryを持てる。
- ノア: same snapshot two-bodyを親族語彙だけで説明しない。
- ルム: collective memoryからindividuality。familyを人間家庭へ無理に当てはめない。
- アマネ: wheelchairを家族の負担物語へしない。

---

# 8. Family major-decision queue

Human consultation対象:

- Core5の実親 / 養親 / sibling
- 配偶者 / 元配偶者
- 子ども
- Current主要人物の家族死亡
- 失踪家族
- 虐待 / 家庭内暴力
- 家族がMain MysteryのCreator等である設定

これらは人気作っぽい「重い過去」を作るためだけに追加しない。

---

# 9. Ordinary household scene reservoir

人物を好きになるために使う:

- 余ったご飯を誰が包む
- 洗濯物の畳み方
- 雨の日に傘が一本足りない
- 冷蔵庫 / 保存棚
- 靴をどこへ置く
- 鍵を失くす
- 誰が先に寝る
- 誰が電気 / 灯りを消す
- 旅行から戻った荷物をいつ片付ける
- 誰かのマグカップを勝手に使わない

大事件なしでもCharacterが見えるsceneを一級素材にする。

---

# 10. Household ↔ Dawn payoff

夜の成長はReality homeの小さな行動へ返す。

例:
- 「全部自分で戻す」人物が、忘れ物を本人へ聞く。
- 「全部閉じる」人物が、箱へ開封期限を書く。
- 「全部守る」人物が、重い荷物を半分持ってもらう。

Dawn proofを家庭で見せられると、戦闘成長が生活へ戻る。

---

# 11. Completion definition

- Current21全員にhomeAnchorがある。
- 家族未設定を死亡 / 孤児で雑に埋めない。
- known relationとopen relationを区別する。
- Dawn payoffを普通の生活へ戻せる。
- Future15の非人間 / twin / long-lived関係を人間家族型へ無理に均さない。