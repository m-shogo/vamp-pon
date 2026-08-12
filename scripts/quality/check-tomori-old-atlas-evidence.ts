import {
  TOMORI_OLD_ATLAS_EVIDENCE,
  TOMORI_OLD_ATLAS_RESEARCH_RULES,
  TOMORI_OLD_ATLAS_RESEARCH_SUMMARY,
} from '../../src/game/data/constellationTomoriAtlasEvidenceRegistry.ts';

const fail = (message: string): never => {
  throw new Error(`[tomori-old-atlas-evidence] ${message}`);
};

if (TOMORI_OLD_ATLAS_EVIDENCE.length !== TOMORI_OLD_ATLAS_RESEARCH_RULES.evidenceCountRequired) {
  fail(`expected ${TOMORI_OLD_ATLAS_RESEARCH_RULES.evidenceCountRequired} evidence rows, got ${TOMORI_OLD_ATLAS_EVIDENCE.length}`);
}
if (new Set(TOMORI_OLD_ATLAS_EVIDENCE.map((entry) => entry.id)).size !== TOMORI_OLD_ATLAS_EVIDENCE.length) {
  fail('duplicate evidence ids');
}

const verifiedResearch = TOMORI_OLD_ATLAS_EVIDENCE.filter((entry) => entry.status === 'VERIFIED_RESEARCH');
const bibliographicOpen = TOMORI_OLD_ATLAS_EVIDENCE.filter((entry) => entry.status === 'VERIFIED_BIBLIOGRAPHIC_CONTENT_OPEN');
if (verifiedResearch.length !== 2) fail(`expected 2 VERIFIED_RESEARCH rows, got ${verifiedResearch.length}`);
if (bibliographicOpen.length !== 2) fail(`expected 2 bibliographic/content-open rows, got ${bibliographicOpen.length}`);

for (const entry of TOMORI_OLD_ATLAS_EVIDENCE) {
  if (!entry.sourceUrl.startsWith('https://')) fail(`non-HTTPS source URL: ${entry.id}`);
  if (!entry.verifiedClaim || !entry.doesNotProve || !entry.storyUse || !entry.nextEvidenceNeeded) fail(`thin evidence row: ${entry.id}`);
}

if (TOMORI_OLD_ATLAS_RESEARCH_RULES.tomoriOwnershipMayBeInferred !== false) fail('Tomori ownership inference must remain false');
if (TOMORI_OLD_ATLAS_RESEARCH_RULES.exactArtifactProvenanceMayBeInferred !== false) fail('exact artifact provenance inference must remain false');
if (TOMORI_OLD_ATLAS_RESEARCH_RULES.quadransPresenceInJapanese1924ChartConfirmed !== false) fail('1924 Japanese chart Quadrans presence must remain unconfirmed');
if (TOMORI_OLD_ATLAS_RESEARCH_RULES.tomoriYuiOfficialConstellationListDifferenceAllowed !== false) fail('Tomori/Yui official constellation-list difference must remain forbidden');
if (TOMORI_OLD_ATLAS_RESEARCH_RULES.runtimeAutoPromotionAllowed !== false) fail('runtime auto-promotion must remain false');
if (TOMORI_OLD_ATLAS_RESEARCH_RULES.inheritedOldAtlasStoryHookStatus !== 'AUTHOR_CANDIDATE_REQUIRES_MORE_EVIDENCE') {
  fail('Tomori inherited-old-atlas hook must remain Candidate requiring more evidence');
}

const iau = TOMORI_OLD_ATLAS_EVIDENCE.find((entry) => entry.id === 'iau-modern-88-1922');
if (!iau || iau.sourceClass !== 'IAU_OFFICIAL') fail('IAU evidence missing');
if (!iau.storyUse.includes('Reject Tomori official constellation set != Yui official constellation set')) fail('IAU official-list rejection guard missing');

const nasa = TOMORI_OLD_ATLAS_EVIDENCE.find((entry) => entry.id === 'nasa-quadrans-quadrantids-name-fossil');
if (!nasa || nasa.sourceClass !== 'NASA_OFFICIAL') fail('NASA Quadrans/Quadrantids evidence missing');
for (const token of ['Character owned', 'Star Beast', 'fate']) {
  if (!nasa.doesNotProve.includes(token)) fail(`NASA ownership/assignment guard missing token: ${token}`);
}

const chart1924 = TOMORI_OLD_ATLAS_EVIDENCE.find((entry) => entry.id === 'ndl-seiza-no-zu-1924');
if (!chart1924 || chart1924.status !== 'VERIFIED_BIBLIOGRAPHIC_CONTENT_OPEN') fail('1924 Japanese chart must remain bibliographic/content-open');
if (!chart1924.doesNotProve.includes('does not prove Quadrans Muralis appears')) fail('1924 chart must explicitly keep Quadrans content unconfirmed');
if (!chart1924.nextEvidenceNeeded.includes('twelve plates')) fail('1924 chart must require inspection of all twelve plates');

const tenkai = TOMORI_OLD_ATLAS_EVIDENCE.find((entry) => entry.id === 'ndl-tenkai-periodical-from-1920');
if (!tenkai || tenkai.status !== 'VERIFIED_BIBLIOGRAPHIC_CONTENT_OPEN') fail('Tenkai evidence must remain bibliographic/content-open');
if (!tenkai.doesNotProve.includes('specific early issue discussed Quadrans Muralis')) fail('Tenkai must not claim uninspected issue content');

if (TOMORI_OLD_ATLAS_RESEARCH_SUMMARY.evidenceCount !== 4) fail('summary evidence count drift');
if (TOMORI_OLD_ATLAS_RESEARCH_SUMMARY.verifiedResearchCount !== 2) fail('summary verified research count drift');
if (TOMORI_OLD_ATLAS_RESEARCH_SUMMARY.bibliographicContentOpenCount !== 2) fail('summary bibliographic content-open count drift');
if (TOMORI_OLD_ATLAS_RESEARCH_SUMMARY.tomoriSpecificArtifactConfirmed !== false) fail('Tomori-specific artifact must remain unconfirmed');
if (TOMORI_OLD_ATLAS_RESEARCH_SUMMARY.quadransInJapaneseCandidateConfirmed !== false) fail('Quadrans in Japanese candidate must remain unconfirmed');
if (TOMORI_OLD_ATLAS_RESEARCH_SUMMARY.recommendedStoryState !== 'KEEP_TOMORI_INHERITED_OLD_ATLAS_AS_AUTHOR_CANDIDATE') {
  fail('recommended Story state must remain Candidate');
}

console.log('[tomori-old-atlas-evidence] OK 4 evidence rows / 2 verified / 2 bibliographic-open / no premature Canon');
