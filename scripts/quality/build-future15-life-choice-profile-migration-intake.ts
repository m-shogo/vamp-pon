import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const sourceProfile = 'data/visual/future15-living-visual-profiles-v1.json';
const materializedPath = 'data/visual/future15-life-choice-profile-migration-intake-v1.json';
const text = readFileSync(resolve(root, sourceProfile), 'utf8');
const profile = JSON.parse(text);
const sourceProfileSha256 = createHash('sha256').update(text).digest('hex');
const domains = ['bodyAdornment','skinCoverage','personalGrooming','accessoryPropInventory','footwearGroundInterface','materialWearMaintenance'] as const;

function markerPaths(value: unknown, pattern: RegExp, prefix = ''): string[] {
  if (typeof value === 'string') return pattern.test(value) ? [prefix] : [];
  if (Array.isArray(value)) return value.flatMap((item,index) => markerPaths(item, pattern, `${prefix}[${index}]`));
  if (value && typeof value === 'object') return Object.entries(value as Record<string,unknown>).flatMap(([key,item]) => markerPaths(item, pattern, prefix ? `${prefix}.${key}` : key));
  return [];
}
function hairWearEvidence(wearHabits: unknown): string[] {
  if (!Array.isArray(wearHabits)) return [];
  return wearHabits.filter((item) => typeof item === 'string' && /(hair|fringe|clip|tie|fur|coat|groom|lens|glasses)/i.test(item));
}
function entry(baseState: string, evidence: Record<string,unknown>) {
  const openAuthorDecisionPaths = markerPaths(evidence, /OPEN[\s_-]*AUTHOR[\s_-]*DECISION/i);
  const pendingReviewPaths = markerPaths(evidence, /PENDING[\s_-]*REVIEW/i);
  const notApplicablePaths = markerPaths(evidence, /NOT[\s_-]*APPLICABLE/i);
  let state = baseState;
  if (notApplicablePaths.length) state = 'SOURCE_MARKED_NOT_APPLICABLE_REQUIRES_SCHEMA_ADAPTER';
  else if (openAuthorDecisionPaths.length) state = baseState.startsWith('PARTIAL_') ? 'PARTIAL_MIGRATION_EVIDENCE_WITH_OPEN_AUTHOR_DECISION' : 'MIGRATION_READY_WITH_OPEN_AUTHOR_DECISION';
  else if (pendingReviewPaths.length) state = baseState.startsWith('PARTIAL_') ? 'PARTIAL_MIGRATION_EVIDENCE_WITH_PENDING_REVIEW' : 'MIGRATION_READY_WITH_PENDING_REVIEW';
  return { state, evidence, openAuthorDecisionPaths, pendingReviewPaths, notApplicablePaths, requiresHumanDecision:true, canonPromotionBlocked:true, imageModelFreedom:false, generatedImageMayCloseItem:false };
}

const characters = (profile.characters ?? []).map((c:any) => {
  const bodyAdornment = { piercing:c.bodyModification?.piercing, tattoo:c.bodyModification?.tattoo, jewelry:c.bodyModification?.jewelry };
  const personalGrooming = { makeup:c.bodyModification?.makeup, nails:c.bodyModification?.nails, hairWearEvidence:hairWearEvidence(c.wearHabits), maintenance:c.maintenance };
  const accessoryPropInventory = { storage:c.clothing?.storage, relevantWearHabits:Array.isArray(c.wearHabits)?c.wearHabits:[] };
  const materialWearMaintenance = { materials:c.clothing?.materials, maintenance:c.maintenance, wearHabits:c.wearHabits };
  return { id:c.id, name:c.name, species:c.species, domains:{
    bodyAdornment: entry(c.bodyModification ? 'MIGRATION_READY_AUTHOR_CANDIDATE' : 'NO_CHARACTER_SPECIFIC_EVIDENCE', bodyAdornment),
    skinCoverage: entry(c.exposure ? 'MIGRATION_READY_AUTHOR_CANDIDATE' : 'NO_CHARACTER_SPECIFIC_EVIDENCE', { exposure:c.exposure }),
    personalGrooming: entry(c.bodyModification ? 'PARTIAL_MIGRATION_EVIDENCE_AUTHOR_REVIEW' : 'NO_CHARACTER_SPECIFIC_EVIDENCE', personalGrooming),
    accessoryPropInventory: entry(c.clothing?.storage !== undefined ? 'PARTIAL_MIGRATION_EVIDENCE_AUTHOR_REVIEW' : 'NO_CHARACTER_SPECIFIC_EVIDENCE', accessoryPropInventory),
    footwearGroundInterface: entry(c.clothing?.footwear !== undefined ? 'MIGRATION_READY_AUTHOR_CANDIDATE' : 'NO_CHARACTER_SPECIFIC_EVIDENCE', { footwear:c.clothing?.footwear }),
    materialWearMaintenance: entry(c.clothing?.materials && c.maintenance ? 'MIGRATION_READY_AUTHOR_CANDIDATE' : 'PARTIAL_MIGRATION_EVIDENCE_AUTHOR_REVIEW', materialWearMaintenance),
  }};
});
const stateCounts:Record<string,number>={};
for(const c of characters) for(const d of domains){ const state=c.domains[d].state; stateCounts[state]=(stateCounts[state]??0)+1; }
const policy={noNewCharacterFactsAuthored:true,genericPolicyIsNotCharacterEvidence:true,migrationDoesNotEqualCanonPromotion:true,openPendingAndNotApplicableMarkersMustRemainUnresolved:true,requiresHumanSchemaReview:true,imageModelFreedom:false,generatedImageMayCloseItem:false};
const intake={id:'yoru-no-shirube-future15-life-choice-profile-migration-intake-v1',date:'2026-08-14',status:'DERIVED_SCHEMA_MIGRATION_INTAKE_NON_CANON',sourceProfile,sourceProfileSha256,scope:{characterCount:characters.length,domainCount:domains.length,decisionCount:characters.length*domains.length},policy,stateCounts,characters};
function mostCommonState(domain:typeof domains[number]){const m=new Map<string,number>();for(const c of characters){const s=c.domains[domain].state;m.set(s,(m.get(s)??0)+1)}return [...m.entries()].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0]?.[0]??'NO_CHARACTER_SPECIFIC_EVIDENCE'}
const defaultDomainStates=Object.fromEntries(domains.map(d=>[d,mostCommonState(d)]));
const overrides=characters.flatMap((c:any)=>domains.flatMap(d=>{const e=c.domains[d];if(e.state===defaultDomainStates[d]&&!e.openAuthorDecisionPaths.length&&!e.pendingReviewPaths.length&&!e.notApplicablePaths.length)return[];return[{characterId:c.id,species:c.species,domain:d,state:e.state,openAuthorDecisionPaths:e.openAuthorDecisionPaths,pendingReviewPaths:e.pendingReviewPaths,notApplicablePaths:e.notApplicablePaths}]}));
const compact={id:intake.id,date:intake.date,status:intake.status,sourceProfile,sourceProfileSha256,scope:intake.scope,policy,stateCounts,characterIds:characters.map((c:any)=>c.id),speciesByCharacter:Object.fromEntries(characters.map((c:any)=>[c.id,c.species])),defaultDomainStates,overrides};
if(process.argv.includes('--check-materialized')){const actual=JSON.parse(readFileSync(resolve(root,materializedPath),'utf8'));if(JSON.stringify(actual)!==JSON.stringify(compact))throw Error('materialized future15 migration intake is stale');console.log('[future15-life-choice-migration-intake] materialized snapshot fresh');}
else if(process.argv.includes('--emit-compact')) console.log(JSON.stringify(compact,null,2));
else if(process.argv.includes('--emit')){console.log('P4_INTAKE_JSON_BEGIN');console.log(JSON.stringify(intake,null,2));console.log('P4_INTAKE_JSON_END');}
else{console.log(`[future15-life-choice-migration-intake] OK: ${intake.scope.decisionCount} decisions`);console.log(JSON.stringify(stateCounts));}
