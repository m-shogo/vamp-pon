import { readdirSync, readFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const root = process.cwd();
const unityDir = join(root, 'scripts/unity');
const canonicalPromoter = 'promote-top-living-night-final-approval.ts';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const topScripts = readdirSync(unityDir)
  .filter(name => name.endsWith('.ts') && name.includes('top-living-night'))
  .sort();
invariant(topScripts.includes(canonicalPromoter), 'canonical TOP final promoter is missing');

const finalApprovalWriters: string[] = [];
const runtimeApprovalWriters: string[] = [];
const finalUnblockWriters: string[] = [];

for (const name of topScripts) {
  const source = readFileSync(join(unityDir, name), 'utf8');
  if (/\.approvedAsFinal\s*=\s*true\b/.test(source)) finalApprovalWriters.push(name);
  if (/\.runtimeApproved\s*=\s*true\b/.test(source)) runtimeApprovalWriters.push(name);
  if (/\.finalApprovalBlocked\s*=\s*false\b/.test(source)) finalUnblockWriters.push(name);
}

invariant(
  JSON.stringify(finalApprovalWriters) === JSON.stringify([canonicalPromoter]),
  `TOP approvedAsFinal=true writer boundary violated: ${finalApprovalWriters.join(',') || 'none'}`,
);
invariant(
  JSON.stringify(runtimeApprovalWriters) === JSON.stringify([canonicalPromoter]),
  `TOP runtimeApproved=true writer boundary violated: ${runtimeApprovalWriters.join(',') || 'none'}`,
);
invariant(
  JSON.stringify(finalUnblockWriters) === JSON.stringify([canonicalPromoter]),
  `TOP finalApprovalBlocked=false writer boundary violated: ${finalUnblockWriters.join(',') || 'none'}`,
);

const promoter = readFileSync(join(unityDir, canonicalPromoter), 'utf8');
for (const token of [
  'finalArt.approvedAsFinal = true',
  'finalArt.runtimeApproved = true',
  'finalArt.finalApprovalBlocked = false',
  'device.runtimeApproved = true',
  'device.finalApprovalBlocked = false',
  'motion.runtimeApproved = true',
]) {
  invariant(promoter.includes(token), `canonical TOP final promoter contract missing: ${token}`);
}

console.log('TOP Living Night approval writer boundary: PASS');
console.log(`topScripts=${topScripts.length} final/runtime/unblock writer=${basename(canonicalPromoter)}`);
console.log('review registrars may only record evidence/derived partial review state; final promotion has one canonical writer.');
