# Literary Loading Lines Reference

Vamp Pon / ヴァンサバ改のローディング、ステージ開始、キャラ選択、図鑑、PV字幕に使うための名文・古典・ことわざ参照集。

目的は、著名文の思想を盗むことではなく、夜・星・灯り・忘れ物・朝・帰り道・弱さ・希望につながる言葉の角度を増やすこと。

---

## 0. 著作権・商用利用ルール

### 基本方針

```txt
商用UIにそのまま出す文は、原則として公有領域・古典・ことわざ・作者没後十分経過したものに寄せる。
翻訳文は別著作物になり得るため、既存訳をそのまま使わない。
Vamp Pon内で使う時は、自作の短文へ再解釈する。
```

### 危険枠

以下は世界観の思想としては合うが、商用コピーに直接引用しない。

```txt
星の王子さま / Le Petit Prince
近現代詩・現代小説・映画台詞・漫画台詞・歌詞
有名ゲーム/アニメ/映画の決め台詞
現代翻訳文
```

例: 星の王子さまの「たいせつなものは目に見えない」系の文は、Vamp Ponと非常に相性が良い。
ただし商用UIやPVでそのまま使うのは避ける。
採るなら思想だけ。

Vamp Pon変換例:

```txt
見えないものほど、夜に残る。
```

```txt
小さな灯りは、なくしたものから先に照らす。
```

---

## 1. ローディング表示ルール

ユーザーが読めないまま消えると、雰囲気づくりではなくノイズになる。

### 表示秒数

```txt
最短表示: 2.8秒
推奨表示: 3.5〜5.0秒
長文ポエム: 5.5〜7.0秒
スキップ可能: 1.2秒後から
```

### 文字量

```txt
ローディング: 18〜34字
ステージ開始: 10〜24字
キャラ選択: 20〜42字
図鑑/記録: 40〜90字
PV字幕: 8〜22字
```

### 見せ方

```txt
0.25秒 fade in
2.8秒以上 hold
0.35秒 fade out
画面タップで次へ進むが、最低1.2秒は残す
同じ文は連続表示しない
1プレイ中に同一文は原則1回まで
```

### UI演出

```txt
背景は暗くしすぎない
文字は白ベタではなく、やや古紙色
小さな星粒を1〜3個だけ流す
文字の下に薄い灯りのにじみ
ステージ名と同時に出す場合は、名文を小さく下に置く
```

---

## 2. 100個の参照名文・ことば

凡例:

```txt
出典: 作品/作者/文化圏
権利: 商用安全度の目安。翻訳は自作すること。
原文/核: 直接UIに使う場合も短くする。
Vamp Pon変換: 実際に使いやすい自作文。
用途: loading / stage / character / pv / dictionary
```

---

### 001. The Little Prince / Antoine de Saint-Exupéry

- 権利: 危険枠。直接引用しない。
- 核: 大切なものは目に見えない。
- Vamp Pon変換: 見えないものほど、夜に残る。
- 用途: loading / pv

### 002. Romeo and Juliet / William Shakespeare

- 権利: 公有領域。ただし既存訳は使わない。
- 核: 夜と名前。
- Vamp Pon変換: 名前は、夜にだけ遠くなる。
- 用途: character / loading

### 003. Macbeth / William Shakespeare

- 権利: 公有領域。
- 核: 暗闇と心の迷い。
- Vamp Pon変換: 暗い場所では、弱さの音が大きくなる。
- 用途: loading

### 004. Hamlet / William Shakespeare

- 権利: 公有領域。
- 核: 迷い続ける人間。
- Vamp Pon変換: 進めない夜にも、足音は残る。
- 用途: stage

### 005. A Midsummer Night's Dream / William Shakespeare

- 権利: 公有領域。
- 核: 夜、夢、迷い。
- Vamp Pon変換: 夢は、夜の道しるべになることがある。
- 用途: loading

### 006. Sonnet 18 / William Shakespeare

- 権利: 公有領域。
- 核: 夏の日と記憶の保存。
- Vamp Pon変換: 消えないものは、誰かの中で朝を待つ。
- 用途: pv / character

### 007. The Tyger / William Blake

- 権利: 公有領域。
- 核: 夜に燃えるもの。
- Vamp Pon変換: 夜の中で燃えるものは、怖さだけじゃない。
- 用途: stage

### 008. Auguries of Innocence / William Blake

- 権利: 公有領域。
- 核: 小さなものに世界を見る。
- Vamp Pon変換: 小さな灯りにも、ひとつの夜が入っている。
- 用途: loading / pv

### 009. Songs of Innocence / William Blake

- 権利: 公有領域。
- 核: 無垢と不安。
- Vamp Pon変換: やさしさは、夜を知らないわけじゃない。
- 用途: loading

### 010. Daffodils / William Wordsworth

- 権利: 公有領域。
- 核: 花の記憶が後で心に戻る。
- Vamp Pon変換: 拾った光は、あとから心で灯る。
- 用途: loading

### 011. Ode to a Nightingale / John Keats

- 権利: 公有領域。
- 核: 夜、歌、消えゆく感覚。
- Vamp Pon変換: 夜の歌は、消える前に道を教える。
- 用途: stage

### 012. Bright Star / John Keats

- 権利: 公有領域。
- 核: 星の静かな強さ。
- Vamp Pon変換: 星は動かずに、迷う人を待っている。
- 用途: loading

### 013. To Autumn / John Keats

- 権利: 公有領域。
- 核: 終わりにも豊かさがある。
- Vamp Pon変換: 終わりかけの灯りにも、温度は残る。
- 用途: character

### 014. Ozymandias / Percy Bysshe Shelley

- 権利: 公有領域。
- 核: 強さは残らない。
- Vamp Pon変換: 大きな影ほど、朝には薄くなる。
- 用途: stage / pv

### 015. To a Skylark / Percy Bysshe Shelley

- 権利: 公有領域。
- 核: 見えない歌。
- Vamp Pon変換: 聞こえない声にも、帰る場所がある。
- 用途: character

### 016. Frankenstein / Mary Shelley

- 権利: 公有領域。
- 核: 作られたものの孤独。
- Vamp Pon変換: 置いていかれたものにも、名前がある。
- 用途: dictionary / loading

### 017. Jane Eyre / Charlotte Brontë

- 権利: 公有領域。
- 核: 弱く見えても折れない心。
- Vamp Pon変換: 小さいまま、折れずにいる。
- 用途: character

### 018. Wuthering Heights / Emily Brontë

- 権利: 公有領域。
- 核: 荒野、記憶、執着。
- Vamp Pon変換: 風の強い夜ほど、忘れ物は重くなる。
- 用途: stage

### 019. The Raven / Edgar Allan Poe

- 権利: 公有領域。
- 核: 夜、喪失、黒い鳥。
- Vamp Pon変換: 黒い羽は、忘れたふりを許さない。
- 用途: character / loading

### 020. Alone / Edgar Allan Poe

- 権利: 公有領域。
- 核: ひとりだけ違う見え方。
- Vamp Pon変換: ひとりで見る夜は、少し形が違う。
- 用途: character

### 021. Because I could not stop for Death / Emily Dickinson

- 権利: 公有領域。
- 核: 立ち止まれない旅。
- Vamp Pon変換: 止まれないまま、夜を通り過ぎる。
- 用途: loading

### 022. Hope is the thing with feathers / Emily Dickinson

- 権利: 公有領域。
- 核: 希望は羽を持つもの。
- Vamp Pon変換: 希望は、重くなっても飛び方を忘れない。
- 用途: character

### 023. We grow accustomed to the Dark / Emily Dickinson

- 権利: 公有領域。
- 核: 人は暗闇に目を慣らす。
- Vamp Pon変換: 夜に慣れても、朝を忘れたわけじゃない。
- 用途: loading / pv

### 024. A Light exists in Spring / Emily Dickinson

- 権利: 公有領域。
- 核: 春にだけある光。
- Vamp Pon変換: 朝の光は、夜のあとでしか見つからない。
- 用途: stage

### 025. Leaves of Grass / Walt Whitman

- 権利: 公有領域。
- 核: 小さな存在の肯定。
- Vamp Pon変換: 小さくても、ここにいることは消えない。
- 用途: loading

### 026. Song of Myself / Walt Whitman

- 権利: 公有領域。
- 核: 自分の中に多くの声がある。
- Vamp Pon変換: ひとつの灯りにも、いくつもの夜がある。
- 用途: dictionary

### 027. The Road Not Taken / Robert Frost

- 権利: 要確認・国や版により危険。直接引用しない。
- 核: 選ばなかった道。
- Vamp Pon変換: 選ばなかった道にも、星は落ちている。
- 用途: stage / loading

### 028. Stopping by Woods on a Snowy Evening / Robert Frost

- 権利: 危険枠。直接引用しない。
- 核: 立ち止まりたい夜と約束。
- Vamp Pon変換: 休みたい夜にも、帰る約束がある。
- 用途: loading

### 029. The Waste Land / T. S. Eliot

- 権利: 危険枠。直接引用しない。
- 核: 断片、記憶、乾いた世界。
- Vamp Pon変換: かけらは、壊れたものだけが残すわけじゃない。
- 用途: dictionary

### 030. Four Quartets / T. S. Eliot

- 権利: 危険枠。直接引用しない。
- 核: 時間と帰還。
- Vamp Pon変換: はじめの場所は、最後にやっと見えることがある。
- 用途: pv

### 031. Tao Te Ching / 老子

- 権利: 原典は公有領域。既存訳は使わない。
- 核: 柔らかいものが硬いものに勝る。
- Vamp Pon変換: やわらかな灯りほど、夜に長く残る。
- 用途: loading

### 032. Tao Te Ching / 老子

- 権利: 原典は公有領域。
- 核: 長い旅は足元から始まる。
- Vamp Pon変換: 朝への道は、最初の一歩だけ少し暗い。
- 用途: stage

### 033. Analects / 論語

- 権利: 原典は公有領域。
- 核: 学び続けること。
- Vamp Pon変換: 思い出すたび、灯りは少し直る。
- 用途: loading

### 034. Zhuangzi / 荘子

- 権利: 原典は公有領域。
- 核: 夢と現実のあわい。
- Vamp Pon変換: 夢か夜か、分からない道にも朝は来る。
- 用途: stage

### 035. Book of Songs / 詩経

- 権利: 原典は公有領域。
- 核: 古い歌と生活の記憶。
- Vamp Pon変換: 古い歌は、忘れ物の場所を知っている。
- 用途: loading

### 036. Li Bai / 李白

- 権利: 原典は公有領域。既存訳は使わない。
- 核: 月、故郷、夜の思い。
- Vamp Pon変換: 月を見ると、帰り道だけが近くなる。
- 用途: stage

### 037. Du Fu / 杜甫

- 権利: 原典は公有領域。
- 核: 春、国、涙、記憶。
- Vamp Pon変換: 春の光でも、置いてきた夜は消えない。
- 用途: loading

### 038. Bai Juyi / 白居易

- 権利: 原典は公有領域。
- 核: わかりやすい言葉で深い感情。
- Vamp Pon変換: 簡単な言葉ほど、夜に残る。
- 用途: pv / loading

### 039. Wang Wei / 王維

- 権利: 原典は公有領域。
- 核: 静けさ、山、月。
- Vamp Pon変換: 静かな場所ほど、小さな灯りがよく見える。
- 用途: loading

### 040. Su Shi / 蘇軾

- 権利: 原典は公有領域。
- 核: 月を離れた人と共有する。
- Vamp Pon変換: 同じ月を見ていれば、遠い人も少し近い。
- 用途: character

### 041. 万葉集

- 権利: 原典は公有領域。既存現代語訳は使わない。
- 核: 旅、月、恋、故郷。
- Vamp Pon変換: 古い歌ほど、帰る場所を忘れない。
- 用途: loading

### 042. 古今和歌集

- 権利: 原典は公有領域。
- 核: 春と移ろい。
- Vamp Pon変換: 朝は、変わることを責めない。
- 用途: stage

### 043. 新古今和歌集

- 権利: 原典は公有領域。
- 核: 余白、幽玄、夜。
- Vamp Pon変換: 言わなかったことほど、夜に光る。
- 用途: character

### 044. 源氏物語 / 紫式部

- 権利: 原典は公有領域。既存訳は使わない。
- 核: 光と影、記憶、人の心。
- Vamp Pon変換: 光のそばには、いつも言えない影がある。
- 用途: character

### 045. 枕草子 / 清少納言

- 権利: 原典は公有領域。
- 核: 季節のはじまりを言葉にする。
- Vamp Pon変換: 夜明けは、まだ暗いところから美しい。
- 用途: stage start

### 046. 徒然草 / 吉田兼好

- 権利: 原典は公有領域。
- 核: 不完全なものの美しさ。
- Vamp Pon変換: 欠けた灯りにも、欠けたままの美しさがある。
- 用途: loading

### 047. 方丈記 / 鴨長明

- 権利: 原典は公有領域。
- 核: 流れて変わる世界。
- Vamp Pon変換: 流れていくものを、全部なくしたとは呼ばない。
- 用途: loading

### 048. 奥の細道 / 松尾芭蕉

- 権利: 原典は公有領域。
- 核: 旅と道。
- Vamp Pon変換: 道は、歩いたあとに少しだけ意味を持つ。
- 用途: stage

### 049. 松尾芭蕉 俳句群

- 権利: 公有領域。
- 核: 静けさと一瞬。
- Vamp Pon変換: 静けさの中で、灯りは音になる。
- 用途: loading

### 050. 小林一茶 俳句群

- 権利: 公有領域。
- 核: 小さなものへの優しさ。
- Vamp Pon変換: 小さいものほど、夜に置いていけない。
- 用途: loading / character

### 051. 与謝蕪村 俳句群

- 権利: 公有領域。
- 核: 絵のような夜と光。
- Vamp Pon変換: 夜の絵には、灯りをひとつだけ置く。
- 用途: pv / loading

### 052. 良寛 歌・句

- 権利: 公有領域。
- 核: 無垢、貧しさ、あたたかさ。
- Vamp Pon変換: 何も持たない手ほど、灯りを大事にする。
- 用途: character

### 053. 宮沢賢治 / 銀河鉄道の夜

- 権利: 日本では公有領域。ただし既存編集版に注意。
- 核: 星、旅、別れ、祈り。
- Vamp Pon変換: 星の列車は、帰れない人の夜も運ぶ。
- 用途: stage / pv

### 054. 宮沢賢治 / よだかの星

- 権利: 公有領域。
- 核: 弱いものが星になる。
- Vamp Pon変換: 逃げるだけの羽でも、いつか星に届く。
- 用途: character

### 055. 宮沢賢治 / 雨ニモマケズ

- 権利: 公有領域。
- 核: 強さではなく、静かな献身。
- Vamp Pon変換: 強くなくても、誰かの朝に立っていられる。
- 用途: pv / character

### 056. 新美南吉 / ごんぎつね

- 権利: 日本では公有領域。
- 核: 届かなかった気持ち。
- Vamp Pon変換: 届かなかったやさしさも、夜には残る。
- 用途: character / dictionary

### 057. 新美南吉 / 手袋を買いに

- 権利: 公有領域。
- 核: 小さな子、冬、灯り、人間への信頼。
- Vamp Pon変換: 寒い夜ほど、あたたかい窓を覚えている。
- 用途: loading

### 058. 夏目漱石 / 夢十夜

- 権利: 公有領域。
- 核: 夢、時間、不可思議な夜。
- Vamp Pon変換: 百年待つ夢にも、朝は少しずつ近づく。
- 用途: stage

### 059. 夏目漱石 / 草枕

- 権利: 公有領域。
- 核: 美と距離。
- Vamp Pon変換: 少し離れると、夜にも輪郭が見える。
- 用途: loading

### 060. 芥川龍之介 / 蜘蛛の糸

- 権利: 公有領域。
- 核: 細い糸、救い、弱さ。
- Vamp Pon変換: 細い糸でも、朝まで切れないことがある。
- 用途: loading

### 061. 芥川龍之介 / 杜子春

- 権利: 公有領域。
- 核: 人間らしさを選ぶ。
- Vamp Pon変換: 弱くなることが、人に戻る道になる。
- 用途: character

### 062. 太宰治 / 走れメロス

- 権利: 日本では公有領域。
- 核: 走る、信じる、間に合う。
- Vamp Pon変換: 間に合うか分からなくても、足は止めない。
- 用途: stage start

### 063. 太宰治 / お伽草紙

- 権利: 公有領域。
- 核: 昔話の再解釈。
- Vamp Pon変換: 古い話も、夜に読むと違って見える。
- 用途: loading

### 064. Andersen / The Little Match Girl

- 権利: 原典は公有領域。翻訳注意。
- 核: 小さな火、寒い夜、幻。
- Vamp Pon変換: 小さな火は、寒い夜ほど大きな夢を見せる。
- 用途: loading / character

### 065. Andersen / The Snow Queen

- 権利: 公有領域。
- 核: 氷、記憶、救いに向かう旅。
- Vamp Pon変換: 凍った心にも、名前を呼ぶ声は届く。
- 用途: stage

### 066. Andersen / The Ugly Duckling

- 権利: 公有領域。
- 核: 自分の姿が後から分かる。
- Vamp Pon変換: 今の形だけで、明日の自分を決めなくていい。
- 用途: character

### 067. Grimm / Hansel and Gretel

- 権利: 原典は公有領域。
- 核: 帰り道の印。
- Vamp Pon変換: 帰り道には、落としたものが光ることがある。
- 用途: stage / loading

### 068. Grimm / The Star Money

- 権利: 公有領域。
- 核: 星と小さな恵み。
- Vamp Pon変換: 手放したものが、星になって戻る夜もある。
- 用途: loading

### 069. Grimm / Cinderella

- 権利: 原典は公有領域。
- 核: 灰、夜、変化の時間制限。
- Vamp Pon変換: 魔法が解けても、歩いた道は消えない。
- 用途: loading

### 070. Aesop / The Bundle of Sticks

- 権利: 原典は公有領域。
- 核: ひとりより束。
- Vamp Pon変換: 小さな灯りも、並べば夜を薄くする。
- 用途: loading / pv

### 071. Aesop / The North Wind and the Sun

- 権利: 原典は公有領域。
- 核: 強制よりあたたかさ。
- Vamp Pon変換: 強い風より、弱い朝日のほうがほどけるものがある。
- 用途: pv

### 072. Aesop / The Tortoise and the Hare

- 権利: 原典は公有領域。
- 核: 遅くても進む。
- Vamp Pon変換: 遅い足でも、朝には近づいている。
- 用途: loading

### 073. Bible / Genesis

- 権利: 原典は公有領域。翻訳は版に注意。
- 核: 光がある。
- Vamp Pon変換: 最初の灯りは、暗さを責めなかった。
- 用途: pv / stage

### 074. Bible / Psalms

- 権利: 原典は公有領域。
- 核: 暗い谷を歩く。
- Vamp Pon変換: 暗い谷にも、歩くための音がある。
- 用途: loading

### 075. Bible / Matthew

- 権利: 原典は公有領域。
- 核: 灯りを隠さない。
- Vamp Pon変換: 隠した灯りも、誰かの夜を覚えている。
- 用途: loading

### 076. Quran / 古典宗教文献

- 権利: 原典は古典。翻訳は版に注意。
- 核: 導き、光、道。
- Vamp Pon変換: 道を失った夜ほど、しるべは小さく見える。
- 用途: loading

### 077. Bhagavad Gita

- 権利: 原典は古典。翻訳注意。
- 核: 迷いの中で進む。
- Vamp Pon変換: 迷いが消えなくても、一歩は選べる。
- 用途: stage

### 078. Dhammapada

- 権利: 原典は古典。翻訳注意。
- 核: 心が道を作る。
- Vamp Pon変換: 心が沈む夜にも、道は少しずつできる。
- 用途: loading

### 079. Marcus Aurelius / Meditations

- 権利: 原典は公有領域。翻訳注意。
- 核: 内側の火。
- Vamp Pon変換: 外が暗くても、内側の火まで消す必要はない。
- 用途: loading

### 080. Seneca / Letters

- 権利: 原典は公有領域。
- 核: 苦しみとの距離。
- Vamp Pon変換: 夜を全部背負わなくていい。少しずつ置いていく。
- 用途: loading

### 081. Epictetus / Enchiridion

- 権利: 原典は公有領域。
- 核: 自分で選べるもの。
- Vamp Pon変換: 消えた道は選べない。でも、次の灯りは選べる。
- 用途: loading

### 082. Plato / Republic 洞窟の比喩

- 権利: 原典は公有領域。
- 核: 影と光。
- Vamp Pon変換: 影を見たから、光の向きが分かる。
- 用途: pv

### 083. Homer / Odyssey

- 権利: 原典は古典。翻訳注意。
- 核: 長い帰郷。
- Vamp Pon変換: 帰り道は、遠回りした分だけ名前を増やす。
- 用途: stage

### 084. Dante / Divine Comedy

- 権利: 原典は公有領域。
- 核: 暗い森から星へ。
- Vamp Pon変換: 暗い森を抜けるとき、星は最後に見える。
- 用途: pv / stage

### 085. Virgil / Aeneid

- 権利: 原典は公有領域。
- 核: 失った町から未来へ。
- Vamp Pon変換: 失くした場所からでも、次の朝は始まる。
- 用途: loading

### 086. Rumi / 詩群

- 権利: 原詩は古典。現代英訳は危険。
- 核: 傷から光が入る。
- Vamp Pon変換: ひびから入る灯りもある。
- 用途: character / loading

### 087. Omar Khayyam / Rubaiyat

- 権利: 原典は古典。FitzGerald訳は公有領域だが翻案注意。
- 核: 星、時間、一夜。
- Vamp Pon変換: 星の下では、一夜も長い旅になる。
- 用途: stage

### 088. Hafez / 詩群

- 権利: 原典は古典。翻訳注意。
- 核: 夜、酒、祈り、愛の比喩。
- Vamp Pon変換: 夜にこぼした祈りは、朝に乾かない。
- 用途: loading

### 089. Tagore / Gitanjali

- 権利: 原典・作者没年上は比較的安全圏だが翻訳注意。
- 核: 祈り、光、内面。
- Vamp Pon変換: 小さな祈りは、声になる前から灯っている。
- 用途: loading

### 090. Tagore / The Gardener

- 権利: 比較的安全圏だが翻訳注意。
- 核: 庭、待つこと、心。
- Vamp Pon変換: 待つことにも、育つ灯りがある。
- 用途: character

### 091. Proverbs / ことわざ: darkest before dawn

- 権利: ことわざ。
- 核: 夜明け前が一番暗い。
- Vamp Pon変換: いちばん暗いところで、朝は準備をしている。
- 用途: loading / pv

### 092. Proverbs / ことわざ: home is where the heart is

- 権利: ことわざ。
- 核: 心のある場所が家。
- Vamp Pon変換: 帰る場所は、地図より先に心が覚えている。
- 用途: loading

### 093. Proverbs / ことわざ: every cloud has a silver lining

- 権利: ことわざ。
- 核: 暗い雲にも光の縁。
- Vamp Pon変換: 黒い雲にも、朝の縁がある。
- 用途: loading

### 094. Proverbs / ことわざ: a journey of a thousand miles

- 権利: ことわざ化。原典訳は使わない。
- 核: 長い旅は一歩から。
- Vamp Pon変換: 遠い朝も、一歩ぶんだけ近くなる。
- 用途: stage start

### 095. Japanese proverb / 明けない夜はない

- 権利: ことわざ。
- 核: 夜は必ず明ける。
- Vamp Pon変換: 明けない夜はない。でも、長い夜はある。
- 用途: pv / loading

### 096. Japanese proverb / 月夜に提灯

- 権利: ことわざ。
- 核: 不要なものの比喩。
- Vamp Pon変換: 月夜でも、小さな提灯が必要な人はいる。
- 用途: loading

### 097. Japanese proverb / 急がば回れ

- 権利: ことわざ。
- 核: 遠回りが近道。
- Vamp Pon変換: 遠回りした道ほど、忘れ物を見つけやすい。
- 用途: stage

### 098. Japanese proverb / 七転び八起き

- 権利: ことわざ。
- 核: 転んでも起きる。
- Vamp Pon変換: 転んだ場所にも、灯りは置ける。
- 用途: loading

### 099. Japanese proverb / 灯台下暗し

- 権利: ことわざ。
- 核: 近くのものほど見えない。
- Vamp Pon変換: 近すぎる光ほど、自分の影を見落とす。
- 用途: character

### 100. Japanese proverb / 旅は道連れ

- 権利: ことわざ。
- 核: 旅には連れがいるとよい。
- Vamp Pon変換: ひとりの夜も、灯りを持てば道連れになる。
- 用途: loading / pv

---

## 3. キャラ別に入れる名文参照 2個ずつ

キャラごとに、直接引用ではなく「参照元」と「Vamp Pon変換文」を2個ずつ持たせる。
ローディングやキャラ選択でランダム表示できる。

| キャラ | 参照1 | 表示文1 | 参照2 | 表示文2 |
|---|---|---|---|---|
| ユイ | The Little Prince 思想のみ | 見えないものほど、夜に残る。 | Hansel and Gretel | 帰り道には、落としたものが光ることがある。 |
| アサ | Dickinson | 夜に慣れても、朝を忘れたわけじゃない。 | ことわざ | いちばん暗いところで、朝は準備をしている。 |
| ナギ | Li Bai | 月を見ると、帰り道だけが近くなる。 | Odyssey | 帰り道は、遠回りした分だけ名前を増やす。 |
| ミチル | 方丈記 | 流れていくものを、全部なくしたとは呼ばない。 | Du Fu | 春の光でも、置いてきた夜は消えない。 |
| トモリ | 徒然草 | 欠けた灯りにも、欠けたままの美しさがある。 | Rumi思想のみ | ひびから入る灯りもある。 |
| シノ | Shakespeare | 名前は、夜にだけ遠くなる。 | 新美南吉 | 届かなかったやさしさも、夜には残る。 |
| シオン | 白紙/記録系 | 白いページは、何もない場所じゃない。 | Eliot思想のみ | かけらは、壊れたものだけが残すわけじゃない。 |
| クロエ | Poe | 黒い羽は、忘れたふりを許さない。 | Dickinson | 希望は、重くなっても飛び方を忘れない。 |
| コハル | 古今和歌集 | 朝は、変わることを責めない。 | Andersen | 今の形だけで、明日の自分を決めなくていい。 |
| レン | Whitman | ひとつの灯りにも、いくつもの夜がある。 | Tagore | 小さな祈りは、声になる前から灯っている。 |
| マヨイ | 荘子 | 夢か夜か、分からない道にも朝は来る。 | 急がば回れ | 遠回りした道ほど、忘れ物を見つけやすい。 |
| イオリ | 老子 | 朝への道は、最初の一歩だけ少し暗い。 | Epictetus | 消えた道は選べない。でも、次の灯りは選べる。 |
| ハク | Dickinson | 空白にも、夜は積もる。 | Blake | 小さな灯りにも、ひとつの夜が入っている。 |
| スズ | ことわざ/鈴 | 呼びたい名前がある夜ほど、音は遠い。 | Psalms思想 | 暗い谷にも、歩くための音がある。 |
| リツ | Shelley | 聞こえない声にも、帰る場所がある。 | 詩経 | 古い歌は、忘れ物の場所を知っている。 |
| ヒナタ | 枕草子 | 夜明けは、まだ暗いところから美しい。 | Aesop | 強い風より、弱い朝日のほうがほどけるものがある。 |
| カナメ | Aesop | 小さな灯りも、並べば夜を薄くする。 | ことわざ | 近すぎる光ほど、自分の影を見落とす。 |
| セナ | Grimm | 手放したものが、星になって戻る夜もある。 | Tagore | 待つことにも、育つ灯りがある。 |
| ユラ | Basho/静けさ | 静けさの中で、灯りは音になる。 | Jane Eyre思想 | 小さいまま、折れずにいる。 |
| ネム | 夏目漱石 | 百年待つ夢にも、朝は少しずつ近づく。 | Andersen | 小さな火は、寒い夜ほど大きな夢を見せる。 |

---

## 4. 実装データ案

ローディング文は、次の形で `src/data/loadingLines.ts` などへ落とす。

```ts
export type LoadingLine = {
  id: string;
  text: string;
  sourceLabel: string;
  sourceRisk: 'safe' | 'inspiration-only' | 'check-before-commercial';
  tags: Array<'night' | 'star' | 'light' | 'morning' | 'lost-item' | 'road' | 'weakness' | 'memory'>;
  characterId?: string;
  minDisplayMs: number;
};
```

初期実装では `text` のみ画面に出す。
`sourceLabel` は図鑑や開発資料だけに留める。

---

## 5. ステージ開始向け短文だけ抜粋

```txt
夜は、忘れ物で濃くなる。
```

```txt
小さな灯りだけが、帰り道を覚えている。
```

```txt
明けない夜はない。でも、長い夜はある。
```

```txt
黒い雲にも、朝の縁がある。
```

```txt
遠い朝も、一歩ぶんだけ近くなる。
```

```txt
帰り道には、落としたものが光ることがある。
```

```txt
夜明けは、まだ暗いところから美しい。
```

```txt
小さいものほど、夜に置いていけない。
```

```txt
影を見たから、光の向きが分かる。
```

```txt
失くした場所からでも、次の朝は始まる。
```
