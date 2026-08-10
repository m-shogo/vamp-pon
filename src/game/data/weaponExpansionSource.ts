import type { CombatAttribute, StatusKind } from './combatAffinitySource.ts';
import { existingWeaponCombatProfiles } from './combatAffinitySource.ts';
import { weapons } from './weapons.ts';

export type WeaponAttackArchetype =
  | 'SCATTER_PROJECTILE'
  | 'TETHER'
  | 'CONE_PUSH'
  | 'PULSE_CHAIN'
  | 'LANE_WALL'
  | 'SLAM_WAVE'
  | 'RETURNING_THROW'
  | 'TRAP_FIELD'
  | 'DELAYED_PULSE'
  | 'LINK_CHAIN'
  | 'HOMING_SNIPE'
  | 'SWEEP_CLEANSE'
  | 'REFLECT_COUNTER'
  | 'CONE_VEIL'
  | 'TRAIL_DROP'
  | 'LINE_STITCH'
  | 'RETURN_HOMING'
  | 'ORBIT_STITCH'
  | 'SPIRAL_CONTROL'
  | 'LANE_BOUNDARY';

export type WeaponVfxSource = {
  windup: string;
  travel: string;
  impact: string;
  residue: string;
  audioCue: string;
  safety: string;
};

export type BaseWeaponCandidate = {
  id: string;
  name: string;
  attributes: readonly CombatAttribute[];
  appliesStatuses: readonly StatusKind[];
  archetype: WeaponAttackArchetype;
  combatFantasy: string;
  mechanicalIdentity: string;
  characterAffinityIds: readonly string[];
  stageAffinityIds: readonly string[];
  vfx: WeaponVfxSource;
  runtimeStatus: 'CONTENT_SOURCE_ONLY';
  requiredRuntimeHook: string;
};

const safety = 'No full-screen whiteout, rapid global flash, giant bloom, or neon fog. Keep hit silhouette readable on mobile.';

export const baseWeaponCandidates: readonly BaseWeaponCandidate[] = [
  {
    id: 'ember_matchcase', name: '火種のマッチ箱', attributes: ['FIRE'], appliesStatuses: ['BURN'], archetype: 'SCATTER_PROJECTILE',
    combatFantasy: '擦った火種を数本だけ散らし、敵群へ小さな燃焼の起点を置く。',
    mechanicalIdentity: '短射程scatter。単発火力よりBURNを複数対象へ配る。', characterAffinityIds: ['tomori', 'ritsu', 'F01', 'F04'], stageAffinityIds: ['repair_lamp_workshop', 'half_candy_arcade'],
    vfx: { windup: 'one match-head ember at the hand', travel: 'short orange ember lines with charred-paper flecks', impact: 'tiny dry spark, not an explosion', residue: 'brief darkened paper edge on the floor', audioCue: 'dry match scratch + tiny pop', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'scatter projectile + status buildup',
  },
  {
    id: 'rain_thread', name: '雨縫い糸', attributes: ['WATER'], appliesStatuses: ['SOAK'], archetype: 'TETHER',
    combatFantasy: '濡れた糸が二体を縫うようにつなぎ、片方へのhitを弱く伝える。',
    mechanicalIdentity: 'two-target tether。chain damageではなくSOAK共有と位置制御。', characterAffinityIds: ['hana', 'F02', 'F13'], stageAffinityIds: ['pressed_flower_archive', 'dream_waterway'],
    vfx: { windup: 'dew bead gathers on a thin thread', travel: 'one reflective thread arc', impact: 'small ripple at both tether ends', residue: 'faint wet stitch marks fade slowly', audioCue: 'single water drop + thread pull', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'two-target tether + shared status',
  },
  {
    id: 'bellows_fan', name: '送り風の扇', attributes: ['WIND'], appliesStatuses: ['DISORIENTED'], archetype: 'CONE_PUSH',
    combatFantasy: '紙扇を一度だけ大きくあおぎ、前方の群れをずらす。', mechanicalIdentity: 'wide cone knockback。damageは低め、進路を作る。', characterAffinityIds: ['asa', 'yubi', 'F15'], stageAffinityIds: ['unposted_post_office', 'return_map_crossing'],
    vfx: { windup: 'fan ribs open in one readable beat', travel: 'two curved paper-air strokes', impact: 'enemies lean and slide rather than burst', residue: 'loose paper scraps settle in the pushed direction', audioCue: 'cloth-paper snap + low gust', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'cone query + knockback vector',
  },
  {
    id: 'copper_tuning_fork', name: '銅の音叉', attributes: ['THUNDER', 'METAL'], appliesStatuses: ['SHOCK', 'CONDUCTIVE'], archetype: 'PULSE_CHAIN',
    combatFantasy: '短い振動が近い導電対象へ順番に跳ぶ。', mechanicalIdentity: 'small radial pulse that prefers CONDUCTIVE targets; no long stun.', characterAffinityIds: ['F09', 'kage3', 'F14'], stageAffinityIds: ['ruler_rooftop', 'ticket_gate_station'],
    vfx: { windup: 'dull copper fork vibrates once', travel: 'thin amber-white branch hops target to target', impact: 'one-frame line accent with no screen flash', residue: 'tiny fading vibration rings', audioCue: 'muted metallic ping + soft electrical tick', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'target-chain selection + conductive preference',
  },
  {
    id: 'frost_window', name: '氷曇りの窓片', attributes: ['ICE'], appliesStatuses: ['CHILL'], archetype: 'LANE_WALL',
    combatFantasy: '細い曇り窓を一瞬立て、触れた敵を冷やして進路を遅らせる。', mechanicalIdentity: 'temporary line obstacle / chill lane, not permanent terrain.', characterAffinityIds: ['nagi'], stageAffinityIds: ['moon_box_library', 'paper_plane_window'],
    vfx: { windup: 'breath-like frost gathers on one rectangular shard', travel: 'wall unfolds from a narrow pale line', impact: 'frost edge catches feet with tiny crystal dust', residue: 'window condensation fades from center outward', audioCue: 'soft glass frost + cloth hush', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'temporary line hazard + chill buildup',
  },
  {
    id: 'pavement_hammer', name: '石畳の小槌', attributes: ['EARTH'], appliesStatuses: ['EXPOSED'], archetype: 'SLAM_WAVE',
    combatFantasy: '足元を叩き、短い亀裂を扇状に走らせる。', mechanicalIdentity: 'slow close slam + high break/stagger; directional rather than full-circle.', characterAffinityIds: ['sen', 'gen', 'kage1', 'F10'], stageAffinityIds: ['old_compass_station', 'chalk_classroom'],
    vfx: { windup: 'weight shifts before the hammer drops', travel: 'three short pavement cracks', impact: 'stone chips hop only near contact points', residue: 'crack lines remain briefly as readable lanes', audioCue: 'dull stone knock + low scrape', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'directional ground wave + break value',
  },
  {
    id: 'repair_spanner', name: '修理スパナ', attributes: ['METAL'], appliesStatuses: ['EXPOSED'], archetype: 'RETURNING_THROW',
    combatFantasy: '投げた工具が一体をかすめて手元へ戻る。帰路でも当たる。', mechanicalIdentity: 'boomerang with outbound/return hit tables; return angle matters.', characterAffinityIds: ['tomori', 'F05'], stageAffinityIds: ['repair_lamp_workshop'],
    vfx: { windup: 'one practical wrist turn, no magic charge', travel: 'dull metal arc with one edge glint', impact: 'small contact spark + tool rotation change', residue: 'none beyond a tiny metal dust fleck', audioCue: 'tool spin + two distinct clinks for out/return', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'returning projectile path',
  },
  {
    id: 'pressed_flower_cards', name: '押花札', attributes: ['BLOOM'], appliesStatuses: ['ROOTED'], archetype: 'TRAP_FIELD',
    combatFantasy: '数枚の押花札を地面へ置き、踏んだ敵だけを短く根留めする。', mechanicalIdentity: 'small discrete traps with arming delay; no giant persistent AoE.', characterAffinityIds: ['hana', 'kage4', 'F11'], stageAffinityIds: ['pressed_flower_archive', 'paper_cord_playground'],
    vfx: { windup: 'card lands face-down, textless', travel: 'short paper flutter only', impact: 'pressed veins unfold around feet', residue: 'dry petals remain until trap expires', audioCue: 'paper tap + dry petal rustle', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'armed trap entities + root conversion for bosses',
  },
  {
    id: 'dream_alarm', name: '夢の目覚まし', attributes: ['DREAM'], appliesStatuses: ['DROWSY'], archetype: 'DELAYED_PULSE',
    combatFantasy: '置いた時計が少し遅れて一度だけ鳴り、周囲の行動テンポをずらす。', mechanicalIdentity: 'telegraphed delayed pulse. Rewards placing ahead of a swarm.', characterAffinityIds: ['nemu', 'F03'], stageAffinityIds: ['dream_waterway'],
    vfx: { windup: 'clock hand twitches once', travel: 'none; object placement is physical', impact: 'soft violet double-ring with offset echo', residue: 'one fading afterimage of the clock hands', audioCue: 'muted alarm click, never a shrill loop', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'delayed one-shot area pulse',
  },
  {
    id: 'name_reel', name: '名前の糸巻き', attributes: ['MEMORY'], appliesStatuses: ['MARKED'], archetype: 'LINK_CHAIN',
    combatFantasy: '最初に当てた敵から次の敵へ名前のない線をつなぎ、連続hitで記名を深める。', mechanicalIdentity: 'persistent short chain that grows through hits; no readable letters.', characterAffinityIds: ['yui', 'asa', 'shiro', 'F04'], stageAffinityIds: ['name_tag_alley', 'white_bookmark_library'],
    vfx: { windup: 'spool rotates and one graphite thread leaves it', travel: 'textless graphite line between targets', impact: 'tiny record dot appears at connection point', residue: 'line remains just long enough to read the chain', audioCue: 'pencil drag + soft thread reel', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'persistent target links + marked stacks',
  },
  {
    id: 'star_map_pin', name: '星図のピン', attributes: ['STAR'], appliesStatuses: ['MARKED'], archetype: 'HOMING_SNIPE',
    combatFantasy: '遠い敵を一体だけ選び、少し曲がる針で弱点へ通す。', mechanicalIdentity: 'slow cadence high-accuracy shot; prefers far/high-priority targets.', characterAffinityIds: ['michiru', 'madoka', 'kage3', 'F14'], stageAffinityIds: ['return_map_crossing', 'ruler_rooftop'],
    vfx: { windup: 'one paper-gold pin rotates toward the target', travel: 'thin controlled gold arc, no constellation glyph', impact: 'pinprick star + tiny paper puncture', residue: 'small target point fades after mark duration', audioCue: 'quiet pin click + distant chime', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'priority homing target selection + crit hook',
  },
  {
    id: 'white_eraser', name: '白い消しゴム', attributes: ['BLANK'], appliesStatuses: ['ERASED'], archetype: 'SWEEP_CLEANSE',
    combatFantasy: '短い白い掃き跡で敵の一時強化を薄め、自分の弱いDebuffも一つだけ削る。', mechanicalIdentity: 'low-damage utility sweep with capped dispel/cleanse budget.', characterAffinityIds: ['shiro', 'nagi', 'kage4', 'F12'], stageAffinityIds: ['blank_card_room', 'erased_name_wall'],
    vfx: { windup: 'eraser presses against an invisible page plane', travel: 'short white dust sweep', impact: 'enemy effect opacity reduces instead of bursting', residue: 'clean paper gap closes after a moment', audioCue: 'dry eraser scrape + dust tap', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'bounded buff strip + player minor cleanse',
  },
  {
    id: 'pocket_mirror', name: 'ひび鏡', attributes: ['LIGHT'], appliesStatuses: ['ILLUMINATED'], archetype: 'REFLECT_COUNTER',
    combatFantasy: '一定間隔で正面を構え、受けた射撃の一部を細い光として返す。', mechanicalIdentity: 'timed counter window; contact attacks are not reflected.', characterAffinityIds: ['madoka', 'ren', 'F02'], stageAffinityIds: ['paper_plane_window', 'dawn_return_square'],
    vfx: { windup: 'mirror angle catches one warm edge', travel: 'reflected attack becomes a narrow warm line', impact: 'small reflected glint at source target', residue: 'crack pattern glows then goes dark', audioCue: 'small glass tick + warm ping', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'projectile reflect/counter window',
  },
  {
    id: 'black_folding_fan', name: '黒折り扇', attributes: ['DARK'], appliesStatuses: ['ECLIPSED'], archetype: 'CONE_VEIL',
    combatFantasy: '黒い折り面を前へ開き、短時間だけ敵の追尾精度を落とす。', mechanicalIdentity: 'cone debuff veil; damage modest, strongest against tracking/charge pressure.', characterAffinityIds: ['kuroori', 'kage2', 'F07'], stageAffinityIds: ['black_origami_roof', 'erased_name_wall'],
    vfx: { windup: 'matte black folds open one by one', travel: 'flat purple-black plane expands without fog', impact: 'target silhouette loses a little edge contrast', residue: 'fold lines collapse inward', audioCue: 'paper fold snap + low room-tone dip', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'cone accuracy debuff / tracking friction',
  },
  {
    id: 'morning_dew_dropper', name: '朝露のスポイト', attributes: ['WATER', 'LIGHT'], appliesStatuses: ['SOAK'], archetype: 'TRAIL_DROP',
    combatFantasy: '歩いたあとへ数滴だけ朝露を落とし、追う敵を濡らす。', mechanicalIdentity: 'movement-generated breadcrumb trail; rewards route planning.', characterAffinityIds: ['hana', 'yubi', 'F02', 'F15'], stageAffinityIds: ['pressed_flower_archive', 'unposted_post_office'],
    vfx: { windup: 'one clear drop forms at the tip', travel: 'drops fall only behind movement path', impact: 'tiny concentric ripple at feet', residue: 'pale dew points remain briefly, no glossy puddle spam', audioCue: 'soft periodic drops', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'movement trail emitters',
  },
  {
    id: 'wick_needle', name: '灯芯針', attributes: ['FIRE', 'METAL'], appliesStatuses: ['BURN', 'EXPOSED'], archetype: 'LINE_STITCH',
    combatFantasy: '一本の針が敵列を縫い、通った線へ細い火を残す。', mechanicalIdentity: 'line pierce followed by narrow burn seam; strong on aligned crowds.', characterAffinityIds: ['tomori', 'ritsu', 'F05'], stageAffinityIds: ['repair_lamp_workshop', 'ruler_rooftop'],
    vfx: { windup: 'needle eye catches a tiny wick flame', travel: 'straight dull-metal stitch line', impact: 'small puncture spark at each hit', residue: 'thin orange repair seam burns briefly', audioCue: 'needle zip + thread pull + tiny ember hiss', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'piercing line + delayed seam hazard',
  },
  {
    id: 'return_compass_needle', name: '帰針', attributes: ['STAR', 'METAL'], appliesStatuses: ['MARKED'], archetype: 'RETURN_HOMING',
    combatFantasy: '遠くへ逸れた針が一度だけ進路を修正して手元へ戻る。', mechanicalIdentity: 'outbound free shot + return phase that homes to marked targets.', characterAffinityIds: ['michiru', 'gen', 'kage3'], stageAffinityIds: ['old_compass_station', 'return_map_crossing'],
    vfx: { windup: 'needle points away, hesitates, then commits', travel: 'one cool metallic arc with sparse gold flecks', impact: 'tiny direction notch on mark', residue: 'no trail after return completes', audioCue: 'needle whistle + compass click on return', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'two-phase projectile with return target preference',
  },
  {
    id: 'repair_thread_spool', name: '継ぎ糸車', attributes: ['BLOOM', 'METAL'], appliesStatuses: ['ROOTED'], archetype: 'ORBIT_STITCH',
    combatFantasy: '小さな糸車が周囲を回り、近い敵同士を短く縫い止める。', mechanicalIdentity: 'orbit weapon that periodically creates short-lived root links.', characterAffinityIds: ['kage4', 'tomori', 'F05'], stageAffinityIds: ['repair_lamp_workshop', 'paper_cord_playground'],
    vfx: { windup: 'spool starts from a visible slow rotation', travel: 'physical orbit with loose thread arc', impact: 'two enemies get one dry stitched line', residue: 'thread snaps cleanly at expiry', audioCue: 'spool rattle + thread tension pluck', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'orbit entity + pair link/root',
  },
  {
    id: 'sleep_ribbon', name: '眠りのリボン', attributes: ['DREAM', 'WIND'], appliesStatuses: ['DROWSY'], archetype: 'SPIRAL_CONTROL',
    combatFantasy: 'ゆっくり外へ広がるリボンが敵の足取りだけを眠らせる。', mechanicalIdentity: 'expanding spiral control zone; low damage, strong tempo shaping.', characterAffinityIds: ['nemu', 'kage2', 'F03'], stageAffinityIds: ['dream_waterway', 'black_origami_roof'],
    vfx: { windup: 'soft ribbon knot loosens', travel: 'one violet cloth-paper spiral, never fog', impact: 'enemy motion gets a short double-image offset', residue: 'ribbon path fades from inner ring outward', audioCue: 'cloth flutter + distant soft bell', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'expanding spiral query + drowsy buildup',
  },
  {
    id: 'boundary_chalk', name: '境界チョーク', attributes: ['EARTH', 'LIGHT'], appliesStatuses: ['ILLUMINATED', 'EXPOSED'], archetype: 'LANE_BOUNDARY',
    combatFantasy: '床へ短い白線を引き、横切る敵を照らして防御を少し崩す。', mechanicalIdentity: 'player-drawn/placed line trigger. One line only; rewards route control.', characterAffinityIds: ['sen', 'tobari', 'ren'], stageAffinityIds: ['chalk_classroom', 'ticket_gate_station'],
    vfx: { windup: 'chalk touches ground with visible hand motion', travel: 'line is drawn physically, no laser', impact: 'crossing enemy gets a warm edge and chalk puff', residue: 'rough white line remains until replaced', audioCue: 'chalk drag + soft foot scrape', safety }, runtimeStatus: 'CONTENT_SOURCE_ONLY', requiredRuntimeHook: 'single persistent crossing line trigger',
  },
] as const;

export const currentBaseWeaponIds = weapons.filter((weapon) => !weapon.tags.includes('evolved')).map((weapon) => weapon.id);
export const currentBaseWeaponProfiles = existingWeaponCombatProfiles.filter((profile) => currentBaseWeaponIds.includes(profile.weaponId));

export const weaponExpansionSummary = {
  currentBaseWeaponCount: currentBaseWeaponIds.length,
  candidateBaseWeaponCount: baseWeaponCandidates.length,
  targetBaseWeaponCount: currentBaseWeaponIds.length + baseWeaponCandidates.length,
  targetRange: { min: 24, max: 28 },
  allCandidatesHaveDistinctArchetype: new Set(baseWeaponCandidates.map((weapon) => weapon.archetype)).size === baseWeaponCandidates.length,
  runtimeAutoPromotionAllowed: false,
} as const;
