# ヨルノシルベ — Stage20 World / Lore Integration v1

Date: 2026-08-11  
Status: **P0/P1 WORLD-TO-PLAY INTEGRATION / EXISTING STAGE IDS AND GAMEPLAY PRESERVED**

> 目的: 世界設定を資料だけに置かず、既存Stage1–20を歩くことで社会・歴史・生活・情報差・朔盟の気配が自然に見えるようにする。
>
> `src/game/data/stageProductionDatabase.ts` のStage ID / name / lead / gameplay seedを上流とし、本書は変更しない。

---

# 1. Integration contract

各Stageは最低:

- `worldLayer`
- `civilianAnchor`
- `institutionLink`
- `incidentEcho`
- `knowledgeBeat`
- `mysteryClass`
- `quietOrHumanDetail`
- `conflictGuard`

を持つ。

全部をMain Story台詞で説明しない。

---

# 2. Stage01 — `forgotten_street` / 忘れられた夜道

World layer: `THRESHOLD → NIGHT`

Civilian anchor:
- 普通の住宅 / 小商店 / 通学・帰宅路に見える。
- 傘立て、閉店札、忘れ物の紙片など「誰かがさっきまで暮らしていた」痕跡。

Institution:
- 遺失物 / 交通 / 小商店。

Incident echo:
- `INC-NAME-001 名前訂正騒動`の最小seedを紙片一枚で置ける。

Knowledge beat:
> 夜は異世界ではなく、**知っている街が少しだけ間違って見える**。

Mystery: `C/B seed`

Quiet detail:
ユイが戦闘前後に「これ誰の？」と拾う小物。Main clueでなくてもよい。

Guard:
- Stage1でNight Originを説明しない。
- 街全体が既に滅んだ、などを勝手に示さない。

---

# 3. Stage02 — `name_tag_alley` / 名札の路地

Layer: `NIGHT / RECORD`

Civilian anchor:
- 学校名札、荷札、店の取り置き札など、**名前を書く文化の違う用途**を混在させる。

Institution:
- school / post / shop record。

Incident:
- `INC-NAME-001` strongest echo。

Knowledge beat:
- 「間違った名前を直す」と「本人より先に名前を決める」を分け始める。

Sakumei seed:
- ペタの上貼りとナシロの剥離は**同じ名前テーマでも逆の行動**と分かるvisual evidenceを置く。

Quiet detail:
アサが敵札ではなく味方の紙コップへ普通に名前を書くsceneを近くに置く。

Guard:
- 名前テーマ = ナシロ / ペタ / カスミ全員同一勢力、にしない。

---

# 4. Stage03 — `moon_box_library` / 月箱の書庫

Layer: `NIGHT / RECORD`

Civilian anchor:
- 本棚だけでなく貸出札、保管期限、箱の管理札。

Institution:
- library / archive。

Incident:
- `INC-GATE-001 夜明け前の閉鎖区画`の「今は閉じる→期限を失う」考え方を小さく先行。

Knowledge beat:
- 開ける / 閉じるではなく**誰が、いつ、期限を決めるか**。

Quiet:
ナギが小箱へ「まだ開けない」を選ぶordinary behavior。

Guard:
- 月箱をNight Origin deviceにしない。

---

# 5. Stage04 — `return_map_crossing` / 帰り道の交差点

Layer: `THRESHOLD / NIGHT`

Civilian anchor:
- 横断路、地図、工事迂回、手描き案内。

Institution:
- road / transport / municipal sign maintenance Candidate。

Incident:
- `INC-ROUTE-002 地図改訂連鎖` main-facing seed。

Knowledge beat:
> 古地図が間違いなのではなく、**当時は正しかった可能性**。

Sakumei mirror:
ミチグレの「間違う道なら消す」の反証を世界の地図履歴で準備。

Guard:
- 星が常に唯一の正解routeを教える設定にしない。

---

# 6. Stage05 — `repair_lamp_workshop` / 継火の修理工房

Layer: `REALITY-ECHO / NIGHT`

Civilian anchor:
- 工具、交換部品、修理日付、煤、作業椅子。

Institution:
- repair / small workshop / craft economy。

Incident:
- `INC-LAMP-001 継火修理記録`。

Knowledge beat:
- 同じObjectに異なる年代のrepair languageがあり得る。

B mystery:
ユイのランタンとトモリの修理痕は**似ているがsameObject未確定**。

Quiet:
トモリが戦闘と関係なく椅子を直している。

Guard:
- 「修理痕が同じ→トモリがユイへ直接渡した」を確定しない。

---

# 7. Stage06 — `chalk_classroom` / 白線の教室

Layer: `REALITY-ECHO / NIGHT`

Civilian anchor:
- 机の傷、出席札、忘れ物箱、黒板の日直跡。

Institution:
- school / education。

Incident:
- no major incident required。

Knowledge beat:
- 学び / 説明の仕方もEraによって違う。

Quiet:
センのair-drawing / 説明癖。

Mystery:
`C-independent`。世界を好きになるStageとして成立させる。

Guard:
- 学校を秘密組織の訓練校へしない。

---

# 8. Stage07 — `half_candy_arcade` / 半分の駄菓子横丁

Layer: `REALITY-ECHO / NIGHT`

Civilian anchor:
- 駄菓子屋、値札跡、包み紙、古看板、店先bench。

Institution:
- small retail / local economy。

Incident:
- none required。

Knowledge beat:
- World economyはgame currencyではなく、普通の人が小銭 / 日常価格で暮らした痕跡がある。

Quiet:
リツが反射で人数を数え、コヨリを含めて半分を分ける。

Emotional role:
Stage6–10のwarmthを支える。

Guard:
- 駄菓子を全てmystery item化しない。

---

# 9. Stage08 — `paper_cord_playground` / 紙縒りの遊び場

Layer: `REALITY-ECHO / NIGHT`

Civilian anchor:
- 遊具、子どもの名前跡、補修、地面の線。

Institution:
- school / park maintenance / household。

Incident:
- `INC-CIVIC-001 押花避難帳`へ繋げる場合も、災害を子どもCharacterのCoreへ自動化しない。

Knowledge beat:
- 「小さい人も人数に入る」がRelation themeとInstitutional recordの両方へ返る。

Quiet:
コヨリが物へ名前を書く。

Guard:
- child horror cliché（消えた子どもの声等）だけで怖さを作らない。

---

# 10. Stage09 — `old_compass_station` / 古針の駅前

Layer: `THRESHOLD / MULTI_ERA_OVERLAY`

Civilian anchor:
- bench、古い駅灯、時刻表跡、切符様式。

Institution:
- transport / station operations。

Incident:
- `INC-ROUTE-001 無番線案内`
- `INC-ROUTE-002 地図改訂連鎖`

Knowledge beat:
- Current側が初めて「同じNightにいる人物が、現実では同時代ではないかもしれない」と強く疑えるevidence band Candidate。

Quiet:
ゲンの「昔はこれで合ってた」が普通の駅話として先に出る。

Guard:
- ゲンが高齢だからOLD eraと断定しない。Object / station evidenceで示す。

---

# 11. Stage10 — `pressed_flower_archive` / 押花の保管庫

Layer: `RECORD / NIGHT`

Civilian anchor:
- 保存箱、季節ラベル、本、布包み。

Institution:
- archive / household preservation。

Incident:
- `INC-CIVIC-001 押花避難帳` optional evidence。

Knowledge beat:
- 保存 = 永久に閉じることではなく、**いつか手渡すために残す**場合もある。

Quiet:
以前預けた花がしおりになって返る。

Guard:
- ハナの保存思想をアサトジと同じにしない。consent / handoffが差。

---

# 12. Stage11 — `unposted_post_office` / 未配達の郵便局

Layer: `REALITY-ECHO / RECORD / NIGHT`

Civilian anchor:
- 仕分け棚、保管期限、返送印、職員の手書き補足。

Institution:
- postal / delivery。

Incident:
- `INC-POST-001 未配達保管延長` main echo。

Knowledge beat:
> 届かなかった = 誰も大切にしなかった、ではない。

Object thread:
- existing letter lineage。

Quiet:
ユウビが宛名を二度確認する。

Guard:
- 郵便局員全員がNightを知っている設定にしない。

---

# 13. Stage12 — `paper_plane_window` / 窓際の紙翼

Layer: `REALITY-ECHO / RECORD`

Civilian anchor:
- 窓、新聞 / 回覧、遠景、学校 / 住居の観測位置。

Institution:
- media / witness / school / household。

Incident:
- no single incident required; later Incident witness cross-checkに使える。

Knowledge beat:
- `FIRSTHAND`でも見えていない部分はある。
- マドカの「見た / 見えなかった」を分ける姿勢。

Quiet:
紙飛行機で注意を向ける。

Guard:
- 観測者 = 作者の正解を知る人、にしない。

---

# 14. Stage13 — `white_bookmark_library` / 白栞の未分類棚

Layer: `RECORD / NIGHT`

Civilian anchor:
- 未分類棚、注記、異版、blank card。

Institution:
- archive / library。

Incident:
- `INC-ARCHIVE-001 白紙台帳保存` strongest echo。

Knowledge beat:
- 分からないものを消す / 正しい箱へ押し込む / 未分類として残す、の3択。

Sakumei mirror:
- ハクマとの思想差を先にWorld behaviorで示す。

Quiet:
シロの未分類箱。

Guard:
- 未分類資料が後で全部Main Mysteryの答えになる宝箱化をしない。

---

# 15. Stage14 — `ticket_gate_station` / 片道ではない改札

Layer: `THRESHOLD / NIGHT`

Civilian anchor:
- 改札、切符穴、待合、帰宅案内。

Institution:
- station / transport。

Incident:
- `INC-ROUTE-001 無番線案内`
- `INC-GATE-001 夜明け前の閉鎖区画`

Knowledge beat:
> 境界は止めるためだけでなく、**戻れる状態を作るため**にもある。

Quiet:
雨が弱くなるまでトバリが皆を止める。禁止ではなくcare。

Guard:
- Gate = Night creator device、へしない。

---

# 16. Stage15 — `dream_waterway` / 夢頁の水路

Layer: `NIGHT-STRONG / UNKNOWN-MECHANISM-ADJACENT`

Civilian anchor:
- diary、sleep、water-side routineの痕跡。

Institution:
- medical / householdはaftercare側だけ。

Incident:
- none locked。

Knowledge beat:
- 夢に似ている現象がある ≠ Night全体が夢。

Sakumei:
- ユラネの思想を理解しやすくする環境seed。

Quiet:
ネムのsleep behavior。

Guard:
- **Night=dreamの証拠として使わない。**

---

# 17. Stage16 — `black_origami_roof` / 黒折り紙の屋根

Layer: `NIGHT / SAKUMEI-SHADOW COLLISION`

Existing leads:
- クロオリ
- カナメ

Enemy:
- オリネ

World purpose:
> Shadow5と朔盟が**似た問いへ別の立場から答えるが、同じFactionではない**ことを画面で示す重要Stage。

Knowledge beat:
- クロオリの「預かる」とオリネの「折って隠す」は似ているが、ownership / reopen rightが違う。

Sakumei clue:
- オリネのinvariant crease。
- 欠円はまだ説明しない。

Quiet afterimage:
戦闘後に黒紙を開けない選択が可能。

Guard:
- `kuroori`と`omburo_black_origami`の同一人物 / creator / blood relationを示さない。

---

# 18. Stage17 — `erased_name_wall` / 消し跡の壁

Layer: `NIGHT / RECORD`

Existing lead:
- カスミ

World purpose:
- privacy / erase / correctionを分離する。

Knowledge beat:
- カスミの「本人と公開範囲を選ぶ」
- ナシロの「正しい名前を固定」
- ペタの「新しい札で上書き」

は同じ名前themeでも違う。

Sakumei clue Candidate:
- wallの一部に、別Stageで見た欠円に似る空白輪郭。ただしCurrentはまだorganizationと断定しない。

Guard:
- theme similarityからFaction identityを推測で固定しない。

---

# 19. Stage18 — `ruler_rooftop` / 夜測りの屋上

Layer: `NIGHT / RECORD`

Existing lead:
- トキ

Institution echo:
- measurement / mapping / surveying / clock record。

Incident:
- `INC-ROUTE-002 地図改訂連鎖` late reinterpretation。

Knowledge beat:
> 測定値は嘘ではないが、**測った時点 / 条件が違えば両方正しい**ことがある。

Character mirror:
- ミチル / ゲン / トキ。

Sakumei relation:
- ミチグレの「間違う道を消す」思想を、測定でも一本道へできない夜で揺らす。

Guard:
- Science / measurementそのものを冷たい悪として描かない。

---

# 20. Stage19 — `blank_card_room` / 余白の部屋

Layer: `RECORD / NIGHT`

Existing lead:
- ツムギ

Enemy:
- ハクマ

World purpose:
- `空白`を3種類へ分ける。

```txt
ツムギ: 次を書ける余白として残す
シロ: 分からないまま未分類として残す
ハクマ: 誤解を防ぐため意味を消す
```

Knowledge beat:
- 何も書かれていないこと自体には善悪がない。**誰が、なぜ、後から書けるか**が違う。

Sakumei reveal:
- 欠円 / PACT記録の言葉が最も見えやすくなるCandidate。
- Formal name RevealはStage19前後が有力だがfinal placementはStory review。

Guard:
- ハクマ = ツムギのEnemy form、にしない。

---

# 21. Stage20 — `dawn_return_square` / 夜明け前の広場

Layer: `NIGHT → DAWN THRESHOLD`

Existing leads:
- Core5

World purpose:
- A-grade mysteryを説明する場所ではなく、**Title1で必要なC-grade local answerを払う場所**。

Payoffs:
- Game Over/deathでなく朝へ帰る選択。
- 黒耀化は外部人格ではない。
- 正解一つよりre-choiceの余白。
- Core5それぞれのDawn proof。

Historical echo:
- 地図 / 名前 / 箱 / repair等、前Stageで見た生活Objectがbackgroundで小さく再登場。

Sakumei:
- 朔盟のFounder / Originまで説明しない。
- Core5 Boss3との既存Enemy affinityを尊重。

Ending:
```txt
victory
→ short quiet
→ 帰路確認
→ ordinary callback
→ 朝
→ Realityの小さな変化
→ B/A anomalyを一つだけ
```

Guard:
- Night Origin exposition dump禁止。
- Happy Endを続編teaseで弱めない。

---

# 22. Stage-wide lore density rule

一つのStageに出す情報量:

- Main-facing world clue: 0–1
- Optional world detail: 1–3
- ordinary lived detail: 2–5
- Series A clue: 原則0、必要時1

**全背景物を伏線にしない。**

Playerが「この看板も全部伏線？」と警戒する世界より、普通の生活物の中に一部だけ意味がある方を狙う。

---

# 23. Stage progression as world discovery

```txt
1–5   ordinary place is slightly wrong
6–10  people actually lived here
11–14 institutions and records disagree
15    Night itself feels less stable
16–19 ideological mirrors / Sakumei structure become legible
20    local emotional answers are paid, larger mechanism stays open
```

---

# 24. Production rule

Background / prop generation packetには今後:

- Stage production source
- World layer
- institution
- era confidence
- culture zone
- incident echo
- ordinary detail list
- forbidden lore implication

を付ける。

これにより画像生成が勝手に:
- 全Stage同時代
- 全Stage同じ街
- 全Stage廃墟
- 朔盟とShadow同Faction
- Night=afterlife / dream

を示すことを防ぐ。