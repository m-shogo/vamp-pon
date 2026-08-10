import {
  baseWeaponCandidates,
  type BaseWeaponCandidate,
  type WeaponAttackArchetype,
} from './weaponExpansionSource.ts';
import {
  weaponFusionCandidates,
  weaponSynthesisCandidates,
  weaponAwakeningCandidates,
} from './weaponTransformationSource.ts';
import {
  selectedTitle1BaseWeaponCandidates,
} from './baseWeaponSelectionSource.ts';

export type BaseWeaponArchetypeRule = {
  scalingIntent: string;
  weakness: string;
  buildCompensation: string;
};

const archetypeRules: Record<WeaponAttackArchetype, BaseWeaponArchetypeRule> = {
  SCATTER_PROJECTILE: {
    scalingIntent: 'projectile数を無制限に増やさず、status distribution・scatter角・小さなpierceを段階強化する。',
    weakness: '単体Bossと長射程targetへの集中火力が低い。',
    buildCompensation: 'HOMING_SNIPE/Break武器か、BURNを消費するReaction/Fusionを二本目へ置く。',
  },
  TETHER: {
    scalingIntent: 'tether本数より接続維持・status共有効率・再接続tempoを伸ばす。画面線数には上限を置く。',
    weakness: '孤立した一体だけのBossや高速で離れる敵には価値が落ちる。',
    buildCompensation: 'PULSE_CHAIN/Trap/Mark系で二体目を作るか、単体用のprecision weaponを混ぜる。',
  },
  CONE_PUSH: {
    scalingIntent: 'damageよりcone幅・push安定性・DISORIENTED buildupを伸ばし、永久knockbackは作らない。',
    weakness: '背面・遠距離・重量anchorへの処理が遅い。',
    buildCompensation: '後方を守るorbit/trap、またはEARTH/METAL Breakを混ぜる。',
  },
  PULSE_CHAIN: {
    scalingIntent: 'chain上限を低く保ち、CONDUCTIVE preference・pulse interval・Reaction効率を伸ばす。',
    weakness: '乾いた孤立targetや導電準備のない初動が弱い。',
    buildCompensation: 'SOAK/Tether/CONDUCTIVE供給を先に置き、単体はprecision weaponで補う。',
  },
  LANE_WALL: {
    scalingIntent: '壁枚数で埋めず、持続・CHILL buildup・置き直しtempoを伸ばす。',
    weakness: '線を無視する遠距離敵や、置き場所を頻繁に変えるStageで効率が落ちる。',
    buildCompensation: 'route-independent projectileかpushを混ぜ、壁だけへ防御を依存しない。',
  },
  SLAM_WAVE: {
    scalingIntent: '方向亀裂の長さ・Break・staggerを伸ばし、全周AoE化しない。',
    weakness: 'windupが遅く、背面や遠距離に弱い。',
    buildCompensation: 'WIND移動、trap、far-target weaponでwindup中の死角を補う。',
  },
  RETURNING_THROW: {
    scalingIntent: 'outbound/returnの二hit価値とreturn角度を伸ばし、単純projectile数を増やさない。',
    weakness: '帰路を作れない狭い状況や高速接近に弱い。',
    buildCompensation: 'ROOTED/CHILL/route controlで帰路を確保する。',
  },
  TRAP_FIELD: {
    scalingIntent: 'trap個数を低く固定し、arming・持続・status buildup・再配置を伸ばす。',
    weakness: '高速移動/遠距離敵と、常に場所が変わる戦闘に弱い。',
    buildCompensation: 'push/tether/slowで敵をtrapへ寄せるか、自動追尾武器を混ぜる。',
  },
  DELAYED_PULSE: {
    scalingIntent: '先読み成功時のradius/status効率を伸ばし、即時化してidentityを消さない。',
    weakness: '予測不能な高速targetと急な近接pressureに弱い。',
    buildCompensation: 'route control/TAILWIND/instant counterを一本加える。',
  },
  LINK_CHAIN: {
    scalingIntent: 'link長・維持・MARKED連携を伸ばし、線本数と文字UIを増やさない。',
    weakness: 'targetが高速で散る場面とmobileでの線読み負荷が大きい。',
    buildCompensation: 'tether/slow/trapで距離を整える。readability不足ならHoldを維持する。',
  },
  HOMING_SNIPE: {
    scalingIntent: 'far/high-priority target選択・accuracy・critical/Breakを伸ばし、万能homingにしない。',
    weakness: '近距離swarmと低HP多数処理が苦手。',
    buildCompensation: 'scatter/cone/trapを二本目に置いて小型を任せる。',
  },
  SWEEP_CLEANSE: {
    scalingIntent: 'damageではなくbounded dispel/cleanse budget・sweep幅・再使用tempoを伸ばす。',
    weakness: '敵にBuff/Debuff圧が少ないStageでは直接火力が低い。',
    buildCompensation: 'main damage weaponを別枠に置き、utility slotとして採用する。',
  },
  REFLECT_COUNTER: {
    scalingIntent: 'counter window・返射精度・ILLUMINATED utilityを伸ばし、常時反射にはしない。',
    weakness: 'contact attack・背面・攻撃してこない敵には価値が低い。',
    buildCompensation: '近距離Break/route controlを混ぜ、projectile専用回答として使う。',
  },
  CONE_VEIL: {
    scalingIntent: 'tracking friction・veil角・短durationを伸ばし、画面暗転やdamage cloudへ変えない。',
    weakness: '追尾を使わないlane/ground pressureには効果が薄い。',
    buildCompensation: 'EARTH/BLANK/Break系で地形・lane pressureを別に回答する。',
  },
  TRAIL_DROP: {
    scalingIntent: 'trail点数を抑えたまま間隔・status効率・消滅tempoを調整し、床entity spamを避ける。',
    weakness: '静止戦と床情報が多いStageでは価値/readabilityが落ちる。',
    buildCompensation: 'tether等の床を使わないWATER utilityへ切替可能にする。',
  },
  LINE_STITCH: {
    scalingIntent: 'pierce・line長・短いseam効果を伸ばし、太いfire wallへしない。',
    weakness: '敵が散開して並ばない時は効率が落ちる。',
    buildCompensation: 'push/root/tetherで列を作るか、scatterを二本目に置く。',
  },
  RETURN_HOMING: {
    scalingIntent: 'return phaseのMARKED target preference・帰路hit価値を伸ばし、outbound側は自由弾として残す。',
    weakness: 'mark準備なし・至近距離・return pathが短い状況で弱い。',
    buildCompensation: 'MARKED供給かroute controlを混ぜ、帰路を作れる距離を保つ。',
  },
  ORBIT_STITCH: {
    scalingIntent: 'orbit数を増やさず、link生成間隔・切断時utility・ROOTED buildupを伸ばす。',
    weakness: '遠距離enemyと大量linkによる視覚負荷に弱い。',
    buildCompensation: 'far-target weaponを混ぜ、link上限を守って切断/再配置を回す。',
  },
  SPIRAL_CONTROL: {
    scalingIntent: 'spiral半径・DROWSY buildup・展開tempoを伸ばし、fog blanketやhard sleep loopにしない。',
    weakness: '即時burstが必要な瞬間とspiral外へ抜ける高速targetに弱い。',
    buildCompensation: 'instant projectile/Breakと組み、spiralはtempo shapingへ専念する。',
  },
  LANE_BOUNDARY: {
    scalingIntent: '一本のlineだけを維持し、crossing effect・再配置tempo・ILLUMINATED/EXPOSED効率を伸ばす。',
    weakness: '線を横切らないstationary/ranged targetと、置き場所を誤った時の損失が大きい。',
    buildCompensation: 'push/route weaponでcrossingを作るか、lineを早めに置き直す。',
  },
};

const candidateById = new Map(baseWeaponCandidates.map((candidate) => [candidate.id, candidate]));
const selectedIds = new Set(selectedTitle1BaseWeaponCandidates.map((entry) => entry.weaponId));
const allTransformations = [...weaponFusionCandidates, ...weaponSynthesisCandidates, ...weaponAwakeningCandidates];

export type SelectedBaseWeaponGameplayProfile = {
  weaponId: string;
  weaponName: string;
  archetype: WeaponAttackArchetype;
  attributes: BaseWeaponCandidate['attributes'];
  statuses: BaseWeaponCandidate['appliesStatuses'];
  scalingIntent: string;
  weakness: string;
  buildCompensation: string;
  characterAffinityIds: readonly string[];
  stageAffinityIds: readonly string[];
  requiredRuntimeHook: string;
  vfxSafety: string;
  audioCue: string;
  runtimeEvolutionId: null;
  fusionIds: readonly string[];
  synthesisIds: readonly string[];
  awakeningIds: readonly string[];
  transformationHookCount: number;
  authority: 'CONTENT_SOURCE_ONLY';
  runtimeAutoPromotionAllowed: false;
};

export const selectedBaseWeaponGameplayProfiles: readonly SelectedBaseWeaponGameplayProfile[] =
  baseWeaponCandidates
    .filter((candidate) => selectedIds.has(candidate.id))
    .map((candidate) => {
      const transformationHooks = allTransformations.filter((entry) => entry.inputWeaponIds.includes(candidate.id));
      const rule = archetypeRules[candidate.archetype];
      return {
        weaponId: candidate.id,
        weaponName: candidate.name,
        archetype: candidate.archetype,
        attributes: candidate.attributes,
        statuses: candidate.appliesStatuses,
        scalingIntent: rule.scalingIntent,
        weakness: rule.weakness,
        buildCompensation: rule.buildCompensation,
        characterAffinityIds: candidate.characterAffinityIds,
        stageAffinityIds: candidate.stageAffinityIds,
        requiredRuntimeHook: candidate.requiredRuntimeHook,
        vfxSafety: candidate.vfx.safety,
        audioCue: candidate.vfx.audioCue,
        runtimeEvolutionId: null,
        fusionIds: transformationHooks.filter((entry) => entry.kind === 'FUSION').map((entry) => entry.id),
        synthesisIds: transformationHooks.filter((entry) => entry.kind === 'SYNTHESIS').map((entry) => entry.id),
        awakeningIds: transformationHooks.filter((entry) => entry.kind === 'AWAKENING').map((entry) => entry.id),
        transformationHookCount: transformationHooks.length,
        authority: 'CONTENT_SOURCE_ONLY',
        runtimeAutoPromotionAllowed: false,
      };
    });

export const selectedBaseWeaponGameplaySummary = {
  selectedProfiles: selectedBaseWeaponGameplayProfiles.length,
  uniqueArchetypes: new Set(selectedBaseWeaponGameplayProfiles.map((entry) => entry.archetype)).size,
  profilesWithFusion: selectedBaseWeaponGameplayProfiles.filter((entry) => entry.fusionIds.length > 0).length,
  profilesWithSynthesis: selectedBaseWeaponGameplayProfiles.filter((entry) => entry.synthesisIds.length > 0).length,
  profilesWithAwakening: selectedBaseWeaponGameplayProfiles.filter((entry) => entry.awakeningIds.length > 0).length,
  profilesWithAnyTransformation: selectedBaseWeaponGameplayProfiles.filter((entry) => entry.transformationHookCount > 0).length,
  profilesWithCharacterAffinity: selectedBaseWeaponGameplayProfiles.filter((entry) => entry.characterAffinityIds.length > 0).length,
  profilesWithStageAffinity: selectedBaseWeaponGameplayProfiles.filter((entry) => entry.stageAffinityIds.length > 0).length,
  currentRuntimeEvolutionAdded: 0,
  runtimeAutoPromotionAllowed: false,
} as const;

export const selectedBaseWeaponGameplayProfileById = new Map(
  selectedBaseWeaponGameplayProfiles.map((entry) => [entry.weaponId, entry]),
);

for (const selectedId of selectedIds) {
  if (!candidateById.has(selectedId)) throw new Error(`selected Base Weapon missing candidate source: ${selectedId}`);
}
