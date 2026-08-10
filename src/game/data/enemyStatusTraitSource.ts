import { enemyCombatProfiles, type BuffKind, type StatusKind } from './combatAffinitySource.ts';
import { enemyProductionEntries } from './enemyProductionDatabase.ts';

export type EnemyStatusTraitProfile = {
  enemyId: string;
  enemyName: string;
  rank: 'small' | 'medium' | 'elite' | 'boss';
  inflictedStatuses: readonly StatusKind[];
  selfBuffs: readonly BuffKind[];
  resistedStatuses: readonly StatusKind[];
  cleansePriority: readonly StatusKind[];
  statusPressureFantasy: string;
  bossSafetyRule: string;
  noHardStatusImmunity: true;
};

const statusFromAttribute: Partial<Record<string, StatusKind>> = {
  LIGHT: 'ILLUMINATED', DARK: 'ECLIPSED', FIRE: 'BURN', WATER: 'SOAK', WIND: 'DISORIENTED', THUNDER: 'SHOCK', ICE: 'CHILL', EARTH: 'EXPOSED', METAL: 'CONDUCTIVE', BLOOM: 'ROOTED', DREAM: 'DROWSY', MEMORY: 'MARKED', STAR: 'MARKED', BLANK: 'ERASED',
};

function uniq<T>(values: readonly T[]): T[] { return [...new Set(values)]; }

function deriveInflicted(enemyId: string, roles: readonly string[], family: string): StatusKind[] {
  const out: StatusKind[] = [];
  if (/match|ember|lamp|fire/.test(enemyId)) out.push('BURN');
  if (/blue|dew|water|rain/.test(enemyId)) out.push('SOAK');
  if (/cold|frost|ice|moon_box|bookmark/.test(enemyId)) out.push('CHILL');
  if (/thunder|storm|wire|metal|needle/.test(enemyId)) out.push('CONDUCTIVE');
  if (/violet|black|shadow|origami/.test(enemyId) || family === 'great_shadow') out.push('ECLIPSED');
  if (/dream|sheep|sleep/.test(enemyId)) out.push('DROWSY');
  if (/flower|thread|vine|root/.test(enemyId)) out.push('ROOTED');
  if (/name|label|tag/.test(enemyId)) out.push('MARKED');
  if (/eraser|blank/.test(enemyId)) out.push('ERASED');
  if (/key|box|gate|seal/.test(enemyId)) out.push('SEALED');
  if (/compass|ruler|window|lens|route/.test(enemyId)) out.push('DISORIENTED');
  if (roles.includes('charger')) out.push('EXPOSED');
  if (roles.includes('flank')) out.push('DISORIENTED');
  if (roles.includes('elite') && out.length === 0) out.push('MARKED');
  return uniq(out).slice(0, 3);
}

function deriveBuffs(roles: readonly string[], rank: string): BuffKind[] {
  const out: BuffKind[] = [];
  if (roles.includes('pressure')) out.push('FORTIFY');
  if (roles.includes('charger')) out.push('FOCUS');
  if (roles.includes('flank')) out.push('TAILWIND');
  if (roles.includes('supply')) out.push('REPAIR');
  if (roles.includes('swarm')) out.push('FLOW');
  if (roles.includes('elite')) out.push('FORTIFY', 'FOCUS');
  if (rank === 'boss') out.push('DAWN_GUARD');
  return uniq(out).slice(0, rank === 'boss' ? 3 : 2);
}

const combatById = new Map(enemyCombatProfiles.map((profile) => [profile.enemyId, profile]));

export const enemyStatusTraitProfiles: readonly EnemyStatusTraitProfile[] = enemyProductionEntries.map((enemy) => {
  const combat = combatById.get(enemy.id)!;
  const resistedStatuses = uniq(combat.resistances.map((attribute) => statusFromAttribute[attribute]).filter(Boolean) as StatusKind[]).slice(0, 2);
  const inflictedStatuses = deriveInflicted(enemy.id, enemy.readableRole ? [enemy.rank === 'elite' ? 'elite' : 'pressure'] : [], enemy.family);

  // Production entries do not yet carry runtime EnemyRole. Use rank/family plus readable-role keywords as content authority only.
  const roleHints = [
    /突進|速|charger/.test(`${enemy.readableRole} ${enemy.movement}`) ? 'charger' : '',
    /回り|横|flank/.test(`${enemy.readableRole} ${enemy.movement}`) ? 'flank' : '',
    /報酬|drop|供給/.test(`${enemy.readableRole} ${enemy.dropHint}`) ? 'supply' : '',
    /群|密集|swarm/.test(`${enemy.readableRole} ${enemy.movement}`) ? 'swarm' : '',
    enemy.rank === 'elite' || enemy.rank === 'boss' ? 'elite' : 'pressure',
  ].filter(Boolean);

  const derived = uniq([...inflictedStatuses, ...deriveInflicted(enemy.id, roleHints, enemy.family)]).slice(0, enemy.rank === 'boss' ? 3 : 2);
  const finalInflicted: StatusKind[] = derived.length > 0
    ? derived
    : [enemy.rank === 'boss' || enemy.rank === 'elite' ? 'MARKED' : 'EXPOSED'];
  const selfBuffs = deriveBuffs(roleHints, enemy.rank);

  return {
    enemyId: enemy.id,
    enemyName: enemy.name,
    rank: enemy.rank,
    inflictedStatuses: finalInflicted,
    selfBuffs,
    resistedStatuses,
    cleansePriority: uniq(finalInflicted.filter((status) => ['BURN', 'ROOTED', 'DROWSY', 'ERASED', 'SEALED', 'ECLIPSED'].includes(status))).slice(0, 2),
    statusPressureFantasy: `${enemy.readableRole} / ${enemy.attackCue}。属性弱点とは別に、状態異常への対処でbuild差を作る。`,
    bossSafetyRule: enemy.rank === 'boss'
      ? 'Bossのstatusは完全無効にしない。FREEZE/SLEEP/ROOTED等のhard controlは短い鈍化・行動遅延へ変換し、無限拘束を防ぐ。'
      : 'status抵抗は効果時間/蓄積量で表現し、完全無効を基本にしない。',
    noHardStatusImmunity: true as const,
  };
});

export const enemyStatusTraitSummary = {
  enemyCount: enemyStatusTraitProfiles.length,
  enemiesWithStatusPressure: enemyStatusTraitProfiles.filter((entry) => entry.inflictedStatuses.length > 0).length,
  enemiesWithSelfBuffs: enemyStatusTraitProfiles.filter((entry) => entry.selfBuffs.length > 0).length,
  hardImmunityCount: 0,
  bossHardControlConvertedNotImmune: true,
} as const;
