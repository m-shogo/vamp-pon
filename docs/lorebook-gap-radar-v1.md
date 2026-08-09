# ヨルノシルベ Lorebook Gap Radar v1

Date: 2026-08-09  
Status: **CURRENT GAP INVENTORY / DO NOT AUTO-CANONIZE**

## 1. Purpose

「まだ決まっていない」と「まだ実装していない」と「意図的に決めない」を分ける。

```txt
OPEN QUESTION
  物語・世界設定として答えがまだない

CANDIDATE
  強い案はあるがHuman decision前

DESIGN DEBT
  方針はあるが情報密度が不足

IMPLEMENTATION GAP
  正本はあるがWeb/runtimeへ未接続
```

---

# 2. Story / World — 最優先でまだ詰まっていない

## A1. 夜の最終的な正体

Current:
- 別時代の人物が会える
- 朝へ戻る
- 物 / 言葉 / 記録が現実時間を渡れる

未LOCK:
- 夢なのか
- shared memoryなのか
- 境界領域なのか
- 誰が作ったのか
- なぜ必要だったのか

Recommendation:
- 1作目では「別時代の記憶・物・言葉が重なる境界領域」まで
- 完全な宇宙論はSeries Mysteryへ残す

## A2. 黒インク Story Engineの最終採用

Strong candidate:

> 悲しい出来事そのものではなく、その出来事についた「一つの意味」が固定された状態。

未LOCK:
- Main Mysteryの最終法則にするか
- 黒耀化との厳密な因果
- 敵の生成との関係

## A3. 夜を作った主体 / 必要性

誰か一人の悪意へ単純化しない方が現設計とは相性が良い。
ただし creator / emergent phenomenon / accumulated human system のどこへ寄せるか未確定。

## A4. 星獣の完全な仕組み

Current Canon:
- IAU生物星座
- favorite constellation
- 星獣
- 重複は意味のある関係のみ
- 誕生日占いではない

未LOCK:
- なぜ星獣が生まれるか
- 誰に見えるか
- 夜の外でも存在するか
- 記憶をどこまで持つか
- 黒耀化時に何が変わるか
- assistをGameplayへ入れるか

## A5. ユイ × トモリの獅子 / ランタン真相

Current Canon:
- Leo shared
- トモリはユイのランタンを知る
- 修理 / 継火との強い接続

未LOCK:
- 血縁
- 遠い親族
- 技術継承
- 同じランタンの歴史
- shared memory / fire lineage

Current recommendation:
**同一Named Objectの継承を先に強くし、血縁は後から必要なら足す。**

## A6. Current21 Relative Era

Exact yearは意図的に未LOCK。

不足:
- language marker
- technology marker
- food / clothing marker
- transport marker
- object age evidence
- confidence

History Atlasは入ったが人物21人のEra evidence tableはまだ未完成。

## A7. クロオリが具体的に預かっているもの

Strong candidate:
- 本人が「今は返さないで」と預けたconsent-sealed memory

未LOCK:
- 誰の記憶か
- ユイ本人と関係するか
- Main Mysteryへ直結させるか

## A8. sequelへ残す最小の違和感

1作のHappy Endを壊さないことが絶対条件。

Strong candidate:
- 誰の手癖でもない小さな修理痕

未LOCK:
- object
- location
- sequel protagonistとの関係

---

# 3. Character — まだ密度差がある

## B1. 黒耀化の固有呼称

- ユイ `黒灯化` は強く継承
- 他20人はWorking / Human Naming Review前

全員を同じ命名patternへ揃えない。

## B2. 24 relationのarc密度

Current:
- priority relations = 24
- full 5-stage production arc = 12

不足:
- 残り12 relationの First read / friction / failure / chosen trust / Dawn proof

全210 pairを埋める必要はない。
重要なのはCurrent21全員が別相手で違う面を見せること。

## B3. Romance / family / friendshipの長期配置

Currentで明確:
- ユイ×アサ non-romance
- リツ×コヨリ siblings / non-romance

Future15や長命の魔女を含む恋愛史はCandidate reservoirが大きいが、Current本編で誰をどこまで恋愛へ寄せるかは未LOCK。

## B4. Shadow visible name runtime migration

Story/profile:
- カナメ / カスミ / トキ / ツムギ

Runtime IDs:
- kage1..4 keep

`characterThemeColors.ts` はcompatibility name + current displayNameを両方持つようにした。
ただしruntime display-name migration自体は別gate。

---

# 4. Gameplay / Lore bridge — 正本はあるが未接続

## C1. Star Beast combat assist

Canon adoption != runtime implementation。
今はプロフィール / 日常 / Collection / visual clueとして扱う。

## C2. Bond / Support

強いdesign方向はあるが、Support slot / save / modifier / progression runtimeは別実装gate。

## C3. Named Object read model

Current foundationは存在するが、Lorebook / game runtime / archiveの完全な双方向cross-linkは未完成。

## C4. Global constellation / Clear Getter runtime

Definition foundationはあるがruntimeFrozenではない。
100% rewardを誤解放しない。

---

# 5. Lorebook Product — まだ実装していない

## D1. Portrait / silhouette image connection

今の人物カードは文字・色・星獣で識別する。
Production portrait / silhouette image authorityとの接続は未実施。

優先度: HIGH

理由:
- 3秒で人物を思い出す性能が大きく上がる
- 攻略本らしさが増す

ただしcandidate assetをfinal portraitとして混ぜないapproval boundaryが必要。

## D2. Constellation mini visual

今は星座名 / 星獣名 / colorまで。
将来:
- biological constellation mini-line
- star beast silhouette
- shared constellation clue

を1カードへまとめられる。

優先度: HIGH

## D3. Author DB / Editor

Current:
- Git-reviewed JSON read model

未実装:
- authentication
- draft edit
- preview diff
- source mandatory
- CANON promotion action
- audit history

優先度: MEDIUM-HIGH

## D4. Hosting

`dist/lorebook/` deploy artifactまでは作れる。
既存repoにhosting providerの正本がないため、公開先は未選択。

## D5. Spoiler taxonomy

Current:
- normal
- author mode

将来は:
- spoiler-free
- game-clear
- deep lore
- author-only

等へ細分化余地あり。

## D6. Cross-domain search

Current:
- character search
- glossary search

未実装:
- relation
- object
- stage
- enemy
- mystery
- source

を横断するcommand/search palette。

## D7. Visual regression

CIはsyntax / schema / build artifactを検証。
まだbrowser screenshot baseline / visual diffはない。

---

# 6. Priority order

```txt
P0  scroll / theme DB / deprecated zodiac cleanup      DONE in current PR
P1  Current21 portrait / star-beast visual connection
P1  remaining 12 strong relation arc depth
P1  Relative Era evidence for Current21
P2  spoiler taxonomy / cross-domain search
P2  Author DB / Editor
P2  hosting
P3  Star Beast gameplay assist prototype
```

StoryのA1〜A8は、実装都合で答えを固定しない。
Webが「空欄を埋める圧力」にならないことを守る。
