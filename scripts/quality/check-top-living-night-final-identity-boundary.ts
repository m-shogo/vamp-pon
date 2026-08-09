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
const generationPromptPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/final-key-art-generation-prompt.md',
);
const referenceManifestPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json',
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

invariant(existsSync(generationPromptPath), 'final Core5 key-art generation prompt is missing');
const generationPrompt = readFileSync(generationPromptPath, 'utf8');
for (const token of [
  'GENERATION_READY / NOT_FINAL_ART',
  'five foreground humans must be exactly the approved Core5 identities',
  'Yui — identity lock',
  'Asa — identity lock',
  'Nagi — identity lock',
  'Michiru — identity lock',
  'Tomori — identity lock',
  'Do not line the five characters up at equal scale',
  'Do not add a sixth foreground human',
  'Hard negative prompt',
  'generationPromptReady=true',
  'core5ReferencesMandatory=true',
  'finalCandidateGenerated=false',
  'finalCore5ArtApproved=false',
  'finalApprovalBlocked=true',
]) {
  invariant(generationPrompt.includes(token), `final Core5 generation prompt boundary missing: ${token}`);
}

invariant(existsSync(referenceManifestPath), 'locked Core5 reference manifest is missing');
const referenceManifest = JSON.parse(readFileSync(referenceManifestPath, 'utf8')) as {
  schemaVersion: number;
  status: string;
  referenceCount: number;
  references: Array<{ id: string; path: string; gitBlobSha1: string }>;
  rules: {
    exactlyFiveReferences: boolean;
    silentMasterReplacementAllowed: boolean;
    manifestUpdateRequiredForIntentionalMasterChange: boolean;
    finalCandidateMustUseTheseReferences: boolean;
  };
};

invariant(referenceManifest.schemaVersion === 1, 'Core5 reference authority schema mismatch');
invariant(
  referenceManifest.status === 'LOCKED_FOR_FINAL_TOP_GENERATION',
  'Core5 reference authority must be locked for final TOP generation',
);
invariant(referenceManifest.referenceCount === 5, 'Core5 reference authority must declare five masters');
invariant(referenceManifest.references.length === 5, 'Core5 reference authority must contain five masters');
invariant(referenceManifest.rules.exactlyFiveReferences, 'Core5 exact-five reference rule must remain enabled');
invariant(!referenceManifest.rules.silentMasterReplacementAllowed, 'silent Core5 master replacement must remain prohibited');
invariant(
  referenceManifest.rules.manifestUpdateRequiredForIntentionalMasterChange,
  'intentional Core5 master changes must update reference authority',
);
invariant(referenceManifest.rules.finalCandidateMustUseTheseReferences, 'final TOP must use the locked Core5 master set');

const masterPaths = [
  'assets/reference/character-master/core5/yui-character-master-v1.png',
  'assets/reference/character-master/core5/asa-character-master-v1.png',
  'assets/reference/character-master/core5/nagi-character-master-v1.png',
  'assets/reference/character-master/core5/michiru-character-master-v1.png',
  'assets/reference/character-master/core5/tomori-character-master-v1.png',
];
const expectedIds = ['yui', 'asa', 'nagi', 'michiru', 'tomori'];

for (const [index, path] of masterPaths.entries()) {
  invariant(existsSync(join(root, path)), `Core5 identity master is missing: ${path}`);
  const locked = referenceManifest.references[index];
  invariant(locked.id === expectedIds[index], `Core5 reference id/order mismatch at ${index}`);
  invariant(locked.path === path, `Core5 reference manifest path mismatch: ${path}`);
  invariant(/^[0-9a-f]{40}$/.test(locked.gitBlobSha1), `Core5 locked Git blob SHA-1 is invalid: ${path}`);
  invariant(generationPrompt.includes(path), `final generation prompt does not name locked Core5 reference: ${path}`);
}

console.log('TOP Living Night final Core5 identity boundary: PASS');
console.log('current Runtime V3 composite remains a visual-recovery bridge');
console.log('Stage1 artifact gap review confirms generic identities/rendering require replacement');
console.log('final generation prompt is bound to the five locked repository Core5 masters');
console.log('silent Core5 master replacement is rejected by separate binary-integrity CI');
console.log('final art approval remains blocked pending Core5 identity and human visual review');
