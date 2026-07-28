# ヨルノシルベ Character Personal Profile Canon v1

Date: 2026-07-28
Status: **ADOPTED FOR STORY / PROFILE / DAILY-LIFE DESIGN; RUNTIME NAME MIGRATION DEFERRED**
Repository: `m-shogo/vamp-pon`

## 1. 目的

戦闘・能力・物語上の役割だけでなく、キャラクターを『普段どう生きている人か』まで同じ密度で扱うための個人プロフィール正本。

この正本は20-character canonに加え、official reserveのレンも含む21人を対象にする。

### この文書が正本になる領域

- 誕生日（月日。年は固定しない）
- 星座
- 年齢感（厳密な数値年齢ではなく、演出上の世代感）
- 名前の制作意図
- 好きな食べ物と、その理由
- 趣味
- 小さな癖
- 好きなもの / 苦手なもの
- 日常パートで使える一場面
- Shadow / Rival 5の人間名

### 境界

- 星座は性格を決定するルールではなくプロフィール flavor。
- 年齢は世界設定を縛りすぎないため数値固定しない。
- `id` は既存runtime/canon互換のため変更しない。
- `kage1`〜`kage4` の内部IDは維持するが、画面・物語・プロフィールで `カゲール1`〜`カゲール4` を人名として表示しない。
- `characterCanon.ts` のname migrationは別の安全なdata-sync commitで行う。Heavy Design / U49 runtimeへ混ぜない。

## 2. Shadow / Rival 5の正式な人名

| ID | 旧内部名 | 人間名 | 名前の理由 |
| --- | --- | --- | --- |
| `kuroori` | — | **クロオリ** | 黒＋折り。Shadow側だけ少し通り名めいた輪郭を残す。 |
| `kage1` | カゲール1 | **カナメ** | 「要」。危険に近い位置で大事なものを守る存在。 |
| `kage2` | カゲール2 | **カスミ** | 「霞」。消すのではなく、輪郭をぼかして守る思想。 |
| `kage3` | カゲール3 | **トキ** | 「時」。夜の角度・時間を読み、朝への移行も見届ける。 |
| `kage4` | カゲール4 | **ツムギ** | 「紡ぐ」。空白を終わりではなく、続きをつなぐ余地として守る。 |

`カゲール1`〜`4` は今後 **historical/internal planning label** としてのみ扱う。

## 3. 共通プロフィール項目

新規characterも最低限次を持つ。

```txt
name / runtimeId
group
birthday
zodiac
ageImpression
nameDesignRationale
favoriteFood
favoriteFoodReason
hobby
smallHabit
likes
dislikes
dailyLifeSceneHook
```

## Core 5

### 01. ユイ

```txt
id: yui
birthday: 11/07
zodiac: 蠍座
ageImpression: 同世代の若者
nameDesignRationale: 「結い／結ぶ」の響きを下敷きに、記憶と人をつなぎ直す中心人物として短く呼びやすい名。
favoriteFood: 焼きおにぎり
favoriteFoodReason: 旅の途中でも分けやすく、少し焦げた香りと手のひらの温かさがランタンの記憶に重なる。
hobby: 小さな忘れ物を拾って持ち主を想像する
smallHabit: 火を見ると無意識に両手を近づける
likes: 小さな灯り、帰ってくる人、名前を呼ぶこと
dislikes: 誰かが全部を自分のせいにすること
dailyLifeSceneHook: みんなの中央でランタンを置き、拾った小物を『これ誰の？』と回す。
```

### 02. アサ

```txt
id: asa
birthday: 04/08
zodiac: 牡羊座
ageImpression: 同世代の若者
nameDesignRationale: 夜の物語の先にある「朝」を思わせる短い音。名前を取り戻す役と、夜明けへ向かうテーマをつなぐ。
favoriteFood: だし巻き卵
favoriteFoodReason: 一切れずつ形が揃っていて分けやすい。誰の分か分からなくならないところが好き。
hobby: 名札や小さなラベルをきれいに書く
smallHabit: 初対面の名前を一度だけ小声で復唱する
likes: 手書き文字、整った名札、呼び名を覚えること
dislikes: 『なんでもいい』と名前を雑に扱うこと
dailyLifeSceneHook: 紙コップや包みに全員の名前を書いて配る。
```

### 03. ナギ

```txt
id: nagi
birthday: 02/16
zodiac: 水瓶座
ageImpression: 同世代の若者
nameDesignRationale: 「凪」の静けさ。閉じる・しまう行為を恐さではなく、意志ある保護として見せるための名。
favoriteFood: 白玉ぜんざい
favoriteFoodReason: 急いで食べず、温かいうちに少しずつ味わえる。静かな甘さが落ち着く。
hobby: 箱や鍵、小さな容器を整理する
smallHabit: 大事なものをしまう前に二度確認する
likes: 蓋の閉まる音、月明かり、守られた静けさ
dislikes: 理由を聞かずに勝手に開けられること
dailyLifeSceneHook: 皆の鍵や小物を一時預かりして、帰る時に一つずつ返す。
```

### 04. ミチル

```txt
id: michiru
birthday: 05/24
zodiac: 双子座
ageImpression: 同世代の若者
nameDesignRationale: 道を満たしていく感覚と、帰る相手へ近づく響きを重ねた名。移動・帰路の役割を柔らかく持たせる。
favoriteFood: ハムとチーズのサンドイッチ
favoriteFoodReason: 歩きながらでも食べられて、道を止めずに誰かと半分こできる。
hobby: 知らない道を歩いて簡単な地図を描く
smallHabit: 曲がり角で一度だけ後ろを見る
likes: 地図、標識、遠くの灯り、寄り道
dislikes: 『戻れない』と決めつけること
dailyLifeSceneHook: 紙ナプキンに今日歩いた道を描いて、みんなにおすすめの寄り道を教える。
```

### 05. トモリ

```txt
id: tomori
birthday: 12/09
zodiac: 射手座
ageImpression: 同世代の若者
nameDesignRationale: 「灯り／灯す」を直接感じさせつつ、ユイとは違い『直して継ぐ火』を担当する名。
favoriteFood: 焼き芋
favoriteFoodReason: 焼けるまで待つ時間まで含めて好き。煤で手が汚れても気にしない。
hobby: ランプや小道具の修理
smallHabit: 会話中でも緩んだねじや留め具を見つけると直す
likes: 工具、火花、直してまた使うこと
dislikes: 壊れたからとすぐ捨てること
dailyLifeSceneHook: みんなが話している横で、いつの間にかランタンや椅子のがたつきを直している。
```

## Circle 10

### 06. セン

```txt
id: sen
birthday: 09/08
zodiac: 乙女座
ageImpression: 成人・先生
nameDesignRationale: チョークの『線』と先生役の響きを重ねた短名。言葉と道筋を残す人物。
favoriteFood: カレーパン
favoriteFoodReason: 授業や作業の合間に片手で食べられる。少し冷めてもおいしいのが気楽。
hobby: 言葉遊びと簡単な図解を作る
smallHabit: 説明するとき無意識に指で空中へ線を引く
likes: 子どもの言い間違い、黒板、分かる瞬間
dislikes: 分からない人を置いていく説明
dailyLifeSceneHook: 石や紙片を使って即席のゲームを教え、いつの間にか全員参加にする。
```

### 07. リツ

```txt
id: ritsu
birthday: 07/26
zodiac: 獅子座
ageImpression: 年長の若者・兄
nameDesignRationale: 「律」の整った拍子。半分に分けても関係が崩れない、頼れる兄らしい輪郭を持たせる。
favoriteFood: たまごサンド
favoriteFoodReason: 切ればきれいに半分にできる。最初から誰かと分ける前提で選びがち。
hobby: 小物を半分ずつ分けて遊び道具にする
smallHabit: 食べ物を受け取ると先に人数を数える
likes: 分けること、兄妹の軽口、帰る目印
dislikes: 一人だけ得をすること
dailyLifeSceneHook: コヨリとお菓子を半分こし、余った分を自然に他の人へ回す。
```

### 08. コヨリ

```txt
id: koyori
birthday: 03/06
zodiac: 魚座
ageImpression: 子ども
nameDesignRationale: 紙をより合わせる「紙縒り」。小さいけれど人と人、名前と記憶をつなぐ存在。
favoriteFood: ホットケーキ
favoriteFoodReason: シロップで名前や絵を書いてもらえるから。形が少し崩れても気にしない。
hobby: 小さな紙片やシールを集める
smallHabit: 自分の物に小さく名前を書きたがる
likes: 名前を書いてもらうこと、小さな名札、手をつなぐこと
dislikes: 人数を数える時に飛ばされること
dailyLifeSceneHook: 誰かの皿にシロップで名前を書こうとして、字が曲がってみんなで笑う。
```

### 09. ゲン

```txt
id: gen
birthday: 01/11
zodiac: 山羊座
ageImpression: 高齢者
nameDesignRationale: 短く古風で、道を知る年長者として読みやすい音を優先。過度に賢者風にしない。
favoriteFood: いなり寿司
favoriteFoodReason: 駅や道中で食べた記憶が多く、冷めても変わらない味を信頼している。
hobby: 古い道を歩き直す
smallHabit: 座れる場所を見つけると周囲の帰り道を先に確認する
likes: 駅のベンチ、古い地図、長く使った道具
dislikes: 『古いから役に立たない』という言葉
dailyLifeSceneHook: 昔の道の話をしているうちに、若い組が知らない近道をさらっと教える。
```

### 10. ハナ

```txt
id: hana
birthday: 04/29
zodiac: 牡牛座
ageImpression: 高齢者
nameDesignRationale: 押し花・保存の役割を最も素直に伝える名。かわいさより生活の温かさを優先する。
favoriteFood: おはぎ
favoriteFoodReason: 残ったものを丁寧に使い切る家庭の記憶がある。作る時間も含めて好き。
hobby: 押し花と布包み
smallHabit: きれいな葉を見つけると本に挟めるか考える
likes: 保存瓶、季節の花、誰かのためにしまっておくこと
dislikes: まだ使える物を粗末にすること
dailyLifeSceneHook: みんなが拾った花を一輪ずつ預かり、後でしおりにして返す。
```

### 11. ユウビ

```txt
id: yubi
birthday: 10/09
zodiac: 天秤座
ageImpression: 若い成人
nameDesignRationale: 『郵便』の音を人名として柔らかくした制作名。届ける役を一目で覚えられるようにする。
favoriteFood: 肉まん
favoriteFoodReason: 寒い配達途中に両手を温められる。立ち止まる理由にもなる。
hobby: 消印や道順メモを集める
smallHabit: 渡す物は相手の名前を二度確認する
likes: 手紙、遠回りでも届く道、返事
dislikes: 読まずに捨てられた言葉
dailyLifeSceneHook: 遅れて届いた手紙や小包を持ってきて、誰のものか皆で推理する。
```

### 12. マドカ

```txt
id: madoka
birthday: 06/12
zodiac: 双子座
ageImpression: 同世代の若者
nameDesignRationale: 『窓』の役割を人名の柔らかさへ変換。見るだけだった視線が行動へ変わる人物。
favoriteFood: プリン
favoriteFoodReason: 窓辺でゆっくり食べる時間が好き。崩さず最後まで食べる小さな遊びもする。
hobby: 窓から景色を見ること、紙飛行機
smallHabit: 人の小さな変化に先に気づくが少し迷ってから声をかける
likes: 窓明かり、紙飛行機、気づくこと
dislikes: 『見ていただけなら意味がない』と言われること
dailyLifeSceneHook: 遠くの出来事に最初に気づき、紙飛行機でみんなの注意を向ける。
```

### 13. シロ

```txt
id: shiro
birthday: 01/27
zodiac: 水瓶座
ageImpression: 同世代の若者
nameDesignRationale: 白いしおり・未読の頁・余白から。白を『空っぽ』ではなく保存可能な領域として扱う。
favoriteFood: バタークッキー
favoriteFoodReason: 小さく数えやすい。図書室では絶対に食べず、外へ出てからきっちり分ける。
hobby: しおりと未分類メモの整理
smallHabit: 本を置く時、必ず向きをそろえる
likes: 分類、余白、読めないものを保留すること
dislikes: 分からないからと捨てること
dailyLifeSceneHook: 拾った紙片を机に並べ、誰の記憶かではなく『まだ分からない』箱も作る。
```

### 14. トバリ

```txt
id: tobari
birthday: 09/17
zodiac: 乙女座
ageImpression: 成人
nameDesignRationale: 帳・とばり＝境目を閉じ開きするもの。改札と『帰りを残す境界』の役割に重ねる。
favoriteFood: 山菜そば
favoriteFoodReason: 駅や峠で食べる温かい一杯が、出発と帰着の両方を思い出させる。
hobby: 古い切符や時刻表の整理
smallHabit: 誰かを見送る時は帰りの時刻も一緒に伝える
likes: 往復切符、門、帰ってくる約束
dislikes: 一方通行だと決めつけること
dailyLifeSceneHook: みんなに小さな記念切符を渡し、帰る時に穴を開けて笑う。
```

### 15. ネム

```txt
id: nemu
birthday: 02/27
zodiac: 魚座
ageImpression: 同世代の若者
nameDesignRationale: 眠りと夢をそのまま短く人名化。重い幻想設定より、日常の寝坊感も残す。
favoriteFood: フレンチトースト
favoriteFoodReason: 遅く起きても朝ごはんらしく食べられる。甘い匂いでやっと目が覚める。
hobby: 夢日記、昼寝
smallHabit: 大事な夢ほど起きた直後は話さず先に絵で残す
likes: 柔らかい毛布、雨音、夢の中の道
dislikes: 急に起こされること、夢を笑われること
dailyLifeSceneHook: 会話の途中で眠り、起きた直後に誰も見ていない道の続きを描く。
```

## Shadow / Rival 5

### 16. クロオリ

```txt
id: kuroori
birthday: 11/19
zodiac: 蠍座
ageImpression: 同世代より少し年上の若者
nameDesignRationale: 黒＋折り。Shadow側だけ少し通り名めいた響きを残し、折ることを破壊ではなく保護に反転させる。
favoriteFood: お茶漬け
favoriteFoodReason: 静かに短時間で食べられ、余計な説明がいらない。誰かが隣にいても気まずくならない。
hobby: 折り紙と地図の折り方研究
smallHabit: 紙を渡されるとまず折り目の傷みを見る
likes: 閉じた頁、静かな場所、開く前に考える時間
dislikes: 勝手に秘密を開かれること
dailyLifeSceneHook: 輪の少し外で紙片を折り、最後には小さな動物を一つだけ中央へ置く。
```

### 17. カナメ

```txt
id: kage1
birthday: 01/07
zodiac: 山羊座
ageImpression: 若い成人
nameDesignRationale: 『要』。危険に最も近い位置へ立ち、影の中で重要なものを守る役から。旧内部名はカゲール1。
favoriteFood: 焼き餃子
favoriteFoodReason: 熱いうちに皆で一皿を囲むのが好き。端の焼け具合を気にするが最後の一個は譲る。
hobby: 服や鞄のほつれを繕う
smallHabit: 人の靴紐や留め具が緩んでいると無言で指差す
likes: 影になる場所、頑丈な留め具、守るための距離
dislikes: 不用意に誰かを人前へ引っ張り出すこと
dailyLifeSceneHook: 会話にはあまり入らず、風よけになる位置へ座って全員の荷物をまとめて守る。
legacyInternalName: カゲール1
```

### 18. カスミ

```txt
id: kage2
birthday: 03/14
zodiac: 魚座
ageImpression: 同世代の若者
nameDesignRationale: 『霞』。消すのではなく輪郭をぼかして守る思想から。旧内部名はカゲール2。
favoriteFood: 湯豆腐
favoriteFoodReason: 味が強すぎず、湯気の向こうで静かに食べられる。体が温まると少し話しやすくなる。
hobby: 鉛筆画のぼかしと紙の修復
smallHabit: 書き間違いを見つけてもすぐ消さず、本人が直すまで待つ
likes: 鉛筆、薄い雨、言い直せる余地
dislikes: 怒りの勢いで残す消せない言葉
dailyLifeSceneHook: 皆の共同メモの間違いを目立たないよう直し、誰が間違えたかは絶対に言わない。
legacyInternalName: カゲール2
```

### 19. トキ

```txt
id: kage3
birthday: 10/18
zodiac: 天秤座
ageImpression: 同世代の若者
nameDesignRationale: 『時』。夜の角度と時間を読み、朝が来ても影の役目は消えないことを示す。旧内部名はカゲール3。
favoriteFood: 塩むすび
favoriteFoodReason: 塩加減が少し違うだけですぐ分かる。単純だからこそ作る人の癖が見えると言う。
hobby: 星図を写すこと、定規で小物を測ること
smallHabit: 『だいたい』と言われると一度だけ正確な数字を確認したくなる
likes: 星、角度、針の影、バランス
dislikes: 根拠なく決めつけること
dailyLifeSceneHook: 星の位置から時刻を当てようとして、みんなに『時計見れば？』と笑われる。
legacyInternalName: カゲール3
```

### 20. ツムギ

```txt
id: kage4
birthday: 06/29
zodiac: 蟹座
ageImpression: 同世代の若者
nameDesignRationale: 『紡ぐ』。空白は終わりではなく、続きをつなぐために残すという役から。旧内部名はカゲール4。
favoriteFood: アップルパイ
favoriteFoodReason: 一つを切り分けて食べても、残りを後で楽しめる。最後の一切れを急いで決めない。
hobby: 破れた頁や布を糸で直すこと
smallHabit: ノートの最後の数頁を必ず空白のまま残す
likes: 白紙、途中の話、続きを考える時間
dislikes: 『これで全部』と早く結論を閉じること
dailyLifeSceneHook: みんなの話を聞きながら破れた紙を縫い、最後に『続きは明日』と余白を残す。
legacyInternalName: カゲール4
```

## Official Reserve

### 21. レン

```txt
id: ren
birthday: 08/30
zodiac: 乙女座
ageImpression: 同世代の若者
nameDesignRationale: レンズ／焦点の音を人名へ寄せた制作名。見る力ではなく『見分ける』力を表す。
favoriteFood: レモンタルト
favoriteFoodReason: 甘さの中に輪郭のはっきりした酸味がある。ぼやけない味が好き。
hobby: レンズ磨きと違い探し
smallHabit: 物を見る時、ほんの少しだけ顔を傾けて焦点を合わせる
likes: 小さな差、透明なガラス、輪郭が合う瞬間
dislikes: ちゃんと見ずに出した結論
dailyLifeSceneHook: 集合写真や地図の端にある小さな違和感を見つけ、皆を呼び戻す。
```

## 8. 日常パート / 集合絵への使用ルール

- 戦闘能力のポーズではなく、食べ物・趣味・小さな癖から会話を作る。
- 集合絵では全員を同じ強度で主張させず、誰が誰と自然に一緒にいるかを見せる。
- Core 5は最初から仲間として見せやすい。
- Circle 10は進行に応じて一人ずつ日常へ混ざる。
- Shadow / Rival 5は初登場時から仲良し集合へ入れず、関係改善後に距離が縮む変化を見せる。
- 最終盤の集合絵ではShadow側も同じ灯りの周囲にいられるが、クロオリは少し外側、カナメは風上、カスミは共同メモ、トキは空、ツムギは破れた紙を直す等、個性を行動で出す。
- レンはreserveのため、現行TOP集合絵へ自動追加しない。

## 9. Production / data rule

Personal profileは物語・灯録・Character Detail・TOPの日常差分・生成briefへ利用できる。

ただし、次は別ゲート。

```txt
profile canon adopted != runtime playable
profile name adopted != sprite ready
profile birthday defined != age/year canon fixed
daily-life hook defined != spoiler-safe for every screen
```

Shadow proper-name runtime migrationを行う場合:

1. `characterCanon.ts` の `name` のみ変更し、`id=kage1..kage4` は維持。
2. `characterDatabase.ts` / prompt / emblem / Kokuyou / production planのID参照を壊さない。
3. visible UIに旧内部名が残っていないかchecker。
4. current production canon / inner canon / rosterを同期。
5. full test / buildを通す。

## 10. 現在判定

```txt
PersonalProfileTargetCount=21
MainRoster=20
OfficialReserve=1
BirthdayAndZodiacCoverage=21/21
FavoriteFoodCoverage=21/21
DailyLifeHookCoverage=21/21
ShadowProperNames=4/4
RuntimeShadowNameMigration=NOT_STARTED
```
