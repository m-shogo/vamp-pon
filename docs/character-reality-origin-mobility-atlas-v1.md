# ヨルノシルベ — Character Reality Origin / Mobility Atlas v1

Date: 2026-08-11  
Status: **YUI ARAKAWA DECIDED / OTHER CAST CURRENT WORKING / AUTHOR-BACKSTAGE HEAVY**

> 目的: 出身地を観光プロフィールとして並べるのではなく、人物の食・言葉・家族観・移動感覚・事件への巻き込まれ方へ理由を持たせる。
> Reality情報は通常プレイでほぼ出さない。作者DBでは深く持ち、台詞・小物・食事・怒り方・安心時の方言・家族sceneへ薄く滲ませる。

## 0. Core model

各人物は少なくとも以下を分けて持つ。

```txt
birthOrigin           # 出生 / 出身
raisedRegion          # 育った文化圏
incidentResidence     # 大事件時の生活拠点
mobilityReason        # なぜそこへ移った / 留まったか
familyAnchor          # 家族 / 親族 / 墓 / 家 / 店 / 友人が残る場所
dialectBaseline       # 普段の話し方
dialectLeakTriggers   # 素が出る条件
culturalAnchors       # 食 / 行事 / 交通 / 仕事 / 家庭習慣
realityDisclosure     # 本編でどこまで見せるか
```

Hard:

- `出身地 = 事件発生地` を自動化しない。
- 地方出身者が東京 / 大都市の事件へいるなら、進学・就職・転勤・家族・修行・療養・避難等の理由を持つ。
- 東京出身者が地方事件へ関与する場合も仕事 / 家族 / 旅行 / 調査等の理由を持つ。
- 方言を常時キャラ記号にしない。
- 方言がない / 薄い人物も普通にいる。
- 肌色・出身地・国籍・性格・能力を因果で短絡しない。
- Reality情報は通常screenでは1〜2割程度しか露出しなくてよい。

---

# 1. Current21

## ユイ — DECIDED

- birthOrigin: **東京都荒川区**
- raisedRegion: **荒川区の下町生活圏**
- incidentResidence: **荒川区を生活基盤とする現代東京**
- mobilityReason: 地元育ち。大事件時も都内生活圏から自然に巻き込まれる。
- familyAnchor: 荒川区内の家 / 近所 / 商店街 / 古い物を知る人のどれかを今後固定。
- dialectBaseline: 現代東京の共通語。
- dialectLeakTriggers: 方言より、下町の距離感・言い回し・近所への呼び方が出る。
- culturalAnchors: 都電 / 商店街 / 路地 / 河川 / 古い物と新しい生活の共存 / 焼きおにぎり。
- realityDisclosure: **LOW**。住所説明はしない。生活sceneの具体性から荒川区らしさが伝わる。
- sacredPlacePotential: **HIGH**。観光案内ではなく普通の生活動線を聖地化する。

## アサ — CURRENT WORKING

- birthOrigin: 遠未来の首都圏外縁〜複合都市圏 Candidate。
- raisedRegion: Human / Android / Robot / Avatar共存が日常化した大都市文化圏。
- incidentResidence: 本人性認証制度の導入が進む中央都市圏。
- mobilityReason: 学業 / 公共窓口 / identity-related workのいずれかで制度中心地へ移動 Candidate。
- familyAnchor: 生物学的家族だけでなくchosen/legal householdもOpen。
- dialectBaseline: 標準化された未来日本語寄り。
- dialectLeakTriggers: 家族 / 幼少期の呼び名 / 強い焦りで旧い家庭語が出る Candidate。
- culturalAnchors: hand-written name preference / future identity etiquette / everyday Android coexistence。
- realityDisclosure: VERY LOW。

## ナギ — CURRENT WORKING

- birthOrigin: **北陸〜甲信の地方都市圏 Candidate**。
- raisedRegion: 家の鍵 / 近所付き合い / personal boundaryが分かりやすい住宅地。
- incidentResidence: **首都圏の学校 / 就職圏**。
- mobilityReason: 進学または就職で上京。early mobile Internet cultureへ接続。
- familyAnchor: 実家に家族 / 箱 / 古い鍵 / personal itemsが残る Candidate。
- dialectBaseline: 普段は共通語へ寄せる。
- dialectLeakTriggers: 家族との電話 / 本気で怒る / 安心して眠い時に地元語尾が少し戻る。
- culturalAnchors: winter storage / 保存食 / 家の施錠感覚 / 帰省土産 Candidate。
- realityDisclosure: LOW。

## ミチル — CURRENT WORKING

- birthOrigin: **瀬戸内の地方都市 Candidate**。
- raisedRegion: 港 / 坂 / 路地 / バス / 鉄道が複数routeを作る街。
- incidentResidence: 高度成長期の**工業化・新交通開発が進む別都市圏**。
- mobilityReason: 親の転勤 / 本人の進学・就職 / 都市計画関連の生活移動 Candidate。
- familyAnchor: 生まれた港町に親族 / 友人 / 古い道。
- dialectBaseline: 共通語寄り。
- dialectLeakTriggers: 道に迷う / 急ぐ / 地元友人と再会 / うれしくて早口になる時。
- culturalAnchors: 魚 / 坂道 / フェリーや港の時刻 / 紙地図 / 柑橘 Candidate。
- realityDisclosure: LOW。

## トモリ — CURRENT WORKING

- birthOrigin: **東北南部〜北関東の職人町 Candidate**。
- raisedRegion: 修理 / 手仕事 / 物を使い切る生活文化。
- incidentResidence: 戦後復興で人口が集まる**別の都市圏**。
- mobilityReason: 親族の仕事 / 修理需要 / 住居再建の手伝い / apprenticeship Candidate。
- familyAnchor: 故郷に工房 / 親族 / 師匠の系譜。
- dialectBaseline: 相手に合わせ共通語寄り。
- dialectLeakTriggers: 工具を落とす / 強く叱る / 酒席（成人確定時のみ） / 家族と話す時。
- culturalAnchors: 焼き芋 / 修繕 / 火 / 金物 / 使い回し。
- realityDisclosure: LOW。

## セン — CURRENT WORKING

- birthOrigin: **大阪府内 Candidate**。
- raisedRegion: 会話のテンポ / 教える時に例えを使う家庭文化 Candidate。
- incidentResidence: **東京圏の学校 / 教育現場**。
- mobilityReason: 教職 / 研究 / 転勤。
- familyAnchor: 関西に兄弟姉妹 / 旧友 Candidate。
- dialectBaseline: 教師として共通語を使う。
- dialectLeakTriggers: 酒席 / ツッコミが素で出る / 子どもに心配して本気で叱る時に関西語が漏れる。
- culturalAnchors: 粉ものだけにしない。商店街 / 笑い / 教育 / 鉄道移動。
- realityDisclosure: LOW〜MEDIUM。

## リツ — CURRENT WORKING

- birthOrigin: **埼玉〜東京北部 Candidate**。
- raisedRegion: コヨリと同一家庭圏。
- incidentResidence: 首都圏。
- mobilityReason: sibling生活維持のため大きく移動しない Candidate。
- familyAnchor: コヨリ（CANON sibling）。親 / household exactはOpen。
- dialectBaseline: 共通語。
- dialectLeakTriggers: 家族だけで使う短い言い回し。
- culturalAnchors: 分ける / 近距離鉄道 / 日常スーパー / 公園。
- realityDisclosure: LOW。

## コヨリ — CURRENT WORKING

- birthOrigin: リツと同一地域。
- raisedRegion: 首都圏住宅地 Candidate。
- incidentResidence: 同上。
- mobilityReason: 子どものため親 / householdに従う。
- familyAnchor: リツ。
- dialectBaseline: 子どもの共通語。
- dialectLeakTriggers: family-only baby-word remnants / 強い感情。
- culturalAnchors: school / 小さな駄菓子 / 公園 / 名前書き。
- realityDisclosure: LOW。

## ゲン — CURRENT WORKING

- birthOrigin: **長野県 Candidate**。
- raisedRegion: 山間交通 / 古道 / 駅 /峠文化。
- incidentResidence: 複数地域を渡った後の首都圏または地方都市。
- mobilityReason: 鉄道 / 道路 / 仕事 / 家族移動 Candidate。
- familyAnchor: 長野の古道 / 墓 / 旧友。
- dialectBaseline: 共通語化が進んだ高齢者。
- dialectLeakTriggers: 昔話 / 地元地名 / 酒 / パイプ休憩中。
- culturalAnchors: そば / 山道 / 駅 / 冬支度。
- realityDisclosure: LOW。

## ハナ — CURRENT WORKING

- birthOrigin: **山形県 Candidate**。
- raisedRegion: 季節仕事 / 保存 / 花 / 家庭手仕事。
- incidentResidence: 子世代 / 家族都合で都市圏へ移住した時期あり Candidate。
- mobilityReason: 結婚 / 子の近居 / 家族careのいずれか。
- familyAnchor: 故郷の季節行事 / 親族。
- dialectBaseline: 普段は柔らかい共通語。
- dialectLeakTriggers: 驚く / 昔の料理 / 同郷相手 / 子どもを心配する時。
- culturalAnchors: 保存食 / 花 / 雪国の季節感。
- realityDisclosure: LOW。

## ユウビ — CURRENT WORKING

- birthOrigin: **神奈川県 Candidate**。
- raisedRegion: 都市間移動 / 郵便 / 港・鉄道圏。
- incidentResidence: 東京〜神奈川広域。
- mobilityReason: 配送・郵便仕事そのもの。
- familyAnchor: 家より「戻る配達拠点」が強い Candidate。
- dialectBaseline: 共通語。
- dialectLeakTriggers: 地元感より職業語彙が出る。
- culturalAnchors: 肉まん / 冬の駅 / 道順 / 消印。
- realityDisclosure: LOW。

## マドカ — CURRENT WORKING

- birthOrigin: **千葉県 Candidate**。
- raisedRegion: 東京が遠景に見える通勤圏。
- incidentResidence: 東京圏。
- mobilityReason: 通学 / 就職。
- familyAnchor: 実家の窓 / 海や川の見える場所 Candidate。
- dialectBaseline: 共通語。
- dialectLeakTriggers: ほぼなし。地域性は景色・交通感覚に出す。
- culturalAnchors: 紙飛行機 / 窓 / 長い通勤 / 遠景。
- realityDisclosure: VERY LOW。

## シロ — CURRENT WORKING

- birthOrigin: **京都府北部〜滋賀 Candidate**。
- raisedRegion: 本 / 学校 / 古い記録へアクセスしやすい家庭文化 Candidate。
- incidentResidence: 大学・図書館・archiveのある都市へ移動。
- mobilityReason: 進学 / 司書・研究。
- familyAnchor: 故郷の本棚 / 学校 / 親族。
- dialectBaseline: 意識的に共通語。
- dialectLeakTriggers: 家族電話 / 疲労 / ものすごく呆れた時だけ地域語尾が少し出る。
- culturalAnchors: 本 / 紙 / 雨 / 古い町並みだけに寄せすぎない。
- realityDisclosure: LOW。

## トバリ — CURRENT WORKING

- birthOrigin: **新潟県 Candidate**。
- raisedRegion: 雪 / 駅 / 戸締まり / 帰る入口の感覚。
- incidentResidence: 東京の大規模駅 / transit facility周辺 Candidate。
- mobilityReason: 鉄道 / 交通 / 警備 / 施設仕事。
- familyAnchor: 故郷駅 / family home。
- dialectBaseline: 共通語。
- dialectLeakTriggers: かなり酔う前段 / 強い怒り / 故郷の雪の話。
- culturalAnchors: 山菜そば / 雪 / 時刻表 / 出入口。
- realityDisclosure: LOW。

## ネム — CURRENT WORKING

- birthOrigin: **沖縄本島 Candidate**。
- raisedRegion: 暑さ / 昼寝 / 家族・近所の距離感を持てるがステレオタイプ化しない。
- incidentResidence: 首都圏へ進学 / 仕事 Candidate。
- mobilityReason: 進学・就職。
- familyAnchor: 沖縄の家族 / 海 / 帰省。
- dialectBaseline: 普段は共通語。
- dialectLeakTriggers: 寝起き / 家族通話 / 本気で安心した時に地元語が少し出る。
- culturalAnchors: 食 / 暑さへの強さ / 時間感覚を人格そのものにしない。
- realityDisclosure: LOW。

## クロオリ — CURRENT WORKING

- birthOrigin: **北海道 Candidate**。
- raisedRegion: 距離 / 個人空間 / 冬の室内生活。
- incidentResidence: 東京圏。
- mobilityReason: 仕事 / 調査 / 学業 Candidate。
- familyAnchor: 故郷の家 / 手紙。
- dialectBaseline: 共通語。
- dialectLeakTriggers: 方言より地域specific vocabularyがぽろっと出る。
- culturalAnchors: 防寒 / 室内外境界 / 保存。
- realityDisclosure: VERY LOW。

## カナメ — CURRENT WORKING

- birthOrigin: **福岡県北九州〜福岡都市圏 Candidate**。
- raisedRegion: 大きな身体で周囲に頼られやすい生活。
- incidentResidence: 東京 / 大都市圏へ移動 Candidate。
- mobilityReason: 仕事 / family support。
- familyAnchor: 九州に親族 / 旧友。
- dialectBaseline: 共通語へ寄せる。
- dialectLeakTriggers: 笑いすぎる / 怒る / 身内を守る場面で博多・北九州系の語尾が少し戻る Candidate。
- culturalAnchors: 食卓量 / 都市交通 / 家族の集まり。
- realityDisclosure: LOW。

## カスミ — CURRENT WORKING

- birthOrigin: **静岡県 Candidate**。
- raisedRegion: 東京と地方の間の距離感。
- incidentResidence: 首都圏。
- mobilityReason: 進学 / 就職。
- familyAnchor: 実家 / 山か海のどちらかは後で固定。
- dialectBaseline: 共通語。
- dialectLeakTriggers: ほぼ隠す。家族sceneだけ。
- culturalAnchors: 茶・観光記号に縮小しない。
- realityDisclosure: VERY LOW。

## トキ — CURRENT WORKING

- birthOrigin: **愛知県 Candidate**。
- raisedRegion: 製造 / 時間管理 / 通勤の強い都市圏 Candidate。
- incidentResidence: 東京または大規模事業都市。
- mobilityReason: 仕事 / project assignment。
- familyAnchor: 愛知の家族 / 工場町ではない別生活もOpen。
- dialectBaseline: 共通語。
- dialectLeakTriggers: 焦った時 / 数字の話で早口 / 家族通話。
- culturalAnchors: 喫茶文化 / 時間 / 製造をステレオタイプにしない。
- realityDisclosure: LOW。

## ツムギ — CURRENT WORKING

- birthOrigin: **群馬県 Candidate**。
- raisedRegion: 織物 / 手仕事の土地記憶を持てる Candidate。
- incidentResidence: 首都圏。
- mobilityReason: 進学 / textile / repair-related work Candidate。
- familyAnchor: 故郷の家 / 布 / 親族。
- dialectBaseline: 共通語。
- dialectLeakTriggers: 手仕事中に独り言 / 家族と話す時。
- culturalAnchors: 糸 / unfinished work / 温泉観光記号には寄せない。
- realityDisclosure: LOW。

## レン — CURRENT WORKING

- birthOrigin: **東京都西部 Candidate**。
- raisedRegion: 都市と郊外の境界。
- incidentResidence: 都内広域。
- mobilityReason: 調査 / 進学 / 仕事。
- familyAnchor: exact family Open。
- dialectBaseline: 共通語。
- dialectLeakTriggers: 地域方言より個人の専門語。
- culturalAnchors: 比較 / 移動 / 駅 / 記録。
- realityDisclosure: VERY LOW。

---

# 2. Future15

Future15はシリーズ在庫。以下は**origin/mobility working**, Current21昇格を意味しない。

## ヒヨリ
- birthOrigin: **鹿児島県奄美群島ルーツを持つ本土育ち Candidate**。
- incidentResidence: 東京圏。
- mobilityReason: 進学 / creative work。
- dialectBaseline: 共通語。
- dialectLeakTriggers: 家族 / 泣いた後 / 本気の弱音。
- skin: natural brown skin。海外出身記号にしない。
- culturalAnchors: family food / 島ルーツ / 本土生活の両方。

## セリカ
- birthOrigin: **兵庫県阪神間 Candidate**。
- incidentResidence: 東京圏 / institution center。
- mobilityReason: 家 / 学業 /仕事。
- dialectLeakTriggers: 基本隠す。親しい女性や家族にだけ関西語が出る Candidate。
- culturalAnchors: 礼状 / 集まり / home etiquette。

## クロエ
- birthOrigin: exact origin **OPEN**。長寿のため単一「出身地」で説明しない。
- incidentResidence: 複数Era / 複数地域。
- mobilityReason: 長寿そのもの。
- dialect: 時代ごとに変化。古い言葉を常時使わない。

## レンジ
- birthOrigin: 師匠と異なる地域 Candidate。
- incidentResidence: 師匠のもとへ移住。
- mobilityReason: 弟子入り。
- familyAnchor: 出身地側の家族も持てる。

## トウマ
- birthOrigin: **沖縄県八重山ルーツ Candidate**。
- incidentResidence: 大都市の工房 / 製造地区。
- mobilityReason: apprenticeship /仕事。
- dialectBaseline: 共通語。
- dialectLeakTriggers: 酒 / 恋人 / 家族 / 強く笑う時。
- skin: natural brown skin。Gay /職人 /地域性を一つに束ねない。

## クウ
- birthOrigin: **Reality地方都市の家庭犬 Candidate**。
- incidentResidence: 飼い主家族の移動に伴う。
- mobilityReason: family migration。
- regional expression: 人間方言ではなく音・匂い・地面・気候への慣れ。

## ヨモ
- birthOrigin: **港町 Candidate**。
- incidentResidence: 複数の家 / 店 / 路地。
- mobilityReason: 猫自身の生活圏。
- familyAnchor: 複数名 / 複数home。

## ノア
- origin: physical factory/locationより**activation jurisdiction**を持つ。
- incidentResidence: identity制度中心都市。
- mobilityReason: deployment / transfer。
- family analogue: same snapshot branch person。

## ルム
- origin: maintenance network node Candidate。
- incidentResidence: 複数都市へ配備。
- mobilityReason: maintenance mission。
- local culture: 配備先ごとの人間習慣を断片的に覚える。

## マキ
- birthOrigin: **広島県 Candidate**。
- incidentResidence: 東京 / 大都市圏。
- mobilityReason: 仕事。
- dialectLeakTriggers: 決断が速すぎて素が出る時 / family call。
- culturalAnchors: city life / family food / work。

## スズ
- birthOrigin: **宮城県 Candidate**。
- incidentResidence: 東京のfashion / service / creative圏 Candidate。
- mobilityReason: 自分の装いを自由に選べる生活圏を求め進学 / 就職。
- dialectLeakTriggers: 家族 / 照れた時。
- guard: 地方=抑圧、東京=救済と単純化しない。

## イオ
- birthOrigin: **神奈川県 Candidate**。
- incidentResidence: 東京〜神奈川。
- mobilityReason: 音 /仕事 /人間関係。
- dialect: ほぼ地域差なし。分類しにくさを方言で演出しない。

## カイ / ナオ
- birthOrigin: **岐阜県 Candidate**。
- incidentResidence: 進学 /仕事で同じ都市へ出るが、後に生活圏を分けられる。
- mobilityReason: twinsだから常に一緒ではなく、それぞれ別理由を持たせる。
- dialectLeakTriggers: 二人だけの会話 / 喧嘩 / family場面。
- guard: 同じ方言を使うことが同一人格の証拠にならない。

## アマネ
- birthOrigin: **大阪府 Candidate**。
- incidentResidence: accessibility / mobility技術のある大都市圏。
- mobilityReason: 進学 / courier work /本人の選択。
- dialectLeakTriggers: speedが上がって楽しい時 / 怒った時に関西語が出る Candidate。
- guard: 地域移動を「治療のため」だけにしない。

---

# 3. New Shinjuku modern-character slot

User direction:

> **新宿には現代Characterが欲しい。ただしYuiではない。**

Current:

- Yui = 荒川区。
- Shinjuku modern-character slot = **OPEN / HIGH-VALUE**。

Selection criteria:

1. Current21またはFuture15で、夜の都市 / 駅 /仕事 /匿名性 / 多文化 /歓楽 / business / transit等との人物Core接続が自然。
2. 「新宿だから派手」「歌舞伎町だから危険」だけにしない。
3. 住民 / 通勤者 / 店員 / 学生 / 乗換利用者など、そこで生活する具体理由を持つ。
4. 現代大事件への接点が自然。

Candidates to evaluate later:

- トバリ — 大規模駅 / boundaryとの相性
- マドカ — 窓 / 観察 / 大都市遠景
- レン — 差分検出 / 都市調査
- Future マキ — adult work / decision
- Future スズ — presentation / urban choice

No assignment frozen yet.

---

# 4. Dialect leak rule

方言は`costume`ではなく**relationship / emotional-state data**として扱う。

Levels:

- `NONE` — 地域差ほぼ出ない。
- `HIDDEN` — 普段は共通語。家族sceneのみ。
- `EMOTIONAL_LEAK` — 驚き /怒り /恐怖 /喜びで出る。
- `INTIMATE_LEAK` — 恋人 / sibling / old friend /親族で出る。
- `INTOXICATION_LEAK` — 成人かつ飲酒sceneのみ。
- `OPEN` — 普段から地域語が自然に混じる。

一人に複数可。

Avoid:

- 毎sentence方言。
- 読解困難なphonetic spelling。
- 方言を笑いの対象にする。
- 「方言が出た = 本音100%」固定。
- translationで全員をgeneric rural accentへ変える。

---

# 5. Sacred-place commercial rule

聖地は**設定表で作るのではなく、scene memoryで作る**。

High-value:

- Characterが毎回通る駅口
- 二人が仲直りした橋
- 家族と食べた店のmodel location
- 事件前に座った公園
- Reality endingで戻る商店街
- 同じ景色を別EraのCharacterが違う形で知っている

Avoid:

- 観光名所を順番に出すだけ。
- 地名を連呼する。
- 架空店を実在店と誤認させる。
- 実在店舗へnegative fictional incidentを直接被せる。

Commercially strong state:

> Playerが地名を覚えたから行く、ではなく、**好きなCharacterの普通の日常がそこにあったから歩きたくなる。**

---

# 6. Disclosure budget

Reality origin data exposure guideline:

- Main Story dialogue: 0〜10%
- Bond / Party: +5〜15%
- Reality vignette: +10〜30%
- Lorebook optional: 30〜60%
- Author DB: 100%

Exact address / family legal name / school name等は必要になるまで非公開でもよい。

**深い設定は、全部説明するためではなく、説明しなくても人物が一貫するために持つ。**
