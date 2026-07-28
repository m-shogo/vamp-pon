# ヨルノシルベ Character / Story / Gameplay Integration Hub

Date: 2026-07-29  
Status: **CURRENT CROSS-DOMAIN ENTRYPOINT / RUNTIME READINESS UNAFFECTED**

> Character・関係・黒耀化・Stage・Enemy・夜明け星図・Happy Endを一つの作品として考える時はここを入口にする。
>
> 目的は資料を増やすことではなく、「この人物設定が何のGameplayへ返り、どこで回収されるか」を迷わず追える状態を作ること。

---

# 1. Read order

```txt
CANON.md
↓
game-core-book-v1.md
↓
GAME-DESIGN.md
↓
CHARACTER-STORY-INTEGRATION.md
├ CHARACTER
│ ├ CHARACTERS.md
│ ├ character-book-v4.md
│ ├ character-deep-core-book-v1.md
│ └ character-dialogue-relationship-book-v1.md
│
├ RELATIONSHIP
│ ├ RELATIONSHIPS.md
│ ├ character-relationship-arc-book-v1.md
│ ├ character-ensemble-daily-scene-bank-v1.md
│ └ character-voice-differentiation-guardrails-v1.md
│
├ 黒耀化
│ ├ BLACK-YOUKA.md
│ └ character-black-youka-rescue-book-v1.md
│
├ STORY / STAGE
│ ├ STORY.md
│ ├ story-book-v1.md
│ ├ story-main-beat-sheet-v1.md
│ ├ story-stage-character-relationship-placement-v1.md
│ └ STAGE-ENCOUNTER-DESIGN.md
│
├ PAYOFF
│ ├ character-dawn-proof-book-v1.md
│ └ character-story-gameplay-payoff-matrix-v1.md
│
└ ENEMY
  ├ ENEMIES.md
  ├ enemy-encounter-relationship-pressure-v1.md
  ├ enemy-ecology-and-encounter-recipes-v1.md
  └ kagemono-collection-entry-book-v1.md
```

---

# 2. Current21 integration rule

各人物は最低限:

```txt
1. everyday signature
2. voice / reflex phrase
3. distinctive relations >= 2
4. gameplay verb
5. same-root weakness
6. black-youka wrong arrival
7. rescue option
8. enemy pressure connection
9. Clear Getter seed
10. dawn proof
```

を持つ。

これは全10項目をMain Story cutsceneへ出す意味ではない。

情報の出し場所を分散する。

---

# 3. The full chain

ヨルノシルベの人物設計は次の鎖で考える。

```txt
普段の長所 /癖
↓
戦闘で役に立つ
↓
同じ長所が関係摩擦を起こす
↓
Enemy encounterがその一択思考を圧迫
↓
黒耀化でwrong arrival
↓
仲間が別の選択肢をGameplayで作る
↓
本人 / Playerが選ぶ
↓
同じ力を安全に扱える
↓
夜明け星図に別play条件として返る
↓
夜明け後、日常の小さな行動が変わる
```

この鎖の途中へ返らない秘密設定は、採用優先度を下げる。

---

# 4. Stage spine

| Stage | Core | 問い | Main mirror | Main gameplay word |
| --- | --- | --- | --- | --- |
| 1 | ユイ | 全部戻すべきか | クロオリ / アサ | pickup / owner / hold |
| 2 | アサ | 名前を返せば本人を分かったことになるか | カスミ | mark / visibility / consent |
| 3 | ナギ | 守るためなら閉じてよいか | カナメ / トバリ | seal / guard / reopen |
| 4 | ミチル | 正しい道は一つか | トキ / ゲン | route / measurement / reroute |
| 5 | トモリ | 元通りだけが修復か | ツムギ / ユイ | repair / scar / completion |

Stage5で共通Themeへ収束:

> **大切にすることは、一つの完成形へ固定し続けることではない。**

ただしMain Mysteryの完全回答として自動LOCKしない。

---

# 5. Narrative density

ヨルノシルベ1で36候補全員をMain Storyへ入れない。

## Spine 6

ユイ / アサ / ナギ / ミチル / トモリ / クロオリ

## Major rotating 7

カナメ / カスミ / トキ / ツムギ / リツ / コヨリ / ネム

## Supporting / Optional 8

セン / ゲン / ハナ / ユウビ / マドカ / シロ / トバリ / レン

## Future15

Future poolのまま。
Current21へ自動昇格しない。

---

# 6. Main ending priority

Main Happy Endで全21人の成長説明を並べない。

画面で優先:

1. ユイが落とし物を即拾わない
2. アサが呼び方を本人へ聞く
3. ナギが開く条件を本人へ聞く
4. ミチルが複数routeを描く
5. トモリが古い修理跡を消さない
6. クロオリが開封判断を本人へ返す

残りは:

- Result
- character dawn scene
- Bond
- 灯し手の記録
- special clear

へ自然に分散する。

---

# 7. Mystery debt protection

新しい設定を置く時に必ず分類する。

## C級

1で答える。

- その人物が何を学んだか
- Main relationの感情決着
- 1のHappy Endに必要な理由

## B級

1でかなり意味が分かるが、後作で再解釈可能。

- ランタン継承
- 星獣の一部反応
- クロオリの預かり物

## A級

series全体。

- 夜の完全な正体
- 星獣の完全原理
- 世界システムの創設理由

禁止:

> A級を神秘的に見せるためにC級まで説明不足にする。

---

# 8. Enemy integration

EnemyはCharacter専用心理モンスターではない。

同じmechanicが複数人物の問いを圧迫する。

```txt
名札:
アサ / カスミ / ユウビ / ユイ

封鎖:
ナギ / カナメ / トバリ / クロオリ

route:
ミチル / トキ / ゲン / マドカ / レン

repair / preservation:
トモリ / ツムギ / ハナ / シロ
```

この横断性で敵数を増やさず再プレイ時の意味を増やす。

Stage1〜5で実際にどうpressureを組むかは `STAGE-ENCOUNTER-DESIGN.md` をCurrent masterとして使う。

---

# 9. Runtime boundary

このIntegration Hubと関連docsは**企画 / production design memory**。

これだけでは:

- Unity runtime変更済み
- Story event実装済み
- 黒耀化性能変更済み
- enemy mechanic実装済み
- Bond runtime実装済み
- U49 ready
- U50 ready
- RC ready

とは扱わない。

実装は別phaseでDefinition / Runtime / Save / UI / evidenceを揃えて昇格する。

---

# 10. Machine-readable memory

- `docs/design-targets/generated/character-black-youka-rescue-map-v1.json`
- `docs/design-targets/generated/story-stage-character-placement-v1.json`
- `docs/design-targets/generated/character-dawn-proof-map-v1.json`
- `docs/design-targets/generated/character-story-gameplay-payoff-map-v1.json`

---

# 11. 一文

> **ヨルノシルベの人物は、プロフィール・会話・戦闘・黒耀化・敵・周回・夜明けを別々に作らず、同じ長所がその全部で違う形を取るように設計する。**
