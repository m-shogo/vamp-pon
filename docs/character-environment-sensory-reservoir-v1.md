# ヨルノシルベ — Character Environment / Sensory Reservoir v1

Date: 2026-08-12  
Status: **AUTHOR RESERVOIR / NON-CANON / FREE TO OVERWRITE / NO DIAGNOSIS INFERENCE**

Upstream authority:

1. `docs/00-current-story-world-master.md`
2. `docs/character-behavior-identity-reservoir-v1.md`
3. `docs/character-lived-artifact-reservoir-v1.md`
4. `docs/character-reality-root-registry-v1.md`
5. `docs/character-author-db-schema-and-coverage-v1.md`

Machine source:

- `src/game/data/characterEnvironmentSensoryReservoir.ts`

## Purpose

Characterを「性格説明」「好きな食べ物」「髪色」だけで覚えさせず、**同じ街・同じ部屋・同じ雨の中に置いた時に反応が違う**状態を作者DBへ作る。

使い道:

- Character Bookの生活プロフィール
- 漫画 / Event sceneの背景選択
- Unity idle / environmental reaction
- Party sceneの座る場所・休む場所
- Reality Rootの生活感
- 季節差分
- 音響 / ambience direction
- 背景美術の小物配置
- relationship sceneの無言演出
- accessibility-aware scene planning

これはmedical profileではない。

> **環境への好み・癖・反応は、診断名や人格の答えではない。**

---

# 1. Nine axes

全36人に最低9軸を持つ。

1. `AMBIENT_SOUND` — 背景音のどこを拾うか / 何が日常音か
2. `LIGHT_LEVEL` — 光量・光の方向・glare・task lightへの反応
3. `WEATHER_RESPONSE` — 雨 / 風 / 暑さ / 寒さが行動をどう変えるか
4. `CROWD_DENSITY` — 人混みの中での位置・移動・距離の取り方
5. `TEMPERATURE_HABIT` — layer / airflow / 水分 / seat等のcomfort調整
6. `SMELL_ASSOCIATION` — 食 / 紙 / 雨 / 布 / 金属等が記憶にどう残るか
7. `TEXTURE_TOUCH` — 手・足・paw・sensor等で拾うsurface情報
8. `TRAVEL_ENVIRONMENT` — どんなroute / transit / pathを選びやすいか
9. `REST_ENVIRONMENT` — どんな空間なら警戒やtaskを下ろせるか

Machine target:

```txt
36 characters × 9 axes = 324 environment/sensory anchors
```

---

# 2. Hard boundaries

このReservoirから勝手に決めない:

- autism / ADHD / sensory processing disorder等の診断
- hearing / vision / smell disorder
- trauma history
- intelligence
- morality
- introvert / extrovertの確定
- nationality / birthplace / bloodline
- sexuality / gender identity
- exact occupation
- exact disability details not already Current
- exact historical climate/event
- exact Star Beast / constellation effect

禁止shortcut:

- 静かな場所が好き = 内向的
- 人混みが苦手 = 人嫌い
- 明るい光が苦手 = trauma
- 物音に気づく = 神経質
- 匂いに敏感 = 特殊能力
- 暑さに強い = 南国出身
- 寒さに強い = 北国出身
- 高齢 = 暗い所 / 静かな所が好き
- ぽっちゃり = 暑がり / 食の匂いに反応
- wheelchair user = 静かな安全routeだけを好む
- Robot / artificial body = 感覚がない / 感情がない
- dog / cat = 人間の嘘や悪意を嗅ぎ分ける
- feminine presentation = perfume / soft texture好きと固定
- gender undisclosed = neutral / grey /無機質な感覚嗜好

**Root / body / gender / speciesと環境反応を一対一に結びつけない。**

---

# 3. Current21 — author highlights

| Character | Environment identity highlight |
|---|---|
| ユイ | 街の雑音は日常。notificationだけは注意を引く。大事な会話ではscreenより人へ戻る。 |
| アサ | system alertを扱えても、それをHuman voiceより上位に置かない。Humanとしてweather / comfortを持つ。 |
| ナギ | 音量よりsourceが分かること、混雑度よりexitとpersonal boundaryが読めることを重視。 |
| ミチル | 足音・交通・雨・路面をroute情報として拾う。天候を「不機嫌装置」にはしない。 |
| トモリ | tool / motor / materialの音と触感が生活情報。暗い工房をCharacter記号にしない。 |
| セン | group noiseの中で「発言しなくなった人」を見落とさない方向。説明しすぎる癖と接続可能。 |
| リツ | 人数・荷物・shared comfortへ先に意識が向く。守護者役だけに固定しない。 |
| コヨリ | 子どもらしくattentionが動く。busy spaceを楽しむ日も、自分のspaceを欲しがる日もある。 |
| ゲン | old/newの環境差を知っているが「昔の方が良かった」固定にしない。 |
| ハナ | 保存 / 布 / 小物の扱いへseasonが出る。plus-size older bodyに普通のcomfort設計を持つ。 |
| ユウビ | transit / footstep / handoff soundとrouteを結ぶ。速さより「渡して戻れる」が重要。 |
| マドカ | window / side light / distant traffic等、背景layerを拾う。観察=spy能力にはしない。 |
| シロ | page light / glare / humidity等を物の状態として拾う。静寂必須Characterにはしない。 |
| トバリ | 新宿のnight transitを「危険な夜」ではなく生活音として扱える。return routeが重要。 |
| ネム | soft環境はrest候補だが、bright task lightで活動する場面も普通に持つ。 |
| クロオリ | privacyは暗闇ではなく「開け方 / 閉じ方を本人が選べる」環境で表現。 |
| カナメ | crowdの問題は社会不安ではなく実際のclearanceもある。188cm/112kgのbody spaceを自然に設計。 |
| カスミ | quiet / low contrastを「存在を消したい人格」と決めない。provisional choiceが許される空間。 |
| トキ | rhythm / interval / thresholdを情報として拾うが、診断やcompulsionへ短絡しない。 |
| ツムギ | texture / humidity / seam / unfinished workが環境差になる。完璧なflat surfaceを正解にしない。 |
| レン | 微差を拾うが、人をsampleにしない。比較を止めて会話へ戻る環境beatを持つ。 |

---

# 4. Future15 — author highlights

Future15は情報が増えてもCurrent21へ昇格しない。

| Character | Environment identity highlight |
|---|---|
| ヒヨリ | livelyな場所もquietな場所も選べる。brown skinから気候・音楽・paletteを逆算しない。 |
| セリカ | formal / busy groupを扱えるが、環境管理を全部本人へ背負わせない。 |
| クロエ | 長寿なので同じ雨・同じ街の意味が時期で変わる。nostalgiaだけで人格化しない。 |
| レンジ | craft sound / material / heatを知るが「師匠の工房の人」で終わらせない。 |
| トウマ | workshopの感覚情報はauthorshipへ接続。skin toneやsexualityとは無関係。 |
| クウ | dogとしてsmell / ground / soundを強く使うが、truth detectorにはしない。 |
| ヨモ | catとしてmultiple homeの匂い・暖かい場所・escape optionを持つ。tourism mascot化禁止。 |
| ノア | sensor capabilityとpersonal preferenceを分離。精密sensor = emotionlessではない。 |
| ルム | service sensor / dock / routeがinstance固有の「いつもの場所」へ変化し得る。Human化をgoalにしない。 |
| マキ | 天気が変わればplanを変える。決断力 = 我慢強さ / 暑さ寒さ無視にはしない。 |
| スズ | light / fragrance / fabricをpresentationとして楽しめるが、sexualityのsymbolにはしない。 |
| イオ | soundが重要でも「謎めいた中性的voice/space」を自動付与しない。 |
| カイ | twin shared homeを持っても環境嗜好は個人。movement / rejoin寄りCandidate。 |
| ナオ | twin shared homeを持っても環境嗜好は個人。pause / aftertone寄りCandidate。対になる義務なし。 |
| アマネ | wheelchair accessは実際のroute / surface / weather要件として設計し、人格・悲劇・治療へ変換しない。 |

---

# 5. Environment is relationship material

同じCharacterでも相手によって環境の意味が変わってよい。

Examples:

- 一人なら選ぶ端席を、trusted personとなら中央で選べる。
- 普段はnotificationへ反応する人が、その人との会話では端末を伏せる。
- repair soundが落ち着く人でも、相手が話し始めたら工具を止める。
- busy spaceが好きな人が、特定の会話では静かな場所を選ぶ。
- 同じ雨の匂いが、Seasonを跨いで別のmemoryへ変わる。
- twinsが同じ家の匂いから別の出来事を思い出す。
- long-lived Characterが同じstreet soundを別Eraで別の意味として聞く。

> **環境反応は固定traitではなく、relationship / history / contextで変化してよい。**

---

# 6. Era / Root research boundary

Reservoir段階ではgeneric生活素材でよい。

以下へ昇格する時だけ追加researchする:

- specific prefecture / cityの実際の気候
- historical street sound
- historical lighting technology
- transit chime / infrastructure
- period-correct material / household appliance
- local plants / food smell
- actual accessibility condition
- animal welfare / species-specific behavior
- future device / sensor details

Candidate Rootを「暑さに強い」「雪が好き」等の逆算でCanon化しない。

---

# 7. Accessibility is not personality

特にアマネは:

- slope
- curb
- doorway width
- wet surface
- wheel grip
- crowd clearance
- table / counter height
- seating geometry
- rain cover
- transfer / rest space when story-relevant

を**world designの実在条件**として扱える。

ただし:

- wheelchair userだから静かな場所が好き
- wheelchair userだから慎重
- wheelchair userだから人混み嫌い
- wheelchair userだから助けを求められない
- wheelchair = 悲劇 / 克服 / cure goal

にはしない。

同様にカナメの大きなbody、ハナのplus-size older body、コヨリのchild bodyも、実際のspace / fitは設計するが性格の答えにはしない。

---

# 8. Nonhuman / artificial sensory rules

## クウ / ヨモ

species-appropriateな嗅覚 / 聴覚 / ground感覚は使える。

禁止:

- 犯人だけに吠える
- 嘘を嗅ぎ分ける
- 善人へだけ懐く
- supernatural future prediction

## ノア / ルム

sensor specificationとpersonalityを分離する。

```txt
sensorCapability != personalPreference
functionalLimit != emotion
maintenanceNeed != moral weakness
preciseDetection != perfectInterpretation
```

「人間の感覚を得ること」が成長の唯一goalではない。

---

# 9. Production hooks

このReservoirは直接runtimeへ接続しない。

将来のhandoff候補:

- Character Book: `environment cards`
- Relationship page: `same place / different reaction`
- Background generator: preferred / avoided composition candidate
- Voice direction: background noiseに対するspeech change
- Animation: rain / crowd / rest idle variants
- Audio: Character-specific attention target, not Character-specific soundtrack stereotype
- Lorebook: Rootと生活環境を別fieldで表示
- Accessibility QA: body / deviceが背景geometryで破綻しない確認

`runtimeAutoPromotionAllowed = false`

---

# 10. Author DB integration plan

Current Author DBは9 dimensions。

このReservoirがmainへ入った後、別PRで10th dimension:

```txt
environmentSensory
```

として追加する。

その時も:

- `36 / 36` coverage
- status inheritance
- Future15 no promotion
- Candidate no Canon promotion
- alias navigation only

を維持する。

---

# 11. QA checklist

- [ ] 36 characters covered
- [ ] 9 axes each
- [ ] 324 anchors total
- [ ] Asa remains Human
- [ ] Kaname body size does not define slowness / heat stereotype
- [ ] Hana body/age does not define comedy / quietness
- [ ] Gen age does not define sensory decline
- [ ] Hiyori/Touma skin tone does not define climate/origin
- [ ] Suzu presentation does not define fragrance/light preference
- [ ] Io undisclosed gender does not define neutral environment
- [ ] Amane accessibility is real world geometry, not personality
- [ ] Kuu/Yomo species senses are not supernatural truth detection
- [ ] Noa/Rum sensors do not erase emotion/personhood
- [ ] Kai/Nao are not mirror-opposites
- [ ] no diagnosis inference
- [ ] no runtime promotion

Guiding principle:

> **同じ夜、同じ雨、同じ人混みでも、36人には36通りの「そこに居る感じ」がある。**
