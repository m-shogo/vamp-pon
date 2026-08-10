import { commercialProductionProfileById } from './commercialProductionProfile.ts';
import { namedObjectRegistry, type NamedObjectNamingStatus } from './namedObjectRegistry.ts';
import type { ArtworkApprovalState } from './sharedSourceContracts.ts';

export type NamedObjectGeometrySeed = {
  frontSilhouette: string;
  backSilhouette: string;
  sideSilhouette: string;
  scale: string;
  material: string;
  wearMarks: string;
  repairMarks: string;
  handlingGesture: string;
  storageMethod: string;
  historyMarkRule: string;
  avoid: readonly string[];
};

export type NamedObjectVisualSharedSourceEntry = {
  id: string;
  sourceNamedObjectId: string;
  ownerId: string;
  ownerDisplayName: string;
  displayName: string;
  namingStatus: NamedObjectNamingStatus;
  phase: 'luminous_possession';
  geometryAuthority: 'CANDIDATE_OBJECT_GEOMETRY';
  frontSilhouette: string;
  backSilhouette: string;
  sideSilhouette: string;
  scale: string;
  material: string;
  wearMarks: string;
  repairMarks: string;
  handlingGesture: string;
  storageMethod: string;
  storyAuthorityLevel: string;
  replicaSafeDetail: string;
  entryGoodsAllowed: boolean;
  collectorGoodsAllowed: boolean;
  functionalReplicaAllowed: false;
  premiumReplicaAllowed: false;
  historyMarkRule: string;
  spoilerBoundary: string;
  commercialEntryForm: string;
  commercialCollectorForm: string;
  premiumReplicaCandidate: string;
  avoid: readonly string[];
  negativePromptHints: readonly string[];
  generationBriefSeed: string;
  authoritySources: readonly [
    'src/game/data/namedObjectRegistry.ts',
    'src/game/data/commercialProductionProfile.ts',
  ];
  referenceGenerationReady: false;
  runtimeReady: false;
  artworkReady: false;
  artworkState: ArtworkApprovalState;
};

const COMMON_AVOID = [
  'generic fantasy relic ornament',
  'glowing rune, zodiac glyph or Toumon shape added without authority',
  'neon cyan/purple AI glow',
  'perfectly pristine luxury-product normalization',
  'glossy 3D game-prop render language',
  'baked readable text, letters, numbers, logo or watermark',
  'wear marks erased to make the object look premium',
  'new backstory engraved into the object',
] as const;

export const NAMED_OBJECT_GEOMETRY_SEEDS: Readonly<Record<string, NamedObjectGeometrySeed>> = {
  yui: {
    frontSilhouette: 'small hand lantern with a broad rounded rectangular body, short top handle and one open return-tag loop hanging from a side joint',
    backSilhouette: 'same lantern body with a plain service plate and one offset seam; no owner name plate',
    sideSilhouette: 'shallow lantern depth, slightly convex light chamber and narrow handle hinge',
    scale: 'one-hand portable lantern; about forearm/large-mug scale, not a full railway lamp',
    material: 'aged dark metal, warm translucent paper/glass light panel, worn cloth/paper return tag',
    wearMarks: 'thumb-polished handle underside, small corner scuffs, soot-darkened vent edge',
    repairMarks: 'one visible replaced hinge pin or mismatched small screw; repair remains visible',
    handlingGesture: 'lift by the top handle, then turn the lamp outward toward another person rather than clutching it to the chest',
    storageMethod: 'hang by handle or rest in a shallow return tray with the tag loop left visible',
    historyMarkRule: 'history appears through wear/repair only; do not engrave a canonical owner name or route number',
    avoid: [...COMMON_AVOID, 'Victorian fantasy lantern', 'modern camping LED lamp'],
  },
  asa: {
    frontSilhouette: 'small rounded paper scissors with two unequal finger loops and short blunt-but-precise blades; one loose tying thread passes through a handle gap',
    backSilhouette: 'plain reverse with pivot head and one shallow scratch line; no engraved name',
    sideSilhouette: 'thin flat scissor profile with modest pivot thickness and closed blade gap still visible',
    scale: 'small stationery scissors, palm length',
    material: 'matte worn steel, wrapped/paper-soft handle insert, thin name-tying thread',
    wearMarks: 'polished pivot edge and tiny blade scratches from paper use',
    repairMarks: 'one replacement thread/wrap at a handle loop, not a decorative ribbon',
    handlingGesture: 'hold by one loop and offer the second loop/handle side first when passing it',
    storageMethod: 'flat paper sleeve or small letter-case pocket with blades closed',
    historyMarkRule: 'no permanent written name; identity remains in shape, thread and use marks',
    avoid: [...COMMON_AVOID, 'weapon dagger scissors', 'medical surgical scissors', 'readable name engraving'],
  },
  nagi: {
    frontSilhouette: 'small silver key with a low crescent/notched bow and a simple two-step tooth profile; no ornate crown bow',
    backSilhouette: 'plain flat key reverse with one shallow old scratch crossing the bow',
    sideSilhouette: 'thin old key plate with slightly uneven hand-worn edge and modest tooth depth',
    scale: 'keepsake-box key, shorter than a house key',
    material: 'dull silver alloy with soft oxidation in recesses',
    wearMarks: 'polished bow edge where fingers hold it, softened tooth corners',
    repairMarks: 'one tiny solder/straightening trace near the bow if visible, never jewel repair',
    handlingGesture: 'pinch the bow lightly and pause before inserting; opening is a deliberate consent action',
    storageMethod: 'small cloth key sleeve or inside a box-side slot; never displayed like a royal key',
    historyMarkRule: 'wear may imply repeated opening/closing but never reveal what is inside the Moon Box',
    avoid: [...COMMON_AVOID, 'kingdom key', 'giant magical key', 'moon glyph overload'],
  },
  michiru: {
    frontSilhouette: 'small round compass with one visibly repaired/off-axis return needle and an open route notch in the outer ring; no decorative compass rose',
    backSilhouette: 'plain worn back plate with two small service screws and one route-thread attachment point',
    sideSilhouette: 'shallow round case, slightly raised glass/lens rim and a small side loop',
    scale: 'pocket compass, palm sized',
    material: 'dull brass/blue-gray metal, scratched glass, thin paper/fiber route thread',
    wearMarks: 'polished ring edge, hairline glass scratch, darkened brass near hinge/loop',
    repairMarks: 'needle pivot replacement and one mismatched tiny screw remain visible',
    handlingGesture: 'hold flat in the palm, rotate the whole body and compare directions rather than treating the needle as absolute truth',
    storageMethod: 'folding map pocket or small fabric compass sleeve',
    historyMarkRule: 'no fixed “correct route” engraved; history is in scratches and repaired pivot',
    avoid: [...COMMON_AVOID, 'ornate compass rose', 'pirate treasure compass', 'single correct magic direction'],
  },
  tomori: {
    frontSilhouette: 'compact repair lamp with an uneven patched outer shell, short handle and one clearly replaced seam strip; lamp body is workmanlike not decorative',
    backSilhouette: 'service side with visible fasteners, one patch plate and an old soot line that repair did not erase',
    sideSilhouette: 'slightly asymmetrical depth where the replacement panel sits proud of the older shell',
    scale: 'portable work lamp, one-hand carry but heavier than Yui lantern',
    material: 'bengara-red/brown aged metal, soot-darkened brass, warm glass/paper light panel',
    wearMarks: 'soot at upper vent, tool scratches near screws, handle polish from use',
    repairMarks: 'mismatched seam strip, replacement screw and stitch-like reinforcement line are intentional identity',
    handlingGesture: 'brace body with one hand and adjust/repair with the other; when carrying, keep patched face visible rather than hiding it',
    storageMethod: 'repair bench tray or tool shelf, never a pristine display pedestal by default',
    historyMarkRule: 'repair marks are canonical identity language; do not restore to “new condition” for premium art',
    avoid: [...COMMON_AVOID, 'steampunk gadget overload', 'brand-new polished lamp', 'repair scars removed'],
  },
  sen: {
    frontSilhouette: 'slim chalk-light holder shaped like a short classroom chalk case with one white-line slit and an open branch notch',
    backSilhouette: 'plain flat back with chalk-dust rub and one replaceable clip/rail',
    sideSilhouette: 'thin rectangular body with a shallow chalk channel and slightly protruding cap/holder lip',
    scale: 'large marker/chalk-holder size, easy one-hand stationery use',
    material: 'matte green-gray casing, chalk-white insert, paper/wood classroom wear',
    wearMarks: 'chalk dust embedded near slit, softened grip edge and desk scuffs',
    repairMarks: 'one replacement clip or taped seam kept visible but functional',
    handlingGesture: 'draw a line outward and stop before closing a shape; point with the holder without using it as a wand',
    storageMethod: 'chalk tray, pen sleeve or branching-route notebook pocket',
    historyMarkRule: 'never write the canonical “answer” on the object; only route/line traces without readable text',
    avoid: [...COMMON_AVOID, 'teacher wand', 'magical staff', 'blackboard UI text baked into object'],
  },
  ritsu: {
    frontSilhouette: 'small rectangular candy tin split visually by a half-light lid seam; one side shows slightly more wear than the other',
    backSilhouette: 'plain tin bottom with shallow ring wear and one old dent, no nutrition/brand text',
    sideSilhouette: 'low tin profile with rolled metal rim and a lid that can be opened from either side',
    scale: 'pocket candy/tobacco-tin scale, palm width',
    material: 'matte worn tinplate, faded red/pink wrapper-paper trace inside',
    wearMarks: 'corner dents, thumb-polished lid edge, faint wrapper rub inside',
    repairMarks: 'one bent lid corner carefully straightened; do not make repair decorative',
    handlingGesture: 'open the tin and divide contents/space into two portions before offering one side',
    storageMethod: 'jacket/pouch pocket or two-slot display stand',
    historyMarkRule: 'history is “shared/divided use”, not food quantity, appetite or body commentary',
    avoid: [...COMMON_AVOID, 'food/glutton joke', 'romantic paired-heart tin for siblings', 'brand/logo text'],
  },
  koyori: {
    frontSilhouette: 'small paper-twist name tag made from narrow twisted paper cord and one tiny blank tab; irregular handmade asymmetry is essential',
    backSilhouette: 'blank reverse tab with visible paper-twist knot and fiber ends, no written name',
    sideSilhouette: 'extremely thin paper object with one small knot/loop providing depth',
    scale: 'finger-length paper tag/charm, deliberately small but not toy-like',
    material: 'fibrous pale paper twist, soft pink paper tab, tiny thread reinforcement',
    wearMarks: 'softened tab corners and slight paper fuzz where fingers handle it',
    repairMarks: 'one re-twisted or re-knotted section is acceptable and should stay visible',
    handlingGesture: 'hold by the paper twist, connect/loop it to another object only with visible slack rather than tightening completely',
    storageMethod: 'small organizer slot or paper envelope with the loop outside',
    historyMarkRule: 'no permanent canonical written name on generated art; the blank/tab state is intentional',
    avoid: [...COMMON_AVOID, 'child-toy styling', 'readable name label', 'Ritsu accessory-only presentation'],
  },
  gen: {
    frontSilhouette: 'old station-lamp-like desk/hand lamp with a broad practical base, small top cap and one aged compass-needle detail inside the light window',
    backSilhouette: 'plain service back with old fasteners and an open route-hook, no railway company plate',
    sideSilhouette: 'moderate lamp depth with sturdy base and slightly leaning old handle/needle housing',
    scale: 'small station/desk lamp, larger than a pocket lantern but portable with two hands or one strong hand',
    material: 'aged brass, dark olive-brown painted metal, warm frosted glass',
    wearMarks: 'edge patina, old desk scratches, finger-polish on handle and switch',
    repairMarks: 'one old replacement screw and a needle adjustment mark; old repairs remain part of the object',
    handlingGesture: 'set down first, then turn/consult it together with a map or younger person; no oracle gesture',
    storageMethod: 'desk, shelf or station-like ledge with open route map nearby',
    historyMarkRule: 'no real station name, company logo or historical route number; age comes from material only',
    avoid: [...COMMON_AVOID, 'real Japanese railway lamp reproduction', 'wizard lamp', 'railway logo imitation'],
  },
  hana: {
    frontSilhouette: 'rounded archival keepsake box with a soft fabric/paper lid panel and one pressed-flower vein seam; generous round corners without luxury jewelry-box styling',
    backSilhouette: 'plain fabric/paper back with a broad hinge strip and visible re-stitched corner',
    sideSilhouette: 'low rounded box profile with layered paper/fabric wall and a slightly compressed used lid',
    scale: 'two-hand keepsake box, roughly small book/tea-box footprint',
    material: 'warm paperboard, cloth wrap, dried-flower/paper fiber details, muted metal hinge',
    wearMarks: 'softened cloth corners, finger-darkened lid edge, faded pressed-flower trace',
    repairMarks: 'visible re-stitched fabric corner and replaced hinge thread/strip; never erase mending',
    handlingGesture: 'support from below with both hands, open partially and preserve uncertain contents rather than emptying everything',
    storageMethod: 'low archive shelf with cloth wrap; can remain partly open without being “unfinished”',
    historyMarkRule: 'preservation marks and repair stitches are meaningful; no body/food jokes or slimming symbolism',
    avoid: [...COMMON_AVOID, 'slim elegant jewelry box normalization', 'food storage joke', 'body-size joke', 'all repair stitches hidden'],
  },
  yubi: {
    frontSilhouette: 'small postal-like light with a rectangular envelope slot shape and one waiting/reply indicator flap, but no real postal insignia',
    backSilhouette: 'plain lamp casing with service seam and a paper-envelope holding clip',
    sideSilhouette: 'shallow box-lamp profile with short hood and a single envelope clip projection',
    scale: 'small carry/desk postal lamp, one-hand portable',
    material: 'warm brown painted metal, old envelope paper, muted brass clip, amber light panel',
    wearMarks: 'slot/clip polish, paper rub marks, small corner abrasions from carrying',
    repairMarks: 'one replacement clip spring or flap hinge with mismatched metal tone',
    handlingGesture: 'place an envelope/blank paper in the clip and wait; do not force immediate delivery motion',
    storageMethod: 'route shelf, mail tray or carry case with the reply flap visible',
    historyMarkRule: 'no readable address, sender, recipient, postmark or real postal logo',
    avoid: [...COMMON_AVOID, 'Japan Post/real postal logo imitation', 'readable address', 'speed-delivery gadget'],
  },
  madoka: {
    frontSilhouette: 'round observational lens in a thin rectangular/window-like frame with one open corner; optical center slightly offset rather than perfectly symmetrical',
    backSilhouette: 'plain frame back with two small retention clips and one paper-plane-shaped fold trace as a nonliteral seam only',
    sideSilhouette: 'thin lens/frame profile with a modest raised glass rim and one fold-out viewing support',
    scale: 'palm-sized handheld/viewing lens, larger than eyeglass lens and smaller than camera lens',
    material: 'clear slightly imperfect glass, pale metal/wood frame, paper-like support tab',
    wearMarks: 'fine edge scratches and one cleaned/polished viewing area, never cracked for drama by default',
    repairMarks: 'one replaced retention clip or support hinge kept visible',
    handlingGesture: 'hold at arm/face distance and shift angle to compare distant details rather than press to the eye like a monocle',
    storageMethod: 'padded paper sleeve or window-frame display slot',
    historyMarkRule: 'no recorded “truth” or target name engraved into frame; lens only supports observing differences',
    avoid: [...COMMON_AVOID, 'camera-tech gadget', 'monocle stereotype', 'HUD crosshair baked into glass'],
  },
  shiro: {
    frontSilhouette: 'long narrow white bookmark-light with one deliberately blank classification tab and a soft blue-gray edge line',
    backSilhouette: 'plain fibrous back with a small attachment slot and an unfilled archive field area, no text',
    sideSilhouette: 'paper-thin bookmark body with one slightly thicker light/clip edge',
    scale: 'book-height narrow bookmark, handheld but mostly page-bound',
    material: 'white paper/fiber composite, matte pale metal clip, blue-gray edge light',
    wearMarks: 'soft page-rub along long edges and one bent-but-flattened corner',
    repairMarks: 'small reinforcement strip at the bent corner left visible',
    handlingGesture: 'insert between pages while leaving the blank tab outside; do not force a category label',
    storageMethod: 'inside archive/book pages or flat card sleeve',
    historyMarkRule: 'blank classification area must remain blank; unknown is preserved rather than solved by product art',
    avoid: [...COMMON_AVOID, 'readable library classification number', 'all-white featureless SaaS icon', 'forced category text'],
  },
  tobari: {
    frontSilhouette: 'compact ticket-gate punch/scissor with two opposing rounded punch jaws and a clear reversible/open-close gap; not a real railway tool replica',
    backSilhouette: 'plain mechanical reverse with pivot and one return-spring housing, no company engraving',
    sideSilhouette: 'thin scissor/punch body with small jaw depth and modest spring housing',
    scale: 'handheld ticket punch, palm-to-hand length',
    material: 'dull steel/gray metal, sand-colored paper grip insert, worn pivot',
    wearMarks: 'handle polish, punch-edge scratches and old paper dust in the jaw area',
    repairMarks: 'one replaced spring/pivot pin with visible different metal tone',
    handlingGesture: 'open before approaching paper/gate, close once, then reopen; return/open state is as important as punch action',
    storageMethod: 'gate-side tool slot or cloth sleeve; jaws remain safely closed when stored',
    historyMarkRule: 'no real ticket hole shape, operator code, station stamp or railway company identity',
    avoid: [...COMMON_AVOID, 'real railway punch replica', 'weapon scissors', 'readable station code'],
  },
  nemu: {
    frontSilhouette: 'small water-surface diary with a soft flexible cover and one reflective oval/window patch that never shows readable future text',
    backSilhouette: 'plain worn cover with thread binding and one tide/water rub stain',
    sideSilhouette: 'thin diary/book block with visible page layers and a slightly bowed soft cover',
    scale: 'small hand diary, pocket-to-A6 scale',
    material: 'soft cloth/paper cover, fibrous pages, restrained water-reflection coating on one patch',
    wearMarks: 'page-edge waviness, softened cover corners and subtle water tide mark',
    repairMarks: 'one re-stitched binding section remains visible and functional',
    handlingGesture: 'open flat or halfway and observe changing reflection/page rather than pointing to a deterministic prediction',
    storageMethod: 'cloth sleeve or dry paper case, never a crystal fortune-telling stand',
    historyMarkRule: 'no readable future prediction baked into generated art; forecast is not command',
    avoid: [...COMMON_AVOID, 'fortune-telling book', 'readable prophecy', 'glowing magic tome'],
  },
  kuroori: {
    frontSilhouette: 'one irregular folded sheet of black paper whose crease edges catch a very thin light; no creature face or glyph printed on it',
    backSilhouette: 'same paper sheet with different fold overlap and matte black surface, emphasizing object ambiguity',
    sideSilhouette: 'extremely thin folded-paper profile with two or three layered creases and one slight opening gap',
    scale: 'single hand-sized paper sheet/folded note, deliberately ordinary in size',
    material: 'matte black fibrous paper with worn fold ridges and minimal reflected edge light',
    wearMarks: 'softened fold peaks, tiny paper fiber tears, finger sheen on one edge',
    repairMarks: 'no automatic repair; a later reinforcement fold/tape would require explicit story authority',
    handlingGesture: 'hold open at a crease with permission/attention to the gap; never tear it open for spectacle',
    storageMethod: 'flat archive sleeve or loose between paper layers, keeping folds intact',
    historyMarkRule: 'history is in folds and handling wear only; no hidden text/symbol invented on either side',
    avoid: [...COMMON_AVOID, 'monster face in black paper', 'origami animal Canonization', 'secret readable message'],
  },
  kage1: {
    frontSilhouette: 'broad protective arm band with overlapping soft panels and one open adjustment gap; substantial but not sports/bodybuilder gear',
    backSilhouette: 'plain soft backing with two broad fasteners and visible repeated-use compression',
    sideSilhouette: 'thick soft layered band with shallow padding and flexible overlap, no hard armor plate',
    scale: 'adjustable upper/forearm band sized for practical protective use; body-size neutral and not a hitbox/HP signifier',
    material: 'gray cloth/leather-like soft textile, matte binding tape, small dull metal fastener',
    wearMarks: 'compression creases, softened binding edge and hand-polished fastener',
    repairMarks: 'one re-stitched binding seam and replaceable fastener kept visible',
    handlingGesture: 'wrap/adjust quickly, then use the arm to intercept/share burden; protection may be fast',
    storageMethod: 'rolled loosely in a cloth pouch, never mounted like armor trophy',
    historyMarkRule: 'do not encode body weight, strength rank or masculinity into sizing/markings',
    avoid: [...COMMON_AVOID, 'bodybuilder bracer', 'hard fantasy armor', 'body-size joke', 'slow/tank stat shorthand'],
  },
  kage2: {
    frontSilhouette: 'small pale erasure-light tool/object with a rectangular soft body and one visibly erased/rewriteable edge; identity comes from reversible trace',
    backSilhouette: 'plain pale back with ghosted non-readable rub marks and one refill/service seam',
    sideSilhouette: 'slim block profile with a softer working edge and a small light diffuser strip',
    scale: 'small stationery/hand tool, palm length',
    material: 'pale rubber/paper/cloth composite with soft white light and gray erased residue',
    wearMarks: 'rounded working edge, gray rub traces and softened corners',
    repairMarks: 'replaceable outer sleeve or patched corner may remain visible',
    handlingGesture: 'erase lightly while leaving a reversible ghost trace; pause before removing more',
    storageMethod: 'small stationery pouch or paper sleeve that keeps residue visible rather than polishing it away',
    historyMarkRule: 'erased marks stay abstract/non-readable; never reveal hidden personal text without authority',
    avoid: [...COMMON_AVOID, 'magic eraser wand', 'perfect deletion VFX', 'readable hidden message'],
  },
  kage3: {
    frontSilhouette: 'long slim night ruler with sparse star-like reference dots/marks but no numbers; one end deliberately leaves uncertainty/blank space',
    backSilhouette: 'plain dark-blue/gray reverse with one shallow alignment groove and no scale numbers',
    sideSilhouette: 'thin straight ruler profile with slightly worn edge and one small thickness change near grip point',
    scale: 'standard hand ruler, roughly 15–20 cm class',
    material: 'matte dark wood/metal/paper composite with restrained pale star-reference points',
    wearMarks: 'edge polish, tiny alignment scratches and one softened corner',
    repairMarks: 'one straightened/bound edge section remains visible but does not alter measurement semantics',
    handlingGesture: 'place beside an object/route to compare, then leave uncertainty instead of declaring exact truth from one measure',
    storageMethod: 'flat notebook/map sleeve or narrow tool pocket',
    historyMarkRule: 'no numbers, coordinates, dates or “correct answer” baked into generated art',
    avoid: [...COMMON_AVOID, 'literal zodiac constellation diagram', 'readable ruler numbers', 'laser measurement gadget'],
  },
  kage4: {
    frontSilhouette: 'small thread spool with one intentionally loose thread tail and a visible unused/blank gap between wraps; not fully wound',
    backSilhouette: 'same spool with a simple central axle and one re-tied thread knot',
    sideSilhouette: 'round spool flanges with layered thread thickness and one trailing thread crossing the silhouette',
    scale: 'hand sewing spool, palm/small-hand scale',
    material: 'white-gray thread, worn wood/paper spool, soft repaired knot',
    wearMarks: 'thread fuzz, spool-edge rub and finger polish near axle',
    repairMarks: 'one re-tied knot or joined thread is visible and not hidden as manufacturing defect',
    handlingGesture: 'unwind enough to bridge a gap but deliberately leave a loose end/blank space rather than sewing everything shut',
    storageMethod: 'small sewing pouch or open tray where the loose tail can remain visible',
    historyMarkRule: 'mending history is visible in joins; “complete” must not mean all gaps eliminated',
    avoid: [...COMMON_AVOID, 'fully perfect machine-wound spool', 'sewing witch tool', 'all loose ends hidden'],
  },
  ren: {
    frontSilhouette: 'small optical lens-light with one dominant lens and a deliberately offset secondary frame/focus line; compact and observational, not a camera',
    backSilhouette: 'plain optical housing with two retention clips and one open side slot; no model/serial text',
    sideSilhouette: 'thin lens body with one raised focus rim and small folded stand/tag attachment',
    scale: 'palm-sized optical object, between bookmark lens and small desk viewer',
    material: 'pale aqua/gray glass, matte metal/paper frame, soft cloth storage tab',
    wearMarks: 'fine edge scratches, one polished viewing zone and soft clip rub',
    repairMarks: 'one replacement clip or focus-ring repair trace kept visible',
    handlingGesture: 'shift focal distance and compare differences; no detective magnifying gesture',
    storageMethod: 'protective paper/cloth sleeve or observation side-slot',
    historyMarkRule: 'Reserve status: no hidden truth, release date or playable implication engraved into the object',
    avoid: [...COMMON_AVOID, 'camera lens gadget', 'detective magnifying glass', 'Current20 launch SKU implication'],
  },
};

const luminousPossessions = namedObjectRegistry.filter((entry) => entry.phase === 'luminous_possession');

export const namedObjectVisualSharedSourceEntries: readonly NamedObjectVisualSharedSourceEntry[] = luminousPossessions.map((object) => {
  const profile = commercialProductionProfileById.get(object.characterId);
  if (!profile) throw new Error(`Missing commercial profile for Named Object: ${object.characterId}`);
  const geometry = NAMED_OBJECT_GEOMETRY_SEEDS[object.characterId];
  if (!geometry) throw new Error(`Missing Named Object geometry seed: ${object.characterId}`);
  if (profile.namedObjectReplica.objectName !== object.displayName) {
    throw new Error(`Named Object commercial/source name mismatch for ${object.characterId}: ${profile.namedObjectReplica.objectName} / ${object.displayName}`);
  }

  return {
    id: `named-object-visual:${object.characterId}`,
    sourceNamedObjectId: object.id,
    ownerId: object.characterId,
    ownerDisplayName: object.characterDisplayName,
    displayName: object.displayName,
    namingStatus: object.namingStatus,
    phase: 'luminous_possession',
    geometryAuthority: 'CANDIDATE_OBJECT_GEOMETRY',
    frontSilhouette: geometry.frontSilhouette,
    backSilhouette: geometry.backSilhouette,
    sideSilhouette: geometry.sideSilhouette,
    scale: geometry.scale,
    material: geometry.material,
    wearMarks: geometry.wearMarks,
    repairMarks: geometry.repairMarks,
    handlingGesture: geometry.handlingGesture,
    storageMethod: geometry.storageMethod,
    storyAuthorityLevel: `${object.namingStatus}; stable source object id=${object.id}; geometry in this adapter remains candidate until separate visual approval.`,
    replicaSafeDetail: `Entry form: ${profile.namedObjectReplica.entryForm}. Collector form: ${profile.namedObjectReplica.collectorForm}. Do not add story detail beyond current source/geometry candidate.`,
    entryGoodsAllowed: profile.launchEligible,
    collectorGoodsAllowed: profile.launchEligible,
    functionalReplicaAllowed: false,
    premiumReplicaAllowed: false,
    historyMarkRule: geometry.historyMarkRule,
    spoilerBoundary: profile.namedObjectReplica.spoilerRule,
    commercialEntryForm: profile.namedObjectReplica.entryForm,
    commercialCollectorForm: profile.namedObjectReplica.collectorForm,
    premiumReplicaCandidate: profile.namedObjectReplica.premiumReplicaCandidate,
    avoid: [...geometry.avoid, ...profile.commercialNoGo],
    negativePromptHints: [
      'no readable text, letters, numbers, logo, watermark',
      'no generic fantasy relic ornament',
      'no neon cyan/purple glow',
      'no glossy pristine 3D prop',
      'no Toumon/zodiac glyph added without authority',
      'do not erase wear or repair marks',
    ],
    generationBriefSeed: [
      `${object.displayName} (${object.id}) — owner ${object.characterDisplayName}/${object.characterId}.`,
      `Naming status: ${object.namingStatus}. Geometry authority: CANDIDATE_OBJECT_GEOMETRY.`,
      `Front: ${geometry.frontSilhouette}`,
      `Back: ${geometry.backSilhouette}`,
      `Side: ${geometry.sideSilhouette}`,
      `Scale/material: ${geometry.scale} / ${geometry.material}`,
      `Wear: ${geometry.wearMarks}`,
      `Repair: ${geometry.repairMarks}`,
      `Handling/storage: ${geometry.handlingGesture} / ${geometry.storageMethod}`,
      `Entry/collector commercial direction: ${profile.namedObjectReplica.entryForm} / ${profile.namedObjectReplica.collectorForm}`,
      `Spoiler boundary: ${profile.namedObjectReplica.spoilerRule}`,
      `Functional/premium replica approval is fail-closed. Candidate geometry must be reviewed before reference generation.`,
    ].join('\n'),
    authoritySources: ['src/game/data/namedObjectRegistry.ts', 'src/game/data/commercialProductionProfile.ts'],
    referenceGenerationReady: false,
    runtimeReady: false,
    artworkReady: false,
    artworkState: 'NOT_GENERATED',
  };
});

export const namedObjectVisualSharedSourceByOwnerId = new Map(namedObjectVisualSharedSourceEntries.map((entry) => [entry.ownerId, entry]));
export const namedObjectVisualSharedSourceBySourceId = new Map(namedObjectVisualSharedSourceEntries.map((entry) => [entry.sourceNamedObjectId, entry]));

export const namedObjectVisualSharedSourceSummary = {
  totalCoreLuminousPossessions: namedObjectVisualSharedSourceEntries.length,
  candidateGeometryCount: namedObjectVisualSharedSourceEntries.filter((entry) => entry.geometryAuthority === 'CANDIDATE_OBJECT_GEOMETRY').length,
  functionalReplicaApproved: 0,
  premiumReplicaApproved: 0,
  referenceGenerationReady: false,
  runtimeReady: false,
  artworkReady: false,
} as const;
