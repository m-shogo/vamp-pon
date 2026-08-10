# ヨルノシルベ — Shared Source Audit v1

Date: 2026-08-10  
Status: **CURRENT AUDIT / DERIVED FROM EXISTING AUTHORITIES — NOT A NEW CANON BOOK**

Machine-readable audit authority:

- `src/game/data/sharedSourceContracts.ts`
- validation: `scripts/quality/check-shared-source-foundation.ts`

この文書は設定を作り直すための正本ではない。
既存のCurrent authority / runtime / visual / generation / QAを横断し、**画像生成前に何が足りないか**だけを一枚で確認するためのradar。

## Hard boundary

- Character / Enemy / Stage等の既存ID・物語事実をこのauditから変更しない。
- `Current / Candidate / Reserve / Future` を混ぜない。
- `referenceGenerationReady = true` は **候補画像を作るbriefが揃った** という意味であり、runtime承認でも最終画像承認でもない。
- `APPROVED_REFERENCE != APPROVED_WEB != APPROVED_UNITY != PRODUCTION_READY`。
- Toumonは形状をAI画像生成で決めない。final vector geometryができるまで画像生成hold。
- Web用heroをUnity runtime spriteへ直接流用しない。
- 黒インク派生を全カテゴリ・全敵へ自動適用しない。

## Audit radar

| Category | Maturity | Reference generation | Primary authority / gap |
| --- | --- | --- | --- |
| Characters | STRONG | READY | Current21 commercial / silhouette / Theme / generation基盤あり。final approved referenceは別gate。 |
| Star Beasts | PARTIAL | HOLD | 21 assignmentはmachine-readable。beast-first三面/pose/material/plush master不足。 |
| Named Objects | STRONG | HOLD | stable registry/lineageあり。front/back/side・scale・wear/repair・replica detail不足。 |
| Toumon | STRONG | HOLD | simple sigil意味/文法はCurrent。final vector geometry未作成のため画像生成しない。 |
| Enemies | STRONG | READY | Current48 DBを維持し、family visual grammar / icon / motion / avoidをShared Source化。 |
| Bosses | STRONG | READY | Current48内boss rankを同じauthorityからfilter。別DBへ複製しない。 |
| Weapons | PARTIAL | HOLD | runtime combat + Named Object lineageあり。shape/material/effect/evolution/icon visual grammar不足。 |
| Items | PARTIAL | HOLD | item asset production DBあり。rarity/stack/pickup VFX/unified icon/goods rule不足。 |
| Stages | PARTIAL | HOLD | stage production DBあり。sky/weather/light/terrain/architecture/landmark/route/crop safety不足。 |
| Clear Getter | PARTIAL | HOLD | completion architecture + Stage1 runtime foundationあり。launch全node/visual stamp/reward ID不足。 |
| Achievements | PARTIAL | HOLD | runtime 14 defsあり。icon/stamp/spoiler/relation/presentation contract不足。 |
| Rewards | PARTIAL | HOLD | runtime reward behaviorあり。stable reward registry/type/preview/presentation不足。 |
| Unlockables | PARTIAL | HOLD | save/runtime stateあり。standalone registry/spoiler/preview visual contract不足。 |
| Collectibles | PARTIAL | HOLD | collection/named-object dataあり。digital/physical shared visual grammar不足。 |
| Routes | DOCS_ONLY | HOLD | world/IP directionあり。route ID/node/sign machine source不足。 |
| Stations | DOCS_ONLY | HOLD | station directionあり。code/name/stamp machine source不足。 |
| Tickets | DOCS_ONLY | HOLD | ticket directionあり。front/back/punch schema machine source不足。 |
| Stamps | DOCS_ONLY | HOLD | route/achievement方向あり。ID・Toumonとの区別・small-size rule不足。 |
| UI Symbols | PARTIAL | HOLD | Toumonはstrong。一般UI semantic icon matrix不足。 |
| World Effects | PARTIAL | HOLD | palette/glow/runtime visual tokenあり。semantic effect registry / safety / audio/haptic hook不足。 |
| Collection | PARTIAL | HOLD | runtime collectionあり。digital/physical section taxonomyとexporter不足。 |
| Night Record Book | PARTIAL | HOLD | newer commercial architectureと旧runtime namingのreconciliationが必要。 |

## Existing sources we must reuse

### Enemy / Boss

`src/game/data/enemyProductionDatabase.ts`

- Current48を保持。
- id / display name / rank / family / readable role / wrong reading / released clue / movement / attack cue / silhouette / palette / stage affinity / drop hintを再定義しない。
- `src/game/data/enemyVisualSharedSource.ts` は**visual grammar adapter**であり、元DBを置き換えない。

Family grammar:

- `ombu` — 小型・丸いink-memory body + 1 motif、腕なし。
- `omburo` — 幅広いmass + 太い両腕、bodybuilder/ogre化しない。
- `wrong_reading` — 日用品/route/markの誤読を主役にし、mimic monster化しない。
- `great_shadow` — stage/object landmarkを巨大な誤読として見せ、kaiju/demon化しない。

Variants:

- NORMAL / ELITE / BOSSは既存rankからprimaryを決める。
- BLACK_INK_VARIANTは `EXPLICIT_APPROVAL_ONLY`。
- DAWN_CLEANSEDは `REFERENCE_ONLY`。

### Items

`src/game/data/itemAssetProductionDatabase.ts`

既にCharacter item lineage + field dropと5種prompt targetを持つ。P3ではこの正本を壊さず、Shared Source fieldへadapterする。

### Stages

`src/game/data/stageProductionDatabase.ts`

既にstage id / lead / story / motif / enemy / item / mechanic / color script / promptを持つ。P4ではvisual environment grammarとoutput targetを足す。

### Named Objects

`src/game/data/namedObjectRegistry.ts`

stable ID / Character lineage / Stage / gameplay / relationship / archive connectionを持つ。P9はこのlineageへ三面図・material・wear/repair・replica approvalを追加/adapterする。

### Clear Getter

- `docs/CLEAR-GETTER-AND-100-PERCENT-REWARD.md`
- `src/game/data/collectionProgress.ts`

Full constellation architectureはCurrent directionだが、exact launch node countは未LOCK。既存Stage1 25 cellsをそのまま全Stageへ複製しない。

## First generation-ready scope after this pass

画像本体を生成した、という意味ではない。
**Reference candidate generationへ進められるShared Source**として、現時点では:

1. Characters
2. Enemies
3. Bosses

をmachine auditで明示する。

Toumonは明示hold。
Star Beast / Named Objectはidentityは強いがbeast-first / object-first visual master不足のためhold。

## Next implementation order

1. Weapon Shared Source adapter
2. Item Shared Source adapter
3. Stage visual/environment Shared Source
4. Clear Getter / Achievement normalized visual source
5. Reward / Unlockable stable registry
6. Star Beast beast-first visual master
7. Named Object three-view / replica source
8. Route / Station / Ticket / Stamp machine vocabulary
9. VFX semantic registry + photosensitive / audio / haptic rules
10. UI symbol size matrix
11. Generation Brief Exporter
12. Cross-authority CI / spoiler / approval gate expansion

## Definition of done for this audit layer

- 22 categories are machine-enumerated exactly once.
- Every recorded authority path exists.
- STRONG categories have machine authority.
- docs-only/missing categories cannot be marked generation-ready.
- reference-generation-ready never implies final artwork or runtime approval.
- Enemy/Boss 48-entry ID/order is unchanged from the existing production DB.
- Enemy family visual differences are mechanically guarded.
- Generic AI monster / neon AI palette / hard horror normalization is rejected by the source contract.
- Toumon image-generation hold remains fail-closed.

これを満たした上で、Shared Sourceを順番に深くし、**同じ原本からWeb / Unity / Promo / Goodsへ用途別の最終出力を作る**。
