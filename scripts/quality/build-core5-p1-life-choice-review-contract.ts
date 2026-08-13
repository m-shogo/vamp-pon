import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const profilePath = 'data/visual/core5-living-visual-profiles-v1.json';
const queuePath = 'data/visual/all-character-life-choice-author-review-queue-v1.json';
const profileText = readFileSync(profilePath,'utf8');
const profile = JSON.parse(profileText);
const queue = JSON.parse(readFileSync(queuePath,'utf8'));
const core5 = new Set(queue.core5 ?? []);
const p1Domains = Object.entries(queue.domainPriority ?? {}).filter(([,priority]) => priority === 'P1').map(([domain]) => domain);
const selectors: Record<string,string[]> = {
  personalGrooming: ['makeupPolicy','nailPolicy','hairGroomingBehavior'],
  footwearGroundInterface: ['footwearPreference'],
};
function markerPaths(value: unknown, marker: (text:string)=>boolean, prefix=''): string[] {
  if (typeof value === 'string' && marker(value)) return [prefix];
  if (Array.isArray(value)) return value.flatMap((item,index)=>markerPaths(item,marker,`${prefix}[${index}]`));
  if (value && typeof value === 'object') return Object.entries(value as Record<string,unknown>).flatMap(([key,item])=>markerPaths(item,marker,prefix?`${prefix}.${key}`:key));
  return [];
}
const characters = (profile.characters ?? []).filter((character:any)=>core5.has(character.id)).map((character:any)=>({
  id:character.id,
  name:character.name,
  domains:Object.fromEntries(p1Domains.map((domain)=>[domain,{
    state:'AUTHOR_REVIEW_REQUIRED',
    evidence:Object.fromEntries((selectors[domain]??[]).map((selector)=>[selector,{
      value:character[selector],
      openAuthorDecisionPaths:markerPaths(character[selector],text=>text.startsWith('OPEN_AUTHOR_DECISION'),selector),
      pendingReviewPaths:markerPaths(character[selector],text=>text.includes('PENDING_REVIEW'),selector),
    }])),
    requiresHumanDecision:true,
    canonPromotionBlocked:true,
    imageModelFreedom:false,
    generatedImageMayCloseItem:false,
  }]))
}));
const contract={
  id:'yoru-no-shirube-core5-p1-life-choice-review-contract-v1',
  date:'2026-08-14',
  status:'DERIVED_REVIEW_CONTRACT_NON_CANON',
  sourceProfile:profilePath,
  sourceProfileSha256:createHash('sha256').update(profileText).digest('hex'),
  sourceQueue:queuePath,
  scope:{characterCount:characters.length,domainCount:p1Domains.length,reviewItemCount:characters.length*p1Domains.length},
  policy:{noNewCharacterFactsAuthored:true,requiresHumanDecision:true,canonPromotionBlocked:true,imageModelFreedom:false,generatedImageMayCloseItem:false,openAuthorDecisionPreserved:true,pendingReviewPreserved:true},
  characters,
};
if(process.argv.includes('--emit')){
  console.log('P1_CONTRACT_JSON_BEGIN');
  console.log(JSON.stringify(contract,null,2));
  console.log('P1_CONTRACT_JSON_END');
}else console.log(`[core5-p1-life-choice-review] OK: ${contract.scope.reviewItemCount} review items`);
