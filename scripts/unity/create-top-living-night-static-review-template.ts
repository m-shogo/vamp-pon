import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

const root = process.cwd();
const finalArtPath = 'docs/design-targets/generated/top-living-night-v3/final-art-status.json';
const referencePath = 'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json';
const canonicalOutput = 'docs/design-targets/generated/top-living-night-v3/review-inputs/static-review-current.json';

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(join(root, path), 'utf8'));
}

function main(): void {
  invariant(existsSync(join(root, finalArtPath)), 'final-art status is missing');
  invariant(existsSync(join(root, referencePath)), 'Core5 reference manifest is missing');
  const finalArt = readJson(finalArtPath);
  const reference = readJson(referencePath);

  invariant(finalArt.schemaVersion === 1, 'final-art status schema mismatch');
  invariant(reference.schemaVersion === 1, 'Core5 reference manifest schema mismatch');

  if (!finalArt.candidateGenerated) {
    console.log('TOP static review template: BLOCKED');
    console.log('NEXT=final-candidate');
    console.log('No template was written because the final Core5 candidate is not registered yet.');
    return;
  }

  invariant(/^[0-9a-f]{64}$/.test(finalArt.candidateSha256), 'registered final candidate SHA-256 is invalid');
  invariant(/^[0-9a-f]{64}$/.test(finalArt.candidateCore5ReferenceSetSha256), 'registered Core5 reference-set fingerprint is invalid');
  invariant(finalArt.candidateCore5ReferenceSetSha256 === reference.referenceSetSha256, 'candidate reference-set fingerprint is stale');
  invariant(reference.referenceCount === 5 && reference.references?.length === 5, 'review template requires exactly five Core5 references');

  const template = {
    schemaVersion: 1,
    candidateSha256: finalArt.candidateSha256,
    referenceSetSha256: reference.referenceSetSha256,
    reviewedAtUtc: '',
    reviewerRole: '',
    core5: {
      exactlyFiveForegroundHumans: false,
      noGenericSubstituteHumans: false,
      reviews: reference.references.map((item: any) => ({
        id: item.id,
        hairFaceMatch: false,
        silhouetteMatch: false,
        outfitColorMatch: false,
        signaturePropMatch: false,
        recognizableAt360: false,
      })),
      yuiAsaNagiMutuallyDistinct: false,
      michiruTealIdentityDistinct: false,
      tomoriRustIdentityDistinct: false,
    },
    crops: ['360x800', '390x844', '430x932'].map(resolution => ({
      resolution,
      titleSafe: false,
      primaryButtonSafe: false,
      secondaryButtonSafe: false,
      facesUnobstructed: false,
      signaturePropsUnobstructed: false,
      animalRobotReadable: false,
    })),
    instructions: {
      falseMeansNotApproved: true,
      doNotGuess: true,
      submitWith: 'node --experimental-strip-types scripts/unity/register-top-living-night-static-review.ts --input=docs/design-targets/generated/top-living-night-v3/review-inputs/static-review-current.json',
    },
  };

  const absoluteOutput = join(root, canonicalOutput);
  mkdirSync(dirname(absoluteOutput), { recursive: true });
  writeFileSync(absoluteOutput, `${JSON.stringify(template, null, 2)}\n`, 'utf8');

  console.log('TOP static review template: WRITTEN');
  console.log(`path=${canonicalOutput}`);
  console.log(`candidateSha256=${finalArt.candidateSha256}`);
  console.log('All review observations default to false; no approval is implied by template generation.');
}

main();
