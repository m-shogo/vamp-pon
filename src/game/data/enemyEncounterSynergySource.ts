import { enemyProductionEntries, type EnemyProductionEntry } from './enemyProductionDatabase.ts';
import {
  enemyStatusTraitProfiles,
  type EnemyStatusTraitProfile,
} from './enemyStatusTraitSource.ts';
import {
  enemyAttributeIdentities,
  type EnemyAttributeIdentity,
} from './enemyAttributeIdentitySource.ts';
import { series1StageCampaignContentEntries } from './series1StageCampaignContentSource.ts';
import type { StatusKind } from './combatAffinitySource.ts';

export type EnemyEncounterSynergyKind =
  | 'SOAK_CHILL_SETUP'
  | 'PIN_AND_CHARGE'
  | 'HOLD_AND_DOT'
  | 'TEMPO_COLLAPSE'
  | 'TRACKING_CROSSPRESSURE'
  | 'LOCK_ON_PRESSURE'
  | 'BUILD_EROSION'
  | 'SEAL_AND_ANCHOR'
  | 'LANE_CROSS'
  | 'ANCHOR_AND_FLANK'
  | 'MIXED_PRESSURE';

export type EnemyEncounterSynergyEntry = {
  id: string;
  stageId: string;
  stageNo: number;
  stageName: string;
  enemyIds: readonly [string, string];
  enemyNames: readonly [string, string];
  ranks: readonly [EnemyProductionEntry['rank'], EnemyProductionEntry['rank']];
  defensiveAttributes: readonly [readonly string[], readonly string[]];
  inflictedStatuses: readonly [readonly StatusKind[], readonly StatusKind[]];
  kind: EnemyEncounterSynergyKind;
  synergyScore: number;
  readableThreat: string;
  whyTogetherIsDangerous: string;
  playerAnswer: string;
  antiFrustrationRule: string;
  waveUse: string;
  authority: 'CONTENT_SOURCE_ONLY';
  runtimeAutoPromotionAllowed: false;
};

type EnemyContext = {
  production: EnemyProductionEntry;
  status: EnemyStatusTraitProfile;
  attribute: EnemyAttributeIdentity;
};

const productionById = new Map(enemyProductionEntries.map((entry) => [entry.id, entry]));
const statusById = new Map(enemyStatusTraitProfiles.map((entry) => [entry.enemyId, entry]));
const attributeById = new Map(enemyAttributeIdentities.map((entry) => [entry.enemyId, entry]));

function contextFor(enemyId: string): EnemyContext {
  const production = productionById.get(enemyId);
  const status = statusById.get(enemyId);
  const attribute = attributeById.get(enemyId);
  if (!production || !status || !attribute) throw new Error(`missing Enemy48 combat context: ${enemyId}`);
  return { production, status, attribute };
}

function hasStatus(enemy: EnemyContext, status: StatusKind): boolean {
  return enemy.status.inflictedStatuses.includes(status);
}

function text(enemy: EnemyContext): string {
  const { production } = enemy;
  return `${production.id} ${production.readableRole} ${production.movement} ${production.attackCue}`;
}

function isCharger(enemy: EnemyContext): boolean {
  return /突進|速めの接近|一直線|lunge|charge/.test(text(enemy));
}

function isFlanker(enemy: EnemyContext): boolean {
  return /横|斜め|回り|ジグザグ|壁沿い|滑る/.test(text(enemy));
}

function isLaneSetter(enemy: EnemyContext): boolean {
  return /レーン|白線|壁を作る|ゲート|地図線|進路|通路/.test(text(enemy));
}

function isDelayedPressure(enemy: EnemyContext): boolean {
  return /遅れ|一拍遅|一定間隔|停止|少しふらつく|波紋/.test(text(enemy));
}

function isTrackingPressure(enemy: EnemyContext): boolean {
  return /追|ターゲット|指す|向く|寄る/.test(text(enemy));
}

function isHeavyAnchor(enemy: EnemyContext): boolean {
  return enemy.production.rank !== 'small' || /硬|重|圧迫|壁|箱/.test(text(enemy));
}

function classifyPair(a: EnemyContext, b: EnemyContext): { kind: EnemyEncounterSynergyKind; score: number } {
  const oneHas = (status: StatusKind) => hasStatus(a, status) || hasStatus(b, status);
  const bothDifferent = (left: StatusKind, right: StatusKind) =>
    (hasStatus(a, left) && hasStatus(b, right)) || (hasStatus(a, right) && hasStatus(b, left));

  if (bothDifferent('SOAK', 'CHILL')) return { kind: 'SOAK_CHILL_SETUP', score: 10 };
  if (oneHas('ROOTED') && (isCharger(a) || isCharger(b))) return { kind: 'PIN_AND_CHARGE', score: 10 };
  if (bothDifferent('ROOTED', 'BURN')) return { kind: 'HOLD_AND_DOT', score: 9 };
  if (oneHas('DROWSY') && (isDelayedPressure(a) || isDelayedPressure(b) || isCharger(a) || isCharger(b))) {
    return { kind: 'TEMPO_COLLAPSE', score: 9 };
  }
  if ((oneHas('ECLIPSED') || oneHas('DISORIENTED')) && (isTrackingPressure(a) || isTrackingPressure(b) || isCharger(a) || isCharger(b))) {
    return { kind: 'TRACKING_CROSSPRESSURE', score: 9 };
  }
  if (oneHas('MARKED') && (isTrackingPressure(a) || isTrackingPressure(b))) return { kind: 'LOCK_ON_PRESSURE', score: 8 };
  if (oneHas('ERASED') && (a.status.selfBuffs.length > 0 || b.status.selfBuffs.length > 0)) return { kind: 'BUILD_EROSION', score: 8 };
  if (oneHas('SEALED') && (isHeavyAnchor(a) || isHeavyAnchor(b))) return { kind: 'SEAL_AND_ANCHOR', score: 8 };
  if (isLaneSetter(a) && (isLaneSetter(b) || isCharger(b) || isFlanker(b))) return { kind: 'LANE_CROSS', score: 7 };
  if (isLaneSetter(b) && (isCharger(a) || isFlanker(a))) return { kind: 'LANE_CROSS', score: 7 };
  if ((isHeavyAnchor(a) && isFlanker(b)) || (isHeavyAnchor(b) && isFlanker(a))) return { kind: 'ANCHOR_AND_FLANK', score: 6 };

  const rankBonus = a.production.rank !== b.production.rank ? 2 : 0;
  const statusBonus = new Set([...a.status.inflictedStatuses, ...b.status.inflictedStatuses]).size > 1 ? 1 : 0;
  return { kind: 'MIXED_PRESSURE', score: 3 + rankBonus + statusBonus };
}

function readableThreat(kind: EnemyEncounterSynergyKind, a: EnemyContext, b: EnemyContext): string {
  const names = `${a.production.name} + ${b.production.name}`;
  switch (kind) {
    case 'SOAK_CHILL_SETUP': return `${names}: 濡れを置いた場所へ冷えが重なり、移動余裕を段階的に削る。`;
    case 'PIN_AND_CHARGE': return `${names}: 足止め圧の直後へ突進/接近圧が入り、同じ回避方向を続けると捕まりやすい。`;
    case 'HOLD_AND_DOT': return `${names}: 根留め系の位置圧と燃焼の時間圧が重なり、その場で耐える判断を弱くする。`;
    case 'TEMPO_COLLAPSE': return `${names}: DROWSY系の一拍遅れと時間差/突進圧がずれた周期で来る。`;
    case 'TRACKING_CROSSPRESSURE': return `${names}: 追尾の読みを乱す圧と接近/追跡圧が別角度から重なり、視界より予兆motionを読む必要がある。`;
    case 'LOCK_ON_PRESSURE': return `${names}: MARKED系の対象固定と追跡圧が重なり、一体だけを見続けるほど別方向の安全を失う。`;
    case 'BUILD_EROSION': return `${names}: ERASED系が蓄積を薄める間にもう一体の自己強化/圧力が進み、stack依存buildへ再構築を要求する。`;
    case 'SEAL_AND_ANCHOR': return `${names}: SEALED系が特殊行動の回転を鈍らせる間、重いanchorが移動空間を詰める。`;
    case 'LANE_CROSS': return `${names}: lane/直線圧と横・斜め・突進圧が交差し、同じ逃走線だけでは抜けられない。`;
    case 'ANCHOR_AND_FLANK': return `${names}: 重いanchorへ注意を向けた横/斜めから小型が入り、中心だけを見る戦いを崩す。`;
    default: return `${names}: 異なる移動cueと状態圧を同じ波へ置き、単体時には弱い読みを二方向へ分ける。`;
  }
}

function playerAnswer(kind: EnemyEncounterSynergyKind): string {
  switch (kind) {
    case 'SOAK_CHILL_SETUP': return 'SOAK/CHILL resistanceかcleanseを一つ持ち、片方を先にほどく。WIND/route weaponで濡れ地点そのものから離れる回答も有効。';
    case 'PIN_AND_CHARGE': return 'ROOTED対策Item、WIND push、EARTH/METAL Breakのいずれかで「足止め→突進」の順序を崩す。';
    case 'HOLD_AND_DOT': return 'ROOTEDかBURNの片方だけでも短縮し、trap/line weaponで敵側を止めて退路を一本確保する。';
    case 'TEMPO_COLLAPSE': return 'DROWSY耐性かFLOW/TAILWINDで自分のtempoを保ち、delay cueを見て先に位置を変える。';
    case 'TRACKING_CROSSPRESSURE': return '画面暗転でなくattack cueを読み、追尾をWIND/BLANKで崩すか、heavy側をBreakして視線対象を減らす。';
    case 'LOCK_ON_PRESSURE': return 'MARKEDをcleanse/消費Reactionへ回し、追跡役をpriority targetにして視線を一体へ固定しない。';
    case 'BUILD_EROSION': return '長stack一本に依存せず、短いReaction cycleかBLANK cleanseを混ぜて再構築できるbuildへする。';
    case 'SEAL_AND_ANCHOR': return 'SEALED短縮と位置取りのどちらかをItemで補い、anchorへBreak/EXPOSEDを入れて安全空間を作り直す。';
    case 'LANE_CROSS': return '一方向knockbackだけに頼らず、laneを横切るタイミングを作るWIND/BLANK/reflect系を混ぜる。';
    case 'ANCHOR_AND_FLANK': return '重い敵を瞬殺できなくても、flank側を先にほどくかtrapで遅らせ、見る方向を一つ減らす。';
    default: return '二体を同時に最大火力で追わず、先にpressure sourceを一体ほどいてから残りへbuildの得意形を当てる。';
  }
}

function antiFrustrationRule(kind: EnemyEncounterSynergyKind, a: EnemyContext, b: EnemyContext): string {
  const bossIncluded = a.production.rank === 'boss' || b.production.rank === 'boss';
  const controlHeavy = ['SOAK_CHILL_SETUP', 'PIN_AND_CHARGE', 'HOLD_AND_DOT', 'TEMPO_COLLAPSE', 'SEAL_AND_ANCHOR'].includes(kind);
  if (bossIncluded) {
    return 'Bossを完全status immuneにしない。hard controlは短いslow/delayへ変換し、相方の強いcueとBossの大技を同時開始しない。';
  }
  if (controlHeavy) {
    return '二つのhard-control相当cueを同時着弾させない。片方の予兆→短い回答窓→もう片方の圧、の順で読めるようにする。';
  }
  return '二体のattack cueを同じ色/同じsilhouette timingへ揃えない。危険方向はmotionとresidueで読ませ、画面暗転やstrobeに頼らない。';
}

function waveUse(a: EnemyContext, b: EnemyContext): string {
  const first = a.production.rank === 'small' && b.production.rank !== 'small' ? b : a;
  const second = first === a ? b : a;
  if (first.production.rank === 'boss') {
    return `${first.production.name}のphase圧を先に見せ、${second.production.name}は大技の直前ではなく回復/再配置可能な間へ少数追加する。`;
  }
  if (first.production.rank === 'elite' || first.production.rank === 'medium') {
    return `${first.production.name}をanchorとして先に見せ、${second.production.name}を別角度/少し遅れて追加。単純な同時湧き物量にはしない。`;
  }
  return `${a.production.name}のcueを一度単体で学習させた後、${b.production.name}を少し遅らせて重ね、pairの危険だけを一段上げる。`;
}

function pairScore(a: EnemyContext, b: EnemyContext): number {
  const base = classifyPair(a, b).score;
  const differentMovement = a.production.movement !== b.production.movement ? 1 : 0;
  const mixedRank = a.production.rank !== b.production.rank ? 1 : 0;
  const statusVariety = new Set([...a.status.inflictedStatuses, ...b.status.inflictedStatuses]).size >= 2 ? 1 : 0;
  return base + differentMovement + mixedRank + statusVariety;
}

function buildStagePairIds(enemyIds: readonly string[]): Array<readonly [string, string]> {
  const uniqueIds = [...new Set(enemyIds)].filter((id) => productionById.has(id));
  if (uniqueIds.length < 2) return [];

  const candidates: Array<{ pair: readonly [string, string]; score: number }> = [];
  for (let i = 0; i < uniqueIds.length; i += 1) {
    for (let j = i + 1; j < uniqueIds.length; j += 1) {
      const a = contextFor(uniqueIds[i]);
      const b = contextFor(uniqueIds[j]);
      candidates.push({ pair: [a.production.id, b.production.id] as const, score: pairScore(a, b) });
    }
  }
  candidates.sort((left, right) => right.score - left.score || left.pair.join(':').localeCompare(right.pair.join(':')));

  const uncovered = new Set(uniqueIds);
  const selected: Array<readonly [string, string]> = [];
  while (uncovered.size > 0) {
    const best = candidates
      .filter(({ pair }) => pair.some((id) => uncovered.has(id)))
      .sort((left, right) => {
        const leftCoverage = left.pair.filter((id) => uncovered.has(id)).length;
        const rightCoverage = right.pair.filter((id) => uncovered.has(id)).length;
        return rightCoverage - leftCoverage || right.score - left.score;
      })[0];
    if (!best) break;
    selected.push(best.pair);
    best.pair.forEach((id) => uncovered.delete(id));
  }

  return selected;
}

export const enemyEncounterSynergyEntries: readonly EnemyEncounterSynergyEntry[] =
  series1StageCampaignContentEntries.flatMap((stage) =>
    buildStagePairIds(stage.combat.enemyIds).map(([leftId, rightId]) => {
      const left = contextFor(leftId);
      const right = contextFor(rightId);
      const classification = classifyPair(left, right);
      return {
        id: `${stage.stageId}:${leftId}+${rightId}`,
        stageId: stage.stageId,
        stageNo: stage.stageNo,
        stageName: stage.stageName,
        enemyIds: [leftId, rightId],
        enemyNames: [left.production.name, right.production.name],
        ranks: [left.production.rank, right.production.rank],
        defensiveAttributes: [left.attribute.defensiveAttributes, right.attribute.defensiveAttributes],
        inflictedStatuses: [left.status.inflictedStatuses, right.status.inflictedStatuses],
        kind: classification.kind,
        synergyScore: pairScore(left, right),
        readableThreat: readableThreat(classification.kind, left, right),
        whyTogetherIsDangerous: `${left.production.readableRole} と ${right.production.readableRole} を同時に置くことで、単体時の弱いpressureを別方向から補完する。`,
        playerAnswer: playerAnswer(classification.kind),
        antiFrustrationRule: antiFrustrationRule(classification.kind, left, right),
        waveUse: waveUse(left, right),
        authority: 'CONTENT_SOURCE_ONLY',
        runtimeAutoPromotionAllowed: false,
      };
    }),
  );

const coveredEnemyIds = new Set(enemyEncounterSynergyEntries.flatMap((entry) => entry.enemyIds));
const uncoveredEnemyIds = enemyProductionEntries.map((enemy) => enemy.id).filter((id) => !coveredEnemyIds.has(id));

export const enemyEncounterSynergyByStage = new Map(
  series1StageCampaignContentEntries.map((stage) => [
    stage.stageId,
    enemyEncounterSynergyEntries.filter((entry) => entry.stageId === stage.stageId),
  ]),
);

export const enemyEncounterSynergySummary = {
  enemyRosterCount: enemyProductionEntries.length,
  coveredEnemyCount: coveredEnemyIds.size,
  uncoveredEnemyIds,
  pairingCount: enemyEncounterSynergyEntries.length,
  stagesWithPairings: new Set(enemyEncounterSynergyEntries.map((entry) => entry.stageId)).size,
  statusDrivenPairingCount: enemyEncounterSynergyEntries.filter((entry) => entry.kind !== 'MIXED_PRESSURE').length,
  bossPairingCount: enemyEncounterSynergyEntries.filter((entry) => entry.ranks.includes('boss')).length,
  hardStatusImmunityAdded: 0,
  runtimeAutoPromotionAllowed: false,
} as const;
