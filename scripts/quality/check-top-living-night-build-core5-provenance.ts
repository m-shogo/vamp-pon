import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const root = process.cwd();
const buildPath = join(
  root,
  'unity/VampPonUnity/Assets/_Project/Scripts/Editor/TopLivingNightCompositeV3BuildAssetSync.cs',
);
const buildSync = readFileSync(buildPath, 'utf8');
const finalArt = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/top-living-night-v3/final-art-status.json'),
    'utf8',
  ),
) as {
  schemaVersion: number;
  candidateGenerated: boolean;
  candidateSha256: string;
  candidateCore5ReferenceSetSha256: string;
};
const referenceManifest = JSON.parse(
  readFileSync(
    join(root, 'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json'),
    'utf8',
  ),
) as {
  schemaVersion: number;
  referenceCount: number;
  referenceSetSha256: string;
};

function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new Error(message);
}

const sha256 = /^[0-9a-f]{64}$/;
invariant(finalArt.schemaVersion === 1, 'final-art authority schema mismatch');
invariant(referenceManifest.schemaVersion === 1, 'Core5 reference manifest schema mismatch');
invariant(referenceManifest.referenceCount === 5, 'Core5 build authority requires exactly five references');
invariant(sha256.test(referenceManifest.referenceSetSha256), 'Core5 reference-set fingerprint is invalid');

if (!finalArt.candidateGenerated) {
  invariant(finalArt.candidateSha256 === '', 'ungenerated final candidate must not retain candidate SHA-256');
  invariant(
    finalArt.candidateCore5ReferenceSetSha256 === '',
    'ungenerated final candidate must not retain Core5 reference-set fingerprint',
  );
} else {
  invariant(sha256.test(finalArt.candidateSha256), 'generated final candidate requires SHA-256');
  invariant(
    finalArt.candidateCore5ReferenceSetSha256 === referenceManifest.referenceSetSha256,
    'generated final candidate must be registered against the current Core5 reference set',
  );
}

for (const token of [
  'Core5ReferenceManifestRelativePath',
  'docs/design-targets/generated/top-living-night-v3/core5-reference-manifest.json',
  'candidateCore5ReferenceSetSha256',
  'Core5ReferenceManifest referenceManifest;',
  'JsonUtility.FromJson<Core5ReferenceManifest>',
  'referenceManifest.schemaVersion != 1',
  'referenceManifest.referenceCount != 5',
  'IsLowerHexSha256(referenceManifest.referenceSetSha256)',
  'status.candidateCore5ReferenceSetSha256',
  'referenceManifest.referenceSetSha256',
  'final candidate was registered against a stale Core5 reference set',
  'Re-register the final candidate before building final-core5 runtime assets.',
  'private sealed class Core5ReferenceManifest',
]) {
  invariant(buildSync.includes(token), `TOP final-core5 build provenance guard missing: ${token}`);
}

const selectorStart = buildSync.indexOf(
  'internal static CompositeSourceSelection ResolveCompositeSource()',
);
const importerStart = buildSync.indexOf(
  'private static void ConfigureTextureImporter()',
  selectorStart,
);
invariant(selectorStart >= 0 && importerStart > selectorStart, 'TOP build source selector boundary is missing');
const selector = buildSync.slice(selectorStart, importerStart);

const generatedGate = selector.indexOf('if (!status.candidateGenerated)');
const referenceManifestRead = selector.indexOf('Core5ReferenceManifest referenceManifest;');
const referenceSetCompare = selector.indexOf('status.candidateCore5ReferenceSetSha256', referenceManifestRead);
const finalShaRead = selector.indexOf('ComputeSha256(finalSourcePath)', referenceSetCompare);
const finalSelection = selector.indexOf('"final-core5"', finalShaRead);
invariant(generatedGate >= 0, 'TOP build selector must branch on candidateGenerated');
invariant(referenceManifestRead > generatedGate, 'TOP build selector must load Core5 reference authority after final-candidate gate');
invariant(referenceSetCompare > referenceManifestRead, 'TOP build selector must compare candidate/reference-set provenance');
invariant(finalShaRead > referenceSetCompare, 'TOP build selector must validate reference-set provenance before final candidate bytes');
invariant(finalSelection > finalShaRead, 'TOP build selector must not promote final-core5 before provenance + byte validation');

console.log('TOP Living Night build Core5 provenance: PASS');
console.log(
  `candidate=${finalArt.candidateGenerated ? 'generated' : 'NOT_RUN'} referenceSet=${referenceManifest.referenceSetSha256}`,
);
console.log('local Unity build cannot select final-core5 from a stale Core5 reference-set registration');
