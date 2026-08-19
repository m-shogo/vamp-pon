import { readFileSync } from 'node:fs';

const PACKET_PATH = 'data/visual/core5-era-setting-board-evidence-packets-v1.json';
const CONTRACT_PATH = 'data/visual/core5-era-setting-board-production-contract-v1.json';
const ENV_PATH = 'data/visual/core5-reality-era-environment-authoring-brief-v1.json';

const packets = JSON.parse(readFileSync(PACKET_PATH, 'utf8'));
const contract = JSON.parse(readFileSync(CONTRACT_PATH, 'utf8'));
const env = JSON.parse(readFileSync(ENV_PATH, 'utf8'));

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const expectedIds = ['yui','asa','nagi','michiru','tomori'];
assert(packets.schemaVersion === 1, 'Core5 evidence packet schemaVersion drift');
assert(packets.status === 'RESEARCH_BACKED_EVIDENCE_PACKETS_NOT_CHARACTER_CANON', 'Core5 evidence packets may not become Character Canon');
for (const [key, expected] of Object.entries({
  researchFactCreatesCharacterCanon: false,
  researchFactCreatesExactYear: false,
  researchFactCreatesExactHousehold: false,
  researchFactCreatesExactIncident: false,
  realHistoricalIncidentMayBeRenamedAndCopied: false,
  futureTrajectoryResearchProvesFutureSociety: false,
  generatedVisualCreatesHistoricalFact: false,
  generatedVisualCreatesFutureFact: false,
  humanReviewRequired: true,
  imageGenerationAuthorized: false,
})) {
  assert(packets.globalBoundary?.[key] === expected, `Core5 evidence global boundary drift: ${key}`);
}

assert(Array.isArray(packets.packets) && packets.packets.length === 5, 'Core5 evidence packets must contain exactly five entries');
const packetIds = packets.packets.map((entry: any) => entry.characterId);
assert(new Set(packetIds).size === 5, 'Core5 evidence packet IDs must be unique');
assert(expectedIds.every((id) => packetIds.includes(id)), 'Core5 evidence packet roster incomplete');
assert(contract.boardFamilies?.environment?.subjectIds?.every((id: string) => packetIds.includes(id)), 'setting-board contract subject missing evidence packet');
assert(env.boards?.every((board: any) => packetIds.includes(board.characterId)), 'environment brief subject missing evidence packet');

for (const packet of packets.packets as any[]) {
  const brief = env.boards.find((entry: any) => entry.characterId === packet.characterId);
  assert(brief, `${packet.characterId}: environment brief missing`);
  assert(packet.eraBand === brief.eraBand, `${packet.characterId}: evidence packet eraBand drift`);
  assert(Array.isArray(packet.researchEvidence) && packet.researchEvidence.length >= 4, `${packet.characterId}: research evidence too thin`);
  assert(Array.isArray(packet.researchSourceLabels) && packet.researchSourceLabels.length >= 3, `${packet.characterId}: research source labels too thin`);
  assert(packet.imageGenerationAuthorized === false, `${packet.characterId}: evidence packet may not authorize image generation`);
}

for (const id of ['tomori','michiru','nagi']) {
  const packet = packets.packets.find((entry: any) => entry.characterId === id);
  assert(packet?.evidenceAuthority === 'RESEARCH_BACKED_CURRENT_FOR_ERA_BAND', `${id}: historical-era evidence authority drift`);
  assert(Array.isArray(packet.requiresExactYearRecheck) && packet.requiresExactYearRecheck.length >= 5, `${id}: exact-year recheck list missing`);
  assert(Array.isArray(packet.mustNotBeUniversalized) && packet.mustNotBeUniversalized.length >= 5, `${id}: anti-universalization guard missing`);
}

const yui = packets.packets.find((entry: any) => entry.characterId === 'yui');
assert(yui?.evidenceAuthority === 'RESEARCH_BACKED_CURRENT_2026_CONTEXT', 'Yui evidence must remain Current 2026 context');
assert(Array.isArray(yui.requiresLocalPrivacySafeRecheck) && yui.requiresLocalPrivacySafeRecheck.includes('specific private residence'), 'Yui local evidence must preserve privacy-safe recheck boundary');
assert(yui.mustNotBeUniversalized?.includes('everyone_is_always_online'), 'Yui board must not universalize always-online access');

const asa = packets.packets.find((entry: any) => entry.characterId === 'asa');
assert(asa?.evidenceAuthority === 'CURRENT_TRAJECTORY_RESEARCH_NOT_FUTURE_FACT', 'Asa evidence must remain trajectory research, not Future fact');
assert(Array.isArray(asa.futureVisualCandidatesNotFacts) && asa.futureVisualCandidatesNotFacts.length >= 5, 'Asa future candidates must be labeled non-facts');
assert(Array.isArray(asa.requiresAuthorityBeforeBoardFact) && asa.requiresAuthorityBeforeBoardFact.includes('exact future year'), 'Asa exact future year must remain authority-dependent');
assert(Array.isArray(asa.explicitNonCopyGuard) && asa.explicitNonCopyGuard.length >= 4, 'Asa study-only non-copy guard missing');
assert(asa.mustNotBeUniversalized?.includes('Android_must_humanize'), 'Asa future board must forbid humanization-as-goal shortcut');

assert(packets.completionBoundary?.packetCount === 5, 'Core5 evidence packet completion count drift');
assert(packets.completionBoundary?.allPacketsSourceBound === true, 'all Core5 evidence packets must remain source-bound');
assert(packets.completionBoundary?.exactHistoricalYearsLockedByPackets === false, 'evidence packets may not lock historical exact years');
assert(packets.completionBoundary?.futureFactsCreatedByPackets === false, 'evidence packets may not create future facts');
assert(packets.completionBoundary?.characterFamilyCanonCreatedByPackets === false, 'evidence packets may not create Character family Canon');
assert(packets.completionBoundary?.settingBoardsAuthored === false, 'evidence packet completion may not claim setting boards authored');
assert(packets.completionBoundary?.imageGenerationAuthorized === false, 'evidence packet completion may not authorize generation');
assert(packets.completionBoundary?.humanReviewRequired === true, 'evidence packet completion must require Human review');

console.log(JSON.stringify({
  status: 'PASS',
  packetId: packets.id,
  packetCount: packets.packets.length,
  historicalEraPackets: 3,
  present2026Packets: 1,
  futureTrajectoryPackets: 1,
  exactHistoricalYearsLocked: false,
  futureFactsCreated: false,
  imageGenerationAuthorized: false,
  humanReviewRequired: true,
}, null, 2));
