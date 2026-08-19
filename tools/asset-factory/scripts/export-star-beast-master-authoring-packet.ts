import {
  activeStarBeastMasterAuthoringQueue,
  heldStarBeastMasterAuthoringQueue,
  starBeastMasterAuthoringQueue,
} from '../../../src/game/data/starBeastMasterAuthoringQueue.ts';

function parseValue(name: string): string | null {
  const prefix = `--${name}=`;
  const arg = process.argv.slice(2).find((value) => value.startsWith(prefix));
  return arg ? arg.slice(prefix.length) : null;
}

const characterId = parseValue('character-id');
const assetId = parseValue('asset-id');
const listMode = process.argv.includes('--list');
const activeMode = process.argv.includes('--active');

if (characterId && assetId) {
  throw new Error('Use either --character-id=<id> or --asset-id=<id>, not both.');
}

if (characterId || assetId) {
  const packet = starBeastMasterAuthoringQueue.find((entry) =>
    characterId ? entry.characterId === characterId : entry.assetId === assetId,
  );
  if (!packet) throw new Error(`Star Beast Master authoring packet not found: ${characterId ?? assetId}`);
  console.log(JSON.stringify({
    mode: 'AUTHORING_PACKET_INSPECTION_ONLY',
    authorityBoundary: {
      imageGenerationAuthorized: false,
      promptReviewRequired: true,
      visualReviewRequired: true,
      generatedOutputCreatesCanon: false,
      generatedOutputCreatesMasterApproval: false,
      generatedOutputCreatesRuntimeApproval: false,
    },
    packet,
  }, null, 2));
  process.exit(0);
}

if (activeMode) {
  console.log(JSON.stringify({
    mode: 'ACTIVE_AUTHORING_PACKETS_INSPECTION_ONLY',
    count: activeStarBeastMasterAuthoringQueue.length,
    imageGenerationAuthorized: false,
    packets: activeStarBeastMasterAuthoringQueue,
  }, null, 2));
  process.exit(0);
}

if (listMode) {
  console.log(JSON.stringify({
    mode: 'AUTHORING_PACKET_INDEX',
    total: starBeastMasterAuthoringQueue.length,
    active: activeStarBeastMasterAuthoringQueue.length,
    held: heldStarBeastMasterAuthoringQueue.length,
    imageGenerationAuthorized: false,
    items: starBeastMasterAuthoringQueue.map((entry) => ({
      assetId: entry.assetId,
      characterId: entry.characterId,
      displayName: entry.characterDisplayName,
      species: entry.species,
      authoringState: entry.authoringState,
      subjectHold: entry.subjectHold,
    })),
  }, null, 2));
  process.exit(0);
}

console.log(JSON.stringify({
  usage: [
    'node --experimental-strip-types tools/asset-factory/scripts/export-star-beast-master-authoring-packet.ts --list',
    'node --experimental-strip-types tools/asset-factory/scripts/export-star-beast-master-authoring-packet.ts --active',
    'node --experimental-strip-types tools/asset-factory/scripts/export-star-beast-master-authoring-packet.ts --character-id=asa',
    'node --experimental-strip-types tools/asset-factory/scripts/export-star-beast-master-authoring-packet.ts --asset-id=star-beast-asa-master-v1',
  ],
  total: starBeastMasterAuthoringQueue.length,
  active: activeStarBeastMasterAuthoringQueue.length,
  held: heldStarBeastMasterAuthoringQueue.length,
  imageGenerationAuthorized: false,
}, null, 2));
