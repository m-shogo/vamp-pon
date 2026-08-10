# ヨルノシルベ — Character Appearance Source Book v1

Date: 2026-08-10  
Status: **USER DIRECTION + HIGH-VALUE APPEARANCE SOURCE / CURRENT FACTS PRESERVED / GENERATION-DERIVED DATA MUST FOLLOW THIS BOOK**

> 目的: 画像生成AI・外部artist・Sprite制作・立ち絵・TOP集合絵の都合より先に、**キャラクター本人の容姿原本**を持つ。
>
> 「髪色だけ違う同じ顔」を禁止し、Current21 + Future15 + 今後追加する全人物について、顔・体格・年齢感・肌・歯・耳・手・装飾・服装・姿勢まで人物性と結びつける。
>
> `character-appearance-distinction-generation-contract-v1.md` と `characterAppearanceGenerationContracts.ts` は本書から派生する。Generation Contractが本書を上書きしない。

---

# 0. Authority order

```txt
人物の人生 / 性格 / 関係 / 時代
↓
本書: Appearance Source
↓
Generation Contract / prompt / artist brief
↓
Candidate art
↓
Human Review
↓
Approved Reference / Web / Unity
```

重要:

- 生成AIが描きやすいから顔を均す、を禁止する。
- 既存候補画像に似せるため原本を変えない。
- 一枚絵の都合でhard landmarkを消さない。
- Current21 / Future15のAuthority境界は維持する。
- Future15や本書のCandidate detailをCurrent21へ自動昇格しない。

---

# 1. 一番大事な方針 — Same Faceを設計段階で防ぐ

人物差は髪型 / 髪色 / 目色だけで作らない。

最低でも次の**18軸**を持つ。

1. face shape — 丸 / 卵 / 面長 / 四角 / 逆三角 / heart / broad-jaw
2. cheek volume — 頬骨 / 柔らかい頬 / こけ / 年齢による落ち
3. eye aperture — 大 / 中 / 細 / 半眼
4. eye angle — 垂れ / 水平 / 吊り / 猫目 / 狐目
5. eye spacing — 広 / 標準 / 狭
6. eyelid — 一重 / 奥二重 / tapered double / parallel double / heavy hood
7. eyebrow — ゲジ眉 / 太眉 / 細眉 / 直線 / 山型 / 下がり / 左右差
8. eyelashes — 上のみ / 下まつ毛 / 目尻束 / ほぼ無し / 長い横流れ
9. nose — 鼻筋 / 鼻先 / 小鼻 / hooked / broad / round tip
10. mouth / lips — 幅 / 上下厚 / cupid bow / 非対称 / 口角
11. teeth — 八重歯 / 前歯 / gap / 歯並び / 見せ方
12. cheek / skin marks — エクボ / そばかす / ほくろ / 傷 / 年齢線 / 日焼け
13. ears — 大小 / 立ち / ピアスの見え方
14. hairline / forehead — 生え際 / 額 / 分け方
15. body frame — 華奢 / 標準 / 大柄 / ぽっちゃり / 筋肉 / 年齢
16. hands — 大小 / 節 / 爪 / 作業痕 / 指輪
17. posture / gesture — 前傾 / 直立 / 猫背 / 腕を隠す / 手が先に動く
18. clothing construction — 縦 / 横 / 斜め / layered / compact / rounded / rigid

## Acceptance

新規人物は:

```txt
髪と目の色をモノクロ化
+ 顔だけcrop
+ 装飾を外す
```

状態でも、近い既存人物と**最低3軸以上の顔差**が必要。

主要人物 / 人気を狙う人物は5軸以上。

双子 / 三つ子 / 同一snapshot Robotは意図的類似を許可するが、**現在の差分**を別途持つ。

---

# 2. HARD LANDMARKとSOFT LANDMARK

## HARD LANDMARK

候補画像で欠けたら不合格。

例:

- ユイの笑顔のエクボ
- ハナの年齢 + ぽっちゃり輪郭
- カナメのplus-size broad body
- シロの丸メガネ
- ゲンの年齢線 / 深い眼窩
- クウが犬であること
- ヨモが猫であること
- ノアのartificial-person body identity
- ルムのsmall maintenance robot identity

## SOFT LANDMARK

衣装variantや時代差で変えてよい。

- ピアス個数
- 指輪位置
- ネイル
- 髪の結び方
- scarf / necklace
- jacket open/closed

HardとSoftを混ぜない。

---

# 3. Body Modification / Decoration Reservoir

ユーザー要望として、人物の外見を安全な美形defaultへ均さない。

使える要素:

## Ear / face piercing

- single lobe
- double lobe
- helix
- industrial
- conch
- tragus
- ear cuff
- eyebrow piercing
- nostril stud
- septum
- lip ring
- labret
- tongue piercing

ルール:

- 全員へ配らない。
- 服装ジャンルと一対一にしない。
- 「反抗的 = ピアス多数」の単純記号にしない。
- 年代や仕事上の都合を考える。
- piercingsを外した跡も人物史に使える。

## Tattoo / 刺青 / 和彫りCandidate

使える方向:

- 小さな個人記号
- 仕事 / 船 / 旅 /記録由来の記号
- old tattoo faded with age
- 手彫り風の不均一さ
- 和彫り / 日本伝統刺青から技法研究した大面積pattern Candidate

Boundary:

- 和彫りを「犯罪者だから」の速記にしない。
- 文化・時代・職業との整合をHuman Reviewする。
- skin artをCharacter Coreの全部にしない。
- 年少人物へ入れない。

## Scar / skin history

- eyebrow nick
- burn mark
- stitch scar
- old cut
- work abrasion
- sun damage
- age spots
- freckles
- acne scar
- vitiligo / birthmark Candidate（人物性と無関係な見た目の一部として使える）

傷を「強い人の証明」だけにしない。

---

# 4. Teeth / mouth / smile diversity

生成AIは目差分より口・歯を均しやすいため、ここも原本化する。

使える:

- 八重歯
- 少し大きい前歯
- 歯を見せない笑い
- 大口笑い
- 片方の口角だけ上がる
- 薄い上唇
- 厚めの下唇
- cupid bow
- 少し歯のgap
- 年長人物の自然な歯の色 / line

真っ白な均一歯を全員defaultにしない。

---

# 5. Core5 — 顔が似ないための原本

## 01 ユイ — **エクボの主人公**

### HARD LANDMARK

- 笑顔で**左右のエクボ**が読める。
- 片側だけ強く出る表情variantは可。
- 笑顔でエクボが完全消失した候補はREJECT。

### Face

```txt
faceShape: 柔らかい卵型。頬に自然な量。尖ったV顎ではない。
eye: 丸すぎないalmond-round。ほぼ水平。目尻は柔らかい。
eyelid: tapered二重。幅は中程度。
brow: 中太、やや直線。眉山を強くしない。
lashes: 上まつ毛は柔らかい扇。下は少量。
nose: 鼻筋は低〜中。鼻先は少し丸い。
mouth: 中幅。笑うと横へ素直に開く。下唇は柔らかい。
cheek: エクボが最重要。頬の影だけで代用禁止。
```

### Emotional reason

ユイは「人を集める主人公」なので、近づきやすい顔にする。ただしgeneric cute heroineへしない。

エクボは:

> 強く笑った時だけ現れる「普段の優しさが顔へ出る小さな欠点」

であり、人気記号として固定する。

### Body / hands

- 同世代の標準体格。
- 指先に小さな煤 / 紙の汚れが付くことがある。
- 手は物を拾うため低い位置へよく出る。

### Accessories

- 小型ランタン系1点を主役。
- jewelryは少なめ。
- 主人公だから全部盛りにしない。

### Clothing

- 柔らかい曲線 + hood / travel layer。
- 青系Current方向を尊重。
- 縦に長すぎるローブではなく、しゃがんで物を拾える構造。

### Forbidden

- エクボ無し笑顔
- generic巨大丸目
- V字小顔
- eyelashes盛り過ぎ
- 他4人より装飾密度を上げるだけの主人公化

---

## 02 アサ — **吊り目 / 速い顔**

### Face

```txt
faceShape: 短くangular。頬はflat。
eye: 細長い吊り目。狐寄り。Core5で最も横長。
eyelid: 目頭側は奥二重、外側でfoldが出る。
brow: 細めの山型。tail短め。左右差を少し許可。
lashes: 目尻へ鋭い束。ふわふわ禁止。
nose: 小さく直線。
mouth: 片口角smirk。歯を見せる笑いが似合う。
```

### Body mods Candidate

- asymmetrical lobe + helix piercings
- tongue piercing Candidate
- small lip stud Candidate

**舌ピはアサ最有力だがHuman visual review前はCandidate。**

### Clothes

- diagonal / cropped / fast closure
- label / name tag / paper strip
- 左右非対称

### Forbidden

- ミチルの丸い猫目へ寄る
- ユイの柔らかい頬
- 長い姫まつ毛

---

## 03 ナギ — **細目 / 静けさ**

### Face

```txt
faceShape: 面長寄りの細い卵型。
eye: 細い水平眼。少しだけ伏し目。
eyelid: 一重〜非常に薄いfold。
brow: 低い位置の濃い直線眉。
lashes: 上へcurlせず横へ流れる長いまつ毛。
nose: Core5で最も鼻筋を明確にする。
mouth: 小さく薄い水平口。
```

### Marks

- 小さな泣きぼくろ Candidate
- silver ear cuff 1〜2点

### Clothing

- 閉じた襟
- 箱 / 鍵 / 月の直線geometry
- 肌露出より「開ける / 閉じる」構造

### Forbidden

- big cool-beauty eyes
- 細眉
- トモリのhalf-lidded sexy faceと混同

---

## 04 ミチル — **猫目 / ゲジ眉 / そばかす**

### HARD-ish LANDMARK

- thick natural **ゲジ眉**
- 鼻〜頬に薄いそばかす / sun marks

### Face

```txt
faceShape: 短めで横幅のある卵型。
eye: 明るく開いた猫目。アサより縦幅が大きい。
eyelid: parallel二重。
brow: 太く自然。一本一本の毛流れが見えるゲジ眉。
lashes: 上短密 + 下まつ毛を数本見せる。
nose: 鼻先丸め。
mouth: Core5で一番大きく笑う。
```

### Body / skin

- outdoors感。少し日を浴びた肌でもよい。
- 膝 / 手に旅の小傷。

### Accessory

- compass
- travel pins
- stacked bracelets

### Forbidden

- 細眉化
- porcelain doll化
- アサと同じ狐目

---

## 05 トモリ — **伏し目 / 修理痕 / 装飾密度**

### Face

```txt
faceShape: 頬骨が少し見える大人びた逆卵型。
eye: hooded half-lidded。黒目の縦開口は小さめ。
eyelid: 深い二重だが上瞼に一部隠れる。
brow: 中太・緩い角度。
lashes: 目尻上 + 下目尻の存在感を強める。
nose: 鼻筋中〜高。鼻先は少し長い。
mouth: 下唇少し厚め。乾いた笑い。
```

### Marks / Mods Candidate

- 作業中の小傷 / 煤
- multiple ear metal
- small tattoo
- larger traditional tattoo / 和彫りCandidateは**トモリ含む成人枠で文化レビュー後**
- tongue piercingはアサと競合するため、トモリではlip / ear / tattoo側を優先するCandidate

### Clothing

- repair seamを見せる
- real tool belt
- patchwork
- work gogglesは顔を常時隠さない

### Forbidden

- ナギclone
- tattooだけでcharacterize
- 全身を工具で埋める

---

# 6. Current Circle / Shadow / Reserve — Appearance source spine

ここでは「生成prompt」ではなく、人物原本としての交換不能点を定義する。

## セン

- 成人。少し長いrounded rectangle顔。
- 垂れ気味のalmond eye。
- tapered二重 + やや重い上瞼。
- 眉は中太、内側が明確。
- 笑うと額 / 目尻へ薄い表情線。
- 先生記号として眼鏡を安易に足さない。
- 袖まくり / chalk dust / practical watch Candidate。
- 指は説明中に空中へ線を引く。

## リツ

- 若いrounded-square顔。
- jaw幅をCore5より強く。
- 直線的な中サイズ眼。少し三白眼感Candidate。
- 太く短い直線眉。
- 笑顔で小さな八重歯Candidate。
- 兄だから大柄、にはしない。
- pair objectを半分ずつ持つ造形。

## コヨリ

- child-coded round cheeks。
- wide-set round eyesだがadult glamour eye禁止。
- 短い自然眉。
- 前歯が少し見える笑顔Candidate。
- piercing / tattoo / sexualized styling禁止。
- 髪を自分で結んだような少し不揃いなdetail Candidate。

## ゲン

- 年長男性。頬肉が落ちたangular long face。
- deep-set narrow eyes。
- 重いage fold。
- 太い白髪眉、左右差あり。
- 鼻は大きめで少しhook。
- crow feet / 額皺 / 口角線。
- clean youthful skin禁止。
- 白髪 / thinningをcomic baldnessにしない。
- 手の節 / 古傷 / 日焼けが重要。

## ハナ

### HARD LANDMARK

- plus-size older woman
- full round older face
- 年齢線を消さない

顔:

- hooded slightly drooping warm eyes
- age-fold二重
- ゆるい眉
- 鼻先丸 / 小鼻やや広め
- smile lines
- cheek mole Candidate

服:

- 丸いshawl
- textile / brooch / pressed flower
- 身体を巨大布で隠して細身誤魔化し禁止

## ユウビ

- heart face。
- 目尻下がりalmond。
- cupid bow mouth。
- 口元ほくろCandidate。
- 控えめsingle earring。
- envelope flap / seal構造。
- 「儚い美人」一辺倒にしない。

## マドカ

- wide horizontal observer eyes。
- lower lashesを明確に。
- 一方のblinkが僅かに遅いCandidate。
- narrow mouth。
- hair fringeは視界を塞がず顔を開く。
- ユイと同じ大目ヒロイン顔禁止。

## シロ

### HARD LANDMARK

- 丸メガネ。

顔:

- narrow heart。
- close-set small slightly downturned eyes。
- monolid〜薄い奥二重。
- short low-density straight brows。
- 口は小さく閉じ気味。
- メガネ圧跡Candidate。

レンとの差:

- シロ = 頁へ近づく低い視線
- レン = 対象を比べる焦点視線

## トバリ

- broad lower face / stable jaw。
- tired-alert narrow eye。
- heavy tapered double。
- 長く太いlow-arch brow。
- 鼻筋幅広め。
- gatekeeperの縦長服ではなく「境界を作る横線」も使う。

## ネム

- sleep-heavy rounded triangle face Candidate。
- 眠そうな垂れ目。
- upper lid heavy。
- 眉尻が下がる。
- pillow crease / 目の下の薄い影をcute gimmickではなく生活として使う。
- 髪は寝癖を毎回同じ記号に固定しない。

## クロオリ

- sharp folded diamond face。
- 目幅は中、黒目小さめ。
- browsは折れ角のような一度強く曲がる形Candidate。
- 口は薄く、笑っても歯を出しにくい。
- black paper / foldで顔まで隠しすぎない。
- facial piercingは避け、fold / glove / nailの静かな異質さへ。

## カナメ

### HARD LANDMARK

- plus-size broad young adult man
- wide shoulders + thick soft torso
- slim化禁止
- bodybuilder細腰化禁止

顔:

- broad cheek / broad jaw but soft
- 狼のような上目遣いより、目は小さめで警戒的
- 太い眉
- 鼻やや広め
- 唇は薄すぎない

ニッチ魅力:

- 大きい手
- 指の古い傷
- 肩 / 腕の圧倒的silhouette
- でも動く時は速い

## カスミ

- small foxlike heart / narrow jaw。
- narrow slightly upturned eyesだがアサより視線が逃げる。
- very soft low-density brows。
- lashesは透明感より目尻1〜2束。
- nose small。
- lipstick等で「妖艶な隠密」に寄せすぎない。
- hair/veilで輪郭を完全に隠さない。

## トキ

- cool long hexagonal face Candidate。
- 目は水平、瞳孔のfocusが強い。
- parallel narrow double。
- precise straight eyebrow。
- 下まつ毛ほぼ無し。
- mouth corner変化が小さい。
- jewelryは定規 / 時計記号へしすぎない。

## ツムギ

- soft square / rounded chin。
- やや垂れた大きすぎない目。
- browsに左右の高さ差Candidate。
- lipは上唇の山が明確。
- thread / stitchを服の縫製構造へ。
- 「儚い裁縫少女」defaultにしない。

## レン

### HARD LANDMARK

- 丸メガネ。ただしシロと別。

顔:

- slightly wider eye spacing
- small bright focus eyes
- clear inner double
- eyebrow tail more analytical
- 鼻筋やや高い

眼鏡:

- 片レンズに焦点光 / attachment Candidate
- gimmick過多禁止

---

# 7. Future15 — Appearance source spine

FutureはCurrent21へ自動昇格しない。ただし人物原本は今から濃く持つ。

## ヒヨリ — 褐色女性 / social light

- natural brown skin。色をtan gimmickにしない。
- round-square lively face。
- cat-round eyesではなく、少しdroopy outer corner + strong smile。
- thick shaped brows。
- laugh linesが若くても出るほどよく笑う。
- nail / earrings / hair accessoriesを楽しく使える。
- ギャル = 金髪 / 極端makeup固定ではない。
- bodyは健康的で活動的。細身defaultから離れてよい。

## セリカ — 上品 / Lesbian Candidate

- longer oval / high cheek line。
- calm almond eye。
- clear double but eyelash densityは控えめ。
- brows well-groomed but too thin禁止。
- posture / neck / hand placementで育ちを見せる。
- jewelryはquality > quantity。
- sexualityをvisual codeにしない。

## クロエ — 不老の魔女 / long-lived adult

### HARD CONCEPT

外見が若い成人でも、**目・姿勢・手の使い方に長い人生**が出る。

- child-like appearanceへは寄せない。
- ageImpressionはadult。
- smooth skinでも視線は落ち着きすぎるほど落ち着いてよい。
- smileが「若い顔に古い癖」という違和感を持つ。
- old jewelryを時代混在させる。
- piercing holeの痕だけ残るCandidate。
- faded tattoo from a past era Candidate。

## レンジ — 年を取る弟子

- 登場時期によりadult〜older adult。
- クロエより見た目年上でも自然。
- broad nose / laugh line / forehead line。
- 若い頃の傷が老いて皮膚の形と一緒に変わる。
- 髪 / beardはrelationship年代表示に使えるが固定しない。

## トウマ — 褐色男性 / 職人 / Gay

- natural brown skin。
- broad rectangular adult face。
- heavy eyebrows。
- work-worn handsを最大の魅力の一つにする。
- nail edge / callus / cut marks。
- tattoos / work marks Candidate。
- sexualityを服や仕草だけで記号化しない。
- apron / tool rigは「職人コスプレ」でなく実用構造。

## クウ — real dog

- 人間顔へ擬人化しない。
- breedは最終Human Review前にLOCKしない。
- ears / muzzle / tail / gaitで個性を作る。
- 毛並みの癖、昔の首輪跡、片耳の傷等Candidate。
- star beastと混同しない。

## ヨモ — real cat

- 人型耳cat-girl化禁止。
- real cat anatomy。
- patch / fur patternに複数の呼び名の歴史を乗せられる。
- 片耳 notch Candidate。
- 呼び名ごとに返事の仕草が違う。

## ノア — Robot A / artificial person

- 人間に近いbodyでも、人工物のlineを完全に消さない。
- 同snapshot二bodyは起動直後ほぼ同一。
- その後、傷 / repair / hair arrangement / clothing choiceで差が増える。
- 「本物だけ傷なし」にしない。
- face symmetryが人間より整いすぎている初期状態Candidate。
- 時間とともに表情癖で左右差が増える。

## ルム — Robot B / small maintenance collective

- childlike speech != child body sexualization。
- 人型美少女robotへ寄せない。
- compact maintenance silhouette。
- repair panels / mismatched replacement part。
- one private scratched partを隠すCandidate。
- collective unitsと個体差は小さなrepair historyで作る。

## マキ — large / powerful adult woman Candidate

- **大きな女性枠の有力候補。**
- broad frame / thick limbs / strong neck/shoulder。
- bodybuilder extremeではなく、仕事やスポーツで使う身体。
- 顔はstrong square-oval。
- 短く太い眉Candidate。
- laugh mouthは大きい。
- sexuality = Bisexualをvisualizeしない。

## スズ — feminine-presenting adult man

- adult male identity。
- faceを「女性顔に胸なし」で作らない。
- jaw / nose / brow / handsに成人男性としての個体差を残す。
- feminine makeup / eyelashes / clothesを本人の選択として使う。
- pierced ears / manicure Candidate。
- presentationを成長で矯正しない。

## イオ — gender undisclosed adult

- playerへ性別当てをさせない。
- bone structureを意図的に二択の中央へ寄せるだけでなく、**個人の顔**を作る。
- long narrow eye + full lower lip等、性別記号と独立した顔特徴を持たせる。
- voice / clothes / postureも「答え隠し」ではなく本人の好み。

## カイ / ナオ — human twins

### intentional resemblance

共通:

- skull / face shape
- nose base
- eye spacing
- ear shape

を似せてよい。

差:

### カイ

- brow softer / fuller
- smile lines早く出る
- hairの同じ部分を残したがる
- shared accessoryを長く使う

### ナオ

- eyebrow groomingを変える
- mouth habit違う
- 同じ服を避けるが、時々同じ好みが漏れる
- piercings / hairstyle Candidateで意図的差を作る

重要:

> 双子だから違う顔を無理に作るのではなく、**同じ顔から人生が差を作る**。

## アマネ — wheelchair user / speed courier

- chairと身体を一体のmobility silhouetteとして設計。
- upper bodyを不自然に筋肉記号化しない。
- gloves / hands / wheel maintenance痕。
- faceは compact oval + strong lower brow Candidate。
- speed personなのでhair / clothも前後motionが出る。
- chairを隠してstanding artへ変えない。

---

# 8. 三つ子 Candidate — 双子と同じにしない

まだFuture15へ追加しない。

三つ子を入れるなら:

```txt
A = 同じでいることに安心
B = 3人の真ん中で仲裁役に固定されることへ疲労
C = 「二人だけの関係」が自分抜きでできることを恐れる
```

のように**3人だから発生する関係**を作る。

Appearance:

- skull familyは共通でもよい
- 眉 / 目の開き / mouth habit / posture / piercing / haircut / clothing constructionで現在差分
- 「赤青緑の髪色だけ」で分けない

---

# 9. ニッチな見た目の刺さり — 全キャラへ分散する

全員美形モデル体型にしない。

使える魅力:

- エクボ
- ゲジ眉
- 眉欠け
- 太眉
- 細眉
- 左右非対称眉
- 細目
- 吊り目
- 猫目
- 狐目
- 垂れ目
- 三白眼
- 一重
- 奥二重
- parallel二重
- deep double
- heavy hood
- 下まつ毛
- まつ毛少ない
- 八重歯
- 大きい前歯
- gap tooth
- 口元ほくろ
- 泣きぼくろ
- そばかす
- 日焼け跡
- 年齢線
- 額皺
- 目尻皺
- stubble
- 顔の古傷
- burn scar
- birthmark
- ピアス穴跡
- tongue piercing
- septum
- helix
- industrial
- ear cuff
- nail art
- short nails
- bitten nails Candidate
- 指輪跡
- 大きい手
- 小さい手
- 節張った手
- 柔らかい手
- 作業callus
- tattoo
- faded tattoo
- traditional tattoo Candidate
- old perfume bottle / vintage jewelry
- cheap charmをずっと使う
- repaired clothes
- oversized clothes
- perfect tailoring
- uniformを崩さない
- collarを閉じる
- 襟を開ける
- scarf collector
- belt / buckle fetish appeal
- gloves
- fingerless gloves
- sleeve over hands
- rolled sleeves
- exposed ankles
- heavy boots
- worn shoes
- polished shoes

この中から人物ごとに**Primary 1〜2 / Secondary 2〜4**程度。
全部盛りは禁止。

---

# 10. 関係性がAppearanceを変える

容姿は固定sheetだけで終わらない。

## Friendship

- 借りたbracelet
- 直してもらった留め具
- 呼び名を書いたtag

## Sibling

- 同じ物を違う使い方
- お下がり
- 片方が修理した痕

## Pseudo-family

- 洗濯で混ざった服
- 同じ食卓で付いた染み
- 誰かが縫ったpatch

## Master / disciple

- 技術の癖が手 / 道具 / stanceへ残る
- 卒業後に同じ装備を持たないことも重要

## Romance / one-sided love

- 相手に合わせたfashionだけで表現しない
- 持ち物を返せない / 返した跡
- 元恋人からもらった物を普通に使い続ける
- 別れたら全部捨てる、にしない

## Betrayal / separation

- uniformを脱ぐ
- badgeを外すが跡が残る
- piercingsを外す / 開け直す
- bandage / repair history

## Reunion / graduation

- 昔と同じ顔ではない
- 髪 / 傷 / 皺 / posture / bodyが時間を通ったことを示す

---

# 11. Age / aging / fear of aging

ユーザーが重視する「歳をとる怖さ」を顔へ返す。

老いは:

- 弱体化エフェクト
- death flag
- mentor retirementの記号

ではない。

使うもの:

- 目尻の線
- 頬のvolume変化
- 眉 / まつ毛の薄さ
- 手の血管 / 節
- tattooの色褪せ
- piercing holeだけ残る
- 好きだった服が似合わなくなったと思う本人の迷い
- 髪色を染める / 染めない選択
- 若い時と同じaccessoryを使う

クロエのような不老者は逆に:

> **周囲だけにこの変化が起こる怖さ**

を持つ。

---

# 12. 新規キャラ作成時のAppearance Gate

今後キャラを一人追加するたび必須。

```txt
01 ageCoding
02 species / body type
03 face shape
04 eye shape
05 eyelid
06 eye spacing
07 eyebrow
08 lashes
09 nose
10 mouth / lip
11 teeth
12 cheek / skin landmark
13 hairline / hair construction
14 ear / piercing
15 tattoo / scar / mark
16 hands
17 body frame
18 posture
19 clothing construction
20 accessory hierarchy
21 hard landmark
22 nearest existing face
23 at least 3 explicit differences
24 relationship-based visual change
25 age progression possibility
```

## Reject

- 「美少女 / イケメン / クール」だけ
- 髪色と目色しか違わない
- 全員同じV顎
- 全女性同じ二重 + long lashes
- 全男性同じ細目 + broad shoulder
- ぽっちゃりを服で隠す
- 年長者を皺だけ追加した若者顔にする
- 人外を人型美形へ寄せる

---

# 13. Generationに渡す時のルール

生成promptは本書を圧縮するだけ。

優先順位:

```txt
1 HARD landmark
2 face geometry
3 body geometry
4 age / species
5 posture
6 clothing construction
7 accessories
8 palette
```

**paletteを顔より上に置かない。**

5人集合等でdetail budgetが落ちる場合:

- Hard landmarkを削らない
- jewelry個数を減らす
- cloth patternを減らす
- background propsを減らす

ユイのエクボを背景の星より先に落とすことは禁止。

---

# 14. 一文

> **ヨルノシルベの人物は、髪色で見分けるのではない。笑い方、眉、目、鼻、口、皺、手、体、傷、装い、その人が誰と生きてきたかで見分ける。**
