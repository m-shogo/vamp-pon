# ヨルノシルベ — Visual Production Control Center v1

Status: **CURRENT INVENTORY ENTRYPOINT ON WORKING BRANCH / NO IMAGE GENERATION AUTHORIZATION**

この文書は、画像制作の「何が必要か」「何が既にあるか」「何を再利用するか」「何がまだOPENか」「どのCIが守るか」を一箇所から確認するための入口。

画像そのもののStory / Canon / final / runtime Authorityではない。

---

## 0. まずここだけ守る

制作順:

```txt
1. MASTER / 設定書
2. 攻略サイト / Lorebook / DB
3. TOP / Loading
4. Gameplay
```

Hard:

- 同じ人物 / 物 / 場所の画像を用途ごとにコピーしない。
- 同じbinaryを別pathへ複製しない。
- 複数用途は1 Asset lineage + `usageTargets`。
- 既存画像がある = final承認済み、ではない。
- 出力pathがない = 今すぐ生成してよい、ではない。
- OPEN / Candidate = image modelが自由に決めてよい、ではない。
- Guide / DBのカード・関係線・年表・status・長文はHTML/CSS/SVG/dataを優先する。
- Character画像生成は最新mainのsingle production exporterを必ず経由する。
- Yuiは現在HOLD。再生成しない。

---

## 1. Current naming

### Season 1 primary antagonist

**朔夜座**

- ナシロ
- アサトジ
- ミチグレ
- オリネ
- ハクマ
- ツグリ
- ユラネ
- ペタ

`八影 / 夜綴りの八影 / Yatsukage` はearly observer / legacy compatibilityのみ。
stable file/type/ID名に残ってもCurrent formal team名ではない。

### 群青残響録

敵組織ではなく**retrospective record taxonomy**。

- fixed member countなし
- 全員villainではない
- 全員Bossではない
- 共通制服 / 本部 / 組織章を作らない
- Incident確定後に人物 / 人物群 / 制度 / system / social pressureをadmitする

---

## 2. 今のControl files

| 知りたいこと | 正本/台帳 |
|---|---|
| 今の解決状況 | `data/character-assets/manifests/visual-audit-resolution-ledger.v1.json` |
| 全体件数baseline | `data/character-assets/manifests/visual-generation-count-baseline.v1.json` |
| Story authorityから見た抜け | `data/character-assets/manifests/visual-story-authority-coverage-audit.v1.json` |
| 追加Master family一覧 | `data/character-assets/manifests/visual-pre-game-master-expansion-queue.v1.json` |
| 固定数の世界/Group Master | `data/character-assets/manifests/visual-pre-game-fixed-master-rows.v1.json` |
| DBから自動列挙するMaster候補 | `src/game/data/visualPreGameSourceMasterInventory.ts` |
| 36 Character Pack既存production list | `data/character-assets/manifests/visual-image-production-list.v1.json` |
| Character prompt packet | `data/character-assets/manifests/visual-character-prompt-packets.v1.json` |
| 最新main → Sheet 01-04 bridge gate | `data/character-assets/manifests/visual-character-sheet-production-entrypoint-bridge.v1.json` |
| Item同一物/進化候補 | `data/character-assets/manifests/visual-item-lineage-review-queue.v1.json` |
| Guide/DB重複防止 | `data/character-assets/manifests/visual-guide-db-reuse-policy.v1.json` |
| TOP/Loading既存再利用 | `data/character-assets/manifests/visual-existing-top-loading-reuse-audit.v1.json` |
| 977 Asset Factory contracts出力監査 | `data/character-assets/manifests/visual-existing-contract-output-audit.v1.json` |
| Asset登録/重複/差替え | `data/character-assets/manifests/visual-asset-master-registry.v1.json` |
| 変更・監査ルール | `docs/visual/visual-asset-audit-and-change-policy-v1.md` |

古いauditの「finding」は発見時点の記録として残る。
**現在解決済みかどうかは `visual-audit-resolution-ledger.v1.json` を見る。**

---

## 3. Master / 設定書 — 現在の構造

### Character

```txt
36 logical Character Design Master Packs
× 4 source-sheet evidence
= 144 source-sheet rows
```

Sheets:

1. Identity / Turnaround
2. Face / Expression / Acting
3. Costume / Equipment / Material
4. Silhouette / Motion / Derivation

4枚を4つの独立Character Masterとして数えない。
**1人 = 1 logical Pack**。

Yui 4 SheetはHOLD。

### Character states

Current gameplay Character DBから**20 comparison rows**をsource-derivedで保持。

1 Characterにつき:

- Normal baseline
- Kokuyou
- Akatsuki / Dawn

を一つのlogical state comparisonへまとめる。
別人3人として数えない。

### Star Beast

**21 Master subjects**。
Character MasterとAuthorityを分離する。

### Enemy

**48 Enemy Reference Master subjects**。

朔夜座8人はこの48 Enemy recordsと同じsubject lineageを共有するため:

```txt
48 + 8 = 56
```

にはしない。

朔夜座用には別途**1枚の8人比較/設定board**を持つが、個人Master binaryを8枚コピーしない。

### Named Object

**21 luminous possession Master subjects**。
現在geometry reviewが必要。

### Item

raw Item DB:

```txt
20 characters × 5 phases = 100
field drops = 5
raw rows = 105
```

ただし105 = 105 final physical Mastersではない。

現在:

- exact distinct labels including field drops = 94
- duplicate-label review groups = 11
- final physical/evolution lineage Master count = **TBD**

105行は生成対象ではなく**lineage candidate**。
同一物 /進化 /同名別物をreviewしてからfinal physical Master countを決める。

### Location / Environment

Stage DBから**20 Environment Setting Master rows**をsource-derived。
Gameplay background/parallax/thumbnail/tileより先に設定正本を置く。

### 灯紋

**21 SVG/vector Master rows**。
Raster generated artをAuthorityにしない。

### Fixed world/group setting rows

現在first-class ID化済み:

- 朔夜座 8人比較: 1
- 群青残響録 foundation: 2
- Core5 Reality Era environment: 5
- Core5 Era population/household: 5
- Dream daily-life infrastructure: 1
- Sky/Moon/Resolution color script: 1
- Modern IAU88 project line-art vector system: 1

計 **16 visual/editable/vector rows**。

さらに:

- Era Incident visual admission policy
- Season antagonist visual admission policy

の**2 governance rows**。

### Source-derived expansion rows

自動列挙:

```txt
Character state   20
Enemy             48
Item candidates  105
Location           20
Toumon             21
--------------------
total             214
```

**214 final imagesではない。**
Item 105はlineage候補、Toumon 21はvector。

---

## 4. まだ固定してはいけないMaster数

以下はAuthority確定に追従して増やす。

- Dream ↔ Reality form comparison対象人数
- Era Incident visual system数
- historical constellation archive最終object数
- Story keyframe数
- Sunny IF reward art数
- material example plate数
- title/logo lockup variant数
- additional group / ensemble lineups

OPENを埋めるためだけに画像生成しない。

---

## 5. Guide / Lorebook / DB

標準:

```txt
Approved Master
↓
reference / crop / mask
↓
HTML + CSS + SVG + data
```

**カードごとに新しいPNGを生成しない。**

再利用対象だけでも:

- Star Beast 21
- Named Object 21
- Enemy 48
- Location 20

= **110 subjects**。

110 subjectsがあるからGuide用110枚を別生成する、ではない。
新規独立Guide binaryのdefaultは **0**。

旧production listの:

- lorebook-profile
- lorebook-era
- lorebook-reality-root
- lorebook-relationship
- lorebook-foreshadow

は、最新main同期後に**baked image candidate → composition/read-model reference**へmigrationする。

OptionalのStory/editorial illustrationだけ別Assetとしてadmissionする。

---

## 6. TOP / Loading

### Loading

春夏秋冬4枚のsource artは既にcommitted。

```txt
existing committed source = 4
new default regeneration row = 0
```

Human/runtime approval待ちであっても「画像が無い」とは数えない。

### TOP V3

final candidate自体は既に存在。

- candidate generated = yes
- Human identity review = no
- crop review = no
- motion review = no
- approved final = no
- runtime approved = no

したがって:

```txt
existing candidate → review first
```

であり、default replacement generationは0。

### TOP V2 layer kit

17 source assetsを把握済み。
V3でlive/motion relevant 10、provenance/fallback 7。
勝手に17枚全部作り直さない。

### Runtime capture

15枚必要だが、これは**証拠スクリーンショット**。
画像生成backlogへ足さない。

---

## 7. Gameplay — 最後

Asset Factory contracts:

```txt
Character 180
Enemy     192
Item      525
Stage      80
----------------
Total     977
```

PR CIでoutputPathHintを全件監査した時点では:

```txt
existing path = 0
missing path  = 977
```

ただし:

```txt
missing path != generate now
```

依存関係:

- Character 180 → approved Character Master + latest production exporter
- Enemy 192 → 48 Enemy Reference Masters
- Item 525 → Item physical/evolution lineage解決
- Stage 80 → 20 Location Masters

Gameplayは必ず最後。

---

## 8. Character画像生成入口

旧 `visual-character-prompt-packets.v1.json` は**直接production使用禁止**。

Current required architecture:

```txt
latest main
  single production character exporter
    ↓
  Character Sheet adapter
    ↓
  Sheet-role specific constraints
    ↓
  4 candidates
    ↓
  automatic QA
    ↓
  human review
```

最新mainで追加された全Character fidelity authorityを読み込む。
少なくとも:

- identity
- garment
- night/light
- world material
- embodied acting
- readiness
- reviewed feedback recurrence
- color
- cross-asset consistency/review
- expression
- motion/perspective
- hand/contact/storage
- environment/weather
- spatial world scale
- world-use interaction layout

を迂回しない。

---

## 9. Duplicate / replacement

重複防止:

- Asset ID duplicate禁止
- current `subject + kind` duplicate禁止
- same file pathを別Assetへ登録禁止
- **別pathでもSHA-256同一binaryを検知**
- 同一用途違いはcopyではなく`usageTargets`

変更:

```txt
v1
↓ replaces
v2
```

旧Assetは履歴として残し、`supersededBy`を持たせる。
上書きして履歴を消さない。

Rejected / archived / supersededをCurrentへ勝手に戻さない。

---

## 10. 現在の主要blocker

1. PR #304を**最新mainへsync/reconstruct**する
2. Character Sheet adapterをlatest single production exporter上へ実装
3. 36 packetを再exportして古いAuthority hashを無効化
4. Item 105 raw rowsのphysical/evolution lineage review
5. 旧Lorebook baked-image rowsをmaster-reference/read-modelへmigration
6. Fixed world/group MasterはID化済みだが実setting/vector boardは未authoring
7. Conditional Story/Incident/IF/Logo/Archive数はAuthority待ち
8. YuiはHOLD
9. 最終CI green + Human visual gates

---

## 11. CI

中心Workflow:

`.github/workflows/visual-asset-master-registry.yml`

少なくとも以下を検査する:

- Master Registry / coverage
- generation governance / counts / duplicate binary
- 朔夜座 Current naming + 群青 boundary
- legacy 八影 migration
- fixed pre-game rows
- source-derived pre-game rows
- TOP / Loading reuse
- Guide / DB reuse
- 977 contract output-path audit
- dynamic Gunjo admission
- Story visual coverage gaps
- resolution ledger

---

## 12. 「完了」の意味

**一覧がある**だけでは完了ではない。

```txt
listed
→ source-linked
→ deduplicated
→ correct authority linked
→ authored if needed
→ QA
→ human reviewed where required
→ versioned / registered
→ downstream reuse linked
```

まで区別する。

最終目標は:

> 「何を作るべきか分からない」ではなく、
> **どのAssetが存在し、どれがMasterで、何が未制作で、何を再利用し、何がOPENで、何が次に作れるかをmachine-readableに即答できる状態。**
