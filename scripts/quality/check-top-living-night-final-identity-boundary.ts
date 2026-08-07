import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const briefPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/final-identity-brief.md',
);
const gapReviewPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/core5-bridge-gap-review.md',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(briefPath), 'final Core5 TOP identity brief is missing');
const brief = readFileSync(briefPath, 'utf8');

for (const token of [
  'FINAL_ART_CANDIDATE_REQUIRED',
  'visual-recovery bridge',
  'yui-character-master-v1.png',
  'asa-character-master-v1.png',
  'nagi-character-master-v1.png',
  'michiru-character-master-v1.png',
  'tomori-character-master-v1.png',
  'top 18–20%',
  'bottom 20–22%',
  'five Core5 identities are individually recognizable',
  'finalCore5ArtApproved=false',
  'humanVisualReviewComplete=false',
  'runtimeApproved=false',
  'finalApprovalBlocked=true',
]) {
  invariant(brief.includes(token), `final Core5 identity boundary missing: ${token}`);
}

invariant(existsSync(gapReviewPath), 'Core5 bridge gap review is missing');
const gapReview = readFileSync(gapReviewPath, 'utf8');
for (const token of [
  'FINAL_ART_NOT_APPROVED',
  'compositionDirection=KEEP',
  'currentHumanIdentity=REPLACE',
  'currentRenderingStyle=REWORK',
  'core5IdentityMismatchConfirmed=true',
  'finalReplacementRequired=true',
  'finalCore5ArtApproved=false',
  'runtimeCaptureComplete=false',
  'humanVisualReviewComplete=false',
  'finalApprovalBlocked=true',
]) {
  invariant(gapReview.includes(token), `Core5 bridge review boundary missing: ${token}`);
}

const masterPaths = [
  'assets/reference/character-master/core5/yui-character-master-v1.png',
  'assets/reference/character-master/core5/asa-character-master-v1.png',
  'assets/reference/character-master/core5/nagi-character-master-v1.png',
  'assets/reference/character-master/core5/michiru-character-master-v1.png',
  'assets/reference/character-master/core5/tomori-character-master-v1.png',
];

for (const path of masterPaths) {
  invariant(existsSync(join(root, path)), `Core5 identity master is missing: ${path}`);
}

console.log('TOP Living Night final Core5 identity boundary: PASS');
console.log('current Runtime V3 composite remains a visual-recovery bridge');
console.log('Stage1 artifact gap review confirms generic identities/rendering require replacement');
console.log('final art approval remains blocked pending Core5 identity and human visual review');
