# ヨルノシルベ — Character Appearance Distinction / Generation Contract v1

Date: 2026-08-10  
Status: **USER DIRECTION / ALL-CHARACTER GENERATION CONTRACT / CURRENT CANON NOT AUTO-REPLACED**

> 画像生成・立ち絵・TOP・イベント絵・goods referenceで「髪色と衣装だけ違う同じ顔」になることを禁止するための全キャラ共通契約。
>
> 対象は **Current21 + Future15 = 36人**。さらに、今後追加する全新規characterもこの契約を満たさない限りgeneration-readyにしない。

Authority boundary:

- Existing character identity / story / body-shape canonは維持する。
- 本書の新規顔貌・装飾detailはHuman Review前はvisual Candidate。
- ユイの**エクボ**は今回の明示USER DIRECTIONとして必須。
- Future15をCurrent21へ昇格しない。
- 双子 / replica Robotなど「似ること自体が意味」のある人物は例外として明示し、**似ていても識別点を別に持つ**。

---

# 1. 全キャラ共通 Anti Same-Face Rule

生成AIへ `beautiful anime character` のようなgeneric promptだけを渡さない。

各人に必ず以下を指定する。

```txt
face shape
jaw / cheek volume
eye aperture
eye tilt
eye spacing
eyelid fold
brow thickness / angle / hair flow
upper lash architecture
lower lash architecture
nose bridge / tip / width
mouth width / lip balance
cheek / wrinkle / mole / freckles / scar
hairline / bangs structure
ear / piercing / accessory language
neckline / shoulder silhouette
clothing construction
resting expression
pose language
```

最低 **7軸以上** が隣接人物と異なること。

### 禁止

- same V-jaw + hair color swap
- same giant eyes + iris color swap
- same small anime nose
- same pout mouth
- same eyebrow arch
- same eyelash fan
- same thigh straps / belts / cape on everyone
- everyone has piercings / everyone has tattoos
- character diversity = accessory盛りだけ

---

# 2. Recognition QA

Character generation candidateはHuman Review時に以下を見る。

1. 髪を隠したface cropでも識別できるか
2. grayscaleでも識別できるか
3. 目だけcropしても複数人を区別できるか
4. 横顔で鼻 / 顎 / 額の差があるか
5. 無表情でも本人らしいか
6. 笑顔にした途端全員同じ顔へ戻っていないか
7. 小サイズでaccessoryを失っても輪郭差が残るか

Core5は特に:

- face only 3秒認識
- eye+browだけで最低3/5認識
- profile silhouetteで最低4/5認識

を狙う。

---

# 3. Current21 — face / appearance signatures

## C01 ユイ

```txt
faceSignature: YUI-SOFT-DIMPLE
faceShape: 柔らかい卵型。頬に適度な丸み、尖りすぎない顎。
eyes: almond-round、ほぼ水平、目尻わずかに柔らかく下がる。
eyelid: 末広寄りの明確な二重。
brows: 中太・直線寄り、眉山弱め。
lashes: 上は柔らかな小束、下は控えめ。
nose: 鼻根低〜中、小鼻と鼻先に少し丸み。
mouth: 中幅、下唇がわずかに柔らかい。
cheek: **笑うと左右にエクボ。必須。**
restingExpression: 人を見る時に口より先に目が柔らかくなる。
hair: 暗髪、左右非対称。片側を耳へかけられる。
bodyMod: 低密度。小さな片耳灯具アクセ程度。
clothingConstruction: hood + curved soft travel layers。
```

Never: generic round-eyed heroine / V-jaw / dimples missing。

## C02 アサ

```txt
faceSignature: ASA-SHARP-UPTURN-ASYM
faceShape: compact angular、ユイより顎が短くシャープ。
eyes: 横長の明確な吊り目。狐寄り。
eyelid: 奥二重〜inner double。
brows: 細め、眉山あり、眉尻短い。
lashes: 目尻だけ鋭い小束。下はほぼ無し。
nose: 直線的な小さめ鼻筋。
mouth: 片側だけ上がるsmirk、歯を見せる笑いが似合う。
cheek: flat。常時赤面禁止。
hair: short / choppy / asymmetric bangs。
bodyMod: 左右非対称ear piercings。helix Candidate。tongue piercingはHuman Review候補。
clothingConstruction: short asymmetric jacket + sharp diagonal straps。
```

Never: ミチルと同じ丸い猫目 / fluffy lashes。

## C03 ナギ

```txt
faceSignature: NAGI-FINE-HORIZONTAL
faceShape: 縦長で細い卵型。狭い頬幅。
eyes: 細目、横長、水平〜少し伏し目。
eyelid: 一重に見えるほど薄いfold。
brows: 低位置の濃い直線眉。
lashes: 長いが上へ盛らず横へ流す。
nose: Core5で最も鼻筋を明確にする。
mouth: 小さく薄い、口角水平。
mark: 片目下の小さなほくろCandidate。
hair: heavy long hair、下方向へ落ちる。
bodyMod: thin silver ear cuff / minimal pierce。
clothingConstruction: closed collar + long vertical + box geometry。
```

Never: large cool-beauty eyes / Tomori-like hooded eyes。

## C04 ミチル

```txt
faceSignature: MICHIRU-CAT-GEJI-FRECKLE
faceShape: 横幅のある短め卵型。active cheek。
eyes: 縦幅のある笑う猫目。アサより大きく開く。
eyelid: 平行寄り二重。
brows: **太い自然眉 / ゲジ眉寄り。毛流れを見せる。**
lashes: 上は短く密、下まつ毛数本を明確に。
nose: 丸みのある鼻先。
mouth: Core5最大の横幅。大きく笑う。
cheek: 鼻〜頬に薄いそばかす / sun marks Candidate。
hair: pony / half-up / bandana、前後へ動く毛束。
bodyMod: pierceよりbracelets / travel pins。
clothingConstruction: active layers + map cloth + visible movement joints。
```

Never: 細眉 / porcelain-skin default / Asa's fox eyes。

## C05 トモリ

```txt
faceSignature: TOMORI-HOODED-REPAIR
faceShape: mature inverted-egg、頬骨やや明確。
eyes: hooded / half-lidded、縦幅小さめ。
eyelid: 深い二重を上瞼が被る。
brows: 中太・なだらかな角度。
lashes: 目尻上 + 目尻下を強く、中央は薄い。
nose: 中〜高鼻根、鼻先やや長い。
mouth: 下唇に少し厚み。dry smile。
cheek: 小傷 / 煤跡が日によって残る。
hair: messy half-up / work clip。
bodyMod: multiple ear metal / small tattoo Candidate。和彫りは文化・人物史Review必須。
clothingConstruction: repaired seam + diagonal patchwork + real tool belt。
```

Current rule: 作業ゴーグルを維持。Never: Nagi clone / tattoo-only personality。

## C06 セン

```txt
faceSignature: SEN-RECTANGLE-TEACHER
faceShape: やや長い長方形寄り、顎先は丸い。
eyes: 中サイズの垂れ気味almond、目頭狭め。
eyelid: 末広二重、上瞼やや重い。
brows: 太さ中〜太、眉頭しっかり、終端は丸い。
lashes: 目立たせない。男性的/中性的natural lash。
nose: 鼻梁中、鼻先少し下向き。
mouth: 横幅中、説明時に片方の口角が上がる。
mark: 笑い皺 / 額の薄い表情線。
hair: foreheadを一部見せる。
accessory: chalk holder / simple watch Candidate。
clothing: teacher/work apron geometry, sleeves rolled irregularly。
```

## C07 リツ

```txt
faceSignature: RITSU-SQUARE-BROTHER
faceShape: 若い角丸square、頬骨より顎幅がある。
eyes: 中幅、やや三白眼寄りのstraight eyes。
eyelid: 奥二重。
brows: 太く短いstraight brows。
lashes: 短い。下ほぼ無し。
nose: 鼻幅やや広め、鼻先は丸すぎない。
mouth: 上唇薄め、笑うと片八重歯Candidate。
mark: 眉の小さな傷Candidate。
hair: practical short / cowlick one point。
accessory: sibling-shared small cord / no facial piercing。
clothing: split / half motif without perfectly symmetric costume。
```

## C08 コヨリ

```txt
faceSignature: KOYORI-CHILD-WIDE-ROUND
ageCoding: child / non-sexualized
faceShape: 子どもの丸い頬、短い顎。
eyes: wide-set round eyes、黒目大きめ。
eyelid: 薄い末広fold。
brows: 短く柔らかい自然眉。
lashes: 短い、盛らない。
nose: 小さく丸い。
mouth: 小さめ、前歯が少し見える笑顔。
cheek: 健康的な丸さ。
hair: uneven self-tied detail Candidate。
bodyMod: none。成人向けpiercing/tattoo禁止。
clothing: small layered paper-cord shapes、child mobility first。
```

## C09 ゲン

```txt
faceSignature: GEN-AGED-HOOK-DEEPSET
faceShape: 年齢で頬が落ちたangular long face。
eyes: deep-set、細く、上瞼が重い。
eyelid: age-fold / hooded。
brows: 太い白髪混じり、左右に少し差。
lashes: ほぼ主張しない。
nose: 大きめ・やや鷲鼻寄り。横顔の重要識別点。
mouth: 薄い唇、口角に皺。
mark: crow's feet / forehead lines / light stubble Candidate。
hair: thinning / gray, not comic baldness。
accessory: old hat / compass, no fashion overload。
clothing: old practical route wear, worn edges visible。
```

## C10 ハナ

```txt
faceSignature: HANA-ROUND-OLDER-SOFT
body: plus-size older woman, Current lock
faceShape: ふっくらした丸顔。頬と顎の柔らかさを維持。
eyes: 小〜中のhooded warm eyes、少し垂れ目。
eyelid: 年齢foldを含む二重。
brows: 緩い弧、細すぎない。
lashes: 上外側に少量。年齢を消す長まつ毛禁止。
nose: 丸い鼻先、鼻翼少し広め。
mouth: ややfull lips、口角皺。
mark: smile lines / cheek mole Candidate。
hair: gray streaks / practical bun or short wave Candidate。
bodyMod: vintage ear studs / brooch程度。
clothing: rounded shawl + preserved textile layers。
```

Never: slim / youthful model face。

## C11 ユウビ

```txt
faceSignature: YUBI-HEART-DOWNTURN-LETTER
faceShape: heart shape、額少し広め、顎小さめ。
eyes: やや下がり目のalmond、outer corner low。
eyelid: clear tapered double。
brows: soft arched thin-medium。
lashes: lower outer lashesが少し目立つ。
nose: 小鼻狭め、鼻先短い。
mouth: small cupid-bow、言いかけて止まる表情。
mark: 口元近くの小ほくろCandidate。
hair: side-swept with tucked ear。
accessory: stamp / seal pendant, simple earring。
clothing: courier layers + envelope flap geometry。
```

## C12 マドカ

```txt
faceSignature: MADOKA-WIDE-WITNESS
faceShape: medium oval、頬は薄め。
eyes: 横に広いlarge almond、少し突出感のある観察眼。
eyelid: 平行二重だが線を太くしない。
brows: eyebrow tail rises slightly / center soft。
lashes: lower lashes明確、upperは均等でなくouter-heavy。
nose: straight small-medium bridge。
mouth: narrow mouth、驚くと縦に開く。
mark: one eye blinks slower Candidate。
hair: face opening asymmetrically like a window frame。
accessory: tiny lens charm, no glasses by default。
clothing: window/paper-wing angular + open sleeves。
```

## C13 シロ

```txt
faceSignature: SHIRO-NARROW-ROUNDGLASSES
faceShape: narrow heart / small chin。
eyes: close-set slightly downturned, glasses越しに小さめ。
eyelid: monolid〜very thin inner fold。
brows: short straight, low density。
lashes: minimal。
nose: narrow bridge suited to round glasses。
mouth: tiny straight mouth、thinking poutではなく閉じる癖。
mark: nose bridge pressure mark from glasses Candidate。
hair: clean shape but one stubborn strand。
accessory: **round glasses Current**。
clothing: page / bookmark vertical flat layers。
```

## C14 トバリ

```txt
faceSignature: TOBARI-BROAD-GATE
faceShape: broad lower face / stable jaw。
eyes: narrow slightly downturned, tired but alert。
eyelid: heavy tapered double。
brows: thick with low arch, ends long。
lashes: short, lower none。
nose: broad bridge / medium tip。
mouth: medium-wide, lower lip thin, firm line。
mark: nasolabial lines Candidate depending age impression。
hair: swept back / ears visible。
accessory: old ticket-punch metal earring Candidate one side only。
clothing: gate frame / vertical split coat, stable stance。
```

## C15 ネム

```txt
faceSignature: NEMU-SLEEPY-ROUND-HOODED
faceShape: round-to-oval, soft lower cheek。
eyes: very droopy sleepy eyes, outer corners low。
eyelid: hooded monolid-like fold。
brows: faint, gently descending。
lashes: long straight upper lashes but sparse, lower 1-2 strands。
nose: small with soft bridge。
mouth: small open-at-rest / sleepy breathing expression。
mark: natural under-eye shadow, not makeup comedy。
hair: soft, uneven bedhead / low movement。
accessory: sleep cord / diary tie, no pierce overload。
clothing: loose dream layers with soft horizontal drape。
```

## C16 クロオリ

```txt
faceSignature: KUROORI-DIAMOND-FOLD
faceShape: diamond, pronounced cheekbone, narrow forehead/chin balance。
eyes: long narrow eyes with inner corner sharper than outer。
eyelid: thin parallel fold。
brows: medium dark, one brow subtly broken / split Candidate。
lashes: outer upper only, crisp。
nose: strong straight bridge。
mouth: thin, asymmetric closed expression。
mark: one fine scar along brow Candidate。
hair: geometric folded sections, not generic black long hair。
bodyMod: one dark metal stud max / low density。
clothing: folded-paper planes / sharp planar silhouette。
```

## C17 カナメ

```txt
faceSignature: KANAME-BROAD-ROUND-SHIELD
body: plus-size broad young adult man, Current lock
faceShape: broad round-square, full cheeks, strong soft jaw。
eyes: relatively small, slightly drooping and kind at rest。
eyelid: inner double / thick lid。
brows: very thick straight brows, dense inner brow。
lashes: short natural。
nose: broad nose / rounder tip。
mouth: full lower lip, wide neutral mouth。
mark: eyebrow slit or old intercept scar Candidate。
hair: compact practical cut。
bodyMod: thick ear stud / arm band, not facial-piercing-heavy。
clothing: broad outer silhouette, protection layers, no slim waist tank。
```

## C18 カスミ

```txt
faceSignature: KASUMI-HEART-HOODED-VEIL
faceShape: narrow heart, high cheek, pointed but not V-model chin。
eyes: hooded almond, inner corners slightly lowered, gaze looks through rather than at。
eyelid: uneven fold, one side more visible。
brows: thin straight brows with long tails。
lashes: upper inner sparse / outer soft long; lower almost none。
nose: fine bridge, tip slightly upturned。
mouth: small, upper lip defined, expression restrained。
mark: tiny temple mole Candidate。
hair: translucent fringe / layered side veil shape without hiding entire face。
bodyMod: chain ear cuff Candidate, no heavy tattoo。
clothing: soft opacity layers / blurred edges / covered identity motifs。
```

## C19 トキ

```txt
faceSignature: TOKI-LONG-PRECISE-DEEPSET
faceShape: long narrow rectangle, defined jaw corners。
eyes: deep-set symmetric narrow almond, cool horizontal gaze。
eyelid: exact parallel double fold。
brows: precise medium straight brow, trimmed shape。
lashes: minimal, almost diagrammatic。
nose: long straight bridge, sharp profile。
mouth: thin medium width, no habitual smile。
mark: faint line under one eye from measuring device Candidate。
hair: geometric clean part / consistent cut。
accessory: measuring clasp / no glasses to avoid Shiro/Ren collision。
clothing: measured seams / straight grids / clean negative space。
```

## C20 ツムギ

```txt
faceSignature: TSUMUGI-SOFT-TRIANGLE-RABBIT
faceShape: soft triangular / wider cheek, small rounded chin。
eyes: large but droopy rabbit-like, lower line more curved than upper。
eyelid: imperfect / slightly uneven double fold。
brows: short rounded brows, one sits a little higher。
lashes: lower outer lashes visible, upper fine。
nose: small but not erased。
mouth: medium-small, one corner hesitant。
mark: small stitch-like scar Candidate only if story-connected。
hair: loose strands with unfinished tie / visible ends。
accessory: thread earring / textile knot, low metal content。
clothing: unfinished hems / visible seam allowance / blank panels。
```

## C21 レン

```txt
faceSignature: REN-FOCUS-ASYM-GLASSES
faceShape: small oval, slightly longer than Shiro。
eyes: one eye naturally squints a little more when focusing; moderate round-almond。
eyelid: one side stronger fold / intentional asymmetry。
brows: thin-medium, one brow raises when comparing。
lashes: minimal upper, tiny lower outer。
nose: medium narrow bridge, glasses sit higher than Shiro。
mouth: narrow with one-side thinking tension。
mark: focus crease between brows Candidate。
hair: side part, one lock crosses temple。
accessory: **round glasses Current**, but lens focus glint / fit differs from Shiro。
clothing: small-scale contrast / paired details / observer pockets。
```

---

# 4. Future15 — appearance Candidate signatures

Future15はCurrentへ自動昇格しないが、生成時は同じ顔禁止contractを適用する。

## F01 ヒヨリ

```txt
faceSignature: HIYORI-BROAD-SMILE-UPTURN
skin: natural dark / brown skin, not tan-gag
faceShape: broad oval, full cheek。
eyes: smiling upturned almond、outer corner high but soft。
eyelid: clear parallel double。
brows: thick curved brows with visible hair texture。
lashes: fluffy upper outer, lower short dense。
nose: broader bridge and rounded tip。
mouth: wide full-lip smile。
mark: one cheek beauty mark Candidate。
bodyMod: tiny nose stud + colorful ear stack Candidate。
hair: volume / texture appropriate to design, not generic straight recolor。
clothing: playful mixed-accessory but no oversexualized gyaru shorthand。
```

## F02 セリカ

```txt
faceSignature: SERIKA-LONG-DOE-REFINED
faceShape: long heart / elegant jaw。
eyes: large downturned doe eyes, wide spacing。
eyelid: high clean tapered double。
brows: refined long arch, not thin-line stereotype。
lashes: long upper center + outer, fine lower。
nose: narrow high bridge, soft tip。
mouth: defined cupid bow, restrained smile。
mark: faint beauty mark below cheekbone Candidate。
accessory: refined earrings / heirloom pin rather than crown/overt nobility cliché。
clothing: posture and tailoring show upbringing, not constant formal gown。
```

## F03 クロエ（working）

```txt
faceSignature: CHLOE-YOUTHFUL-OLD-EYES
ageCoding: adult / long-lived; young-looking adult, never sexualized as child
faceShape: petite rounded adult face with small jaw。
eyes: surprisingly narrow, calm old-soul eyes contrasting youthful face。
eyelid: thin double, age-impression not from wrinkles but gaze。
brows: soft straight, slightly low。
lashes: fine, long but not doll-like。
nose: small adult proportions, bridge visible。
mouth: small with mature tension lines when serious。
mark: no child-coded blush; optional old burn spot on hand rather than face。
hair: style may change by era; base hairline constant for recognition。
accessory: old ring / pendant from past generation Candidate。
clothing: layers from multiple eras, not gothic-loli shorthand。
```

## F04 レンジ（working）

```txt
faceSignature: RENJI-AGED-WIDE-NOSE-LAUGHLINE
faceShape: older broad oblong, jaw softened with age。
eyes: deep-set with drooping outer corners。
eyelid: heavy age-fold。
brows: expressive thick-to-thin gray brows。
lashes: minimal。
nose: large broad nose, clearly different from Gen's hooked profile。
mouth: wide smile with deep laugh lines。
mark: forehead / neck age lines, optional beard/stubble depending era。
hair: gray / white, practical, not wise-master costume default。
accessory: old student token retained through decades Candidate。
```

## F05 トウマ

```txt
faceSignature: TOUMA-SQUARE-DARK-CRAFTSMAN
skin: natural dark / brown skin
faceShape: square adult masculine face, broad jaw。
eyes: heavy-lidded medium eyes, slightly close-set。
eyelid: strong inner fold。
brows: thick with one healed notch Candidate。
lashes: natural short。
nose: broad straight bridge, fuller nostril shape。
mouth: full lips, relaxed closed smile。
mark: craft scar at temple / eyebrow Candidate。
bodyMod: ear plug/stud or forearm tattoo Candidate; traditional tattoo requires cultural history review。
hair: short textured / tied depending era, never Hiyori palette-recolor。
clothing: real craft wear, hardware / stitching connected to job。
```

## F06 クウ

```txt
species: real dog, NOT Star Beast
faceSignature: KUU-DOG-SCENT-01
muzzle: medium muzzle, readable nostril / whisker pads。
eyes: warm slightly almond canine eyes, not anime human eyes pasted on dog。
ears: asymmetric resting position Candidate, one ear rises sooner when hearing familiar steps。
mark: nose / paw pattern unique identifier。
accessory: worn collar / cloth tag only if story-supported。
```

## F07 ヨモ

```txt
species: real cat, NOT Star Beast
faceSignature: YOMO-CAT-MULTINAME-01
faceShape: feline triangular cheek / real-cat muzzle language。
eyes: large horizontal feline pupils/iris language appropriate to light, not human kawaii eyes。
ears: one small nick Candidate from real life history。
coat: distinctive natural pattern that remains same regardless of names people call them。
accessory: none by default; different households may have remembered different collar Candidates but identity is body/coat first。
```

## F08 ノア

```txt
species: artificial person / replica continuity
faceSignature: NOA-REPLICA-BASE
intentionalResemblance: TWO_BODIES_SHARE_INITIAL_FACE
baseFace: same snapshot-derived bone structure is REQUIRED, not same-face accident。
divergenceRule: body A/B gain different micro-scratches, eye-focus calibration, hair wear, accessory choice, posture and expression over time。
eyes: identical optics at activation; later one develops different default focus behavior Candidate。
mark: candidate serial marks must not imply original/copy hierarchy。
clothing: initially same issue, later independently repaired / modified pieces。
QA: viewer should first notice likeness, later identify A/B without labels by accumulated differences。
```

## F09 ルム

```txt
species: small maintenance Robot / collective AI
faceSignature: LUM-NONHUMAN-OPTIC
humanFace: forbidden by default
optics: asymmetrical small lamp-like optical cluster rather than two anime eyes。
body: compact maintenance body, repair hatches and light ports define expression。
expression: aperture / lamp angle / body tilt, not mouth imitation。
mark: one individually kept scratched component becomes personal recognition point Candidate。
```

## F10 マキ

```txt
faceSignature: MAKI-BROAD-STRONG-HOODED
body: broad / strong adult woman Candidate
faceShape: broad square-oval, strong cheek and jaw。
eyes: hooded medium almond, confident horizontal gaze。
eyelid: deep outer double fold。
brows: thick natural brows with high inner density。
lashes: short upper, almost no lower。
nose: strong medium-wide bridge。
mouth: fuller lips / wide grin after competition。
bodyMod: nostril stud or one lip stud Candidate, not both; strong arm jewelry / sports tape possible。
hair: practical high tie / undercut Candidate after review。
clothing: broad shoulder movement / utility, not feminized tiny waist by default model bias。
```

## F11 スズ

```txt
faceSignature: SUZU-HEART-FEMININE-MAN
ageCoding: adult man
faceShape: soft heart-shaped adult male face, visible jaw under styling。
eyes: downturned almond, long eye line。
eyelid: clear parallel double。
brows: fine but natural hair visible, shaped intentionally。
lashes: curled upper lashes and visible lower corner; chosen styling can include makeup。
nose: medium narrow adult nose, not tiny child nose。
mouth: neat full lower lip, lipstick Candidate according to outfit/day。
bodyMod: ear cuffs / nail art / rings Candidate。
clothing: feminine presentation by choice; no reveal-joke / correction arc。
```

## F12 イオ

```txt
faceSignature: IO-ANDROGYNOUS-MONOLID-WIDESET
ageCoding: adult; gender undisclosed Candidate
faceShape: long oval-rectangle, balanced jaw。
eyes: wide-set monolid almond, medium aperture。
eyelid: monolid / minimal crease。
brows: straight medium brows, low arch。
lashes: short neutral distribution, not strongly gender-coded。
nose: medium broad bridge, clear profile。
mouth: medium width, neutral lip volume。
mark: one ear slightly different contour Candidate, not gender clue。
bodyMod: minimal, e.g. single plain ear cuff Candidate。
clothing: sound/listening utility, avoid androgyny = shapeless gray sack shorthand。
```

## F13 カイ

```txt
faceSignature: KAI-TWIN-ROUND-OPEN
intentionalResemblance: TWIN_WITH_NAO
baseBoneStructure: shared family resemblance with Nao。
eyes: rounder/open almond, outer corner neutral。
eyelid: visible tapered double。
brows: slightly thicker / straighter than Nao。
nose: same family nose base, tip slightly softer in expression language。
mouth: smiles symmetrically, upper lip thin。
mark: right-side tiny mole / scar Candidate.
hair: tends toward paired/symmetric styling at start, later own choice。
accessory: matching item initially, keeps one shared piece by choice。
```

## F14 ナオ

```txt
faceSignature: NAO-TWIN-NARROW-ASYM
intentionalResemblance: TWIN_WITH_KAI
baseBoneStructure: shared family resemblance with Kai。
eyes: narrower than Kai, one side opens less when skeptical。
eyelid: one fold stronger / intentional asymmetry。
brows: thinner with higher arch than Kai。
nose: same family base; stronger shadow through pose / angle rather than changing genetics absurdly。
mouth: one-side smirk / often avoids matching Kai's expression。
mark: left-side tiny mark Candidate, mirrored but not identical gimmick。
hair: deliberately chooses non-matching silhouette early; later can choose same thing without identity panic。
```

Twin QA: 似ていることは必要。ただし hair/accessoryを隠しても `eye+brow+expression` で識別可能にする。

## F15 アマネ

```txt
faceSignature: AMANE-TRIANGLE-WIDESET-GAPSMILE
ageCoding: adult woman
faceShape: strong soft-triangle, cheek width > jaw width。
eyes: wide-set almond, one upper lid slightly heavier。
eyelid: tapered double with asymmetry。
brows: medium straight-to-soft-arch, expressive inner brow。
lashes: upper outer medium, lower sparse。
nose: medium-width short bridge。
mouth: wide smile, small front-tooth gap Candidate for recognition。
mark: sun / outdoor lines Candidate depending era。
bodyMod: small ear studs / practical wrist accessories, no disability-fetish framing。
clothing: wheelchair use affects reach / storage / silhouette practically; never "cured" visual reward。
```

---

# 5. Body modification reservoir

使えるが**一人へ全部盛らない**。

```txt
lobe piercing
helix
industrial
conch
tragus
ear cuff
nostril stud
septum
lip ring
labret
tongue piercing
small hand-poked tattoo
large tattoo
traditional Japanese tattoo / 和彫り
old professional mark
nail art
chipped nail polish
rings
friendship rings
heirloom jewelry
anklet
charm bracelet
protective cord
```

## Rules

- pierce / tattoo = 悪役、性的、反抗的のshortcutにしない。
- 和彫りはデザインの派手さだけで採用せず、時代 /文化 /仕事 /本人の人生と整合させる。
- 同じpiercing layoutを複数キャラへ配らない。
- 舌piercingは目立つため、Current/Future全体で少数にする。
- tattooの大きさ・場所・古さ・本人が見せる/隠す理由まで人物設定に接続する。
- child-coded人物へ成人body modificationを付けない。

---

# 6. Clothing construction uniqueness

服も「色違い同型」を禁止する。

Current21 / Future15へ最低一つのconstruction languageを持たせる。

Examples:

```txt
Yui       curved travel layers
Asa       asymmetric cropped diagonals
Nagi      closed long verticals
Michiru   active map-cloth layers
Tomori    repaired diagonal patchwork
Sen       rolled teacher/work layers
Ritsu     split/paired construction
Koyori    small paper-cord layers
Gen       worn old-route tailoring
Hana      rounded shawl / preserved textiles
Yubi      envelope flap / courier layering
Madoka    window / paper-wing openings
Shiro     flat page / bookmark planes
Tobari    gate-frame vertical split
Nemu      soft loose dream drape
Kuroori   folded angular planes
Kaname    broad protection shell
Kasumi    translucent overlap / privacy layers
Toki      measured grid / clean seams
Tsumugi   unfinished hems / seam allowances
Ren       paired micro-difference details
Hiyori    playful mixed textures
Serika    precise tailored elegance
Chloe     layered eras / inherited pieces
Renji     repaired aging garments
Touma     craft hardware / work seams
Kuu       body first; clothing minimal
Yomo      body/coat first; clothing none default
Noa       identical issue → divergent repairs
Lum       maintenance shell / access panels
Maki      broad movement utility
Suzu      intentional feminine styling
Io        sound utility / balanced silhouette
Kai       shared-base then personal choices
Nao       deliberate divergence then reconciliation
Amane     wheelchair-integrated storage / reach design
```

---

# 7. New Character Admission Gate

今後の37人目以降はprofile追加前に以下を埋める。

```txt
faceSignatureId
species / ageCoding
faceShape
eyeShape
eyeTilt
eyeSpacing
eyelid
brow
upperLash
lowerLash
nose
mouth
cheekMarks
hairStructure
bodyShape
bodyModification
accessoryLanguage
clothingConstruction
restingExpression
poseLanguage
intentionalResemblanceReason | null
nearestExistingFace
howItDiffersFromNearestExisting
```

### Fail conditions

- `nearestExistingFace` を説明できない
- nearestとの差が髪色 / eye colorだけ
- 既存人物とfaceSignatureがほぼ同じ
- generic anime defaultsが5軸以上重複
- 体型 / 年齢 /肌 /gender presentationだけが唯一の個性
- accessoryを外したら既存人物と同じ

この場合:

> **NEW CHARACTER VISUAL = NOT GENERATION READY**

とする。

---

# 8. Intentional resemblance exceptions

## Twins

似ていてよい。
ただし:

- eye aperture
- brow
- resting expression
- posture
- hair choices
- accessory choices

の最低5点で本人を識別する。

## Triplets Candidate

三つ子を追加する場合も:

> identical triplets = 同じ顔三枚

にはしない。

家族骨格を共有しつつ、三人それぞれ:

- 眉
- 目の開き
- 表情筋
- 髪の生え癖
- 傷 / ほくろ等の後天差
- 装い
- posture

を分ける。

三つ子というカテゴリだけで新規追加しない。

## Noa replica bodies

同じsnapshotなのでinitial face一致は物語上必要。
しかし時間経過で:

- damage history
- repair decisions
- personal accessory
- posture
- expression default
- calibration drift

が蓄積し、「同じ過去から別の現在」になる。

---

# 9. Prompt Builder Rule

将来の画像生成packetはcharacter nameだけを渡さず、最低以下を自動添付する。

```txt
identity authority
faceSignature
negative same-face constraints
body silhouette
hair structure
body modification allocation
clothing construction
named object
theme color
star beast boundary
age coding
forbidden drift
nearest-face comparison
```

例:

```txt
Do not reuse Yui's face base for Asa.
Asa must keep a compact angular jaw, narrow upturned eyes,
inner double eyelids, thin arched brows, sparse outer lashes,
asymmetric smirk and asymmetric ear piercing layout.
```

個別prompt内で比較対象を明示すると、モデルのdefault faceへ収束しにくい。

---

# 10. 一文

> **ヨルノシルベのキャラクターは、髪・色・衣装を外しても顔と佇まいで誰か分かる。似ることに意味がある双子やreplicaだけは似てよいが、その「同じ」と「違う」自体を人物の物語にする。**
