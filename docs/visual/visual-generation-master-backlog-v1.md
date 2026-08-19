# ヨルノシルベ Visual Generation Master Backlog v1

Status: **ACTIVE LISTING / NO AUTOMATIC GENERATION**  
Scope: `m-shogo/vamp-pon` only  
Purpose: **画像を作り始める前に、必要な画像・設定画・派生素材を漏れなく一覧化する。**  

> Production order is fixed: **MASTER SETTING BOOK → GUIDE / LOREBOOK / DB → TOP / LOADING / PROMO → GAMEPLAY LAST**.
>
> Yui Sheet 01再生成は当面HOLD。Yuiを消さず、系譜・reject記録を保持したまま他の棚卸しを先に進める。

---

## 0. 基本ルール

- ゲーム用画像を見た目の正本にしない。
- Character / Item / Enemy / Location / Star Beast / Symbol / Effect は、先に設定画Masterを持つ。
- Master未承認の派生画像をTOP・攻略・DB・Gameplayの親にしない。
- 同じ物理アイテムや進化系は、別物として乱造せずlineageで束ねる。
- 文字・年表・関係線・ステータス表・UI chromeは原則HTML/CSS/SVG/データで描画し、画像へ焼き込まない。
- 灯りの揺れ、星の瞬き、紙片、雲、parallax等は可能ならUnity/CSS/Shader/Particleで動かし、不要なラスタ生成を増やさない。
- 未確定Story / relationship / constellation truthを画像からCanon化しない。
- Candidate / Current / Final / Runtime approvalは別管理。

---

# PHASE 1 — MASTER SETTING BOOK

アニメ制作の設定資料集に相当する正本。**ここを最優先で完成させる。**

## M01 Character Design Master Pack

対象: 36 characters。

1. Sheet 01 — Identity / Turnaround
   - front
   - anatomical left
   - anatomical right
   - back
   - same scale / same baseline
   - body-relative equipment lock
   - no mirror substitution
2. Sheet 02 — Face / Expression / Acting
   - neutral
   - smile / anger / sadness / surprise / concentration 等
   - left/right 3/4
   - left/right profile
   - face anatomy / age impression lock
3. Sheet 03 — Costume / Equipment / Material
   - front/back/inside layers
   - fasteners
   - pockets / storage
   - footwear / hand interaction
   - fabric/material/wear/repair
   - signature equipment placement
4. Sheet 04 — Silhouette / Motion / Derivation
   - one-color silhouette
   - rest / walk / run
   - signature interaction
   - action / exertion / hurt / recovery
   - icon / portrait crop proof
   - small gameplay-size proof

Additional character master plates:
- hair construction / hair-back detail when needed
- hands / feet / footwear detail when identity-critical
- accessory attachment / removal
- seated / crouched / arm-raised clothing behavior
- weather-response clothing state where authoritative

State:
- 36 logical packs planned.
- Yui Sheet 01 = HOLD after rejected attempt; do not regenerate now.
- Other characters remain authoring/review targets.

## M02 Character State / Transformation Masters

Base Character Pack承認後に作る。

Per applicable character:
- Normal baseline link
- Kokuyou / 黒耀化 state
- Akatsuki / 暁灯・暁開き state
- before/after comparison
- face/eye/posture drift limit
- identity features that **must not change**
- light / ink / material behavior
- clothing/equipment continuity
- transformation VFX boundary

Do not allow gameplay sprite or cut-in to become transformation authority.

## M03 Character Scale / Ensemble Master

- relative-height lineup
- body-mass lineup
- age-impression lineup
- silhouette-only lineup
- Core / main group lineup
- Sakuyaza lineup
- selected group/pair/family lineup only where relationship authority permits

Rules:
- exact centimeters are not invented without source authority.
- visual similarity does not establish blood/family relationships.

## M04 Character Color / Material Reference Plates

Per character where useful:
- dominant / support / accent / emitted light
- day/night readability
- material hierarchy
- fabric / metal / paper / glass / wood / ink behavior
- forbidden generic gacha decoration comparison

## M05 Star Beast Masters

Known scope: 21 entries.

Per Star Beast:
- front
- side
- back if needed
- sit / rest / sleep
- face rule
- paw/fin/wing details
- size relation
- one-color silhouette
- plush/readability proof
- theme color / material feel
- owner-linked recognition hook without turning it into a mini character costume

Star Beast authority stays separate from Character Master and constellation-history inference.

## M06 Sakuyaza / Important Group Character Masters

Known Sakuyaza scope: 8 members.

Per member:
- identity reference
- turnaround or equivalent construction reference
- face / expression
- costume / material / silhouette
- recognition gesture
- individual-vs-group grammar

Group comparison plate:
- shared motifs
- what must remain individual
- group spacing / silhouette rhythm
- shared color/material boundary
- emblem usage boundary

## M07 Enemy Creature Reference Masters

Known enemy DB scope: 48 enemies.

Treat `reference` as Master. Gameplay `sprite_sheet / attack_sheet / collection_icon` are derivatives.

Per enemy:
- front / side / back as needed
- family silhouette comparison
- size / threat-tier comparison
- face / mouth / appendage rules
- attack telegraph pose reference
- movement/body deformation reference
- ink/paper/shadow material language
- family-shared vs individual differences

Enemy families currently include:
- ombu
- omburo
- wrong_reading
- great_shadow

Audit Sakuyaza overlap before final total counting.

## M08 Named Object Masters

Known luminous possession scope: 21 Named Objects.

Per object:
- front
- back
- side
- scale
- materials
- wear
- repair marks
- handling gesture
- grip
- storage
- open/closed state if applicable
- owner relationship without UI
- readable silhouette

Current source geometry remains review-gated; do not treat candidate geometry as approved authority.

## M09 Full Item / Object Design Masters

Named Objectsだけでは不足。

Source item families include character-linked:
- starter gear
- passive item
- rare item
- lamp-tsugi / evolved form
- akatsuki-biraki / final/open form

Plus field drops such as:
- 記憶片
- 朝露
- 迷子の鈴
- 夜明けマッチ
- 白い切符

Before assigning final master-image count:
- deduplicate identical physical objects
- identify state/evolution of the same lineage
- distinguish true new object vs visual state
- connect luminous possession / starter / passive / rare / evolved/final where they are one object lineage

Master sheet fields:
- orthographic / front-back-side as needed
- scale against hand/common reference
- color/material
- wear/repair/history marks
- open/closed or before/after
- handling/grip/storage
- small silhouette readability
- owner association
- state/evolution lineage

Gameplay `icon_64 / card_512 / pickup_32 / evolution_burst / ui_slot` remain Phase 4 derivatives.

## M10 Location / Environment Setting Masters

Stage DB has at least 20 locations. Each authorized location receives a setting-art Master before game backgrounds.

Per location:
- wide establishing view
- spatial / ground-plan sketch when useful
- landmarks / key architecture
- foreground / midground / background breakdown
- doors/windows/furniture/fixtures where important
- material + aging board
- light / color script
- character scale reference
- weather / season / time variants only when authorized
- prop placement rules
- no invented readable signage / route names

Game `background_390x844 / parallax / thumbnail / battle_tile` remain derivatives.

## M11 World Visual Grammar Master Plates

Shared setting-book plates for recurring visual language:
- night / quiet darkness
- route / way home
- paper / record / ledger / label
- black ink edge / spread / puddle
- lantern / small practical warm light
- memory fragment
- missing record / blank margin
- repair / binding / folding / seams
- old and changing star charts
- night → dawn transition
- Kokuyou boundary
- allowed vs forbidden neon/glow comparison

These plates are reused by Character, TOP, Lorebook, Story and Gameplay.

## M12 World Material / Texture Library

Generate only where a visual reference is useful; not every texture needs a standalone image.

- old paper
- ledger paper
- folded paper
- repaired paper
- black ink
- aged metal
- oxidized brass
- worn cloth
- translucent paper/glass lantern panel
- station / classroom / archive wood
- soot / dust / chalk / flower / water surface references

Goal: prevent each asset from inventing unrelated material rendering.

## M13 Toumon / Symbol / Emblem Masters

Primary authority should be **SVG/vector**, not generated raster.

For each authorized symbol:
- single-ink master
- minimum-size proof
- reverse light/dark proof
- clear space
- do-not-distort
- embroidery-safe proof when relevant
- Normal / Dawn / Kokuyou / Pair transition rule where authoritative

Generated images may be used as exploration only, never as vector authority.

## M14 Title / Logo / Graphic-System Masters

Required before broad TOP/DB/promo rollout:
- ヨルノシルベ primary logo master
- monochrome version
- dark/light background versions
- compact/mobile version if necessary
- subtitle lockup if used
- title safe area
- constellation/star-chart ornament grammar
- route-line ornament grammar
- paper-edge / label / ledger decoration grammar
- section divider / chapter mark grammar
- prohibited generic fantasy-logo examples

Prefer vector / editable type treatment where possible.

## M15 Constellation / Historical Star-Chart Archive Masters

Only after per-object/research authority is explicit.

- era-specific star-chart plate
- current vs historical comparison
- obsolete / unadopted constellation entry
- old atlas / planisphere view where authorized
- constellation naming/status indicator
- spoiler-safe version
- research/candidate/current distinction visible in data, not baked as false canon

## M16 Group / Faction Visual Masters

For all meaningful groups after group scope audit:
- group lineup
- shared-vs-individual design grammar
- color/material boundary
- motif boundary
- gesture / position grammar
- symbol/emblem boundary
- group silhouette

Do not make every member a color swap/clone.

## M17 Story Scene / Keyframe Masters

Only when exact Story authority exists.

- chapter establishing keyframe
- important location + character staging
- important pair/group staging
- scale/distance reference
- lighting/mood board
- spoiler-tiered version for guide/site if needed

Do not generate unresolved plot details.

## M18 Seasonal / Time / Weather Color-Script Masters

Useful for TOP, Loading, location variants and Story consistency:
- spring night
- summer night
- autumn night
- winter night
- deep night
- pre-dawn
- dawn
- rain / snow / mist only where world/location authority permits

This is a color/light reference, not permission to redesign character identity.

---

# PHASE 2 — GUIDE / LOREBOOK / DATABASE

All assets here derive from approved Masters.

## G01 Character DB

Per character as needed:
- full-body clean derivative
- bust portrait
- face thumbnail
- silhouette thumbnail
- expression sample strip
- costume/equipment detail crop
- theme color swatch
- Toumon display asset from vector Master

## G02 Character Profile / Lorebook

- profile illustration
- era card illustration
- reality-root illustration
- ordinary-life/lived-artifact imagery when useful
- behavior / voice / habit visual snippets only when useful

## G03 Relationship / Pair / Group Guide Art

Generate only when an illustration adds meaning:
- pair illustration
- group vignette
- family/pair comparison where authority permits
- important relationship keyframe

Do NOT bake relationship network lines into images. Render graph/UI in HTML/SVG.

## G04 Star Beast DB

Per Star Beast:
- clean profile
- silhouette
- small thumbnail
- owner pairing vignette when useful
- plush/readability derivative when useful

## G05 Item / Object DB

Per approved item lineage:
- catalog clean view
- detail crop
- before/after or open/closed state
- owner-associated vignette when useful
- small thumbnail

## G06 Enemy / Creature DB

Per enemy:
- reference catalog image
- silhouette
- threat/size comparison derivative
- family thumbnail

## G07 Location / Stage Guide

Per location:
- guide establishing illustration
- location thumbnail
- landmark crop
- map/diagram should be deterministic SVG/HTML when possible

## G08 Constellation / Archive Guide

- star-chart plates
- historical/current comparisons
- archive-object imagery
- spoiler-safe variants

## G09 Story / Chapter / Group Thumbnails

- chapter thumbnails
- arc thumbnails
- group index thumbnail
- important object/location thumbnail

## G10 DB/UI Elements That Should NOT Be Generated as Baked Images

Use HTML/CSS/SVG/data by default:
- relationship graph lines
- timeline
- stat tables
- filter/tab controls
- card frames/chrome
- status badges
- headings/body copy
- long readable text
- sortable tables

---

# PHASE 3 — TOP / LOADING / PRESENTATION

Only after Master consistency is strong enough.

## T01 Main TOP Key Art

- primary vertical key visual
- mobile-safe composition
- approved character identities only
- world/location background based on Location Master
- logo safe area
- motion-layer decomposition considered from start

## T02 TOP Character Cutout Set

- selected main cast cutouts
- clean alpha
- foreground/midground placement variants
- no independent redesign from Character Master

## T03 TOP Background Plates

- base night environment
- foreground
- midground
- background
- sky
- distant light
- architectural/landscape layer

## T04 TOP Motif / Prop Cameos

Only approved Masters:
- lantern
- paper fragment
- Named Object
- Star Beast cameo
- Toumon ornament
- star-chart fragment

## T05 Seasonal TOP Variants

If retained as product direction:
- spring
- summer
- autumn
- winter

Character identity remains unchanged; seasonal differences are clothing/material/background only when approved.

## T06 Loading Illustrations

- primary loading set
- seasonal loading set
- story/chapter loading variants only if needed
- lower safe area for loading text/progress
- mobile crop proof

## T07 Motion-Ready Art Layers

Generate only art that cannot be done procedurally:
- foreground leaves/objects
- midground silhouette layer
- distant city/mountain layer
- cloud plate only if art-specific
- light mask / glow mask only if required

Prefer procedural/code for:
- star twinkle
- lantern flicker
- subtle cloud drift
- paper particle drift
- small embers
- parallax
- reduced-motion fallback

## T08 Promo / Share Assets

After TOP visual language stabilizes:
- OG/social share image
- store/announcement crop if actually needed
- event/season banner crop if actually needed

Do not create speculative marketing variants with no destination.

---

# PHASE 4 — GAMEPLAY DERIVATIVES LAST

No Gameplay asset becomes upstream visual authority.

## P01 Character Gameplay

- icon
- portrait
- sprite / animation sheets
- selected-state / damage / blackening / dawn differences as required
- cut-in
- small-size silhouette proof

## P02 Enemy Gameplay

Derived from Enemy Reference Master:
- sprite sheet
- attack sheet
- collection icon
- boss/elite variants where source DB requires

## P03 Item Gameplay

Derived from Item/Object Master:
- icon_64
- card_512
- pickup_32
- evolution_burst
- ui_slot

## P04 Stage Gameplay

Derived from Location Master:
- background_390x844
- parallax_layer_pack
- stage_thumbnail
- battle_tile_patch

## P05 Weapons / Skills / Cards / Other Asset Factory Outputs

Existing Asset Factory contracts remain the source index. Audit each output as:
- EXISTS_REUSE
- MISSING_GENERATE
- REPLACE_REQUIRED
- BLOCKED_AUTHORITY
- NOT_APPLICABLE

Do **not** assume all indexed contracts need regeneration.

## P06 Runtime VFX

Derived from World Visual Effect Master:
- attack trails
- impact effects
- memory pickup effects
- black ink effects
- Kokuyou effects
- dawn/open effects
- lantern/fire effects

Prefer runtime Shader/Particle/system implementation when practical.

---

# FINAL COVERAGE AUDIT BEFORE IMAGE EXECUTION

Before bulk generation starts, confirm all of the following:

- [ ] all 36 Character Master Packs listed
- [ ] Yui HOLD preserved
- [ ] transformation/state Master scope listed
- [ ] ensemble/scale lineup scope listed
- [ ] 21 Star Beasts listed
- [ ] 8 Sakuyaza listed
- [ ] 48 enemy references listed and Sakuyaza overlap audited
- [ ] 21 Named Objects listed
- [ ] full item/object DB deduplicated into physical/evolution lineages
- [ ] field drops included
- [ ] all authorized locations/stages receive Location Masters
- [ ] world effect plates listed
- [ ] material/texture reference plates listed
- [ ] Toumon/vector masters listed
- [ ] title/logo/graphic system listed
- [ ] constellation/archive plates listed
- [ ] group/faction masters listed
- [ ] story keyframes listed only where authority exists
- [ ] seasonal/time/weather color scripts listed
- [ ] Guide/Lorebook/DB derivatives listed
- [ ] TOP/Loading layers and key art listed
- [ ] existing TOP/Loading assets audited before replacement
- [ ] Asset Factory contracts existence/replacement audit completed
- [ ] Gameplay derivatives remain last

Only after the checklist is complete should the project move from **LISTING** to **PROMPT AUTHORING / GENERATION EXECUTION**.
