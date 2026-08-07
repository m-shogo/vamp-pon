import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type CharacterReview = {
  id: string;
  referencePath: string;
  executed: boolean;
  result: string;
  hairFaceMatch: boolean;
  silhouetteMatch: boolean;
  outfitColorMatch: boolean;
  signaturePropMatch: boolean;
  recognizableAt360: boolean;
};

type IdentityStatus = {
  schemaVersion: number;
  candidateGenerated: boolean;
  sourcePath: string;
  sourceSha256: string;
  exactlyFiveForegroundHumans: boolean;
  noGenericSubstituteHumans: boolean;
  reviews: CharacterReview[];
  yuiAsaNagiMutuallyDistinct: boolean;
  michiruTealIdentityDistinct: boolean;
  tomoriRustIdentityDistinct: boolean;
  allIdentitiesApproved: boolean;
  reviewedAtUtc: string;
  finalApprovalBlocked: boolean;
};

type FinalArtStatus = {
  candidateGenerated: boolean;
  candidatePath: string;
  candidateSha256: string;
  core5IdentityReviewed: boolean;
  approvedAsFinal: boolean;
  finalApprovalBlocked: boolean;
};

const root = process.cwd();
const identityPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json',
);
const finalPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(identityPath), 'Core5 identity review status is missing');
invariant(existsSync(finalPath), 'TOP final-art status is missing');
const identity = JSON.parse(readFileSync(identityPath, 'utf8')) as IdentityStatus;
const finalArt = JSON.parse(readFileSync(finalPath, 'utf8')) as FinalArtStatus;

invariant(identity.schemaVersion === 1, 'Core5 identity review schema mismatch');
invariant(identity.candidateGenerated === finalArt.candidateGenerated, 'Core5/final candidateGenerated flags diverged');
invariant(identity.sourcePath === finalArt.candidatePath, 'Core5 review must target the canonical final-art path');
invariant(identity.reviews.length === 5, 'Core5 review must contain exactly five character reviews');
invariant(
  JSON.stringify(identity.reviews.map(review => review.id)) ===
    JSON.stringify(['yui', 'asa', 'nagi', 'michiru', 'tomori']),
  'Core5 review character order/set mismatch',
);
invariant(finalArt.core5IdentityReviewed === identity.allIdentitiesApproved, 'final-art Core5 review flag must exactly match per-character approval');

const expectedReferences = new Map([
  ['yui', 'assets/reference/character-master/core5/yui-character-master-v1.png'],
  ['asa', 'assets/reference/character-master/core5/asa-character-master-v1.png'],
  ['nagi', 'assets/reference/character-master/core5/nagi-character-master-v1.png'],
  ['michiru', 'assets/reference/character-master/core5/michiru-character-master-v1.png'],
  ['tomori', 'assets/reference/character-master/core5/tomori-character-master-v1.png'],
]);

for (const review of identity.reviews) {
  const expectedReference = expectedReferences.get(review.id);
  invariant(expectedReference, `unexpected Core5 review id: ${review.id}`);
  invariant(review.referencePath === expectedReference, `${review.id}: authoritative master path mismatch`);
  invariant(existsSync(join(root, review.referencePath)), `${review.id}: authoritative master PNG is missing`);
}

if (!identity.candidateGenerated) {
  invariant(identity.sourceSha256 === '', 'missing final TOP candidate cannot have Core5 source SHA');
  invariant(!identity.exactlyFiveForegroundHumans, 'missing candidate cannot assert exact foreground human count');
  invariant(!identity.noGenericSubstituteHumans, 'missing candidate cannot assert substitute-human review');
  invariant(!identity.yuiAsaNagiMutuallyDistinct, 'missing candidate cannot assert Yui/Asa/Nagi distinction');
  invariant(!identity.michiruTealIdentityDistinct, 'missing candidate cannot assert Michiru identity distinction');
  invariant(!identity.tomoriRustIdentityDistinct, 'missing candidate cannot assert Tomori identity distinction');
  invariant(!identity.allIdentitiesApproved, 'missing candidate cannot have Core5 identity approval');
  invariant(identity.reviewedAtUtc === '', 'missing candidate cannot have Core5 review timestamp');
  invariant(identity.finalApprovalBlocked, 'missing candidate must keep Core5 approval blocked');

  for (const review of identity.reviews) {
    invariant(!review.executed, `${review.id}: missing candidate cannot have executed identity review`);
    invariant(review.result === 'NOT_RUN', `${review.id}: unexecuted identity review must be NOT_RUN`);
    invariant(!review.hairFaceMatch, `${review.id}: unexecuted review cannot assert hair/face match`);
    invariant(!review.silhouetteMatch, `${review.id}: unexecuted review cannot assert silhouette match`);
    invariant(!review.outfitColorMatch, `${review.id}: unexecuted review cannot assert outfit/color match`);
    invariant(!review.signaturePropMatch, `${review.id}: unexecuted review cannot assert signature-prop match`);
    invariant(!review.recognizableAt360, `${review.id}: unexecuted review cannot assert 360px recognizability`);
  }

  console.log('TOP Living Night Core5 identity review: honest NOT_RUN boundary');
  console.log('characters: Yui / Asa / Nagi / Michiru / Tomori');
  process.exit(0);
}

invariant(/^[0-9a-f]{64}$/.test(identity.sourceSha256), 'Core5 identity source SHA-256 is invalid');
invariant(identity.sourceSha256 === finalArt.candidateSha256, 'Core5 review must target the exact final-art candidate SHA');

const anyIdentityReviewExecuted = identity.reviews.some(review => review.executed);
if (anyIdentityReviewExecuted) {
  invariant(identity.reviewedAtUtc.length > 0, 'executed Core5 review requires a review timestamp even when incomplete/failed');
} else {
  invariant(identity.reviewedAtUtc === '', 'unexecuted Core5 review must not retain a stale review timestamp');
}

for (const review of identity.reviews) {
  if (!review.executed) {
    invariant(review.result === 'NOT_RUN', `${review.id}: unexecuted identity review must be NOT_RUN`);
    continue;
  }

  invariant(['PASSED', 'FAILED'].includes(review.result), `${review.id}: executed identity review needs PASSED or FAILED`);
  if (review.result === 'PASSED') {
    invariant(review.hairFaceMatch, `${review.id}: passed review requires hair/face match`);
    invariant(review.silhouetteMatch, `${review.id}: passed review requires silhouette match`);
    invariant(review.outfitColorMatch, `${review.id}: passed review requires outfit/color match`);
    invariant(review.signaturePropMatch, `${review.id}: passed review requires signature-prop match`);
    invariant(review.recognizableAt360, `${review.id}: passed review requires 360px recognizability`);
  }
}

if (identity.allIdentitiesApproved) {
  invariant(identity.exactlyFiveForegroundHumans, 'Core5 approval requires exactly five foreground humans');
  invariant(identity.noGenericSubstituteHumans, 'Core5 approval prohibits generic substitute humans');
  invariant(identity.reviews.every(review => review.executed && review.result === 'PASSED'), 'Core5 approval requires all five character reviews to pass');
  invariant(identity.yuiAsaNagiMutuallyDistinct, 'Core5 approval requires Yui/Asa/Nagi to remain mutually distinct');
  invariant(identity.michiruTealIdentityDistinct, 'Core5 approval requires distinct Michiru teal identity');
  invariant(identity.tomoriRustIdentityDistinct, 'Core5 approval requires distinct Tomori rust identity');
  invariant(identity.reviewedAtUtc.length > 0, 'Core5 approval requires review timestamp');
  invariant(!identity.finalApprovalBlocked, 'approved Core5 review cannot remain internally blocked');
} else {
  invariant(identity.finalApprovalBlocked, 'incomplete Core5 review must keep final approval blocked');
}

if (finalArt.approvedAsFinal) {
  invariant(identity.allIdentitiesApproved, 'final TOP approval requires all five Core5 identities to pass');
  invariant(!finalArt.finalApprovalBlocked, 'final TOP approval cannot retain final-art block');
}

console.log('TOP Living Night Core5 identity review contract: PASS');
console.log(`approved=${identity.allIdentitiesApproved} sourceSha=${identity.sourceSha256}`);
