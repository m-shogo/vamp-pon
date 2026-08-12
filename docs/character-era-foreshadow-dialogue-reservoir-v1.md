# ヨルノシルベ — 36 Character Era / Foreshadow / Dialogue Reservoir v1

Date: 2026-08-12
Status: **AUTHOR CANDIDATE / NON-CANON EXCEPT EXISTING UPSTREAM ERA LOCKS**

## Purpose

36人全員について「どのReality時代の普通を背負うか」を作者用read-modelとして揃え、世代差を講義ではなく **物・言葉・習慣・勘違い・関係変化** へ使う。

この資料単体では新しいCanonを作らない。Core5既存Current、Far Future Noa/Rum等のupstream lockのみ `UPSTREAM_CURRENT` として保持し、他は `AUTHOR_CANDIDATE`。

## Hard boundaries

- Dreamの見た目年齢 ≠ Reality同世代。
- `Future15` ≠ 未来時代の15人。
- exact year / birth year / exact ageはOPEN。
- Eraから親・兄弟・配偶者・死別・戦争体験を自動推論しない。
- 古いEra = 無知、未来Era = 上位互換 にしない。
- 一つの小物・言葉だけでEra Revealしない。
- TomoriとPresent Yuiの公式IAU 88星座一覧が年代だけで違う、は引き続き禁止。
- obsolete constellation != evil。
- 星座史 clue != Character zodiac / ownership / Star Beast / fate。
- 朔夜座 / 群青残響録の意味をEra配置から変更しない。

## Reality era lanes

1. `POSTWAR_RECOVERY_SCARCITY`
   - 戦後復興・物資不足・repair/reuse/distribution
2. `GROWTH_POLLUTION_ENERGY_TRANSITION`
   - 高度成長末期〜公害・energy・route change
3. `POST_BUBBLE_EARLY_MOBILE_INTERNET`
   - バブル崩壊後〜携帯Internet初期・privacy・reachable culture
4. `PRESENT_INFORMATION_ABUNDANCE`
   - 現代・SNS/search/record abundance/category pressure
5. `FAR_FUTURE_IDENTITY_COEXISTENCE`
   - Human/Android/Robot/Avatar coexistence・copy/body/name continuity
6. `CROSS_ERA_LONG_LIVED`
   - Chloe専用のOPEN特殊枠。exact lifespan mechanismは固定しない。

## Current 21 candidate placement

| Era | Characters |
|---|---|
| Postwar recovery | トモリ(Current), ゲン(Candidate) |
| Growth / pollution / energy transition | ミチル(Current), ハナ, セン, ツムギ |
| Post-bubble / early mobile Internet | ナギ(Current), リツ, コヨリ, ユウビ, カナメ |
| Present | ユイ(Current), マドカ, シロ, トバリ, ネム, クロオリ, カスミ, トキ, レン |
| Far Future | アサ(Current Human) |

## Future15 candidate placement

`Future15` はroster/reservoir区分であり時代名ではない。

| Era | Characters |
|---|---|
| Post-bubble / early mobile Internet | レンジ |
| Present | ヒヨリ, セリカ, トウマ, クウ, ヨモ, マキ, スズ, イオ, カイ, ナオ, アマネ |
| Far Future | ノア, ルム |
| Cross-era special | クロエ |

この分布は `characterRealityRootRegistry.ts` の Future abstract / Open root と整合させる。特に **アサ / ノア / ルム以外を「Future15だから遠未来」としない**。

## Consistency audit — important findings

### 1. Ritsu / Koyori
同一household migrationがupstream。Era laneも同じにする。年代差を作りたい場合は sibling chronology Authorityが必要。

### 2. Kai / Nao
双子。Reality rootも同一。Era laneを分けない。個性を出すために「違うものを選ばせ続ける」ことも禁止。

### 3. Chloe
`Exact birthplace Open / multiple Era / multiple region` がupstream。便利な説明装置として正体を先に固定しない。

### 4. Asa / Noa / Rum
Far Future共通でも同じ問題へ潰さない。
- Asa: preferred name / Human identity
- Noa: same-memory copies can choose differently
- Rum: shared network memory vs this-instance choice

### 5. Tomori / old atlas
Tomori本人のpostwar official skyが違うのではない。**受け継いだ古いatlasの刊行時代**が違う。

## Foreshadow architecture

### Layer A — ordinary mismatch
最初は笑える小差。
- 紙を捨てる / 裏を使う
- 既読を気にする / そもそも即時連絡を前提にしない
- route app / physical landmark
- formの空欄 / categoryの不足

### Layer B — repeated mismatch
同じ人物が別sceneでも同じ種類の違和感を出す。
プレイヤーが「性格だけではない」と感じる。

### Layer C — object contradiction
物のrepair trace / old label / forwarding / seam / atlas / typo lineageがReality chronologyを示す。

### Layer D — explicit reveal
人物が西暦を自己紹介するのではなく、複数Evidenceが揃った後にReality Eraを理解する。

## High-value foreshadow chains

### Quadrantid name fossil
1. Present側が普通に「しぶんぎ座流星群」と呼ぶ。
2. 誰も説明しない。
3. ShiroがTomori由来候補の古atlasで `Quadrans Muralis` figureを見つける。
4. 「名前が残った／形の分類は残らなかった」がStory themeへ接続。
5. 群青残響録との類似は **Candidate thematic echo** に留める。

### Tomori repair mark → Yui object
1. TomoriがDreamで無意識に特定のrepair癖を見せる。
2. Yuiの古いlanternに同じ癖がある。
3. すぐ血縁・所有lineageを答えにしない。
4. Reality時間では物の方が先に二人を繋いでいた可能性を提示。

### Nagi privacy → Asa name/personhood
1. Nagiが「見せていい情報」を確認する。
2. Asaが「登録名より呼ばれたい名」を確認する。
3. 似た行動に見えるが、前者はaccess、後者はidentity authority。
4. 後半で同じではないことが効く。

### Kai / Nao → Noa
双子を「同じに見える二人」、Noaを「同じmemoryから分かれた二つ」として安易に同一視しない。
会話で互いに拒否させ、Argo Navisのone→many clueとも **ownershipではなく思考比喩** として接続可能。

## Dialogue rules

- Era expositionを台詞にしない。
- 相手の時代を馬鹿にしない。
- system/custom contradictionを笑う。
- 方言はReality Root Authorityに従い、毎行使わない。
- animal charactersは真実探知機にしない。
- Future terminologyを大量投入してSF辞書にしない。
- 一人一人のVoice/Prosody Authorityが上位。

## Dialogue scene seeds

### Tomori × Yui — disposable / repair
Yui: 「これ、買い替えた方が早いかな」
Tomori: 「早いのは分かった。直らないのか？」
Yui: 「……その順番で考えたことなかった」

伏線: 後でYuiのlanternのrepair markへ接続。

### Michiru × Yui — route
Yui: 「最短、こっち」
Michiru: 「じゃあ、帰りたい道は？」
Yui: 「それ、地図アプリに聞く質問？」

伏線: 後で消えた旧道が事件recordを繋ぐ。

### Nagi × Asa — access vs identity
Nagi: 「その名前、みんなに見せていい？」
Asa: 「その前に、その名前で呼ばれたいか聞いた？」
Nagi: 「……似てるけど、順番が違うんだ」

### Shiro × Yui — Quadrantids
Yui: 「しぶんぎ座流星群って、しぶんぎ座ないのに変な名前だよね」
Shiro: 「……今、なんて言った？」
Yui: 「え、しぶんぎ座流星群」
Shiro: 「その名前、捨てないで。たぶん、名前の方が証拠だ」

この時点ではQuadrans Muralisを説明し切らない。

### Tomori × Shiro — old atlas
Shiro: 「これ、あなたの時代の星図ですか」
Tomori: 「俺の、じゃない。俺よりずっと古い」
Shiro: 「そこが大事です」

史実guardを台詞そのものに埋め込む。

### Chloe × Gen
Gen: 「昔はな――」
Chloe: 「どの昔？」
Gen: 「……お前さんと話すと、昔が一個じゃなくなるな」

### Kai × Nao × Noa
Kai: 「俺たち、違うもの選ばないと別人に見えないらしい」
Nao: 「今日は同じのがいい」
Noa: 「分かる。違う答えを出すことまで義務になると、それも変だよ」

### Rum × Tomori
Tomori: 「みんなが覚えてるなら、お前も覚えてるのか」
Rum: 「記録は共有です。でも、どう思ったかは共有じゃありません」
Tomori: 「なるほど。傷の場所と、痛み方は別か」

## Next author decisions

Human lock前に見る項目:
- Candidate 31人のEra laneがCharacter voice / family / Reality Rootと衝突しないか
- Chloeのspecial chronologyをどこまで明かすか
- Renjiをearly-mobile laneに置く必要が本当にあるか
- Gen / Hana / Senの古いEra配置が年齢印象と矛盾しないか
- current scene countでPresent laneが多すぎて見えないか

この資料は「全員の世代を考えられる状態」まで進めるが、Candidateを自動Canon化しない。
