import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { stageProductionEntries } from '../../src/game/data/stageProductionDatabase.ts';

const root = resolve(import.meta.dirname, '../..');
const implemented = new Set(['forgotten_street']);
const audit = {
  schemaVersion: 1,
  sourceOfTruth: 'src/game/data/stageProductionDatabase.ts',
  knownStageIds: stageProductionEntries.map(value => value.id),
  canonicalDisplayNames: Object.fromEntries(stageProductionEntries.map(value => [value.id, value.name])),
  canonicalSubtitles: Object.fromEntries(stageProductionEntries.map(value => [value.id, null])),
  canonicalMetadata: Object.fromEntries(stageProductionEntries.map(value => [value.id, []])),
  runtimeImplementedStageIds: stageProductionEntries.filter(value => implemented.has(value.id)).map(value => value.id),
  defaultUnlockedStageIds: ['stage_01'],
  defaultUnlockCanonicalResolution: { stage_01: 'forgotten_street' },
  startableStageIds: ['forgotten_street'],
  documentedButNotImplementedStageIds: stageProductionEntries.filter(value => !implemented.has(value.id)).map(value => value.id),
  missingCanonicalFields: stageProductionEntries.flatMap(value => [
    { stageId: value.id, field: 'subtitle', metadataStatus: 'missing' },
    { stageId: value.id, field: 'uiMetadata', metadataStatus: 'missing' },
  ]),
  legacyRuntimeDiscrepancies: [
    { field: 'stageId', legacyValue: 'stage_01', canonicalValue: 'forgotten_street', handling: 'read-only compatibility alias' },
    { field: 'displayName', legacyValue: '墨夜の通り道', canonicalValue: '忘れられた夜道', handling: 'production UI uses canonical value' },
  ],
  productionCatalogUsesCanonicalContentOnly: true,
  captureOnlyProductionContentAdded: false,
  saveMutationRequired: false,
};
const output = resolve(root, 'docs/design-targets/generated/unity-u48/batch-c/stage-select-canon-audit.json');
writeFileSync(output, JSON.stringify(audit, null, 2) + '\n');
console.log(`U48 StageSelect canon audit written: known=${audit.knownStageIds.length}, implemented=${audit.runtimeImplementedStageIds.length}, locked=${audit.documentedButNotImplementedStageIds.length}`);
