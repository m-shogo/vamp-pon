import {
  activeNamedObjectGeometryReviewQueue,
  heldNamedObjectGeometryReviewQueue,
  namedObjectMasterGeometryReviewQueue,
  workingNameNamedObjectGeometryReviewQueue,
} from '../../../src/game/data/namedObjectMasterGeometryReviewQueue.ts';

function parseValue(name: string): string | null {
  const prefix = `--${name}=`;
  const arg = process.argv.slice(2).find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

const ownerId = parseValue('owner-id');
const assetId = parseValue('asset-id');
const listMode = process.argv.includes('--list');
const activeMode = process.argv.includes('--active');

if (ownerId && assetId) {
  throw new Error('Use either --owner-id=<id> or --asset-id=<id>, not both.');
}

if (ownerId || assetId) {
  const packet = namedObjectMasterGeometryReviewQueue.find((entry) =>
    ownerId ? entry.ownerId === ownerId : entry.assetId === assetId,
  );
  if (!packet) throw new Error(`Named Object geometry review packet not found: ${ownerId ?? assetId}`);
  console.log(JSON.stringify({
    mode: 'CANDIDATE_GEOMETRY_REVIEW_INSPECTION_ONLY',
    authorityBoundary: {
      geometryAuthority: packet.geometryAuthorityAtSource,
      referenceGenerationReady: false,
      imageGenerationAuthorized: false,
      humanGeometryReviewRequired: true,
      generatedOutputCreatesCanon: false,
      generatedOutputCreatesGeometryApproval: false,
      generatedOutputCreatesFinalOrRuntimeApproval: false,
      nameApprovalRequiredBeforeReferenceGenerationReady:
        packet.nameApprovalRequiredBeforeReferenceGenerationReady,
    },
    packet,
  }, null, 2));
  process.exit(0);
}

if (activeMode) {
  console.log(JSON.stringify({
    mode: 'ACTIVE_CANDIDATE_GEOMETRY_REVIEW_PACKETS',
    count: activeNamedObjectGeometryReviewQueue.length,
    referenceGenerationReady: false,
    imageGenerationAuthorized: false,
    packets: activeNamedObjectGeometryReviewQueue,
  }, null, 2));
  process.exit(0);
}

if (listMode) {
  console.log(JSON.stringify({
    mode: 'CANDIDATE_GEOMETRY_REVIEW_INDEX',
    total: namedObjectMasterGeometryReviewQueue.length,
    active: activeNamedObjectGeometryReviewQueue.length,
    held: heldNamedObjectGeometryReviewQueue.length,
    workingName: workingNameNamedObjectGeometryReviewQueue.length,
    referenceGenerationReady: false,
    imageGenerationAuthorized: false,
    items: namedObjectMasterGeometryReviewQueue.map((entry) => ({
      assetId: entry.assetId,
      ownerId: entry.ownerId,
      ownerDisplayName: entry.ownerDisplayName,
      displayName: entry.displayName,
      namingStatus: entry.namingStatus,
      reviewState: entry.reviewState,
      subjectHold: entry.subjectHold,
      nameApprovalRequiredBeforeReferenceGenerationReady:
        entry.nameApprovalRequiredBeforeReferenceGenerationReady,
    })),
  }, null, 2));
  process.exit(0);
}

console.log(JSON.stringify({
  usage: [
    'node --experimental-strip-types tools/asset-factory/scripts/export-named-object-geometry-review-packet.ts --list',
    'node --experimental-strip-types tools/asset-factory/scripts/export-named-object-geometry-review-packet.ts --active',
    'node --experimental-strip-types tools/asset-factory/scripts/export-named-object-geometry-review-packet.ts --owner-id=asa',
    'node --experimental-strip-types tools/asset-factory/scripts/export-named-object-geometry-review-packet.ts --asset-id=artifact-asa-named-object-master-v1',
  ],
  total: namedObjectMasterGeometryReviewQueue.length,
  active: activeNamedObjectGeometryReviewQueue.length,
  held: heldNamedObjectGeometryReviewQueue.length,
  workingName: workingNameNamedObjectGeometryReviewQueue.length,
  referenceGenerationReady: false,
  imageGenerationAuthorized: false,
}, null, 2));
