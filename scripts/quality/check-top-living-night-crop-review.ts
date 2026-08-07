import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

type CropReview = {
  resolution: string;
  executed: boolean;
  result: string;
  titleSafe: boolean;
  primaryButtonSafe: boolean;
  secondaryButtonSafe: boolean;
  facesUnobstructed: boolean;
  signaturePropsUnobstructed: boolean;
  animalRobotReadable: boolean;
};

type CropStatus = {
  schemaVersion: number;
  candidateGenerated: boolean;
  sourcePath: string;
  sourceSha256: string;
  reviews: CropReview[];
  allCropsApproved: boolean;
  reviewedAtUtc: string;
  finalApprovalBlocked: boolean;
};

type FinalArtStatus = {
  candidateGenerated: boolean;
  candidatePath: string;
  candidateSha256: string;
  cropReviewComplete: boolean;
  approvedAsFinal: boolean;
  finalApprovalBlocked: boolean;
};

const root = process.cwd();
const cropPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/crop-review-status.json',
);
const finalPath = join(
  root,
  'docs/design-targets/generated/top-living-night-v3/final-art-status.json',
);

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

invariant(existsSync(cropPath), 'TOP crop-review status is missing');
invariant(existsSync(finalPath), 'TOP final-art status is missing');

const crop = JSON.parse(readFileSync(cropPath, 'utf8')) as CropStatus;
const finalArt = JSON.parse(readFileSync(finalPath, 'utf8')) as FinalArtStatus;

invariant(crop.schemaVersion === 1, 'TOP crop-review schema mismatch');
invariant(crop.candidateGenerated === finalArt.candidateGenerated, 'TOP crop/final candidateGenerated flags diverged');
invariant(crop.sourcePath === finalArt.candidatePath, 'TOP crop review source path must match final-art candidate path');
invariant(crop.reviews.length === 3, 'TOP crop review must contain exactly three resolutions');
invariant(
  JSON.stringify(crop.reviews.map(review => review.resolution)) ===
    JSON.stringify(['360x800', '390x844', '430x932']),
  'TOP crop review resolution matrix mismatch',
);
invariant(
  finalArt.cropReviewComplete === crop.allCropsApproved,
  'TOP final-art cropReviewComplete must exactly match three-crop approval',
);

if (!crop.candidateGenerated) {
  invariant(crop.sourceSha256 === '', 'missing TOP candidate cannot have crop source SHA');
  invariant(!crop.allCropsApproved, 'missing TOP candidate cannot have approved crops');
  invariant(crop.reviewedAtUtc === '', 'missing TOP candidate cannot have crop review timestamp');
  invariant(crop.finalApprovalBlocked, 'missing TOP candidate must keep crop approval blocked');

  for (const review of crop.reviews) {
    invariant(!review.executed, `${review.resolution}: missing TOP candidate cannot have executed crop review`);
    invariant(review.result === 'NOT_RUN', `${review.resolution}: unexecuted crop review must be NOT_RUN`);
    invariant(!review.titleSafe, `${review.resolution}: unexecuted crop cannot assert title safety`);
    invariant(!review.primaryButtonSafe, `${review.resolution}: unexecuted crop cannot assert primary button safety`);
    invariant(!review.secondaryButtonSafe, `${review.resolution}: unexecuted crop cannot assert secondary button safety`);
    invariant(!review.facesUnobstructed, `${review.resolution}: unexecuted crop cannot assert face safety`);
    invariant(!review.signaturePropsUnobstructed, `${review.resolution}: unexecuted crop cannot assert prop safety`);
    invariant(!review.animalRobotReadable, `${review.resolution}: unexecuted crop cannot assert companion readability`);
  }

  console.log('TOP Living Night three-crop review: honest NOT_RUN boundary');
  console.log('matrix: 360x800 / 390x844 / 430x932');
  process.exit(0);
}

invariant(/^[0-9a-f]{64}$/.test(crop.sourceSha256), 'TOP crop source SHA-256 is invalid');
invariant(crop.sourceSha256 === finalArt.candidateSha256, 'TOP crop review must target the exact final-art candidate SHA');

for (const review of crop.reviews) {
  if (!review.executed) {
    invariant(review.result === 'NOT_RUN', `${review.resolution}: unexecuted crop review must be NOT_RUN`);
    continue;
  }

  invariant(['PASSED', 'FAILED'].includes(review.result), `${review.resolution}: executed crop review needs PASSED or FAILED`);
  if (review.result === 'PASSED') {
    invariant(review.titleSafe, `${review.resolution}: passed crop requires title safety`);
    invariant(review.primaryButtonSafe, `${review.resolution}: passed crop requires primary button safety`);
    invariant(review.secondaryButtonSafe, `${review.resolution}: passed crop requires secondary button safety`);
    invariant(review.facesUnobstructed, `${review.resolution}: passed crop requires unobstructed faces`);
    invariant(review.signaturePropsUnobstructed, `${review.resolution}: passed crop requires unobstructed signature props`);
    invariant(review.animalRobotReadable, `${review.resolution}: passed crop requires readable animal/robot`);
  }
}

if (crop.allCropsApproved) {
  invariant(crop.reviews.every(review => review.executed && review.result === 'PASSED'), 'allCropsApproved requires all three crop reviews to pass');
  invariant(crop.reviewedAtUtc.length > 0, 'approved crop review requires timestamp');
  invariant(!crop.finalApprovalBlocked, 'approved crop review cannot remain internally blocked');
} else {
  invariant(crop.finalApprovalBlocked, 'incomplete crop review must keep final approval blocked');
}

if (finalArt.approvedAsFinal) {
  invariant(crop.allCropsApproved, 'final TOP approval requires all three crop reviews');
  invariant(!finalArt.finalApprovalBlocked, 'final TOP approval cannot retain final-art block');
}

console.log('TOP Living Night three-crop review contract: PASS');
console.log(`approved=${crop.allCropsApproved} sourceSha=${crop.sourceSha256}`);
