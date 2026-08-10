# ヨルノシルベ Character Reference Readiness Audit v1

Date: 2026-08-10  
Status: **CURRENT ART-PRODUCTION AUDIT / REFERENCE APPROVAL != FINAL OR RUNTIME APPROVAL**

Sources:

- `src/game/data/goldenReferenceRegistry.ts`
- `src/game/data/characterReferenceProductionQueue.ts`
- `src/game/data/characterVisualGenerationBriefs.ts`
- `src/game/data/assetFactoryCharacterPrompts.ts`
- `scripts/quality/check-character-reference-readiness.ts`
- `tools/asset-factory/CURRENT21_SILHOUETTE_PROMPT_INTEGRATION.md`

---

## 1. Audit rule

次の状態を混同しない。

```txt
file exists
!= approved style / identity reference
!= approved final art
!= approved runtime art
!= runtime wired
```

画像ファイルがrepoにあるだけでCurrent finalへ昇格しない。
Golden Reference Registryの承認も**reference用途**であり、runtime/final approvalとは別。

---

## 2. Verified current facts

### Core5 character-master files

次のmaster imageはrepo上に存在する。

- `assets/reference/character-master/core5/yui-character-master-v1.png`
- `assets/reference/character-master/core5/asa-character-master-v1.png`
- `assets/reference/character-master/core5/nagi-character-master-v1.png`
- `assets/reference/character-master/core5/michiru-character-master-v1.png`
- `assets/reference/character-master/core5/tomori-character-master-v1.png`

ただし、存在すること自体はreference approvalを意味しない。

### Golden Reference Registry

Current explicit character identity approval:

- **ユイ** — `character:yui:identity-v1` / `approved-style-reference`

Yui assets are explicitly:

```txt
approvedForReference = true
approvedForRuntime = false
approvedAsFinal = false
```

したがって、Yuiすら「final/runtime approved character art」とは扱わない。

### Hana / Kaname

Asset Factoryのreference-first expected outputs:

- `public/assets/prototypes/characters/hana/references/hana-reference-v1.png`
- `public/assets/prototypes/characters/kage1/references/kage1-reference-v1.png`

2026-08-10の直接確認時点では両方とも未存在。

これは問題というより、**production prompt / silhouette canonが先に整ったので、次にreference artを作るべき明確なgap**。

---

## 3. Production routing

### P0 — new reference generation first

#### ハナ

理由:

- plus-size older woman hard lock
- body / age / rounded shawl / preserved-object handlingが生成defaultで崩れやすい
- 細身化 / 若返りを禁止済みだが、まだ実画像evidenceがない

Required first asset:

```txt
character_reference
```

Review:

- plus-size bodyが正面/斜めで維持
- 年齢線を消していない
- 丸いショールで身体を隠して誤魔化していない
- 花 / 箱 / 白鳥が本人より主役になっていない
- food comedyなし

#### カナメ

理由:

- plus-size young adult man hard lock
- thin anime male / bodybuilder triangleへmodelが補正しやすい
- fast interceptと大きな柔らかいsilhouetteを両立させる必要がある

Required first asset:

```txt
character_reference
```

Review:

- broad + thick soft torso
- bodybuilder化していない
- 受け灯の腕帯が読める
- gray wolfが本人を食っていない
- 鈍重 / 大食い / 汗ギャグなし

### P1 — existing Core5 master review

再生成を先にしない。

- アサ
- ナギ
- ミチル
- トモリ

Current21 silhouette matrixへ照らし、既存masterが通るなら**その画像を活かしてreference registry candidateへ進める**。

特にトモリはwork goggles / repair posture hard anchorを持つため、既存masterをCurrent contractで再審査する。

### P1 — hard-anchor reference generation

- ゲン — 年長男性 / 若返り防止
- シロ — 丸メガネ + page posture / レンとの差別化

### P2 — remaining Current20

Reference-firstで順次生成:

- セン
- リツ
- コヨリ
- ユウビ
- マドカ
- トバリ
- ネム
- クロオリ
- カスミ
- トキ
- ツムギ

いきなりsprite/cutinを量産せず、referenceでbody / pose / clothing / Named Objectを先に確認する。

---

## 4. Yui handling

ユイは既存approved referenceを**維持して再検証**する。

- 新しいCurrent21 silhouette matrixと矛盾しないか見る
- 問題がなければ再生成しない
- 「新しいAIの方が綺麗そう」だけを理由にidentityを交換しない

Reference continuityを優先する。

---

## 5. Reserve Ren

レンはCurrent21 silhouette coverageには含まれる。

しかし既存Asset Factory Character DatabaseはCurrent20 production scope。

したがって:

```txt
Ren silhouette ready
!= Current20 generation queue entry
!= playable promotion
```

Reserve production scopeを明示的に開くまで自動追加しない。

---

## 6. Reference-first downstream rule

推奨順:

```txt
character_reference
↓
visual review
↓
reference approval / candidate registration
↓
sprite_sheet_180
↓
normal cutin
↓
dawn cutin
↓
kokuyou cutin
↓
emblem phases
```

Hard visual anchorを持つCharacterは特にreference review前の新規downstream量産を避ける。

既存assetを削除するという意味ではない。

---

## 7. Machine audit

`check-character-reference-readiness.ts` は:

- Current20 exact coverage
- Core5 master existence
- Golden identity registration
- Asset Factory expected reference output existence
- P0 exact Hana / Kaname
- Reserve Ren exclusion
- approvedForReference / runtime / final separation

を検査する。

新しいreference imageがrepoへ入ったら、`reference_generation_required`のまま放置するとfailする。
つまり**画像追加後にqueue/approval stateを必ず更新**する。

---

## 8. Next production target

最初の新規画像target:

1. **Hana character_reference**
2. **Kaname character_reference**
3. existing Core5 master review
4. Gen character_reference
5. Shiro character_reference
6. remaining Current20 references

これは人気順位ではない。
**誤生成risk / existing evidence / downstream leverage**で並べたproduction order。

> **人物絵を増やす前にidentityの基準を作る。基準がある人物からsprite・cutin・季節絵へ広げる。**
