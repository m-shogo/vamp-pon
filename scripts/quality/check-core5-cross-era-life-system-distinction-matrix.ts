import { readFileSync } from 'node:fs';

const matrix = JSON.parse(readFileSync('data/visual/core5-cross-era-life-system-distinction-matrix-v1.json', 'utf8'));
const fail = (message: string): never => { throw new Error(`[core5-cross-era-distinction] ${message}`); };
const ids = ['tomori', 'michiru', 'nagi', 'yui', 'asa'];
const axes = ['communication','movementNavigation','shoppingAvailability','repairReplacement','paymentExchange','privacyRecords','householdAccess','ordinaryTaskFriction','materialInfrastructure'];

if (matrix.schemaVersion !== 1) fail('schemaVersion drift');
if (matrix.imageGenerationAuthorized !== false) fail('image generation must remain unauthorized');
if (matrix.humanReviewRequired !== true) fail('Human review must remain required');
if (matrix.promotion?.createsStoryCanon !== false || matrix.promotion?.createsLiteralFamilyCanon !== false || matrix.promotion?.createsVisualMasterApproval !== false) fail('promotion boundary weakened');
if (!Array.isArray(matrix.eras) || matrix.eras.length !== 5) fail('expected five era entries');
if (JSON.stringify(matrix.eras.map((entry: any) => entry.characterId)) !== JSON.stringify(ids)) fail('Core5 era order drift');

const signatures = new Set<string>();
for (const entry of matrix.eras) {
  const expectedYearState = entry.characterId === 'yui' ? '2026_CURRENT' : 'OPEN';
  if (entry.exactYearState !== expectedYearState) fail(`${entry.characterId}: exactYearState drift`);
  if (!entry.distinctionSignature || signatures.has(entry.distinctionSignature)) fail(`${entry.characterId}: distinction signature missing or duplicated`);
  signatures.add(entry.distinctionSignature);
  for (const axis of axes) {
    if (typeof entry[axis] !== 'string' || entry[axis].length < 32) fail(`${entry.characterId}: weak ${axis}`);
  }
  if (!Array.isArray(entry.antiShortcut) || entry.antiShortcut.length < 4) fail(`${entry.characterId}: antiShortcut too small`);
}

if (!Array.isArray(matrix.humanReviewQuestions) || matrix.humanReviewQuestions.length < 6) fail('Human review questions incomplete');
console.log(`Core5 cross-era distinction matrix: PASS (eras=${matrix.eras.length}, axes=${axes.length}, signatures=${signatures.size}, imageGenerationAuthorized=false)`);
