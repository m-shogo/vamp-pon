import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

const profileText = readFileSync('data/visual/core5-living-visual-profiles-v1.json','utf8');
const profile = JSON.parse(profileText);
const contract = JSON.parse(readFileSync('data/visual/core5-p0-life-choice-review-contract-v1.json','utf8'));
const fail = (message: string) => { throw new Error(`[core5-p0-review] ${message}`); };
const same = (a: unknown,b: unknown) => JSON.stringify(a) === JSON.stringify(b);

if (contract.sourceProfileSha256 !== createHash('sha256').update(profileText).digest('hex')) fail('source profile hash is stale');
if (!same(contract.scope,{characterCount:5,domainCount:2,reviewItemCount:10})) fail('scope drift');
if (contract.policy?.requiresHumanDecision !== true || contract.policy?.canonPromotionBlocked !== true || contract.policy?.imageModelFreedom !== false || contract.policy?.generatedImageMayCloseItem !== false) fail('safety policy drift');

const liveById = new Map((profile.characters ?? []).map((entry: any) => [entry.id,entry]));
for (const snapshot of contract.characters ?? []) {
  const live: any = liveById.get(snapshot.id);
  if (!live) fail(`missing ${snapshot.id}`);
  if (!same(snapshot.bodyAdornment,{piercingPolicy:live.piercingPolicy,tattooPolicy:live.tattooPolicy,jewelryPolicy:live.jewelryPolicy})) fail(`body adornment stale for ${snapshot.id}`);
  if (!same(snapshot.skinCoverage,live.exposurePreference)) fail(`coverage stale for ${snapshot.id}`);
}
if (!same((contract.characters ?? []).map((entry:any)=>entry.id),['yui','asa','nagi','michiru','tomori'])) fail('Core5 roster drift');
if (!same(contract.characters.find((entry:any)=>entry.id==='asa')?.openAuthorDecisionPaths,['piercingPolicy.tongue'])) fail('Asa OPEN marker drift');
if (!same(contract.characters.find((entry:any)=>entry.id==='tomori')?.openAuthorDecisionPaths,['tattooPolicy.value'])) fail('Tomori OPEN marker drift');
if (!same(contract.characters.find((entry:any)=>entry.id==='tomori')?.pendingReviewPaths,['piercingPolicy.value'])) fail('Tomori pending marker drift');

console.log('[core5-p0-review] OK: snapshot matches live Core5 profile');
