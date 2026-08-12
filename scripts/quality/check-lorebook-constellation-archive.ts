import fs from 'node:fs';
import {
  TOMORI_OLD_ATLAS_RESEARCH_RULES,
  TOMORI_OLD_ATLAS_RESEARCH_SUMMARY,
} from '../../src/game/data/constellationTomoriAtlasEvidenceRegistry.ts';

function assert(condition: unknown, message: string): asserts condition { if (!condition) throw new Error(message); }

const archive = JSON.parse(fs.readFileSync('public/lorebook/data/constellation-archive.v1.json', 'utf8'));
const html = fs.readFileSync('public/lorebook/index.html', 'utf8');
const js = fs.readFileSync('public/lorebook/constellation-archive-enhancement.js', 'utf8');
const css = fs.readFileSync('public/lorebook/constellation-archive.css', 'utf8');

assert(archive.status === 'AUTHOR_READ_MODEL_NON_CANON', 'archive may not become Story authority');
assert(archive.storyClues.length === 8, 'story clue count drift');
assert(archive.storyClues.filter((clue: { tier: string }) => clue.tier === 'S').length === 2, 'S clue count drift');
assert(archive.groupGlossary.some((entry: { term: string; status: string }) => entry.term === '朔夜座' && entry.status === 'CANON_CURRENT'), '朔夜座 Current glossary entry missing');
assert(archive.groupGlossary.some((entry: { term: string; status: string }) => entry.term === '群青残響録' && entry.status === 'CANON_CURRENT'), '群青残響録 Current glossary entry missing');
assert(archive.groupGlossary.some((entry: { term: string; status: string }) => entry.term === '外典星座' && entry.status === 'CANDIDATE'), '外典星座 must remain Candidate');
assert(archive.rules.includes('外典星座 is CANDIDATE and must not replace 朔夜座'), '朔夜座 replacement guard missing');
assert(archive.rules.includes('obsolete constellation != evil'), 'obsolete/evil guard missing');
assert(archive.rules.some((rule: string) => rule.includes('Tomori') && rule.includes('Present Yui')), 'Tomori/Yui false official-list guard missing');
assert(archive.entries.some((entry: { id: string }) => entry.id === 'quadrans-muralis'), 'Quadrans Muralis archive entry missing');
assert(archive.entries.some((entry: { id: string }) => entry.id === 'argo-navis'), 'Argo Navis archive entry missing');

for (const clue of archive.storyClues) {
  assert(clue.status === 'AUTHOR_CANDIDATE_NON_CANON', `clue unexpectedly promoted: ${clue.id}`);
  assert(clue.nextSource.length > 20, `clue nextSource too thin: ${clue.id}`);
}

const tomoriClue = archive.storyClues.find((clue: { id: string }) => clue.id === 'tomori-inherited-old-atlas');
assert(tomoriClue, 'Tomori inherited-old-atlas S clue missing');
assert(tomoriClue.researchSource === 'docs/research/tomori-old-atlas-evidence-v1.md', 'Tomori clue research source drift');
assert(tomoriClue.researchEvidence, 'Tomori clue research evidence state missing');
assert(tomoriClue.researchEvidence.evidenceCount === TOMORI_OLD_ATLAS_RESEARCH_SUMMARY.evidenceCount, 'Tomori clue evidence count drift');
assert(tomoriClue.researchEvidence.verifiedResearchCount === TOMORI_OLD_ATLAS_RESEARCH_SUMMARY.verifiedResearchCount, 'Tomori clue verified research count drift');
assert(tomoriClue.researchEvidence.bibliographicContentOpenCount === TOMORI_OLD_ATLAS_RESEARCH_SUMMARY.bibliographicContentOpenCount, 'Tomori clue bibliographic/content-open count drift');
assert(tomoriClue.researchEvidence.tomoriSpecificArtifactConfirmed === TOMORI_OLD_ATLAS_RESEARCH_SUMMARY.tomoriSpecificArtifactConfirmed, 'Tomori artifact confirmation drift');
assert(tomoriClue.researchEvidence.quadransInJapaneseCandidateConfirmed === TOMORI_OLD_ATLAS_RESEARCH_SUMMARY.quadransInJapaneseCandidateConfirmed, 'Tomori Japanese Quadrans confirmation drift');
assert(tomoriClue.researchEvidence.recommendedStoryState === TOMORI_OLD_ATLAS_RESEARCH_SUMMARY.recommendedStoryState, 'Tomori recommended Story state drift');
assert(tomoriClue.researchEvidence.evidenceCount === 4, 'Tomori evidence count must remain 4 until registry changes');
assert(tomoriClue.researchEvidence.verifiedResearchCount === 2, 'Tomori verified count must remain 2 until registry changes');
assert(tomoriClue.researchEvidence.bibliographicContentOpenCount === 2, 'Tomori content-open count must remain 2 until registry changes');
assert(tomoriClue.researchEvidence.tomoriSpecificArtifactConfirmed === false, 'Tomori-specific artifact may not appear confirmed');
assert(tomoriClue.researchEvidence.quadransInJapaneseCandidateConfirmed === false, 'Quadrans in Japanese candidate may not appear confirmed');
assert(TOMORI_OLD_ATLAS_RESEARCH_RULES.tomoriOwnershipMayBeInferred === false, 'Tomori ownership inference guard drift');
assert(TOMORI_OLD_ATLAS_RESEARCH_RULES.quadransPresenceInJapanese1924ChartConfirmed === false, '1924 Japanese chart content guard drift');
assert(TOMORI_OLD_ATLAS_RESEARCH_RULES.tomoriYuiOfficialConstellationListDifferenceAllowed === false, 'Tomori/Yui official-list guard drift');
assert(tomoriClue.nextSource.includes('Inspect the actual 1924 Japanese 星座の図 plates'), 'Tomori next Source must require actual plate inspection');
assert(tomoriClue.nextSource.includes('plausible household, mentor, secondhand, repair, or inheritance route'), 'Tomori next Source must require provenance route');

for (const token of ['id="constellations"','id="constellationArchive"','id="constellationStoryClues"','id="groupGlossary"','constellation-archive-enhancement.js','constellation-archive.css']) {
  assert(html.includes(token), `Lorebook integration missing: ${token}`);
}
for (const token of ['CONSTELLATION_ARCHIVE_URL', 'groupGlossary', 'nextSource', 'RESEARCH EVIDENCE / NOT CONFIDENCE SCORE', 'Exact artifact:', 'Quadrans in Japanese candidate:']) {
  assert(js.includes(token), `archive renderer contract missing: ${token}`);
}
for (const token of ['.clue-evidence-state', '.clue-evidence-state dl', '.clue-evidence-state code']) {
  assert(css.includes(token), `Tomori evidence CSS contract missing: ${token}`);
}

console.log(JSON.stringify({
  archiveStatus: archive.status,
  storyClues: archive.storyClues.length,
  constellationEntries: archive.entries.length,
  groupGlossary: archive.groupGlossary.length,
  tomoriAtlasEvidence: tomoriClue.researchEvidence,
  sakuyazaReplacementAllowed: false,
  obsoleteMeansEvil: false,
}, null, 2));
