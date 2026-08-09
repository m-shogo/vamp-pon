import { isAbsolute, join, normalize, relative } from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const root = process.cwd();
const dryRun = process.argv.includes('--dry-run');
const canonicalCandidatePath =
  'docs/design-targets/generated/top-living-night-v3/final/top-living-night-core5-final-430x932.png';
const finalArtPath = 'docs/design-targets/generated/top-living-night-v3/final-art-status.json';
const identityPath = 'docs/design-targets/generated/top-living-night-v3/core5-identity-review-status.json';
const cropPath = 'docs/design-targets/generated/top-living-night-v3/crop-review-status.json';
const referencePath = 'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json';

const characterIds = ['yui', 'asa', 'nagi', 'michiru', 'tomori'];
const cropResolutions = ['360x800', '390x844', '430x932'];
const characterChecks = [
  'hairFaceMatch',
  'silhouetteMatch',
  'outfitColorMatch',
  'signaturePropMatch',
  'recognizableAt360',
] as const;
const cropChecks = [
  'titleSafe',
  'primaryButtonSafe',
  'secondaryButtonSafe',
  'facesUnobstructed',
  'signaturePropsUnobstructed',
  'animalRobotReadable',
] as const;

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

function arg(name: string): string {
  const prefix = `--${name}=`;
  const entry = process.argv.find(value => value.startsWith(prefix));
  return entry ? entry.slice(prefix.length) : '';
}

function readJson(path: string): any {
  return JSON.parse(readFileSync(join(root, path), 'utf8'));
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(join(root, path), `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}

function validUtc(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/.test(value) &&
    Number.isFinite(Date.parse(value))
  );
}

function canonicalInputPath(input: string): string {
  const absolute = isAbsolute(input) ? normalize(input) : join(root, normalize(input));
  const repoRelative = relative(root, absolute).replaceAll('\\', '/');
  invariant(!repoRelative.startsWith('../') && repoRelative !== '..', 'static review input must stay inside the repository');
  invariant(repoRelative.endsWith('.json'), 'static review input must be JSON');
  return repoRelative;
}

function allTrue(value: any, keys: readonly string[]): boolean {
  return keys.every(key => value?.[key] === true);
}

function main(): void {
  for (const path of [finalArtPath, identityPath, cropPath, referencePath]) {
    invariant(existsSync(join(root, path)), `static review authority is missing: ${path}`);
  }

  const finalArt = readJson(finalArtPath);
  const identity = readJson(identityPath);
  const crop = readJson(cropPath);
  const reference = readJson(referencePath);

  invariant(finalArt.schemaVersion === 1, 'final-art status schema mismatch');
  invariant(identity.schemaVersion === 1, 'Core5 identity review schema mismatch');
  invariant(crop.schemaVersion === 1, 'crop review schema mismatch');
  invariant(reference.schemaVersion === 1, 'Core5 reference schema mismatch');
  invariant(finalArt.candidatePath === canonicalCandidatePath, 'final-art candidate path is not canonical');
  invariant(reference.referenceCount === 5 && reference.references?.length === 5, 'static review requires exactly five locked Core5 references');

  if (dryRun) {
    console.log('TOP static review registration: DRY_RUN_READY');
    console.log('input schema: candidateSha256 + referenceSetSha256 + reviewedAtUtc + reviewerRole + core5 + crops');
    console.log('Core5 and crop PASS/FAILED are derived from explicit human boolean observations; registration never promotes runtime/final approval.');
    return;
  }

  invariant(finalArt.candidateGenerated === true, 'static review requires a registered final Core5 candidate');
  invariant(/^[0-9a-f]{64}$/.test(finalArt.candidateSha256), 'static review requires valid final candidate SHA-256');
  invariant(/^[0-9a-f]{64}$/.test(finalArt.candidateCore5ReferenceSetSha256), 'static review requires candidate Core5 reference-set fingerprint');
  invariant(!finalArt.runtimeApproved && !finalArt.approvedAsFinal, 'approved/runtime-approved final art must be re-registered before static review can change');

  const inputArg = arg('input');
  invariant(inputArg.length > 0, '--input=<review.json> is required');
  const inputPath = canonicalInputPath(inputArg);
  invariant(existsSync(join(root, inputPath)), `static review input is missing: ${inputPath}`);
  const input = readJson(inputPath);

  invariant(input.schemaVersion === 1, 'static review input schema mismatch');
  invariant(input.candidateSha256 === finalArt.candidateSha256, 'static review input must target exact current candidate SHA-256');
  invariant(
    input.referenceSetSha256 === finalArt.candidateCore5ReferenceSetSha256 &&
      input.referenceSetSha256 === reference.referenceSetSha256,
    'static review input must target exact current Core5 reference-set fingerprint',
  );
  invariant(validUtc(input.reviewedAtUtc), 'static review input requires canonical UTC reviewedAtUtc');
  invariant(typeof input.reviewerRole === 'string' && input.reviewerRole.trim().length > 0, 'static review input requires reviewerRole');
  invariant(Array.isArray(input.core5?.reviews), 'static review input requires core5.reviews');
  invariant(Array.isArray(input.crops), 'static review input requires crops');
  invariant(
    JSON.stringify(input.core5.reviews.map((review: any) => review.id)) === JSON.stringify(characterIds),
    'static review Core5 character order/set mismatch',
  );
  invariant(
    JSON.stringify(input.crops.map((review: any) => review.resolution)) === JSON.stringify(cropResolutions),
    'static review crop resolution matrix mismatch',
  );

  identity.candidateGenerated = true;
  identity.sourcePath = canonicalCandidatePath;
  identity.sourceSha256 = finalArt.candidateSha256;
  identity.referenceSetSha256 = reference.referenceSetSha256;
  identity.exactlyFiveForegroundHumans = input.core5.exactlyFiveForegroundHumans === true;
  identity.noGenericSubstituteHumans = input.core5.noGenericSubstituteHumans === true;

  for (let index = 0; index < characterIds.length; index++) {
    const source = input.core5.reviews[index];
    const target = identity.reviews[index];
    invariant(source.id === target.id, `${source.id}: static review target order mismatch`);
    for (const key of characterChecks) target[key] = source[key] === true;
    target.executed = true;
    target.result = allTrue(source, characterChecks) ? 'PASSED' : 'FAILED';
  }

  identity.yuiAsaNagiMutuallyDistinct = input.core5.yuiAsaNagiMutuallyDistinct === true;
  identity.michiruTealIdentityDistinct = input.core5.michiruTealIdentityDistinct === true;
  identity.tomoriRustIdentityDistinct = input.core5.tomoriRustIdentityDistinct === true;
  identity.allIdentitiesApproved =
    identity.exactlyFiveForegroundHumans &&
    identity.noGenericSubstituteHumans &&
    identity.reviews.every((review: any) => review.executed && review.result === 'PASSED') &&
    identity.yuiAsaNagiMutuallyDistinct &&
    identity.michiruTealIdentityDistinct &&
    identity.tomoriRustIdentityDistinct;
  identity.reviewedAtUtc = input.reviewedAtUtc;
  identity.finalApprovalBlocked = !identity.allIdentitiesApproved;
  identity.notes = `${input.reviewerRole}: static Core5 review registered from ${inputPath}; candidate/reference provenance verified.`;

  crop.candidateGenerated = true;
  crop.sourcePath = canonicalCandidatePath;
  crop.sourceSha256 = finalArt.candidateSha256;
  for (let index = 0; index < cropResolutions.length; index++) {
    const source = input.crops[index];
    const target = crop.reviews[index];
    invariant(source.resolution === target.resolution, `${source.resolution}: crop review target order mismatch`);
    for (const key of cropChecks) target[key] = source[key] === true;
    target.executed = true;
    target.result = allTrue(source, cropChecks) ? 'PASSED' : 'FAILED';
  }
  crop.allCropsApproved = crop.reviews.every((review: any) => review.executed && review.result === 'PASSED');
  crop.reviewedAtUtc = input.reviewedAtUtc;
  crop.finalApprovalBlocked = !crop.allCropsApproved;
  crop.notes = `${input.reviewerRole}: three-resolution crop review registered from ${inputPath}; candidate SHA verified.`;

  // Keep derived final-art flags synchronized without promoting any runtime/final state.
  finalArt.core5IdentityReviewed = identity.allIdentitiesApproved;
  finalArt.cropReviewComplete = crop.allCropsApproved;
  finalArt.runtimeApproved = false;
  finalArt.approvedAsFinal = false;
  finalArt.finalApprovalBlocked = true;
  finalArt.reviewedAtUtc = '';

  writeJson(identityPath, identity);
  writeJson(cropPath, crop);
  writeJson(finalArtPath, finalArt);

  console.log('TOP static review registration: RECORDED');
  console.log(`candidateSha256=${finalArt.candidateSha256}`);
  console.log(`core5=${identity.allIdentitiesApproved ? 'PASSED' : 'FAILED'}`);
  console.log(`crops=${crop.allCropsApproved ? 'PASSED' : 'FAILED'}`);
  console.log('runtimeApproved=false approvedAsFinal=false (static review never promotes runtime/final approval)');
}

main();
